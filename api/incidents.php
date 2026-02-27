<?php
declare(strict_types=1);

require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../lib/incident_logger.php';

header('Content-Type: application/json');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('Pragma: no-cache');

try {
    $pdo = db();
    $limit = isset($_GET['limit']) ? (int) $_GET['limit'] : 30;
    $deviceFilter = isset($_GET['device_id']) && is_numeric($_GET['device_id']) ? (int)$_GET['device_id'] : null;

    $rows = eco_recent_incidents($pdo, $limit, $deviceFilter);

    $bySeverity = ['critical' => 0, 'warning' => 0, 'info' => 0];
    $byType = [];
    foreach ($rows as $r) {
        $severity = strtolower((string)($r['severity'] ?? 'info'));
        if (!isset($bySeverity[$severity])) {
            $bySeverity[$severity] = 0;
        }
        $bySeverity[$severity]++;

        $type = (string)($r['event_type'] ?? 'unknown');
        $byType[$type] = ($byType[$type] ?? 0) + 1;
    }
    arsort($byType);

    echo json_encode([
        'generatedAt' => date(DATE_ATOM),
        'count' => count($rows),
        'severity' => $bySeverity,
        'eventTypes' => $byType,
        'items' => $rows,
    ]);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        'error' => 'Incidents endpoint failed',
        'message' => $e->getMessage(),
    ]);
}

