<?php
require_once 'db.php';
try {
    $pdo = db();
    echo "Checking for user 'Jay'...\n";
    
    // Check admins
    $stmt = $pdo->prepare("SELECT id, username, contact_number, 'admin' as type FROM admins WHERE username = 'Jay'");
    $stmt->execute();
    $admin = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($admin) {
        print_r($admin);
    } else {
        echo "Not found in admins.\n";
    }

    // Check users
    $stmt = $pdo->prepare("SELECT id, username, contact_number, 'user' as type FROM users WHERE username = 'Jay'");
    $stmt->execute();
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($user) {
        print_r($user);
    } else {
        echo "Not found in users.\n";
    }

} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}
