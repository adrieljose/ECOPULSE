<?php
require_once __DIR__ . '/session_bootstrap.php';

if (!isset($_SESSION['admin'])) {
    header('Location: login.php?from=reports');
    exit;
}

$currentUserLabel = $_SESSION['username'] ?? '';
$currentRole = 'Guest';
$isAdmin = isset($_SESSION['admin']);
$isUser = isset($_SESSION['user']);
$isGuest = isset($_SESSION['guest']);

if ($isAdmin && $currentUserLabel === '') {
    try {
        $pdoHeader = db();
        $stmtHeader = $pdoHeader->prepare('SELECT username FROM admins WHERE id = :id LIMIT 1');
        $stmtHeader->execute([':id' => (int) $_SESSION['admin']]);
        $rowHeader = $stmtHeader->fetch(PDO::FETCH_ASSOC);
        if ($rowHeader && !empty($rowHeader['username'])) {
            $currentUserLabel = $rowHeader['username'];
        }
    } catch (Throwable $e) { /* ignore */ }
}

$isMasterAdmin = $isAdmin && (strtolower($currentUserLabel) === 'masteradmin');

if ($isAdmin) {
    $currentRole = $isMasterAdmin ? 'Master Admin' : 'Admin';
    $currentUserLabel = $currentUserLabel !== '' ? $currentUserLabel : $currentRole;
} elseif ($isUser) {
    $currentRole = 'Public User';
    $currentUserLabel = $currentUserLabel !== '' ? $currentUserLabel : 'User';
} elseif ($isGuest) {
    $currentRole = 'Guest';
    $currentUserLabel = $currentUserLabel !== '' ? $currentUserLabel : 'Guest';
} else {
    $currentUserLabel = $currentUserLabel !== '' ? $currentUserLabel : 'Guest';
}

// --- DB connection ---
require_once __DIR__ . '/db.php';

if (!isset($mysqli) || !($mysqli instanceof mysqli)) {
    $mysqli = new mysqli('localhost', 'root', '', 'ecopulse');
    if ($mysqli->connect_errno) {
        die('Database connection failed: ' . $mysqli->connect_error);
    }
}

function h($v) {
    return htmlspecialchars((string)$v, ENT_QUOTES, 'UTF-8');
}

// --- Read filters from query string (GET) ---
// URL params: ?from=YYYY-MM-DD&to=YYYY-MM-DD&type=all|aqi|login|sms|device_sms|public|activity
$fromRaw    = $_GET['from'] ?? '';
$toRaw      = $_GET['to']   ?? '';
$reportType = $_GET['type'] ?? 'all';

// Normalise dates to YYYY-MM-DD
$fromDate = null;
$toDate   = null;

if ($fromRaw) {
    $dt = DateTime::createFromFormat('Y-m-d', $fromRaw);
    if ($dt) {
        $fromDate = $dt->format('Y-m-d');
    }
}
if ($toRaw) {
    $dt = DateTime::createFromFormat('Y-m-d', $toRaw);
    if ($dt) {
        $toDate = $dt->format('Y-m-d');
    }
}

// --------------------------------------------------
// Fetch Admin Login History from admin_login_history
// --------------------------------------------------
$loginRows = [];

if (true) {
    $sql = "
        SELECT
            created_at,
            username,
            ip_address,
            status
        FROM admin_login_history
        WHERE 1=1
    ";

    $params = [];
    $types  = '';

    if ($fromDate) {
        $sql    .= " AND DATE(created_at) >= ?";
        $types  .= 's';
        $params[] = $fromDate;
    }
    if ($toDate) {
        $sql    .= " AND DATE(created_at) <= ?";
        $types  .= 's';
        $params[] = $toDate;
    }

    $sql .= " ORDER BY created_at DESC";

    $stmt = $mysqli->prepare($sql);
    if ($types !== '') {
        $stmt->bind_param($types, ...$params);
    }
    if ($stmt->execute()) {
        $res = $stmt->get_result();
        while ($row = $res->fetch_assoc()) {
            $loginRows[] = [
                'ts'     => $row['created_at'],
                'user'   => $row['username'],
                'ip'     => $row['ip_address'],
                'status' => $row['status'],
            ];
        }
    }
    $stmt->close();
}

// --------------------------------------------------
// Fetch Air Quality History from aqi_history + devices
// --------------------------------------------------
$aqiRows = [];
$avgAqi  = null;

// --------------------------------------------------
// Fetch Air Quality History from aqi_history + devices
// --------------------------------------------------
$aqiRows = [];
$avgAqi  = null;

// Always fetch AQI data
if (true) {
    $sql = "
        SELECT
            h.report_date,
            CONCAT(d.name, ' (Barangay ', d.barangay_id, ')') AS area_label,
            h.avg_aqi,
            h.status
        FROM aqi_history h
        JOIN devices d ON d.id = h.device_id
        WHERE 1=1
    ";

    $params = [];
    $types  = '';

    if ($fromDate) {
        $sql    .= " AND h.report_date >= ?";
        $types  .= 's';
        $params[] = $fromDate;
    }
    if ($toDate) {
        $sql    .= " AND h.report_date <= ?";
        $types  .= 's';
        $params[] = $toDate;
    }

    $sql .= " ORDER BY h.report_date DESC, d.name ASC";

    $stmt = $mysqli->prepare($sql);
    if ($types !== '') {
        $stmt->bind_param($types, ...$params);
    }
    if ($stmt->execute()) {
        $res = $stmt->get_result();
        while ($row = $res->fetch_assoc()) {
            $aqiRows[] = [
                'date'   => $row['report_date'],
                'area'   => $row['area_label'],
                'aqi'    => $row['avg_aqi'],
                'status' => $row['status'],
            ];
        }
    }
    $stmt->close();
}

// Fallback: if there is no historical AQI data, use the latest reading per device
if (empty($aqiRows)) {
    $sql = "
        SELECT
            r.recorded_at AS report_date,
            CONCAT(d.name, ' (Barangay ', d.barangay_id, ')') AS area_label,
            r.aqi
        FROM readings r
        JOIN devices d ON d.id = r.device_id
        JOIN (

            SELECT device_id, MAX(recorded_at) AS max_recorded
            FROM readings
            GROUP BY device_id
        ) latest ON latest.device_id = r.device_id AND latest.max_recorded = r.recorded_at
        WHERE 1=1
    ";

    $params = [];
    $types  = '';

    if ($fromDate) {
        $sql    .= " AND DATE(r.recorded_at) >= ?";
        $types  .= 's';
        $params[] = $fromDate;
    }
    if ($toDate) {
        $sql    .= " AND DATE(r.recorded_at) <= ?";
        $types  .= 's';
        $params[] = $toDate;
    }

    $sql .= " ORDER BY r.recorded_at DESC, d.name ASC";

    $stmt = $mysqli->prepare($sql);
    if ($stmt) {
        if ($types !== '') {
            $stmt->bind_param($types, ...$params);
        }
        if ($stmt->execute()) {
            $res = $stmt->get_result();
            while ($row = $res->fetch_assoc()) {
                $aqiVal = $row['aqi'] !== null ? (int)$row['aqi'] : null;

                // Derive a simple AQI status for display
                $status = 'unknown';
                if ($aqiVal !== null) {
                    if ($aqiVal <= 50) $status = 'good';
                    elseif ($aqiVal <= 100) $status = 'moderate';
                    elseif ($aqiVal <= 150) $status = 'unhealthy';
                    elseif ($aqiVal <= 200) $status = 'critical';
                    else $status = 'hazardous';
                }

                $aqiRows[] = [
                    'date'   => $row['report_date'],
                    'area'   => $row['area_label'],
                    'aqi'    => $aqiVal,
                    'status' => $status,
                ];
            }
        }
        $stmt->close();
    }
}

// --------------------------------------------------
// Fetch SMS send history from sms_logs
// --------------------------------------------------
$smsRows = [];
$deviceSmsRows = [];

if (true) {
    $sql = "
        SELECT 
            l.created_at, l.mobile, l.provider, l.status, l.error, l.area_name, l.area_id, l.alert_id,
            s.full_name, s.role
        FROM sms_logs l
        LEFT JOIN subscribers s ON (s.mobile COLLATE utf8mb4_general_ci = l.mobile COLLATE utf8mb4_general_ci)
        WHERE 1=1
    ";

    $params = [];
    $types  = '';

    if ($fromDate) {
        $sql    .= " AND DATE(l.created_at) >= ?";
        $types  .= 's';
        $params[] = $fromDate;
    }
    if ($toDate) {
        $sql    .= " AND DATE(l.created_at) <= ?";
        $types  .= 's';
        $params[] = $toDate;
    }

    $sql .= " ORDER BY l.created_at DESC LIMIT 300";

    $stmt = $mysqli->prepare($sql);
    if ($stmt) {
        if ($types !== '') {
            $stmt->bind_param($types, ...$params);
        }
        if ($stmt->execute()) {
            $res = $stmt->get_result();
            while ($row = $res->fetch_assoc()) {
                $recipient = $row['full_name'] ?: 'Unknown';
                if (!empty($row['role'])) {
                    $recipient .= ' (' . $row['role'] . ')';
                }
                
                $smsRows[] = [
                    'ts'     => $row['created_at'],
                    'mobile' => $row['mobile'],
                    'provider' => $row['provider'] ?? 'N/A',
                    'status' => $row['status'] ?? 'unknown',
                    'error'  => $row['error'] ?? '',
                    'area'   => $row['area_name'] ?: ($row['area_id'] ? 'Barangay '.$row['area_id'] : 'N/A'),
                    'alert'  => $row['alert_id'] ?? null,
                    'recipient' => $recipient
                ];
            }
        }
        $stmt->close();
    }
}

// Device alert SMS (filtered)
if (true) {
    $sqlDeviceSms = "
        SELECT 
            l.created_at,
            l.mobile,
            l.status,
            l.provider,
            l.error,
            l.area_name,
            a.value AS aqi_value,
            d.name AS device_name
        FROM sms_logs l
        LEFT JOIN alerts a ON a.id = l.alert_id
        LEFT JOIN devices d ON d.id = a.device_id
        WHERE l.alert_id IS NOT NULL
    ";

    $params = [];
    $types  = '';

    if ($fromDate) {
        $sqlDeviceSms .= " AND DATE(l.created_at) >= ?";
        $types .= 's';
        $params[] = $fromDate;
    }
    if ($toDate) {
        $sqlDeviceSms .= " AND DATE(l.created_at) <= ?";
        $types .= 's';
        $params[] = $toDate;
    }

    $sqlDeviceSms .= " ORDER BY l.created_at DESC LIMIT 300";

    $stmt = $mysqli->prepare($sqlDeviceSms);
    if ($stmt) {
        if ($types !== '') {
            $stmt->bind_param($types, ...$params);
        }
        if ($stmt->execute()) {
            $res = $stmt->get_result();
            while ($row = $res->fetch_assoc()) {
                $deviceSmsRows[] = $row;
            }
        }
        $stmt->close();
    }
}

// --------------------------------------------------
// Fetch Device Status & Uptime Stats (for Dashboard)
// --------------------------------------------------
$deviceStats = [
    'total' => 0,
    'online' => 0,
    'stale' => 0,
    'offline' => 0
];
$offlineDevices = [];

$sqlDevices = "
    SELECT
        d.id,
        d.name,
        d.status AS device_status,
        d.is_active,
        d.last_heartbeat,
        r.recorded_at,
        r.aqi
    FROM devices d
    LEFT JOIN readings r
        ON r.id = (
            SELECT rr.id
            FROM readings rr
            WHERE rr.device_id = d.id
            ORDER BY rr.recorded_at DESC
            LIMIT 1
        )
";
$resDevices = $mysqli->query($sqlDevices);
if ($resDevices) {
    while ($row = $resDevices->fetch_assoc()) {
        $deviceStats['total']++;
        
        $recordedAt = !empty($row['recorded_at']) ? strtotime($row['recorded_at']) : null;
        $heartbeatAt = !empty($row['last_heartbeat']) ? strtotime($row['last_heartbeat']) : null;
        $now = time();
        $readingAgeMin = $recordedAt ? ($now - $recordedAt) / 60 : null;
        $hbAgeMin = $heartbeatAt ? ($now - $heartbeatAt) / 60 : null;
        $isActive = (int)($row['is_active'] ?? 1) === 1;

        // Status Logic (mirrors get_devices.php)
        $status = $row['device_status'] ?: 'offline';

        if ($readingAgeMin !== null && $readingAgeMin <= 10) {
            $status = 'online';
        } elseif ($hbAgeMin !== null && $hbAgeMin <= 10) {
            $status = $isActive ? 'searching' : 'offline';
        } else {
             $status = $isActive ? 'searching' : 'offline';
        }
        
        // Stale logic
        if (!in_array($status, ['offline', 'searching'], true) && ($readingAgeMin === null || $readingAgeMin > 15)) {
            $status = 'stale';
        }
        
        // Map to display categories
        if ($status === 'online') {
            $deviceStats['online']++;
        } elseif ($status === 'stale') {
            $deviceStats['stale']++;
        } else {
            // Treat searching/offline/critical as offline for this summary card
            $deviceStats['offline']++;
            $offlineDevices[] = $row['name'];
        }
    }
}

// --------------------------------------------------
// Fetch Public Users History from users
// --------------------------------------------------
$publicRows = [];

if (true) {
    // Ensure created_at column exists (best-effort)
    try { $mysqli->query("ALTER TABLE users ADD COLUMN created_at DATETIME NULL DEFAULT CURRENT_TIMESTAMP"); } catch (Throwable $e) { /* ignore */ }
    try { $mysqli->query("ALTER TABLE users ADD COLUMN email VARCHAR(255) NULL"); } catch (Throwable $e) { /* ignore */ }
    try { $mysqli->query("ALTER TABLE users ADD COLUMN contact_number VARCHAR(32) NULL"); } catch (Throwable $e) { /* ignore */ }
    try { $mysqli->query("ALTER TABLE users ADD COLUMN city VARCHAR(255) NULL"); } catch (Throwable $e) { /* ignore */ }
    try { $mysqli->query("ALTER TABLE users ADD COLUMN barangay VARCHAR(255) NULL"); } catch (Throwable $e) { /* ignore */ }

    $sql = "
        SELECT created_at, username, email, contact_number, city, barangay
        FROM users
        WHERE 1=1
    ";

    $params = [];
    $types  = '';

    if ($fromDate) {
        $sql    .= " AND DATE(created_at) >= ?";
        $types  .= 's';
        $params[] = $fromDate;
    }
    if ($toDate) {
        $sql    .= " AND DATE(created_at) <= ?";
        $types  .= 's';
        $params[] = $toDate;
    }

    $sql .= " ORDER BY created_at DESC LIMIT 300";

    $stmt = $mysqli->prepare($sql);
    if ($stmt) {
        if ($types !== '') {
            $stmt->bind_param($types, ...$params);
        }
        if ($stmt->execute()) {
            $res = $stmt->get_result();
            while ($row = $res->fetch_assoc()) {
                $publicRows[] = [
                    'ts'      => $row['created_at'],
                    'user'    => $row['username'],
                    'email'   => $row['email'],
                    'contact' => $row['contact_number'],
                    'city'    => $row['city'],
                    'brgy'    => $row['barangay'],
                ];
            }
        }
        $stmt->close();
    }
}

// --------------------------------------------------
// Fetch User Activity History from user_login_history
// --------------------------------------------------
$activityRows = [];

if (true) {
    // Use COLLATE to resolve 'Illegal mix of collations for operation UNION'
    // We force all string columns to utf8mb4_unicode_ci
    $col = "COLLATE utf8mb4_unicode_ci";
    
    $sql = "
        SELECT 
            created_at, 
            username $col as username, 
            'login' $col as action, 
            ip_address $col as ip_address, 
            NULL as email
        FROM user_login_history 
        WHERE action = 'login'
        
        UNION ALL
        
        SELECT 
            created_at, 
            username $col as username, 
            'logout' $col as action, 
            ip_address $col as ip_address, 
            NULL as email
        FROM user_login_history 
        WHERE action = 'logout'

        UNION ALL

        SELECT
            created_at, 
            username $col as username, 
            'signup' $col as action, 
            NULL as ip_address, 
            email $col as email
        FROM users
    ";

    // We need to wrap this in a subquery or apply WHERE clause to each part if filtering by date.
    // Simpler approach for now:
    $sql = "SELECT * FROM ($sql) AS combined_activity WHERE 1=1"; 

    $params = [];
    $types  = '';

    if ($fromDate) {
        $sql    .= " AND DATE(created_at) >= ?";
        $types  .= 's';
        $params[] = $fromDate;
    }
    if ($toDate) {
        $sql    .= " AND DATE(created_at) <= ?";
        $types  .= 's';
        $params[] = $toDate;
    }

    $sql .= " ORDER BY created_at DESC LIMIT 300";

    $stmt = $mysqli->prepare($sql);
    if ($stmt) {
        if ($types !== '') {
            $stmt->bind_param($types, ...$params);
        }
        if ($stmt->execute()) {
            $res = $stmt->get_result();
            while ($row = $res->fetch_assoc()) {
                $activityRows[] = [
                    'ts'     => $row['created_at'],
                    'user'   => $row['username'],
                    'email'  => $row['email'],
                    'action' => $row['action'], // login/logout
                    'ip'     => $row['ip_address'],
                ];
            }
        }
        $stmt->close();
    }
}

// --------------------------------------------------
// Calculate Stats for Dashboard
// --------------------------------------------------
$totalLogins = count($loginRows);
$totalSms    = count($smsRows);
$newUsers    = count($publicRows);
$totalActivity = count($activityRows);
$validAqiRows = array_filter($aqiRows, fn($i) => $i['aqi'] !== null);
if (!empty($validAqiRows)) {
    $sum = array_reduce($validAqiRows, fn($c, $i) => $c + (int)$i['aqi'], 0);
    $avgAqi = round($sum / count($validAqiRows));
}

// --------------------------------------------------
// Aggregate Data for Charts
// --------------------------------------------------

// 1. Trend Chart (Daily Volumes)
$trendData = []; // [date => [login, sms, signup]]
$p1 = []; foreach($loginRows as $r) { $d = substr($r['ts'], 0, 10); $p1[$d] = ($p1[$d]??0)+1; }
$p2 = []; foreach($smsRows as $r) { $d = substr($r['ts'], 0, 10); $p2[$d] = ($p2[$d]??0)+1; }
$p3 = []; foreach($publicRows as $r) { $d = substr($r['ts'], 0, 10); $p3[$d] = ($p3[$d]??0)+1; }

// Merge all dates from the filtered range or found data
$allDates = array_unique(array_merge(array_keys($p1), array_keys($p2), array_keys($p3)));
sort($allDates);

$chartTrend = ['categories' => [], 'login' => [], 'sms' => [], 'signup' => []];
foreach ($allDates as $d) {
    if ($fromDate && $d < $fromDate) continue;
    if ($toDate && $d > $toDate) continue;
    
    $chartTrend['categories'][] = date('M j', strtotime($d));
    $chartTrend['login'][] = $p1[$d] ?? 0;
    $chartTrend['sms'][] = $p2[$d] ?? 0;
    $chartTrend['signup'][] = $p3[$d] ?? 0;
}

// 2. AQI Distribution (Pie)
$aqiDist = ['Good' => 0, 'Moderate' => 0, 'Unhealthy' => 0, 'Critical' => 0, 'Hazardous' => 0];
foreach ($validAqiRows as $r) {
    $s = ucfirst(strtolower($r['status']));
    if (isset($aqiDist[$s])) $aqiDist[$s]++;
    else $aqiDist['Other'] = ($aqiDist['Other']??0)+1;
}

// 3. SMS Performance (Bar)
$smsStats = ['Sent' => 0, 'Failed' => 0];
foreach ($smsRows as $r) {
    $s = ucfirst(strtolower($r['status']));
    if ($s === 'Sent' || $s === 'Delivered') $smsStats['Sent']++;
    else $smsStats['Failed']++;
}

// Calculate Rates
$smsSuccessRate = $totalSms > 0 ? round(($smsStats['Sent'] / $totalSms) * 100) : 0;
$loginSuccess = array_filter($loginRows, fn($r) => strtolower($r['status']) === 'success');
$loginSuccessRate = $totalLogins > 0 ? round((count($loginSuccess) / $totalLogins) * 100) : 0;


// Values to pre-fill filter inputs
$fromValue = $fromDate ?? '';
$toValue   = $toDate   ?? '';

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reports - EcoPulse</title>

    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">

    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css" integrity="sha512-SnH5WK+bZxgPHs44uWIX+LLJAJ9/2PkPKZ5QiAj6Ta86w+fsb2TkcmfRyVX3pBnMFcV7oQPJkl9QevSCWr3W6A==" crossorigin="anonymous" referrerpolicy="no-referrer" />

    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">

    <!-- Custom CSS -->
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <!-- Mobile Header -->
    <header class="mobile-header">
        <a href="index.php" class="mobile-brand">
            <img src="img/ecopulse_logo_final.png" alt="EcoPulse"> EcoPulse
        </a>
        <button class="mobile-menu-btn" id="mobileMenuBtn" type="button" aria-label="Open navigation">
            <i class="fa-solid fa-bars"></i>
        </button>
    </header>

        <!-- Sidebar Navigation -->
        <!-- Sidebar Navigation -->
        <?php include 'sidebar.php'; ?>

        <div class="sidebar-overlay" id="sidebarOverlay"></div>

        <!-- Main Content -->
        <main class="p-4 main-content">
            <header class="mb-4 d-flex justify-content-between align-items-center reveal">
            <div class="gap-3 d-flex align-items-center">
                    <span class="page-title-icon"><i class="fa-solid fa-clipboard-list"></i></span>
                    <h1 class="mb-0 h2 fw-bold">System Reports</h1>
            </div>
                <div class="header-actions d-flex align-items-center gap-3">
                    <div class="d-none d-lg-flex align-items-center gap-2 px-3 py-2 rounded-3 bg-white shadow-sm">
                        <div class="user-avatar-placeholder d-flex align-items-center justify-content-center text-uppercase fw-bold text-primary">
                            <?= htmlspecialchars(substr($currentUserLabel, 0, 1)) ?: 'U' ?>
                        </div>
                        <div class="d-flex flex-column">
                            <span class="fw-semibold small"><?= htmlspecialchars($currentUserLabel) ?></span>
                            <span class="text-muted small"><?= htmlspecialchars($currentRole) ?></span>
                        </div>
                    </div>
                    <div class="header-clock d-none d-xl-flex bg-white px-3 py-2 rounded-3 shadow-sm border border-light">
                        <div class="header-clock-time text-primary fw-bold" id="clockTime">--:--</div>
                        <div class="header-clock-date text-muted small ms-2" id="clockDate">---, --- --</div>
                    </div>
                </div>
            </header>

            <!-- Toolbar: Tabs + Compact Filter -->
            <div class="report-header-toolbar reveal">
                <!-- Custom Tabs -->
                <div class="p-1 d-inline-flex bg-white rounded-pill shadow-sm border pill-tabs" id="reportTabs">
                    <div class="pill-slider" id="pillSlider"></div>
                    <button type="button" data-report-type="all"
                       class="px-4 py-2 rounded-pill text-decoration-none fw-medium transition-all border-0 bg-transparent pill-tab <?= $reportType === 'all' ? 'active' : '' ?>">
                       Dashboard
                    </button>
                    <button type="button" data-report-type="aqi"
                       class="px-4 py-2 rounded-pill text-decoration-none fw-medium transition-all border-0 bg-transparent pill-tab <?= $reportType === 'aqi' ? 'active' : '' ?>">
                       Air Quality
                    </button>
                    <button type="button" data-report-type="login"
                       class="px-4 py-2 rounded-pill text-decoration-none fw-medium transition-all border-0 bg-transparent pill-tab <?= $reportType === 'login' ? 'active' : '' ?>">
                       Logins
                    </button>
                    <button type="button" data-report-type="sms"
                       class="px-4 py-2 rounded-pill text-decoration-none fw-medium transition-all border-0 bg-transparent pill-tab <?= $reportType === 'sms' ? 'active' : '' ?>">
                       SMS
                    </button>
                    <button type="button" data-report-type="device_sms"
                       class="px-4 py-2 rounded-pill text-decoration-none fw-medium transition-all border-0 bg-transparent pill-tab <?= $reportType === 'device_sms' ? 'active' : '' ?>">
                       Device SMS
                    </button>
                    <button type="button" data-report-type="public"
                       class="px-4 py-2 rounded-pill text-decoration-none fw-medium transition-all border-0 bg-transparent pill-tab <?= $reportType === 'public' ? 'active' : '' ?>">
                       Users
                    </button>
                    <button type="button" data-report-type="activity"
                       class="px-4 py-2 rounded-pill text-decoration-none fw-medium transition-all border-0 bg-transparent pill-tab <?= $reportType === 'activity' ? 'active' : '' ?>">
                       User Activity
                    </button>
                </div>

                <!-- Compact Filters -->
                <form id="reportFilters" method="get" action="reports.php" class="compact-filter-bar reveal">
                    <input type="hidden" name="type" id="filterType" value="<?= h($reportType) ?>">
                    
                    <div class="d-flex align-items-center gap-2">
                        <!-- Quick Filters -->
                        <div class="btn-group btn-group-sm me-2" role="group">
                            <button type="button" class="btn btn-outline-secondary" onclick="setDateRange(7)">7D</button>
                            <button type="button" class="btn btn-outline-secondary" onclick="setDateRange(30)">30D</button>
                        </div>

                        <i class="fa-regular fa-calendar text-muted"></i>
                        <input type="date" class="form-control" name="from" id="filterFrom" value="<?= h($fromValue) ?>" title="From Date">
                    </div>
                    <div class="d-flex align-items-center gap-2 border-start ps-3 ms-1">
                        <span class="text-muted small fw-medium">to</span>
                        <input type="date" class="form-control" name="to" id="filterTo" value="<?= h($toValue) ?>" title="To Date">
                    </div>
                    
                    <button type="submit" class="btn btn-primary btn-icon ms-2 shadow-sm" title="Apply Filters">
                        <i class="fa-solid fa-arrow-right"></i>
                    </button>
                    
                </form>
            </div>

            <!-- Charts Row (New) -->
            <div id="chartsRow" class="row g-4 mb-4 reveal" style="--reveal-delay: 50ms; display: <?= $reportType === 'all' ? 'flex' : 'none' ?>;">
                <!-- Trend Chart -->
                <div class="col-12 col-xl-8">
                    <div class="card border-0 shadow-sm h-100">
                        <div class="card-body">
                            <h6 class="fw-bold text-dark mb-3">Activity Trends</h6>
                            <div id="trendChart"></div>
                        </div>
                    </div>
                </div>
                <!-- Distribution Column -->
                <div class="col-12 col-xl-4 d-flex flex-column gap-4">
                     <!-- AQI Dist -->
                    <div class="card border-0 shadow-sm flex-fill">
                         <div class="card-body">
                            <h6 class="fw-bold text-dark mb-2">AQI Distribution</h6>
                            <div id="aqiChart" class="d-flex justify-content-center"></div>
                        </div>
                    </div>
                    <!-- SMS Perf -->
                    <div class="card border-0 shadow-sm flex-fill">
                         <div class="card-body">
                            <div class="d-flex justify-content-between align-items-start">
                                <h6 class="fw-bold text-dark mb-2">SMS Performance</h6>
                                <span class="badge bg-light text-dark border"><?= $smsSuccessRate ?>% Success</span>
                            </div>
                            <div id="smsChart"></div>
                        </div>
                    </div>
                </div>
            </div>
            </div>

            <!-- Summary Dashboard View -->
            <div id="dashboardView" class="report-view-section reveal" style="display: <?= $reportType === 'all' ? 'block' : 'none' ?>;">
                
                <!-- Stat Cards -->
                <div class="d-flex flex-wrap align-items-center gap-2 mb-4">
                    <!-- Export Dropdown -->
                    <div class="dropdown">
                        <button class="btn px-3 py-2 rounded-pill d-flex align-items-center gap-2" type="button" data-bs-toggle="dropdown" style="background: #e8f0fe; color: #1a73e8; border: none; font-weight: 500;">
                            <i class="fa-solid fa-file-export"></i> <span>Export</span>
                        </button>
                        <ul class="dropdown-menu dropdown-menu-end shadow border-0 p-2" style="min-width: 200px;">
                            <li>
                                <button class="dropdown-item rounded-2 d-flex align-items-center gap-2 py-2 mb-1" onclick="generatePDF(null, this)">
                                    <i class="fa-solid fa-file-pdf text-danger"></i> Export as PDF
                                </button>
                            </li>
                            <li><hr class="dropdown-divider my-1"></li>
                            <li><h6 class="dropdown-header text-uppercase small fw-bold mt-1">Export CSV Data</h6></li>
                            <?php foreach(['login','sms','public','activity','aqi'] as $t): ?>
                            <li>
                                <form method="post" action="export_csv.php" target="_blank" class="d-block w-100">
                                    <input type="hidden" name="type" value="<?= $t ?>">
                                    <input type="hidden" name="from" value="<?= $fromDate ?>">
                                    <input type="hidden" name="to" value="<?= $toDate ?>">
                                    <button type="submit" class="dropdown-item rounded-2 d-flex align-items-center gap-2 py-2 small">
                                        <i class="fa-solid fa-file-csv text-success"></i> <?= ucfirst($t) ?> Records
                                    </button>
                                </form>
                            </li>
                            <?php endforeach; ?>
                        </ul>
                    </div>

                    <!-- Quick Filters -->
                    <div class="dropdown">
                        <button class="btn btn-white border shadow-sm rounded-3 dropdown-toggle" type="button" data-bs-toggle="dropdown">
                            <i class="fa-solid fa-calendar me-1"></i> Filter
                        </button>
                        <ul class="dropdown-menu dropdown-menu-end shadow border-0">
                            <li><a class="dropdown-item" href="#" onclick="setDateRange(7)">Last 7 Days</a></li>
                            <li><a class="dropdown-item" href="#" onclick="setDateRange(30)">Last 30 Days</a></li>
                            <li><a class="dropdown-item" href="#" onclick="setDateRange(90)">Last 3 Months</a></li>
                            <li><hr class="dropdown-divider"></li>
                            <li><a class="dropdown-item" href="reports.php">Reset</a></li>
                        </ul>
                    </div>
                </div>

                <!-- Data Quality & Uptime Card -->
                <div class="card border-0 shadow-sm mb-4 rounded-4 reveal" id="dataQualityCard">
                    <div class="card-header bg-white border-0 py-3 d-flex justify-content-between align-items-center">
                        <h6 class="fw-bold mb-0 d-flex align-items-center gap-2">
                            <i class="fa-solid fa-screwdriver-wrench text-primary"></i> Data Quality & Uptime
                        </h6>
                        <button class="btn btn-sm btn-light rounded-circle"><i class="fa-solid fa-ellipsis"></i></button>
                    </div>
                    <div class="card-body">
                        <!-- Stats Row -->
                        <div class="row text-center mb-4">
                            <div class="col-3 border-end">
                                <h3 class="fw-bold mb-0 text-dark"><?= $deviceStats['total'] ?></h3>
                                <small class="text-muted">Total</small>
                            </div>
                            <div class="col-3 border-end">
                                <h3 class="fw-bold text-success mb-0"><?= $deviceStats['online'] ?></h3>
                                <small class="text-muted">Online</small>
                            </div>
                            <div class="col-3 border-end">
                                <h3 class="fw-bold text-warning mb-0"><?= $deviceStats['stale'] ?></h3>
                                <small class="text-muted">Stale</small>
                            </div>
                            <div class="col-3">
                                <h3 class="fw-bold text-danger mb-0"><?= $deviceStats['offline'] ?></h3>
                                <small class="text-muted">Offline</small>
                            </div>
                        </div>
                        <!-- Offline List -->
                        <div class="d-flex flex-column gap-2 px-2">
                            <?php if (!empty($offlineDevices)): ?>
                                <?php foreach ($offlineDevices as $devName): ?>
                                <div class="d-flex align-items-center gap-2 text-danger small">
                                    <i class="fa-solid fa-circle-xmark"></i>
                                    <span class="fw-medium"><?= h($devName) ?> is offline</span>
                                </div>
                                <?php endforeach; ?>
                            <?php else: ?>
                                <div class="d-flex align-items-center gap-2 text-success small">
                                    <i class="fa-solid fa-circle-check"></i>
                                    <span class="fw-medium">All devices are online</span>
                                </div>
                            <?php endif; ?>
                        </div>
                    </div>
                </div>
                <div class="stat-overview-grid reveal">
                    <!-- Logins -->
                    <div class="stat-card-modern">
                        <div class="stat-card-icon purple">
                            <i class="fa-solid fa-user-shield"></i>
                        </div>
                        <div class="stat-card-value"><?= number_format($totalLogins) ?></div>
                        <div class="stat-card-label">Admin Logins</div>
                    </div>
                    <!-- AQI -->
                    <div class="stat-card-modern">
                        <div class="stat-card-icon green">
                            <i class="fa-solid fa-wind"></i>
                        </div>
                        <div class="stat-card-value"><?= $avgAqi !== null ? $avgAqi : '--' ?></div>
                        <div class="stat-card-label">Avg Air Quality</div>
                    </div>
                    <!-- Users -->
                    <div class="stat-card-modern">
                        <div class="stat-card-icon orange">
                            <i class="fa-solid fa-users"></i>
                        </div>
                        <div class="stat-card-value"><?= number_format($newUsers) ?></div>
                        <div class="stat-card-label">New Users</div>
                    </div>
                    <!-- SMS -->
                    <div class="stat-card-modern">
                        <div class="stat-card-icon blue">
                            <i class="fa-solid fa-comment-sms"></i>
                        </div>
                        <div class="stat-card-value"><?= number_format($totalSms) ?></div>
                        <div class="stat-card-label">SMS Alerts Sent</div>
                    </div>
                     <!-- User Activity -->
                    <div class="stat-card-modern">
                        <div class="stat-card-icon blue">
                            <i class="fa-solid fa-clock-rotate-left"></i>
                        </div>
                        <div class="stat-card-value"><?= number_format($totalActivity) ?></div>
                        <div class="stat-card-label">User Activities</div>
                    </div>
                </div>

                <!-- Recent Activity Grid -->
                <div class="recent-activity-wrapper reveal" id="recentActivitySection" style="--reveal-delay: 100ms;">
                    
                    <!-- Recent Logins -->
                    <div class="mini-table-card">
                        <div class="mini-table-header">
                            <h5>Recent Admin Activity</h5>
                            <a href="#" class="mini-table-action" onclick="document.querySelector('[data-report-type=login]').click(); return false;">View All</a>
                        </div>
                        <table class="table mb-0 table-hover align-middle" style="font-size: 0.85rem;">
                            <thead class="bg-light">
                                <tr>
                                    <th class="ps-4">User</th>
                                    <th>Time</th>
                                    <th class="text-end pe-4">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php foreach (array_slice($loginRows, 0, 5) as $r): ?>
                                <tr>
                                    <td class="ps-4 fw-medium"><?= h($r['user']) ?></td>
                                    <td class="text-muted"><?= date('M j, g:i a', strtotime($r['ts'])) ?></td>
                                    <td class="text-end pe-4">
                                        <?php if (strtolower($r['status']) === 'success'): ?>
                                            <span class="text-success small fw-bold"><i class="fa-solid fa-check small me-1"></i>Success</span>
                                        <?php else: ?>
                                            <span class="text-danger small fw-bold">Failed</span>
                                        <?php endif; ?>
                                    </td>
                                </tr>
                                <?php endforeach; ?>
                                <?php if (empty($loginRows)): ?>
                                    <tr><td colspan="3" class="text-center py-3 text-muted">No data</td></tr>
                                <?php endif; ?>
                            </tbody>
                        </table>
                    </div>

                    <!-- Recent AQI -->
                    <div class="mini-table-card">
                        <div class="mini-table-header">
                            <h5>Latest Air Quality</h5>
                            <a href="#" class="mini-table-action" onclick="document.querySelector('[data-report-type=aqi]').click(); return false;">View All</a>
                        </div>
                        <table class="table mb-0 table-hover align-middle" style="font-size: 0.85rem;">
                            <thead class="bg-light">
                                <tr>
                                    <th class="ps-4">Area</th>
                                    <th class="text-center">AQI</th>
                                    <th class="text-end pe-4">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php foreach (array_slice($aqiRows, 0, 5) as $r): ?>
                                <tr>
                                    <td class="ps-4 text-truncate" style="max-width: 120px;"><?= h($r['area']) ?></td>
                                    <td class="text-center fw-bold"><?= h($r['aqi']) ?></td>
                                    <td class="text-end pe-4">
                                        <span class="badge rounded-pill <?= strtolower($r['status']) === 'good' ? 'bg-success-subtle' : 'bg-warning-subtle text-dark' ?>">
                                            <?= h($r['status']) ?>
                                        </span>
                                    </td>
                                </tr>
                                <?php endforeach; ?>
                                <?php if (empty($aqiRows)): ?>
                                    <tr><td colspan="3" class="text-center py-3 text-muted">No data</td></tr>
                                <?php endif; ?>
                            </tbody>
                        </table>
                    </div>

                     <!-- Recent Users -->
                    <div class="mini-table-card">
                        <div class="mini-table-header">
                            <h5>New Users</h5>
                            <a href="#" class="mini-table-action" onclick="document.querySelector('[data-report-type=public]').click(); return false;">View All</a>
                        </div>
                        <table class="table mb-0 table-hover align-middle" style="font-size: 0.85rem;">
                            <thead class="bg-light">
                                <tr>
                                    <th class="ps-4">Username</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php foreach (array_slice($publicRows, 0, 5) as $r): ?>
                                <tr>
                                    <td class="ps-4 fw-medium"><?= h($r['user']) ?></td>
                                    <td class="text-muted small"><?= date('M j', strtotime($r['ts'])) ?></td>
                                </tr>
                                <?php endforeach; ?>
                                <?php if (empty($publicRows)): ?>
                                    <tr><td colspan="2" class="text-center py-3 text-muted">No data</td></tr>
                                <?php endif; ?>
                            </tbody>
                        </table>
                    </div>

                    <!-- Recent SMS -->
                    <div class="mini-table-card">
                        <div class="mini-table-header">
                            <h5>Recent SMS</h5>
                            <a href="#" class="mini-table-action" onclick="document.querySelector('[data-report-type=sms]').click(); return false;">View All</a>
                        </div>
                        <table class="table mb-0 table-hover align-middle" style="font-size: 0.85rem;">
                            <thead class="bg-light">
                                <tr>
                                    <th class="ps-4">Recipient</th>
                                    <th>Mobile</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php foreach (array_slice($smsRows, 0, 5) as $r): ?>
                                <tr>
                                    <td class="ps-4 fw-medium"><?= h($r['recipient']) ?></td>
                                    <td class="text-muted small"><?= h($r['mobile']) ?></td>
                                    <td>
                                        <?php if (strtolower($r['status']) === 'sent'): ?>
                                            <span class="badge bg-success-subtle text-success border border-success-subtle">Sent</span>
                                        <?php else: ?>
                                            <span class="badge bg-danger-subtle text-danger border border-danger-subtle">Failed</span>
                                        <?php endif; ?>
                                    </td>
                                </tr>
                                <?php endforeach; ?>
                                <?php if (empty($smsRows)): ?>
                                    <tr><td colspan="3" class="text-center py-3 text-muted">No data</td></tr>
                                <?php endif; ?>
                            </tbody>
                        </table>
                    </div>

                    <!-- Recent Device SMS (Alerts) -->
                    <div class="mini-table-card">
                        <div class="mini-table-header">
                            <h5>Recent Device SMS</h5>
                            <a href="#" class="mini-table-action" onclick="document.querySelector('[data-report-type=device_sms]').click(); return false;">View All</a>
                        </div>
                        <table class="table mb-0 table-hover align-middle" style="font-size: 0.85rem;">
                            <thead class="bg-light">
                                <tr>
                                    <th class="ps-4">Device</th>
                                    <th>Status</th>
                                    <th class="text-end pe-4">Time</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php if (!empty($deviceSmsRows)): ?>
                                    <?php foreach (array_slice($deviceSmsRows, 0, 5) as $row): ?>
                                        <tr>
                                            <td class="ps-4">
                                                <div class="fw-medium"><?= h($row['device_name'] ?: 'Device') ?></div>
                                                <div class="small text-muted"><?= h($row['area_name'] ?: 'Area') ?></div>
                                            </td>
                                            <td>
                                                <?php if (strtolower($row['status'] ?? '') === 'sent'): ?>
                                                    <span class="badge bg-success-subtle text-success border border-success-subtle">Sent</span>
                                                <?php else: ?>
                                                    <span class="badge bg-secondary-subtle text-secondary border border-secondary-subtle"><?= h($row['status'] ?? 'unknown') ?></span>
                                                <?php endif; ?>
                                                <div class="small text-muted">AQI <?= h($row['aqi_value'] ?? '--') ?></div>
                                            </td>
                                            <td class="text-end pe-4">
                                                <div class="fw-medium small"><?= date('M j, g:i a', strtotime($row['created_at'])) ?></div>
                                                <div class="text-muted x-small"><?= h($row['mobile']) ?></div>
                                            </td>
                                        </tr>
                                    <?php endforeach; ?>
                                <?php else: ?>
                                    <tr><td colspan="3" class="text-center py-3 text-muted">No device SMS yet</td></tr>
                                <?php endif; ?>
                            </tbody>
                        </table>
                    </div>

                    <!-- Recent User Activity -->
                    <div class="mini-table-card">
                        <div class="mini-table-header">
                            <h5>Recent User Activity</h5>
                            <a href="#" class="mini-table-action" onclick="document.querySelector('[data-report-type=activity]').click(); return false;">View All</a>
                        </div>
                        <table class="table mb-0 table-hover align-middle" style="font-size: 0.85rem;">
                            <thead class="bg-light">
                                <tr>
                                    <th class="ps-4">User</th>
                                    <th>Action</th>
                                    <th>Time</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php foreach (array_slice($activityRows, 0, 5) as $r): ?>
                                <tr>
                                    <td class="ps-4 fw-medium"><?= h($r['user']) ?></td>
                                    <td>
                                        <?php if (strtolower($r['action']) === 'login'): ?>
                                            <span class="badge bg-success-subtle text-success border border-success-subtle">Login</span>
                                        <?php elseif (strtolower($r['action']) === 'signup'): ?>
                                            <span class="badge bg-primary-subtle text-primary border border-primary-subtle">Signed Up</span>
                                        <?php else: ?>
                                            <span class="badge bg-secondary-subtle text-secondary border border-secondary-subtle">Logout</span>
                                        <?php endif; ?>
                                    </td>
                                    <td class="text-muted small"><?= date('M j, g:i a', strtotime($r['ts'])) ?></td>
                                </tr>
                                <?php endforeach; ?>
                                <?php if (empty($activityRows)): ?>
                                    <tr><td colspan="3" class="text-center py-3 text-muted">No data</td></tr>
                                <?php endif; ?>
                            </tbody>
                        </table>
                    </div>

                </div>
            </div>

            <!-- Admin Login History -->
            <div class="mb-4 card-modern report-view-section reveal" style="display: <?= $reportType === 'login' ? 'block' : 'none' ?>;" id="cardLogin">
                <div class="card-header-modern d-flex justify-content-between align-items-center">
                    <span>Admin Login History</span>
                    <div class="d-flex align-items-center gap-2">
                        <input type="text" id="loginSearch" class="form-control form-control-sm" placeholder="Search logins">
                        <button type="button" onclick="generatePDF(null, this)" id="exportLogin" class="btn px-3 py-2 rounded-pill d-flex align-items-center gap-2" style="background: #e8f0fe; color: #1a73e8; border: none; font-weight: 500; font-size: 0.85rem;">
                            <i class="fa-solid fa-file-export"></i> Export
                        </button>
                    </div>
                </div>
                <div class="p-0 card-body-modern">
                    <div class="table-responsive">
                        <table class="table mb-0 align-middle table-hover modern-table report-table">
                            <thead>
                                <tr>
                                    <th>Date &amp; Time</th>
                                    <th>Username</th>
                                    <th>IP Address</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody id="loginTbody">
                                <?php if (!empty($loginRows)): ?>
                                    <?php foreach ($loginRows as $row): ?>
                                        <tr>
                                            <td><?= h($row['ts']) ?></td>
                                            <td><?= h($row['user']) ?></td>
                                            <td><?= h($row['ip']) ?></td>
                                            <td>
                                                <?php $ls = strtolower($row['status']); ?>
                                                <?php if ($ls === 'success'): ?>
                                                    <span class="badge bg-success-subtle text-success border border-success-subtle">Success</span>
                                                <?php else: ?>
                                                    <span class="badge bg-danger-subtle text-danger border border-danger-subtle"><?= h($row['status']) ?></span>
                                                <?php endif; ?>
                                            </td>
                                        </tr>
                                    <?php endforeach; ?>
                                <?php else: ?>
                                    <tr><td colspan="4" class="py-4 text-center text-muted">
                                        No login activity found for the selected filters.
                                    </td></tr>
                                <?php endif; ?>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <!-- SMS Send History -->
            <div class="mb-4 card-modern report-view-section reveal" style="display: <?= $reportType === 'sms' ? 'block' : 'none' ?>;" id="cardSms">
                <div class="card-header-modern d-flex justify-content-between align-items-center">
                    <span>SMS Send History</span>
                    <div class="d-flex align-items-center gap-2">
                        <input type="text" id="smsSearch" class="form-control form-control-sm" placeholder="Search SMS">
                        <button type="button" onclick="generatePDF(null, this)" id="exportSms" class="btn px-3 py-2 rounded-pill d-flex align-items-center gap-2" style="background: #e8f0fe; color: #1a73e8; border: none; font-weight: 500; font-size: 0.85rem;">
                            <i class="fa-solid fa-file-export"></i> Export
                        </button>
                    </div>
                </div>
                <div class="p-0 card-body-modern">
                    <div class="table-responsive">
                        <table class="table mb-0 align-middle table-hover modern-table report-table">
                            <thead>
                                <tr>
                                    <th>Date &amp; Time</th>
                                    <th>Recipient</th>
                                    <th>Mobile</th>
                                    <th>Provider</th>
                                    <th>Status</th>
                                    <th>Area</th>
                                    <th>Alert ID</th>
                                    <th>Error</th>
                                </tr>
                            </thead>
                            <tbody id="smsTbody">
                                <?php if (!empty($smsRows)): ?>
                                    <?php foreach ($smsRows as $row): ?>
                                        <tr>
                                            <td><?= h($row['ts']) ?></td>
                                            <td class="fw-medium"><?= h($row['recipient']) ?></td>
                                            <td><?= h($row['mobile']) ?></td>
                                            <td><?= h($row['provider']) ?></td>
                                            <td>
                                                <?php if (strtolower($row['status']) === 'sent'): ?>
                                                    <span class="badge bg-success-subtle text-success border border-success-subtle">Sent</span>
                                                <?php else: ?>
                                                    <span class="badge bg-danger-subtle text-danger border border-danger-subtle"><?= h($row['status']) ?></span>
                                                <?php endif; ?>
                                            </td>
                                            <td><?= h($row['area']) ?></td>
                                            <td><?= $row['alert'] ? h($row['alert']) : '—' ?></td>
                                            <td class="text-muted small"><?= $row['error'] ? h($row['error']) : '—' ?></td>
                                        </tr>
                                    <?php endforeach; ?>
                                <?php else: ?>
                                    <tr><td colspan="8" class="py-4 text-center text-muted">
                                        No SMS records found for the selected filters.
                                    </td></tr>
                                <?php endif; ?>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <!-- Device SMS Alerts -->
            <div class="mb-4 card-modern report-view-section reveal" style="display: <?= $reportType === 'device_sms' ? 'block' : 'none' ?>;" id="cardDeviceSms">
                <div class="card-header-modern d-flex justify-content-between align-items-center">
                    <span>Device SMS Alerts</span>
                    <div class="d-flex align-items-center gap-2">
                        <input type="text" id="deviceSmsSearch" class="form-control form-control-sm" placeholder="Search device SMS">
                        <button type="button" onclick="generatePDF(null, this)" id="exportDeviceSms" class="btn px-3 py-2 rounded-pill d-flex align-items-center gap-2" style="background: #e8f0fe; color: #1a73e8; border: none; font-weight: 500; font-size: 0.85rem;">
                            <i class="fa-solid fa-file-export"></i> Export
                        </button>
                    </div>
                </div>
                <div class="p-0 card-body-modern">
                    <div class="table-responsive">
                        <table class="table mb-0 align-middle table-hover modern-table report-table">
                            <thead>
                                <tr>
                                    <th>Date &amp; Time</th>
                                    <th>Device</th>
                                    <th>Area</th>
                                    <th>Mobile</th>
                                    <th>AQI</th>
                                    <th>Status</th>
                                    <th>Error</th>
                                </tr>
                            </thead>
                            <tbody id="deviceSmsTbody">
                                <?php if (!empty($deviceSmsRows)): ?>
                                    <?php foreach ($deviceSmsRows as $row): ?>
                                        <tr>
                                            <td><?= h($row['created_at']) ?></td>
                                            <td class="fw-medium"><?= h($row['device_name'] ?: 'Device') ?></td>
                                            <td><?= h($row['area_name'] ?: 'N/A') ?></td>
                                            <td><?= h($row['mobile']) ?></td>
                                            <td><?= $row['aqi_value'] !== null ? h($row['aqi_value']) : '--' ?></td>
                                            <td>
                                                <?php if (strtolower($row['status'] ?? '') === 'sent'): ?>
                                                    <span class="badge bg-success-subtle text-success border border-success-subtle">Sent</span>
                                                <?php else: ?>
                                                    <span class="badge bg-danger-subtle text-danger border border-danger-subtle"><?= h($row['status'] ?? 'unknown') ?></span>
                                                <?php endif; ?>
                                            </td>
                                            <td class="text-muted small"><?= $row['error'] ? h($row['error']) : '--' ?></td>
                                        </tr>
                                    <?php endforeach; ?>
                                <?php else: ?>
                                    <tr><td colspan="7" class="py-4 text-center text-muted">
                                        No device SMS records found for the selected filters.
                                    </td></tr>
                                <?php endif; ?>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <!-- Public Users History -->
            <div class="mb-4 card-modern report-view-section reveal" style="display: <?= $reportType === 'public' ? 'block' : 'none' ?>;" id="cardPublic">
                <div class="card-header-modern d-flex justify-content-between align-items-center">
                    <span>Public Users History</span>
                    <div class="d-flex align-items-center gap-2">
                        <input type="text" id="publicSearch" class="form-control form-control-sm" placeholder="Search users">
                        <button type="button" onclick="generatePDF(null, this)" id="exportPublic" class="btn px-3 py-2 rounded-pill d-flex align-items-center gap-2" style="background: #e8f0fe; color: #1a73e8; border: none; font-weight: 500; font-size: 0.85rem;">
                            <i class="fa-solid fa-file-export"></i> Export
                        </button>
                    </div>
                </div>
                <div class="p-0 card-body-modern">
                    <div class="table-responsive">
                        <table class="table mb-0 align-middle table-hover modern-table report-table">
                            <thead>
                                <tr>
                                    <th>Date Registered</th>
                                    <th>Username</th>
                                    <th>Email</th>
                                    <th>Contact</th>
                                    <th>City</th>
                                    <th>Barangay</th>
                                </tr>
                            </thead>
                            <tbody id="publicTbody">
                                <?php if (!empty($publicRows)): ?>
                                    <?php foreach ($publicRows as $row): ?>
                                        <tr>
                                            <td><?= h($row['ts']) ?></td>
                                            <td><?= h($row['user']) ?></td>
                                            <td><?= h($row['email']) ?></td>
                                            <td><?= h($row['contact']) ?></td>
                                            <td><?= h($row['city']) ?></td>
                                            <td><?= h($row['brgy']) ?></td>
                                        </tr>
                                    <?php endforeach; ?>
                                <?php else: ?>
                                    <tr><td colspan="6" class="py-4 text-center text-muted">
                                        No public user records found for the selected filters.
                                    </td></tr>
                                <?php endif; ?>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <!-- User Activity History -->
            <div class="mb-4 card-modern report-view-section reveal" style="display: <?= $reportType === 'activity' ? 'block' : 'none' ?>;" id="cardActivity">
                <div class="card-header-modern d-flex justify-content-between align-items-center">
                    <span>User Login/Logout Activity</span>
                    <div class="d-flex align-items-center gap-2">
                        <input type="text" id="activitySearch" class="form-control form-control-sm" placeholder="Search activity">
                        <button type="button" onclick="generatePDF(null, this)" id="exportActivity" class="btn px-3 py-2 rounded-pill d-flex align-items-center gap-2" style="background: #e8f0fe; color: #1a73e8; border: none; font-weight: 500; font-size: 0.85rem;">
                            <i class="fa-solid fa-file-export"></i> Export
                        </button>
                    </div>
                </div>
                <div class="p-0 card-body-modern">
                    <div class="table-responsive">
                        <table class="table mb-0 align-middle table-hover modern-table report-table">
                            <thead>
                                <tr>
                                    <th>Date &amp; Time</th>
                                    <th>Username</th>
                                    <th>Action</th>
                                    <th>IP Address</th>
                                </tr>
                            </thead>
                            <tbody id="activityTbody">
                                <?php if (!empty($activityRows)): ?>
                                    <?php foreach ($activityRows as $row): ?>
                                        <tr>
                                            <td><?= h($row['ts']) ?></td>
                                            <td class="fw-medium">
                                                <?= h($row['user']) ?>
                                                <?php if($row['email']): ?>
                                                    <div class="small text-muted"><?= h($row['email']) ?></div>
                                                <?php endif; ?>
                                            </td>
                                            <td>
                                                <?php if (strtolower($row['action']) === 'login'): ?>
                                                    <span class="badge bg-success-subtle text-success border border-success-subtle">Login</span>
                                                <?php elseif (strtolower($row['action']) === 'signup'): ?>
                                                    <span class="badge bg-primary-subtle text-primary border border-primary-subtle">Signed Up</span>
                                                <?php else: ?>
                                                    <span class="badge bg-secondary-subtle text-secondary border border-secondary-subtle">Logout</span>
                                                <?php endif; ?>
                                            </td>
                                            <td class="text-muted small"><?= h($row['ip']) ?></td>
                                        </tr>
                                    <?php endforeach; ?>
                                <?php else: ?>
                                    <tr><td colspan="4" class="py-4 text-center text-muted">
                                        No user activity found for the selected filters.
                                    </td></tr>
                                <?php endif; ?>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <!-- Air Quality Reports -->
            <div class="mb-4 card-modern report-view-section reveal" style="display: <?= $reportType === 'aqi' ? 'block' : 'none' ?>;" id="cardAqi">
                <div class="card-header-modern d-flex justify-content-between align-items-center">
                    <span>Air Quality Reports</span>
                    <div class="d-flex align-items-center gap-2">
                        <input type="text" id="aqiSearch" class="form-control form-control-sm" placeholder="Search AQI">
                        <button type="button" onclick="generatePDF(null, this)" id="exportAqi" class="btn px-3 py-2 rounded-pill d-flex align-items-center gap-2" style="background: #e8f0fe; color: #1a73e8; border: none; font-weight: 500; font-size: 0.85rem;">
                            <i class="fa-solid fa-file-export"></i> Export
                        </button>
                    </div>
                </div>
                <div class="p-0 card-body-modern">
                    <div class="table-responsive">
                        <table class="table mb-0 align-middle table-hover modern-table report-table">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Area / Station</th>
                                    <th class="text-center">Average AQI</th>
                                    <th class="text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody id="aqiTbody">
                                <?php if (!empty($aqiRows)): ?>
                                    <?php foreach ($aqiRows as $row): ?>
                                        <tr>
                                            <td><?= h($row['date']) ?></td>
                                            <td><?= h($row['area']) ?></td>
                                            <td class="text-center"><?= h($row['aqi']) ?></td>
                                            <td class="text-center">
                                                <?php $as = strtolower($row['status']); ?>
                                                <?php if ($as === 'good' || $as === 'moderate' || $as === 'safe'): ?>
                                                    <span class="badge bg-success-subtle text-success border border-success-subtle"><?= h($row['status']) ?></span>
                                                <?php elseif ($as === 'unhealthy' || $as === 'critical' || $as === 'hazardous'): ?>
                                                    <span class="badge bg-danger-subtle text-danger border border-danger-subtle"><?= h($row['status']) ?></span>
                                                <?php else: ?>
                                                    <span class="badge bg-secondary-subtle text-secondary border border-secondary-subtle"><?= h($row['status']) ?></span>
                                                <?php endif; ?>
                                            </td>
                                        </tr>
                                    <?php endforeach; ?>
                                <?php else: ?>
                                    <tr><td colspan="4" class="py-4 text-center text-muted">
                                        No air quality records for the selected filters.
                                    </td></tr>
                                <?php endif; ?>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

        </main>

    <!-- Leaflet CSS -->
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossorigin=""/>
    
    <!-- Bootstrap JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>

    <!-- Leaflet JS -->
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=" crossorigin=""></script>

    <!-- Custom JS -->
    <script src="js/script.js"></script>
    <script src="js/map.js"></script>
    <script src="js/reports.js"></script>
    
    <!-- EcoBot AI -->
    <script src="js/chatbot.js?v=2"></script>
    <!-- ApexCharts -->
    <script src="https://cdn.jsdelivr.net/npm/apexcharts"></script>
    <!-- html2pdf.js -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>

    <!-- Hidden PDF Report Template (Strict Centering) -->
    <div id="pdf-template" style="
        display: none;
        width: 100%;
        max-width: 100%;
        margin: 0 auto;
        padding: 30px;
        background: #fff;
        font-family: 'Segoe UI', Arial, sans-serif;
        font-size: 11px;
        color: #222;
        box-sizing: border-box;
    ">
        <!-- Header Row (Table for stable layout) -->
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; border-bottom: 2px solid #0d6efd; padding-bottom: 15px;">
            <tr>
                <td style="vertical-align: middle; text-align: left; width: 50%;">
                    <table style="border-collapse: collapse;"><tr>
                        <td style="vertical-align: middle; padding-right: 12px;">
                            <img src="img/ecopulse_logo_final.png" alt="EcoPulse" style="height: 45px;">
                        </td>
                        <td style="vertical-align: middle;">
                            <div style="font-size: 22px; font-weight: bold; color: #0d6efd; margin: 0;">EcoPulse</div>
                            <div style="font-size: 10px; color: #6c757d; margin: 0;">Environmental Monitoring System</div>
                        </td>
                    </tr></table>
                </td>
                <td style="vertical-align: middle; text-align: right; width: 50%;">
                    <div id="pdf-report-title" style="font-size: 16px; font-weight: bold; color: #333; margin-bottom: 4px;">System Report</div>
                    <div style="font-size: 10px; color: #6c757d;">Generated: <?= date('M j, Y g:i A') ?></div>
                    <div style="font-size: 10px; color: #6c757d;">User: <?= htmlspecialchars($currentUserLabel) ?></div>
                </td>
            </tr>
        </table>

        <!-- Date Range Context -->
        <div style="background: #f8f9fa; border: 1px solid #dee2e6; border-radius: 4px; padding: 10px 15px; margin-bottom: 20px; text-align: left;">
            <strong style="color: #333;">Report Period:</strong> 
            <span id="pdf-date-range" style="color: #555;">
                <?= $fromDate ? date('M j, Y', strtotime($fromDate)) : 'Start' ?> 
                to 
                <?= $toDate ? date('M j, Y', strtotime($toDate)) : 'Today' ?>
            </span>
        </div>

        <!-- Section Title -->
        <div style="border-left: 4px solid #0d6efd; padding-left: 10px; margin-bottom: 15px;">
            <h6 id="pdf-section-title" style="margin: 0; font-size: 13px; font-weight: bold; color: #333; text-transform: uppercase;">Executive Summary</h6>
        </div>

        <!-- Stats/Table Container (Content injected by JS) -->
        <div id="pdf-stats-container" style="width: 100%; margin-bottom: 20px;">
            <!-- Dynamic content here -->
        </div>

        <!-- Charts Section (Hidden for table reports) -->
        <div id="pdf-charts-section" style="display: none; margin-bottom: 20px;">
            <div style="border-left: 4px solid #0d6efd; padding-left: 10px; margin-bottom: 15px; margin-top: 20px;">
                <h6 style="margin: 0; font-size: 13px; font-weight: bold; color: #333; text-transform: uppercase;">Key Metrics & Trends</h6>
            </div>
            <div style="margin-bottom: 15px;">
                <div style="font-size: 10px; color: #6c757d; text-transform: uppercase; font-weight: bold; margin-bottom: 8px;">Activity Trends</div>
                <div id="pdf-chart-trend" style="height: 280px; border: 1px solid #eee; border-radius: 6px; padding: 10px; background: #fff;"></div>
            </div>
            <table style="width: 100%; border-collapse: collapse;">
                <tr>
                    <td style="width: 50%; padding-right: 10px; vertical-align: top;">
                        <div style="font-size: 10px; color: #6c757d; text-transform: uppercase; font-weight: bold; margin-bottom: 8px;">AQI Distribution</div>
                        <div id="pdf-chart-aqi" style="height: 220px; border: 1px solid #eee; border-radius: 6px; padding: 10px; background: #fff;"></div>
                    </td>
                    <td style="width: 50%; padding-left: 10px; vertical-align: top;">
                        <div style="font-size: 10px; color: #6c757d; text-transform: uppercase; font-weight: bold; margin-bottom: 8px;">SMS Performance</div>
                        <div id="pdf-chart-sms" style="height: 220px; border: 1px solid #eee; border-radius: 6px; padding: 10px; background: #fff;"></div>
                    </td>
                </tr>
            </table>
        </div>

        <!-- Activity Snapshot -->
        <div id="pdf-activity-container" style="display: none; margin-bottom: 20px;"></div>

        <!-- Footer -->
        <div style="margin-top: 30px; padding-top: 15px; border-top: 1px solid #dee2e6; text-align: center; color: #6c757d; font-size: 9px;">
            <p style="margin: 0 0 3px 0;">&copy; <?= date('Y') ?> EcoPulse System. All rights reserved.</p>
            <p style="margin: 0;">This document is auto-generated and valid without signature.</p>
        </div>
    </div>

    <script>
        // -------------------------------------------------------
        // SPA View Switching Logic
        // -------------------------------------------------------
        const views = {
            'all':      document.getElementById('dashboardView'),
            'login':    document.getElementById('cardLogin'),
            'sms':      document.getElementById('cardSms'),
            'device_sms': document.getElementById('cardDeviceSms'),
            'public':   document.getElementById('cardPublic'),
            'activity': document.getElementById('cardActivity'),
            'aqi':      document.getElementById('cardAqi')
        };

        function switchView(type) {
            console.log("Switching to view:", type);
            // 1. Update Tabs
            document.querySelectorAll('.pill-tab').forEach(btn => {
                if (btn.getAttribute('data-report-type') === type) {
                    btn.classList.add('active');
                    btn.setAttribute('aria-selected', 'true');
                } else {
                    btn.classList.remove('active');
                    btn.setAttribute('aria-selected', 'false');
                }
            });
            updateSlider();

            // 2. Hide All Views
            Object.values(views).forEach(el => {
                if(el) {
                    el.style.display = 'none';
                    el.style.opacity = '0'; // Ensure hidden ones are reset
                }
            });

            // 3. Show Target View & Dashboard Chart Row
            if (type === 'all') {
                if(views['all']) {
                    views['all'].style.display = 'block';
                    // Small timeout to allow display:block to apply before opacity transition if we wanted it, 
                    // but for now just force it.
                    views['all'].style.opacity = '1'; 
                }
                const charts = document.getElementById('chartsRow');
                if(charts) {
                    charts.style.display = 'flex';
                    charts.style.opacity = '1';
                }
            } else {
                // Hide Dashboard Chart Row
                const charts = document.getElementById('chartsRow');
                if(charts) charts.style.display = 'none';

                // Show specific table
                if(views[type]) {
                    views[type].style.display = 'block';
                    views[type].style.opacity = '1';
                } else {
                    console.error("View not found for type:", type);
                }
            }
        }

        // Override Tab Click
        document.querySelectorAll('.pill-tab').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const type = btn.getAttribute('data-report-type');
                switchView(type);
                // Also update hidden filter input so if they filter date, it keeps the view
                document.getElementById('filterType').value = type;
            });
        });
        
        // 1. Quick Date Filters
        function setDateRange(days) {
            const end = new Date();
            const start = new Date();
            start.setDate(end.getDate() - days);
            
            document.getElementById('filterFrom').value = start.toISOString().split('T')[0];
            document.getElementById('filterTo').value = end.toISOString().split('T')[0];
            document.getElementById('reportFilters').submit(); 
        }

        // 2. Render Charts Unconditionally
        document.addEventListener('DOMContentLoaded', function () {
            
            // --- Trend Chart ---
            const trendOpts = {
                series: [
                    { name: 'Admin Logins', data: <?= json_encode($chartTrend['login']) ?> },
                    { name: 'SMS Alerts', data: <?= json_encode($chartTrend['sms']) ?> },
                    { name: 'New Users', data: <?= json_encode($chartTrend['signup']) ?> }
                ],
                chart: { type: 'area', height: 320, toolbar: { show: false }, zoom: { enabled: false } }, 
                colors: ['#6f42c1', '#0d6efd', '#fd7e14'], 
                dataLabels: { enabled: false },
                stroke: { curve: 'smooth', width: 2 },
                xaxis: { categories: <?= json_encode($chartTrend['categories']) ?> },
                tooltip: { x: { format: 'dd MMM' } },
                legend: { position: 'top' },
                fill: { type: 'gradient', gradient: { opacityFrom: 0.6, opacityTo: 0.1 } }
            };
            var chart1 = new ApexCharts(document.querySelector("#trendChart"), trendOpts);
            chart1.render();
            window.chart1 = chart1; // Expose globally for PDF export

            // --- AQI Distribution ---
            const aqiOpts = {
                series: <?= json_encode(array_values($aqiDist)) ?>,
                labels: <?= json_encode(array_keys($aqiDist)) ?>,
                chart: { type: 'donut', height: 260 },
                colors: ['#198754', '#ffc107', '#fd7e14', '#dc3545', '#212529'], 
                legend: { position: 'bottom' },
                dataLabels: { enabled: false }, 
                plotOptions: { pie: { donut: { size: '65%', labels: { show: true, total: { show: true, label: 'Total', fontSize: '16px', fontWeight: 600 } } } } }
            };
            var chart2 = new ApexCharts(document.querySelector("#aqiChart"), aqiOpts);
            chart2.render();
            window.chart2 = chart2;

            // --- SMS Performance ---
            const smsOpts = {
                series: [{ name: 'Count', data: [<?= $smsStats['Sent'] ?>, <?= $smsStats['Failed'] ?>] }],
                chart: { type: 'bar', height: 180, toolbar: { show: false } },
                plotOptions: { bar: { borderRadius: 4, horizontal: true, barHeight: '50%' } },
                colors: ['#198754', '#dc3545'],
                xaxis: { categories: ['Sent', 'Failed'] },
                dataLabels: { enabled: true }
            };
            var chart3 = new ApexCharts(document.querySelector("#smsChart"), smsOpts);
            chart3.render();
            window.chart3 = chart3;

        });

        // Position Slider (Visual only)
        function updateSlider() {
            const active = document.querySelector('.pill-tab.active');
            const slider = document.getElementById('pillSlider');
            if (active && slider) {
                slider.style.width = active.offsetWidth + 'px';
                slider.style.left = active.offsetLeft + 'px';
            }
        }
        window.addEventListener('load', updateSlider);
        window.addEventListener('resize', updateSlider);

        // Sidebar Overlay Logic
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        const sidebarOverlay = document.getElementById('sidebarOverlay');
        
        if (mobileMenuBtn) {
            mobileMenuBtn.addEventListener('click', () => {
                document.body.classList.toggle('sidebar-open');
            });
        }
        if (sidebarOverlay) {
            sidebarOverlay.addEventListener('click', () => {
                document.body.classList.remove('sidebar-open');
            });
        }

         // Clock Logic
         function updateClock() {
            const now = new Date();
            const timeStr = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', second: '2-digit' });
            const dateStr = now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
            
            const timeEl = document.getElementById('clockTime');
            const dateEl = document.getElementById('clockDate');
            
            if (timeEl) timeEl.textContent = timeStr;
            if (dateEl) dateEl.textContent = dateStr;
        }
        setInterval(updateClock, 1000);
        updateClock();

        // -------------------------------------------------------
        // PDF Generation - Redirect to server-side FPDF export
        // -------------------------------------------------------
        function generatePDF(forceType, triggerBtn) {
            // Get type from hidden input or fallback
            const filterTypeInput = document.getElementById('filterType');
            const type = forceType || (filterTypeInput ? filterTypeInput.value : 'aqi');
            
            // Map report types to export_pdf.php report parameter
            const typeMap = {
                'aqi': 'aqi_reports',
                'login': 'login_history',
                'sms': 'sms',
                'device_sms': 'sms',  // Device SMS uses same SMS export
                'public': 'public_users',
                'activity': 'login_history', // Activity uses login history
                'all': 'aqi_reports'  // Default to AQI if dashboard
            };
            
            const reportType = typeMap[type] || 'aqi_reports';
            
            // Get date filters
            const fromDate = document.querySelector('input[name="from"]')?.value || '';
            const toDate = document.querySelector('input[name="to"]')?.value || '';
            
            // Build URL and open
            const url = `export_pdf.php?report=${reportType}&from=${fromDate}&to=${toDate}`;
            window.open(url, '_blank');
        }

    </script>
</body>
</html>
