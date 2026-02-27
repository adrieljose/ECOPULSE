<?php
header('Content-Type: application/json');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('Pragma: no-cache');
require_once __DIR__ . '/lib/forecast_engine.php';
require_once __DIR__ . '/db.php';

// --- DB CONFIG ---
$db_host = 'localhost';
$db_user = 'root';
$db_pass = '';
$db_name = 'ecopulse'; // <- your actual database name

$mysqli = new mysqli($db_host, $db_user, $db_pass, $db_name);
if ($mysqli->connect_error) {
    http_response_code(500);
    echo json_encode(['error' => 'Database connection failed']);
    exit;
}

/*
 * For each device:
 *  - get its latest reading from `readings`
 *  - include lat/lng, AQI, pollutants, status
 */
$sql = "
    SELECT
        d.id,
        d.device_code,
        d.name,
        d.status AS device_status,
        d.is_active,
        d.last_heartbeat,
        d.lat,
        d.lng,
        b.name AS barangay_name,
        r.pm1,
        r.pm25,
        r.pm10,
        r.o3,
        r.co,
        r.co2,
        r.temperature,
        r.humidity,
        r.aqi,
        r.recorded_at
    FROM devices d
    LEFT JOIN barangays b
        ON b.id = d.barangay_id
    LEFT JOIN readings r
        ON r.id = (
            SELECT rr.id
            FROM readings rr
            WHERE rr.device_id = d.id
            ORDER BY rr.recorded_at DESC
            LIMIT 1
        )
";

$result = $mysqli->query($sql);
if (!$result) {
    $mysqli->close();
    http_response_code(500);
    echo json_encode(['error' => 'Failed to fetch device list']);
    exit;
}

$rows = [];
while ($row = $result->fetch_assoc()) {
    $rows[] = $row;
}

$forecastMap = [];
if (!empty($rows)) {
    try {
        $forecastIds = array_values(array_filter(array_map(static function ($r) {
            return isset($r['id']) ? (int)$r['id'] : 0;
        }, $rows), static fn(int $id): bool => $id > 0));
        if ($forecastIds) {
            $forecastMap = eco_build_forecast_map(db(), $forecastIds, 120, 30);
        }
    } catch (Throwable $e) {
        $forecastMap = [];
    }
}

$sensors = [];
foreach ($rows as $row) {
    $aqi = $row['aqi'] !== null ? (int)$row['aqi'] : null;
    $recordedAt = !empty($row['recorded_at']) ? strtotime($row['recorded_at']) : null;
    $heartbeatAt = !empty($row['last_heartbeat']) ? strtotime($row['last_heartbeat']) : null;
    $now = time();
    $readingAgeMin = $recordedAt ? ($now - $recordedAt) / 60 : null;
    $hbAgeMin = $heartbeatAt ? ($now - $heartbeatAt) / 60 : null;

        // Derive status with preference for fresh readings, then heartbeat. Include "searching" when active but no fresh data.
        $status = $row['device_status'] ?: 'offline';

        $isActive = (int)($row['is_active'] ?? 1) === 1;

        if ($readingAgeMin !== null && $readingAgeMin <= 10) {
            // Fresh reading drives the status
            if ($aqi === null || $aqi <= 100) $status = 'online';
            elseif ($aqi <= 150) $status = 'warning';
            else $status = 'critical';
        } elseif ($hbAgeMin !== null && $hbAgeMin <= 10) {
            // Heartbeat is fresh but no reading: mark searching if active, otherwise offline
            $status = $isActive ? 'searching' : 'offline';
        } else {
            // No fresh heartbeat/reading
            $status = $isActive ? 'searching' : 'offline';
        }

        // Stale overrides to "stale" when not offline and not searching
        if (!in_array($status, ['offline', 'searching'], true) && ($readingAgeMin === null || $readingAgeMin > 15)) {
            $status = 'stale';
        }

        $updatedAt = $recordedAt ? date('c', $recordedAt) : ($heartbeatAt ? date('c', $heartbeatAt) : null);
        // Compute AQI from pollutants (worst sub-index) to avoid stale aqi values
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
        $computeSubIndex = function($val, $bps) {
            if ($val === null) return null;
            foreach ($bps as $bp) {
                [$clo, $chi, $ilo, $ihi] = $bp;
                if ($val >= $clo && $val <= $chi) {
                    return (int)round((($ihi - $ilo)/($chi - $clo)) * ($val - $clo) + $ilo);
                }
            }
            $last = end($bps);
            if ($last) {
                [$clo, $chi, $ilo, $ihi] = $last;
                return (int)round((($ihi - $ilo)/($chi - $clo)) * ($val - $clo) + $ilo);
            }
            return null;
        };

        $subs = [];
        $map = [
            'pm25' => $row['pm25'] !== null ? (float)$row['pm25'] : null,
            'pm10' => $row['pm10'] !== null ? (float)$row['pm10'] : null,
            'o3'   => $row['o3'] !== null ? (float)$row['o3'] : null,
            'co'   => $row['co'] !== null ? (float)$row['co'] : null,
        ];
        foreach ($map as $k => $val) {
            if ($val !== null && isset($aqiBreakpoints[$k])) {
                $idx = $computeSubIndex($val, $aqiBreakpoints[$k]);
                if ($idx !== null) $subs[] = $idx;
            }
        }
        if (!empty($subs)) {
            $aqi = max($subs);
        }
        // Clamp AQI for display
        if ($aqi !== null) {
            $aqi = max(0, min(500, (int)$aqi));
        }

    $sensors[] = [
        'id'   => (int)$row['id'],
        'code' => $row['device_code'],
        'name' => $row['name'],
        'area' => $row['barangay_name'] ?: 'Device',
        'lat'  => $row['lat'] !== null ? (float)$row['lat'] : null,
        'lng'  => $row['lng'] !== null ? (float)$row['lng'] : null,
        'isActive' => (int)($row['is_active'] ?? 1),
        'status' => $status,
        'aqi'    => $aqi,
        'pm1'    => $row['pm1'] !== null ? (float)$row['pm1'] : null,
        'pm25'   => $row['pm25'] !== null ? (float)$row['pm25'] : null,
        'pm10'   => $row['pm10'] !== null ? (float)$row['pm10'] : null,
        'o3'     => $row['o3'] !== null ? (float)$row['o3'] : null,
            'co'     => $row['co'] !== null ? (float)$row['co'] : null,
        'co2'    => $row['co2'] !== null ? (float)$row['co2'] : null,
        'temperature' => $row['temperature'] !== null ? (float)$row['temperature'] : null,
        'humidity'    => $row['humidity'] !== null ? (float)$row['humidity'] : null,
        'updatedAt' => $updatedAt,
        'forecast' => $forecastMap[(int)$row['id']] ?? null,
    ];
}

$mysqli->close();

// map.js expects { sensors: [...] }
echo json_encode(['sensors' => $sensors]);
