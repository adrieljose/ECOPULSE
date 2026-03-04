<?php
require_once __DIR__ . '/../db.php';

// Log file for the diagnostic engine
$logFile = __DIR__ . '/diagnostics_engine.log';

function writeLog($message) {
    global $logFile;
    $timestamp = date('Y-m-d H:i:s');
    file_put_contents($logFile, "[$timestamp] $message\n", FILE_APPEND);
    echo "[$timestamp] $message\n";
}

writeLog("Starting AI Diagnostics Engine...");

try {
    $pdo = db();

    // 1. Get all active monitors
    $stmt = $pdo->query("SELECT id, name, status, last_heartbeat FROM devices WHERE status != 'offline'");
    $devices = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if (empty($devices)) {
        writeLog("No active devices found. Exiting.\n");
        exit;
    }

    $ticketsCreated = 0;

    foreach ($devices as $device) {
        $did = (int)$device['id'];
        $dName = $device['name'];
        $anomalyFound = false;
        $issueType = '';
        $description = '';

        // --- Check 1: Unresponsive Node (Heartbeat missing for > 12 hours) ---
        if ($device['last_heartbeat']) {
            $hoursSince = (time() - strtotime($device['last_heartbeat'])) / 3600;
            if ($hoursSince > 12) {
                $anomalyFound = true;
                $issueType = 'Sensor Offline Protocol';
                $description = "Node has not transmitted a heartbeat in " . round($hoursSince, 1) . " hours. Possible connectivity loss or power failure.";
            }
        }

        // --- Check 2: Frozen Data Transmission (Identical readings > 6 hours) ---
        if (!$anomalyFound) {
            $rStmt = $pdo->prepare("SELECT aqi, pm25 FROM readings WHERE device_id = ? ORDER BY recorded_at DESC LIMIT 6");
            $rStmt->execute([$did]);
            $recent = $rStmt->fetchAll(PDO::FETCH_ASSOC);
            
            if (count($recent) === 6) {
                $isFrozen = true;
                $firstAQI = $recent[0]['aqi'];
                $firstPM = $recent[0]['pm25'];
                foreach ($recent as $r) {
                    if ($r['aqi'] !== $firstAQI || $r['pm25'] !== $firstPM) {
                        $isFrozen = false;
                        break;
                    }
                }
                if ($isFrozen) {
                    $anomalyFound = true;
                    $issueType = 'Frozen Telemetry';
                    $description = "Sensor is reporting identical atmospheric values (AQI: $firstAQI, PM2.5: $firstPM) for 6 consecutive cycles. Laser scattering fan may be obstructed.";
                }
            }
        }

        // --- Check 3: Erratic Spikes (Jump of > 200 AQI in 1 hour) ---
        if (!$anomalyFound) {
            if (isset($recent) && count($recent) >= 2) {
                $currentAQI = (float)$recent[0]['aqi'];
                $prevAQI = (float)$recent[1]['aqi'];
                if (abs($currentAQI - $prevAQI) > 200) {
                    $anomalyFound = true;
                    $issueType = 'Erratic Sensor Calibration';
                    $description = "Detected an impossible variance (Delta: " . abs($currentAQI - $prevAQI) . ") between consecutive hourly readings. Hardware recalibration required.";
                }
            }
        }

        // --- Create Ticket if Anomaly Detected ---
        if ($anomalyFound) {
            // Ensure no existing OPEN ticket for this device of the SAME issue type
            $checkStmt = $pdo->prepare("SELECT id FROM maintenance_tickets WHERE device_id = ? AND issue_type = ? AND status = 'Open'");
            $checkStmt->execute([$did, $issueType]);
            
            if (!$checkStmt->fetch()) {
                writeLog(">> ANOMALY DETECTED on {$dName}: {$issueType}");
                $insertStmt = $pdo->prepare("INSERT INTO maintenance_tickets (device_id, issue_type, description) VALUES (?, ?, ?)");
                $insertStmt->execute([$did, $issueType, $description]);
                
                // Flag device on map as Warning
                $updateStmt = $pdo->prepare("UPDATE devices SET status = 'warning' WHERE id = ?");
                $updateStmt->execute([$did]);
                
                $ticketsCreated++;
            }
        }
    }

    writeLog("Diagnostics finished. {$ticketsCreated} new maintenance ticket(s) issued.\n");

} catch (Exception $e) {
    writeLog("CRITICAL ERROR: " . $e->getMessage() . "\n");
}
