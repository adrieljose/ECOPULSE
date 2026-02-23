<?php
require 'db.php';
try {
    $pdo = db();
    $pdo->exec("UPDATE devices SET name='Device 1' WHERE id=1");
    echo "Renamed Station 1 to Device 1.\n";
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
