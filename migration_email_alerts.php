<?php
require_once __DIR__ . '/db.php';

$pdo = db();

try {
    // 1. Create email_subscriptions table
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS email_subscriptions (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            barangay_id INT UNSIGNED NOT NULL,
            created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY (barangay_id) REFERENCES barangays(id) ON DELETE CASCADE,
            UNIQUE KEY unique_subscription (user_id, barangay_id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    ");
    echo "Table 'email_subscriptions' created or already exists.\n";

    // 2. Add columns to alerts table if they don't exist
    // Helper function to check if column exists
    function columnExists($pdo, $table, $column) {
        $stmt = $pdo->prepare("SHOW COLUMNS FROM $table LIKE :column");
        $stmt->execute([':column' => $column]);
        return $stmt->fetch() !== false;
    }

    if (!columnExists($pdo, 'alerts', 'sent_email_at')) {
        $pdo->exec("ALTER TABLE alerts ADD COLUMN sent_email_at DATETIME NULL");
        echo "Column 'sent_email_at' added to 'alerts' table.\n";
    } else {
        echo "Column 'sent_email_at' already exists in 'alerts' table.\n";
    }

    if (!columnExists($pdo, 'alerts', 'email_attempts')) {
        $pdo->exec("ALTER TABLE alerts ADD COLUMN email_attempts TINYINT UNSIGNED NOT NULL DEFAULT 0");
        echo "Column 'email_attempts' added to 'alerts' table.\n";
    } else {
        echo "Column 'email_attempts' already exists in 'alerts' table.\n";
    }

} catch (PDOException $e) {
    die("Migration failed: " . $e->getMessage() . "\n");
}
?>
