<?php
require_once __DIR__ . '/session_bootstrap.php';

/**
 * Get client IP address.
 */
function get_client_ip()
{
    $keys = [
        'HTTP_CLIENT_IP',
        'HTTP_X_FORWARDED_FOR',
        'HTTP_X_FORWARDED',
        'HTTP_X_CLUSTER_CLIENT_IP',
        'HTTP_FORWARDED_FOR',
        'HTTP_FORWARDED',
        'REMOTE_ADDR'
    ];
    foreach ($keys as $key) {
        if (!empty($_SERVER[$key])) {
            $ipList = explode(',', $_SERVER[$key]);
            $ip = trim($ipList[0]);
            return ($ip === '::1') ? '127.0.0.1' : $ip;
        }
    }
    return '0.0.0.0';
}

/**
 * Log admin login attempt.
 */
function log_admin_login(PDO $pdo, $adminId, string $username, string $ip, string $status): void
{
    try {
        $stmt = $pdo->prepare(
            "INSERT INTO admin_login_history (admin_id, username, ip_address, status)
             VALUES (:admin_id, :username, :ip_address, :status)"
        );
        $stmt->execute([':admin_id' => $adminId, ':username' => $username, ':ip_address' => $ip, ':status' => $status]);
    } catch (Throwable $e) {
    }
}

if (isset($_SESSION['admin'])) {
    header('Location: index.php');
    exit;
}


require_once __DIR__ . '/db.php';

$errors = [];
$username = '';
$remember = false;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = trim($_POST['username'] ?? '');
    $password = $_POST['password'] ?? '';
    $remember = isset($_POST['remember']);

    if ($username === '' || $password === '') {
        $errors[] = 'Please enter both username and password.';
    } else {
        try {
            $pdo = db();
            $pdo = db();
            $stmt = $pdo->prepare('SELECT id, username, password_hash, status, default_device_id FROM admins WHERE username = :username LIMIT 1');
            $stmt->execute([':username' => $username]);
            $admin = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($admin && password_verify($password, $admin['password_hash'])) {
                if (($admin['status'] ?? 'active') !== 'active') {
                    $errors[] = 'This admin account is inactive. Please contact the master admin.';
                    log_admin_login($pdo, (int) $admin['id'], $username, get_client_ip(), 'Inactive');
                    throw new Exception('Inactive admin');
                }
                session_regenerate_id(true);
                $_SESSION['admin'] = (int) $admin['id'];
                $_SESSION['admin'] = (int) $admin['id'];
                $_SESSION['username'] = $admin['username'];
                $_SESSION['default_device_id'] = $admin['default_device_id'];
                log_admin_login($pdo, (int) $admin['id'], $username, get_client_ip(), 'Success');

                // Log Activity (New)
                require_once __DIR__ . '/lib/activity_logger.php';
                logActivity($pdo, 'admin', (int)$admin['id'], 'Login', 'Admin logged in successfully', 'Auth');

                header('Location: index.php');
                exit;
            }

            // Check if it is a Public User
            $stmt = $pdo->prepare('SELECT id, username, password_hash, status, default_device_id FROM users WHERE username = :input OR email = :input LIMIT 1');
            $stmt->execute([':input' => $username]);
            $user = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($user && password_verify($password, $user['password_hash'])) {
                if (($user['status'] ?? 'active') !== 'active') {
                    $errors[] = 'This user account is inactive. Please contact support.';
                    throw new Exception('Inactive user');
                }
                session_regenerate_id(true);
                $_SESSION['user'] = (int) $user['id'];
                $_SESSION['user'] = (int) $user['id'];
                $_SESSION['username'] = $user['username'];
                $_SESSION['default_device_id'] = $user['default_device_id'];
                
                // Log User Login
                try {
                    $stmtLog = $pdo->prepare("INSERT INTO user_login_history (user_id, username, action, ip_address) VALUES (:uid, :uname, 'login', :ip)");
                    $stmtLog->execute([
                        ':uid' => (int) $user['id'], 
                        ':uname' => $user['username'],
                        ':ip' => get_client_ip()
                    ]);
                } catch (Throwable $e) { /* ignore log error */ }

                // Log Activity (New)
                require_once __DIR__ . '/lib/activity_logger.php';
                logActivity($pdo, 'user', (int)$user['id'], 'Login', 'User logged in successfully', 'Auth');

                header('Location: index.php');
                exit;
            }

            log_admin_login($pdo, $admin['id'] ?? null, $username, get_client_ip(), 'Failed');
            $errors[] = 'Invalid username/email or password.';
        } catch (Throwable $e) {
            $errors[] = 'An error occurred. Please try again later.';
        }
    }
}
$from = $_GET['from'] ?? 'dashboard';
$userSuccessMsg = '';
if (isset($_SESSION['user_success'])) {
    $userSuccessMsg = $_SESSION['user_success'];
    unset($_SESSION['user_success']);
}
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>Login | EcoPulse</title>
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
            --primary-color: #2a7de1;
            --accent-color:  #5aa8f0;
            --text-color:    #e8f1fc;
            --card-bg:       rgba(10, 25, 60, 0.70);
            --card-border:   rgba(80, 150, 220, 0.25);
            --input-bg:      rgba(255, 255, 255, 0.08);
            --input-border:  rgba(100, 170, 230, 0.30);
        }

        body {
            font-family: 'Outfit', sans-serif;
            background: #0d1b3e;
            margin: 0;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--text-color);
            position: relative;
            overflow-x: hidden;
            overflow-y: auto;
            padding: clamp(0.8rem, 2vh, 1.75rem);
        }

        /* ── Background layer ── */
        #eco-canvas {
            position: fixed;
            inset: 0;
            width: 100%;
            height: 100%;
            z-index: 0;
            pointer-events: none;
            display: block;
        }

        /* Static eco fallback (shown if WebGL unavailable) */
        #eco-fallback {
            display: none;
            position: fixed;
            inset: 0;
            z-index: 0;
            background:
                radial-gradient(ellipse at 15% 25%, rgba(42,125,225,0.4) 0%, transparent 55%),
                radial-gradient(ellipse at 85% 75%, rgba(20,80,180,0.35) 0%, transparent 50%),
                linear-gradient(160deg, #0d1b3e 0%, #102040 55%, #0a2055 100%);
            background-size: cover;
        }

        /* Dim overlay for card depth separation */
        #eco-overlay {
            position: fixed;
            inset: 0;
            z-index: 1;
            background: rgba(5, 15, 40, 0.25);
            backdrop-filter: none;
            pointer-events: none;
        }

        .login-card {
            background: var(--card-bg);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: 1px solid var(--card-border);
            border-radius: 24px;
            box-shadow:
                0 0 0 1px rgba(80, 150, 220, 0.1),
                0 12px 48px rgba(0, 10, 40, 0.55),
                0 2px 8px rgba(0,0,0,0.3);
            padding: 3rem 2.5rem;
            width: 100%;
            max-width: 450px;
            position: relative;
            z-index: 10;
        }

        .auth-shell {
            width: 100%;
            max-width: 520px;
            position: relative;
            z-index: 10;
        }

        .login-logo img {
            height: 200px;
            filter: drop-shadow(0 4px 12px rgba(42, 125, 225, 0.35));
            margin-bottom: -2rem;
        }

        h2 {
            font-weight: 700;
            letter-spacing: -0.5px;
            margin-bottom: 0.25rem;
            color: #e8f1fc;
        }

        .text-white-50 {
            color: rgba(180, 210, 250, 0.70) !important;
            font-weight: 400;
        }

        .form-control, .form-select, .input-group-text, .toggle-password {
            background: var(--input-bg);
            border: 1px solid var(--input-border);
            color: #e8f1fc;
            padding: 0.9rem 1rem;
            font-size: 0.95rem;
            transition: all 0.2s ease;
        }

        .input-group-text {
            border-right: none;
            border-top-left-radius: 12px;
            border-bottom-left-radius: 12px;
            color: rgba(150, 195, 240, 0.8);
        }

        .form-control {
            border-left: none;
            border-radius: 0; 
        }
        
        .form-control:not(:last-child) {
            border-right: none;
        }
        
        .input-group > .form-control {
            border-radius: 0 12px 12px 0;
        }
        
        .input-group > .input-group-text + .form-control:not(:last-child) {
            border-radius: 0;
        }
        
        .toggle-password {
            border-left: none;
            border-top-right-radius: 12px;
            border-bottom-right-radius: 12px;
            color: rgba(150, 195, 240, 0.7);
            cursor: pointer;
        }
        
        .toggle-password:hover {
            color: #fff;
            background: rgba(255,255,255,0.1);
        }

        .form-control:focus {
            box-shadow: none;
            color: #e8f1fc;
            z-index: 2;
        }

        .input-group:focus-within .form-control,
        .input-group:focus-within .input-group-text,
        .input-group:focus-within .toggle-password {
            background: rgba(255, 255, 255, 0.13);
            border-color: rgba(80, 160, 230, 0.65);
        }

        .form-control.is-invalid,
        .input-group-text.is-invalid,
        .toggle-password.is-invalid {
            border-color: rgba(248, 113, 113, 0.85) !important;
            z-index: 3;
        }

        .field-error-message {
            color: #fca5a5;
            font-size: 0.82rem;
            margin-top: 0.4rem;
        }

        .form-control::placeholder {
            color: rgba(140, 185, 235, 0.45);
        }

        .btn-primary {
            background: linear-gradient(135deg, #1a5cbf 0%, #3a8de0 100%);
            color: #fff;
            border: none;
            border-radius: 12px;
            padding: 1rem;
            font-weight: 700;
            font-size: 1rem;
            letter-spacing: 0.3px;
            transition: all 0.2s ease;
            box-shadow: 0 4px 18px rgba(42, 125, 225, 0.45);
        }

        .btn-primary:hover {
            background: linear-gradient(135deg, #1449a0 0%, #2a7dd4 100%);
            transform: translateY(-2px);
            box-shadow: 0 8px 24px rgba(42, 125, 225, 0.60);
            color: #fff;
        }

        .btn-outline-light {
            border-radius: 12px;
            color: rgba(150,200,250,0.8);
            border-color: rgba(80,150,220,0.3);
            font-weight: 500;
        }
        
        .btn-outline-light:hover {
            background: rgba(80,150,220,0.1);
            color: #fff;
            border-color: rgba(80,150,220,0.6);
        }

        .form-check-input {
            background-color: rgba(255,255,255,0.1);
            border-color: rgba(80,150,220,0.4);
            width: 1.2em;
            height: 1.2em;
        }
        
        .form-check-input:checked {
            background-color: var(--primary-color);
            border-color: var(--primary-color);
        }

        a { color: var(--accent-color); transition: color 0.2s; text-decoration: none; }
        a:hover { color: #fff; }

        .alert {
            background: rgba(239, 68, 68, 0.12);
            backdrop-filter: blur(8px);
            border: 1px solid rgba(239, 68, 68, 0.25);
            color: #fca5a5;
            border-radius: 12px;
            font-size: 0.9rem;
        }
        
        .success-toast {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
            background: rgba(26, 92, 191, 0.92);
            color: white;
            padding: 16px 24px;
            border-radius: 12px;
            border: 1px solid rgba(255,255,255,0.2);
            box-shadow: 0 10px 25px rgba(0,0,0,0.35);
            backdrop-filter: blur(10px);
            display: flex;
            align-items: center;
            gap: 12px;
            font-weight: 600;
            transform: translateY(-100px);
            opacity: 0;
            transition: all 0.5s cubic-bezier(0.68, -0.55, 0.27, 1.55);
        }

        .success-toast.show {
            transform: translateY(0);
            opacity: 1;
        }

        .form-label.text-white-50, label.text-white-50 {
            color: rgba(155, 200, 250, 0.75) !important;
        }

        .form-check-label {
            color: rgba(155, 200, 250, 0.80) !important;
        }

        small.text-muted, .signup-link {
            color: rgba(160, 205, 250, 0.75) !important;
        }

        .field-error-message {
            color: #fca5a5;
        }

        /* Mobile */
        @media (max-width: 768px) {
            .login-logo img {
                height: 120px !important;
                margin-bottom: -1rem;
            }
            
            .login-card {
                padding: 2rem 1.5rem !important;
                margin: 0;
            }
            
            h2 {
                font-size: 1.75rem !important;
            }
            
            .form-control, .input-group-text, .toggle-password {
                padding: 0.75rem 0.875rem;
                font-size: 16px;
            }
            
            .btn-primary {
                padding: 0.875rem;
                font-size: 1rem;
            }
        }

        @media (max-width: 480px) {
            .login-logo img { height: 100px !important; }
            .login-card { padding: 1.5rem 1rem !important; }
            h2 { font-size: 1.5rem !important; }
            .text-white-50 { font-size: 0.85rem !important; }
        }

        @media (prefers-reduced-motion: reduce) {
            #eco-canvas { display: none !important; }
            #eco-fallback { display: block !important; }
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
    <!-- Three.js canvas background -->
    <canvas id="eco-canvas" aria-hidden="true"></canvas>
    <!-- Static CSS fallback background -->
    <div id="eco-fallback" aria-hidden="true"></div>
    <!-- Very-light overlay for depth separation -->
    <div id="eco-overlay" aria-hidden="true"></div>

    <!-- Success Toast -->
    <div id="successToast" class="success-toast">
        <i class="fa-solid fa-circle-check fs-5"></i>
        <span>Registered Successfully!</span>
    </div>

    <div class="container d-flex justify-content-center auth-shell">
        <div class="login-card edge-glow" data-aos="zoom-in" data-aos-duration="1000">
            <div class="text-center mb-4">
                <div class="login-logo mb-0">
                    <!-- Update with your actual logo path if different -->
                    <img src="img/ecopulse_logo_final.png" alt="EcoPulse">
                </div>
                <h2 class="fw-bold fs-3">Welcome Back</h2>
                <p class="text-white-50">Enter your credentials to access the dashboard.</p>
            </div>

            <?php if (!empty($errors)): ?>
                <div class="alert alert-danger py-2 px-3 shadow-sm border-0 bg-danger bg-opacity-75 text-white mb-3" data-aos="shake">
                    <?php foreach ($errors as $err): ?>
                        <small class="d-block"><i class="fa-solid fa-circle-exclamation me-2"></i>
                            <?= htmlspecialchars($err) ?></small>
                    <?php endforeach; ?>
                </div>
            <?php endif; ?>

            <form method="post" id="loginForm" novalidate>
                <input type="hidden" name="from" value="<?= htmlspecialchars($from) ?>">

                <div class="mb-3">
                    <label for="username"
                        class="form-label text-white-50 small text-uppercase fw-bold ls-1">Username or Email</label>
                    <div class="input-group">
                        <span class="input-group-text"><i class="fa-solid fa-user"></i></span>
                        <input type="text" class="form-control" id="username" name="username"
                            value="<?= htmlspecialchars($username) ?>" required autofocus placeholder="User or Email">
                    </div>
                </div>

                <div class="mb-4">
                    <label for="password"
                        class="form-label text-white-50 small text-uppercase fw-bold ls-1">Password</label>
                    <div class="input-group">
                        <span class="input-group-text"><i class="fa-solid fa-lock"></i></span>
                        <input type="password" class="form-control" id="password" name="password" required
                            placeholder="••••••••">
                        <button type="button" class="btn toggle-password" id="togglePassword"><i
                                class="fa-solid fa-eye"></i></button>
                    </div>
                </div>

                <div class="d-flex justify-content-between align-items-center mb-4">
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" id="remember" name="remember" <?= $remember ? 'checked' : '' ?>>
                        <label class="form-check-label text-white-50 small" for="remember">Remember me</label>
                    </div>
                    <a href="forgot-password.php" class="small text-white-50">Forgot Password?</a>
                </div>

                <div class="d-grid gap-2">
                    <button type="submit" class="btn btn-primary text-white shadow-lg">SIGN IN</button>
                </div>

                <div class="signup-link mt-3 text-center">
                    Don't have an account? <a href="signup.php" class="text-decoration-none fw-bold" style="color: var(--accent-color);">Sign Up</a>
                </div>


            </form>
        </div>
    </div>

    <!-- AOS Script -->
    <script src="https://unpkg.com/aos@2.3.1/dist/aos.js"></script>
    <script>
        AOS.init({
            once: true,
            duration: 600,
            disable: window.matchMedia('(prefers-reduced-motion: reduce)').matches
        });
        
        document.getElementById('togglePassword').addEventListener('click', function () {
            const passwordInput = document.getElementById('password');
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

        // Show toast if success message exists
        const successMsg = <?= json_encode($userSuccessMsg) ?>;
        if (successMsg) {
            const toast = document.getElementById('successToast');
            toast.querySelector('span').textContent = 'Registered Successfully!'; // Override with preferred text or use successMsg
            setTimeout(() => {
                toast.classList.add('show');
            }, 500);
            
            setTimeout(() => {
                toast.classList.remove('show');
            }, 5000);
        }

        (function attachLoginValidation() {
            const form = document.getElementById('loginForm');
            if (!form) return;

            const fields = Array.from(form.querySelectorAll('input[required], input[minlength]'));
            const getMsg = (field) => {
                if (field.validity.valueMissing) return 'Please fill out this field.';
                if (field.validity.tooShort) return `Please enter at least ${field.minLength} characters.`;
                if (field.id === 'username') return 'Please enter your username or email.';
                if (field.id === 'password') return 'Please enter your password.';
                return 'Please check this field.';
            };

            const renderError = (field, message) => {
                const holder = field.closest('.input-group')?.parentElement || field.parentElement;
                if (!holder) return;
                let msg = holder.querySelector('.field-error-message');
                if (!msg) {
                    msg = document.createElement('div');
                    msg.className = 'field-error-message';
                    holder.appendChild(msg);
                }
                msg.textContent = message || '';
                msg.style.display = message ? 'block' : 'none';
                field.classList.toggle('is-invalid', Boolean(message));
            };

            const validate = (field) => {
                if (!field) return true;
                const valid = field.checkValidity();
                renderError(field, valid ? '' : getMsg(field));
                return valid;
            };

            fields.forEach((field) => {
                field.addEventListener('input', () => validate(field));
                field.addEventListener('blur', () => validate(field));
            });

            form.addEventListener('submit', (event) => {
                let firstInvalid = null;
                let hasError = false;
                fields.forEach((field) => {
                    const valid = validate(field);
                    if (!valid) {
                        hasError = true;
                        if (!firstInvalid) firstInvalid = field;
                    }
                });
                if (hasError) {
                    event.preventDefault();
                    firstInvalid?.focus();
                }
            });
        })();
    </script>

    <!-- Three.js for eco background -->
    <script src="https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.min.js"></script>
    <script src="js/eco-bg.js"></script>

</body>

</html>
