<?php
// devices.php
require_once __DIR__ . '/session_bootstrap.php';
require_once 'db.php';

// Access Control: Admins Only
if (!isset($_SESSION['admin'])) {
    header("Location: index.php");
    exit;
}

$isAdmin = isset($_SESSION['admin']);
$isMasterAdmin = ($isAdmin && strtolower($_SESSION['username'] ?? '') === 'masteradmin');

// User Profile Logic
$currentUserLabel = $_SESSION['username'] ?? '';
$currentRole = 'Guest';

if ($isAdmin) {
    $currentRole = $isMasterAdmin ? 'Master Admin' : 'Admin';
    $currentUserLabel = $currentUserLabel !== '' ? $currentUserLabel : $currentRole;
}

$pdo = db();

// Initial Fetch (Static render for immediate paint)
$sql = "
    SELECT 
        d.id, 
        d.device_code, 
        d.name, 
        d.status, 
        d.is_active, 
        d.last_heartbeat, 
        d.lat, 
        d.lng, 
        b.name AS area,
        (SELECT pm1 FROM readings WHERE device_id = d.id ORDER BY recorded_at DESC LIMIT 1) as pm1,
        (SELECT pm25 FROM readings WHERE device_id = d.id ORDER BY recorded_at DESC LIMIT 1) as pm25,
        (SELECT pm10 FROM readings WHERE device_id = d.id ORDER BY recorded_at DESC LIMIT 1) as pm10,
        (SELECT o3 FROM readings WHERE device_id = d.id ORDER BY recorded_at DESC LIMIT 1) as o3,
        (SELECT co FROM readings WHERE device_id = d.id ORDER BY recorded_at DESC LIMIT 1) as co,
        (SELECT aqi FROM readings WHERE device_id = d.id ORDER BY recorded_at DESC LIMIT 1) as aqi
    FROM devices d
    LEFT JOIN barangays b ON b.id = d.barangay_id
    ORDER BY d.id ASC
";
$devices = $pdo->query($sql)->fetchAll(PDO::FETCH_ASSOC);

// AQI helper (matches dashboard: worst sub-index)
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

foreach ($devices as &$d) {
    $subs = [];
    $map = [
        'PM2.5' => ['key' => 'pm25', 'bp' => 'pm25'],
        'PM10'  => ['key' => 'pm10', 'bp' => 'pm10'],
        'O3'    => ['key' => 'o3',   'bp' => 'o3'],
        'CO'    => ['key' => 'co',   'bp' => 'co'],
    ];
    foreach ($map as $info) {
        $val = isset($d[$info['key']]) ? (float)$d[$info['key']] : null;
        if ($val !== null && isset($aqiBreakpoints[$info['bp']])) {
            $idx = $computeSubIndex($val, $aqiBreakpoints[$info['bp']]);
            if ($idx !== null) $subs[] = $idx;
        }
    }
    if (!empty($subs)) {
        $d['aqi'] = max($subs);
    } elseif (isset($d['aqi']) && is_numeric($d['aqi'])) {
        $d['aqi'] = (int)$d['aqi'];
    } else {
        $d['aqi'] = null;
    }
    if ($d['aqi'] !== null) {
        $d['aqi'] = max(0, min(500, (int)round($d['aqi'])));
    }
}
unset($d);
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Devices - EcoPulse</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="css/style.css">
    <style>
        :root {
            --font-main: 'Poppins', 'Outfit', sans-serif;
        }
        body {
            font-family: var(--font-main);
            background-color: #f4f6f9;
        }
        .main-content {
            padding-top: 1rem;
        }
        
        /* Device Card Styles */
        .device-card {
            border: none;
            border-radius: 16px;
            background: #fff;
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
            box-shadow: 0 2px 12px rgba(0,0,0,0.04);
            min-width: 0; /* allow flex/grid to shrink without overflow */
        }
        .device-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 12px 24px rgba(0,0,0,0.08);
        }
        .device-card.stopped {
            opacity: 0.85; 
            background-color: #fcfcfc;
        }
        
        /* Status Dot */
        .status-dot {
            height: 10px;
            width: 10px;
            border-radius: 50%;
            display: inline-block;
            margin-right: 6px;
        }
        .status-dot.active { background-color: #198754; box-shadow: 0 0 0 3px rgba(25, 135, 84, 0.1); }
        .status-dot.inactive { background-color: #6c757d; }
        .status-dot.warning { background-color: #ffc107; box-shadow: 0 0 0 3px rgba(255, 193, 7, 0.1); }
        .status-dot.critical { background-color: #dc3545; box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.1); }
        
        .status-label {
            font-size: 0.75rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        /* AQI Big Display */
        .aqi-container {
            text-align: center;
            padding: 1.5rem 0;
        }
        .aqi-value {
            font-size: 3.5rem;
            font-weight: 700;
            line-height: 1;
            margin-bottom: 0.25rem;
        }
        .aqi-label {
            font-size: 0.85rem;
            text-transform: uppercase;
            letter-spacing: 1px;
            font-weight: 600;
            color: #adb5bd;
        }

        /* Location */
        .location-text {
            font-size: 0.9rem;
            color: #6c757d;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
            margin-bottom: 1.5rem;
        }

        /* Action Buttons */
        .card-actions {
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
        }
        .btn-toggle {
            flex: 1 1 220px;
            font-weight: 600;
            letter-spacing: 0.5px;
            padding: 10px;
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
        }
        .btn-view {
            flex: 1 1 140px;
            border-radius: 10px;
            border: 2px solid #e9ecef;
            color: #495057;
            font-weight: 500;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .btn-view:hover {
            background-color: #f8f9fa;
            border-color: #dee2e6;
            color: #212529;
        }
        @media (min-width: 992px) {
            .btn-toggle { flex: 2 1 0; }
            .btn-view { flex: 1 1 0; }
        }

        /* AQI Colors */
        .text-good { color: #198754; }
        .text-fair { color: #ffc107; }
        .text-poor { color: #fd7e14; }
        .text-bad { color: #dc3545; }
        .text-stopped { color: #adb5bd; }
        .text-muted { color: #6c757d; }

        /* Grid helpers: keep cards visible and wrap cleanly */
        .device-grid-container {
            display: grid;
            /* Use auto-fill to ensure cards fit within container */
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
            gap: 1rem;
            width: 100%;
            box-sizing: border-box;
        }
        
        .device-grid-item {
            min-width: 0; /* Critical: allows grid item to shrink below content size */
            max-width: 100%;
            box-sizing: border-box;
        }

        /* Compact Card Styles */
        .device-card-compact {
            padding: 1.25rem !important;
            box-sizing: border-box;
            width: 100%;
        }
        .device-card-compact .aqi-value {
            font-size: 2.75rem;
            margin-bottom: 0rem;
        }
        .device-card-compact .location-text {
            font-size: 0.8rem;
            margin-bottom: 1rem;
        }
        .device-card-compact h5 {
            font-size: 1.1rem;
        }

        /* Ensure main content doesn't overflow */
        .main-content {
            overflow-x: hidden;
            max-width: 100%;
            box-sizing: border-box;
        }

        /* Mobile tweaks for grid */
        @media (max-width: 576px) {
            .device-grid-container {
                grid-template-columns: 1fr;
            }
        }

    </style>
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

    <!-- Sidebar -->
    <?php include 'sidebar.php'; ?>

    <!-- Main Content -->
    <div class="main-content container-fluid px-2 px-lg-3">
        <div class="d-flex flex-wrap align-items-center pt-3 pb-2 mb-4 border-bottom devices-header gap-3">
            <div class="d-flex align-items-center gap-3 flex-grow-1">
                <span class="page-title-icon bg-white text-primary shadow-sm"><i class="fa-solid fa-server"></i></span>
                <div>
                    <h1 class="h2 fw-bold mb-0">My Devices</h1>
                    <p class="text-muted mb-0 small">Control and monitor your fleet</p>
                </div>
            </div>
            <div class="d-flex flex-wrap align-items-center gap-3 ms-auto me-5 justify-content-md-end flex-grow-1">
                <button id="btn-refresh-devices" class="btn btn-white shadow-sm d-flex align-items-center gap-2 px-3 py-2 rounded-3 text-primary border border-light" title="Refresh Data">
                    <i class="fa-solid fa-rotate-right"></i> <span class="d-none d-md-inline fw-medium">Refresh</span>
                </button>

                <!-- User Badge & Clock -->
                <div class="d-flex align-items-center gap-2 px-3 py-2 rounded-3 bg-white shadow-sm col-auto">
                    <div class="user-avatar-placeholder d-flex align-items-center justify-content-center text-uppercase fw-bold text-primary">
                        <?= htmlspecialchars(substr($currentUserLabel, 0, 1)) ?: 'U' ?>
                    </div>
                    <div class="d-flex flex-column">
                        <span class="fw-semibold small"><?= htmlspecialchars($currentUserLabel) ?></span>
                        <span class="text-muted small"><?= htmlspecialchars($currentRole) ?></span>
                    </div>
                </div>
                <div class="header-clock d-flex flex-column align-items-end justify-content-center bg-white px-3 py-2 rounded-3 shadow-sm border border-light col-auto text-end" style="min-width: 140px;">
                    <div class="header-clock-time text-primary fw-bold lh-1" id="clockTime">--:--</div>
                    <div class="header-clock-date text-muted small mt-1 lh-1" id="clockDate" style="white-space: nowrap;">---, --- --</div>
                </div>

                <div class="vr opacity-25 mx-2 d-none d-lg-block" style="height: 30px;"></div>

                <?php if ($isAdmin): ?>
                <button type="button" class="btn btn-primary d-flex align-items-center gap-2" onclick="location.href='map.php'">
                    <i class="fa-solid fa-plus"></i> Add Device
                </button>
                <?php endif; ?>
            </div>
        </div>

        <div class="device-grid-container" id="devicesGrid">
            <?php foreach ($devices as $d): 
                $isActive = (int)($d['is_active'] ?? 1);
                $isOnline = ($d['status'] !== 'offline' && $isActive);
                $aqi = $d['aqi'] ?? '--';
                
                // Color Logic
                $aqiColorClass = 'text-stopped';
                if ($isActive) {
                    if ($aqi === '--') { $aqiColorClass = 'text-muted'; }
                    elseif ($aqi <= 50) { $aqiColorClass = 'text-good'; }
                    elseif ($aqi <= 100) { $aqiColorClass = 'text-fair'; }
                    elseif ($aqi <= 150) { $aqiColorClass = 'text-poor'; } 
                    else { $aqiColorClass = 'text-bad'; }
                }

                $statusText = $isActive ? ($isOnline ? strtoupper($d['status'] ?: 'Online') : 'OFFLINE') : 'STOPPED';
                // Map status class
                $statusClass = 'inactive';
                if ($isActive) {
                    if ($d['status'] === 'online') $statusClass = 'active';
                    elseif ($d['status'] === 'warning') $statusClass = 'warning';
                    elseif ($d['status'] === 'critical') $statusClass = 'critical';
                    else $statusClass = 'inactive'; // offline
                }
            ?>
            <div class="device-grid-item reveal">
                <div id="device-card-<?= $d['id'] ?>" class="device-card device-card-compact h-100 <?= !$isActive ? 'stopped' : '' ?>">
                    <!-- Header -->
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <div class="d-flex align-items-center gap-2">
                            <h5 id="device-name-<?= $d['id'] ?>" class="fw-bold mb-0 text-dark"><?= htmlspecialchars($d['name']) ?></h5>
                            <button class="btn btn-sm btn-link text-muted p-0 edit-device-btn" 
                                    data-id="<?= $d['id'] ?>" 
                                    data-name="<?= htmlspecialchars($d['name']) ?>"
                                    title="Edit device name">
                                <i class="fa-solid fa-pen-to-square"></i>
                            </button>
                        </div>
                        <div class="d-flex align-items-center">
                            <div id="status-dot-<?= $d['id'] ?>" class="status-dot <?= $statusClass ?>"></div>
                            <span id="status-label-<?= $d['id'] ?>" class="status-label <?= $isActive ? 'text-dark' : 'text-muted' ?>">
                                <?= $statusText ?>
                            </span>
                        </div>
                    </div>

                    <!-- Location -->
                    <div class="location-text">
                        <i class="fa-solid fa-location-dot"></i> 
                        <span class="text-truncate" style="max-width: 250px;">
                            <?= htmlspecialchars($d['area'] ?: 'Unknown Area') ?>
                        </span>
                    </div>

                    <!-- AQI Display -->
                    <div class="aqi-container">
                        <div id="aqi-value-<?= $d['id'] ?>" class="aqi-value <?= $aqiColorClass ?>">
                            <?= $aqi ?>
                        </div>
                        <div class="aqi-label">Current AQI</div>
                    </div>

                    <!-- Actions -->
                    <div class="card-actions mt-3">
                        <button id="toggle-btn-<?= $d['id'] ?>" class="btn btn-lg btn-toggle <?= $isActive ? 'btn-outline-danger' : 'btn-success' ?> toggle-btn" 
                                data-id="<?= $d['id'] ?>" 
                                data-active="<?= $isActive ?>">
                            <?php if ($isActive): ?>
                                <i class="fa-solid fa-stop"></i> Stop
                            <?php else: ?>
                                <i class="fa-solid fa-play"></i> Start
                            <?php endif; ?>
                        </button>
                        
                        <a href="index.php?device_id=<?= $d['id'] ?>" class="btn btn-view" title="View Dashboard">
                            View
                        </a>
                    </div>
                </div>
            </div>
            <?php endforeach; ?>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
    <script src="js/script.js"></script>
    <script>
        document.addEventListener('DOMContentLoaded', () => {
             // 1. Toggle Button Logic (AJAX)
             document.querySelectorAll('.toggle-btn').forEach(btn => {
                 btn.addEventListener('click', function(e) {
                     e.preventDefault();
                     const id = this.dataset.id;
                     
                     // Optimistic UI Feedback
                     const originalHtml = this.innerHTML;
                     this.disabled = true;
                     this.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
                     
                     fetch('api/device_control.php', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ action: 'toggle', device_id: id })
                     })
                     .then(res => res.json())
                     .then(data => {
                         if(data.success) {
                             // Success: Let polling handle the UI update, OR trigger an immediate fetch
                             pollDevices(); 
                             this.disabled = false; // Re-enable
                         } else {
                             alert('Error: ' + (data.error || 'Unknown error'));
                             this.innerHTML = originalHtml;
                             this.disabled = false;
                         }
                     })
                     .catch(err => {
                         console.error(err);
                         alert('Network error failed to toggle device.');
                         this.innerHTML = originalHtml;
                         this.disabled = false;
                     });
                 });
             });

             // 2. Polling Logic for Real-Time Updates
             const pollDevices = () => {
                 fetch('get_devices.php?_t=' + Date.now())
                    .then(res => res.json())
                    .then(data => {
                        if (!data.sensors) return;
                        
                        data.sensors.forEach(d => {
                            const id = d.id;
                            const isActive = d.isActive === 1;
                            const status = d.status; // online, offline, warning, critical, stale
                            // Clamp AQI for display
                            const rawAqi = d.aqi;
                            const aqi = (rawAqi !== null && rawAqi !== undefined) ? Math.max(0, Math.min(500, Math.round(rawAqi))) : null;

                            // Elements to update
                            const card = document.getElementById(`device-card-${id}`);
                            const dot = document.getElementById(`status-dot-${id}`);
                            const label = document.getElementById(`status-label-${id}`);
                            const aqiVal = document.getElementById(`aqi-value-${id}`);
                            const btn = document.getElementById(`toggle-btn-${id}`);

                            if (!card) return; // Device mismatch or removed?

                            // A. Update Card Style (Stopped opacity)
                            if (isActive) {
                                card.classList.remove('stopped');
                            } else {
                                card.classList.add('stopped');
                            }

                            // B. Update AQI Value & Color
                            if (aqiVal) {
                                aqiVal.textContent = (aqi !== null) ? aqi : '--';
                                // Reset classes
                                aqiVal.className = 'aqi-value';
                                if (!isActive) {
                                    aqiVal.classList.add('text-stopped'); // gray or muted
                                } else {
                                    if (aqi === null) aqiVal.classList.add('text-muted');
                                    else if (aqi <= 50) aqiVal.classList.add('text-good');
                                    else if (aqi <= 100) aqiVal.classList.add('text-fair');
                                    else if (aqi <= 150) aqiVal.classList.add('text-poor');
                                    else aqiVal.classList.add('text-bad');
                                }
                            }

                            // C. Update Status Dot & Label
                            let dotClass = 'inactive';
                            let labelText = 'OFFLINE';
                            let labelColorClass = 'text-muted'; // Default gray
                            
                            if (!isActive) {
                                labelText = 'STOPPED';
                                dotClass = 'inactive';
                                labelColorClass = 'text-muted';
                            } else {
                                // Active but check if receiving data
                                if (status === 'offline' || status === 'timeout' || status === 'searching') {
                                    // ACTIVE but NO DATA yet -> "SEARCHING..."
                                    labelText = 'SEARCHING...'; 
                                    dotClass = 'warning'; // Orange/Yellow to show activity
                                    labelColorClass = 'text-warning'; // Orange text
                                } else {
                                    labelText = status.toUpperCase(); // ONLINE, WARNING, CRITICAL
                                    if (status === 'online') {
                                        dotClass = 'active';
                                        labelColorClass = 'text-success';
                                    }
                                    else if (status === 'warning') {
                                        dotClass = 'warning';
                                        labelColorClass = 'text-warning';
                                    }
                                    else if (status === 'critical') {
                                        dotClass = 'critical';
                                        labelColorClass = 'text-danger';
                                    }
                                    else {
                                        dotClass = 'active'; 
                                        labelColorClass = 'text-success';
                                    }
                                }
                            }

                            if (dot) dot.className = `status-dot ${dotClass}`;
                            if (label) {
                                label.textContent = labelText;
                                // Reset and add new color class
                                label.className = 'status-label ' + labelColorClass;
                            }

                            // D. Update Toggle Button (Ensure it reflects state even if clicked elsewhere)
                            if (btn && !btn.disabled) {
                                btn.dataset.active = isActive ? '1' : '0';
                                if (isActive) {
                                    btn.innerHTML = '<i class="fa-solid fa-stop"></i> Stop';
                                    btn.classList.remove('btn-success');
                                    btn.classList.add('btn-outline-danger');
                                } else {
                                    btn.innerHTML = '<i class="fa-solid fa-play"></i> Start';
                                    btn.classList.remove('btn-outline-danger');
                                    btn.classList.add('btn-success');
                                }
                            }
                        });
                    })
                    .catch(err => console.error('Polling error:', err));
             };

             // 3. Manual Refresh
             const refreshBtn = document.getElementById('btn-refresh-devices');
             if (refreshBtn) {
                 refreshBtn.addEventListener('click', () => {
                     const icon = refreshBtn.querySelector('i');
                     if(icon) icon.classList.add('fa-spin');
                     pollDevices(); 
                     setTimeout(() => { if(icon) icon.classList.remove('fa-spin'); }, 800);
                 });
             }

             // Poll every 2 seconds for snappier feedback
             setInterval(pollDevices, 2000);
        });
    </script>
    
    <!-- EcoBot AI -->
    <script src="js/chatbot.js?v=2"></script>

    <!-- Edit Device Modal -->
    <div class="modal fade" id="editDeviceModal" tabindex="-1" aria-labelledby="editDeviceModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="editDeviceModalLabel"><i class="fa-solid fa-pen-to-square me-2"></i>Edit Device Name</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <input type="hidden" id="editDeviceId">
                    <div class="mb-3">
                        <label for="editDeviceName" class="form-label">Device Name</label>
                        <input type="text" class="form-control" id="editDeviceName" maxlength="100" required>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                    <button type="button" class="btn btn-primary" id="saveDeviceNameBtn">
                        <i class="fa-solid fa-save me-1"></i>Save
                    </button>
                </div>
            </div>
        </div>
    </div>

    <script>
        // Edit Device Name Handler
        document.addEventListener('DOMContentLoaded', () => {
            const modal = new bootstrap.Modal(document.getElementById('editDeviceModal'));
            const editDeviceId = document.getElementById('editDeviceId');
            const editDeviceName = document.getElementById('editDeviceName');
            const saveBtn = document.getElementById('saveDeviceNameBtn');

            // Open modal on edit button click
            document.querySelectorAll('.edit-device-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    editDeviceId.value = this.dataset.id;
                    editDeviceName.value = this.dataset.name;
                    modal.show();
                });
            });

            // Save button click
            saveBtn.addEventListener('click', function() {
                const deviceId = editDeviceId.value;
                const newName = editDeviceName.value.trim();

                if (!newName) {
                    alert('Device name cannot be empty.');
                    return;
                }

                saveBtn.disabled = true;
                saveBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin me-1"></i>Saving...';

                fetch('api/device_control.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ action: 'rename', device_id: deviceId, new_name: newName })
                })
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        // Update UI
                        const nameEl = document.getElementById(`device-name-${deviceId}`);
                        if (nameEl) nameEl.textContent = data.new_name;
                        
                        // Update data attribute on edit button
                        const editBtn = document.querySelector(`.edit-device-btn[data-id="${deviceId}"]`);
                        if (editBtn) editBtn.dataset.name = data.new_name;

                        modal.hide();
                    } else {
                        alert('Error: ' + (data.error || 'Unknown error'));
                    }
                })
                .catch(err => {
                    console.error(err);
                    alert('Network error. Please try again.');
                })
                .finally(() => {
                    saveBtn.disabled = false;
                    saveBtn.innerHTML = '<i class="fa-solid fa-save me-1"></i>Save';
                });
            });
        });
    </script>
</body>
</html>
