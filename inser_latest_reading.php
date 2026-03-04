<?php
require_once __DIR__ . '/db.php';

header('Content-Type: text/plain; charset=utf-8');

$runtimeDir = sys_get_temp_dir() . '/ecopulse';
$filename = $runtimeDir . '/air_data.log';
$deviceId = 0;

$lines = @file($filename, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
if (!$lines || count($lines) === 0) {
    http_response_code(404);
    echo "No runtime ingestion data found.";
    exit;
}

$lastLine = trim((string)end($lines));
$data = json_decode($lastLine, true);
if (!is_array($data)) {
    http_response_code(400);
    echo "JSON decode error: " . json_last_error_msg();
    exit;
}

$pm1 = isset($data['pm1']) ? (float)$data['pm1'] : 0.0;
$pm25 = isset($data['pm25']) ? (float)$data['pm25'] : 0.0;
$pm10 = isset($data['pm10']) ? (float)$data['pm10'] : 0.0;
$co2 = isset($data['co2']) ? (float)$data['co2'] : 0.0;
$co = isset($data['co']) ? (float)$data['co'] : (isset($data['mq7']) ? (float)$data['mq7'] : 0.0);
$o3 = isset($data['o3']) ? (float)$data['o3'] : (isset($data['mq131']) ? (float)$data['mq131'] : 0.0);
$aqi = (int)round($pm25);

try {
    $mysqli = db_mysqli();
} catch (Throwable $e) {
    error_log('[EcoPulse inser_latest_reading] DB connection failed: ' . $e->getMessage());
    http_response_code(503);
    echo "Database unavailable.";
    exit;
}

$stmt = $mysqli->prepare(
    "INSERT INTO readings
     (device_id, recorded_at, pm1, pm25, pm10, o3, co, co2, aqi)
     VALUES (?, NOW(), ?, ?, ?, ?, ?, ?, ?)"
);
if (!$stmt) {
    http_response_code(500);
    echo "Prepare failed.";
    exit;
}

$stmt->bind_param("iddddddi", $deviceId, $pm1, $pm25, $pm10, $o3, $co, $co2, $aqi);
if (!$stmt->execute()) {
    http_response_code(500);
    echo "Execute failed.";
    exit;
}

echo "OK - inserted latest runtime reading.";
