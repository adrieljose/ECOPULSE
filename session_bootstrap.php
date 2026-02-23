<?php
/**
 * Central session bootstrap to keep authentication stable across responsive mode changes.
 * Always include this file before using the session.
 */
if (session_status() === PHP_SESSION_NONE) {
    $isHttps = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
        || (($_SERVER['SERVER_PORT'] ?? 80) == 443);

    // Standardise cookie params so switching user agents (e.g., mobile/desktop) keeps the same cookie.
    session_set_cookie_params([
        'lifetime' => 0,
        'path' => '/',
        'domain' => '',
        'secure' => $isHttps,
        'httponly' => true,
        'samesite' => 'Lax',
    ]);

    session_start();
}
