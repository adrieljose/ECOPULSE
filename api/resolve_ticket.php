<?php
require_once __DIR__ . '/../session_bootstrap.php';
require_once __DIR__ . '/../db.php';

// Only Master Admin can resolve hardware tickets
$currentUserLabel = $_SESSION['username'] ?? '';
$isAdmin = isset($_SESSION['admin']);

if ($isAdmin && $currentUserLabel === '') {
    try {
        $pdoAuth = db();
        $adminIdRaw = $_SESSION['admin_id'] ?? $_SESSION['admin'];
        $stmtAuth = $pdoAuth->prepare('SELECT username FROM admins WHERE id = :id LIMIT 1');
        $stmtAuth->execute([':id' => (int)$adminIdRaw]);
        $rowAuth = $stmtAuth->fetch(PDO::FETCH_ASSOC);
        if ($rowAuth && !empty($rowAuth['username'])) {
            $currentUserLabel = $rowAuth['username'];
        }
    } catch (Throwable $e) {}
}

$isMasterAdmin = $isAdmin && (strtolower($currentUserLabel) === 'masteradmin');

if (!$isMasterAdmin) {
    header('Location: ../admin_management.php');
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['ticket_id'])) {
    $ticketId = (int)$_POST['ticket_id'];
    
    try {
        $pdo = db();
        
        // 1. Mark ticket as resolved
        $stmt = $pdo->prepare("UPDATE maintenance_tickets SET status = 'Resolved', resolved_at = CURRENT_TIMESTAMP WHERE id = ?");
        $stmt->execute([$ticketId]);
        
        // 2. Log Action
        require_once __DIR__ . '/../lib/activity_logger.php';
        logActivity($pdo, 'admin', $_SESSION['admin'], 'Resolve Ticket', "Resolved hardware ticket #T-" . str_pad($ticketId, 4, '0', STR_PAD_LEFT), 'Diagnostics');
        
    } catch (Throwable $e) {
        // Log error silently
        error_log("Failed to resolve ticket: " . $e->getMessage());
    }
}

header('Location: ../admin_management.php');
exit;
