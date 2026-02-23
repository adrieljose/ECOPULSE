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
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Support - EcoPulse</title>

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
                    <span class="page-title-icon"><i class="fa-solid fa-life-ring"></i></span>
                    <h1 class="mb-0 h2 fw-bold">Support Center</h1>
                </div>
                <!-- Header Actions -->
                <div class="header-actions gap-3 align-items-center">
                    <div class="d-none d-md-flex align-items-center gap-2 px-3 py-2 rounded-3 bg-white shadow-sm">
                        <div class="user-avatar-placeholder d-flex align-items-center justify-content-center text-uppercase fw-bold text-primary">
                            <?= htmlspecialchars(substr($currentUserLabel, 0, 1)) ?: 'U' ?>
                        </div>
                        <div class="d-flex flex-column">
                            <span class="fw-semibold small"><?= htmlspecialchars($currentUserLabel) ?></span>
                            <span class="text-muted small"><?= htmlspecialchars($currentRole) ?></span>
                        </div>
                    </div>
                    <div class="header-clock text-center">
                        <div class="header-clock-time" id="clockTime">--:--:--</div>
                        <div class="header-clock-date" id="clockDate">Loading date…</div>
                    </div>
                </div>
            </header>

            <!-- Hero Section -->
            <div class="support-hero-section mb-5 reveal">
                <div class="support-hero-bg"></div>
                <h2 class="fw-bold mb-3">How can we help you today?</h2>
                <p class="opacity-75 mb-0">We’re here to help—browse below or reach out.</p>
            </div>

            <!-- Topics Grid -->
            <div class="mb-5 reveal" style="--reveal-delay: 100ms;">
                <h4 class="mb-4 fw-bold text-dark-blue px-2">Quick Actions</h4>
                <div class="topic-grid">
                    <a href="map.php" class="topic-card">
                        <div class="topic-icon-wrapper">
                            <i class="fa-solid fa-map-location-dot"></i>
                        </div>
                        <div class="topic-title">Check Devices</div>
                        <div class="topic-desc">Jump to Live Map to see online status and latest readings.</div>
                    </a>
                    <a href="reports.php" class="topic-card">
                        <div class="topic-icon-wrapper">
                            <i class="fa-solid fa-file-export"></i>
                        </div>
                        <div class="topic-title">Download Reports</div>
                        <div class="topic-desc">Export activity, alerts, and air quality summaries.</div>
                    </a>
                    <a href="sms.php" class="topic-card">
                        <div class="topic-icon-wrapper">
                            <i class="fa-solid fa-bell"></i>
                        </div>
                        <div class="topic-title">Manage Alerts</div>
                        <div class="topic-desc">Edit SMS thresholds and notification preferences.</div>
                    </a>
                    <a href="profile.php" class="topic-card">
                        <div class="topic-icon-wrapper">
                            <i class="fa-solid fa-id-badge"></i>
                        </div>
                        <div class="topic-title">Update Profile</div>
                        <div class="topic-desc">Change your contact info, password, and account details.</div>
                    </a>
                    <a href="admin_management.php" class="topic-card">
                        <div class="topic-icon-wrapper">
                            <i class="fa-solid fa-users-gear"></i>
                        </div>
                        <div class="topic-title">Invite Team</div>
                        <div class="topic-desc">Add admins or users and assign the right access.</div>
                    </a>
                    <a href="mailto:ecopulsehmi@gmail.com" class="topic-card">
                        <div class="topic-icon-wrapper">
                            <i class="fa-solid fa-headset"></i>
                        </div>
                        <div class="topic-title">Contact Support</div>
                        <div class="topic-desc">Reach out to our team for help with anything else.</div>
                    </a>
                </div>
            </div>

            <!-- FAQ Section -->
            <div class="row g-4 mb-5 reveal" style="--reveal-delay: 200ms;">
                <div class="col-lg-8">
                    <h4 class="mb-4 fw-bold text-dark-blue">Frequently Asked Questions</h4>
                    <div class="accordion modern-faq-list" id="faqAccordion">
                        <div class="accordion-item">
                            <h2 class="accordion-header">
                                <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#faq-1">
                                    How do I interpret the Air Quality Index (AQI) values?
                                </button>
                            </h2>
                            <div id="faq-1" class="accordion-collapse collapse show" data-bs-parent="#faqAccordion">
                                <div class="accordion-body">
                                    The AQI is a scale from 0 to 500. The higher the AQI value, the greater the level of air pollution and the greater the health concern. For example, an AQI value of 50 or below represents good air quality, while an AQI value over 300 represents hazardous air quality.
                                </div>
                            </div>
                        </div>
                        <div class="accordion-item">
                            <h2 class="accordion-header">
                                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq-2">
                                    What does "Dominant Pollutant" mean?
                                </button>
                            </h2>
                            <div id="faq-2" class="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                                <div class="accordion-body">
                                    The "Dominant Pollutant" is the specific air pollutant that is currently contributing the most to the overall AQI value at a given location. Common dominant pollutants include PM2.5, PM10, and Ozone (O₃).
                                </div>
                            </div>
                        </div>
                        <div class="accordion-item">
                            <h2 class="accordion-header">
                                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq-3">
                                    How often is the data on the dashboard updated?
                                </button>
                            </h2>
                            <div id="faq-3" class="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                                <div class="accordion-body">
                                    The data from our sensor network is collected and updated in near real-time. The dashboard typically reflects data that is no more than 5-10 minutes old, ensuring you have the most current information for decision-making.
                                </div>
                            </div>
                        </div>
                        <div class="accordion-item">
                            <h2 class="accordion-header">
                                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq-4">
                                    How can I add a new device?
                                </button>
                            </h2>
                            <div id="faq-4" class="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                                <div class="accordion-body">
                                    Only Administrators can add new devices. Go to "My Devices", click the "Add Device" button top-right, fill in the device details (Code, Name, Location), and click Save.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-lg-4">
                    <h4 class="mb-4 fw-bold text-dark-blue">Still need help?</h4>
                    <div class="d-flex flex-column gap-3">
                        <a href="https://mail.google.com/mail/?view=cm&fs=1&to=ecopulsehim@gmail.com" target="_blank" class="contact-card">
                            <div class="contact-icon bg-primary-subtle text-primary">
                                <i class="fa-solid fa-envelope"></i>
                            </div>
                            <div>
                                <div class="fw-bold text-dark">Email Support</div>
                                <div class="small text-muted">ecopulsehim@gmail.com</div>
                            </div>
                        </a>
                        <div class="contact-card cursor-pointer" onclick="document.querySelector('.ecobot-launcher').click()">
                            <div class="contact-icon bg-success-subtle text-success">
                                <i class="fa-solid fa-comments"></i>
                            </div>
                            <div>
                                <div class="fw-bold text-dark">AI Assistant</div>
                                <div class="small text-muted">Chat with ECO AI</div>
                            </div>
                        </div>
                        <div class="contact-card">
                            <div class="contact-icon bg-info-subtle text-info">
                                <i class="fa-solid fa-phone"></i>
                            </div>
                            <div>
                                <div class="fw-bold text-dark">Call Us</div>
                                <div class="small text-muted">0995 177 4034</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </main>

    <!-- Feather Icons -->
    <script src="https://cdn.jsdelivr.net/npm/feather-icons/dist/feather.min.js"></script>
    <script>
      feather.replace()
    </script>

    <!-- Bootstrap JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>

    <!-- EcoBot AI -->
    <script src="js/chatbot.js?v=2"></script>

    <!-- Custom JS -->
    <script src="js/script.js"></script>
</body>
</html>
