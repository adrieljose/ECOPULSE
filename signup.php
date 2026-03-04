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
$suffix = '';
$email = '';
$birthday = '';
$age = '';
$contact_number = '';
$province = '';
$city = '';
$barangay = '';
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
            overflow-x: hidden;
            overflow-y: auto;
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--text-color);
            padding: clamp(0.8rem, 2vh, 1.75rem);
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

        .auth-shell {
            width: 100%;
            max-width: 980px;
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
            box-shadow: none;
            color: #fff;
            z-index: 2;
        }

        .input-group:focus-within .form-control,
        .input-group:focus-within .form-select,
        .input-group:focus-within .input-group-text,
        .input-group:focus-within .toggle-password {
            background: rgba(255, 255, 255, 0.12);
            border-color: rgba(255, 255, 255, 0.3);
        }

        .form-control.is-invalid,
        .form-select.is-invalid,
        .input-group-text.is-invalid,
        .toggle-password.is-invalid {
            border-color: rgba(248, 113, 113, 0.85) !important;
            z-index: 3;
        }

        .field-error-message {
            color: #fecaca;
            font-size: 0.82rem;
            margin-top: 0.35rem;
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
                margin: 0;
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

        @media (prefers-reduced-motion: reduce) {
            *, *::before, *::after {
                animation: none !important;
                transition: none !important;
            }
        }
    </style>
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
<body>

    <div class="background"></div>

        <div class="container d-flex justify-content-center auth-shell">
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

            <form method="post" id="signupForm" novalidate>
                
                <div class="row g-3">
                    <!-- ACCOUNT & NAME -->
                    <div class="col-md-12">
                        <div class="section-title">Personal Details</div>
                        <div class="row g-3">
                            <div class="col-md-3">
                                <label class="form-label small">First Name</label>
                                <input type="text" class="form-control" id="first_name" name="first_name" value="<?= htmlspecialchars($first_name) ?>" required minlength="2" maxlength="50" pattern="^[A-Za-z][A-Za-z .'-]+$" data-pattern-message="First name should contain letters only." placeholder="e.g. Juan">
                            </div>
                            <div class="col-md-3">
                                <label class="form-label small">Middle Name</label>
                                <input type="text" class="form-control" id="middle_name" name="middle_name" value="<?= htmlspecialchars($middle_name) ?>" maxlength="50" pattern="^[A-Za-z .'-]*$" data-pattern-message="Middle name should contain letters only." placeholder="e.g. Cruz (Optional)">
                            </div>
                            <div class="col-md-3">
                                <label class="form-label small">Last Name</label>
                                <input type="text" class="form-control" id="last_name" name="last_name" value="<?= htmlspecialchars($last_name) ?>" required minlength="2" maxlength="50" pattern="^[A-Za-z][A-Za-z .'-]+$" data-pattern-message="Last name should contain letters only." placeholder="e.g. Santos">
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
                                <input type="text" class="form-control" id="username" name="username" value="<?= htmlspecialchars($username) ?>" required minlength="4" maxlength="32" pattern="^[A-Za-z0-9._-]{4,32}$" data-pattern-message="Username must be 4-32 characters and can include letters, numbers, dots, underscores, and hyphens." placeholder="e.g. johndoe123">
                            </div>
                        </div>
                         <div class="mb-3">
                            <label class="form-label small">Email</label>
                            <div class="input-group">
                                <span class="input-group-text"><i class="fa-solid fa-envelope"></i></span>
                                <input type="email" class="form-control" id="email" name="email" value="<?= htmlspecialchars($email) ?>" required maxlength="120" placeholder="you@example.com">
                            </div>
                        </div>
                        <div class="mb-3">
                            <label class="form-label small">Password</label>
                            <div class="input-group">
                                <span class="input-group-text"><i class="fa-solid fa-lock"></i></span>
                                <input type="password" class="form-control" name="password" id="password" required minlength="8" pattern="^(?=.*[A-Za-z])(?=.*[0-9]).{8,}$" data-pattern-message="Password must be at least 8 characters and include at least 1 letter and 1 number." placeholder="••••••••">
                                <button type="button" class="btn btn-outline-secondary toggle-password" data-target="password" style="border: 1px solid rgba(255,255,255,0.2); color: rgba(255,255,255,0.7);"><i class="fa-solid fa-eye"></i></button>
                            </div>
                             <div class="form-text text-white-50" style="font-size: 0.9rem;">Password must be strong (at least 8 chars, incl. letters & numbers).</div>
                        </div>
                        <div class="mb-3">
                            <label class="form-label small">Confirm Password</label>
                            <div class="input-group">
                                <span class="input-group-text"><i class="fa-solid fa-lock"></i></span>
                                <input type="password" class="form-control" name="confirm_password" id="confirm_password" required minlength="8" placeholder="••••••••">
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
                                <input type="number" class="form-control" id="age" name="age" value="<?= htmlspecialchars($age) ?>" min="0" max="120">
                            </div>
                            <div class="col-12 mb-3">
                                <label class="form-label small">Contact Number</label>
                                <input type="tel" class="form-control" id="contact_number" name="contact_number" value="<?= htmlspecialchars($contact_number) ?>" required inputmode="numeric"
                                       placeholder="0912 345 6789" maxlength="11" pattern="09[0-9]{9}" data-pattern-message="Contact number must be 11 digits and start with 09."
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
                            <input type="text" class="form-control" id="street" name="street" value="<?= htmlspecialchars($street) ?>" required minlength="3" maxlength="120" placeholder="House No., Street">
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
                             <input type="text" class="form-control" id="zip_code" name="zip_code" value="<?= htmlspecialchars($zip_code) ?>" required inputmode="numeric" maxlength="4" pattern="^[0-9]{4}$" data-pattern-message="Zip code must be exactly 4 digits." placeholder="Zip Code">
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
        (() => {
            const signupForm = document.getElementById('signupForm');
            const birthdayInput = document.getElementById('birthday');
            const ageInput = document.getElementById('age');
            const provinceSelect = document.getElementById('province');
            const citySelect = document.getElementById('city');
            const barangaySelect = document.getElementById('barangay');
            const passwordInput = document.getElementById('password');
            const confirmPasswordInput = document.getElementById('confirm_password');
            const selectedValues = {
                province: <?= json_encode($province ?? '') ?>,
                city: <?= json_encode($city ?? '') ?>,
                barangay: <?= json_encode($barangay ?? '') ?>
            };

            const todayISO = new Date().toISOString().split('T')[0];
            if (birthdayInput) birthdayInput.max = todayISO;

            const calculateAge = () => {
                if (!birthdayInput || !ageInput || !birthdayInput.value) return;
                const birthDate = new Date(birthdayInput.value + 'T00:00:00');
                if (Number.isNaN(birthDate.getTime())) return;

                const today = new Date();
                let age = today.getFullYear() - birthDate.getFullYear();
                const monthDiff = today.getMonth() - birthDate.getMonth();
                if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                    age -= 1;
                }
                ageInput.value = Math.max(0, age);
            };

            birthdayInput?.addEventListener('change', calculateAge);
            calculateAge();

            const setSelectMessage = (selectEl, message, disabled = true) => {
                if (!selectEl) return;
                selectEl.innerHTML = `<option value="">${message}</option>`;
                selectEl.disabled = disabled;
            };

            const fetchJson = async (url) => {
                const response = await fetch(url, { cache: 'no-store' });
                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                return response.json();
            };

            const fillSelectOptions = (selectEl, list, placeholder, selectedValue = '', codeKey = 'code') => {
                if (!selectEl) return;
                selectEl.innerHTML = `<option value="">${placeholder}</option>`;
                list.sort((a, b) => String(a.name).localeCompare(String(b.name)));
                list.forEach((item) => {
                    const option = document.createElement('option');
                    option.value = item.name;
                    option.textContent = item.name;
                    if (codeKey && item[codeKey]) option.dataset.code = item[codeKey];
                    if (selectedValue && selectedValue === item.name) option.selected = true;
                    selectEl.appendChild(option);
                });
                selectEl.disabled = false;
            };

            const loadProvinces = async () => {
                if (!provinceSelect) return;
                setSelectMessage(provinceSelect, 'Loading provinces...', true);
                try {
                    const provinces = await fetchJson('https://psgc.gitlab.io/api/provinces/');
                    fillSelectOptions(provinceSelect, provinces, 'Select Province', selectedValues.province);
                    if (selectedValues.province) {
                        await loadCitiesByProvince();
                    }
                } catch (error) {
                    console.error('Error fetching provinces:', error);
                    setSelectMessage(provinceSelect, 'Unable to load provinces. Refresh page.');
                }
            };

            const loadCitiesByProvince = async () => {
                const provinceCode = provinceSelect?.selectedOptions?.[0]?.dataset?.code || '';
                setSelectMessage(citySelect, provinceCode ? 'Loading cities...' : 'Select City', !provinceCode);
                setSelectMessage(barangaySelect, 'Select Barangay', true);
                if (!provinceCode) return;

                try {
                    const cities = await fetchJson(`https://psgc.gitlab.io/api/provinces/${provinceCode}/cities-municipalities/`);
                    fillSelectOptions(citySelect, cities, 'Select City', selectedValues.city);
                    if (selectedValues.city) {
                        await loadBarangaysByCity();
                    }
                } catch (error) {
                    console.error('Error fetching cities:', error);
                    setSelectMessage(citySelect, 'Unable to load cities. Try again.');
                }
            };

            const loadBarangaysByCity = async () => {
                const cityCode = citySelect?.selectedOptions?.[0]?.dataset?.code || '';
                setSelectMessage(barangaySelect, cityCode ? 'Loading barangays...' : 'Select Barangay', !cityCode);
                if (!cityCode) return;

                try {
                    const barangays = await fetchJson(`https://psgc.gitlab.io/api/cities-municipalities/${cityCode}/barangays/`);
                    fillSelectOptions(barangaySelect, barangays, 'Select Barangay', selectedValues.barangay, null);
                } catch (error) {
                    console.error('Error fetching barangays:', error);
                    setSelectMessage(barangaySelect, 'Unable to load barangays. Try again.');
                }
            };

            provinceSelect?.addEventListener('change', async () => {
                selectedValues.city = '';
                selectedValues.barangay = '';
                await loadCitiesByProvince();
            });

            citySelect?.addEventListener('change', async () => {
                selectedValues.barangay = '';
                await loadBarangaysByCity();
            });

            loadProvinces();

            document.querySelectorAll('.toggle-password').forEach((button) => {
                button.addEventListener('click', function () {
                    const targetId = this.getAttribute('data-target');
                    const input = document.getElementById(targetId);
                    const icon = this.querySelector('i');
                    if (!input || !icon) return;
                    if (input.type === 'password') {
                        input.type = 'text';
                        icon.classList.remove('fa-eye');
                        icon.classList.add('fa-eye-slash');
                    } else {
                        input.type = 'password';
                        icon.classList.remove('fa-eye-slash');
                        icon.classList.add('fa-eye');
                    }
                });
            });

            if (!signupForm) return;

            const fieldSelector = 'input, select, textarea';
            const getErrorMessage = (field) => {
                if (field.validity.customError) return field.validationMessage || 'Please check this field.';
                if (field.validity.valueMissing) return 'Please fill out this field.';
                if (field.validity.typeMismatch && field.type === 'email') return 'Please enter a valid email address.';
                if (field.validity.patternMismatch) return field.dataset.patternMessage || field.title || 'Please match the required format.';
                if (field.validity.tooShort) return `Please use at least ${field.minLength} characters.`;
                if (field.validity.tooLong) return `Please use no more than ${field.maxLength} characters.`;
                if (field.validity.rangeUnderflow) return `Please enter at least ${field.min}.`;
                if (field.validity.rangeOverflow) return `Please enter at most ${field.max}.`;
                return 'Please check this field.';
            };

            const renderFieldError = (field, message) => {
                const holder = field.closest('.input-group')?.parentElement || field.parentElement;
                if (!holder) return;
                let errorEl = holder.querySelector('.field-error-message');
                if (!errorEl) {
                    errorEl = document.createElement('div');
                    errorEl.className = 'field-error-message';
                    holder.appendChild(errorEl);
                }
                errorEl.textContent = message || '';
                errorEl.style.display = message ? 'block' : 'none';
                field.classList.toggle('is-invalid', Boolean(message));

                if (field.parentElement.classList.contains('input-group')) {
                    const icon = field.parentElement.querySelector('.input-group-text');
                    const toggle = field.parentElement.querySelector('.toggle-password');
                    if (icon) icon.classList.toggle('is-invalid', Boolean(message));
                    if (toggle) toggle.classList.toggle('is-invalid', Boolean(message));
                }
            };

            const validateField = (field) => {
                if (!field || field.disabled || field.type === 'hidden') return true;
                field.setCustomValidity('');

                if (field === confirmPasswordInput && confirmPasswordInput.value !== passwordInput?.value) {
                    field.setCustomValidity('Passwords do not match.');
                }

                const valid = field.checkValidity();
                renderFieldError(field, valid ? '' : getErrorMessage(field));
                return valid;
            };

            signupForm.querySelectorAll(fieldSelector).forEach((field) => {
                if (field.type === 'hidden') return;
                field.addEventListener('input', () => validateField(field));
                field.addEventListener('blur', () => validateField(field));
                field.addEventListener('change', () => validateField(field));
            });

            signupForm.addEventListener('submit', (event) => {
                let firstInvalid = null;
                let hasError = false;
                signupForm.querySelectorAll(fieldSelector).forEach((field) => {
                    const valid = validateField(field);
                    if (!valid && !firstInvalid) firstInvalid = field;
                    if (!valid) hasError = true;
                });

                if (hasError) {
                    event.preventDefault();
                    firstInvalid?.focus();
                }
            });
        })();
    </script>
    
    <!-- AOS Script -->
    <script src="https://unpkg.com/aos@2.3.1/dist/aos.js"></script>
    <script>
        AOS.init({
            once: true,
            duration: 600,
            disable: window.matchMedia('(prefers-reduced-motion: reduce)').matches
        });
    </script>

</body>
</html>
