<?php
require 'db.php';
try {
    $pdo = db();
    // Check if ID 1 exists
    $stmt = $pdo->query("SELECT id FROM devices WHERE id = 1");
    if ($stmt->fetch()) {
        echo "Device ID 1 already exists.\n";
    } else {
        // Insert it
        $pdo->exec("INSERT INTO devices (id, device_code, name, status, barangay_id, lat, lng, installed_at) 
                    VALUES (1, 'DEV-001', 'Station 1', 'online', 1, 10.11, 122.86, NOW())");
        echo "Device ID 1 created.\n";
    }
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
