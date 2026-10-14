<?php
/**
 * Database Seeder Script
 * Run from CLI: php database/seed.php
 * Or included by api.php when a full reset is requested.
 */

require_once __DIR__ . '/../config/database.php';

function runSeed() {
    $db = getDB();
    $sqlFile = __DIR__ . '/schema.sql';
    if (!file_exists($sqlFile)) {
        return ['success' => false, 'message' => 'Schema file not found'];
    }
    
    $sql = file_get_contents($sqlFile);
    
    // Execute multiple statements
    try {
        $db->exec($sql);
        return ['success' => true, 'message' => 'Database successfully seeded'];
    } catch (PDOException $e) {
        return ['success' => false, 'message' => $e->getMessage()];
    }
}

// If invoked directly from CLI
if (php_sapi_name() === 'cli' && basename(__FILE__) === basename($_SERVER['SCRIPT_FILENAME'])) {
    echo "Seeding PLB database...\n";
    $result = runSeed();
    echo ($result['success'] ? "SUCCESS: " : "ERROR: ") . $result['message'] . "\n";
}
