<?php
require_once __DIR__ . '/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo "Only POST allowed";
    exit;
}

$raw = file_get_contents('php://input');
$data = json_decode((string)$raw, true);
if (!is_array($data)) {
    http_response_code(400);
    echo "JSON decode error: " . json_last_error_msg();
    exit;
}

$deviceId = isset($data['device_id']) ? (int)$data['device_id'] : 0;
if ($deviceId <= 0) {
    http_response_code(400);
    echo "device_id is required";
    exit;
}

$pm1 = isset($data['pm1']) ? (float)$data['pm1'] : 0.0;
$pm25 = isset($data['pm25']) ? (float)$data['pm25'] : 0.0;
$pm10 = isset($data['pm10']) ? (float)$data['pm10'] : 0.0;
$co2 = isset($data['co2']) ? (float)$data['co2'] : 0.0;
$co = isset($data['co']) ? (float)$data['co'] : 0.0;
$o3 = isset($data['o3']) ? (float)$data['o3'] : 0.0;
$temperature = isset($data['temperature']) ? (float)$data['temperature'] : (isset($data['temp']) ? (float)$data['temp'] : null);
$humidity = isset($data['humidity']) ? (float)$data['humidity'] : (isset($data['hum']) ? (float)$data['hum'] : null);
$aqi = (int)round($pm25);

$runtimeDir = sys_get_temp_dir() . '/ecopulse';
if (!is_dir($runtimeDir)) {
    @mkdir($runtimeDir, 0775, true);
}
@file_put_contents($runtimeDir . '/air_data.log', (string)$raw . PHP_EOL, FILE_APPEND);

try {
    $mysqli = db_mysqli();
} catch (Throwable $e) {
    error_log('[EcoPulse auto_ingest] DB connection failed: ' . $e->getMessage());
    http_response_code(503);
    echo "Database unavailable";
    exit;
}

$stmt = $mysqli->prepare(
    "INSERT INTO readings
     (device_id, recorded_at, pm1, pm25, pm10, o3, co, co2, temperature, humidity, aqi)
     VALUES (?, NOW(), ?, ?, ?, ?, ?, ?, ?, ?, ?)"
);
if (!$stmt) {
    http_response_code(500);
    echo "Prepare failed";
    exit;
}

$stmt->bind_param(
    "iddddddddi",
    $deviceId,
    $pm1,
    $pm25,
    $pm10,
    $o3,
    $co,
    $co2,
    $temperature,
    $humidity,
    $aqi
);

if (!$stmt->execute()) {
    http_response_code(500);
    echo "Execute failed";
    exit;
}

echo "OK";
