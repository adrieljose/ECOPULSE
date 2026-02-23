<?php
header('Content-Type: application/json');
require_once __DIR__ . '/../session_bootstrap.php';
require_once __DIR__ . '/../db.php';

// CORS for dev
header("Access-Control-Allow-Origin: *"); 
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Credentials: true"); // Important for sessions if origin was specific

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
$username = trim($input['username'] ?? '');
$password = $input['password'] ?? '';

if (empty($username) || empty($password)) {
    echo json_encode(['success' => false, 'message' => 'Please fill in all fields.']);
    exit;
}

try {
    $pdo = db();

    // 1. Check Admins
    $stmt = $pdo->prepare("SELECT * FROM admins WHERE username = :username");
    $stmt->execute([':username' => $username]);
    $admin = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($admin && password_verify($password, $admin['password_hash'])) {
        session_regenerate_id(true);
        $_SESSION['admin'] = $admin['username'];
        $_SESSION['admin_id'] = $admin['id'];
        
        // Log login (optional, based on previous login.php)
        // log_admin_login($pdo, $username, 'Success', ...); 

        echo json_encode(['success' => true, 'role' => 'admin', 'redirect' => 'index.php']); // or admin_management.php
        exit;
    }

    // 2. Check Users
    $stmt = $pdo->prepare("SELECT * FROM users WHERE username = :username");
    $stmt->execute([':username' => $username]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user && password_verify($password, $user['password_hash'])) {
        session_regenerate_id(true);
        $_SESSION['user'] = $user['username'];
        $_SESSION['user_id'] = $user['id'];
        
        echo json_encode(['success' => true, 'role' => 'user', 'redirect' => 'index.php']);
        exit;
    }

    echo json_encode(['success' => false, 'message' => 'Invalid username or password.']);

} catch (Throwable $e) {
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}
