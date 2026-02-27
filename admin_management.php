<?php
require_once __DIR__ . '/session_bootstrap.php';
require_once __DIR__ . '/db.php';

function is_ajax(): bool
{
    return isset($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) === 'xmlhttprequest';
}

// Access Control: Only logged-in Admins
if (!isset($_SESSION['admin'])) {
    header('Location: login.php');
    exit;
}

$currentUserLabel = $_SESSION['username'] ?? '';
$currentRole = 'Guest';
$isAdmin = isset($_SESSION['admin']);
$isUser = isset($_SESSION['user']);
$isGuest = isset($_SESSION['guest']);

if ($isAdmin && $currentUserLabel === '') {
    try {
        $pdoHeader = db();
        // Fix: Resolve ID properly (auth_login sets admin_id, generic login sets admin as id)
        $adminIdRaw = $_SESSION['admin_id'] ?? $_SESSION['admin'];
        $adminId = (int)$adminIdRaw;
        
        $stmtHeader = $pdoHeader->prepare('SELECT username FROM admins WHERE id = :id LIMIT 1');
        $stmtHeader->execute([':id' => $adminId]);
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

$isMasterAdmin = isset($_SESSION['admin']) && (strtolower($currentUserLabel) === 'masteradmin');

// Ensure name/location columns exist for admins table
try { db()->exec("ALTER TABLE admins ADD COLUMN first_name VARCHAR(100) NULL AFTER username"); } catch (Throwable $e) { /* ignore */ }
try { db()->exec("ALTER TABLE admins ADD COLUMN middle_name VARCHAR(100) NULL AFTER first_name"); } catch (Throwable $e) { /* ignore */ }
try { db()->exec("ALTER TABLE admins ADD COLUMN last_name VARCHAR(100) NULL AFTER middle_name"); } catch (Throwable $e) { /* ignore */ }
try { db()->exec("ALTER TABLE admins ADD COLUMN suffix VARCHAR(10) NULL AFTER last_name"); } catch (Throwable $e) { /* ignore */ }
try { db()->exec("ALTER TABLE admins ADD COLUMN email VARCHAR(255) NULL UNIQUE"); } catch (Throwable $e) { /* ignore */ }
try { db()->exec("ALTER TABLE admins ADD COLUMN province VARCHAR(150) NULL AFTER address"); } catch (Throwable $e) { /* ignore */ }
try { db()->exec("ALTER TABLE admins ADD COLUMN city VARCHAR(150) NULL AFTER province"); } catch (Throwable $e) { /* ignore */ }
try { db()->exec("ALTER TABLE admins ADD COLUMN barangay VARCHAR(150) NULL AFTER city"); } catch (Throwable $e) { /* ignore */ }
try { db()->exec("ALTER TABLE admins ADD COLUMN zip_code VARCHAR(20) NULL AFTER barangay"); } catch (Throwable $e) { /* ignore */ }
try { db()->exec("ALTER TABLE admins ADD COLUMN street VARCHAR(255) NULL AFTER zip_code"); } catch (Throwable $e) { /* ignore */ }
try { db()->exec("ALTER TABLE admins ADD COLUMN contact_number VARCHAR(32) NULL AFTER email"); } catch (Throwable $e) { /* ignore */ }
try { db()->exec("ALTER TABLE admins ADD COLUMN status ENUM('active','inactive') NOT NULL DEFAULT 'active'"); } catch (Throwable $e) { /* ignore */ }
try { db()->exec("ALTER TABLE users ADD COLUMN status ENUM('active','inactive') NOT NULL DEFAULT 'active'"); } catch (Throwable $e) { /* ignore */ }
try {
    db()->exec("CREATE TABLE IF NOT EXISTS user_audit (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        actor VARCHAR(150) NULL,
        action VARCHAR(100) NOT NULL,
        target_type VARCHAR(50) NOT NULL,
        target_id INT NULL,
        target_name VARCHAR(150) NULL,
        details TEXT NULL,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_target (target_type, target_id),
        INDEX idx_created (created_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");
} catch (Throwable $e) { /* ignore */ }

function log_audit(PDO $pdo, string $action, string $targetType, ?int $targetId, ?string $targetName, ?string $details = null): void
{
    global $currentUserLabel;
    try {
        $stmt = $pdo->prepare("INSERT INTO user_audit (actor, action, target_type, target_id, target_name, details) VALUES (:actor, :action, :target_type, :target_id, :target_name, :details)");
        $stmt->execute([
            ':actor' => $currentUserLabel ?: 'masteradmin',
            ':action' => $action,
            ':target_type' => $targetType,
            ':target_id' => $targetId,
            ':target_name' => $targetName,
            ':details' => $details,
        ]);
    } catch (Throwable $e) { /* ignore */ }
}

$errors = [];
$successMessage = '';

$editingAdmin = null;

// Prefill editing state via query param
if (isset($_GET['edit'])) {
    $editId = (int) $_GET['edit'];
    if ($editId > 0) {
        try {
            $pdoEdit = db();
            $stmtEdit = $pdoEdit->prepare('SELECT id, first_name, middle_name, last_name, suffix, username, email, contact_number, birthdate, age, address, province, city, barangay, zip_code, street, status FROM admins WHERE id = :id LIMIT 1');
            $stmtEdit->execute([':id' => $editId]);
            $editingAdmin = $stmtEdit->fetch(PDO::FETCH_ASSOC) ?: null;
        } catch (Throwable $e) { /* ignore */ }
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Restrict admin management actions to master admin only
    $adminActionKeys = ['toggle_admin_status', 'delete_admin', 'update_admin', 'create_admin'];
    $isAdminAction = false;
    foreach ($adminActionKeys as $key) {
        if (isset($_POST[$key])) { $isAdminAction = true; break; }
    }
    if ($isAdminAction && !$isMasterAdmin) {
        $errors[] = 'You do not have permission to manage admins.';
        if (is_ajax()) {
            http_response_code(403);
            echo json_encode(['ok' => false, 'error' => 'Permission denied']);
            exit;
        }
    }

    // Toggle admin status
    if (isset($_POST['toggle_admin_status'])) {
        $adminId = (int)($_POST['admin_id'] ?? 0);
        $newStatus = $_POST['new_status'] ?? '';
        if (!$isMasterAdmin) {
            $errors[] = 'You do not have permission to modify admins.';
            if (is_ajax()) {
                http_response_code(403);
                echo json_encode(['ok' => false, 'error' => 'Permission denied']);
                exit;
            }
        } elseif ($adminId > 0 && in_array($newStatus, ['active','inactive'], true)) {
            try {
                $pdo = db();
                $stmt = $pdo->prepare("UPDATE admins SET status = :status WHERE id = :id");
                $stmt->execute([':status' => $newStatus, ':id' => $adminId]);
                $successMessage = "Admin status updated to {$newStatus}.";
                log_audit($pdo, 'toggle_admin_status', 'admin', $adminId, null, "Set to {$newStatus}");
                if (is_ajax()) {
                    echo json_encode(['ok' => true, 'status' => $newStatus]);
                    exit;
                }
            } catch (Throwable $e) {
                $errors[] = 'Failed to update admin status.';
                if (is_ajax()) {
                    http_response_code(500);
                    echo json_encode(['ok' => false, 'error' => 'Failed to update admin status.']);
                    exit;
                }
            }
        } else {
            $errors[] = 'Invalid admin or status.';
            if (is_ajax()) {
                http_response_code(400);
                echo json_encode(['ok' => false, 'error' => 'Invalid admin or status.']);
                exit;
            }
        }
    }
    // Toggle public user status
    elseif (isset($_POST['toggle_user_status'])) {
        $userId = (int)($_POST['user_id'] ?? 0);
        $newStatus = $_POST['new_status'] ?? '';
        if ($userId > 0 && in_array($newStatus, ['active','inactive'], true)) {
            try {
                $pdo = db();
                $stmt = $pdo->prepare("UPDATE users SET status = :status WHERE id = :id");
                $stmt->execute([':status' => $newStatus, ':id' => $userId]);
                $successMessage = "User status updated to {$newStatus}.";
                log_audit($pdo, 'toggle_user_status', 'user', $userId, null, "Set to {$newStatus}");
                if (is_ajax()) {
                    echo json_encode(['ok' => true, 'status' => $newStatus]);
                    exit;
                }
            } catch (Throwable $e) {
                $errors[] = 'Failed to update user status.';
                if (is_ajax()) {
                    http_response_code(500);
                    echo json_encode(['ok' => false, 'error' => 'Failed to update user status.']);
                    exit;
                }
            }
        } else {
            $errors[] = 'Invalid user or status.';
            if (is_ajax()) {
                http_response_code(400);
                echo json_encode(['ok' => false, 'error' => 'Invalid user or status.']);
                exit;
            }
        }
    }
    // Handle delete user action
    elseif (isset($_POST['delete_user'])) {
        $userIdToDelete = isset($_POST['user_id']) ? (int) $_POST['user_id'] : 0;
        if ($userIdToDelete <= 0) {
            $errors[] = 'Invalid user selected for deletion.';
        } else {
            try {
                $pdo = db();
                $chk = $pdo->prepare('SELECT username FROM users WHERE id = :id LIMIT 1');
                $chk->execute([':id' => $userIdToDelete]);
                $row = $chk->fetch(PDO::FETCH_ASSOC);
                
                if (!$row) {
                    $errors[] = 'User not found.';
                    if (is_ajax()) {
                        http_response_code(404);
                        echo json_encode(['ok' => false, 'error' => 'User not found.']);
                        exit;
                    }
                } else {
                    $stmt = $pdo->prepare('DELETE FROM users WHERE id = :id');
                    $stmt->execute([':id' => $userIdToDelete]);
                    
                    log_audit($pdo, 'delete_user', 'user', $userIdToDelete, $row['username'], 'User deleted permanently');
                    $successMessage = 'User deleted successfully.';
                    
                    if (is_ajax()) {
                        echo json_encode(['ok' => true, 'deleted' => true]);
                        exit;
                    }
                }
            } catch (Throwable $e) {
                // Check foreign key constraints?
                $errors[] = 'Deletion failed: ' . $e->getMessage();
                if (is_ajax()) {
                    http_response_code(500);
                    // Use a friendly message if it's a constraint error
                    if (strpos($e->getMessage(), 'Integrity constraint') !== false) {
                        echo json_encode(['ok' => false, 'error' => 'Cannot delete user: Associated data exists.']);
                    } else {
                        echo json_encode(['ok' => false, 'error' => 'Database error.']);
                    }
                    exit;
                }
            }
        }
    }
    // Handle delete action (admin)
    elseif (isset($_POST['delete_admin'])) {
        if (!$isMasterAdmin) {
            $errors[] = 'You do not have permission to delete admins.';
            if (is_ajax()) {
                http_response_code(403);
                echo json_encode(['ok' => false, 'error' => 'Permission denied']);
                exit;
            }
        } else {
            $adminIdToDelete = isset($_POST['admin_id']) ? (int) $_POST['admin_id'] : 0;
            if ($adminIdToDelete <= 0) {
                $errors[] = 'Invalid admin selected for deletion.';
            } else {
                try {
                    $pdo = db();
                    // Ensure admin exists
                    $chk = $pdo->prepare('SELECT username FROM admins WHERE id = :id LIMIT 1');
                    $chk->execute([':id' => $adminIdToDelete]);
                    $row = $chk->fetch(PDO::FETCH_ASSOC);
                    if (!$row) {
                        $errors[] = 'Admin not found or already deleted.';
                        if (is_ajax()) {
                            http_response_code(404);
                            echo json_encode(['ok' => false, 'error' => 'Admin not found.']);
                            exit;
                        }
                    } else {
                        // Soft delete: mark inactive regardless of current state
                        $stmt = $pdo->prepare('UPDATE admins SET status = :inactive WHERE id = :id');
                        $stmt->execute([':inactive' => 'inactive', ':id' => $adminIdToDelete]);
                        log_audit($pdo, 'delete_admin', 'admin', $adminIdToDelete, $row['username'] ?? null, 'Marked inactive (soft delete)');
                        // If deleting the currently logged-in admin, end session and redirect to login
                        if (isset($_SESSION['admin']) && $adminIdToDelete === (int) $_SESSION['admin']) {
                            session_unset();
                            session_destroy();
                            if (is_ajax()) {
                                echo json_encode(['ok' => true, 'deleted' => true, 'self' => true]);
                                exit;
                            } else {
                                header('Location: login.php?msg=Admin+deleted');
                                exit;
                            }
                        }
                        $successMessage = 'Admin deleted successfully.';
                        if (is_ajax()) {
                            echo json_encode(['ok' => true, 'deleted' => true]);
                            exit;
                        }
                    }
                } catch (Throwable $e) {
                    $errors[] = 'Database error: ' . $e->getMessage();
                    if (is_ajax()) {
                        http_response_code(500);
                        echo json_encode(['ok' => false, 'error' => 'Database error.']);
                        exit;
                    }
                }
            }
        }
    } elseif (isset($_POST['update_admin'])) {
        if (!$isMasterAdmin) {
            $errors[] = 'You do not have permission to edit admins.';
            if (is_ajax()) {
                http_response_code(403);
                echo json_encode(['ok' => false, 'error' => 'Permission denied']);
                exit;
            }
        } else {
        // Handle update action
        $adminId   = isset($_POST['admin_id']) ? (int) $_POST['admin_id'] : 0;
        $firstName = trim($_POST['first_name'] ?? '');
        $middleName = trim($_POST['middle_name'] ?? '');
        $lastName   = trim($_POST['last_name'] ?? '');
        $suffix     = trim($_POST['suffix'] ?? '');
        $username   = trim($_POST['username'] ?? '');
        $email      = trim($_POST['email'] ?? '');
        $contact    = trim($_POST['contact_number'] ?? '');
        $password   = trim($_POST['password'] ?? '');
        $birthdate  = trim($_POST['birthdate'] ?? '');
        $province   = trim($_POST['province'] ?? '');
        $city       = trim($_POST['city'] ?? '');
        $barangay   = trim($_POST['barangay'] ?? '');
        $street     = trim($_POST['street'] ?? '');
        $zipCode    = trim($_POST['zip_code'] ?? '');

        if ($adminId <= 0) {
            $errors[] = 'Invalid admin selected.';
        }

        if ($firstName === '' || $lastName === '') {
            $errors[] = 'First name and Last name are required.';
        }

        if ($username === '') {
            $errors[] = 'Username is required.';
        }
        if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $errors[] = 'A valid email is required.';
        }

        if ($password !== '' && !preg_match('/^(?=.*[A-Za-z])(?=.*\\d).{8,}$/', $password)) {
            $errors[] = 'Password must be at least 8 characters and include letters and numbers.';
        }
        if ($contact !== '' && !preg_match('/^\\d{11}$/', $contact)) {
            $errors[] = 'Contact number must be exactly 11 digits (numbers only).';
        }

        // Validate required address selections
        if ($province === '' || $city === '' || $barangay === '') {
            $errors[] = 'Province, City/Municipality, and Barangay are required.';
        }

        // Validate birthdate format (optional field)
        $birthdateValue = null;
        $ageValue = null;
        if ($birthdate !== '') {
            $parsed = DateTime::createFromFormat('Y-m-d', $birthdate);
            if (!$parsed || $parsed->format('Y-m-d') !== $birthdate) {
                $errors[] = 'Birthdate must be a valid date.';
            } else {
                $birthdateValue = $parsed->format('Y-m-d');
                $today = new DateTime('today');
                $ageValue = $parsed->diff($today)->y;
            }
        }

        if (empty($errors)) {
            try {
                $pdo = db();

                // Check username uniqueness (excluding self)
                $stmt = $pdo->prepare('SELECT id FROM admins WHERE username = :username AND id <> :id LIMIT 1');
                $stmt->execute([':username' => $username, ':id' => $adminId]);
                $existingUser = $stmt->fetch(PDO::FETCH_ASSOC);
                if ($existingUser) {
                    $errors[] = 'Username already exists.';
                } else {
                    // Check email uniqueness (excluding self)
                    $stmt = $pdo->prepare('SELECT id FROM admins WHERE email = :email AND id <> :id LIMIT 1');
                    $stmt->execute([':email' => $email, ':id' => $adminId]);
                    $existingEmail = $stmt->fetch(PDO::FETCH_ASSOC);
                    if ($existingEmail) {
                        $errors[] = 'Email already exists.';
                    }
                }

                if (empty($errors)) {
                    // Combine address fields into a single stored address string
                    $addressParts = array_filter([
                        $street,
                        $barangay,
                        $city,
                        $province,
                        $zipCode !== '' ? $zipCode : null,
                    ], static function ($part) {
                        return $part !== null && $part !== '';
                    });
                    $addressCombined = !empty($addressParts) ? implode(', ', $addressParts) : null;

                    $fields = [
                        'first_name'  => $firstName,
                        'middle_name' => $middleName !== '' ? $middleName : null,
                        'last_name'   => $lastName,
                        'suffix'      => $suffix !== '' ? $suffix : null,
                        'username'    => $username,
                        'email'       => $email,
                        'birthdate'   => $birthdateValue,
                        'age'         => $ageValue,
                        'contact_number' => $contact !== '' ? $contact : null,
                        'address'     => $addressCombined,
                        'province'    => $province !== '' ? $province : null,
                        'city'        => $city !== '' ? $city : null,
                        'barangay'    => $barangay !== '' ? $barangay : null,
                        'zip_code'    => $zipCode !== '' ? $zipCode : null,
                        'street'      => $street !== '' ? $street : null,
                        'id'          => $adminId,
                    ];

                    $setPassword = '';
                    if ($password !== '') {
                        $fields['hash'] = password_hash($password, PASSWORD_BCRYPT);
                        $setPassword = ', password_hash = :hash';
                    }

                    $sql = "UPDATE admins 
                            SET first_name = :first_name,
                                middle_name = :middle_name,
                                last_name = :last_name,
                                suffix = :suffix,
                                username = :username,
                                email = :email,
                                birthdate = :birthdate,
                                age = :age,
                                contact_number = :contact_number,
                                address = :address,
                                province = :province,
                                city = :city,
                                barangay = :barangay,
                                zip_code = :zip_code,
                                street = :street
                                $setPassword
                            WHERE id = :id";
                    $stmt = $pdo->prepare($sql);
                    $stmt->execute($fields);
                    $successMessage = "Admin '$username' updated successfully.";
                    log_audit($pdo, 'update_admin', 'admin', $adminId, $username, "Updated profile");
                    header('Location: admin_management.php');
                    exit;
                }
            } catch (Throwable $e) {
                $errors[] = 'Database error: ' . $e->getMessage();
            }
        }
        // Keep editing state if errors
        $editingAdmin = [
            'id' => $adminId,
            'first_name' => $firstName,
            'middle_name' => $middleName,
            'last_name' => $lastName,
            'username' => $username,
            'contact_number' => $contact,
            'birthdate' => $birthdate,
            'age' => $ageValue,
            'address' => null,
            'province' => $province,
            'city' => $city,
            'barangay' => $barangay,
            'zip_code' => $zipCode,
            'street' => $street,
            'status' => $newStatus ?? ($editingAdmin['status'] ?? 'active')
        ];

    }
    }
    elseif (isset($_POST['create_admin'])) {
        // Handle create action
        $firstName = trim($_POST['first_name'] ?? '');
        $middleName = trim($_POST['middle_name'] ?? '');
        $lastName   = trim($_POST['last_name'] ?? '');
        $suffix     = trim($_POST['suffix'] ?? ''); // Added
        $username   = trim($_POST['username'] ?? '');
        $email      = trim($_POST['email'] ?? '');
        $contact    = trim($_POST['contact_number'] ?? '');
        $password   = $_POST['password'] ?? '';
        $birthdate  = trim($_POST['birthdate'] ?? '');
        $province   = trim($_POST['province'] ?? '');
        $city       = trim($_POST['city'] ?? '');
        $barangay   = trim($_POST['barangay'] ?? '');
        $street     = trim($_POST['street'] ?? '');
        $zipCode    = trim($_POST['zip_code'] ?? '');
        // $confirm_password = $_POST['confirm_password'] ?? ''; // Optional, simplifying for admin panel

        if ($firstName === '' || $lastName === '') {
            $errors[] = 'First name and Last name are required.';
        }

        if ($username === '' || $password === '') {
            $errors[] = 'Username and Password are required.';
        } elseif ($password !== '' && !preg_match('/^(?=.*[A-Za-z])(?=.*\\d).{8,}$/', $password)) {
            $errors[] = 'Password must be at least 8 characters and include letters and numbers.';
        }
        if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $errors[] = 'A valid email is required.';
        }
        if ($contact !== '' && !preg_match('/^\\d{11}$/', $contact)) {
            $errors[] = 'Contact number must be exactly 11 digits (numbers only).';
        }

        // Validate required address selections
        if ($province === '' || $city === '' || $barangay === '') {
            $errors[] = 'Province, City/Municipality, and Barangay are required.';
        }

        // Validate birthdate format (optional field)
        $birthdateValue = null;
        $ageValue = null;
        if ($birthdate !== '') {
            $parsed = DateTime::createFromFormat('Y-m-d', $birthdate);
            if (!$parsed || $parsed->format('Y-m-d') !== $birthdate) {
                $errors[] = 'Birthdate must be a valid date.';
            } else {
                $birthdateValue = $parsed->format('Y-m-d');
                // Compute age from birthdate to prevent tampering
                $today = new DateTime('today');
                $ageValue = $parsed->diff($today)->y;
            }
        }

        if (empty($errors)) {
            try {
                $pdo = db();
                // Check existing username
                $stmt = $pdo->prepare('SELECT COUNT(*) FROM admins WHERE username = :username');
                $stmt->execute([':username' => $username]);
                
                if ($stmt->fetchColumn() > 0) {
                    $errors[] = 'Username already exists.';
                } else {
                    // Check if email exists
                    $stmt = $pdo->prepare('SELECT COUNT(*) FROM admins WHERE email = :email');
                    $stmt->execute([':email' => $email]);
                    if ($stmt->fetchColumn() > 0) {
                        $errors[] = 'Email is already registered.';
                    }
                }

                if (empty($errors)) {
                    $hash = password_hash($password, PASSWORD_BCRYPT);

                    // Combine address fields into a single stored address string
                    $addressParts = array_filter([
                        $street,
                        $barangay,
                        $city,
                        $province,
                        $zipCode !== '' ? $zipCode : null,
                    ], static function ($part) {
                        return $part !== null && $part !== '';
                    });
                    $addressCombined = !empty($addressParts) ? implode(', ', $addressParts) : null;

                    $stmt = $pdo->prepare('INSERT INTO admins (first_name, middle_name, last_name, suffix, username, email, contact_number, password_hash, birthdate, age, address, province, city, barangay, zip_code, street) VALUES (:first_name, :middle_name, :last_name, :suffix, :username, :email, :contact_number, :hash, :birthdate, :age, :address, :province, :city, :barangay, :zip_code, :street)');
                    $stmt->execute([
                        ':first_name'  => $firstName,
                        ':middle_name' => $middleName !== '' ? $middleName : null,
                        ':last_name'   => $lastName,
                        ':suffix'      => $suffix !== '' ? $suffix : null, // Added
                        ':username'    => $username,
                        ':email'       => $email,
                        ':contact_number' => $contact !== '' ? $contact : null,
                        ':hash'        => $hash,
                        ':birthdate'   => $birthdateValue,
                        ':age'         => $ageValue,
                        ':address'     => $addressCombined,
                        ':province'    => $province !== '' ? $province : null,
                        ':city'        => $city !== '' ? $city : null,
                        ':barangay'    => $barangay !== '' ? $barangay : null,
                        ':zip_code'    => $zipCode !== '' ? $zipCode : null,
                        ':street'      => $street !== '' ? $street : null,
                    ]);
                    $successMessage = "Admin '$username' created successfully.";
                    $fullNameNew = trim(preg_replace('/\s+/', ' ', "$firstName $middleName $lastName"));
                    log_audit($pdo, 'create_admin', 'admin', (int)$pdo->lastInsertId(), $username, $fullNameNew ?: $username);
                    if (is_ajax()) {
                        echo json_encode(['ok' => true, 'message' => $successMessage]);
                        exit;
                    }
                }
            } catch (Throwable $e) {
                $errors[] = 'Database error: ' . $e->getMessage();
                if (is_ajax()) {
                    http_response_code(500);
                    echo json_encode(['ok' => false, 'error' => 'Database error']);
                    exit;
                }
            }
        }
        
        if (!empty($errors) && is_ajax()) {
            http_response_code(400);
            echo json_encode(['ok' => false, 'errors' => $errors]);
            exit;
        }
    }
}

// Fetch existing admins
$admins = [];
$users = [];
$audits = [];
try {
    $pdo = db();
    $excludedUsernames = ['masteradmin'];
    $placeholders = implode(',', array_fill(0, count($excludedUsernames), '?'));
    $sql = "SELECT id, first_name, middle_name, last_name, username, birthdate, age, address, province, city, barangay, contact_number, status, created_at 
            FROM admins 
            WHERE username NOT IN ($placeholders)
              AND (status IS NULL OR status <> 'inactive')
            ORDER BY id ASC";
    $stmt = $pdo->prepare($sql);
    $stmt->execute($excludedUsernames);
    $admins = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Ensure created_at exists for users table for consistent display
    try { $pdo->exec("ALTER TABLE users ADD COLUMN created_at DATETIME NULL DEFAULT CURRENT_TIMESTAMP"); } catch (Throwable $e) { /* ignore */ }
    // Fetch public users
    $ustmt = $pdo->prepare("SELECT id, username, email, contact_number, city, barangay, status, created_at FROM users ORDER BY id DESC");
    $ustmt->execute();
    $users = $ustmt->fetchAll(PDO::FETCH_ASSOC);

    // Fetch recent audits
    $astmt = $pdo->prepare("SELECT actor, action, target_type, target_id, target_name, details, created_at FROM user_audit ORDER BY id DESC LIMIT 10");
    $astmt->execute();
    $audits = $astmt->fetchAll(PDO::FETCH_ASSOC);
} catch (Throwable $e) { /* Ignore */ }

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Manage Admins &amp; Users | EcoPulse</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    
    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css"/>
    
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
        <button class="mobile-menu-btn" id="mobileMenuBtn" type="button" aria-label="Open navigation">
            <i class="fa-solid fa-bars"></i>
        </button>
    </header>

    <!-- Sidebar Navigation -->
    <!-- Sidebar Navigation -->
    <?php include 'sidebar.php'; ?>

    <div class="sidebar-overlay" id="sidebarOverlay"></div>

    <!-- Main Content -->
    <main class="p-4 main-content">
        <header class="mb-4 d-flex justify-content-between align-items-center reveal">
            <div class="gap-3 d-flex align-items-center">
                <span class="page-title-icon"><i class="fa-solid fa-user-shield"></i></span>
                <h1 class="mb-0 h2 fw-bold">Admin Management</h1>
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

        <div class="row fade-in">
            <?php if ($isMasterAdmin): ?>
            <!-- Left Column: Create/Edit Form -->
            <div class="col-lg-4">
                <div class="card-modern sticky-top" style="top: 1rem; z-index: 1020;">
                    <div class="card-header-modern bg-gradient-primary text-white">
                        <div class="d-flex align-items-center gap-2">
                            <i class="fa-solid <?= $editingAdmin ? 'fa-user-pen' : 'fa-user-plus' ?>"></i>
                            <h6 class="m-0 fw-bold"><?= $editingAdmin ? 'Edit Admin' : 'Create Admin Account' ?></h6>
                        </div>
                    </div>
                    <div class="card-body-modern">
                        <form method="post" id="adminForm" class="needs-validation" novalidate autocomplete="off">
                            <input type="hidden" name="admin_id" value="<?= $editingAdmin ? (int)$editingAdmin['id'] : '' ?>">
                            
                            <div class="mb-3">
                                <label class="modern-label">Full Name</label>
                                <div class="row g-2">
                                    <div class="col-6 col-md-3">
                                        <input type="text" name="first_name" class="modern-input w-100" placeholder="First" value="<?= htmlspecialchars($editingAdmin['first_name'] ?? '') ?>" required>
                                    </div>
                                    <div class="col-6 col-md-3">
                                        <input type="text" name="middle_name" class="modern-input w-100" placeholder="Middle" value="<?= htmlspecialchars($editingAdmin['middle_name'] ?? '') ?>">
                                    </div>
                                    <div class="col-6 col-md-3">
                                        <input type="text" name="last_name" class="modern-input w-100" placeholder="Last" value="<?= htmlspecialchars($editingAdmin['last_name'] ?? '') ?>" required>
                                    </div>
                                    <div class="col-6 col-md-3">
                                         <select class="form-select modern-input w-100" name="suffix" style="color: <?= ($editingAdmin['suffix'] ?? '') === '' ? '#6c757d' : 'inherit' ?>;" onchange="this.style.color = this.value === '' ? '#6c757d' : 'inherit'">
                                            <option value="" <?= ($editingAdmin['suffix'] ?? '') === '' ? 'selected' : '' ?>>Suffix</option>
                                            <option value="Jr." <?= ($editingAdmin['suffix'] ?? '') === 'Jr.' ? 'selected' : '' ?>>Jr.</option>
                                            <option value="Sr." <?= ($editingAdmin['suffix'] ?? '') === 'Sr.' ? 'selected' : '' ?>>Sr.</option>
                                            <option value="II" <?= ($editingAdmin['suffix'] ?? '') === 'II' ? 'selected' : '' ?>>II</option>
                                            <option value="III" <?= ($editingAdmin['suffix'] ?? '') === 'III' ? 'selected' : '' ?>>III</option>
                                            <option value="IV" <?= ($editingAdmin['suffix'] ?? '') === 'IV' ? 'selected' : '' ?>>IV</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div class="mb-3">
                                <label class="modern-label">Username</label>
                                <div class="input-icon-wrapper">
                                    <i class="fa-solid fa-at input-icon"></i>
                                    <input type="text" name="username" class="modern-input modern-input-with-icon w-100 placeholder-styled" placeholder="username" value="<?= htmlspecialchars($editingAdmin['username'] ?? '') ?>" required>
                                </div>
                            </div>

                            <div class="row">
                                <div class="col-12 col-md-6 mb-3">
                                    <label class="modern-label">Email</label>
                                    <div class="input-icon-wrapper">
                                        <i class="fa-solid fa-envelope input-icon"></i>
                                        <input type="email" name="email" class="modern-input modern-input-with-icon w-100" placeholder="email@example.com" value="<?= htmlspecialchars($editingAdmin['email'] ?? '') ?>" required>
                                    </div>
                                </div>
                                <div class="col-12 col-md-6 mb-3">
                                    <label class="modern-label">Contact</label>
                                    <div class="input-icon-wrapper">
                                        <i class="fa-solid fa-phone input-icon"></i>
                                        <input type="text" name="contact_number" class="modern-input modern-input-with-icon w-100" placeholder="09xxxxxxxxx" value="<?= htmlspecialchars($editingAdmin['contact_number'] ?? '') ?>" maxlength="11">
                                    </div>
                                </div>
                            </div>

                                <div class="mb-3">
                                    <label class="modern-label">Password <?= $editingAdmin ? '<small class="text-muted fw-normal">(leave blank to keep current)</small>' : '' ?></label>
                                    <div class="input-icon-wrapper position-relative">
                                        <i class="fa-solid fa-lock input-icon"></i>
                                        <input type="password" id="adminPasswordField" name="password" class="modern-input modern-input-with-icon w-100" placeholder="<?= $editingAdmin ? 'Leave blank to keep current' : 'Enter password' ?>" <?= $editingAdmin ? '' : 'required' ?> autocomplete="new-password">
                                        <button type="button" class="btn btn-link p-0 position-absolute end-0 top-50 translate-middle-y me-3 text-muted toggle-password-visibility" data-target="adminPasswordField" aria-label="Toggle password visibility">
                                            <i class="fa-solid fa-eye"></i>
                                        </button>
                                    </div>
                                    <div class="invalid-feedback d-block small text-danger" id="adminPasswordError" style="display:none;"></div>
                                </div>

                                <div class="row">
                                    <div class="col-12 col-md-6 mb-3">
                                        <label class="modern-label">Birthdate</label>
                                        <div class="input-icon-wrapper">
                                            <i class="fa-solid fa-calendar-days input-icon"></i>
                                            <input type="date" name="birthdate" id="birthdate" class="modern-input modern-input-with-icon w-100" value="<?= isset($editingAdmin['birthdate']) && $editingAdmin['birthdate'] ? htmlspecialchars($editingAdmin['birthdate']) : '' ?>">
                                        </div>
                                    </div>
                                    <div class="col-12 col-md-6 mb-3">
                                        <label class="modern-label">Age</label>
                                        <div class="input-icon-wrapper">
                                            <i class="fa-solid fa-hashtag input-icon"></i>
                                            <input type="number" name="age" id="age" min="0" class="modern-input modern-input-with-icon w-100 bg-light" placeholder="Auto" value="<?= htmlspecialchars($editingAdmin['age'] ?? '') ?>" readonly>
                                        </div>
                                    </div>
                                </div>

                                <div class="mb-3">
                                    <label class="modern-label">Province</label>
                                    <div class="input-icon-wrapper">
                                        <i class="fa-solid fa-map input-icon"></i>
                                        <select class="form-select modern-input modern-input-with-icon" id="province" name="province" data-current="<?= htmlspecialchars($editingAdmin['province'] ?? '') ?>" required>
                                            <option value="">Select Province</option>
                                        </select>
                                    </div>
                                </div>

                                <div class="row">
                                    <div class="col-12 col-md-6 mb-3">
                                        <label class="modern-label">City</label>
                                        <div class="input-icon-wrapper">
                                            <i class="fa-solid fa-city input-icon"></i>
                                            <select class="form-select modern-input modern-input-with-icon" id="city" name="city" data-current="<?= htmlspecialchars($editingAdmin['city'] ?? '') ?>" required disabled>
                                                <option value="">City</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="col-12 col-md-6 mb-3">
                                        <label class="modern-label">Barangay</label>
                                        <div class="input-icon-wrapper">
                                            <i class="fa-solid fa-location-crosshairs input-icon"></i>
                                            <select class="form-select modern-input modern-input-with-icon" id="barangay" name="barangay" data-current="<?= htmlspecialchars($editingAdmin['barangay'] ?? '') ?>" required disabled>
                                                <option value="">Barangay</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div class="mb-3">
                                    <label class="modern-label">Street</label>
                                    <div class="input-icon-wrapper">
                                        <i class="fa-solid fa-house input-icon"></i>
                                        <input type="text" name="street" class="modern-input modern-input-with-icon w-100" placeholder="House No., Street" value="<?= htmlspecialchars($editingAdmin['street'] ?? '') ?>">
                                    </div>
                                </div>

                                <div class="mb-4">
                                    <label class="modern-label">Zip Code</label>
                                    <div class="input-icon-wrapper">
                                        <i class="fa-solid fa-map-pin input-icon"></i>
                                        <input type="text" name="zip_code" class="modern-input modern-input-with-icon w-100" placeholder="Zip Code" value="<?= htmlspecialchars($editingAdmin['zip_code'] ?? '') ?>">
                                    </div>
                                </div>

                                <div class="d-grid gap-2">
                                    <?php if ($editingAdmin): ?>
                                        <button type="submit" name="update_admin" value="1" class="btn btn-primary py-2 rounded-3 fw-medium fade-in">
                                            <i class="fa-solid fa-save me-1"></i> Update Admin Account
                                        </button>
                                        <a href="admin_management.php" class="btn btn-light py-2 rounded-3 text-muted fw-medium border">Cancel</a>
                                    <?php else: ?>
                                        <input type="hidden" name="create_admin" value="1">
                                        <button type="submit" name="create_admin" value="1" class="btn btn-primary py-3 rounded-3 fw-bold shadow-sm hover-elevate">
                                            <i class="fa-solid fa-plus-circle me-1"></i> Create Admin Account
                                        </button>
                                    <?php endif; ?>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            <?php endif; ?>

            <!-- Right Column: Tables -->
            <div class="<?= $isMasterAdmin ? 'col-lg-8' : 'col-12' ?>">
                <!-- Admin List -->
                <div class="card-modern mb-4">
                    <div class="card-header-modern bg-white">
                        <div class="d-flex align-items-center gap-2">
                            <h6 class="m-0 fw-bold text-primary">Registered Admins</h6>
                            <span class="badge bg-primary-subtle text-primary-emphasis rounded-pill"><?= count($admins) ?> Admins</span>
                        </div>
                        <div class="ms-auto">
                            <input type="text" id="adminSearch" class="form-control form-control-sm" placeholder="Search admins">
                        </div>
                    </div>
                    <div class="card-body-modern p-0">
                        <div class="table-responsive">
                            <table class="modern-table" id="adminTable">
                                <thead>
                                    <tr>
                                        <th class="ps-4">ID</th>
                                        <th>Name</th>
                                        <th>Username</th>
                                        <th>Contact</th>
                                        <th>Location</th>
                                        <th class="text-center" style="width: 15%;">Age</th>
                                        <th class="text-center" style="width: 10%;">Status</th>
                                        <th class="<?= $isMasterAdmin ? '' : 'text-end pe-4' ?>" style="width: 12%;">Registered On</th>
                                        <?php if ($isMasterAdmin): ?><th class="text-end pe-4">Actions</th><?php endif; ?>
                                    </tr>
                                </thead>
                                <tbody>
                                <?php if (!empty($admins)): ?>
                                    <?php foreach ($admins as $admin): ?>
                                        <tr id="admin-row-<?= (int)$admin['id'] ?>">
                                            <td class="ps-4 text-muted">#<?= $admin['id'] ?></td>
                                            <td>
                                                <div class="d-flex align-items-center">
                                                    <div class="user-avatar-placeholder me-3">
                                                        <?= strtoupper(substr($admin['first_name'] ?? 'A', 0, 1) . substr($admin['last_name'] ?? 'U', 0, 1)) ?>
                                                    </div>
                                                    <div>
                                                        <?php
                                                            $fullName = trim(preg_replace('/\s+/', ' ', ($admin['first_name'] ?? '') . ' ' . ($admin['middle_name'] ?? '') . ' ' . ($admin['last_name'] ?? '') . ' ' . ($admin['suffix'] ?? '')));
                                                            $fullName = $fullName !== '' ? $fullName : 'Unknown Admin';
                                                        ?>
                                                        <div class="fw-bold text-dark"><?= htmlspecialchars($fullName) ?></div>
                                                        <div class="small text-muted">Admin</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td class="fw-medium text-primary">@<?= htmlspecialchars($admin['username']) ?></td>
                                            <td class="text-muted"><?= htmlspecialchars($admin['contact_number'] ?? '--') ?></td>
                                            <td>
                                                <div class="text-dark small ck-display-location">
                                                    <?= htmlspecialchars($admin['city'] ?? '--') ?>,<br>
                                                    <span class="text-muted"><?= htmlspecialchars($admin['barangay'] ?? '--') ?></span>
                                                </div>
                                            </td>
                                            <td class="text-center text-muted"><?= $admin['age'] !== null ? (int) $admin['age'] : '--' ?></td>
                                            <td class="text-center">
                                                <span class="badge <?= ($admin['status'] ?? 'active') === 'inactive' ? 'bg-secondary-subtle text-secondary' : 'bg-success-subtle text-success' ?>">
                                                    <?= ($admin['status'] ?? 'active') === 'inactive' ? 'Inactive' : 'Active' ?>
                                                </span>
                                            </td>
                                            <td class="text-muted small <?= $isMasterAdmin ? '' : 'text-end pe-4' ?>">
                                                <?= isset($admin['created_at']) ? date('M d, Y', strtotime($admin['created_at'])) : 'N/A' ?>
                                            </td>
                                            <?php if ($isMasterAdmin): ?>
                                            <td class="text-end pe-4">
                                                <div class="d-flex justify-content-end gap-2">
                                                    <form method="post" data-ajax-form="toggle-admin">
                                                        <input type="hidden" name="admin_id" value="<?= (int) $admin['id'] ?>">
                                                        <input type="hidden" name="toggle_admin_status" value="1">
                                                        <input type="hidden" name="new_status" value="<?= ($admin['status'] ?? 'active') === 'active' ? 'inactive' : 'active' ?>">
                                                        <button type="submit" name="toggle_admin_status" class="btn-icon-soft" title="Toggle active/inactive">
                                                            <i class="fa-solid fa-power-off"></i>
                                                        </button>
                                                    </form>
                                                    <a class="btn-icon-soft" href="admin_management.php?edit=<?= (int) $admin['id'] ?>" title="Edit">
                                                        <i class="fa-solid fa-pen"></i>
                                                    </a>
                                                    <form method="post" data-ajax-form="delete-admin" onsubmit="return confirm('Delete admin <?= htmlspecialchars($admin['username'], ENT_QUOTES) ?>? This will log you out if it is your account.');">
                                                        <input type="hidden" name="admin_id" value="<?= (int) $admin['id'] ?>">
                                                        <input type="hidden" name="delete_admin" value="1">
                                                        <button type="submit" name="delete_admin" value="1" class="btn-icon-soft text-danger" title="Delete">
                                                            <i class="fa-solid fa-trash-can"></i>
                                                        </button>
                                                    </form>
                                                </div>
                                            </td>
                                            <?php endif; ?>
                                        </tr>
                                    <?php endforeach; ?>
                                    <?php else: ?>
                                        <tr>
                                            <td colspan="<?= $isMasterAdmin ? 9 : 8 ?>" class="text-center py-5 text-muted">
                                                <div class="d-flex flex-column align-items-center">
                                                    <i class="fa-solid fa-users-slash fa-3x mb-3 text-light-gray"></i>
                                                    <p>No admins found in database.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    <?php endif; ?>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <!-- Public Users List -->
                <div class="card-modern mb-5">
                    <div class="card-header-modern bg-white">
                        <div class="d-flex align-items-center gap-2">
                            <h6 class="m-0 fw-bold text-primary">Registered Public Users</h6>
                        </div>
                        <span class="badge bg-primary-subtle text-primary-emphasis rounded-pill"><?= count($users) ?> Users</span>
                        <div class="ms-auto">
                            <input type="text" id="userSearch" class="form-control form-control-sm" placeholder="Search users">
                        </div>
                    </div>
                    <div class="card-body-modern p-0">
                        <div class="table-responsive">
                            <table class="modern-table" id="userTable">
                                <thead>
                                    <tr>
                                        <th class="ps-4">ID</th>
                                        <th>Username</th>
                                        <th>Email</th>
                                        <th>Contact</th>
                                        <th>Location</th>
                                        <th>Status</th>
                                        <th class="text-end pe-4">Registered On</th>
                                        <th class="text-end pe-4">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <?php if (!empty($users)): ?>
                                    <?php foreach ($users as $user): ?>
                                            <tr id="user-row-<?= (int)$user['id'] ?>">
                                                <td class="ps-4 text-muted">#<?= (int) $user['id'] ?></td>
                                                <td>
                                                    <div class="d-flex align-items-center">
                                                        <div class="bg-light rounded-circle d-flex align-items-center justify-content-center me-3" style="width: 38px; height: 38px;">
                                                            <i class="fa-solid fa-user text-primary small"></i>
                                                        </div>
                                                        <span class="fw-medium text-dark"><?= htmlspecialchars($user['username'] ?? 'N/A') ?></span>
                                                    </div>
                                                </td>
                                                <td class="text-muted"><?= htmlspecialchars($user['email'] ?? '--') ?></td>
                                                <td class="text-muted"><?= htmlspecialchars($user['contact_number'] ?? '--') ?></td>
                                                <td>
                                                    <div class="small">
                                                    <?= htmlspecialchars($user['city'] ?? '--') ?>, <?= htmlspecialchars($user['barangay'] ?? '--') ?>
                                                    </div>
                                                </td>
                                                <td>
                                                    <span class="badge <?= ($user['status'] ?? 'active') === 'inactive' ? 'bg-secondary-subtle text-secondary' : 'bg-success-subtle text-success' ?>">
                                                        <?= ($user['status'] ?? 'active') === 'inactive' ? 'Inactive' : 'Active' ?>
                                                    </span>
                                                </td>
                                                <td class="text-end pe-4 text-muted small">
                                                    <?php
                                                        $created = $user['created_at'] ?? null;
                                                        echo $created ? date('M d, Y h:i A', strtotime($created)) : 'N/A';
                                                    ?>
                                                </td>
                                                <td class="text-end pe-4">
                                                    <form method="post" data-ajax-form="toggle-user" class="d-inline-block">
                                                        <input type="hidden" name="user_id" value="<?= (int) $user['id'] ?>">
                                                        <input type="hidden" name="toggle_user_status" value="1">
                                                        <input type="hidden" name="new_status" value="<?= ($user['status'] ?? 'active') === 'active' ? 'inactive' : 'active' ?>">
                                                        <button type="submit" name="toggle_user_status" class="btn-icon-soft" title="Toggle active/inactive">
                                                            <i class="fa-solid fa-power-off"></i>
                                                        </button>
                                                    </form>
                                                    <form method="post" data-ajax-form="delete-user" class="d-inline-block ms-1" onsubmit="return confirm('Are you sure you want to delete this user? This cannot be undone.');">
                                                        <input type="hidden" name="user_id" value="<?= (int) $user['id'] ?>">
                                                        <input type="hidden" name="delete_user" value="1">
                                                        <button type="submit" class="btn-icon-soft text-danger" title="Delete User">
                                                            <i class="fa-solid fa-trash"></i>
                                                        </button>
                                                    </form>
                                                </td>
                                            </tr>
                                        <?php endforeach; ?>
                                    <?php else: ?>
                                        <tr>
                                            <td colspan="8" class="text-center py-5 text-muted">
                                                No public users found.
                                            </td>
                                        </tr>
                                    <?php endif; ?>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <!-- Audit Log -->
                <div class="card-modern mb-5">
                    <div class="card-header-modern bg-white">
                        <div class="d-flex align-items-center gap-2">
                            <h6 class="m-0 fw-bold text-primary">Recent User Management Activity</h6>
                        </div>
                        <div class="ms-auto">
                            <input type="text" id="auditSearch" class="form-control form-control-sm" placeholder="Search activity">
                        </div>
                    </div>
                    <div class="card-body-modern p-0">
                        <div class="table-responsive">
                            <table class="modern-table" id="auditTable">
                                <thead>
                                    <tr>
                                        <th class="ps-4">When</th>
                                        <th>Actor</th>
                                        <th>Action</th>
                                        <th>Target</th>
                                        <th>Details</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <?php if (!empty($audits)): ?>
                                        <?php foreach ($audits as $log): ?>
                                            <tr>
                                                <td class="ps-4 text-muted small"><?= htmlspecialchars(date('M d, Y h:i A', strtotime($log['created_at']))) ?></td>
                                                <td class="fw-medium"><?= htmlspecialchars($log['actor'] ?? 'masteradmin') ?></td>
                                                <td class="text-muted"><?= htmlspecialchars($log['action']) ?></td>
                                                <td>
                                                    <div class="small text-dark">
                                                        <?= htmlspecialchars($log['target_type'] ?? '--') ?>
                                                        <?= $log['target_id'] ? '#'.(int)$log['target_id'] : '' ?>
                                                        <?php if (!empty($log['target_name'])): ?>
                                                            <div class="text-muted"><?= htmlspecialchars($log['target_name']) ?></div>
                                                        <?php endif; ?>
                                                    </div>
                                                </td>
                                                <td class="text-muted small"><?= htmlspecialchars($log['details'] ?? '') ?></td>
                                            </tr>
                                        <?php endforeach; ?>
                                    <?php else: ?>
                                        <tr>
                                            <td colspan="5" class="text-center py-4 text-muted">
                                                No recent activity.
                                            </td>
                                        </tr>
                                    <?php endif; ?>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>

    <!-- Feather Icons (if needed for other scripts) -->
    <script src="https://cdn.jsdelivr.net/npm/feather-icons/dist/feather.min.js"></script>
    <script>feather.replace()</script>
    
    <!-- Bootstrap JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>

    <!-- EcoBot AI -->
    <script src="js/chatbot.js?v=2"></script>
    
    <!-- Custom JS -->
    <script src="js/script.js"></script>
    <script>
        document.addEventListener('DOMContentLoaded', () => {
            // --- Age Calculation ---
            const birthdateInput = document.getElementById('birthdate');
            const ageInput = document.getElementById('age');
            const adminForm = document.getElementById('adminForm');
            const adminPassword = adminForm ? adminForm.querySelector('input[name="password"]') : null;
            const adminPasswordError = document.getElementById('adminPasswordError');
            if (birthdateInput && ageInput) {
                const computeAge = () => {
                    if (!birthdateInput.value) {
                        ageInput.value = '';
                        return;
                    }
                    const birthDate = new Date(birthdateInput.value);
                    const today = new Date();
                    let age = today.getFullYear() - birthDate.getFullYear();
                    const m = today.getMonth() - birthDate.getMonth();
                    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                        age--;
                    }
                    ageInput.value = age;
                };
                birthdateInput.addEventListener('change', computeAge);
                computeAge();
            }

            // --- Province/City/Barangay Dropdown Logic ---
            const provinceSelect = document.getElementById('province');
            const citySelect = document.getElementById('city');
            const barangaySelect = document.getElementById('barangay');
            const adminSearch = document.getElementById('adminSearch');
            const userSearch = document.getElementById('userSearch');
            const auditSearch = document.getElementById('auditSearch');
            const togglePwdBtns = document.querySelectorAll('.toggle-password-visibility');

                if (provinceSelect && citySelect && barangaySelect) {
                // Get values from data-current attributes
                const currentProvince = provinceSelect.dataset.current;
                const currentCity = citySelect.dataset.current;
                const currentBarangay = barangaySelect.dataset.current;

                const resetSelect = (selectElement, defaultText, disabled = false) => {
                    selectElement.innerHTML = `<option value="">${defaultText}</option>`;
                    selectElement.disabled = disabled;
                };

                const loadBarangays = (cityCode, preselectBarangay = '') => {
                    resetSelect(barangaySelect, 'Select Barangay', true);
                    if (!cityCode) return;

                    barangaySelect.disabled = false;
                    barangaySelect.innerHTML = '<option value="">Loading...</option>';

                    fetch(`https://psgc.gitlab.io/api/cities-municipalities/${cityCode}/barangays/`)
                        .then(response => response.json())
                        .then(data => {
                            resetSelect(barangaySelect, 'Select Barangay', false);
                            data.sort((a, b) => a.name.localeCompare(b.name));
                            data.forEach(barangay => {
                                const option = document.createElement('option');
                                option.value = barangay.name;
                                option.textContent = barangay.name;
                                barangaySelect.appendChild(option);
                            });
                            if (preselectBarangay) {
                                const opt = Array.from(barangaySelect.options).find(o => o.value === preselectBarangay);
                                if (opt) opt.selected = true;
                            }
                        })
                        .catch(err => {
                            console.error('Error fetching barangays:', err);
                            resetSelect(barangaySelect, 'Error loading barangays', true);
                        });
                };

                const loadCities = (provinceCode, preselectCity = '', preselectBarangay = '') => {
                    resetSelect(citySelect, 'Select City', true);
                    resetSelect(barangaySelect, 'Select Barangay', true);
                    if (!provinceCode) return;

                    citySelect.disabled = false;
                    citySelect.innerHTML = '<option value="">Loading...</option>';

                    fetch(`https://psgc.gitlab.io/api/provinces/${provinceCode}/cities-municipalities/`)
                        .then(response => response.json())
                        .then(data => {
                            resetSelect(citySelect, 'Select City', false);
                            data.sort((a, b) => a.name.localeCompare(b.name));
                            data.forEach(city => {
                                const option = document.createElement('option');
                                option.value = city.name;
                                option.textContent = city.name;
                                option.dataset.code = city.code;
                                citySelect.appendChild(option);
                            });
                            if (preselectCity) {
                                const opt = Array.from(citySelect.options).find(o => o.value === preselectCity);
                                if (opt) {
                                    opt.selected = true;
                                    loadBarangays(opt.dataset.code, preselectBarangay);
                                }
                            }
                        })
                        .catch(err => {
                            console.error('Error fetching cities:', err);
                            resetSelect(citySelect, 'Error loading cities', true);
                        });
                };

                // Fetch Provinces
                fetch('https://psgc.gitlab.io/api/provinces/')
                    .then(response => response.json())
                    .then(data => {
                        data.sort((a, b) => a.name.localeCompare(b.name));
                        data.forEach(province => {
                            const option = document.createElement('option');
                            option.value = province.name;
                            option.textContent = province.name;
                            option.dataset.code = province.code;
                            provinceSelect.appendChild(option);
                        });
                        // Preselect if editing
                        if (currentProvince) {
                            const opt = Array.from(provinceSelect.options).find(o => o.value === currentProvince);
                            if (opt) {
                                opt.selected = true;
                                const provCode = opt.dataset.code;
                                loadCities(provCode, currentCity, currentBarangay);
                            }
                        }
                    })
                    .catch(err => console.error('Error fetching provinces:', err));

                // Province change -> load cities
                provinceSelect.addEventListener('change', function () {
                    const selectedOption = this.options[this.selectedIndex];
                    const provinceCode = selectedOption.dataset.code;

                    loadCities(provinceCode || '', '', '');
                });

                // City change -> load barangays
                citySelect.addEventListener('change', function () {
                    const selectedOption = this.options[this.selectedIndex];
                    const cityCode = selectedOption.dataset.code;
                    loadBarangays(cityCode || '', '');
                });
            }

            // --- Simple table search filters ---
            const makeTableFilter = (inputEl, tableId) => {
                if (!inputEl) return;
                const table = document.getElementById(tableId);
                if (!table) return;
                const rows = () => Array.from(table.querySelectorAll('tbody tr'));
                inputEl.addEventListener('input', () => {
                    const term = inputEl.value.toLowerCase();
                    rows().forEach(row => {
                        const text = row.textContent.toLowerCase();
                        row.style.display = text.includes(term) ? '' : 'none';
                    });
                });
            };

            makeTableFilter(adminSearch, 'adminTable');
            makeTableFilter(userSearch, 'userTable');
            makeTableFilter(auditSearch, 'auditTable');

            // --- Client-side password check to avoid page refresh on weak password ---
            if (adminForm && adminPassword && adminPasswordError) {
                adminForm.addEventListener('submit', (e) => {
                    adminPasswordError.style.display = 'none';
                    adminPasswordError.textContent = '';
                    const val = adminPassword.value || '';
                    const isEdit = !!adminForm.querySelector('input[name=\"update_admin\"]');
                    const isCreate = !!adminForm.querySelector('input[name=\"create_admin\"]');

                    // Enforce password strength only for create, or when editing and a new password is provided
                    if ((isCreate && val.length === 0) || (val.length > 0)) {
                        const strong = /^(?=.*[A-Za-z])(?=.*[0-9]).{8,}$/;
                        if (!strong.test(val)) {
                            e.preventDefault();
                            adminPasswordError.textContent = 'Password must be at least 8 characters and include letters and numbers.';
                            adminPasswordError.style.display = 'block';
                            adminPassword.focus();
                            return;
                        }
                    }

                    // If AJAX (for create only), handle via fetch to avoid full reload
                    if (isCreate) {
                        e.preventDefault();
                        const fd = new FormData(adminForm);
                    fetch(window.location.href, {
                        method: 'POST',
                        headers: {'X-Requested-With': 'XMLHttpRequest'},
                        body: fd
                    }).then(async res => {
                        let data = {};
                        try { data = await res.json(); } catch (e) { /* ignore */ }
                        if (!res.ok || data.ok === false) {
                            showToast((data.error || (data.errors ? data.errors.join(', ') : 'Create failed.')), 'error');
                            return;
                        }
                        showToast('Admin created.');
                            setTimeout(() => window.location.reload(), 600);
                        }).catch(() => {
                            showToast('Create failed.', 'error');
                        });
                    }
                });
            }

            // --- Password visibility toggle ---
            togglePwdBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    const targetId = btn.dataset.target;
                    const input = document.getElementById(targetId);
                    if (!input) return;
                    const icon = btn.querySelector('i');
                    if (input.type === 'password') {
                        input.type = 'text';
                        if (icon) icon.classList.replace('fa-eye', 'fa-eye-slash');
                    } else {
                        input.type = 'password';
                        if (icon) icon.classList.replace('fa-eye-slash', 'fa-eye');
                    }
                });
            });

            // --- AJAX handlers for toggle/delete to avoid full page refresh ---
            const showToast = (msg, type = 'success') => {
                let toast = document.getElementById('mini-toast');
                if (!toast) {
                    toast = document.createElement('div');
                    toast.id = 'mini-toast';
                    toast.style.position = 'fixed';
                    toast.style.top = '20px';
                    toast.style.right = '20px';
                    toast.style.zIndex = '9999';
                    toast.style.padding = '12px 16px';
                    toast.style.borderRadius = '10px';
                    toast.style.boxShadow = '0 6px 18px rgba(0,0,0,0.15)';
                    toast.style.color = '#fff';
                    toast.style.fontWeight = '600';
                    document.body.appendChild(toast);
                }
                toast.textContent = msg;
                toast.style.background = type === 'error' ? '#e53935' : '#10b981';
                toast.style.opacity = '1';
                toast.style.transform = 'translateY(0)';
                setTimeout(() => {
                    toast.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                    toast.style.opacity = '0';
                    toast.style.transform = 'translateY(-10px)';
                }, 1400);
            };

            const handleAjaxForm = (form, onSuccess) => {
                form.addEventListener('submit', (e) => {
                    e.preventDefault();
                    const fd = new FormData(form);
                    fetch(window.location.href, {
                        method: 'POST',
                        headers: {'X-Requested-With': 'XMLHttpRequest'},
                        body: fd
                    }).then(async res => {
                        let data = {};
                        try { data = await res.json(); } catch (e) { /* ignore */ }
                        if (!res.ok) {
                            showToast(data.error || 'Action failed.', 'error');
                            return;
                        }
                        if (typeof data.ok !== 'undefined' && data.ok === false) {
                            showToast(data.error || 'Action failed.', 'error');
                            return;
                        }
                        onSuccess(data);
                    }).catch(() => {
                        showToast('Action failed.', 'error');
                    });
                });
            };

            document.querySelectorAll('form[data-ajax-form="toggle-admin"]').forEach(form => {
                handleAjaxForm(form, (data) => {
                    const row = form.closest('tr');
                    const badge = row ? row.querySelector('td:nth-child(6) .badge') : null;
                    const hidden = form.querySelector('input[name="new_status"]');
                    if (badge && hidden) {
                        const next = hidden.value;
                        badge.textContent = next === 'inactive' ? 'Inactive' : 'Active';
                        badge.className = 'badge ' + (next === 'inactive' ? 'bg-secondary-subtle text-secondary' : 'bg-success-subtle text-success');
                        hidden.value = next === 'inactive' ? 'active' : 'inactive';
                    }
                    showToast('Admin status updated.');
                });
            });

            document.querySelectorAll('form[data-ajax-form="toggle-user"]').forEach(form => {
                handleAjaxForm(form, () => {
                    const row = form.closest('tr');
                    const badge = row ? row.querySelector('td:nth-child(7) .badge, td .badge') : null;
                    const hidden = form.querySelector('input[name="new_status"]');
                    if (badge && hidden) {
                        const next = hidden.value;
                        badge.textContent = next === 'inactive' ? 'Inactive' : 'Active';
                        badge.className = 'badge ' + (next === 'inactive' ? 'bg-secondary-subtle text-secondary' : 'bg-success-subtle text-success');
                        hidden.value = next === 'inactive' ? 'active' : 'inactive';
                    }
                    showToast('User status updated.');
                });
            });

            document.querySelectorAll('form[data-ajax-form="delete-admin"]').forEach(form => {
                handleAjaxForm(form, (data) => {
                    const row = form.closest('tr');
                    if (data && data.ok) {
                        showToast('Admin deleted.');
                        if (row) row.remove();
                        setTimeout(() => window.location.reload(), 600);
                    } else {
                        showToast(data.error || 'Delete failed.', 'error');
                    }
                });
            });

            document.querySelectorAll('form[data-ajax-form="delete-user"]').forEach(form => {
                handleAjaxForm(form, (data) => {
                    const row = form.closest('tr');
                    if (data && data.ok) {
                        showToast('User deleted.');
                        if (row) row.remove();
                    } else {
                        showToast(data.error || 'Delete failed. ' + (data.error || ''), 'error');
                    }
                });
            });
        });
    </script>
</body>
</html>
