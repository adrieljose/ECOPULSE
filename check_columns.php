<?php
require 'db.php';
$pdo = db();
$stmt = $pdo->query("SHOW COLUMNS FROM devices");
print_r($stmt->fetchAll(PDO::FETCH_ASSOC));
