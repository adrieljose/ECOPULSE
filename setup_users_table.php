<?php
require_once __DIR__ . '/db.php';

try {
    $pdo = db();
    $sql = "CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )";
    $pdo->exec($sql);
    echo "Table 'users' created successfully.";
} catch (PDOException $e) {
    echo "Error creating table: " . $e->getMessage();
}
