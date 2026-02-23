<?php
echo "Testing MySQL connection...\n";
$start = microtime(true);
try {
    $pdo = new PDO('mysql:host=127.0.0.1;port=3306', 'root', '', [
        PDO::ATTR_TIMEOUT => 3
    ]);
    echo "Connected in " . round(microtime(true) - $start, 2) . " seconds\n";
    echo "MySQL is working!\n";
} catch (Exception $e) {
    echo "Failed: " . $e->getMessage() . "\n";
}
