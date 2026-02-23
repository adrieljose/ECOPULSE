<?php
/**
 * export_csv.php
 * Handles CSV export for various report types.
 * Mapping from generic types (login, sms, public, activity, aqi) to DB queries.
 */
require_once __DIR__ . '/session_bootstrap.php';

if (!isset($_SESSION['admin'])) {
    die("Access Denied");
}

require_once __DIR__ . '/db.php';

// Ensure mysqli is available
if (!isset($mysqli) || !($mysqli instanceof mysqli)) {
    $mysqli = new mysqli('localhost', 'root', '', 'ecopulse');
    if ($mysqli->connect_errno) {
        die('Database connection failed: ' . $mysqli->connect_error);
    }
}

// Params
$type = $_POST['type'] ?? $_GET['type'] ?? '';
$from = $_POST['from'] ?? $_GET['from'] ?? '';
$to   = $_POST['to']   ?? $_GET['to']   ?? '';

$filename = 'ecopulse_export_' . $type . '_' . date('Ymd_His') . '.csv';

// Headers
header('Content-Type: text/csv; charset=utf-8');
header('Content-Disposition: attachment; filename="' . $filename . '"');

$output = fopen('php://output', 'w');
// BOM for Excel
fputs($output, "\xEF\xBB\xBF");

function output_rows($mysqli, $output, $sql, $params, $types, $headers) {
    fputcsv($output, $headers);
    
    $stmt = $mysqli->prepare($sql);
    if ($stmt) {
        if ($types) {
            $stmt->bind_param($types, ...$params);
        }
        $stmt->execute();
        $res = $stmt->get_result();
        while ($row = $res->fetch_assoc()) {
            fputcsv($output, $row);
        }
        $stmt->close();
    }
}

// Date Filter Logic
$dateFilter = "";
$params = [];
$types = "";

if ($from) {
    $dateFilter .= " AND DATE(created_at) >= ?";
    $types .= "s";
    $params[] = $from;
}
if ($to) {
    $dateFilter .= " AND DATE(created_at) <= ?";
    $types .= "s";
    $params[] = $to;
}

switch ($type) {
    case 'login':
        // Map to admin_login_history
        $sql = "SELECT created_at, username, ip_address, status FROM admin_login_history WHERE 1=1 $dateFilter ORDER BY created_at DESC";
        output_rows($mysqli, $output, $sql, $params, $types, ['Date', 'Username', 'IP Address', 'Status']);
        break;

    case 'sms':
        // Map to sms_logs
        $sql = "SELECT created_at, mobile, provider, status, error, area_name, alert_id FROM sms_logs WHERE 1=1 $dateFilter ORDER BY created_at DESC";
        output_rows($mysqli, $output, $sql, $params, $types, ['Date', 'Mobile', 'Provider', 'Status', 'Error', 'Area', 'Alert ID']);
        break;

    case 'public':
        // Map to users
        $sql = "SELECT created_at, username, email, contact_number, city, barangay FROM users WHERE 1=1 $dateFilter ORDER BY created_at DESC";
        output_rows($mysqli, $output, $sql, $params, $types, ['Registered At', 'Username', 'Email', 'Contact', 'City', 'Barangay']);
        break;

    case 'activity':
        // Map to user_login_history
        $sql = "SELECT created_at, username, action, ip_address FROM user_login_history WHERE 1=1 $dateFilter ORDER BY created_at DESC";
        output_rows($mysqli, $output, $sql, $params, $types, ['Date', 'Username', 'Action', 'IP Address']);
        break;
        
    case 'aqi':
        // Special case for Readings (uses recorded_at instead of created_at)
        $dateFilter = str_replace('created_at', 'r.recorded_at', $dateFilter);
        $sql = "
            SELECT r.recorded_at, d.name, d.device_code, r.aqi 
            FROM readings r
            JOIN devices d ON d.id = r.device_id
            WHERE 1=1 $dateFilter
            ORDER BY r.recorded_at DESC
        ";
        output_rows($mysqli, $output, $sql, $params, $types, ['Recorded At', 'Device Name', 'Device Code', 'AQI']);
        break;

    default:
        fputcsv($output, ['Error', 'Unknown report type: ' . $type]);
        break;
}

fclose($output);
exit;
?>
