<?php
require_once __DIR__ . '/../db.php';
header('Content-Type: application/json');

$TOKEN = 'change_this_token';

if (($_SERVER['HTTP_X_API_KEY'] ?? '') !== $TOKEN) {
    http_response_code(401);
    echo json_encode(['status' => 'error', 'message' => 'Unauthorized']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
$required = ['device_code','pm1','pm25','pm10','o3','co','co2','aqi'];
foreach ($required as $field) {
    if (!isset($input[$field])) {
        http_response_code(400);
        echo json_encode(['status'=>'error','message'=>"Missing $field"]);
        exit;
    }
}

$deviceCode = trim($input['device_code']);
$recordedAt = isset($input['recorded_at']) ? $input['recorded_at'] : date('Y-m-d H:i:s');
$temperature = $input['temperature'] ?? ($input['temp'] ?? ($input['temp_c'] ?? null));
$humidity = $input['humidity'] ?? ($input['hum'] ?? null);

try {
    $pdo = db();
    $pdo->beginTransaction();

    // find device
    $stmt = $pdo->prepare('SELECT id FROM devices WHERE device_code = ? LIMIT 1');
    $stmt->execute([$deviceCode]);
    $device = $stmt->fetch();

    if (!$device) {
        // auto-create with a default barangay_id = 1 (adjust if needed)
        $pdo->prepare('INSERT INTO devices (device_code, name, barangay_id, status, installed_at, last_seen_at) VALUES (?, ?, 1, "online", NOW(), NOW())')
            ->execute([$deviceCode, $deviceCode]);
        $deviceId = (int)$pdo->lastInsertId();
    } else {
        $deviceId = (int)$device['id'];
        $pdo->prepare('UPDATE devices SET last_seen_at = NOW(), status = "online" WHERE id = ?')->execute([$deviceId]);
    }

    // insert reading
    $ins = $pdo->prepare('INSERT INTO readings (device_id, recorded_at, pm1, pm25, pm10, o3, co, co2, temperature, humidity, aqi) VALUES (?,?,?,?,?,?,?,?,?,?,?)');
    $ins->execute([
        $deviceId,
        $recordedAt,
        $input['pm1'],
        $input['pm25'],
        $input['pm10'],
        $input['o3'],
        $input['co'],
        $input['co2'],
        $temperature,
        $humidity,
        $input['aqi']
    ]);

    $pdo->commit();
    echo json_encode(['status'=>'ok']);
} catch (Exception $e) {
    if ($pdo->inTransaction()) $pdo->rollBack();
    http_response_code(500);
    echo json_encode(['status'=>'error','message'=>$e->getMessage()]);
}
