        let SPEED = 1;
        const _st = window.setTimeout.bind(window);
        window.setTimeout = (fn, ms, ...a) => _st(fn, (ms || 0) / SPEED, ...a);

        const app = {
            cycle: 0,
            activeCaseId: "MSCU1234567",
            logisticsMode: 'INBOUND',
            ceisaTransactions: [],
            auditTrail: [],
            exceptionRules: {
                ESEAL_TAMPER:{severity:'CRITICAL',owner:'Security / Customs',action:'Block Gate & inspect seal'},
                CUSTOMS_HOLD:{severity:'HIGH',owner:'Customs Officer',action:'Resolve customs hold'},
                DOCUMENT_MISSING:{severity:'HIGH',owner:'Document Officer',action:'Complete missing document'},
                RFID_MISMATCH:{severity:'HIGH',owner:'Gate Officer',action:'Re-scan identity'},
                GATE_BLOCKED:{severity:'MEDIUM',owner:'Gate Officer',action:'Resolve release prerequisites'}
            },
            phase5: {
                roles: ['CONTROL TOWER','CUSTOMS OFFICER','GATE OFFICER','YARD OPERATOR','DOCUMENT OFFICER','CEISA GATEWAY'],
                activeRole: 'CONTROL TOWER',
                lastRefresh: Date.now(),
                reportSeq: 0
            },
            enterprise: {
                requirements: [
                    {id:'REQ-PLB-017',title:'Gate Out Validation',type:'Functional',domain:'Gate Management',priority:'CRITICAL',owner:'Operations Manager',status:'APPROVED',release:'v2.4',coverage:'TC-GATE-017'},
                    {id:'REQ-MNT-008',title:'Maintenance Due Notification',type:'Functional',domain:'Asset & Maintenance',priority:'HIGH',owner:'Maintenance Manager',status:'IN REVIEW',release:'v2.5',coverage:'TC-MNT-008'},
                    {id:'REQ-QA-011',title:'Defect Retest Evidence',type:'Non-Functional',domain:'Quality Assurance',priority:'HIGH',owner:'QA Lead',status:'APPROVED',release:'v2.4',coverage:'TC-QA-011'},
                    {id:'REQ-FIN-004',title:'Budget vs Actual Monitoring',type:'Functional',domain:'Finance & Cost',priority:'MEDIUM',owner:'Finance Manager',status:'DRAFT',release:'v2.6',coverage:'TC-FIN-004'}
                ],
                tests: [
                    {id:'TC-GATE-017',req:'REQ-PLB-017',scenario:'Gate Out — Customs HOLD',status:'PASS',tester:'QA-01',severity:'CRITICAL'},
                    {id:'TC-MNT-008',req:'REQ-MNT-008',scenario:'Maintenance due alert',status:'PASS',tester:'QA-02',severity:'HIGH'},
                    {id:'TC-QA-011',req:'REQ-QA-011',scenario:'Retest evidence required',status:'FAIL',tester:'QA-01',severity:'HIGH'},
                    {id:'TC-FIN-004',req:'REQ-FIN-004',scenario:'Budget utilization threshold',status:'NOT EXECUTED',tester:'QA-03',severity:'MEDIUM'}
                ],
                defects: [
                    {id:'BUG-0042',title:'Gate Out bypasses Customs HOLD',severity:'CRITICAL',priority:'P1',status:'FIXED',req:'REQ-PLB-017',owner:'DEV-02'},
                    {id:'BUG-0047',title:'Retest evidence not mandatory',severity:'HIGH',priority:'P1',status:'READY FOR RETEST',req:'REQ-QA-011',owner:'DEV-01'},
                    {id:'BUG-0051',title:'Maintenance alert duplicate',severity:'MEDIUM',priority:'P2',status:'OPEN',req:'REQ-MNT-008',owner:'DEV-03'}
                ],
                assets: [
                    {id:'QC-001',name:'STS Quay Crane',type:'PORT EQUIPMENT',status:'OPERATIONAL',health:92,hours:6842,next:'16 Oct 2026',cost:187500000,downtime:8.5},
                    {id:'QC-002',name:'STS Quay Crane',type:'PORT EQUIPMENT',status:'OPERATIONAL',health:96,hours:6128,next:'20 Oct 2026',cost:142800000,downtime:5.2},
                    {id:'RTG-001',name:'Rubber Tyred Gantry',type:'YARD EQUIPMENT',status:'MAINTENANCE',health:81,hours:5210,next:'08 Oct 2026',cost:86400000,downtime:11.3},
                    {id:'FL-001',name:'Forklift',type:'MATERIAL HANDLING',status:'OPERATIONAL',health:95,hours:3210,next:'22 Oct 2026',cost:32600000,downtime:3.1},
                    {id:'GEN-001',name:'Backup Generator',type:'UTILITY',status:'WARNING',health:73,hours:4820,next:'10 Oct 2026',cost:54400000,downtime:14.2}
                ],
                workorders: [
                    {id:'WO-2026-0182',asset:'RTG-001',issue:'Hydraulic pressure abnormal',type:'CORRECTIVE',priority:'HIGH',status:'IN PROGRESS',cost:20000000,eta:'07 Oct 2026 18:00'},
                    {id:'WO-2026-0185',asset:'QC-001',issue:'30-day preventive maintenance',type:'PREVENTIVE',priority:'MEDIUM',status:'SCHEDULED',cost:12500000,eta:'16 Oct 2026'},
                    {id:'WO-2026-0187',asset:'GEN-001',issue:'Battery and cooling inspection',type:'PREVENTIVE',priority:'HIGH',status:'PENDING PARTS',cost:8750000,eta:'10 Oct 2026'}
                ],
                spareParts: [
                    {part:'Hydraulic Filter',stock:12,min:5,reserved:3,status:'NORMAL'},
                    {part:'Crane Wire Rope',stock:2,min:3,reserved:1,status:'LOW STOCK'},
                    {part:'Brake Pad',stock:0,min:4,reserved:0,status:'OUT OF STOCK'},
                    {part:'Generator Battery',stock:6,min:4,reserved:2,status:'NORMAL'}
                ],
                costs: {budget:500000000,actual:428750000,maintenance:142250000,operations:186500000,utilities:54000000,vendor:31500000,other:14500000},
                changes: [
                    {id:'CR-2026-009',title:'Additional Gate Validation',requester:'Operations',priority:'HIGH',impact:'Gate, Customs, E-Seal, QA',cost:18000000,status:'IMPACT ANALYSIS'},
                    {id:'CR-2026-011',title:'Asset Health Dashboard',requester:'Maintenance',priority:'MEDIUM',impact:'Asset, Maintenance, Reporting',cost:12500000,status:'APPROVED'}
                ],
                risks: [
                    {id:'RISK-014',risk:'Quay Crane Failure',prob:'MEDIUM',impact:'CRITICAL',score:15,mitigation:'Preventive Maintenance',owner:'Maintenance Manager',status:'MONITORED'},
                    {id:'RISK-018',risk:'Unauthorized Gate Out',prob:'LOW',impact:'CRITICAL',score:10,mitigation:'Gate validation + QA regression',owner:'Operations Manager',status:'MITIGATED'},
                    {id:'RISK-021',risk:'Critical Spare Part Shortage',prob:'HIGH',impact:'HIGH',score:16,mitigation:'Reorder point + vendor SLA',owner:'Maintenance Manager',status:'OPEN'}
                ],
                stakeholders: [
                    {role:'Operations Manager',domain:'Operations',owner:'Gate / Yard / Container',level:'ACCOUNTABLE'},
                    {role:'Business Analyst',domain:'Business Analysis',owner:'Requirement / Process / Change',level:'RESPONSIBLE'},
                    {role:'QA Lead',domain:'Quality Assurance',owner:'Test / Defect / UAT',level:'RESPONSIBLE'},
                    {role:'Maintenance Manager',domain:'Asset',owner:'Equipment / Work Order',level:'ACCOUNTABLE'},
                    {role:'Finance Manager',domain:'Finance',owner:'Budget / Cost / PO',level:'ACCOUNTABLE'}
                ],
                notifications: [
                    {sev:'CRITICAL',title:'QC-001 maintenance due soon',detail:'Preventive maintenance scheduled 16 Oct 2026',time:'16:05'},
                    {sev:'HIGH',title:'RTG-001 hydraulic issue',detail:'Work order WO-2026-0182 in progress',time:'15:48'},
                    {sev:'WARNING',title:'Crane Wire Rope low stock',detail:'2 available, minimum 3',time:'15:22'},
                    {sev:'INFO',title:'REQ-PLB-017 approved',detail:'Traceability linked to TC-GATE-017',time:'14:40'}
                ]
            },
            yardCapacity: 12, // operational slot model for dashboard/KPI
            // INBOUND or OUTBOUND
            state: {
                isArrived: false,
                isProcessingAPI: false,
                isCleared: false,
                isTampered: false,
                auto: false, // 100% Manual Kendali Operator (Tidak auto-next)
                weightMismatch: false,
                arrivedAt: 0,
                battery: 92,
                awaitingOutboundInspection: false,
                awaitingOutboundGateOpen: false,
                outboundInspectionDone: false,
                awaitingContainerLoad: false,
                awaitingInspection: false,
                awaitingGateOpen: false,
                outboundFlowStep: 0,
                outboundFlowItems: [
                    {id:'CARGO-001',customer:'PT Nusantara Elektronik',destination:'Singapore',commodity:'Microchip PCB',qty:120,weight:420},
                    {id:'CARGO-002',customer:'PT Sinar Komponen',destination:'Singapore',commodity:'Electronic Components',qty:85,weight:310},
                    {id:'CARGO-003',customer:'PT Prima Teknologi',destination:'Singapore',commodity:'Industrial Sensor',qty:60,weight:190}
                ],
                docVerified: false,
                ceisaLastSync: null
            },
            // PHASE 1 — SINGLE SOURCE OF TRUTH
            // Semua modul operasional nantinya membaca identitas shipment/container dari registry ini.
            cases: {
                "MSCU1234567": {
                    shipmentId: "PLB-2026-00128",
                    containerNo: "MSCU1234567",
                    blNumber: "BL-SGSIN-2026-0821",
                    importer: "PT Nusantara Elektronik",
                    origin: "Singapore",
                    destination: "Jakarta",
                    cargo: "Elektronik / Microchip PCB",
                    hsCode: "8542.31",
                    grossWeight: 14200,
                    customsStatus: "UNDER_REVIEW",
                    customsStage: "UNDER_REVIEW",
                    customsStageIndex: 2,
                    gateStatus: "IN_YARD",
                    yardLocation: "A01-03",
                    rfidStatus: "DETECTED",
                    esealStatus: "SECURE",
                    esealId: "(00)389912345000000128",
                    truckPlate: "B 9021 TXT",
                    customsDocument: "000482/BC23/2026",
                    documents: {
                        commercialInvoice: "VERIFIED",
                        packingList: "VERIFIED",
                        billOfLading: "VERIFIED",
                        customsDeclaration: "REVIEW",
                        certificateOfOrigin: "REVIEW",
                        deliveryOrder: "VERIFIED"
                    },
                    timeline: [
                        {time:"03:42:11", actor:"SYSTEM", event:"Shipment registered", status:"DONE"},
                        {time:"03:44:08", actor:"RFID", event:"Container detected at Gate 01", status:"DONE"},
                        {time:"03:46:32", actor:"GATE OFFICER", event:"Gate In approved", status:"DONE"},
                        {time:"03:51:17", actor:"WMS", event:"Yard slot A01-03 assigned", status:"DONE"},
                        {time:"04:02:45", actor:"CUSTOMS", event:"Document review started", status:"ACTIVE"}
                    ],
                    alerts: []
                },
                "TGHU8842011": {
                    shipmentId: "PLB-2026-00129",
                    containerNo: "TGHU8842011",
                    blNumber: "BL-SGSIN-2026-0822",
                    importer: "PT Astra Agro Lestari Tbk",
                    origin: "Singapore",
                    destination: "Jakarta",
                    cargo: "Komponen Traktor",
                    hsCode: "8432.90",
                    grossWeight: 18450,
                    customsStatus: "CLEARED",
                    customsStage: "CLEARED",
                    customsStageIndex: 5,
                    gateStatus: "IN_YARD",
                    yardLocation: "A17-02",
                    rfidStatus: "DETECTED",
                    esealStatus: "RELEASED",
                    esealId: "ES-2026-000177",
                    truckPlate: "B 7712 QA",
                    customsDocument: "000481/BC23/2026",
                    documents: {
                        commercialInvoice: "VERIFIED",
                        packingList: "VERIFIED",
                        billOfLading: "VERIFIED",
                        customsDeclaration: "VERIFIED",
                        certificateOfOrigin: "VERIFIED",
                        deliveryOrder: "VERIFIED"
                    },
                    timeline: [
                        {time:"02:18:10", actor:"SYSTEM", event:"Shipment registered", status:"DONE"},
                        {time:"02:24:44", actor:"CUSTOMS", event:"Clearance approved", status:"DONE"},
                        {time:"02:26:03", actor:"GATE OFFICER", event:"Release authorized", status:"DONE"}
                    ],
                    alerts: []
                },
                "OOLU2219045": {
                    shipmentId: "PLB-2026-00130",
                    containerNo: "OOLU2219045",
                    blNumber: "BL-SGSIN-2026-0823",
                    importer: "PT Unilever Indonesia Tbk",
                    origin: "Singapore",
                    destination: "Jakarta",
                    cargo: "Bahan Kimia Baku",
                    hsCode: "2915.21",
                    grossWeight: 22800,
                    customsStatus: "HOLD",
                    customsStage: "HOLD",
                    customsStageIndex: 2,
                    gateStatus: "BLOCKED",
                    yardLocation: "B11-04",
                    rfidStatus: "DETECTED",
                    esealStatus: "SECURE",
                    esealId: "ES-2026-000181",
                    truckPlate: "B 6611 RT",
                    customsDocument: "000483/BC23/2026",
                    documents: {
                        commercialInvoice: "VERIFIED",
                        packingList: "VERIFIED",
                        billOfLading: "VERIFIED",
                        customsDeclaration: "REVIEW",
                        certificateOfOrigin: "MISSING",
                        deliveryOrder: "VERIFIED"
                    },
                    timeline: [
                        {time:"01:52:06", actor:"SYSTEM", event:"Shipment registered", status:"DONE"},
                        {time:"02:14:28", actor:"CUSTOMS", event:"Customs hold applied", status:"ACTIVE"}
                    ],
                    alerts: [
                        {type:"CUSTOMS HOLD", severity:"HIGH", text:"Clearance blocked pending document review."}
                    ]
                },
                "CMAU9087123": {
                    shipmentId: "PLB-2026-00131",
                    containerNo: "CMAU9087123",
                    blNumber: "BL-SGSIN-2026-0824",
                    importer: "PT Toyota Motor Mfg",
                    origin: "Singapore",
                    destination: "Jakarta",
                    cargo: "Steel Coil Otomotif",
                    hsCode: "7225.40",
                    grossWeight: 25500,
                    customsStatus: "CLEARED",
                    customsStage: "CLEARED",
                    customsStageIndex: 5,
                    gateStatus: "IN_YARD",
                    yardLocation: "A08-01",
                    rfidStatus: "DETECTED",
                    esealStatus: "RELEASED",
                    esealId: "ES-2026-000190",
                    truckPlate: "B 4421 LK",
                    customsDocument: "000484/BC23/2026",
                    documents: {
                        commercialInvoice: "VERIFIED",
                        packingList: "VERIFIED",
                        billOfLading: "VERIFIED",
                        customsDeclaration: "VERIFIED",
                        certificateOfOrigin: "VERIFIED",
                        deliveryOrder: "VERIFIED"
                    },
                    timeline: [
                        {time:"00:44:12", actor:"SYSTEM", event:"Shipment registered", status:"DONE"},
                        {time:"01:03:55", actor:"CUSTOMS", event:"Clearance approved", status:"DONE"}
                    ],
                    alerts: []
                }
            },

            data: {
                sscc: "(00)389912345000000128",
                gateId: "PLB-TPP-GATE-01",
                history: [],
                hold: false,
                reject: false,
                lastMs: null,
                seq: 0,
                plan: "CLEAR",
                planW: false,
                override: null,
                plate: "B 9021 TXT",
                doc: "000482/BC23/2026",
                declaredKg: 18450,
                actualKg: 0,
                koli: 24,
                stock: 1200,
                stats: { trucks: 0, clear: 0, issue: 0, lat: [] }
            },

            ui: {
                gateStatus: document.getElementById('gate-status'),
                ssccText: document.getElementById('ui-sscc'),
                sensorText: document.getElementById('ui-sensor'),
                battery: document.getElementById('ui-battery'),
                signal: document.getElementById('ui-signal'),
                weight: document.getElementById('ui-weight'),
                lockPanel: document.getElementById('ui-lock-panel'),
                lockGlow: document.getElementById('ui-lock-glow'),
                lockIconBg: document.getElementById('ui-lock-icon-bg'),
                lockIcon: document.getElementById('ui-lock-icon'),
                lockTitle: document.getElementById('ui-lock-title'),
                lockDesc: document.getElementById('ui-lock-desc'),
                btnArrive: document.getElementById('btn-arrive'),
                btnApi: document.getElementById('btn-api'),
                btnApiText: document.getElementById('btn-api-text'),
                btnSabotage: document.getElementById('btn-sabotage'),
                scenario: document.getElementById('sel-scenario'),
                chkWeight: document.getElementById('chk-weight'),
                terminal: document.getElementById('terminal-output'),
                plate: document.getElementById('truck-plate'),
                mDoc: document.getElementById('m-doc'),
                mHs: document.getElementById('m-hs'),
                mFirm: document.getElementById('m-firm'),
                mKg: document.getElementById('m-kg'),
                clock: document.getElementById('clock'),
                kTrucks: document.getElementById('kpi-trucks'),
                kClear: document.getElementById('kpi-clear'),
                kDwell: document.getElementById('kpi-dwell')
            },

            init() {
                // Initialize state from MySQL preloaded data if available
                if (window.INITIAL_DB_DATA) {
                    if (window.INITIAL_DB_DATA.cases && Object.keys(window.INITIAL_DB_DATA.cases).length > 0) {
                        this.cases = window.INITIAL_DB_DATA.cases;
                    }
                    if (window.INITIAL_DB_DATA.enterprise) {
                        Object.assign(this.enterprise, window.INITIAL_DB_DATA.enterprise);
                    }
                    if (window.INITIAL_DB_DATA.auditTrail && window.INITIAL_DB_DATA.auditTrail.length > 0) {
                        this.auditTrail = window.INITIAL_DB_DATA.auditTrail;
                    }
                }
                // Background sync with MySQL API
                fetch('api.php?action=get_all_data')
                    .then(r => r.json())
                    .then(res => {
                        if (res && res.success && res.data) {
                            if (res.data.cases) this.cases = res.data.cases;
                            if (res.data.enterprise) Object.assign(this.enterprise, res.data.enterprise);
                            if (res.data.auditTrail && res.data.auditTrail.length > 0) this.auditTrail = res.data.auditTrail;
                        }
                    }).catch(e => console.warn('DB sync warning:', e));

                // Phase 6 lobby: keep the original 3D PLB scene as the default landing view.
                // Operational modules are opened explicitly from the top command navigation.
                try {
                    sim3D.init();
                } catch (err) {
                    console.error('3D initialization failed:', err);
                }
                // Top command navigation is permanent; legacy sidebar visibility state is intentionally ignored.
                this.switchTab('simulasi');
                
                // --- AWAL KODE BARU: Listener Tombol F/E ala Roblox ---
                window.addEventListener('keydown', (e) => {
                    const key = e.key.toLowerCase();
                    if (key === 'e' && sim3D.driveMode) {
                        sim3D.exitDriveMode();
                        return;
                    }

                    if (key === 'g' && sim3D.weaponEquipped) {
                        sim3D.dropWeapon();
                        return;
                    }
                    if (key === 'r' && sim3D.weaponEquipped) {
                        sim3D.reloadWeapon();
                        return;
                    }

                    if (key === 'f' || key === 'e') {
                        if (sim3D.activePromptTarget === "Ambil Senjata") {
                            sim3D.initWeaponAudio();
                            sim3D.equipWeapon();
                            document.getElementById('roblox-prompt').classList.add('hidden');
                            return;
                        }
                        if (sim3D.activePromptTarget === "Drive Truck") {
                            sim3D.enterDriveMode();
                        }
                        else if (sim3D.activePromptTarget === "Periksa Dokumen" && this.state.awaitingInspection) {
                            this.state.awaitingInspection = false;
                            document.getElementById('roblox-prompt').classList.add('hidden');
                            
                            const overlay = document.getElementById('inspection-overlay');
                            overlay.classList.remove('hidden');
                            const modalBox = overlay.querySelector('.glass-modal');
                            modalBox.classList.remove('anim-paper'); 
                            void modalBox.offsetWidth; 
                            modalBox.classList.add('anim-paper');
                            
                            this.log('Membaca dokumen ceklis...', 'info');
                        } 
                        else if (sim3D.activePromptTarget === "Buka Gerbang" && this.state.awaitingGateOpen) {
                            this.state.awaitingGateOpen = false;
                            document.getElementById('roblox-prompt').classList.add('hidden');
                            this.openGateManual();
                        }
                        else if (sim3D.activePromptTarget === "Periksa Dokumen Keluar" && this.state.awaitingOutboundInspection) {
                            this.inspectOutboundDocuments();
                        }
                        else if (sim3D.activePromptTarget === "Angkat Gerbang" && this.state.awaitingOutboundGateOpen) {
                            this.openOutboundGateManual();
                        }
                        else if (sim3D.activePromptTarget === "Turunkan Kontainer" && this.state.awaitingContainerLoad) {
                            this.state.awaitingContainerLoad = false;
                            document.getElementById('roblox-prompt').classList.add('hidden');
                            this.loadContainerManual();
                        }
                        else {
                            if (this.state.awaitingInspection || this.state.awaitingGateOpen || this.state.awaitingContainerLoad) {
                                this.log('Anda terlalu jauh dari target! Dekati objek yang dituju untuk berinteraksi.', 'warn');
                            }
                        }
                    }
                });
                // --- AKHIR KODE BARU ---

                this.log('Sistem Operasional Logistik PLB Online. Wi-Fi 6 Connected.', 'system');
                this.log('Koneksi Gateway CEISA 4.0 Bea Cukai: STATUS READY.', 'system');
                this.setStep(-1);
                this.setSpeed(1);

                setInterval(() => {
                    this.ui.clock.innerText = new Date().toLocaleTimeString('id-ID') + ' WIB';
                }, 1000);

                this.nextTruck();
                this.scheduleArrival();

                setInterval(() => {
                    if (this.state.isArrived && !this.state.isCleared) {
                        this.state.battery = Math.max(1, this.state.battery - 0.2);
                        if (this.ui.battery.innerText !== '-') this.ui.battery.innerText = Math.round(this.state.battery) + '%';
                    }
                }, 2500);
            },

            switchTab(tabName) {
                ['ops', 'simulasi', 'manifest', 'fleet', 'wms', 'layers', 'dwelling', 'customs'].forEach(t => {
                    const sec = document.getElementById('tab-' + t);
                    if (sec) sec.classList.toggle('hidden', t !== tabName);
                });
                if (tabName === 'simulasi') sim3D.onResize();
            },

            toggleSidebar() {
                // Legacy compatibility only. The Phase 6 top command bar is permanent.
                document.body.classList.remove('sidebar-hidden');
                try { localStorage.removeItem('plb_sidebar_hidden'); } catch(e) {}
            },

            restoreSidebarPreference() {
                // Legacy sidebar state is intentionally ignored in Phase 6.
                try { localStorage.removeItem('plb_sidebar_hidden'); } catch(e) {}
                document.body.classList.remove('sidebar-hidden');
            },

            openOps(view) {
                if (view === 'simulasi') {
                    this.switchTab('simulasi');
                    document.querySelectorAll('.ops-nav').forEach(el => el.className = 'ops-nav w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-900 transition-all');
                    const active = document.getElementById('nav-ops-simulasi');
                    if (active) active.className = 'ops-nav active w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold bg-blue-600 text-white shadow-lg shadow-blue-900/30 transition-all';
                    setTimeout(() => sim3D.onResize(), 20);
                    return;
                }
                this.switchTab('ops');
                document.querySelectorAll('.ops-nav').forEach(el => el.className = 'ops-nav w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-900 transition-all');
                const active = document.getElementById('nav-ops-' + view);
                if (active) active.className = 'ops-nav active w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold bg-blue-600 text-white shadow-lg shadow-blue-900/30 transition-all';
                try {
                    this.renderOpsPanel(view);
                } catch (err) {
                    console.error('Operations module failed:', view, err);
                    const el = document.getElementById('ops-workspace');
                    if (el) {
                        el.innerHTML = `<div class=\"p-6 rounded-2xl border border-red-500/30 bg-red-500/5 text-red-200\"><div class=\"font-black text-sm\">Module gagal dimuat</div><div class=\"text-xs text-slate-400 mt-2\">${view} — ${String(err.message || err)}</div><button onclick=\"app.openOps('control')\" class=\"mt-4 px-3 py-2 rounded-lg bg-blue-600 text-white text-xs font-bold\">Kembali ke Control Tower</button></div>`;
                    }
                }
            },

            renderOpsPanel(view = 'control') {
                const el = document.getElementById('ops-workspace');
                if (!el) return;
                const s = this.state, d = this.data;
                const cleared = s.isCleared ? 'CLEARED' : (s.isTampered ? 'ALERT' : 'PENDING');
                const gate01 = sim3D.gateAngleCurrent > 1.0 ? 'OPEN' : 'CLOSED';
                const gate02 = sim3D.gateOutAngleCurrent > 1.0 ? 'OPEN' : 'CLOSED';
                const lock = s.isTampered ? 'TAMPER' : (s.isCleared ? 'UNLOCKED' : 'LOCKED');
                const pill = (txt, cls='emerald') => `<span class="px-2 py-1 rounded-lg bg-${cls}-500/10 border border-${cls}-500/30 text-${cls}-400 text-[10px] font-black">${txt}</span>`;
                const card = (title, value, sub, icon, cls) => `<div class="bg-slate-900 border border-slate-800 rounded-2xl p-4"><div class="flex items-center justify-between"><span class="text-[10px] uppercase font-bold text-slate-500">${title}</span><i class="fa-solid ${icon} text-${cls}-400"></i></div><div class="text-2xl font-black text-white mt-2">${value}</div><div class="text-[10px] text-slate-500 mt-1">${sub}</div></div>`;
                let body = '';

                if (view === 'control') {
                    const cases=Object.values(this.cases);
                    const total=cases.length;
                    const clearedCount=cases.filter(c=>c.customsStatus==='CLEARED').length;
                    const holdCount=cases.filter(c=>c.customsStatus==='HOLD'||c.gateStatus==='BLOCKED').length;
                    const readyOut=cases.filter(c=>c.customsStatus==='CLEARED'&&c.esealStatus==='RELEASED'&&c.rfidStatus==='DETECTED').length;
                    const exceptionCount=this.getExceptions().length;
                    const occupied=new Set(cases.map(c=>c.yardLocation).filter(Boolean)).size;
                    const occupancyPct=Math.round((occupied/this.yardCapacity)*100);
                    const clearPct=total?Math.round(clearedCount/total*100):0;
                    const recent=this.getOperationalTimeline(8);
                    body = `<div class="grid grid-cols-2 lg:grid-cols-6 gap-3 mb-5">
                        ${card('Cases', total, 'active shipment registry', 'fa-boxes-stacked', 'cyan')}
                        ${card('Cleared', clearedCount, clearPct+'% clearance rate', 'fa-circle-check', 'emerald')}
                        ${card('Exceptions', exceptionCount, holdCount+' cases constrained', 'fa-triangle-exclamation', exceptionCount?'red':'emerald')}
                        ${card('Gate Ready', readyOut, 'eligible for Gate Out', 'fa-road-barrier', readyOut?'emerald':'amber')}
                        ${card('Yard Occupancy', occupancyPct+'%', occupied+'/'+this.yardCapacity+' slots', 'fa-warehouse', occupancyPct>85?'red':'blue')}
                        ${card('CEISA Tx', this.ceisaTransactions.length, 'tracked transactions', 'fa-cloud-arrow-up', 'violet')}
                    </div>
                    <div class="grid xl:grid-cols-12 gap-4">
                        <div class="xl:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl p-5">
                            <div class="flex flex-wrap justify-between items-start gap-3">
                                <div><div class="text-[10px] uppercase tracking-widest text-blue-400 font-black">PHASE 5 / OPERATIONS COMMAND</div><h2 class="text-xl font-black text-white mt-1">PLB Control Tower</h2><p class="text-xs text-slate-500 mt-1">Satu layar untuk shipment, customs, yard, security, CEISA, dan gate release.</p></div>
                                <div class="flex flex-wrap gap-2">${pill('SYSTEM ONLINE','emerald')}${pill(this.phase5.activeRole,'blue')}</div>
                            </div>
                            <div class="grid md:grid-cols-5 gap-2 mt-5 text-center text-[10px] font-black uppercase">
                                <div class="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-300">01<br><span class="text-white">PORT / GATE</span></div>
                                <div class="p-3 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-300">02<br><span class="text-white">RFID / E-SEAL</span></div>
                                <div class="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300">03<br><span class="text-white">YARD / WMS</span></div>
                                <div class="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-300">04<br><span class="text-white">CUSTOMS / CEISA</span></div>
                                <div class="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">05<br><span class="text-white">RELEASE</span></div>
                            </div>
                            <div class="grid md:grid-cols-4 gap-2 mt-4">
                                <button onclick="app.triggerArrival()" class="p-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold"><i class="fa-solid fa-truck-ramp-box mr-2"></i>Start Inbound</button>
                                <button onclick="app.submitCaseToCEISA()" class="p-3 rounded-xl bg-cyan-700 hover:bg-cyan-600 text-white text-xs font-bold"><i class="fa-solid fa-cloud-arrow-up mr-2"></i>Send CEISA</button>
                                <button onclick="app.openOps('alerts')" class="p-3 rounded-xl bg-red-900/70 hover:bg-red-800 text-white text-xs font-bold"><i class="fa-solid fa-triangle-exclamation mr-2"></i>Exceptions (${exceptionCount})</button>
                                <button onclick="app.openOps('simulasi')" class="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold"><i class="fa-solid fa-cubes mr-2"></i>Open 3D</button>
                            </div>
                            <div class="mt-5 bg-slate-950 border border-slate-800 rounded-xl overflow-hidden">
                                <div class="px-4 py-3 border-b border-slate-800 flex justify-between items-center"><div><b class="text-xs text-white">Operational Timeline</b><div class="text-[9px] text-slate-500">Latest events across all cases</div></div><button onclick="app.openOps('audit')" class="text-[10px] text-blue-300 font-bold">VIEW AUDIT →</button></div>
                                <div class="divide-y divide-slate-800/70">${recent.map(e=>`<div class="px-4 py-2.5 flex items-center gap-3"><div class="w-2 h-2 rounded-full ${e.severity==='CRITICAL'?'bg-red-400':e.severity==='HIGH'?'bg-amber-400':'bg-emerald-400'}"></div><div class="text-[9px] text-slate-500 w-28 shrink-0">${e.time}</div><div class="text-[10px] font-bold text-cyan-300 w-28 shrink-0">${e.container}</div><div class="text-[10px] text-slate-300 truncate">${e.event}</div><div class="ml-auto text-[9px] text-slate-500">${e.actor}</div></div>`).join('') || '<div class="p-5 text-center text-slate-500 text-xs">Belum ada event operasional.</div>'}</div>
                            </div>
                        </div>
                        <div class="xl:col-span-4 space-y-4">
                            <div class="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                                <div class="flex justify-between items-center"><div><h3 class="text-sm font-black text-white">Active Case</h3><p class="text-[10px] text-slate-500">Single operational identity</p></div><button onclick="app.openCase(this.dataset.id)" data-id="${this.activeCaseId}" class="text-[10px] text-blue-300 font-bold">DETAIL</button></div>
                                <div class="mt-4 space-y-2 text-xs"><div class="flex justify-between"><span class="text-slate-500">Container</span><b class="font-mono text-white">${this.activeCaseId}</b></div><div class="flex justify-between"><span class="text-slate-500">Shipment</span><b class="font-mono text-cyan-300">${this.getCase(this.activeCaseId)?.shipmentId||'-'}</b></div><div class="flex justify-between"><span class="text-slate-500">Customs</span>${pill(this.getCase(this.activeCaseId)?.customsStatus||'-',this.getCase(this.activeCaseId)?.customsStatus==='CLEARED'?'emerald':'amber')}</div><div class="flex justify-between"><span class="text-slate-500">Yard</span><b class="text-white">${this.getCase(this.activeCaseId)?.yardLocation||'-'}</b></div></div>
                            </div>
                            <div class="bg-slate-900 border border-slate-800 rounded-2xl p-5"><div class="flex justify-between items-center"><h3 class="text-sm font-black text-white">Yard Heatmap</h3><span class="text-[9px] text-slate-500">${occupancyPct}% occupied</span></div><div class="grid grid-cols-2 gap-2 mt-4">${this.yardSlots.map(slot=>{const c=cases.find(x=>x.yardLocation===slot);const hot=c?.customsStatus==='HOLD';return `<button onclick="app.openCase('${c?.containerNo||this.activeCaseId}');app.openOps('yard')" class="text-left p-3 rounded-xl border ${hot?'border-red-500/40 bg-red-500/10':'border-slate-800 bg-slate-950'}"><div class="text-[9px] text-slate-500">${slot}</div><div class="text-[10px] font-black ${hot?'text-red-300':'text-white'} mt-1">${c?.containerNo||'EMPTY'}</div><div class="text-[9px] text-slate-500 mt-1">${c?.customsStatus||'AVAILABLE'}</div></button>`}).join('')}</div></div>
                            <div class="grid grid-cols-2 gap-2"><button onclick="app.exportOperationsReport()" class="p-3 rounded-xl bg-indigo-700 hover:bg-indigo-600 text-white text-[10px] font-black"><i class="fa-solid fa-file-export mr-1"></i>REPORT</button><button onclick="app.exportManifestCSV()" class="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-[10px] font-black"><i class="fa-solid fa-file-csv mr-1"></i>CSV</button></div>
                        </div>
                    </div>`;
                } else if (view === 'containers') {
                    body = `<div class="bg-slate-900 border border-slate-800 rounded-2xl p-5"><div class="flex justify-between items-center mb-4"><div><h2 class="text-lg font-black text-white">Container Management</h2><p class="text-xs text-slate-500">Manifest, identity, E-Seal and operational status.</p></div><button onclick="app.switchTab('manifest')" class="px-3 py-2 rounded-lg bg-slate-800 text-xs font-bold text-white">Open Manifest</button></div><input oninput="app.filterOpsContainers(this.value)" placeholder="Search Container ID / E-Seal / Truck..." class="w-full mb-4 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-blue-500"><div id="ops-container-table" class="overflow-x-auto"></div></div>`;
                } else if (view === 'gate') {
                    const c = this.getCase(this.activeCaseId);
                    const gateAllowed = c.customsStatus === 'CLEARED' && c.esealStatus === 'RELEASED' && c.rfidStatus === 'DETECTED';
                    const gateState = gateAllowed ? 'OPEN / RELEASE' : (c.gateStatus === 'BLOCKED' ? 'BLOCKED' : 'WAITING');
                    body = `<div class="grid lg:grid-cols-3 gap-4">
                        <div class="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5">
                            <div class="flex justify-between items-start">
                                <div><h2 class="text-lg font-black text-white">Truck & Gate</h2><p class="text-xs text-slate-500 mt-1">${c.containerNo} · ${c.truckPlate}</p></div>
                                ${pill(gateState, gateAllowed?'emerald':gateState==='BLOCKED'?'red':'amber')}
                            </div>
                            <div class="grid md:grid-cols-3 gap-3 mt-5">
                                ${card('RFID',c.rfidStatus,'identity scan','fa-satellite-dish',c.rfidStatus==='DETECTED'?'violet':'slate')}
                                ${card('Customs',c.customsStatus,'clearance','fa-shield-halved',c.customsStatus==='CLEARED'?'emerald':'amber')}
                                ${card('E-Seal',c.esealStatus,'seal state','fa-lock',c.esealStatus==='RELEASED'?'emerald':'cyan')}
                            </div>
                            <div class="mt-5 p-4 rounded-xl bg-slate-950 border border-slate-800">
                                <div class="text-[10px] uppercase tracking-widest text-slate-500 font-black">GATE RELEASE CHECKLIST</div>
                                <div class="space-y-2 mt-3 text-xs">
                                    <div class="flex justify-between"><span class="text-slate-400">Container identity</span><b class="${c.rfidStatus==='DETECTED'?'text-emerald-400':'text-red-400'}">${c.rfidStatus}</b></div>
                                    <div class="flex justify-between"><span class="text-slate-400">Customs clearance</span><b class="${c.customsStatus==='CLEARED'?'text-emerald-400':'text-amber-400'}">${c.customsStatus}</b></div>
                                    <div class="flex justify-between"><span class="text-slate-400">E-Seal authorization</span><b class="${c.esealStatus==='RELEASED'?'text-emerald-400':'text-cyan-400'}">${c.esealStatus}</b></div>
                                    <div class="flex justify-between"><span class="text-slate-400">Gate status</span><b class="${gateAllowed?'text-emerald-400':'text-amber-400'}">${c.gateStatus}</b></div>
                                </div>
                            </div>
                            <div class="flex flex-wrap gap-2 mt-4">
                                <button onclick="app.gateInCase()" class="px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-bold">GATE IN</button>
                                <button onclick="app.manualRFIDScan()" class="px-4 py-2 rounded-lg bg-violet-700 text-white text-xs font-bold">RFID SCAN</button>
                                <button onclick="app.requestGateOut()" class="px-4 py-2 rounded-lg bg-emerald-700 text-white text-xs font-bold">REQUEST GATE OUT</button>
                            </div>
                        </div>
                        <div class="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                            <h3 class="text-sm font-black text-white">Gate Rule</h3>
                            <p class="text-xs text-slate-400 mt-2">Gate Out hanya boleh setelah RFID valid, Customs CLEARED, dan E-Seal RELEASED.</p>
                            <div class="mt-4 p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300">Truck: <b class="text-white">${c.truckPlate}</b><br>Destination: <b class="text-white">${c.destination}</b></div>
                        </div>
                    </div>`;
                } else if (view === 'yard') {
                    const c = this.getCase(this.activeCaseId);
                    const slots = [
                        ['A01-03','YARD A','IN YARD','MSCU1234567','ACTIVE'],
                        ['A08-01','YARD A','CLEARED STOCK','CMAU9087123','AVAILABLE'],
                        ['A17-02','WAREHOUSE A','PLB STORAGE','TGHU8842011','AVAILABLE'],
                        ['B11-04','YARD B','CUSTOMS HOLD','OOLU2219045','HOLD']
                    ];
                    const slotCards = slots.map(z => `<button onclick="app.assignYardSlot('${z[0]}')" class="text-left p-4 rounded-xl bg-slate-950 border ${z[0]===c.yardLocation?'border-blue-500/60':'border-slate-800'}">
                        <div class="flex justify-between"><b class="text-white">${z[0]}</b><span class="text-[9px] font-black ${z[4]==='HOLD'?'text-red-400':'text-emerald-400'}">${z[4]}</span></div>
                        <div class="text-[10px] text-slate-500 mt-1">${z[1]} · ${z[2]}</div>
                        <div class="text-xs text-cyan-300 font-mono mt-3">${z[3]}</div>
                    </button>`).join('');
                    body = `<div class="space-y-4">
                        <div class="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                            <div class="flex justify-between items-start"><div><h2 class="text-lg font-black text-white">Yard Management</h2><p class="text-xs text-slate-500 mt-1">Active container: ${c.containerNo}</p></div>${pill(c.gateStatus, c.gateStatus==='BLOCKED'?'red':'blue')}</div>
                            <div class="grid md:grid-cols-3 gap-3 mt-5">
                                ${card('Current Slot',c.yardLocation,'assigned position','fa-location-dot','cyan')}
                                ${card('Customs',c.customsStatus,'clearance state','fa-shield-halved',c.customsStatus==='CLEARED'?'emerald':'amber')}
                                ${card('Inventory','SYNCED','WMS / PLB','fa-boxes-stacked','cyan')}
                            </div>
                            <div class="mt-5 grid md:grid-cols-2 lg:grid-cols-4 gap-3">${slotCards}</div>
                        </div>
                    </div>`;
                } else if (view === 'eseal') {
                    const c = this.getCase(this.activeCaseId);
                    body = `<div class="grid lg:grid-cols-3 gap-4">
                        <div class="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5">
                            <div class="flex justify-between items-start"><div><h2 class="text-lg font-black text-white">E-Seal Monitoring</h2><p class="text-xs text-slate-500 mt-1">${c.containerNo} · ${c.esealId}</p></div>${pill(c.esealStatus,c.esealStatus==='RELEASED'?'emerald':c.esealStatus==='TAMPER'?'red':'cyan')}</div>
                            <div class="grid md:grid-cols-4 gap-3 mt-5">
                                ${card('Seal',c.esealStatus,'lock state','fa-lock',c.esealStatus==='SECURE'?'cyan':c.esealStatus==='RELEASED'?'emerald':'red')}
                                ${card('RFID',c.rfidStatus,'tag identity','fa-satellite-dish',c.rfidStatus==='DETECTED'?'violet':'slate')}
                                ${card('Gate',c.gateStatus,'authorization','fa-road-barrier',c.gateStatus==='RELEASE_AUTHORIZED'?'emerald':'amber')}
                                ${card('Customs',c.customsStatus,'clearance','fa-shield-halved',c.customsStatus==='CLEARED'?'emerald':'amber')}
                            </div>
                            <div class="mt-5 p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300">
                                <div class="flex justify-between"><span>Seal ID</span><b class="font-mono text-cyan-300">${c.esealId}</b></div>
                                <div class="flex justify-between mt-2"><span>Integrity</span><b class="${c.esealStatus==='SECURE'?'text-emerald-400':'text-amber-400'}">${c.esealStatus==='SECURE'?'INTACT':'CHECK REQUIRED'}</b></div>
                            </div>
                            <div class="flex gap-2 mt-4">
                                <button onclick="app.simulateTamperCase()" class="px-4 py-2 rounded-lg bg-red-900 text-red-200 text-xs font-bold">SIMULATE TAMPER</button>
                                <button onclick="app.releaseESealCase()" class="px-4 py-2 rounded-lg bg-emerald-700 text-white text-xs font-bold">AUTHORIZE RELEASE</button>
                            </div>
                        </div>
                    </div>`;
                } else if (view === 'rfid') {                } else if (view === 'rfid') {
                    body = `<div class="grid lg:grid-cols-2 gap-4"><div class="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center"><i class="fa-solid fa-satellite-dish text-5xl text-violet-400"></i><h2 class="text-lg font-black text-white mt-4">RFID Reader — Gate 02</h2><p class="text-xs text-slate-500 mt-1">Fixed UHF portal scanner</p><div class="mt-5 p-4 rounded-xl bg-slate-950 border border-slate-800"><div class="text-[10px] uppercase text-slate-500">Last Detection</div><div class="text-xl font-black text-cyan-300 mt-1">${s.isArrived?'MSCU1234567':'WAITING'}</div><div class="text-xs text-slate-400 mt-1">${s.isArrived?d.sscc:'No RFID tag detected'}</div></div><button onclick="app.manualRFIDScan()" class="mt-4 px-5 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-black">START SCAN</button></div><div class="bg-slate-900 border border-slate-800 rounded-2xl p-5"><h3 class="text-sm font-black text-white">Reader Diagnostics</h3><div class="space-y-3 mt-4 text-xs"><div class="flex justify-between"><span class="text-slate-500">Reader</span><b class="text-emerald-400">ONLINE</b></div><div class="flex justify-between"><span class="text-slate-500">Frequency</span><b class="text-white">UHF 920–925 MHz</b></div><div class="flex justify-between"><span class="text-slate-500">Signal</span><b class="text-emerald-400">STRONG</b></div><div class="flex justify-between"><span class="text-slate-500">Gate</span><b class="text-white">PLB-TPP-GATE-01/02</b></div></div></div></div>`;
                 } else if (view === 'outboundflow') {
                    const of=this.state.outboundFlowStep;
                    const steps=[
                        ['PENAMPUNGAN','Barang customer diterima satu per satu di area penampungan.','fa-box-open'],
                        ['SORTING','Barang disortir berdasarkan tujuan dan rencana container.','fa-filter'],
                        ['CONSOLIDATION','Barang yang satu tujuan dikonsolidasikan ke container.','fa-boxes-stacked'],
                        ['CUSTOMS DECLARATION','Daftar isi container dikirim sebagai dokumen ke Bea Cukai.','fa-file-circle-check'],
                        ['CUSTOMS REVIEW','Bea Cukai melakukan pengecekan dokumen / pemeriksaan sesuai ketentuan.','fa-shield-halved'],
                        ['CUSTOMS SEAL','Setelah sesuai, petugas Bea Cukai memasang dan mengunci E-Seal.','fa-lock'],
                        ['GATE OUT','Container siap menuju Gate Out setelah seluruh release requirement terpenuhi.','fa-road-barrier']
                    ];
                    const itemRows=this.state.outboundFlowItems.map(x=>`<tr class="border-b border-slate-800/60"><td class="p-3 font-mono text-cyan-300">${x.id}</td><td class="p-3 text-white font-bold">${x.customer}</td><td class="p-3 text-slate-300">${x.commodity}</td><td class="p-3 text-slate-300">${x.destination}</td><td class="p-3 text-right">${x.qty}</td><td class="p-3 text-right">${x.weight} kg</td></tr>`).join('');
                    const pct=Math.round((of/(steps.length-1))*100);
                    body=`<div class="space-y-4">
                        <div class="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                            <div class="flex flex-wrap justify-between gap-3"><div><div class="text-[10px] text-indigo-400 font-black uppercase tracking-widest">OUTBOUND / EXPORT SIMULATION</div><h2 class="text-xl font-black text-white mt-1">Outbound Customs End-to-End</h2><p class="text-xs text-slate-500 mt-1">Simulasi penerimaan barang customer → penampungan → sorting → consolidation container → customs → sealing → gate out.</p></div>${pill(of===6?'READY FOR GATE OUT':'IN PROCESS',of===6?'emerald':'amber')}</div>
                            <div class="mt-5 h-2 rounded-full bg-slate-800 overflow-hidden"><div class="h-full bg-indigo-500" style="width:${pct}%"></div></div>
                            <div class="grid md:grid-cols-7 gap-2 mt-4">${steps.map((x,i)=>`<div class="rounded-xl p-3 border ${i<of?'border-emerald-500/30 bg-emerald-500/5':i===of?'border-indigo-500/50 bg-indigo-500/10':'border-slate-800 bg-slate-950'}"><div class="w-8 h-8 rounded-lg flex items-center justify-center ${i<of?'bg-emerald-500 text-slate-950':i===of?'bg-indigo-500 text-white':'bg-slate-800 text-slate-500'}"><i class="fa-solid ${x[2]}"></i></div><div class="text-[9px] font-black mt-2 ${i===of?'text-indigo-300':'text-slate-400'}">${i+1}. ${x[0]}</div></div>`).join('')}</div>
                            <div class="mt-4 p-4 rounded-xl bg-slate-950 border border-slate-800"><div class="text-[10px] uppercase tracking-widest text-slate-500">Current Step</div><div class="text-base font-black text-white mt-1">${steps[of][0]}</div><div class="text-xs text-slate-400 mt-1">${steps[of][1]}</div></div>
                            <div class="flex flex-wrap gap-2 mt-4"><button onclick="app.advanceOutboundFlow()" ${of>=6?'disabled':''} class="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white text-xs font-black">${of>=6?'FLOW COMPLETE':'COMPLETE CURRENT STEP →'}</button><button onclick="app.resetOutboundFlow()" class="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-black">RESET OUTBOUND</button><button onclick="app.openOps('customs')" class="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-black">OPEN CUSTOMS CASE</button></div>
                        </div>
                        <div class="bg-slate-900 border border-slate-800 rounded-2xl p-5"><div class="flex justify-between items-center"><div><h3 class="text-sm font-black text-white">Customer Cargo / Consolidation List</h3><p class="text-[10px] text-slate-500 mt-1">Barang masuk ketengan dikumpulkan berdasarkan destination sebelum declaration.</p></div>${pill('DESTINATION: SINGAPORE','cyan')}</div><div class="overflow-x-auto mt-4"><table class="w-full min-w-[760px] text-left text-xs"><thead><tr class="text-slate-500 border-b border-slate-800"><th class="p-3">Cargo ID</th><th class="p-3">Customer</th><th class="p-3">Commodity</th><th class="p-3">Destination</th><th class="p-3 text-right">Qty</th><th class="p-3 text-right">Weight</th></tr></thead><tbody>${itemRows}</tbody></table></div></div>
                        <div class="grid md:grid-cols-4 gap-3">${card('Consolidated Container','MSCU-OUT-2026-001','export container','fa-boxes-stacked','cyan')}${card('Cargo Lines',this.state.outboundFlowItems.length,'customer consignments','fa-list','violet')}${card('Declaration',of>=3?'SUBMITTED':'PENDING','customs document','fa-file-circle-check',of>=3?'emerald':'amber')}${card('E-Seal',of>=5?'LOCKED':'NOT ASSIGNED','customs seal authority', 'fa-lock',of>=5?'emerald':'amber')}</div>
                    </div>`;

} else if (view === 'customs') {
                    const c=this.getCase(this.activeCaseId);
                    const cs=c || this.getCase('MSCU1234567');
                    const docs=this.caseDocumentSummary(cs);
                    const stages=this.customsStages();
                    const currentStage=Math.max(0,Number(cs.customsStageIndex ?? 0));
                    const workflow=stages.map((st,i)=>{
                        const done=i<currentStage || (i===currentStage && currentStage===stages.length-1);
                        const active=i===currentStage && currentStage<stages.length-1;
                        return `<div class="flex items-center gap-2 ${i<stages.length-1?'flex-1':''}">
                            <div class="w-9 h-9 rounded-full flex items-center justify-center text-xs font-black ${done?'bg-emerald-500 text-slate-950':active?'bg-blue-600 text-white':'bg-slate-800 text-slate-500'}">
                                <i class="fa-solid ${st.icon}"></i>
                            </div>
                            <div class="hidden md:block min-w-0">
                                <div class="text-[9px] uppercase tracking-wider font-black ${done?'text-emerald-400':active?'text-blue-300':'text-slate-600'}">${st.label}</div>
                            </div>
                            ${i<stages.length-1?'<div class="h-px flex-1 bg-slate-800 mx-1"></div>':''}
                        </div>`;
                    }).join('');

                    const canAdvance = docs.missing===0 && currentStage < stages.length-1;
                    body = `<div class="space-y-4">
                        <div class="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                            <div class="flex flex-wrap items-center justify-between gap-3">
                                <div>
                                    <h2 class="text-lg font-black text-white">Customs Clearance Workflow</h2>
                                    <p class="text-xs text-slate-500">Shipment case: <span class="font-mono text-cyan-300">${cs.containerNo}</span> • ${cs.shipmentId}</p>
                                </div>
                                ${pill(this.caseStatusLabel(cs.customsStatus),this.caseStatusClass(cs.customsStatus))}
                            </div>
                            <div class="mt-5 flex items-start overflow-x-auto pb-2">${workflow}</div>
                        </div>

                        <div class="grid lg:grid-cols-3 gap-4">
                            <div class="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5">
                                <div class="grid md:grid-cols-4 gap-3">
                                    ${card('Documents',docs.verified+'/'+docs.total,'verified / total','fa-file-circle-check',docs.missing?'amber':'emerald')}
                                    ${card('Missing',String(docs.missing),'clearance blocker','fa-triangle-exclamation',docs.missing?'red':'emerald')}
                                    ${card('Risk / Review',docs.review?'REVIEW':'NORMAL','customs assessment','fa-shield-halved',docs.review?'amber':'emerald')}
                                    ${card('Gate',cs.gateStatus,'release state','fa-road-barrier',cs.gateStatus==='RELEASE_READY'?'emerald':'rose')}
                                </div>

                                <div class="mt-5 p-4 rounded-xl bg-slate-950 border border-slate-800">
                                    <div class="flex justify-between items-center gap-3">
                                        <div>
                                            <div class="text-[10px] uppercase tracking-widest text-slate-500">Current Decision</div>
                                            <div class="text-white font-black mt-1">${cs.customsStage==='HOLD'?'CUSTOMS HOLD':stages[currentStage]?.label || 'Draft'}</div>
                                        </div>
                                        <div class="flex flex-wrap gap-2">
                                            <button onclick="app.submitCustomsCase('${cs.containerNo}')" class="px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-black">SUBMIT</button>
                                            <button onclick="app.advanceCustomsCase('${cs.containerNo}')" class="px-3 py-2 rounded-lg ${canAdvance?'bg-emerald-700 hover:bg-emerald-600':'bg-slate-800'} text-white text-[10px] font-black" ${canAdvance?'':'disabled'}>${currentStage>=5?'CLEARED':'ADVANCE STAGE'}</button>
                                            <button onclick="app.openDocumentVerification('${cs.containerNo}')" class="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-[10px] font-black">DOCUMENTS</button>
                                        </div>
                                    </div>
                                    ${docs.missing?`<div class="mt-3 text-[11px] text-red-300 bg-red-950/30 border border-red-500/20 rounded-lg p-3"><b>BLOCKED:</b> ${docs.missing} document belum lengkap. Clearance tidak boleh dilanjutkan.</div>`:''}
                                </div>
                            </div>

                            <div class="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                                <h3 class="text-sm font-black text-white">Case Identity</h3>
                                <div class="mt-4 space-y-2 text-xs">
                                    <div class="flex justify-between gap-3"><span class="text-slate-500">BL</span><b class="font-mono text-cyan-300">${cs.blNumber}</b></div>
                                    <div class="flex justify-between gap-3"><span class="text-slate-500">BC</span><b class="font-mono text-blue-300">${cs.customsDocument}</b></div>
                                    <div class="flex justify-between gap-3"><span class="text-slate-500">Importer</span><b class="text-white text-right">${cs.importer}</b></div>
                                    <div class="flex justify-between gap-3"><span class="text-slate-500">HS Code</span><b class="font-mono text-white">${cs.hsCode}</b></div>
                                    <div class="flex justify-between gap-3"><span class="text-slate-500">Weight</span><b class="text-white">${Number(cs.grossWeight).toLocaleString('id-ID')} kg</b></div>
                                </div>
                            </div>
                        </div>
                    </div>`;
                } else if (view === 'documents') {
                    const c=this.getCase(this.activeCaseId) || this.getCase('MSCU1234567');
                    const docs=this.caseDocumentSummary(c);
                    const docRows=Object.entries(c.documents || {}).map(([key,status])=>{
                        const verified=status==='VERIFIED', missing=status==='MISSING';
                        const cls=verified?'emerald':missing?'red':'amber';
                        const icon=verified?'fa-circle-check':missing?'fa-circle-xmark':'fa-clock';
                        const actionStatus=verified?'REVIEW':(missing?'VERIFY':'VERIFY');
                        return `<div class="flex flex-col md:flex-row md:items-center justify-between gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800">
                            <div class="flex items-center gap-3 min-w-0">
                                <div class="w-8 h-8 rounded-lg bg-${cls}-500/10 text-${cls}-400 flex items-center justify-center"><i class="fa-solid ${icon}"></i></div>
                                <div><div class="text-xs font-bold text-white">${this.documentLabel(key)}</div><div class="text-[10px] text-slate-500">${status==='VERIFIED'?'Evidence accepted':status==='MISSING'?'Evidence missing':'Requires officer review'}</div></div>
                            </div>
                            <div class="flex items-center gap-2 shrink-0">
                                <span class="text-[10px] font-black text-${cls}-400">${status}</span>
                                <button onclick="app.setCaseDocument('${c.containerNo}','${key}','VERIFIED')" class="px-2 py-1.5 rounded-lg bg-emerald-700 text-white text-[9px] font-black">VERIFY</button>
                                <button onclick="app.setCaseDocument('${c.containerNo}','${key}','MISSING')" class="px-2 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-[9px] font-black">MISSING</button>
                            </div>
                        </div>`;
                    }).join('');
                    body = `<div class="grid lg:grid-cols-3 gap-4">
                        <div class="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5">
                            <div class="flex flex-wrap items-center justify-between gap-3">
                                <div><h2 class="text-lg font-black text-white">Document Verification</h2><p class="text-xs text-slate-500">${c.containerNo} • ${c.customsDocument}</p></div>
                                <div class="text-xs font-black text-white">${docs.verified}/${docs.total} <span class="text-slate-500">verified</span></div>
                            </div>
                            <div class="mt-4 space-y-2">${docRows}</div>
                            <div class="grid md:grid-cols-2 gap-2 mt-4">
                                <button onclick="app.verifyCaseDocuments('${c.containerNo}')" class="p-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-black">VERIFY DOCUMENT SET</button>
                                <button onclick="app.openCase('${c.containerNo}')" class="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-black">OPEN SHIPMENT CASE</button>
                            </div>
                        </div>
                        <div class="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                            <h3 class="text-sm font-black text-white">Verification Rules</h3>
                            <div class="mt-4 space-y-2 text-[11px] text-slate-300">
                                <div class="p-2.5 rounded-lg bg-slate-950">✓ Commercial Invoice</div>
                                <div class="p-2.5 rounded-lg bg-slate-950">✓ Packing List</div>
                                <div class="p-2.5 rounded-lg bg-slate-950">✓ Bill of Lading</div>
                                <div class="p-2.5 rounded-lg bg-slate-950">✓ Customs Declaration</div>
                                <div class="p-2.5 rounded-lg bg-slate-950">✓ Certificate of Origin</div>
                                <div class="p-2.5 rounded-lg bg-slate-950">✓ Delivery Order</div>
                            </div>
                            <div class="mt-4 p-3 rounded-xl ${docs.missing?'bg-red-950/30 border border-red-500/30':'bg-emerald-950/30 border border-emerald-500/30'} text-[10px] ${docs.missing?'text-red-300':'text-emerald-300'}">${docs.missing?docs.missing+' document(s) masih missing — clearance blocked.':'Complete document set — case eligible to advance.'}</div>
                        </div>
                    </div>`;
                } else if (view === 'ceisa') {
                    const c=this.getCase(this.activeCaseId); const tx=this.ceisaTransactions.filter(x=>x.caseId===c?.containerNo).slice(0,6);
                    body=`<div class="grid lg:grid-cols-4 gap-3 mb-4">${card('Gateway','ONLINE','CEISA 4.0','fa-link','emerald')}${card('Transactions',tx.length,'case scoped','fa-right-left','cyan')}${card('Last Response',tx[0]?.response||'—','latest decision','fa-reply','violet')}${card('Exceptions',c?.alerts?.length||0,'active case','fa-triangle-exclamation',c?.alerts?.length?'red':'emerald')}</div><div class="grid lg:grid-cols-3 gap-4"><div class="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5"><h2 class="text-lg font-black text-white">CEISA Case Transaction</h2><p class="text-xs text-slate-500 mt-1">${c?.containerNo||'-'} • ${c?.customsDocument||'-'}</p><div class="grid md:grid-cols-3 gap-2 mt-4 text-xs"><div class="bg-slate-950 p-3 rounded-lg"><span class="text-slate-500">Shipment</span><b class="block text-white mt-1">${c?.shipmentId||'-'}</b></div><div class="bg-slate-950 p-3 rounded-lg"><span class="text-slate-500">Importer</span><b class="block text-white mt-1">${c?.importer||'-'}</b></div><div class="bg-slate-950 p-3 rounded-lg"><span class="text-slate-500">Documents</span><b class="block text-white mt-1">${c?this.caseDocumentSummary(c).verified+'/'+this.caseDocumentSummary(c).total:'-'}</b></div></div><div class="flex flex-wrap gap-2 mt-4"><button onclick="app.testCEISA()" class="px-3 py-2 rounded-lg bg-slate-800 text-white text-xs font-bold">TEST CONNECTION</button><button onclick="app.submitCaseToCEISA()" class="px-3 py-2 rounded-lg bg-emerald-700 text-white text-xs font-black">SUBMIT CASE</button><button onclick="app.showPayloadViewer()" class="px-3 py-2 rounded-lg bg-blue-600 text-white text-xs font-black">VIEW JSON</button></div></div><div class="bg-slate-900 border border-slate-800 rounded-2xl p-5"><h3 class="text-sm font-black text-white">Transaction History</h3><div class="mt-3 space-y-2 max-h-64 overflow-auto">${tx.length?tx.map(x=>`<div class="bg-slate-950 rounded-lg p-3 text-[10px] font-mono"><div class="flex justify-between"><b class="text-cyan-300">${x.id}</b><span class="text-emerald-400">${x.response}</span></div><div class="text-slate-500 mt-1">${x.time}</div></div>`).join(''):'<div class="text-xs text-slate-500">Belum ada transaksi untuk case ini.</div>'}</div></div></div>`;
                } else if (view === 'wms') {
                    body = `<div class="grid lg:grid-cols-4 gap-3 mb-4">${card('Inbound',24,'today','fa-arrow-right-to-bracket','cyan')}${card('Stored',d.stock,'inventory units','fa-boxes-stacked','amber')}${card('Outbound',17,'today','fa-arrow-right-from-bracket','emerald')}${card('Available Slot',31,'yard capacity','fa-warehouse','violet')}</div><div class="bg-slate-900 border border-slate-800 rounded-2xl p-5"><h2 class="text-lg font-black text-white">WMS / PLB</h2><p class="text-xs text-slate-500 mt-1">Warehouse inventory and storage visibility.</p><div class="grid md:grid-cols-3 gap-3 mt-5"><button onclick="app.focusYard('WAREHOUSE')" class="p-4 rounded-xl bg-slate-950 border border-slate-800 text-left"><b class="text-white">Storage A-17</b><div class="text-xs text-slate-500 mt-1">Electronics / bonded cargo</div></button><button onclick="app.focusYard('A')" class="p-4 rounded-xl bg-slate-950 border border-slate-800 text-left"><b class="text-white">Yard A-03</b><div class="text-xs text-slate-500 mt-1">Inbound staging</div></button><button onclick="app.focusYard('B')" class="p-4 rounded-xl bg-slate-950 border border-slate-800 text-left"><b class="text-white">Yard B-11</b><div class="text-xs text-slate-500 mt-1">Customs hold</div></button></div></div>`;
                } else if (view === 'api') {
                    body = `<div class="grid lg:grid-cols-2 gap-4"><div class="bg-slate-900 border border-slate-800 rounded-2xl p-5"><h2 class="text-lg font-black text-white">API / EDI Monitor</h2><div class="mt-4 space-y-2 font-mono text-[11px]"><div class="p-3 rounded-xl bg-slate-950 text-sky-300">WMS → API GATEWAY <span class="float-right text-emerald-400">200 OK</span></div><div class="p-3 rounded-xl bg-slate-950 text-violet-300">API → CEISA <span class="float-right text-emerald-400">READY</span></div><div class="p-3 rounded-xl bg-slate-950 text-emerald-300">CEISA → WMS <span class="float-right text-emerald-400">${s.ceisaLastSync?'RESPONSE':'WAITING'}</span></div></div><button onclick="app.showPayloadViewer()" class="mt-4 px-4 py-3 rounded-xl bg-emerald-700 text-white text-xs font-bold">VIEW JSON PAYLOAD</button></div><div class="bg-slate-900 border border-slate-800 rounded-2xl p-5"><h3 class="text-sm font-black text-white">Endpoint</h3><code class="block mt-3 p-3 rounded-xl bg-slate-950 text-[10px] text-slate-300 break-all">/v2/plb/customs-clearance/verify</code><p class="text-xs text-slate-500 mt-3">Simulation layer for API/EDI transaction visibility.</p></div></div>`;
                } else if (view === 'audit') {
                    const logs=this.auditTrail.slice(0,80);
                    body=`<div class="bg-slate-900 border border-slate-800 rounded-2xl p-5"><div class="flex justify-between items-center"><div><h2 class="text-lg font-black text-white">Audit Trail</h2><p class="text-xs text-slate-500">Case, actor, severity and transaction evidence.</p></div><button onclick="app.exportLog()" class="px-3 py-2 rounded-lg bg-blue-600 text-white text-xs font-bold">Export Log</button></div><div class="mt-4 overflow-auto"><table class="w-full text-left text-[10px] min-w-[760px]"><thead class="text-slate-500 border-b border-slate-800"><tr><th class="p-2">Time</th><th class="p-2">Actor</th><th class="p-2">Case</th><th class="p-2">Severity</th><th class="p-2">Action</th><th class="p-2">Detail</th></tr></thead><tbody>${logs.length?logs.map(x=>`<tr class="border-b border-slate-800/50"><td class="p-2 text-slate-500">${x.time}</td><td class="p-2 font-bold text-cyan-300">${x.actor}</td><td class="p-2 font-mono text-white">${x.container}</td><td class="p-2 font-black">${x.severity}</td><td class="p-2 text-slate-200">${x.action}</td><td class="p-2 text-slate-500">${x.detail||'-'}</td></tr>`).join(''):'<tr><td colspan="6" class="p-5 text-center text-slate-500">Belum ada audit event dari Phase 4.</td></tr>'}</tbody></table></div></div>`;
                } else if (view === 'alerts') {
                    const ex=this.getExceptions();
                    body=`<div class="grid lg:grid-cols-3 gap-4 mb-4">${card('Active Exceptions',ex.length,'all containers','fa-triangle-exclamation',ex.length?'red':'emerald')}${card('Critical',ex.filter(x=>x.severity==='CRITICAL'||this.exceptionRules[x.type]?.severity==='CRITICAL').length,'immediate action','fa-fire','red')}${card('Cases on Hold',Object.values(this.cases).filter(c=>c.customsStatus==='HOLD').length,'customs decision','fa-hand','amber')}</div><div class="bg-slate-900 border border-slate-800 rounded-2xl p-5"><div class="flex justify-between items-center"><div><h2 class="text-lg font-black text-white">Exception Center</h2><p class="text-xs text-slate-500">Centralized exceptions with owner, action and case linkage.</p></div><button onclick="app.clearCaseExceptions()" class="px-3 py-2 rounded-lg bg-slate-800 text-white text-xs font-bold">Clear Active Case</button></div><div class="mt-4 space-y-2">${ex.length?ex.map(x=>{const r=this.exceptionRules[x.type]||{severity:x.severity||'MEDIUM',owner:'Operations',action:'Review case'};return `<div class="p-4 rounded-xl bg-slate-950 border border-slate-800"><div class="flex justify-between gap-2"><div><b class="text-white text-xs">${x.type}</b><span class="text-slate-500 text-[10px] ml-2">${x.caseId}</span><div class="text-[9px] text-amber-300 mt-1">${x.severity||r.severity} • ${r.owner}</div></div><div class="flex gap-2"><button onclick="app.acknowledgeException('${x.caseId}',${x.index})" class="px-2 py-1 rounded bg-slate-800 text-white text-[10px]">Acknowledge</button><button onclick="app.resolveException('${x.caseId}',${x.index})" class="px-2 py-1 rounded bg-emerald-700 text-white text-[10px]">Resolve</button></div></div><p class="text-[11px] text-slate-300 mt-2">${x.text}</p><div class="text-[10px] text-slate-500 mt-2">Action: <b class="text-white">${r.action}</b></div></div>`}).join(''):'<div class="p-8 text-center text-emerald-300 text-sm font-bold">✓ No active exceptions</div>'}</div></div>`;
                }
                else if (['ba','requirements','process','change','traceability','stakeholders','qa','testcases','execution','defects','uat','regression','assets','assetregister','maintenance','workorders','spares','maintenancecost','finance','budget','opex','capex','vendors','costallocation','risk','compliance','findings','corrective','notifications','management'].includes(view)) {
                    const e=this.enterprise, money=n=>new Intl.NumberFormat('id-ID',{style:'currency',currency:'IDR',maximumFractionDigits:0}).format(n);
                    const pct=(a,b)=>b?Math.round(a/b*100):0;
                    const table=(headers,rows)=>`<div class="overflow-auto"><table class="w-full min-w-[760px] text-left text-[10px]"><thead class="text-slate-500 border-b border-slate-800"><tr>${headers.map(h=>`<th class="p-2 whitespace-nowrap">${h}</th>`).join('')}</tr></thead><tbody>${rows.map(r=>`<tr class="border-b border-slate-800/50 hover:bg-slate-950/70">${r.map(c=>`<td class="p-2 align-top text-slate-300">${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
                    const hero=(title,sub)=>`<div class="bg-slate-900 border border-slate-800 rounded-2xl p-5 mb-4"><div class="flex flex-wrap items-start justify-between gap-3"><div><div class="text-[10px] uppercase tracking-widest text-cyan-400 font-black">ENTERPRISE MODULE</div><h2 class="text-xl font-black text-white mt-1">${title}</h2><p class="text-xs text-slate-500 mt-1">${sub}</p></div>${pill('SIMULATED DATA','violet')}</div></div>`;
                    if(view==='ba') body=hero('Business Analyst Dashboard','Requirement, process, change request dan traceability dalam satu workspace')+`<div class="grid grid-cols-2 lg:grid-cols-5 gap-3">${card('Requirements',48,'31 approved','fa-list-check','cyan')}${card('Approved',31,'64.6% of register','fa-circle-check','emerald')}${card('Under Review',9,'needs analysis','fa-magnifying-glass','amber')}${card('Change Requests',6,'2 high priority','fa-code-compare','violet')}${card('Traceability', '92%','requirement coverage','fa-link','blue')}</div><div class="grid lg:grid-cols-2 gap-4 mt-4"><div class="bg-slate-900 border border-slate-800 rounded-2xl p-5"><h3 class="font-black text-white">Priority Queue</h3><div class="mt-4 space-y-2">${e.requirements.map(r=>`<div class="p-3 rounded-xl bg-slate-950 border border-slate-800 flex justify-between"><div><b class="text-white text-xs">${r.id}</b><div class="text-[10px] text-slate-400 mt-1">${r.title}</div></div><span class="text-[9px] font-black ${r.priority==='CRITICAL'?'text-red-400':r.priority==='HIGH'?'text-amber-300':'text-cyan-300'}">${r.priority}</span></div>`).join('')}</div></div><div class="bg-slate-900 border border-slate-800 rounded-2xl p-5"><h3 class="font-black text-white">BA Deliverables</h3><div class="mt-4 grid grid-cols-2 gap-3">${card('Process Maps',12,'8 approved','fa-diagram-project','blue')}${card('Business Rules',24,'21 active','fa-scale-balanced','violet')}${card('Stakeholders',e.stakeholders.length,'mapped owners','fa-users','cyan')}${card('Open CR',e.changes.filter(x=>x.status!=='APPROVED').length,'impact analysis','fa-code-compare','amber')}</div></div></div>`;
                    if(view==='requirements') body=hero('Requirement Management','Functional, non-functional, business owner, priority, release dan test coverage')+table(['ID','Title','Type','Domain','Priority','Owner','Status','Release','Test'],e.requirements.map(r=>[`<b class="text-cyan-300">${r.id}</b>`,r.title,r.type,r.domain,`<b>${r.priority}</b>`,r.owner,r.status,r.release,r.coverage]));
                    if(view==='process') body=hero('Business Process & Rules','End-to-end process model dari shipment arrival sampai Gate Out')+`<div class="grid lg:grid-cols-7 gap-2 items-stretch">${['Shipment Arrival','Gate In','RFID Detection','Document Verification','Customs Review','Release Validation','Gate Out'].map((x,i)=>`<div class="bg-slate-900 border border-slate-800 rounded-xl p-4 text-center"><div class="text-[9px] text-cyan-400 font-black">STEP ${String(i+1).padStart(2,'0')}</div><div class="text-xs text-white font-black mt-2">${x}</div><div class="text-[9px] text-slate-500 mt-2">Owner: ${['Gate','Gate','Security','Document','Customs','Operations','Gate'][i]}</div></div>`).join('')}</div><div class="mt-4 bg-slate-900 border border-slate-800 rounded-2xl p-5"><h3 class="font-black text-white">Gate Out Business Rule</h3><div class="mt-3 grid md:grid-cols-4 gap-3">${['Customs = CLEARED','E-Seal = RELEASED','RFID = DETECTED','Gate Authorization = VALID'].map(x=>`<div class="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-emerald-300 font-bold">✓ ${x}</div>`).join('')}</div></div>`;
                    if(view==='change') body=hero('Change Request','Impact analysis, estimated cost, affected modules dan approval lifecycle')+table(['ID','Request','Requester','Priority','Impact','Est. Cost','Status'],e.changes.map(c=>[c.id,c.title,c.requester,c.priority,c.impact,money(c.cost),`<button onclick="app.approveEnterpriseChange('${c.id}')" class="px-2 py-1 rounded bg-blue-700 text-white text-[9px] font-bold">${c.status}</button>`]));
                    if(view==='traceability') body=hero('Requirement Traceability Matrix','Hubungan Requirement → Process → Feature → Test Case → Defect')+table(['Requirement','Process','Feature','Test Case','Result','Defect','Release'],e.requirements.map(r=>{const t=e.tests.find(x=>x.req===r.id);const d=e.defects.find(x=>x.req===r.id);return [r.id,'PROC-'+r.domain.replace(/\s/g,'-').toUpperCase(),'FEAT-'+r.id.slice(-3),t?.id||'-',t?.status||'NOT LINKED',d?d.id+' / '+d.status:'NONE',r.release]}));
                    if(view==='stakeholders') body=hero('Stakeholder & Responsibility','Business owner, responsible function dan accountability matrix')+table(['Role','Domain','Ownership','RACI Level'],e.stakeholders.map(x=>[x.role,x.domain,x.owner,x.level]));
                    if(view==='qa') body=hero('Quality Assurance Dashboard','Quality health, test coverage, defect severity dan UAT readiness')+`<div class="grid grid-cols-2 lg:grid-cols-6 gap-3">${card('Test Cases',186,'all suites','fa-vial','cyan')}${card('Passed',151,'85.4% pass rate','fa-circle-check','emerald')}${card('Failed',18,'requires action','fa-circle-xmark','red')}${card('Blocked',9,'dependency blocked','fa-ban','amber')}${card('Critical Bugs',e.defects.filter(x=>x.severity==='CRITICAL').length,'open/fixed lifecycle','fa-bug','red')}${card('UAT Readiness','91%','release confidence','fa-user-check','violet')}</div><div class="mt-4 bg-slate-900 border border-slate-800 rounded-2xl p-5"><h3 class="font-black text-white">Quality Gate</h3><div class="grid md:grid-cols-4 gap-3 mt-4">${['Requirement Coverage 92%','Test Coverage 88%','Regression 94%','UAT 91%'].map(x=>`<div class="p-4 rounded-xl bg-slate-950 border border-slate-800 text-sm font-black text-cyan-300">${x}</div>`).join('')}</div></div>`;
                    if(['testcases','execution','regression'].includes(view)) body=hero(view==='testcases'?'Test Case Management':view==='execution'?'Test Execution':'Regression Testing','Test suite, execution status, evidence dan release confidence')+table(['Test ID','Requirement','Scenario','Tester','Status','Severity'],e.tests.map(t=>[t.id,t.req,t.scenario,t.tester,`<b class="${t.status==='PASS'?'text-emerald-300':t.status==='FAIL'?'text-red-300':'text-amber-300'}">${t.status}</b>`,t.severity]));
                    if(view==='defects') body=hero('Defect / Bug Management','Severity, priority, owner, lifecycle dan requirement linkage')+table(['Bug','Title','Severity','Priority','Status','Requirement','Owner'],e.defects.map(d=>[d.id,d.title,d.severity,d.priority,d.status,d.req,d.owner]));
                    if(view==='uat') body=hero('User Acceptance Testing','Business acceptance sebelum release produksi')+`<div class="grid lg:grid-cols-3 gap-4">${card('UAT Scope',24,'business scenarios','fa-list-check','cyan')}${card('Accepted',21,'87.5%','fa-circle-check','emerald')}${card('Pending',3,'needs sign-off','fa-user-clock','amber')}</div><div class="mt-4 bg-slate-900 border border-slate-800 rounded-2xl p-5"><h3 class="text-white font-black">Acceptance Criteria</h3><div class="mt-3 space-y-2">${['Gate release respects Customs HOLD','Maintenance due notification is delivered','Critical defect cannot pass UAT','Cost dashboard matches approved budget'].map((x,i)=>`<div class="p-3 rounded-lg bg-slate-950 border border-slate-800 flex justify-between"><span class="text-xs text-slate-300">${x}</span><b class="text-[9px] ${i===2?'text-amber-300':'text-emerald-300'}">${i===2?'PENDING':'ACCEPTED'}</b></div>`).join('')}</div></div>`;
                    if(view==='assets') body=hero('Asset & Equipment Dashboard','Health, availability, operating hours, downtime dan maintenance exposure')+`<div class="grid grid-cols-2 lg:grid-cols-5 gap-3">${card('Assets',e.assets.length,'registered equipment','fa-industry','cyan')}${card('Operational',e.assets.filter(a=>a.status==='OPERATIONAL').length,'ready for operation','fa-circle-check','emerald')}${card('Maintenance',e.assets.filter(a=>a.status==='MAINTENANCE').length,'currently serviced','fa-screwdriver-wrench','amber')}${card('Warning',e.assets.filter(a=>a.status==='WARNING').length,'needs attention','fa-triangle-exclamation','red')}${card('Avg Health',Math.round(e.assets.reduce((a,x)=>a+x.health,0)/e.assets.length)+'%','fleet health','fa-heart-pulse','violet')}</div><div class="mt-4 grid lg:grid-cols-2 gap-4">${e.assets.map(a=>`<div class="bg-slate-900 border border-slate-800 rounded-2xl p-4"><div class="flex justify-between"><div><b class="text-white">${a.id} · ${a.name}</b><div class="text-[9px] text-slate-500 mt-1">${a.type}</div></div>${pill(a.status,a.status==='OPERATIONAL'?'emerald':a.status==='WARNING'?'amber':'red')}</div><div class="mt-4 text-[9px] text-slate-500">HEALTH ${a.health}%</div><div class="h-2 bg-slate-800 rounded-full mt-1 overflow-hidden"><div class="h-full bg-cyan-500" style="width:${a.health}%"></div></div><div class="grid grid-cols-3 gap-2 mt-3 text-[10px]"><div><span class="text-slate-500">Hours</span><b class="block text-white">${a.hours}</b></div><div><span class="text-slate-500">Downtime</span><b class="block text-white">${a.downtime}h</b></div><div><span class="text-slate-500">YTD Cost</span><b class="block text-white">${money(a.cost)}</b></div></div></div>`).join('')}</div>`;
                    if(view==='assetregister') body=hero('Asset Register','Master data equipment dan lifecycle')+table(['Asset','Equipment','Type','Status','Health','Operating Hours','Next PM','Cost YTD'],e.assets.map(a=>[a.id,a.name,a.type,a.status,a.health+'%',a.hours,a.next,money(a.cost)]));
                    if(view==='maintenance') body=hero('Maintenance Schedule','Preventive maintenance calendar dan compliance')+table(['WO','Asset','Type','Issue / Scope','Priority','Status','Cost','Schedule'],e.workorders.map(w=>[w.id,w.asset,w.type,w.issue,w.priority,w.status,money(w.cost),w.eta]));
                    if(view==='workorders') body=hero('Work Orders','Corrective & preventive maintenance jobs')+table(['WO','Asset','Issue','Type','Priority','Status','Estimated Cost','ETA'],e.workorders.map(w=>[w.id,w.asset,w.issue,w.type,w.priority,`<button onclick="app.progressWorkOrder('${w.id}')" class="px-2 py-1 rounded bg-slate-800 text-white text-[9px]">${w.status}</button>`,money(w.cost),w.eta]));
                    if(view==='spares') body=hero('Spare Parts Inventory','Stock, minimum level, reserved quantity dan reorder signal')+table(['Part','Stock','Minimum','Reserved','Available','Status','Action'],e.spareParts.map(x=>[x.part,x.stock,x.min,x.reserved,x.stock-x.reserved,`<b class="${x.status==='OUT OF STOCK'?'text-red-300':x.status==='LOW STOCK'?'text-amber-300':'text-emerald-300'}">${x.status}</b>`,x.stock<x.min?'REORDER':'NORMAL']));
                    if(view==='maintenancecost') body=hero('Maintenance Cost','Biaya labor, spare part, vendor dan downtime')+`<div class="grid grid-cols-2 lg:grid-cols-4 gap-3">${card('Maintenance YTD',money(142250000),'simulated OPEX','fa-screwdriver-wrench','amber')}${card('Labor',money(45000000),'technician cost','fa-user-gear','cyan')}${card('Spare Parts',money(58750000),'parts consumed','fa-box-open','violet')}${card('Vendor',money(38500000),'external service','fa-handshake','blue')}</div><div class="mt-4 bg-slate-900 border border-slate-800 rounded-2xl p-5">${table(['Asset','Maintenance YTD','Operating Hours','Cost / Hour','Downtime'],e.assets.map(a=>[a.id,money(a.cost),a.hours,money(Math.round(a.cost/a.hours)),a.downtime+' h']))}</div>`;
                    if(view==='finance') body=hero('Finance & Cost Dashboard','Budget vs actual, OPEX, CAPEX, vendor spend dan maintenance exposure')+`<div class="grid grid-cols-2 lg:grid-cols-5 gap-3">${card('Budget',money(e.costs.budget),'monthly allocation','fa-wallet','cyan')}${card('Actual',money(e.costs.actual),pct(e.costs.actual,e.costs.budget)+'% utilized','fa-receipt','amber')}${card('Remaining',money(e.costs.budget-e.costs.actual),'available budget','fa-piggy-bank','emerald')}${card('Maintenance',money(e.costs.maintenance),'maintenance OPEX','fa-screwdriver-wrench','violet')}${card('CAPEX YTD',money(9200000000),'simulated investment','fa-building','blue')}</div><div class="mt-4 bg-slate-900 border border-slate-800 rounded-2xl p-5">${table(['Cost Center','Actual','% of Total','Status'],[['Maintenance',money(e.costs.maintenance),pct(e.costs.maintenance,e.costs.actual)+'%','MONITORED'],['Operations',money(e.costs.operations),pct(e.costs.operations,e.costs.actual)+'%','NORMAL'],['Utilities',money(e.costs.utilities),pct(e.costs.utilities,e.costs.actual)+'%','NORMAL'],['Vendor',money(e.costs.vendor),pct(e.costs.vendor,e.costs.actual)+'%','MONITORED'],['Other',money(e.costs.other),pct(e.costs.other,e.costs.actual)+'%','NORMAL']])}</div>`;
                    if(view==='budget') body=hero('Budget Control','Allocation, utilization, variance dan threshold alert')+table(['Category','Budget','Actual','Variance','Utilization'],[['Operations',money(220000000),money(e.costs.operations),money(220000000-e.costs.operations),pct(e.costs.operations,220000000)+'%'],['Maintenance',money(160000000),money(e.costs.maintenance),money(160000000-e.costs.maintenance),pct(e.costs.maintenance,160000000)+'%'],['Utilities',money(70000000),money(e.costs.utilities),money(70000000-e.costs.utilities),pct(e.costs.utilities,70000000)+'%'],['Other',money(50000000),money(e.costs.other),money(50000000-e.costs.other),pct(e.costs.other,50000000)+'%']]);
                    if(view==='opex') body=hero('OPEX','Operating expenditure including maintenance, utilities, vendor and operations')+table(['Category','Monthly Actual','YTD Projection','Owner','Control'],[['Operations',money(e.costs.operations),money(e.costs.operations*12),'Operations Manager','NORMAL'],['Maintenance',money(e.costs.maintenance),money(e.costs.maintenance*12),'Maintenance Manager','MONITORED'],['Utilities',money(e.costs.utilities),money(e.costs.utilities*12),'Facility Manager','NORMAL'],['Vendor',money(e.costs.vendor),money(e.costs.vendor*12),'Procurement','MONITORED']]);
                    if(view==='capex') body=hero('CAPEX','Asset investment, business case dan lifecycle value')+table(['Project','Asset','Investment','Status','Owner','Expected Benefit'],[['CAPEX-026','RTG Replacement',money(6500000000),'APPROVED','Asset Manager','Availability +8%'],['CAPEX-027','Gate Barrier Upgrade',money(850000000),'PROPOSED','Operations','Gate safety'],['CAPEX-028','RFID Expansion',money(1900000000),'PLANNED','Security','Detection coverage']]);
                    if(view==='vendors') body=hero('Vendor & Purchase Order','Supplier performance, contract, PO value dan SLA')+table(['Vendor','Service','Active PO','YTD Spend','Performance','Contract'],[['PT ABC ENGINEERING','Crane Maintenance','3',money(420500000),'92%','ACTIVE'],['PT LOGISTICS PARTS','Spare Parts','5',money(285000000),'89%','ACTIVE'],['PT SECURE SYSTEMS','RFID / E-Seal','2',money(175000000),'96%','ACTIVE']]);
                    if(view==='costallocation') body=hero('Cost Allocation','Mapping biaya ke cost center, asset dan business process')+table(['Cost Center','Driver','Allocated Cost','Owner','Business Impact'],[['CC-OPS','Container throughput',money(e.costs.operations),'Operations','Service delivery'],['CC-MNT','Equipment hours',money(e.costs.maintenance),'Maintenance','Asset availability'],['CC-FAC','Energy consumption',money(e.costs.utilities),'Facility','Infrastructure'],['CC-VND','PO / service',money(e.costs.vendor),'Procurement','External services']]);
                    if(view==='risk') body=hero('Risk Register','Probability, impact, score, mitigation dan owner')+table(['Risk','Description','Probability','Impact','Score','Mitigation','Owner','Status'],e.risks.map(r=>[r.id,r.risk,r.prob,r.impact,`<b class="${r.score>=15?'text-red-300':r.score>=10?'text-amber-300':'text-emerald-300'}">${r.score}/25</b>`,r.mitigation,r.owner,r.status]));
                    if(view==='compliance') body=hero('Compliance Control','Control checklist untuk operasi, quality, asset dan finance')+table(['Control','Domain','Owner','Frequency','Evidence','Status'],[['CTRL-001','Gate Release','Operations','Per Transaction','Gate authorization log','COMPLIANT'],['CTRL-002','Maintenance PM','Asset','Monthly','Maintenance work order','COMPLIANT'],['CTRL-003','QA Critical Defect','QA','Per Release','Test evidence','MONITORED'],['CTRL-004','Budget Approval','Finance','Monthly','Budget approval record','COMPLIANT']]);
                    if(view==='findings') body=hero('Audit Findings','Temuan audit, evidence, owner dan due date')+table(['Finding','Area','Severity','Finding','Owner','Due','Status'],[['FND-026','Maintenance','HIGH','PM overdue on RTG-003','Maintenance Manager','10 Oct 2026','OPEN'],['FND-027','QA','MEDIUM','Retest evidence incomplete','QA Lead','09 Oct 2026','IN PROGRESS'],['FND-028','Finance','LOW','Vendor cost allocation late','Finance Manager','12 Oct 2026','OPEN']]);
                    if(view==='corrective') body=hero('Corrective Action / CAPA','Root cause, corrective action, owner, due date dan verification')+table(['CAPA','Finding','Root Cause','Action','Owner','Due','Status'],[['CAPA-011','FND-026','Schedule not synchronized','Fix PM calendar + notification','Maintenance Manager','10 Oct 2026','IN PROGRESS'],['CAPA-012','FND-027','Evidence rule missing','Enforce retest attachment','QA Lead','09 Oct 2026','IN PROGRESS']]);
                    if(view==='notifications') body=hero('Notification Center','Critical alerts dari operations, QA, maintenance, finance dan risk')+`<div class="space-y-2">${e.notifications.map(n=>`<div class="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-3"><div class="w-2 h-2 rounded-full mt-2 ${n.sev==='CRITICAL'?'bg-red-500':n.sev==='HIGH'?'bg-orange-400':n.sev==='WARNING'?'bg-amber-400':'bg-cyan-400'}"></div><div class="flex-1"><div class="flex justify-between gap-2"><b class="text-xs text-white">${n.title}</b><span class="text-[9px] text-slate-500">${n.time}</span></div><div class="text-[10px] text-slate-400 mt-1">${n.detail}</div></div><span class="text-[9px] font-black">${n.sev}</span></div>`).join('')}</div>`;
                    if(view==='management') body=hero('Management Overview','Executive view: operations + BA + QA + asset + finance + risk')+`<div class="grid grid-cols-2 lg:grid-cols-6 gap-3">${card('Operations','94%','service health','fa-tower-broadcast','cyan')}${card('Equipment','97%','availability','fa-industry','emerald')}${card('QA','91%','UAT readiness','fa-vial','violet')}${card('BA','92%','traceability','fa-briefcase','blue')}${card('Budget',pct(e.costs.actual,e.costs.budget)+'%','utilization','fa-coins','amber')}${card('Open Risk',e.risks.filter(r=>r.status==='OPEN').length,'requires action','fa-triangle-exclamation','red')}</div><div class="mt-4 grid lg:grid-cols-2 gap-4"><div class="bg-slate-900 border border-slate-800 rounded-2xl p-5"><h3 class="text-white font-black">Executive Alerts</h3><div class="mt-3 space-y-2">${e.notifications.slice(0,3).map(n=>`<div class="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs"><b class="text-white">${n.sev}</b> <span class="text-slate-300">${n.title}</span><div class="text-[10px] text-slate-500 mt-1">${n.detail}</div></div>`).join('')}</div></div><div class="bg-slate-900 border border-slate-800 rounded-2xl p-5"><h3 class="text-white font-black">Management Focus</h3><div class="mt-3 grid grid-cols-2 gap-3">${card('Maintenance Cost',money(e.costs.maintenance),'monthly simulated','fa-screwdriver-wrench','amber')}${card('Open Defects',e.defects.filter(d=>d.status!=='CLOSED').length,'QA action queue','fa-bug','red')}${card('Open Risks',e.risks.filter(r=>r.status==='OPEN').length,'risk register','fa-shield','red')}${card('Change Requests',e.changes.length,'portfolio','fa-code-compare','violet')}</div></div></div>`;
                }
                const detailTitle = ({
                    control:'Live operational status', containers:'Manifest & cargo identity', gate:'Gate authorization matrix',
                    yard:'Yard occupancy & storage zones', eseal:'Electronic seal telemetry', rfid:'Reader & scan activity',
                    alerts:'Security & exception rules', customs:'Customs decision workflow', documents:'Document completeness',
                    ceisa:'Government-system integration', wms:'Warehouse inventory control', api:'Integration transaction monitor',
                    audit:'Traceable operational evidence', outboundflow:'Outbound consolidation, customs clearance, sealing & gate-out', ba:'Business analysis overview', requirements:'Requirement register', process:'Business process & rules', change:'Change request portfolio', traceability:'Requirement traceability matrix', stakeholders:'Stakeholder responsibility', qa:'Quality assurance overview', testcases:'Test case management', execution:'Test execution', defects:'Defect lifecycle', uat:'User acceptance testing', regression:'Regression readiness', assets:'Asset & equipment health', assetregister:'Asset register', maintenance:'Preventive maintenance schedule', workorders:'Maintenance work orders', spares:'Spare parts inventory', maintenancecost:'Maintenance cost analysis', finance:'Finance & cost overview', budget:'Budget control', opex:'Operating expenditure', capex:'Capital expenditure', vendors:'Vendor & purchase order', costallocation:'Cost allocation', risk:'Risk register', compliance:'Compliance controls', findings:'Audit findings', corrective:'Corrective action / CAPA', notifications:'Enterprise notification center', management:'Executive management overview'
                })[view] || '3D operational environment';
                const detailPanel = view === 'simulasi' ? '' : `<div class="mt-4 flex flex-wrap items-center justify-between gap-3 bg-slate-900/80 border border-slate-800 rounded-xl p-3"><div class="text-[9px] uppercase tracking-widest text-slate-500 font-black">Operational Context</div><div class="flex flex-wrap items-center gap-2"><select onchange="app.setActiveRole(this.value)" class="bg-slate-950 border border-slate-800 rounded-lg px-2 py-1.5 text-[10px] text-slate-300">${this.phase5.roles.map(r=>`<option ${r===this.phase5.activeRole?'selected':''}>${r}</option>`).join('')}</select><button onclick="app.refreshControlTower()" class="px-2 py-1.5 rounded-lg bg-slate-800 text-[10px] text-white font-bold"><i class="fa-solid fa-rotate mr-1"></i>Refresh</button></div></div><div class="mt-4 grid md:grid-cols-3 gap-3">
                    <div class="bg-slate-900/90 border border-slate-800 rounded-2xl p-4">
                        <div class="flex items-center justify-between"><span class="text-[10px] uppercase tracking-widest font-black text-slate-500">Current Shipment</span><i class="fa-solid fa-truck-fast text-cyan-400"></i></div>
                        <div class="mt-3 font-mono text-sm font-black text-white">${d.plate}</div>
                        <div class="text-[10px] text-slate-500 mt-1">${d.sscc} • ${d.doc}</div>
                        <div class="mt-3 flex flex-wrap gap-2">${pill(cleared, cleared==='CLEARED'?'emerald':'amber')}${pill(lock,lock==='UNLOCKED'?'emerald':lock==='TAMPER'?'red':'rose')}</div>
                    </div>
                    <div class="bg-slate-900/90 border border-slate-800 rounded-2xl p-4">
                        <div class="text-[10px] uppercase tracking-widest font-black text-slate-500">${detailTitle}</div>
                        <div class="grid grid-cols-2 gap-2 mt-3 text-[11px]">
                            <div class="bg-slate-950 rounded-lg p-2"><span class="text-slate-500">RFID</span><b class="block text-violet-300 mt-1">${s.isArrived?'DETECTED':'STANDBY'}</b></div>
                            <div class="bg-slate-950 rounded-lg p-2"><span class="text-slate-500">WMS</span><b class="block text-cyan-300 mt-1">SYNCED</b></div>
                            <div class="bg-slate-950 rounded-lg p-2"><span class="text-slate-500">CEISA</span><b class="block text-emerald-300 mt-1">${s.ceisaLastSync?'RESPONSE':'READY'}</b></div>
                            <div class="bg-slate-950 rounded-lg p-2"><span class="text-slate-500">Gate</span><b class="block text-amber-300 mt-1">${gate02}</b></div>
                        </div>
                    </div>
                    <div class="bg-slate-900/90 border border-slate-800 rounded-2xl p-4">
                        <div class="text-[10px] uppercase tracking-widest font-black text-slate-500">Quick Actions</div>
                        <div class="grid grid-cols-2 gap-2 mt-3">
                            <button onclick="app.openOps('containers')" class="p-2 rounded-lg bg-slate-950 hover:bg-slate-800 text-[10px] font-bold text-white">Manifest</button>
                            <button onclick="app.openOps('customs')" class="p-2 rounded-lg bg-slate-950 hover:bg-slate-800 text-[10px] font-bold text-white">Clearance</button>
                            <button onclick="app.openOps('eseal')" class="p-2 rounded-lg bg-slate-950 hover:bg-slate-800 text-[10px] font-bold text-white">E-Seal</button>
                            <button onclick="app.openOps('simulasi')" class="p-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-[10px] font-bold text-white">3D View</button>
                        </div>
                    </div>
                </div>`;
                el.innerHTML = `<div class="mb-5"><div class="flex items-center justify-between gap-4"><div><div class="text-[10px] text-blue-400 font-black uppercase tracking-widest">PLB / KEPABEANAN</div><h1 class="text-2xl font-black text-white mt-1">${({control:'Control Tower',containers:'Container Management',gate:'Truck & Gate',yard:'Yard Management',eseal:'E-Seal Monitoring',rfid:'RFID Scanner',alerts:'Alert Center',customs:'Customs Clearance',documents:'Document Verification',ceisa:'CEISA Connection',wms:'WMS / PLB',api:'API / EDI Monitor',audit:'Audit Trail', outboundflow:'Outbound Customs Flow'})[view]||'Operations'}</h1><p class="text-[11px] text-slate-500 mt-1">${detailTitle}</p></div><div class="text-right shrink-0">${pill('LIVE SYSTEM','emerald')}<div class="text-[10px] text-slate-500 mt-1">${new Date().toLocaleTimeString('id-ID')} WIB</div></div></div></div>${body}${detailPanel}`;
                if (view === 'containers') this.renderContainerTable();
            },

            renderContainerTable(filter='') {
                const el=document.getElementById('ops-container-table'); if(!el)return;
                const rows=Object.values(this.cases).map(c=>[c.containerNo,c.esealId,c.truckPlate,this.caseStatusLabel(c.customsStatus),c.yardLocation]);
                const f=filter.toLowerCase(); const data=rows.filter(r=>r.join(' ').toLowerCase().includes(f));
                el.innerHTML=`<table class="w-full min-w-[680px] text-left text-xs"><thead><tr class="text-slate-500 border-b border-slate-800"><th class="p-3">Container</th><th class="p-3">E-Seal</th><th class="p-3">Truck</th><th class="p-3">Status</th><th class="p-3">Location</th><th class="p-3">Action</th></tr></thead><tbody>${data.map(r=>`<tr class="border-b border-slate-800/60"><td class="p-3 font-bold text-white">${r[0]}</td><td class="p-3 font-mono text-cyan-300">${r[1]}</td><td class="p-3 text-slate-300">${r[2]}</td><td class="p-3"><span class="text-${r[3]==='CLEARED'?'emerald':'amber'}-400 font-black">${r[3]}</span></td><td class="p-3 text-slate-300">${r[4]}</td><td class="p-3"><button onclick="app.focusContainer('${r[0]}')" class="px-2 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white font-bold">CASE</button></td></tr>`).join('')}</tbody></table>`;
            },

            getCase(id='MSCU1234567'){
                return this.cases[id] || this.cases["MSCU1234567"];
            },

            syncCaseToDB(id){
                const c = this.getCase(id);
                if (!c) return;
                fetch('api.php?action=update_case', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(c)
                }).catch(err => console.warn('Case DB sync error:', err));
            },

            caseStatusLabel(status){
                return ({
                    UNDER_REVIEW:'UNDER REVIEW',
                    CLEARED:'CLEARED',
                    HOLD:'CUSTOMS HOLD',
                    INSPECTION:'INSPECTION',
                    SUBMITTED:'SUBMITTED',
                    DRAFT:'DRAFT'
                })[status] || status;
            },

            caseStatusClass(status){
                return status === 'CLEARED' ? 'emerald' : (status === 'HOLD' ? 'red' : (status === 'INSPECTION' ? 'amber' : 'blue'));
            },

            openCase(id){
                const c = this.getCase(id);
                this.activeCaseId = c.containerNo;
                this.renderCaseModal(c);
                const modal = document.getElementById('modal-case');
                if(modal) modal.classList.remove('hidden');
                this.log('Shipment Case dibuka: '+c.containerNo,'action');
            },

            customsStages(){
                return [
                    {key:'DRAFT',label:'Draft',icon:'fa-file'},
                    {key:'SUBMITTED',label:'Submitted',icon:'fa-paper-plane'},
                    {key:'UNDER_REVIEW',label:'Under Review',icon:'fa-magnifying-glass'},
                    {key:'INSPECTION',label:'Inspection',icon:'fa-box-open'},
                    {key:'APPROVED',label:'Approved',icon:'fa-circle-check'},
                    {key:'CLEARED',label:'Cleared',icon:'fa-shield-check'}
                ];
            },

            documentLabel(key){
                return ({
                    commercialInvoice:'Commercial Invoice',
                    packingList:'Packing List',
                    billOfLading:'Bill of Lading',
                    customsDeclaration:'BC / Customs Declaration',
                    certificateOfOrigin:'Certificate of Origin',
                    deliveryOrder:'Delivery Order'
                })[key] || key;
            },

            caseDocumentSummary(c){
                const values = Object.values(c.documents || {});
                return {
                    total: values.length,
                    verified: values.filter(v=>v==='VERIFIED').length,
                    review: values.filter(v=>v==='REVIEW').length,
                    missing: values.filter(v=>v==='MISSING').length
                };
            },

            allDocumentsVerified(c){
                const d = this.caseDocumentSummary(c);
                return d.total > 0 && d.verified === d.total;
            },

            setCaseDocument(id,key,status){
                const c=this.getCase(id);
                if(!c || !c.documents || !(key in c.documents)) return;
                c.documents[key]=status;
                c.timeline.unshift({
                    time:new Date().toLocaleTimeString('id-ID',{hour12:false}),
                    actor:'DOCUMENT OFFICER',
                    event:this.documentLabel(key)+' → '+status,
                    status:status==='VERIFIED'?'DONE':'ACTIVE'
                });
                this.log(`${this.documentLabel(key)} untuk ${c.containerNo} → ${status}`,'action');
                this.syncCaseToDB(c.containerNo);
                this.renderOpsPanel('documents');
                if(this.activeCaseId===c.containerNo) this.renderCaseModal(c);
            },

            verifyCaseDocuments(id){
                const c=this.getCase(id);
                if(!c) return;
                Object.keys(c.documents || {}).forEach(k=>{
                    if(c.documents[k] !== 'MISSING') c.documents[k]='VERIFIED';
                });
                c.customsStage = 'APPROVED';
                c.customsStageIndex = 5;
                c.customsStatus = 'APPROVED';
                c.timeline.unshift({
                    time:new Date().toLocaleTimeString('id-ID',{hour12:false}),
                    actor:'CUSTOMS OFFICER',
                    event:'Document set verified — clearance eligible',
                    status:'DONE'
                });
                this.log('Document set '+c.containerNo+' diverifikasi. Clearance eligible.','res');
                this.syncCaseToDB(c.containerNo);
                this.renderOpsPanel('documents');
                if(this.activeCaseId===c.containerNo) this.renderCaseModal(c);
            },

            submitCustomsCase(id){
                const c=this.getCase(id);
                if(!c) return;
                const docs=this.caseDocumentSummary(c);
                if(docs.missing){
                    c.customsStatus='HOLD';
                    c.customsStage='HOLD';
                    c.customsStageIndex=4;
                    c.gateStatus='BLOCKED';
                    c.alerts=[{type:'DOCUMENT INCOMPLETE',severity:'HIGH',text:`${docs.missing} document(s) missing. Clearance blocked.`}];
                    this.log(`Customs ${c.containerNo} ditahan: dokumen belum lengkap.`,'warn');
                }else{
                    c.customsStatus='SUBMITTED';
                    c.customsStage='SUBMITTED';
                    c.customsStageIndex=1;
                    c.timeline.unshift({
                        time:new Date().toLocaleTimeString('id-ID',{hour12:false}),
                        actor:'CUSTOMS OPERATOR',
                        event:'Customs declaration submitted for review',
                        status:'DONE'
                    });
                    this.log(`Customs declaration ${c.containerNo} submitted.`,'action');
                }
                this.syncCaseToDB(c.containerNo);
                this.renderOpsPanel('customs');
                if(this.activeCaseId===c.containerNo) this.renderCaseModal(c);
            },

            advanceCustomsCase(id){
                const c=this.getCase(id);
                if(!c) return;
                const docs=this.caseDocumentSummary(c);
                if(docs.missing){
                    c.customsStatus='HOLD';
                    c.customsStage='HOLD';
                    c.customsStageIndex=4;
                    c.gateStatus='BLOCKED';
                    c.alerts=[{type:'DOCUMENT INCOMPLETE',severity:'HIGH',text:`${docs.missing} document(s) missing. Clearance cannot advance.`}];
                    this.log(`Customs ${c.containerNo} tidak dapat maju: dokumen belum lengkap.`,'warn');
                    this.syncCaseToDB(c.containerNo);
                    this.renderOpsPanel('customs');
                    if(this.activeCaseId===c.containerNo) this.renderCaseModal(c);
                    return;
                }

                const stages=this.customsStages();
                const current=Math.max(0,Number(c.customsStageIndex ?? 0));
                const next=Math.min(current+1, stages.length-1);
                c.customsStageIndex=next;
                c.customsStage=stages[next].key;
                c.customsStatus=next>=5?'CLEARED':(next===4?'APPROVED':stages[next].key);

                if(next===5){
                    c.gateStatus='RELEASE_READY';
                    c.esealStatus='RELEASED';
                    c.alerts=[];
                }

                c.timeline.unshift({
                    time:new Date().toLocaleTimeString('id-ID',{hour12:false}),
                    actor:'CUSTOMS OFFICER',
                    event:'Customs stage → '+stages[next].label,
                    status:next===5?'DONE':'ACTIVE'
                });
                this.log(`Customs ${c.containerNo} → ${stages[next].label}`,'res');
                this.syncCaseToDB(c.containerNo);
                this.renderOpsPanel('customs');
                if(this.activeCaseId===c.containerNo) this.renderCaseModal(c);
            },

            openDocumentVerification(id){
                if(id) this.activeCaseId=id;
                this.openOps('documents');
            },

            renderCaseModal(c){
                const modal = document.getElementById('modal-case');
                if(!modal) return;
                const docEntries = [
                    ['Commercial Invoice',c.documents.commercialInvoice],
                    ['Packing List',c.documents.packingList],
                    ['Bill of Lading',c.documents.billOfLading],
                    ['BC / Customs Declaration',c.documents.customsDeclaration],
                    ['Certificate of Origin',c.documents.certificateOfOrigin],
                    ['Delivery Order',c.documents.deliveryOrder]
                ];
                const docs = docEntries.map(([name,status]) => {
                    const good = status === 'VERIFIED';
                    const missing = status === 'MISSING';
                    const cls = good ? 'emerald' : (missing ? 'red' : 'amber');
                    const icon = good ? 'fa-circle-check' : (missing ? 'fa-circle-xmark' : 'fa-clock');
                    return `<div class="flex items-center justify-between p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                        <span class="text-slate-300">${name}</span>
                        <span class="text-${cls}-400 font-bold flex items-center gap-1.5"><i class="fa-solid ${icon}"></i>${status}</span>
                    </div>`;
                }).join('');

                const timeline = c.timeline.map(x => `
                    <div class="relative pl-7 pb-4">
                        <div class="absolute left-0 top-1.5 w-3 h-3 rounded-full ${x.status==='ACTIVE'?'bg-blue-400 ring-4 ring-blue-400/10':'bg-emerald-400'}"></div>
                        <div class="flex justify-between gap-3">
                            <div><b class="text-white">${x.event}</b><div class="text-[10px] text-slate-500 mt-0.5">${x.actor}</div></div>
                            <span class="font-mono text-[10px] text-slate-500">${x.time}</span>
                        </div>
                    </div>`).join('');

                modal.querySelector('[data-case-body]').innerHTML = `
                    <div class="grid xl:grid-cols-3 gap-4">
                        <div class="xl:col-span-2 space-y-4">
                            <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                                ${this.caseField('Shipment ID',c.shipmentId)}
                                ${this.caseField('Container',c.containerNo,true)}
                                ${this.caseField('BL Number',c.blNumber,true)}
                                ${this.caseField('Truck',c.truckPlate,true)}
                                ${this.caseField('Importer',c.importer)}
                                ${this.caseField('Origin / Destination',c.origin+' → '+c.destination)}
                                ${this.caseField('Cargo / HS',c.cargo+' / '+c.hsCode)}
                                ${this.caseField('Gross Weight',Number(c.grossWeight).toLocaleString('id-ID')+' kg')}
                            </div>

                            <div class="bg-slate-900 border border-slate-800 rounded-xl p-4">
                                <div class="flex justify-between items-center">
                                    <h4 class="text-sm font-black text-white">Operational Identity</h4>
                                    <span class="text-[10px] text-slate-500">Single Source of Truth</span>
                                </div>
                                <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-2 mt-3 text-[11px]">
                                    ${this.caseChip('Customs',this.caseStatusLabel(c.customsStatus),this.caseStatusClass(c.customsStatus))}
                                    ${this.caseChip('Gate',c.gateStatus,'cyan')}
                                    ${this.caseChip('Yard',c.yardLocation,'violet')}
                                    ${this.caseChip('RFID',c.rfidStatus,'violet')}
                                    ${this.caseChip('E-Seal',c.esealStatus,'emerald')}
                                    ${this.caseChip('E-Seal ID',c.esealId,'cyan')}
                                    ${this.caseChip('BC Document',c.customsDocument,'blue')}
                                    ${this.caseChip('Alerts',String(c.alerts.length),c.alerts.length?'red':'emerald')}
                                </div>
                            </div>

                            <div class="bg-slate-900 border border-slate-800 rounded-xl p-4">
                                <div class="flex justify-between items-center">
                                    <h4 class="text-sm font-black text-white">Document Completeness</h4>
                                    <button onclick="app.openDocumentVerification('${c.containerNo}')" class="px-2.5 py-1.5 rounded-lg bg-blue-600 text-white text-[10px] font-bold">Open Verification</button>
                                </div>
                                <div class="grid md:grid-cols-2 gap-2 mt-3">${docs}</div>
                            </div>
                        </div>

                        <div class="bg-slate-900 border border-slate-800 rounded-xl p-4">
                            <div class="flex justify-between items-center">
                                <h4 class="text-sm font-black text-white">Activity Timeline</h4>
                                <span class="text-[10px] text-slate-500">${c.timeline.length} events</span>
                            </div>
                            <div class="mt-4 border-l border-slate-800 ml-1 pl-3">${timeline}</div>
                        </div>
                    </div>
                    <div class="mt-4 flex flex-wrap gap-2">
                        <button onclick="app.openOps('customs')" class="px-3 py-2 rounded-lg bg-blue-600 text-white text-[10px] font-black">OPEN CUSTOMS WORKFLOW</button>
                        <button onclick="app.openDocumentVerification('${c.containerNo}')" class="px-3 py-2 rounded-lg bg-slate-800 text-white text-[10px] font-black">VERIFY DOCUMENTS</button>
                    </div>
                    ${c.alerts.length ? `<div class="mt-4 p-3 rounded-xl bg-red-950/30 border border-red-500/30"><b class="text-red-300 text-xs">ACTIVE EXCEPTION</b><div class="text-[11px] text-red-200 mt-1">${c.alerts.map(a=>a.type+': '+a.text).join('<br>')}</div></div>` : ''}
                `;
            },

            caseField(label,value,mono=false){
                return `<div class="bg-slate-950 border border-slate-800 rounded-lg p-3"><div class="text-[9px] uppercase tracking-widest text-slate-500">${label}</div><div class="mt-1 text-[11px] font-bold ${mono?'font-mono text-cyan-300':'text-white'} break-words">${value}</div></div>`;
            },

            caseChip(label,value,color='blue'){
                return `<div class="bg-slate-950 rounded-lg p-2"><span class="text-slate-500">${label}</span><b class="block text-${color}-300 mt-1 break-words">${value}</b></div>`;
            },

            recordAudit(action, actor='SYSTEM', caseId=this.activeCaseId, severity='INFO', detail='') {
                const c=this.getCase(caseId); const entry={id:'AUD-'+Date.now(),time:new Date().toLocaleString('id-ID',{hour12:false}),actor,action,caseId:caseId||'-',container:c?.containerNo||caseId||'-',severity,detail};
                this.auditTrail.unshift(entry);
                if(c) c.timeline.unshift({time:entry.time.split(', ').pop()||entry.time,actor,event:action,status:severity==='CRITICAL'?'CRITICAL':severity==='INFO'?'DONE':'ACTIVE'});
                fetch('api.php?action=add_audit', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(entry)
                }).catch(err => {});
                this.log(`[AUDIT] ${actor}: ${action}${detail?' — '+detail:''}`,'action'); return entry;
            },
            getExceptions(){ const rows=[]; Object.values(this.cases).forEach(c=>(c.alerts||[]).forEach((a,i)=>rows.push({...a,caseId:c.containerNo,index:i}))); return rows; },
            acknowledgeException(caseId,index){ const c=this.getCase(caseId); if(!c?.alerts?.[index])return; const a=c.alerts[index]; c.alerts.splice(index,1); this.recordAudit('Exception acknowledged: '+a.type,'CONTROL TOWER',caseId,'MEDIUM',a.text); this.syncCaseToDB(c.containerNo); this.renderOpsPanel('alerts'); },
            resolveException(caseId,index){ const c=this.getCase(caseId); if(!c?.alerts?.[index])return; const a=c.alerts[index]; if(a.type==='ESEAL_TAMPER'){c.esealStatus='SECURE';c.gateStatus='IN_YARD';} if(a.type==='CUSTOMS_HOLD'){c.customsStatus='UNDER_REVIEW';c.customsStage='UNDER_REVIEW';} c.alerts.splice(index,1); this.recordAudit('Exception resolved: '+a.type,'CONTROL TOWER',caseId,'INFO','Operational state restored'); this.syncCaseToDB(c.containerNo); this.renderOpsPanel('alerts'); },
            submitCaseToCEISA(id=this.activeCaseId){
                const c=this.getCase(id); if(!c)return; const tx={id:'TXN-'+Date.now(),caseId:c.containerNo,shipmentId:c.shipmentId,status:'SENT',response:'PENDING',time:new Date().toLocaleString('id-ID',{hour12:false}),document:c.customsDocument};
                this.ceisaTransactions.unshift(tx); this.state.ceisaLastSync=new Date().toISOString(); this.recordAudit('CEISA transaction submitted','CEISA GATEWAY',id,'INFO',tx.id+' / '+c.customsDocument); this.renderOpsPanel('ceisa');
                setTimeout(()=>{ const complete=this.allDocumentsVerified(c), blocked=c.esealStatus==='TAMPER'||c.customsStatus==='HOLD'; tx.status='RECEIVED'; tx.response=blocked?'HOLD':(complete?'CLEAR':'DOCUMENT_REVIEW'); tx.http=200; tx.completedAt=new Date().toLocaleString('id-ID',{hour12:false});
                    if(tx.response==='CLEAR'){c.customsStatus='CLEARED';c.customsStage='CLEARED';c.customsStageIndex=5;this.recordAudit('CEISA response CLEAR — customs clearance approved','CEISA',id,'INFO',tx.id);}
                    else if(tx.response==='HOLD'){c.customsStatus='HOLD';c.customsStage='HOLD';c.customsStageIndex=2;if(!c.alerts.some(a=>a.type==='CUSTOMS_HOLD'))c.alerts.push({type:'CUSTOMS_HOLD',severity:'HIGH',text:'CEISA returned HOLD; customs decision requires officer action.'});this.recordAudit('CEISA response HOLD — customs decision blocked','CEISA',id,'HIGH',tx.id);}
                    else{c.customsStatus='UNDER_REVIEW';c.customsStage='UNDER_REVIEW';c.customsStageIndex=2;if(!c.alerts.some(a=>a.type==='DOCUMENT_MISSING'))c.alerts.push({type:'DOCUMENT_MISSING',severity:'HIGH',text:'Document set incomplete; CEISA requests review.'});this.recordAudit('CEISA response DOCUMENT_REVIEW','CEISA',id,'HIGH',tx.id);}
                    this.syncCaseToDB(c.containerNo);
                    this.renderOpsPanel('ceisa'); if(this.activeCaseId===id)this.renderCaseModal(c); },900);
            },
            clearCaseExceptions(id=this.activeCaseId){const c=this.getCase(id);if(!c)return;const n=c.alerts?.length||0;c.alerts=[];if(c.esealStatus==='TAMPER')c.esealStatus='SECURE';if(c.gateStatus==='BLOCKED')c.gateStatus='IN_YARD';this.recordAudit('All active exceptions cleared','CONTROL TOWER',id,'INFO',n+' exception(s) closed');this.syncCaseToDB(c.containerNo);this.renderOpsPanel('alerts');},
            filterOpsContainers(v){ this.renderContainerTable(v); },
            focusContainer(id){ this.openCase(id); },
            focusYard(zone){ this.log('Fokus kamera yard: '+zone,'action'); this.openOps('simulasi'); const pos={A:[28,18,18,22,0,0],B:[-12,16,-42,-12,0,-28],WAREHOUSE:[30,14,32,18,4,0]}[zone]||[0,18,30,0,0,0]; sim3D.camera.position.set(pos[0],pos[1],pos[2]); sim3D.controls.target.set(pos[3],pos[4],pos[5]); sim3D.controls.update(); },
            gateInCase(){
                const c = this.getCase(this.activeCaseId);
                c.gateStatus = 'IN_YARD';
                c.rfidStatus = 'DETECTED';
                c.timeline.push({time:new Date().toLocaleTimeString('id-ID'),actor:'GATE OFFICER',event:'Gate In approved / RFID identity confirmed',status:'DONE'});
                this.log('GATE IN approved: '+c.containerNo,'res');
                this.syncCaseToDB(c.containerNo);
                this.renderOpsPanel('gate');
            },

            assignYardSlot(slot){
                const c = this.getCase(this.activeCaseId);
                if (c.customsStatus === 'CLEARED' && slot.startsWith('B')) {
                    this.log('Yard assignment rejected: cleared cargo tidak ditempatkan di HOLD zone.','warn');
                    return;
                }
                c.yardLocation = slot;
                c.gateStatus = 'IN_YARD';
                c.timeline.push({time:new Date().toLocaleTimeString('id-ID'),actor:'YARD OPERATOR',event:'Yard slot assigned → '+slot,status:'DONE'});
                this.log('Yard slot '+slot+' assigned to '+c.containerNo,'res');
                this.syncCaseToDB(c.containerNo);
                this.renderOpsPanel('yard');
            },

            requestGateOut(){
                const c = this.getCase(this.activeCaseId);
                const ok = c.customsStatus === 'CLEARED' && c.esealStatus === 'RELEASED' && c.rfidStatus === 'DETECTED';
                if (!ok) {
                    c.gateStatus = 'BLOCKED';
                    this.log('GATE OUT BLOCKED: prerequisite belum terpenuhi untuk '+c.containerNo,'warn');
                    alert('Gate Out ditolak. Pastikan Customs CLEARED, E-Seal RELEASED, dan RFID DETECTED.');
                    this.syncCaseToDB(c.containerNo);
                    this.renderOpsPanel('gate');
                    return;
                }
                c.gateStatus = 'RELEASED';
                c.timeline.push({time:new Date().toLocaleTimeString('id-ID'),actor:'GATE OFFICER',event:'Gate Out authorized',status:'DONE'});
                this.log('GATE OUT RELEASED: '+c.containerNo,'res');
                this.syncCaseToDB(c.containerNo);
                this.renderOpsPanel('gate');
            },

            releaseESealCase(){
                const c = this.getCase(this.activeCaseId);
                if (c.customsStatus !== 'CLEARED') {
                    this.log('E-Seal release blocked: Customs belum CLEARED.','warn');
                    alert('E-Seal belum boleh direlease sebelum Customs CLEARED.');
                    return;
                }
                c.esealStatus = 'RELEASED';
                c.gateStatus = 'RELEASE_AUTHORIZED';
                c.timeline.push({time:new Date().toLocaleTimeString('id-ID'),actor:'CUSTOMS OFFICER',event:'E-Seal release authorized',status:'DONE'});
                this.log('E-Seal RELEASED: '+c.containerNo,'res');
                this.syncCaseToDB(c.containerNo);
                this.renderOpsPanel('eseal');
            },

            simulateTamperCase(){
                const c = this.getCase(this.activeCaseId);
                c.esealStatus = 'TAMPER';
                c.gateStatus = 'BLOCKED';
                c.alerts = c.alerts || [];
                if (!c.alerts.some(a => a.type === 'ESEAL_TAMPER')) c.alerts.push({type:'ESEAL_TAMPER',text:'E-Seal tamper event detected; Gate blocked.'});
                c.timeline.push({time:new Date().toLocaleTimeString('id-ID'),actor:'E-SEAL MONITOR',event:'TAMPER ALERT detected',status:'CRITICAL'});
                this.recordAudit('E-Seal tamper detected','E-SEAL MONITOR',c.containerNo,'CRITICAL','Gate automatically blocked');
                this.log('E-SEAL TAMPER ALERT: '+c.containerNo,'warn');
                this.syncCaseToDB(c.containerNo);
                this.renderOpsPanel('eseal');
            },

            manualRFIDScan(){
                if(!this.state.isArrived){ this.log('RFID scan ditunda: belum ada truck/container di portal.','warn'); return; }
                this.log('RFID Reader Gate 02 memulai scanning...','action'); sim3D.setScanning(true,'GATE02');
                setTimeout(()=>{sim3D.setScanning(false,'GATE02'); this.log('RFID DETECTED: '+this.data.sscc,'res'); this.renderOpsPanel('rfid');},900);
            },
            verifyDocuments(){
                const id=this.activeCaseId || 'MSCU1234567';
                this.verifyCaseDocuments(id);
                this.state.docVerified=true;
            },
            testCEISA(){ this.log('Testing CEISA 4.0 gateway connection...','action'); setTimeout(()=>{this.state.ceisaLastSync=new Date().toISOString(); this.recordAudit('CEISA gateway connection verified','SYSTEM',this.activeCaseId,'INFO','HTTP 200 / gateway online'); this.log('CEISA gateway: CONNECTION OK / RESPONSE 200.','res'); this.renderOpsPanel('ceisa');},700); },

            advanceOutboundFlow() {
                const step=this.state.outboundFlowStep;
                const labels=['PENAMPUNGAN','SORTING','CONSOLIDATION','CUSTOMS DECLARATION','CUSTOMS REVIEW','CUSTOMS SEAL','GATE OUT'];
                if(step>=6)return;
                this.state.outboundFlowStep=step+1;
                const next=labels[step+1];
                const messages={
                    1:'Barang customer diterima di area penampungan outbound.',
                    2:'Barang disortir berdasarkan destination dan rencana pengiriman.',
                    3:'Barang tujuan Singapore dikonsolidasikan ke container MSCU-OUT-2026-001.',
                    4:'Daftar isi container dan dokumen declaration dikirim ke sistem Bea Cukai.',
                    5:'Customs Officer melakukan review dokumen dan menetapkan cargo sesuai untuk sealing.',
                    6:'Customs Officer memasang dan mengunci E-Seal. Container siap menuju Gate Out.'
                };
                this.log(messages[step+1] || ('Outbound flow masuk tahap '+next+'.'),'action');
                this.recordAudit('Outbound flow step completed','OUTBOUND / CUSTOMS',this.activeCaseId,'INFO',next);
                this.renderOpsPanel('outboundflow');
            },
            resetOutboundFlow() {
                this.state.outboundFlowStep=0;
                this.log('Outbound end-to-end simulation di-reset ke tahap PENAMPUNGAN.','system');
                this.renderOpsPanel('outboundflow');
            },

            setLogisticsMode(mode) {
                this.logisticsMode = mode;
                const bIn = document.getElementById('btn-mode-inbound');
                const bOut = document.getElementById('btn-mode-outbound');
                if (mode === 'INBOUND') {
                    bIn.className = 'px-3 py-1 rounded-lg font-bold bg-blue-600 text-white transition-all';
                    bOut.className = 'px-3 py-1 rounded-lg font-bold text-slate-400 hover:text-white transition-all';
                    this.log('Mode dialihkan ke: INBOUND (Penerimaan truk kosong dari Pelabuhan ➔ Pemuatan Gantry ➔ Gate Outbound)', 'action');
                    this.resetSystem();
                } else {
                    bOut.className = 'px-3 py-1 rounded-lg font-bold bg-indigo-600 text-white transition-all';
                    bIn.className = 'px-3 py-1 rounded-lg font-bold text-slate-400 hover:text-white transition-all';
                    this.log('Mode dialihkan ke: OUTBOUND (Truk bermuatan merapat langsung dari Gudang PLB ➔ Pos Gate 02 Outbound)', 'action');
                    this.startOutboundDirect();
                }
            },

            startOutboundDirect() {
                this.cycle++;
                this.state.isArrived = true;
                this.state.arrivedAt = Date.now();
                this.log('Mode Outbound: Truk dari gudang siap dimuat & melaju langsung ke Pos Gate 02 Outbound.', 'system');
                
                // Truk mulai di depan Gantry Loader bermuatan
                sim3D.setTruckPosition(38, 0, 0);
                sim3D.setContainerLoaded(true);
                sim3D.setEsealLockState('LOCKED');
                this.setLockView('emerald', 'TERKUNCI (LOCKED)', 'Kontainer dari Gudang PLB sudah disegel E-Seal.');

                setTimeout(() => {
                    this.stage3ExitOutbound();
                }, 1200);
            },

            getTimestamp() {
                const now = new Date();
                return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}.${now.getMilliseconds().toString().padStart(3, '0')}`;
            },

            log(message, type = 'info', json = null) {
                const div = document.createElement('div');
                div.className = 'mb-1.5';
                
                let colorClass = 'text-green-400';
                let icon = '';

                switch(type) {
                    case 'system': colorClass = 'text-indigo-400'; break;
                    case 'error': colorClass = 'text-rose-400 font-bold'; icon = '<i class="fa-solid fa-xmark mr-1"></i> '; break;
                    case 'warn': colorClass = 'text-amber-400'; icon = '<i class="fa-solid fa-triangle-exclamation mr-1"></i> '; break;
                    case 'req': colorClass = 'text-sky-400'; icon = '<i class="fa-solid fa-arrow-right-to-bracket mr-1"></i> '; break;
                    case 'res': colorClass = 'text-emerald-400'; icon = '<i class="fa-solid fa-arrow-right-from-bracket mr-1"></i> '; break;
                    case 'action': colorClass = 'text-yellow-300 font-semibold'; icon = '<i class="fa-solid fa-bolt mr-1"></i> '; break;
                    default: icon = '<i class="fa-solid fa-angle-right mr-1 text-slate-500"></i> ';
                }

                let content = `<span class="text-slate-500 mr-1.5">[${this.getTimestamp()}]</span><span class="${colorClass}">${icon}${message}</span>`;
                
                if (json) {
                    const formattedJson = JSON.stringify(json, null, 2).replace(/\n/g, '<br>').replace(/ /g, '&nbsp;');
                    content += `<div class="mt-1 p-2 bg-slate-950/90 rounded border border-slate-800 text-[10px] text-slate-300 font-mono">${formattedJson}</div>`;
                }

                div.innerHTML = content;
                this.ui.terminal.appendChild(div);
                while (this.ui.terminal.childElementCount > 250) this.ui.terminal.removeChild(this.ui.terminal.firstChild);
                this.ui.terminal.scrollTop = this.ui.terminal.scrollHeight;
            },

            triggerArrival() {
                if (this.state.isArrived) return;
                
                this.log('Inbound: Truk pengangkut kontainer merapat ke Portal Gerbang PLB...', 'action');
                this.state.isArrived = true;
                this.state.arrivedAt = Date.now();
                const c = this.cycle;
                this.setStep(0);
                this.data.stats.trucks++;
                this.ui.kTrucks.innerText = this.data.stats.trucks;
                this.ui.btnArrive.classList.add('state-disabled');
                
                // Drive 3D Truck onto weighbridge
                sim3D.setTruckPosition(0);

                setTimeout(() => {
                    if (c !== this.cycle) return;
                    this.ui.gateStatus.innerText = "TRUK DI GERBANG";
                    this.ui.gateStatus.className = "text-[10px] font-extrabold text-blue-400 uppercase";

                    // Start RFID Scanning Wave
                    sim3D.setScanning(true);
                    this.log('Antena Fixed RFID UHF aktif: Membaca tag kontainer & E-Seal...', 'system');
                    this.setStep(1);

                    setTimeout(() => {
                        if (c !== this.cycle) return;
                        sim3D.setScanning(false);
                        this.log(`SSCC E-Seal Terbaca: ${this.data.sscc}`, 'info');

                        this.ui.ssccText.innerText = this.data.sscc;
                        this.ui.sensorText.innerHTML = '<span class="w-2 h-2 rounded-full bg-emerald-500 inline-block shadow-[0_0_5px_#10b981]"></span> Integritas Baik';
                        this.ui.sensorText.className = "font-bold text-emerald-400 flex items-center gap-1.5 mt-0.5";

                        sim3D.setEsealLockState('LOCKED');
                        this.setLockView('rose', 'TERKUNCI', 'Kargo ditahan sementara. Menunggu keputusan CEISA.');

                        this.ui.btnApi.classList.remove('state-disabled');
                        this.ui.btnSabotage.classList.remove('state-disabled');

                        this.readTelemetry();
                        this.setStep(2);
                        this.weighTruck();

                        this.schedule(() => this.planNow() === 'TAMPER' ? this.triggerSabotage() : this.triggerAPI(), 1800);
                    }, 1200);

                }, 1500);
            },

            readTelemetry() {
                const b = Math.round(this.state.battery);
                const dbm = -(68 + Math.floor(Math.random() * 12));
                this.ui.battery.innerText = b + '%';
                this.ui.signal.innerText = dbm + ' dBm';
                this.log(`Telemetri Wi-Fi 6: RSSI ${dbm} dBm, Battery ${b}%, Status Pengunci: LOCKED 🔴`, 'info');
            },

            weighTruck() {
                const d = this.data;
                const pct = (this.ui.chkWeight.checked || (this.ui.scenario.value === 'RANDOM' && this.data.plan === 'HOLD' && this.data.planW)) ? 0.08 + Math.random() * 0.04 : (Math.random() - 0.5) * 0.01;
                d.actualKg = Math.round(d.declaredKg * (1 + pct));
                const diff = (d.actualKg - d.declaredKg) / d.declaredKg * 100;
                const bad = Math.abs(diff) > 5;
                this.state.weightMismatch = bad;
                this.ui.weight.innerText = d.actualKg.toLocaleString('id-ID') + ' kg';
                this.ui.weight.className = 'font-mono font-bold ' + (bad ? 'text-amber-400' : 'text-emerald-400');
                this.log(`Jembatan Timbang: Terukur ${d.actualKg.toLocaleString('id-ID')} kg vs Manifes ${d.declaredKg.toLocaleString('id-ID')} kg (Deviasi ${diff.toFixed(1)}%)`, bad ? 'warn' : 'info');
            },

            setLockView(color, title, desc) {
                const colors = {
                    rose: { glow: 'bg-rose-950/40', border: 'border-rose-500/50', iconBg: 'bg-rose-900/80', icon: 'fa-lock text-rose-400', title: 'text-rose-500', desc: 'text-rose-300' },
                    amber: { glow: 'bg-amber-950/40', border: 'border-amber-500/50', iconBg: 'bg-amber-900/80', icon: 'fa-lock text-amber-400', title: 'text-amber-500', desc: 'text-amber-300' },
                    emerald: { glow: 'bg-emerald-950/40', border: 'border-emerald-500/50', iconBg: 'bg-emerald-900/80', icon: 'fa-lock-open text-emerald-400', title: 'text-emerald-500', desc: 'text-emerald-300' },
                    slate: { glow: 'bg-slate-900/40', border: 'border-slate-800', iconBg: 'bg-slate-800', icon: 'fa-lock text-slate-500', title: 'text-slate-500', desc: 'text-slate-400' }
                };
                const c = colors[color] || colors.slate;
                this.ui.lockGlow.className = `absolute inset-0 ${c.glow} transition-colors duration-500`;
                this.ui.lockPanel.className = `bg-slate-950 p-3 rounded-xl border ${c.border} flex items-center gap-3 relative overflow-hidden transition-all duration-500`;
                this.ui.lockIconBg.className = `w-10 h-10 rounded-xl ${c.iconBg} flex items-center justify-center border border-slate-700 shadow-md relative z-10`;
                this.ui.lockIcon.className = `fa-solid ${c.icon}`;
                this.ui.lockTitle.className = `text-xs font-black ${c.title} tracking-wider uppercase`;
                this.ui.lockTitle.innerText = title;
                this.ui.lockDesc.className = `text-[10px] ${c.desc} leading-tight`;
                this.ui.lockDesc.innerText = desc;
            },

            triggerAPI() {
                if (!this.state.isArrived || this.state.isProcessingAPI || this.state.isCleared || this.state.isTampered) return;
                
                this.state.isProcessingAPI = true;
                this.ui.btnApi.classList.add('state-disabled');
                this.ui.btnSabotage.classList.add('state-disabled');
                this.ui.btnApiText.innerHTML = 'Memproses CEISA... <i class="fa-solid fa-circle-notch fa-spin ml-1"></i>';

                this.log('Mengirim REST Webhook Payload ke Server Bea Cukai CEISA 4.0...', 'action');
                this.setStep(3);
                
                const reqPayload = {
                    request_id: "REQ-" + Math.floor(Math.random() * 1000000),
                    endpoint: "/v2/plb/customs-clearance/verify",
                    headers: { "X-Client-Id": "WMS-PLB-JKT-08", "X-Signature": "sha256=" + this.hex(32) },
                    method: "POST",
                    body: {
                        gate_id: this.data.gateId,
                        container_eseal: {
                            sscc_code: this.data.sscc,
                            integrity_status: this.state.weightMismatch ? "WEIGHT_ANOMALY" : "NORMAL",
                            gps_coords: "-6.1082, 106.8831",
                            weight_declared_kg: this.data.declaredKg,
                            weight_actual_kg: this.data.actualKg,
                            doc_ref: this.data.doc
                        },
                        timestamp: new Date().toISOString()
                    }
                };

                this.log('JSON Payload Terkirim:', 'req', reqPayload);
                this.sendCeisa(reqPayload, 1);
            },

            sendCeisa(req, attempt) {
                const t0 = performance.now();
                const cy = this.cycle;
                let sc = this.scenarioNow();

                if (this.state.weightMismatch && sc === 'CLEAR') {
                    sc = 'HOLD';
                    if (attempt === 1) this.log('Analisis Risiko CEISA: Anomali berat memicu jalur MERAH.', 'warn');
                }

                const wait = (sc === 'TIMEOUT' && attempt < 3) ? 2200 : 1100 + Math.random() * 700;

                setTimeout(() => {
                    if (cy !== this.cycle) return;
                    const ms = Math.round((performance.now() - t0) * SPEED);

                    if (sc === 'TIMEOUT' && attempt < 3) {
                        this.log(`HTTP 503 Timeout (${ms} ms). Auto-retry ${attempt}/2 via backoff...`, 'error');
                        this.ui.btnApiText.innerHTML = `Retry ${attempt}/2... <i class="fa-solid fa-circle-notch fa-spin ml-1"></i>`;
                        setTimeout(() => this.sendCeisa(req, attempt + 1), attempt * 1600);
                        return;
                    }

                    this.data.stats.lat.push(ms);
                    const kind = sc === 'TIMEOUT' ? 'CLEAR' : sc;

                    if (kind === 'CLEAR') {
                        this.log('Respon CEISA 4.0: SPPB DISETUJUI (JALUR HIJAU)', 'res', {
                            status: 200,
                            data: {
                                customs_status: "CLEAR",
                                lane: "HIJAU",
                                document_type: "SPPB",
                                document_number: "SPPB-" + Math.floor(100000 + Math.random() * 900000) + "/KPU.01/2026",
                                action: { code: "UNLOCK_AUTHORIZED" }
                            }
                        });
                        this.processClearance();
                    } else if (kind === 'HOLD') {
                        this.log('Respon CEISA 4.0: JALUR MERAH (PEMERIKSAAN FISIK)', 'warn', {
                            status: 200,
                            data: { customs_status: "HOLD", lane: "MERAH", reason: "INSPEKSI_FISIK_KAPAL" }
                        });
                        this.setLockView('amber', 'JALUR MERAH', 'Pemeriksaan fisik kargo diwajibkan oleh petugas pabean.');
                        this.ui.gateStatus.innerText = 'INSPEKSI FISIK';
                        this.setStep(3, 'warn');
                        this.ui.btnApiText.innerHTML = 'Inspeksi Fisik... <i class="fa-solid fa-magnifying-glass ml-1"></i>';

                        setTimeout(() => {
                            if (cy !== this.cycle) return;
                            this.log('Pemeriksaan fisik petugas Bea Cukai selesai & disetujui.', 'res');
                            this.processClearance();
                        }, 3500);
                    } else {
                        // REJECT
                        this.state.isProcessingAPI = false;
                        this.log('Respon CEISA 4.0: DOKUMEN DITOLAK (422)', 'error', {
                            status: 422,
                            error: { code: "DOC_MISMATCH", detail: "Ketidaksesuaian nomor BC 2.3 dengan manifest." }
                        });
                        this.setLockView('rose', 'DITOLAK (422)', 'Dokumen tidak cocok. Revisi manifest kargo.');
                        this.ui.gateStatus.innerText = 'DOKUMEN DITOLAK';
                        this.setStep(3, 'error');
                        this.ui.btnApiText.innerText = 'Kirim Ulang';

                        this.schedule(() => {
                            this.log('Koreksi dokumen diterima dari importir. Memproses ulang...', 'system');
                            this.data.override = 'CLEAR';
                            this.triggerAPI();
                        }, 3200);

                        this.ui.btnApi.classList.remove('state-disabled');
                        this.ui.btnSabotage.classList.remove('state-disabled');
                    }
                }, wait);
            },

            processClearance() {
                this.state.isProcessingAPI = false;
                this.state.ceisaLastSync = new Date().toISOString();
                this.setStep(3, 'warn');
                this.log('Truk berhenti di Pos Pemeriksaan Gerbang PLB. Petugas Bea Cukai bersiap melakukan verifikasi...', 'action');

                // Populate Inspection Checkpoint Modal with Current Truck & Cargo Data
                document.getElementById('chk-plate').innerText = this.data.plate;
                // ... (biarkan kode pengisian data yang ada tetap sama) ...
                const ceisaEl = document.getElementById('chk-ceisa-status');
                if (this.state.weightMismatch) {
                    ceisaEl.innerText = 'PERINGATAN ANOMALI BERAT';
                    ceisaEl.className = 'text-amber-400 font-bold uppercase';
                    document.getElementById('v-weight').checked = false;
                } else {
                    ceisaEl.innerText = 'SPPB RESMI DITERBITKAN (HIJAU)';
                    ceisaEl.className = 'text-emerald-400 font-bold uppercase';
                    document.getElementById('v-weight').checked = true;
                }
                
                // Tampilkan Tombol Interaksi ala Roblox (Bukan langsung modal kertas)
                this.state.awaitingInspection = true; // Tandai sistem sedang menunggu tombol F
                document.getElementById('roblox-prompt').classList.remove('hidden');
                this.log('Menunggu interaksi: Tekan tombol [F] atau [E] untuk mengeluarkan kertas lembar pemeriksaan.', 'system');
            },

            closeInspectionModal() {
                // Fungsi untuk tombol kembali
                document.getElementById('inspection-overlay').classList.add('hidden');
                this.state.awaitingInspection = true; // Set true lagi agar bisa tekan F lagi jika mendekat
            },

            confirmInspectionRelease() {
                document.getElementById('inspection-overlay').classList.add('hidden');
                this.state.isCleared = true;
                this.setLockView('amber', 'PEMERIKSAAN ACC', 'Otorisasi petugas & sistem valid. Menunggu Buka Gerbang.');
                
                this.ui.btnApiText.innerHTML = 'Clearance Sukses <i class="fa-solid fa-check ml-1"></i>';
                this.log('Petugas Bea Cukai mengesahkan checklist: Dokumen Cocok & Valid.', 'info');
                
                // Ubah status ke menunggu buka gerbang
                this.state.awaitingGateOpen = true; 
                this.log('Mendekatlah ke panel gerbang dan tekan [F] untuk membuka Barrier Gate 01 secara manual.', 'system');
            },

            openGateManual() {
                this.log('Otorisasi final diberikan. Membuka Barrier Gate 01 Inbound...', 'system');
                sim3D.setBarrierGateOpen(true);
                this.ui.gateStatus.innerText = "GATE 01 DIBUKA";
                this.ui.gateStatus.className = "text-[10px] font-extrabold text-emerald-400 uppercase";

                try { confetti({ particleCount: 30, spread: 60, origin: { y: 0.7 } }); } catch(e) {}

                this.log('Menunggu palang gerbang terbuka penuh...', 'info');
                
                // Beri jeda 1.5 detik agar palang gerbang terbuka dulu sebelum truk maju
                setTimeout(() => {
                    this.log('TAHAP 1 SELESAI: Truk kosong mulai melaju melewati Gate 01 menuju Area Pemuatan Gantry RTG.', 'info');
                    this.stage2Loading();
                }, 1500); 
            },

            stage2Loading() {
                this.setStep(4);
                
                // Truk bergerak dari Gate 01 (x=0) ke posisi Gantry Loader (x=38, z=0)
                sim3D.setTruckPosition(38, 0, 0);

                setTimeout(() => {
                    this.log('Truk telah tiba di area Gantry RTG. Menunggu operator lapangan (Anda) menekan [F] untuk menurunkan kontainer...', 'system');
                    // Tunggu interaksi pengguna [F] di dekat Gantry
                    this.state.awaitingContainerLoad = true;
                }, 2800); // Waktu tempuh truk ke area gantry
            },

            loadContainerManual() {
                this.log('Crane Gantry RTG menurunkan Spreader secara bertahap menuju sasis truk...', 'action');
                this.log('Animasi mekanis dimulai: spreader turun, kontainer diposisikan, lalu dikunci.', 'system');
                sim3D.startContainerUnloadAnimation();
            },

            finishContainerUnloadAnimation() {
                sim3D.setContainerLoaded(true);
                sim3D.setEsealLockState('LOCKED');
                this.setLockView('emerald', 'KONTAINER DIMUAT', 'Kontainer selesai diturunkan dan duduk di atas trailer.');
                this.log('Pemuatan selesai! Kontainer terpasang & E-Seal IoT dalam posisi TERKUNCI.', 'info');

                setTimeout(() => {
                    this.stage3ExitOutbound();
                }, 1000);
            },

            stage3ExitOutbound() {
                this.setStep(5);
                this.log('TAHAP 3: Truk memutar haluan ke arah jalur belakang menuju Gate 02 Outbound...', 'action');

                // RUTE U-TURN FISIK: setelah container terpasang, truk tidak boleh
                // memotong diagonal atau langsung bergeser ke kiri. Truk mengikuti
                // U-turn yang benar-benar tergambar di aspal: maju perlahan, membelok
                // mengikuti busur, lalu masuk jalur outbound dan berhenti di depan Gate 02.
                // Banyak waypoint kecil dipakai agar lintasannya halus dan terlihat seperti
                // truk benar-benar menyetir, bukan teleport dari titik ke titik.
                const routePoints = [];
                const uCenterX = 38;
                const uCenterZ = -14;
                const uRadius = 14;
                const uSteps = 72;

                // U-turn mengikuti GEOMETRI JALAN yang sudah dibuat di scene:
                // mulai (38, 0) -> melengkung ke sisi kanan -> kembali ke (38, -28).
                // Rotasi TIDAK dihitung dari rumus sudut sebelumnya karena itu membuat
                // orientasi truck terbalik. Heading sekarang dihitung dari titik route
                // berikutnya sehingga moncong/cabin selalu menghadap arah gerak.
                routePoints.push({ x: 38, z: 0 });
                for (let i = 1; i <= uSteps; i++) {
                    const t = Math.PI / 2 - (Math.PI * i / uSteps);
                    routePoints.push({
                        x: uCenterX + uRadius * Math.cos(t),
                        z: uCenterZ + uRadius * Math.sin(t)
                    });
                }

                // Keluar U-turn lalu menyusuri jalan outbound menuju Gate 02.
                // Gate 02 berada di x = -5.2. Karena truck menghadap -X saat keluar,
                // CENTER truck harus berhenti di sisi +X dari palang. Dengan panjang
                // bagian depan truck sekitar 8.5 m, x=4.5 memberi jarak aman di belakang
                // palang tanpa membuat truck menerobos ke sisi luar gate.
                const outboundEndX = 4.5;
                const outboundStep = 1.5;
                for (let x = 38 - outboundStep; x > outboundEndX; x -= outboundStep) {
                    routePoints.push({ x, z: -28 });
                }
                routePoints.push({ x: outboundEndX, z: -28 });

                // Hitung heading dari arah gerak aktual setiap waypoint.
                // Model truck menghadap +X pada rotasi 0, sehingga yaw Three.js =
                // atan2(-dz, dx). Hasil akhirnya otomatis PI saat berjalan ke kiri (-X).
                for (let i = 0; i < routePoints.length; i++) {
                    const a = routePoints[Math.max(0, i - 1)];
                    const b = routePoints[Math.min(routePoints.length - 1, i + 1)];
                    const dx = b.x - a.x;
                    const dz = b.z - a.z;
                    if (Math.hypot(dx, dz) > 0.001) {
                        routePoints[i].rot = Math.atan2(-dz, dx);
                    } else {
                        routePoints[i].rot = i > 0 ? routePoints[i - 1].rot : 0;
                    }
                }

                sim3D.setTruckRoute(routePoints, () => {
                    this.log('Truk berhenti TEPAT DI BELAKANG PALANG Gate 02 Outbound. Scanning E-Seal & Verifikasi Pas Keluar...', 'system');
                    sim3D.setScanning(true, 'GATE02');

                    setTimeout(() => {
                            sim3D.setScanning(false);
                            sim3D.setEsealLockState('UNLOCKED');
                            this.state.awaitingOutboundInspection = true;

                            const panel = document.getElementById('gate02-controls');
                            const status = document.getElementById('gate02-control-status');
                            const btnInspect = document.getElementById('btn-gate02-inspect');
                            const btnOpen = document.getElementById('btn-gate02-open');

                            if (panel) panel.classList.remove('hidden');
                            if (status) status.innerText = 'Dokumen keluar menunggu pemeriksaan operator.';
                            if (btnInspect) {
                                btnInspect.disabled = false;
                                btnInspect.classList.remove('opacity-50');
                                btnInspect.innerHTML = '<i class="fa-solid fa-file-circle-check mr-1"></i> Periksa Dokumen Keluar';
                            }
                            if (btnOpen) btnOpen.disabled = true;

                            this.log('Gate 02 siap diperiksa. Gunakan tombol PERIKSA DOKUMEN KELUAR.', 'system');
                        }, 1500);
                });
            },

            inspectOutboundDocuments() {
                if (!this.state.awaitingOutboundInspection) return;

                this.state.awaitingOutboundInspection = false;
                this.state.outboundInspectionDone = true;
                this.state.awaitingOutboundGateOpen = true;

                const status = document.getElementById('gate02-control-status');
                const btnInspect = document.getElementById('btn-gate02-inspect');
                const btnOpen = document.getElementById('btn-gate02-open');

                if (status) status.innerText = 'Dokumen valid — truck masih berada di belakang palang.';
                if (btnInspect) {
                    btnInspect.disabled = true;
                    btnInspect.classList.add('opacity-50');
                    btnInspect.innerHTML = '<i class="fa-solid fa-check mr-1"></i> Dokumen Valid';
                }
                if (btnOpen) btnOpen.disabled = false;

                document.getElementById('roblox-prompt').classList.add('hidden');
                this.ui.gateStatus.innerText = 'DOKUMEN KELUAR VALID';
                this.ui.gateStatus.className = 'text-[10px] font-extrabold text-emerald-400 uppercase';
                this.log(`Dokumen keluar truck ${this.data.plate} valid. Truck tetap berhenti di belakang Gate 02.`, 'info');
                this.log('Tekan ANGKAT GERBANG untuk membuka palang.', 'system');
            },

            openOutboundGateManual() {
                if (!this.state.awaitingOutboundGateOpen) return;

                this.state.awaitingOutboundGateOpen = false;
                document.getElementById('roblox-prompt').classList.add('hidden');

                const status = document.getElementById('gate02-control-status');
                const btnOpen = document.getElementById('btn-gate02-open');
                if (btnOpen) btnOpen.disabled = true;
                if (status) status.innerText = 'Palang Gate 02 sedang terangkat...';

                sim3D.setOutboundBarrierOpen(true);
                this.setLockView('emerald', 'GATE 02 OPEN', 'Dokumen keluar valid. Palang terangkat.');
                this.ui.gateStatus.innerText = 'GATE 02 OUTBOUND DIBUKA';
                this.ui.gateStatus.className = 'text-[10px] font-extrabold text-emerald-400 uppercase';
                this.log('Gate 02 Outbound dibuka manual. Truk siap meninggalkan kawasan PLB.', 'info');

                setTimeout(() => {
                    if (status) status.innerText = 'Truk meninggalkan kawasan PLB.';
                    sim3D.setTruckPosition(-60, -28, Math.PI);

                    const dwell = ((Date.now() - this.state.arrivedAt) * SPEED / 1000).toFixed(1);
                    this.data.stock += this.data.koli;
                    this.data.stats.clear++;
                    this.ui.kClear.innerText = this.data.stats.clear;
                    this.ui.kDwell.innerText = dwell + 's';

                    this.schedule(() => this.finishTruck('ok'), 3500);
                }, 1600);
            },

            rejectInspectionHold() {
                document.getElementById('inspection-overlay').classList.add('hidden');
                this.log('Petugas Bea Cukai menahan truk di pos gerbang karena ketidaksesuaian dokumen/fisik.', 'warn');
                this.log('Truk diperintahkan putar haluan menuju Zona Karantina / Pemeriksaan Khusus Pabean.', 'warn');
                this.setLockView('amber', 'DITAHAN PETUGAS', 'Akses gerbang ditolak. Menuju pos karantina.');
                this.ui.gateStatus.innerText = "MENUJU KARANTINA";
                this.ui.gateStatus.className = "text-[10px] font-extrabold text-amber-500 uppercase blink-slow";
                this.data.stats.issue++;
                this.finishTruck('hold');
            },

            triggerSabotage() {
                if (!this.state.isArrived || this.state.isCleared || this.state.isTampered) return;
                
                this.state.isTampered = true;
                this.ui.btnSabotage.classList.add('state-disabled');
                this.ui.btnApi.classList.add('state-disabled');

                this.log('SIMULASI ANOMALI: KABEL PENGAWAS E-SEAL TERPOTONG / RUSAK!', 'action');

                setTimeout(() => {
                    sim3D.setEsealLockState('TAMPER');
                    this.ui.sensorText.innerHTML = '<span class="w-2 h-2 rounded-full bg-rose-500 inline-block blink-fast"></span> TAMPER ALERT!';
                    this.ui.sensorText.className = "font-bold text-rose-500 flex items-center gap-1.5 mt-0.5";

                    this.setLockView('rose', 'SABOTASE DETEKSI', 'PERINGATAN: Sirkuit kabel pengunci terputus paksa!');
                    this.log('CRITICAL: Sinyal darurat IoT terkirim ke Kantor Bea Cukai! Gerbang diblokir.', 'error');
                    this.setStep(2, 'error');

                    this.ui.gateStatus.innerText = "GERBANG DIBLOKIR";
                    this.ui.gateStatus.className = "text-[10px] font-extrabold text-rose-500 uppercase blink-slow";

                    setTimeout(() => this.finishTruck('tamper'), 4000);
                }, 400);
            },

            finishTruck(outcome) {
                const ok = outcome === 'ok';
                const plate = this.data.plate;

                if (ok) {
                    this.log(`Proses 3-Tahap Truk ${plate} selesai sepenuhnya! Kargo aman keluar PLB.`, 'info');
                } else {
                    // Animasi Belok Mundur & Putar Haluan Masuk Zona Karantina Bay D
                    this.log(`Truk ${plate} dialihkan ke Zona Karantina Pabean (Bay D) untuk pembongkaran & inspeksi fisik oleh petugas.`, 'warn');
                    sim3D.setTruckPosition(-8, 0, 0);
                    setTimeout(() => {
                        sim3D.setTruckPosition(-14, 10, -0.4);
                        setTimeout(() => {
                            sim3D.setTruckPosition(-20, 22, -0.65);
                        }, 1200);
                    }, 1000);
                }

                // Reset untuk siklus truk berikutnya
                setTimeout(() => {
                    this.resetSystem(false);
                }, 3000);
            },

            resetSystem(quiet) {
                if (!quiet) this.log('--- RESET SIMULASI SELESAI ---', 'system');
                this.state.isArrived = false;
                this.state.isProcessingAPI = false;
                this.state.isCleared = false;
                this.state.isTampered = false;
                this.state.weightMismatch = false;
                this.state.awaitingOutboundInspection = false;
                this.state.awaitingOutboundGateOpen = false;
                this.state.outboundInspectionDone = false;

                sim3D.containerUnloadAnimating = false;
                sim3D.truckRoute = null;
                sim3D.truckRouteIndex = 0;
                sim3D.truckRouteCallback = null;
                sim3D.driveMode = false;
                sim3D.driveTruckSpeed = 0;
                if (sim3D.driveTruckGroup) {
                    sim3D.driveTruckGroup.position.set(sim3D.driveTruckSpawn.x, 0, sim3D.driveTruckSpawn.z);
                    sim3D.driveTruckGroup.rotation.y = Math.PI;
                }
                if (sim3D.avatarMesh) sim3D.avatarMesh.visible = true;

                const gate02Panel = document.getElementById('gate02-controls');
                if (gate02Panel) gate02Panel.classList.add('hidden');

                const gate02Inspect = document.getElementById('btn-gate02-inspect');
                const gate02Open = document.getElementById('btn-gate02-open');
                if (gate02Inspect) {
                    gate02Inspect.disabled = false;
                    gate02Inspect.classList.remove('opacity-50');
                    gate02Inspect.innerHTML = '<i class="fa-solid fa-file-circle-check mr-1"></i> Periksa Dokumen Keluar';
                }
                if (gate02Open) gate02Open.disabled = true;

                // Truk kembali ke posisi awal di luar Gate 01 Inbound (kosong)
                sim3D.setTruckPosition(-48, 0, 0);
                sim3D.setContainerLoaded(false);
                sim3D.setBarrierGateOpen(false);
                sim3D.setOutboundBarrierOpen(false);
                sim3D.setEsealLockState('STANDBY');
                sim3D.setScanning(false);

                this.ui.gateStatus.innerText = "MENUNGGU KEDATANGAN";
                this.ui.gateStatus.className = "text-[10px] font-extrabold text-amber-400 uppercase";

                this.ui.ssccText.innerText = "-";
                this.ui.sensorText.innerHTML = '<span class="w-2 h-2 rounded-full bg-slate-600 inline-block"></span> Standby';
                this.ui.sensorText.className = "font-bold text-slate-400 flex items-center gap-1.5 mt-0.5";
                this.setLockView('slate', 'STANDBY', 'Menunggu kontainer merapat ke gerbang...');

                this.ui.btnArrive.classList.remove('state-disabled');
                this.ui.btnApi.classList.add('state-disabled');
                this.ui.btnSabotage.classList.add('state-disabled');
                this.ui.btnApiText.innerText = "Verifikasi API CEISA 4.0";

                ['battery', 'signal', 'weight'].forEach(k => this.ui[k].innerText = '-');

                this.cycle++;
                this.setStep(-1);
                this.nextTruck();
                if (!quiet) this.scheduleArrival();
            },

            nextTruck() {
                const plates = ['B 9021 TXT', 'B 9417 KDL', 'B 9138 UWA', 'B 9773 FRC', 'B 9256 NPQ'];
                const firms = ['PT Nusantara Elektronik', 'PT Sinar Mitra Tekstil', 'PT Bahari Farmasi', 'PT Garuda Otomotif', 'PT Cipta Kimia'];
                const hs = ['8517.13 (Elektronik)', '5407.61 (Tekstil)', '3004.90 (Farmasi)', '8708.29 (Otomotif)', '2915.90 (Kimia)'];
                
                this.data.seq++;
                const i = (this.data.seq - 1) % plates.length;
                this.data.plate = plates[i];
                this.data.override = null;
                this.data.actualKg = 0;
                this.data.sscc = '(00)3899123450' + String(127 + this.data.seq).padStart(8, '0');
                this.data.doc = String(481 + this.data.seq).padStart(6, '0') + '/BC23/2026';
                this.data.declaredKg = 12000 + Math.round(Math.random() * 200) * 50;
                this.data.koli = 15 + Math.floor(Math.random() * 25);

                const r = Math.random();
                this.data.plan = r < 0.65 ? 'CLEAR' : r < 0.8 ? 'HOLD' : r < 0.9 ? 'REJECT' : 'TAMPER';
                this.data.planW = Math.random() < 0.4;
                this.state.battery = 88 + Math.random() * 10;

                this.ui.plate.innerText = this.data.plate;
                this.ui.mDoc.innerText = this.data.doc;
                this.ui.mHs.innerText = hs[i];
                this.ui.mFirm.innerText = firms[i];
                this.ui.mKg.innerText = this.data.declaredKg.toLocaleString('id-ID') + ' kg';
            },

            planNow() {
                const v = this.ui.scenario.value;
                return v === 'RANDOM' ? this.data.plan : v;
            },

            scenarioNow() {
                if (this.data.override) return this.data.override;
                const p = this.planNow();
                return p === 'TAMPER' ? 'CLEAR' : p;
            },

            schedule(fn, ms) {
                const c = this.cycle;
                setTimeout(() => { if (this.state.auto && c === this.cycle) fn(); }, ms);
            },

            scheduleArrival() {
                this.schedule(() => {
                    this.log(`Antrean Masuk: Truk ${this.data.plate} mendekati gerbang PLB`, 'system');
                    this.triggerArrival();
                }, 1200);
            },

            toggleAuto(on) {
                this.state.auto = on;
                this.log(`Mode Otomatis ${on ? 'AKTIF' : 'NONAKTIF'}.`, 'system');
                if (!on) return;
                if (this.state.isTampered) this.schedule(() => this.finishTruck('tamper'), 1000);
                else if (this.state.isCleared) this.schedule(() => this.finishTruck('ok'), 1000);
                else if (!this.state.isArrived) this.scheduleArrival();
            },

            setSpeed(n) {
                SPEED = n;
                [0.5, 1, 2].forEach(k => {
                    const el = document.getElementById('spd-' + k);
                    if (el) el.className = 'px-2 py-0.5 rounded font-bold ' + (k === n ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300');
                });
                this.log(`Kecepatan simulasi: ${n}x`, 'system');
            },

            setStep(i, tone) {
                for (let k = 0; k < 6; k++) {
                    const el = document.getElementById('step-' + k);
                    if (!el) continue;
                    let base = 'text-center text-[10px] font-extrabold uppercase tracking-wider py-1.5 rounded-lg border transition-all ';
                    if (k < i) el.className = base + 'bg-emerald-950/40 text-emerald-400 border-emerald-500/50';
                    else if (k === i) {
                        if (tone === 'error') el.className = base + 'bg-rose-950/60 text-rose-300 border-rose-500 blink-slow';
                        else if (tone === 'warn') el.className = base + 'bg-amber-950/60 text-amber-300 border-amber-500 blink-slow';
                        else el.className = base + 'bg-blue-950/60 text-blue-300 border-blue-500 blink-slow';
                    } else el.className = base + 'bg-slate-900 border-slate-800 text-slate-500';
                }
            },

            getOperationalTimeline(limit=20) {
                const events=[];
                Object.values(this.cases).forEach(c=>{
                    (c.timeline||[]).forEach(t=>events.push({time:t.time||'-',actor:t.actor||'SYSTEM',container:c.containerNo,event:t.event||'-',severity:t.status==='CRITICAL'?'CRITICAL':t.status==='ACTIVE'?'HIGH':'INFO'}));
                });
                this.auditTrail.slice(0,50).forEach(a=>events.push({time:a.time,actor:a.actor,container:a.container,event:a.action,severity:a.severity}));
                return events.slice(0,limit);
            },
            exportOperationsReport() {
                const cases=Object.values(this.cases), exceptions=this.getExceptions();
                const lines=[
                    'PLB INTEGRATED OPERATIONS REPORT',
                    'Generated: '+new Date().toLocaleString('id-ID',{hour12:false}),
                    'Active role: '+this.phase5.activeRole,
                    '',
                    'KPI',
                    'Total cases: '+cases.length,
                    'Cleared: '+cases.filter(c=>c.customsStatus==='CLEARED').length,
                    'Hold/blocked: '+cases.filter(c=>c.customsStatus==='HOLD'||c.gateStatus==='BLOCKED').length,
                    'Gate-out ready: '+cases.filter(c=>c.customsStatus==='CLEARED'&&c.esealStatus==='RELEASED'&&c.rfidStatus==='DETECTED').length,
                    'Yard occupancy: '+new Set(cases.map(c=>c.yardLocation).filter(Boolean)).size+'/'+this.yardCapacity,
                    'Exceptions: '+exceptions.length,
                    '',
                    'CASE REGISTER',
                    ...cases.map(c=>[c.containerNo,c.shipmentId,c.importer,c.customsStatus,c.gateStatus,c.yardLocation,c.rfidStatus,c.esealStatus].join(' | ')),
                    '',
                    'EXCEPTIONS',
                    ...(exceptions.length?exceptions.map(e=>[e.caseId,e.type,e.severity,e.text].join(' | ')):['NONE']),
                    '',
                    'CEISA TRANSACTIONS',
                    ...(this.ceisaTransactions.length?this.ceisaTransactions.map(t=>[t.id,t.caseId,t.status,t.response,t.document].join(' | ')):['NONE'])
                ];
                const a=document.createElement('a'); a.href=URL.createObjectURL(new Blob([lines.join('\n')],{type:'text/plain;charset=utf-8'})); a.download='PLB-operations-report-'+new Date().toISOString().slice(0,10)+'.txt'; a.click(); this.recordAudit('Operations report exported','CONTROL TOWER',this.activeCaseId,'INFO','KPI + case register + exceptions + CEISA');
            },
            exportManifestCSV() {
                const header=['Container','Shipment','BL','Importer','HS Code','Weight KG','Customs','Gate','Yard','RFID','E-Seal','Truck'];
                const rows=Object.values(this.cases).map(c=>[c.containerNo,c.shipmentId,c.blNumber,c.importer,c.hsCode,c.grossWeight,c.customsStatus,c.gateStatus,c.yardLocation,c.rfidStatus,c.esealStatus,c.truckPlate]);
                const esc=v=>'"'+String(v??'').replace(/"/g,'""')+'"';
                const csv=[header,...rows].map(r=>r.map(esc).join(',')).join('\n');
                const a=document.createElement('a'); a.href=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'})); a.download='PLB-manifest-'+new Date().toISOString().slice(0,10)+'.csv'; a.click();
                this.recordAudit('Manifest CSV exported','CONTROL TOWER',this.activeCaseId,'INFO',rows.length+' cases');
            },
            setActiveRole(role) {
                if(!this.phase5.roles.includes(role)) return;
                this.phase5.activeRole=role;
                this.recordAudit('Operational role switched',role,this.activeCaseId,'INFO','Control Tower context updated');
                this.renderOpsPanel('control');
            },
            refreshControlTower() {
                this.phase5.lastRefresh=Date.now();
                this.recordAudit('Control Tower refreshed','CONTROL TOWER',this.activeCaseId,'INFO','KPI and operational timeline recalculated');
                this.renderOpsPanel('control');
            },

            approveEnterpriseChange(id){
                const x=this.enterprise.changes.find(c=>c.id===id);
                if(!x)return;
                x.status='APPROVED';
                fetch('api.php?action=approve_change', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id })
                }).catch(e=>{});
                this.recordAudit('Enterprise change approved','BUSINESS ANALYST',this.activeCaseId,'INFO',id+' / '+x.title);
                this.renderOpsPanel('change');
            },
            progressWorkOrder(id){
                const x=this.enterprise.workorders.find(w=>w.id===id);
                if(!x)return;
                const flow=['SCHEDULED','IN PROGRESS','PENDING PARTS','COMPLETED'];
                const i=flow.indexOf(x.status);
                x.status=flow[Math.min(i+1,flow.length-1)];
                fetch('api.php?action=progress_workorder', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id, status: x.status })
                }).catch(e=>{});
                this.recordAudit('Work order status updated','MAINTENANCE',this.activeCaseId,'INFO',id+' -> '+x.status);
                this.renderOpsPanel('workorders');
            },

            exportLog() {
                const lines=this.auditTrail.map(x=>[x.time,x.actor,x.container,x.severity,x.action,x.detail||''].join(' | '));
                const raw=(lines.length?lines.join('\n'):'No Phase 4 audit events')+'\n\n--- LEGACY TERMINAL ---\n'+(this.ui.terminal?.innerText||'');
                const a=document.createElement('a'); a.href=URL.createObjectURL(new Blob([raw],{type:'text/plain'})); a.download='audit-trail-plb-phase5.txt'; a.click();
            },

            showTeamModal() {
                document.getElementById('modal-team').classList.remove('hidden');
            },

            showEsealDetailModal() {
                const code = this.data.sscc !== '-' ? this.data.sscc : '(00)389912345000000128';
                document.getElementById('modal-sscc-code').innerText = 'ID: ' + code;
                const qrBox = document.getElementById('qrcode-box');
                qrBox.innerHTML = '';
                new QRCode(qrBox, {
                    text: "https://beacukai.go.id/ceisa40/verify?sscc=" + encodeURIComponent(code) + "&plate=" + encodeURIComponent(this.data.plate),
                    width: 140,
                    height: 140,
                    colorDark: "#0f172a",
                    colorLight: "#ffffff"
                });
                document.getElementById('modal-eseal').classList.remove('hidden');
            },

            generateSPPBDocument() {
                const sppbBox = document.getElementById('sppb-print-content');
                const now = new Date();
                sppbBox.innerHTML = `
                    <div class="grid grid-cols-2 gap-2 text-xs bg-slate-100 p-3 rounded border border-slate-300 mb-2">
                        <div><strong>NOMOR DOKUMEN:</strong> ${this.data.doc}</div>
                        <div><strong>TANGGAL PENERBITAN:</strong> ${now.toLocaleDateString('id-ID')}</div>
                        <div><strong>KANTOR PABEAN:</strong> KPU TIPE A TANJUNG PRIOK</div>
                        <div><strong>KODE FASILITAS:</strong> PUSAT LOGISTIK BERIKAT (PLB)</div>
                    </div>
                    <div class="border border-slate-300 p-3 rounded space-y-1">
                        <p><strong>NAMA IMPORTIR:</strong> ${this.ui.mFirm.innerText}</p>
                        <p><strong>NOMOR POLISI ARMADA:</strong> ${this.data.plate}</p>
                        <p><strong>IDENTITAS E-SEAL RFID:</strong> ${this.data.sscc}</p>
                        <p><strong>KLASIFIKASI HS CODE:</strong> ${this.ui.mHs.innerText}</p>
                        <p><strong>BERAT BERSIH/KOTOR:</strong> ${this.data.declaredKg.toLocaleString('id-ID')} KG (Aktual: ${this.data.actualKg ? this.data.actualKg.toLocaleString('id-ID') + ' KG' : 'Terverifikasi'})</p>
                    </div>
                    <div class="p-3 bg-emerald-50 border border-emerald-300 rounded text-emerald-900 mt-2">
                        <p class="font-bold text-sm">STATUS KEPABEANAN: SPPB DIBERIKAN (JALUR HIJAU)</p>
                        <p class="text-[11px] mt-0.5">Barang impor yang tercantum di atas telah memenuhi ketentuan perundang-undangan kepabeanan dan diizinkan keluar menuju Gudang PLB.</p>
                    </div>
                `;
                document.getElementById('modal-sppb').classList.remove('hidden');
            },

            showPayloadViewer() {
                const payload = {
                    version: "CEISA_4.0_EDI_JSON_v3.2",
                    transport_protocol: "Wi-Fi 6 Industrial Mesh / HTTPS REST",
                    transaction_id: "TXN-" + this.hex(16).toUpperCase(),
                    customs_office: "040300 - KPU TANJUNG PRIOK",
                    facility: "PUSAT LOGISTIK BERIKAT (PLB)",
                    truck_carrier: { plate_number: this.getCase(this.activeCaseId)?.truckPlate || this.data.plate, gate_point: this.data.gateId },
                    eseal_rfid: {
                        sscc_id: this.getCase(this.activeCaseId)?.esealId || this.data.sscc,
                        frequency: "UHF 920-925 MHz",
                        tamper_status: this.state.isTampered ? "BREACHED" : "INTACT",
                        lock_state: this.state.isCleared ? "UNLOCKED" : "LOCKED"
                    }, 
                    customs_status: this.getCase(this.activeCaseId)?.customsStatus || 'UNKNOWN',
                    customs_document: this.getCase(this.activeCaseId)?.customsDocument || this.data.doc,
                    weight: { declared: this.getCase(this.activeCaseId)?.grossWeight || this.data.declaredKg, actual: this.data.actualKg || this.getCase(this.activeCaseId)?.grossWeight || this.data.declaredKg }
                };
                document.getElementById('raw-payload-box').innerText = JSON.stringify(payload, null, 2);
                document.getElementById('modal-payload').classList.remove('hidden');
            },

            copyPayload() {
                const box = document.getElementById('raw-payload-box');
                if (!box) { this.showPayloadViewer(); return; }
                const txt = box.innerText;
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    navigator.clipboard.writeText(txt).then(() => alert('Payload JSON CEISA 4.0 berhasil disalin!')).catch(() => alert(txt));
                } else {
                    alert(txt);
                }
            },

            closeModal(id) {
                document.getElementById(id).classList.add('hidden');
            },

            hex(n) {
                let r = '';
                for (let i = 0; i < n; i++) r += Math.floor(Math.random() * 16).toString(16);
                return r;
            }
        };

        
        // PHASE 6 — reliable floating dropdown controller
