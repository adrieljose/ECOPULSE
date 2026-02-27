<?php
declare(strict_types=1);

/**
 * Unified incident/event logging for timeline + audit-style UI.
 */

if (!function_exists('eco_ensure_incident_table')) {
    function eco_ensure_incident_table(PDO $pdo): void
    {
        static $ready = false;
        if ($ready) return;

        $pdo->exec("
            CREATE TABLE IF NOT EXISTS incident_logs (
                id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
                device_id INT UNSIGNED NULL,
                event_type VARCHAR(40) NOT NULL,
                severity VARCHAR(16) NOT NULL DEFAULT 'info',
                title VARCHAR(180) NOT NULL,
                details_json LONGTEXT NULL,
                created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                INDEX idx_incident_created (created_at),
                INDEX idx_incident_device (device_id),
                INDEX idx_incident_event (event_type),
                INDEX idx_incident_severity (severity)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
        ");

        $ready = true;
    }
}

if (!function_exists('eco_log_incident')) {
    function eco_log_incident(
        PDO $pdo,
        ?int $deviceId,
        string $eventType,
        string $severity,
        string $title,
        array $details = [],
        int $dedupeSeconds = 90
    ): bool {
        eco_ensure_incident_table($pdo);

        $deviceId = $deviceId && $deviceId > 0 ? $deviceId : null;
        $eventType = trim($eventType);
        $severity = trim(strtolower($severity));
        $title = trim($title);
        if ($eventType === '' || $title === '') {
            return false;
        }

        $dedupeSeconds = max(0, $dedupeSeconds);
        if ($dedupeSeconds > 0) {
            $sql = "
                SELECT id
                FROM incident_logs
                WHERE event_type = :event_type
                  AND severity = :severity
                  AND title = :title
                  AND ((:device_id IS NULL AND device_id IS NULL) OR device_id = :device_id)
                  AND created_at >= (NOW() - INTERVAL {$dedupeSeconds} SECOND)
                LIMIT 1
            ";
            $check = $pdo->prepare($sql);
            $check->execute([
                ':event_type' => $eventType,
                ':severity' => $severity,
                ':title' => $title,
                ':device_id' => $deviceId,
            ]);
            if ($check->fetch(PDO::FETCH_ASSOC)) {
                return false;
            }
        }

        $insert = $pdo->prepare("
            INSERT INTO incident_logs (device_id, event_type, severity, title, details_json)
            VALUES (:device_id, :event_type, :severity, :title, :details_json)
        ");
        $insert->execute([
            ':device_id' => $deviceId,
            ':event_type' => $eventType,
            ':severity' => $severity,
            ':title' => $title,
            ':details_json' => $details ? json_encode($details, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) : null,
        ]);

        return true;
    }
}

if (!function_exists('eco_recent_incidents')) {
    function eco_recent_incidents(PDO $pdo, int $limit = 20, ?int $deviceId = null): array
    {
        eco_ensure_incident_table($pdo);

        $limit = max(1, min(200, $limit));
        $params = [];
        $where = '';
        if ($deviceId !== null && $deviceId > 0) {
            $where = 'WHERE i.device_id = :device_id';
            $params[':device_id'] = $deviceId;
        }

        $sql = "
            SELECT i.id, i.device_id, i.event_type, i.severity, i.title, i.details_json, i.created_at,
                   d.name AS device_name, d.device_code
            FROM incident_logs i
            LEFT JOIN devices d ON d.id = i.device_id
            {$where}
            ORDER BY i.created_at DESC
            LIMIT {$limit}
        ";
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

        foreach ($rows as &$row) {
            $details = [];
            if (!empty($row['details_json'])) {
                $decoded = json_decode((string) $row['details_json'], true);
                if (is_array($decoded)) {
                    $details = $decoded;
                }
            }
            $row['details'] = $details;
            unset($row['details_json']);
        }
        unset($row);

        return $rows;
    }
}

