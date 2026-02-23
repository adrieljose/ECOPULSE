<?php
require_once __DIR__ . '/db.php';
$pdo = db();
$stmt = $pdo->query("SHOW CREATE TABLE barangays");
print_r($stmt->fetch(PDO::FETCH_ASSOC));

$stmt2 = $pdo->query("DESCRIBE users");
print_r($stmt2->fetchAll(PDO::FETCH_ASSOC));
?>
