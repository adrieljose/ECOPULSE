<?php
require_once __DIR__ . '/db.php';

try {
    $pdo = db();

    // Create system_settings table (PostgreSQL syntax)
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS system_settings (
            setting_key   VARCHAR(50)  PRIMARY KEY,
            setting_value VARCHAR(255)
        )
    ");

    // Insert defaults if not exist (PostgreSQL: ON CONFLICT DO NOTHING replaces INSERT IGNORE)
    $pdo->exec("INSERT INTO system_settings (setting_key, setting_value) VALUES ('active_device_id', '0') ON CONFLICT DO NOTHING");
    $pdo->exec("INSERT INTO system_settings (setting_key, setting_value) VALUES ('recording_active', '0') ON CONFLICT DO NOTHING");

    echo "Table system_settings created and initialized.";

} catch (PDOException $e) {
    echo "Error: " . $e->getMessage();
}
