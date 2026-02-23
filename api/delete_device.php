<?php
header('Content-Type: application/json');
require_once __DIR__ . '/../session_bootstrap.php';
require_once __DIR__ . '/../db.php';

// Security: Only Admins can delete devices
if (!isset($_SESSION['admin'])) {
    http_response_code(403);
    echo json_encode(['success' => false, 'error' => 'Unauthorized: Admin access required']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true) ?? $_POST;
$id = (int)($input['device_id'] ?? 0);

if ($id <= 0) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Invalid Device ID']);
    exit;
}

try {
    $pdo = db();
    $pdo->beginTransaction();

    // Clean up dependent rows to avoid FK/duplicate code conflicts
    $pdo->prepare("DELETE FROM readings WHERE device_id = :id")->execute([':id' => $id]);
    $pdo->prepare("DELETE FROM location_visits WHERE nearest_station_id = :id")->execute([':id' => $id]);

    $stmt = $pdo->prepare("DELETE FROM devices WHERE id = :id LIMIT 1");
    $stmt->execute([':id' => $id]);
    $deleted = $stmt->rowCount();

    $pdo->commit();

    if ($deleted === 0) {
        echo json_encode(['success' => false, 'error' => 'Device not found or already deleted']);
    } else {
        echo json_encode(['success' => true, 'message' => 'Device deleted successfully']);
    }
} catch (Exception $e) {
    if ($pdo && $pdo->inTransaction()) {
        $pdo->rollBack();
    }
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Database error: ' . $e->getMessage()]);
}
?>
