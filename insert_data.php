<?php
require_once __DIR__ . '/db.php';

header('Content-Type: text/plain; charset=utf-8');

if (!isset($_POST['data']) || trim((string)$_POST['data']) === '') {
    http_response_code(400);
    echo "Missing sensor payload.";
    exit;
}

$sensorData = (string)$_POST['data'];
parse_str(str_replace(':', '&', $sensorData), $data);

$pm1 = isset($data['pm1']) ? (float)$data['pm1'] : 0.0;
$pm25 = isset($data['pm25']) ? (float)$data['pm25'] : 0.0;
$pm10 = isset($data['pm10']) ? (float)$data['pm10'] : 0.0;
$deviceId = isset($data['device_id']) ? (int)$data['device_id'] : 0;

if ($deviceId <= 0) {
    http_response_code(400);
    echo "device_id is required in payload.";
    exit;
}

try {
    $conn = db_mysqli();
} catch (Throwable $e) {
    error_log('[EcoPulse insert_data] DB connection failed: ' . $e->getMessage());
    http_response_code(503);
    echo "Database unavailable.";
    exit;
}

$stmt = $conn->prepare("INSERT INTO readings (device_id, pm1, pm25, pm10, recorded_at) VALUES (?, ?, ?, ?, NOW())");
if (!$stmt) {
    http_response_code(500);
    echo "Failed to prepare statement.";
    exit;
}

$stmt->bind_param('iddd', $deviceId, $pm1, $pm25, $pm10);

if (!$stmt->execute()) {
    http_response_code(500);
    echo "Failed to insert reading.";
    exit;
}

echo "New record created successfully";
