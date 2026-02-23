<?php
require_once __DIR__ . '/../session_bootstrap.php';
require_once __DIR__ . '/../db.php';
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method Not Allowed']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
$action = $input['action'] ?? null;
$deviceId = $input['device_id'] ?? null;

if (!$deviceId) {
    http_response_code(400);
    echo json_encode(['error' => 'Device ID required']);
    exit;
}

$pdo = db();

// === TOGGLE ACTION ===
if ($action === 'toggle') {
    // Get current status
    $stmt = $pdo->prepare("SELECT is_active FROM devices WHERE id = ?");
    $stmt->execute([$deviceId]);
    $current = $stmt->fetchColumn();

    if ($current === false) {
        http_response_code(404);
        echo json_encode(['error' => 'Device not found']);
        exit;
    }

    // Toggle
    $newState = ($current == 1) ? 0 : 1;
    $update = $pdo->prepare("UPDATE devices SET is_active = ? WHERE id = ?");
    $update->execute([$newState, $deviceId]);

    // Log Activity
    require_once __DIR__ . '/../lib/activity_logger.php';
    if (session_status() === PHP_SESSION_NONE) session_start();
    
    $actorType = isset($_SESSION['admin']) ? 'admin' : (isset($_SESSION['user']) ? 'user' : null);
    $actorId = $_SESSION['admin'] ?? ($_SESSION['user'] ?? null);
    
    if ($actorId) {
        $actionName = $newState ? 'Start Device' : 'Stop Device';
        $details = "Device ID #$deviceId toggled to " . ($newState ? 'Active' : 'Inactive');
        logActivity($pdo, $actorType, (int)$actorId, $actionName, $details, 'Devices');
    }

    echo json_encode([
        'success' => true,
        'new_state' => $newState,
        'message' => $newState ? 'Device Started' : 'Device Stopped'
    ]);
    exit;
}

// === RENAME ACTION ===
if ($action === 'rename') {
    $newName = trim($input['new_name'] ?? '');
    
    if (empty($newName)) {
        http_response_code(400);
        echo json_encode(['error' => 'Device name cannot be empty']);
        exit;
    }
    
    if (strlen($newName) > 100) {
        http_response_code(400);
        echo json_encode(['error' => 'Device name too long (max 100 characters)']);
        exit;
    }
    
    // Check device exists
    $stmt = $pdo->prepare("SELECT name FROM devices WHERE id = ?");
    $stmt->execute([$deviceId]);
    $oldName = $stmt->fetchColumn();
    
    if ($oldName === false) {
        http_response_code(404);
        echo json_encode(['error' => 'Device not found']);
        exit;
    }
    
    // Update name
    $update = $pdo->prepare("UPDATE devices SET name = ? WHERE id = ?");
    $update->execute([$newName, $deviceId]);
    
    // Log Activity
    require_once __DIR__ . '/../lib/activity_logger.php';
    if (session_status() === PHP_SESSION_NONE) session_start();
    
    $actorType = isset($_SESSION['admin']) ? 'admin' : (isset($_SESSION['user']) ? 'user' : null);
    $actorId = $_SESSION['admin'] ?? ($_SESSION['user'] ?? null);
    
    if ($actorId) {
        $details = "Device ID #$deviceId renamed from '$oldName' to '$newName'";
        logActivity($pdo, $actorType, (int)$actorId, 'Rename Device', $details, 'Devices');
    }
    
    echo json_encode([
        'success' => true,
        'new_name' => $newName,
        'message' => 'Device renamed successfully'
    ]);
    exit;
}

echo json_encode(['error' => 'Invalid action']);
