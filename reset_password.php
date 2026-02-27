<?php
require_once __DIR__ . '/session_bootstrap.php';
require_once __DIR__ . '/db.php';

$token = $_GET['token'] ?? '';
$error = '';
$success = '';
$step = 'verify_otp'; // Default step
$verifiedOtp = '';

if (!$token) {
    die('Invalid link.');
}

// 1. Validate Token
$pdo = db();
$stmt = $pdo->prepare('SELECT * FROM password_resets WHERE token_hash = :hash AND expires_at > NOW() AND used_at IS NULL LIMIT 1');
$stmt->execute([':hash' => hash('sha256', $token)]);
$resetRequest = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$resetRequest) {
    $error = 'This link is invalid or has expired.';
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && !$error) {
    $currentStep = $_POST['step'] ?? 'verify_otp';
    $enteredOtp = trim($_POST['otp'] ?? '');
    
    // Always verify valid session/token first
    if ($currentStep === 'verify_otp') {
        // Step 1: Verify OTP
         if (hash('sha256', $enteredOtp) !== $resetRequest['otp_hash']) {
            $error = 'Invalid OTP code.';
        } elseif (new DateTime() > new DateTime($resetRequest['otp_expires_at'])) {
            $error = 'OTP code has expired.';
        } else {
            // OTP is good, move to step 2
            $step = 'reset_password';
            $verifiedOtp = $enteredOtp;
        }
    } elseif ($currentStep === 'reset_password') {
        // Step 2: Update Password
        // Re-verify OTP to prevent manipulation
        $verifiedOtp = $_POST['otp_verified'] ?? '';
        
        if (hash('sha256', $verifiedOtp) !== $resetRequest['otp_hash']) {
             $error = 'Session invalid. Please try again.';
             $step = 'verify_otp';
        } else {
            $newPass = $_POST['password'] ?? '';
            $confirmPass = $_POST['confirm_password'] ?? '';

            if ($newPass !== $confirmPass) {
                $error = 'Passwords do not match.';
                $step = 'reset_password'; // Stay on step 2
            } elseif (strlen($newPass) < 8) {
                $error = 'Password must be at least 8 characters.';
                $step = 'reset_password'; // Stay on step 2
            } else {
                // Update Password
                try {
                    $table = ($resetRequest['user_type'] === 'admin') ? 'admins' : 'users';
                    $hash = password_hash($newPass, PASSWORD_BCRYPT);
                    
                    $update = $pdo->prepare("UPDATE $table SET password_hash = :hash WHERE id = :id");
                    $update->execute([':hash' => $hash, ':id' => $resetRequest['user_id']]);
        
                    // Mark token as used
                    $markUsed = $pdo->prepare('UPDATE password_resets SET used_at = NOW() WHERE id = :id');
                    $markUsed->execute([':id' => $resetRequest['id']]);
        
                    $success = 'Password reset successfully! Redirecting to login...';
                    $step = 'done';
                    
                    // Auto-redirect
                    header("refresh:2;url=login.php");
        
                } catch (Throwable $e) {
                    $error = 'Failed to update password. Please try again.';
                    $step = 'reset_password';
                }
            }
        }
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Reset Password | EcoPulse</title>
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
        .btn-primary { background: #38bdf8; color: #0f172a; border: none; border-radius: 12px; padding: 0.8rem; font-weight: 700; width: 100%; }
        .btn-primary:hover { background: #7dd3fc; }
        .form-control { background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.1); color: white; padding: 0.8rem; }
        .form-control:focus { background: rgba(255,255,255,0.12); border-color: rgba(255,255,255,0.3); color: white; box-shadow: none; }
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
            <?php if ($error): ?>
                <div class="text-center">
                    <div class="alert alert-danger border-0 bg-danger bg-opacity-75 text-white">
                        <i class="fa-solid fa-circle-exclamation me-1"></i> <?= htmlspecialchars($error) ?>
                    </div>
                     <?php if ($step === 'verify_otp' || strpos($error, 'expired') !== false): ?>
                        <a href="forgot-password.php" class="btn btn-outline-light btn-sm mt-3">Request New Link</a>
                     <?php endif; ?>
                </div>
            <?php endif; ?>

            <?php if ($success): ?>
                <div class="text-center">
                    <div class="alert alert-success border-0 bg-success bg-opacity-75 text-white">
                        <i class="fa-solid fa-check-circle me-1"></i> <?= htmlspecialchars($success) ?>
                    </div>
                </div>
            <?php elseif (!$error || ($error && $step !== 'done')): ?>
                <div class="text-center mb-4">
                    <h3 class="fw-bold">Reset Password</h3>
                    <?php if ($step === 'verify_otp'): ?>
                        <p class="text-white-50 small">Enter the OTP sent to your phone.</p>
                    <?php else: ?>
                        <p class="text-white-50 small">Code verified. Enter your new password.</p>
                    <?php endif; ?>
                </div>

                <form method="post">
                    <?php if ($step === 'verify_otp'): ?>
                        <!-- STEP 1: OTP Only -->
                        <input type="hidden" name="step" value="verify_otp">
                        <div class="mb-3">
                            <label class="form-label small">OTP Code</label>
                            <input type="text" class="form-control text-center tracking-widest" name="otp" placeholder="000000" maxlength="6" required autofocus>
                        </div>
                        <button type="submit" class="btn btn-primary mb-3">Verify OTP</button>
                        <a href="forgot-password.php" class="btn btn-outline-light w-100 border-0 bg-transparent text-white-50"><i class="fa-solid fa-arrow-left me-1"></i> Back</a>

                    <?php elseif ($step === 'reset_password'): ?>
                         <!-- STEP 2: Password Only -->
                        <input type="hidden" name="step" value="reset_password">
                        <input type="hidden" name="otp_verified" value="<?= htmlspecialchars($verifiedOtp) ?>">
                        
                        <div class="mb-3">
                            <label class="form-label small">New Password</label>
                            <div class="input-group">
                                <input type="password" class="form-control" name="password" id="password" placeholder="••••••••" required autofocus style="border-right: none;">
                                <button class="btn btn-outline-secondary" type="button" id="togglePassword" style="border-left: none; background: rgba(255,255,255,0.07); border-color: rgba(255,255,255,0.1); color: rgba(255,255,255,0.6);">
                                    <i class="fa-solid fa-eye-slash"></i>
                                </button>
                            </div>
                        </div>
                        
                        <div class="mb-4">
                            <label class="form-label small">Confirm Password</label>
                            <div class="input-group">
                                <input type="password" class="form-control" name="confirm_password" id="confirm_password" placeholder="••••••••" required style="border-right: none;">
                                <button class="btn btn-outline-secondary" type="button" id="toggleConfirmPassword" style="border-left: none; background: rgba(255,255,255,0.07); border-color: rgba(255,255,255,0.1); color: rgba(255,255,255,0.6);">
                                    <i class="fa-solid fa-eye-slash"></i>
                                </button>
                            </div>
                        </div>

                        <button type="submit" class="btn btn-primary text-white">Set New Password</button>
                    <?php endif; ?>
                </form>
            <?php endif; ?>
        </div>
    </div>
    
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            function setupToggle(inputId, toggleId) {
                const toggle = document.getElementById(toggleId);
                const input = document.getElementById(inputId);
                
                if (toggle && input) {
                    toggle.addEventListener('click', function() {
                        const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
                        input.setAttribute('type', type);
                        
                        // Toggle icon
                        const icon = this.querySelector('i');
                        if (icon) {
                            icon.classList.toggle('fa-eye');
                            icon.classList.toggle('fa-eye-slash');
                        }
                    });
                }
            }
            
            setupToggle('password', 'togglePassword');
            setupToggle('confirm_password', 'toggleConfirmPassword');
        });
    </script>
</body>
</html>
