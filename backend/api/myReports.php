<?php

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(204);
    exit;
}

if ($_SERVER["REQUEST_METHOD"] !== "GET") {
    http_response_code(405);
    echo json_encode([
        "success" => false,
        "message" => "Method not allowed."
    ]);
    exit;
}

require_once "../db.php";

// Get the student ID from the URL
$userId = filter_input(INPUT_GET, "user_id", FILTER_VALIDATE_INT);

if (!$userId || $userId < 1) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "A valid user ID is required."
    ]);
    exit;
}

try {
    // Fetch reports submitted by this student only
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
    $reports = $stmt->fetchAll();

    echo json_encode([
        "success" => true,
        "reports" => $reports
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Could not fetch your reports."
    ]);
}