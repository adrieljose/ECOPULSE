<?php
// api/heartbeat.php
// Marks a device as online and updates last_heartbeat. Requires device to already exist.

header('Content-Type: application/json');
require_once __DIR__ . '/../db.php';

$pdo = db();

// Resolve input
$input = json_decode(file_get_contents('php://input'), true);
$deviceCode = $input['device_code'] ?? $_POST['device_code'] ?? null;
$deviceId   = isset($input['device_id']) ? (int)$input['device_id'] : (isset($_POST['device_id']) ? (int)$_POST['device_id'] : 0);

if (!$deviceCode && $deviceId === 0) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'device_code or device_id required']);
    exit;
}

// Ensure columns exist (best-effort)
try { $pdo->exec("ALTER TABLE devices ADD COLUMN last_heartbeat DATETIME NULL"); } catch (Throwable $e) { /* ignore */ }

$resolvedId = 0;

// Lookup by id
if ($deviceId > 0) {
    $stmt = $pdo->prepare("SELECT id, device_code FROM devices WHERE id = :id LIMIT 1");
    if ($stmt->execute([':id' => $deviceId])) {
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        if ($row) {
            $resolvedId = (int)$row['id'];
            if (!$deviceCode && !empty($row['device_code'])) {
                $deviceCode = $row['device_code'];
            }
        }
    }
}

// Lookup by code
if ($resolvedId === 0 && $deviceCode) {
    $stmt = $pdo->prepare("SELECT id FROM devices WHERE device_code = :code LIMIT 1");
    if ($stmt->execute([':code' => $deviceCode])) {
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        if ($row) {
            $resolvedId = (int)$row['id'];
        }
    }
}

if ($resolvedId === 0) {
    http_response_code(404);
    echo json_encode(['success' => false, 'error' => 'Device not found. Please add it first.']);
    exit;
}

// Update heartbeat
$stmt = $pdo->prepare("UPDATE devices SET last_heartbeat = NOW(), status = 'online' WHERE id = :id");
$stmt->execute([':id' => $resolvedId]);

echo json_encode(['success' => true, 'device_id' => $resolvedId, 'device_code' => $deviceCode]);
