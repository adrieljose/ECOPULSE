<?php
declare(strict_types=1);

/**
 * Lightweight AQI forecast helper.
 * Forecast is software-only and derived from recent readings (no hardware change).
 */

if (!function_exists('eco_clamp')) {
    function eco_clamp(float $value, float $min, float $max): float
    {
        return max($min, min($max, $value));
    }
}

if (!function_exists('eco_aqi_breakpoints')) {
    function eco_aqi_breakpoints(): array
    {
        return [
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
    }
}

if (!function_exists('eco_sub_index')) {
    function eco_sub_index(?float $value, array $breakpoints): ?int
    {
        if ($value === null) {
            return null;
        }

        foreach ($breakpoints as [$cLow, $cHigh, $iLow, $iHigh]) {
            if ($value >= $cLow && $value <= $cHigh) {
                $aqi = (($iHigh - $iLow) / ($cHigh - $cLow)) * ($value - $cLow) + $iLow;
                return (int) round($aqi);
            }
        }

        $last = end($breakpoints);
        if (!$last) {
            return null;
        }

        [$cLow, $cHigh, $iLow, $iHigh] = $last;
        $aqi = (($iHigh - $iLow) / ($cHigh - $cLow)) * ($value - $cLow) + $iLow;
        return (int) eco_clamp((float) round($aqi), 0, 500);
    }
}

if (!function_exists('eco_compute_aqi_from_row')) {
    function eco_compute_aqi_from_row(array $row): ?int
    {
        $bps = eco_aqi_breakpoints();
        $indices = [];
        foreach (['pm25', 'pm10', 'o3', 'co'] as $pollutant) {
            $raw = isset($row[$pollutant]) && is_numeric($row[$pollutant]) ? (float) $row[$pollutant] : null;
            $idx = eco_sub_index($raw, $bps[$pollutant]);
            if ($idx !== null) {
                $indices[] = $idx;
            }
        }
        if (!$indices) {
            return null;
        }
        return (int) max($indices);
    }
}

if (!function_exists('eco_aqi_category')) {
    function eco_aqi_category(?int $aqi): string
    {
        if ($aqi === null) return 'No Data';
        if ($aqi <= 50) return 'Good';
        if ($aqi <= 100) return 'Moderate';
        if ($aqi <= 150) return 'Unhealthy for SG';
        if ($aqi <= 200) return 'Unhealthy';
        if ($aqi <= 300) return 'Very Unhealthy';
        return 'Hazardous';
    }
}

if (!function_exists('eco_stddev')) {
    function eco_stddev(array $values): float
    {
        $n = count($values);
        if ($n <= 1) return 0.0;
        $mean = array_sum($values) / $n;
        $variance = 0.0;
        foreach ($values as $v) {
            $variance += ($v - $mean) ** 2;
        }
        return sqrt($variance / ($n - 1));
    }
}

if (!function_exists('eco_extract_driver_breakdown')) {
    function eco_extract_driver_breakdown(array $row): array
    {
        $breakpoints = eco_aqi_breakpoints();
        $labelMap = [
            'pm25' => 'PM2.5',
            'pm10' => 'PM10',
            'o3' => 'O3',
            'co' => 'CO',
        ];

        $drivers = [];
        foreach ($labelMap as $key => $label) {
            $val = isset($row[$key]) && is_numeric($row[$key]) ? (float) $row[$key] : null;
            if ($val === null) continue;
            $idx = eco_sub_index($val, $breakpoints[$key]);
            if ($idx === null) continue;
            $drivers[] = [
                'pollutant' => $label,
                'value' => $val,
                'sub_index' => (int) $idx,
            ];
        }

        usort($drivers, static fn(array $a, array $b): int => $b['sub_index'] <=> $a['sub_index']);
        return $drivers;
    }
}

if (!function_exists('eco_build_forecast_from_rows')) {
    function eco_build_forecast_from_rows(array $rows, int $horizonMinutes = 30): ?array
    {
        if (!$rows) {
            return null;
        }

        usort($rows, static function (array $a, array $b): int {
            return strcmp((string) ($a['recorded_at'] ?? ''), (string) ($b['recorded_at'] ?? ''));
        });

        $points = [];
        $times = [];
        $firstTs = null;
        $lastRow = null;

        foreach ($rows as $row) {
            $ts = isset($row['recorded_at']) ? strtotime((string) $row['recorded_at']) : false;
            if (!$ts) {
                continue;
            }
            $aqi = eco_compute_aqi_from_row($row);
            if ($aqi === null && isset($row['aqi']) && is_numeric($row['aqi'])) {
                $aqi = (int) round((float) $row['aqi']);
            }
            if ($aqi === null) {
                continue;
            }
            if ($firstTs === null) {
                $firstTs = $ts;
            }
            $x = ($ts - $firstTs) / 60.0;
            $points[] = [$x, (float) $aqi];
            $times[] = $ts;
            $lastRow = $row;
        }

        $n = count($points);
        if ($n === 0 || $lastRow === null) {
            return null;
        }

        $currentAqi = (int) round($points[$n - 1][1]);
        $forecastAqi = $currentAqi;
        $slope = 0.0;

        if ($n >= 3) {
            $sumX = 0.0;
            $sumY = 0.0;
            $sumXY = 0.0;
            $sumXX = 0.0;

            foreach ($points as [$x, $y]) {
                $sumX += $x;
                $sumY += $y;
                $sumXY += ($x * $y);
                $sumXX += ($x * $x);
            }

            $den = ($n * $sumXX) - ($sumX * $sumX);
            if (abs($den) > 0.000001) {
                $slope = (($n * $sumXY) - ($sumX * $sumY)) / $den;
                $intercept = ($sumY - ($slope * $sumX)) / $n;
                $futureX = $points[$n - 1][0] + $horizonMinutes;
                $forecastAqi = (int) round(eco_clamp((float) ($intercept + ($slope * $futureX)), 0, 500));
            }
        }

        $delta = $forecastAqi - $currentAqi;
        $direction = abs($delta) <= 2 ? 'steady' : ($delta > 0 ? 'rising' : 'falling');

        $diffs = [];
        for ($i = 1; $i < $n; $i++) {
            $diffs[] = abs($points[$i][1] - $points[$i - 1][1]);
        }
        $meanAbsDiff = $diffs ? (array_sum($diffs) / count($diffs)) : 0.0;
        $volatilityScore = 1.0 - min(1.0, $meanAbsDiff / 35.0);
        $densityScore = min(1.0, $n / 12.0);

        $latestTs = end($times);
        $ageMinutes = $latestTs ? max(0.0, (time() - $latestTs) / 60.0) : 999.0;
        $freshnessScore = 1.0 - min(1.0, $ageMinutes / 20.0);

        $confidencePct = (int) round(eco_clamp(((0.35 * $densityScore) + (0.35 * $volatilityScore) + (0.30 * $freshnessScore)) * 100.0, 15.0, 98.0));
        $confidenceLabel = $confidencePct >= 75 ? 'high' : ($confidencePct >= 55 ? 'medium' : 'low');

        $drivers = eco_extract_driver_breakdown($lastRow);
        $topDrivers = array_map(static fn(array $d): string => $d['pollutant'], array_slice($drivers, 0, 2));

        return [
            'horizon_minutes' => $horizonMinutes,
            'current_aqi' => $currentAqi,
            'forecast_aqi' => $forecastAqi,
            'delta' => $delta,
            'direction' => $direction,
            'slope_per_minute' => round($slope, 3),
            'confidence_percent' => $confidencePct,
            'confidence' => $confidenceLabel,
            'category' => eco_aqi_category($forecastAqi),
            'driver_breakdown' => $drivers,
            'top_drivers' => $topDrivers,
            'points_used' => $n,
            'computed_at' => date(DATE_ATOM),
        ];
    }
}

if (!function_exists('eco_build_forecast_map')) {
    function eco_build_forecast_map(PDO $pdo, array $deviceIds, int $windowMinutes = 120, int $horizonMinutes = 30): array
    {
        $cleanIds = array_values(array_unique(array_filter(array_map('intval', $deviceIds), static fn(int $id): bool => $id > 0)));
        if (!$cleanIds) {
            return [];
        }

        $windowMinutes = max(15, min(24 * 60, $windowMinutes));
        $horizonMinutes = max(5, min(180, $horizonMinutes));

        $placeholders = implode(',', array_fill(0, count($cleanIds), '?'));
        $sql = "
            SELECT device_id, recorded_at, aqi, pm25, pm10, o3, co
            FROM readings
            WHERE device_id IN ($placeholders)
              AND recorded_at >= (NOW() - INTERVAL {$windowMinutes} MINUTE)
            ORDER BY recorded_at ASC
        ";

        $stmt = $pdo->prepare($sql);
        $stmt->execute($cleanIds);
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $byDevice = [];
        foreach ($rows as $row) {
            $did = (int) ($row['device_id'] ?? 0);
            if ($did <= 0) continue;
            $byDevice[$did][] = $row;
        }

        $missingIds = array_values(array_diff($cleanIds, array_keys($byDevice)));
        if ($missingIds) {
            $phMissing = implode(',', array_fill(0, count($missingIds), '?'));
            $fallbackSql = "
                SELECT device_id, recorded_at, aqi, pm25, pm10, o3, co
                FROM readings
                WHERE device_id IN ($phMissing)
                ORDER BY device_id ASC, recorded_at DESC
            ";
            $fallbackStmt = $pdo->prepare($fallbackSql);
            $fallbackStmt->execute($missingIds);
            $fallbackRows = $fallbackStmt->fetchAll(PDO::FETCH_ASSOC);

            $perDeviceCount = [];
            foreach ($fallbackRows as $row) {
                $did = (int) ($row['device_id'] ?? 0);
                if ($did <= 0) continue;
                $count = $perDeviceCount[$did] ?? 0;
                if ($count >= 24) continue;
                $byDevice[$did][] = $row;
                $perDeviceCount[$did] = $count + 1;
            }

            foreach ($missingIds as $did) {
                if (!empty($byDevice[$did])) {
                    usort($byDevice[$did], static function (array $a, array $b): int {
                        return strcmp((string)($a['recorded_at'] ?? ''), (string)($b['recorded_at'] ?? ''));
                    });
                }
            }
        }

        $forecasts = [];
        foreach ($cleanIds as $did) {
            if (empty($byDevice[$did])) {
                continue;
            }
            $forecast = eco_build_forecast_from_rows($byDevice[$did], $horizonMinutes);
            if ($forecast !== null) {
                $forecasts[$did] = $forecast;
            }
        }

        return $forecasts;
    }
}
