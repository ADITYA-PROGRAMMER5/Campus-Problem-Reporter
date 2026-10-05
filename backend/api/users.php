<?php

// Browser ko bata raha hai ki ye JSON format me data bhej raha hai
header("Content-Type: application/json");

// db.php file ko include karo tabi information ko access mile
require_once "../db.php";

try {
    // SQL query run kar rhe hai jo users table se data fetch karega
    // Aur sab users ko id ke descending order me dikhayega
    // SQL Table se data lega
    $stmt = $pdo->query(
        "SELECT id, name, email, role, created_at
         FROM users
         ORDER BY id DESC"
    );

    // Query se sare rows and columns nikalo
    // Har row ko key value format mein do
    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // PHP ka data JSON format me convert kar ke browser ko bhej na
    // Agar data mila to, success = true
    echo json_encode([
        "success" => true,
        "users" => $users
    ]);

    // Error handling agar query fail ho jaye to
} catch (PDOException $e) {
    //500 = Server error code, HTTP status code hai
    // 200 = Success 
    http_response_code(500);

    // Agar query fail ho jaye to, success = false
    // Toh ye message print hoga - Failed to fetch users
    echo json_encode([
        "success" => false,
        "message" => "Failed to fetch users"
    ]);
}