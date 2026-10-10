<?php

// Send JSON response to the frontend
header("Content-Type: application/json");

// Allow requests from React
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Handle browser preflight request
if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(204);
    exit;
}

// Allow only POST requests
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);

    echo json_encode([
        "success" => false,
        "message" => "Only POST requests are allowed"
    ]);

    exit;
}

// Connect to the database
require_once "../db.php";

// Read JSON data sent by React
$data = json_decode(file_get_contents("php://input"), true);

// Check whether valid JSON was received
if (!is_array($data)) {
    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "Invalid JSON data"
    ]);

    exit;
}

// Get and clean form values
$name = trim($data["name"] ?? "");
$email = trim($data["email"] ?? "");
$password = $data["password"] ?? "";

// Validate required fields
if ($name === "" || $email === "" || $password === "") {
    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "Name, email and password are required"
    ]);

    exit;
}

// Validate email format
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "Please enter a valid email address"
    ]);

    exit;
}

// Require at least 8 characters
if (strlen($password) < 8) {
    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "Password must be at least 8 characters"
    ]);

    exit;
}

try {

    // Check if the email already exists
    $checkSql = "SELECT id FROM users WHERE email = :email";

    $checkStmt = $pdo->prepare($checkSql);

    $checkStmt->execute([
        ":email" => $email
    ]);

    if ($checkStmt->fetch()) {
        http_response_code(409);

        echo json_encode([
            "success" => false,
            "message" => "This email is already registered"
        ]);

        exit;
    }

    // Hash the password before storing it
    $hashedPassword = password_hash(
        $password,
        PASSWORD_DEFAULT
    );

    // Insert the new student into the database
    $sql = "
        INSERT INTO users (name, email, password, role)
        VALUES (:name, :email, :password, 'student')
        RETURNING id, name, email, role, created_at
    ";

    $stmt = $pdo->prepare($sql);

    $stmt->execute([
        ":name" => $name,
        ":email" => $email,
        ":password" => $hashedPassword
    ]);

    // Get the newly created user's details
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    // Return success response
    http_response_code(201);

    echo json_encode([
        "success" => true,
        "message" => "Registration successful",
        "user" => $user
    ]);

} catch (PDOException $e) {

    // Log technical details on the server, not in the public response
    error_log($e->getMessage());

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Registration failed. Please try again."
    ]);
}