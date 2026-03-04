<?php
require_once __DIR__ . '/lib/sms_sender.php';

header('Content-Type: text/plain');

echo "Debugging SMS Configuration...\n";

// 1. Check File Path
$token_file = __DIR__ . '/data/iprog_token.txt';
echo "Checking token file: $token_file\n";
if (file_exists($token_file)) {
    echo "File exists.\n";
    $content = file_get_contents($token_file);
    echo "File raw content length: " . strlen($content) . "\n";
    echo "File content (first 5 chars): " . substr($content, 0, 5) . "...\n";
} else {
    echo "Files does NOT exist.\n";
}

// 2. Check Loaded Config
$config = get_sms_config();
$token = $config['iprog_api_token'];
echo "\nLoaded Configuration:\n";
echo "IPROG Base URL: " . $config['iprog_base_url'] . "\n";
echo "IPROG Token (masked): " . substr($token, 0, 6) . "..." . substr($token, -4) . "\n";
echo "Token Length: " . strlen($token) . "\n";

// Check whether token was loaded at all
if ($token === '') {
    echo "WARNING: No IPROG token loaded. Configure IPROG_API_TOKEN or data/iprog_token.txt.\n";
} else {
    echo "Using configured token (Good).\n";
}

// 3. Test Send (Optional - prompting before making the call?)
// Let's try sending to a dummy number or the user provided number if available. 
// Using the number from the screenshot: 09951774034
$test_number = '09951774034'; 
echo "\nAttempting test send to: $test_number\n";

$result = send_sms_alert($test_number, "Test message from EcoPulse Debugger. " . date('H:i:s'));

echo "\nResult:\n";
print_r($result);
