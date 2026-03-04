<?php
require_once __DIR__ . '/../db.php';
header('Content-Type: application/json');

$pdo = db();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $raw = json_decode(file_get_contents('php://input'), true);
    
    if (isset($raw['recording_active'])) {
        $val = $raw['recording_active'] ? '1' : '0';
        $stmt = $pdo->prepare("INSERT INTO system_settings (setting_key, setting_value) VALUES ('recording_active', :val) ON DUPLICATE KEY UPDATE setting_value = :val");
        $stmt->execute([':val' => $val]);
    }

    echo json_encode(['success' => true]);
    exit;
}

// GET: Return current status
$stmt = $pdo->query("SELECT setting_value FROM system_settings WHERE setting_key = 'recording_active'");
$isActive = ($stmt->fetchColumn() === '1');

echo json_encode([
    'recording_active' => $isActive
]);
