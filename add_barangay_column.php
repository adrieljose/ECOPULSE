<?php
require_once __DIR__ . '/db.php';

try {
    $pdo = db();
    
    // Add barangay column
    $pdo->exec("ALTER TABLE users ADD COLUMN barangay VARCHAR(100) DEFAULT NULL AFTER city");
    echo "Added column: barangay <br>";
    echo "Table schema updated successfully.";

} catch (PDOException $e) {
    if (strpos($e->getMessage(), 'Duplicate column') !== false) {
        echo "Column 'barangay' already exists.";
    } else {
        echo "Error updating table: " . $e->getMessage();
    }
}
