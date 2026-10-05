<?php

$config = require __DIR__ . "/config.php";

// DSN = Database ka information store krta hai 
// DSN = Data Source Name
$dsn = "pgsql:host={$config['host']};port={$config['port']};dbname={$config['dbname']}";

// PDO = Mujhe POSTGRESsql se connect kena hai ye port, ye localhost aur ye database se
// PDO = PHP Data Objects
try {
    $pdo = new PDO(
        $dsn,
        $config["user"],
        $config["password"]
    );

    // Database error Sahi se dikhana
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

} catch (PDOException $e) {
    die("Database connection failed.");
}