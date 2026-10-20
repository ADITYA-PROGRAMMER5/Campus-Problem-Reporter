<?php

session_start();

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

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

// Check login session
if (!isset($_SESSION["user_id"])) {
    http_response_code(401);
    echo json_encode([
        "success" => false,
        "message" => "Please log in first."
    ]);
    exit;
}

// Get logged-in student's ID from the session
$userId = (int) $_SESSION["user_id"];

$data = json_decode(file_get_contents("php://input"), true);

if (!is_array($data)) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Invalid JSON data."
    ]);
    exit;
}

// Validate report ID
$id = filter_var(
    $data["id"] ?? null,
    FILTER_VALIDATE_INT,
    ["options" => ["min_range" => 1]]
);

if ($id === false || $id === null) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "A valid report ID is required."
    ]);
    exit;
}

require_once __DIR__ . "/../db.php";

try {
    // Delete only a report owned by the logged-in student
    $sql = "DELETE FROM reports
            WHERE id = :id
              AND user_id = :user_id
            RETURNING id";

    $stmt = $pdo->prepare($sql);

    $stmt->execute([
        ":id" => $id,
        ":user_id" => $userId
    ]);

    $deletedReport = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$deletedReport) {
        http_response_code(404);
        echo json_encode([
            "success" => false,
            "message" => "Report not found or you do not have permission to delete it."
        ]);
        exit;
    }

    echo json_encode([
        "success" => true,
        "message" => "Report deleted successfully."
    ]);

} catch (PDOException $e) {
    error_log($e->getMessage());

    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Could not delete the report."
    ]);
}