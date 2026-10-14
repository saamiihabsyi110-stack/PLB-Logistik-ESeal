<?php
/**
 * REST API Controller for PLB System
 * Provides data synchronization with MySQL Database
 */

require_once __DIR__ . '/config/database.php';
require_once __DIR__ . '/database/seed.php';

$db = getDB();

function getInitialData($db) {
    // 1. Cases
    $casesStmt = $db->query("SELECT * FROM `cases`");
    $casesRows = $casesStmt->fetchAll();
    $cases = [];
    foreach ($casesRows as $row) {
        $key = $row['container_no'];
        $cases[$key] = [
            'shipmentId'         => $row['shipment_id'],
            'containerNo'        => $row['container_no'],
            'blNumber'           => $row['bl_number'],
            'importer'           => $row['importer'],
            'origin'             => $row['origin'],
            'destination'        => $row['destination'],
            'cargo'              => $row['cargo'],
            'hsCode'             => $row['hs_code'],
            'grossWeight'        => (int)$row['gross_weight'],
            'customsStatus'      => $row['customs_status'],
            'customsStage'       => $row['customs_stage'],
            'customsStageIndex'  => (int)$row['customs_stage_index'],
            'gateStatus'         => $row['gate_status'],
            'yardLocation'       => $row['yard_location'],
            'rfidStatus'         => $row['rfid_status'],
            'esealStatus'        => $row['eseal_status'],
            'esealId'            => $row['eseal_id'],
            'truckPlate'         => $row['truck_plate'],
            'customsDocument'    => $row['customs_document'],
            'documents'          => json_decode($row['documents'], true) ?: new stdClass(),
            'timeline'           => json_decode($row['timeline'], true) ?: [],
            'alerts'             => json_decode($row['alerts'], true) ?: []
        ];
    }

    // 2. Enterprise
    $reqs = $db->query("SELECT id, title, type, domain, priority, owner, status, release_ver as `release`, coverage FROM enterprise_requirements")->fetchAll();
    $tests = $db->query("SELECT id, req_id as req, scenario, status, tester, severity FROM enterprise_tests")->fetchAll();
    $defects = $db->query("SELECT id, title, severity, priority, status, req_id as req, owner FROM enterprise_defects")->fetchAll();
    $assets = $db->query("SELECT id, name, type, status, health, hours, next_maintenance as next, cost, downtime FROM enterprise_assets")->fetchAll();
    foreach ($assets as &$a) {
        $a['health'] = (int)$a['health'];
        $a['hours'] = (int)$a['hours'];
        $a['cost'] = (float)$a['cost'];
        $a['downtime'] = (float)$a['downtime'];
    }
    $workorders = $db->query("SELECT id, asset_id as asset, issue, type, priority, status, cost, eta FROM enterprise_workorders")->fetchAll();
    foreach ($workorders as &$w) {
        $w['cost'] = (float)$w['cost'];
    }
    $spareParts = $db->query("SELECT part, stock, min_stock as min, reserved, status FROM enterprise_spare_parts")->fetchAll();
    foreach ($spareParts as &$s) {
        $s['stock'] = (int)$s['stock'];
        $s['min'] = (int)$s['min'];
        $s['reserved'] = (int)$s['reserved'];
    }
    $costsRow = $db->query("SELECT budget, actual, maintenance, operations, utilities, vendor, other FROM enterprise_costs LIMIT 1")->fetch() ?: [];
    foreach ($costsRow as $k => $v) {
        $costsRow[$k] = (float)$v;
    }
    $changes = $db->query("SELECT id, title, requester, priority, impact, cost, status FROM enterprise_changes")->fetchAll();
    foreach ($changes as &$ch) {
        $ch['cost'] = (float)$ch['cost'];
    }
    $risks = $db->query("SELECT id, risk, prob, impact, score, mitigation, owner, status FROM enterprise_risks")->fetchAll();
    foreach ($risks as &$r) {
        $r['score'] = (int)$r['score'];
    }
    $stakeholders = $db->query("SELECT role_name as role, domain_name as domain, owner, responsibility_level as `level` FROM enterprise_stakeholders")->fetchAll();
    $notifs = $db->query("SELECT sev, title, detail, time FROM enterprise_notifications ORDER BY id DESC")->fetchAll();

    // 3. Fleet & Manifest
    $fleet = $db->query("SELECT plate, eseal_sscc, location, battery, signal_dbm, lock_status, sensor_cable, status_color FROM fleet_armada")->fetchAll();
    $manifest = $db->query("SELECT bc_doc, container_no, sscc, importer, commodity, gross_weight, ceisa_status, status_badge FROM manifest_items")->fetchAll();

    // 4. Audit Trail
    $auditTrail = $db->query("SELECT log_time as time, actor, container_no as container, severity, action, detail FROM audit_trail ORDER BY id DESC LIMIT 50")->fetchAll();

    return [
        'cases' => $cases,
        'enterprise' => [
            'requirements' => $reqs,
            'tests'        => $tests,
            'defects'      => $defects,
            'assets'       => $assets,
            'workorders'   => $workorders,
            'spareParts'   => $spareParts,
            'costs'        => $costsRow,
            'changes'      => $changes,
            'risks'        => $risks,
            'stakeholders' => $stakeholders,
            'notifications'=> $notifs
        ],
        'fleet' => $fleet,
        'manifest' => $manifest,
        'auditTrail' => $auditTrail
    ];
}

// Execute API request only when accessed directly
if (basename($_SERVER['SCRIPT_FILENAME'] ?? '') === 'api.php') {
    header('Content-Type: application/json; charset=utf-8');
    $action = $_GET['action'] ?? $_POST['action'] ?? '';

    try {
        switch ($action) {
            case 'get_all_data':
                echo json_encode(['success' => true, 'data' => getInitialData($db)]);
                break;

            case 'update_case':
                $input = json_decode(file_get_contents('php://input'), true);
                if (!$input || empty($input['containerNo'])) {
                    echo json_encode(['success' => false, 'message' => 'Invalid container data']);
                    exit;
                }
                $stmt = $db->prepare("UPDATE `cases` SET 
                    `customs_status` = :cs,
                    `customs_stage` = :cst,
                    `customs_stage_index` = :csi,
                    `gate_status` = :gs,
                    `yard_location` = :yl,
                    `rfid_status` = :rfid,
                    `eseal_status` = :eseal,
                    `documents` = :docs,
                    `timeline` = :tl,
                    `alerts` = :al
                    WHERE `container_no` = :cn
                ");
                $stmt->execute([
                    ':cs'    => $input['customsStatus'] ?? 'UNDER_REVIEW',
                    ':cst'   => $input['customsStage'] ?? 'UNDER_REVIEW',
                    ':csi'   => (int)($input['customsStageIndex'] ?? 0),
                    ':gs'    => $input['gateStatus'] ?? 'IN_YARD',
                    ':yl'    => $input['yardLocation'] ?? '-',
                    ':rfid'  => $input['rfidStatus'] ?? 'DETECTED',
                    ':eseal' => $input['esealStatus'] ?? 'SECURE',
                    ':docs'  => json_encode($input['documents'] ?? new stdClass()),
                    ':tl'    => json_encode($input['timeline'] ?? []),
                    ':al'    => json_encode($input['alerts'] ?? []),
                    ':cn'    => $input['containerNo']
                ]);
                echo json_encode(['success' => true, 'message' => 'Case updated in database']);
                break;

            case 'add_audit':
                $input = json_decode(file_get_contents('php://input'), true);
                if ($input) {
                    $stmt = $db->prepare("INSERT INTO `audit_trail` (`log_time`, `actor`, `container_no`, `severity`, `action`, `detail`) VALUES (:t, :act, :cn, :sev, :action, :det)");
                    $stmt->execute([
                        ':t'      => $input['time'] ?? date('H:i:s'),
                        ':act'    => $input['actor'] ?? 'SYSTEM',
                        ':cn'     => $input['container'] ?? null,
                        ':sev'    => $input['severity'] ?? 'INFO',
                        ':action' => $input['action'] ?? '',
                        ':det'    => $input['detail'] ?? ''
                    ]);
                    echo json_encode(['success' => true, 'id' => $db->lastInsertId()]);
                } else {
                    echo json_encode(['success' => false, 'message' => 'No input']);
                }
                break;

            case 'progress_workorder':
                $input = json_decode(file_get_contents('php://input'), true);
                $id = $input['id'] ?? '';
                $status = $input['status'] ?? 'DONE';
                if ($id) {
                    $stmt = $db->prepare("UPDATE `enterprise_workorders` SET `status` = :st WHERE `id` = :id");
                    $stmt->execute([':st' => $status, ':id' => $id]);
                    echo json_encode(['success' => true]);
                } else {
                    echo json_encode(['success' => false, 'message' => 'Missing ID']);
                }
                break;

            case 'approve_change':
                $input = json_decode(file_get_contents('php://input'), true);
                $id = $input['id'] ?? '';
                if ($id) {
                    $stmt = $db->prepare("UPDATE `enterprise_changes` SET `status` = 'APPROVED' WHERE `id` = :id");
                    $stmt->execute([':id' => $id]);
                    echo json_encode(['success' => true]);
                } else {
                    echo json_encode(['success' => false, 'message' => 'Missing ID']);
                }
                break;

            case 'reset_database':
                $res = runSeed();
                echo json_encode($res);
                break;

            default:
                echo json_encode(['success' => false, 'message' => 'Unknown action']);
                break;
        }
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }
    exit;
}
