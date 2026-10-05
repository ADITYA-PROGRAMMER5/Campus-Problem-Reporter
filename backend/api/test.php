<?php

// Browser ko bata raha hai ki ye JSON format me data bhej raha hai
header("Content-Type: application/json");

// PHP associative array me data store kiya hai
$response = [
    // success = true, ye bata raha hai ki API kaam kar rahi hai
    "success" => true,

    // Message jo API ke kaam karne ki confirm de rha hai
    "message" => "Campus Problem Reporter API is working!"
];

// Convert krta hai php code JSON format me aur print krta hai
echo json_encode($response);