<?php
// api/ingest_esp.php
require_once __DIR__ . '/alert_logic.php';

// Allow only POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo "Only POST allowed";
    exit;
}

// Read raw JSON body
$raw = file_get_contents('php://input');
$data = json_decode($raw, true);

if ($data === null) {
    http_response_code(400);
    echo "JSON decode error: " . json_last_error_msg();
    exit;
}

// Device identification: prefer device_code, fallback to device_id
$deviceCode = $data['device_code'] ?? null;
$deviceId   = isset($data['device_id']) ? (int)$data['device_id'] : 0;

if (!$deviceCode && $deviceId === 0) {
    http_response_code(400);
    echo "device_code or device_id required";
    exit;
}

// Extract sensor values (support both mq7/mq131 and co/o3 just in case)
$pm1   = isset($data['pm1'])   ? (float)$data['pm1']   : 0;
$pm25  = isset($data['pm25'])  ? (float)$data['pm25']  : 0;
$pm10  = isset($data['pm10'])  ? (float)$data['pm10']  : 0;
$co2   = isset($data['co2'])   ? (float)$data['co2']   : 0;

$co    = 0;
$o3    = 0;
$temperature = null;
$humidity = null;
$lat = isset($data['lat']) ? (float)$data['lat'] : null;
$lng = isset($data['lng']) ? (float)$data['lng'] : null;

if (isset($data['co'])) {
    $co = (float)$data['co'];
} elseif (isset($data['mq7'])) {
    $co = (float)$data['mq7'];      // map mq7 -> CO
}

if (isset($data['o3'])) {
    $o3 = (float)$data['o3'];
} elseif (isset($data['mq131'])) {
    $o3 = (float)$data['mq131'];    // map mq131 -> O3
}

if (isset($data['temperature'])) {
    $temperature = (float)$data['temperature'];
} elseif (isset($data['temp'])) {
    $temperature = (float)$data['temp'];
} elseif (isset($data['temp_c'])) {
    $temperature = (float)$data['temp_c'];
}

if (isset($data['humidity'])) {
    $humidity = (float)$data['humidity'];
} elseif (isset($data['hum'])) {
    $humidity = (float)$data['hum'];
}

// Helper to calculate linear AQI interpolation
function calc_aqi_sub($c, $breakpoints) {
    // $breakpoints is array of [ C_low, C_high, I_low, I_high ]
    $c = (float)$c;
    foreach ($breakpoints as $bp) {
        list($cLo, $cHi, $iLo, $iHi) = $bp;
        if ($c >= $cLo && $c <= $cHi) {
            return round((($iHi - $iLo) / ($cHi - $cLo)) * ($c - $cLo) + $iLo);
        }
    }
    // If above max, simplistic extrapolation or cap
    $last = end($breakpoints);
    if ($c > $last[1]) {
        // Just return max index or linear extrapolate? Let's cap at 500 or extrapolate roughly.
        // For safety, just extrapolate the slope of the last segment
        list($cLo, $cHi, $iLo, $iHi) = $last;
         return round((($iHi - $iLo) / ($cHi - $cLo)) * ($c - $cLo) + $iLo);
    }
    return 0;
}

// Define Breakpoints (Simplified EPA Standards)
// Each row: [Conc Low, Conc High, Index Low, Index High]
$bp_pm25 = [
    [0.0, 12.0, 0, 50],
    [12.1, 35.4, 51, 100],
    [35.5, 55.4, 101, 150],
    [55.5, 150.4, 151, 200],
    [150.5, 250.4, 201, 300],
    [250.5, 500.4, 301, 500]
];
$bp_pm10 = [
    [0, 54, 0, 50],
    [55, 154, 51, 100],
    [155, 254, 101, 150],
    [255, 354, 151, 200],
    [355, 424, 201, 300],
    [425, 604, 301, 500]
];
// CO (ppm) - 8hr based standard usually, but applied instantly here for safety
$bp_co = [
    [0.0, 4.4, 0, 50],
    [4.5, 9.4, 51, 100],
    [9.5, 12.4, 101, 150],
    [12.5, 15.4, 151, 200],
    [15.5, 30.4, 201, 300],
    [30.5, 50.4, 301, 500]
];
// O3 (ppm) - 8hr based standard usually
$bp_o3 = [
    [0.000, 0.054, 0, 50],
    [0.055, 0.070, 51, 100],
    [0.071, 0.085, 101, 150],
    [0.086, 0.105, 151, 200],
    [0.106, 0.200, 201, 300]
];

// Calculate Individual Indices
$aqi_pm25 = calc_aqi_sub($pm25, $bp_pm25);
$aqi_pm10 = calc_aqi_sub($pm10, $bp_pm10);
$aqi_co   = calc_aqi_sub($co,   $bp_co);
$aqi_o3   = calc_aqi_sub($o3,   $bp_o3);

// Overall AQI is the Maximum of all sub-indices
$aqi = max($aqi_pm25, $aqi_pm10, $aqi_co, $aqi_o3);
$aqi = (int) $aqi;
// Clamp AQI to 0-500 to avoid runaway inserts
$aqi = max(0, min(500, $aqi));

// If AQI crosses 101+, enqueue an alert row (per device) for SMS when transitioning from below threshold
if ($aqi >= 101) {
    try {
        $pdo_alert = db();
        $pdo_alert->exec("
            CREATE TABLE IF NOT EXISTS alerts (
                id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
                device_id INT UNSIGNED NOT NULL,
                metric VARCHAR(32) NOT NULL,
                value DECIMAL(10,2) NOT NULL,
                threshold DECIMAL(10,2) NOT NULL,
                severity VARCHAR(16) NOT NULL DEFAULT 'yellow',
                message TEXT NULL,
                status VARCHAR(16) NOT NULL DEFAULT 'open',
                triggered_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                sent_sms_at DATETIME NULL,
                sms_attempts TINYINT UNSIGNED NOT NULL DEFAULT 0,
                last_sms_error VARCHAR(255) NULL,
                INDEX idx_device (device_id),
                INDEX idx_status (status),
                INDEX idx_triggered (triggered_at)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        ");

        // Check last AQI to detect threshold crossing
        $prevStmt = $pdo_alert->prepare("SELECT aqi FROM readings WHERE device_id = :did ORDER BY recorded_at DESC LIMIT 2");
        $prevStmt->execute([':did' => $deviceId]);
        $prevVals = $prevStmt->fetchAll(PDO::FETCH_COLUMN);
        $prevAqi = $prevVals[0] ?? null;

        $crossedUp = ($prevAqi === false || $prevAqi === null || (int)$prevAqi < 101);

        $severity = ($aqi >= 151) ? 'red' : 'yellow';
        // Avoid duplicate open alerts for the same device/metric/severity
        $check = $pdo_alert->prepare("SELECT id FROM alerts WHERE device_id = :did AND metric = 'AQI' AND severity = :sev AND status = 'open' LIMIT 1");
        $check->execute([':did' => $deviceId, ':sev' => $severity]);
        $hasOpenRecent = (bool)$check->fetch();

        // Close opposite severity to avoid stale alerts
        if ($severity === 'red') {
            $pdo_alert->prepare("UPDATE alerts SET status = 'closed' WHERE device_id = :did AND metric = 'AQI' AND severity = 'yellow' AND status = 'open'")
                ->execute([':did' => $deviceId]);
        } elseif ($severity === 'yellow') {
            $pdo_alert->prepare("UPDATE alerts SET status = 'closed' WHERE device_id = :did AND metric = 'AQI' AND severity = 'red' AND status = 'open'")
                ->execute([':did' => $deviceId]);
        }

        // Create alert if none open for this severity, regardless of previous AQI
        if (!$hasOpenRecent) {
            $ins = $pdo_alert->prepare("
                INSERT INTO alerts (device_id, metric, value, threshold, severity, message, status, triggered_at)
                VALUES (:did, 'AQI', :val, 101, :sev, :msg, 'open', NOW())
            ");
            $msg = "AQI reached {$aqi}";
            $ins->execute([
                ':did' => $deviceId,
                ':val' => $aqi,
                ':sev' => $severity,
                ':msg' => $msg
            ]);
            $alertId = $pdo_alert->lastInsertId();
            
            // IMMEDIATELY send SMS alert
            try {
                // Get device info
                $devStmt = $pdo_alert->prepare("SELECT name, barangay_id FROM devices WHERE id = ?");
                $devStmt->execute([$deviceId]);
                $devInfo = $devStmt->fetch(PDO::FETCH_ASSOC);
                $deviceName = $devInfo['name'] ?? 'Device';
                $barangayId = $devInfo['barangay_id'] ?? null;
                
                // Get barangay name
                $areaName = 'your area';
                if ($barangayId) {
                    $brgyStmt = $pdo_alert->prepare("SELECT name FROM barangays WHERE id = ?");
                    $brgyStmt->execute([$barangayId]);
                    $areaName = $brgyStmt->fetchColumn() ?: 'your area';
                }
                
                // Get subscribers for this device
                $subStmt = $pdo_alert->prepare("SELECT mobile FROM subscribers WHERE device_id = ?");
                $subStmt->execute([$deviceId]);
                $mobiles = $subStmt->fetchAll(PDO::FETCH_COLUMN);
                
                // Also get barangay-based subscribers
                if ($barangayId) {
                    $subStmt2 = $pdo_alert->prepare("SELECT mobile FROM subscribers WHERE barangay_id = ? AND device_id IS NULL");
                    $subStmt2->execute([$barangayId]);
                    $moreMobiles = $subStmt2->fetchAll(PDO::FETCH_COLUMN);
                    $mobiles = array_unique(array_merge($mobiles, $moreMobiles));
                }
                
                if (!empty($mobiles)) {
                    // Load SMS templates
                    $templateFile = __DIR__ . '/../data/sms_templates.json';
                    $templates = [];
                    if (file_exists($templateFile)) {
                        $rawTpl = json_decode(file_get_contents($templateFile), true);
                        if (is_array($rawTpl)) {
                            foreach ($rawTpl as $t) {
                                $templates[$t['id']] = $t['content'];
                            }
                        }
                    }
                    $cautionTpl = $templates['caution_alert'] ?? 'EcoPulse Caution: High pollution in {area}. AQI: {aqi}.';
                    $criticalTpl = $templates['pollution_alert'] ?? 'EcoPulse Alert: Critical pollution in {area}. AQI: {aqi}. Stay indoors.';
                    
                    // Select template based on severity
                    $tplContent = ($severity === 'red') ? $criticalTpl : $cautionTpl;
                    $aqiCategory = ($severity === 'red') ? 'Critical' : 'Unhealthy';
                    
                    // Replace placeholders
                    $body = str_replace(
                        ['{area}', '{aqi}', '{aqi_category}'],
                        [$areaName, $aqi, $aqiCategory],
                        $tplContent
                    );
                    
                    if (trim($body) === '') {
                        $body = "EcoPulse Alert: $areaName air quality is $aqi ($aqiCategory). Please take precautions.";
                    }
                    
                    // Get IPROG config
                    $token_file = __DIR__ . '/../data/iprog_token.txt';
                    $IPROG_API_TOKEN = '';
                    if (file_exists($token_file)) {
                        $IPROG_API_TOKEN = trim(file_get_contents($token_file));
                    }
                    if (!$IPROG_API_TOKEN) {
                        $IPROG_API_TOKEN = getenv('IPROG_API_TOKEN') ?: '';
                    }
                    $IPROG_BASE_URL = rtrim(getenv('IPROG_BASE_URL') ?: 'https://www.iprogsms.com/api/v1/sms_messages', '/');
                    $IPROG_SMS_PROVIDER = getenv('IPROG_SMS_PROVIDER') ?: null;
                    
                    $sentCount = 0;
                    foreach ($mobiles as $mobile) {
                        $cleanMobile = preg_replace('/[^0-9]/', '', $mobile);
                        if (strlen($cleanMobile) === 11 && $cleanMobile[0] === '0') {
                            $cleanMobile = '63' . substr($cleanMobile, 1);
                        }
                        if ($cleanMobile === '') continue;
                        
                        $payload = [
                            'api_token' => $IPROG_API_TOKEN,
                            'phone_number' => $cleanMobile,
                            'message' => $body
                        ];
                        if ($IPROG_SMS_PROVIDER !== null && $IPROG_SMS_PROVIDER !== '') {
                            $payload['sms_provider'] = $IPROG_SMS_PROVIDER;
                        }
                        
                        $ch = curl_init($IPROG_BASE_URL);
                        curl_setopt_array($ch, [
                            CURLOPT_POST => true,
                            CURLOPT_POSTFIELDS => http_build_query($payload),
                            CURLOPT_RETURNTRANSFER => true,
                            CURLOPT_HTTPHEADER => [
                                'Content-Type: application/x-www-form-urlencoded',
                                'Accept: application/json'
                            ],
                            CURLOPT_TIMEOUT => 10
                        ]);
                        $resp = curl_exec($ch);
                        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
                        curl_close($ch);
                        
                        $decoded = json_decode($resp, true);
                        $status = $decoded['status'] ?? null;
                        $success = ($httpCode >= 200 && $httpCode < 300) && ($status === 200 || strtolower((string)$status) === 'success');
                        
                        // Log SMS
                        $logStmt = $pdo_alert->prepare("INSERT INTO sms_logs (mobile, message, provider, status, error, area_id, area_name, alert_id) VALUES (?, ?, 'IPROG', ?, ?, ?, ?, ?)");
                        $logStmt->execute([
                            $cleanMobile,
                            $body,
                            $success ? 'sent' : 'failed',
                            $success ? null : ($resp ?: 'error'),
                            $barangayId,
                            $areaName,
                            $alertId
                        ]);
                        
                        if ($success) $sentCount++;
                    }
                    
                    // Update alert with SMS sent time
                    if ($sentCount > 0) {
                        $pdo_alert->prepare("UPDATE alerts SET sent_sms_at = NOW(), sms_attempts = sms_attempts + 1 WHERE id = ?")->execute([$alertId]);
                    }
                }
            } catch (Throwable $smsErr) { /* ignore SMS errors */ }
    }
} catch (Throwable $e) { /* ignore alert insertion errors */ }
} else {
    // AQI back below threshold: close open AQI alerts for this device
    try {
        $pdo_alert = db();
        $cl = $pdo_alert->prepare("UPDATE alerts SET status = 'closed' WHERE device_id = :did AND metric = 'AQI' AND status = 'open'");
        $cl->execute([':did' => $deviceId]);
    } catch (Throwable $e) { /* ignore */ }
}

// OPTIONAL: append raw JSON to log file if you still want air_data.log
$logFilename = __DIR__ . '/../air_data.log';
file_put_contents($logFilename, $raw . PHP_EOL, FILE_APPEND);

// Connect to DB
$mysqli = new mysqli('localhost', 'root', '', 'ecopulse');
if ($mysqli->connect_errno) {
    http_response_code(500);
    echo "DB connection failed: " . $mysqli->connect_error;
    exit;
}

// Ensure heartbeat column exists (best-effort, avoid duplicate column errors)
$checkCol = $mysqli->query("SELECT 1 FROM information_schema.columns WHERE table_schema = DATABASE() AND table_name = 'devices' AND column_name = 'last_heartbeat' LIMIT 1");
if ($checkCol && $checkCol->num_rows === 0) {
    @$mysqli->query("ALTER TABLE devices ADD COLUMN last_heartbeat DATETIME NULL");
}

// Resolve existing device only (no auto-create)
$resolvedId = 0;

// 1) Try explicit device_id if provided
if ($deviceId > 0) {
    $stmtChk = $mysqli->prepare("SELECT id, device_code FROM devices WHERE id = ? LIMIT 1");
    if ($stmtChk) {
        $stmtChk->bind_param("i", $deviceId);
        $stmtChk->execute();
        $stmtChk->bind_result($foundId, $foundCode);
        if ($stmtChk->fetch()) {
            $resolvedId = (int)$foundId;
            if (!$deviceCode && $foundCode) $deviceCode = $foundCode;
        }
        $stmtChk->close();
    }
}

// 2) If not resolved, try by device_code
if ($resolvedId === 0 && $deviceCode) {
    $stmtFind = $mysqli->prepare("SELECT id FROM devices WHERE device_code = ? LIMIT 1");
    if ($stmtFind) {
        $stmtFind->bind_param("s", $deviceCode);
        $stmtFind->execute();
        $stmtFind->bind_result($foundId);
        if ($stmtFind->fetch()) {
            $resolvedId = (int)$foundId;
        }
        $stmtFind->close();
    }
}

if ($resolvedId === 0) {
    http_response_code(404);
    echo "Device not found. Please add it first.";
    exit;
}

// Check if THIS specific source device is active
$sourceActive = true;
$chk = $mysqli->query("SELECT is_active FROM devices WHERE id = " . (int)$resolvedId);
if ($chk && $r = $chk->fetch_assoc()) {
    $sourceActive = ((int)$r['is_active'] === 1);
}

// Proceed to insert reading...
$deviceId = $resolvedId;

// Insert Source Reading ONLY if active
if ($sourceActive) {
    // Keep device status fresh when active
    $mysqli->query("UPDATE devices SET status = 'online', last_heartbeat = NOW() WHERE id = " . (int)$deviceId);

    // Insert into readings
    $stmt = $mysqli->prepare(
        "INSERT INTO readings
         (device_id, recorded_at, pm1, pm25, pm10, o3, co, co2, temperature, humidity, aqi)
         VALUES (?, NOW(), ?, ?, ?, ?, ?, ?, ?, ?, ?)"
    );
    if ($stmt) {
        $stmt->bind_param(
            "iddddddddi",
            $deviceId,
            $pm1,
            $pm25,
            $pm10,
            $o3,
            $co,
            $co2,
            $temperature,
            $humidity,
            $aqi
        );
        $stmt->execute();
    }
} else {
    // Source is stopped: Update Heartbeat ONLY (to show it's connected but paused)
    $mysqli->query("UPDATE devices SET status = 'offline', last_heartbeat = NOW() WHERE id = " . (int)$deviceId);
    echo "OK (Device paused)";
    exit;
}

// (Skip original unconditional insert logic by consuming it in replacement above)

// Optional: update device lat/lng when provided
// Only if source is active (or maybe update location anyway? User said "stop collecting readings". Let's allow loc update.)
if ($lat !== null && $lng !== null) {
    $upd = $mysqli->prepare("UPDATE devices SET lat = ?, lng = ?, status = 'online', last_heartbeat = NOW() WHERE id = ?");
    if ($upd) {
        $upd->bind_param("ddi", $lat, $lng, $deviceId);
        $upd->execute();
        $upd->close();
    }
}

// TRIGGER ALERTS LOGIC (Only if source active)
if ($sourceActive) {
    processAlerts($deviceId, [
        'aqi' => $aqi,
        'pm25' => $pm25,
        'pm10' => $pm10,
        'co' => $co,
        'co2' => $co2
    ]);
}

// Broadcast to other ACTIVE devices so multiple running devices receive readings
try {
    $allDevs = $mysqli->query("SELECT id FROM devices WHERE id != " . (int)$resolvedId . " AND is_active = 1");
    if ($allDevs) {
        $sqlShadow = "INSERT INTO readings 
            (device_id, pm1, pm25, pm10, co, aqi, o3, co2, temperature, humidity, recorded_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())";
        $stmtS = $mysqli->prepare($sqlShadow);
        $updS  = $mysqli->prepare("UPDATE devices SET status = 'online', last_heartbeat = NOW() WHERE id = ?");
        while ($row = $allDevs->fetch_assoc()) {
            $targetId = (int)$row['id'];
            if ($targetId === (int)$resolvedId) continue;
            if ($stmtS) {
                $stmtS->bind_param("idddiddddd",
                    $targetId, $pm1, $pm25, $pm10, $co, $aqi, $o3, $co2, $temperature, $humidity
                );
                $stmtS->execute();
            }
            if ($updS) {
                $updS->bind_param("i", $targetId);
                $updS->execute();
            }
        }
        if ($stmtS) $stmtS->close();
        if ($updS) $updS->close();
    }
} catch (Throwable $e) {
    // swallow broadcast errors to avoid breaking ingestion
}

echo "OK";
