<?php

header("Content-Type: application/json");

require_once "../db.php";

try {
    $stmt = $pdo->query(
        "SELECT id, name, email, role, created_at
         FROM users
         ORDER BY id DESC"
    );

    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "success" => true,
        "users" => $users
    ]);

} catch (PDOException $e) {
    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Failed to fetch users"
    ]);
}