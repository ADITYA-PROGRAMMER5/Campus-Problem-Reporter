<?php

header("Content-Type: application/json");

$response = [
    "success" => true,
    "message" => "Campus Problem Reporter API is working!"
];

echo json_encode($response);