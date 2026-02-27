// Global state to manage map cleanup
window.ecoPulseMapState = {
  intervals: [],
  map: null
};

window.initMap = () => {
  const mapElement = document.getElementById('map');
  // If we are not on the map page, do nothing
  if (!mapElement) return;

  // Clean any stuck modal/backdrop state so page is clickable
  document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
  document.body.classList.remove('modal-open');
  document.body.style.removeProperty('padding-right');
  document.body.style.removeProperty('overflow');

  // Cleanup previous state if any (intervals, map instance)
  if (window.ecoPulseMapState.map) {
    window.ecoPulseMapState.map.remove();
    window.ecoPulseMapState.map = null;
  }
  window.ecoPulseMapState.intervals.forEach(clearInterval);
  window.ecoPulseMapState.intervals = [];

  const hideStations = false;
  const MAP_CENTER = [10.098, 122.88];
  const DATA_URL = 'get_devices.php';
  const AUTO_REFRESH_MS = 2000;
  const STALE_MINUTES = 15;
  const HIGH_AQI_THRESHOLD = 150;
  const ALERT_COOLDOWN_MS = window.ecoPulseAlertConfig?.cooldownMs ?? 600000;
  const ALERT_STORAGE_PREFIX = window.ecoPulseAlertConfig?.storagePrefix ?? 'aqi_alert_ts_';

  const statusConfig = {
    online: { label: 'Healthy', color: '#2ecc71', badgeClass: 'status-online' },
    warning: { label: 'Watch', color: '#f1c40f', badgeClass: 'status-warning' },
    critical: { label: 'Critical', color: '#e74c3c', badgeClass: 'status-critical' },
    stale: { label: 'Stale', color: '#ff9800', badgeClass: 'status-warning' },
    offline: { label: 'Offline', color: '#95a5a6', badgeClass: 'status-offline' }
  };
  const searchingHoldUntil = new Map(); // deviceId (string) -> timestamp to show SEARCHING

  const aqiStyleMap = {
    good: { bg: '#e8f7ed', text: '#2ecc71', border: '#c7ebd6' },
    moderate: { bg: '#fff6e0', text: '#f1c40f', border: '#f6e2a4' },
    'unhealthy-sg': { bg: '#ffece0', text: '#e67e22', border: '#f4c29a' },
    unhealthy: { bg: '#ffe3e0', text: '#e74c3c', border: '#f5b2a6' },
    'very-unhealthy': { bg: '#f1e9ff', text: '#8e44ad', border: '#d5c1f4' },
    unknown: { bg: '#f6f7f9', text: '#6c757d', border: '#e1e5eb' }
  };

  const getAlertCooldownRemaining = (deviceId) => {
    if (!deviceId) return 0;
    const last = sessionStorage.getItem(`${ALERT_STORAGE_PREFIX}${deviceId}`);
    if (!last) return 0;
    const elapsed = Date.now() - parseInt(last, 10);
    return elapsed < ALERT_COOLDOWN_MS ? (ALERT_COOLDOWN_MS - elapsed) : 0;
  };

  const formatCooldown = (ms) => {
    const totalSeconds = Math.max(0, Math.ceil(ms / 1000));
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const updateCooldownLabels = () => {
    document.querySelectorAll('[data-cooldown-id]').forEach((el) => {
      const id = el.getAttribute('data-cooldown-id');
      const remaining = getAlertCooldownRemaining(id);
      if (remaining > 0) {
        el.textContent = `Cooldown ${formatCooldown(remaining)}`;
        el.classList.remove('text-success');
        el.classList.add('text-warning');
      } else {
        el.textContent = 'Cooldown ready';
        el.classList.remove('text-warning');
        el.classList.add('text-success');
      }
    });
  };

  // Safety check: ensure Leaflet is loaded
  if (typeof L === 'undefined') {
    console.error('Leaflet library is not loaded. Cannot initialize map.');
    return;
  }

  // Ensure map container has dimensions before initializing
  const mapContainer = document.getElementById('map');
  if (!mapContainer) {
    console.error('Map container not found');
    return;
  }

  // Check container dimensions
  const rect = mapContainer.getBoundingClientRect();
  if (rect.width === 0 || rect.height === 0) {
    console.warn('Map container has no dimensions. Waiting for layout...');
    // Retry initialization after a delay
    setTimeout(() => window.initMap(), 500);
    return;
  }

  const mapInstance = L.map('map', {
    zoomControl: true,
    scrollWheelZoom: true
  }).setView(MAP_CENTER, 13);

  window.ecoPulseMapState.map = mapInstance;

  mapInstance.on('dragstart zoomstart', () => { shouldAutoFit = false; });

  // Fix for blank map issue: force a resize after a short delay to handle container sizing
  setTimeout(() => {
    if (mapInstance && mapInstance._loaded) {
      mapInstance.invalidateSize();
    }
  }, 300);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(mapInstance);

  const markerLayer = L.layerGroup().addTo(mapInstance);
  const userLayer = L.layerGroup().addTo(mapInstance);
  const markerIndex = new Map();

  const filterStatusEl = document.getElementById('filterStatus');
  const filterAqiBandEl = document.getElementById('filterAqiBand');
  const filterStaleEl = document.getElementById('filterStale');
  const filterHighAqiEl = document.getElementById('filterHighAqi');
  const refreshButton = document.getElementById('mapRefreshTop');
  const locateButton = document.getElementById('mapLocate');
  const addDeviceButton = document.getElementById('mapAddDevice'); // removed from UI, kept for safety
  const addDeviceModalEl = document.getElementById('addDeviceModal');
  const addDeviceModal = addDeviceModalEl ? new bootstrap.Modal(addDeviceModalEl) : null;
  const saveDeviceBtn = document.getElementById('saveDeviceBtn');
  const addDeviceForm = document.getElementById('addDeviceForm');
  const newDeviceCodeInput = document.getElementById('newDeviceCode');
  const newDeviceNameInput = document.getElementById('newDeviceName');
  const newDeviceAddressInput = document.getElementById('newDeviceAddress');
  const newDeviceLatInput = document.getElementById('newDeviceLat');
  const newDeviceLngInput = document.getElementById('newDeviceLng');
  const deviceLabel = document.getElementById('mapCurrentDeviceLabel');
  const stationListEl = document.getElementById('mapStationList');
  const avgAqiEl = document.getElementById('mapAvgAqi');
  const onlineCountEl = document.getElementById('mapOnlineCount');
  const criticalCountEl = document.getElementById('mapCriticalCount');
  const liveBadgeEl = document.getElementById('mapLiveBadge');
  const liveLabelEl = document.getElementById('mapLiveLabel');
  const lastUpdatedEl = document.getElementById('mapLastUpdated');
  const legendOfflineEl = document.getElementById('legendOfflineCount');
  const legendStaleEl = document.getElementById('legendStaleCount');
  const legendHighAqiEl = document.getElementById('legendHighAqiCount');
  const reverseCache = new Map();

  const reverseGeocode = async (lat, lng, zoom = 16) => {
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return '';
    const key = `${lat.toFixed(5)},${lng.toFixed(5)}`;
    if (reverseCache.has(key)) return reverseCache.get(key);
    try {
      const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=${zoom}&addressdetails=1`;
      const res = await fetch(url, {
        headers: {
          'User-Agent': 'EcoPulse-Dashboard/1.0 (contact: admin@ecopulse.local)'
        }
      });
      if (!res.ok) return '';
      const body = await res.json();
      const name = body.display_name || body.name;
      if (name) {
        reverseCache.set(key, name);
        return name;
      }
    } catch (error) {
      console.error('Reverse geocode failed:', error);
    }
    return '';
  };

  let sensors = [];
  let lastFetchTime = null;
  let shouldAutoFit = true;
  let fetchInFlight = false;
  let liveState = 'idle';
  let locateInFlight = false;
  let lastLocationError = null;
  let addDeviceInFlight = false;
  let addDeviceCompleted = false;
  const manualDeviceSet = localStorage.getItem('ecoPulseDeviceManual') === '1';
  let currentDeviceIndex = Number(localStorage.getItem('ecoPulseCurrentDeviceIndex') || '1');
  let nextDeviceIndex = Number(localStorage.getItem('ecoPulseNextDeviceIndex') || String(currentDeviceIndex + 1));
  let pendingDeviceCode = '';
  let pendingDeviceName = '';
  let attemptingHighAccuracy = false; // Track fallback state
  let lastLocatedPoint = null;
  let lastLocatedNearest = null;

  if (!Number.isFinite(currentDeviceIndex) || currentDeviceIndex < 1) {
    currentDeviceIndex = 1;
  }
  if (!Number.isFinite(nextDeviceIndex) || nextDeviceIndex <= currentDeviceIndex) {
    nextDeviceIndex = currentDeviceIndex + 1;
  }
  // If the user never explicitly added a device, force us back to DEVICE 1 / DEV-001.
  if (!manualDeviceSet) {
    currentDeviceIndex = 1;
    nextDeviceIndex = 2;
  }

  const formatNumber = (value, decimals = 0) => {
    const num = Number(value);
    if (!Number.isFinite(num)) return null;
    return num.toFixed(decimals);
  };

  const formatRelative = (isoString) => {
    if (!isoString) return 'Unknown';
    const date = new Date(isoString);
    if (Number.isNaN(date.getTime())) return 'Unknown';
    const diff = Date.now() - date.getTime();
    const mins = Math.round(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins} min ago`;
    const hours = Math.round(mins / 60);
    if (hours < 24) return `${hours} hr${hours > 1 ? 's' : ''} ago`;
    const days = Math.round(hours / 24);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  };

  const getStatusConfig = (sensor) => {
    if (sensor.status === 'warning') return statusConfig.warning;
    if (sensor.status === 'critical') return statusConfig.critical;
    if (sensor.status === 'stale') return statusConfig.stale;
    if (sensor.status === 'offline') return statusConfig.offline;
    return statusConfig.online;
  };

  const getAqiBand = (aqi) => {
    if (aqi == null) return 'unknown';
    if (aqi <= 50) return 'good';
    if (aqi <= 100) return 'moderate';
    if (aqi <= 150) return 'unhealthy-sg';
    if (aqi <= 200) return 'unhealthy';
    return 'very-unhealthy';
  };

  const buildPopup = (sensor, config) => {
    const pm25 = formatNumber(sensor.pm25, 1);
    const pm10 = formatNumber(sensor.pm10, 1);
    const pm1 = formatNumber(sensor.pm1, 1);
    const co2 = formatNumber(sensor.co2, 1);
    const o3 = formatNumber(sensor.o3, 1);
    const co = formatNumber(sensor.co, 1);
    const aqiValue = sensor.aqi != null ? sensor.aqi : '--';
    const metricsHtml = sensor.status !== 'offline' ?
      `
          <div>PM1.0: <strong>${pm1 ?? '--'}</strong> ug/m3</div>
          <div>PM2.5: <strong>${pm25 ?? '--'}</strong> ug/m3</div>
          <div>PM10: <strong>${pm10 ?? '--'}</strong> ug/m3</div>
          <div>Ozone (O3): <strong>${o3 ?? '--'}</strong> ug/m3</div>
          <div>CO2: <strong>${co2 ?? '--'}</strong> ppm</div>
          <div>CO: <strong>${co ?? '--'}</strong> ppm</div>
          <div>Status: <strong>${config.label}</strong></div>
        ` :
      '<div>Device is currently offline.</div>';

    return `
      <div class="map-popup">
        <div class="d-flex align-items-center mb-1 justify-content-between">
            <div class="d-flex align-items-center">
                <strong class="me-2">${sensor.name}</strong>
                <span class="badge" style="background:${config.color};color:#fff;">
                    ${sensor.status === 'offline' ? 'Offline' : `AQI ${aqiValue}`}
                </span>
            </div>
            ${(typeof HAS_ADD_DEVICE_PERMISSION !== 'undefined' && HAS_ADD_DEVICE_PERMISSION) ? `
            <button class="btn btn-sm text-danger p-0 border-0 ms-2 delete-device-btn" data-id="${sensor.id}" title="Delete Device">
                <i class="fa-solid fa-trash"></i>
            </button>` : ''}
        </div>
        <div class="text-muted small mb-2">${sensor.area} &bull; Updated ${formatRelative(sensor.updatedAt)}</div>
        <div class="small">${metricsHtml}</div>
      </div>`;
  };

  const renderMarkers = (dataset) => {
    markerLayer.clearLayers();
    markerIndex.clear();

    const plotReady = [];

    dataset.forEach(sensor => {
      const lat = Number(sensor.lat);
      const lng = Number(sensor.lng);

      if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;

      plotReady.push({ ...sensor, lat, lng }); // Store parsed values
      const config = getStatusConfig(sensor);

      // Fix: If sensor is stale but considered 'warning' by backend logic (yellow strip), we should reflect that.
      // However, usually Stale = Orange/Grey.
      // If backend says 'warning', let's trust it unless it's offline.
      // For clearer map visibility, ensure color is not too pale.

      const marker = L.circleMarker([lat, lng], {
        radius: 12,
        color: '#fff', // White border for contrast
        weight: 2,
        fillColor: config.color,
        fillOpacity: 1, // Full opacity to fight map noise
        zIndexOffset: 1000
      }).bindPopup(buildPopup(sensor, config));

      marker.on('click', () => highlightStation(sensor.id));
      marker.addTo(markerLayer);
      markerIndex.set(sensor.id, marker);
    });

    if (plotReady.length && shouldAutoFit) {
      try {
        // Ensure map instance exists and is initialized
        if (!mapInstance || !mapInstance._loaded) {
          console.warn('Map not ready for fitBounds');
          return;
        }

        const bounds = L.latLngBounds(plotReady.map(s => [s.lat, s.lng]));
        if (bounds.isValid()) {
          // On mobile, the bottom sheet takes space. Use a safe generic padding.
          const isMobile = window.innerWidth <= 768;
          // Simple padding: [top-left, bottom-right] logic or just [y, x]
          // We will just use standard padding for now to avoid Leaflet internal errors

          // Use a timeout to ensure DOM is fully ready
          setTimeout(() => {
            try {
              mapInstance.fitBounds(bounds.pad(0.1), {
                padding: [50, 50],
                maxZoom: 15,
                animate: true,
                duration: 1
              });
            } catch (boundsError) {
              console.warn('Error fitting bounds:', boundsError);
            }
          }, 100);
        }
        shouldAutoFit = false;
      } catch (error) {
        console.warn('Unable to fit bounds for sensor markers', error);
      }
    }
  };

  const renderMetricChip = (label, value, decimals = 0, suffix = '') => {
    const formatted = formatNumber(value, decimals);
    const display = formatted !== null ? `${formatted}${suffix ? ` ${suffix}` : ''}` : '--';
    return `<div class="station-chip">
      <span>${label}</span>
      <strong>${display}</strong>
    </div>`;
  };

  const renderStationList = (dataset) => {
    // In new layout, target might be #device-list-container. 
    // We check for both for backward compatibility or just update the variable.
    const container = document.getElementById('device-list-container') || stationListEl;
    if (!container) return;

    try {
      if (!dataset.length) {
        container.innerHTML = '<div class="col-12"><p class="text-muted text-center py-4">No stations match the selected filters.</p></div>';
        return;
      }

      container.innerHTML = dataset.map(sensor => {
        const config = getStatusConfig(sensor);

        let aqiClass = 'bg-light';
        let aqiTextClass = 'text-muted';
        if (sensor.aqi !== null && sensor.status !== 'offline') {
          const band = getAqiBand(sensor.aqi);
          if (band === 'good') {
            aqiClass = 'bg-aqi-good';
            aqiTextClass = 'text-success';
          } else if (band === 'moderate') {
            aqiClass = 'bg-aqi-moderate';
            aqiTextClass = 'text-warning';
          } else {
            aqiClass = 'bg-aqi-unhealthy';
            aqiTextClass = 'text-danger';
          }
        }

        let statusOptClass = 'status-opt-offline';
        if (sensor.status === 'online') statusOptClass = 'status-opt-online';
        else if (sensor.status === 'warning') statusOptClass = 'status-opt-warning';
        else if (sensor.status === 'critical') statusOptClass = 'status-opt-critical';

        const latStr = sensor.lat != null ? Number(sensor.lat).toFixed(5) : '';
        const lngStr = sensor.lng != null ? Number(sensor.lng).toFixed(5) : '';
        const statusLabel = (() => {
          const key = String(sensor.id);
          const nowTs = Date.now();
          const holdUntil = searchingHoldUntil.get(key);
          const shouldHoldSearching = holdUntil && holdUntil > nowTs && sensor.status !== 'online' && sensor.status !== 'warning' && sensor.status !== 'critical';
          if (sensor.status === 'searching' || shouldHoldSearching) {
            return '<span class="text-warning fw-bold">SEARCHING</span>';
          }
          const timeText = formatRelative(sensor.updatedAt);
          const staleText = sensor.isStale ? ' • <span class="text-danger">Stale</span>' : '';
          return `${timeText}${staleText}`;
        })();
        const cooldownRemaining = getAlertCooldownRemaining(sensor.id);
        const cooldownLabel = cooldownRemaining > 0 ? `Cooldown ${formatCooldown(cooldownRemaining)}` : 'Cooldown ready';
        const cooldownClass = cooldownRemaining > 0 ? 'text-warning' : 'text-success';
        const tempValue = sensor.temperature ?? sensor.temp;
        const forecast = sensor.forecast || null;
        const hasForecast = forecast && forecast.forecast_aqi !== null && forecast.forecast_aqi !== undefined;
        const forecastText = hasForecast
          ? `30m ${forecast.direction || 'steady'}: ${forecast.forecast_aqi}`
          : '30m forecast unavailable';
        const forecastClass = hasForecast ? 'text-primary' : 'text-muted';

        // Use Grid Column for new layout
        const codeLabel = sensor.device_code ? sensor.device_code : `DEV-${String(sensor.id).padStart(4, '0')}`;

        return `
          <div class="col-md-6 col-lg-4 col-xl-3 device-card-col">
              <article class="device-card-item ${statusOptClass}" data-id="${sensor.id}">
                <div class="d-flex justify-content-between align-items-start mb-3">
                  <div class="station-info pe-2">
                    <h6 class="station-name text-dark mb-1 fw-bold">
                      ${sensor.name}
                      <span class="badge bg-light text-secondary border ms-2">${codeLabel}</span>
                    </h6>
                    <div class="d-flex align-items-center gap-1 text-muted small">
                        <i class="fa-solid fa-location-dot fa-xs opacity-50"></i>
                         <span class="station-area text-truncate" style="max-width: 150px;">${sensor.area}</span>
                    </div>
                  </div>
                  
                  <div class="aqi-badge-group text-center">
                     <div class="aqi-pill ${aqiClass} px-3 py-1 rounded-3 d-flex flex-column align-items-center justify-content-center">
                        <span class="aqi-label text-uppercase fw-bold" style="font-size: 0.6rem; letter-spacing: 0.5px; opacity: 0.7;">AQI</span>
                        <span class="aqi-value h5 mb-0 fw-bold ${aqiTextClass}">${sensor.aqi != null ? sensor.aqi : '--'}</span>
                     </div>
                  </div>
                </div>

                <div class="station-metrics mb-3">
                    <span class="badge bg-light text-dark border me-1"><i class="fa-solid fa-cloud me-1 text-muted"></i>PM2.5: ${sensor.pm25 || '--'}</span>
                    <span class="badge bg-light text-dark border"><i class="fa-solid fa-temperature-half me-1 text-muted"></i>${tempValue || '--'}°C</span>
                </div>
                <div class="small ${forecastClass} mb-2"><i class="fa-solid fa-wave-square me-1"></i>${forecastText}</div>

                <div class="station-footer d-flex justify-content-between align-items-center pt-3 border-top border-light">
                  <div class="station-updated text-muted" style="font-size: 0.75rem;">
                      <div>
                        <i class="fa-regular fa-clock me-1 opacity-50"></i>
                        <span>${statusLabel}</span>
                      </div>
                      <div class="cooldown-label ${cooldownClass}" data-cooldown-id="${sensor.id}" style="font-size: 0.7rem;">
                        ${cooldownLabel}
                      </div>
                  </div>
                  
                   <div class="d-flex align-items-center gap-2">
                      ${(typeof HAS_ADD_DEVICE_PERMISSION !== 'undefined' && HAS_ADD_DEVICE_PERMISSION) ? `
                      <button class="btn btn-sm ${sensor.isActive ? 'btn-outline-danger' : 'btn-success'} toggle-device-btn px-2 py-1" 
                              data-id="${sensor.id}" 
                              data-active="${sensor.isActive}"
                              title="${sensor.isActive ? 'Stop Device' : 'Start Device'}">
                          <i class="fa-solid ${sensor.isActive ? 'fa-stop' : 'fa-play'}"></i>
                      </button>
                      <button class="btn btn-sm btn-outline-secondary edit-device-btn px-2 py-1" 
                              data-id="${sensor.id}" 
                              data-name="${sensor.name}"
                              title="Edit Device Name">
                          <i class="fa-solid fa-pen-to-square"></i>
                      </button>
                      <button class="btn btn-sm text-danger p-0 border-0 delete-device-btn" data-id="${sensor.id}" title="Delete Device">
                          <i class="fa-solid fa-trash-can"></i>
                      </button>
                      ` : ''}
                   </div>
                </div>
              </article>
          </div>`;
      }).join('');

      if (window.feather) {
        window.feather.replace();
      }

      // Add click listener for items
      const items = container.querySelectorAll('.device-card-item');
      items.forEach(item => {
        item.addEventListener('click', (e) => {
          if (e.target.closest('.delete-device-btn')) return;

          const id = item.getAttribute('data-id');
          if (id) {
            highlightStation(Number(id));
            // Scroll map into view smoothly
            document.getElementById('map').scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        });
      });
    } catch (e) {
      console.error('Error rendering station list:', e);
      container.innerHTML = '<div class="col-12"><p class="text-danger small">Error displaying list.</p></div>';
    }
  };

  const updateSummary = (dataset) => {
    const total = dataset.length;
    let online = 0;
    let critical = 0;
    let stale = 0;
    let highAqi = 0;
    let sumAqi = 0;

    dataset.forEach(sensor => {
      if (sensor.isStale) stale += 1;
      if (sensor.isHighAqi) highAqi += 1;
      if (sensor.status !== 'offline' && sensor.aqi != null) {
        online += 1;
        sumAqi += sensor.aqi;
        if (sensor.status === 'critical' || sensor.aqi > HIGH_AQI_THRESHOLD) {
          critical += 1;
        }
      }
    });

    const average = online ? Math.round(sumAqi / online) : '--';
    if (avgAqiEl) avgAqiEl.textContent = average;
    if (onlineCountEl) onlineCountEl.textContent = `${online}/${total}`;
    if (criticalCountEl) criticalCountEl.textContent = `${critical} | High AQI: ${highAqi}`;
  };

  const updateLegendCounts = (dataset) => {
    if (legendOfflineEl) legendOfflineEl.textContent = dataset.filter(s => s.status === 'offline').length;
    if (legendStaleEl) legendStaleEl.textContent = dataset.filter(s => s.isStale).length;
    if (legendHighAqiEl) legendHighAqiEl.textContent = dataset.filter(s => s.isHighAqi).length;
  };

  const refreshLiveDisplay = () => {
    if (liveBadgeEl) {
      liveBadgeEl.classList.remove('bg-success-subtle', 'text-success', 'bg-danger', 'text-white');
      if (liveState === 'error') {
        liveBadgeEl.classList.add('bg-danger', 'text-white');
      } else {
        liveBadgeEl.classList.add('bg-success-subtle', 'text-success');
      }
    }

    if (liveLabelEl) {
      if (liveState === 'error') {
        liveLabelEl.textContent = 'Disconnected';
      } else if (liveState === 'idle') {
        liveLabelEl.textContent = 'Connecting';
      } else {
        liveLabelEl.textContent = 'Live';
      }
    }

    if (lastUpdatedEl) {
      if (lastFetchTime) {
        lastUpdatedEl.textContent = `Updated ${formatRelative(new Date(lastFetchTime).toISOString())}`;
        if (liveState === 'error') {
          lastUpdatedEl.textContent += ' - retrying...';
        }
      } else {
        lastUpdatedEl.textContent = liveState === 'error' ?
          'Waiting for server...' :
          'Waiting for data...';
      }
    }

    updateCooldownLabels();
  };

  const highlightStation = (stationId) => {
    const marker = markerIndex.get(stationId);
    if (marker) {
      mapInstance.flyTo(marker.getLatLng(), 15, {
        duration: 0.5
      });
      marker.openPopup();
    }
    stationListEl?.querySelectorAll('.station-item').forEach(item => {
      item.classList.toggle('active', item.getAttribute('data-id') === String(stationId));
    });

  };

  // Skip reverse geocoding to keep device load fast
  const enrichPlaceNames = async () => Promise.resolve();

  const applyFilters = (forceFit = false) => {
    if (forceFit) {
      shouldAutoFit = true;
    }

    const statusFilter = filterStatusEl?.value || 'all';
    const aqiFilter = filterAqiBandEl?.value || 'all';
    const onlyStale = filterStaleEl?.checked;
    const onlyHighAqi = filterHighAqiEl?.checked;

    const filtered = sensors.filter(sensor => {
      const statusMatch = (() => {
        if (statusFilter === 'all') return true;
        if (statusFilter === 'offline') return sensor.status === 'offline';
        if (statusFilter === 'online') return sensor.status === 'online';
        if (statusFilter === 'warning') return sensor.status === 'warning';
        if (statusFilter === 'critical') return sensor.status === 'critical';
        if (statusFilter === 'stale') return sensor.status === 'stale';
        return true;
      })();

      const bandMatch = (() => {
        if (aqiFilter === 'all') return true;
        if (sensor.status === 'offline' || sensor.aqi == null) return false;
        const band = getAqiBand(sensor.aqi).replace('_', '-');
        return band === aqiFilter;
      })();

      const staleMatch = onlyStale ? sensor.isStale === true : true;
      const highMatch = onlyHighAqi ? sensor.isHighAqi === true : true;

      return statusMatch && bandMatch && staleMatch && highMatch;
    });

    renderMarkers(filtered);
    renderStationList(filtered);
    updateSummary(filtered);
  };

  const explainPermissionReset = () => {
    const steps = [
      'Click the padlock/🔒 icon in the address bar',
      'Open Site settings',
      'Set Location to Allow',
      'Reload this page and tap "Locate me" again'
    ].join('\n');
    alert(`Location is blocked for this site.\n\n${steps}`);
  };

  const ensureGeolocationPermission = async () => {
    if (!navigator.permissions?.query) return true;
    try {
      const status = await navigator.permissions.query({ name: 'geolocation' });
      lastLocationError = status.state;
      if (status.state === 'denied') {
        explainPermissionReset();
        return false;
      }
      return true;
    } catch (error) {
      lastLocationError = error?.message || 'unknown';
      return true;
    }
  };

  const focusFirstStation = () => {
    const target = sensors.find(s => s.lat != null && s.lng != null);
    if (!target) return false;

    mapInstance.flyTo([target.lat, target.lng], 16, {
      duration: 0.6
    });
    highlightStation(target.id);
    setTimeout(() => {
      locateButton?.classList.remove('loading');
      if (locateButton) locateButton.disabled = false;
    }, 600);
    return true;
  };

  const getDeviceIdentifiers = (index) => {
    const safeIndex = Number.isFinite(index) && index > 0 ? index : 1;
    return {
      index: safeIndex,
      code: `DEV-${String(safeIndex).padStart(4, '0')}`,
      name: `DEVICE ${safeIndex}`
    };
  };

  const saveDeviceState = () => {
    localStorage.setItem('ecoPulseCurrentDeviceIndex', String(currentDeviceIndex));
    localStorage.setItem('ecoPulseNextDeviceIndex', String(nextDeviceIndex));
    const manual = currentDeviceIndex > 1 ? '1' : '0';
    localStorage.setItem('ecoPulseDeviceManual', manual);
  };

  const refreshPendingDevice = () => {
    const ids = getDeviceIdentifiers(currentDeviceIndex);
    pendingDeviceCode = ids.code;
    pendingDeviceName = ids.name;
    if (deviceLabel) deviceLabel.textContent = pendingDeviceName;
  };

  // Fetch a fresh device list to ensure we prefill with a free code
  const refreshSensorsNow = async () => {
    try {
      const response = await fetch(`${DATA_URL}?cache=${Date.now()}`, { cache: 'no-store' });
      if (!response.ok) return;
      const payload = await response.json();
      sensors = Array.isArray(payload.sensors) ? payload.sensors : [];
      updateDeviceIndexFromSensors(sensors);
    } catch (err) {
      console.error('refreshSensorsNow error', err);
    }
  };

  // Recompute the next available device index/code from existing sensors
  const updateDeviceIndexFromSensors = (devices) => {
    if (!Array.isArray(devices)) {
      currentDeviceIndex = 1;
      nextDeviceIndex = 2;
      refreshPendingDevice();
      saveDeviceState();
      return;
    }
    const used = new Set();
    devices.forEach((d) => {
      if (d.code && /^DEV-(\d+)/i.test(d.code)) {
        const num = parseInt(d.code.replace(/^DEV-0*/, ''), 10);
        if (Number.isFinite(num) && num > 0) used.add(num);
      }
    });
    let candidate = 1;
    while (used.has(candidate)) candidate += 1;
    currentDeviceIndex = candidate;
    nextDeviceIndex = candidate + 1;
    refreshPendingDevice();
    saveDeviceState();
  };
  const syncDemoLocation = async (latitude, longitude, deviceCode, deviceName) => {
    try {
      const response = await fetch('api/update_location.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          device_code: deviceCode,
          device_name: deviceName,
          lat: latitude,
          lng: longitude
        })
      });

      if (!response.ok) {
        console.error('Failed to sync location for demo');
        return false;
      }
      return true;
    } catch (error) {
      console.error('Error syncing location', error);
      return false;
    }
  };

  const recordVisitLog = async (payload) => {
    try {
      const response = await fetch('api/record_visit.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!response.ok) {
        console.error('Failed to record visit');
      }
    } catch (error) {
      console.error('Error recording visit', error);
    }
  };

  // --- Device Management ---

  // Expose delete handler globally or attach via event delegation
  window.deleteDevice = async (id) => {
    if (!confirm('Are you sure you want to delete this device? This cannot be undone.')) return;

    try {
      const res = await fetch('api/delete_device.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ device_id: id })
      });
      const data = await res.json();
      if (data.success) {
        fetchData(true);
      } else {
        alert('Error deleting device: ' + (data.error || 'Unknown error'));
      }
    } catch (err) {
      console.error(err);
      alert('Network error while deleting device.');
    }
  };

  // Event Delegation for Delete Button in Popups
  if (!window.ecoPulseDeleteHandlerAttached) {
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.delete-device-btn');
      if (btn) {
        e.preventDefault();
        e.stopPropagation(); // Stop it from triggering the card click
        const id = btn.getAttribute('data-id');
        if (id) window.deleteDevice(id);
      }
    });
    window.ecoPulseDeleteHandlerAttached = true;
  }

  // Event Delegation for Toggle (Start/Stop) Button
  if (!window.ecoPulseToggleHandlerAttached) {
    document.addEventListener('click', async (e) => {
      const btn = e.target.closest('.toggle-device-btn');
      if (btn) {
        e.preventDefault();
        e.stopPropagation();
        const id = btn.getAttribute('data-id');
        if (!id) return;

        // Confirmation for Stop Action
        const activeAttr = btn.getAttribute('data-active');
        const isStopAction = activeAttr === 'true' || activeAttr === '1';

        if (isStopAction) {
          if (!confirm('Are you sure you want to STOP this device?')) return;
        }

        const holdKey = String(id);

        // Disable button and show spinner
        btn.disabled = true;
        const originalHtml = btn.innerHTML;
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';
        // Temporarily show SEARCHING state on the card footer while waiting for data
        const card = btn.closest('.device-card-item');
        const statusPill = card?.querySelector('.station-updated span');
        if (statusPill) {
          statusPill.innerHTML = 'SEARCHING...';
          statusPill.classList.add('text-warning', 'fw-bold');
        }

        try {
          const res = await fetch('api/device_control.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'toggle', device_id: id })
          });
          const data = await res.json();
          if (data.success) {
            if (String(data.new_state) === '1') {
              searchingHoldUntil.set(holdKey, Date.now() + 30000); // hold SEARCHING up to 30s
            } else {
              searchingHoldUntil.delete(holdKey);
            }
            fetchData(true); // Refresh the list
          } else {
            alert('Error: ' + (data.error || 'Unknown error'));
            btn.innerHTML = originalHtml;
            btn.disabled = false;
          }
        } catch (err) {
          console.error(err);
          alert('Network error toggling device.');
          btn.innerHTML = originalHtml;
          btn.disabled = false;
        }
      }
    });
    window.ecoPulseToggleHandlerAttached = true;
  }

  // Event Delegation for Edit Button - Opens Modal
  if (!window.ecoPulseEditHandlerAttached) {
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.edit-device-btn');
      if (btn) {
        e.preventDefault();
        e.stopPropagation();
        const id = btn.getAttribute('data-id');
        const name = btn.getAttribute('data-name');

        // Populate and show modal
        const modalEl = document.getElementById('editDeviceModal');
        if (modalEl) {
          document.getElementById('editDeviceId').value = id;
          document.getElementById('editDeviceName').value = name;
          const modal = new bootstrap.Modal(modalEl);
          modal.show();
        }
      }
    });
    window.ecoPulseEditHandlerAttached = true;
  }

  refreshPendingDevice();
  saveDeviceState();

  const addDeviceAtLocation = async (lat, lng, nearestArea = '') => {
    if (addDeviceInFlight) return;
    addDeviceInFlight = true;

    // Re-sync available index using latest sensors list before adding
    updateDeviceIndexFromSensors(sensors);

    const area = nearestArea || 'Unknown location';
    const attemptAdd = async (ids) => {
      const payload = {
        device_code: ids.code,
        name: ids.name,
        address: area,
        lat,
        lng
      };

      const res = await fetch('api/add_device.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      return { res, data, payload };
    };

    try {
      let ids = getDeviceIdentifiers(currentDeviceIndex);
      let result = await attemptAdd(ids);

      if (result.data?.success) {
        currentDeviceIndex = ids.index + 1;
        nextDeviceIndex = currentDeviceIndex + 1;
        refreshPendingDevice();
        saveDeviceState();
        fetchData(true);
        alert(`Device added as ${result.payload.device_code} at your location.`);
        return;
      }

      const duplicate = result.res?.status === 409 && (result.data?.error || '').toLowerCase().includes('already exists');
      if (duplicate) {
        // Refresh sensors, recompute index, and try once more
        await fetchData(true);
        updateDeviceIndexFromSensors(sensors);
        ids = getDeviceIdentifiers(currentDeviceIndex);
        result = await attemptAdd(ids);
        if (result.data?.success) {
          currentDeviceIndex = ids.index + 1;
          nextDeviceIndex = currentDeviceIndex + 1;
          refreshPendingDevice();
          saveDeviceState();
          fetchData(true);
          alert(`Device added as ${result.payload.device_code} at your location.`);
          return;
        }
      }

      const errMsg = result.data?.error || 'Unknown error';
      alert('Error adding device: ' + errMsg);
    } catch (err) {
      console.error('Add device error', err);
      alert('Network error while adding device.');
    } finally {
      addDeviceInFlight = false;
    }
  };

  const prefillAddDeviceForm = (lat, lng, nearestArea = '') => {
    const area = nearestArea || 'Unknown location';
    updateDeviceIndexFromSensors(sensors);
    const ids = getDeviceIdentifiers(currentDeviceIndex);
    if (newDeviceCodeInput) newDeviceCodeInput.value = 'Auto-generated';
    if (newDeviceNameInput) newDeviceNameInput.value = ids.name;
    if (newDeviceAddressInput) newDeviceAddressInput.value = area;
    if (newDeviceLatInput) newDeviceLatInput.value = (lat ?? MAP_CENTER[0]).toFixed(6);
    if (newDeviceLngInput) newDeviceLngInput.value = (lng ?? MAP_CENTER[1]).toFixed(6);
    addDeviceCompleted = false;
    addDeviceInFlight = false;
    if (saveDeviceBtn) {
      saveDeviceBtn.disabled = false;
      saveDeviceBtn.textContent = 'Save Device';
    }
  };

  const handleSaveDevice = async (e) => {
    if (e) e.preventDefault();
    if (addDeviceInFlight) return;

    const code = (newDeviceCodeInput?.value || '').trim().toUpperCase(); // ignored by backend
    let name = (newDeviceNameInput?.value || '').trim();
    let address = (newDeviceAddressInput?.value || '').trim();
    const lat = parseFloat(newDeviceLatInput?.value ?? '');
    const lng = parseFloat(newDeviceLngInput?.value ?? '');

    if (!name) name = 'DEVICE';
    if (!address) address = 'Unknown location';
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      alert('Latitude/Longitude missing. Please use Locate me first.');
      return;
    }

    addDeviceInFlight = true;
    if (saveDeviceBtn) {
      saveDeviceBtn.disabled = true;
      saveDeviceBtn.textContent = 'Saving...';
    }

    try {
      const res = await fetch('api/add_device.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, address, lat, lng })
      });
      const data = await res.json();
      if (data.success) {
        addDeviceModal?.hide();
        document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
        document.body.classList.remove('modal-open');
        document.body.style.removeProperty('padding-right');
        document.body.style.removeProperty('overflow');

        await refreshSensorsNow();
        currentDeviceIndex += 1;
        nextDeviceIndex = currentDeviceIndex + 1;
        refreshPendingDevice();
        saveDeviceState();
        fetchData(true);
        alert(`Device ${data.device_code || 'created'} added.`);
      } else {
        alert('Error adding device: ' + (data.error || 'Unknown error'));
      }
    } catch (err) {
      console.error('Add device error', err);
      alert('Network error while adding device.');
    } finally {
      addDeviceInFlight = false;
      if (saveDeviceBtn) {
        saveDeviceBtn.disabled = false;
        saveDeviceBtn.textContent = 'Save Device';
      }
    }
  };

  if (addDeviceModal) {
    document.getElementById('closeAddDeviceModal')?.addEventListener('click', () => addDeviceModal.hide());
    document.getElementById('cancelAddDeviceBtn')?.addEventListener('click', () => addDeviceModal.hide());
  }

  const updateAddressFromBrowserLocation = async (lat, lng, fallbackArea = '') => {
    if (newDeviceAddressInput) newDeviceAddressInput.value = 'Detecting address...';
    const detected = await reverseGeocode(lat, lng);
    const finalAddress = detected || fallbackArea || 'Address not found';
    if (newDeviceAddressInput) newDeviceAddressInput.value = finalAddress;
  };

  if (addDeviceForm && !window.ecoPulseAddFormAttached) {
    addDeviceForm.addEventListener('submit', handleSaveDevice);
    window.ecoPulseAddFormAttached = true;
  }

  locateButton?.addEventListener('click', async () => {
    if (locateInFlight) return;

    locateInFlight = true;
    locateButton.disabled = true;
    locateButton.classList.add('loading');
    shouldAutoFit = false;

    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      locateButton.classList.remove('loading');
      locateButton.disabled = false;
      locateInFlight = false;
      focusFirstStation();
      return;
    }


    const permitted = await ensureGeolocationPermission();
    if (!permitted) {
      locateInFlight = false;
      locateButton.classList.remove('loading');
      locateButton.disabled = false;
      focusFirstStation();
      return;
    }

    attemptingHighAccuracy = true;
    mapInstance.locate({
      setView: false,
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    });
  });

  mapInstance.on('locationfound', async (e) => {
    locateInFlight = false;
    attemptingHighAccuracy = false;
    userLayer.clearLayers();
    const locAccuracy = e.accuracy ? Math.round(e.accuracy) : null;
    mapInstance.flyTo(e.latlng, 16, { duration: 0.6 });

    // Only sync location for existing devices; this will no longer auto-create
    await syncDemoLocation(e.latlng.lat, e.latlng.lng, pendingDeviceCode, pendingDeviceName);
    lastLocatedPoint = { lat: e.latlng.lat, lng: e.latlng.lng };

    let nearest = null;
    let nearestDist = Number.POSITIVE_INFINITY;
    const toRad = (deg) => deg * Math.PI / 180;
    const haversine = (a, b) => {
      const R = 6371e3;
      const dLat = toRad(b.lat - a.lat);
      const dLng = toRad(b.lng - a.lng);
      const la1 = toRad(a.lat);
      const la2 = toRad(b.lat);
      const sinDLat = Math.sin(dLat / 2);
      const sinDLng = Math.sin(dLng / 2);
      const h = sinDLat * sinDLat + Math.cos(la1) * Math.cos(la2) * sinDLng * sinDLng;
      return 2 * R * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
    };

    sensors.forEach(sensor => {
      if (sensor.lat == null || sensor.lng == null) return;
      const dist = haversine({
        lat: e.latlng.lat,
        lng: e.latlng.lng
      }, {
        lat: sensor.lat,
        lng: sensor.lng
      });
      if (dist < nearestDist) {
        nearestDist = dist;
        nearest = sensor;
      }
    });

    const distanceMeters = Number.isFinite(nearestDist) ? Math.round(nearestDist) : null;
    lastLocatedNearest = nearest;

    await recordVisitLog({
      device_code: pendingDeviceCode,
      device_name: pendingDeviceName,
      lat: e.latlng.lat,
      lng: e.latlng.lng,
      accuracy_m: locAccuracy,
      nearest_station_id: nearest?.id ?? null,
      nearest_station_name: nearest?.name ?? null,
      nearest_station_aqi: nearest?.aqi ?? null,
      distance_m: distanceMeters
    });

    let aqiBoxHtml = '<div style="padding:10px;border-radius:10px;border:1px solid #e1e5eb;background:#f6f7f9;">AQI data unavailable.</div>';
    if (nearest) {
      const band = getAqiBand(nearest.aqi);
      const styles = aqiStyleMap[band] || aqiStyleMap.unknown;
      const distanceLabel = nearestDist < 1000 ?
        `${Math.round(nearestDist)} m away` :
        `${(nearestDist / 1000).toFixed(1)} km away`;
      const aqiVal = nearest.aqi != null ? nearest.aqi : '--';
      aqiBoxHtml = `
        <div style="padding:12px;border-radius:12px;border:1px solid ${styles.border};background:${styles.bg};color:${styles.text};">
          <div style="font-size:12px;margin-bottom:4px;">Nearest station: <strong>${nearest.name}</strong></div>
          <div style="display:flex;align-items:center;gap:10px;">
            <div style="padding:10px 12px;border-radius:10px;background:white;color:${styles.text};border:1px solid ${styles.border};min-width:70px;text-align:center;">
              <div style="font-size:11px;color:#6c757d;">AQI</div>
              <div style="font-size:20px;font-weight:700;line-height:1;">${aqiVal}</div>
              <div style="font-size:11px;color:#6c757d;">${band.replace('-', ' ')}</div>
            </div>
            <div style="font-size:12px;color:#6c757d;">
              <div>${nearest.area || 'Unknown area'}</div>
              <div>${distanceLabel}</div>
              <div>Updated ${formatRelative(nearest.updatedAt)}</div>
            </div>
          </div>
        </div>`;
    }

    const popupHtml = `
      <div class="map-popup">
        <strong>${pendingDeviceName || 'You are here'}</strong>
        <div class="text-muted small mb-1">${locAccuracy ? `Accuracy ~${locAccuracy}m` : 'Location locked'}</div>
        <div class="text-primary small mb-2" style="font-family:monospace;">
            ${e.latlng.lat.toFixed(6)}, ${e.latlng.lng.toFixed(6)}
        </div>
        ${aqiBoxHtml}
      </div>
    `;

    L.circleMarker(e.latlng, {
      radius: 8,
      color: '#3498db',
      weight: 2,
      fillColor: '#3498db',
      fillOpacity: 0.4
    }).bindPopup(popupHtml).addTo(userLayer).openPopup();
    L.circle(e.latlng, {
      radius: e.accuracy || 30,
      color: '#3498db',
      weight: 1,
      fillColor: '#3498db',
      fillOpacity: 0.08
    }).addTo(userLayer);
    locateButton?.classList.remove('loading');
    if (locateButton) locateButton.disabled = false;

    // Sync available code before prompting add (fresh fetch)
    await refreshSensorsNow();
    const areaHint = nearest?.areaResolved || nearest?.area || '';
    prefillAddDeviceForm(e.latlng.lat, e.latlng.lng, 'Detecting address...');
    addDeviceModal?.show();
    await updateAddressFromBrowserLocation(e.latlng.lat, e.latlng.lng, areaHint);
  });

  mapInstance.on('locationerror', (err) => {
    // Fallback Logic
    if (attemptingHighAccuracy) {
      console.warn('High accuracy failed, falling back to approximate location...', err);
      attemptingHighAccuracy = false;

      // Notify user (optional, maybe a small toast or just log)
      // alert('Poor GPS signal. Switching to approximate location...');

      mapInstance.stopLocate();
      mapInstance.locate({
        setView: false,
        enableHighAccuracy: false,
        timeout: 30000,
        maximumAge: 0
      });
      return;
    }

    locateInFlight = false;
    const reason = err?.message || lastLocationError || 'Location unavailable';
    console.error('Geolocation error:', reason, err);
    alert(`Unable to get your location: ${reason}\n\nIf location is blocked, allow it for this site and try again.`);
    locateButton?.classList.remove('loading');
    if (locateButton) locateButton.disabled = false;
    focusFirstStation();
  });

  const fetchData = async (manual = false) => {
    if (fetchInFlight) return;
    fetchInFlight = true;

    try {
      refreshButton?.classList.add('loading');
      if (refreshButton) refreshButton.disabled = true;

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s safety net

      const response = await fetch(`${DATA_URL}?cache=${Date.now()}`, {
        cache: 'no-store',
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (!response.ok) throw new Error('Network response was not ok');
      const payload = await response.json();
      const now = Date.now();
      sensors = Array.isArray(payload.sensors) ? payload.sensors : [];
      updateDeviceIndexFromSensors(sensors);
      sensors = sensors.map(sensor => {
        const updatedMs = sensor.updatedAt ? new Date(sensor.updatedAt).getTime() : null;
        const ageMin = updatedMs ? Math.max(0, Math.round((now - updatedMs) / 60000)) : Infinity;
        const isStale = !updatedMs || ageMin > STALE_MINUTES;
        const isHighAqi = sensor.aqi != null && Number(sensor.aqi) > HIGH_AQI_THRESHOLD && !isStale && sensor.status !== 'offline';

        // Derive status from AQI band when fresh and online
        let status = sensor.status;
        if (status !== 'offline' && isStale) {
          status = 'stale';
        } else if (status !== 'offline' && sensor.aqi != null && !isStale) {
          const aqiNum = Number(sensor.aqi);
          if (aqiNum <= 50) status = 'online';
          else if (aqiNum <= 100) status = 'warning'; // moderate
          else if (aqiNum <= 150) status = 'critical'; // unhealthy for SG
          else status = 'critical';
        }

        return {
          ...sensor,
          device_code: sensor.device_code || sensor.code || null,
          lat: sensor.lat != null ? Number(sensor.lat) : null,
          lng: sensor.lng != null ? Number(sensor.lng) : null,
          isStale,
          isHighAqi,
          ageMin,
          status
        };
      });

      await enrichPlaceNames(sensors);

      lastFetchTime = Date.now();
      liveState = 'ok';
      refreshLiveDisplay();
      updateLegendCounts(sensors);
      applyFilters();

      if (manual) {
        refreshButton?.classList.add('btn-success');
        setTimeout(() => refreshButton?.classList.remove('btn-success'), 700);
      }
    } catch (error) {
      console.error('Failed to load map data', error);
      liveState = 'error';
      refreshLiveDisplay();
      if (stationListEl) {
        stationListEl.innerHTML = '<p class="text-danger mb-0">Unable to load map data right now.</p>';
      }
      if (mapElement) {
        const existing = mapElement.querySelector('.map-error');
        if (!existing) {
          const err = document.createElement('div');
          err.className = 'map-error text-danger small';
          err.style.position = 'absolute';
          err.style.bottom = '8px';
          err.style.left = '12px';
          err.style.background = 'rgba(255,255,255,0.85)';
          err.style.padding = '6px 10px';
          err.style.borderRadius = '6px';
          err.style.boxShadow = '0 2px 6px rgba(0,0,0,0.1)';
          err.textContent = 'Map data is slow to respond. Please refresh.';
          mapElement.appendChild(err);
        }
      }
    } finally {
      refreshButton?.classList.remove('loading');
      if (refreshButton) refreshButton.disabled = false;
      fetchInFlight = false;
    }
  };

  filterStatusEl?.addEventListener('change', () => applyFilters(true));
  filterAqiBandEl?.addEventListener('change', () => applyFilters(true));
  filterStaleEl?.addEventListener('change', () => applyFilters(true));
  filterHighAqiEl?.addEventListener('change', () => applyFilters(true));
  refreshButton?.addEventListener('click', () => {
    shouldAutoFit = true;
    fetchData(true);
  });
  addDeviceButton?.addEventListener('click', handleAddDevice);

  refreshLiveDisplay();
  fetchData();
  window.ecoPulseMapState.intervals.push(setInterval(fetchData, AUTO_REFRESH_MS));
  window.ecoPulseMapState.intervals.push(setInterval(refreshLiveDisplay, 1000));
};

// Auto-init if DOMContentLoaded fires (for first load)
document.addEventListener('DOMContentLoaded', window.initMap);
