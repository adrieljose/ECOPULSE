<?php
header('Content-Type: application/json');
require_once __DIR__ . '/../db.php';

// Allow raw JSON input or POST form data
$input = json_decode(file_get_contents('php://input'), true) ?? $_POST;

$deviceCode = $input['device_code'] ?? null;
$lat = $input['lat'] ?? null;
$lng = $input['lng'] ?? null;
$deviceName = $input['device_name'] ?? 'DEVICE 1';
$apiKey = $input['api_key'] ?? null; // Optional security buffer

if (!$deviceCode || $lat === null || $lng === null) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing device_code, lat, or lng']);
    exit;
}

try {
    $pdo = db();
    
    // 1. Find the device
    $stmt = $pdo->prepare("SELECT id FROM devices WHERE device_code = :code LIMIT 1");
    $stmt->execute([':code' => $deviceCode]);
    $device = $stmt->fetch(PDO::FETCH_ASSOC);

    // If not found, do not auto-create. Caller must add the device explicitly.
    if (!$device) {
        http_response_code(404);
        echo json_encode(['error' => 'Device not found. Please add it first.']);
        exit;
    }

    // 2. Update the location
    $updateStmt = $pdo->prepare("UPDATE devices SET lat = :lat, lng = :lng, last_seen_at = NOW(), status = 'online' WHERE id = :id");
    $updateStmt->execute([
        ':lat' => $lat,
        ':lng' => $lng,
        ':id' => $device['id']
    ]);

    echo json_encode([
        'success' => true,
        'message' => 'Location updated',
        'device_id' => $device['id'],
        'new_lat' => $lat,
        'new_lng' => $lng
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
}
?>
