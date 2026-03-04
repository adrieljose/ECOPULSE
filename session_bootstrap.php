<?php
/**
 * Central session bootstrap — database-backed sessions for Vercel (stateless) + Supabase (PostgreSQL).
 * session_start() is backed by the `web_sessions` Supabase table so auth persists
 * across separate serverless function invocations.
 */
if (session_status() === PHP_SESSION_NONE) {
    $forwardedProto = strtolower((string) ($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? ''));
    $isHttps = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
        || (($_SERVER['SERVER_PORT'] ?? 80) == 443)
        || $forwardedProto === 'https';

    session_set_cookie_params([
        'lifetime' => 0,
        'path'     => '/',
        'domain'   => '',
        'secure'   => $isHttps,
        'httponly' => true,
        'samesite' => 'Lax',
    ]);

    try {
        require_once __DIR__ . '/db.php';
        if (function_exists('db')) {
            $sessionPdo = db();

            // Ensure the sessions table exists (PostgreSQL syntax)
            try {
                $sessionPdo->query("SELECT session_id FROM web_sessions LIMIT 1");
            } catch (Throwable $sessionTableError) {
                $sessionPdo->exec("
                    CREATE TABLE IF NOT EXISTS web_sessions (
                        session_id  VARCHAR(128) PRIMARY KEY,
                        session_data BYTEA        NOT NULL,
                        updated_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
                    )
                ");
            }

            session_set_save_handler(
                // open
                static function ($savePath, $sessionName): bool { return true; },
                // close
                static function (): bool { return true; },
                // read
                static function ($id) use ($sessionPdo): string {
                    try {
                        $stmt = $sessionPdo->prepare(
                            "SELECT session_data FROM web_sessions WHERE session_id = :id LIMIT 1"
                        );
                        $stmt->execute([':id' => $id]);
                        $data = $stmt->fetchColumn();
                        // PostgreSQL returns BYTEA as a resource or hex-escaped string
                        if (is_resource($data)) $data = stream_get_contents($data);
                        return is_string($data) ? $data : '';
                    } catch (Throwable $e) {
                        error_log('[EcoPulse session] Read failed: ' . $e->getMessage());
                        return '';
                    }
                },
                // write
                static function ($id, $data) use ($sessionPdo): bool {
                    try {
                        // PostgreSQL upsert (replaces MySQL ON DUPLICATE KEY UPDATE)
                        $stmt = $sessionPdo->prepare("
                            INSERT INTO web_sessions (session_id, session_data, updated_at)
                            VALUES (:id, :payload, NOW())
                            ON CONFLICT (session_id) DO UPDATE
                                SET session_data = EXCLUDED.session_data,
                                    updated_at   = NOW()
                        ");
                        $stmt->bindValue(':id',      $id,   PDO::PARAM_STR);
                        $stmt->bindValue(':payload', $data, PDO::PARAM_LOB);
                        return $stmt->execute();
                    } catch (Throwable $e) {
                        error_log('[EcoPulse session] Write failed: ' . $e->getMessage());
                        return false;
                    }
                },
                // destroy
                static function ($id) use ($sessionPdo): bool {
                    try {
                        $stmt = $sessionPdo->prepare(
                            "DELETE FROM web_sessions WHERE session_id = :id"
                        );
                        return $stmt->execute([':id' => $id]);
                    } catch (Throwable $e) {
                        error_log('[EcoPulse session] Destroy failed: ' . $e->getMessage());
                        return false;
                    }
                },
                // gc
                static function ($maxLifetime) use ($sessionPdo): int|false {
                    try {
                        $stmt = $sessionPdo->prepare(
                            "DELETE FROM web_sessions WHERE updated_at < NOW() - INTERVAL ':secs seconds'"
                        );
                        // Safer interval construction for PostgreSQL
                        $secs = max(0, (int) $maxLifetime);
                        $sessionPdo->exec("DELETE FROM web_sessions WHERE updated_at < NOW() - INTERVAL '$secs seconds'");
                        return 1;
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
