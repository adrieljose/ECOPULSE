<?php
// export_pdf.php
// Simple HTML report that the browser can "Print → Save as PDF"

require_once __DIR__ . '/db.php';   // uses $mysqli from your db.php

// ---- Read query params ----
$reportType = $_GET['report'] ?? 'aqi_reports';
$fromRaw    = $_GET['from']  ?? '';
$toRaw      = $_GET['to']    ?? '';

// inputs are coming from <input type="date"> => YYYY-MM-DD
$from = $fromRaw ? DateTime::createFromFormat('Y-m-d', $fromRaw) : null;
$to   = $toRaw   ? DateTime::createFromFormat('Y-m-d', $toRaw)   : null;

// normalise date range
$fromStr = $from ? $from->format('Y-m-d 00:00:00') : null;
$toStr   = $to   ? $to->format('Y-m-d 23:59:59')   : null;

// build WHERE for readings
$whereParts = [];
$types = '';
$params = [];

if ($fromStr) {
    $whereParts[] = 'r.recorded_at >= ?';
    $types .= 's';
    $params[] = $fromStr;
}
if ($toStr) {
    $whereParts[] = 'r.recorded_at <= ?';
    $types .= 's';
    $params[] = $toStr;
}
$whereSql = $whereParts ? ('WHERE ' . implode(' AND ', $whereParts)) : '';

// small helper for safe HTML output
function h($str) {
    return htmlspecialchars((string)$str, ENT_QUOTES, 'UTF-8');
}

// ---------- FETCH DATA DEPENDING ON REPORT TYPE ---------- //

$rows = [];
$title = '';
$subtitle = '';

if ($reportType === 'aqi_reports') {
    // Air Quality Reports: daily average AQI per station
    $title = 'EcoPulse — Air Quality Report';

    if ($from && $to) {
        $subtitle = 'Date range: ' . $from->format('Y-m-d') . ' to ' . $to->format('Y-m-d');
    } elseif ($from) {
        $subtitle = 'From: ' . $from->format('Y-m-d');
    } elseif ($to) {
        $subtitle = 'Up to: ' . $to->format('Y-m-d');
    } else {
        $subtitle = 'All available dates';
    }

    $sql = "
        SELECT
            DATE(r.recorded_at) AS report_date,
            d.name             AS station_name,
            d.device_code      AS device_code,
            ROUND(AVG(r.aqi))  AS avg_aqi
        FROM readings r
        JOIN devices d ON d.id = r.device_id
        $whereSql
        GROUP BY report_date, d.id
        ORDER BY report_date DESC, d.name ASC
    ";

    $stmt = $mysqli->prepare($sql);
    if ($stmt) {
        if ($types !== '') {
            $stmt->bind_param($types, ...$params);
        }
        if ($stmt->execute()) {
            $result = $stmt->get_result();
            while ($row = $result->fetch_assoc()) {
                // derive status text from AQI
                $aqi = (int)$row['avg_aqi'];
                if ($aqi <= 50) {
                    $status = 'Good';
                } elseif ($aqi <= 100) {
                    $status = 'Moderate';
                } elseif ($aqi <= 150) {
                    $status = 'Unhealthy for Sensitive Groups';
                } elseif ($aqi <= 200) {
                    $status = 'Unhealthy';
                } elseif ($aqi <= 300) {
                    $status = 'Very Unhealthy';
                } else {
                    $status = 'Hazardous';
                }
                $row['status'] = $status;
                $rows[] = $row;
            }
        }
        $stmt->close();
    }

} else {
    // For now we only fully implement AQI reports.
    // Login history export can be added later if you create a login_logs table.
    $title    = 'EcoPulse — Login History Report';
    $subtitle = 'Export for login history is not implemented yet in this demo.';
}

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title><?= h($title) ?></title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 24px;
            color: #222;
        }
        h1 {
            margin: 0 0 4px 0;
            font-size: 22px;
        }
        h2 {
            margin: 0 0 16px 0;
            font-size: 14px;
            font-weight: normal;
            color: #555;
        }
        .meta {
            font-size: 12px;
            margin-bottom: 16px;
            color: #555;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            font-size: 13px;
        }
        th, td {
            border: 1px solid #ddd;
            padding: 6px 8px;
            text-align: left;
        }
        th {
            background: #f5f5f5;
        }
        tr:nth-child(even) td {
            background: #fafafa;
        }
        .status-good { color: #2e7d32; font-weight: bold; }
        .status-moderate { color: #f9a825; font-weight: bold; }
        .status-bad { color: #c62828; font-weight: bold; }
        .no-data {
            margin-top: 24px;
            font-style: italic;
            color: #666;
        }
        .print-btn {
            margin-bottom: 16px;
            padding: 6px 12px;
            font-size: 13px;
            border-radius: 4px;
            border: 1px solid #1976d2;
            background: #2196f3;
            color: #fff;
            cursor: pointer;
        }
        @media print {
            .print-btn { display: none; }
        }
    </style>
</head>
<body>

<button class="print-btn" onclick="window.print()">Print / Save as PDF</button>

<h1><?= h($title) ?></h1>
<h2><?= h($subtitle) ?></h2>
<div class="meta">
    Generated at: <?= h(date('Y-m-d H:i:s')) ?>
</div>

<?php if ($reportType === 'aqi_reports'): ?>

    <?php if (count($rows) === 0): ?>
        <p class="no-data">No air quality records for the selected filters.</p>
    <?php else: ?>
        <table>
            <thead>
            <tr>
                <th style="width: 110px;">Date</th>
                <th>Area / Station</th>
                <th style="width: 90px;">Device ID</th>
                <th style="width: 90px;">Average AQI</th>
                <th style="width: 180px;">Status</th>
            </tr>
            </thead>
            <tbody>
            <?php foreach ($rows as $r): ?>
                <?php
                $aqi   = (int)$r['avg_aqi'];
                $label = $r['status'];

                if ($aqi <= 50) {
                    $class = 'status-good';
                } elseif ($aqi <= 100) {
                    $class = 'status-moderate';
                } else {
                    $class = 'status-bad';
                }
                ?>
                <tr>
                    <td><?= h($r['report_date']) ?></td>
                    <td><?= h($r['station_name']) ?></td>
                    <td><?= h($r['device_code']) ?></td>
                    <td><?= h($aqi) ?></td>
                    <td class="<?= $class ?>"><?= h($label) ?></td>
                </tr>
            <?php endforeach; ?>
            </tbody>
        </table>
    <?php endif; ?>

<?php else: ?>

    <p class="no-data">
        Login history export is not yet implemented in this version of the system.
        The Admin Login History is currently viewable on the Reports page only.
    </p>

<?php endif; ?>

</body>
</html>
