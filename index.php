<?php
require_once __DIR__ . '/session_bootstrap.php';
require_once __DIR__ . '/db.php';

if (!isset($_SESSION['admin']) && !isset($_SESSION['user'])) {
    header('Location: login.php');
    exit;
}

$currentUserLabel = $_SESSION['username'] ?? '';
$currentRole = 'Guest';
$isAdmin = isset($_SESSION['admin']);
$isUser = isset($_SESSION['user']);
$isGuest = isset($_SESSION['guest']);

// Fallback: if admin but username missing, fetch it once
if ($isAdmin && $currentUserLabel === '') {
    try {
        $pdoHeader = db();
        $stmtHeader = $pdoHeader->prepare('SELECT username FROM admins WHERE id = :id LIMIT 1');
        // Fix: Resolve ID
        $adminId = isset($_SESSION['admin_id']) ? (int)$_SESSION['admin_id'] : (int)$_SESSION['admin'];
        $stmtHeader->execute([':id' => $adminId]);
        $rowHeader = $stmtHeader->fetch(PDO::FETCH_ASSOC);
        if ($rowHeader && !empty($rowHeader['username'])) {
            $currentUserLabel = $rowHeader['username'];
        }
    } catch (Throwable $e) {
        // ignore and use fallback
    }
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

// Determine current device ID for dashboard
$currentDeviceId = null;
if (isset($_GET['device_id']) && is_numeric($_GET['device_id'])) {
    $currentDeviceId = (int)$_GET['device_id'];
} elseif (isset($_SESSION['default_device_id']) && is_numeric($_SESSION['default_device_id'])) {
    $currentDeviceId = (int)$_SESSION['default_device_id'];
}

// Fetch Health Condition using DB (safest)
$userHealthCondition = 'None';
try {
    if ($isAdmin || $isUser) {
        $uid = $_SESSION['user_id'] ?? $_SESSION['admin_id'] ?? $_SESSION['user'] ?? $_SESSION['admin'];
        $tbl = $isAdmin ? 'admins' : 'users';
        $stmtH = db()->prepare("SELECT health_condition FROM $tbl WHERE id = :id");
        $stmtH->execute([':id' => $uid]);
        $userHealthCondition = $stmtH->fetchColumn() ?: 'None';
    }
} catch (Throwable $e) { /* ignore */ }

$latestReadingDate = date('Y-m-d');
try {
    $pdoLatest = db();
    $stmtLatest = $pdoLatest->query("SELECT DATE(MAX(recorded_at)) AS d FROM readings");
    $maxDate = $stmtLatest ? $stmtLatest->fetchColumn() : null;
    if ($maxDate) {
        $latestReadingDate = $maxDate;
    }
} catch (Throwable $e) { /* fallback to today */ }
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>EcoPulse - Air Quality Monitoring</title>

    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css">
    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <!-- Custom CSS -->
    <link rel="stylesheet" href="css/style.css">
    <!-- Feather Icons -->
    <script src="https://cdn.jsdelivr.net/npm/feather-icons/dist/feather.min.js"></script>

    <script>
        window.USER_HEALTH_CONDITION = <?= json_encode($userHealthCondition) ?>;
    </script>
    <script>
        const USER_DEFAULT_DEVICE_ID = <?= json_encode((int)($_SESSION['default_device_id'] ?? 0)) ?>;
    </script>
</head>
<body>
    <!-- Mobile Header -->
    <header class="mobile-header">
        <a href="index.php" class="mobile-brand">
            <img src="img/ecopulse_logo_final.png" alt="EcoPulse"> EcoPulse
        </a>
        <button class="mobile-menu-btn" id="mobileMenuBtn">
            <i class="fa-solid fa-bars"></i>
        </button>
    </header>
    <div class="sidebar-overlay" id="sidebarOverlay"></div>

        <!-- Sidebar Navigation -->
<?php include 'sidebar.php'; ?>

        <div class="sidebar-overlay" id="sidebarOverlay"></div>

        <!-- Main Content -->
        <main class="p-4 main-content">
            <!-- Modern Dashboard Header -->
            <div class="dashboard-header-modern px-3 py-2 mb-4 d-flex flex-column flex-lg-row align-items-lg-center justify-content-between gap-3">
                
                <!-- Left Cluster: Navigation + Identity -->
                <div class="d-flex align-items-center gap-3">
                    <!-- Home Button -->
                    <a href="index.php" class="header-icon-btn shadow-sm" aria-label="Go home">
                        <i class="fa-solid fa-house fs-5"></i>
                    </a>
                    
                    <!-- Title & Subtitle -->
                    <div class="d-flex flex-column justify-content-center">
                        <h1 class="h5 fw-bold mb-0 text-dark lh-1">Dashboard</h1>
                        <span class="text-muted small lh-1 mt-1">Overview</span>
                    </div>
                </div>

                <!-- Middle Cluster: Filters (Context & Time) -->
                <div class="header-filter-group shadow-sm">
                    <!-- Context Selector -->
                    <div class="input-group input-group-sm flex-nowrap" style="width: auto;">
                        <span class="input-group-text text-danger"><i class="fa-solid fa-location-dot"></i></span>
                        <select class="form-select pe-4" id="dashboardDeviceSelector" aria-label="Select Context">
                            <option value="">THESIS (Global)</option>
                            <option disabled>Loading...</option>
                        </select>
                    </div>

                    <div class="header-divider"></div>

                    <!-- Time Range Selector -->
                    <div class="dropdown">
                        <button class="btn d-flex align-items-center gap-2" type="button" id="timeFilterBtn" data-bs-toggle="dropdown" aria-expanded="false">
                            <i class="fa-regular fa-clock text-muted"></i>
                            <span id="timeFilterLabel">1h</span>
                            <i class="fa-solid fa-chevron-down ms-1 text-muted" style="font-size: 0.7rem;"></i>
                        </button>
                        <ul class="dropdown-menu shadow-sm border-0 rounded-3 mt-1" aria-labelledby="timeFilterBtn">
                            <li><a class="dropdown-item active rounded-2" href="#" data-time="1h">Last 1 Hour</a></li>
                            <li><a class="dropdown-item rounded-2" href="#" data-time="6h">Last 6 Hours</a></li>
                            <li><a class="dropdown-item rounded-2" href="#" data-time="12h">Last 12 Hours</a></li>
                            <li><a class="dropdown-item rounded-2" href="#" data-time="24h">Last 24 Hours</a></li>
                        </ul>
                    </div>
                </div>

                <!-- Right Cluster: Actions + User Menu -->
                <div class="d-flex align-items-center gap-3 justify-content-between justify-content-lg-end">
                    
                    <!-- Actions Group -->
                    <div class="d-flex align-items-center gap-2">
                        <!-- Guide Button -->
                        <button class="btn btn-white btn-sm header-action-btn d-flex align-items-center gap-2 shadow-sm" data-bs-toggle="modal" data-bs-target="#aqiGuideModal">
                            <i class="fa-solid fa-book-open text-primary"></i> <span class="d-none d-sm-inline">Guide</span>
                        </button>
                        
                        <!-- Export Button -->
                        <div class="dropdown">
                            <button class="btn btn-primary btn-sm header-action-btn d-flex align-items-center gap-2 shadow-sm border-0" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                <i class="fa-solid fa-file-export"></i> <span class="d-none d-sm-inline">Export</span>
                            </button>
                            <ul class="dropdown-menu dropdown-menu-end shadow border-0 mt-1 rounded-3">
                                <li><a class="dropdown-item rounded-2" href="export_pdf.php?report=aqi_reports&from=<?= $latestReadingDate ?>&to=<?= $latestReadingDate ?>" target="_blank"><i class="fa-regular fa-file-lines me-2 text-muted"></i>Today's Report</a></li>
                                <li><a class="dropdown-item rounded-2" href="export_pdf.php?report=devices" target="_blank"><i class="fa-solid fa-network-wired me-2 text-muted"></i>Inventory</a></li>
                            </ul>
                        </div>
                    </div>

                    <div class="vr bg-secondary opacity-25 d-none d-md-block" style="width: 1px; min-height: 24px;"></div>

                    <!-- User Menu -->
                    <div class="dropdown">
                        <button class="header-user-menu d-flex align-items-center gap-2" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                            <div class="header-avatar bg-primary text-white fw-bold d-flex align-items-center justify-content-center rounded-circle">
                                <?= htmlspecialchars(substr($currentUserLabel, 0, 1)) ?: 'U' ?>
                            </div>
                            <span class="fw-bold text-dark small pe-1 d-none d-xl-block"><?= htmlspecialchars($currentUserLabel) ?></span>
                            <i class="fa-solid fa-chevron-down text-muted d-none d-xl-block" style="font-size: 0.7rem;"></i>
                        </button>
                        <ul class="dropdown-menu dropdown-menu-end shadow-sm border-0 mt-1 rounded-3">
                            <li><a class="dropdown-item rounded-2" href="profile.php"><i class="fa-solid fa-user me-2 text-muted"></i>Profile</a></li>
                            <li><hr class="dropdown-divider my-1"></li>
                            <li><a class="dropdown-item text-danger rounded-2" href="logout.php"><i class="fa-solid fa-right-from-bracket me-2"></i>Sign Out</a></li>
                        </ul>
                    </div>
                </div>
            </div>

            <!-- Main Status Card -->
            <div class="mb-3 row g-3">
                <div class="col-xl-5 col-lg-6">
                    <div class="text-white border-0 shadow-lg card h-100 main-aqi-card overflow-hidden position-relative" id="mainAqiCard">
                         <!-- Decorative background element -->
                        <div class="position-absolute top-0 end-0 p-3 opacity-25">
                            <i class="fa-solid fa-cloud fa-5x"></i>
                        </div>
                        
                        <div class="card-body d-flex flex-column justify-content-between position-relative z-index-1">
                            <div>
                                <div class="mb-2 d-flex align-items-center justify-content-between">
                                    <h5 class="mb-0 fw-bold"><i class="fa-solid fa-wind me-2"></i>Current Air Quality</h5>
                                    <span class="badge bg-white text-dark bg-opacity-75">Live</span>
                                </div>
                                <h6 class="mb-4 text-white hover-underline op-8" id="mainLocationLabel">Global Average</h6>
                            </div>
                            
                            <div class="text-center my-3 aqi-value-container">
                                <div class="display-1 fw-bold" id="mainAqiValue">--</div>
                                <div class="fs-4 fw-medium mt-1" id="mainAqiStatus">Waiting for data...</div>
                                <p class="aqi-plain-summary text-white text-opacity-90 small mb-0" id="aqiPlainSummary">Waiting for live guidance...</p>
                                <p class="text-white text-opacity-90 small mt-2 mb-0" id="mainDominantInline">Dominant pollutant: --</p>
                            </div>

                            <div class="health-recommendation mt-3">
                                <div class="d-flex align-items-center justify-content-center text-center">
                                    <div class="icon-wrapper me-2 flex-shrink-0 text-white">
                                        <i class="fa-solid fa-heart-pulse"></i>
                                    </div>
                                    <div class="text-white text-opacity-100">
                                        <strong>Recommendation:</strong> <span id="healthAdvice">...</span>
                                    </div>
                                </div>
                            </div>

                            <div class="aqi-thresholds mt-3 text-white">
                                <div class="d-flex align-items-center gap-2 mb-2">
                                    <i class="fa-solid fa-scale-balanced opacity-75"></i>
                                    <span class="fw-semibold">AQI thresholds</span>
                                </div>
                                <div class="d-flex flex-wrap gap-2">
                                    <span class="badge rounded-pill bg-success text-white px-3 py-2">Good 0-50</span>
                                    <span class="badge rounded-pill bg-primary text-white px-3 py-2">Moderate 51-100</span>
                                    <span class="badge rounded-pill bg-warning text-dark px-3 py-2">Sensitive 101-150</span>
                                    <span class="badge rounded-pill px-3 py-2 text-white" style="background:#fd7e14;">Unhealthy 151-200</span>
                                    <span class="badge rounded-pill bg-danger px-3 py-2">Very Unhealthy 201-300</span>
                                    <span class="badge rounded-pill bg-dark px-3 py-2">Hazardous 301+</span>
                                </div>
                                <div class="mt-3 p-3 rounded-3 bg-white text-dark shadow-sm border border-light">
                                    <div class="d-flex align-items-center gap-2 mb-2">
                                        <span class="badge bg-success-subtle text-success border border-success border-opacity-25 px-2 py-1">
                                            <i class="fa-solid fa-leaf me-1"></i>Stay in Good
                                        </span>
                                        <span class="text-muted small">Keep your air in the green zone</span>
                                    </div>
                                    <div class="small d-flex flex-wrap gap-2 align-items-center">
                                        <span class="badge rounded-pill bg-light text-dark border">PM2.5 ≤ 12 µg/m³</span>
                                        <span class="badge rounded-pill bg-light text-dark border">PM10 ≤ 50 µg/m³</span>
                                        <span class="badge rounded-pill bg-light text-dark border">CO ≤ 5 ppm</span>
                                        <span class="badge rounded-pill bg-light text-dark border">O₃ ≤ 100 ppb</span>
                                        <span class="badge rounded-pill bg-light text-dark border">CO₂ ≤ 1000 ppm</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="mt-3 text-end">
                                <small class="text-white text-opacity-75"><span class="pulse-live"></span>Last updated: <span id="lastUpdatedText">--:--</span></small>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Secondary Stats -->
                <div class="col-xl-7 col-lg-6">
                    <div class="row g-3 h-100">
                        <div class="col-md-6 reveal" style="--reveal-delay: 200ms;">
                            <div class="card stat-card-mini h-100 border-0 shadow-sm dashboard-mini-card">
                                <div class="card-body d-flex flex-column justify-content-center">
                                    <div class="d-flex align-items-center mb-2">
                                        <div class="stat-icon me-3 bg-light-primary"><i class="fa-solid fa-chart-column fa-lg"></i></div>
                                        <h6 class="mb-0 text-muted fw-semibold">Dominant Pollutant</h6>
                                    </div>
                                    <div class="ps-2">
                                         <p class="mb-0 fw-bold fs-3 text-dark" id="dominantPollutant">--</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6 reveal" style="--reveal-delay: 300ms;">
                            <div class="card stat-card-mini h-100 border-0 shadow-sm dashboard-mini-card">
                                <div class="card-body d-flex flex-column justify-content-center">
                                    <div class="d-flex align-items-center mb-2">
                                        <div class="stat-icon me-3 bg-light-info"><i class="fa-solid fa-tower-broadcast fa-lg"></i></div>
                                        <h6 class="mb-0 text-muted fw-semibold">Active Sensors</h6>
                                    </div>
                                    <div class="ps-2">
                                        <p class="mb-0 fw-bold fs-3 text-dark">
                                            <span id="sensorsOnline">--</span> <span class="fs-6 text-muted fw-normal">/ <span id="sensorsTotal">--</span> Online</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-12 reveal" style="--reveal-delay: 350ms;">
                            <div class="card stat-card-mini border-0 shadow-sm dashboard-mini-card">
                                <div class="card-body">
                                    <div class="d-flex flex-wrap align-items-start justify-content-between gap-2">
                                        <div>
                                            <div class="d-flex align-items-center mb-1">
                                                <div class="stat-icon me-2 bg-light-success"><i class="fa-solid fa-wave-square fa-lg"></i></div>
                                                <h6 class="mb-0 text-muted fw-semibold">30-min AQI Forecast</h6>
                                            </div>
                                            <p class="mb-0 fw-bold fs-4 text-dark" id="forecastHeadline">--</p>
                                            <p class="mb-0 small text-muted" id="forecastMeta">Waiting for forecast model...</p>
                                        </div>
                                        <span class="badge rounded-pill bg-light text-dark border px-3 py-2 fw-semibold" id="forecastConfidence">--</span>
                                    </div>
                                    <div class="small text-muted mt-2" id="forecastDrivers">Top drivers: --</div>
                                </div>
                            </div>
                        </div>
                        <div class="col-12 reveal" style="--reveal-delay: 400ms;">
                            <div class="card h-100 border-0 shadow-sm dashboard-trend-card">
                                <div class="card-header bg-transparent border-bottom-0 pt-3 pb-0">
                                    <h6 class="mb-0 fw-bold text-gray-800"><i class="fa-solid fa-arrow-trend-up me-2 text-primary"></i>AQI Trend (24h)</h6>
                                </div>
                                <div class="card-body pt-0" style="min-height: 200px;">
                                    <div id="aqiTrendChart"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Live Metrics -->
            <div class="mb-3 row g-3 reveal" style="--reveal-delay: 320ms;">
                <div class="col-12">
                    <div class="shadow-sm card border-0">
                        <div class="card-header bg-transparent d-flex align-items-center justify-content-between py-3">
                            <h6 class="mb-0 fw-bold"><i class="fa-solid fa-gauge-high me-2 text-primary"></i>Live Sensor Metrics</h6>
                            <button class="btn btn-outline-primary btn-sm" id="refreshDashboard" type="button">
                                <i class="fa-solid fa-rotate"></i> Refresh
                            </button>
                        </div>
                        <div class="card-body">
                            <div class="row g-3 text-center">
                                <div class="col-6 col-md-3 col-xl-3">
                                    <div class="p-3 h-100 border rounded-3 bg-light">
                                        <div class="metric-title-row">
                                            <span class="metric-title">PM1.0</span>
                                            <span class="sensor-label">SENSOR: PMS5003</span>
                                            <a class="sensor-link" href="https://www.adafruit.com/product/3686" target="_blank" rel="noopener noreferrer">Details</a>
                                            <span class="sensor-divider">|</span>
                                            <a class="sensor-link sensor-cert-link" href="#" data-sensor="PMS5003" target="_blank" rel="noopener noreferrer">Calibration Docs</a>
                                        </div>
                                        <div class="sensor-calibration-note">Factory calibration/accuracy per datasheet.</div>
                                        <div class="fw-bold fs-4" id="mainPm1">--</div>
                                        <div class="text-muted small">ug/m3</div>
                                    </div>
                                </div>
                                <div class="col-6 col-md-3 col-xl-3">
                                    <div class="p-3 h-100 border rounded-3 bg-light">
                                        <div class="metric-title-row">
                                            <span class="metric-title">PM2.5</span>
                                            <span class="sensor-label">SENSOR: PMS5003</span>
                                            <a class="sensor-link" href="https://www.adafruit.com/product/3686" target="_blank" rel="noopener noreferrer">Details</a>
                                            <span class="sensor-divider">|</span>
                                            <a class="sensor-link sensor-cert-link" href="#" data-sensor="PMS5003" target="_blank" rel="noopener noreferrer">Calibration Docs</a>
                                        </div>
                                        <div class="sensor-calibration-note">Factory calibration/accuracy per datasheet.</div>
                                        <div class="fw-bold fs-4" id="mainPm25">--</div>
                                        <div class="text-muted small">ug/m3</div>
                                    </div>
                                </div>
                                <div class="col-6 col-md-3 col-xl-3">
                                    <div class="p-3 h-100 border rounded-3 bg-light">
                                        <div class="metric-title-row">
                                            <span class="metric-title">PM10</span>
                                            <span class="sensor-label">SENSOR: PMS5003</span>
                                            <a class="sensor-link" href="https://www.adafruit.com/product/3686" target="_blank" rel="noopener noreferrer">Details</a>
                                            <span class="sensor-divider">|</span>
                                            <a class="sensor-link sensor-cert-link" href="#" data-sensor="PMS5003" target="_blank" rel="noopener noreferrer">Calibration Docs</a>
                                        </div>
                                        <div class="sensor-calibration-note">Factory calibration/accuracy per datasheet.</div>
                                        <div class="fw-bold fs-4" id="mainPm10">--</div>
                                        <div class="text-muted small">ug/m3</div>
                                    </div>
                                </div>
                                <div class="col-6 col-md-3 col-xl-3">
                                    <div class="p-3 h-100 border rounded-3 bg-light">
                                        <div class="metric-title-row">
                                            <span class="metric-title">O3</span>
                                            <span class="sensor-label">SENSOR: MQ-131</span>
                                            <a class="sensor-link" href="https://www.winsen-sensor.com/product/mq131-l.html" target="_blank" rel="noopener noreferrer">Details</a>
                                            <span class="sensor-divider">|</span>
                                            <a class="sensor-link sensor-cert-link" href="#" data-sensor="MQ-131" target="_blank" rel="noopener noreferrer">Calibration Docs</a>
                                        </div>
                                        <div class="sensor-calibration-note">Factory calibration/accuracy per datasheet.</div>
                                        <div class="fw-bold fs-4" id="mainO3">--</div>
                                        <div class="text-muted small">ug/m3</div>
                                    </div>
                                </div>
                                <div class="col-6 col-md-3 col-xl-3">
                                    <div class="p-3 h-100 border rounded-3 bg-light">
                                        <div class="metric-title-row">
                                            <span class="metric-title">CO</span>
                                            <span class="sensor-label">SENSOR: MQ-7</span>
                                            <a class="sensor-link" href="https://www.winsen-sensor.com/product/mq-7b.html" target="_blank" rel="noopener noreferrer">Details</a>
                                            <span class="sensor-divider">|</span>
                                            <a class="sensor-link sensor-cert-link" href="#" data-sensor="MQ-7" target="_blank" rel="noopener noreferrer">Calibration Docs</a>
                                        </div>
                                        <div class="sensor-calibration-note">Factory calibration/accuracy per datasheet.</div>
                                        <div class="fw-bold fs-4" id="mainCo">--</div>
                                        <div class="text-muted small">ppm</div>
                                    </div>
                                </div>
                                <div class="col-6 col-md-3 col-xl-3">
                                    <div class="p-3 h-100 border rounded-3 bg-light">
                                        <div class="metric-title-row">
                                            <span class="metric-title">CO2</span>
                                            <span class="sensor-label">SENSOR: MH-Z19B</span>
                                            <a class="sensor-link" href="https://www.winsen-sensor.com/sensors/co2-sensor/mh-z19b.html" target="_blank" rel="noopener noreferrer">Details</a>
                                            <span class="sensor-divider">|</span>
                                            <a class="sensor-link sensor-cert-link" href="#" data-sensor="MH-Z19B" target="_blank" rel="noopener noreferrer">Calibration Docs</a>
                                        </div>
                                        <div class="sensor-calibration-note">Factory calibration/accuracy per datasheet.</div>
                                        <div class="fw-bold fs-4" id="mainCo2">--</div>
                                        <div class="text-muted small">ppm</div>
                                    </div>
                                </div>
                                <div class="col-12 col-xl-6">
                                    <div class="p-3 h-100 border rounded-3 bg-white shadow-sm d-flex align-items-center justify-content-between">
                                        <div>
                                            <div class="text-muted small text-uppercase fw-bold mb-1">Conditions
                                                <span class="sensor-label ms-2">SENSOR: DHT22</span>
                                                <a class="sensor-link" href="https://www.adafruit.com/product/385" target="_blank" rel="noopener noreferrer">Details</a>
                                                <span class="sensor-divider">|</span>
                                                <a class="sensor-link sensor-cert-link" href="#" data-sensor="DHT22" target="_blank" rel="noopener noreferrer">Calibration Docs</a>
                                            </div>
                                            <div class="sensor-calibration-note text-start">Factory calibration/accuracy per datasheet.</div>
                                            <div class="d-flex align-items-baseline gap-3">
                                                <div>
                                                    <span class="fw-bold fs-2" id="mainTemp">--</span>
                                                    <span class="text-muted small">&deg;C</span>
                                                </div>
                                                <div class="border-start ps-3">
                                                    <span class="fw-bold fs-4" id="mainHumidity">--</span>
                                                    <span class="text-muted small">% Hum</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="text-center text-primary opacity-75">
                                            <i class="fa-solid fa-cloud-sun fa-3x" id="weatherIcon"></i>
                                            <div class="small mt-1 fw-medium" id="weatherText">--</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Decision Support & Analytics -->
            <div class="mb-3 row g-3">
                <div class="col-xl-7 col-lg-6 reveal" style="--reveal-delay: 450ms;">
                    
                    <div class="shadow-sm card h-100 border-0">
                        <div class="card-header bg-transparent d-flex justify-content-between align-items-center py-3">
                            <h6 class="mb-0 fw-bold"><i class="fa-solid fa-clipboard-check me-2 text-success"></i>Decision Support</h6>
                            <span class="badge bg-secondary rounded-pill" id="aqiRiskBadge">Awaiting AQI</span>
                        </div>
                        <div class="card-body d-flex flex-column">
                            <p class="mb-3 lead fs-6" id="decisionSupportText">Waiting for live readings...</p>
                            <div class="d-flex align-items-center text-muted small mt-auto">
                                <i class="fa-solid fa-circle-info me-2"></i>
                                <span id="sensorComparisonLabel">Deploy at least two sensors to compare locations.</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-xl-5 col-lg-6 reveal" style="--reveal-delay: 480ms;">
                    <div class="shadow-sm card h-100 border-0">
                        <div class="card-header bg-transparent d-flex justify-content-between align-items-center py-3">
                            <h6 class="mb-0 fw-bold"><i class="fa-solid fa-database me-2 text-info"></i>Data Analytics</h6>
                            <span class="badge bg-light text-dark border" id="analyticsWindow">Building window...</span>
                        </div>
                        <div class="card-body d-flex flex-column">
                            <ul class="mb-3 ps-3" id="analyticsList">
                                <li class="text-muted">Waiting for data...</li>
                            </ul>
                            <p class="mb-0 small text-muted border-top pt-2 mt-auto" id="trendSummary">
                                <i class="fa-solid fa-chart-line me-1"></i> Analytics summary appears here.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Data Quality & Maintenance -->
            <div class="mb-3 row g-3">
                <div class="col-xl-6 reveal" style="--reveal-delay: 480ms;">
                    <div class="shadow-sm card h-100 border-0">
                        <div class="card-header bg-transparent d-flex justify-content-between align-items-center py-3">
                            <h6 class="mb-0 fw-bold"><i class="fa-solid fa-screwdriver-wrench me-2 text-primary"></i>Data Quality & Uptime</h6>
                            <span class="badge bg-light text-dark border" id="dataQualityUpdated">--</span>
                        </div>
                        <div class="card-body">
                            <div class="row text-center mb-3">
                                <div class="col">
                                    <div class="fw-bold fs-5" id="dqTotal">--</div>
                                    <div class="text-muted small">Total</div>
                                </div>
                                <div class="col">
                                    <div class="fw-bold fs-5 text-success" id="dqOnline">--</div>
                                    <div class="text-muted small">Online</div>
                                </div>
                                <div class="col">
                                    <div class="fw-bold fs-5 text-warning" id="dqStale">--</div>
                                    <div class="text-muted small">Stale</div>
                                </div>
                                <div class="col">
                                    <div class="fw-bold fs-5 text-danger" id="dqOffline">--</div>
                                    <div class="text-muted small">Offline</div>
                                </div>
                            </div>
                            <ul class="mb-0 ps-3" id="dataQualityIssues">
                                <li class="text-muted">Waiting for sensor data...</li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="col-xl-6 reveal" style="--reveal-delay: 500ms;">
                    <div class="shadow-sm card h-100 border-0">
                        <div class="card-header bg-transparent d-flex justify-content-between align-items-center py-3">
                            <h6 class="mb-0 fw-bold"><i class="fa-solid fa-clock-rotate-left me-2 text-primary"></i>System Activity</h6>
                            <a href="reports.php" class="small text-decoration-none bg-light px-2 py-1 rounded-2 text-muted border">View All</a>
                        </div>
                        <div class="card-body p-0">
                            <div class="incident-timeline-wrapper" style="max-height: 250px; overflow-y: auto;">
                                <ul class="list-group list-group-flush" id="incidentTimelineList">
                                    <li class="list-group-item text-center text-muted py-4">
                                        <div class="spinner-border spinner-border-sm text-primary mb-2" role="status"></div>
                                        <br>Loading recent activity...
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Device Comparison -->
            <div class="mb-3 row g-3">
                <div class="col-12 reveal" style="--reveal-delay: 520ms;">
                    <div class="shadow-sm card h-100 border-0">
                        <div class="card-header bg-transparent d-flex flex-wrap gap-2 justify-content-between align-items-center py-3">
                            <h6 class="mb-0 fw-bold"><i class="fa-solid fa-chart-line me-2 text-primary"></i>Device Comparison</h6>
                            <div class="d-flex flex-wrap align-items-end gap-2">
                                <div>
                                    <label class="form-label small mb-1" for="compareCount">Count</label>
                                    <select id="compareCount" class="form-select form-select-sm" style="width: auto;">
                                        <option value="2" selected>2 Devices</option>
                                        <option value="3">3 Devices</option>
                                        <option value="4">4 Devices</option>
                                        <option value="5">5 Devices</option>
                                    </select>
                                </div>
                                <div id="compareSelectors" class="d-flex flex-wrap gap-2">
                                    <!-- Dynamic Selectors Injected Here by JS -->
                                </div>
                                <div>
                                    <label class="form-label small mb-1" for="compareFrom">From</label>
                                    <input type="date" id="compareFrom" class="form-control form-control-sm">
                                </div>
                                <div>
                                    <label class="form-label small mb-1" for="compareTo">To</label>
                                    <input type="date" id="compareTo" class="form-control form-control-sm">
                                </div>
                                <div class="align-self-end">
                                    <button class="btn btn-primary btn-sm" id="compareRun"><i class="fa-solid fa-play me-1"></i>Compare</button>
                                </div>
                            </div>
                        </div>
                        <div class="card-body">
                            <div id="compareChart" style="height: 300px;"></div>
                            <p class="small text-muted mt-2" id="compareSummary">Select two devices and a date range to see AQI trends.</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Devices & Alerts -->
            <div class="mb-3 row g-3">
                <!-- Alert Section (Full Width, hidden by default) -->
                <div class="col-12 reveal" style="--reveal-delay: 350ms; display: none;" id="thresholdAlertWrapper">
                    <div class="shadow-sm card h-100" id="thresholdAlert">
                        <div class="text-white card-header bg-danger d-flex justify-content-between align-items-center py-3">
                            <span class="fw-bold"><i class="fa-solid fa-triangle-exclamation me-2"></i>Threshold Alert</span>
                        </div>
                        <div class="gap-3 card-body d-flex flex-column bg-danger bg-opacity-10">
                            <p class="mb-0 fw-medium text-danger" id="thresholdMessage">Levels exceed configured thresholds.</p>
                            <a class="btn btn-danger btn-sm align-self-start shadow-sm" href="sms.php">
                                <i class="fa-solid fa-gear me-1"></i> Manage Alerts
                            </a>
                        </div>
                    </div>
                </div>

                <!-- Status Card (Visible when Good) -->
                <div class="col-12 reveal" style="--reveal-delay: 350ms;" id="statusCardWrapper">
                    <div class="card h-100 border-0 shadow-sm">
                        <div class="card-body d-flex flex-column justify-content-center p-4">
                            <div class="mb-3">
                                <span class="badge bg-success-subtle text-success border border-success-subtle px-3 py-2 rounded-pill fw-bold">
                                    <i class="fa-solid fa-leaf me-2"></i>Stay in Good
                                </span>
                            </div>
                            <div class="d-flex flex-wrap gap-2">
                                <span class="badge bg-light text-dark border fw-normal px-3 py-2 rounded-pill">PM2.5 ≤ 12 µg/m³</span>
                                <span class="badge bg-light text-dark border fw-normal px-3 py-2 rounded-pill">PM10 ≤ 50 µg/m³</span>
                                <span class="badge bg-light text-dark border fw-normal px-3 py-2 rounded-pill">CO ≤ 5 ppm</span>
                                <span class="badge bg-light text-dark border fw-normal px-3 py-2 rounded-pill">O₃ ≤ 100 ppb</span>
                                <span class="badge bg-light text-dark border fw-normal px-3 py-2 rounded-pill">CO₂ ≤ 1000 ppm</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Devices Section Removed -->

            </div>

            <!-- Detailed Tables and Charts -->
            <div class="row g-3">
                <div class="col-12 reveal" style="--reveal-delay: 600ms;">
                    <div class="shadow-sm card h-100 border-0">
                        <div class="card-header bg-transparent py-3">
                             <h6 class="mb-0 fw-bold"><i class="fa-solid fa-chart-area me-2 text-warning"></i>Pollutant & Environment Levels</h6>
                        </div>
                        <div class="card-body">
                            <div id="pollutantLevelsChart"></div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- AQI User Guide Modal placed at bottom of file -->
        </main>

    <!-- AQI Guide Modal -->
    <div class="modal fade" id="aqiGuideModal" tabindex="-1" aria-labelledby="aqiGuideModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-xl modal-dialog-centered">
            <div class="modal-content border-0 rounded-4 shadow-lg overflow-hidden">
                <div class="modal-header bg-white border-bottom-0 pb-0 pt-4 px-4">
                    <h5 class="modal-title fw-bolder text-dark" id="aqiGuideModalLabel">
                        <span class="bg-primary bg-opacity-10 text-primary rounded-circle p-2 me-2 d-inline-flex align-items-center justify-content-center" style="width:40px;height:40px">
                            <i class="fa-solid fa-book-open"></i>
                        </span>
                        AQI Guide & Standards
                    </h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body p-4 pt-2">
                    <p class="text-muted ms-5 mb-4 small">Understanding the Air Quality Index levels and monitored pollutant thresholds.</p>
                    
                    <div class="row g-4">
                        <!-- Left Column: AQI Scale -->
                        <div class="col-lg-5">
                            <h6 class="fw-bold small text-uppercase text-secondary mb-3 ms-1"><i class="fa-solid fa-layer-group me-2"></i>AQI Scale Categories</h6>
                            <div class="table-responsive">
                                <table class="table table-borderless text-center align-middle mb-0" style="border-collapse: separate; border-spacing: 0 8px;">
                                    <thead>
                                        <tr class="text-secondary small text-uppercase">
                                            <th class="fw-light" style="width: 90px;">AQI Range</th>
                                            <th class="fw-light">Category</th>
                                            <th class="fw-light text-start">Health Implication</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr class="shadow-sm" style="background-color: #f0fdf4;"> <!-- Green-50 -->
                                            <td class="rounded-start-3 fw-bold text-success">0 - 50</td>
                                            <td><span class="badge bg-success bg-opacity-25 text-success rounded-pill px-3">Good</span></td>
                                            <td class="text-start small text-dark opacity-75 rounded-end-3 py-3">Air quality is satisfactory; little or no risk.</td>
                                        </tr>
                                        <tr class="shadow-sm" style="background-color: #fefce8;"> <!-- Yellow-50 -->
                                            <td class="rounded-start-3 fw-bold text-warning">51 - 100</td>
                                            <td><span class="badge bg-warning bg-opacity-25 text-warning-emphasis rounded-pill px-3">Moderate</span></td>
                                            <td class="text-start small text-dark opacity-75 rounded-end-3 py-3">Acceptable quality. Risk for unusually sensitive people.</td>
                                        </tr>
                                        <tr class="shadow-sm" style="background-color: #ffedd5;"> <!-- Orange-50 -->
                                            <td class="rounded-start-3 fw-bold" style="color: #ea580c;">101 - 150</td>
                                            <td><span class="badge bg-opacity-25 text-orange-emphasis rounded-pill px-3" style="background-color: #ffedd5; color: #c2410c;">Sens. Groups</span></td>
                                            <td class="text-start small text-dark opacity-75 rounded-end-3 py-3">Sensitive groups may experience health effects.</td>
                                        </tr>
                                        <tr class="shadow-sm" style="background-color: #fef2f2;"> <!-- Red-50 -->
                                            <td class="rounded-start-3 fw-bold text-danger">151 - 200</td>
                                            <td><span class="badge bg-danger bg-opacity-25 text-danger rounded-pill px-3">Unhealthy</span></td>
                                            <td class="text-start small text-dark opacity-75 rounded-end-3 py-3">General public may experience health effects.</td>
                                        </tr>
                                        <tr class="shadow-sm" style="background-color: #faf5ff;"> <!-- Purple-50 -->
                                            <td class="rounded-start-3 fw-bold" style="color: #9333ea;">201 - 300</td>
                                            <td><span class="badge bg-opacity-25 text-purple-emphasis rounded-pill px-3" style="background-color: #f3e8ff; color: #7e22ce;">Very Unhealthy</span></td>
                                            <td class="text-start small text-dark opacity-75 rounded-end-3 py-3">Health alert: Increased risk for everyone.</td>
                                        </tr>
                                        <tr class="shadow-sm" style="background-color: #7f1d1d; color: white;"> <!-- Maroon -->
                                            <td class="rounded-start-3 fw-bold text-white">301+</td>
                                            <td><span class="badge bg-black bg-opacity-25 text-white border border-white border-opacity-25 rounded-pill px-3">Hazardous</span></td>
                                            <td class="text-start small text-white opacity-90 rounded-end-3 py-3">Health warning: Emergency conditions.</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <!-- Right Column: Meters -->
                        <div class="col-lg-7 ps-lg-4">
                            <h6 class="fw-bold small text-uppercase text-secondary mb-3 ms-1"><i class="fa-solid fa-gauge-high me-2"></i>Pollutant Thresholds</h6>
                            
                            <!-- Particulates -->
                            <div class="mb-4 p-3 bg-light bg-opacity-50 rounded-4 border border-light">
                                <div class="d-flex align-items-center mb-3">
                                    <span class="bg-white shadow-sm rounded-circle p-1 me-2 d-flex align-items-center justify-content-center" style="width:32px;height:32px"><i class="fa-solid fa-wind text-primary small"></i></span>
                                    <span class="fw-bold text-dark small text-uppercase">Particulate Matter (µg/m³)</span>
                                </div>
                                <div class="row g-3">
                                    <div class="col-md-4">
                                         <div class="p-3 bg-white rounded-4 shadow-sm h-100 border border-light">
                                            <div class="d-flex justify-content-between align-items-center mb-2">
                                                <span class="fw-bold text-dark">PM1.0</span>
                                                <span class="badge bg-light text-secondary border rounded-pill" style="font-size: 0.65rem;">Ultrafine</span>
                                            </div>
                                            <div class="progress bg-light" style="height: 10px; border-radius: 50rem;">
                                                <div class="progress-bar bg-success" role="progressbar" style="width: 33%; border-right: 2px solid white;" title="Good: 0-12"></div>
                                                <div class="progress-bar bg-warning" role="progressbar" style="width: 33%; border-right: 2px solid white;" title="Moderate: 12-35"></div>
                                                <div class="progress-bar bg-danger" role="progressbar" style="width: 34%" title="Unhealthy: >35"></div>
                                            </div>
                                            <div class="d-flex justify-content-between mt-2 text-secondary fw-medium" style="font-size: 0.65rem;">
                                                <span>0</span>
                                                <span>12</span>
                                                <span>35+</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-4">
                                        <div class="p-3 bg-white rounded-4 shadow-sm h-100 border border-light">
                                            <div class="d-flex justify-content-between align-items-center mb-2">
                                                <span class="fw-bold text-dark">PM2.5</span>
                                                <span class="badge bg-light text-secondary border rounded-pill" style="font-size: 0.65rem;">Fine</span>
                                            </div>
                                            <div class="progress bg-light" style="height: 10px; border-radius: 50rem;">
                                                <div class="progress-bar bg-success" role="progressbar" style="width: 33%; border-right: 2px solid white;" title="Good: 0-12"></div>
                                                <div class="progress-bar bg-warning" role="progressbar" style="width: 33%; border-right: 2px solid white;" title="Moderate: 12-35.4"></div>
                                                <div class="progress-bar bg-danger" role="progressbar" style="width: 34%" title="Unhealthy: >35.4"></div>
                                            </div>
                                            <div class="d-flex justify-content-between mt-2 text-secondary fw-medium" style="font-size: 0.65rem;">
                                                <span>0</span>
                                                <span>12.0</span>
                                                <span>35.4+</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-4">
                                        <div class="p-3 bg-white rounded-4 shadow-sm h-100 border border-light">
                                            <div class="d-flex justify-content-between align-items-center mb-2">
                                                <span class="fw-bold text-dark">PM10</span>
                                                <span class="badge bg-light text-secondary border rounded-pill" style="font-size: 0.65rem;">Coarse</span>
                                            </div>
                                            <div class="progress bg-light" style="height: 10px; border-radius: 50rem;">
                                                <div class="progress-bar bg-success" role="progressbar" style="width: 33%; border-right: 2px solid white;" title="Good: 0-54"></div>
                                                <div class="progress-bar bg-warning" role="progressbar" style="width: 33%; border-right: 2px solid white;" title="Moderate: 54-154"></div>
                                                <div class="progress-bar bg-danger" role="progressbar" style="width: 34%" title="Unhealthy: >154"></div>
                                            </div>
                                            <div class="d-flex justify-content-between mt-2 text-secondary fw-medium" style="font-size: 0.65rem;">
                                                <span>0</span>
                                                <span>54</span>
                                                <span>154+</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Gases -->
                            <div class="mb-4 p-3 bg-light bg-opacity-50 rounded-4 border border-light">
                                <div class="d-flex align-items-center mb-3">
                                    <span class="bg-white shadow-sm rounded-circle p-1 me-2 d-flex align-items-center justify-content-center" style="width:32px;height:32px"><i class="fa-solid fa-cloud text-info small"></i></span>
                                    <span class="fw-bold text-dark small text-uppercase">Gases (ppm / ppb)</span>
                                </div>
                                <div class="row g-3">
                                    <div class="col-md-4">
                                        <div class="p-3 bg-white rounded-4 shadow-sm h-100 border border-light">
                                            <div class="d-flex justify-content-between align-items-center mb-2">
                                                <span class="fw-bold text-dark">CO</span>
                                                <small class="text-muted fw-bold">ppm</small>
                                            </div>
                                            <div class="progress bg-light" style="height: 10px; border-radius: 50rem;">
                                                <div class="progress-bar bg-success" style="width: 33%; border-right: 2px solid white;"></div>
                                                <div class="progress-bar bg-warning" style="width: 33%; border-right: 2px solid white;"></div>
                                                <div class="progress-bar bg-danger" style="width: 34%"></div>
                                            </div>
                                            <div class="d-flex justify-content-between mt-2 text-secondary fw-medium" style="font-size: 0.65rem;">
                                                <span>0</span>
                                                <span>4.4</span>
                                                <span>9.4</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-4">
                                        <div class="p-3 bg-white rounded-4 shadow-sm h-100 border border-light">
                                            <div class="d-flex justify-content-between align-items-center mb-2">
                                                <span class="fw-bold text-dark">O3</span>
                                                <small class="text-muted fw-bold">ppb</small>
                                            </div>
                                            <div class="progress bg-light" style="height: 10px; border-radius: 50rem;">
                                                <div class="progress-bar bg-success" style="width: 33%; border-right: 2px solid white;"></div>
                                                <div class="progress-bar bg-warning" style="width: 33%; border-right: 2px solid white;"></div>
                                                <div class="progress-bar bg-danger" style="width: 34%"></div>
                                            </div>
                                            <div class="d-flex justify-content-between mt-2 text-secondary fw-medium" style="font-size: 0.65rem;">
                                                <span>0</span>
                                                <span>100</span>
                                                <span>164</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-4">
                                        <div class="p-3 bg-white rounded-4 shadow-sm h-100 border border-light">
                                            <div class="d-flex justify-content-between align-items-center mb-2">
                                                <span class="fw-bold text-dark">CO2</span>
                                                <small class="text-muted fw-bold">ppm</small>
                                            </div>
                                            <div class="progress bg-light" style="height: 10px; border-radius: 50rem;">
                                                <div class="progress-bar bg-success" style="width: 33%; border-right: 2px solid white;"></div>
                                                <div class="progress-bar bg-warning" style="width: 33%; border-right: 2px solid white;"></div>
                                                <div class="progress-bar bg-danger" style="width: 34%"></div>
                                            </div>
                                            <div class="d-flex justify-content-between mt-2 text-secondary fw-medium" style="font-size: 0.65rem;">
                                                <span>400</span>
                                                <span>1k</span>
                                                <span>2k</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Environmental -->
                            <div class="p-3 bg-light bg-opacity-50 rounded-4 border border-light">
                                <div class="d-flex align-items-center mb-3">
                                    <span class="bg-white shadow-sm rounded-circle p-1 me-2 d-flex align-items-center justify-content-center" style="width:32px;height:32px"><i class="fa-solid fa-seedling text-success small"></i></span>
                                    <span class="fw-bold text-dark small text-uppercase">Conditions</span>
                                </div>
                                <div class="row g-3">
                                    <div class="col-md-6">
                                        <div class="p-3 bg-white border border-light rounded-4 shadow-sm d-flex align-items-center justify-content-between">
                                            <div class="d-flex align-items-center">
                                                <div class="bg-danger bg-opacity-10 rounded-circle p-2 me-3">
                                                    <i class="fa-solid fa-temperature-three-quarters text-danger"></i>
                                                </div>
                                                <div>
                                                    <span class="fw-bold text-dark d-block">Temperature</span>
                                                    <span class="small text-muted">Comfort Zone</span>
                                                </div>
                                            </div>
                                            <div class="text-end">
                                                <span class="badge bg-white text-dark border border-2 border-light shadow-sm py-2 px-3 rounded-pill fw-bold">20-30°C</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="p-3 bg-white border border-light rounded-4 shadow-sm d-flex align-items-center justify-content-between">
                                            <div class="d-flex align-items-center">
                                                <div class="bg-info bg-opacity-10 rounded-circle p-2 me-3">
                                                    <i class="fa-solid fa-droplet text-info"></i>
                                                </div>
                                                <div>
                                                    <span class="fw-bold text-dark d-block">Humidity</span>
                                                    <span class="small text-muted">Comfort Zone</span>
                                                </div>
                                            </div>
                                            <div class="text-end">
                                                <span class="badge bg-white text-dark border border-2 border-light shadow-sm py-2 px-3 rounded-pill fw-bold">40-70%</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="mt-4 text-end">
                                <small class="text-muted fst-italic small">Source: <a href="https://www.airnow.gov/aqi/aqi-basics/" target="_blank" class="text-decoration-none fw-medium text-primary">U.S. EPA AirNow</a> & Local Standards</small>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer bg-white border-top-0 pt-0 pb-4 pe-4">
                    <button type="button" class="btn btn-light rounded-pill px-4" data-bs-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-primary rounded-pill px-4 shadow-sm" data-bs-dismiss="modal">Understood</button>
                </div>
            </div>
        </div>
    </div>

    <!-- SMS Alert Toast -->
    <div id="smsAlertModal" style="display:none;position:fixed;bottom:20px;right:20px;z-index:1050;max-width:320px;">
        <div class="card shadow-sm border-0" style="border-left:4px solid #e74c3c;">
            <div class="card-body py-3">
                <div class="d-flex align-items-start">
                    <div class="me-2">
                        <i class="fa-solid fa-triangle-exclamation text-danger"></i>
                    </div>
                    <div>
                        <p class="mb-1 fw-semibold text-danger">Critical pollution detected</p>
                        <p class="mb-2 small text-muted" id="smsAlertBody">SMS alert sent to barangay officials.</p>
                        <button type="button" id="smsAlertClose" class="btn btn-sm btn-outline-secondary">Dismiss</button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Leaflet CSS -->
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossorigin=""/>

    <!-- Bootstrap JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>

    <!-- Leaflet JS -->
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=" crossorigin=""></script>

    <!-- ApexCharts -->
    <script src="https://cdn.jsdelivr.net/npm/apexcharts"></script>

    <!-- Custom JS -->
    <script src="js/script.js?v=4"></script>
    <script src="js/map.js"></script>
    <script src="js/reports.js"></script>
    <!-- EcoBot Logic -->
    <script src="js/chatbot.js?v=2"></script>

    <!-- Calibration Documentation Link Management -->
    <script>
    (function() {
        // Calibration documentation URLs mapping
        // Since low-cost sensors don't provide individual calibration certificates,
        // we link to official manufacturer datasheets which contain calibration specs
        const sensorCertificates = {
            // Global/default calibration documentation (manufacturer datasheets)
            'global': {
                'PMS5003': 'https://www.aqmd.gov/docs/default-source/aq-spec/resources-page/plantower-pms5003-manual_v2-3.pdf',
                'MQ-131': 'https://www.winsen-sensor.com/d/files/mq131(ver1_2)-manual.pdf',
                'MQ-7': 'https://www.winsen-sensor.com/d/files/PDF/Semiconductor%20Gas%20Sensor/MQ-7B%20(Ver1.4)%20-%20Manual.pdf',
                'MH-Z19B': 'https://www.winsen-sensor.com/d/files/infrared-gas-sensor/mh-z19b-co2-ver1_0.pdf',
                'DHT22': 'https://cdn-learn.adafruit.com/downloads/pdf/dht.pdf'
            }
            // Device-specific certificates can be added here if you get them later:
            // 'device_1': { 'PMS5003': 'path/to/device1_pms5003_cert.pdf' }
        };

        // Update calibration docs links based on selected device
        function updateCalibrationCertLinks(deviceId) {
            const certLinks = document.querySelectorAll('.sensor-cert-link');
            
            certLinks.forEach(link => {
                const sensorModel = link.getAttribute('data-sensor');
                let certUrl = null;

                // Check device-specific certificate first
                if (deviceId && sensorCertificates[deviceId] && sensorCertificates[deviceId][sensorModel]) {
                    certUrl = sensorCertificates[deviceId][sensorModel];
                }
                // Fall back to global certificate
                else if (sensorCertificates['global'] && sensorCertificates['global'][sensorModel]) {
                    certUrl = sensorCertificates['global'][sensorModel];
                }

                // Update link state
                if (certUrl) {
                    link.href = certUrl;
                    link.classList.remove('disabled');
                    link.removeAttribute('title');
                } else {
                    link.href = '#';
                    link.classList.add('disabled');
                    link.setAttribute('title', 'Calibration documentation not available');
                    // Prevent click
                    link.onclick = function(e) {
                        e.preventDefault();
                        return false;
                    };
                }
            });
        }

        // Listen for device selector change
        document.addEventListener('DOMContentLoaded', function() {
            const deviceSelector = document.getElementById('dashboardDeviceSelector');
            
            // Initial update (no device selected = global)
            updateCalibrationCertLinks(null);
            
            if (deviceSelector) {
                deviceSelector.addEventListener('change', function() {
                    updateCalibrationCertLinks(this.value);
                });
            }
        });

        // Expose function globally for manual updates
        window.updateCalibrationCertLinks = updateCalibrationCertLinks;
    })();
    </script>

</body>
</html>
