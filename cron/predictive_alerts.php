<?php
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../lib/forecast_engine.php';

// Log file for the cron job
$runtimeDir = sys_get_temp_dir() . '/ecopulse';
if (!is_dir($runtimeDir)) {
    @mkdir($runtimeDir, 0775, true);
}
$logFile = $runtimeDir . '/predictive_alerts.log';

function writeLog($message) {
    global $logFile;
    $timestamp = date('Y-m-d H:i:s');
    @file_put_contents($logFile, "[$timestamp] $message\n", FILE_APPEND);
    error_log("[EcoPulse predictive_alerts] $message");
    echo "[$timestamp] $message\n";
}

writeLog("Starting Predictive SMS Engine...");

try {
    $pdo = db();

    // 1. Get all active monitors
    $stmt = $pdo->query("
        SELECT d.id, d.name, d.device_code, d.barangay_id, b.name as area 
        FROM devices d
        LEFT JOIN barangays b ON d.barangay_id = b.id 
        WHERE d.status != 'offline'
    ");
    $devices = $stmt->fetchAll(PDO::FETCH_ASSOC);
    $deviceIds = array_column($devices, 'id');

    if (empty($deviceIds)) {
        writeLog("No active devices found. Exiting.");
        exit;
    }

    // 2. Generate forecasts for the next 60 minutes
    $forecasts = eco_build_forecast_map($pdo, $deviceIds, 120, 60);

    // 3. Check for threshold crossing & send SMS
    $smsSentCount = 0;
    
    foreach ($devices as $device) {
        $did = (int)$device['id'];
        
        if (!isset($forecasts[$did])) continue;
        
        $forecast = $forecasts[$did];
        $predictedAqi = $forecast['forecast_aqi'];
        $currentAqi = $forecast['current_aqi'];
        $direction = $forecast['direction'];

        // Trigger condition: Predicted AQI crosses into Unhealthy (>150), and is rising
        if ($predictedAqi > 150 && $currentAqi <= 150 && $direction === 'rising') {
            
            // Check if we already sent an alert recently
            $throttleFlag = $runtimeDir . "/alert_throttle_{$did}.lock";
            
            if (file_exists($throttleFlag)) {
                $lastSent = filemtime($throttleFlag);
                // 3 hour cooldown
                if ((time() - $lastSent) < (3 * 3600)) {
                    writeLog("Skipping SMS for device {$device['name']} - cooldown active.");
                    continue;
                }
            }

            // --- TRIGGER REAL SMS ---
            // 1. Fetch subscribers for this area/device
            $areaId = $device['barangay_id'] ?? null;
            if (!$areaId) {
                // Try to resolve areaId from name if missing from query
                $aStmt = $pdo->prepare("SELECT id FROM barangays WHERE name = ? LIMIT 1");
                $aStmt->execute([$device['area']]);
                $aRow = $aStmt->fetch(PDO::FETCH_ASSOC);
                if ($aRow) $areaId = $aRow['id'];
            }

            $stmtMobs = $pdo->prepare("SELECT mobile FROM subscribers WHERE device_id = ? OR (device_id IS NULL AND barangay_id = ?)");
            $stmtMobs->execute([$did, $areaId]);
            $mobiles = $stmtMobs->fetchAll(PDO::FETCH_COLUMN);

            if (empty($mobiles)) {
                writeLog("No subscribers found for {$device['area']}. Skipping SMS dispatch.");
                continue;
            }

            $smsMessage = "ECOPULSE ALERT: AQI in {$device['area']} is predicted to reach UNHEALTHY within 60 mins. Limit outdoor activities. Reply STOP to unsubscribe.";
            writeLog(">>> DISPATCHING SMS WARNING for {$device['name']} to " . count($mobiles) . " subscribers.");

            // 2. Setup Provider Credentials (env-driven)
            $IPROG_BASE_URL = rtrim(getenv('IPROG_BASE_URL') ?: 'https://www.iprogsms.com/api/v1/sms_messages', '/');
            $IPROG_API_TOKEN = (string) (getenv('IPROG_API_TOKEN') ?: '');
            if ($IPROG_API_TOKEN === '') {
                $tokenFile = __DIR__ . '/../data/iprog_token.txt';
                if (is_readable($tokenFile)) {
                    $IPROG_API_TOKEN = trim((string) file_get_contents($tokenFile));
                }
            }
            $IPROG_SMS_PROVIDER = getenv('IPROG_SMS_PROVIDER') ?: null;
            if ($IPROG_API_TOKEN === '') {
                writeLog("Skipping SMS for {$device['name']} - IPROG_API_TOKEN missing.");
                continue;
            }

            // Simple cURL helper for IPROG
            $inlineSendIprog = static function ($to, $msg, $url, $tok, $prov): string {
                $to = preg_replace('/[^0-9]/', '', $to);
                if (strlen($to) === 11 && $to[0] === '0') {
                    $to = '63' . substr($to, 1);
                }
                $payload = ['api_token' => $tok, 'phone_number' => $to, 'message' => $msg];
                if ($prov !== null) {
                    $payload['sms_provider'] = $prov;
                }
                
                $ch = curl_init($url);
                curl_setopt_array($ch, [
                    CURLOPT_POST => true, CURLOPT_RETURNTRANSFER => true,
                    CURLOPT_HTTPHEADER => ['Content-Type: application/x-www-form-urlencoded', 'Accept: application/json'],
                    CURLOPT_POSTFIELDS => http_build_query($payload)
                ]);
                $resp = curl_exec($ch);
                $http = curl_getinfo($ch, CURLINFO_HTTP_CODE);
                curl_close($ch);
                return $http >= 200 && $http < 300 ? 'Sent' : 'Failed';
            };

            // 3. Dispatch to all subscribers
            $successCount = 0;
            foreach ($mobiles as $mobile) {
                // Defaulting to IPROG as per sms.php logic preference for this server
                $status = $inlineSendIprog($mobile, $smsMessage, $IPROG_BASE_URL, $IPROG_API_TOKEN, $IPROG_SMS_PROVIDER);
                if ($status === 'Sent') $successCount++;
                
                // 4. Log to sms_logs table
                try {
                    $logStmt = $pdo->prepare("INSERT INTO sms_logs (mobile, message, provider, status, area_name) VALUES (?, ?, ?, ?, ?)");
                    $logStmt->execute([$mobile, $smsMessage, 'IPROG Auto-Predict', $status, $device['area']]);
                } catch (Exception $e) { /* ignore log error */ }
            }

            @file_put_contents($throttleFlag, (string)time());
            $smsSentCount++;
            writeLog("Successfully sent to $successCount/" . count($mobiles) . " subscribers.");

        } else {
             writeLog("Device {$device['name']} safe. Current: {$currentAqi}, Predicted: {$predictedAqi} ({$direction})");
        }
    }

    writeLog("Engine finished. $smsSentCount alert(s) dispatched.");

} catch (Exception $e) {
    writeLog("CRITICAL ERROR: " . $e->getMessage());
}
