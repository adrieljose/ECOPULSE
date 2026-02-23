<?php
require_once __DIR__ . '/session_bootstrap.php';
require_once __DIR__ . '/db.php';

$errors = [];
$successMessage = '';

// Initialize variables to keep form data on error
$username = '';
$first_name = '';
$middle_name = '';
$last_name = '';
$email = '';
$birthday = '';
$age = '';
$contact_number = '';
$street = '';
$zip_code = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $first_name = trim($_POST['first_name'] ?? '');
    $middle_name = trim($_POST['middle_name'] ?? '');
    $last_name = trim($_POST['last_name'] ?? '');
    $suffix = trim($_POST['suffix'] ?? ''); // Added suffix
    
    $username = trim($_POST['username'] ?? ''); // Added
    $email = trim($_POST['email'] ?? '');
    $password = $_POST['password'] ?? '';
    $confirm_password = $_POST['confirm_password'] ?? '';
    
    $birthday = $_POST['birthday'] ?? '';
    $age = $_POST['age'] ?? '';
    $contact_number = trim($_POST['contact_number'] ?? '');
    $province = $_POST['province'] ?? '';
    $city = $_POST['city'] ?? '';
    $barangay = $_POST['barangay'] ?? '';
    $street = trim($_POST['street'] ?? '');
    $zip_code = trim($_POST['zip_code'] ?? '');

    // Validation
    if (empty($first_name) || empty($last_name) || empty($username) || empty($email) || empty($password) || empty($birthday) || empty($contact_number) || empty($province) || empty($city) || empty($barangay)) {
        $errors[] = 'Please fill in all required fields (Middle Name is optional).';
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors[] = 'Please enter a valid email address.';
    } elseif ($password !== $confirm_password) {
        $errors[] = 'Passwords do not match.';
    } elseif (!preg_match('/^(?=.*[A-Za-z])(?=.*\\d).{8,}$/', $password)) {
        $errors[] = 'Password must be at least 8 characters and include letters and numbers.';
    } elseif (!preg_match('/^09\\d{9}$/', $contact_number)) {
        $errors[] = 'Contact number must be 11 digits and start with 09.';
    } else {
        try {
            $pdo = db();
            // Check if email or username exists
            $stmt = $pdo->prepare('SELECT COUNT(*) FROM users WHERE email = :email OR username = :username');
            $stmt->execute([':email' => $email, ':username' => $username]);
            if ($stmt->fetchColumn() > 0) {
                $errors[] = 'Email or Username is already registered. Please log in.';
            }

            if (empty($errors)) {
                // Generate OTP
                $otp = random_int(100000, 999999);
                $_SESSION['signup_data'] = [
                    'username' => $username,
                    'first_name' => $first_name,
                    'middle_name' => $middle_name,
                    'last_name' => $last_name,
                    'suffix' => $suffix,
                    'email' => $email,
                    'password' => $password, 
                    'birthday' => $birthday,
                    'age' => $age,
                    'contact_number' => $contact_number,
                    'province' => $province,
                    'city' => $city,
                    'barangay' => $barangay,
                    'street' => $street,
                    'zip_code' => $zip_code
                ];
                $_SESSION['otp'] = $otp;
                $_SESSION['otp_expiry'] = time() + 300; // 5 minutes

                // Send OTP
                require_once __DIR__ . '/lib/sms_sender.php';
                $message = "Your OTP verification code is: $otp";
                $result = send_sms_alert($contact_number, $message);

                if ($result['success'] ?? false) {
                    header('Location: verify_otp.php');
                    exit;
                } else {
                     // Debugging: Show detailed error from provider
                     $debugInfo = $result['providerMessage'] ?? '';
                     if (is_array($debugInfo)) {
                         $debugInfo = json_encode($debugInfo);
                     }
                     if (!$debugInfo) {
                         $debugInfo = json_encode($result);
                     }
                     $errors[] = 'Failed to send OTP. Provider Error: ' . htmlspecialchars((string)$debugInfo);
                }
            }
        } catch (Throwable $e) {
            $errors[] = 'Registration failed: ' . $e->getMessage();
        }
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Sign Up | EcoPulse</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <!-- Bootstrap 5 -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css" />
    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet">
     <!-- AOS Animation CSS -->
    <link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet">

    <style>
        :root {
            --primary-color: #204f79;
            --text-color: #f1f5f9;
            --glass-bg: rgba(255, 255, 255, 0.05);
            --glass-border: rgba(255, 255, 255, 0.1);
            --input-bg: rgba(255, 255, 255, 0.07);
        }

        body {
            font-family: 'Outfit', sans-serif;
            background: #132f48;
            margin: 0;
            min-height: 100vh;
            overflow-y: auto;
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--text-color);
            padding: 2rem 0;
        }

        /* Animated Gradient Background */
        .background {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -1;
            background: linear-gradient(-45deg, #0a1623, #132f48, #204f79, #0f2f4a);
            background-size: 400% 400%;
            animation: gradientBG 15s ease infinite;
        }

        @keyframes gradientBG {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }

        .background::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: radial-gradient(circle at center, transparent 0%, rgba(10, 22, 35, 0.4) 100%);
        }

        /* Glassmorphism Card (Wider for 2 columns) */
        .login-card {
            background: rgba(255, 255, 255, 0.08);
            border: 1px solid rgba(255, 255, 255, 0.15);
            border-radius: 20px;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
            color: white;
            padding: 3.5rem;
            width: 100%;
            max-width: 900px;
            animation: fadeIn 0.6s ease-out;
        }

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .login-logo img {
            max-height: 160px;
            margin-bottom: -1.5rem;
            filter: drop-shadow(0 0 6px rgba(255, 255, 255, 0.2));
        }

        /* Input Styling to match Login Page (Glassmorphism) */
        .form-control, .form-select, .input-group-text {
            background: var(--input-bg);
            border: 1px solid var(--glass-border);
            color: #fff;
            padding: 0.75rem 1rem;
        }
        
        .form-control:focus, .form-select:focus {
            background: rgba(255, 255, 255, 0.12);
            border-color: rgba(255, 255, 255, 0.3);
            box-shadow: none;
            color: #fff;
        }

        .form-control:disabled, .form-select:disabled {
            background: rgba(255, 255, 255, 0.03); 
            color: rgba(255, 255, 255, 0.5);
            border-color: rgba(255, 255, 255, 0.05);
            cursor: not-allowed;
        }

        .form-control::placeholder { 
            color: rgba(255, 255, 255, 0.4); 
        }

        .input-group-text {
            border-right: none;
            color: rgba(255, 255, 255, 0.7);
        }
        
        .form-control {
            border-left: none;
        }
        
        /* Dark dropdown options */
        .form-select option {
            background-color: #132f48;
            color: white;
        }

        .btn-success {
            background: linear-gradient(135deg, #20bf55 0%, #01baef 100%);
            border: 1px solid transparent;
            border-radius: 10px;
            padding: 0.8rem;
            font-weight: 600;
            background-size: 200% 200%;
            transition: background-position 0.35s ease, transform 0.2s ease, box-shadow 0.2s ease;
        }
        .btn-success:hover, .btn-success:focus {
            background-position: 100% 0;
            transform: translateY(-1px);
            box-shadow: 0 10px 24px rgba(1, 186, 239, 0.25);
        }
        .back-link {
            display: inline-flex;
            align-items: center;
            gap: 0.4rem;
            padding: 0.4rem 0.9rem;
            color: rgba(255, 255, 255, 0.85);
            border: 1px solid rgba(255, 255, 255, 0.25);
            border-radius: 999px;
            background: rgba(255, 255, 255, 0.08);
            text-decoration: none;
            transition: all 0.2s ease;
        }
        .back-link:hover {
            color: #fff;
            border-color: rgba(255, 255, 255, 0.6);
            background: rgba(255, 255, 255, 0.15);
            text-decoration: none;
        }
        
        .section-title {
            font-size: 0.85rem;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: rgba(255,255,255,0.6);
            margin-bottom: 1.5rem;
            border-bottom: 1px solid rgba(255,255,255,0.1);
            padding-bottom: 0.5rem;
        }
        .edge-glow {
            position: relative;
            z-index: 0;
            overflow: hidden;
        }
        .edge-glow::before {
            content: '';
            position: absolute;
            inset: -2px;
            border-radius: inherit;
            background: conic-gradient(from 45deg, #20bf55, #01baef, #20bf55);
            filter: blur(4px);
            opacity: 0;
            transition: opacity 0.25s ease;
            z-index: -1;
            pointer-events: none;
            -webkit-mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
            mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
            -webkit-mask-composite: xor;
            mask-composite: exclude;
        }
        
        /* FIX: White Arrow for Select Dropdowns */
        .form-select {
            background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%23ffffff' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M2 5l6 6 6-6'/%3e%3c/svg%3e") !important;
            background-repeat: no-repeat !important;
            background-position: right 0.75rem center !important;
            background-size: 16px 12px !important;
        }

        /* Mobile Responsiveness */
        @media (max-width: 768px) {
            .login-logo img {
                max-height: 100px !important;
                margin-bottom: -1rem;
            }
            
            .login-card {
                padding: 2rem 1.5rem !important;
                margin: 1rem;
                max-width: 100% !important;
            }
            
            h2 {
                font-size: 1.75rem !important;
            }
            
            /* Stack form fields vertically with spacing */
            .row .col-md-6, .row .col-md-4 {
                margin-bottom: 0.75rem;
            }
            
            .form-control, .form-select, .input-group-text {
                padding: 0.75rem 0.875rem;
                font-size: 16px; /* Prevents iOS zoom */
            }
            
            .btn-primary {
                padding: 0.875rem;
            }
            
            .back-link {
                font-size: 0.9rem;
                padding: 0.5rem 0.75rem;
            }
        }

        @media (max-width: 480px) {
            .login-logo img {
                max-height: 80px !important;
            }
            
            .login-card {
                padding: 1.5rem 1rem !important;
            }
            
            h2 {
                font-size: 1.5rem !important;
            }
            
            .back-link {
                font-size: 0.85rem;
                padding: 0.4rem 0.6rem;
            }
        }
    </style>
</head>
<body>

    <div class="background"></div>

        <div class="container d-flex justify-content-center">
        <div class="login-card edge-glow" data-aos="fade-up" data-aos-duration="1000">
            <div class="mb-3 text-start">
                <a href="login.php" class="back-link edge-glow">
                    <i class="fa-solid fa-arrow-left"></i>
                    <span>Back to Login</span>
                </a>
            </div>
            <div class="text-center mb-4">
                <div class="login-logo mb-0">
                    <img src="img/ecopulse_logo_final.png" alt="EcoPulse">
                </div>
                <h2 class="fw-bold fs-3">Join EcoPulse</h2>
            </div>

            <?php if (!empty($errors)): ?>
                <div class="alert alert-danger py-2 px-3 shadow-sm border-0 bg-danger bg-opacity-75 text-white mb-3" data-aos="shake">
                    <?php foreach ($errors as $err): ?>
                        <small class="d-block"><i class="fa-solid fa-circle-exclamation me-2"></i> <?= htmlspecialchars($err) ?></small>
                    <?php endforeach; ?>
                </div>
            <?php endif; ?>

            <form method="post" id="signupForm">
                
                <div class="row g-3">
                    <!-- ACCOUNT & NAME -->
                    <div class="col-md-12">
                        <div class="section-title">Personal Details</div>
                        <div class="row g-3">
                            <div class="col-md-3">
                                <label class="form-label small">First Name</label>
                                <input type="text" class="form-control" name="first_name" value="<?= htmlspecialchars($first_name) ?>" required placeholder="e.g. Juan">
                            </div>
                            <div class="col-md-3">
                                <label class="form-label small">Middle Name</label>
                                <input type="text" class="form-control" name="middle_name" value="<?= htmlspecialchars($middle_name) ?>" placeholder="e.g. Cruz (Optional)">
                            </div>
                            <div class="col-md-3">
                                <label class="form-label small">Last Name</label>
                                <input type="text" class="form-control" name="last_name" value="<?= htmlspecialchars($last_name) ?>" required placeholder="e.g. Santos">
                            </div>
                            <div class="col-md-3">
                                <label class="form-label small">Suffix</label>
                                <select class="form-select" name="suffix">
                                    <option value="" <?= ($suffix ?? '') === '' ? 'selected' : '' ?>>None</option>
                                    <option value="Jr." <?= ($suffix ?? '') === 'Jr.' ? 'selected' : '' ?>>Jr.</option>
                                    <option value="Sr." <?= ($suffix ?? '') === 'Sr.' ? 'selected' : '' ?>>Sr.</option>
                                    <option value="II" <?= ($suffix ?? '') === 'II' ? 'selected' : '' ?>>II</option>
                                    <option value="III" <?= ($suffix ?? '') === 'III' ? 'selected' : '' ?>>III</option>
                                    <option value="IV" <?= ($suffix ?? '') === 'IV' ? 'selected' : '' ?>>IV</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div class="col-md-6 mt-4">
                        <div class="section-title">Account Info</div>
                        <div class="mb-3">
                            <label class="form-label small">Username</label>
                            <div class="input-group">
                                <span class="input-group-text"><i class="fa-solid fa-user"></i></span>
                                <input type="text" class="form-control" name="username" value="<?= htmlspecialchars($username) ?>" required placeholder="e.g. johndoe123">
                            </div>
                        </div>
                         <div class="mb-3">
                            <label class="form-label small">Email</label>
                            <div class="input-group">
                                <span class="input-group-text"><i class="fa-solid fa-envelope"></i></span>
                                <input type="email" class="form-control" name="email" value="<?= htmlspecialchars($email) ?>" required placeholder="you@example.com">
                            </div>
                        </div>
                        <div class="mb-3">
                            <label class="form-label small">Password</label>
                            <div class="input-group">
                                <span class="input-group-text"><i class="fa-solid fa-lock"></i></span>
                                <input type="password" class="form-control" name="password" id="password" required placeholder="••••••••">
                                <button type="button" class="btn btn-outline-secondary toggle-password" data-target="password" style="border: 1px solid rgba(255,255,255,0.2); color: rgba(255,255,255,0.7);"><i class="fa-solid fa-eye"></i></button>
                            </div>
                             <div class="form-text text-white-50" style="font-size: 0.9rem;">Password must be strong (at least 8 chars, incl. letters & numbers).</div>
                        </div>
                        <div class="mb-3">
                            <label class="form-label small">Confirm Password</label>
                            <div class="input-group">
                                <span class="input-group-text"><i class="fa-solid fa-lock"></i></span>
                                <input type="password" class="form-control" name="confirm_password" id="confirm_password" required placeholder="••••••••">
                                <button type="button" class="btn btn-outline-secondary toggle-password" data-target="confirm_password" style="border: 1px solid rgba(255,255,255,0.2); color: rgba(255,255,255,0.7);"><i class="fa-solid fa-eye"></i></button>
                            </div>
                        </div>
                    </div>
                    
                    <div class="col-md-6 mt-4">
                        <div class="section-title">Other Details</div>
                        <div class="row">
                            <div class="col-6 mb-3">
                                <label class="form-label small">Birthday</label>
                                <input type="date" class="form-control" id="birthday" name="birthday" value="<?= htmlspecialchars($birthday) ?>" required>
                            </div>
                            <div class="col-6 mb-3">
                                <label class="form-label small">Age</label>
                                <input type="number" class="form-control" id="age" name="age" value="<?= htmlspecialchars($age) ?>">
                            </div>
                            <div class="col-12 mb-3">
                                <label class="form-label small">Contact Number</label>
                                <input type="tel" class="form-control" name="contact_number" value="<?= htmlspecialchars($contact_number) ?>" required 
                                       placeholder="0912 345 6789" maxlength="11" pattern="09[0-9]{9}" 
                                       oninput="this.value = this.value.replace(/[^0-9]/g, ''); if(this.value.length > 2 && !this.value.startsWith('09')) { this.value = '09' + this.value.substring(2); } if(!this.value.startsWith('0')) { this.value = '0' + this.value; }">
                            </div>
                        </div>
                    </div>
                </div>

                <div class="section-title mt-4">Address</div>
                <div class="row g-3">
                    <div class="col-md-6">
                        <label class="form-label small">Province</label>
                        <div class="input-group">
                            <span class="input-group-text"><i class="fa-solid fa-map"></i></span>
                            <select class="form-select" id="province" name="province" required>
                                <option value="">Select Province</option>
                                <!-- JS will populate -->
                            </select>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <label class="form-label small">City / Municipality</label>
                        <div class="input-group">
                            <span class="input-group-text"><i class="fa-solid fa-city"></i></span>
                            <select class="form-select" id="city" name="city" required disabled>
                                <option value="">Select City</option>
                                <!-- JS will populate -->
                            </select>
                        </div>
                    </div>
                    <div class="col-md-12">
                        <label class="form-label small">Street / House No.</label>
                        <div class="input-group">
                            <span class="input-group-text"><i class="fa-solid fa-home"></i></span>
                            <input type="text" class="form-control" name="street" value="<?= htmlspecialchars($street) ?>" required placeholder="House No., Street">
                        </div>
                    </div>
                    <div class="col-md-8">
                        <label class="form-label small">Barangay</label>
                        <div class="input-group">
                            <span class="input-group-text"><i class="fa-solid fa-location-crosshairs"></i></span>
                            <select class="form-select" id="barangay" name="barangay" required disabled>
                                <option value="">Select Barangay</option>
                                <!-- JS will populate -->
                            </select>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <label class="form-label small">Zip Code</label>
                         <div class="input-group">
                            <span class="input-group-text"><i class="fa-solid fa-map-pin"></i></span>
                             <input type="text" class="form-control" name="zip_code" value="<?= htmlspecialchars($zip_code) ?>" required placeholder="Zip Code">
                         </div>
                    </div>
                </div>

                <div class="d-grid gap-2 mt-3">
                    <button type="submit" class="btn btn-success text-white shadow-lg">REGISTER</button>
                </div>

                <div class="text-center mt-3">
                    <small style="color: rgba(255,255,255,0.7);">Already have an account? <a href="login.php" class="text-info text-decoration-none fw-bold">Log In</a></small>
                </div>
            </form>
        </div>
    </div>

    <!-- Data Fetching Script -->
    <script>
        // --- Age Calculation ---
        const birthdayInput = document.getElementById('birthday');
        const ageInput = document.getElementById('age');

        birthdayInput.addEventListener('change', function() {
            const birthDate = new Date(this.value);
            const today = new Date();
            let age = today.getFullYear() - birthDate.getFullYear();
            const m = today.getMonth() - birthDate.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
            ageInput.value = age >= 0 ? age : 0;
        });

        // --- Address Dropdowns (Using PSGC API) ---
        const provinceSelect = document.getElementById('province');
        const citySelect = document.getElementById('city');
        const barangaySelect = document.getElementById('barangay'); // Added

        // Fetch Provinces
        fetch('https://psgc.gitlab.io/api/provinces/')
            .then(response => response.json())
            .then(data => {
                data.sort((a, b) => a.name.localeCompare(b.name));
                data.forEach(province => {
                    const option = document.createElement('option');
                    option.value = province.name; 
                    option.textContent = province.name;
                    option.dataset.code = province.code;
                    provinceSelect.appendChild(option);
                });
            })
            .catch(err => console.error('Error fetching provinces:', err));

        // On Province Change -> Fetch Cities
        provinceSelect.addEventListener('change', function() {
            const selectedOption = this.options[this.selectedIndex];
            const provinceCode = selectedOption.dataset.code;

            citySelect.innerHTML = '<option value="">Select City</option>';
            citySelect.disabled = true;
            barangaySelect.innerHTML = '<option value="">Select Barangay</option>'; // Reset Barangay
            barangaySelect.disabled = true;

            if (provinceCode) {
                citySelect.disabled = false;
                citySelect.innerHTML = '<option value="">Loading...</option>';
                
                fetch(`https://psgc.gitlab.io/api/provinces/${provinceCode}/cities-municipalities/`)
                    .then(response => response.json())
                    .then(data => {
                         citySelect.innerHTML = '<option value="">Select City</option>';
                         data.sort((a, b) => a.name.localeCompare(b.name));
                         data.forEach(city => {
                            const option = document.createElement('option');
                            option.value = city.name;
                            option.textContent = city.name;
                            option.dataset.code = city.code; // Store City Code
                            citySelect.appendChild(option);
                         });
                    })
                    .catch(err => {
                        console.error('Error fetching cities:', err);
                        citySelect.innerHTML = '<option value="">Error loading cities</option>';
                    });
            }
        });

        // On City Change -> Fetch Barangays (NEW)
        citySelect.addEventListener('change', function() {
            const selectedOption = this.options[this.selectedIndex];
            const cityCode = selectedOption.dataset.code;

            barangaySelect.innerHTML = '<option value="">Select Barangay</option>';
            barangaySelect.disabled = true;

            if (cityCode) {
                barangaySelect.disabled = false;
                barangaySelect.innerHTML = '<option value="">Loading...</option>';

                // Try fetching fetch via cities or municipalities endpoint (API can be tricky, using general logic)
                // PSGC API typically works with /cities-municipalities/{code}/barangays/ OR /cities/{code}/barangays OR /municipalities/{code}/barangays
                // But the ID is unique so we can try the direct endpoint or the sub-endpoint.
                // Best path based on docs: https://psgc.gitlab.io/api/cities-municipalities/{code}/barangays/
                
                fetch(`https://psgc.gitlab.io/api/cities-municipalities/${cityCode}/barangays/`)
                    .then(response => response.json())
                    .then(data => {
                        barangaySelect.innerHTML = '<option value="">Select Barangay</option>';
                        data.sort((a, b) => a.name.localeCompare(b.name));
                        data.forEach(brgy => {
                            const option = document.createElement('option');
                            option.value = brgy.name;
                            option.textContent = brgy.name;
                            barangaySelect.appendChild(option);
                        });
                    })
                    .catch(err => {
                        console.error('Error fetching barangays:', err);
                        barangaySelect.innerHTML = '<option value="">Error loading barangays</option>';
                    });
            }
        });
        // --- Password Toggle ---
        document.querySelectorAll('.toggle-password').forEach(button => {
            button.addEventListener('click', function() {
                const targetId = this.getAttribute('data-target');
                const passwordInput = document.getElementById(targetId);
                const icon = this.querySelector('i');
                
                if (passwordInput.type === 'password') {
                    passwordInput.type = 'text';
                    icon.classList.remove('fa-eye');
                    icon.classList.add('fa-eye-slash');
                } else {
                    passwordInput.type = 'password';
                    icon.classList.remove('fa-eye-slash');
                    icon.classList.add('fa-eye');
                }
            });
        });
    </script>
    
    <!-- AOS Script -->
    <script src="https://unpkg.com/aos@2.3.1/dist/aos.js"></script>
    <script>
        AOS.init();
    </script>

</body>
</html>
