<?php

// Start the PHP session
session_start();

// JSON and CORS headers
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Handle browser preflight request
if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(204);
    exit;
}

// Allow only GET requests
if ($_SERVER["REQUEST_METHOD"] !== "GET") {
    http_response_code(405);
    echo json_encode([
        "success" => false,
        "message" => "Only GET requests are allowed."
    ]);
    exit;
}

// Check whether the user is logged in
if (!isset($_SESSION["user_id"])) {
    http_response_code(401);
    echo json_encode([
        "success" => false,
        "message" => "Please log in first."
    ]);
    exit;
}

// Only admins can access the users list
if (($_SESSION["role"] ?? "") !== "admin") {
    http_response_code(403);
    echo json_encode([
        "success" => false,
        "message" => "Access denied. Admins only."
    ]);
    exit;
}

// Connect to the database
require_once __DIR__ . "/../db.php";

try {
    // Fetch users without exposing their passwords
    $stmt = $pdo->query(
        "SELECT id, name, email, role, created_at
         FROM users
         ORDER BY id DESC"
    );

    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "success" => true,
        "users" => $users
    ]);

} catch (PDOException $e) {

    // Log details privately on the server
    error_log($e->getMessage());

    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Failed to fetch users."
    ]);
}