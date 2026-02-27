<?php
require_once __DIR__ . '/session_bootstrap.php';
require_once __DIR__ . '/db.php';

if (!isset($_SESSION['signup_data']) || !isset($_SESSION['otp'])) {
    header('Location: signup.php');
    exit;
}

$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $entered_otp = trim($_POST['otp'] ?? '');
    
    // Check expiry
    if (time() > ($_SESSION['otp_expiry'] ?? 0)) {
        $error = 'OTP has expired. Please try registering again.';
    } elseif ($entered_otp != $_SESSION['otp']) {
        $error = 'Invalid verification code.';
    } else {
        // OTP Valid - Register User
        try {
            $pdo = db();
            $data = $_SESSION['signup_data'];
            
            // Use manually entered username
            $username = $data['username'];
            
            $hash = password_hash($data['password'], PASSWORD_BCRYPT);
            $sql = "INSERT INTO users (username, first_name, middle_name, last_name, suffix, email, password_hash, birthday, age, contact_number, province, city, barangay, street, zip_code) 
                    VALUES (:username, :first_name, :middle_name, :last_name, :suffix, :email, :hash, :birthday, :age, :contact_number, :province, :city, :barangay, :street, :zip_code)";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([
                ':username' => $username,
                ':first_name' => $data['first_name'],
                ':middle_name' => $data['middle_name'],
                ':last_name' => $data['last_name'],
                ':suffix' => $data['suffix'] ?? null,
                ':email' => $data['email'],
                ':hash' => $hash,
                ':birthday' => $data['birthday'],
                ':age' => $data['age'],
                ':contact_number' => $data['contact_number'],
                ':province' => $data['province'],
                ':city' => $data['city'],
                ':barangay' => $data['barangay'],
                ':street' => $data['street'],
                ':zip_code' => $data['zip_code']
            ]);

            // Clear session data
            unset($_SESSION['signup_data']);
            unset($_SESSION['otp']);
            unset($_SESSION['otp_expiry']);

            $_SESSION['user_success'] = 'Account verified and created successfully! Please log in.';
            header('Location: login.php');
            exit;
        } catch (Throwable $e) {
            $error = 'Registration failed: ' . $e->getMessage();
        }
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Verify OTP | EcoPulse</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <!-- Bootstrap 5 -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css" />
    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    
    <style>
        :root { --primary-color: #204f79; --text-color: #f1f5f9; }
        body {
            font-family: 'Outfit', sans-serif;
            background: #132f48;
            margin: 0; min-height: 100vh;
            display: flex; align-items: center; justify-content: center;
            color: var(--text-color);
        }
        .background {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: -1;
            background: linear-gradient(-45deg, #0a1623, #132f48, #204f79, #0f2f4a);
            background-size: 400% 400%; animation: gradientBG 15s ease infinite;
        }
        @keyframes gradientBG { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
        .login-card {
            background: rgba(255, 255, 255, 0.08);
            border: 1px solid rgba(255, 255, 255, 0.15);
            border-radius: 20px;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
            color: white; padding: 2.5rem; width: 100%; max-width: 450px;
        }
        .btn-success {
            background: linear-gradient(135deg, #20bf55 0%, #01baef 100%);
            border: none; border-radius: 10px; padding: 0.8rem; font-weight: 600;
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
    <div class="container d-flex justify-content-center">
        <div class="login-card">
            <div class="text-center mb-4">
                <h3 class="fw-bold">Verify Your Number</h3>
                <p class="text-white-50 small">Enter the 6-digit code sent to your mobile.</p>
            </div>

            <?php if ($error): ?>
                <div class="alert alert-danger py-2 text-center border-0 bg-danger bg-opacity-75 text-white">
                    <i class="fa-solid fa-circle-exclamation me-1"></i> <?= htmlspecialchars($error) ?>
                </div>
            <?php endif; ?>

            <form method="post">
                <div class="mb-4">
                    <input type="text" class="form-control text-center fs-4 tracking-widest" name="otp" 
                           placeholder="000000" maxlength="6" pattern="\d{6}" required autofocus
                           style="letter-spacing: 0.5em; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); color: white;">
                </div>
                <div class="d-grid">
                    <button type="submit" class="btn btn-success text-white shadow-lg">VERIFY & REGISTER</button>
                </div>
            </form>

            <div class="text-center mt-4">
                <p class="small text-white-50 mb-2">Didn't receive the code?</p>
                <button type="button" class="btn btn-sm btn-outline-info fw-medium px-3" id="resendBtn">
                    <i class="fa-solid fa-rotate-right me-1"></i> Resend OTP
                </button>
                <div id="resendTimer" class="small text-white-50 mt-2" style="display:none;"></div>
                <div id="resendMsg" class="small mt-2"></div>
                
                <hr class="border-white opacity-10 my-3">
                
                <small><a href="signup.php" class="text-white-50 text-decoration-none hover-white"><i class="fa-solid fa-arrow-left me-1"></i> Back to Signup</a></small>
            </div>
        </div>
    </div>

    <script>
        const resendBtn = document.getElementById('resendBtn');
        const resendMsg = document.getElementById('resendMsg');
        const resendTimer = document.getElementById('resendTimer');
        let countdown = 0;

        resendBtn.addEventListener('click', function() {
            resendBtn.disabled = true;
            resendBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin me-1"></i> Sending...';
            resendMsg.textContent = '';
            resendMsg.className = 'small mt-2';

            fetch('api/resend_otp.php')
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        resendMsg.textContent = 'Code resent successfully! Check your inbox.';
                        resendMsg.className = 'small mt-2 text-success fw-bold';
                        startCountdown(60);
                    } else {
                        resendMsg.textContent = data.error || 'Failed to resend code.';
                        resendMsg.className = 'small mt-2 text-danger fw-bold';
                        resendBtn.disabled = false;
                        resendBtn.innerHTML = '<i class="fa-solid fa-rotate-right me-1"></i> Resend OTP';
                    }
                })
                .catch(err => {
                    console.error(err);
                    resendMsg.textContent = 'Network error. Please try again.';
                    resendMsg.className = 'small mt-2 text-danger';
                    resendBtn.disabled = false;
                    resendBtn.innerHTML = '<i class="fa-solid fa-rotate-right me-1"></i> Resend OTP';
                });
        });

        function startCountdown(seconds) {
            countdown = seconds;
            resendBtn.style.display = 'none';
            resendTimer.style.display = 'block';
            
            const interval = setInterval(() => {
                countdown--;
                resendTimer.textContent = `Resend available in ${countdown}s`;
                
                if (countdown <= 0) {
                    clearInterval(interval);
                    resendBtn.style.display = 'inline-block';
                    resendBtn.disabled = false;
                    resendBtn.innerHTML = '<i class="fa-solid fa-rotate-right me-1"></i> Resend OTP';
                    resendTimer.style.display = 'none';
                    resendMsg.textContent = ''; // clear success message after cooldown
                }
            }, 1000);
        }
    </script>
</body>
</html>
