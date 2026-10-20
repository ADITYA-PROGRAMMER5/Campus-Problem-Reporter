<?php

session_start();

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Handle browser preflight requests
if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(204);
    exit;
}

// Only GET requests are allowed
if ($_SERVER["REQUEST_METHOD"] !== "GET") {
    http_response_code(405);
    echo json_encode([
        "success" => false,
        "message" => "Method not allowed."
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

// Use the ID from the PHP session, not the URL
$userId = (int) $_SESSION["user_id"];

require_once "../db.php";

try {
    // Fetch only reports belonging to the logged-in student
    $stmt = $pdo->prepare("
        SELECT
            id,
            title,
            description,
            category,
            location,
            priority,
            status,
            created_at
        FROM reports
        WHERE user_id = :user_id
        ORDER BY id DESC
    ");

    $stmt->execute(["user_id" => $userId]);
    $reports = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "success" => true,
        "reports" => $reports
    ]);

} catch (PDOException $e) {
    error_log($e->getMessage());

    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Could not fetch your reports."
    ]);
}