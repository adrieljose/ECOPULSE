<?php
session_start();
require_once __DIR__ . '/db.php';

// Log logout if it's a public user
if (isset($_SESSION['user'])) {
    try {
        $pdo = db();
        $stmt = $pdo->prepare("INSERT INTO user_login_history (user_id, username, action, ip_address) VALUES (:uid, :uname, 'logout', :ip)");
        $ip = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
        $stmt->execute([
            ':uid' => (int) $_SESSION['user'],
            ':uname' => $_SESSION['username'] ?? 'Unknown',
            ':ip' => $ip
        ]);
    } catch (Throwable $e) { /* ignore */ }
}

// Log Activity (New) - Handle both Admin and User if session exists
require_once __DIR__ . '/lib/activity_logger.php';
$pdo = db();
if (isset($_SESSION['admin'])) {
    logActivity($pdo, 'admin', (int)$_SESSION['admin'], 'Logout', 'Admin logged out', 'Auth');
} elseif (isset($_SESSION['user'])) {
    logActivity($pdo, 'user', (int)$_SESSION['user'], 'Logout', 'User logged out', 'Auth');
}

// Unset all session variables and destroy the session
session_unset();
session_destroy();

// Redirect to the login page
header('Location: login.php');
exit;