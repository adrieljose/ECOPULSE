<?php
/**
 * EcoPulse — Vercel PHP Router
 * ─────────────────────────────
 * Vercel only allows serverless functions inside api/.
 * This router receives ALL root-level PHP requests and
 * includes the real PHP file from the project root.
 *
 * Root PHP files (login.php, index.php, etc.) keep their
 * original URLs — Vercel routes them here transparently.
 */

$uri  = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH);
$uri  = ltrim((string) $uri, '/');

// Strip query string if accidentally included
if (($q = strpos($uri, '?')) !== false) {
    $uri = substr($uri, 0, $q);
}

// Default to index.php
if ($uri === '' || $uri === 'index') {
    $uri = 'index.php';
}

// Ensure .php extension
if (!str_ends_with($uri, '.php')) {
    $uri .= '.php';
}

// Resolve the file path (one level up from api/)
$projectRoot = dirname(__DIR__);
$filePath    = $projectRoot . '/' . $uri;
$realFile    = realpath($filePath);

// Security: prevent directory traversal
if (
    $realFile === false
    || !str_starts_with($realFile, $projectRoot . DIRECTORY_SEPARATOR)
    || !str_ends_with($realFile, '.php')
    || !is_file($realFile)
) {
    http_response_code(404);
    header('Content-Type: text/html; charset=utf-8');
    echo '<h3>404 — Page not found</h3>';
    exit;
}

// Fix SERVER vars so included files see the right script name
$_SERVER['SCRIPT_FILENAME'] = $realFile;
$_SERVER['SCRIPT_NAME']     = '/' . $uri;
$_SERVER['PHP_SELF']        = '/' . $uri;

// Change working directory to the file's location so
// relative require/include paths resolve correctly
chdir(dirname($realFile));

// Execute the root PHP file
require $realFile;
