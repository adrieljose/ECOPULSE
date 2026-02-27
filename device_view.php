<?php
require_once __DIR__ . '/session_bootstrap.php';
require_once __DIR__ . '/db.php';

// Require authenticated access similar to devices.php
$isInternal = isset($_SESSION['user_id']) || isset($_SESSION['admin']);
if (!$isInternal) {
    header("Location: login.php");
    exit;
}

$deviceId = isset($_GET['device_id']) ? (int) $_GET['device_id'] : 0;
if ($deviceId <= 0) {
    http_response_code(400);
    echo "Invalid device id.";
    exit;
}

$pdo = db();
$stmt = $pdo->prepare("
    SELECT d.id, d.device_code, d.name, d.status, d.is_active, d.last_heartbeat, d.lat, d.lng, b.name AS area
    FROM devices d
    LEFT JOIN barangays b ON b.id = d.barangay_id
    WHERE d.id = :id
    LIMIT 1
");
$stmt->execute([':id' => $deviceId]);
$device = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$device) {
    http_response_code(404);
    echo "Device not found.";
    exit;
}

$isActive = (int) ($device['is_active'] ?? 1);
$statusLabel = $isActive ? strtoupper($device['status'] ?: 'ONLINE') : 'STOPPED';
$badgeClass = $isActive ? 'bg-success' : 'bg-secondary';

// Simple indicator: "Receiving readings" if the device is active and the last heartbeat is recent.
$lastHeartbeatTs = !empty($device['last_heartbeat']) ? strtotime($device['last_heartbeat']) : null;
$isReading = $isActive && $lastHeartbeatTs && (time() - $lastHeartbeatTs) <= 300; // 5-minute freshness window
$readingLabel = $isReading ? 'Receiving readings' : 'No recent readings';
$readingClass = $isReading ? 'text-success' : 'text-danger';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= htmlspecialchars($device['name']) ?> - Device Control</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css">
    <link rel="stylesheet" href="css/style.css">
    <style>
        .device-hero {
            max-width: 700px;
        }
    </style>
        <script src="https://cdn.jsdelivr.net/npm/apexcharts"></script>
    <!-- PWA Setup -->
    <link rel="manifest" href="/manifest.json">
    <meta name="theme-color" content="#0d6efd">
    <link rel="apple-touch-icon" href="/img/ecopulse_logo_final.png">
    <script>
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js')
                    .then(reg => console.log('[SW] Registered'))
                    .catch(err => console.log('[SW] Registration failed:', err));
            });
        }
    </script>
</head>
<body class="bg-light">
    <div class="container py-4">
        <div class="d-flex justify-content-between align-items-center mb-3">
            <div>
                <h3 class="mb-0">Device Control</h3>
                <small class="text-muted">Isolated control for this device only</small>
            </div>
            <a href="devices.php" class="btn btn-outline-secondary btn-sm"><i class="fa-solid fa-arrow-left me-1"></i>Back to devices</a>
        </div>

        <div class="card shadow-sm device-hero">
            <div class="card-body">
                <div class="d-flex justify-content-between align-items-start mb-3">
                    <div>
                        <h4 class="fw-bold mb-1"><?= htmlspecialchars($device['name']) ?></h4>
                        <div class="text-muted small">
                            Code: <?= htmlspecialchars($device['device_code']) ?> |
                            Area: <?= htmlspecialchars($device['area'] ?: 'Unknown') ?>
                            <br>
                            <span class="<?= $readingClass ?>"><i class="fa-solid fa-signal me-1"></i><?= $readingLabel ?></span>
                        </div>
                    </div>
                    <span id="deviceStatusBadge" class="badge status-badge <?= $badgeClass ?>"><?= $statusLabel ?></span>
                </div>

                <div class="mb-3 text-muted small">
                    <div><i class="fa-solid fa-location-dot me-1"></i>Lat/Lng: <?= htmlspecialchars($device['lat']) ?>, <?= htmlspecialchars($device['lng']) ?></div>
                    <div><i class="fa-solid fa-clock me-1"></i>Last heartbeat: <?= htmlspecialchars($device['last_heartbeat'] ?: 'N/A') ?></div>
                    <div class="mt-2">
                        <strong>Data status:</strong>
                        <span id="dataStatusText" class="<?= $readingClass ?>"><?= $readingLabel ?></span>
                        <span id="lastReadingTime" class="text-muted ms-2 small"></span>
                    </div>
                </div>

                <div class="d-flex gap-2">
                    <button id="singleDeviceToggle"
                            class="btn btn-lg <?= $isActive ? 'btn-outline-danger' : 'btn-success' ?>"
                            data-active="<?= $isActive ?>"
                            data-id="<?= (int)$device['id'] ?>">
                        <?php if ($isActive): ?>
                            <i class="fa-solid fa-stop"></i> STOP
                        <?php else: ?>
                            <i class="fa-solid fa-play"></i> START
                        <?php endif; ?>
                    </button>
                    <a href="index.php?device_id=<?= (int)$device['id'] ?>" class="btn btn-outline-primary btn-lg">
                        View dashboard
                    </a>
                </div>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
    <script>
        const toggleBtn = document.getElementById('singleDeviceToggle');
        const badge = document.getElementById('deviceStatusBadge');
        const dataStatusText = document.getElementById('dataStatusText');
        const lastReadingTime = document.getElementById('lastReadingTime');
        const deviceId = toggleBtn?.dataset.id;
        let pollTimer = null;

        const renderState = (isActive) => {
            toggleBtn.dataset.active = isActive ? '1' : '0';
            toggleBtn.innerHTML = isActive
                ? '<i class="fa-solid fa-stop"></i> STOP'
                : '<i class="fa-solid fa-play"></i> START';
            toggleBtn.className = 'btn btn-lg ' + (isActive ? 'btn-outline-danger' : 'btn-success');

            badge.textContent = isActive ? 'RUNNING' : 'STOPPED';
            const baseClasses = ['badge', 'status-badge'];
            badge.className = [...baseClasses, isActive ? 'bg-success' : 'bg-secondary'].join(' ');
        };

        const renderDataStatus = (status, lastTs = null) => {
            const statusMap = {
                receiving: { text: 'Receiving readings', className: 'text-success' },
                waiting: { text: 'Waiting for readings...', className: 'text-warning' },
                none: { text: 'No recent readings', className: 'text-danger' }
            };
            const cfg = statusMap[status] || statusMap.none;
            if (dataStatusText) {
                dataStatusText.textContent = cfg.text;
                dataStatusText.className = cfg.className;
            }
            if (lastReadingTime) {
                lastReadingTime.textContent = lastTs ? `(Last: ${lastTs})` : '';
            }
        };

        let currentForecastChart = null;

        const renderForecastChart = (trendData, forecastData) => {
            const chartEl = document.getElementById('forecastChart');
            if (!chartEl) return;

            // Clear loading spinner if present
            if(chartEl.innerHTML.includes('fa-spinner')) {
                chartEl.innerHTML = '';
            }

            if (!forecastData || !trendData || !trendData.aqi || trendData.aqi.length === 0) {
                chartEl.innerHTML = '<div class="text-center text-muted py-5"><i class="fa-solid fa-chart-line mb-3 fa-2x opacity-50"></i><br>Not enough recent data to generate a forecast. Keep the device running!</div>';
                return;
            }

            // We want to draw a continuous line: Historical Data -> Current Point -> Forecasted Point
            // To make it look good, let's grab the last 10 historical points so we see the trend leading up to the forecast.
            const historySize = 10;
            const historicalAqi = trendData.aqi.slice(-historySize);
            const historicalLabels = trendData.labels.slice(-historySize);

             // Prepare category array
            const xCategories = [...historicalLabels, "In 30 Mins"];

            const options = {
                series: [
                    {
                        name: 'Historical AQI',
                        data: [...historicalAqi, null] 
                    },
                    {
                        name: 'Predicted AQI',
                        data: [...Array(historicalAqi.length - 1).fill(null), historicalAqi[historicalAqi.length-1], forecastData.forecast_aqi]
                    }
                ],
                chart: {
                    type: 'area',
                    height: 250,
                    toolbar: { show: false },
                    animations: { enabled: true, easing: 'easeinout', speed: 800 }
                },
                colors: ['#0d6efd', '#fd7e14'], // Historical (Blue), Forecast (Orange)
                dataLabels: { enabled: false },
                stroke: {
                    curve: 'smooth',
                    width: [2, 3],
                    dashArray: [0, 5] // Solid line for history, dashed for forecast
                },
                fill: {
                    type: ['gradient', 'gradient'],
                    gradient: {
                        shadeIntensity: 1,
                        opacityFrom: 0.4,
                        opacityTo: 0.05,
                        stops: [0, 90, 100]
                    }
                },
                xaxis: {
                    categories: xCategories,
                    labels: { style: { colors: '#6c757d' } }
                },
                yaxis: {
                    title: { text: 'AQI Level' },
                    min: 0,
                    max: Math.max(200, forecastData.forecast_aqi + 50)
                },
                legend: { position: 'top', horizontalAlign: 'right' },
                tooltip: { shared: true, intersect: false }
            };

            if (currentForecastChart) {
                currentForecastChart.updateOptions(options);
            } else {
                currentForecastChart = new ApexCharts(chartEl, options);
                currentForecastChart.render();
            }
        };

        const fetchLatestData = () => {
            if (!deviceId) return;
            const url = `api/dashboard.php?device_id=${encodeURIComponent(deviceId)}&_t=${Date.now()}`;
            fetch(url)
                .then(res => res.json())
                .then(data => {
                    const currentDev = (data.sensors || []).find(s => String(s.id) === String(deviceId) || s.device_code == deviceId);
                    if (!currentDev) return;

                    // Update running badge if server says active
                    renderState(currentDev.isActive !== 0);

                    const ts = currentDev.updatedAt ? new Date(currentDev.updatedAt) : null;
                    const isFresh = ts ? ((Date.now() - ts.getTime()) < 5 * 60 * 1000) : false; // 5 min freshness
                    if (currentDev.isActive && isFresh) {
                        renderDataStatus('receiving', ts ? ts.toLocaleTimeString() : null);
                    } else if (currentDev.isActive) {
                        renderDataStatus('waiting', ts ? ts.toLocaleTimeString() : null);
                    } else {
                        renderDataStatus('none', ts ? ts.toLocaleTimeString() : null);
                    }

                    // Render the predictive forecast chart
                    renderForecastChart(data.trend, data.forecast);
                })
                .catch(err => console.error('Failed to fetch latest data', err));
        };

        const startPolling = () => {
            if (pollTimer) clearInterval(pollTimer);
            pollTimer = setInterval(fetchLatestData, 5000);
            fetchLatestData();
        };

        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => {
                const id = toggleBtn.dataset.id;
                if (!id) return;

                const newState = toggleBtn.dataset.active === '1' ? 0 : 1;
                toggleBtn.disabled = true;
                const prevHtml = toggleBtn.innerHTML;
                toggleBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';

                fetch('api/device_control.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ action: 'toggle', device_id: id })
                })
                    .then(res => res.json())
                    .then(resp => {
                        if (resp.success) {
                            const activeNow = Number(resp.new_state) === 1;
                            renderState(activeNow);
                            // Immediately fetch data after starting
                            if (activeNow) {
                                renderDataStatus('waiting');
                                fetchLatestData();
                            }
                        } else {
                            alert('Error: ' + (resp.error || 'Unknown error'));
                            toggleBtn.innerHTML = prevHtml;
                        }
                    })
                    .catch(err => {
                        console.error(err);
                        toggleBtn.innerHTML = prevHtml;
                    })
                    .finally(() => {
                        toggleBtn.disabled = false;
                    });
            });

            // Begin polling for this device on load
            startPolling();
        }
    </script>
</body>
</html>
