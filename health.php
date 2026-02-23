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
$isUser = isset($_SESSION['user']);
$isGuest = isset($_SESSION['guest']);
$isMasterAdmin = ($isAdmin && strtolower($_SESSION['username'] ?? '') === 'masteradmin');

// Restrict health page to non-admin users only
if ($isAdmin) {
    header('Location: index.php');
    exit;
}

$userId = $_SESSION['user_id'] ?? $_SESSION['admin_id'] ?? $_SESSION['user'] ?? $_SESSION['admin'];
$userTable = $isAdmin ? 'admins' : 'users';

$success = '';
$error = '';

try {
    $pdo = db();

    // Handle Form Submission
    if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['update_health'])) {
        $condition = $_POST['health_condition'] ?? 'None';
        $validConditions = ['None', 'Asthma', 'COPD', 'Heart Disease', 'Pregnancy', 'Elderly', 'Children', 'Allergies', 'Athletes', 'Immunocompromised', 'Outdoor Workers'];
        
        if (!in_array($condition, $validConditions)) {
            $error = "Invalid condition selected.";
        } else {
            $stmt = $pdo->prepare("UPDATE $userTable SET health_condition = :hc WHERE id = :id");
            $stmt->execute([':hc' => $condition, ':id' => $userId]);
            
            // Log Activity
            logActivity($pdo, ($isAdmin ? 'admin' : 'user'), $userId, 'Update Health', "Updated health condition to $condition", 'Health Page');
            
            $success = "Health profile updated successfully.";
        }
    }

    // Fetch User Data
    $stmt = $pdo->prepare("SELECT * FROM $userTable WHERE id = :id");
    $stmt->execute([':id' => $userId]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    $userHealthCondition = $user['health_condition'] ?? 'None';

} catch (Throwable $e) {
    $error = "System Error: " . $e->getMessage();
}

// Guidance Data
$guidanceData = [
    'None' => [
        'title' => 'General Health',
        'intro' => 'Even without specific sensitivities, maintaining awareness of air quality is important for long-term health.',
        'pollutants' => ['PM2.5', 'PM10'],
        'sources' => ['Vehicle exhaust', 'Industrial emissions', 'Construction dust'],
        'symptoms' => ['Irritated eyes or throat', 'Shortness of breath during exercise'],
        'tips' => ['Check AQI each morning and plan outdoor time accordingly.', 'Keep windows closed during rush hours.'],
        'actions' => [
            'Monitor daily AQI levels.',
            'Avoid outdoor exercise during "Unhealthy" AQI periods.',
            'Maintain good indoor air circulation.'
        ],
        'risk' => 'Good',
        'snippet' => 'General guidance for everyday air quality awareness.',
        'today' => [
            'If AQI > 100: move workouts indoors.',
            'Use kitchen exhaust when cooking.'
        ],
        'doctor' => ['Seek advice if breathing difficulty persists.', 'Contact a professional for prolonged chest discomfort.'],
        'thresholds' => ['0-50: Safe for all activities.', '51-100: Limit long outdoor workouts.', '101-150: Sensitive groups reduce exertion.'],
        'gear' => ['HEPA purifier for bedroom/living room.', 'Use kitchen exhaust when cooking.', 'Optional: mask if dusty outdoors.']
    ],
    'Asthma' => [
        'title' => 'Asthma Management',
        'intro' => 'Asthmatics are highly sensitive to airway irritants. Tracking particulate matter and ozone is critical.',
        'pollutants' => ['PM2.5', 'Ozone (O3)', 'SO2'],
        'sources' => ['Traffic fumes', 'Power plants', 'Dust storms', 'Wildfire smoke'],
        'symptoms' => ['Wheezing or chest tightness', 'More frequent use of rescue inhaler'],
        'tips' => ['Keep an action plan from your doctor handy.', 'Pre-medicate before outdoor activity on moderate days.'],
        'actions' => [
            'Keep quick-relief medicine (inhaler) handy.',
            'Stay indoors when AQI is "Unhealthy for Sensitive Groups".',
            'Use air purifiers with HEPA filters indoors.',
            'Wear N95 masks if you must go out during high pollution.'
        ],
        'risk' => 'Moderate',
        'snippet' => 'Sensitive to particulates and ozone - keep inhaler close.',
        'today' => [
            'Pre-medicate before outdoor exertion if AQI > 80.',
            'Avoid dusty/traffic-heavy areas today.'
        ],
        'doctor' => ['Call your doctor if inhaler use spikes.', 'Seek care for persistent wheeze or chest tightness.'],
        'thresholds' => ['0-50: Low risk - normal routine.', '51-100: Carry inhaler; shorten outdoor activity.', '101-150: Stay indoors; avoid exertion.', '150+: Stay inside with air filtration.'],
        'gear' => ['Rescue inhaler accessible.', 'N95/KN95 outdoors on bad days.', 'HEPA purifier where you sleep.']
    ],
    'COPD' => [
        'title' => 'COPD Care',
        'intro' => 'For those with Chronic Obstructive Pulmonary Disease, clean air is essential to prevent flare-ups.',
        'pollutants' => ['PM2.5', 'PM10', 'NO2'],
        'sources' => ['Combustion engines', 'Wood burning', 'Industrial emissions'],
        'symptoms' => ['Persistent cough increase', 'Changes in sputum color/amount'],
        'tips' => ['Track AQI + humidity; both can worsen breathing.', 'Plan errands when air is cleaner (early mornings).'],
        'actions' => [
            'Avoid heavy exertion outdoors even on Moderate days.',
            'Keep windows closed during high traffic hours.',
            'Check air quality forecasts daily.',
            'Ensure indoor humidity is kept at comfortable levels.'
        ],
        'risk' => 'Moderate',
        'snippet' => 'Avoid exertion on moderate days; watch AQI and humidity.',
        'today' => [
            'Plan errands early; avoid peak traffic AQI.',
            'Keep rescue meds and water with you.'
        ],
        'doctor' => ['Consult if cough/sputum worsens.', 'Call for medical help if breathing is labored.'],
        'thresholds' => ['0-50: Low risk - light walks OK.', '51-100: Limit long outdoor tasks.', '101-150: Avoid outdoor exertion.', '150+: Stay indoors; use air purifier.'],
        'gear' => ['Portable pulse oximeter if advised.', 'N95/KN95 outdoors on bad days.', 'Humidifier if air is very dry.']
    ],
    'Heart Disease' => [
        'title' => 'Heart Health',
        'intro' => 'Air pollution can trigger heart attacks and strokes. Fine particles (PM2.5) are the biggest threat.',
        'pollutants' => ['PM2.5', 'Carbon Monoxide (CO)'],
        'sources' => ['Vehicle exhaust', 'Industrial combustion', 'Tobacco smoke'],
        'symptoms' => ['Chest pain or tightness', 'Lightheadedness with activity'],
        'tips' => ['Skip strenuous activity on poor AQI days.', 'Avoid outdoor time near busy roads.'],
        'actions' => [
            'Reduce activity levels if you feel chest pain or shortness of breath.',
            'Stay away from busy roads and highways.',
            'Avoid stressful activities during high pollution days.'
        ],
        'risk' => 'Unhealthy',
        'snippet' => 'Fine particles elevate cardiac risk - limit exertion on bad days.',
        'today' => [
            'Skip strenuous activity if AQI > 100.',
            'Stay indoors during peak traffic hours.'
        ],
        'doctor' => ['Seek care for chest pain or dizziness.', 'Call emergency services for severe symptoms.'],
        'thresholds' => ['0-50: Normal routine is fine.', '51-100: Light activity; avoid heavy exertion.', '101-150: Stay indoors; avoid stress.', '150+: Strict indoor time with clean air.'],
        'gear' => ['Blood pressure/heart rate monitor if advised.', 'HEPA purifier in main rooms.', 'N95/KN95 when pollution is high.']
    ],
    'Pregnancy' => [
        'title' => 'Maternal Health',
        'intro' => 'Protecting both maternal and fetal health requires minimizing exposure to toxins.',
        'pollutants' => ['PM2.5', 'CO', 'NO2'],
        'sources' => ['Tobacco smoke', 'Traffic pollution', 'Indoor cooking fumes'],
        'symptoms' => ['Headaches or dizziness', 'Shortness of breath'],
        'tips' => ['Ventilate well when cooking.', 'Choose indoor activities when AQI is poor.'],
        'actions' => [
            'Use exhaust fans while cooking.',
            'Avoid places with heavy smoke or dust.',
            'Stay hydrated and rest indoors during pollution peaks.'
        ],
        'risk' => 'Unhealthy',
        'snippet' => 'Minimize toxin exposure; prioritize clean indoor air.',
        'today' => [
            'Ventilate during cooking; avoid smoky areas.',
            'Choose indoor activities if AQI > 100.'
        ],
        'doctor' => ['Contact your OB if you feel dizzy or breathless.', 'Seek urgent care for severe symptoms.'],
        'thresholds' => ['0-50: Safe for walks; ventilate cooking.', '51-100: Avoid smoky/traffic-heavy areas.', '101-150: Indoors preferred; masks if outside.', '150+: Stay indoors with clean air.'],
        'gear' => ['Cooking exhaust/hood use every meal.', 'N95/KN95 if outdoors during poor AQI.', 'HEPA purifier in bedroom.']
    ],
    'Elderly' => [
        'title' => 'Senior Wellness',
        'intro' => 'Aging bodies are less resilient to oxidative stress caused by air pollution.',
        'pollutants' => ['PM2.5', 'Ozone'],
        'sources' => ['Regional smog', 'Local traffic'],
        'symptoms' => ['Fatigue or dizziness outdoors', 'Coughing or breathing discomfort'],
        'tips' => ['Walk during cleaner hours (morning).', 'Keep medications and hydration handy.'],
        'actions' => [
            'Plan outdoor walks for early morning when air is typically cleaner.',
            'Listen to your body; rest if you feel fatigued.',
            'Ensure regular medical check-ups.'
        ],
        'risk' => 'Moderate',
        'snippet' => 'Plan gentle activity for cleaner hours; hydrate and rest as needed.',
        'today' => [
            'Walk early; rest if AQI rises midday.',
            'Hydrate and keep meds handy.'
        ],
        'doctor' => ['Call your doctor if fatigue/dizziness persists.', 'Seek help for breathing difficulties.'],
        'thresholds' => ['0-50: Light walks fine.', '51-100: Shorter outings; avoid traffic corridors.', '101-150: Indoors preferred; avoid exertion.', '150+: Stay indoors; clean air + hydration.'],
        'gear' => ['N95/KN95 outdoors if AQI high.', 'Use air purifier in living/sleeping area.', 'Walking aid/seat nearby if needed.']
    ],
    'Children' => [
        'title' => 'Child Health',
        'intro' => 'Children breathe more air per pound of body weight, making them more vulnerable.',
        'pollutants' => ['PM2.5', 'NO2', 'Ozone'],
        'sources' => ['School bus exhaust', 'Parks near highways', 'Secondhand smoke'],
        'symptoms' => ['Coughing after playtime', 'Irritated eyes or throat'],
        'tips' => ['Pick play spots away from traffic.', 'Move playtime indoors when AQI > 100.'],
        'actions' => [
            'Limit outdoor playtime when AQI > 100.',
            'Choose play areas away from busy roads.',
            'Encourage nose breathing to filter larger particles.'
        ],
        'risk' => 'Moderate',
        'snippet' => 'Kids inhale more per pound - choose cleaner play areas.',
        'today' => [
            'Move play indoors if AQI > 100.',
            'Pick parks away from traffic.'
        ],
        'doctor' => ['Consult pediatrician for persistent cough.', 'Seek care for breathing trouble post-play.'],
        'thresholds' => ['0-50: Outdoor play fine.', '51-100: Shorten outdoor play if sensitive.', '101-150: Indoor play recommended.', '150+: Stay indoors with clean air.'],
        'gear' => ['HEPA purifier in bedroom/play area.', 'Masks for older kids when AQI is bad.', 'Teach handwashing and nose breathing.']
    ],
    'Allergies' => [
        'title' => 'Allergy Management',
        'intro' => 'Pollen and pollution together can intensify allergic responses.',
        'pollutants' => ['PM2.5', 'Ozone', 'Pollen'],
        'sources' => ['High-pollen days', 'Dusty indoor spaces', 'Vehicle exhaust'],
        'symptoms' => ['Sneezing or runny nose', 'Itchy eyes or throat'],
        'tips' => ['Shower after outdoor exposure.', 'Use nasal rinses and keep windows closed on high pollen days.'],
        'actions' => [
            'Check pollen and AQI before heading out.',
            'Use air purifiers and change filters regularly.',
            'Wear wrap-around glasses to reduce eye exposure.'
        ],
        'risk' => 'Moderate',
        'snippet' => 'Pollen plus pollution can spike symptoms - plan ahead.',
        'today' => ['Keep windows closed during peak pollen.', 'Wear a mask if outdoors on bad AQI + pollen days.'],
        'doctor' => ['See a doctor if over-the-counter meds stop working.', 'Seek care for wheeze or shortness of breath.'],
        'thresholds' => ['0-50: Low risk.', '51-100: Mild symptoms possible.', '101-150: Limit outdoor time.', '150+: Stay indoors; use filtration.'],
        'gear' => ['Saline nasal rinse', 'Antihistamine as prescribed', 'N95/KN95 on high pollen + AQI days']
    ],
    'Athletes' => [
        'title' => 'Active Lifestyle',
        'intro' => 'High breathing rates increase pollutant uptake during exercise.',
        'pollutants' => ['PM2.5', 'Ozone'],
        'sources' => ['Roadside running routes', 'Industrial areas', 'Afternoon ozone peaks'],
        'symptoms' => ['Shortness of breath during workouts', 'Reduced endurance on bad air days'],
        'tips' => ['Schedule training when AQI is best (early AM).', 'Choose routes away from traffic.'],
        'actions' => [
            'Move intense sessions indoors when AQI > 100.',
            'Hydrate well and monitor perceived exertion.',
            'Extend warm-ups and cool-downs on moderate days.'
        ],
        'risk' => 'Moderate',
        'snippet' => 'Time workouts for clean air; avoid traffic-heavy routes.',
        'today' => ['Swap intervals for easy effort if AQI > 100.', 'Train indoors if ozone is high in the afternoon.'],
        'doctor' => ['Consult if you feel chest tightness while training.', 'Seek care for persistent shortness of breath.'],
        'thresholds' => ['0-50: Safe for hard efforts.', '51-100: Moderate intensity OK.', '101-150: Easy only; consider indoor.', '150+: Move training indoors.'],
        'gear' => ['Indoor training option (treadmill/bike).', 'HR monitor to avoid overexertion.', 'N95/KN95 if you must train outside on bad days.']
    ],
    'Immunocompromised' => [
        'title' => 'Immune Support',
        'intro' => 'Those with weakened immunity should minimize pollutant exposure to reduce inflammation.',
        'pollutants' => ['PM2.5', 'PM10', 'Ozone'],
        'sources' => ['Crowded traffic zones', 'Dusty indoor areas', 'Wildfire smoke'],
        'symptoms' => ['Fatigue with minimal activity', 'Increased respiratory irritation'],
        'tips' => ['Keep indoor air clean and avoid crowds on bad AQI days.', 'Plan errands when air quality is better.'],
        'actions' => [
            'Stay indoors with filtration on poor AQI days.',
            'Avoid cleaning or dusting without a mask and ventilation.',
            'Coordinate medical visits on cleaner-air days if possible.'
        ],
        'risk' => 'Unhealthy',
        'snippet' => 'Minimize exposure; prioritize clean indoor air and masks outside.',
        'today' => ['Avoid outdoor errands if AQI > 100.', 'Keep purifier running in main living spaces.'],
        'doctor' => ['Contact your care team for unusual fatigue or breathing issues.', 'Seek urgent care for severe symptoms.'],
        'thresholds' => ['0-50: Maintain routine with clean indoor air.', '51-100: Limit outdoor time.', '101-150: Prefer indoors with filtration.', '150+: Avoid outdoor exposure.'],
        'gear' => ['HEPA purifier in main rooms.', 'N95/KN95 outdoors on moderate/poor AQI.', 'Gloves/mask when cleaning dust.']
    ],
    'Outdoor Workers' => [
        'title' => 'Outdoor Work',
        'intro' => 'Prolonged outdoor exposure increases pollutant uptake; pacing and protection are key.',
        'pollutants' => ['PM2.5', 'Ozone', 'NO2'],
        'sources' => ['Traffic corridors', 'Industrial areas', 'Construction zones'],
        'symptoms' => ['Irritated throat', 'Fatigue during shifts'],
        'tips' => ['Rotate tasks to reduce time in hotspots.', 'Take breaks in cleaner, shaded areas.'],
        'actions' => [
            'Use masks when AQI is moderate or worse.',
            'Plan heavy tasks for cleaner hours (early morning).',
            'Hydrate and rest in filtered indoor areas when possible.'
        ],
        'risk' => 'Moderate',
        'snippet' => 'Protective masks and smart scheduling reduce exposure during shifts.',
        'today' => ['Shift heavier tasks to early hours if AQI > 100.', 'Use mask near traffic or dusty work.'],
        'doctor' => ['Consult for ongoing throat/chest irritation.', 'Seek care for dizziness or breathing trouble on the job.'],
        'thresholds' => ['0-50: Regular schedule.', '51-100: Rotate tasks; use breaks indoors.', '101-150: Mask up; minimize heavy exertion.', '150+: Limit time outdoors; use respirators.'],
        'gear' => ['N95/KN95 for dusty/traffic areas.', 'Eye protection in dusty conditions.', 'Access to indoor filtered break area.']
    ]
];

$currentGuidance = $guidanceData[$userHealthCondition] ?? $guidanceData['None'];
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Health Guidance - EcoPulse</title>
    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css">
    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <!-- Custom CSS -->
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
        <!-- Header -->
        <div class="mb-4 d-flex align-items-center gap-3 reveal flex-wrap">
            <span class="page-title-icon"><i class="fa-solid fa-heart-pulse"></i></span>
            <div>
                <h2 class="text-gray-800 fw-bold mb-1">Health Guidance</h2>
                <p class="text-muted mb-0">Personalized recommendations for your well-being.</p>
            </div>
            <div class="ms-auto header-clock text-center">
                <div class="header-clock-time" id="clockTime">--:--:--</div>
                <div class="header-clock-date" id="clockDate">Loading date...</div>
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

        <div class="row g-4 health-layout">
            <!-- Left Column: Condition Selector -->
            <div class="col-lg-5 col-xl-4 reveal" style="--reveal-delay: 200ms;">
                <div class="card border-0 shadow-sm h-100">
                    <div class="card-header bg-white border-bottom-0 pt-4 px-4 pb-0">
                        <h5 class="fw-bold mb-0">Your Health Profile</h5>
                    </div>
                    <div class="card-body p-4 position-sticky" style="top: 1rem;">
                        <p class="text-muted small mb-4">Select your primary health condition to receive targeted air quality alerts and advice.</p>
                        
                        <form method="POST">
                            <div class="d-flex flex-column gap-3">
                                <?php 
                                    $conditions = [
                                        'None' => 'fa-user',
                                        'Asthma' => 'fa-lungs',
                                        'COPD' => 'fa-lungs-virus',
                                        'Heart Disease' => 'fa-heart-crack',
                                        'Pregnancy' => 'fa-person-pregnant',
                                        'Elderly' => 'fa-person-cane',
                                        'Children' => 'fa-child',
                                        'Allergies' => 'fa-seedling',
                                        'Athletes' => 'fa-person-running',
                                        'Immunocompromised' => 'fa-shield-virus',
                                        'Outdoor Workers' => 'fa-helmet-safety'
                                    ];
                                ?>
                                <?php foreach ($conditions as $name => $icon): ?>
                                    <?php $meta = $guidanceData[$name] ?? []; ?>
                                    <label class="card border cursor-pointer hover-shadow position-relative">
                                        <input type="radio" name="health_condition" value="<?= $name ?>" class="card-input-element health-condition-input d-none" <?= $userHealthCondition === $name ? 'checked' : '' ?> data-condition="<?= $name ?>">
                                        <div class="card-body d-flex align-items-center p-3 flex-wrap">
                                            <div class="icon-box bg-light text-primary rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 me-3" style="width: 40px; height: 40px;">
                                                <i class="fa-solid <?= $icon ?>"></i>
                                            </div>
                                            <div class="flex-grow-1">
                                                <div class="d-flex align-items-center flex-wrap gap-2">
                                                    <span class="fw-medium"><?= $name ?></span>
                                                    <span class="badge rounded-pill bg-primary-subtle text-primary px-2 py-1 small"><?= htmlspecialchars($meta['risk'] ?? 'Info') ?></span>
                                                </div>
                                                <?php if (!empty($meta['snippet'])): ?>
                                                    <div class="text-muted small mt-1"><?= htmlspecialchars($meta['snippet']) ?></div>
                                                <?php endif; ?>
                                            </div>
                                            <div class="ms-auto check-icon text-primary opacity-0 transition">
                                                <i class="fa-solid fa-circle-check"></i>
                                            </div>
                                        </div>
                                    </label>
                                <?php endforeach; ?>
                                <input type="hidden" name="update_health" value="1">
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <!-- Right Column: Personalized Guidance -->
            <div class="col-lg-7 col-xl-8 reveal" style="--reveal-delay: 400ms;">
                <div class="card border-0 shadow-sm h-100">
                    <div class="card-body p-4 p-lg-5 d-flex flex-column gap-4">
                        <div class="mb-0">
                            <h3 class="fw-bold text-primary mb-3" id="healthTitle"><?= htmlspecialchars($currentGuidance['title']) ?></h3>
                            <p class="lead text-muted" id="healthIntro"><?= htmlspecialchars($currentGuidance['intro']) ?></p>
                        </div>

                        <div class="row g-3 g-lg-4 flex-grow-1">
                            <!-- Pollutants to Watch -->
                            <div class="col-md-6 d-flex">
                                <div class="p-4 bg-danger bg-opacity-10 rounded-3 w-100">
                                    <h6 class="fw-bold text-danger mb-3"><i class="fa-solid fa-triangle-exclamation me-2"></i>Pollutants to Watch</h6>
                                    <ul class="mb-0 ps-3 text-danger-emphasis" id="pollutantsList">
                                        <?php foreach ($currentGuidance['pollutants'] as $p): ?>
                                            <li><?= htmlspecialchars($p) ?></li>
                                        <?php endforeach; ?>
                                    </ul>
                                </div>
                            </div>
                             <!-- Common Sources -->
                             <div class="col-md-6 d-flex">
                                <div class="p-4 bg-warning bg-opacity-10 rounded-3 w-100">
                                    <h6 class="fw-bold text-warning-emphasis mb-3"><i class="fa-solid fa-smog me-2"></i>Common Sources</h6>
                                    <ul class="mb-0 ps-3 text-warning-emphasis" id="sourcesList">
                                        <?php foreach ($currentGuidance['sources'] as $s): ?>
                                            <li><?= htmlspecialchars($s) ?></li>
                                        <?php endforeach; ?>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <!-- Recommended Actions -->
                        <div class="p-4 bg-success bg-opacity-10 rounded-3 flex-grow-1">
                            <div class="d-flex align-items-center justify-content-between mb-3">
                                <div class="d-flex align-items-center gap-2">
                                    <i class="fa-solid fa-shield-heart text-success"></i>
                                    <h5 class="fw-bold text-success mb-0">Recommended Actions</h5>
                                </div>
                                <span class="badge rounded-pill px-3 py-2 bg-primary-subtle text-primary" id="riskChip">Risk: --</span>
                            </div>
                            <ul class="list-unstyled mb-0 d-grid gap-2" id="actionsList">
                                <?php foreach ($currentGuidance['actions'] as $action): ?>
                                    <li class="d-flex align-items-start text-dark">
                                        <i class="fa-solid fa-check text-success mt-1 me-3"></i>
                                        <span><?= htmlspecialchars($action) ?></span>
                                    </li>
                                <?php endforeach; ?>
                            </ul>
                        </div>

                        <div class="row g-3 g-lg-4">
                            <div class="col-md-6">
                                <div class="p-4 bg-info bg-opacity-10 rounded-3 h-100">
                                    <h6 class="fw-bold text-info mb-3"><i class="fa-solid fa-stethoscope me-2"></i>Watch for Symptoms</h6>
                                    <ul class="mb-0 ps-3 text-info-emphasis" id="symptomsList">
                                        <?php foreach ($currentGuidance['symptoms'] as $symptom): ?>
                                            <li><?= htmlspecialchars($symptom) ?></li>
                                        <?php endforeach; ?>
                                    </ul>
                                    <div class="mt-3">
                                        <div class="text-muted small fw-semibold mb-1" id="doctorListLabel">Call your doctor if:</div>
                                        <ul class="mb-0 ps-3 text-muted" id="doctorList">
                                            <?php foreach ($currentGuidance['doctor'] ?? [] as $doc): ?>
                                                <li><?= htmlspecialchars($doc) ?></li>
                                            <?php endforeach; ?>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="p-4 bg-primary bg-opacity-10 rounded-3 h-100">
                                    <h6 class="fw-bold text-primary mb-3"><i class="fa-solid fa-lightbulb me-2"></i>Daily Tips</h6>
                                    <ul class="mb-0 ps-3 text-primary" id="tipsList">
                                        <?php foreach ($currentGuidance['tips'] as $tip): ?>
                                            <li><?= htmlspecialchars($tip) ?></li>
                                        <?php endforeach; ?>
                                    </ul>
                                    <div class="mt-3">
                                        <div class="text-primary fw-semibold mb-1" id="todayListLabel"><i class="fa-solid fa-calendar-day me-2"></i>Today:</div>
                                        <ul class="mb-0 ps-3 text-primary" id="todayList">
                                            <?php foreach ($currentGuidance['today'] ?? [] as $tip): ?>
                                                <li><?= htmlspecialchars($tip) ?></li>
                                            <?php endforeach; ?>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="row g-3 g-lg-4">
                            <div class="col-md-6">
                                <div class="p-4 bg-secondary bg-opacity-10 rounded-3 h-100">
                                    <h6 class="fw-bold text-secondary mb-3"><i class="fa-solid fa-scale-balanced me-2"></i>AQI Thresholds</h6>
                                    <ul class="mb-0 ps-3 text-secondary" id="thresholdsList">
                                        <?php foreach ($currentGuidance['thresholds'] ?? [] as $thr): ?>
                                            <li><?= htmlspecialchars($thr) ?></li>
                                        <?php endforeach; ?>
                                    </ul>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="p-4 bg-dark bg-opacity-10 rounded-3 h-100">
                                    <h6 class="fw-bold text-dark mb-3"><i class="fa-solid fa-mask-face me-2"></i>Protective Gear</h6>
                                    <ul class="mb-0 ps-3 text-dark" id="gearList">
                                        <?php foreach ($currentGuidance['gear'] ?? [] as $gear): ?>
                                            <li><?= htmlspecialchars($gear) ?></li>
                                        <?php endforeach; ?>
                                    </ul>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
            <!-- References Section -->
            <div class="card border-0 shadow-sm mt-4">
                <div class="card-body">
                    <h6 class="fw-bold text-primary mb-2"><i class="fa-solid fa-book-open me-2"></i>References</h6>
                    <div class="text-muted">
                        <div class="d-flex align-items-start gap-2 mb-2">
                            <span class="badge bg-light text-dark border">WHO</span>
                            <a href="https://www.who.int/publications/i/item/9789240034228" target="_blank" rel="noopener noreferrer" class="text-muted text-decoration-none hover-underline">
                                World Health Organization. <em>WHO Global Air Quality Guidelines</em> (2021). Thresholds for PM<sub>2.5</sub>, PM<sub>10</sub>, O<sub>3</sub>, CO, and NO<sub>2</sub>. <i class="fa-solid fa-arrow-up-right-from-square small ms-1"></i>
                            </a>
                        </div>
                        <div class="d-flex align-items-start gap-2 mb-2">
                            <span class="badge bg-light text-dark border">EPA</span>
                            <a href="https://www.airnow.gov/aqi/aqi-basics/" target="_blank" rel="noopener noreferrer" class="text-muted text-decoration-none hover-underline">
                                U.S. Environmental Protection Agency. <em>AQI Basics</em> and pollutant breakpoints (AirNow/EPA). <i class="fa-solid fa-arrow-up-right-from-square small ms-1"></i>
                            </a>
                        </div>
                        <div class="d-flex align-items-start gap-2 mb-2">
                            <span class="badge bg-light text-dark border">CDC</span>
                            <a href="https://www.cdc.gov/air-quality/about.html" target="_blank" rel="noopener noreferrer" class="text-muted text-decoration-none hover-underline">
                                Centers for Disease Control and Prevention. <em>Air Quality and Your Health</em>. <i class="fa-solid fa-arrow-up-right-from-square small ms-1"></i>
                            </a>
                        </div>
                        <div class="d-flex align-items-start gap-2 mb-2">
                            <span class="badge bg-light text-dark border">ALA</span>
                            <a href="https://www.lung.org/clean-air/outdoors/health-impact-of-pollution" target="_blank" rel="noopener noreferrer" class="text-muted text-decoration-none hover-underline">
                                American Lung Association. <em>Health Impact of Air Pollution</em> (State of the Air). <i class="fa-solid fa-arrow-up-right-from-square small ms-1"></i>
                            </a>
                        </div>
                        <div class="d-flex align-items-start gap-2">
                            <span class="badge bg-light text-dark border">NIEHS</span>
                            <a href="https://www.niehs.nih.gov/health/topics/agents/air-pollution" target="_blank" rel="noopener noreferrer" class="text-muted text-decoration-none hover-underline">
                                National Institute of Environmental Health Sciences. <em>Air Pollution and Your Health</em>. <i class="fa-solid fa-arrow-up-right-from-square small ms-1"></i>
                            </a>
                        </div>
                    </div>
                </div>
            </div>

        </div> <!-- End .health-layout -->
    </main>

    <style>
        .hover-underline:hover {
            text-decoration: underline !important;
            color: var(--bs-primary) !important;
        }

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
        .health-layout .card {
            height: 100%;
        }
        .health-layout {
            min-height: 70vh;
        }
        .health-layout .badge {
            font-size: 0.75rem;
        }
        @media (max-width: 991.98px) {
            .health-layout {
                min-height: auto;
            }
        }
    </style>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
    <script src="js/script.js"></script>
    <script src="js/chatbot.js?v=2"></script>
    <script>
        (() => {
            const guidanceData = <?= json_encode($guidanceData) ?>;
            const conditionInputs = Array.from(document.querySelectorAll('.health-condition-input'));

            const els = {
                title: document.getElementById('healthTitle'),
                intro: document.getElementById('healthIntro'),
                pollutants: document.getElementById('pollutantsList'),
                sources: document.getElementById('sourcesList'),
                actions: document.getElementById('actionsList'),
                symptoms: document.getElementById('symptomsList'),
                doctor: document.getElementById('doctorList'),
                doctorLabel: document.getElementById('doctorListLabel'),
                today: document.getElementById('todayList'),
                todayLabel: document.getElementById('todayListLabel'),
                tips: document.getElementById('tipsList'),
                riskChip: document.getElementById('riskChip'),
                thresholds: document.getElementById('thresholdsList'),
                gear: document.getElementById('gearList')
            };

            const renderList = (el, items, iconClass = null) => {
                if (!el) return;
                el.innerHTML = '';
                (items || []).forEach(item => {
                    const li = document.createElement('li');
                    if (iconClass) {
                        li.className = 'd-flex align-items-start text-dark';
                        const icon = document.createElement('i');
                        icon.className = iconClass + ' mt-1 me-3';
                        li.appendChild(icon);
                        const span = document.createElement('span');
                        span.textContent = item;
                        li.appendChild(span);
                    } else {
                        li.textContent = item;
                    }
                    el.appendChild(li);
                });
            };

            const renderCondition = (condition) => {
                const data = guidanceData[condition] || guidanceData['None'];
                if (els.title) els.title.textContent = data.title || 'Health Guidance';
                if (els.intro) els.intro.textContent = data.intro || '';

                renderList(els.pollutants, data.pollutants || []);
                renderList(els.sources, data.sources || []);
                renderList(els.actions, data.actions || [], 'fa-solid fa-check text-success');
                renderList(els.symptoms, data.symptoms || []);
                renderList(els.doctor, data.doctor || []);
                renderList(els.today, data.today || []);
                renderList(els.thresholds, data.thresholds || []);
                renderList(els.gear, data.gear || []);
                renderList(els.tips, data.tips || []);

                if (els.doctorLabel) els.doctorLabel.style.display = (data.doctor && data.doctor.length) ? 'block' : 'none';
                if (els.todayLabel) els.todayLabel.style.display = (data.today && data.today.length) ? 'block' : 'none';

                if (els.riskChip) {
                    const risk = data.risk || 'Unknown';
                    els.riskChip.textContent = `Risk: ${risk}`;
                    els.riskChip.classList.remove('bg-primary-subtle','text-primary','bg-warning-subtle','text-warning','bg-danger-subtle','text-danger','bg-success-subtle','text-success');
                    if (risk.toLowerCase().includes('good')) els.riskChip.classList.add('bg-success-subtle','text-success');
                    else if (risk.toLowerCase().includes('moderate')) els.riskChip.classList.add('bg-warning-subtle','text-warning');
                    else if (risk.toLowerCase().includes('unhealthy')) els.riskChip.classList.add('bg-danger-subtle','text-danger');
                    else els.riskChip.classList.add('bg-primary-subtle','text-primary');
                }

                // Sync checked state for styling
                conditionInputs.forEach(input => {
                    input.checked = input.value === condition;
                });
            };

            const persistCondition = (condition) => {
                try {
                    localStorage.setItem('ecoPulseHealthCondition', condition);
                } catch (_) {}
                const body = new URLSearchParams({ update_health: '1', health_condition: condition });
                fetch(location.href, {
                    method: 'POST',
                    body,
                    credentials: 'same-origin'
                }).catch(() => {/* silent */});
            };

            conditionInputs.forEach(input => {
                input.addEventListener('change', (e) => {
                    const cond = e.target.value;
                    renderCondition(cond);
                    persistCondition(cond);
                });
            });

            // Restore from localStorage if available
            const saved = (() => {
                try { return localStorage.getItem('ecoPulseHealthCondition'); } catch (_) { return null; }
            })();
            if (saved && guidanceData[saved]) {
                renderCondition(saved);
            }
        })();
    </script>
</body>
</html>
