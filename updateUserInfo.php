<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Credentials: true');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Start session for authentication
session_start();

// Check if user is logged in
if (!isset($_SESSION['user_id']) && !isset($_COOKIE['user_id'])) {
    echo json_encode([
        'status' => 'error',
        'message' => 'User not authenticated'
    ]);
    exit;
}

// Get user ID from session or cookie
$user_id = $_SESSION['user_id'] ?? $_COOKIE['user_id'];

// Database configuration - UPDATE THESE WITH YOUR ACTUAL DB CREDENTIALS
$host = 'localhost';
$dbname = 'your_database_name';
$username = 'your_username';
$password = 'your_password';

try {
    // Create database connection
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Get JSON input
    $input = json_decode(file_get_contents('php://input'), true);

    if (!$input) {
        echo json_encode([
            'status' => 'error',
            'message' => 'Invalid input data'
        ]);
        exit;
    }

    // Validate and sanitize input
    $name = filter_var($input['name'] ?? '', FILTER_SANITIZE_STRING);
    $email = filter_var($input['email'] ?? '', FILTER_SANITIZE_EMAIL);
    $contact = filter_var($input['contact'] ?? '', FILTER_SANITIZE_STRING);
    $address = filter_var($input['address'] ?? '', FILTER_SANITIZE_STRING);
    $city = filter_var($input['city'] ?? '', FILTER_SANITIZE_STRING);
    $state = filter_var($input['state'] ?? '', FILTER_SANITIZE_STRING);
    $zipCode = filter_var($input['zipCode'] ?? '', FILTER_SANITIZE_STRING);
    $country = filter_var($input['country'] ?? '', FILTER_SANITIZE_STRING);

    // Validate required fields
    if (empty($name) || empty($email)) {
        echo json_encode([
            'status' => 'error',
            'message' => 'Name and email are required'
        ]);
        exit;
    }

    // Validate email format
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode([
            'status' => 'error',
            'message' => 'Invalid email format'
        ]);
        exit;
    }

    // Check if email already exists for another user
    $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ? AND id != ?");
    $stmt->execute([$email, $user_id]);
    if ($stmt->fetch()) {
        echo json_encode([
            'status' => 'error',
            'message' => 'Email already exists'
        ]);
        exit;
    }

    // Update user information
    $sql = "UPDATE users SET 
            name = ?, 
            email = ?, 
            contact = ?, 
            address = ?, 
            city = ?, 
            state = ?, 
            zip_code = ?, 
            country = ?, 
            updated_at = CURRENT_TIMESTAMP 
            WHERE id = ?";
    
    $stmt = $pdo->prepare($sql);
    $result = $stmt->execute([
        $name, 
        $email, 
        $contact, 
        $address, 
        $city, 
        $state, 
        $zipCode, 
        $country, 
        $user_id
    ]);

    if ($result) {
        echo json_encode([
            'status' => 'success',
            'message' => 'Information updated successfully'
        ]);
    } else {
        echo json_encode([
            'status' => 'error',
            'message' => 'Failed to update information'
        ]);
    }

} catch (PDOException $e) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Database error: ' . $e->getMessage()
    ]);
} catch (Exception $e) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Server error: ' . $e->getMessage()
    ]);
}
?>
