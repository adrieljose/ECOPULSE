<?php
/**
 * API Endpoint: Trigger SMS Check
 * 
 * Called from the dashboard when AQI reaches warning/critical levels.
 * Checks for pending alerts and triggers SMS sending for the specified device.
 * Returns JSON with the result for popup notifications.
 */

header('Content-Type: application/json');
header('Cache-Control: no-cache');

require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../lib/activity_logger.php';

// Provider configuration (env-driven; IPROG as default)
$IPROG_BASE_URL   = rtrim(getenv('IPROG_BASE_URL') ?: 'https://www.iprogsms.com/api/v1/sms_messages', '/');
$IPROG_API_TOKEN  = '';
$tokenFile = __DIR__ . '/../data/iprog_token.txt';
if (file_exists($tokenFile)) {
    $IPROG_API_TOKEN = trim((string) file_get_contents($tokenFile));
}
if ($IPROG_API_TOKEN === '') {
    $IPROG_API_TOKEN = getenv('IPROG_API_TOKEN') ?: '';
}
$IPROG_SMS_PROVIDER = getenv('IPROG_SMS_PROVIDER') ?: null;

// Cooldown: prevent duplicate SMS within N seconds per device/severity
$cooldownSeconds = 600; // 10 minutes between alerts per device (documented)

$response = [
    'success' => false,
    'triggered' => false,
    'message' => '',
    'alerts' => [],
    'high_aqi_devices' => []
];

function compute_aqi_from_pollutants(array $row): ?float
{
    $breakpoints = [
        'pm25' => [
            [0.0, 12.0, 0, 50],
            [12.1, 35.4, 51, 100],
            [35.5, 55.4, 101, 150],
            [55.5, 150.4, 151, 200],
            [150.5, 250.4, 201, 300],
            [250.5, 500.4, 301, 500],
        ],
        'pm10' => [
            [0, 54, 0, 50],
            [55, 154, 51, 100],
            [155, 254, 101, 150],
            [255, 354, 151, 200],
            [355, 424, 201, 300],
            [425, 604, 301, 500],
        ],
        'o3' => [
            [0, 54, 0, 50],
            [55, 70, 51, 100],
            [71, 85, 101, 150],
            [86, 105, 151, 200],
            [106, 200, 201, 300],
        ],
        'co' => [
            [0.0, 4.4, 0, 50],
            [4.5, 9.4, 51, 100],
            [9.5, 12.4, 101, 150],
            [12.5, 15.4, 151, 200],
            [15.5, 30.4, 201, 300],
            [30.5, 50.4, 301, 500],
        ],
    ];

    $compute = function($val, $bps) {
        if ($val === null) return null;
        foreach ($bps as $bp) {
            [$clo, $chi, $ilo, $ihi] = $bp;
            if ($val >= $clo && $val <= $chi) {
                return (float)round((($ihi - $ilo) / ($chi - $clo)) * ($val - $clo) + $ilo);
            }
        }
        $last = end($bps);
        if ($last) {
            [$clo, $chi, $ilo, $ihi] = $last;
            return (float)round((($ihi - $ilo) / ($chi - $clo)) * ($val - $clo) + $ilo);
        }
        return null;
    };

    $subs = [];
    $map = [
        'pm25' => isset($row['pm25']) ? (float)$row['pm25'] : null,
        'pm10' => isset($row['pm10']) ? (float)$row['pm10'] : null,
        'o3'   => isset($row['o3']) ? (float)$row['o3'] : null,
        'co'   => isset($row['co']) ? (float)$row['co'] : null,
    ];
    foreach ($map as $key => $val) {
        if ($val === null || !isset($breakpoints[$key])) continue;
        $idx = $compute($val, $breakpoints[$key]);
        if ($idx !== null) $subs[] = $idx;
    }
    if (empty($subs)) {
        return null;
    }
    return (float)max($subs);
}

try {
    $pdo = db();
    
    // Get input
    $input = json_decode(file_get_contents('php://input'), true) ?? [];
    $deviceId = isset($input['device_id']) ? (int)$input['device_id'] : null;
    $aqi = isset($input['aqi']) ? (float)$input['aqi'] : null;
    
    // If no specific device provided, check all devices with high AQI from latest readings
    if ($deviceId === null) {
        $stmt = $pdo->query("
            SELECT r.device_id, r.aqi, r.pm25, r.pm10, r.o3, r.co,
                   d.name AS device_name, d.barangay_id, b.name AS barangay_name
            FROM readings r
            JOIN devices d ON d.id = r.device_id
            LEFT JOIN barangays b ON b.id = d.barangay_id
            WHERE d.is_active = 1
              AND r.recorded_at = (SELECT MAX(r2.recorded_at) FROM readings r2 WHERE r2.device_id = r.device_id)
            ORDER BY r.recorded_at DESC
            LIMIT 10
        ");
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
    } else {
        // Check specific device
        $stmt = $pdo->prepare("
            SELECT r.device_id, r.aqi, r.pm25, r.pm10, r.o3, r.co,
                   d.name AS device_name, d.barangay_id, b.name AS barangay_name
            FROM readings r
            JOIN devices d ON d.id = r.device_id
            LEFT JOIN barangays b ON b.id = d.barangay_id
            WHERE d.id = ? AND d.is_active = 1
            ORDER BY r.recorded_at DESC
            LIMIT 1
        ");
        $stmt->execute([$deviceId]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        $rows = $row ? [$row] : [];
    }

    $highAqiDevices = [];
    foreach ($rows as $row) {
        $computedAqi = compute_aqi_from_pollutants($row);
        $aqiVal = $computedAqi !== null ? $computedAqi : (is_numeric($row['aqi'] ?? null) ? (float)$row['aqi'] : null);
        if ($aqiVal === null) continue;
        $row['aqi'] = $aqiVal;
        if ($aqiVal >= 101) {
            $highAqiDevices[] = $row;
        }
    }
    
    $response['high_aqi_devices'] = array_map(function($device) {
        $aqiVal = (float)($device['aqi'] ?? 0);
        $severity = ($aqiVal >= 151) ? 'red' : 'yellow';
        return [
            'device_id' => (int)($device['device_id'] ?? 0),
            'device_name' => $device['device_name'] ?: 'Device',
            'area' => $device['barangay_name'] ?: 'your area',
            'aqi' => $aqiVal,
            'severity' => $severity
        ];
    }, $highAqiDevices);

    if (empty($highAqiDevices)) {
        $response['success'] = true;
        $response['message'] = 'No devices with AQI >= 101';
        echo json_encode($response);
        exit;
    }
    
    // Load Templates
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
    $cautionTpl = $templates['caution_alert'] ?? 'EcoPulse Caution: High pollution detected in {area}. AQI: {aqi}. Limit outdoor exposure.';
    $criticalTpl = $templates['pollution_alert'] ?? 'EcoPulse Alert: Critical pollution levels in {area}. AQI: {aqi}. Stay indoors.';
    
    // Process each high-AQI device
    $alertsSent = [];
    
    foreach ($highAqiDevices as $device) {
        $devId = (int)$device['device_id'];
        $aqiVal = (float)$device['aqi'];
        $severity = ($aqiVal >= 151) ? 'red' : 'yellow';
        $deviceName = $device['device_name'] ?: 'Device';
        $areaName = $device['barangay_name'] ?: 'your area';
        $barangayId = $device['barangay_id'] ?? null;
        
        // Check cooldown: allow resend after cooldown window per device/severity
        $cooldownCheck = $pdo->prepare("
            SELECT a.id, a.value AS last_sent_aqi, a.sent_sms_at
            FROM alerts a
            WHERE a.device_id = ? 
              AND a.severity = ? 
              AND a.sent_sms_at IS NOT NULL
              AND a.status = 'open'
            ORDER BY a.sent_sms_at DESC
            LIMIT 1
        ");
        $cooldownCheck->execute([$devId, $severity]);
        $lastAlert = $cooldownCheck->fetch(PDO::FETCH_ASSOC);
        
        if ($lastAlert) {
            $lastSentAt = $lastAlert['sent_sms_at'] ? strtotime($lastAlert['sent_sms_at']) : null;
            if ($lastSentAt !== null && (time() - $lastSentAt) < $cooldownSeconds) {
                continue;
            }
        }
        
        // Check if open alert exists, if not create one
        $alertCheck = $pdo->prepare("SELECT id FROM alerts WHERE device_id = ? AND severity = ? AND status = 'open' LIMIT 1");
        $alertCheck->execute([$devId, $severity]);
        $existingAlert = $alertCheck->fetch(PDO::FETCH_ASSOC);
        
        if (!$existingAlert) {
            // Create new alert
            $ins = $pdo->prepare("
                INSERT INTO alerts (device_id, metric, value, threshold, severity, message, status, triggered_at)
                VALUES (?, 'AQI', ?, ?, ?, ?, 'open', NOW())
            ");
            $msg = "AQI reached $aqiVal";
            $threshold = ($severity === 'red') ? 151 : 101;
            $ins->execute([$devId, $aqiVal, $threshold, $severity, $msg]);
            $alertId = $pdo->lastInsertId();
        } else {
            $alertId = $existingAlert['id'];
        }
        
        // Get subscribers for this device
        $subStmt = $pdo->prepare("SELECT mobile FROM subscribers WHERE device_id = ?");
        $subStmt->execute([$devId]);
        $mobiles = $subStmt->fetchAll(PDO::FETCH_COLUMN);
        
        if (empty($mobiles)) {
            // Also try barangay-based subscribers
            if ($barangayId) {
                $subStmt2 = $pdo->prepare("SELECT mobile FROM subscribers WHERE barangay_id = ? AND device_id IS NULL");
                $subStmt2->execute([$barangayId]);
                $mobiles = $subStmt2->fetchAll(PDO::FETCH_COLUMN);
            }
        }
        
        if (empty($mobiles)) {
            continue; // No subscribers for this device
        }
        
        // Select template based on severity
        $isCritical = ($severity === 'red');
        $tplContent = $isCritical ? $criticalTpl : $cautionTpl;
        $aqiCategory = $isCritical ? 'Critical' : 'Unhealthy';
        
        // Replace placeholders
        $body = str_replace(
            ['{area}', '{aqi}', '{aqi_category}'],
            [$areaName, $aqiVal, $aqiCategory],
            $tplContent
        );
        
        if (trim($body) === '') {
            $body = "EcoPulse Alert: $areaName air quality is $aqiVal ($aqiCategory). Please take precautions.";
        }
        
        // Check if API token is configured
        if ($IPROG_API_TOKEN === '') {
            // Log but don't actually send (demo mode)
            foreach ($mobiles as $mobile) {
                log_sms_send($pdo, $mobile, $body, 'DEMO', 'simulated', null, $barangayId, $areaName, $alertId);
            }
            
            // Mark alert as sent
            $pdo->prepare("UPDATE alerts SET sent_sms_at = NOW(), sms_attempts = sms_attempts + 1 WHERE id = ?")->execute([$alertId]);
            
            $alertsSent[] = [
                'device_id' => $devId,
                'device_name' => $deviceName,
                'area' => $areaName,
                'aqi' => $aqiVal,
                'severity' => $severity,
                'recipients' => count($mobiles),
                'mode' => 'demo'
            ];
            
            // Log activity
            try {
                logActivity($pdo, 'system', 0, 'SMS Alert Triggered', "Device $deviceName ($areaName) AQI $aqiVal - DEMO MODE", 'SMS');
            } catch (Throwable $e) { /* ignore */ }
            
            continue;
        }
        
        // Actually send SMS
        $allSent = true;
        $sentCount = 0;
        
        foreach ($mobiles as $mobile) {
            $cleanMobile = preg_replace('/[^0-9+]/', '', $mobile);
            if ($cleanMobile === '') continue;
            
            $resp = send_sms_iprog($cleanMobile, $body, $IPROG_BASE_URL, $IPROG_API_TOKEN, $IPROG_SMS_PROVIDER);
            log_sms_send($pdo, $cleanMobile, $body, 'IPROG', $resp['success'] ? 'sent' : 'failed', 
                $resp['success'] ? null : ($resp['response'] ?? 'error'), $barangayId, $areaName, $alertId);
            
            if ($resp['success']) {
                $sentCount++;
            } else {
                $allSent = false;
            }
        }
        
        // Update alert status
        if ($sentCount > 0) {
            $pdo->prepare("UPDATE alerts SET sent_sms_at = NOW(), sms_attempts = sms_attempts + 1, last_sms_error = NULL WHERE id = ?")->execute([$alertId]);
            
            $alertsSent[] = [
                'device_id' => $devId,
                'device_name' => $deviceName,
                'area' => $areaName,
                'aqi' => $aqiVal,
                'severity' => $severity,
                'recipients' => $sentCount,
                'mode' => 'live'
            ];
            
            // Log activity
            try {
                logActivity($pdo, 'system', 0, 'SMS Alert Sent', "Device $deviceName ($areaName) AQI $aqiVal - Sent to $sentCount recipients", 'SMS');
            } catch (Throwable $e) { /* ignore */ }
        }
    }
    
    $response['success'] = true;
    $response['triggered'] = !empty($alertsSent);
    $response['message'] = empty($alertsSent) ? 'No new alerts to send' : 'SMS alerts triggered';
    $response['alerts'] = $alertsSent;
    
} catch (Throwable $e) {
    $response['success'] = false;
    $response['message'] = 'Error: ' . $e->getMessage();
}

echo json_encode($response);
exit;

// --- Helper Functions ---

function log_sms_send(PDO $pdo, string $mobile, string $message, ?string $provider, string $status, ?string $error, ?int $areaId, ?string $areaName, ?int $alertId): void
{
    try {
        $stmt = $pdo->prepare("
            INSERT INTO sms_logs (mobile, message, provider, status, error, area_id, area_name, alert_id)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ");
        $stmt->execute([$mobile, $message, $provider, $status, $error, $areaId, $areaName, $alertId]);
    } catch (Throwable $e) { /* ignore */ }
}

function send_sms_iprog(string $to, string $body, string $baseUrl, string $token, ?string $smsProvider = null): array
{
    $to = preg_replace('/[^0-9]/', '', $to);
    if (strlen($to) === 11 && $to[0] === '0') {
        $to = '63' . substr($to, 1);
    }
    $payload = [
        'api_token'    => $token,
        'phone_number' => $to,
        'message'      => $body,
    ];
    if ($smsProvider !== null && $smsProvider !== '') {
        $payload['sms_provider'] = $smsProvider;
    }

    $ch = curl_init($baseUrl);
    curl_setopt_array($ch, [
        CURLOPT_POST           => true,
        CURLOPT_POSTFIELDS     => http_build_query($payload),
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HTTPHEADER     => [
            'Content-Type: application/x-www-form-urlencoded',
            'Accept: application/json'
        ],
        CURLOPT_TIMEOUT        => 15,
    ]);
    $response = curl_exec($ch);
    $status = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $err = curl_error($ch);
    curl_close($ch);

    $decoded = json_decode($response ?? '', true);
    $respStatus = $decoded['status'] ?? ($decoded['data']['status'] ?? null);
    $respSuccess = $decoded['success'] ?? ($decoded['data']['success'] ?? null);
    $respMsg = $decoded['message'] ?? ($decoded['data']['message'] ?? null);

    $success = ($status >= 200 && $status < 300)
        && !$err
        && (
            $respStatus === 200
            || (is_string($respStatus) && strtolower($respStatus) === 'success')
            || $respSuccess === true
        );
    
    return [
        'success'  => $success,
        'status'   => $status,
        'response' => $err ?: ($respMsg ?: $response),
    ];
}
