<?php
declare(strict_types=1);

require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../lib/incident_logger.php';

header('Content-Type: application/json');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('Pragma: no-cache');

try {
    $pdo = db();
    eco_ensure_incident_table($pdo);

    $hours = isset($_GET['hours']) ? (int)$_GET['hours'] : 24;
    $hours = max(1, min(168, $hours));
    $deviceId = isset($_GET['device_id']) && is_numeric($_GET['device_id']) ? (int)$_GET['device_id'] : null;

    $where = 'WHERE created_at >= (NOW() - INTERVAL :hours HOUR)';
    $params = [':hours' => $hours];
    if ($deviceId !== null && $deviceId > 0) {
        $where .= ' AND device_id = :device_id';
        $params[':device_id'] = $deviceId;
    }

    $sql = "
        SELECT DATE_FORMAT(created_at, '%Y-%m-%d %H:00') AS label,
               SUM(CASE WHEN severity = 'critical' THEN 1 ELSE 0 END) AS critical_count,
               SUM(CASE WHEN severity = 'warning' THEN 1 ELSE 0 END) AS warning_count,
               SUM(CASE WHEN severity NOT IN ('critical','warning') THEN 1 ELSE 0 END) AS info_count
        FROM incident_logs
        {$where}
        GROUP BY label
        ORDER BY label ASC
    ";
    $stmt = $pdo->prepare($sql);
    foreach ($params as $k => $v) {
        $stmt->bindValue($k, $v, is_int($v) ? PDO::PARAM_INT : PDO::PARAM_STR);
    }
    $stmt->execute();
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $labels = [];
    $critical = [];
    $warning = [];
    $info = [];

    foreach ($rows as $row) {
        $labels[] = $row['label'];
        $critical[] = (int)$row['critical_count'];
        $warning[] = (int)$row['warning_count'];
        $info[] = (int)$row['info_count'];
    }

    echo json_encode([
        'generatedAt' => date(DATE_ATOM),
        'hours' => $hours,
        'labels' => $labels,
        'critical' => $critical,
        'warning' => $warning,
        'info' => $info,
    ]);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        'error' => 'Incident timeline failed',
        'message' => $e->getMessage(),
    ]);
}

