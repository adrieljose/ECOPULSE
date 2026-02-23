<?php
// Determine current page for active state
$currentPage = basename($_SERVER['PHP_SELF']);
// Ensure isAdmin is set (some pages might sets it, but safer to check session)
$isAdmin = isset($_SESSION['admin']);
$userLabel = $_SESSION['username'] ?? 'User';
?>
<script>
    (function () {
        try {
            if (window.innerWidth > 992 && localStorage.getItem('sidebarCollapsed') === 'true') {
                document.body.classList.add('sidebar-collapsed');
            }
        } catch (e) {
            // Ignore storage errors
        }
    })();
</script>
<nav class="sidebar">
    <div class="sidebar-header">
        <a href="index.php" class="sidebar-brand">
            <img src="img/ecopulse_logo_final.png" alt="EcoPulse Logo" class="sidebar-logo">
            <span class="sidebar-brand-text">EcoPulse</span>
        </a>
        <button class="sidebar-collapse-toggle" id="sidebarCollapseToggle" type="button" aria-label="Collapse sidebar">
            <i class="fa-solid fa-angles-left"></i>
        </button>
    </div>

    <ul class="nav flex-column">
        <li class="nav-item">
            <a class="nav-link <?= $currentPage == 'index.php' ? 'active' : '' ?>" href="index.php">
                <i class="fa-solid fa-house nav-icon"></i>
                <span class="nav-text">Dashboard</span>
            </a>
        </li>
        
        <li class="nav-item">
            <a class="nav-link <?= $currentPage == 'map.php' ? 'active' : '' ?>" href="map.php">
                <i class="fa-solid fa-map nav-icon"></i>
                <span class="nav-text">Map View</span>
            </a>
        </li>

        <?php if (!$isAdmin): ?>
        <li class="nav-item">
            <a class="nav-link <?= $currentPage == 'health.php' ? 'active' : '' ?>" href="health.php">
                <i class="fa-solid fa-heart-pulse nav-icon"></i>
                <span class="nav-text">Health</span>
            </a>
        </li>
        <?php endif; ?>

        <?php if ($isAdmin): ?>
        <li class="nav-item">
            <a class="nav-link <?= $currentPage == 'reports.php' ? 'active' : '' ?>" href="reports.php">
                <i class="fa-solid fa-file-lines nav-icon"></i>
                <span class="nav-text">Reports</span>
            </a>
        </li>
        <li class="nav-item">
            <a class="nav-link <?= $currentPage == 'sms.php' ? 'active' : '' ?>" href="sms.php">
                <i class="fa-solid fa-comment-sms nav-icon"></i>
                <span class="nav-text">SMS Alerts</span>
            </a>
        </li>
        <li class="nav-item">
            <a class="nav-link <?= $currentPage == 'admin_management.php' ? 'active' : '' ?>" href="admin_management.php">
                <i class="fa-solid fa-users-gear nav-icon"></i>
                <span class="nav-text">Manage Admins &amp; Users</span>
            </a>
        </li>
        <?php endif; ?>

        <li class="nav-item">
            <a class="nav-link <?= $currentPage == 'profile.php' ? 'active' : '' ?>" href="profile.php">
                <i class="fa-solid fa-user-gear nav-icon"></i>
                <span class="nav-text">My Profile</span>
            </a>
        </li>
        <li class="nav-item">
            <a class="nav-link <?= $currentPage == 'about.php' ? 'active' : '' ?>" href="about.php">
                <i class="fa-solid fa-circle-info nav-icon"></i>
                <span class="nav-text">About</span>
            </a>
        </li>
        <li class="nav-item">
            <a class="nav-link <?= $currentPage == 'support.php' ? 'active' : '' ?>" href="support.php">
                <i class="fa-solid fa-life-ring nav-icon"></i>
                <span class="nav-text">Support</span>
            </a>
        </li>
    </ul>

    <div class="sidebar-footer">
        <?php if (isset($_SESSION['admin']) || isset($_SESSION['user'])): ?>
            <div class="mb-2 text-center text-white-50">
                <small>Logged in as: <strong><?= htmlspecialchars($userLabel) ?></strong></small>
            </div>
            <a href="logout.php" class="btn btn-danger w-100">
                <i class="fa-solid fa-right-from-bracket nav-icon"></i>
                <span class="nav-text">Log Out</span>
            </a>
        <?php else: ?>
            <a href="login.php" class="btn btn-primary w-100">
                <i class="fa-solid fa-right-to-bracket nav-icon"></i>
                <span class="nav-text">Admin Login</span>
            </a>
        <?php endif; ?>
    </div>
</nav>

<div class="toast-container position-fixed bottom-0 end-0 p-3" style="z-index: 9999;">
    <div id="smsAlertToast" class="toast" role="alert" aria-live="assertive" aria-atomic="true" data-bs-delay="8000">
        <div class="toast-header" id="smsAlertToastHeader">
            <i class="fa-solid fa-envelope me-2"></i>
            <strong class="me-auto" id="smsAlertToastTitle">SMS Alert</strong>
            <small id="smsAlertToastTime">Just now</small>
            <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
        <div class="toast-body" id="smsAlertToastBody">
            Alert sent for Device (AQI --)
        </div>
    </div>
</div>
