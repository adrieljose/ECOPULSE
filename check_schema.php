<?php
require_once 'db.php';
$pdo = db();
$stmt = $pdo->query("DESCRIBE devices");
print_r($stmt->fetchAll(PDO::FETCH_ASSOC));
