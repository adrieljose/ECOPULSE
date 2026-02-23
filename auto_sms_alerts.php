<?php
/**
 * Automated SMS alerts dispatcher.
 * Run via cron/task scheduler: php auto_sms_alerts.php
 */
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/lib/activity_logger.php';

$pdo = db();

// Provider configuration (env-driven; IPROG as default)
$IPROG_BASE_URL   = rtrim(getenv('IPROG_BASE_URL') ?: 'https://www.iprogsms.com/api/v1/sms_messages', '/');
$IPROG_API_TOKEN  = '';
$tokenFile = __DIR__ . '/data/iprog_token.txt';
if (file_exists($tokenFile)) {
    $IPROG_API_TOKEN = trim((string) file_get_contents($tokenFile));
}
if ($IPROG_API_TOKEN === '') {
    $IPROG_API_TOKEN = getenv('IPROG_API_TOKEN') ?: '';
}
$IPROG_SMS_PROVIDER = getenv('IPROG_SMS_PROVIDER') ?: null; // 0|1|2 per IPROG docs

$cooldownSeconds = 600; // resend at most once per 10 minutes per device/severity

if ($IPROG_API_TOKEN === '') {
    echo "[WARN] IPROG_API_TOKEN missing. Exiting.\n";
    exit(0);
}

// Ensure columns exist for tracking
ensureColumns($pdo, [
    "ALTER TABLE alerts ADD COLUMN sent_sms_at DATETIME NULL",
    "ALTER TABLE alerts ADD COLUMN sms_attempts TINYINT UNSIGNED NOT NULL DEFAULT 0",
    "ALTER TABLE alerts ADD COLUMN last_sms_error VARCHAR(255) NULL",
    "CREATE TABLE IF NOT EXISTS sms_logs (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        mobile VARCHAR(32) NOT NULL,
        message TEXT NOT NULL,
        provider VARCHAR(32) DEFAULT NULL,
        status VARCHAR(16) DEFAULT NULL,
        error TEXT NULL,
        area_id INT NULL,
        area_name VARCHAR(255) NULL,
        alert_id INT NULL,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_mobile (mobile),
        INDEX idx_area (area_id),
        INDEX idx_created_at (created_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4"
]);
// Ensure severity column exists for alerts (yellow/red)
try { $pdo->exec("ALTER TABLE alerts ADD COLUMN severity VARCHAR(16) NOT NULL DEFAULT 'yellow'"); } catch (Throwable $e) { /* ignore */ }

// Backfill subscribers.device_id based on matching barangay_id so device-scoped sends work
try {
    $devRows = $pdo->query("SELECT id, barangay_id FROM devices WHERE barangay_id IS NOT NULL")->fetchAll(PDO::FETCH_ASSOC);
    $barangayToDevice = [];
    foreach ($devRows as $dr) {
        $bid = (int)$dr['barangay_id'];
        // If multiple devices share a barangay, keep the first (or last) — simple heuristic
        $barangayToDevice[$bid] = (int)$dr['id'];
    }
    $subsMissing = $pdo->query("SELECT id, barangay_id FROM subscribers WHERE device_id IS NULL AND barangay_id IS NOT NULL")->fetchAll(PDO::FETCH_ASSOC);
    if ($subsMissing) {
        $upd = $pdo->prepare("UPDATE subscribers SET device_id = :did WHERE id = :id");
        foreach ($subsMissing as $s) {
            $bid = (int)$s['barangay_id'];
            if (isset($barangayToDevice[$bid])) {
                $upd->execute([':did' => $barangayToDevice[$bid], ':id' => (int)$s['id']]);
            }
        }
    }
} catch (Throwable $e) { /* ignore backfill errors */ }

// Fetch open alerts not yet sent (limit to avoid hammering)
$stmt = $pdo->prepare("
    SELECT a.id, a.device_id, a.metric, a.value, a.threshold, a.severity, a.message, a.triggered_at,
           a.sms_attempts, d.name AS device_name, d.barangay_id,
           b.name AS barangay_name
      FROM alerts a
      JOIN devices d ON d.id = a.device_id
 LEFT JOIN barangays b ON b.id = d.barangay_id
     WHERE a.status = 'open'
       AND (a.sent_sms_at IS NULL OR a.sent_sms_at <= (NOW() - INTERVAL {$cooldownSeconds} SECOND))
       AND (a.sms_attempts < 30)
  ORDER BY a.triggered_at ASC
     LIMIT 50
");
$stmt->execute();
$alerts = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Fallback: if no pending alerts, auto-create from latest readings that are high
if (empty($alerts)) {
    try {
        $latestHigh = $pdo->query("
            SELECT r.device_id, r.aqi, d.barangay_id, d.name AS device_name, b.name AS barangay_name
            FROM readings r
            JOIN devices d ON d.id = r.device_id
            LEFT JOIN barangays b ON b.id = d.barangay_id
            WHERE r.recorded_at = (
                SELECT MAX(r2.recorded_at) FROM readings r2 WHERE r2.device_id = r.device_id
            )
            AND r.aqi >= 101
        ")->fetchAll(PDO::FETCH_ASSOC);
        foreach ($latestHigh as $lh) {
            $sev = ($lh['aqi'] >= 151) ? 'red' : 'yellow';
            // Insert only if none open for this severity
            $chk = $pdo->prepare("SELECT id FROM alerts WHERE device_id = :did AND metric='AQI' AND severity = :sev AND status='open' LIMIT 1");
            $chk->execute([':did' => $lh['device_id'], ':sev' => $sev]);
            if (!$chk->fetch()) {
                $ins = $pdo->prepare("
                    INSERT INTO alerts (device_id, metric, value, threshold, severity, message, status, triggered_at)
                    VALUES (:did, 'AQI', :val, 101, :sev, :msg, 'open', NOW())
                ");
                $msg = "AQI reached {$lh['aqi']}";
                $ins->execute([
                    ':did' => $lh['device_id'],
                    ':val' => $lh['aqi'],
                    ':sev' => $sev,
                    ':msg' => $msg
                ]);
            }
        }
    } catch (Throwable $e) { /* ignore */ }

    // Re-query alerts after fallback insertion
    $stmt->execute();
    $alerts = $stmt->fetchAll(PDO::FETCH_ASSOC);
    if (empty($alerts)) {
        echo "[INFO] No pending alerts.\n";
        exit(0);
    }
}

// Load Templates
$templateFile = __DIR__ . '/data/sms_templates.json';
$templates = [];
if (file_exists($templateFile)) {
    $rawTpl = json_decode(file_get_contents($templateFile), true);
    if (is_array($rawTpl)) {
        foreach ($rawTpl as $t) {
            $templates[$t['id']] = $t['content'];
        }
    }
}
$cautionTpl = $templates['caution_alert'] ?? 'EcoPulse Caution: High pollution detected in {area}. Limit outdoor exposure.';
$criticalTpl = $templates['pollution_alert'] ?? 'EcoPulse Alert: Critical pollution levels in {area}. Stay indoors.';

$adminMobiles = [];
try {
    $admStmt = $pdo->query("SELECT contact_number FROM admins WHERE contact_number IS NOT NULL AND contact_number <> ''");
    $rows = $admStmt->fetchAll(PDO::FETCH_COLUMN);
    foreach ($rows as $m) {
        $clean = preg_replace('/[^0-9+]/', '', $m);
        if ($clean !== '' && !in_array($clean, $adminMobiles, true)) {
            $adminMobiles[] = $clean;
        }
    }
} catch (Throwable $e) { /* ignore */ }

$subStmt = $pdo->prepare("SELECT mobile FROM subscribers WHERE device_id = :did");
$updateSuccess = $pdo->prepare("UPDATE alerts SET sent_sms_at = NOW(), sms_attempts = sms_attempts + 1, last_sms_error = NULL WHERE id = :id");
$updateFail = $pdo->prepare("UPDATE alerts SET sms_attempts = sms_attempts + 1, last_sms_error = :err WHERE id = :id");

foreach ($alerts as $alert) {
    $subs = [];
    if (!empty($alert['device_id'])) {
        $subStmt->execute([
            ':did' => (int) ($alert['device_id'])
        ]);
        $subs = $subStmt->fetchAll(PDO::FETCH_COLUMN);
    }

    if (empty($subs)) {
        echo "[WARN] Alert {$alert['id']} has no subscribers in barangay_id {$alert['barangay_id']}.\n";
        $updateFail->execute([
            ':err' => 'No subscribers for area',
            ':id'  => (int) $alert['id'],
        ]);
        continue;
    }

    $metric = strtoupper($alert['metric']);
    $value = $alert['value'] ?? '--';
    $threshold = $alert['threshold'] ?? '--';
    $area = $alert['barangay_name'] ?: 'your area';
    $device = $alert['device_name'] ?: 'device';
    $when = $alert['triggered_at'] ? date('M d, Y H:i', strtotime($alert['triggered_at'])) : 'recently';

    $valNum = is_numeric($value) ? (float)$value : null;
    $thrNum = is_numeric($threshold) ? (float)$threshold : null;
    $isCritical = false;
    $aqiCat = 'Unhealthy/Caution';
    if ($metric === 'AQI' && $valNum !== null) {
        if ($valNum >= 151) {
            $isCritical = true;
            $aqiCat = 'Critical';
        } elseif ($valNum >= 101) {
            $isCritical = false;
            $aqiCat = 'Unhealthy';
        } else {
            $updateFail->execute([
                ':err' => 'Below AQI threshold',
                ':id'  => (int) $alert['id'],
            ]);
            continue;
        }
    } else {
        if ($valNum !== null && $thrNum !== null) {
            $isCritical = $valNum >= ($thrNum * 1.5);
        }
        if (!empty($alert['severity'])) {
            $isCritical = (strtolower($alert['severity']) === 'red');
        }
        $aqiCat = $isCritical ? 'Critical' : 'Unhealthy/Caution';
    }
    $prefix = $isCritical ? 'Critical Pollution Alert' : 'Caution';
    
    // Select Template
    $tplContent = $isCritical ? $criticalTpl : $cautionTpl;
    
    // Prepare Placeholders
    // If logic above derived specific categories, usage would be better.
    // Assuming $alert may contain 'category' if we saved it, but we didn't. 
    // We'll stick to determining it from the threshold logic or just generic descriptions.
    
    // Replacing {area}, {aqi}, {aqi_category}
    $body = str_replace(
        ['{area}', '{aqi}', '{aqi_category}'], 
        [$area, $value, $aqiCat], 
        $tplContent
    );
     
    // Fallback if template is empty
    if (trim($body) === '') {
         $body = "EcoPulse Alert: {$area} air quality is {$value} ({$aqiCat}). Please take precautions.";
    }

    $allSent = true;
    foreach ($subs as $mobile) {
        $cleanMobile = preg_replace('/[^0-9+]/', '', $mobile);
        if ($cleanMobile === '') {
            continue;
        }
        $resp = send_sms_iprog($cleanMobile, $body, $IPROG_BASE_URL, $IPROG_API_TOKEN, $IPROG_SMS_PROVIDER);
        log_sms_send($pdo, $cleanMobile, $body, 'IPROG', $resp['success'] ? 'sent' : 'failed', $resp['success'] ? null : ($resp['response'] ?? ($resp['status'] ?? 'error')), (int)($alert['barangay_id'] ?? 0) ?: null, $alert['barangay_name'] ?? null, (int)$alert['id']);
        if (!$resp['success']) {
            $allSent = false;
            echo "[ERR] Alert {$alert['id']} to {$cleanMobile} failed: {$resp['status']} {$resp['response']}\n";
        } else {
            echo "[OK] Alert {$alert['id']} sent to {$cleanMobile}\n";
        }
    }

    if ($allSent) {
        $updateSuccess->execute([':id' => (int) $alert['id']]);

        // Notify admins/masteradmin that SMS was sent for this device/area
        if (!empty($adminMobiles)) {
            $adminMsg = "[Admin Notice] SMS alerts sent for {$device} ({$area}), AQI {$value}.";
            foreach ($adminMobiles as $am) {
                $resp = send_sms_iprog($am, $adminMsg, $IPROG_BASE_URL, $IPROG_API_TOKEN, $IPROG_SMS_PROVIDER);
                log_sms_send($pdo, $am, $adminMsg, 'IPROG', $resp['success'] ? 'sent' : 'failed', $resp['success'] ? null : ($resp['response'] ?? ($resp['status'] ?? 'error')), (int)($alert['barangay_id'] ?? 0) ?: null, $alert['barangay_name'] ?? null, (int)$alert['id']);
            }
        }

        // Log to activity feed so the web UI can show a record that SMS was sent
        try {
            logActivity($pdo, 'admin', 0, 'SMS Alert Sent', "Device {$device} ({$area}) AQI {$value}", 'SMS');
        } catch (Throwable $e) { /* ignore log errors */ }
    } else {
        $updateFail->execute([
            ':err' => 'One or more sends failed',
            ':id'  => (int) $alert['id'],
        ]);
    }
}

// --- Helpers ---
function ensureColumns(PDO $pdo, array $queries): void
{
    foreach ($queries as $sql) {
        try { $pdo->exec($sql); } catch (Throwable $e) { /* ignore if exists */ }
    }
}

function log_sms_send(PDO $pdo, string $mobile, string $message, ?string $provider, string $status, ?string $error, ?int $areaId = null, ?string $areaName = null, ?int $alertId = null): void
{
    try {
        $stmt = $pdo->prepare("
            INSERT INTO sms_logs (mobile, message, provider, status, error, area_id, area_name, alert_id)
            VALUES (:mobile, :message, :provider, :status, :error, :area_id, :area_name, :alert_id)
        ");
        $stmt->execute([
            ':mobile' => $mobile,
            ':message' => $message,
            ':provider' => $provider,
            ':status' => $status,
            ':error' => $error,
            ':area_id' => $areaId,
            ':area_name' => $areaName,
            ':alert_id' => $alertId,
        ]);
    } catch (Throwable $e) {
        // ignore logging issues
    }
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
        'raw' => $response
    ];
}
