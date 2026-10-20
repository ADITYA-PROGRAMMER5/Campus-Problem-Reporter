<?php

// Start the PHP session
session_start();

// JSON response and CORS settings
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
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
        "message" => "Only POST requests are allowed."
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

// Get the logged-in user's ID from the session
$userId = (int) $_SESSION["user_id"];

// Connect to the database
require_once __DIR__ . "/../db.php";

// Read JSON data from React
$data = json_decode(file_get_contents("php://input"), true);

// Validate JSON
if (!is_array($data)) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Invalid JSON data."
    ]);
    exit;
}

// Required fields (user_id is not accepted from React)
$requiredFields = [
    "title",
    "description",
    "category",
    "location",
    "priority"
];

// Check required fields
foreach ($requiredFields as $field) {
    if (
        !isset($data[$field]) ||
        !is_string($data[$field]) ||
        trim($data[$field]) === ""
    ) {
        http_response_code(400);
        echo json_encode([
            "success" => false,
            "message" => "Missing or invalid field: $field"
        ]);
        exit;
    }
}

// Clean up input values
$title = trim($data["title"]);
$description = trim($data["description"]);
$category = trim($data["category"]);
$location = trim($data["location"]);
$priority = trim($data["priority"]);

// Validate priority
if (!in_array($priority, ["low", "medium", "high"], true)) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Invalid priority."
    ]);
    exit;
}

try {

    // Create report using the logged-in user's ID
    $sql = "
        INSERT INTO reports (
            user_id,
            title,
            description,
            category,
            location,
            priority
        )
        VALUES (
            :user_id,
            :title,
            :description,
            :category,
            :location,
            :priority
        )
        RETURNING id, user_id, title, description,
                  category, location, priority, status, created_at
    ";

    $stmt = $pdo->prepare($sql);

    $stmt->execute([
        ":user_id" => $userId,
        ":title" => $title,
        ":description" => $description,
        ":category" => $category,
        ":location" => $location,
        ":priority" => $priority
    ]);

    $report = $stmt->fetch(PDO::FETCH_ASSOC);

    http_response_code(201);
    echo json_encode([
        "success" => true,
        "message" => "Report created successfully.",
        "report" => $report
    ]);

} catch (PDOException $e) {

    // Log technical details on the server, not in the response
    error_log($e->getMessage());

    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Failed to create report."
    ]);
}