<?php

header("Content-Type: application/json");

require_once "../db.php";

// Only allow POST requests
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);

    echo json_encode([
        "success" => false,
        "message" => "Only POST requests are allowed"
    ]);

    exit;
}

// Get JSON data from request
$data = json_decode(file_get_contents("php://input"), true);

// Check required fields
$requiredFields = [
    "user_id",
    "title",
    "description",
    "category",
    "location",
    "priority"
];

foreach ($requiredFields as $field) {
    if (!isset($data[$field]) || trim((string)$data[$field]) === "") {
        http_response_code(400);

        echo json_encode([
            "success" => false,
            "message" => "Missing required field: $field"
        ]);

        exit;
    }
}

try {

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
        RETURNING id, user_id, title, description, category, location, priority, status, created_at
    ";

    $stmt = $pdo->prepare($sql);

    $stmt->execute([
        ":user_id" => $data["user_id"],
        ":title" => $data["title"],
        ":description" => $data["description"],
        ":category" => $data["category"],
        ":location" => $data["location"],
        ":priority" => $data["priority"]
    ]);

    $report = $stmt->fetch(PDO::FETCH_ASSOC);

    http_response_code(201);

    echo json_encode([
        "success" => true,
        "message" => "Report created successfully",
        "report" => $report
    ]);

} catch (PDOException $e) {

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Failed to create report"
    ]);
}