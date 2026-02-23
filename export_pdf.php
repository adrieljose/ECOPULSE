<?php
/**
 * export_pdf.php
 * Generates PDF reports (AQI, login history, SMS logs, public users) using FPDF.
 * Only PDFs are returned; there is no HTML or external API fallback.
 * Includes branded header/footer and improved table styling.
 */
require_once __DIR__ . '/session_bootstrap.php';

if (!isset($_SESSION['admin'])) {
    header('Location: login.php?from=reports');
    exit;
}

require_once __DIR__ . '/db.php';
require_once __DIR__ . '/lib/fpdf.php';

// Ensure mysqli is available
if (!isset($mysqli) || !($mysqli instanceof mysqli)) {
    $mysqli = new mysqli('localhost', 'root', '', 'ecopulse');
    if ($mysqli->connect_errno) {
        die('Database connection failed: ' . $mysqli->connect_error);
    }
}

// ------------------ Helpers ------------------ //
function h($v): string {
    return htmlspecialchars((string) $v, ENT_QUOTES, 'UTF-8');
}

function pdf_text($v): string {
    // FPDF expects ISO-8859-1; transliterate from UTF-8.
    return iconv('UTF-8', 'windows-1252//TRANSLIT', (string) $v);
}

function normalise_date(?string $raw): ?DateTime {
    if (!$raw) return null;
    $dt = DateTime::createFromFormat('Y-m-d', $raw);
    return $dt ?: null;
}

function subtitle_for_range(?DateTime $from, ?DateTime $to): string {
    if ($from && $to) {
        return 'Date range: ' . $from->format('Y-m-d') . ' to ' . $to->format('Y-m-d');
    }
    if ($from) return 'From: ' . $from->format('Y-m-d');
    if ($to) return 'Up to: ' . $to->format('Y-m-d');
    return 'All available dates';
}

function add_heading(FPDF $pdf, string $title, string $subtitle): void {
    // Title and subtitle are shown in header; here we add a meta chip.
    $pdf->SetFont('Arial', '', 10);
    $pdf->SetFillColor(236, 243, 252);
    $pdf->SetTextColor(60, 72, 88);
    $pdf->Cell(0, 8, pdf_text('Generated at: ' . date('Y-m-d H:i:s')), 0, 1, 'L', true);
    $pdf->Ln(3);
    $pdf->SetTextColor(0, 0, 0);
}

/**
 * Render a table with automatic multi-line rows and zebra striping.
 * @param array<int, array{label:string,w:float,align?:string,cb:callable}> $columns
 * @param array<int, array> $rows
 */
function render_table(FPDF $pdf, array $columns, array $rows): void {
    // Header
    $pdf->SetFillColor(10, 77, 158); // EcoPulse Classic Blue
    $pdf->SetTextColor(255, 255, 255);
    $pdf->SetFont('Arial', 'B', 10);
    foreach ($columns as $col) {
        $pdf->Cell($col['w'], 10, pdf_text($col['label']), 0, 0, 'L', true);
    }
    $pdf->Ln();

    // Body
    $pdf->SetFont('Arial', '', 9);
    $pdf->SetTextColor(33, 37, 41);
    $pdf->SetFillColor(247, 250, 255);
    $fill = false;

    foreach ($rows as $row) {
        // Determine row height based on wrapped text
        $lineHeights = [];
        $texts = [];
        foreach ($columns as $col) {
            $txt = pdf_text(call_user_func($col['cb'], $row));
            $texts[] = $txt;
            // Rough estimate: divide width by average char width (~2.5 per mm at size 9)
            $lineHeights[] = max(1, ceil(strlen($txt) / max(1, ($col['w'] / 2.5))));
        }
        $rowHeight = max($lineHeights) * 5.5;
        if ($rowHeight < 8) $rowHeight = 8;

        // Add page break if needed
        if ($pdf->GetY() + $rowHeight > ($pdf->GetPageHeight() - 15)) {
            $pdf->AddPage();
            // redraw header on new page
            $pdf->SetFillColor(10, 77, 158); // Classic Blue
            $pdf->SetTextColor(255, 255, 255);
            $pdf->SetFont('Arial', 'B', 10);
            foreach ($columns as $col) {
                $pdf->Cell($col['w'], 10, pdf_text($col['label']), 0, 0, 'L', true);
            }
            $pdf->Ln();
            $pdf->SetFont('Arial', '', 9);
            $pdf->SetTextColor(33, 37, 41);
            $pdf->SetFillColor(247, 250, 255);
            $fill = false;
        }

        // Render row with optional fill
        $maxH = 0;
        foreach ($texts as $idx => $txt) {
            $col = $columns[$idx];
            $align = $col['align'] ?? 'L';
            
            // Color Logic
            $textR = 33; $textG = 37; $textB = 41; // Default
            if (isset($col['color_cb'])) {
                 $rgb = call_user_func($col['color_cb'], $row);
                 if ($rgb) list($textR, $textG, $textB) = $rgb;
            }
            $pdf->SetTextColor($textR, $textG, $textB);

            $x = $pdf->GetX();
            $y = $pdf->GetY();
            $pdf->MultiCell($col['w'], 5.5, $txt, 0, $align, $fill); // Removed borders
            $pdf->SetXY($x + $col['w'], $y);
        }
        $pdf->Ln();
        $fill = !$fill;
    }
}

// ------------------ Input handling ------------------ //
$reportType = $_GET['report'] ?? 'aqi_reports';
$fromRaw    = $_GET['from']  ?? '';
$toRaw      = $_GET['to']    ?? '';

$from = normalise_date($fromRaw);
$to   = normalise_date($toRaw);

$fromStr = $from ? $from->format('Y-m-d 00:00:00') : null;
$toStr   = $to   ? $to->format('Y-m-d 23:59:59')   : null;

// ------------------ Data fetchers ------------------ //
$rows = [];
$title = '';
$subtitle = '';
// Analytics Globals
$globalTotalReads = 0;
$globalSumAqi = 0;
$globalMaxAqi = 0;
$globalMaxDevice = '-';
$statusCounts = ['Good'=>0, 'Moderate'=>0, 'Unhealthy'=>0, 'Hazardous'=>0];

function fetch_aqi_rows(mysqli $mysqli, ?string $fromStr, ?string $toStr, array &$statusCounts, int &$globalTotalReads, int &$globalSumAqi, int &$globalMaxAqi, string &$globalMaxDevice): array {
    $rows = [];
    $whereParts = [];
    $types = '';
    $params = [];

    if ($fromStr) { $whereParts[] = 'r.recorded_at >= ?'; $types .= 's'; $params[] = $fromStr; }
    if ($toStr)   { $whereParts[] = 'r.recorded_at <= ?'; $types .= 's'; $params[] = $toStr;   }
    $whereSql = $whereParts ? ('WHERE ' . implode(' AND ', $whereParts)) : '';

    $sql = "
        SELECT
            DATE(r.recorded_at) AS report_date,
            d.name             AS station_name,
            d.device_code      AS device_code,
            ROUND(AVG(r.aqi))  AS avg_aqi,
            MIN(r.aqi)         AS min_aqi,
            MAX(r.aqi)         AS max_aqi,
            COUNT(r.id)        AS read_count
        FROM readings r
        JOIN devices d ON d.id = r.device_id
        $whereSql
        GROUP BY report_date, d.id
        ORDER BY report_date DESC, d.name ASC
    ";
    $stmt = $mysqli->prepare($sql);
    if ($stmt) {
        if ($types !== '') { $stmt->bind_param($types, ...$params); }
        if ($stmt->execute()) {
            $result = $stmt->get_result();
            while ($row = $result->fetch_assoc()) {
                $aqi = (int) $row['avg_aqi'];
                if ($aqi <= 50)        $row['status'] = 'Good';
                elseif ($aqi <= 100)   $row['status'] = 'Moderate';
                elseif ($aqi <= 150)   $row['status'] = 'Unhealthy for Sensitive Groups';
                elseif ($aqi <= 200)   $row['status'] = 'Unhealthy';
                elseif ($aqi <= 300)   $row['status'] = 'Very Unhealthy';
                else                   $row['status'] = 'Hazardous';
                
                $globalTotalReads += $row['read_count'];
                $globalSumAqi += ($aqi * $row['read_count']); // Weighted sum
                if ($row['max_aqi'] > $globalMaxAqi) {
                    $globalMaxAqi = $row['max_aqi'];
                    $globalMaxDevice = $row['station_name'];
                }
                
                $sKey = 'Unhealthy';
                if ($row['status'] === 'Good') $sKey = 'Good';
                elseif ($row['status'] === 'Moderate') $sKey = 'Moderate';
                elseif ($row['status'] === 'Hazardous') $sKey = 'Hazardous';
                $statusCounts[$sKey]++;

                $rows[] = $row;
            }
        }
        $stmt->close();
    }

    return $rows;
}

function get_status_color($s) {
    if ($s === 'Good') return [16, 185, 129];
    if ($s === 'Moderate') return [245, 158, 11];
    if (strpos($s, 'Unhealthy') !== false) return [239, 68, 68]; // Covers 'Unhealthy' and 'Very Unhealthy'
    if ($s === 'Hazardous') return [127, 29, 29];
    return [156, 163, 175];
}

if ($reportType === 'aqi_reports') {
    $title = 'EcoPulse - Air Quality Report';
    $subtitle = subtitle_for_range($from, $to);

    $rows = fetch_aqi_rows($mysqli, $fromStr, $toStr, $statusCounts, $globalTotalReads, $globalSumAqi, $globalMaxAqi, $globalMaxDevice);

    if (!$rows) {
        $fallbackDate = null;
        $res = $mysqli->query("SELECT DATE(MAX(recorded_at)) AS d FROM readings");
        if ($res && ($row = $res->fetch_assoc()) && !empty($row['d'])) {
            $fallbackDate = $row['d'];
        }

        if ($fallbackDate) {
            $statusCounts = ['Good'=>0, 'Moderate'=>0, 'Unhealthy'=>0, 'Hazardous'=>0];
            $globalTotalReads = 0;
            $globalSumAqi = 0;
            $globalMaxAqi = 0;
            $globalMaxDevice = '-';

            $from = new DateTime($fallbackDate);
            $to   = new DateTime($fallbackDate);
            $fromStr = $fallbackDate . ' 00:00:00';
            $toStr   = $fallbackDate . ' 23:59:59';
            $subtitle = subtitle_for_range($from, $to) . ' (latest available)';

            $rows = fetch_aqi_rows($mysqli, $fromStr, $toStr, $statusCounts, $globalTotalReads, $globalSumAqi, $globalMaxAqi, $globalMaxDevice);
        }
    }

} elseif ($reportType === 'login_history') {
    $title = 'EcoPulse - Login History Report';
    $subtitle = subtitle_for_range($from, $to);

    $whereParts = [];
    $types = '';
    $params = [];
    if ($fromStr) { $whereParts[] = 'lh.created_at >= ?'; $types .= 's'; $params[] = $fromStr; }
    if ($toStr)   { $whereParts[] = 'lh.created_at <= ?'; $types .= 's'; $params[] = $toStr;   }
    $whereSql = $whereParts ? ('WHERE ' . implode(' AND ', $whereParts)) : '';

    $sql = "
        SELECT lh.created_at AS login_at, lh.username, lh.ip_address, lh.status
        FROM admin_login_history lh
        $whereSql
        ORDER BY lh.created_at DESC
    ";
    $stmt = $mysqli->prepare($sql);
    if ($stmt) {
        if ($types !== '') { $stmt->bind_param($types, ...$params); }
        if ($stmt->execute()) {
            $res = $stmt->get_result();
            while ($row = $res->fetch_assoc()) {
                $rows[] = $row;
            }
        }
        $stmt->close();
    }

} elseif ($reportType === 'sms') {
    $title = 'EcoPulse - SMS Send History';
    $subtitle = subtitle_for_range($from, $to);

    $whereParts = [];
    $types = '';
    $params = [];
    if ($fromStr) { $whereParts[] = 'created_at >= ?'; $types .= 's'; $params[] = $fromStr; }
    if ($toStr)   { $whereParts[] = 'created_at <= ?'; $types .= 's'; $params[] = $toStr;   }
    $whereSql = $whereParts ? ('WHERE ' . implode(' AND ', $whereParts)) : '';

    $sql = "
        SELECT created_at, mobile, provider, status, error, area_name, area_id, alert_id
        FROM sms_logs
        $whereSql
        ORDER BY created_at DESC
        LIMIT 500
    ";
    $stmt = $mysqli->prepare($sql);
    if ($stmt) {
        if ($types !== '') { $stmt->bind_param($types, ...$params); }
        if ($stmt->execute()) {
            $res = $stmt->get_result();
            while ($row = $res->fetch_assoc()) {
                $rows[] = $row;
            }
        }
        $stmt->close();
    }

} elseif ($reportType === 'public_users') {
    $title = 'EcoPulse - Public Users History';
    $subtitle = subtitle_for_range($from, $to);

    $whereParts = [];
    $types = '';
    $params = [];
    if ($fromStr) { $whereParts[] = 'created_at >= ?'; $types .= 's'; $params[] = $fromStr; }
    if ($toStr)   { $whereParts[] = 'created_at <= ?'; $types .= 's'; $params[] = $toStr;   }
    $whereSql = $whereParts ? ('WHERE ' . implode(' AND ', $whereParts)) : '';

    $sql = "
        SELECT created_at, username, email, contact_number, city, barangay
        FROM users
        $whereSql
        ORDER BY created_at DESC
        LIMIT 500
    ";
    $stmt = $mysqli->prepare($sql);
    if ($stmt) {
        if ($types !== '') { $stmt->bind_param($types, ...$params); }
        if ($stmt->execute()) {
            $res = $stmt->get_result();
            while ($row = $res->fetch_assoc()) {
                $rows[] = $row;
            }
        }
        $stmt->close();
    }

} elseif ($reportType === 'devices') {
    $title = 'EcoPulse - Devices Inventory';
    $subtitle = 'All registered devices';

    $sql = "
        SELECT
            id,
            name,
            device_code,
            COALESCE(barangay_id, '') AS barangay_id
        FROM devices
        ORDER BY name ASC, id ASC
    ";
    $res = $mysqli->query($sql);
    if ($res) {
        while ($row = $res->fetch_assoc()) {
            $rows[] = $row;
        }
        $res->close();
    }

} else {
    $title = 'EcoPulse - Report';
    $subtitle = 'Unknown report type.';
}

// ------------------ PDF Class with branded header/footer ------------------ //
class ReportPDF extends FPDF {
    public string $docTitle = '';
    public string $docSubtitle = '';
    public ?string $logoPath = null;

    function Header() {
        // Brand bar
        $this->SetFillColor(10, 77, 158); // Classic Blue
        $this->Rect(0, 0, $this->w, 24, 'F');

        // Logo
        $x = $this->lMargin;
        if ($this->logoPath && is_file($this->logoPath)) {
            $this->Image($this->logoPath, $x, 4, 16, 16);
            $x += 20;
        }

        $this->SetTextColor(255, 255, 255);
        $this->SetFont('Arial', 'B', 12);
        $this->SetXY($x, 6);
        $this->Cell(0, 6, pdf_text($this->docTitle), 0, 1, 'L');

        $this->SetFont('Arial', '', 10);
        $this->SetX($x);
        $this->Cell(0, 6, pdf_text($this->docSubtitle), 0, 1, 'L');

        // Reset text color and move below header
        $this->SetTextColor(0, 0, 0);
        $this->Ln(6);
    }

    function Footer() {
        $this->SetY(-12);
        $this->SetFont('Arial', '', 8);
        $this->SetTextColor(90, 98, 110);
        $this->Cell(0, 8, pdf_text('Page ' . $this->PageNo() . ' of {nb}'), 0, 0, 'C');
    }
}

// ------------------ PDF Rendering ------------------ //
$orientation = ($reportType === 'sms' || $reportType === 'aqi_reports') ? 'L' : 'P';
$pdf = new ReportPDF($orientation, 'mm', 'A4');
$pdf->SetAutoPageBreak(true, 15);
$pdf->SetAuthor('EcoPulse');
$pdf->AliasNbPages();
$pdf->SetMargins(15, 32, 15);
$pdf->docTitle = $title;
$pdf->docSubtitle = $subtitle;
$logoCandidate = __DIR__ . '/img/ecopulse_logo_final.png';
$pdf->logoPath = is_file($logoCandidate) ? $logoCandidate : null;
$pdf->AddPage();

add_heading($pdf, $title, $subtitle);

if (empty($rows)) {
    $pdf->SetFont('Arial', 'I', 10);
    $pdf->SetFillColor(255, 247, 230);
    $pdf->SetTextColor(120, 98, 56);
    $pdf->MultiCell(0, 10, pdf_text('No records found for the selected filters.'), 0, 'L', true);
    $pdf->Output('D', 'ecopulse-report.pdf');
    exit;
}

if ($reportType === 'aqi_reports') {
    $columns = [
        ['label' => 'Date',          'w' => 28, 'cb' => fn($r) => $r['report_date']],
        ['label' => 'Station',       'w' => 55, 'cb' => fn($r) => $r['station_name']],
        ['label' => 'Device',        'w' => 32, 'cb' => fn($r) => $r['device_code']],
        ['label' => 'Avg AQI',       'w' => 22, 'cb' => fn($r) => $r['avg_aqi'], 'align' => 'C', 'color_cb' => fn($r) => get_status_color($r['status'])],
        ['label' => 'Min',           'w' => 22, 'cb' => fn($r) => $r['min_aqi'], 'align' => 'C'],
        ['label' => 'Max',           'w' => 22, 'cb' => fn($r) => $r['max_aqi'], 'align' => 'C'],
        ['label' => 'Reads',         'w' => 24, 'cb' => fn($r) => $r['read_count'], 'align' => 'C'],
        ['label' => 'Status',        'w' => 32, 'cb' => fn($r) => $r['status']],
    ];
    render_table($pdf, $columns, $rows);

    // Summary strip
    $pdf->Ln(4);
    $pdf->SetFont('Arial', '', 10);
    $avgAqi = $globalTotalReads ? round($globalSumAqi / max(1, $globalTotalReads), 1) : 0;
    $summary = sprintf(
        'Totals: %d readings | Weighted Avg AQI: %s | Peak AQI: %s (%s)',
        $globalTotalReads,
        $avgAqi,
        $globalMaxAqi ?: '-',
        $globalMaxDevice ?: 'N/A'
    );
    $pdf->MultiCell(0, 8, pdf_text($summary), 0, 'L');

} elseif ($reportType === 'login_history') {
    $columns = [
        ['label' => 'Date & Time', 'w' => 55, 'cb' => fn($r) => $r['login_at']],
        ['label' => 'Username',    'w' => 55, 'cb' => fn($r) => $r['username']],
        ['label' => 'IP Address',  'w' => 50, 'cb' => fn($r) => $r['ip_address']],
        ['label' => 'Status',      'w' => 30, 'cb' => fn($r) => ucfirst(strtolower($r['status']))],
    ];
    render_table($pdf, $columns, $rows);

} elseif ($reportType === 'sms') {
    $columns = [
        ['label' => 'Date & Time', 'w' => 48, 'cb' => fn($r) => $r['created_at']],
        ['label' => 'Mobile',      'w' => 38, 'cb' => fn($r) => $r['mobile']],
        ['label' => 'Provider',    'w' => 32, 'cb' => fn($r) => $r['provider'] ?: 'N/A'],
        ['label' => 'Status',      'w' => 28, 'cb' => fn($r) => $r['status'] ?: 'unknown'],
        ['label' => 'Area',        'w' => 50, 'cb' => fn($r) => $r['area_name'] ?: ($r['area_id'] ? 'Barangay '.$r['area_id'] : 'N/A')],
        ['label' => 'Alert ID',    'w' => 28, 'cb' => fn($r) => $r['alert_id'] ?: '-', 'align' => 'C'],
        ['label' => 'Error',       'w' => 46, 'cb' => fn($r) => $r['error'] ?: '-'],
    ];
    render_table($pdf, $columns, $rows);

} elseif ($reportType === 'public_users') {
    $columns = [
        ['label' => 'Date Registered', 'w' => 36, 'cb' => fn($r) => $r['created_at']],
        ['label' => 'Username',        'w' => 36, 'cb' => fn($r) => $r['username']],
        ['label' => 'Email',           'w' => 60, 'cb' => fn($r) => $r['email']],
        ['label' => 'Contact',         'w' => 32, 'cb' => fn($r) => $r['contact_number']],
        ['label' => 'City',            'w' => 28, 'cb' => fn($r) => $r['city']],
        ['label' => 'Barangay',        'w' => 28, 'cb' => fn($r) => $r['barangay']],
    ];
    render_table($pdf, $columns, $rows);

} elseif ($reportType === 'devices') {
    $columns = [
        ['label' => 'ID',          'w' => 16, 'cb' => fn($r) => $r['id']],
        ['label' => 'Device Code', 'w' => 36, 'cb' => fn($r) => $r['device_code']],
        ['label' => 'Name',        'w' => 70, 'cb' => fn($r) => $r['name']],
        ['label' => 'Barangay',    'w' => 30, 'cb' => fn($r) => $r['barangay_id']],
    ];
    render_table($pdf, $columns, $rows);
}

$filenameSafe = 'ecopulse-' . $reportType . '-' . date('Ymd-His') . '.pdf';
$pdf->Output('D', $filenameSafe);
exit;
