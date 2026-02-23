<?php
require_once __DIR__ . '/session_bootstrap.php';
require_once __DIR__ . '/db.php';

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
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Map View - EcoPulse</title>

    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">

    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css" integrity="sha512-SnH5WK+bZxgPHs44uWIX+LLJAJ9/2PkPKZ5QiAj6Ta86w+fsb2TkcmfRyVX3pBnMFcV7oQPJkl9QevSCWr3W6A==" crossorigin="anonymous" referrerpolicy="no-referrer" />

    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">

    <!-- Leaflet CSS -->
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossorigin=""/>

    <!-- Custom CSS -->
    <link rel="stylesheet" href="css/style.css">
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
        <!-- Sidebar Navigation -->
        <?php include 'sidebar.php'; ?>

        <div class="sidebar-overlay" id="sidebarOverlay"></div>

        <!-- Main Content (Vertical Stack Layout) -->
        <main class="main-content p-4">
            
            <!-- 1. Top Section: Header & Status Dashboard -->
            <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
                
                <!-- Title & Live Badge -->
                <div>
                   <div class="d-flex flex-wrap align-items-center gap-3 mb-1">
                        <span class="page-title-icon bg-white text-primary shadow-sm"><i class="fa-solid fa-map-location-dot"></i></span>
                        <h2 class="mb-0 fw-bold">My Devices</h2>
                   </div>
                   <div class="d-flex align-items-center gap-2">
                        <span class="text-muted small">Control and monitor your fleet</span>
                   </div>
                </div>

                <!-- Global Stats Bar -->
                <!-- Right Side: Info Cards & Stats -->
                <div class="d-flex flex-column flex-xl-row align-items-end align-items-xl-center gap-3">
                    
                    <!-- User Badge & Clock -->
                    <div class="d-flex align-items-center gap-2">
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
                
                    <!-- Global Stats Bar -->
                    <div class="d-flex align-items-center gap-3 bg-white px-4 py-2 rounded-4 shadow-sm border border-light stats-bar-responsive">
                        <div class="d-flex flex-column align-items-center px-2">
                            <small class="text-muted text-uppercase fw-bold" style="font-size: 0.65rem;">Avg AQI</small>
                            <span class="h4 fw-bold mb-0 text-dark" id="mapAvgAqi"><span class="skeleton-line is-loading" style="width:40px;height:1.2rem;display:inline-block"></span></span>
                        </div>
                        <div class="vr opacity-25" style="height: 30px;"></div>
                        <div class="d-flex flex-column align-items-center px-2">
                            <small class="text-muted text-uppercase fw-bold" style="font-size: 0.65rem;">Online</small>
                             <span class="h4 fw-bold mb-0 text-success" id="mapOnlineCount"><span class="skeleton-line is-loading" style="width:30px;height:1.2rem;display:inline-block"></span></span>
                        </div>
                        <div class="vr opacity-25" style="height: 30px;"></div>
                        <div class="d-flex flex-column align-items-center px-2">
                            <small class="text-muted text-uppercase fw-bold" style="font-size: 0.65rem;">Alerts</small>
                             <span class="h4 fw-bold mb-0 text-danger" id="mapCriticalCount"><span class="skeleton-line is-loading" style="width:30px;height:1.2rem;display:inline-block"></span></span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Controls / Filters Row -->
            <div class="d-flex flex-wrap align-items-center justify-content-between mb-3 gap-3">
                <div class="d-flex gap-2">
                     <select id="filterStatus" class="form-select border-0 shadow-sm" style="min-width: 140px; border-radius: 0.8rem;">
                        <option value="all">Status: All</option>
                        <option value="online">Healthy</option>
                        <option value="warning">Watch</option>
                        <option value="critical">Critical</option>
                        <option value="offline">Offline</option>
                    </select>
                    <select id="filterAqiBand" class="form-select border-0 shadow-sm" style="min-width: 140px; border-radius: 0.8rem;">
                        <option value="all">AQI: All</option>
                        <option value="good">Good</option>
                        <option value="moderate">Moderate</option>
                        <option value="unhealthy">Unhealthy</option>
                    </select>
                </div>
                
                <div class="d-flex gap-2">
                    <button id="mapRefreshTop" class="btn btn-primary shadow-sm rounded-circle d-flex align-items-center justify-content-center" style="width: 40px; height: 40px; background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); border:none;" title="Refresh Data">
                         <i class="fa-solid fa-rotate-right"></i>
                    </button>
                    <?php if ($isAdmin || !$isUser): ?>
                    <button id="mapLocate" class="btn btn-primary shadow-sm rounded-circle d-flex align-items-center justify-content-center" style="width: 40px; height: 40px; background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); border:none;" title="Locate Me">
                        <i class="fa-solid fa-location-crosshairs"></i>
                    </button>
                     <?php endif; ?>
                </div>
            </div>

            <!-- 2. Middle Section: Map Frame -->
            <div class="map-landscape-frame mb-5">
                <div id="map" class="map-layer"></div>
                
                <!-- Floating Legend inside map (Bottom Left) -->
                <div class="floating-legend glass-panel">
                    <span class="fw-bold me-2 small text-uppercase text-muted" style="font-size: 0.7rem;">AQI Index</span>
                    <div class="d-flex align-items-center gap-2 flex-wrap">
                        <span class="badge rounded-pill border border-white text-dark shadow-sm" style="background: #a7f3d0;">0-50 Good</span>
                        <span class="badge rounded-pill border border-white text-dark shadow-sm" style="background: #fde68a;">51-100 Mod</span>
                         <span class="badge rounded-pill border border-white text-dark shadow-sm" style="background: #fed7aa;">101-150 Unhealthy (SG)</span>
                        <span class="badge rounded-pill border border-white text-white shadow-sm" style="background: #fca5a5; color: #7f1d1d !important;">151-200 Unhealthy</span>
                    </div>
                </div>
            </div>

            <!-- 3. Bottom Section: Device List -->
            <div class="device-list-section">
                <div class="d-flex align-items-center justify-content-between mb-3">
                    <h5 class="fw-bold m-0 text-dark"><i class="fa-solid fa-layer-group text-primary me-2"></i>Active Monitored Devices</h5>
                     <span class="badge bg-light text-dark border">Showing all</span>
                </div>
                
                <div id="device-list-container" class="row g-3">
                    <!-- JS renders cards here with col-md-4 or col-xl-3 classes -->
                    <div class="col-12 text-center py-5 text-muted">
                        <div class="spinner-border spinner-border-sm text-primary mb-2" role="status"></div>
                        <p>Loading devices...</p>
                    </div>
                </div>
            </div>

        </main>

    <!-- Add Device Modal -->
    <div class="modal fade" id="addDeviceModal" tabindex="-1" aria-labelledby="addDeviceModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="addDeviceModalLabel"><i class="fa-solid fa-microchip me-2"></i>Add New Device</h5>
                    <button type="button" class="btn-close" id="closeAddDeviceModal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <form id="addDeviceForm">
                        <div class="mb-3">
                            <label for="newDeviceCode" class="form-label">Device Code</label>
                            <input type="text" class="form-control" id="newDeviceCode" placeholder="Auto-generated" disabled>
                            <div class="form-text">Generated automatically for you.</div>
                        </div>
                        <div class="mb-3">
                            <label for="newDeviceName" class="form-label">Device Name</label>
                            <input type="text" class="form-control" id="newDeviceName" placeholder="e.g., Station 5 - Downtown" required>
                        </div>
                        <div class="mb-3">
                            <label for="newDeviceAddress" class="form-label">Address / Area</label>
                            <input type="text" class="form-control" id="newDeviceAddress" placeholder="Auto-detected" readonly>
                            <div class="form-text">Auto-detected from your location.</div>
                        </div>
                        <div class="row g-3">
                            <div class="col-md-6">
                                <label for="newDeviceLat" class="form-label">Latitude</label>
                                <input type="text" class="form-control" id="newDeviceLat" placeholder="10.098000" required>
                            </div>
                            <div class="col-md-6">
                                <label for="newDeviceLng" class="form-label">Longitude</label>
                                <input type="text" class="form-control" id="newDeviceLng" placeholder="122.880000" required>
                            </div>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" id="cancelAddDeviceBtn">Cancel</button>
                    <button type="submit" form="addDeviceForm" class="btn btn-primary" id="saveDeviceBtn">Save Device</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Feather Icons -->
    <script src="https://cdn.jsdelivr.net/npm/feather-icons/dist/feather.min.js"></script>
    <script>feather.replace()</script>

    <!-- Bootstrap JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>

    <!-- Leaflet JS -->
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=" crossorigin=""></script>

    <!-- Custom JS -->
    <script>
        const HAS_ADD_DEVICE_PERMISSION = <?= ($isAdmin || $isMasterAdmin) ? 'true' : 'false' ?>;
    </script>
    <!-- EcoBot AI -->
    <script src="js/chatbot.js?v=2"></script>
    
    <script src="js/map.js"></script>
    <script src="js/script.js"></script>

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
        // Edit Device Name Handler for Map View
        document.addEventListener('DOMContentLoaded', () => {
            const saveBtn = document.getElementById('saveDeviceNameBtn');
            if (!saveBtn) return;

            saveBtn.addEventListener('click', async function() {
                const deviceId = document.getElementById('editDeviceId').value;
                const newName = document.getElementById('editDeviceName').value.trim();

                if (!newName) {
                    alert('Device name cannot be empty.');
                    return;
                }

                saveBtn.disabled = true;
                saveBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin me-1"></i>Saving...';

                try {
                    const res = await fetch('api/device_control.php', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ action: 'rename', device_id: deviceId, new_name: newName })
                    });
                    const data = await res.json();
                    if (data.success) {
                        // Close modal and refresh
                        bootstrap.Modal.getInstance(document.getElementById('editDeviceModal')).hide();
                        // Trigger map refresh
                        if (typeof window.initMap === 'function') {
                            // fetchData is inside initMap scope, so we trigger a manual refresh
                            document.getElementById('mapRefreshTop')?.click();
                        }
                    } else {
                        alert('Error: ' + (data.error || 'Unknown error'));
                    }
                } catch (err) {
                    console.error(err);
                    alert('Network error. Please try again.');
                } finally {
                    saveBtn.disabled = false;
                    saveBtn.innerHTML = '<i class="fa-solid fa-save me-1"></i>Save';
                }
            });
        });
    </script>
</body>
</html>
