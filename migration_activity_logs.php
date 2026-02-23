<?php
require_once __DIR__ . '/db.php';

try {
    $pdo = db();
    
    // Create activity_logs table
    $sql = "CREATE TABLE IF NOT EXISTS activity_logs (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        user_type ENUM('admin', 'user') NOT NULL,
        user_id INT UNSIGNED NOT NULL,
        action VARCHAR(255) NOT NULL,
        details TEXT NULL,
        ip_address VARCHAR(45) NULL,
        module VARCHAR(50) NULL,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_user (user_type, user_id),
        INDEX idx_created (created_at),
        INDEX idx_module (module)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4";

    $pdo->exec($sql);
    echo "Table 'activity_logs' created successfully.\n";

} catch (Throwable $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
