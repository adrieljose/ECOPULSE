<?php
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/lib/forecast_engine.php'; // Re-use AQI calculation logic

$deviceId = isset($_GET['id']) ? (int)$_GET['id'] : 0;
if ($deviceId <= 0) {
    die("Invalid Device ID");
}

$pdo = db();
// Fetch latest reading & device info
$stmt = $pdo->prepare("
    SELECT d.name, b.name AS area, r.aqi, r.pm25, r.temperature, r.humidity, r.recorded_at 
    FROM devices d
    LEFT JOIN barangays b ON d.barangay_id = b.id
    LEFT JOIN readings r ON r.device_id = d.id
    WHERE d.id = ? AND d.status != 'offline'
    ORDER BY r.recorded_at DESC LIMIT 1
");
$stmt->execute([$deviceId]);
$data = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$data) {
    // Return a graceful "Offline" widget
    $data = [
        'name' => 'EcoPulse Sensor',
        'area' => 'Unknown',
        'aqi' => null,
        'pm25' => null,
        'temperature' => null,
        'humidity' => null,
        'recorded_at' => null
    ];
}

$aqi = $data['aqi'] !== null ? (int)$data['aqi'] : null;
$category = eco_aqi_category($aqi);

// Determine Widget Color based on AQI
$bgColor = '#e2e8f0'; // Offline Gray
$textColor = '#475569';
if ($aqi !== null) {
    if ($aqi <= 50) { $bgColor = '#dcfce7'; $textColor = '#166534'; } // Good (Green)
    elseif ($aqi <= 100) { $bgColor = '#fef08a'; $textColor = '#854d0e'; } // Moderate (Yellow)
    elseif ($aqi <= 150) { $bgColor = '#ffedd5'; $textColor = '#9a3412'; } // Unhealthy for SG (Orange)
    elseif ($aqi <= 200) { $bgColor = '#fecaca'; $textColor = '#991b1b'; } // Unhealthy (Red)
    elseif ($aqi <= 300) { $bgColor = '#e9d5ff'; $textColor = '#6b21a8'; } // Very Unhealthy (Purple)
    else { $bgColor = '#fecdd3'; $textColor = '#881337'; } // Hazardous (Maroon)
}

$timeAgo = $data['recorded_at'] ? date('h:i A', strtotime($data['recorded_at'])) : 'Offline';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>EcoPulse Widget</title>
    <style>
        body {
            margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            background: transparent; overflow: hidden;
        }
        .widget-container {
            display: flex; flex-direction: row; align-items: center; justify-content: space-between;
            background-color: <?= $bgColor ?>;
            color: <?= $textColor ?>;
            border-radius: 12px;
            padding: 12px 16px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.05);
            border: 1px solid rgba(0,0,0,0.05);
            width: 100%; box-sizing: border-box;
            text-decoration: none;
            transition: transform 0.2s;
        }
        .widget-container:hover { transform: translateY(-2px); box-shadow: 0 6px 12px rgba(0,0,0,0.1); }
        .widget-left { display: flex; flex-direction: column; }
        .widget-title { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; opacity: 0.8; margin-bottom: 2px;}
        .widget-location { font-size: 14px; font-weight: 700; margin-bottom: 4px; }
        .widget-metrics { font-size: 11px; opacity: 0.9; }
        .widget-right { text-align: right; display: flex; flex-direction: column; align-items: flex-end; }
        .widget-aqi-val { font-size: 28px; font-weight: 800; line-height: 1; margin-bottom: 2px; }
        .widget-aqi-label { font-size: 12px; font-weight: 600; }
        .widget-footer { width: 100%; text-align: center; font-size: 10px; color: #94a3b8; margin-top: 6px; }
        .widget-footer a { color: #64748b; text-decoration: none; font-weight: 600; }
        .widget-footer a:hover { text-decoration: underline; }
    </style>
</head>
<body>
    <a href="https://ecopulse.site" target="_blank" class="widget-container">
        <div class="widget-left">
            <div class="widget-title">Live Air Quality</div>
            <div class="widget-location"><?= htmlspecialchars($data['area']) ?></div>
            <div class="widget-metrics">
                <?php if ($data['temperature']): ?>
                    <?= round($data['temperature'], 1) ?>&deg;C &bull; <?= round($data['humidity']) ?>% RH
                <?php else: ?>
                    Data Unavailable 
                <?php endif; ?>
            </div>
        </div>
        <div class="widget-right">
            <div class="widget-aqi-val"><?= $aqi ?? '--' ?></div>
            <div class="widget-aqi-label"><?= $category ?></div>
        </div>
    </a>
    <div class="widget-footer">
        Powered by <a href="https://ecopulse.site" target="_blank">EcoPulse</a> &bull; Updated <?= $timeAgo ?>
    </div>
</body>
</html>
