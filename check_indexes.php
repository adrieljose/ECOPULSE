<?php
require 'db.php';
$pdo = db();
$stmt = $pdo->query("SHOW INDEX FROM readings");
print_r($stmt->fetchAll(PDO::FETCH_ASSOC));
