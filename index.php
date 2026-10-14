<?php
/**
 * Sistem Logistik Lintas Batas (PLB) & E-Seal Terintegrasi - Kelompok 8
 * Main Entry Point (PHP + MySQL)
 */

require_once __DIR__ . '/config/database.php';
require_once __DIR__ . '/api.php';

// Preload database state for instant zero-latency rendering
try {
    $db = getDB();
    $initialDbData = getInitialData($db);
} catch (Exception $e) {
    $initialDbData = null;
}

// 1. Header & HTML Head
require_once __DIR__ . '/includes/header.php';
?>

<!-- Pass MySQL Database State to Frontend JavaScript -->
<script>
    window.INITIAL_DB_DATA = <?= json_encode($initialDbData, JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT) ?>;
</script>

<?php
// 2. Navigation Command Bar
require_once __DIR__ . '/includes/command_nav.php';
?>

<!-- RIGHT MAIN CONTENT CONTAINER -->
<div id="plb-main" class="flex-grow flex flex-col h-full min-w-0 overflow-hidden bg-slate-950">

<?php
// 3. Top Header Bar (Breadcrumbs, Speed, Wifi, Clock, Roles)
require_once __DIR__ . '/includes/top_header.php';

// 4. Tab Views
require_once __DIR__ . '/views/tab_ops.php';
require_once __DIR__ . '/views/tab_simulasi.php';
require_once __DIR__ . '/views/tab_layers.php';
require_once __DIR__ . '/views/tab_dwelling.php';
require_once __DIR__ . '/views/tab_customs.php';
require_once __DIR__ . '/views/tab_manifest.php';
require_once __DIR__ . '/views/tab_fleet.php';
require_once __DIR__ . '/views/tab_wms.php';
?>

</div><!-- /#plb-main -->

<?php
// 5. Interactive Modals
require_once __DIR__ . '/includes/modals.php';

// 6. Quick Sidebar
require_once __DIR__ . '/includes/quick_sidebar.php';

// 7. Footer & JavaScript scripts
require_once __DIR__ . '/includes/footer.php';
?>
