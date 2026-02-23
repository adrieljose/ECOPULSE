<?php
require_once __DIR__ . '/db.php';

try {
    $pdo = db();
    
    // Create user_login_history table
    $sql = "CREATE TABLE IF NOT EXISTS user_login_history (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        user_id INT(11) NOT NULL,
        username VARCHAR(100) NOT NULL,
        action VARCHAR(50) NOT NULL,
        ip_address VARCHAR(45) NULL,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_user (user_id),
        INDEX idx_created (created_at),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4";

    $pdo->exec($sql);
    echo "Table 'user_login_history' created successfully.\n";

} catch (Throwable $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
