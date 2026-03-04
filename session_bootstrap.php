<?php
/**
 * Central session bootstrap to keep authentication stable across responsive mode changes.
 * Always include this file before using the session.
 */
if (session_status() === PHP_SESSION_NONE) {
    $forwardedProto = strtolower((string)($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? ''));
    $isHttps = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
        || (($_SERVER['SERVER_PORT'] ?? 80) == 443)
        || $forwardedProto === 'https';

    // Standardise cookie params so switching user agents (e.g., mobile/desktop) keeps the same cookie.
    session_set_cookie_params([
        'lifetime' => 0,
        'path' => '/',
        'domain' => '',
        'secure' => $isHttps,
        'httponly' => true,
        'samesite' => 'Lax',
    ]);

    // Use DB-backed sessions so auth persists across separate Vercel PHP functions.
    try {
        require_once __DIR__ . '/db.php';
        if (function_exists('db')) {
            $sessionPdo = db();
            try {
                $sessionPdo->query("SELECT session_id FROM web_sessions LIMIT 1");
            } catch (Throwable $sessionTableError) {
                $sessionPdo->exec("
                    CREATE TABLE IF NOT EXISTS web_sessions (
                        session_id VARCHAR(128) PRIMARY KEY,
                        session_data MEDIUMBLOB NOT NULL,
                        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
                    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
                ");
            }

            session_set_save_handler(
                static function ($savePath, $sessionName): bool {
                    return true;
                },
                static function (): bool {
                    return true;
                },
                static function ($id) use ($sessionPdo): string {
                    try {
                        $stmt = $sessionPdo->prepare("SELECT session_data FROM web_sessions WHERE session_id = :id LIMIT 1");
                        $stmt->execute([':id' => $id]);
                        $data = $stmt->fetchColumn();
                        return is_string($data) ? $data : '';
                    } catch (Throwable $e) {
                        error_log('[EcoPulse session] Read failed: ' . $e->getMessage());
                        return '';
                    }
                },
                static function ($id, $data) use ($sessionPdo): bool {
                    try {
                        $stmt = $sessionPdo->prepare("
                            INSERT INTO web_sessions (session_id, session_data, updated_at)
                            VALUES (:id, :payload, NOW())
                            ON DUPLICATE KEY UPDATE
                                session_data = VALUES(session_data),
                                updated_at = NOW()
                        ");
                        $stmt->bindValue(':id', $id, PDO::PARAM_STR);
                        $stmt->bindValue(':payload', $data, PDO::PARAM_LOB);
                        return $stmt->execute();
                    } catch (Throwable $e) {
                        error_log('[EcoPulse session] Write failed: ' . $e->getMessage());
                        return false;
                    }
                },
                static function ($id) use ($sessionPdo): bool {
                    try {
                        $stmt = $sessionPdo->prepare("DELETE FROM web_sessions WHERE session_id = :id");
                        return $stmt->execute([':id' => $id]);
                    } catch (Throwable $e) {
                        error_log('[EcoPulse session] Destroy failed: ' . $e->getMessage());
                        return false;
                    }
                },
                static function ($maxLifetime) use ($sessionPdo): int|false {
                    try {
                        $cutoff = date('Y-m-d H:i:s', time() - max(0, (int)$maxLifetime));
                        $stmt = $sessionPdo->prepare("DELETE FROM web_sessions WHERE updated_at < :cutoff");
                        $stmt->execute([':cutoff' => $cutoff]);
                        return $stmt->rowCount();
                    } catch (Throwable $e) {
                        error_log('[EcoPulse session] GC failed: ' . $e->getMessage());
                        return false;
                    }
                }
            );
        }
    } catch (Throwable $e) {
        error_log('[EcoPulse session] Falling back to default session handler: ' . $e->getMessage());
    }

    session_start();
}
