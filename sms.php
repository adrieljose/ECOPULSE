<?php
require_once __DIR__ . '/session_bootstrap.php';
require_once __DIR__ . '/db.php';

$currentUserLabel = $_SESSION['username'] ?? '';
$currentRole = 'Guest';
$isAdmin = isset($_SESSION['admin']);
$isUser = isset($_SESSION['user']);
$isGuest = isset($_SESSION['guest']);

if ($isAdmin && $currentUserLabel === '') {
    try {
        $pdoHeader = db();
        $stmtHeader = $pdoHeader->prepare('SELECT username FROM admins WHERE id = :id LIMIT 1');
        $stmtHeader->execute([':id' => (int) $_SESSION['admin']]);
        $rowHeader = $stmtHeader->fetch(PDO::FETCH_ASSOC);
        if ($rowHeader && !empty($rowHeader['username'])) {
            $currentUserLabel = $rowHeader['username'];
        }
    } catch (Throwable $e) { /* ignore */ }
}

$isMasterAdmin = $isAdmin && (strtolower($currentUserLabel) === 'masteradmin');

if ($isAdmin) {
    $currentRole = $isMasterAdmin ? 'Master Admin' : 'Admin';
    $currentUserLabel = $currentUserLabel !== '' ? $currentUserLabel : $currentRole;
} elseif ($isUser) {
    $currentRole = 'Public User';
    $currentUserLabel = $currentUserLabel !== '' ? $currentUserLabel : 'User';
} elseif ($isGuest) {
    $currentRole = 'Guest';
    $currentUserLabel = $currentUserLabel !== '' ? $currentUserLabel : 'Guest';
} else {
    $currentUserLabel = $currentUserLabel !== '' ? $currentUserLabel : 'Guest';
}

if (!isset($_SESSION['admin'])) {
    header('Location: login.php?from=sms');
    exit;
}

$TWILIO_SID = getenv('TWILIO_SID') ?: '';    // e.g., 'ACxxxxxxxx...'
$TWILIO_TOKEN = getenv('TWILIO_TOKEN') ?: '';  // e.g., 'your_auth_token'
$TWILIO_FROM = getenv('TWILIO_FROM') ?: '+64';   // e.g., '+1234567890' (Twilio-verified number)
$USE_TWILIO = ($TWILIO_SID && $TWILIO_TOKEN && $TWILIO_FROM);

// Infobip (preferred)
$INFOBIP_BASE_URL = rtrim(getenv('INFOBIP_BASE_URL') ?: 'https://rp1lwl.api.infobip.com', '/');
$INFOBIP_API_KEY = getenv('INFOBIP_API_KEY') ?: '7864af3ef89ba9dc387e86ecb068acd3-dd70925e-1d40-473f-8e0c-0bf56b7d040b';
// Use approved Infobip sender (shortcode/number or alpha if allowed)
$INFOBIP_FROM = getenv('INFOBIP_FROM') ?: '447491163443';
$USE_INFOBIP = ($INFOBIP_BASE_URL && $INFOBIP_API_KEY && $INFOBIP_FROM);

// IPROG SMS (new default). Form-encoded API: requires api_token, phone_number, message; optional sms_provider (0|1|2).
$IPROG_BASE_URL = rtrim(getenv('IPROG_BASE_URL') ?: 'https://www.iprogsms.com/api/v1/sms_messages', '/');
$IPROG_API_TOKEN = '';
$tokenFile = __DIR__ . '/data/iprog_token.txt';
if (file_exists($tokenFile)) {
    $IPROG_API_TOKEN = trim((string) file_get_contents($tokenFile));
}
if ($IPROG_API_TOKEN === '') {
    $IPROG_API_TOKEN = getenv('IPROG_API_TOKEN') ?: '19d7d48ba32a2b9263c25e70d2cd932b0f9ce2e0';
}
$IPROG_SMS_PROVIDER = getenv('IPROG_SMS_PROVIDER') ?: null; // 0,1,2 per IPROG docs
$USE_IPROG = ($IPROG_BASE_URL && $IPROG_API_TOKEN);

$pdo = null;
try {
    $pdo = db();
} catch (Exception $e) {
    // Will handle gracefully later
}

$templateFile = __DIR__ . '/data/sms_templates.json';

$defaultTemplates = [
    [
        'id' => 'caution_alert',
        'label' => 'Caution Alert (Yellow)',
        'description' => 'For elevated pollution levels: caution residents and prepare barangay leaders for possible escalation.',
        'content' => '',
        'last_updated' => null
    ],
    [
        'id' => 'pollution_alert',
        'label' => 'Critical Alert (Red)',
        'description' => 'Primary alert template used when air quality reaches critical levels.',
        'content' => '',
        'last_updated' => null
    ]
];

$templatesById = [];
foreach ($defaultTemplates as $template) {
    $templatesById[$template['id']] = $template;
}

if (file_exists($templateFile)) {
    $loaded = json_decode(file_get_contents($templateFile), true);
    if (is_array($loaded)) {
        foreach ($loaded as $template) {
            if (!isset($template['id'])) {
                continue;
            }
            $id = $template['id'];
            $templatesById[$id] = array_merge($templatesById[$id] ?? [], $template);
        }
    }
}

$templates = array_values($templatesById);

// Clear message bodies when no saved content (or legacy defaults) so fields start blank
$legacyCaution = 'EcoPulse Caution: AQI at {aqi} in {area} ({aqi_category}). Limit outdoor activity, wear masks if outside, and monitor LGU updates. Reply STOP to unsubscribe.';
$legacyCritical = 'EcoPulse Alert: AQI reached {aqi} in {area} ({aqi_category}). Stay indoors, seal windows, and follow LGU advisories. Reply STOP to unsubscribe.';
foreach ($templates as &$tpl) {
    if (empty($tpl['last_updated']) || in_array($tpl['content'] ?? '', [$legacyCaution, $legacyCritical], true)) {
        $tpl['content'] = '';
    }
}
unset($tpl);
$successMessage = null;
$contactSuccess = null;
$contactError = null;
$editSuccess = null;
$editError = null;
$deleteSuccess = null;
$deleteError = null;
$contactAge = null;
$editAge = null;
$sendMessage = null;
$errors = [];
$sendErrors = [];
$sendResults = [];
$availableAreas = [];
$allDevices = [];
$areaMap = [];
$filterBarangay = isset($_GET['barangay']) ? (int) $_GET['barangay'] : 0;
if ($pdo) {
    try {
        $availableAreas = $pdo->query("SELECT id, name FROM barangays ORDER BY name")->fetchAll(PDO::FETCH_ASSOC);
        foreach ($availableAreas as $a) {
            $areaMap[(int)$a['id']] = $a['name'];
        }
        // Ensure barangay list includes Himamaylan's 19 barangays (idempotent seed)
        $himamaylanBarangays = [
            'Aguisan', 'Buenavista', 'Cabadiangan', 'Cabanbanan', 'Carabalan',
            'Libacao', 'Nabali-an', 'San Antonio', 'San Isidro', 'Sara-et',
            'Su-ay', 'Talaban', 'Talubangi', 'Tooy', 'Mambagaton',
            'Barangay 1 (Poblacion)', 'Barangay 2 (Poblacion)', 'Barangay 3 (Poblacion)', 'Barangay 4 (Poblacion)'
        ];
        if (count($availableAreas) < 19) {
            $pdo->beginTransaction();
            $stmt = $pdo->prepare("INSERT IGNORE INTO barangays (name) VALUES (:name)");
            foreach ($himamaylanBarangays as $bname) {
                $stmt->execute([':name' => $bname]);
            }
            $pdo->commit();
            $availableAreas = $pdo->query("SELECT id, name FROM barangays ORDER BY name")->fetchAll(PDO::FETCH_ASSOC);
            $areaMap = [];
            foreach ($availableAreas as $a) {
                $areaMap[(int)$a['id']] = $a['name'];
            }
        }
        try { $pdo->exec("ALTER TABLE subscribers ADD COLUMN age TINYINT UNSIGNED NULL"); } catch (Exception $e) { /* ignore */ }
        try { $pdo->exec("ALTER TABLE subscribers ADD COLUMN role VARCHAR(50) NULL"); } catch (Exception $e) { /* ignore */ }
        try { $pdo->exec("ALTER TABLE subscribers ADD COLUMN birthday DATE NULL"); } catch (Exception $e) { /* ignore */ }
        try { $pdo->exec("ALTER TABLE subscribers ADD COLUMN city VARCHAR(100) NULL"); } catch (Exception $e) { /* ignore */ }
        try { $pdo->exec("ALTER TABLE subscribers ADD COLUMN province VARCHAR(100) NULL"); } catch (Exception $e) { /* ignore */ }
        try { $pdo->exec("ALTER TABLE subscribers ADD COLUMN device_id INT UNSIGNED NULL, ADD INDEX idx_device_id (device_id)"); } catch (Exception $e) { /* ignore */ }
        try {
            $pdo->exec("
                CREATE TABLE IF NOT EXISTS sms_logs (
                    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
                    mobile VARCHAR(32) NOT NULL,
                    message TEXT NOT NULL,
                    provider VARCHAR(32) DEFAULT NULL,
                    status VARCHAR(16) DEFAULT NULL,
                    error TEXT NULL,
                    area_id INT NULL,
                    area_name VARCHAR(255) NULL,
                    alert_id INT NULL,
                    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                    INDEX idx_mobile (mobile),
                    INDEX idx_area (area_id),
                    INDEX idx_created_at (created_at)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
            ");
        } catch (Exception $e) { /* ignore */ }
    } catch (Exception $e) {
        // fallback to empty list if query fails
        $availableAreas = [];
    }
}

// Add contact flow
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['add_contact'])) {
    $contactName = trim($_POST['contact_name'] ?? '');
    $contactMobile = trim($_POST['contact_mobile'] ?? '');
    $contactProvince = trim($_POST['contact_province'] ?? '');
    $contactCity = trim($_POST['contact_city'] ?? '');
    $contactAreaRaw = trim($_POST['contact_area'] ?? '');
    $contactAge = isset($_POST['contact_age']) ? (int) $_POST['contact_age'] : null;
    $contactRole = trim($_POST['contact_role'] ?? '');
    $contactBirthday = !empty($_POST['contact_birthday']) ? $_POST['contact_birthday'] : null;
    $contactDeviceId = isset($_POST['contact_device_id']) ? (int) $_POST['contact_device_id'] : 0;

    if ($contactName === '' || $contactMobile === '' || $contactProvince === '' || $contactCity === '' || $contactAreaRaw === '' || $contactAge === null || $contactRole === '') {
        $contactError = 'Please provide name, mobile number, province, city/municipality, area, age, and role.';
    } elseif (!preg_match('/^\\d{11}$/', $contactMobile)) {
        $contactError = 'Mobile number must be exactly 11 digits.';
    } elseif ($contactAge < 1 || $contactAge > 120) {
        $contactError = 'Age must be between 1 and 120.';
    } elseif (!$pdo) {
        $contactError = 'Database unavailable. Please try again.';
    } else {
        try {
            $normalizedMobile = $contactMobile;
            $contactAreaId = 0;
            if (ctype_digit($contactAreaRaw)) {
                $contactAreaId = (int)$contactAreaRaw;
            } else {
                $areaName = trim($contactAreaRaw);
                if ($areaName !== '') {
                    $stmt = $pdo->prepare("SELECT id FROM barangays WHERE name = :n LIMIT 1");
                    $stmt->execute([':n' => $areaName]);
                    $row = $stmt->fetch(PDO::FETCH_ASSOC);
                    if ($row) {
                        $contactAreaId = (int)$row['id'];
                    } else {
                        $ins = $pdo->prepare("INSERT INTO barangays (name) VALUES (:n)");
                        $ins->execute([':n' => $areaName]);
                        $contactAreaId = (int)$pdo->lastInsertId();
                    }
                }
            }
            if ($contactAreaId <= 0) {
                throw new Exception('Please select an area.');
            }
            // Auto-map to device covering this barangay if not explicitly provided
            if ($contactDeviceId <= 0) {
                $devLookup = $pdo->prepare("SELECT id FROM devices WHERE barangay_id = :bid ORDER BY name LIMIT 1");
                $devLookup->execute([':bid' => $contactAreaId]);
                $drow = $devLookup->fetch(PDO::FETCH_ASSOC);
                $contactDeviceId = $drow ? (int)$drow['id'] : null;
            }

            $stmt = $pdo->prepare("INSERT INTO subscribers (full_name, mobile, province, city, barangay_id, device_id, age, role, birthday, subscribed_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())");
            if ($stmt->execute([$contactName, $normalizedMobile, $contactProvince, $contactCity, $contactAreaId, $contactDeviceId, $contactAge, $contactRole, $contactBirthday])) {
                
                if (isset($_POST['is_ajax'])) {
                    if (ob_get_length()) ob_clean();
                    header('Content-Type: application/json');
                    $newId = $pdo->lastInsertId();
                    
                    // Render the row HTML to return
                    // Note: We need to match the table structure exactly.
                     $rowHtml = '<tr class="align-middle reveal-show" style="background-color: #d1e7dd;">
                        <td class="ps-4">'.htmlspecialchars($contactName).'</td>
                        <td>'.htmlspecialchars($normalizedMobile).'</td>
                        <td>'.htmlspecialchars($contactRole).'</td>
                        <td>'.htmlspecialchars((string)$contactAge).'</td>
                        <td>'.htmlspecialchars($contactProvince).'</td>
                        <td>'.htmlspecialchars($contactCity).'</td>
                        <td>'.htmlspecialchars($areaName ?? $contactAreaRaw).'</td>
                        <td class="text-end pe-4 text-muted small">Just now</td>
                        <td class="text-end pe-4">
                            <div class="d-inline-flex gap-2">
                                <a href="sms.php?edit_id='.(int)$newId.'&order='.urlencode($order ?? '').'&barangay='.(int)($filterBarangay ?? 0).'" class="btn btn-sm btn-outline-primary">Edit</a>
                                <form method="post" onsubmit="return confirm(\'Delete this subscriber?\');" class="d-inline">
                                    <input type="hidden" name="subscriber_id" value="'.(int)$newId.'">
                                    <input type="hidden" name="order" value="'.htmlspecialchars($order ?? 'newest').'">
                                    <input type="hidden" name="barangay" value="'.(int)($filterBarangay ?? 0).'">
                                    <button type="submit" name="delete_subscriber" value="1" class="btn btn-sm btn-outline-danger">Delete</button>
                                </form>
                            </div>
                        </td>
                     </tr>';

                    echo json_encode(['success' => true, 'message' => 'Contact added successfully!', 'html' => $rowHtml]);
                    exit;
                }

                $contactSuccess = 'Contact added successfully.';
                
                // Log Activity
                require_once __DIR__ . '/lib/activity_logger.php';
                logActivity($pdo, ($isAdmin ? 'admin' : 'user'), $_SESSION['admin'] ?? $_SESSION['user'], 'Add Contact', "Added contact: $contactName ($normalizedMobile)", 'SMS');

            } else {
                throw new Exception('DB Error: Failed to execute insert.');
            }
        } catch (Exception $e) {
            $msg = 'Failed to add contact: ' . htmlspecialchars($e->getMessage());
            if (isset($_POST['is_ajax'])) {
                if (ob_get_length()) ob_clean();
                header('Content-Type: application/json');
                echo json_encode(['success' => false, 'error' => $msg]);
                exit;
            }
            $contactError = $msg;
        }
    }
}

// Edit subscriber flow
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['edit_subscriber'])) {
    $editId = (int) ($_POST['subscriber_id'] ?? 0);
    $name = trim($_POST['edit_name'] ?? '');
    $mobile = trim($_POST['edit_mobile'] ?? '');
    $province = trim($_POST['edit_province'] ?? '');
    $city = trim($_POST['edit_city'] ?? '');
    $areaRaw = trim($_POST['edit_area'] ?? '');
    $editAge = isset($_POST['edit_age']) ? (int) $_POST['edit_age'] : null;
    $editRole = trim($_POST['edit_role'] ?? '');
    $editBirthday = !empty($_POST['edit_birthday']) ? $_POST['edit_birthday'] : null;
    $editDeviceId = isset($_POST['edit_device_id']) ? (int) $_POST['edit_device_id'] : 0;
    $existingDeviceId = null;

    if ($editId <= 0 || $name === '' || $mobile === '' || $province === '' || $city === '' || $areaRaw === '' || $editAge === null || $editRole === '') {
        $editError = 'Please provide name, mobile number, province, city/municipality, area, age, and role.';
    } elseif (!preg_match('/^\\d{11}$/', $mobile)) {
        $editError = 'Mobile number must be exactly 11 digits.';
    } elseif ($editAge < 1 || $editAge > 120) {
        $editError = 'Age must be between 1 and 120.';
    } elseif (!$pdo) {
        $editError = 'Database unavailable. Please try again.';
    } else {
        $normalizedMobile = $mobile;
        try {
            $existingStmt = $pdo->prepare("SELECT device_id FROM subscribers WHERE id = :id LIMIT 1");
            $existingStmt->execute([':id' => $editId]);
            $existingDeviceId = $existingStmt->fetchColumn();
            $areaId = 0;
            if (ctype_digit($areaRaw)) {
                $areaId = (int)$areaRaw;
            } else {
                $areaName = trim($areaRaw);
                if ($areaName !== '') {
                    $stmt = $pdo->prepare("SELECT id FROM barangays WHERE name = :n LIMIT 1");
                    $stmt->execute([':n' => $areaName]);
                    $row = $stmt->fetch(PDO::FETCH_ASSOC);
                    if ($row) {
                        $areaId = (int)$row['id'];
                    } else {
                        $ins = $pdo->prepare("INSERT INTO barangays (name) VALUES (:n)");
                        $ins->execute([':n' => $areaName]);
                        $areaId = (int)$pdo->lastInsertId();
                    }
                }
            }
            if ($areaId <= 0) {
                throw new Exception('Please select an area.');
            }
            if ($editDeviceId <= 0) {
                // Re-map to device covering this barangay
                $devLookup = $pdo->prepare("SELECT id FROM devices WHERE barangay_id = :bid ORDER BY name LIMIT 1");
                $devLookup->execute([':bid' => $areaId]);
                $drow = $devLookup->fetch(PDO::FETCH_ASSOC);
                $editDeviceId = $drow ? (int)$drow['id'] : 0;
            }
            if ($editDeviceId <= 0 && $existingDeviceId !== null) {
                $editDeviceId = (int) $existingDeviceId;
            }

            $stmt = $pdo->prepare("UPDATE subscribers SET full_name = :n, mobile = :m, province = :p, city = :c, barangay_id = :b, device_id = :did, age = :a, role = :r, birthday = :bd WHERE id = :id LIMIT 1");
            $stmt->execute([
                ':n' => $name,
                ':m' => $normalizedMobile,
                ':p' => $province,
                ':c' => $city,
                ':b' => $areaId,
                ':did' => $editDeviceId > 0 ? $editDeviceId : null,
                ':a' => $editAge,
                ':r' => $editRole,
                ':bd' => $editBirthday,
                ':id' => $editId,
            ]);
            $editSuccess = 'Subscriber updated successfully.';
            $editSubscriber = null;
        } catch (Exception $e) {
            $editError = 'Failed to update subscriber: ' . htmlspecialchars($e->getMessage());
        }
    }
}

// Delete subscriber flow
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['delete_subscriber'])) {
    $deleteId = (int) ($_POST['subscriber_id'] ?? 0);
    $errorMsg = null;
    
    if ($deleteId <= 0) {
        $errorMsg = 'Invalid subscriber selected.';
    } elseif (!$pdo) {
        $errorMsg = 'Database unavailable. Please try again.';
    } else {
        try {
            $stmt = $pdo->prepare("DELETE FROM subscribers WHERE id = :id LIMIT 1");
            $stmt->execute([':id' => $deleteId]);
            $deleteSuccess = 'Subscriber deleted.';
            
            // Log Activity
            require_once __DIR__ . '/lib/activity_logger.php';
            logActivity($pdo, ($isAdmin ? 'admin' : 'user'), $_SESSION['admin'] ?? $_SESSION['user'], 'Delete Contact', "Deleted subscriber ID: $deleteId", 'SMS');

            
            if (isset($_POST['is_ajax'])) {
                 if (ob_get_length()) ob_clean();
                 header('Content-Type: application/json');
                 echo json_encode(['success' => true, 'message' => 'Subscriber deleted successfully.']);
                 exit;
            }
        } catch (Exception $e) {
            $errorMsg = 'Failed to delete subscriber: ' . htmlspecialchars($e->getMessage());
        }
    }
    
    if ($errorMsg) {
        if (isset($_POST['is_ajax'])) {
             if (ob_get_length()) ob_clean();
             header('Content-Type: application/json');
             echo json_encode(['success' => false, 'error' => $errorMsg]);
             exit;
        }
        $deleteError = $errorMsg;
    }
}

// Load subscribers for listing
$order = $_GET['order'] ?? 'newest';
$orderSql = 's.subscribed_at DESC';
if ($order === 'name_asc') {
    $orderSql = 's.full_name ASC';
} elseif ($order === 'name_desc') {
    $orderSql = 's.full_name DESC';
} elseif ($order === 'area_asc') {
    $orderSql = 'b.name ASC, s.full_name ASC';
}
$subscribers = [];
$editSubscriber = null;
if ($pdo) {
    try {
        $where = '';
        $params = [];
        if ($filterBarangay > 0) {
            $where = 'WHERE s.barangay_id = :bid';
            $params[':bid'] = $filterBarangay;
        }
        $stmt = $pdo->prepare("
            SELECT s.id, s.full_name, s.mobile, s.province, s.city, s.subscribed_at, b.name AS area, s.barangay_id, s.device_id, s.age, s.role, s.birthday
            FROM subscribers s
            LEFT JOIN barangays b ON b.id = s.barangay_id
            {$where}
            ORDER BY {$orderSql}
        ");
        $stmt->execute($params);
        $subscribers = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Group by Device (Context: User Request for "Device Coverage" card)
        $deviceGroups = [];
        $devStmt = $pdo->query("SELECT d.id, d.name, d.barangay_id, d.lat, d.lng, b.name as barangay_name, b.city, b.province FROM devices d LEFT JOIN barangays b ON b.id = d.barangay_id ORDER BY d.name");
        $allDevices = $devStmt->fetchAll(PDO::FETCH_ASSOC);
        
        foreach ($allDevices as $dev) {
            $bid = $dev['barangay_id'];
            // If filter is active, only show if match
            if ($filterBarangay > 0 && $bid != $filterBarangay) continue;

            $devSubs = array_filter($subscribers, function($s) use ($bid, $dev) {
                $byDevice = isset($s['device_id']) && (int)$s['device_id'] === (int)$dev['id'];
                $byBarangay = (int)$s['barangay_id'] === (int)$bid;
                return $byDevice || $byBarangay;
            });
            $deviceGroups[] = [
                'device_id' => $dev['id'],
                'device_name' => $dev['name'],
                'barangay_name' => $dev['barangay_name'] ?: 'Device',
                'city' => $dev['city'],
                'province' => $dev['province'],
                'barangay_id' => $dev['barangay_id'],
                'lat' => $dev['lat'],
                'lng' => $dev['lng'],
                'subscribers' => $devSubs
            ];
        }

        if (isset($_GET['edit_id'])) {
            $editId = (int) $_GET['edit_id'];
            if ($editId > 0) {
                $sstmt = $pdo->prepare("SELECT id, full_name, mobile, province, city, barangay_id, device_id, age, role, birthday FROM subscribers WHERE id = :id LIMIT 1");
                $sstmt->execute([':id' => $editId]);
                $editSubscriber = $sstmt->fetch(PDO::FETCH_ASSOC) ?: null;
            }
        }
    } catch (Exception $e) { /* ignore */ }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['save_templates'])) {
    $submitted = $_POST['templates'] ?? [];
    foreach ($templates as &$template) {
        $id = $template['id'];
        if (!isset($submitted[$id])) {
            continue;
        }
        $content = trim($submitted[$id]['content'] ?? '');
        if ($content === '') {
            $errors[] = sprintf('The message for "%s" cannot be empty.', $template['label']);
            continue;
        }
        $length = function_exists('mb_strlen') ? mb_strlen($content, 'UTF-8') : strlen($content);
        if ($length > 320) {
            $errors[] = sprintf(
                'The message for "%s" is %d characters long. Please keep it at 320 characters or less for reliable SMS delivery.',
                $template['label'],
                $length
            );
            continue;
        }
        $template['content'] = $content;
        $template['last_updated'] = date('c');
    }
    unset($template);

    if (!$errors) {
        $encoded = json_encode($templates, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
        if ($encoded === false) {
            $errors[] = 'Unable to encode the templates to JSON: ' . json_last_error_msg();
        } else {
            $bytesWritten = @file_put_contents($templateFile, $encoded, LOCK_EX);
            if ($bytesWritten === false) {
                $errors[] = 'Failed to save the SMS templates. Please check file permissions.';
            } else {
                $successMessage = 'SMS message templates updated successfully.';
                
                // Log Activity
                require_once __DIR__ . '/lib/activity_logger.php';
                logActivity($pdo, ($isAdmin ? 'admin' : 'user'), $_SESSION['admin'] ?? $_SESSION['user'], 'Update Templates', 'Updated SMS templates', 'SMS');
            }
        }
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['send_alert'])) {
    $areaId = isset($_POST['alert_area']) ? (int)$_POST['alert_area'] : 0;
    $areaName = $areaMap[$areaId] ?? null;

    if (!$areaId || !$areaName) {
        $sendErrors[] = 'Please select an area to alert.';
    }

    if (!$sendErrors) {
        // Build message from the single Pollution Alert template
        $pollutionTemplate = $templatesById['pollution_alert']['content'] ?? 'EcoPulse Alert: AQI reached {aqi} in {area} ({aqi_category}).';
        $message = strtr($pollutionTemplate, [
            '{area}' => $areaName,
            '{aqi}' => '--',
            '{aqi_category}' => 'Critical'
        ]);

        // Resolve target device for this area to scope recipients to the correct coverage group
        $targetDeviceId = null;
        try {
            $dstmt = $pdo->prepare("SELECT id FROM devices WHERE barangay_id = ? ORDER BY name LIMIT 1");
            $dstmt->execute([$areaId]);
            $drow = $dstmt->fetch(PDO::FETCH_ASSOC);
            if ($drow) {
                $targetDeviceId = (int)$drow['id'];
            }
        } catch (Exception $e) { /* ignore device lookup */ }

        // Fetch subscribers scoped to the device coverage (device match first, otherwise fallback to barangay)
        try {
            if (!$pdo) {
                $pdo = db();
            }
            if ($targetDeviceId !== null) {
                $stmt = $pdo->prepare("SELECT mobile FROM subscribers WHERE device_id = ? OR (device_id IS NULL AND barangay_id = ?)");
                $stmt->execute([$targetDeviceId, $areaId]);
            } else {
                $stmt = $pdo->prepare("SELECT mobile FROM subscribers WHERE barangay_id = ?");
                $stmt->execute([$areaId]);
            }
            $mobiles = $stmt->fetchAll(PDO::FETCH_COLUMN);
        } catch (Exception $e) {
            $sendErrors[] = 'Database error while loading subscribers: ' . htmlspecialchars($e->getMessage());
            $mobiles = [];
        }

        if (!$sendErrors && empty($mobiles)) {
            $sendErrors[] = "No subscribers found for {$areaName}.";
        }

        if (!$sendErrors) {
            $providerLabel = $USE_IPROG ? 'IPROG' : ($USE_INFOBIP ? 'Infobip' : ($USE_TWILIO ? 'Twilio' : 'Textbelt'));
            foreach ($mobiles as $mobile) {
                if ($USE_IPROG) {
                    $resp = send_sms_iprog($mobile, $message, $IPROG_BASE_URL, $IPROG_API_TOKEN, $IPROG_SMS_PROVIDER);
                } elseif ($USE_INFOBIP) {
                    $resp = send_sms_infobip($mobile, $message, $INFOBIP_BASE_URL, $INFOBIP_API_KEY, $INFOBIP_FROM);
                } elseif ($USE_TWILIO) {
                    $resp = send_sms_twilio($mobile, $message, $TWILIO_SID, $TWILIO_TOKEN, $TWILIO_FROM);
                } else {
                    $resp = send_sms_textbelt($mobile, $message); // free, limited to 1/day
                }
                $sendResults[] = ['mobile' => $mobile, 'response' => $resp];
                $ok = !empty($resp['success']);
                $errMsg = $resp['error']
                    ?? ($resp['statusDescription'] ?? null)
                    ?? ($resp['providerMessage'] ?? null)
                    ?? ($resp['status'] ?? null)
                    ?? ($resp['response']['messages'][0]['status']['description'] ?? null)
                    ?? ($resp['response'] ?? null)
                    ?? '';
                log_sms_send($pdo, $mobile, $message, $providerLabel, $ok ? 'sent' : 'failed', $errMsg, $areaId, $areaName, null);
            }
            $successCount = count(array_filter($sendResults, fn($r) => !empty($r['response']['success'])));
            $attempted = count($sendResults);
            if ($successCount > 0) {
                $providerLabel = $USE_IPROG ? 'IPROG' : ($USE_INFOBIP ? 'Infobip' : ($USE_TWILIO ? 'Twilio' : 'Textbelt free key (1 SMS/day)'));
                $sendMessage = "Sent to {$successCount} of {$attempted} subscriber(s) for {$areaName} using {$providerLabel}.";
            }
            if ($successCount < $attempted) {
                $failed = array_filter($sendResults, fn($r) => empty($r['response']['success']));
                $sample = array_slice($failed, 0, 3);
                $details = implode('; ', array_map(function ($f) {
                    $resp = $f['response'];
                    $err = $resp['error']
                        ?? ($resp['quotaRemaining'] ?? null)
                        ?? ($resp['status'] ?? null)
                        ?? ($resp['statusGroup'] ?? null)
                        ?? ($resp['statusDescription'] ?? null)
                        ?? ($resp['providerMessage'] ?? null)
                        ?? ($resp['response']['status'] ?? null)
                        ?? ($resp['response']['message'] ?? null)
                        ?? ($resp['response']['messages'][0]['status']['description'] ?? null)
                        ?? ($resp['http'] ?? 'failed');
                    return $f['mobile'] . ' => ' . (is_array($err) ? json_encode($err) : $err);
                }, $sample));
                $sendErrors[] = "Failed to send to " . ($attempted - $successCount) . " subscriber(s). Sample: " . $details;
            }
        }
    }
}

/**
 * Minimal Textbelt sender (free key: 1 SMS/day, best-effort delivery)
 */
function send_sms_textbelt(string $phone, string $message): array
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

/**
 * IPROG SMS sender (form-encoded API)
 */
function send_sms_iprog(string $to, string $body, string $baseUrl, string $token, ?string $smsProvider = null): array
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

/**
 * Infobip SMS sender (API key auth)
 */
function send_sms_infobip(string $to, string $body, string $baseUrl, string $apiKey, string $from): array
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
    $statusDesc = $decoded['messages'][0]['status']['description'] ?? null;
    $isHardFail = in_array($statusGroup, ['REJECTED', 'UNDELIVERABLE', 'INVALID'], true);
    $ok = ($http >= 200 && $http < 300 && $statusGroup && !$isHardFail);
    return [
        'success' => $ok,
        'http' => $http,
        'statusGroup' => $statusGroup,
        'statusDescription' => $statusDesc,
        'response' => $decoded ?? $resp
    ];
}

/**
 * Minimal Twilio sender (requires valid SID, token, and from number)
 */
function send_sms_twilio(string $to, string $body, string $sid, string $token, string $from): array
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

/**
 * Log an SMS attempt to sms_logs (best-effort)
 */
function log_sms_send(?PDO $pdo, string $mobile, string $message, ?string $provider, string $status, ?string $error, ?int $areaId = null, ?string $areaName = null, ?int $alertId = null): void
{
    if (!$pdo) {
        return;
    }
    try {
        $stmt = $pdo->prepare("
            INSERT INTO sms_logs (mobile, message, provider, status, error, area_id, area_name, alert_id)
            VALUES (:mobile, :message, :provider, :status, :error, :area_id, :area_name, :alert_id)
        ");
        $stmt->execute([
            ':mobile' => $mobile,
            ':message' => $message,
            ':provider' => $provider,
            ':status' => $status,
            ':error' => $error,
            ':area_id' => $areaId,
            ':area_name' => $areaName,
            ':alert_id' => $alertId,
        ]);
    } catch (Throwable $e) {
        // ignore logging failures
    }
}

function formatTimestamp(?string $timestamp): string
{
    if (!$timestamp) {
        return 'Never';
    }
    $dt = date_create($timestamp);
    if (!$dt) {
        return 'Unknown';
    }
    return $dt->format('F j, Y g:i A');
}

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SMS Templates - EcoPulse</title>

    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">

    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css" integrity="sha512-SnH5WK+bZxgPHs44uWIX+LLJAJ9/2PkPKZ5QiAj6Ta86w+fsb2TkcmfRyVX3pBnMFcV7oQPJkl9QevSCWr3W6A==" crossorigin="anonymous" referrerpolicy="no-referrer" />

    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">

    <!-- Custom CSS -->
    <link rel="stylesheet" href="css/style.css">
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
    <!-- Mobile Header -->
    <header class="mobile-header">
        <a href="index.php" class="mobile-brand">
            <img src="img/ecopulse_logo_final.png" alt="EcoPulse"> EcoPulse
        </a>
        <button class="mobile-menu-btn" id="mobileMenuBtn">
            <i class="fa-solid fa-bars"></i>
        </button>
    </header>
    <div class="sidebar-overlay" id="sidebarOverlay"></div>

        <!-- Sidebar Navigation -->
        <!-- Sidebar Navigation -->
        <?php include 'sidebar.php'; ?>

        <div class="sidebar-overlay" id="sidebarOverlay"></div>

        <!-- Main Content -->
        <main class="p-4 main-content">
            <header class="mb-4 d-flex justify-content-between align-items-center reveal">
            <div class="gap-3 d-flex align-items-center">
                    <span class="page-title-icon"><i class="fa-solid fa-comment-dots"></i></span>
                    <h1 class="mb-0 h2 fw-bold">SMS Message Templates</h1>
            </div>
                <div class="header-actions d-flex align-items-center gap-3">
                    <!-- Compact Clock -->
                    <div class="d-none d-xl-flex align-items-center text-muted small pe-2 gap-2">
                         <i class="fa-regular fa-clock"></i>
                         <span id="clockTime" class="fw-medium text-dark">--:--</span>
                         <span id="clockDate" class="d-none">---</span>
                    </div>

                    <div class="vr bg-secondary opacity-25 d-none d-xl-block" style="width: 1px; min-height: 24px;"></div>

                    <!-- User Menu -->
                    <div class="dropdown">
                        <button class="header-user-menu d-flex align-items-center gap-2" type="button" data-bs-toggle="dropdown" aria-expanded="false" style="background: white; border: 1px solid #e0e0e0; padding: 6px 12px; border-radius: 50px; cursor: pointer;">
                            <div class="header-avatar bg-primary text-white fw-bold d-flex align-items-center justify-content-center rounded-circle" style="width: 32px; height: 32px; font-size: 0.9rem;">
                                <?= htmlspecialchars(substr($currentUserLabel, 0, 1)) ?: 'U' ?>
                            </div>
                            <span class="fw-bold text-dark small pe-1 d-none d-xl-block"><?= htmlspecialchars($currentUserLabel) ?></span>
                            <i class="fa-solid fa-chevron-down text-muted d-none d-xl-block" style="font-size: 0.7rem;"></i>
                        </button>
                        <ul class="dropdown-menu dropdown-menu-end shadow-sm border-0 mt-2 rounded-3">
                            <li><a class="dropdown-item rounded-2" href="profile.php"><i class="fa-solid fa-user me-2 text-muted"></i>Profile</a></li>
                            <li><hr class="dropdown-divider my-1"></li>
                            <li><a class="dropdown-item text-danger rounded-2" href="logout.php"><i class="fa-solid fa-right-from-bracket me-2"></i>Sign Out</a></li>
                        </ul>
                    </div>
                </div>
            </header>

            <section class="sms-page-intro reveal">
                <div class="mb-4 shadow-sm card">
                    <div class="card-body d-flex flex-column flex-lg-row align-items-lg-center">
                        <div class="mb-3 sms-intro-icon me-lg-4 mb-lg-0">
                            <span data-feather="smartphone"></span>
                        </div>
                        <div>
                            <h5 class="mb-2">Craft clear guidance for the public</h5>
                            <p class="mb-3 text-muted">Update the preset messages that go out when EcoPulse triggers SMS alerts. Keep them concise, actionable, and include placeholders so residents know what to do.</p>
                            <div class="sms-placeholder-note">

                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Add Contact -->
            <section class="mb-4 reveal" id="addContactForm">
                <div class="shadow-sm card h-100 border-0">
                    <?php if ($editSubscriber): ?>
                        <div class="card-header bg-white py-3 d-flex justify-content-between align-items-center">
                            <h5 class="mb-0 text-primary"><i class="fa-solid fa-user-pen me-2"></i>Edit Subscriber</h5>
                        </div>
                        <div class="card-body p-4">
                            <form method="post" class="row g-3">
                                <input type="hidden" name="edit_subscriber" value="1">
                                <input type="hidden" name="subscriber_id" value="<?= (int)$editSubscriber['id'] ?>">
                                <input type="hidden" name="order" value="<?= htmlspecialchars($order) ?>">
                                <input type="hidden" name="barangay" value="<?= (int)$filterBarangay ?>">
                                <div class="col-md-4">
                                    <label class="form-label">Full name</label>
                                    <input type="text" name="edit_name" class="form-control" value="<?= htmlspecialchars($editSubscriber['full_name'] ?? '') ?>" required>
                                </div>
                                <div class="col-md-3">
                                    <label class="form-label">Mobile number</label>
                                    <input type="text" name="edit_mobile" class="form-control" value="<?= htmlspecialchars($editSubscriber['mobile'] ?? '') ?>" pattern="[0-9]{11}" inputmode="numeric" minlength="11" maxlength="11" oninput="this.value=this.value.replace(/[^0-9]/g, '').slice(0,11);" required>
                                    <small class="text-muted">Exactly 11 digits.</small>
                                </div>
                                <div class="col-md-2">
                                    <label class="form-label">Age</label>
                                    <input type="number" name="edit_age" class="form-control" min="1" max="120" value="<?= htmlspecialchars($editSubscriber['age'] ?? '') ?>" required>
                                </div>
                                <div class="col-md-3">
                                    <label class="form-label">Province</label>
                                    <select name="edit_province" id="editProvince" class="form-select" required data-selected-province="<?= htmlspecialchars($editSubscriber['province'] ?? '') ?>">
                                        <option value="">Loading...</option>
                                    </select>
                                </div>
                                <div class="col-md-12"></div>
                                <div class="col-md-3">
                                    <label class="form-label">City / Municipality</label>
                                    <select name="edit_city" id="editCity" class="form-select" required data-selected-city="<?= htmlspecialchars($editSubscriber['city'] ?? '') ?>" disabled>
                                        <option value="">Select province first</option>
                                    </select>
                                </div>
                                <div class="col-md-12"></div>
                                <div class="col-md-4">
                                    <label class="form-label">Area (Barangay)</label>
                                    <select name="edit_area" id="editArea" class="form-select" required disabled>
                                        <option value="">Select city first</option>
                                        <?php foreach ($availableAreas as $areaOption): ?>
                                            <option data-fallback="1" value="<?= htmlspecialchars($areaOption['id']) ?>" <?= ((int)$editSubscriber['barangay_id'] === (int)$areaOption['id']) ? 'selected' : '' ?>>
                                                <?= htmlspecialchars($areaOption['name']) ?>
                                            </option>
                                        <?php endforeach; ?>
                                    </select>
                                </div>
                                <div class="col-md-4">
                                    <label class="form-label">Device (Coverage)</label>
                                    <select name="edit_device_id" class="form-select">
                                        <option value="0">Auto (based on area)</option>
                                        <?php foreach ($allDevices as $dev): ?>
                                            <?php
                                                $deviceLabel = $dev['name'] ?? 'Device';
                                                $deviceArea = $dev['barangay_name'] ?? '';
                                                $optionLabel = $deviceArea !== '' ? "{$deviceLabel} — {$deviceArea}" : $deviceLabel;
                                            ?>
                                            <option value="<?= (int) $dev['id'] ?>" <?= ((int)($editSubscriber['device_id'] ?? 0) === (int)$dev['id']) ? 'selected' : '' ?>>
                                                <?= htmlspecialchars($optionLabel) ?>
                                            </option>
                                        <?php endforeach; ?>
                                    </select>
                                </div>
                                <div class="col-md-4">
                                    <label class="form-label">Role</label>
                                    <select name="edit_role" class="form-select" required>
                                        <option value="">Select role</option>
                                        <?php
                                            $roles = ['Kagawad', 'Brgy. Captain'];
                                            $currentRoleVal = $editSubscriber['role'] ?? '';
                                            if ($currentRoleVal && !in_array($currentRoleVal, $roles, true)) {
                                                echo '<option value="'.htmlspecialchars($currentRoleVal).'" selected>'.htmlspecialchars($currentRoleVal).'</option>';
                                            }
                                            foreach ($roles as $roleOpt):
                                        ?>
                                            <option value="<?= htmlspecialchars($roleOpt) ?>" <?= ($currentRoleVal === $roleOpt) ? 'selected' : '' ?>><?= htmlspecialchars($roleOpt) ?></option>
                                        <?php endforeach; ?>
                                    </select>
                                </div>
                                <div class="col-12 d-flex justify-content-end gap-2">
                                    <a href="sms.php?order=<?= urlencode($order) ?>&barangay=<?= (int)$filterBarangay ?>" class="btn btn-outline-secondary">Cancel</a>
                                    <button type="submit" class="btn btn-primary">Save changes</button>
                                </div>
                            </form>
                        </div>
                    <?php else: ?>
                        <div class="card-header bg-white py-3 d-flex justify-content-between align-items-center">
                            <h5 class="mb-0 text-primary"><i class="fa-solid fa-user-plus me-2"></i>Add New Contact</h5>
                            <span class="badge bg-primary rounded-pill">Quick add</span>
                        </div>
                        <div class="card-body p-4">
                            <form method="POST" class="row g-4">
                                <input type="hidden" name="add_contact" value="1">
                                
                                <!-- Personal Details Section -->
                                <div class="col-12">
                                    <h6 class="text-uppercase text-muted small fw-bold mb-3">Personal Information</h6>
                                    <div class="row g-3">
                                        <div class="col-md-4">
                                            <label class="form-label fw-medium">Full Name</label>
                                            <input type="text" name="contact_name" class="form-control bg-light" placeholder="e.g., Juan Dela Cruz" required>
                                        </div>
                                        <div class="col-md-3">
                                            <label class="form-label fw-medium">Mobile Number</label>
                                            <input type="text" name="contact_mobile" class="form-control bg-light" placeholder="09xxxxxxxxx" pattern="[0-9]{11}" inputmode="numeric" minlength="11" maxlength="11" oninput="this.value=this.value.replace(/[^0-9]/g, '').slice(0,11);" required>
                                        </div>
                                        <div class="col-md-3">
                                            <label class="form-label fw-medium">Birthday</label>
                                            <input type="date" name="contact_birthday" id="contactBirthday" class="form-control bg-light" required>
                                        </div>
                                        <div class="col-md-2">
                                            <label class="form-label fw-medium">Age</label>
                                            <input type="number" name="contact_age" id="contactAge" class="form-control bg-light" min="1" max="120" placeholder="0" readonly required tabindex="-1">
                                        </div>
                                    </div>
                                </div>
                                
                                <hr class="text-muted opacity-25 my-4">

                                <!-- Location & Role Section -->
                                <div class="col-12">
                                    <h6 class="text-uppercase text-muted small fw-bold mb-3">Location & Role</h6>
                                    <div class="row g-3">
                                        <div class="col-md-4">
                                            <label class="form-label fw-medium">Province</label>
                                            <select name="contact_province" id="contactProvince" class="form-select bg-light" required>
                                                <option value="">Select province</option>
                                            </select>
                                        </div>
                                        <div class="col-md-4">
                                            <label class="form-label fw-medium">City / Municipality</label>
                                            <select name="contact_city" id="contactCity" class="form-select bg-light" required disabled>
                                                <option value="">Select province first</option>
                                            </select>
                                        </div>
                                        <div class="col-md-4">
                                            <label class="form-label fw-medium">Area (Barangay)</label>
                                            <select name="contact_area" id="contactArea" class="form-select bg-light" required disabled>
                                                <option value="">Select city first</option>
                                                <!-- Logic moved to JS, this will be populated dynamically -->
                                            </select>
                                        </div>
                                        <div class="col-md-4">
                                            <label class="form-label fw-medium">Role</label>
                                            <select name="contact_role" class="form-select bg-light" required>
                                                <option value="">Select role</option>
                                                <option value="Resident">Resident</option>
                                                <option value="Kagawad">Kagawad</option>
                                                <option value="Brgy. Captain">Brgy. Captain</option>
                                                <option value="Responder">Responder</option>
                                            </select>
                                        </div>
                                        <div class="col-md-8">
                                            <label class="form-label fw-medium text-primary">Need help assigning location?</label>
                                            <select id="quickFillDevice" class="form-select bg-white border-primary text-primary" style="cursor:pointer; font-weight:500;">
                                                <option value="" selected>Select device</option>
                                                <?php foreach ($deviceGroups as $grp): ?>
                                                    <option value="<?= htmlspecialchars($grp['device_id']) ?>"
                                                        data-device-id="<?= htmlspecialchars($grp['device_id']) ?>"
                                                        data-province="<?= htmlspecialchars($grp['province']) ?>"
                                                        data-city="<?= htmlspecialchars($grp['city']) ?>"
                                                        data-barangay-name="<?= htmlspecialchars($grp['barangay_name']) ?>"
                                                    >
                                                        <?= htmlspecialchars($grp['device_name']) ?> (<?= htmlspecialchars($grp['barangay_name']) ?>)
                                                    </option>
                                                <?php endforeach; ?>
                                            </select>
                                        </div>
                                </div>

                                <div class="col-12 d-flex justify-content-end mt-4">
                                        <input type="hidden" name="contact_device_id" id="contactDeviceId" value="">
                                    <button type="submit" class="btn btn-primary px-4 py-2 shadow-sm rounded-pill">
                                        <i class="fa-solid fa-plus me-1"></i> Add Contact
                                    </button>
                                </div>
                            </form>
                        </div>
                    <?php endif; ?>

            <!-- Device Coverage Groups -->
            <section class="mb-4 reveal">
                <div class="shadow-sm card h-100 border-0">
                    <div class="card-header bg-white py-3">
                         <h5 class="mb-0 text-primary"><i class="fa-solid fa-tower-broadcast me-2"></i>Device Coverage Groups</h5>
                    </div>
                    <div class="card-body p-4">
                        <div class="row g-4">
                             <?php if (empty($deviceGroups)): ?>
                                 <div class="col-12 text-muted fst-italic">No devices found.</div>
                             <?php else: ?>
                                 <?php foreach ($deviceGroups as $group): ?>
                                     <div class="col-md-6 col-lg-4">
                                         <div class="card h-100 border-light shadow-sm">
                                             <div class="card-header bg-light">
                                                 <div class="fw-bold text-dark"><?= htmlspecialchars($group['device_name']) ?></div>
                                                 <div class="small text-muted mb-1">Area: <?= htmlspecialchars($group['barangay_name']) ?></div>
                                                 <?php if (!empty($group['lat']) && !empty($group['lng'])): ?>
                                                     <div class="small text-secondary"><i class="fa-solid fa-location-dot me-1"></i><?= number_format((float)$group['lat'], 5) ?>, <?= number_format((float)$group['lng'], 5) ?></div>
                                                 <?php endif; ?>
                                             </div>
                                             <div class="card-body p-3">
                                                 <?php $contactCount = count($group['subscribers'] ?? []); ?>
                                                 <?php if ($contactCount === 0): ?>
                                                     <p class="text-muted small fst-italic mb-0">No subscribers assigned.</p>
                                                 <?php else: ?>
                                                     <p class="text-dark mb-0">
                                                         <i class="fa-solid fa-users text-primary me-1"></i>
                                                         <strong><?= $contactCount ?></strong> contact<?= $contactCount > 1 ? 's' : '' ?> registered
                                                     </p>
                                                 <?php endif; ?>
                                             </div>
                                             <div class="card-footer bg-white text-center py-2 border-top">
                                                 <a href="#" class="text-primary small fw-medium text-decoration-none" 
                                                    data-bs-toggle="modal" 
                                                    data-bs-target="#contactsModal-<?= (int)$group['device_id'] ?>">
                                                     <i class="fa-solid fa-eye me-1"></i>See All
                                                 </a>
                                             </div>
                                         </div>
                                     </div>
                                 <?php endforeach; ?>
                             <?php endif; ?>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Subscribers List -->
            <section class="mb-4 reveal">
                <div class="shadow-sm card h-100">
                    <div class="card-header d-flex flex-wrap gap-2 justify-content-between align-items-center">
                        <span>Recipients</span>
                        <form method="get" class="d-flex flex-wrap gap-2 align-items-center mb-0">
                            <div class="d-flex flex-wrap gap-2 align-items-center">
                                <span class="text-muted small">Sort by:</span>
                                <select name="order" id="order" class="form-select form-select-sm" onchange="this.form.submit()">
                                    <option value="newest" <?= $order === 'newest' ? 'selected' : '' ?>>Newest</option>
                                    <option value="name_asc" <?= $order === 'name_asc' ? 'selected' : '' ?>>Name A-Z</option>
                                    <option value="name_desc" <?= $order === 'name_desc' ? 'selected' : '' ?>>Name Z-A</option>
                                </select>
                                <select name="barangay" id="barangay" class="form-select form-select-sm" onchange="this.form.submit()">
                                    <option value="0">All barangays</option>
                                    <?php foreach ($availableAreas as $areaOption): ?>
                                        <option value="<?= htmlspecialchars($areaOption['id']) ?>" <?= ($filterBarangay === (int)$areaOption['id']) ? 'selected' : '' ?>>
                                            <?= htmlspecialchars($areaOption['name']) ?>
                                        </option>
                                    <?php endforeach; ?>
                                </select>
                            </div>
                            <?php if (isset($_GET['edit_id'])): ?>
                                <input type="hidden" name="edit_id" value="<?= (int)$_GET['edit_id'] ?>">
                            <?php endif; ?>
                        </form>
                    </div>
                    <div class="card-body p-0">
                        <div class="table-responsive">
                            <table class="table align-middle mb-0">
                                <thead class="table-light">
                                    <tr>
                                <th class="ps-4">Name</th>
                                <th>Mobile</th>
                                <th>Role</th>
                                <th>Age</th>
                                <th>Province</th>
                                <th>City / Municipality</th>
                                <th>Area</th>
                                <th class="text-end pe-4">Subscribed</th>
                                <th class="text-end pe-4">Actions</th>
                            </tr>
                                </thead>
                                <tbody>
                                    <?php if (empty($subscribers)): ?>
                                        <tr>
                                            <td colspan="9" class="text-center p-4 text-muted">No subscribers yet. Add a contact to see it listed here.</td>
                                        </tr>
                                    <?php else: ?>
                                        <?php foreach ($subscribers as $sub): ?>
                                        <tr>
                                    <td class="ps-4"><?= htmlspecialchars($sub['full_name'] ?? 'Unknown') ?></td>
                                    <td><?= htmlspecialchars($sub['mobile'] ?? '') ?></td>
                                    <td><?= htmlspecialchars($sub['role'] ?? '') ?></td>
                                    <td><?= htmlspecialchars($sub['age'] ?? '') ?></td>
                                    <td><?= htmlspecialchars($sub['province'] ?? '') ?></td>
                                    <td><?= htmlspecialchars($sub['city'] ?? '') ?></td>
                                    <td><?= htmlspecialchars($sub['area'] ?? 'N/A') ?></td>
                                    <td class="text-end pe-4 text-muted small">
                                        <?= $sub['subscribed_at'] ? date('M d, Y H:i', strtotime($sub['subscribed_at'])) : 'N/A' ?>
                                    </td>
                                            <td class="text-end pe-4">
                                                <div class="d-inline-flex gap-2">
                                                    <a href="sms.php?edit_id=<?= (int)$sub['id'] ?>&order=<?= urlencode($order) ?>&barangay=<?= (int)$filterBarangay ?>" class="btn btn-sm btn-outline-primary">Edit</a>
                                                    <form method="post" onsubmit="return confirm('Delete this subscriber?');" class="d-inline">
                                                        <input type="hidden" name="subscriber_id" value="<?= (int)$sub['id'] ?>">
                                                        <input type="hidden" name="order" value="<?= htmlspecialchars($order) ?>">
                                                        <input type="hidden" name="barangay" value="<?= (int)$filterBarangay ?>">
                                                        <button type="submit" name="delete_subscriber" value="1" class="btn btn-sm btn-outline-danger">Delete</button>
                                                    </form>
                                                </div>
                                            </td>
                                        </tr>
                                        <?php endforeach; ?>
                                    <?php endif; ?>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </section>

            <?php if ($successMessage): ?>
                <div class="alert alert-success alert-dismissible fade show" role="alert">
                    <span data-feather="check-circle" class="me-2"></span>
                    <?= htmlspecialchars($successMessage) ?>
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
            <?php endif; ?>

            <?php if ($editSuccess): ?>
                <div class="alert alert-success alert-dismissible fade show" role="alert">
                    <span data-feather="check-circle" class="me-2"></span>
                    <?= htmlspecialchars($editSuccess) ?>
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
            <?php endif; ?>

            <?php if ($deleteSuccess): ?>
                <div class="alert alert-success alert-dismissible fade show" role="alert">
                    <span data-feather="check-circle" class="me-2"></span>
                    <?= htmlspecialchars($deleteSuccess) ?>
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
            <?php endif; ?>

            <?php if ($contactSuccess): ?>
                <div class="alert alert-success alert-dismissible fade show" role="alert">
                    <span data-feather="check-circle" class="me-2"></span>
                    <?= htmlspecialchars($contactSuccess) ?>
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
            <?php endif; ?>

            <?php if ($contactError): ?>
                <div class="alert alert-danger alert-dismissible fade show" role="alert">
                    <span data-feather="alert-triangle" class="me-2"></span>
                    <?= htmlspecialchars($contactError) ?>
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
            <?php endif; ?>

            <?php if ($editError): ?>
                <div class="alert alert-danger alert-dismissible fade show" role="alert">
                    <span data-feather="alert-triangle" class="me-2"></span>
                    <?= htmlspecialchars($editError) ?>
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
            <?php endif; ?>

            <?php if ($deleteError): ?>
                <div class="alert alert-danger alert-dismissible fade show" role="alert">
                    <span data-feather="alert-triangle" class="me-2"></span>
                    <?= htmlspecialchars($deleteError) ?>
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
            <?php endif; ?>

            <?php if ($errors): ?>
                <div class="alert alert-danger alert-dismissible fade show" role="alert">
                    <span data-feather="alert-triangle" class="me-2"></span>
                    <ul class="mb-0 ps-3">
                        <?php foreach ($errors as $error): ?>
                            <li><?= htmlspecialchars($error) ?></li>
                        <?php endforeach; ?>
                    </ul>
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
            <?php endif; ?>

            <form method="POST" class="sms-template-form reveal" style="--reveal-delay: 120ms;">
                <input type="hidden" name="save_templates" value="1">
                <div class="row g-4">
                    <div class="col-12">
                        <div class="shadow-sm card template-card">
                            <div class="card-body">
                                <?php foreach ($templates as $template): ?>
                                    <?php
                                        $toneClass = $template['id'] === 'caution_alert' ? 'template-caution' : 'template-critical';
                                        $icon = $template['id'] === 'caution_alert' ? 'fa-circle-exclamation' : 'fa-triangle-exclamation';
                                    ?>
                                    <div class="template-row <?= $toneClass ?>">
                                        <div class="template-header">
                                            <div class="template-title">
                                                <span class="template-chip">
                                                    <i class="fa-solid <?= $icon ?>"></i>
                                                    <?= htmlspecialchars($template['label']) ?>
                                                </span>
                                                <p class="mb-0 text-muted small"><?= htmlspecialchars($template['description']) ?></p>
                                            </div>
                                            <span class="template-meta text-muted small">Last updated: <?= htmlspecialchars(formatTimestamp($template['last_updated'] ?? null)) ?></span>
                                        </div>
                                        <div class="mb-2">
                                            <label class="form-label fw-semibold" for="template-<?= htmlspecialchars($template['id']) ?>">Message body</label>
                                            <textarea
                                                class="form-control sms-textarea"
                                                id="template-<?= htmlspecialchars($template['id']) ?>"
                                                name="templates[<?= htmlspecialchars($template['id']) ?>][content]"
                                                rows="4"
                                                maxlength="320"
                                                required><?= htmlspecialchars($template['content']) ?></textarea>
                                            <div class="mt-2 form-text text-muted">
                                                Keep under 320 characters. Placeholders: <code>{area}</code>, <code>{aqi}</code>, <code>{aqi_category}</code>.
                                            </div>
                                        </div>
                                    </div>
                                <?php endforeach; ?>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="gap-2 mt-4 d-flex justify-content-end">
                    <button type="reset" class="btn btn-outline-secondary">
                        <span data-feather="rotate-ccw" class="align-text-bottom me-1"></span>
                        Reset changes
                    </button>
                    <button type="submit" class="btn btn-primary">
                        <span data-feather="save" class="align-text-bottom me-1"></span>
                        Save templates
                    </button>
                </div>
            </form>

        </main>

    <!-- Feather Icons -->
    <script src="https://cdn.jsdelivr.net/npm/feather-icons/dist/feather.min.js"></script>
    <script>
      feather.replace();
    </script>

    <!-- Bootstrap JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>

    <!-- Local Data Injection -->
    <script>
        const LOCAL_BARANGAYS = <?= json_encode($availableAreas) ?>;
        // Detect "Home City" - simple logic: if we have barangays, assume they belong to the main deployment city (Himamaylan)
        // Or better, let's just match against "Himamaylan City" or "Himamaylan" in the selector.
        // For now, we'll expose the list and let the selector logic decide when to use it (e.g. if the default list has mismatched names).
        const HOME_CITY_NAMES = ['Himamaylan', 'Himamaylan City']; 
    </script>

    <!-- Custom JS -->
    <script src="js/script.js"></script>
    <script src="js/philippine_address_selector.js"></script>
    <script src="js/quick_fill.js"></script>
    
    <!-- EcoBot AI -->
    <script src="js/chatbot.js?v=2"></script>

    <!-- Contacts Modals (placed at body level for proper z-index) -->
    <?php foreach ($deviceGroups as $group): ?>
    <div class="modal fade" id="contactsModal-<?= (int)$group['device_id'] ?>" tabindex="-1" aria-labelledby="contactsModalLabel-<?= (int)$group['device_id'] ?>" aria-hidden="true">
        <div class="modal-dialog modal-dialog-scrollable modal-dialog-centered">
            <div class="modal-content shadow-lg">
                <div class="modal-header bg-primary text-white">
                    <h5 class="modal-title text-white" id="contactsModalLabel-<?= (int)$group['device_id'] ?>">
                        <i class="fa-solid fa-tower-broadcast me-2"></i><?= htmlspecialchars($group['device_name']) ?> - Contacts
                    </h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body p-0">
                    <?php if (empty($group['subscribers'])): ?>
                        <div class="text-center text-muted py-5">
                            <i class="fa-solid fa-user-slash fa-2x mb-3 opacity-50"></i>
                            <p class="mb-0">No contacts registered for this device.</p>
                        </div>
                    <?php else: ?>
                    <table class="table table-hover align-middle mb-0">
                        <thead class="table-light">
                            <tr>
                                <th class="ps-3">Name</th>
                                <th>Mobile</th>
                                <th class="pe-3">Role</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php foreach ($group['subscribers'] as $sub): ?>
                            <tr>
                                <td class="ps-3"><?= htmlspecialchars($sub['full_name']) ?></td>
                                <td><?= htmlspecialchars($sub['mobile'] ?? 'N/A') ?></td>
                                <td class="pe-3">
                                    <span class="badge bg-secondary rounded-pill"><?= htmlspecialchars($sub['role'] ?: 'Resident') ?></span>
                                </td>
                            </tr>
                            <?php endforeach; ?>
                        </tbody>
                    </table>
                    <?php endif; ?>
                </div>
                <div class="modal-footer bg-light">
                    <span class="text-muted small me-auto"><?= count($group['subscribers'] ?? []) ?> contact(s) in <?= htmlspecialchars($group['barangay_name']) ?></span>
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>
    <?php endforeach; ?>
</body>
</html>
