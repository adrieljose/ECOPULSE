<?php
// get_devices.php
header('Content-Type: application/json; charset=utf-8');

require __DIR__ . '/db.php'; // adjust path if your DB file is elsewhere

if ($mysqli->connect_errno) {
    http_response_code(500);
    echo json_encode(['error' => 'DB connection failed']);
    exit;
}

/*
 * For each device, get:
 *  - basic info from `devices`
 *  - barangay name
 *  - latest reading (AQI + pollutants)
 */

$sql = "
    SELECT
        d.id,
        d.device_code,
        d.name,
        d.status,
        d.lat,
        d.lng,
        b.name AS barangay,
        r.aqi,
        r.pm1,
        r.pm25,
        r.pm10,
        r.o3,
        r.co,
        r.co2,
        r.recorded_at
    FROM devices d
    LEFT JOIN barangays b ON b.id = d.barangay_id
    LEFT JOIN readings r ON r.id = (
        SELECT r2.id
        FROM readings r2
        WHERE r2.device_id = d.id
        ORDER BY r2.recorded_at DESC
        LIMIT 1
    )
    ORDER BY d.id ASC
";

$result = $mysqli->query($sql);

if (!$result) {
    http_response_code(500);
    echo json_encode(['error' => $mysqli->error]);
    exit;
}

$devices = [];
while ($row = $result->fetch_assoc()) {
    // Cast numeric values
    $row['id']  = (int)$row['id'];
    $row['aqi'] = isset($row['aqi']) ? (int)$row['aqi'] : null;

    foreach (['pm1','pm25','pm10','o3','co','co2','lat','lng'] as $k) {
        if (isset($row[$k]) && $row[$k] !== null) {
            $row[$k] = (float)$row[$k];
        }
    }

    $devices[] = $row;
}

echo json_encode(['devices' => $devices]);
