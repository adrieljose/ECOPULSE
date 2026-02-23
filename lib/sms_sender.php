<?php

function get_sms_config() {
    $iprog_token = '';

    // 1. Try file first (Priority)
    $token_file = __DIR__ . '/../data/iprog_token.txt';
    if (file_exists($token_file)) {
        $iprog_token = trim(file_get_contents($token_file));
    }

    // 2. If no file token, try Env
    if (!$iprog_token) {
        $iprog_token = getenv('IPROG_API_TOKEN');
    }

    // 3. Fallback
    if (!$iprog_token) {
        $iprog_token = '19d7d48ba32a2b9263c25e70d2cd932b0f9ce2e0';
    }

    return [
        'twilio_sid' => getenv('TWILIO_SID') ?: '',
        'twilio_token' => getenv('TWILIO_TOKEN') ?: '',
        'twilio_from' => getenv('TWILIO_FROM') ?: '+64',
        
        'infobip_base_url' => rtrim(getenv('INFOBIP_BASE_URL') ?: 'https://rp1lwl.api.infobip.com', '/'),
        'infobip_api_key' => getenv('INFOBIP_API_KEY') ?: '7864af3ef89ba9dc387e86ecb068acd3-dd70925e-1d40-473f-8e0c-0bf56b7d040b',
        'infobip_from' => getenv('INFOBIP_FROM') ?: '447491163443',

        'iprog_base_url' => rtrim(getenv('IPROG_BASE_URL') ?: 'https://www.iprogsms.com/api/v1/sms_messages', '/'),
        'iprog_api_token' => $iprog_token,
        'iprog_sms_provider' => getenv('IPROG_SMS_PROVIDER') ?: null,
    ];
}

function send_sms_alert($mobile, $message) {
    $config = get_sms_config();
    
    // Determine provider priority (matches sms.php logic)
    $use_iprog = ($config['iprog_base_url'] && $config['iprog_api_token']);
    $use_infobip = ($config['infobip_base_url'] && $config['infobip_api_key'] && $config['infobip_from']);
    $use_twilio = ($config['twilio_sid'] && $config['twilio_token'] && $config['twilio_from']);

    if ($use_iprog) {
        return send_sms_iprog_lib($mobile, $message, $config['iprog_base_url'], $config['iprog_api_token'], $config['iprog_sms_provider']);
    } elseif ($use_infobip) {
        return send_sms_infobip_lib($mobile, $message, $config['infobip_base_url'], $config['infobip_api_key'], $config['infobip_from']);
    } elseif ($use_twilio) {
        return send_sms_twilio_lib($mobile, $message, $config['twilio_sid'], $config['twilio_token'], $config['twilio_from']);
    } else {
        return send_sms_textbelt_lib($mobile, $message);
    }
}

// --- Provider Functions (Renamed with _lib suffix to avoid potential collision if simple include is used, though namespaces are better, sticking to simple function based) ---

function send_sms_textbelt_lib(string $phone, string $message): array
{
    $ch = curl_init('https://textbelt.com/text');
    curl_setopt_array($ch, [
        CURLOPT_POST => true,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POSTFIELDS => [
            'phone' => $phone,
            'message' => $message,
            'key' => 'textbelt'
        ]
    ]);
    $resp = curl_exec($ch);
    curl_close($ch);
    $decoded = json_decode($resp ?? '', true);
    return is_array($decoded) ? $decoded : ['success' => false, 'raw' => $resp];
}

function send_sms_iprog_lib(string $to, string $body, string $baseUrl, string $token, ?string $smsProvider = null): array
{
    $to = preg_replace('/[^0-9]/', '', $to);
    if (strlen($to) === 11 && $to[0] === '0') {
        $to = '63' . substr($to, 1);
    }
    $payload = [
        'api_token' => $token,
        'phone_number' => $to,
        'message' => $body
    ];
    if ($smsProvider !== null && $smsProvider !== '') {
        $payload['sms_provider'] = $smsProvider;
    }

    $ch = curl_init($baseUrl);
    curl_setopt_array($ch, [
        CURLOPT_POST => true,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HTTPHEADER => [
            'Content-Type: application/x-www-form-urlencoded',
            'Accept: application/json'
        ],
        CURLOPT_POSTFIELDS => http_build_query($payload)
    ]);
    $resp = curl_exec($ch);
    $http = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    $decoded = json_decode($resp ?? '', true);

    $status = $decoded['status'] ?? ($decoded['data']['status'] ?? null);
    $msg = $decoded['message'] ?? ($decoded['data']['message'] ?? null);
    $statusNorm = is_string($status) ? strtolower($status) : $status;
    $success = ($http >= 200 && $http < 300) && ($status === 200 || in_array($statusNorm, ['success', 'ok', 'sent', 'accepted', 'queued'], true));

    return [
        'success' => $success,
        'http' => $http,
        'status' => $status,
        'providerMessage' => $msg,
        'response' => $decoded ?? $resp
    ];
}

function send_sms_infobip_lib(string $to, string $body, string $baseUrl, string $apiKey, string $from): array
{
    $url = rtrim($baseUrl, '/') . '/sms/2/text/advanced';
    $payload = [
        'messages' => [[
            'from' => $from,
            'destinations' => [['to' => $to]],
            'text' => $body
        ]]
    ];

    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_POST => true,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HTTPHEADER => [
            'Authorization: App ' . $apiKey,
            'Content-Type: application/json',
            'Accept: application/json'
        ],
        CURLOPT_POSTFIELDS => json_encode($payload)
    ]);
    $resp = curl_exec($ch);
    $http = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    $decoded = json_decode($resp ?? '', true);
    $statusGroup = $decoded['messages'][0]['status']['groupName'] ?? null;
    $isHardFail = in_array($statusGroup, ['REJECTED', 'UNDELIVERABLE', 'INVALID'], true);
    $ok = ($http >= 200 && $http < 300 && $statusGroup && !$isHardFail);
    return [
        'success' => $ok,
        'http' => $http,
        'statusGroup' => $statusGroup,
        'response' => $decoded ?? $resp
    ];
}

function send_sms_twilio_lib(string $to, string $body, string $sid, string $token, string $from): array
{
    $url = "https://api.twilio.com/2010-04-01/Accounts/{$sid}/Messages.json";
    $postFields = http_build_query([
        'To' => $to,
        'From' => $from,
        'Body' => $body
    ]);
    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_POST => true,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_USERPWD => "{$sid}:{$token}",
        CURLOPT_POSTFIELDS => $postFields
    ]);
    $resp = curl_exec($ch);
    $http = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    $decoded = json_decode($resp ?? '', true);
    $ok = ($http >= 200 && $http < 300);
    return [
        'success' => $ok,
        'http' => $http,
        'response' => $decoded ?? $resp
    ];
}
