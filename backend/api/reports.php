<?php

header("Content-Type: application/json");

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