<?php
/**
 * Temporary DB connection test — DELETE after debugging.
 * Visit: https://your-app.vercel.app/api/dbtest.php
 */
header('Content-Type: application/json');

$url = getenv('DATABASE_URL') ?: getenv('POSTGRES_URL') ?: '';

if (!$url) {
    echo json_encode(['status' => 'ERROR', 'reason' => 'DATABASE_URL is not set in Vercel environment variables']);
    exit;
}

// Show a masked version (hide password)
$masked = preg_replace('/(:)[^@]+(@)/', '$1***$2', $url);
echo "Connecting to: $masked\n\n";

try {
    $parts   = parse_url($url);
    $dsn     = sprintf(
        'pgsql:host=%s;port=%d;dbname=%s;sslmode=require',
        $parts['host'],
        $parts['port'] ?? 5432,
        ltrim($parts['path'] ?? '/postgres', '/')
    );
    $user    = rawurldecode($parts['user'] ?? '');
    $pass    = rawurldecode($parts['pass'] ?? '');

    $pdo = new PDO($dsn, $user, $pass, [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
    $ver = $pdo->query('SELECT version()')->fetchColumn();

    echo json_encode([
        'status'  => 'OK ✅',
        'message' => 'Connected to Supabase successfully',
        'pg_version' => substr($ver, 0, 40),
    ], JSON_PRETTY_PRINT);
} catch (Throwable $e) {
    echo json_encode([
        'status'  => 'ERROR ❌',
        'message' => $e->getMessage(),
    ], JSON_PRETTY_PRINT);
}
