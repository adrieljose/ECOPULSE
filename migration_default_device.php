<?php
require_once __DIR__ . '/db.php';

$pdo = db();

echo "Adding default_device_id column...\n";

// Add to users
try {
    $pdo->exec("ALTER TABLE users ADD COLUMN default_device_id INT UNSIGNED NULL DEFAULT NULL");
    $pdo->exec("ALTER TABLE users ADD CONSTRAINT fk_users_default_device FOREIGN KEY (default_device_id) REFERENCES devices(id) ON DELETE SET NULL");
    echo "Added to users table.\n";
} catch (PDOException $e) {
    if (strpos($e->getMessage(), 'Duplicate column name') !== false) {
        echo "Column default_device_id already exists in users table.\n";
    } else {
        echo "Error adding to users: " . $e->getMessage() . "\n";
    }
}

// Add to admins
try {
    $pdo->exec("ALTER TABLE admins ADD COLUMN default_device_id INT UNSIGNED NULL DEFAULT NULL");
    $pdo->exec("ALTER TABLE admins ADD CONSTRAINT fk_admins_default_device FOREIGN KEY (default_device_id) REFERENCES devices(id) ON DELETE SET NULL");
    echo "Added to admins table.\n";
} catch (PDOException $e) {
    if (strpos($e->getMessage(), 'Duplicate column name') !== false) {
        echo "Column default_device_id already exists in admins table.\n";
    } else {
        echo "Error adding to admins: " . $e->getMessage() . "\n";
    }
}

echo "Migration complete.\n";
