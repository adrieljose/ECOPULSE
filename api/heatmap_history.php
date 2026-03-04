<?php
require_once __DIR__ . '/../db.php';
header('Content-Type: application/json');

$pdo = db();

// Backwards 24 hours, grouped by hour
// We'll calculate the average AQI per device, per hour block.

$sql = "
    SELECT 
        d.id AS device_id,
        d.lat,
        d.lng,
        DATE_FORMAT(r.recorded_at, '%Y-%m-%d %H:00:00') AS hour_block,
        ROUND(AVG(r.aqi)) AS avg_aqi
    FROM readings r
    JOIN devices d ON r.device_id = d.id
    WHERE r.recorded_at >= NOW() - INTERVAL 24 HOUR
    GROUP BY d.id, hour_block
    ORDER BY hour_block ASC
";

try {
    $stmt = $pdo->query($sql);
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Reformat the data into a timeline structure
    $timeline = [];
    $hours = []; // unique hours

    // Find min and max lat/lng to avoid plotting [0,0] if sensors have bad data
    $maxLat = -90; $minLat = 90;
    
    foreach ($rows as $row) {
        $hour = $row['hour_block'];
        $lat = (float)$row['lat'];
        $lng = (float)$row['lng'];
        $aqi = (float)$row['avg_aqi'];
        
        // Skip invalid coordinates
        if (abs($lat) < 0.1 && abs($lng) < 0.1) continue;

        if (!isset($timeline[$hour])) {
            $timeline[$hour] = [
                'time_label' => date('g:00 A', strtotime($hour)), // e.g., 2:00 PM
                'timestamp' => strtotime($hour),
                'points' => []
            ];
            $hours[] = $hour;
        }

        // Intensity mapping (0.0 to 1.0) for Leaflet Heat
        $intensity = min($aqi / 300, 1.0); // 300+ AQI is pure red/max intensity

        $timeline[$hour]['points'][] = [$lat, $lng, $intensity, $aqi];
    }

    // Convert to indexed array so it's easy for JS to slider through
    $timelineArray = array_values($timeline);

    // If there are empty hours, we might want to fill them or just let the slider jump.
    // For now, let the slider jump through the available data hours.

    echo json_encode([
        'success' => true,
        'count' => count($timelineArray),
        'timeline' => $timelineArray
    ]);

} catch (Exception $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
