<?php
// Simulate Arduino POST
$url = 'http://localhost/ecopulse/api/ingest_esp.php';
// Mirroring: Send same data to both devices
$devices = [68, 69]; 

foreach ($devices as $deviceId) {
    echo "Sending data to Device ID: $deviceId...\n";
    $data = [
        'device_id' => $deviceId,
        'pm25' => 10,
        'pm10' => 10,
        'aqi' => 120, // Yellow Alert Test (101-150) 
        'co' => 300, 
        'co2' => 5500, 
        'temp' => 25.5,
        'hum' => 60
    ];

    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    echo "Response Code: $httpCode\n";
    echo "Response Body: $response\n\n";
}
