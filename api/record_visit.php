<?php
header('Content-Type: application/json');
require_once __DIR__ . '/../db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true) ?? $_POST;

$deviceCode = trim($input['device_code'] ?? '');
$deviceName = trim($input['device_name'] ?? '');
$lat = $input['lat'] ?? null;
$lng = $input['lng'] ?? null;
$accuracy = $input['accuracy_m'] ?? null;
$nearestId = $input['nearest_station_id'] ?? null;
$nearestName = trim($input['nearest_station_name'] ?? '');
$nearestAqi = $input['nearest_station_aqi'] ?? null;
$distance = $input['distance_m'] ?? null;

$errors = [];
if ($deviceCode === '') $errors[] = 'device_code';
if ($deviceName === '') $errors[] = 'device_name';
if (!is_numeric($lat)) $errors[] = 'lat';
if (!is_numeric($lng)) $errors[] = 'lng';

if ($errors) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing or invalid fields: ' . implode(', ', $errors)]);
    exit;
}

try {
    $pdo = db();
    $stmt = $pdo->prepare("
        INSERT INTO location_visits
        (device_code, device_name, lat, lng, accuracy_m, nearest_station_id, nearest_station_name, nearest_station_aqi, distance_m)
        VALUES
        (:code, :name, :lat, :lng, :accuracy, :nearest_id, :nearest_name, :nearest_aqi, :distance)
    ");
    $stmt->execute([
        ':code' => substr($deviceCode, 0, 50),
        ':name' => substr($deviceName, 0, 100),
        ':lat' => $lat,
        ':lng' => $lng,
        ':accuracy' => is_numeric($accuracy) ? (int)$accuracy : null,
        ':nearest_id' => is_numeric($nearestId) ? (int)$nearestId : null,
        ':nearest_name' => $nearestName !== '' ? substr($nearestName, 0, 150) : null,
        ':nearest_aqi' => is_numeric($nearestAqi) ? (int)$nearestAqi : null,
        ':distance' => is_numeric($distance) ? (int)$distance : null,
    ]);

    echo json_encode([
        'success' => true,
        'visit_id' => (int)$pdo->lastInsertId()
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
}
