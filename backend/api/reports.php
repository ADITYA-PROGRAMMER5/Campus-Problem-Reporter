<?php

// Browser ko bata raha hai ki API JSON format me data bhej rahi hai
header("Content-Type: application/json");

// React frontend ko PHP API access karne ki permission
header("Access-Control-Allow-Origin: http://localhost:5173");

// Allowed HTTP methods
header("Access-Control-Allow-Methods: GET, OPTIONS");

// Allowed request headers
header("Access-Control-Allow-Headers: Content-Type");

// Browser ki preflight OPTIONS request handle karo
if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(204);
    exit;
}

require_once "../db.php";

require_once "../db.php";

try {
    $stmt = $pdo->query(
        "SELECT
            reports.id,
            reports.title,
            reports.description,
            reports.category,
            reports.location,
            reports.priority,
            reports.status,
            reports.created_at,
            users.name AS student_name,
            users.email AS student_email
        FROM reports
        JOIN users
            ON reports.user_id = users.id
        ORDER BY reports.id DESC"
    );

    $reports = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "success" => true,
        "reports" => $reports
    ]);

} catch (PDOException $e) {
    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Failed to fetch reports"
    ]);
}