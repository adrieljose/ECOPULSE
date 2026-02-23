<?php
header('Content-Type: application/json');

// Connect to DB (same style as ingest_esp.php)
require_once __DIR__ . '/../db.php';  // adjust if your db file is in a different path

// For now we only have device 0
$deviceId = isset($_GET['device_id']) ? (int)$_GET['device_id'] : 0;

// Get last 24 hours of AQI for this device
$sql = "
    SELECT recorded_at, aqi
    FROM readings
    WHERE device_id = ?
      AND recorded_at >= (NOW() - INTERVAL 24 HOUR)
    ORDER BY recorded_at ASC
";

$stmt = $mysqli->prepare($sql);
if (!$stmt) {
    echo json_encode(['error' => 'Prepare failed: ' . $mysqli->error]);
    exit;
}

$stmt->bind_param('i', $deviceId);
$stmt->execute();
$result = $stmt->get_result();

$labels = [];
$values = [];

while ($row = $result->fetch_assoc()) {
    // Label = time only, like "17:05"
    $labels[] = date('H:i', strtotime($row['recorded_at']));
    $values[] = (int)$row['aqi'];
}

echo json_encode([
    'labels' => $labels,
    'values' => $values,
]);
