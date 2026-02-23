<?php
header('Content-Type: application/json');
require_once __DIR__ . '/../db.php';

// Allow raw JSON input or POST form data
$input = json_decode(file_get_contents('php://input'), true) ?? $_POST;

$name = trim($input['name'] ?? '');
$address = trim($input['address'] ?? '');
$lat = isset($input['lat']) ? floatval($input['lat']) : 10.11; // Default fallback if not provided
$lng = isset($input['lng']) ? floatval($input['lng']) : 122.88;
$deviceCode = strtoupper(trim($input['device_code'] ?? ''));

if ($name === '' || $address === '') {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Name and Address are required.']);
    exit;
}

try {
    $pdo = db();

    // 1. Resolve Barangay ID (Address)
    // Check if barangay exists, if not create it.
    $stmt = $pdo->prepare("SELECT id FROM barangays WHERE name = :name LIMIT 1");
    $stmt->execute([':name' => $address]);
    $row = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($row) {
        $barangayId = (int)$row['id'];
    } else {
        $stmt = $pdo->prepare("INSERT INTO barangays (name) VALUES (:name)");
        $stmt->execute([':name' => $address]);
        $barangayId = (int)$pdo->lastInsertId();
    }

    // 2. Generate a unique Device Code
    $maxAttempts = 20;
    $deviceCode = '';
    for ($i = 0; $i < $maxAttempts; $i++) {
        $candidate = 'DEV-' . str_pad((string)random_int(0, 9999), 4, '0', STR_PAD_LEFT);
        $stmt = $pdo->prepare("SELECT id FROM devices WHERE device_code = :code LIMIT 1");
        $stmt->execute([':code' => $candidate]);
        if (!$stmt->fetch(PDO::FETCH_ASSOC)) {
            $deviceCode = $candidate;
            break;
        }
    }
    if ($deviceCode === '') {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => 'Unable to generate a unique device code.']);
        exit;
    }

    // 3. Insert Device
    $stmt = $pdo->prepare("INSERT INTO devices (device_code, name, barangay_id, lat, lng, status, last_seen_at) VALUES (:code, :name, :bid, :lat, :lng, 'online', NOW())");
    $stmt->execute([
        ':code' => $deviceCode,
        ':name' => $name,
        ':bid' => $barangayId,
        ':lat' => $lat,
        ':lng' => $lng
    ]);

    $newId = $pdo->lastInsertId();

    echo json_encode(['success' => true, 'message' => 'Device added successfully', 'device_id' => $newId, 'device_code' => $deviceCode]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Database error: ' . $e->getMessage()]);
}
?>
