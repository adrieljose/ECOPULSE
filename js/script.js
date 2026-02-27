const ECO_ALERT_COOLDOWN_MS = 600000;
const ECO_ALERT_STORAGE_PREFIX = 'aqi_alert_ts_';
window.ecoPulseAlertConfig = {
    cooldownMs: ECO_ALERT_COOLDOWN_MS,
    storagePrefix: ECO_ALERT_STORAGE_PREFIX
};

const App = {
    state: {
        intervals: [],
        charts: [], // store chart instances to destroy them
        controller: null, // AbortController for fetch
        selectedDeviceId: null, // Multi-device support
        compareChart: null
    },

    init() {
        this.initSidebar();
        this.initContent();
        this.initNavigation();
        // Simple history handling if needed, though mostly standard navigation
        window.addEventListener('popstate', (e) => this.handlePopState(e));
    },

    // --- Static Global Components (Run Once) ---
    initSidebar() {
        const sidebar = document.querySelector('.sidebar');
        const sidebarOverlay = document.getElementById('sidebarOverlay');
        const sidebarToggleButtons = document.querySelectorAll('.sidebar-toggle');
        const isMobile = () => window.innerWidth < 992;

        if (sidebar) {
            const closeSidebar = () => {
                document.body.classList.remove('sidebar-open');
                sidebar.classList.remove('show');
                if (sidebarOverlay) sidebarOverlay.classList.remove('show');
            };
            const toggleSidebar = () => document.body.classList.toggle('sidebar-open');

            sidebarToggleButtons.forEach(btn => btn.addEventListener('click', toggleSidebar));
            sidebarOverlay?.addEventListener('click', closeSidebar);

            // Note: We use event delegation for nav links in initNavigation, 
            // but we still need to close sidebar on mobile when a link is clicked.
            sidebar.addEventListener('click', (e) => {
                if (e.target.closest('.nav-link') || e.target.closest('.sidebar-brand')) {
                    closeSidebar();
                }
            });

            document.addEventListener('keydown', (event) => {
                if (event.key === 'Escape') closeSidebar();
            });

            // Mobile Menu Button
            const mobileMenuBtn = document.getElementById('mobileMenuBtn');
            if (mobileMenuBtn) {
                mobileMenuBtn.addEventListener('click', () => {
                    sidebar.classList.toggle('show');
                    if (sidebarOverlay) sidebarOverlay.classList.toggle('show');
                    document.body.classList.toggle('sidebar-open');
                });
            }

            // Ensure sidebar starts closed on mobile
            if (isMobile()) {
                closeSidebar();
            }

            // Close drawer when resizing down to mobile; clear overlay when back to desktop
            let resizeTimer = null;
            window.addEventListener('resize', () => {
                clearTimeout(resizeTimer);
                resizeTimer = setTimeout(() => {
                    if (isMobile()) {
                        closeSidebar();
                    } else {
                        sidebar.classList.remove('show');
                        sidebarOverlay?.classList.remove('show');
                        document.body.classList.remove('sidebar-open');
                    }
                }, 120);
            });
        }

        const desktopToggle = document.querySelector('.sidebar-collapse-toggle');
        if (desktopToggle) {
            desktopToggle.addEventListener('click', () => {
                if (window.innerWidth <= 992) {
                    return; // hidden/unused on mobile
                }
                document.body.classList.toggle('sidebar-collapsed');
                const isCollapsed = document.body.classList.contains('sidebar-collapsed');
                localStorage.setItem('sidebarCollapsed', isCollapsed);
            });

            // Restore desktop state only if not mobile
            if (window.innerWidth > 992 && localStorage.getItem('sidebarCollapsed') === 'true') {
                document.body.classList.add('sidebar-collapsed');
            }
        }
    },

    // --- Dynamic Content (Run on every page load/swap) ---
    initContent() {
        this.cleanup(); // Clear previous intervals/charts

        this.initClock();
        this.initCharts();
        this.initAnimations();
        this.initDashboard();
        this.initGlobalAlerts();
        this.initSms();
        this.initCompare();
        this.initSessionControl();

        // Initialize Feather Icons
        if (typeof feather !== 'undefined') {
            feather.replace();
        }

        // Initialize Map if available (calls window.initMap from map.js)
        if (typeof window.initMap === 'function') {
            window.initMap();
        }

        // Initialize Reports logic if available
        if (typeof window.initReports === 'function') {
            window.initReports();
        }

        // Highlight active link
        this.updateActiveLink();
    },

    updateSystemHealthChip(data) {
        const chip = document.getElementById('systemHealthChip');
        if (!chip) return;

        const sensors = Array.isArray(data?.sensors) ? data.sensors : [];
        if (!sensors.length) {
            chip.textContent = 'System: waiting...';
            return;
        }
        const counts = { online: 0, warning: 0, critical: 0, offline: 0 };
        sensors.forEach(s => {
            const status = (s.status || '').toLowerCase();
            if (status.includes('offline')) counts.offline++;
            else if (status.includes('critical')) counts.critical++;
            else if (status.includes('warning') || status.includes('watch')) counts.warning++;
            else counts.online++;
        });
        chip.innerHTML = `System: <span class="health-dot online"></span>${counts.online} online | <span class="health-dot warn"></span>${counts.warning} warn | <span class="health-dot critical"></span>${counts.critical} critical | <span class="health-dot offline"></span>${counts.offline} offline`;
    },

    cleanup() {
        this.state.intervals.forEach(clearInterval);
        this.state.intervals = [];

        this.state.charts.forEach(chart => chart.destroy());
        this.state.charts = []; // Reset list
        if (this.state.compareChart) {
            this.state.compareChart.destroy();
            this.state.compareChart = null;
        }

        // Clear specific references
        this.aqiTrendChart = null;
        this.pollutantLevelsChart = null;

        // Explicitly cleanup Map state if it exists (crucial when navigating AWAY from map.php)
        if (typeof window.ecoPulseMapState !== 'undefined') {
            if (window.ecoPulseMapState.intervals) {
                window.ecoPulseMapState.intervals.forEach(clearInterval);
                window.ecoPulseMapState.intervals = [];
            }
            if (window.ecoPulseMapState.map) {
                window.ecoPulseMapState.map.remove();
                window.ecoPulseMapState.map = null;
            }
        }
    },

    // --- Sub-initializers ---

    initClock() {
        const update = () => {
            const now = new Date();
            const timeStr = now.toLocaleTimeString('en-US', { hour12: true });
            const dateStr = now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

            const timeEl = document.getElementById('clockTime') || document.getElementById('current-time') || document.getElementById('time');
            const dateEl = document.getElementById('clockDate') || document.getElementById('current-date') || document.getElementById('date');

            if (timeEl) timeEl.textContent = timeStr;
            if (dateEl) dateEl.textContent = dateStr;
        };
        update();
        // Only run interval if elements exist
        if (document.getElementById('clockTime') || document.getElementById('current-time') || document.getElementById('time')) {
            this.state.intervals.push(setInterval(update, 1000));
        }
    },

    initAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Respect --reveal-delay if set
                    const style = getComputedStyle(entry.target);
                    const delayProp = style.getPropertyValue('--reveal-delay').trim();
                    let delayMs = 0;
                    if (delayProp.endsWith('ms')) delayMs = parseFloat(delayProp);
                    else if (delayProp.endsWith('s')) delayMs = parseFloat(delayProp) * 1000;

                    if (delayMs > 0) {
                        setTimeout(() => {
                            entry.target.classList.add('reveal-show');
                        }, delayMs);
                    } else {
                        entry.target.classList.add('reveal-show');
                    }
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    },

    initNavigation() {
        // Highlighting handled by updateActiveLink called in initContent
    },

    updateActiveLink() {
        const path = window.location.pathname.split('/').pop().split('?')[0] || 'index.php';
        document.querySelectorAll('.sidebar .nav-link').forEach(link => {
            const href = link.getAttribute('href');
            if (href === path) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    },

    handlePopState(e) {
        // Optional: reload content if doing AJAX navigation
    },

    initDashboard() {
        if (!document.getElementById('mainAqiValue')) return; // Not on dashboard

        const selector = document.getElementById('dashboardDeviceSelector');
        const update = () => this.updateDashboard();

        // 1. Fetch devices to populate selector
        fetch('api/dashboard.php')
            .then(res => res.json())
            .then(data => {
                const sensors = data.sensors || [];
                let targetDevice = null;
                if (selector) {
                    // Keep "Global Average" and remove loading placeholder
                    selector.innerHTML = '<option value="">Global Average</option>';

                    sensors.forEach(s => {
                        const opt = document.createElement('option');
                        opt.value = s.id; // device_code
                        opt.textContent = s.name;
                        selector.appendChild(opt);
                    });

                    // Restore selection: Priority 1: Server Default, Priority 2: LocalStorage
                    if (typeof USER_DEFAULT_DEVICE_ID !== 'undefined' && USER_DEFAULT_DEVICE_ID > 0) {
                        targetDevice = USER_DEFAULT_DEVICE_ID;
                    } else {
                        targetDevice = localStorage.getItem('dashboard_device_id');
                    }

                    // Time Filter Logic
                    const timeBtn = document.getElementById('timeFilterBtn');
                    const timeLabel = document.getElementById('timeFilterLabel');
                    const timeItems = document.querySelectorAll('[data-time]');

                    // Restore Selection
                    const savedTime = localStorage.getItem('dashboard_timeframe') || '1h';
                    timeItems.forEach(item => {
                        if (item.dataset.time === savedTime) {
                            item.classList.add('active');
                            if (timeLabel) timeLabel.textContent = item.textContent;
                        } else {
                            item.classList.remove('active');
                        }

                        item.addEventListener('click', (e) => {
                            e.preventDefault();
                            // Update UI
                            timeItems.forEach(i => i.classList.remove('active'));
                            e.target.classList.add('active');
                            if (timeLabel) timeLabel.textContent = e.target.textContent;

                            // Save & Update
                            localStorage.setItem('dashboard_timeframe', e.target.dataset.time);
                            update();
                        });
                    });

                    // Compatibility: If targetDevice is a Code (e.g. DEV-001), find its ID
                    if (targetDevice && isNaN(targetDevice)) {
                        const found = sensors.find(s => s.device_code === targetDevice);
                        if (found) targetDevice = found.id;
                    }

                    // Attempt to select
                    if (targetDevice && selector && selector.querySelector(`option[value="${targetDevice}"]`)) {
                        selector.value = targetDevice;
                    }
                }

                if (selector) {
                    selector.addEventListener('change', (e) => {
                        localStorage.setItem('dashboard_device_id', e.target.value);

                        // Instant Feedback: Clear UI to show "switching" state
                        const mainVal = document.getElementById('mainAqiValue');
                        const mainLoc = document.getElementById('mainLocationLabel');
                        const status = document.getElementById('mainAqiStatus');

                        if (mainVal) mainVal.textContent = '--';
                        if (mainLoc) mainLoc.textContent = 'Loading...';
                        if (status) status.textContent = '...';

                        // Optional: Reset charts if needed, or let update handle it

                        update();
                    });
                }

                // Initial update
                update();
            })
            .catch(err => {
                console.error('Error init dashboard:', err);
                const chip = document.getElementById('systemHealthChip');
                if (chip) chip.textContent = 'System: Connection Error';
            });

        // 2. Poll for updates
        this.state.intervals.push(setInterval(update, 10000)); // 10s polling

        // Manual refresh button
        document.getElementById('refreshDashboard')?.addEventListener('click', update);


    },

    updateDashboard() {
        if (!document.getElementById('mainAqiValue')) return;

        const deviceId = document.getElementById('dashboardDeviceSelector')?.value || '';
        const timeframe = localStorage.getItem('dashboard_timeframe') || '1h';
        const url = `api/dashboard.php?device_id=${encodeURIComponent(deviceId)}&timeframe=${encodeURIComponent(timeframe)}&_t=${Date.now()}`;

        fetch(url)
            .then(res => res.json())
            .then(data => {
                // Update System Health Chip
                this.updateSystemHealthChip(data);

                // Helper to safely set text
                const setText = (id, val, suffix = '') => {
                    const el = document.getElementById(id);
                    if (el) el.textContent = (val !== null && val !== undefined) ? val + suffix : '--';
                };

                // --- Main AQI Card ---
                document.getElementById('mainLocationLabel').textContent = data.selectedDeviceName || 'Unknown Location';
                document.getElementById('mainAqiValue').textContent = data.overallAQI ?? '--';
                document.getElementById('mainAqiStatus').textContent = data.aqiCategory ?? 'No Data';
                document.getElementById('aqiPlainSummary').textContent = data.analytics?.summary || '';
                document.getElementById('lastUpdatedText').textContent = new Date().toLocaleTimeString(); // Client time of fetch

                // Recommendation Logic (Simple + Targeted)
                let advice = "Air quality is good. Enjoy outdoor activities.";
                const cat = (data.aqiCategory || '').toLowerCase();
                if (cat.includes('moderate')) advice = "Sensitive individuals should limit prolonged outdoor exertion.";
                else if (cat.includes('unhealthy')) advice = "Avoid prolonged outdoor exertion. Wear a mask if necessary.";
                else if (cat.includes('hazardous')) advice = "Health warning of emergency conditions. Everyone should avoid outdoor exertion.";

                // Targeted Health Warnings
                const userCondition = window.USER_HEALTH_CONDITION || 'None';
                let specificWarning = null;

                // Thresholds Check
                const pm25 = parseFloat(data.pm25);
                const pm10 = parseFloat(data.pm10);
                const o3 = parseFloat(data.o3);

                if (userCondition === 'Asthma') {
                    if (pm25 > 12 || o3 > 70) specificWarning = "⚠️ ASTHMA ALERT: PM2.5 or Ozone levels are high. Keep inhaler ready and stay indoors.";
                } else if (userCondition === 'COPD') {
                    if (pm25 > 12 || pm10 > 54) specificWarning = "⚠️ COPD ALERT: Particulate levels are risky. Avoid outdoor exposure.";
                } else if (userCondition === 'Heart Disease') {
                    if (pm25 > 12) specificWarning = "⚠️ HEART ALERT: Pollution may trigger symptoms. Restrict outdoor activity.";
                } else if (['Pregnancy', 'Elderly', 'Children'].includes(userCondition)) {
                    if (cat.includes('moderate') || cat.includes('unhealthy')) {
                        specificWarning = `⚠️ ${userCondition.toUpperCase()} ALERT: Air quality is poor. Minimize exposure.`;
                    }
                }

                if (specificWarning) {
                    advice = specificWarning;
                    const adviceEl = document.getElementById('healthAdvice');
                    if (adviceEl) {
                        adviceEl.className = 'text-warning fw-bold';
                        // Add pulsing effect via class if wanted, for now just color
                    }
                } else {
                    const adviceEl = document.getElementById('healthAdvice');
                    if (adviceEl) adviceEl.className = '';
                }

                setText('healthAdvice', advice);

                // --- Pollutants Helper ---
                const updatePollutantCard = (id, type, val) => {
                    const el = document.getElementById(id);
                    if (!el) return;

                    // Set value
                    el.textContent = (val !== null && val !== undefined) ? val : '--';

                    // Determine Color
                    let status = 'good'; // good, moderate, unhealthy
                    const v = parseFloat(val);

                    if (val === null || isNaN(v)) {
                        status = 'nodata';
                    } else {
                        // Thresholds
                        switch (type) {
                            case 'pm1':  // Est. similar to PM2.5 for safety
                                if (v > 35) status = 'unhealthy'; else if (v > 12) status = 'moderate';
                                break;
                            case 'pm25':
                                if (v > 35.4) status = 'unhealthy'; else if (v > 12) status = 'moderate';
                                break;
                            case 'pm10':
                                if (v > 154) status = 'unhealthy'; else if (v > 54) status = 'moderate';
                                break;
                            case 'o3':
                                if (v > 164) status = 'unhealthy'; else if (v > 100) status = 'moderate'; // 8-hr standard approx
                                break;
                            case 'co':
                                if (v > 9.4) status = 'unhealthy'; else if (v > 4.4) status = 'moderate';
                                break;
                            case 'co2':
                                if (v > 2000) status = 'unhealthy'; else if (v > 1000) status = 'moderate';
                                break;
                            default:
                                break;
                        }
                    }

                    // Apply Classes
                    // Target the parent card container: class="p-3 h-100 border rounded-3 bg-light"
                    const card = el.closest('.p-3');
                    if (card) {
                        // Reset base
                        card.className = 'p-3 h-100 border rounded-3 transition-colors';

                        if (status === 'good') {
                            card.classList.add('bg-success-subtle', 'border-success');
                            el.className = 'fw-bold fs-4 text-success-emphasis';
                        } else if (status === 'moderate') {
                            card.classList.add('bg-warning-subtle', 'border-warning');
                            el.className = 'fw-bold fs-4 text-warning-emphasis';
                        } else if (status === 'unhealthy') {
                            card.classList.add('bg-danger-subtle', 'border-danger');
                            el.className = 'fw-bold fs-4 text-danger-emphasis';
                        } else {
                            card.classList.add('bg-light');
                            el.className = 'fw-bold fs-4 text-dark';
                        }
                    }
                };

                updatePollutantCard('mainPm1', 'pm1', data.pm1);
                updatePollutantCard('mainPm25', 'pm25', data.pm25);
                updatePollutantCard('mainPm10', 'pm10', data.pm10);
                updatePollutantCard('mainO3', 'o3', data.o3);
                updatePollutantCard('mainCo', 'co', data.co);
                updatePollutantCard('mainCo2', 'co2', data.co2);

                setText('mainTemp', data.temperature);
                setText('mainHumidity', data.humidity);

                // --- Weather Widget Logic ---
                const weatherIcon = document.getElementById('weatherIcon');
                const weatherText = document.getElementById('weatherText');
                if (weatherIcon && weatherText) {
                    const t = data.temperature;
                    const h = data.humidity;
                    let iconClass = 'fa-cloud'; // default
                    let condition = 'Cloudy';

                    if (t !== null && h !== null) {
                        if (t >= 30) {
                            iconClass = 'fa-sun';
                            condition = 'Sunny';
                        } else if (t >= 25) {
                            iconClass = 'fa-cloud-sun';
                            condition = 'Partly Cloudy';
                        } else if (h >= 85) {
                            iconClass = 'fa-cloud-showers-heavy';
                            condition = 'Rainy';
                        } else if (t <= 20) {
                            iconClass = 'fa-snowflake';
                            condition = 'Cool';
                        } else {
                            iconClass = 'fa-cloud';
                            condition = 'Cloudy';
                        }
                    }

                    weatherIcon.className = `fa-solid ${iconClass} fa-3x`;
                    weatherText.textContent = condition;
                }

                // --- Secondary Stats ---
                const domInline = document.getElementById('mainDominantInline');
                const domLabel = data.dominantPollutant || '--';
                const domVal = (data.dominantPollutantValue !== null && data.dominantPollutantValue !== undefined)
                    ? `${domLabel} (${data.dominantPollutantValue})`
                    : domLabel;
                setText('dominantPollutant', domVal);
                if (domInline) domInline.textContent = `Dominant pollutant: ${domVal}`;
                setText('sensorsOnline', data.sensorsOnline);
                setText('sensorsTotal', data.sensorsTotal);

                // --- Forecast Snapshot ---
                const forecast = data.forecast || null;
                const forecastHeadlineEl = document.getElementById('forecastHeadline');
                const forecastMetaEl = document.getElementById('forecastMeta');
                const forecastDriversEl = document.getElementById('forecastDrivers');
                const forecastConfidenceEl = document.getElementById('forecastConfidence');
                if (forecastHeadlineEl && forecastMetaEl && forecastDriversEl && forecastConfidenceEl) {
                    if (forecast && forecast.forecast_aqi !== null && forecast.forecast_aqi !== undefined) {
                        const direction = (forecast.direction || 'steady').toLowerCase();
                        const arrow = direction === 'rising' ? '↑' : (direction === 'falling' ? '↓' : '→');
                        const deltaNum = Number(forecast.delta || 0);
                        const deltaText = `${deltaNum > 0 ? '+' : ''}${deltaNum}`;
                        const confidencePct = Number(forecast.confidence_percent || 0);
                        const confLabel = (forecast.confidence || 'low').toString().toUpperCase();
                        const horizon = Number(forecast.horizon_minutes || 30);
                        const category = forecast.category || 'No Data';
                        const drivers = Array.isArray(forecast.top_drivers) && forecast.top_drivers.length
                            ? forecast.top_drivers.join(', ')
                            : 'No dominant driver yet';

                        forecastHeadlineEl.textContent = `${forecast.forecast_aqi} AQI (${category})`;
                        forecastMetaEl.textContent = `${arrow} ${direction} in next ${horizon} min (${deltaText})`;
                        forecastDriversEl.textContent = `Top drivers: ${drivers}`;
                        forecastConfidenceEl.textContent = `${confLabel} ${confidencePct}%`;
                    } else {
                        forecastHeadlineEl.textContent = '--';
                        forecastMetaEl.textContent = 'Waiting for forecast model...';
                        forecastDriversEl.textContent = 'Top drivers: --';
                        forecastConfidenceEl.textContent = '--';
                    }
                }

                // --- Analytics List ---
                const analyticsList = document.getElementById('analyticsList');
                if (analyticsList && data.analytics?.items) {
                    analyticsList.innerHTML = data.analytics.items.map(item => `<li class="small mb-1">${item}</li>`).join('');
                }
                setText('trendSummary', data.analytics?.summary);

                // --- Charts ---
                this.updateDashboardCharts(data);

                // --- Data Quality ---
                const dqTotal = data.sensors?.length || 0;
                const dqOnline = data.sensorsOnline || 0;
                // Rough estimation from sensors array
                const dqOffline = data.sensors?.filter(s => s.status === 'offline').length || 0;
                const dqStale = data.sensors?.filter(s => s.status === 'stale').length || 0;

                setText('dqTotal', dqTotal);
                setText('dqOnline', dqOnline);
                setText('dqOffline', dqOffline);
                setText('dqStale', dqStale);

                const issuesList = document.getElementById('dataQualityIssues');
                if (issuesList) {
                    const offlineNames = data.sensors?.filter(s => s.status === 'offline').map(s => s.name).slice(0, 3) || [];
                    if (offlineNames.length > 0) {
                        issuesList.innerHTML = offlineNames.map(n => `<li class="text-danger small"><i class="fa-solid fa-circle-xmark me-1"></i> ${n} is offline</li>`).join('');
                        if (dqOffline > 3) issuesList.innerHTML += `<li class="text-muted small">+${dqOffline - 3} more</li>`;
                    } else {
                        issuesList.innerHTML = `<li class="text-success small"><i class="fa-solid fa-circle-check me-1"></i> All systems operational</li>`;
                    }
                }

                // --- Alerts ---
                // --- Alerts & Status Card Toggle ---
                const alertWrapper = document.getElementById('thresholdAlertWrapper');
                const statusWrapper = document.getElementById('statusCardWrapper');

                if (data.alerts && data.alerts.length > 0) {
                    // Show Alert, Hide Status
                    if (alertWrapper) {
                        alertWrapper.style.display = 'block';
                        const msg = data.alerts.map(a => `${a.name}: PM2.5=${a.pm25}, CO2=${a.co2}`).join('; ');
                        document.getElementById('thresholdMessage').textContent = msg.substring(0, 100) + (msg.length > 100 ? '...' : '');
                    }
                    if (statusWrapper) statusWrapper.style.display = 'none';
                } else {
                    // Hide Alert, Show Status
                    if (alertWrapper) alertWrapper.style.display = 'none';
                    if (statusWrapper) statusWrapper.style.display = 'block';
                }

                // --- Check and Trigger SMS Alerts for High AQI ---
                this.checkAndTriggerSmsAlert(data);

            })
            .catch(err => console.error('Dashboard update failed:', err));
    },

    updateDashboardCharts(data) {
        // Pollutant Levels Chart
        if (data.pollutants) {
            const pollCtx = document.querySelector("#pollutantLevelsChart");
            if (pollCtx) {
                const options = {
                    series: [{ name: 'Level', data: data.pollutants.values }],
                    chart: { type: 'bar', height: 250, toolbar: { show: false } },
                    xaxis: { categories: data.pollutants.labels },
                    colors: [
                        '#6610f2', // PM1.0 - Indigo
                        '#6f42c1', // PM2.5 - Purple
                        '#d63384', // PM10 - Pink
                        '#fd7e14', // O3 - Orange
                        '#ffc107', // CO - Yellow
                        '#198754', // CO2 - Green
                        '#dc3545', // Temp - Red
                        '#0d6efd'  // Humidity - Blue
                    ],
                    plotOptions: { bar: { borderRadius: 4, distributed: true } }
                };
                if (!this.pollutantLevelsChart) {
                    this.pollutantLevelsChart = new ApexCharts(pollCtx, options);
                    this.pollutantLevelsChart.render();
                    this.state.charts.push(this.pollutantLevelsChart);
                } else {
                    this.pollutantLevelsChart.updateOptions({ series: options.series, xaxis: options.xaxis });
                }
            }
        }

        // AQI Trend Chart
        if (data.trend) {
            const trendCtx = document.querySelector("#aqiTrendChart");
            if (trendCtx) {
                const chartHeight = window.innerWidth >= 1200 ? 260 : (window.innerWidth >= 992 ? 240 : 200);
                const options = {
                    series: [{ name: 'AQI', data: data.trend.aqi }],
                    chart: { type: 'area', height: chartHeight, toolbar: { show: false }, sparkline: { enabled: false } }, // enabled sparkline removes axes, disable it for detail
                    stroke: { curve: 'smooth', width: 2 },
                    fill: { type: 'gradient', gradient: { opacityFrom: 0.5, opacityTo: 0.1 } },
                    xaxis: { categories: data.trend.labels, labels: { show: false } }, // Hide extensive labels
                    colors: ['#198754'], // Greenish
                    tooltip: { x: { show: true } }
                };
                if (!this.aqiTrendChart) {
                    this.aqiTrendChart = new ApexCharts(trendCtx, options);
                    this.aqiTrendChart.render();
                    this.state.charts.push(this.aqiTrendChart);
                } else {
                    this.aqiTrendChart.updateOptions({ series: options.series, xaxis: options.xaxis });
                }
            }
        }
    },

    initSms() {
        // SMS page specific logic if needed
    },

    initGlobalAlerts() {
        const runCheck = () => this.checkAndTriggerSmsAlert();
        runCheck();
        this.state.intervals.push(setInterval(runCheck, 2000));
    },

    initCharts() {
        // Placeholder for chart initialization if not handled in inline scripts
    },

    initSessionControl() {
        const btn = document.getElementById('sessionRecordBtn');
        const statusText = document.getElementById('recordingStatusText');
        if (!btn) return;

        let isRecording = true;

        const updateUI = () => {
            if (isRecording) {
                btn.innerHTML = '<i class="fa-solid fa-pause me-1"></i> STOP';
                btn.className = 'btn btn-sm btn-outline-danger fw-bold shadow-sm';
                if (statusText) statusText.innerHTML = 'Status: <span class="text-success fw-bold">Recording...</span>';
            } else {
                btn.innerHTML = '<i class="fa-solid fa-play me-1"></i> START';
                btn.className = 'btn btn-sm btn-success fw-bold shadow-sm';
                if (statusText) statusText.innerHTML = 'Status: <span class="text-muted">Paused</span>';
            }
        };

        // Load initial status
        fetch('api/session_control.php')
            .then(res => res.json())
            .then(data => {
                isRecording = data.recording_active;
                updateUI();
            });

        // Click Handler
        btn.addEventListener('click', () => {
            const newState = !isRecording;
            btn.disabled = true;

            fetch('api/session_control.php', {
                method: 'POST',
                body: JSON.stringify({ recording_active: newState })
            })
                .then(res => res.json())
                .then(() => {
                    isRecording = newState;
                    updateUI();
                })
                .finally(() => {
                    btn.disabled = false;
                });
        });
    },

    initCompare() {
        const countSel = document.getElementById('compareCount');
        const container = document.getElementById('compareSelectors');
        const btn = document.getElementById('compareRun');
        if (!countSel || !container || !btn) return;

        let availableSensors = [];

        // 1. Fetch Sensors (Re-use dashboard API or specific endpoint)
        fetch('api/dashboard.php')
            .then(res => res.json())
            .then(data => {
                availableSensors = data.sensors || [];
                renderSelectors(parseInt(countSel.value));
            });

        // 2. Render N Selectors
        const renderSelectors = (n) => {
            container.innerHTML = ''; // Clear existing
            for (let i = 0; i < n; i++) {
                const div = document.createElement('div');

                const label = document.createElement('label');
                label.className = 'form-label small mb-1';
                label.textContent = `Device ${i + 1}`;

                const select = document.createElement('select');
                select.className = 'form-select form-select-sm compare-device-select';
                select.innerHTML = '<option value="">Select...</option>';

                availableSensors.forEach(s => {
                    const opt = document.createElement('option');
                    opt.value = s.id;
                    opt.textContent = s.name;
                    select.appendChild(opt);
                });

                div.appendChild(label);
                div.appendChild(select);
                container.appendChild(div);
            }
        };

        // 3. Handle Count Change
        countSel.addEventListener('change', (e) => {
            const n = parseInt(e.target.value);
            renderSelectors(n);
        });

        // 4. Defaults dates
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('compareFrom').value = today;
        document.getElementById('compareTo').value = today;

        // 5. Handle Compare Click
        btn.addEventListener('click', () => {
            // Gather selected IDs
            const selects = container.querySelectorAll('.compare-device-select');
            const selectedIds = [];
            selects.forEach(sel => {
                if (sel.value) selectedIds.push(sel.value);
            });

            if (selectedIds.length < 1) { // Allow 1-N comparison effectively, but UI enforces N dropdowns
                alert("Please select at least one device to compare.");
                return;
            }

            const from = document.getElementById('compareFrom').value;
            const to = document.getElementById('compareTo').value;
            const devicesParam = selectedIds.join(',');

            // Updated API call
            const url = `api/dashboard.php?action=compare&devices=${encodeURIComponent(devicesParam)}&from=${from}&to=${to}`;

            // Show loading state
            btn.disabled = true;
            btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin me-1"></i>Loading...';
            document.getElementById('compareSummary').textContent = 'Fetching comparison data...';

            fetch(url)
                .then(res => res.json())
                .then(res => {
                    if (res.error) {
                        document.getElementById('compareSummary').textContent = res.error;
                        return;
                    }

                    // Render Chart
                    const chartEl = document.querySelector("#compareChart");
                    if (chartEl) {
                        // Dynamic series from API
                        // res.series is array of { name, data, color } which works for ApexCharts

                        const options = {
                            series: res.series,
                            chart: { type: 'line', height: 300, toolbar: { show: true } },
                            stroke: { curve: 'smooth', width: 3 },
                            xaxis: { categories: res.labels, tooltip: { enabled: false } },
                            // colors: handled in API or auto-assigned if passed here. 
                            // API returns colors in series object (ApexCharts supports this per-series)
                            legend: { position: 'top' },
                            tooltip: { x: { show: true } }
                        };

                        if (this.compareChart) {
                            this.compareChart.destroy();
                        }
                        this.compareChart = new ApexCharts(chartEl, options);
                        this.compareChart.render();
                    }

                    const names = res.series.map(s => s.name).join(' vs ');
                    document.getElementById('compareSummary').textContent = `Comparing: ${names}`;
                })
                .catch(err => {
                    console.error(err);
                    document.getElementById('compareSummary').textContent = 'Error fetching data.';
                })
                .finally(() => {
                    btn.disabled = false;
                    btn.innerHTML = '<i class="fa-solid fa-play me-1"></i>Compare';
                });
        });
    },

    // --- SMS Alert Functions ---
    showSmsAlertToast(alert) {
        const toast = document.getElementById('smsAlertToast');
        if (!toast) return;

        const header = document.getElementById('smsAlertToastHeader');
        const title = document.getElementById('smsAlertToastTitle');
        const body = document.getElementById('smsAlertToastBody');
        const time = document.getElementById('smsAlertToastTime');

        const isLocal = alert.mode === 'local';
        const severity = alert.severity === 'red' ? 'red' : 'yellow';

        // Play notification sound
        this.playAlertSound(severity);

        // Set colors based on severity
        if (severity === 'red') {
            header.className = 'toast-header bg-danger text-white';
            title.textContent = isLocal ? 'Critical AQI Detected' : 'Critical SMS Alert Sent';
        } else {
            header.className = 'toast-header bg-warning text-dark';
            title.textContent = isLocal ? 'High AQI Detected' : 'Caution SMS Alert Sent';
        }

        const recipientsText = (!isLocal && typeof alert.recipients === 'number')
            ? `<span class="text-success">${alert.recipients} recipient${alert.recipients > 1 ? 's' : ''}</span>`
            : '<span class="text-muted">Local alert only</span>';

        const modeNote = alert.mode === 'demo'
            ? '<br><small class="text-info">[Demo Mode - No actual SMS sent]</small>'
            : '';

        body.innerHTML = `
            <strong>${alert.device_name}</strong> (${alert.area})<br>
            <span class="text-muted">AQI: ${alert.aqi}</span> &bull; 
            ${recipientsText}
            ${modeNote}
        `;
        time.textContent = 'Just now';

        // Show toast
        const bsToast = bootstrap.Toast.getOrCreateInstance(toast);
        bsToast.show();
    },

    // Play alert notification sound using Web Audio API
    playAlertSound(severity = 'yellow') {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            // Different tones for different severities
            if (severity === 'red') {
                // Critical: Two-tone alarm (higher pitch, more urgent)
                oscillator.frequency.setValueAtTime(880, audioContext.currentTime); // A5
                oscillator.frequency.setValueAtTime(660, audioContext.currentTime + 0.15); // E5
                oscillator.frequency.setValueAtTime(880, audioContext.currentTime + 0.3); // A5
                gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.5);
            } else {
                // Caution: Single chime (softer)
                oscillator.frequency.setValueAtTime(523, audioContext.currentTime); // C5
                oscillator.frequency.setValueAtTime(659, audioContext.currentTime + 0.1); // E5
                gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.3);
            }
        } catch (e) {
            console.log('Audio notification not supported:', e);
        }
    },

    checkAndTriggerSmsAlert(data) {
        // Always check ALL devices for high AQI (the API handles detection)
        // Throttle: only check once per 2 seconds globally
        const lastCheck = sessionStorage.getItem('sms_global_check');
        const now = Date.now();
        if (lastCheck && (now - parseInt(lastCheck)) < 2000) return; // 2 sec global cooldown

        sessionStorage.setItem('sms_global_check', now.toString());

        // Call SMS trigger API to check ALL devices with AQI >= 101
        fetch('api/trigger_sms_check.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({}) // Empty = check ALL devices
        })
            .then(res => res.json())
            .then(result => {
                if (result.triggered && result.alerts && result.alerts.length > 0) {
                    console.log(`[SMS] Auto-triggered ${result.alerts.length} alert(s)`);
                    // Show toast for each alert sent
                    result.alerts.forEach((alert, index) => {
                        const keyId = alert.device_id ?? alert.device_name ?? index;
                        if (keyId !== null && keyId !== undefined) {
                            sessionStorage.setItem(`${ECO_ALERT_STORAGE_PREFIX}${keyId}`, Date.now().toString());
                        }
                        // Stagger multiple toasts
                        setTimeout(() => {
                            this.showSmsAlertToast(alert);
                        }, index * 1500);
                    });
                    return;
                }

                const localDevices = Array.isArray(result.high_aqi_devices)
                    ? result.high_aqi_devices.filter(device => Number(device.aqi) >= 101)
                    : [];
                if (localDevices.length === 0) return;

                localDevices.forEach((device, index) => {
                    const deviceId = device.device_id || device.device_name || index;
                    const key = `${ECO_ALERT_STORAGE_PREFIX}${deviceId}`;
                    const lastLocal = sessionStorage.getItem(key);
                    const nowLocal = Date.now();
                    if (lastLocal && (nowLocal - parseInt(lastLocal)) < ECO_ALERT_COOLDOWN_MS) {
                        return;
                    }
                    sessionStorage.setItem(key, nowLocal.toString());
                    setTimeout(() => {
                        this.showSmsAlertToast({
                            device_name: device.device_name || 'Device',
                            area: device.area || 'your area',
                            aqi: device.aqi ?? '--',
                            severity: device.severity || 'yellow',
                            recipients: 0,
                            mode: 'local'
                        });
                    }, index * 500);
                });
            })
            .catch(err => console.error('SMS trigger check failed:', err));
    }
};

// Initialize App on load
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});
