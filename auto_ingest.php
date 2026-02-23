<?php
// api/ingest_esp.php

// Allow only POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo "Only POST allowed";
    exit;
}

// Read raw JSON body
$raw = file_get_contents('php://input');
$data = json_decode($raw, true);

if ($data === null) {
    http_response_code(400);
    echo "JSON decode error: " . json_last_error_msg();
    exit;
}

// Device ID (from JSON or default 0)
$deviceId = isset($data['device_id']) ? (int)$data['device_id'] : 0;

// Extract sensor values
$pm1   = isset($data['pm1'])   ? (float)$data['pm1']   : 0;
$pm25  = isset($data['pm25'])  ? (float)$data['pm25']  : 0;
$pm10  = isset($data['pm10'])  ? (float)$data['pm10']  : 0;
$co2   = isset($data['co2'])   ? (float)$data['co2']   : 0;
$co    = isset($data['co'])    ? (float)$data['co']    : 0;
$o3    = isset($data['o3'])    ? (float)$data['o3']    : 0;
$temperature = isset($data['temperature']) ? (float)$data['temperature'] : (isset($data['temp']) ? (float)$data['temp'] : null);
$humidity    = isset($data['humidity'])    ? (float)$data['humidity']    : (isset($data['hum'])  ? (float)$data['hum']  : null);

// Simple AQI from PM2.5
$aqi   = (int) round($pm25);

// OPTIONAL: append to log file so you still have air_data.log
$logFilename = __DIR__ . '/../air_data.log';
file_put_contents($logFilename, $raw . PHP_EOL, FILE_APPEND);

// Connect to DB
$mysqli = new mysqli('localhost', 'root', '', 'ecopulse');
if ($mysqli->connect_errno) {
    http_response_code(500);
    echo "DB connection failed: " . $mysqli->connect_error;
    exit;
}

// Insert into readings
$stmt = $mysqli->prepare(
    "INSERT INTO readings
     (device_id, recorded_at, pm1, pm25, pm10, o3, co, co2, temperature, humidity, aqi)
     VALUES (?, NOW(), ?, ?, ?, ?, ?, ?, ?, ?, ?)"
);
if (!$stmt) {
    http_response_code(500);
    echo "Prepare failed: " . $mysqli->error;
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
    echo "Execute failed: " . $stmt->error;
    exit;
}

echo "OK";
