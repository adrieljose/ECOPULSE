<?php
require_once __DIR__ . '/../db.php';
header('Content-Type: application/json');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('Pragma: no-cache');

$pdo = db();

$deviceId = isset($_GET['device_id']) ? $_GET['device_id'] : null;
$timeframe = $_GET['timeframe'] ?? '1h';
$action = $_GET['action'] ?? null;

// ---------------------------------------------------
// COMPARISON ACTION
// ---------------------------------------------------
// ---------------------------------------------------
// COMPARISON ACTION
// ---------------------------------------------------
if ($action === 'compare') {
    $devicesParam = $_GET['devices'] ?? '';
    // Expect comma-separated IDs e.g. "1,5,10"
    $deviceIds = array_filter(explode(',', $devicesParam), function($v) { return is_numeric($v) && $v > 0; });
    
    $from = $_GET['from'] ?? date('Y-m-d');
    $to   = $_GET['to']   ?? date('Y-m-d');

    // Validate inputs
    if (count($deviceIds) < 1) {
        echo json_encode(['error' => 'Please select at least one device to compare.']);
        exit;
    }

    // Prepare Date Range
    $start = $from . ' 00:00:00';
    $end   = $to   . ' 23:59:59';

    // Fetch Device Names
    $inQuery = implode(',', array_fill(0, count($deviceIds), '?'));
    $stmtName = $pdo->prepare("SELECT id, name FROM devices WHERE id IN ($inQuery)");
    $stmtName->execute($deviceIds);
    $deviceNames = $stmtName->fetchAll(PDO::FETCH_KEY_PAIR); // [id => name]

    // Prepare SQL for readings
    $sql = "SELECT DATE_FORMAT(recorded_at, '%Y-%m-%d %H:00') as label, ROUND(AVG(aqi)) as val 
            FROM readings 
            WHERE device_id = ? AND recorded_at BETWEEN ? AND ? 
            GROUP BY label 
            ORDER BY label ASC";
    $stmtData = $pdo->prepare($sql);

    // Collect Data
    $allLabels = [];
    $deviceData = []; // [deviceId => [label => val]]

    foreach ($deviceIds as $did) {
        $stmtData->execute([$did, $start, $end]);
        $rows = $stmtData->fetchAll(PDO::FETCH_ASSOC);
        
        $dataMap = [];
        foreach ($rows as $r) {
            $lbl = $r['label'];
            $dataMap[$lbl] = (int)$r['val'];
            $allLabels[$lbl] = true;
        }
        $deviceData[$did] = $dataMap;
    }

    // Sort valid labels
    ksort($allLabels);
    $finalLabels = array_keys($allLabels);

    // Build Series
    $series = [];
    $colors = ['#0d6efd', '#fd7e14', '#198754', '#d63384', '#6f42c1']; // Blue, Orange, Green, Pink, Purple
    $colorIdx = 0;

    foreach ($deviceIds as $did) {
        $data = [];
        // Fill data for aligned labels, null if missing
        foreach ($finalLabels as $lbl) {
            $data[] = $deviceData[$did][$lbl] ?? null;
        }
        
        $series[] = [
            'name' => $deviceNames[$did] ?? "Device #$did",
            'data' => $data,
            'color' => $colors[$colorIdx % count($colors)]
        ];
        $colorIdx++;
    }

    echo json_encode([
        'labels' => $finalLabels,
        'series' => $series
    ]);
    exit;
}


// Latest reading per device
$latestSql = "
  SELECT 
    d.id AS device_id, 
    d.device_code, 
    d.name, 
    d.status, 
    d.is_active,
    d.last_heartbeat,
    d.lat, 
    d.lng, 
    d.barangay_id, 
    b.name AS area,
    r.pm1, r.pm25, r.pm10, r.o3, r.co, r.co2, r.temperature, r.humidity, r.aqi, r.recorded_at
  FROM devices d
  LEFT JOIN barangays b ON b.id = d.barangay_id
  LEFT JOIN readings r ON r.device_id = d.id AND r.recorded_at = (
    SELECT MAX(recorded_at) FROM readings WHERE device_id = d.id
  )
";
$latest = $pdo->query($latestSql)->fetchAll(PDO::FETCH_ASSOC);

// Fallback: if the latest reading has null temperature/humidity, pull the most recent non-null for that device
if ($latest) {
    $tempStmt = $pdo->prepare("SELECT temperature FROM readings WHERE device_id = :id AND temperature IS NOT NULL ORDER BY recorded_at DESC LIMIT 1");
    $humStmt = $pdo->prepare("SELECT humidity FROM readings WHERE device_id = :id AND humidity IS NOT NULL ORDER BY recorded_at DESC LIMIT 1");

    foreach ($latest as &$row) {
        if ($row['temperature'] === null) {
            $tempStmt->execute([':id' => $row['device_id']]);
            $t = $tempStmt->fetchColumn();
            if ($t !== false) $row['temperature'] = (float)$t;
        }
        if ($row['humidity'] === null) {
            $humStmt->execute([':id' => $row['device_id']]);
            $h = $humStmt->fetchColumn();
            if ($h !== false) $row['humidity'] = (float)$h;
        }
    }
    unset($row);
}

// Overall settings (Global or Specific Device)
$selectedDeviceName = 'Global Average';
$overall = ['pm1'=>null,'pm25'=>null,'pm10'=>null,'o3'=>null,'co'=>null,'co2'=>null,'temperature'=>null,'humidity'=>null,'overallAQI'=>null];

// AQI breakpoint tables (US EPA style) per pollutant
$aqiBreakpoints = [
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
    // O3 values assumed in ppb (8-hr)
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

$computeSubIndex = function(?float $value, array $breaks): ?int {
    if ($value === null) return null;
    foreach ($breaks as [$blo, $bhi, $ilo, $ihi]) {
        if ($value >= $blo && $value <= $bhi) {
            $aqi = ($ihi - $ilo) / ($bhi - $blo) * ($value - $blo) + $ilo;
            return (int)round($aqi);
        }
    }
    // If above highest breakpoint, extend last band but CAP at 500
    $last = end($breaks);
    if ($last) {
        [$blo, $bhi, $ilo, $ihi] = $last;
        $aqi = ($ihi - $ilo) / ($bhi - $blo) * ($value - $blo) + $ilo;
        return min(500, (int)round($aqi));
    }
    return null;
};

if ($deviceId) {
    // Filter for specific device
    $found = false;
    foreach ($latest as $row) {
        if ($row['device_code'] === $deviceId || (string)$row['device_id'] === $deviceId) {
            $selectedDeviceName = $row['name'];
            $overall = [
        'pm1' => $row['pm1'],
        'pm25'=> $row['pm25'],
        'pm10'=> $row['pm10'],
        'o3'  => $row['o3'],
        'co'  => $row['co'],
        'co2' => $row['co2'],
        'temperature' => $row['temperature'],
        'humidity' => $row['humidity'],
        'overallAQI' => null // will compute from pollutant sub-indices
    ];
            $found = true;
            break;
        }
    }
    if (!$found) {
        // If passed ID is invalid/not found in latest, fallback or keep nulls.
        $selectedDeviceName = 'Device Not Found';
    }
} else if ($latest) {
    // Original Average Logic
    $fields = ['pm1','pm25','pm10','o3','co','co2','temperature','humidity','aqi'];
    $sum = array_fill_keys($fields, 0);
    $count = array_fill_keys($fields, 0);

    foreach ($latest as $row) {
        foreach ($fields as $field) {
            if ($row[$field] !== null) {
                $sum[$field] += $row[$field];
                $count[$field] += 1;
            }
        }
    }
    $overall = [
        'pm1' => $count['pm1'] ? round($sum['pm1']/$count['pm1'],1) : null,
        'pm25'=> $count['pm25'] ? round($sum['pm25']/$count['pm25'],1) : null,
        'pm10'=> $count['pm10'] ? round($sum['pm10']/$count['pm10'],1) : null,
        'o3'  => $count['o3'] ? round($sum['o3']/$count['o3'],1) : null,
        'co'  => $count['co'] ? round($sum['co']/$count['co'],1) : null,
        'co2' => $count['co2'] ? round($sum['co2']/$count['co2'],0) : null,
        'temperature' => $count['temperature'] ? round($sum['temperature']/$count['temperature'],1) : null,
        'humidity' => $count['humidity'] ? round($sum['humidity']/$count['humidity'],1) : null,
        'overallAQI' => null // will compute from pollutant sub-indices
    ];
}

// Compute AQI per pollutant and overall (take worst sub-index)
$subIndices = [];
$pollutantKeys = [
    'PM2.5' => 'pm25',
    'PM10'  => 'pm10',
    'O3'    => 'o3',
    'CO'    => 'co',
];
foreach ($pollutantKeys as $label => $key) {
    $val = $overall[$key] ?? null;
    $bpKey = strtolower($key);
    if ($val !== null && isset($aqiBreakpoints[$bpKey])) {
        $idx = $computeSubIndex((float)$val, $aqiBreakpoints[$bpKey]);
        if ($idx !== null) {
            $subIndices[$label] = $idx;
        }
    }
}

$dominantPollutant = 'N/A';
$dominantPollutantValue = null;
if (!empty($subIndices)) {
    arsort($subIndices); // highest AQI first
    $dominantPollutant = array_key_first($subIndices);
    $dominantPollutantValue = $overall[$pollutantKeys[$dominantPollutant]] ?? null;
    $overall['overallAQI'] = reset($subIndices);
}

$aqiVal = $overall['overallAQI'];
$aqiCategory = 'No Data';
if ($aqiVal !== null) {
    // Using standard AQI categories loosely for demo
    if ($aqiVal <= 50) $aqiCategory = 'Good';
    elseif ($aqiVal <= 100) $aqiCategory = 'Moderate';
    elseif ($aqiVal <= 150) $aqiCategory = 'Unhealthy for SG';
    elseif ($aqiVal <= 200) $aqiCategory = 'Unhealthy';
    elseif ($aqiVal <= 300) $aqiCategory = 'Very Unhealthy';
    else $aqiCategory = 'Hazardous';
}

// History (dynamic window)
// Map timeframe to SQL interval
$intervalMap = [
    '1h' => '1 HOUR',
    '6h' => '6 HOUR',
    '12h' => '12 HOUR',
    '24h' => '24 HOUR'
];
$sqlInterval = $intervalMap[$timeframe] ?? '1 HOUR';

$historySql = "
  SELECT DATE_FORMAT(recorded_at, '%H:%i') label, pm1, pm25, pm10, o3, co, co2, temperature, humidity
  FROM readings
  WHERE recorded_at >= NOW() - INTERVAL $sqlInterval
";
$trendSql = "
  SELECT DATE_FORMAT(recorded_at, '%H:%i:%s') label, aqi, pm25, pm10, o3, co
  FROM readings
  WHERE recorded_at >= NOW() - INTERVAL $sqlInterval
";

$params = [];
if ($deviceId) {
    // If deviceId looks like a code (e.g., DEV-001) we need database ID, or join. 
    // Assuming $deviceId is passed as 'device_code' from frontend for consistency with list,
    // or ID. Let's support both or just ID. Frontend sends ID.
    // Ideally we join devices table to filter by code if simpler.
    $filterClause = " AND device_id = (SELECT id FROM devices WHERE device_code = :dc OR id = :id LIMIT 1) ";
    $params = [':dc' => $deviceId, ':id' => $deviceId];
    
    $historySql .= $filterClause;
    $trendSql .= $filterClause;
}
$historySql .= " ORDER BY recorded_at ASC";
$trendSql .= " ORDER BY recorded_at ASC";

// Exec History
$stmtH = $pdo->prepare($historySql);
$stmtH->execute($params);
$histRows = $stmtH->fetchAll(PDO::FETCH_ASSOC);

$history = ['labels'=>[], 'pm1'=>[], 'pm25'=>[], 'pm10'=>[], 'o3'=>[], 'co'=>[], 'co2'=>[], 'temperature'=>[], 'humidity'=>[]];
foreach ($histRows as $row) {
    $history['labels'][] = $row['label'];
    $history['pm1'][]  = (float)$row['pm1'];
    $history['pm25'][] = (float)$row['pm25'];
    $history['pm10'][] = (float)$row['pm10'];
    $history['o3'][]   = (float)$row['o3'];
    $history['co'][]   = (float)$row['co'];
    $history['co2'][]  = (float)$row['co2'];
    $history['temperature'][] = $row['temperature'] !== null ? (float)$row['temperature'] : null;
    $history['humidity'][] = $row['humidity'] !== null ? (float)$row['humidity'] : null;
}

// Exec Trend
$stmtT = $pdo->prepare($trendSql);
$stmtT->execute($params);
$trendRows = $stmtT->fetchAll(PDO::FETCH_ASSOC);

$trend = ['labels' => [], 'aqi' => []];
foreach ($trendRows as $row) {
    $trend['labels'][] = $row['label'];
    // Recompute AQI from pollutants to avoid stale stored values
    $subs = [];
    $pollMap = [
        'pm25' => $row['pm25'] !== null ? (float)$row['pm25'] : null,
        'pm10' => $row['pm10'] !== null ? (float)$row['pm10'] : null,
        'o3'   => $row['o3'] !== null ? (float)$row['o3'] : null,
        'co'   => $row['co'] !== null ? (float)$row['co'] : null,
    ];
    foreach ($pollMap as $k => $val) {
        if ($val !== null && isset($aqiBreakpoints[$k])) {
            $idx = $computeSubIndex($val, $aqiBreakpoints[$k]);
            if ($idx !== null) $subs[] = $idx;
        }
    }
    $aqiVal = null;
    if (!empty($subs)) {
        $aqiVal = max($subs);
    } elseif ($row['aqi'] !== null) {
        $aqiVal = (int)$row['aqi'];
    }
    if ($aqiVal !== null) {
        $aqiVal = max(0, min(500, (int)$aqiVal));
    }
    $trend['aqi'][] = $aqiVal;
}

$maxPoints = 300;
// Limit points
if (count($history['labels']) > $maxPoints) {
    foreach ($history as $key => $val) {
        $history[$key] = array_slice($val, -$maxPoints);
    }
}
if (count($trend['labels']) > $maxPoints) {
    $trend['labels'] = array_slice($trend['labels'], -$maxPoints);
    $trend['aqi'] = array_slice($trend['aqi'], -$maxPoints);
}

// Analytics summary (simple window over selected timeframe)
$analytics = [
    'windowLabel' => 'Last ' . str_replace('h', ' hours', $timeframe),
    'items' => [],
    'summary' => 'Waiting for data...'
];
$aqiSeries = array_values(array_filter($trend['aqi'], fn($v) => $v !== null));
if (count($aqiSeries) >= 2) {
    $firstIdx = array_search(reset($aqiSeries), $trend['aqi']);
    $lastIdx = array_search(end($aqiSeries), $trend['aqi']);
    $firstVal = $aqiSeries[0];
    $lastVal = end($aqiSeries);
    $minVal = min($aqiSeries);
    $maxVal = max($aqiSeries);
    $avgVal = round(array_sum($aqiSeries) / count($aqiSeries), 1);
    $delta = $lastVal - $firstVal;
    $deltaPct = $firstVal ? round(($delta / $firstVal) * 100, 1) : null;

    $analytics['items'][] = "Average AQI: {$avgVal}";
    $analytics['items'][] = "Peak AQI: {$maxVal}" . (isset($trend['labels'][$lastIdx]) ? " at {$trend['labels'][$lastIdx]}" : '');
    $analytics['items'][] = "Lowest AQI: {$minVal}";
    $analytics['items'][] = "Change: " . ($delta > 0 ? '+' : '') . "{$delta}" . ($deltaPct !== null ? " ({$deltaPct}%)" : '');

    $direction = $delta > 2 ? 'rising' : ($delta < -2 ? 'falling' : 'steady');
    $analytics['summary'] = "AQI is {$direction} over the last " . str_replace('h', ' hours', $timeframe) . ".";
} else {
    $analytics['summary'] = 'Insufficient data for analytics.';
}

// Sensors list for UI
$sensors = [];
foreach ($latest as $row) {
    $recTs = !empty($row['recorded_at']) ? strtotime($row['recorded_at']) : null;
    $hbTs = !empty($row['last_heartbeat']) ? strtotime($row['last_heartbeat']) : null;
    $now = time();
    $readingAgeMin = $recTs ? ($now - $recTs) / 60 : null;
    $hbAgeMin = $hbTs ? ($now - $hbTs) / 60 : null;

    $status = $row['status'] ?: 'offline';
    
    // Override status if manually stopped
    if (isset($row['is_active']) && $row['is_active'] == 0) {
        $status = 'offline'; // Or 'stopped' if we want specific styling, but 'offline' (gray) is a good default for "not running"
    } else {
        if ($hbAgeMin === null || $hbAgeMin > 10) {
            $status = 'offline';
        } else {
            if ($row['aqi'] === null || $row['aqi'] <= 100) {
                $status = 'online';
            } elseif ($row['aqi'] <= 150) {
                $status = 'warning';
            } else {
                $status = 'critical';
            }
        }
    }
    if ($status !== 'offline' && ($readingAgeMin === null || $readingAgeMin > 15)) {
        $status = 'stale';
    }

    $sensors[] = [
        'id' => $row['device_id'], // Integer ID for API control
        'device_code' => $row['device_code'],
        'name' => $row['name'],
        'area' => $row['area'],
        'lat' => $row['lat'],
        'lng' => $row['lng'],
        'aqi' => $row['aqi'],
        'pm1' => $row['pm1'],
        'pm25'=> $row['pm25'],
        'pm10'=> $row['pm10'],
        'o3'  => $row['o3'],
        'co'  => $row['co'],
        'co2' => $row['co2'],
        'temperature' => $row['temperature'],
        'humidity' => $row['humidity'],
        'status' => $status,
        'isActive' => (int)($row['is_active'] ?? 1),
        'updatedAt' => $recTs ? date(DATE_ATOM, $recTs) : ($hbTs ? date(DATE_ATOM, $hbTs) : null)
    ];
}

// Pollutant levels bar chart
$pollutants = [
  'labels' => ['PM1.0','PM2.5','PM10','O3','CO','CO2','Temperature (C)','Humidity (%)'],
  'values' => [
    $overall['pm1'],
    $overall['pm25'],
    $overall['pm10'],
    $overall['o3'],
    $overall['co'],
    $overall['co2'],
    $overall['temperature'],
    $overall['humidity']
  ]
];

// Threshold alerts (basic server-side flagging)
$alerts = [];
foreach ($latest as $row) {
    $pm25 = $row['pm25'];
    $co2 = $row['co2'];
    if (($pm25 !== null && $pm25 > 100) || ($co2 !== null && $co2 > 1000)) {
        $alerts[] = [
            'device' => $row['device_code'],
            'name' => $row['name'],
            'area' => $row['area'],
            'pm25' => $pm25,
            'co2' => $co2,
            'aqi' => $row['aqi'],
            'status' => $row['status']
        ];
    }
}

echo json_encode([
  'generatedAt' => date(DATE_ATOM),
  'selectedDeviceName' => $selectedDeviceName,
  'overallAQI' => $overall['overallAQI'],
  'aqiCategory' => $aqiCategory,
  'pm1' => $overall['pm1'],
  'pm25'=> $overall['pm25'],
  'pm10'=> $overall['pm10'],
  'o3'  => $overall['o3'],
  'co'  => $overall['co'],
  'co2' => $overall['co2'],
  'temperature' => $overall['temperature'],
  'humidity' => $overall['humidity'],
  'pollutants' => $pollutants,
  'history' => $history,
  'trend' => $trend,
  'analytics' => $analytics,
  'sensorsOnline' => count(array_filter($latest, fn($r)=>$r['status']==='online')),
  'sensorsTotal' => count($latest),
  'dominantPollutant' => $dominantPollutant,
  'dominantPollutantValue' => $dominantPollutantValue,
  'sensors' => $sensors,
  'alerts' => $alerts
]);
