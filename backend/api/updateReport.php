<?php

session_start();

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

// Handle the browser's CORS preflight request.
if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(204);
    exit;
}

// Only allow POST requests.
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode([
        "success" => false,
        "message" => "Only POST requests are allowed."
    ]);
    exit;
}

// Check the PHP session.
if (!isset($_SESSION["user_id"])) {
    http_response_code(401);
    echo json_encode([
        "success" => false,
        "message" => "Please log in first."
    ]);
    exit;
}

// Get the ID from the server-side session.
// Never trust the user ID sent by React.
$userId = (int) $_SESSION["user_id"];

// Connect to PostgreSQL.
require_once __DIR__ . "/../db.php";

// Read JSON sent by React.
$data = json_decode(file_get_contents("php://input"), true);

if (!is_array($data)) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Invalid JSON data."
    ]);
    exit;
}

// Read and validate the report fields.
$id = filter_var($data["id"] ?? null, FILTER_VALIDATE_INT);

$title = trim($data["title"] ?? "");
$description = trim($data["description"] ?? "");
$category = trim($data["category"] ?? "");
$location = trim($data["location"] ?? "");

if (
    !$id || $id < 1 ||
    $title === "" ||
    $description === "" ||
    $category === "" ||
    $location === ""
) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Please provide all required report fields."
    ]);
    exit;
}

if (
    mb_strlen($title) > 200 ||
    mb_strlen($category) > 50 ||
    mb_strlen($location) > 150
) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "One or more fields exceed the allowed length."
    ]);
    exit;
}

try {
    // Update only a report owned by the logged-in user.
    $sql = "UPDATE reports
            SET title = :title,
                description = :description,
                category = :category,
                location = :location,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = :id
              AND user_id = :user_id
            RETURNING id";

    $stmt = $pdo->prepare($sql);

    $stmt->execute([
        ":title" => $title,
        ":description" => $description,
        ":category" => $category,
        ":location" => $location,
        ":id" => $id,
        ":user_id" => $userId
    ]);

    $updatedReport = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$updatedReport) {
        http_response_code(404);
        echo json_encode([
            "success" => false,
            "message" => "Report not found for this user."
        ]);
        exit;
    }

    echo json_encode([
        "success" => true,
        "message" => "Report updated successfully.",
        "report_id" => $updatedReport["id"]
    ]);

} catch (PDOException $e) {
    error_log($e->getMessage());

    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Could not update the report."
    ]);
}