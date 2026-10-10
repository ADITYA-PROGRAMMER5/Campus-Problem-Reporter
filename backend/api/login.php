
<?php

// Return responses in JSON format
header("Content-Type: application/json");

// Allow requests from the React frontend
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

