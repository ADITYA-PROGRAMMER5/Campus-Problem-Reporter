<?php

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(204);
    exit;
}

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode([
        "success" => false,
        "message" => "Only POST requests are allowed."
    ]);
    exit;
}

require_once __DIR__ . "/../db.php";

$data = json_decode(file_get_contents("php://input"), true);

if (!is_array($data)) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Invalid JSON data."
    ]);
    exit;
}

$id = filter_var($data["id"] ?? null, FILTER_VALIDATE_INT);
$userId = filter_var($data["user_id"] ?? null, FILTER_VALIDATE_INT);

if (!$id || !$userId) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Valid report ID and user ID are required."
    ]);
    exit;
}

try {
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
            "message" => "Report not found for this user."
        ]);
        exit;
    }

    echo json_encode([
        "success" => true,
        "message" => "Report deleted successfully."
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Could not delete the report."
    ]);
}