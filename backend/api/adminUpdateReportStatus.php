<?php

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(204);
    exit;
}

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);

    echo json_encode([
        "success" => false,
        "message" => "Only POST requests are allowed"
    ]);

    exit;
}

require_once "../db.php";

$data = json_decode(file_get_contents("php://input"), true);

if (!is_array($data)) {
    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "Invalid JSON data"
    ]);

    exit;
}

$reportId = filter_var(
    $data["id"] ?? null,
    FILTER_VALIDATE_INT
);

$status = trim($data["status"] ?? "");

$allowedStatuses = [
    "pending",
    "in progress",
    "resolved"
];

if (!$reportId || !in_array($status, $allowedStatuses, true)) {
    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "Invalid report ID or status"
    ]);

    exit;
}

try {
    $stmt = $pdo->prepare(
        "UPDATE reports
         SET status = :status,
             updated_at = CURRENT_TIMESTAMP
         WHERE id = :id
         RETURNING id, status"
    );

    $stmt->execute([
        ":status" => $status,
        ":id" => $reportId
    ]);

    $report = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$report) {
        http_response_code(404);

        echo json_encode([
            "success" => false,
            "message" => "Report not found"
        ]);

        exit;
    }

    echo json_encode([
        "success" => true,
        "message" => "Report status updated successfully",
        "report" => $report
    ]);

} catch (PDOException $e) {
    error_log($e->getMessage());

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Failed to update report status"
    ]);
}