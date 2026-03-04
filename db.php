<?php
date_default_timezone_set('Asia/Manila');

function db_env(string $key, ?string $default = null): ?string
{
    $value = getenv($key);
    if ($value !== false && $value !== '') return $value;
    if (isset($_ENV[$key])    && $_ENV[$key]    !== '') return (string) $_ENV[$key];
    if (isset($_SERVER[$key]) && $_SERVER[$key] !== '') return (string) $_SERVER[$key];
    return $default;
}

function db_is_production(): bool
{
    $appEnv    = strtolower((string) db_env('APP_ENV', ''));
    $vercelEnv = strtolower((string) db_env('VERCEL_ENV', ''));
    return $appEnv === 'production' || $vercelEnv === 'production' || db_env('VERCEL') === '1';
}

/**
 * Parse a postgresql:// or postgres:// DATABASE_URL into PDO pgsql DSN parts.
 * Supabase connection-pooler URL format:
 *   postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres
 */
function db_config(): array
{
    $dsn = db_env('DATABASE_URL') ?: db_env('POSTGRES_URL');
    if ($dsn) {
        $parts = parse_url($dsn);
        if ($parts !== false) {
            $query = [];
            if (!empty($parts['query'])) parse_str($parts['query'], $query);
            return [
                'host'   => (string) ($parts['host'] ?? '127.0.0.1'),
                'port'   => isset($parts['port']) ? (int) $parts['port'] : 5432,
                'name'   => isset($parts['path']) ? ltrim((string) $parts['path'], '/') : 'postgres',
                'user'   => isset($parts['user']) ? rawurldecode((string) $parts['user']) : 'postgres',
                'pass'   => isset($parts['pass']) ? rawurldecode((string) $parts['pass']) : '',
                'sslmode'=> (string) ($query['sslmode'] ?? 'require'),
            ];
        }
    }

    return [
        'host'    => (string) db_env('DB_HOST', db_is_production() ? '' : '127.0.0.1'),
        'port'    => (int)    db_env('DB_PORT', '5432'),
        'name'    => (string) db_env('DB_NAME', db_is_production() ? '' : 'ecopulse'),
        'user'    => (string) db_env('DB_USER', db_is_production() ? '' : 'postgres'),
        'pass'    => (string) db_env('DB_PASS', ''),
        'sslmode' => (string) db_env('DB_SSLMODE', db_is_production() ? 'require' : 'prefer'),
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

/**
 * Returns a shared PDO connection (PostgreSQL / Supabase).
 * Connection string env vars (in order of precedence):
 *   DATABASE_URL  — full postgresql:// URL (recommended for Vercel + Supabase)
 *   POSTGRES_URL  — alias accepted by some Vercel integrations
 *   DB_HOST / DB_PORT / DB_NAME / DB_USER / DB_PASS / DB_SSLMODE  — individual vars
 */
function db(): PDO
{
    static $pdo = null;
    if ($pdo instanceof PDO) return $pdo;

    $cfg = db_config();
    if ($cfg['host'] === '' || $cfg['name'] === '' || $cfg['user'] === '') {
        error_log('[EcoPulse] Missing DB environment configuration.');
        db_respond_unavailable(['Missing DATABASE_URL or DB_HOST/DB_NAME/DB_USER.']);
    }

    try {
        $dsn = sprintf(
            'pgsql:host=%s;port=%d;dbname=%s;sslmode=%s',
            $cfg['host'],
            (int) $cfg['port'],
            $cfg['name'],
            $cfg['sslmode']
        );

        $pdo = new PDO($dsn, $cfg['user'], $cfg['pass'], [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ]);

        return $pdo;
    } catch (Throwable $e) {
        $msg = sprintf('%s:%d => %s', $cfg['host'], (int) $cfg['port'], $e->getMessage());
        error_log('[EcoPulse] PDO PostgreSQL connection failed: ' . $msg);
        db_respond_unavailable([$msg]);
    }
}
