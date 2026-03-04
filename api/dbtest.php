<?php
/**
 * EcoPulse — DB + Auth diagnostic. Visit /api/dbtest.php
 * DELETE this file after debugging.
 */
header('Content-Type: application/json');

$url = getenv('DATABASE_URL') ?: getenv('POSTGRES_URL') ?: '';

if (!$url) {
    echo json_encode(['status' => 'ERROR', 'reason' => 'DATABASE_URL is not set'], JSON_PRETTY_PRINT);
    exit;
}

$masked = preg_replace('/(:)[^@]+(@)/', '$1***$2', $url);

try {
    $parts = parse_url($url);
    $dsn   = sprintf(
        'pgsql:host=%s;port=%d;dbname=%s;sslmode=require',
        $parts['host'],
        $parts['port'] ?? 5432,
        ltrim($parts['path'] ?? '/postgres', '/')
    );
    $pdo = new PDO($dsn, rawurldecode($parts['user'] ?? ''), rawurldecode($parts['pass'] ?? ''), [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ]);

    // Check admins table
    $adminCount  = $pdo->query("SELECT COUNT(*) FROM admins")->fetchColumn();
    $masteradmin = $pdo->query("SELECT id, username, status FROM admins WHERE username = 'masteradmin'")->fetch(PDO::FETCH_ASSOC);

    // Check web_sessions table
    try {
        $sessionCount = $pdo->query("SELECT COUNT(*) FROM web_sessions")->fetchColumn();
        $sessionTable = "exists ($sessionCount rows)";
    } catch (Throwable $e) {
        $sessionTable = "MISSING — " . $e->getMessage();
    }

    echo json_encode([
        'db_connection'   => '✅ Connected',
        'db_url_masked'   => $masked,
        'admins_total'    => (int)$adminCount,
        'masteradmin'     => $masteradmin ?: '❌ NOT FOUND — run /ensure_master_admin.php first',
        'web_sessions'    => $sessionTable,
    ], JSON_PRETTY_PRINT);

} catch (Throwable $e) {
    echo json_encode([
        'status'     => '❌ DB Connection Failed',
        'url_masked' => $masked,
        'error'      => $e->getMessage(),
    ], JSON_PRETTY_PRINT);
}
