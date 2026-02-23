<?php
require_once __DIR__ . '/db.php';

try {
    $pdo = db();
    echo "Checking 'users' table for 'suffix' column...\n";

    // Check if column exists
    $stmt = $pdo->query("SHOW COLUMNS FROM users LIKE 'suffix'");
    $exists = $stmt->fetch();

    if (!$exists) {
        echo "Adding 'suffix' column...\n";
        $pdo->exec("ALTER TABLE users ADD COLUMN suffix VARCHAR(10) DEFAULT NULL AFTER last_name");
        echo "Column 'suffix' added successfully.\n";
    } else {
        echo "Column 'suffix' already exists.\n";
    }

} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
?>
