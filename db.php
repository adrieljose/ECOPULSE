<?php
date_default_timezone_set('Asia/Manila');

function db_env(string $key, ?string $default = null): ?string
{
    $value = getenv($key);
    if ($value !== false && $value !== '') {
        return $value;
    }
    if (isset($_ENV[$key]) && $_ENV[$key] !== '') {
        return (string) $_ENV[$key];
    }
    if (isset($_SERVER[$key]) && $_SERVER[$key] !== '') {
        return (string) $_SERVER[$key];
    }
    return $default;
}

function db_is_production(): bool
{
    $appEnv = strtolower((string) db_env('APP_ENV', ''));
    $vercelEnv = strtolower((string) db_env('VERCEL_ENV', ''));
    return $appEnv === 'production' || $vercelEnv === 'production' || db_env('VERCEL') === '1';
}

function db_config(): array
{
    $dsn = db_env('DATABASE_URL') ?: db_env('MYSQL_URL');
    if ($dsn) {
        $parts = parse_url($dsn);
        if ($parts !== false) {
            $query = [];
            if (!empty($parts['query'])) {
                parse_str($parts['query'], $query);
            }
            return [
                'hosts' => !empty($parts['host']) ? [(string) $parts['host']] : ['127.0.0.1', 'localhost'],
                'port' => isset($parts['port']) ? (int) $parts['port'] : 3306,
                'name' => isset($parts['path']) ? ltrim((string) $parts['path'], '/') : 'ecopulse',
                'user' => isset($parts['user']) ? (string) $parts['user'] : 'root',
                'pass' => isset($parts['pass']) ? (string) $parts['pass'] : '',
                'ssl_ca' => (string) ($query['ssl_ca'] ?? db_env('DB_SSL_CA', '')),
            ];
        }
    }

    $host = (string) db_env('DB_HOST', '');
    $hosts = $host !== '' ? [$host] : (db_is_production() ? [] : ['127.0.0.1', 'localhost']);

    return [
        'hosts' => $hosts,
        'port' => (int) db_env('DB_PORT', '3306'),
        'name' => (string) db_env('DB_NAME', db_is_production() ? '' : 'ecopulse'),
        'user' => (string) db_env('DB_USER', db_is_production() ? '' : 'root'),
        'pass' => (string) db_env('DB_PASS', ''),
        'ssl_ca' => (string) db_env('DB_SSL_CA', ''),
    ];
}

function db_respond_unavailable(array $errors = []): never
{
    $isApiLike =
        str_starts_with((string) ($_SERVER['REQUEST_URI'] ?? ''), '/api/')
        || str_contains((string) ($_SERVER['SCRIPT_NAME'] ?? ''), '/api/')
        || (isset($_SERVER['HTTP_ACCEPT']) && str_contains((string) $_SERVER['HTTP_ACCEPT'], 'application/json'));

    $safeMessage = 'Database service is temporarily unavailable.';
    if (!db_is_production() && !empty($errors)) {
        $safeMessage .= ' ' . implode(' | ', $errors);
    }

    http_response_code(503);
    if ($isApiLike) {
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode(['error' => $safeMessage], JSON_UNESCAPED_UNICODE);
        exit;
    }

    echo "<h3 style='font-family:Arial,sans-serif;color:#333;'>Service temporarily unavailable</h3>";
    echo "<p style='font-family:Arial,sans-serif;color:#666;'>Please try again in a moment.</p>";
    if (!db_is_production() && !empty($errors)) {
        echo "<pre style='background:#f8f9fa;padding:10px;border:1px solid #ddd;font-family:consolas,monospace;color:#aa0000;white-space:pre-wrap;'>";
        echo htmlspecialchars(implode("\n", $errors), ENT_QUOTES, 'UTF-8');
        echo '</pre>';
    }
    exit;
}

function db(): PDO
{
    static $pdo = null;
    if ($pdo instanceof PDO) {
        return $pdo;
    }

    $cfg = db_config();
    if (empty($cfg['hosts']) || $cfg['name'] === '' || $cfg['user'] === '') {
        error_log('[EcoPulse] Missing DB environment configuration.');
        db_respond_unavailable(['Missing DB_HOST/DB_NAME/DB_USER (or DATABASE_URL).']);
    }

    $errors = [];
    foreach ($cfg['hosts'] as $host) {
        try {
            $dsn = sprintf(
                'mysql:host=%s;port=%d;dbname=%s;charset=utf8mb4',
                $host,
                (int) $cfg['port'],
                $cfg['name']
            );

            $options = [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
            ];
            if (!empty($cfg['ssl_ca']) && defined('PDO::MYSQL_ATTR_SSL_CA')) {
                $options[PDO::MYSQL_ATTR_SSL_CA] = $cfg['ssl_ca'];
            }

            $pdo = new PDO($dsn, $cfg['user'], $cfg['pass'], $options);
            return $pdo;
        } catch (Throwable $e) {
            $errors[] = sprintf('%s:%d => %s', $host, (int) $cfg['port'], $e->getMessage());
        }
    }

    if (!empty($errors)) {
        error_log('[EcoPulse] PDO DB connection failed: ' . implode(' || ', $errors));
    }
    db_respond_unavailable($errors);
}

function db_mysqli(): mysqli
{
    $cfg = db_config();
    if (empty($cfg['hosts']) || $cfg['name'] === '' || $cfg['user'] === '') {
        throw new RuntimeException('Missing DB environment configuration.');
    }

    $errors = [];
    foreach ($cfg['hosts'] as $host) {
        $mysqli = @new mysqli($host, $cfg['user'], $cfg['pass'], $cfg['name'], (int) $cfg['port']);
        if (!$mysqli->connect_errno) {
            $mysqli->set_charset('utf8mb4');
            return $mysqli;
        }
        $errors[] = sprintf('%s:%d => %s', $host, (int) $cfg['port'], $mysqli->connect_error);
    }

    throw new RuntimeException('MySQLi connection failed: ' . implode(' || ', $errors));
}

