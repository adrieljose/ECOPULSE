window.initReports = function () {
    // Only run if we are on the reports page (check for specific element)
    if (!document.getElementById('reportTabs')) return;

    const makeFilter = (inputId, tbodyId) => {
        const input = document.getElementById(inputId);
        const tbody = document.getElementById(tbodyId);
        if (!input || !tbody) return;

        // Remove existing listener if possible? 
        // Simpler: Just add new one. Old inputs are gone from DOM.
        input.addEventListener('input', () => {
            const term = input.value.toLowerCase();
            tbody.querySelectorAll('tr').forEach(row => {
                row.style.display = row.textContent.toLowerCase().includes(term) ? '' : 'none';
            });
        });
    };

    makeFilter('loginSearch', 'loginTbody');
    makeFilter('smsSearch', 'smsTbody');
    makeFilter('publicSearch', 'publicTbody');
    makeFilter('publicSearch', 'publicTbody');
    makeFilter('aqiSearch', 'aqiTbody');
    makeFilter('activitySearch', 'activityTbody');

    // Smooth tab switching without reload
    const tabButtons = document.querySelectorAll('#reportTabs [data-report-type]');
    const filterTypeInput = document.getElementById('filterType');
    const filtersForm = document.getElementById('reportFilters');
    const typeToId = {
        login: 'cardLogin',
        sms: 'cardSms',
        public: 'cardPublic',
        aqi: 'cardAqi',
        activity: 'cardActivity'
    };
    const pillSlider = document.getElementById('pillSlider');
    const tabsContainer = document.getElementById('reportTabs');

    const showCards = (type) => {
        const dashboard = document.getElementById('dashboardView');

        // Hide everything first
        if (dashboard) dashboard.style.display = 'none';
        Object.values(typeToId).forEach(id => {
            const el = document.getElementById(id);
            if (el) el.style.display = 'none';
        });

        // Show based on type
        if (type === 'all') {
            if (dashboard) dashboard.style.display = 'block';
        } else {
            const id = typeToId[type];
            const el = document.getElementById(id);
            if (el) el.style.display = 'block';
        }
    };

    const setActiveTab = (type) => {
        tabButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.reportType === type) {
                btn.classList.add('active');

                if (pillSlider && tabsContainer) {
                    pillSlider.style.width = btn.offsetWidth + 'px';
                    pillSlider.style.left = btn.offsetLeft + 'px';
                }
            }
        });

        if (filterTypeInput) filterTypeInput.value = type;
        showCards(type);
    };

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const type = btn.dataset.reportType;
            setActiveTab(type);
            if (filterTypeInput) filterTypeInput.value = type;
        });
    });

    // Initial position: snap without animation, then enable smooth transitions
    const currentType = filterTypeInput ? filterTypeInput.value : 'all';
    if (pillSlider) {
        pillSlider.style.transition = 'none';
    }
    setActiveTab(currentType);
    // Enable smooth animation after initial snap
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            if (pillSlider) {
                pillSlider.style.transition = 'left 0.3s cubic-bezier(0.4, 0, 0.2, 1), width 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
            }
        });
    });
};

document.addEventListener('DOMContentLoaded', window.initReports);
