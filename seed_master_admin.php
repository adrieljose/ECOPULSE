<?php
/**
 * Seed master admin account if it does not exist.
 * Credentials: username "admin", password "admin123".
 */
require_once __DIR__ . '/db.php';

try {
    $pdo = db();
    $stmt = $pdo->prepare('SELECT COUNT(*) FROM admins WHERE username = :u');
    $stmt->execute([':u' => 'admin']);
    $exists = (int) $stmt->fetchColumn() > 0;

    if ($exists) {
        echo "Admin user 'admin' already exists.\n";
        exit(0);
    }

    $hash = password_hash('admin123', PASSWORD_BCRYPT);
    $insert = $pdo->prepare('INSERT INTO admins (username, password_hash) VALUES (:u, :p)');
    $insert->execute([':u' => 'admin', ':p' => $hash]);

    echo "Seeded master admin 'admin' with password 'admin123'.\n";
    exit(0);
} catch (Throwable $e) {
    echo "Failed to seed admin: " . $e->getMessage() . "\n";
    exit(1);
}
