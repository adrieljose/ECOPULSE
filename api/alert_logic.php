<?php
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/sms_sender_lib.php';

function processAlerts($deviceId, $metrics) {
    try {
        $pdo = db();
        
        // Defined Thresholds
        // AQI: 0-50 Good, 51-100 Moderate, 101-150 Unhealthy for SG, 151-200 Unhealthy, 201+ Very Unhealthy
        $thresholds = [
            'aqi' => ['caution' => 101, 'critical' => 151],
            'pm25' => ['caution' => 35.5, 'critical' => 55.5], // US EPA standards roughly
            'pm10' => ['caution' => 155, 'critical' => 255],
            'co' => ['caution' => 50, 'critical' => 200], // ppm
            'co2' => ['caution' => 2000, 'critical' => 5000] // ppm
        ];

        // Check AQI (Priority)
        if (isset($metrics['aqi']) && is_numeric($metrics['aqi'])) {
            $val = (float)$metrics['aqi'];
            checkAndInsertAlert($pdo, $deviceId, 'aqi', $val, $thresholds['aqi']);
        }
        
        // Can add other checks (PM2.5) if needed, but AQI usually covers the overall state.
        // For robustness, let's check PM2.5 specifically if AQI is missing or low but PM is high (rare but possible).
        if (isset($metrics['pm25']) && is_numeric($metrics['pm25'])) {
             $val = (float)$metrics['pm25'];
             checkAndInsertAlert($pdo, $deviceId, 'pm25', $val, $thresholds['pm25']);
        }
        
        // Check Gases (Lighter Test support)
        if (isset($metrics['co']) && is_numeric($metrics['co'])) {
             $val = (float)$metrics['co'];
             checkAndInsertAlert($pdo, $deviceId, 'co', $val, $thresholds['co']);
        }
        if (isset($metrics['co2']) && is_numeric($metrics['co2'])) {
             $val = (float)$metrics['co2'];
             checkAndInsertAlert($pdo, $deviceId, 'co2', $val, $thresholds['co2']);
        }

    } catch (Exception $e) {
        // Silently fail to not disrupt ingestion
        error_log("Alert processing failed: " . $e->getMessage());
    }
}

function checkAndInsertAlert($pdo, $deviceId, $metric, $value, $limits) {
    // Determine level
    $level = null;
    $threshold = 0;
    
    if ($value >= $limits['critical']) {
        $level = 'critical';
        $threshold = $limits['critical'];
    } elseif ($value >= $limits['caution']) {
        $level = 'caution';
        $threshold = $limits['caution'];
    }
    
    if (!$level) return; // Safe levels

    // Check for existing OPEN alert for this device+metric
    // We want to avoid duplicate alerts. 
    // Logic: If there is an 'open' alert created in the last 6 hours, don't create a new one.
    // Or just look for ANY open alert. The 'auto_sms_alerts.php' processes them. 
    // Once processed, they might stay open until manually closed? 
    // Let's check the Schema. `status` enum('open','ack','closed').
    
    $stmt = $pdo->prepare("SELECT id FROM alerts WHERE device_id = :did AND metric = :m AND status = 'open' LIMIT 1");
    $stmt->execute([':did' => $deviceId, ':m' => $metric]);
    $existing = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$existing) {
        // Create New Alert
        $msg = "High {$metric} level detected: {$value} (Threshold: {$threshold})";
        $ins = $pdo->prepare("INSERT INTO alerts (device_id, metric, value, threshold, message, status, triggered_at) VALUES (:did, :m, :v, :t, :msg, 'open', NOW())");
        $ins->execute([
            ':did' => $deviceId, 
            ':m' => $metric, 
            ':v' => $value, 
            ':t' => $threshold,
            ':msg' => $msg
        ]);
        error_log("New Alert Created: Device $deviceId, $metric $value");
        
        // IMMEDIATE SEND (Synchronous)
        sendAlertSMS($pdo, $pdo->lastInsertId());
    } else {
        // Optional: Update the value of the existing alert?
        // Let's just update the value and triggered_at so it stays 'fresh'
        // But we don't want to re-trigger SMS if it was already sent.
        // auto_sms_alerts checks `sent_sms_at IS NULL`.
        // So updating value is fine.
        $upd = $pdo->prepare("UPDATE alerts SET value = :v, triggered_at = NOW() WHERE id = :id");
        $upd->execute([':v' => $value, ':id' => $existing['id']]);
    }
}
