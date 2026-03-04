<?php
require_once __DIR__ . '/../db.php';
header('Content-Type: application/json');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('Pragma: no-cache');

$pdo = db();

$deviceA = $_GET['deviceA'] ?? null;
$deviceB = $_GET['deviceB'] ?? null;
$from    = $_GET['from'] ?? null;
$to      = $_GET['to'] ?? null;

if (!$deviceA || !$deviceB || $deviceA === $deviceB) {
    http_response_code(400);
    echo json_encode(['error' => 'Two distinct devices required.']);
    exit;
}

$fromDate = $from ? DateTime::createFromFormat('Y-m-d', $from) : null;
$toDate   = $to ? DateTime::createFromFormat('Y-m-d', $to) : null;
$fromSql  = $fromDate ? $fromDate->format('Y-m-d 00:00:00') : null;
$toSql    = $toDate ? $toDate->format('Y-m-d 23:59:59') : null;

$sql = "
SELECT device_id, DATE_FORMAT(recorded_at, '%Y-%m-%d %H:%i') AS label, aqi
FROM readings
WHERE (device_id = :a OR device_id = :b)
";
$params = [':a' => $deviceA, ':b' => $deviceB];
if ($fromSql) { $sql .= " AND recorded_at >= :from"; $params[':from'] = $fromSql; }
if ($toSql)   { $sql .= " AND recorded_at <= :to";   $params[':to']   = $toSql; }
$sql .= " ORDER BY recorded_at ASC";

$stmt = $pdo->prepare($sql);
$stmt->execute($params);
$rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

$labels = [];
$seriesA = [];
$seriesB = [];
foreach ($rows as $row) {
    $labels[] = $row['label'];
    if ((string)$row['device_id'] === (string)$deviceA) {
        $seriesA[] = $row['aqi'] !== null ? (int)$row['aqi'] : null;
        $seriesB[] = null;
    } else {
        $seriesA[] = null;
        $seriesB[] = $row['aqi'] !== null ? (int)$row['aqi'] : null;
    }
}

// Fill device names
$nameA = 'Device A';
$nameB = 'Device B';
$names = $pdo->prepare("SELECT id, name, device_code FROM devices WHERE id IN (:a,:b)");
$names->execute([':a' => $deviceA, ':b' => $deviceB]);
while ($row = $names->fetch(PDO::FETCH_ASSOC)) {
    if ((string)$row['id'] === (string)$deviceA) $nameA = $row['name'] ?: $row['device_code'] ?: $nameA;
    if ((string)$row['id'] === (string)$deviceB) $nameB = $row['name'] ?: $row['device_code'] ?: $nameB;
}

echo json_encode([
    'labels' => $labels,
    'seriesA' => $seriesA,
    'seriesB' => $seriesB,
    'nameA' => $nameA,
    'nameB' => $nameB,
    'summary' => 'Comparing AQI over the selected range.'
]);
