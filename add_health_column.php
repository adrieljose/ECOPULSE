<?php
require_once __DIR__ . '/db.php';

try {
    $pdo = db();
    echo "Checking database for health_condition column...\n";

    // 1. Update 'users' table
    $columns = $pdo->query("SHOW COLUMNS FROM users LIKE 'health_condition'")->fetchAll();
    if (empty($columns)) {
        echo "Adding 'health_condition' column to 'users' table...\n";
        $pdo->exec("ALTER TABLE users ADD COLUMN health_condition VARCHAR(50) DEFAULT 'None' AFTER password_hash");
        echo " - Column added to 'users'.\n";
    } else {
        echo " - Column 'health_condition' already exists in 'users'.\n";
    }

    // 2. Update 'admins' table (just in case admins also want health alerts)
    $columnsAdmin = $pdo->query("SHOW COLUMNS FROM admins LIKE 'health_condition'")->fetchAll();
    if (empty($columnsAdmin)) {
        echo "Adding 'health_condition' column to 'admins' table...\n";
        $pdo->exec("ALTER TABLE admins ADD COLUMN health_condition VARCHAR(50) DEFAULT 'None' AFTER password_hash");
        echo " - Column added to 'admins'.\n";
    } else {
        echo " - Column 'health_condition' already exists in 'admins'.\n";
    }

    echo "Database update completed successfully.\n";

} catch (PDOException $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
