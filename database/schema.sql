-- =====================================================================
-- SISTEM LOGISTIK LINTAS BATAS (PLB) & E-SEAL TERINTEGRASI - KELOMPOK 8
-- DATABASE SCHEMA & SEED DATA (MySQL)
-- =====================================================================

CREATE DATABASE IF NOT EXISTS `plb_db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `plb_db`;

-- 1. Table: cases (Shipment & Container Management)
CREATE TABLE IF NOT EXISTS `cases` (
    `container_no` VARCHAR(50) NOT NULL PRIMARY KEY,
    `shipment_id` VARCHAR(50) NOT NULL,
    `bl_number` VARCHAR(50) NOT NULL,
    `importer` VARCHAR(150) NOT NULL,
    `origin` VARCHAR(50) NOT NULL DEFAULT 'Singapore',
    `destination` VARCHAR(50) NOT NULL DEFAULT 'Jakarta',
    `cargo` VARCHAR(150) NOT NULL,
    `hs_code` VARCHAR(20) NOT NULL,
    `gross_weight` INT NOT NULL DEFAULT 0,
    `customs_status` VARCHAR(30) NOT NULL DEFAULT 'UNDER_REVIEW',
    `customs_stage` VARCHAR(30) NOT NULL DEFAULT 'UNDER_REVIEW',
    `customs_stage_index` INT NOT NULL DEFAULT 0,
    `gate_status` VARCHAR(30) NOT NULL DEFAULT 'IN_YARD',
    `yard_location` VARCHAR(30) NOT NULL DEFAULT '-',
    `rfid_status` VARCHAR(30) NOT NULL DEFAULT 'DETECTED',
    `eseal_status` VARCHAR(30) NOT NULL DEFAULT 'SECURE',
    `eseal_id` VARCHAR(50) NOT NULL,
    `truck_plate` VARCHAR(20) NOT NULL,
    `customs_document` VARCHAR(50) NOT NULL,
    `documents` LONGTEXT NOT NULL,
    `timeline` LONGTEXT NOT NULL,
    `alerts` LONGTEXT NOT NULL,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Table: audit_trail (System & Operational Audit Logs)
CREATE TABLE IF NOT EXISTS `audit_trail` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `log_time` VARCHAR(20) NOT NULL,
    `actor` VARCHAR(50) NOT NULL,
    `container_no` VARCHAR(50) NULL,
    `severity` VARCHAR(20) NOT NULL DEFAULT 'INFO',
    `action` VARCHAR(100) NOT NULL,
    `detail` TEXT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Table: enterprise_requirements
CREATE TABLE IF NOT EXISTS `enterprise_requirements` (
    `id` VARCHAR(30) NOT NULL PRIMARY KEY,
    `title` VARCHAR(150) NOT NULL,
    `type` VARCHAR(50) NOT NULL,
    `domain` VARCHAR(50) NOT NULL,
    `priority` VARCHAR(20) NOT NULL,
    `owner` VARCHAR(50) NOT NULL,
    `status` VARCHAR(30) NOT NULL,
    `release_ver` VARCHAR(20) NOT NULL,
    `coverage` VARCHAR(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Table: enterprise_tests
CREATE TABLE IF NOT EXISTS `enterprise_tests` (
    `id` VARCHAR(30) NOT NULL PRIMARY KEY,
    `req_id` VARCHAR(30) NOT NULL,
    `scenario` VARCHAR(150) NOT NULL,
    `status` VARCHAR(30) NOT NULL,
    `tester` VARCHAR(50) NOT NULL,
    `severity` VARCHAR(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Table: enterprise_defects
CREATE TABLE IF NOT EXISTS `enterprise_defects` (
    `id` VARCHAR(30) NOT NULL PRIMARY KEY,
    `title` VARCHAR(150) NOT NULL,
    `severity` VARCHAR(20) NOT NULL,
    `priority` VARCHAR(20) NOT NULL,
    `status` VARCHAR(30) NOT NULL,
    `req_id` VARCHAR(30) NOT NULL,
    `owner` VARCHAR(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Table: enterprise_assets
CREATE TABLE IF NOT EXISTS `enterprise_assets` (
    `id` VARCHAR(30) NOT NULL PRIMARY KEY,
    `name` VARCHAR(100) NOT NULL,
    `type` VARCHAR(50) NOT NULL,
    `status` VARCHAR(30) NOT NULL,
    `health` INT NOT NULL DEFAULT 100,
    `hours` INT NOT NULL DEFAULT 0,
    `next_maintenance` VARCHAR(50) NOT NULL,
    `cost` DECIMAL(15,2) NOT NULL DEFAULT 0,
    `downtime` DECIMAL(5,1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Table: enterprise_workorders
CREATE TABLE IF NOT EXISTS `enterprise_workorders` (
    `id` VARCHAR(30) NOT NULL PRIMARY KEY,
    `asset_id` VARCHAR(30) NOT NULL,
    `issue` VARCHAR(150) NOT NULL,
    `type` VARCHAR(30) NOT NULL,
    `priority` VARCHAR(20) NOT NULL,
    `status` VARCHAR(30) NOT NULL,
    `cost` DECIMAL(15,2) NOT NULL DEFAULT 0,
    `eta` VARCHAR(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Table: enterprise_spare_parts
CREATE TABLE IF NOT EXISTS `enterprise_spare_parts` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `part` VARCHAR(100) NOT NULL,
    `stock` INT NOT NULL DEFAULT 0,
    `min_stock` INT NOT NULL DEFAULT 0,
    `reserved` INT NOT NULL DEFAULT 0,
    `status` VARCHAR(30) NOT NULL DEFAULT 'NORMAL'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. Table: enterprise_costs
CREATE TABLE IF NOT EXISTS `enterprise_costs` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `budget` BIGINT NOT NULL DEFAULT 0,
    `actual` BIGINT NOT NULL DEFAULT 0,
    `maintenance` BIGINT NOT NULL DEFAULT 0,
    `operations` BIGINT NOT NULL DEFAULT 0,
    `utilities` BIGINT NOT NULL DEFAULT 0,
    `vendor` BIGINT NOT NULL DEFAULT 0,
    `other` BIGINT NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. Table: enterprise_changes
CREATE TABLE IF NOT EXISTS `enterprise_changes` (
    `id` VARCHAR(30) NOT NULL PRIMARY KEY,
    `title` VARCHAR(150) NOT NULL,
    `requester` VARCHAR(50) NOT NULL,
    `priority` VARCHAR(20) NOT NULL,
    `impact` VARCHAR(100) NOT NULL,
    `cost` DECIMAL(15,2) NOT NULL DEFAULT 0,
    `status` VARCHAR(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 11. Table: enterprise_risks
CREATE TABLE IF NOT EXISTS `enterprise_risks` (
    `id` VARCHAR(30) NOT NULL PRIMARY KEY,
    `risk` VARCHAR(150) NOT NULL,
    `prob` VARCHAR(20) NOT NULL,
    `impact` VARCHAR(20) NOT NULL,
    `score` INT NOT NULL DEFAULT 0,
    `mitigation` VARCHAR(150) NOT NULL,
    `owner` VARCHAR(50) NOT NULL,
    `status` VARCHAR(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 12. Table: enterprise_stakeholders
CREATE TABLE IF NOT EXISTS `enterprise_stakeholders` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `role_name` VARCHAR(50) NOT NULL,
    `domain_name` VARCHAR(50) NOT NULL,
    `owner` VARCHAR(50) NOT NULL,
    `responsibility_level` VARCHAR(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 13. Table: enterprise_notifications
CREATE TABLE IF NOT EXISTS `enterprise_notifications` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `sev` VARCHAR(20) NOT NULL,
    `title` VARCHAR(150) NOT NULL,
    `detail` VARCHAR(255) NOT NULL,
    `time` VARCHAR(20) NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 14. Table: fleet_armada
CREATE TABLE IF NOT EXISTS `fleet_armada` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `plate` VARCHAR(20) NOT NULL,
    `eseal_sscc` VARCHAR(50) NOT NULL,
    `location` VARCHAR(100) NOT NULL,
    `battery` INT NOT NULL DEFAULT 100,
    `signal_dbm` INT NOT NULL DEFAULT -70,
    `lock_status` VARCHAR(30) NOT NULL,
    `sensor_cable` VARCHAR(30) NOT NULL,
    `status_color` VARCHAR(20) NOT NULL DEFAULT 'emerald'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 15. Table: manifest_items
CREATE TABLE IF NOT EXISTS `manifest_items` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `bc_doc` VARCHAR(50) NOT NULL,
    `container_no` VARCHAR(50) NOT NULL,
    `sscc` VARCHAR(50) NOT NULL,
    `importer` VARCHAR(150) NOT NULL,
    `commodity` VARCHAR(150) NOT NULL,
    `gross_weight` INT NOT NULL DEFAULT 0,
    `ceisa_status` VARCHAR(50) NOT NULL,
    `status_badge` VARCHAR(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================================
-- SEED INITIAL DATA
-- =====================================================================

-- Seed: cases
INSERT INTO `cases` (`container_no`, `shipment_id`, `bl_number`, `importer`, `origin`, `destination`, `cargo`, `hs_code`, `gross_weight`, `customs_status`, `customs_stage`, `customs_stage_index`, `gate_status`, `yard_location`, `rfid_status`, `eseal_status`, `eseal_id`, `truck_plate`, `customs_document`, `documents`, `timeline`, `alerts`) VALUES
('MSCU1234567', 'PLB-2026-00128', 'BL-SGSIN-2026-0821', 'PT Nusantara Elektronik', 'Singapore', 'Jakarta', 'Elektronik / Microchip PCB', '8542.31', 14200, 'UNDER_REVIEW', 'UNDER_REVIEW', 2, 'IN_YARD', 'A01-03', 'DETECTED', 'SECURE', '(00)389912345000000128', 'B 9021 TXT', '000482/BC23/2026',
 '{"commercialInvoice":"VERIFIED","packingList":"VERIFIED","billOfLading":"VERIFIED","customsDeclaration":"REVIEW","certificateOfOrigin":"REVIEW","deliveryOrder":"VERIFIED"}',
 '[{"time":"03:42:11","actor":"SYSTEM","event":"Shipment registered","status":"DONE"},{"time":"03:44:08","actor":"RFID","event":"Container detected at Gate 01","status":"DONE"},{"time":"03:46:32","actor":"GATE OFFICER","event":"Gate In approved","status":"DONE"},{"time":"03:51:17","actor":"WMS","event":"Yard slot A01-03 assigned","status":"DONE"},{"time":"04:02:45","actor":"CUSTOMS","event":"Document review started","status":"ACTIVE"}]',
 '[]'),

('TGHU8842011', 'PLB-2026-00129', 'BL-SGSIN-2026-0822', 'PT Astra Agro Lestari Tbk', 'Singapore', 'Jakarta', 'Komponen Traktor', '8432.90', 18450, 'CLEARED', 'CLEARED', 5, 'IN_YARD', 'A17-02', 'DETECTED', 'RELEASED', 'ES-2026-000177', 'B 7712 QA', '000481/BC23/2026',
 '{"commercialInvoice":"VERIFIED","packingList":"VERIFIED","billOfLading":"VERIFIED","customsDeclaration":"VERIFIED","certificateOfOrigin":"VERIFIED","deliveryOrder":"VERIFIED"}',
 '[{"time":"02:18:10","actor":"SYSTEM","event":"Shipment registered","status":"DONE"},{"time":"02:24:44","actor":"CUSTOMS","event":"Clearance approved","status":"DONE"},{"time":"02:26:03","actor":"GATE OFFICER","event":"Release authorized","status":"DONE"}]',
 '[]'),

('OOLU2219045', 'PLB-2026-00130', 'BL-SGSIN-2026-0823', 'PT Unilever Indonesia Tbk', 'Singapore', 'Jakarta', 'Bahan Kimia Baku', '2915.21', 22800, 'HOLD', 'HOLD', 2, 'BLOCKED', 'B11-04', 'DETECTED', 'SECURE', 'ES-2026-000181', 'B 6611 RT', '000483/BC23/2026',
 '{"commercialInvoice":"VERIFIED","packingList":"VERIFIED","billOfLading":"VERIFIED","customsDeclaration":"REVIEW","certificateOfOrigin":"MISSING","deliveryOrder":"VERIFIED"}',
 '[{"time":"01:52:06","actor":"SYSTEM","event":"Shipment registered","status":"DONE"},{"time":"02:14:28","actor":"CUSTOMS","event":"Customs hold applied","status":"ACTIVE"}]',
 '[{"type":"CUSTOMS HOLD","severity":"HIGH","text":"Clearance blocked pending document review."}]'),

('CMAU9087123', 'PLB-2026-00131', 'BL-SGSIN-2026-0824', 'PT Toyota Motor Mfg', 'Singapore', 'Jakarta', 'Steel Coil Otomotif', '7225.40', 25500, 'CLEARED', 'CLEARED', 5, 'IN_YARD', 'A08-01', 'DETECTED', 'RELEASED', 'ES-2026-000190', 'B 4421 LK', '000484/BC23/2026',
 '{"commercialInvoice":"VERIFIED","packingList":"VERIFIED","billOfLading":"VERIFIED","customsDeclaration":"VERIFIED","certificateOfOrigin":"VERIFIED","deliveryOrder":"VERIFIED"}',
 '[{"time":"00:44:12","actor":"SYSTEM","event":"Shipment registered","status":"DONE"},{"time":"01:03:55","actor":"CUSTOMS","event":"Clearance approved","status":"DONE"}]',
 '[]')
ON DUPLICATE KEY UPDATE `shipment_id`=VALUES(`shipment_id`);

-- Seed: enterprise_requirements
INSERT INTO `enterprise_requirements` (`id`, `title`, `type`, `domain`, `priority`, `owner`, `status`, `release_ver`, `coverage`) VALUES
('REQ-PLB-017', 'Gate Out Validation', 'Functional', 'Gate Management', 'CRITICAL', 'Operations Manager', 'APPROVED', 'v2.4', 'TC-GATE-017'),
('REQ-MNT-008', 'Maintenance Due Notification', 'Functional', 'Asset & Maintenance', 'HIGH', 'Maintenance Manager', 'IN REVIEW', 'v2.5', 'TC-MNT-008'),
('REQ-QA-011', 'Defect Retest Evidence', 'Non-Functional', 'Quality Assurance', 'HIGH', 'QA Lead', 'APPROVED', 'v2.4', 'TC-QA-011'),
('REQ-FIN-004', 'Budget vs Actual Monitoring', 'Functional', 'Finance & Cost', 'MEDIUM', 'Finance Manager', 'DRAFT', 'v2.6', 'TC-FIN-004')
ON DUPLICATE KEY UPDATE `title`=VALUES(`title`);

-- Seed: enterprise_tests
INSERT INTO `enterprise_tests` (`id`, `req_id`, `scenario`, `status`, `tester`, `severity`) VALUES
('TC-GATE-017', 'REQ-PLB-017', 'Gate Out — Customs HOLD', 'PASS', 'QA-01', 'CRITICAL'),
('TC-MNT-008', 'REQ-MNT-008', 'Maintenance due alert', 'PASS', 'QA-02', 'HIGH'),
('TC-QA-011', 'REQ-QA-011', 'Retest evidence required', 'FAIL', 'QA-01', 'HIGH'),
('TC-FIN-004', 'REQ-FIN-004', 'Budget utilization threshold', 'NOT EXECUTED', 'QA-03', 'MEDIUM')
ON DUPLICATE KEY UPDATE `scenario`=VALUES(`scenario`);

-- Seed: enterprise_defects
INSERT INTO `enterprise_defects` (`id`, `title`, `severity`, `priority`, `status`, `req_id`, `owner`) VALUES
('BUG-0042', 'Gate Out bypasses Customs HOLD', 'CRITICAL', 'P1', 'FIXED', 'REQ-PLB-017', 'DEV-02'),
('BUG-0047', 'Retest evidence not mandatory', 'HIGH', 'P1', 'READY FOR RETEST', 'REQ-QA-011', 'DEV-01'),
('BUG-0051', 'Maintenance alert duplicate', 'MEDIUM', 'P2', 'OPEN', 'REQ-MNT-008', 'DEV-03')
ON DUPLICATE KEY UPDATE `title`=VALUES(`title`);

-- Seed: enterprise_assets
INSERT INTO `enterprise_assets` (`id`, `name`, `type`, `status`, `health`, `hours`, `next_maintenance`, `cost`, `downtime`) VALUES
('QC-001', 'STS Quay Crane', 'PORT EQUIPMENT', 'OPERATIONAL', 92, 6842, '16 Oct 2026', 187500000, 8.5),
('QC-002', 'STS Quay Crane', 'PORT EQUIPMENT', 'OPERATIONAL', 96, 6128, '20 Oct 2026', 142800000, 5.2),
('RTG-001', 'Rubber Tyred Gantry', 'YARD EQUIPMENT', 'MAINTENANCE', 81, 5210, '08 Oct 2026', 86400000, 11.3),
('FL-001', 'Forklift', 'MATERIAL HANDLING', 'OPERATIONAL', 95, 3210, '22 Oct 2026', 32600000, 3.1),
('GEN-001', 'Backup Generator', 'UTILITY', 'WARNING', 73, 4820, '10 Oct 2026', 54400000, 14.2)
ON DUPLICATE KEY UPDATE `name`=VALUES(`name`);

-- Seed: enterprise_workorders
INSERT INTO `enterprise_workorders` (`id`, `asset_id`, `issue`, `type`, `priority`, `status`, `cost`, `eta`) VALUES
('WO-2026-0182', 'RTG-001', 'Hydraulic pressure abnormal', 'CORRECTIVE', 'HIGH', 'IN PROGRESS', 20000000, '07 Oct 2026 18:00'),
('WO-2026-0185', 'QC-001', '30-day preventive maintenance', 'PREVENTIVE', 'MEDIUM', 'SCHEDULED', 12500000, '16 Oct 2026'),
('WO-2026-0187', 'GEN-001', 'Battery and cooling inspection', 'PREVENTIVE', 'HIGH', 'PENDING PARTS', 8750000, '10 Oct 2026')
ON DUPLICATE KEY UPDATE `issue`=VALUES(`issue`);

-- Seed: enterprise_spare_parts
INSERT INTO `enterprise_spare_parts` (`id`, `part`, `stock`, `min_stock`, `reserved`, `status`) VALUES
(1, 'Hydraulic Filter', 12, 5, 3, 'NORMAL'),
(2, 'Crane Wire Rope', 2, 3, 1, 'LOW STOCK'),
(3, 'Brake Pad', 0, 4, 0, 'OUT OF STOCK'),
(4, 'Generator Battery', 6, 4, 2, 'NORMAL')
ON DUPLICATE KEY UPDATE `part`=VALUES(`part`);

-- Seed: enterprise_costs
INSERT INTO `enterprise_costs` (`id`, `budget`, `actual`, `maintenance`, `operations`, `utilities`, `vendor`, `other`) VALUES
(1, 500000000, 428750000, 142250000, 186500000, 54000000, 31500000, 14500000)
ON DUPLICATE KEY UPDATE `budget`=VALUES(`budget`);

-- Seed: enterprise_changes
INSERT INTO `enterprise_changes` (`id`, `title`, `requester`, `priority`, `impact`, `cost`, `status`) VALUES
('CR-2026-009', 'Additional Gate Validation', 'Operations', 'HIGH', 'Gate, Customs, E-Seal, QA', 18000000, 'IMPACT ANALYSIS'),
('CR-2026-011', 'Asset Health Dashboard', 'Maintenance', 'MEDIUM', 'Asset, Maintenance, Reporting', 12500000, 'APPROVED')
ON DUPLICATE KEY UPDATE `title`=VALUES(`title`);

-- Seed: enterprise_risks
INSERT INTO `enterprise_risks` (`id`, `risk`, `prob`, `impact`, `score`, `mitigation`, `owner`, `status`) VALUES
('RISK-014', 'Quay Crane Failure', 'MEDIUM', 'CRITICAL', 15, 'Preventive Maintenance', 'Maintenance Manager', 'MONITORED'),
('RISK-018', 'Unauthorized Gate Out', 'LOW', 'CRITICAL', 10, 'Gate validation + QA regression', 'Operations Manager', 'MITIGATED'),
('RISK-021', 'Critical Spare Part Shortage', 'HIGH', 'HIGH', 16, 'Reorder point + vendor SLA', 'Maintenance Manager', 'OPEN')
ON DUPLICATE KEY UPDATE `risk`=VALUES(`risk`);

-- Seed: enterprise_stakeholders
INSERT INTO `enterprise_stakeholders` (`id`, `role_name`, `domain_name`, `owner`, `responsibility_level`) VALUES
(1, 'Operations Manager', 'Operations', 'Gate / Yard / Container', 'ACCOUNTABLE'),
(2, 'Business Analyst', 'Business Analysis', 'Requirement / Process / Change', 'RESPONSIBLE'),
(3, 'QA Lead', 'Quality Assurance', 'Test / Defect / UAT', 'RESPONSIBLE'),
(4, 'Maintenance Manager', 'Asset', 'Equipment / Work Order', 'ACCOUNTABLE'),
(5, 'Finance Manager', 'Finance', 'Budget / Cost / PO', 'ACCOUNTABLE')
ON DUPLICATE KEY UPDATE `role_name`=VALUES(`role_name`);

-- Seed: enterprise_notifications
INSERT INTO `enterprise_notifications` (`id`, `sev`, `title`, `detail`, `time`) VALUES
(1, 'CRITICAL', 'QC-001 maintenance due soon', 'Preventive maintenance scheduled 16 Oct 2026', '16:05'),
(2, 'HIGH', 'RTG-001 hydraulic issue', 'Work order WO-2026-0182 in progress', '15:48'),
(3, 'WARNING', 'Crane Wire Rope low stock', '2 available, minimum 3', '15:22'),
(4, 'INFO', 'REQ-PLB-017 approved', 'Traceability linked to TC-GATE-017', '14:40')
ON DUPLICATE KEY UPDATE `title`=VALUES(`title`);

-- Seed: fleet_armada
INSERT INTO `fleet_armada` (`id`, `plate`, `eseal_sscc`, `location`, `battery`, `signal_dbm`, `lock_status`, `sensor_cable`, `status_color`) VALUES
(1, 'B 9214 UXT', '(00)389912345000000127', 'Gerbang PLB Gate 01', 96, -62, 'UNLOCKED (SPPB)', 'UTUH', 'emerald'),
(2, 'B 9531 KLD', '(00)389912345000000128', 'Transit Tol Tj. Priok (KM 12)', 91, -71, 'LOCKED', 'UTUH', 'blue'),
(3, 'B 9802 SAA', '(00)389912345000000129', 'Transit Tol Pluit (KM 04)', 89, -68, 'LOCKED', 'UTUH', 'blue'),
(4, 'B 9119 TAM', '(00)389912345000000131', 'Pos Karantina Bea Cukai', 74, -84, 'SABOTASE', 'TERPUTUS!', 'rose')
ON DUPLICATE KEY UPDATE `plate`=VALUES(`plate`);

-- Seed: manifest_items
INSERT INTO `manifest_items` (`id`, `bc_doc`, `container_no`, `sscc`, `importer`, `commodity`, `gross_weight`, `ceisa_status`, `status_badge`) VALUES
(1, '000481/BC23/2026', 'TEMU481920-4', '(00)389912345000000127', 'PT Astra Agro Lestari Tbk', 'Komponen Traktor (8432.90)', 18450, 'SPPB HIJAU', 'emerald'),
(2, '000482/BC23/2026', 'MSKU901234-7', '(00)389912345000000128', 'PT Samsung Electronics ID', 'Microchip PCB (8542.31)', 14200, 'SPPB HIJAU', 'emerald'),
(3, '000483/BC23/2026', 'CMAU551029-1', '(00)389912345000000129', 'PT Unilever Indonesia Tbk', 'Bahan Kimia Baku (2915.21)', 22800, 'JALUR MERAH', 'amber'),
(4, '000484/BC23/2026', 'ONEU338102-8', '(00)389912345000000130', 'PT Toyota Motor Mfg', 'Steel Coil Otomotif (7225.40)', 25500, 'SPPB HIJAU', 'emerald'),
(5, '000485/BC23/2026', 'HLXU110294-0', '(00)389912345000000131', 'PT Maju Logistik Sentosa', 'Tekstil Poliester (5407.52)', 16300, 'HOLD (SABOTASE)', 'rose')
ON DUPLICATE KEY UPDATE `bc_doc`=VALUES(`bc_doc`);
