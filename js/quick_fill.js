document.addEventListener('DOMContentLoaded', function () {
    const quickFill = document.getElementById('quickFillDevice');
    const deviceIdInput = document.getElementById('contactDeviceId');
    if (!quickFill) return;

    quickFill.addEventListener('change', function () {
        const opt = this.options[this.selectedIndex];
        if (!opt.dataset.province) {
            if (deviceIdInput) deviceIdInput.value = '';
            return;
        }

        if (deviceIdInput) {
            deviceIdInput.value = opt.dataset.deviceId || '';
        }

        const targetProv = opt.dataset.province;
        const targetCity = opt.dataset.city;
        const targetBrgyName = opt.dataset.barangayName;

        const provSelect = document.getElementById('contactProvince');
        const citySelect = document.getElementById('contactCity');
        const areaSelect = document.getElementById('contactArea');

        // Helper to find and select option by Text
        function selectByText(selectEl, text) {
            for (let i = 0; i < selectEl.options.length; i++) {
                if (selectEl.options[i].text.trim() === text.trim()) {
                    selectEl.selectedIndex = i;
                    return true;
                }
            }
            return false;
        }

        // 1. Set Province
        if (selectByText(provSelect, targetProv)) {
            provSelect.dispatchEvent(new Event('change'));

            // 2. Load City (Poll for population)
            let cityAttempts = 0;
            const cityInterval = setInterval(() => {
                cityAttempts++;
                if (cityAttempts > 40) clearInterval(cityInterval);

                if (citySelect.options.length > 1 && !citySelect.disabled) {
                    if (selectByText(citySelect, targetCity)) {
                        clearInterval(cityInterval);
                        citySelect.dispatchEvent(new Event('change'));

                        // 3. Load Barangay (Poll for population)
                        let brgyAttempts = 0;
                        const brgyInterval = setInterval(() => {
                            brgyAttempts++;
                            if (brgyAttempts > 40) clearInterval(brgyInterval);

                            if (areaSelect.options.length > 1 && !areaSelect.disabled) {
                                // Select by NAME now (since Selector populates names)
                                if (selectByText(areaSelect, targetBrgyName)) {
                                    clearInterval(brgyInterval);
                                    // Optional: Reset Quick Fill so it can be used again
                                    quickFill.selectedIndex = 0;
                                }
                            }
                        }, 50);
                    }
                }
            }, 50);
        } else {
            console.warn('Province "' + targetProv + '" not found in list.');
        }
    });

    // --- Age Auto-Calculation ---
    const contactBirthday = document.getElementById('contactBirthday');
    const contactAge = document.getElementById('contactAge');

    if (contactBirthday && contactAge) {
        contactBirthday.addEventListener('change', function () {
            const dob = new Date(this.value);
            const today = new Date();
            if (isNaN(dob.getTime())) {
                contactAge.value = 0;
                return;
            }
            let age = today.getFullYear() - dob.getFullYear();
            const m = today.getMonth() - dob.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
                age--;
            }
            contactAge.value = age >= 0 ? age : 0;
        });
    }
});
