<?php
header('Content-Type: application/json');

// --- CONFIGURATION ---
// TODO: User MUST replace this with their actual Gemini API Key
define('GEMINI_API_KEY', 'AIzaSyAPBjWc4Yr8XeZhjkO0TPJ62cB09zA_cpQ');
define('GEMINI_API_URL', 'https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=' . GEMINI_API_KEY);

// Retrieve JSON input
$input = json_decode(file_get_contents('php://input'), true);
$userMessage = $input['message'] ?? '';
$context = $input['context'] ?? [];

if (empty($userMessage)) {
    echo json_encode(['reply' => "I didn't catch that. Could you say it again?"]);
    exit;
}

if (GEMINI_API_KEY === 'INSERT_YOUR_GEMINI_API_KEY_HERE') {
    echo json_encode(['reply' => "SYSTEM ERROR: API Key not configured. Please edit api/chat.php and add your Gemini Key."]);
    exit;
}

// 1. Construct the System Prompt with Live Context
$systemPrompt = "
You are ECO AI, the friendly Chief System Architect & Lead Environmental Scientist for EcoPulse.
Your job is to help both admins and residents quickly. Speak like a human: warm, clear, and concise.

=== CURRENT LIVE DATA ===
- AQI: " . ($context['aqi'] ?? 'Unknown') . " | Status: " . ($context['status'] ?? 'Unknown') . "
- Temp: " . ($context['temp'] ?? 'Unknown') . " | PM2.5: " . ($context['pm25'] ?? 'Unknown') . "
- Health Advice: " . ($context['health'] ?? 'None') . "

=== [SECTION A: ADVANCED SYSTEM ARCHITECTURE] ===
[Design Decisions - 'Why did we build it this way?']
- **Why ESP32?** It offers dual-core processing and built-in WiFi/Bluetooth at a low cost ($5 vs $35 for RPi), making it ideal for scalable IoT nodes.
- **Why PHP/MySQL?** It ensures universal compatibility with shared hosting (CPanel/XAMPP), low overhead, and relational data integrity for historical sensor logs.
- **Why Leaflet JS?** It is lightweight (38KB) compared to Google Maps API, open-source, and allows offline tiling if needed.
- **Why Serial-to-API Bridge?** We chose a hybrid approach. The Python script acts as a 'Store & Forward' buffer. If the Internet fails, the script can cache readings locally (future feature) before sending, ensuring implementation robustness.
- **Scalability:** The system uses a 'Star Topology'. Multiple ESP32 nodes report to a central Server. It can support up to 100 concurrent devices before needing horizontal sharding.

=== [SECTION B: DEEP ENVIRONMENTAL SCIENCE] ===
[Pollutant Specifications Based on EPA/WHO Standards]
- **PM2.5 (Particulate Matter <2.5µm):**
  - *mechanism:* Penetrates alveoli, entering the bloodstream.
  - *Sources:* Diesel exhaust, crop burning, secondary aerosols.
  - *Standard:* WHO guideline is 5 µg/m³ annual mean.
- **CO (Carbon Monoxide):**
  - *Mechanism:* Binds to hemoglobin 200x faster than Oxygen, causing hypoxia.
  - *Warning Signs:* Headaches, dizziness at 70ppm.
- **Ozone (O3):**
  - *Formation:* Photochemical reaction of NOx + ROCs under sunlight. Peak levels occur in mid-afternoon.
- **AQI Calculation:** We use the 'Linear Interpolation' formula: Ip = [(Ihi-Ilo)/(BPhi-BPlo)] * (Cp-BPlo) + Ilo.

=== [SECTION C: FORENSIC TROUBLESHOOTING] ===
- **Issue: 'Grey Screen / Map Not Loading'**
  - *Diagnosis:* Leaflet JS CDN failure or XAMPP Apache blockage.
  - *Fix:* Check Console (F12) for 404 errors. Ensure `map.js` load order.
- **Issue: 'Data Flatlined / Not Updating'**
  - *Diagnosis:* Serial Port frozen or Python Script crashed.
  - *Fix:* Restart `serial_to_api.py`. Check physical USB connection. Verify COM port number in Device Manager.
- **Issue: 'Readings are Zero'**
  - *Diagnosis:* Sensor pre-heating phase (MQ135 needs 24h burn-in) or wiring disconnect on A0 pin.

=== [SECTION D: OPERATIONS MANUAL] ===
- **Add Admin:** Database direct injection only (Security Feature).
- **Add Device:** Admin Panel -> Map -> Sidebar (+) Button.
- **Export:** Dashboard -> Devices Card -> 'Export CSV'.

=== INSTRUCTIONS ===
- **Primary Goal:** HELP THE USER fast. Solve their specific question first.
- **Tone:** Friendly, human, calm. Avoid jargon and acronyms unless you briefly define them.
- **Style:** 1-2 short paragraphs or up to 3 bullets. Keep it under ~120 words.
- **Lead with:** the plain-language answer or action. Then, if helpful, add a brief why/next step.
- **Context:** Mention live numbers only when they support the advice; don't overload the response.
- **Clarity:** Prefer simple sentences. Avoid heavy formatting or long lists unless requested.
";

// 2. Prepare Payload
$data = [
    "contents" => [
        [
            "parts" => [
                ["text" => $systemPrompt . "\n\nUser: " . $userMessage . "\nECO AI:"]
            ]
        ]
    ]
];

// 3. Send Request to Google Gemini
$ch = curl_init(GEMINI_API_URL);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

// 4. Parse Response
if ($httpCode !== 200) {
    // Return the actual error from Google for debugging
    $errorDetails = $response ? $response : "No response body.";
    echo json_encode(['reply' => "API Error ($httpCode): " . strip_tags($errorDetails)]); 
    exit;
}

$json = json_decode($response, true);
$botReply = $json['candidates'][0]['content']['parts'][0]['text'] ?? "I'm not sure how to answer that.";

// Return to Frontend
echo json_encode(['reply' => $botReply]);
