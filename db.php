<?php
// EcoPulse Database Connection
date_default_timezone_set('Asia/Manila');

function db() {
    $hosts = ['127.0.0.1', 'localhost']; // try TCP first, then socket/localhost
    $port = 3306;
    $dbname = 'ecopulse';     // must match your HeidiSQL database name
    $username = 'root';       // default Laragon username
    $password = '';           // leave blank for Laragon default

    $errors = [];
    foreach ($hosts as $host) {
        try {
            $pdo = new PDO("mysql:host=$host;port=$port;dbname=$dbname;charset=utf8mb4", $username, $password, [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            ]);
            return $pdo;
        } catch (PDOException $e) {
            $errors[] = $e->getMessage();
        }
    }

    http_response_code(503);
    echo "<h3 style='font-family:Arial,sans-serif;color:#333;'>Database connection failed</h3>";
    echo "<p style='font-family:Arial,sans-serif;color:#666;'>We couldn't reach MySQL on localhost:{$port}. Please ensure the MySQL/MariaDB service in Laragon is running and listening on port {$port}, then refresh.</p>";
    echo "<pre style='background:#f8f9fa;padding:10px;border:1px solid #ddd;font-family:consolas,monospace;color:#aa0000;white-space:pre-wrap;'>";
    echo htmlspecialchars(implode('\\n', $errors));
    echo "</pre>";
    exit;
}
?>
