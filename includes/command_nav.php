    <!-- PHASE 6 — TOP COMMAND NAVIGATION -->
    <aside id="plb-sidebar" aria-label="PLB Command Navigation">
        <div class="plb-brand">
            <div class="brand-mark"><i class="fa-solid fa-anchor"></i></div>
            <div class="brand-copy">
                <div class="brand-title">PLB COMMAND CENTER</div>
                <div class="brand-sub">INTEGRATED LOGISTICS CONTROL</div>
            </div>
        </div>
        <div id="sidebarSearchWrap">
            <div style="position:relative">
                <i id="sidebarSearchIcon" class="fa-solid fa-magnifying-glass"></i>
                <input id="sidebarSearch" type="search" placeholder="Search module / menu..." autocomplete="off" aria-label="Search module or menu">
            </div>
            <div id="sidebarSearchCount">SEMUA MODULE</div>
        </div>
        <nav id="plb-command-nav" aria-label="Module groups">
            <div class="command-group">
                <button class="command-trigger" data-menu="operations"><i class="fa-solid fa-tower-broadcast"></i><span>OPERATIONS</span><i class="fa-solid fa-chevron-down chevron"></i></button>
                <div class="command-menu" data-panel="operations">
                    <div class="menu-heading"><b>OPERATIONS</b><span>CORE LOGISTICS CONTROL</span></div>
                    <div class="menu-grid">
                        <button onclick="app.openOps('control')"><i class="fa-solid fa-gauge-high"></i><span><b>Control Tower</b><small>Operational overview</small></span></button>
                        <button onclick="app.openOps('containers')"><i class="fa-solid fa-box"></i><span><b>Container Management</b><small>Shipment & container cases</small></span></button>
                        <button onclick="app.openOps('gate')"><i class="fa-solid fa-road-barrier"></i><span><b>Gate Operations</b><small>Gate in / gate out</small></span></button>
                        <button onclick="app.openOps('yard')"><i class="fa-solid fa-warehouse"></i><span><b>Yard Management</b><small>Slot & occupancy</small></span></button>
                        <button onclick="app.openOps('wms')"><i class="fa-solid fa-boxes-stacked"></i><span><b>WMS / PLB</b><small>Inventory & warehouse</small></span></button>
                        <button onclick="app.openOps('simulasi')"><i class="fa-solid fa-cubes"></i><span><b>3D Operations View</b><small>Field visualization</small></span></button>
                    </div>
                </div>
            </div>
            <div class="command-group">
                <button class="command-trigger" data-menu="master"><i class="fa-solid fa-database"></i><span>MASTER DATA</span><i class="fa-solid fa-chevron-down chevron"></i></button>
                <div class="command-menu" data-panel="master">
                    <div class="menu-heading"><b>MASTER DATA</b><span>REFERENCE & REGISTRATION</span></div>
                    <div class="menu-grid">
                        <button onclick="app.openOps('containers')"><i class="fa-solid fa-boxes-stacked"></i><span><b>Container Registry</b><small>Container identity & case</small></span></button>
                        <button onclick="app.openOps('gate')"><i class="fa-solid fa-truck"></i><span><b>Truck & Vehicle</b><small>Vehicle registration</small></span></button>
                        <button onclick="app.openOps('containers')"><i class="fa-solid fa-building"></i><span><b>Importer / Consignee</b><small>Business reference</small></span></button>
                        <button onclick="app.openOps('containers')"><i class="fa-solid fa-barcode"></i><span><b>Commodity / HS Code</b><small>Cargo classification</small></span></button>
                        <button onclick="app.openOps('yard')"><i class="fa-solid fa-location-dot"></i><span><b>Yard Location</b><small>Slot & zone reference</small></span></button>
                        <button onclick="app.openOps('rfid')"><i class="fa-solid fa-satellite-dish"></i><span><b>RFID Device</b><small>Reader & tag registry</small></span></button>
                        <button onclick="app.openOps('eseal')"><i class="fa-solid fa-lock"></i><span><b>E-Seal Registry</b><small>Seal identity & status</small></span></button>
                    </div>
                </div>
            </div>
            <div class="command-group">
                <button class="command-trigger" data-menu="customs"><i class="fa-solid fa-shield-halved"></i><span>CUSTOMS</span><i class="fa-solid fa-chevron-down chevron"></i></button>
                <div class="command-menu" data-panel="customs">
                    <div class="menu-heading"><b>CUSTOMS OPERATIONS</b><span>PABEAN • CLEARANCE • CEISA</span></div>
                    <div class="menu-grid">
                        <button onclick="app.openOps('customs')"><i class="fa-solid fa-shield-halved"></i><span><b>Customs Clearance</b><small>Case workflow</small></span></button>
                        <button onclick="app.openOps('documents')"><i class="fa-solid fa-file-circle-check"></i><span><b>Document Verification</b><small>Document completeness</small></span></button>
                        <button onclick="app.openOps('ceisa')"><i class="fa-solid fa-link"></i><span><b>CEISA Connection</b><small>Transaction & response</small></span></button>
                        <button onclick="app.openOps('customs')"><i class="fa-solid fa-magnifying-glass"></i><span><b>Customs Inspection</b><small>Inspection workflow</small></span></button>
                        <button onclick="app.openOps('documents')"><i class="fa-solid fa-file-invoice"></i><span><b>BC 2.3 / Declaration</b><small>Customs declaration</small></span></button>
                        <button onclick="app.openOps('outboundflow')"><i class="fa-solid fa-truck-ramp-box"></i><span><b>Outbound Customs Flow</b><small>Consolidation → Customs → Seal → Gate Out</small></span></button>
                    </div>
                </div>
            </div>
            <div class="command-group">
                <button class="command-trigger" data-menu="security"><i class="fa-solid fa-shield"></i><span>SECURITY</span><i class="fa-solid fa-chevron-down chevron"></i></button>
                <div class="command-menu" data-panel="security">
                    <div class="menu-heading"><b>SECURITY & MONITORING</b><span>RFID • E-SEAL • EXCEPTIONS</span></div>
                    <div class="menu-grid">
                        <button onclick="app.openOps('eseal')"><i class="fa-solid fa-lock"></i><span><b>E-Seal Monitoring</b><small>Seal integrity</small></span></button>
                        <button onclick="app.openOps('rfid')"><i class="fa-solid fa-satellite-dish"></i><span><b>RFID Scanner</b><small>Real-time detection</small></span></button>
                        <button onclick="app.openOps('alerts')"><i class="fa-solid fa-triangle-exclamation"></i><span><b>Exception Center</b><small>Hold & exception handling</small></span></button>
                        <button onclick="app.openOps('alerts')"><i class="fa-solid fa-bell"></i><span><b>Alert Center</b><small>Operational alerts</small></span></button>
                        <button onclick="app.openOps('gate')"><i class="fa-solid fa-road-barrier"></i><span><b>Gate Security</b><small>Release controls</small></span></button>
                    </div>
                </div>
            </div>
            <div class="command-group">
                <button class="command-trigger" data-menu="integration"><i class="fa-solid fa-network-wired"></i><span>INTEGRATION</span><i class="fa-solid fa-chevron-down chevron"></i></button>
                <div class="command-menu" data-panel="integration">
                    <div class="menu-heading"><b>INTEGRATION</b><span>SYSTEM CONNECTIVITY</span></div>
                    <div class="menu-grid">
                        <button onclick="app.openOps('ceisa')"><i class="fa-solid fa-link"></i><span><b>CEISA</b><small>Customs gateway</small></span></button>
                        <button onclick="app.openOps('api')"><i class="fa-solid fa-code-branch"></i><span><b>API / EDI Monitor</b><small>Message traffic</small></span></button>
                        <button onclick="app.openOps('wms')"><i class="fa-solid fa-boxes-stacked"></i><span><b>WMS Integration</b><small>Warehouse sync</small></span></button>
                        <button onclick="app.openOps('rfid')"><i class="fa-solid fa-tower-cell"></i><span><b>RFID Gateway</b><small>Reader connectivity</small></span></button>
                        <button onclick="app.openOps('eseal')"><i class="fa-solid fa-link-slash"></i><span><b>E-Seal Gateway</b><small>Seal telemetry</small></span></button>
                    </div>
                </div>
            </div>
            <div class="command-group">
                <button class="command-trigger" data-menu="analytics"><i class="fa-solid fa-chart-line"></i><span>ANALYTICS</span><i class="fa-solid fa-chevron-down chevron"></i></button>
                <div class="command-menu" data-panel="analytics">
                    <div class="menu-heading"><b>ANALYTICS & REPORTS</b><span>PERFORMANCE & INSIGHT</span></div>
                    <div class="menu-grid">
                        <button onclick="app.openOps('control')"><i class="fa-solid fa-gauge-high"></i><span><b>Operational KPI</b><small>Live performance</small></span></button>
                        <button onclick="app.openOps('yard')"><i class="fa-solid fa-chart-area"></i><span><b>Yard Occupancy</b><small>Capacity & utilization</small></span></button>
                        <button onclick="app.openOps('control')"><i class="fa-solid fa-route"></i><span><b>Cargo Flow</b><small>Inbound / outbound flow</small></span></button>
                        <button onclick="app.openOps('customs')"><i class="fa-solid fa-stopwatch"></i><span><b>Customs Performance</b><small>Clearance cycle</small></span></button>
                        <button onclick="app.openOps('alerts')"><i class="fa-solid fa-chart-pie"></i><span><b>Exception Analytics</b><small>Risk & bottleneck</small></span></button>
                        <button onclick="app.openOps('control')"><i class="fa-solid fa-file-export"></i><span><b>Operations Report</b><small>Export management report</small></span></button>
                    </div>
                </div>
            </div>
            <div class="command-group">
                <button class="command-trigger" data-menu="business"><i class="fa-solid fa-briefcase"></i><span>BUSINESS ANALYSIS</span><i class="fa-solid fa-chevron-down chevron"></i></button>
                <div class="command-menu" data-panel="business">
                    <div class="menu-heading"><b>BUSINESS ANALYSIS</b><span>REQUIREMENTS • PROCESS • CHANGE • TRACEABILITY</span></div>
                    <div class="menu-grid">
                        <button onclick="app.openOps('ba')"><i class="fa-solid fa-chart-pie"></i><span><b>BA Dashboard</b><small>Business analysis overview</small></span></button>
                        <button onclick="app.openOps('requirements')"><i class="fa-solid fa-list-check"></i><span><b>Requirements</b><small>Functional & non-functional</small></span></button>
                        <button onclick="app.openOps('process')"><i class="fa-solid fa-diagram-project"></i><span><b>Business Process</b><small>Process map & SLA</small></span></button>
                        <button onclick="app.openOps('change')"><i class="fa-solid fa-code-compare"></i><span><b>Change Requests</b><small>Impact & approval</small></span></button>
                        <button onclick="app.openOps('traceability')"><i class="fa-solid fa-link"></i><span><b>Traceability</b><small>Requirement to test</small></span></button>
                        <button onclick="app.openOps('stakeholders')"><i class="fa-solid fa-users"></i><span><b>Stakeholders</b><small>Owners & responsibilities</small></span></button>
                    </div>
                </div>
            </div>
            <div class="command-group">
                <button class="command-trigger" data-menu="qa"><i class="fa-solid fa-vial"></i><span>QUALITY ASSURANCE</span><i class="fa-solid fa-chevron-down chevron"></i></button>
                <div class="command-menu" data-panel="qa">
                    <div class="menu-heading"><b>QUALITY ASSURANCE</b><span>TEST • DEFECT • UAT • RELEASE</span></div>
                    <div class="menu-grid">
                        <button onclick="app.openOps('qa')"><i class="fa-solid fa-gauge"></i><span><b>QA Dashboard</b><small>Quality health & coverage</small></span></button>
                        <button onclick="app.openOps('testcases')"><i class="fa-solid fa-vial-circle-check"></i><span><b>Test Cases</b><small>Scenario & expected result</small></span></button>
                        <button onclick="app.openOps('execution')"><i class="fa-solid fa-play"></i><span><b>Test Execution</b><small>Run & evidence</small></span></button>
                        <button onclick="app.openOps('defects')"><i class="fa-solid fa-bug"></i><span><b>Defects / Bugs</b><small>Severity & lifecycle</small></span></button>
                        <button onclick="app.openOps('uat')"><i class="fa-solid fa-user-check"></i><span><b>UAT</b><small>Business acceptance</small></span></button>
                        <button onclick="app.openOps('regression')"><i class="fa-solid fa-arrows-rotate"></i><span><b>Regression</b><small>Release confidence</small></span></button>
                    </div>
                </div>
            </div>
            <div class="command-group">
                <button class="command-trigger" data-menu="maintenance"><i class="fa-solid fa-screwdriver-wrench"></i><span>ASSET & MAINTENANCE</span><i class="fa-solid fa-chevron-down chevron"></i></button>
                <div class="command-menu" data-panel="maintenance">
                    <div class="menu-heading"><b>ASSET & MAINTENANCE</b><span>ASSET • HEALTH • WORK ORDER • SPARE PART</span></div>
                    <div class="menu-grid">
                        <button onclick="app.openOps('assets')"><i class="fa-solid fa-industry"></i><span><b>Asset Dashboard</b><small>Fleet & equipment health</small></span></button>
                        <button onclick="app.openOps('assetregister')"><i class="fa-solid fa-rectangle-list"></i><span><b>Asset Register</b><small>Equipment master data</small></span></button>
                        <button onclick="app.openOps('maintenance')"><i class="fa-solid fa-calendar-check"></i><span><b>Maintenance Schedule</b><small>Preventive maintenance</small></span></button>
                        <button onclick="app.openOps('workorders')"><i class="fa-solid fa-wrench"></i><span><b>Work Orders</b><small>Corrective & preventive jobs</small></span></button>
                        <button onclick="app.openOps('spares')"><i class="fa-solid fa-box-open"></i><span><b>Spare Parts</b><small>Stock & reorder point</small></span></button>
                        <button onclick="app.openOps('maintenancecost')"><i class="fa-solid fa-money-bill-trend-up"></i><span><b>Maintenance Cost</b><small>Labor, parts & vendor</small></span></button>
                    </div>
                </div>
            </div>
            <div class="command-group">
                <button class="command-trigger" data-menu="finance"><i class="fa-solid fa-coins"></i><span>FINANCE & COST</span><i class="fa-solid fa-chevron-down chevron"></i></button>
                <div class="command-menu" data-panel="finance">
                    <div class="menu-heading"><b>FINANCE & COST</b><span>BUDGET • OPEX • CAPEX • PROCUREMENT</span></div>
                    <div class="menu-grid">
                        <button onclick="app.openOps('finance')"><i class="fa-solid fa-chart-column"></i><span><b>Cost Dashboard</b><small>Budget vs actual</small></span></button>
                        <button onclick="app.openOps('budget')"><i class="fa-solid fa-wallet"></i><span><b>Budget</b><small>Allocation & utilization</small></span></button>
                        <button onclick="app.openOps('opex')"><i class="fa-solid fa-receipt"></i><span><b>OPEX</b><small>Operating expenditure</small></span></button>
                        <button onclick="app.openOps('capex')"><i class="fa-solid fa-building-circle-check"></i><span><b>CAPEX</b><small>Asset investment</small></span></button>
                        <button onclick="app.openOps('vendors')"><i class="fa-solid fa-handshake"></i><span><b>Vendor & PO</b><small>Supplier spend & SLA</small></span></button>
                        <button onclick="app.openOps('costallocation')"><i class="fa-solid fa-sitemap"></i><span><b>Cost Allocation</b><small>Cost center mapping</small></span></button>
                    </div>
                </div>
            </div>
            <div class="command-group">
                <button class="command-trigger" data-menu="risk"><i class="fa-solid fa-triangle-exclamation"></i><span>RISK & COMPLIANCE</span><i class="fa-solid fa-chevron-down chevron"></i></button>
                <div class="command-menu" data-panel="risk">
                    <div class="menu-heading"><b>RISK & COMPLIANCE</b><span>RISK REGISTER • AUDIT • CORRECTIVE ACTION</span></div>
                    <div class="menu-grid">
                        <button onclick="app.openOps('risk')"><i class="fa-solid fa-shield-heart"></i><span><b>Risk Register</b><small>Probability & impact</small></span></button>
                        <button onclick="app.openOps('compliance')"><i class="fa-solid fa-scale-balanced"></i><span><b>Compliance</b><small>Control checklist</small></span></button>
                        <button onclick="app.openOps('findings')"><i class="fa-solid fa-magnifying-glass-chart"></i><span><b>Audit Findings</b><small>Finding & evidence</small></span></button>
                        <button onclick="app.openOps('corrective')"><i class="fa-solid fa-list-check"></i><span><b>Corrective Action</b><small>CAPA tracking</small></span></button>
                        <button onclick="app.openOps('notifications')"><i class="fa-solid fa-bell"></i><span><b>Notification Center</b><small>Critical operational alerts</small></span></button>
                        <button onclick="app.openOps('management')"><i class="fa-solid fa-user-tie"></i><span><b>Management Overview</b><small>Executive KPI</small></span></button>
                    </div>
                </div>
            </div>
            <div class="command-group">
                <button class="command-trigger" data-menu="governance"><i class="fa-solid fa-clipboard-check"></i><span>GOVERNANCE</span><i class="fa-solid fa-chevron-down chevron"></i></button>
                <div class="command-menu" data-panel="governance">
                    <div class="menu-heading"><b>GOVERNANCE</b><span>AUDIT • CONTROL • ACCOUNTABILITY</span></div>
                    <div class="menu-grid">
                        <button onclick="app.openOps('audit')"><i class="fa-solid fa-list-check"></i><span><b>Audit Trail</b><small>Immutable activity history</small></span></button>
                        <button><i class="fa-solid fa-user-shield"></i><span><b>User & Role</b><small>Access governance</small></span></button>
                        <button onclick="app.openOps('audit')"><i class="fa-solid fa-clock-rotate-left"></i><span><b>Activity Log</b><small>System activity</small></span></button>
                        <button><i class="fa-solid fa-sliders"></i><span><b>System Configuration</b><small>Operational settings</small></span></button>
                    </div>
                </div>
            </div>
        </nav>
        <div class="nav-status"><span class="status-dot"></span><span>ONLINE</span></div>
    </aside>

    <!-- Hidden compatibility registry: preserves legacy openOps highlighting without showing the old sidebar. -->
    <div id="legacy-nav-registry" class="hidden">
        <button id="nav-ops-control" class="ops-nav"></button><button id="nav-ops-containers" class="ops-nav"></button>
        <button id="nav-ops-gate" class="ops-nav"></button><button id="nav-ops-yard" class="ops-nav"></button>
        <button id="nav-ops-eseal" class="ops-nav"></button><button id="nav-ops-rfid" class="ops-nav"></button>
        <button id="nav-ops-alerts" class="ops-nav"></button><button id="nav-ops-customs" class="ops-nav"></button>
        <button id="nav-ops-documents" class="ops-nav"></button><button id="nav-ops-ceisa" class="ops-nav"></button>
        <button id="nav-ops-wms" class="ops-nav"></button><button id="nav-ops-api" class="ops-nav"></button>
        <button id="nav-ops-audit" class="ops-nav"></button><button id="nav-ops-simulasi" class="ops-nav"></button>
    </div>

