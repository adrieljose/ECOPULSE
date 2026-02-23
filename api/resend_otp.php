<?php
require_once __DIR__ . '/../session_bootstrap.php';
header('Content-Type: application/json');

require_once __DIR__ . '/../lib/sms_sender.php';

// Check if signup data exists
if (!isset($_SESSION['signup_data']) || !isset($_SESSION['signup_data']['contact_number'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'No pending signup found. Please register again.']);
    exit;
}

// Rate Limiting (Simple): Check if last resend was < 1 minute ago
if (isset($_SESSION['last_resend_time']) && (time() - $_SESSION['last_resend_time'] < 60)) {
    http_response_code(429);
    echo json_encode(['success' => false, 'error' => 'Please wait before resending code.']);
    exit;
}

try {
    $contact_number = $_SESSION['signup_data']['contact_number'];
    
    // Generate New OTP
    $otp = random_int(100000, 999999);
    
    // Update Session
    $_SESSION['otp'] = $otp;
    $_SESSION['otp_expiry'] = time() + 300; // 5 mins
    $_SESSION['last_resend_time'] = time();

    // Send SMS
    $message = "Your OTP verification code is: $otp";
    $result = send_sms_alert($contact_number, $message);

    if ($result['success'] ?? false) {
        echo json_encode(['success' => true]);
    } else {
         $debug = $result['providerMessage'] ?? 'Unknown gateway error';
         echo json_encode(['success' => false, 'error' => 'Failed to send SMS: ' . $debug]);
    }

} catch (Exception $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
