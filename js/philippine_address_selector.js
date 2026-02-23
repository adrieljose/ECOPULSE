/**
 * Philippine Address Selector
 * Fetches PSGC data and populates Province -> City/Municipality -> Barangay dropdowns.
 */
const PHILIPPINE_JSON_URL = 'https://raw.githubusercontent.com/flores-jacob/philippine-regions-provinces-cities-municipalities-barangays/master/philippine_provinces_cities_municipalities_and_barangays_2019v2.json';

let phData = null;

async function loadPhData() {
    if (phData) return phData;
    try {
        const response = await fetch(PHILIPPINE_JSON_URL);
        if (!response.ok) throw new Error('Failed to load address data');
        phData = await response.json();
        return phData;
    } catch (error) {
        console.error('Error loading PH data:', error);
        return null;
    }
}

function setupAddressSelector(provinceId, cityId, areaId) {
    const provinceSelect = document.getElementById(provinceId);
    const citySelect = document.getElementById(cityId);
    const areaSelect = document.getElementById(areaId);

    if (!provinceSelect || !citySelect || !areaSelect) return;

    // Load Data
    loadPhData().then(data => {
        if (!data) return;

        // 1. Populate Provinces
        provinceSelect.innerHTML = '<option value="">Select province</option>';
        const provinces = [];

        // Data structure: { "01": { "province_list": { "ILOCOS NORTE": ... } } }
        Object.values(data).forEach(region => {
            if (region.province_list) {
                Object.keys(region.province_list).forEach(p => provinces.push(p));
            }
        });

        provinces.sort().forEach(p => {
            const opt = document.createElement('option');
            opt.value = p;
            opt.textContent = p;
            // Handle pre-selected value (data-selected-province)
            if (provinceSelect.dataset.selectedProvince && provinceSelect.dataset.selectedProvince === p) {
                opt.selected = true;
            }
            provinceSelect.appendChild(opt);
        });

        // Trigger change if pre-selected
        if (provinceSelect.value) {
            provinceSelect.dispatchEvent(new Event('change'));
        }
    });

    // 2. Handle Province Change
    provinceSelect.addEventListener('change', function () {
        const selectedProv = this.value;
        citySelect.innerHTML = '<option value="">Select city/municipality</option>';
        citySelect.disabled = true;
        areaSelect.innerHTML = '<option value="">Select barangay</option>';
        areaSelect.disabled = true;

        if (!selectedProv || !phData) return;

        let foundProvData = null;
        // Find hierarchy
        for (const region of Object.values(phData)) {
            if (region.province_list && region.province_list[selectedProv]) {
                foundProvData = region.province_list[selectedProv];
                break;
            }
        }

        if (foundProvData && foundProvData.municipality_list) {
            const cities = Object.keys(foundProvData.municipality_list).sort();
            cities.forEach(c => {
                const opt = document.createElement('option');
                opt.value = c;
                opt.textContent = c;
                if (citySelect.dataset.selectedCity && citySelect.dataset.selectedCity === c) {
                    opt.selected = true;
                }
                citySelect.appendChild(opt);
            });
            citySelect.disabled = false;
            // Trigger change if pre-selected
            if (citySelect.value) {
                citySelect.dispatchEvent(new Event('change'));
            }
        }
    });

    // 3. Handle City Change
    citySelect.addEventListener('change', function () {
        const selectedProv = provinceSelect.value;
        const selectedCity = this.value;
        areaSelect.innerHTML = '<option value="">Select barangay</option>';
        areaSelect.disabled = true;

        if (!selectedProv || !selectedCity || !phData) return;

        let foundCityData = null;
        for (const region of Object.values(phData)) {
            if (region.province_list && region.province_list[selectedProv]) {
                if (region.province_list[selectedProv].municipality_list[selectedCity]) {
                    foundCityData = region.province_list[selectedProv].municipality_list[selectedCity];
                    break;
                }
            }
        }

        // Check if we should use LOCAL DB Barangays
        let useLocal = false;
        if (typeof LOCAL_BARANGAYS !== 'undefined' && Array.isArray(LOCAL_BARANGAYS) && LOCAL_BARANGAYS.length > 0) {
            // Check if selected city is the "Home City"
            if (typeof HOME_CITY_NAMES !== 'undefined' && HOME_CITY_NAMES.some(n => selectedCity.toLowerCase().includes(n.toLowerCase()))) {
                useLocal = true;
            } else if (selectedCity === 'Himamaylan' || selectedCity === 'Himamaylan City') {
                useLocal = true;
            }
        }

        if (useLocal) {
            // Populate from DB
            LOCAL_BARANGAYS.forEach(b => {
                const opt = document.createElement('option');
                opt.value = b.id; // USE ID!
                opt.textContent = b.name; // USE DB NAME!
                // Handle pre-slection (requires ID match now)
                // Note: Edit form uses IDs for values, so this aligns perfectly.
                areaSelect.appendChild(opt);
            });
            areaSelect.disabled = false;
        } else {
            // Fallback to External Data
            if (foundCityData && foundCityData.barangay_list) {
                const barangays = foundCityData.barangay_list.sort();
                barangays.forEach(b => {
                    const opt = document.createElement('option');
                    opt.value = b; // Use Name as fallback value
                    opt.textContent = b;
                    areaSelect.appendChild(opt);
                });
                areaSelect.disabled = false;
            }
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    setupAddressSelector('contactProvince', 'contactCity', 'contactArea');
    setupAddressSelector('editProvince', 'editCity', 'editArea');
});
