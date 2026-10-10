
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

