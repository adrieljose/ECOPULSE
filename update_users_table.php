<?php
require_once __DIR__ . '/db.php';

try {
    $pdo = db();
    
    // Add new columns if they don't exist
    $columns = [
        'birthday DATE DEFAULT NULL',
        'age INT DEFAULT NULL',
        'contact_number VARCHAR(20) DEFAULT NULL',
        'province VARCHAR(100) DEFAULT NULL',
        'city VARCHAR(100) DEFAULT NULL',
        'street VARCHAR(255) DEFAULT NULL',
        'zip_code VARCHAR(10) DEFAULT NULL'
    ];

    foreach ($columns as $col) {
        try {
            $pdo->exec("ALTER TABLE users ADD COLUMN $col");
            echo "Added column: $col <br>";
        } catch (PDOException $e) {
            // Column likely exists, ignore
        }
    }
    echo "Table schema updated successfully.";

} catch (PDOException $e) {
    echo "Error updating table: " . $e->getMessage();
}
