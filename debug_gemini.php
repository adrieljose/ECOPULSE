<?php
define('GEMINI_API_KEY', 'AIzaSyAPBjWc4Yr8XeZhjkO0TPJ62cB09zA_cpQ'); // Using the key user provided
$url = 'https://generativelanguage.googleapis.com/v1beta/models?key=' . GEMINI_API_KEY;

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$response = curl_exec($ch);
curl_close($ch);

echo "Available Models:\n";
$data = json_decode($response, true);
if (isset($data['models'])) {
    foreach ($data['models'] as $m) {
        if (strpos($m['supportedGenerationMethods'][0] ?? '', 'generateContent') !== false) {
             echo " - " . $m['name'] . "\n";
        }
    }
} else {
    echo "Error: " . $response;
}
?>
