<?php
header('Content-Type: application/json');
require_once __DIR__ . '/../db.php';

// Allow CORS for development (React dev server)
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
    exit;
}

// Get JSON input
$input = json_decode(file_get_contents('php://input'), true);

$username = trim($input['username'] ?? '');
$password = $input['password'] ?? '';
$confirm_password = $input['confirm_password'] ?? '';
$birthday = $input['birthday'] ?? '';
$age = $input['age'] ?? '';
$contact_number = trim($input['contact_number'] ?? '');
$province = $input['province'] ?? '';
$city = $input['city'] ?? '';
$barangay = $input['barangay'] ?? '';
$street = trim($input['street'] ?? '');
$zip_code = trim($input['zip_code'] ?? '');

$errors = [];

// Validation
if (empty($username) || empty($password) || empty($birthday) || empty($contact_number) || empty($province) || empty($city) || empty($barangay)) {
    $errors[] = 'Please fill in all required fields.';
} elseif ($password !== $confirm_password) {
    $errors[] = 'Passwords do not match.';
} elseif (!preg_match('/^09\d{9}$/', $contact_number)) {
    $errors[] = 'Contact number must be 11 digits and start with 09.';
}

if (!empty($errors)) {
    echo json_encode(['success' => false, 'message' => implode(' ', $errors), 'errors' => $errors]);
    exit;
}

try {
    $pdo = db();
    // Check if user exists
    $stmt = $pdo->prepare('SELECT COUNT(*) FROM users WHERE username = :username');
    $stmt->execute([':username' => $username]);
    if ($stmt->fetchColumn() > 0) {
        echo json_encode(['success' => false, 'message' => 'Username is already taken.']);
        exit;
    }

    // Register
    $hash = password_hash($password, PASSWORD_BCRYPT);
    $sql = "INSERT INTO users (username, password_hash, birthday, age, contact_number, province, city, barangay, street, zip_code) 
            VALUES (:username, :hash, :birthday, :age, :contact_number, :province, :city, :barangay, :street, :zip_code)";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        ':username' => $username,
        ':hash' => $hash,
        ':birthday' => $birthday,
        ':age' => $age,
        ':contact_number' => $contact_number,
        ':province' => $province,
        ':city' => $city,
        ':barangay' => $barangay,
        ':street' => $street,
        ':zip_code' => $zip_code
    ]);

    echo json_encode(['success' => true, 'message' => 'Account created successfully!']);

} catch (Throwable $e) {
    echo json_encode(['success' => false, 'message' => 'Registration failed: ' . $e->getMessage()]);
}
