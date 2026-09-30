<?php

$config = require __DIR__ . "/config.php";

$dsn = "pgsql:host={$config['host']};port={$config['port']};dbname={$config['dbname']}";

try {
    $pdo = new PDO(
        $dsn,
        $config["user"],
        $config["password"]
    );

    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

} catch (PDOException $e) {
    die("Database connection failed.");
}