<?php
/**
 * One-time master admin seeder.
 * Visit /api/seed_admin.php ONCE, then delete this file.
 */
require_once __DIR__ . '/../db.php';
header('Content-Type: text/plain');

try {
    $pdo  = db();
    $hash = password_hash('Master123!', PASSWORD_BCRYPT);

    // Ensure admins table exists (in case schema wasn't fully run)
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS admins (
            id            SERIAL PRIMARY KEY,
            username      VARCHAR(150) NOT NULL UNIQUE,
            email         VARCHAR(255) UNIQUE,
            password_hash VARCHAR(255) NOT NULL,
            status        VARCHAR(20)  NOT NULL DEFAULT 'active',
            created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
        )
    ");

    // Upsert masteradmin
    $stmt = $pdo->prepare("
        INSERT INTO admins (username, email, password_hash, status)
        VALUES ('masteradmin', 'masteradmin@admin.local', :hash, 'active')
        ON CONFLICT (username) DO UPDATE
            SET password_hash = EXCLUDED.password_hash,
                status        = 'active'
    ");
    $stmt->execute([':hash' => $hash]);

    // Verify
    $row = $pdo->query("SELECT id, username, status FROM admins WHERE username = 'masteradmin'")->fetch(PDO::FETCH_ASSOC);

    echo "✅ Master admin seeded successfully!\n\n";
    echo "Username : masteradmin\n";
    echo "Password : Master123!\n";
    echo "DB row   : " . json_encode($row) . "\n\n";
    echo "You can now log in at /login.php\n";
    echo "⚠️  Delete this file after logging in!\n";

} catch (Throwable $e) {
    http_response_code(500);
    echo "❌ Error: " . $e->getMessage() . "\n";
}
