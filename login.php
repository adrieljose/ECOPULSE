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
            --primary-color: #204f79;
            --accent-color: #69a1d1;
            --text-color: #f8fafc;
            --glass-bg: rgba(255, 255, 255, 0.05);
            --glass-border: rgba(255, 255, 255, 0.1);
            --input-bg: rgba(255, 255, 255, 0.07);
        }

        body {
            font-family: 'Outfit', sans-serif;
            background: #0f172a;
            margin: 0;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--text-color);
            position: relative;
            overflow: hidden;
        }

        .background {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            /* Original Modern Blue Gradient */
            background: radial-gradient(circle at top left, #1e3a8a, #0f172a, #020617);
            z-index: 0;
        }



        .background::after {
            content: '';
            position: absolute;
            width: 150%;
            height: 150%;
            top: -25%;
            left: -25%;
            background: radial-gradient(circle, rgba(56, 189, 248, 0.1) 0%, transparent 60%);
            animation: pulseGlow 15s infinite alternate;
        }

        @keyframes pulseGlow {
            0% { transform: scale(1); opacity: 0.8; }
            100% { transform: scale(1.05); opacity: 0.9; }
        }

        .login-card {
            background: var(--glass-bg);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            border: 1px solid var(--glass-border);
            border-radius: 24px;
            box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
            padding: 3rem 2.5rem;
            width: 100%;
            max-width: 450px;
            position: relative;
            z-index: 10;
        }

        .login-logo img {
            height: 200px;
            filter: drop-shadow(0 4px 6px rgba(0,0,0,0.2));
            margin-bottom: -2rem;
        }

        h2 {
            font-weight: 700;
            letter-spacing: -0.5px;
            margin-bottom: 0.25rem;
            color: #fff;
        }

        .text-white-50 {
            color: rgba(255, 255, 255, 0.6) !important;
            font-weight: 400;
        }

        .form-control, .form-select, .input-group-text, .toggle-password {
            background: var(--input-bg);
            border: 1px solid var(--glass-border);
            color: #fff;
            padding: 0.9rem 1rem;
            font-size: 0.95rem;
            transition: all 0.2s ease;
        }

        .input-group-text {
            border-right: none;
            border-top-left-radius: 12px;
            border-bottom-left-radius: 12px;
            color: rgba(255,255,255,0.7);
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
            color: rgba(255,255,255,0.6);
            cursor: pointer;
        }
        
        .toggle-password:hover {
            color: #fff;
            background: rgba(255,255,255,0.15);
        }

        .form-control:focus {
            background: rgba(255, 255, 255, 0.12);
            border-color: rgba(255, 255, 255, 0.3);
            box-shadow: none;
            color: #fff;
            z-index: 2;
        }

        .form-control::placeholder {
            color: rgba(255, 255, 255, 0.4);
        }

        .btn-primary {
            background: #38bdf8;
            color: #0f172a;
            border: none;
            border-radius: 12px;
            padding: 1rem;
            font-weight: 700;
            font-size: 1rem;
            letter-spacing: 0.3px;
            transition: all 0.2s ease;
            box-shadow: 0 4px 6px -1px rgba(56, 189, 248, 0.2);
        }

        .btn-primary:hover {
            background: #7dd3fc;
            transform: translateY(-2px);
            box-shadow: 0 10px 15px -3px rgba(56, 189, 248, 0.3);
            color: #0f172a; 
        }

        .btn-outline-light {
            border-radius: 12px;
            color: rgba(255,255,255,0.7);
            border-color: rgba(255,255,255,0.2);
            font-weight: 500;
        }
        
        .btn-outline-light:hover {
            background: rgba(255,255,255,0.1);
            color: #fff;
            border-color: rgba(255,255,255,0.5);
        }

        .form-check-input {
            background-color: var(--input-bg);
            border-color: var(--glass-border);
            width: 1.2em;
            height: 1.2em;
        }
        
        .form-check-input:checked {
            background-color: #38bdf8;
            border-color: #38bdf8;
        }

        a { color: #38bdf8; transition: color 0.2s; text-decoration: none; }
        a:hover { color: #7dd3fc; }

        .alert {
            background: rgba(239, 68, 68, 0.15);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(239, 68, 68, 0.2);
            color: #fca5a5;
            border-radius: 12px;
            font-size: 0.9rem;
        }
        
        .success-toast {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
            background: rgba(16, 185, 129, 0.9);
            color: white;
            padding: 16px 24px;
            border-radius: 12px;
            border: 1px solid rgba(255,255,255,0.2);
            box-shadow: 0 10px 25px rgba(0,0,0,0.2);
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

        .edge-glow { overflow: hidden; }

        /* Mobile Responsiveness */
        @media (max-width: 768px) {
            .login-logo img {
                height: 120px !important;
                margin-bottom: -1rem;
            }
            
            .login-card {
                padding: 2rem 1.5rem !important;
                margin: 1rem;
            }
            
            h2 {
                font-size: 1.75rem !important;
            }
            
            .form-control, .input-group-text, .toggle-password {
                padding: 0.75rem 0.875rem;
                font-size: 16px; /* Prevents iOS zoom */
            }
            
            .btn-primary {
                padding: 0.875rem;
                font-size: 1rem;
            }
        }

        @media (max-width: 480px) {
            .login-logo img {
                height: 100px !important;
            }
            
            .login-card {
                padding: 1.5rem 1rem !important;
            }
            
            h2 {
                font-size: 1.5rem !important;
            }
            
            .text-white-50 {
                font-size: 0.85rem !important;
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

    <!-- Success Toast -->
    <div id="successToast" class="success-toast">
        <i class="fa-solid fa-circle-check fs-5"></i>
        <span>Registered Successfully!</span>
    </div>

    <div class="container d-flex justify-content-center">
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

            <form method="post">
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
        AOS.init();
        
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
    </script>

</body>

</html>
