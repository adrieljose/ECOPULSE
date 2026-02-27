<?php
// EcoPulse Database Connection
date_default_timezone_set('Asia/Manila');

function db() {
    // Cloud environments (Render, Vercel, Railway) will use these Environment Variables
    $host_env = getenv('DB_HOST') ?: (isset($_ENV['DB_HOST']) ? $_ENV['DB_HOST'] : null);
    $port_env = getenv('DB_PORT') ?: (isset($_ENV['DB_PORT']) ? $_ENV['DB_PORT'] : null);
    $dbname_env = getenv('DB_NAME') ?: (isset($_ENV['DB_NAME']) ? $_ENV['DB_NAME'] : null);
    $username_env = getenv('DB_USER') ?: (isset($_ENV['DB_USER']) ? $_ENV['DB_USER'] : null);
    $password_env = getenv('DB_PASS') ?: (isset($_ENV['DB_PASS']) ? $_ENV['DB_PASS'] : '');

    // Fallbacks to Local Laragon settings if environment variables are not set
    $hosts = $host_env ? [$host_env] : ['127.0.0.1', 'localhost'];
    $port = $port_env ?: 3306;
    $dbname = $dbname_env ?: 'ecopulse';
    $username = $username_env ?: 'root';
    $password = $password_env;

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
