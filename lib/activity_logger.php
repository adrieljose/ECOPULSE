<?php
/**
 * Helper to log user/admin activity to the unified activity_logs table.
 */
function logActivity($pdo, $userType, $userId, $action, $details = null, $module = null) {
    if (!$pdo) return;
    
    try {
        $ip = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
        // Handle ::1
        if ($ip === '::1') $ip = '127.0.0.1';

        $stmt = $pdo->prepare("
            INSERT INTO activity_logs (user_type, user_id, action, details, ip_address, module) 
            VALUES (:type, :uid, :act, :det, :ip, :mod)
        ");
        $stmt->execute([
            ':type' => $userType,
            ':uid' => $userId,
            ':act' => $action,
            ':det' => $details,
            ':ip' => $ip,
            ':mod' => $module
        ]);
    } catch (Throwable $e) {
        // Silent failure for logging to avoid blocking main flow
        error_log("Activity Log Error: " . $e->getMessage());
    }
}
