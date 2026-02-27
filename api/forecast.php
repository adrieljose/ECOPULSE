<?php
declare(strict_types=1);

require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../lib/forecast_engine.php';

header('Content-Type: application/json');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('Pragma: no-cache');

try {
    $pdo = db();

    $horizon = isset($_GET['horizon']) ? (int) $_GET['horizon'] : 30;
    $window = isset($_GET['window']) ? (int) $_GET['window'] : 120;
    $deviceFilter = $_GET['device_id'] ?? null;

    $horizon = max(5, min(180, $horizon));
    $window = max(15, min(24 * 60, $window));

    if ($deviceFilter !== null && $deviceFilter !== '') {
        $stmt = $pdo->prepare("SELECT id, device_code, name FROM devices WHERE id = :id OR device_code = :code LIMIT 1");
        $stmt->execute([
            ':id' => is_numeric($deviceFilter) ? (int)$deviceFilter : 0,
            ':code' => (string)$deviceFilter,
        ]);
        $device = $stmt->fetch(PDO::FETCH_ASSOC);
        if (!$device) {
            echo json_encode([
                'generatedAt' => date(DATE_ATOM),
                'items' => [],
                'message' => 'Device not found',
            ]);
            exit;
        }
        $deviceIds = [(int)$device['id']];
    } else {
        $deviceIds = array_map('intval', $pdo->query("SELECT id FROM devices")->fetchAll(PDO::FETCH_COLUMN));
    }

    $map = eco_build_forecast_map($pdo, $deviceIds, $window, $horizon);

    if (!$map) {
        echo json_encode([
            'generatedAt' => date(DATE_ATOM),
            'windowMinutes' => $window,
            'horizonMinutes' => $horizon,
            'items' => [],
            'summary' => 'Insufficient readings for forecast',
        ]);
        exit;
    }

    $metaStmt = $pdo->prepare("SELECT id, device_code, name FROM devices WHERE id IN (" . implode(',', array_fill(0, count($deviceIds), '?')) . ")");
    $metaStmt->execute($deviceIds);
    $metaRows = $metaStmt->fetchAll(PDO::FETCH_ASSOC);
    $metaById = [];
    foreach ($metaRows as $m) {
        $metaById[(int)$m['id']] = $m;
    }

    $items = [];
    $confidenceSum = 0;
    foreach ($map as $deviceId => $forecast) {
        $meta = $metaById[(int)$deviceId] ?? ['name' => "Device {$deviceId}", 'device_code' => null];
        $items[] = [
            'device_id' => (int)$deviceId,
            'device_code' => $meta['device_code'],
            'device_name' => $meta['name'],
            'forecast' => $forecast,
        ];
        $confidenceSum += (int)($forecast['confidence_percent'] ?? 0);
    }

    usort($items, static fn(array $a, array $b): int =>
        ($b['forecast']['forecast_aqi'] ?? -1) <=> ($a['forecast']['forecast_aqi'] ?? -1)
    );

    $avgConfidence = (int) round($confidenceSum / max(1, count($items)));
    echo json_encode([
        'generatedAt' => date(DATE_ATOM),
        'windowMinutes' => $window,
        'horizonMinutes' => $horizon,
        'averageConfidence' => $avgConfidence,
        'items' => $items,
    ]);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        'error' => 'Forecast endpoint failed',
        'message' => $e->getMessage(),
    ]);
}
