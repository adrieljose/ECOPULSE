<?php
require_once 'db.php';
$pdo = db();
$id = 68;

// 1. Check current
$stmt = $pdo->prepare("SELECT is_active FROM devices WHERE id = ?");
$stmt->execute([$id]);
$current = $stmt->fetchColumn();
echo "Current Status for ID $id: " . var_export($current, true) . "\n";

// 2. Toggle
$newState = ($current == 1) ? 0 : 1;
$update = $pdo->prepare("UPDATE devices SET is_active = ? WHERE id = ?");
$update->execute([$newState, $id]);
echo "Toggled to: $newState\n";

// 3. Check again
$stmt->execute([$id]);
$newVal = $stmt->fetchColumn();
echo "New Status in DB: " . var_export($newVal, true) . "\n";
