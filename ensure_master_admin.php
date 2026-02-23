<?php
/**
 * One-time helper to ensure a dedicated master_admins table exists
 * and the masteradmin account is present (and active) in both
 * master_admins and admins tables.
 *
 * Usage (from project root):
 *   php ensure_master_admin.php
 *
 * Default password set here: Master123!
 * Change the value of $plainPassword below before running if you want a different password.
 */

require_once __DIR__ . '/db.php';

$plainPassword = 'Master123!'; // change if desired before running

try {
    $pdo = db();

    // Create master_admins table if missing
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS master_admins (
            id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(150) NOT NULL UNIQUE,
            password_hash VARCHAR(255) NOT NULL,
            created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    ");

    $hash = password_hash($plainPassword, PASSWORD_BCRYPT);

    // Upsert into master_admins
    $stmt = $pdo->prepare("
        INSERT INTO master_admins (username, password_hash)
        VALUES (:u, :h)
        ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash)
    ");
    $stmt->execute([':u' => 'masteradmin', ':h' => $hash]);

    // Ensure masteradmin exists in admins table as active
    // Add email column if missing
    try { $pdo->exec("ALTER TABLE admins ADD COLUMN email VARCHAR(255) NULL UNIQUE"); } catch (Throwable $e) { /* ignore */ }
    try { $pdo->exec("ALTER TABLE admins ADD COLUMN status ENUM('active','inactive') NOT NULL DEFAULT 'active'"); } catch (Throwable $e) { /* ignore */ }

    $stmt = $pdo->prepare("
        INSERT INTO admins (username, email, password_hash, status)
        VALUES (:u, :email, :h, 'active')
        ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash), status = 'active', email = COALESCE(admins.email, VALUES(email))
    ");
    $stmt->execute([
        ':u' => 'masteradmin',
        ':email' => 'masteradmin@admin.local',
        ':h' => $hash,
    ]);

    echo 'Master admin ensured. Username: masteradmin, Password: ' . $plainPassword . PHP_EOL;
} catch (Throwable $e) {
    fwrite(STDERR, 'Error: ' . $e->getMessage() . PHP_EOL);
    exit(1);
}
