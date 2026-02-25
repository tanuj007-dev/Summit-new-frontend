<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Credentials: true');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Database configuration
$db_host = 'localhost';
$db_user = 'root';
$db_pass = '';
$db_name = 'summit_appliances';

// Create database connection
$conn = new mysqli($db_host, $db_user, $db_pass, $db_name);

// Check connection
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Database connection failed'
    ]);
    exit;
}

// Get POST data
$name = isset($_POST['name']) ? trim($_POST['name']) : '';
$email = isset($_POST['email']) ? trim($_POST['email']) : '';
$contact = isset($_POST['contact']) ? trim($_POST['contact']) : '';
$address = isset($_POST['address']) ? trim($_POST['address']) : '';
$password = isset($_POST['password']) ? $_POST['password'] : '';

// Validate input
if (empty($name) || empty($email) || empty($contact) || empty($address) || empty($password)) {
    http_response_code(400);
    echo json_encode([
        'status' => 'error',
        'message' => 'All fields are required'
    ]);
    exit;
}

// Validate email
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode([
        'status' => 'error',
        'message' => 'Invalid email format'
    ]);
    exit;
}

// Validate password (at least 6 characters, one uppercase, one special character)
$password_pattern = '/^(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{6,}$/';
if (!preg_match($password_pattern, $password)) {
    http_response_code(400);
    echo json_encode([
        'status' => 'error',
        'message' => 'Password must be at least 6 characters, include one uppercase letter and one special character'
    ]);
    exit;
}

// Check if email already exists
$check_email = "SELECT id FROM users WHERE email = ?";
$stmt = $conn->prepare($check_email);
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    http_response_code(409);
    echo json_encode([
        'status' => 'error',
        'message' => 'Email already registered'
    ]);
    exit;
}

// Hash password
$hashed_password = password_hash($password, PASSWORD_DEFAULT);

// Insert new user
$insert_query = "INSERT INTO users (name, email, contact, address, password, created_at) VALUES (?, ?, ?, ?, ?, NOW())";
$stmt = $conn->prepare($insert_query);
$stmt->bind_param("sssss", $name, $email, $contact, $address, $hashed_password);

if ($stmt->execute()) {
    // Start session for auto-login
    session_start();
    $_SESSION['user_id'] = $conn->insert_id;
    $_SESSION['user_email'] = $email;
    $_SESSION['user_name'] = $name;
    $_SESSION['logged_in'] = true;
    
    echo json_encode([
        'status' => 'success',
        'message' => 'Registration successful! You can now login.',
        'user' => [
            'id' => $conn->insert_id,
            'name' => $name,
            'email' => $email
        ]
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Registration failed. Please try again.'
    ]);
}

$stmt->close();
$conn->close();
?>
