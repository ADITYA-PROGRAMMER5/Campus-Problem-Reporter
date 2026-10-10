
<?php

// Return responses in JSON format
header("Content-Type: application/json");

// Allow requests from the React frontend
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Handle the browser's preflight request
if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(204);
    exit;
}

// Login only accepts POST requests
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);

    echo json_encode([
        "success" => false,
        "message" => "Only POST requests are allowed"
    ]);

    exit;
}

// Connect to PostgreSQL
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

// Get the email and password
$email = trim($data["email"] ?? "");
$password = $data["password"] ?? "";

// Validate required fields
if ($email === "" || $password === "") {
    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "Email and password are required"
    ]);

    exit;
}

