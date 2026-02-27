<?php
require_once __DIR__ . '/../session_bootstrap.php';
require_once __DIR__ . '/../db.php';

header('Content-Type: application/json');

if (!isset($_SESSION['admin']) && !isset($_SESSION['user'])) {
    echo json_encode(['success' => false, 'error' => 'Unauthorized']);
    exit;
}

// 1. Fetch recent data from the database to build context for the "AI"
try {
    $pdo = db();
    
    // Get basic stats for last 24h
    $statsStmt = $pdo->query("
        SELECT 
            AVG(pm25) as avg_pm25, 
            MAX(pm25) as max_pm25,
            AVG(co2) as avg_co2,
            AVG(temperature) as avg_temp
        FROM readings 
        WHERE recorded_at >= NOW() - INTERVAL 24 HOUR
    ");
    $stats = $statsStmt->fetch(PDO::FETCH_ASSOC);
    
    // Check for recently offline devices
    $offlineStmt = $pdo->query("
        SELECT COUNT(*) as offline_count 
        FROM sensors 
        WHERE updated_at < NOW() - INTERVAL 1 HOUR OR updated_at IS NULL
    ");
    $offline = $offlineStmt->fetch(PDO::FETCH_ASSOC)['offline_count'];

    // 2. Generate the "Mock" AI Response based on REAL data parameters
    // In a real environment, you would send $stats to the Gemini/OpenAI API here.
    
    $pm25 = round((float)($stats['avg_pm25'] ?? 12.5), 1);
    $maxPm25 = round((float)($stats['max_pm25'] ?? 35.0), 1);
    $co2 = round((float)($stats['avg_co2'] ?? 420.0), 0);
    
    $insight = "Based on the data collected over the last 24 hours, the overall air quality across your monitored zones remains relatively stable. ";
    
    if ($pm25 > 35) {
        $insight .= "However, **PM2.5 particulate levels have averaged {$pm25} µg/m³**, which is concerning. The system recorded a concerning spike peaking at **{$maxPm25} µg/m³**, indicating significant localized smoke or dust events that may trigger respiratory sensitivities. We recommend issuing a health advisory for outdoor activities. ";
    } else if ($pm25 > 15) {
        $insight .= "Average PM2.5 levels are acceptable at **{$pm25} µg/m³**, but we did log a peak of **{$maxPm25} µg/m³**. Conditions are moderate but bear watching. ";
    } else {
         $insight .= "Particulate matter (PM2.5) is excellent, averaging just **{$pm25} µg/m³**. The air is very clean. ";
    }
    
    if ($co2 > 1000) {
        $insight .= "Additionally, **CO2 levels are unusually high (averaging {$co2} ppm)**. If these sensors are located near congested roadways, this indicates a period of heavy traffic stagnation. ";
    } else {
        $insight .= "CO2 baseline remains normal at around {$co2} ppm. ";
    }
    
    if ($offline > 0) {
        $insight .= "\n\n⚠️ **System Warning:** I have detected that **{$offline} device(s)** are currently offline or unresponsive. Please dispatch a technician to verify power and network connectivity.";
    } else {
        $insight .= "\n\n✅ **System Health:** All registered sensors are online and transmitting data normally.";
    }

    echo json_encode([
        'success' => true,
        'insight' => $insight,
        'timestamp' => date('Y-m-d H:i:s')
    ]);

} catch (Throwable $e) {
    echo json_encode([
        'success' => false, 
        'error' => 'Database connection failed while generating insights.',
        'details' => $e->getMessage()
    ]);
}
?>
