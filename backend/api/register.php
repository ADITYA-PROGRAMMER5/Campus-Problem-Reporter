<?php

// Send JSON response to the frontend
header("Content-Type: application/json");

// Allow requests from React
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

