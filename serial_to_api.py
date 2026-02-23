import serial
import time
import json
import requests
from urllib.parse import urlparse

# ---- SETTINGS ----
COM_PORT = 'COM5'          # your Arduino port (from Arduino IDE)
BAUDRATE = 9600            # must match Serial.begin(9600);
# Set API endpoint (local or ngrok). The device code will auto-detect from the latest device.
API_URL = 'http://localhost/ecopulse/api/ingest_esp.php'
# Optional explicit get_devices URL (leave blank to derive from API_URL)
GET_DEVICES_URL = ''
DEVICE_CODE = ""  # leave blank to auto-pick latest device
DEVICE_ID = 0     # leave 0; will auto-pick latest device
# Lightweight correction coefficients (adjust as you refine calibrations)
# corrected = a * raw + b
CORRECTIONS = {
    "pm1":  {"a": 0.7, "b": 1.0},
    "pm25": {"a": 0.7, "b": 2.0},
    "pm10": {"a": 0.7, "b": 0.0},
    # MQ-7 derived CO (ppm). Softer scale and lower cap to avoid pegging AQI.
    "co":   {"a": 0.02, "b": 0.0, "max": 8.0},
    # MQ-131 derived O3 (assumed ppb). Scale down and cap.
    "o3":   {"a": 0.01, "b": 0.0, "max": 300.0},
    "co2":  {"a": 1.0, "b": 0.0},   # MH-Z19B; zero in fresh air instead of changing slope
}

RECHECK_SECONDS = 5      
NO_DEVICE_SLEEP = 2       


def resolve_latest_device(api_url: str):
    """
    Fetch the latest device from get_devices.php (one level above /api/) and return (device_code, device_id).
    Chooses the device with the highest id that has a device_code.
    """
    if GET_DEVICES_URL:
        candidates = [GET_DEVICES_URL]
    else:
        parsed = urlparse(api_url)
        path_parts = parsed.path.split('/')
        try:
            api_index = path_parts.index('api')
            root_parts = path_parts[:api_index]  # everything before 'api'
        except ValueError:
            root_parts = path_parts[:-1]
        root_path = '/'.join(p for p in root_parts if p)
        root_url = f"{parsed.scheme}://{parsed.netloc}/{root_path}/".rstrip('/') + '/'
        candidates = [root_url + "get_devices.php"]
        # Fallback to localhost if derived URL fails
        candidates.append("http://localhost/ecopulse/get_devices.php")

    try:
        last_err = None
        for url in candidates:
            try:
                resp = requests.get(url, timeout=5)
                resp.raise_for_status()
                data = resp.json()
                sensors = data.get("sensors", [])
                if not sensors:
                    last_err = "No devices found from get_devices.php; cannot auto-pick device."
                    continue

                sensors_with_ids = [s for s in sensors if s.get("id") is not None and s.get("code")]
                if not sensors_with_ids:
                    last_err = "Devices found but none have a device_code; cannot auto-pick."
                    continue

                # Prefer the most recent ACTIVE device; fallback to newest overall
                active = [s for s in sensors_with_ids if int(s.get("isActive", 1)) == 1]
                target_list = active if active else sensors_with_ids
                latest = max(target_list, key=lambda s: s["id"])
                return latest.get("code"), latest.get("id")
            except Exception as e:
                last_err = str(e)
                continue
        if last_err:
            print(last_err)
        return None, None
    except Exception as e:
        print(f"Failed to auto-resolve latest device: {e}")
        return None, None


def main():
    print(f"Opening serial port {COM_PORT} at {BAUDRATE} baud...")
    ser = serial.Serial(COM_PORT, BAUDRATE, timeout=2)

    # Small delay so Arduino can reset and start sending
    time.sleep(2)
    print("Started. Reading JSON lines from Arduino and sending to API...")

    # Auto-resolve device_code/device_id if not provided
    device_code = DEVICE_CODE.strip()
    device_id = DEVICE_ID
    last_resolve = 0

    def ensure_device(force=False):
        nonlocal device_code, device_id, last_resolve
        now = time.time()
        if device_code or device_id:
            if not force and (now - last_resolve) < RECHECK_SECONDS:
                return
        code, did = resolve_latest_device(API_URL)
        last_resolve = now
        if code:
            device_code = code
            device_id = did or 0
            print(f"Auto-selected latest device: code={device_code}, id={device_id}")
        else:
            print("No devices found yet. Create one in the app.")

    ensure_device(force=True)
    last_recheck = time.time()

    while True:
        try:
            # periodic device re-check
            if (time.time() - last_recheck) > RECHECK_SECONDS:
                ensure_device()
                last_recheck = time.time()
            # If still no device, wait and retry without exiting
            if not device_code and device_id == 0:
                print(f"No device available; waiting {NO_DEVICE_SLEEP}s for a new device...")
                time.sleep(NO_DEVICE_SLEEP)
                continue
            # Read one line from Arduino
            line = ser.readline().decode('utf-8', errors='ignore').strip()
            if not line:
                # no data this cycle
                continue

            print(f"Serial line: {line}")

            # Expecting something like:
            # {"pm1":18,"pm25":27,"pm10":30,"co2":862,"mq7":50,"mq131":123}
            try:
                data = json.loads(line)
            except json.JSONDecodeError as e:
                print(f"JSON decode error: {e}")
                continue

            # Build payload for API (raw readings)
            payload = {
                "pm1":  float(data.get("pm1", 0)),
                "pm25": float(data.get("pm25", 0)),
                "pm10": float(data.get("pm10", 0)),
                "co2":  float(data.get("co2", 0)),
                "co":   float(data.get("mq7", 0)),     # mq7 -> co
                "o3":   float(data.get("mq131", 0)),   # mq131 -> o3
            }

            # Apply simple calibration/correction coefficients
            for key, coeff in CORRECTIONS.items():
                if key in payload and payload[key] is not None:
                    a = coeff.get("a", 1.0)
                    b = coeff.get("b", 0.0)
                    corrected = a * payload[key] + b
                    # Clamp to optional min/max bounds
                    if "min" in coeff:
                        corrected = max(coeff["min"], corrected)
                    if "max" in coeff:
                        corrected = min(coeff["max"], corrected)
                    # Avoid negatives from corrections
                    payload[key] = max(0, round(corrected, 2))
            if device_code:
                payload["device_code"] = device_code
            elif device_id > 0:
                payload["device_id"] = device_id
            else:
                print("No device_code or device_id set; cannot send. Exiting.")
                time.sleep(1)
                break
            # Optional: temperature/humidity from DHT/etc.
            if "temperature" in data and data["temperature"] is not None:
                payload["temperature"] = float(data["temperature"])
            elif "temp" in data and data["temp"] is not None:
                payload["temperature"] = float(data["temp"])
            elif "temp_c" in data and data["temp_c"] is not None:
                payload["temperature"] = float(data["temp_c"])

            if "humidity" in data and data["humidity"] is not None:
                payload["humidity"] = float(data["humidity"])
            elif "hum" in data and data["hum"] is not None:
                payload["humidity"] = float(data["hum"])

            # Optional: GPS coordinates (from NEO-6M via TinyGPS++)
            lat = data.get("lat") if "lat" in data else data.get("latitude")
            lng = data.get("lng") if "lng" in data else data.get("longitude")
            if lat is not None and lng is not None:
                try:
                    payload["lat"] = float(lat)
                    payload["lng"] = float(lng)
                except (TypeError, ValueError):
                    print("Skipped invalid lat/lng values")

            print(f"Sending to API: {payload}")

            try:
                resp = requests.post(API_URL, json=payload, timeout=5)
                print(f"API response: {resp.status_code} {resp.text}")
                if resp.status_code == 404 and 'Device not found' in resp.text:
                    print("Device not found on server. Re-resolving latest device...")
                    device_code = ""
                    device_id = 0
                    ensure_device(force=True)
            except requests.RequestException as e:
                print(f"Error sending to API: {e}")

            # send about once per second
            time.sleep(1)

        except KeyboardInterrupt:
            print("Stopping script...")
            break
        except Exception as e:
            print(f"Unexpected error: {e}")
            time.sleep(1)

    ser.close()

if __name__ == '__main__':
    main()
