<?php
// api/sms_sender_lib.php

function sendAlertSMS(PDO $pdo, $alertId) {
    // 1. Fetch Alert Details
    $stmt = $pdo->prepare("
        SELECT a.id, a.device_id, a.metric, a.value, a.threshold, a.message, a.triggered_at,
               d.name AS device_name, d.barangay_id,
               b.name AS barangay_name
          FROM alerts a
          JOIN devices d ON d.id = a.device_id
     LEFT JOIN barangays b ON b.id = d.barangay_id
         WHERE a.id = :id
           AND (a.sent_sms_at IS NULL)
         LIMIT 1
    ");
    $stmt->execute([':id' => $alertId]);
    $alert = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$alert) {
        return false; // Alert not found or already sent
    }

    $barangayId = $alert['barangay_id'];
    if (empty($barangayId)) {
        return false; // No location associated
    }

    // 2. Fetch Subscribers
    // 2. Fetch Subscribers (Scoped to Device + Area)
    // Priority: Subscribers explicitly assigned to this Device ID
    // Fallback: Subscribers in the same Barangay with NO specific device assigned (catch-all)
    $subStmt = $pdo->prepare("
        SELECT mobile 
        FROM subscribers 
        WHERE device_id = :did 
           OR (device_id IS NULL AND barangay_id = :bid)
    ");
    $subStmt->execute([':did' => $alert['device_id'], ':bid' => $barangayId]);
    $subs = $subStmt->fetchAll(PDO::FETCH_COLUMN);

    if (empty($subs)) {
        return false; // No one to notify
    }

    // 3. Load Templates
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
    $cautionTpl = $templates['caution_alert'] ?? 'EcoPulse Caution: High pollution in {area}.';
    $criticalTpl = $templates['pollution_alert'] ?? 'EcoPulse Critical: Hazardous air in {area}.';

    // 4. Construct Message
    $metric = strtoupper($alert['metric']);
    $value = $alert['value'] ?? '--';
    $area = $alert['barangay_name'] ?: 'your area';
    $threshold = $alert['threshold'] ?? 100;
    
    // Determine Criticality
    $valNum = is_numeric($value) ? (float)$value : null;
    $thrNum = is_numeric($threshold) ? (float)$threshold : null;
    
    $isCritical = false;
    $aqiCat = 'Unhealthy/Caution';
    // Standardize: AQI 101-150 = CAUTION (Yellow), 151+ = CRITICAL (Red).
    if ($metric === 'AQI' && $valNum !== null) {
        if ($valNum >= 151) {
            $isCritical = true;
            $aqiCat = 'Critical';
        } elseif ($valNum >= 101) {
            $isCritical = false;
            $aqiCat = 'Unhealthy';
        } else {
            return false;
        }
    } else {
        if ($valNum !== null && $thrNum !== null) {
            $isCritical = $valNum >= ($thrNum * 1.5);
        }
        $aqiCat = $isCritical ? 'Critical' : 'Unhealthy/Caution';
    }

    // Sub Placeholders
    $tplContent = $isCritical ? $criticalTpl : $cautionTpl;
    $body = str_replace(
        ['{area}', '{aqi}', '{aqi_category}'], 
        [$area, $value, $aqiCat], 
        $tplContent
    );
     
    if (trim($body) === '') {
         $body = "EcoPulse Alert: {$area} air quality is {$value} ({$aqiCat}).";
    }

    // 5. Send
    // Use env vars inside the function or pass them? Safer to fetch from env here.
    $IPROG_BASE_URL   = rtrim(getenv('IPROG_BASE_URL') ?: 'https://www.iprogsms.com/api/v1/sms_messages', '/');
    $IPROG_API_TOKEN  = '';
    $tokenFile = __DIR__ . '/../data/iprog_token.txt';
    if (file_exists($tokenFile)) {
        $IPROG_API_TOKEN = trim((string) file_get_contents($tokenFile));
    }
    if ($IPROG_API_TOKEN === '') {
        $IPROG_API_TOKEN = getenv('IPROG_API_TOKEN') ?: '19d7d48ba32a2b9263c25e70d2cd932b0f9ce2e0';
    }
    $IPROG_SMS_PROVIDER = getenv('IPROG_SMS_PROVIDER') ?: null;

    $allSent = true;
    foreach ($subs as $mobile) {
        $cleanMobile = preg_replace('/[^0-9]/', '', $mobile);
        if (strlen($cleanMobile) === 11 && $cleanMobile[0] === '0') {
            $cleanMobile = '63' . substr($cleanMobile, 1);
        }
        if ($cleanMobile === '') continue;

        // Send via IPROG (Synchronous Request)
        $ch = curl_init($IPROG_BASE_URL);
        $payload = [
            'api_token' => $IPROG_API_TOKEN,
            'phone_number' => $cleanMobile,
            'message' => $body
        ];
        if ($IPROG_SMS_PROVIDER) $payload['sms_provider'] = $IPROG_SMS_PROVIDER;

        curl_setopt_array($ch, [
            CURLOPT_POST => true,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_HTTPHEADER => [
                'Content-Type: application/x-www-form-urlencoded',
                'Accept: application/json'
            ],
            CURLOPT_POSTFIELDS => http_build_query($payload),
            CURLOPT_TIMEOUT => 5
        ]);
        $respRaw = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $err = curl_error($ch);
        curl_close($ch);
        
        $resp = json_decode($respRaw, true);
        $respStatus = $resp['status'] ?? ($resp['data']['status'] ?? null);
        $respSuccess = $resp['success'] ?? ($resp['data']['success'] ?? null);
        $respMsg = $resp['message'] ?? ($resp['data']['message'] ?? null);
        $success = ($httpCode >= 200 && $httpCode < 300)
            && !$err
            && (
                $respStatus === 200
                || (is_string($respStatus) && strtolower($respStatus) === 'success')
                || $respSuccess === true
                || (is_string($respMsg) && stripos($respMsg, 'success') !== false)
            );
        $errorMsg = $err ?: ($respMsg ?: ($respRaw ?: 'TIMEOUT'));

        // Log it
        $logStmt = $pdo->prepare("INSERT INTO sms_logs (mobile, message, provider, status, error, area_id, area_name, alert_id) VALUES (?, ?, 'IPROG', ?, ?, ?, ?, ?)");
        $logStmt->execute([
            $cleanMobile, 
            $body, 
            $success ? 'sent' : 'failed', 
            $success ? null : $errorMsg, 
            $barangayId, 
            $area, 
            $alertId
        ]);
        
        if (!$success) $allSent = false;
    }

    // 6. Mark Alert as Sent
    if ($allSent) {
        $upd = $pdo->prepare("UPDATE alerts SET sent_sms_at = NOW(), sms_attempts = sms_attempts + 1 WHERE id = :id");
        $upd->execute([':id' => $alertId]);
    } else {
        $upd = $pdo->prepare("UPDATE alerts SET sms_attempts = sms_attempts + 1, last_sms_error = 'Partial/Fail' WHERE id = :id");
        $upd->execute([':id' => $alertId]);
    }
}
