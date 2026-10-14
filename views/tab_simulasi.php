        <!-- TAB 1: SIMULASI OPERASIONAL (3D HARBOR & YARD) -->
        <section id="tab-simulasi" class="flex-grow flex flex-col p-3.5 gap-3 min-h-0 overflow-hidden">
            <!-- Stepper A to Z Status Bar -->
            <div id="stepper" class="grid grid-cols-6 gap-2 shrink-0">
                <div id="step-0" class="text-center text-[10px] font-extrabold uppercase tracking-wider py-1.5 rounded-lg border bg-slate-900 border-slate-800 text-slate-500">① Truk Kosong Masuk</div>
                <div id="step-1" class="text-center text-[10px] font-extrabold uppercase tracking-wider py-1.5 rounded-lg border bg-slate-900 border-slate-800 text-slate-500">② RFID Gate Scan</div>
                <div id="step-2" class="text-center text-[10px] font-extrabold uppercase tracking-wider py-1.5 rounded-lg border bg-slate-900 border-slate-800 text-slate-500">③ Timbang &amp; Validasi</div>
                <div id="step-3" class="text-center text-[10px] font-extrabold uppercase tracking-wider py-1.5 rounded-lg border bg-slate-900 border-slate-800 text-slate-500">④ CEISA Clearance</div>
                <div id="step-4" class="text-center text-[10px] font-extrabold uppercase tracking-wider py-1.5 rounded-lg border bg-slate-900 border-slate-800 text-slate-500">⑤ Muat di Gantry RTG</div>
                <div id="step-5" class="text-center text-[10px] font-extrabold uppercase tracking-wider py-1.5 rounded-lg border bg-slate-900 border-slate-800 text-slate-500">⑥ Gate 02 Keluar PLB</div>
            </div>

            <!-- Main Work Area (3 Columns: 3D Viewport, Control Panel, Audit/KPI Log) -->
            <div class="grid grid-cols-12 gap-3.5 flex-grow min-h-0">
                
                <!-- Center Left: Rich 3D Simulation Viewport (Spans 6 cols) -->
                <div class="col-span-6 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xl flex flex-col relative overflow-hidden min-h-[500px]">
                    <!-- CCTV HUD Bar (Real-Time Terminal CCTV Look & Feel) -->
                    <div class="absolute top-2.5 left-3 right-3 z-30 flex justify-between items-center pointer-events-none">
                        <div class="flex items-center gap-2 pointer-events-auto bg-slate-950/85 backdrop-blur-md px-2.5 py-1 rounded-xl border border-slate-800">
                            <span class="w-2 h-2 rounded-full bg-red-600 blink-fast shadow-[0_0_8px_#ef4444]"></span>
                            <span class="text-[9px] font-mono font-bold text-white tracking-widest uppercase">REC [CAM-04 PLB GATE]</span>
                            <span class="text-[9px] font-mono text-slate-400 border-l border-slate-700 pl-2" id="cctv-timestamp">2026-10-05 14:58:30</span>
                        </div>
                        <div class="flex items-center gap-1.5 pointer-events-auto bg-slate-950/85 backdrop-blur-md px-2 py-1 rounded-xl border border-slate-800">
                            <span id="gate-status" class="text-[10px] font-extrabold text-amber-400 uppercase">MENUNGGU KEDATANGAN</span>
                            <button onclick="sim3D.setCameraPreset('GATE')" title="Kamera Gerbang" class="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[9px] font-bold">Cam Gate</button>
                            <button onclick="sim3D.setCameraPreset('SHIP')" title="Kamera Kapal" class="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[9px] font-bold">Cam Kapal</button>
                            <button onclick="sim3D.setCameraPreset('TRUCK')" title="Ikuti Truk" class="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[9px] font-bold">Cam Truk</button>
                            <button onclick="sim3D.toggleWalkMode()" title="Mode Jalan Orang (WASD)" id="btn-walk-mode" class="px-2 py-0.5 rounded bg-indigo-600 hover:bg-indigo-500 text-white text-[9px] font-bold shadow">🚶 Walk (WASD)</button>
                            <button onclick="sim3D.resetCamera()" title="Reset Kamera" class="w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center text-[10px]">
                                <i class="fa-solid fa-arrows-rotate"></i>
                            </button>
                        </div>
                    </div>

                    <!-- CCTV Corner markings overlay -->
                    <div class="absolute inset-0 pointer-events-none z-20 border-[1px] border-white/5 m-2 rounded-xl">
                        <div class="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-white/30"></div>
                        <div class="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-white/30"></div>
                        <div class="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-white/30"></div>
                        <div class="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-white/30"></div>
                    </div>

                    <!-- 3D Canvas -->
                    <div class="w-full h-full relative" id="canvas3d-container"></div>

                    <!-- ROBLOX PROXIMITY PROMPT (Tombol F) -->
                    <!-- Hapus 'inset-0' dan 'justify-center', ganti dengan '-translate-x-1/2 -translate-y-1/2' agar titik kordinatnya ada di tengah -->
                    <div id="roblox-prompt" class="absolute pointer-events-none z-30 hidden -translate-x-1/2 -translate-y-1/2 transition-opacity duration-200">
                        <div class="bg-slate-900 border border-slate-500/50 pl-2 pr-4 py-2 rounded-xl flex items-center gap-3 shadow-2xl transform transition-all animate-pulse">
                            <div id="roblox-prompt-key" class="w-8 h-8 bg-white text-black font-black flex items-center justify-center rounded-lg shadow-[0_4px_0_#cbd5e1] text-lg leading-none">F</div>
                            <span id="roblox-prompt-text" class="text-white font-bold tracking-wide text-sm">Periksa Dokumen</span>
                        </div>
                    </div>

                    <!-- GATE 02 OUTBOUND OPERATOR PANEL -->
                    <div id="gate02-controls" class="absolute bottom-12 left-4 z-30 hidden w-72 bg-slate-950/95 backdrop-blur-md border border-emerald-500/30 rounded-2xl p-3 shadow-2xl">
                        <div class="flex items-center justify-between mb-2">
                            <div>
                                <div class="text-[10px] font-black text-emerald-400 uppercase tracking-wider">GATE 02 — OUTBOUND</div>
                                <div id="gate02-control-status" class="text-[9px] text-slate-400 mt-0.5">Truk siap diperiksa</div>
                            </div>
                            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                        </div>
                        <div class="grid grid-cols-2 gap-2">
                            <button id="btn-gate02-inspect" onclick="app.inspectOutboundDocuments()" class="px-2.5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-[10px] font-black uppercase transition-all">
                                <i class="fa-solid fa-file-circle-check mr-1"></i> Periksa Dokumen Keluar
                            </button>
                            <button id="btn-gate02-open" onclick="app.openOutboundGateManual()" class="px-2.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-black uppercase transition-all disabled:opacity-40 disabled:cursor-not-allowed" disabled>
                                <i class="fa-solid fa-up-long mr-1"></i> Angkat Gerbang
                            </button>
                        </div>
                    </div>

                    <!-- WAREHOUSE OPERATOR PANEL -->
                    <div id="warehouse-controls" class="absolute bottom-12 right-4 z-30 w-60 bg-slate-950/95 backdrop-blur-md border border-blue-500/30 rounded-2xl p-3 shadow-2xl">
                        <div class="text-[10px] font-black text-blue-400 uppercase tracking-wider mb-2">WAREHOUSE ACCESS</div>
                        <div class="grid grid-cols-2 gap-2">
                            <button onclick="sim3D.setWarehouseLargeDoorOpen(true)" class="px-2 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-[9px] font-black uppercase">
                                <i class="fa-solid fa-warehouse mr-1"></i> Buka Pintu Besar
                            </button>
                            <button onclick="sim3D.setWarehouseLargeDoorOpen(false)" class="px-2 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-[9px] font-black uppercase">
                                Tutup
                            </button>
                            <button onclick="sim3D.setWarehouseSmallDoorOpen(true)" class="px-2 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-[9px] font-black uppercase">
                                <i class="fa-solid fa-door-open mr-1"></i> Buka Pintu Kecil
                            </button>
                            <button onclick="sim3D.setWarehouseSmallDoorOpen(false)" class="px-2 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-[9px] font-black uppercase">
                                Tutup
                            </button>
                        </div>
                        <div class="mt-2 text-[8px] text-slate-500 text-center uppercase tracking-wider">
                            Truk operasional di holding area — dekati lalu tekan E
                        </div>
                    </div>

                    <!-- INSPECTION CHECKPOINT MODAL OVERLAY (Pengecekan Fisik & Pabean Sebelum Lewat) -->
                    <div id="inspection-overlay" class="absolute inset-0 bg-slate-950/75 backdrop-blur-md z-30 flex items-center justify-center p-4 hidden">
                        <div class="glass-modal max-w-md w-full rounded-2xl p-5 border border-amber-500/40 shadow-2xl space-y-3.5">
                            <div class="flex items-center justify-between border-b border-slate-800 pb-2.5">
                                <div class="flex items-center gap-2.5">
                                    <div class="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center font-bold">
                                        <i class="fa-solid fa-clipboard-check text-base"></i>
                                    </div>
                                    <div>
                                        <h4 class="text-xs font-black text-white uppercase tracking-wider">POS PEMERIKSAAN KEPABEANAN (PLB GATE)</h4>
                                        <p class="text-[10px] text-amber-400 font-semibold">Verifikasi Wajib Sebelum Pelepasan Segel & Gate-Out</p>
                                    </div>
                                </div>
                                <span class="text-[10px] bg-amber-500/20 text-amber-300 font-mono px-2 py-0.5 rounded border border-amber-500/30">STOP AT GATE</span>
                            </div>

                            <!-- Inspection Details Table -->
                            <div class="bg-slate-950 p-3 rounded-xl border border-slate-800 text-[11px] space-y-1.5 font-mono">
                                <div class="flex justify-between"><span class="text-slate-500">No. Polisi Truk:</span><span id="chk-plate" class="text-amber-400 font-bold">B 9021 TXT</span></div>
                                <div class="flex justify-between"><span class="text-slate-500">ID E-Seal (SSCC):</span><span id="chk-sscc" class="text-blue-400 font-bold truncate max-w-[180px]">-</span></div>
                                <div class="flex justify-between"><span class="text-slate-500">Dokumen Pabean:</span><span id="chk-doc" class="text-slate-200">000482/BC23/2026</span></div>
                                <div class="flex justify-between"><span class="text-slate-500">Timbangan Aktual:</span><span id="chk-weight" class="text-emerald-400 font-bold">-</span></div>
                                <div class="flex justify-between"><span class="text-slate-500">Keputusan CEISA:</span><span id="chk-ceisa-status" class="text-emerald-400 font-bold uppercase">SPPB VALID (HIJAU)</span></div>
                            </div>

                            <!-- 3 Checklist Mandatory Conditions -->
                            <div class="space-y-2 text-xs">
                                <label class="flex items-center gap-2.5 p-2 bg-slate-900/90 rounded-lg border border-slate-800 cursor-pointer hover:border-slate-700">
                                    <input type="checkbox" id="v-doc" checked class="rounded bg-slate-950 border-slate-700 text-blue-500">
                                    <span class="text-slate-200 text-[11px]">1. Validasi Dokumen BC 2.3 & Manifest Impor Cocok</span>
                                </label>
                                <label class="flex items-center gap-2.5 p-2 bg-slate-900/90 rounded-lg border border-slate-800 cursor-pointer hover:border-slate-700">
                                    <input type="checkbox" id="v-seal" checked class="rounded bg-slate-950 border-slate-700 text-blue-500">
                                    <span class="text-slate-200 text-[11px]">2. Kabel E-Seal Utuh & Sirkuit Tamper Tidak Terputus</span>
                                </label>
                                <label class="flex items-center gap-2.5 p-2 bg-slate-900/90 rounded-lg border border-slate-800 cursor-pointer hover:border-slate-700">
                                    <input type="checkbox" id="v-weight" checked class="rounded bg-slate-950 border-slate-700 text-blue-500">
                                    <span class="text-slate-200 text-[11px]">3. Toleransi Selisih Timbangan Masih Sesuai (&lt; 5%)</span>
                                </label>
                            </div>

                            <!-- Action Buttons to Release -->
                            <div class="pt-1 flex gap-2">
                                <button onclick="app.closeInspectionModal()" class="px-3 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold border border-slate-700 transition-all">
                                    <i class="fa-solid fa-arrow-left mr-1"></i> Kembali
                                </button>
                                <button onclick="app.confirmInspectionRelease()" class="flex-1 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold uppercase shadow-lg shadow-emerald-900/40 transition-all flex items-center justify-center gap-2">
                                    <i class="fa-solid fa-lock-open"></i> Otorisasi & Lepas E-Seal
                                </button>
                                <button onclick="app.rejectInspectionHold()" class="px-3 py-2.5 bg-slate-800 hover:bg-rose-900/60 text-slate-300 hover:text-white rounded-xl text-xs font-bold border border-slate-700 transition-all">
                                    Tahan Kargo
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Bottom HUD Hint -->
                    <div class="absolute bottom-2.5 left-3 pointer-events-none text-[10px] text-slate-400 bg-slate-950/80 backdrop-blur px-2.5 py-1 rounded-lg border border-slate-800">
                        <i class="fa-solid fa-camera mr-1 text-blue-400"></i> Drag mouse: Rotasi / Pan • Scroll: Zoom
                    </div>
                </div>

                <!-- Center: Telemetry & Scenario Controls (Spans 3 cols) -->
                <div class="col-span-3 flex flex-col gap-3 min-h-0 overflow-y-auto">
                    <!-- E-Seal IoT Physical Telemetry Box -->
                    <div class="bg-slate-900/90 border border-slate-800 p-3.5 rounded-2xl shadow-xl space-y-2.5">
                        <div class="flex justify-between items-center">
                            <h3 class="text-xs font-bold text-slate-300 uppercase tracking-widest flex items-center gap-1.5">
                                <i class="fa-solid fa-microchip text-blue-400"></i> Telemetri E-Seal
                            </h3>
                            <span class="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/30">Wi-Fi 6 Mesh</span>
                        </div>

                        <!-- Grid Telemetry -->
                        <div class="grid grid-cols-2 gap-2 text-[11px]">
                            <div class="bg-slate-950 p-2 rounded-xl border border-slate-800">
                                <span class="text-[9px] text-slate-400 font-semibold block uppercase">ID Segel (SSCC)</span>
                                <span id="ui-sscc" class="font-mono font-bold text-blue-400 truncate block mt-0.5">-</span>
                            </div>
                            <div class="bg-slate-950 p-2 rounded-xl border border-slate-800">
                                <span class="text-[9px] text-slate-400 font-semibold block uppercase">Sensor Fisik</span>
                                <span id="ui-sensor" class="font-bold text-slate-400 flex items-center gap-1.5 mt-0.5">
                                    <span class="w-2 h-2 rounded-full bg-slate-600 inline-block"></span> Standby
                                </span>
                            </div>
                        </div>

                        <div class="grid grid-cols-3 gap-2 text-[11px]">
                            <div class="bg-slate-950 p-2 rounded-xl border border-slate-800 text-center">
                                <span class="text-[8px] text-slate-400 font-bold block uppercase">Baterai</span>
                                <span id="ui-battery" class="font-mono font-bold text-slate-300">-</span>
                            </div>
                            <div class="bg-slate-950 p-2 rounded-xl border border-slate-800 text-center">
                                <span class="text-[8px] text-slate-400 font-bold block uppercase">Sinyal</span>
                                <span id="ui-signal" class="font-mono font-bold text-slate-300">-</span>
                            </div>
                            <div class="bg-slate-950 p-2 rounded-xl border border-slate-800 text-center">
                                <span class="text-[8px] text-slate-400 font-bold block uppercase">Timbangan</span>
                                <span id="ui-weight" class="font-mono font-bold text-slate-300">-</span>
                            </div>
                        </div>

                        <!-- Big Dynamic E-Seal Status Card -->
                        <div id="ui-lock-panel" class="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center gap-3 relative overflow-hidden transition-all duration-500">
                            <div id="ui-lock-glow" class="absolute inset-0 bg-slate-900/40"></div>
                            <div id="ui-lock-icon-bg" class="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center border border-slate-700 shadow-md relative z-10">
                                <i id="ui-lock-icon" class="fa-solid fa-lock text-slate-400"></i>
                            </div>
                            <div class="relative z-10">
                                <h4 id="ui-lock-title" class="text-xs font-black text-slate-400 tracking-wider uppercase">STANDBY</h4>
                                <p id="ui-lock-desc" class="text-[10px] text-slate-400 leading-tight">Menunggu kontainer merapat ke gerbang...</p>
                            </div>
                        </div>
                    </div>

                    <!-- Scenario Controls & Manual Actions -->
                    <div class="bg-slate-900/90 border border-slate-800 p-3.5 rounded-2xl shadow-xl space-y-2.5 flex-grow flex flex-col">
                        <h3 class="text-xs font-bold text-slate-300 uppercase tracking-widest flex items-center gap-1.5">
                            <i class="fa-solid fa-sliders text-indigo-400"></i> Panel Skenario CEISA
                        </h3>

                        <div class="bg-slate-950 p-2.5 rounded-xl border border-slate-800 space-y-2">
                            <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Keluaran Status Bea Cukai:</label>
                            <select id="sel-scenario" class="w-full bg-slate-900 text-slate-200 text-xs rounded-lg border border-slate-700 p-2 focus:outline-none">
                                <option value="CLEAR">🟢 200 OK: Jalur Hijau (SPPB / Release)</option>
                                <option value="HOLD">🟡 200 OK: Jalur Merah (Inspeksi Fisik)</option>
                                <option value="REJECT">🔴 422: Dokumen Tidak Cocok (Revisi)</option>
                                <option value="TIMEOUT">⏱️ 503: Gateway Timeout & Retry</option>
                                <option value="TAMPER">⚠️ Sabotase E-Seal (Tamper Alert)</option>
                                <option value="RANDOM">🎲 Acak Dinamis</option>
                            </select>

                            <div class="pt-1.5 border-t border-slate-800 flex flex-col gap-1.5">
                                <label class="flex items-center gap-2 text-[11px] text-emerald-400 font-semibold cursor-pointer">
                                    <input type="checkbox" id="chk-auto" checked onchange="app.toggleAuto(this.checked)" class="rounded bg-slate-900 border-slate-700 text-emerald-500">
                                    Otomasi Antrean Truk Berlanjut
                                </label>
                                <label class="flex items-center gap-2 text-[11px] text-slate-400 cursor-pointer">
                                    <input type="checkbox" id="chk-weight" class="rounded bg-slate-900 border-slate-700 text-blue-500">
                                    Paksa Selisih Berat &gt; 5%
                                </label>
                            </div>
                        </div>

                        <!-- Action Buttons -->
                        <div class="space-y-2 mt-auto">
                            <button id="btn-arrive" onclick="app.triggerArrival()" class="w-full p-2.5 bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-600 hover:to-blue-500 rounded-xl text-left border border-blue-400/40 shadow-lg shadow-blue-900/30 transition-all flex items-center justify-between">
                                <div>
                                    <span class="text-[9px] font-bold text-blue-200 uppercase block">Tahap 1</span>
                                    <span class="text-xs font-bold text-white">Truk Masuk Gerbang PLB</span>
                                </div>
                                <i class="fa-solid fa-truck-moving text-lg text-white/50"></i>
                            </button>

                            <button id="btn-api" onclick="app.triggerAPI()" class="state-disabled w-full p-2.5 bg-gradient-to-r from-emerald-700 to-teal-600 hover:from-emerald-600 hover:to-teal-500 rounded-xl text-left border border-emerald-400/40 shadow-lg shadow-emerald-900/30 transition-all flex items-center justify-between">
                                <div>
                                    <span class="text-[9px] font-bold text-emerald-200 uppercase block">Tahap 2</span>
                                    <span class="text-xs font-bold text-white" id="btn-api-text">Verifikasi API CEISA 4.0</span>
                                </div>
                                <i class="fa-solid fa-satellite-dish text-lg text-white/50"></i>
                            </button>

                            <button id="btn-sabotage" onclick="app.triggerSabotage()" class="state-disabled w-full p-2 bg-gradient-to-r from-rose-900 to-red-800 hover:from-rose-800 hover:to-red-700 rounded-xl text-left border border-rose-500/40 transition-all flex items-center justify-between">
                                <div>
                                    <span class="text-[8px] font-bold text-rose-200 uppercase block">Uji Keamanan</span>
                                    <span class="text-xs font-bold text-white">Sabotase E-Seal (Potong Kabel)</span>
                                </div>
                                <i class="fa-solid fa-scissors text-base text-white/50"></i>
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Right: Audit Terminal, Manifest & Live KPIs (Spans 3 cols) -->
                <div class="col-span-3 bg-slate-900/90 border border-slate-800 p-3.5 rounded-2xl shadow-xl flex flex-col h-full min-h-0">
                    <div class="flex justify-between items-center mb-2">
                        <h3 class="text-xs font-bold text-slate-300 uppercase tracking-widest flex items-center gap-1.5">
                            <i class="fa-solid fa-terminal text-emerald-400"></i> Audit Log CEISA
                        </h3>
                        <button onclick="app.exportLog()" class="text-[10px] bg-slate-800 hover:bg-slate-700 px-2 py-0.5 rounded text-slate-300">
                            <i class="fa-solid fa-download mr-1"></i>Ekspor
                        </button>
                    </div>

                    <!-- Mini KPI Row -->
                    <div class="grid grid-cols-3 gap-1.5 mb-2 text-center text-[10px]">
                        <div class="bg-slate-950 p-1.5 rounded-lg border border-slate-800">
                            <span id="kpi-trucks" class="font-mono font-bold text-white block text-sm">0</span>
                            <span class="text-[8px] text-slate-400 uppercase">Truk Selesai</span>
                        </div>
                        <div class="bg-slate-950 p-1.5 rounded-lg border border-slate-800">
                            <span id="kpi-clear" class="font-mono font-bold text-emerald-400 block text-sm">0</span>
                            <span class="text-[8px] text-slate-400 uppercase">SPPB Hijau</span>
                        </div>
                        <div class="bg-slate-950 p-1.5 rounded-lg border border-slate-800">
                            <span id="kpi-dwell" class="font-mono font-bold text-blue-400 block text-sm">3.8s</span>
                            <span class="text-[8px] text-slate-400 uppercase">Rata2 Dwell</span>
                        </div>
                    </div>

                    <!-- Manifest Card -->
                    <div class="bg-slate-950 p-2 rounded-xl border border-slate-800 text-[10px] space-y-1 mb-2">
                        <div class="flex justify-between"><span class="text-slate-500">No. BC 2.3:</span><span id="m-doc" class="font-mono text-slate-200 font-bold">000482/BC23/2026</span></div>
                        <div class="flex justify-between"><span class="text-slate-500">Plat Truk:</span><span id="truck-plate" class="font-bold text-amber-400 font-mono">B 9021 TXT</span></div>
                        <div class="flex justify-between"><span class="text-slate-500">HS Code:</span><span id="m-hs" class="text-slate-300 font-mono">8517.13 (Elektronik)</span></div>
                        <div class="flex justify-between"><span class="text-slate-500">Importir:</span><span id="m-firm" class="text-slate-300 font-semibold truncate max-w-[130px]">PT Nusantara Elektronik</span></div>
                        <div class="flex justify-between"><span class="text-slate-500">Berat Deklarasi:</span><span id="m-kg" class="text-slate-200 font-mono font-bold">18.450 kg</span></div>
                    </div>

                    <!-- Terminal Scrollbox -->
                    <div id="terminal-output" class="flex-grow bg-slate-950 rounded-xl border border-slate-800 p-2.5 font-mono text-[10px] overflow-y-auto leading-relaxed text-slate-300 shadow-inner">
                        <!-- Filled by JS -->
                    </div>
                </div>

            </div>
        </section>

        <!-- TAB 2: ARSITEKTUR 4 LAYER SISTEM PLB (DOSEN REQUIREMENT 1) -->
