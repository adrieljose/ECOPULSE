<?php
require_once __DIR__ . '/session_bootstrap.php';
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/lib/activity_logger.php';

// Ensure user is logged in
if (!isset($_SESSION['user']) && !isset($_SESSION['admin'])) {
    header('Location: login.php');
    exit;
}

$isAdmin = isset($_SESSION['admin']);
$isMasterAdmin = ($isAdmin && ($_SESSION['role'] ?? '') === 'master_admin');
$userId = $_SESSION['user_id'] ?? $_SESSION['admin_id'] ?? $_SESSION['user'] ?? $_SESSION['admin'];
$userTable = $isAdmin ? 'admins' : 'users';

// Initialize variables
$user = [];
$success = '';
$error = '';
$activeTab = 'profile'; // Default tab

try {
    $pdo = db();

    // 1. Fetch INITIAL User Data
    $stmt = $pdo->prepare("SELECT * FROM $userTable WHERE id = :id");
    $stmt->execute([':id' => $userId]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user) $user = [];

    if (empty($user['username']) && !empty($_SESSION['username'])) {
        $user['username'] = $_SESSION['username'];
    }

    // 2. Handle Form Submissions
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        
        // A) Update Profile
        if (isset($_POST['update_profile'])) {
            $activeTab = 'profile';
            $firstName = trim($_POST['first_name'] ?? '');
            $middleName = trim($_POST['middle_name'] ?? '');
            $lastName = trim($_POST['last_name'] ?? '');
            $suffix = trim($_POST['suffix'] ?? '');
            $email = trim($_POST['email'] ?? '');
            $mobile = trim($_POST['mobile'] ?? '');
            
            if (empty($firstName) || empty($lastName)) {
                $error = "First and Last Name are required.";
            } else {
                $sql = "UPDATE $userTable SET first_name = :fn, middle_name = :mn, last_name = :ln, suffix = :suf, email = :em, contact_number = :mob WHERE id = :id";
                $stmt = $pdo->prepare($sql);
                $stmt->execute([
                    ':fn' => $firstName, ':mn' => $middleName, ':ln' => $lastName, 
                    ':suf' => $suffix, ':em' => $email, ':mob' => $mobile, ':id' => $userId
                ]);

                logActivity($pdo, ($isAdmin ? 'admin' : 'user'), $userId, 'Update Profile', 'Updated profile information', 'Profile');

                // Update local constraints
                $user['first_name'] = $firstName;
                $user['middle_name'] = $middleName;
                $user['last_name']   = $lastName;
                $user['suffix']      = $suffix;
                $user['email']       = $email;
                $user['contact_number'] = $mobile;
                
                $success = "Profile updated successfully.";
            }
        }
        
        // B) Change Password
        elseif (isset($_POST['change_password'])) {
            $activeTab = 'security';
            $currentPwd = $_POST['current_password'] ?? '';
            $newPwd = $_POST['new_password'] ?? '';
            $confirmPwd = $_POST['confirm_password'] ?? '';
            
            if (empty($currentPwd) || empty($newPwd) || empty($confirmPwd)) {
                $error = "All password fields are required.";
            } elseif ($newPwd !== $confirmPwd) {
                $error = "New passwords do not match.";
            } elseif (strlen($newPwd) < 8) {
                $error = "New password must be at least 8 characters.";
            } else {
                $stmt = $pdo->prepare("SELECT password_hash FROM $userTable WHERE id = :id");
                $stmt->execute([':id' => $userId]);
                $hash = $stmt->fetchColumn();
                
                if ($hash && password_verify($currentPwd, $hash)) {
                    $newHash = password_hash($newPwd, PASSWORD_DEFAULT);
                    $stmt = $pdo->prepare("UPDATE $userTable SET password_hash = :p WHERE id = :id");
                    $stmt->execute([':p' => $newHash, ':id' => $userId]);
                    $success = "Password changed successfully.";
                } else {
                    $error = "Incorrect current password.";
                }
            }
        }

        // C) Update Health Profile
        elseif (isset($_POST['update_health'])) {
            $activeTab = 'health';
            $condition = $_POST['health_condition'] ?? 'None';
            $validConditions = ['None', 'Asthma', 'COPD', 'Heart Disease', 'Pregnancy', 'Elderly', 'Children'];
            
            if (!in_array($condition, $validConditions)) {
                $error = "Invalid condition selected.";
            } else {
                $stmt = $pdo->prepare("UPDATE $userTable SET health_condition = :hc WHERE id = :id");
                $stmt->execute([':hc' => $condition, ':id' => $userId]);
                
                logActivity($pdo, ($isAdmin ? 'admin' : 'user'), $userId, 'Update Health', "Updated health condition to $condition", 'Profile');

                $user['health_condition'] = $condition;
                $success = "Health profile updated successfully.";
            }
        }
    }

    // 3. Fetch Activity History
    $type = $isAdmin ? 'admin' : 'user';
    $stmtAct = $pdo->prepare("
        SELECT created_at, action, details, ip_address, module 
        FROM activity_logs 
        WHERE user_type = :type AND user_id = :uid 
        ORDER BY created_at DESC LIMIT 50
    ");
    $stmtAct->execute([':type' => $type, ':uid' => $userId]);
    $activityRows = $stmtAct->fetchAll(PDO::FETCH_ASSOC);

} catch (Throwable $e) {
    $error = "System Error: " . $e->getMessage();
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Profile - EcoPulse</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="css/style.css">
</head>
<body class="bg-light">

    <!-- Mobile Header -->
    <header class="mobile-header">
        <a href="index.php" class="mobile-brand">
            <img src="img/ecopulse_logo_final.png" alt="EcoPulse"> EcoPulse
        </a>
        <button class="mobile-menu-btn" id="mobileMenuBtn" type="button" aria-label="Open navigation">
            <i class="fa-solid fa-bars"></i>
        </button>
    </header>

    <?php include 'sidebar.php'; ?>
    <div class="sidebar-overlay" id="sidebarOverlay"></div>

    <main class="p-4 main-content">
        <div class="mb-4 d-flex align-items-center gap-3 reveal flex-wrap">
            <span class="page-title-icon"><i class="fa-solid fa-user-gear"></i></span>
            <div>
                <h2 class="text-gray-800 fw-bold mb-1">My Profile</h2>
                <p class="text-muted mb-0">Manage your account settings and view activity.</p>
            </div>
            <div class="ms-auto d-none d-xl-flex align-items-center text-muted small pe-2 gap-2">
                 <i class="fa-regular fa-clock"></i>
                 <span id="clockTime" class="fw-medium text-dark">--:--</span>
                 <span id="clockDate" class="d-none">---</span>
            </div>
        </div>

        <?php if ($success): ?>
            <div class="alert alert-success alert-dismissible fade show" role="alert">
                <i class="fa-solid fa-circle-check me-2"></i><?= htmlspecialchars($success) ?>
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        <?php endif; ?>
        
        <?php if ($error): ?>
            <div class="alert alert-danger alert-dismissible fade show" role="alert">
                <i class="fa-solid fa-circle-exclamation me-2"></i><?= htmlspecialchars($error) ?>
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        <?php endif; ?>

        <div class="row g-4">
            <!-- Left Column: User Card -->
            <div class="col-lg-4 reveal" style="--reveal-delay: 200ms;">
                <div class="card border-0 shadow-sm h-100">
                    <div class="card-body text-center p-5">
                        <div class="mb-3 d-inline-flex align-items-center justify-content-center bg-primary bg-opacity-10 text-primary rounded-circle" style="width: 80px; height: 80px; font-size: 2rem; font-weight: bold;">
                             <?= strtoupper(substr($user['first_name'] ?? ($user['username'] ?? 'U'), 0, 1)) ?>
                        </div>
                        <h4 class="fw-bold mb-1"><?= htmlspecialchars($user['first_name'] ?? '') . ' ' . htmlspecialchars($user['last_name'] ?? '') ?></h4>
                        <p class="text-muted mb-3"><?= htmlspecialchars($user['username'] ?? 'User') ?></p>
                        <hr>
                        <div class="text-start">
                             <div class="mb-2"><small class="text-muted text-uppercase fw-bold">Email</small><br><?= htmlspecialchars($user['email'] ?? 'N/A') ?></div>
                             <div class="mb-2"><small class="text-muted text-uppercase fw-bold">Condition</small><br><span class="badge bg-primary-subtle text-primary"><?= htmlspecialchars($user['health_condition'] ?? 'None') ?></span></div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Right Column: Tabs -->
            <div class="col-lg-8 reveal" style="--reveal-delay: 400ms;">
                <div class="card border-0 shadow-sm">
                    <div class="card-header bg-white border-bottom-0 pt-4 px-4">
                        <ul class="nav nav-tabs card-header-tabs" id="profileTabs" role="tablist">
                            <li class="nav-item" role="presentation">
                                <button class="nav-link <?= $activeTab === 'profile' ? 'active' : '' ?>" id="profile-tab" data-bs-toggle="tab" data-bs-target="#profile-pane" type="button" role="tab">Edit Profile</button>
                            </li>
                            <li class="nav-item" role="presentation">
                                <button class="nav-link <?= $activeTab === 'security' ? 'active' : '' ?>" id="security-tab" data-bs-toggle="tab" data-bs-target="#security-pane" type="button" role="tab">Security</button>
                            </li>
                            <li class="nav-item" role="presentation">
                                <button class="nav-link <?= $activeTab === 'health' ? 'active' : '' ?>" id="health-tab" data-bs-toggle="tab" data-bs-target="#health-pane" type="button" role="tab"><i class="fa-solid fa-heart-pulse text-danger me-2"></i>Health</button>
                            </li>
                            <li class="nav-item" role="presentation">
                                <button class="nav-link <?= $activeTab === 'activity' ? 'active' : '' ?>" id="activity-tab" data-bs-toggle="tab" data-bs-target="#activity-pane" type="button" role="tab">My Activity</button>
                            </li>
                        </ul>
                    </div>
                    <div class="card-body p-4">
                        <div class="tab-content" id="myTabContent">
                            
                            <!-- Edit Profile Tab -->
                            <div class="tab-pane fade <?= $activeTab === 'profile' ? 'show active' : '' ?>" id="profile-pane" role="tabpanel">
                                <form method="POST">
                                    <div class="row g-3">
                                        <div class="col-sm-3">
                                            <label class="form-label">First Name</label>
                                            <input type="text" name="first_name" class="form-control" value="<?= htmlspecialchars($user['first_name'] ?? '') ?>" required>
                                        </div>
                                        <div class="col-sm-3">
                                            <label class="form-label">Middle Name</label>
                                            <input type="text" name="middle_name" class="form-control" value="<?= htmlspecialchars($user['middle_name'] ?? '') ?>">
                                        </div>
                                        <div class="col-sm-3">
                                            <label class="form-label">Last Name</label>
                                            <input type="text" name="last_name" class="form-control" value="<?= htmlspecialchars($user['last_name'] ?? '') ?>" required>
                                        </div>
                                        <div class="col-sm-3">
                                            <label class="form-label">Suffix</label>
                                            <select class="form-select" name="suffix">
                                                <option value="" <?= ($user['suffix'] ?? '') === '' ? 'selected' : '' ?>>None</option>
                                                <option value="Jr." <?= ($user['suffix'] ?? '') === 'Jr.' ? 'selected' : '' ?>>Jr.</option>
                                                <option value="Sr." <?= ($user['suffix'] ?? '') === 'Sr.' ? 'selected' : '' ?>>Sr.</option>
                                                <option value="II" <?= ($user['suffix'] ?? '') === 'II' ? 'selected' : '' ?>>II</option>
                                                <option value="III" <?= ($user['suffix'] ?? '') === 'III' ? 'selected' : '' ?>>III</option>
                                                <option value="IV" <?= ($user['suffix'] ?? '') === 'IV' ? 'selected' : '' ?>>IV</option>
                                            </select>
                                        </div>
                                        <div class="col-12">
                                            <label class="form-label">Email Address</label>
                                            <input type="email" name="email" class="form-control" value="<?= htmlspecialchars($user['email'] ?? '') ?>">
                                        </div>
                                        <div class="col-12">
                                            <label class="form-label">Mobile Number</label>
                                            <input type="text" name="mobile" class="form-control" value="<?= htmlspecialchars($user['contact_number'] ?? '') ?>" placeholder="09xxxxxxxxx">
                                        </div>
                                        <div class="col-12 mt-4">
                                            <button type="submit" name="update_profile" class="btn btn-primary px-4">Save Changes</button>
                                        </div>
                                    </div>
                                </form>
                            </div>

                            <!-- Security Tab -->
                            <div class="tab-pane fade <?= $activeTab === 'security' ? 'show active' : '' ?>" id="security-pane" role="tabpanel">
                                <form method="POST">
                                    <div class="mb-3">
                                        <label class="form-label">Current Password</label>
                                        <input type="password" name="current_password" class="form-control" required>
                                    </div>
                                    <div class="mb-3">
                                        <label class="form-label">New Password</label>
                                        <input type="password" name="new_password" class="form-control" minlength="8" required>
                                        <div class="form-text">Must be at least 8 characters long.</div>
                                    </div>
                                    <div class="mb-3">
                                        <label class="form-label">Confirm New Password</label>
                                        <input type="password" name="confirm_password" class="form-control" required>
                                    </div>
                                    <div class="mt-4">
                                        <button type="submit" name="change_password" class="btn btn-danger px-4">Change Password</button>
                                    </div>
                                </form>
                            </div>

                            <!-- Health Profile Tab -->
                            <div class="tab-pane fade <?= $activeTab === 'health' ? 'show active' : '' ?>" id="health-pane" role="tabpanel">
                                <div class="text-center mb-4">
                                    <div class="bg-danger bg-opacity-10 text-danger rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style="width: 64px; height: 64px; font-size: 1.5rem;">
                                        <i class="fa-solid fa-heart-pulse"></i>
                                    </div>
                                    <h5 class="fw-bold">Health & Sensitivity Profile</h5>
                                    <p class="text-muted small mx-auto" style="max-width: 500px;">
                                        Select any condition that applies to you. We will use this to provide <strong>targeted health warnings</strong> when air quality becomes hazardous for your specific condition.
                                    </p>
                                </div>

                                <form method="POST">
                                    <div class="row g-3 justify-content-center">
                                        <?php 
                                            // Define conditions with icons and descriptions
                                            $conditions = [
                                                'None' => ['icon' => 'fa-user', 'desc' => 'No specific sensitivities.'],
                                                'Asthma' => ['icon' => 'fa-lungs', 'desc' => 'Sensitive to PM2.5 and Ozone.'],
                                                'COPD' => ['icon' => 'fa-lungs-virus', 'desc' => 'High risk from particulate matter.'],
                                                'Heart Disease' => ['icon' => 'fa-heart-crack', 'desc' => 'Vulnerable to high pollution levels.'],
                                                'Pregnancy' => ['icon' => 'fa-person-pregnant', 'desc' => 'Protecting maternal and fetal health.'],
                                                'Elderly' => ['icon' => 'fa-person-cane', 'desc' => 'Increased sensitivity to poor air.'],
                                                'Children' => ['icon' => 'fa-child', 'desc' => 'Developing lungs need cleaner air.']
                                            ];
                                            $currentCondition = $user['health_condition'] ?? 'None';
                                        ?>
                                        
                                        <?php foreach ($conditions as $name => $data): ?>
                                        <div class="col-md-6 col-lg-5">
                                            <label class="card h-100 border cursor-pointer hover-shadow position-relative">
                                                <input type="radio" name="health_condition" value="<?= $name ?>" class="card-input-element d-none" <?= $currentCondition === $name ? 'checked' : '' ?>>
                                                <div class="card-body d-flex align-items-center gap-3 p-3">
                                                    <div class="icon-box bg-light text-primary rounded-circle d-flex align-items-center justify-content-center flex-shrink-0" style="width: 48px; height: 48px;">
                                                        <i class="fa-solid <?= $data['icon'] ?>"></i>
                                                    </div>
                                                    <div>
                                                        <span class="d-block fw-bold"><?= $name ?></span>
                                                        <span class="small text-muted"><?= $data['desc'] ?></span>
                                                    </div>
                                                    <div class="ms-auto check-icon text-primary opacity-0 transition">
                                                        <i class="fa-solid fa-circle-check fa-lg"></i>
                                                    </div>
                                                </div>
                                            </label>
                                        </div>
                                        <?php endforeach; ?>

                                        <div class="col-12 text-center mt-4">
                                            <button type="submit" name="update_health" class="btn btn-primary px-5 rounded-pill shadow-sm">
                                                Update Health Profile
                                            </button>
                                        </div>
                                    </div>
                                </form>
                                <style>
                                    /* Custom radio card styles */
                                    .card-input-element:checked + .card-body {
                                        background-color: var(--bs-primary-bg-subtle);
                                        border-color: var(--bs-primary) !important;
                                    }
                                    .card-input-element:checked + .card-body .check-icon {
                                        opacity: 1 !important;
                                    }
                                    .hover-shadow:hover {
                                        box-shadow: 0 .5rem 1rem rgba(0,0,0,.05)!important;
                                        border-color: var(--bs-primary) !important;
                                    }
                                </style>
                            </div>

                            <!-- Activity Tab -->
                            <div class="tab-pane fade <?= $activeTab === 'activity' ? 'show active' : '' ?>" id="activity-pane" role="tabpanel">
                                <div class="table-responsive">
                                    <table class="table table-hover align-middle">
                                        <thead class="bg-light">
                                            <tr>
                                                <th>Action</th>
                                                <th>Module</th>
                                                <th>Details</th>
                                                <th>Date &amp; Time</th>
                                                <th>IP Address</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <?php if (!empty($activityRows)): ?>
                                                <?php foreach($activityRows as $row): ?>
                                                    <tr>
                                                        <td>
                                                            <?php 
                                                                $act = strtolower($row['action']);
                                                                $badgeClass = 'bg-secondary-subtle text-secondary';
                                                                if (str_contains($act, 'login')) $badgeClass = 'bg-success-subtle text-success border-success-subtle';
                                                                elseif (str_contains($act, 'logout')) $badgeClass = 'bg-dark-subtle text-dark border-dark-subtle';
                                                                elseif (str_contains($act, 'update') || str_contains($act, 'edit')) $badgeClass = 'bg-info-subtle text-info border-info-subtle';
                                                                elseif (str_contains($act, 'delete') || str_contains($act, 'stop')) $badgeClass = 'bg-danger-subtle text-danger border-danger-subtle';
                                                            ?>
                                                            <span class="badge border <?= $badgeClass ?>"><?= htmlspecialchars($row['action']) ?></span>
                                                        </td>
                                                        <td><span class="badge bg-light text-dark border"><?= htmlspecialchars($row['module'] ?? 'System') ?></span></td>
                                                        <td class="text-muted small"><?= htmlspecialchars($row['details'] ?? '') ?></td>
                                                        <td class="text-muted small"><?= date('M j, Y, h:i A', strtotime($row['created_at'])) ?></td>
                                                        <td class="text-muted small"><?= htmlspecialchars($row['ip_address'] ?? '--') ?></td>
                                                    </tr>
                                                <?php endforeach; ?>
                                            <?php else: ?>
                                                <tr><td colspan="5" class="text-center text-muted py-4">No activity recorded found.</td></tr>
                                            <?php endif; ?>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
    <script src="js/script.js"></script>
    <script src="js/chatbot.js?v=2"></script>
</body>
</html>
