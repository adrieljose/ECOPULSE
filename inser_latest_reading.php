<?php
// --------------- SETTINGS -----------------
// Log file: C:\xampp\htdocs\air_data.log
// This file: C:\xampp\htdocs\ecopulse\  → go one folder up (..)
$filename = __DIR__ . '/../air_data.log';

// ID of your ONLY device from the `devices` table
$deviceId = 0;   // <-- your screenshot shows id = 0, so we use 0
// ------------------------------------------

// Read all non-empty lines from the file
$lines = @file($filename, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
if (!$lines || count($lines) === 0) {
    die("No data in log file");
}

// Take the last line (latest reading)
$lastLine = trim(end($lines));

// Decode JSON: {"pm1":0,"pm25":4,"pm10":4,"co2":816,"mq7":42,"mq131":100}
$data = json_decode($lastLine, true);
if ($data === null) {
    die("JSON decode error: " . json_last_error_msg());
}

// Map JSON to variables
$pm1   = isset($data['pm1'])   ? (float)$data['pm1']   : 0;
$pm25  = isset($data['pm25'])  ? (float)$data['pm25']  : 0;
$pm10  = isset($data['pm10'])  ? (float)$data['pm10']  : 0;
$co2   = isset($data['co2'])   ? (float)$data['co2']   : 0;
$co    = isset($data['mq7'])   ? (float)$data['mq7']   : 0;     // MQ-7 → CO
$o3    = isset($data['mq131']) ? (float)$data['mq131'] : 0;     // MQ-131 → O3

// Simple AQI = PM2.5 (for demo)
$aqi   = (int) round($pm25);

// Connect to MariaDB (XAMPP default)
$mysqli = new mysqli('localhost', 'root', '', 'ecopulse');
if ($mysqli->connect_errno) {
    die("DB connection failed: " . $mysqli->connect_error);
}

// Prepare insert for `readings` table
$stmt = $mysqli->prepare(
    "INSERT INTO readings
     (device_id, recorded_at, pm1, pm25, pm10, o3, co, co2, aqi)
     VALUES (?, NOW(), ?, ?, ?, ?, ?, ?, ?)"
);
if (!$stmt) {
    die("Prepare failed: " . $mysqli->error);
}

// i = int, d = double
$stmt->bind_param(
    "iddddddi",
    $deviceId,
    $pm1,
    $pm25,
    $pm10,
    $o3,
    $co,
    $co2,
    $aqi
);

if (!$stmt->execute()) {
    die("Execute failed: " . $stmt->error);
}

echo "OK - inserted: " . htmlspecialchars($lastLine);
