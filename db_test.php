<?php
// Quick database connection test
error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "<h2>EcoPulse Database Test</h2>";

// Test 1: Basic MySQL connection
echo "<h3>1. Testing MySQL Connection...</h3>";
try {
    $pdo = new PDO("mysql:host=127.0.0.1;port=3306", "root", "", [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_TIMEOUT => 5
    ]);
    echo "<p style='color:green'>✅ MySQL connection successful!</p>";
    
    // Test 2: Check if ecopulse database exists
    echo "<h3>2. Checking for 'ecopulse' database...</h3>";
    $stmt = $pdo->query("SHOW DATABASES LIKE 'ecopulse'");
    if ($stmt->rowCount() > 0) {
        echo "<p style='color:green'>✅ Database 'ecopulse' exists!</p>";
        
        // Test 3: Check tables
        echo "<h3>3. Checking tables in 'ecopulse'...</h3>";
        $pdo->exec("USE ecopulse");
        $tables = $pdo->query("SHOW TABLES")->fetchAll(PDO::FETCH_COLUMN);
        if (count($tables) > 0) {
            echo "<p style='color:green'>✅ Found " . count($tables) . " tables:</p>";
            echo "<ul>";
            foreach ($tables as $t) {
                echo "<li>$t</li>";
            }
            echo "</ul>";
        } else {
            echo "<p style='color:red'>❌ No tables found! Database is empty.</p>";
            echo "<p><strong>Solution:</strong> You need to import your database backup (SQL file) via phpMyAdmin.</p>";
        }
    } else {
        echo "<p style='color:red'>❌ Database 'ecopulse' does NOT exist!</p>";
        echo "<p><strong>Solution:</strong> Create the database in phpMyAdmin:</p>";
        echo "<ol>";
        echo "<li>Go to <a href='http://localhost/phpmyadmin'>phpMyAdmin</a></li>";
        echo "<li>Click 'New' on the left sidebar</li>";
        echo "<li>Enter 'ecopulse' as the database name</li>";
        echo "<li>Click 'Create'</li>";
        echo "<li>Import your backup SQL file if you have one</li>";
        echo "</ol>";
    }
    
} catch (PDOException $e) {
    echo "<p style='color:red'>❌ MySQL connection FAILED!</p>";
    echo "<p>Error: " . htmlspecialchars($e->getMessage()) . "</p>";
    echo "<p><strong>Solutions:</strong></p>";
    echo "<ul>";
    echo "<li>Make sure MySQL is running in XAMPP (should show green)</li>";
    echo "<li>Check if port 3306 is not blocked by another application</li>";
    echo "</ul>";
}
?>
