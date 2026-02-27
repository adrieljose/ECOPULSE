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
    <title>About - EcoPulse</title>

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
                    <span class="page-title-icon"><i class="fa-solid fa-circle-info"></i></span>
                    <h1 class="mb-0 h2 fw-bold">About EcoPulse</h1>
            </div>
                <div class="header-actions">
                    <!-- Compact Clock -->
                    <div class="d-none d-xl-flex align-items-center text-muted small pe-2 gap-2">
                         <i class="fa-regular fa-clock"></i>
                         <span id="current-time" class="fw-medium text-dark">--:--</span>
                         <span id="current-date" class="d-none">---</span>
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
            <!-- Hero Section -->
            <div class="mb-5 about-hero reveal">
                <div class="text-center">
                    <span class="px-3 py-2 mb-3 badge bg-primary-subtle text-primary-emphasis rounded-pill about-badge">About Our Initiative</span>
                    <h1 class="mb-3 display-5 fw-bold text-dark-blue">Pioneering a Cleaner Future for Himamaylan City</h1>
                    <p class="mx-auto lead text-muted hero-subtitle">
                        EcoPulse is a strategic environmental intelligence platform designed to provide the Local Government of Himamaylan with actionable insights into the city's air quality.
                    </p>
                </div>
            </div>

            <!-- Detailed Content Section -->
            <div class="shadow-sm card about-content reveal" style="--reveal-delay: 400ms;">
                <div class="p-4 card-body p-lg-5">
                    <div class="mb-5 team-section">
                        <div class="star-overlay"></div>
                        <h2 class="about-section-title text-center mb-4">MEET THE TEAM</h2>
                        <div class="team-grid">
                            <div class="team-card">
                                <img src="img/team1.jpg" alt="Team member" class="team-avatar">
                                <div class="team-name">Adriel Jose C. Villas</div>
                                <div class="team-role">Programmer</div>
                            </div>
                            <div class="team-card">
                                <img src="img/team2_black.png" alt="Team member" class="team-avatar">
                                <div class="team-name">Bridget E. Sator</div>
                                <div class="team-role">System Analyst</div>
                            </div>
                            <div class="team-card">
                                <img src="img/team3_black.png" alt="Team member" class="team-avatar">
                                <div class="team-name">Jasper C. Torremoro</div>
                                <div class="team-role">Project Manager</div>
                            </div>
                            <div class="team-card">
                                <img src="img/team4_black.png" alt="Team member" class="team-avatar">
                                <div class="team-name">Nichael O. Estremadora</div>
                                <div class="team-role">System Designer</div>
                            </div>
                        </div>
                    </div>

                    <div class="mb-4 about-section">
                        <h4 class="about-section-title">Our Mission</h4>
                        <p>
                            Our core mission is to provide accurate, timely, and accessible air quality data to empower city officials, researchers, and residents. By leveraging smart sensor technology and data analytics, we aim to foster proactive environmental management, support public health initiatives, and promote a sustainable future for Himamaylan.
                        </p>
                    </div>

                    <div class="mb-4 about-section">
                        <h4 class="about-section-title">Our Vision</h4>
                        <p>
                            A healthier Himamaylan where clean air is monitored, understood, and acted upon every day—enabling resilient communities, informed policy, and a culture of environmental stewardship for generations to come.
                        </p>
                    </div>

                    <div class="mb-4 about-section">
                        <h4 class="about-section-title">The Technology</h4>
                        <p>
                            EcoPulse is built on a network of IoT sensors strategically placed across Himamaylan City. These sensors continuously measure key pollutants, providing a high-resolution view of the city's air quality. The data is then transmitted to our central platform for real-time analysis and visualization.
                        </p>
                        <ul class="about-list two-col">
                            <li>Real-Time Monitoring</li>
                            <li>Live Map View</li>
                            <li>Pollutant Source Identification</li>
                            <li>Predictive Trend Analysis</li>
                            <li>Public Data Portal</li>
                            <li>Comprehensive Reporting</li>
                        </ul>
                    </div>

                    <div class="about-section">
                        <h4 class="about-section-title">Our Commitment</h4>
                        <p>
                            We are committed to a collaborative partnership with the Local Government of Himamaylan. EcoPulse is more than just a system; it's a tool for community engagement, policy-making, and scientific research. We are dedicated to ensuring the platform remains reliable, secure, and evolves to meet the future environmental needs of the city.
                        </p>
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

    <!-- Custom JS -->
    <script src="js/script.js"></script>
    
    <!-- EcoBot AI -->
    <script src="js/chatbot.js?v=2"></script>
</body>
</html>
