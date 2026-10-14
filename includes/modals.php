    <!-- PHASE 1: SHIPMENT / CONTAINER CASE MODAL -->
    <div id="modal-case" class="fixed inset-0 z-[60] hidden bg-black/80 p-4 overflow-y-auto">
        <div class="max-w-7xl mx-auto my-6 bg-slate-950 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden">
            <div class="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900">
                <div>
                    <div class="text-[10px] uppercase tracking-widest font-black text-blue-400">PLB / SHIPMENT CASE</div>
                    <h3 class="text-xl font-black text-white mt-1">Container Operational Case</h3>
                    <p class="text-[11px] text-slate-500 mt-0.5">Single source of truth untuk identitas dan perjalanan satu shipment.</p>
                </div>
                <button onclick="app.closeModal('modal-case')" class="w-9 h-9 rounded-lg bg-slate-800 text-slate-300 hover:text-white"><i class="fa-solid fa-xmark"></i></button>
            </div>
            <div data-case-body class="p-5"></div>
        </div>
    </div>

    <!-- MODAL 1: TEAM PROFILE MODAL -->
    <div id="modal-team" class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 hidden p-4">
        <div class="glass-modal max-w-lg w-full rounded-2xl p-6 shadow-2xl border border-indigo-500/30">
            <div class="flex justify-between items-center mb-4">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold"><i class="fa-solid fa-graduation-cap"></i></div>
                    <div>
                        <h3 class="text-base font-bold text-white">Tim Kelompok 8 - Spesialisasi IT Logistik</h3>
                        <p class="text-xs text-indigo-300">Dosen Pengampu: Dr. Tigor Franky, S.T., M.T.</p>
                    </div>
                </div>
                <button onclick="app.closeModal('modal-team')" class="text-slate-400 hover:text-white text-lg"><i class="fa-solid fa-xmark"></i></button>
            </div>
            <div class="space-y-2.5 text-xs mb-5">
                <div class="bg-slate-900 p-3 rounded-xl border border-slate-800">
                    <p class="font-bold text-white">Syalom Jovanka Putri Wardono (24D507001027)</p>
                    <p class="text-indigo-400 font-semibold text-[11px]">Lead System Architect & QA</p>
                    <p class="text-slate-400 mt-0.5">Perancangan arsitektur integrasi sistem logistik menyeluruh & Quality Assurance.</p>
                </div>
                <div class="bg-slate-900 p-3 rounded-xl border border-slate-800">
                    <p class="font-bold text-white">Riyu Abadi Samudra (24D507001024)</p>
                    <p class="text-indigo-400 font-semibold text-[11px]">Hardware & Infrastructure Specialist</p>
                    <p class="text-slate-400 mt-0.5">Spesifikasi perangkat keras E-Seal RFID, tata letak sensor lapangan & CAPEX.</p>
                </div>
                <div class="bg-slate-900 p-3 rounded-xl border border-slate-800">
                    <p class="font-bold text-white">Maulana Malik Ibrahim (24D507001021)</p>
                    <p class="text-indigo-400 font-semibold text-[11px]">Software & ERP Process Specialist</p>
                    <p class="text-slate-400 mt-0.5">Flowchart operasional Warehouse Management System (WMS) & antarmuka PLB.</p>
                </div>
                <div class="bg-slate-900 p-3 rounded-xl border border-slate-800">
                    <p class="font-bold text-white">Muhammad Saamii (24D507001029)</p>
                    <p class="text-indigo-400 font-semibold text-[11px]">Data Integration Specialist</p>
                    <p class="text-slate-400 mt-0.5">Arsitektur penghubung data melalui standar API/EDI CEISA Bea Cukai & simulasi PoC.</p>
                </div>
            </div>
            <button onclick="app.closeModal('modal-team')" class="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-xs">Tutup</button>
        </div>
    </div>

    <!-- MODAL 2: SPPB OFFICIAL DOCUMENT PRINT VIEW -->
    <div id="modal-sppb" class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 hidden p-4">
        <div class="bg-white text-slate-900 max-w-2xl w-full rounded-2xl p-6 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div class="border-b-2 border-slate-900 pb-3 mb-4 flex justify-between items-center">
                <div>
                    <h2 class="text-base font-extrabold uppercase tracking-wide">Direktorat Jenderal Bea dan Cukai</h2>
                    <p class="text-xs text-slate-600 font-bold">SURAT PERSETUJUAN PENGELUARAN BARANG (SPPB) ELEKTRONIK</p>
                </div>
                <button onclick="app.closeModal('modal-sppb')" class="text-slate-400 hover:text-black text-xl"><i class="fa-solid fa-xmark"></i></button>
            </div>
            <div id="sppb-print-content" class="text-xs space-y-3 font-mono"></div>
            <div class="mt-6 pt-4 border-t border-slate-200 flex justify-end gap-2">
                <button onclick="window.print()" class="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold">
                    <i class="fa-solid fa-print mr-1"></i> Cetak / Simpan PDF
                </button>
                <button onclick="app.closeModal('modal-sppb')" class="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg text-xs font-bold">Tutup</button>
            </div>
        </div>
    </div>

    <!-- MODAL 3: E-SEAL QR CODE -->
    <div id="modal-eseal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 hidden p-4">
        <div class="glass-modal max-w-sm w-full rounded-2xl p-6 shadow-2xl text-center border border-slate-700">
            <h3 class="text-sm font-bold text-white mb-1">Verifikasi Digital E-Seal Kontainer</h3>
            <p class="text-[11px] text-slate-400 mb-4">Pindai QR ini melalui smartphone petugas pemeriksa pabean</p>
            <div class="bg-white p-3 rounded-xl inline-block shadow-lg mx-auto mb-3" id="qrcode-box"></div>
            <p id="modal-sscc-code" class="font-mono text-xs font-bold text-blue-400 mb-4 truncate">-</p>
            <button onclick="app.closeModal('modal-eseal')" class="w-full py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold text-xs">Selesai</button>
        </div>
    </div>

    <!-- MODAL 4: PAYLOAD JSON VIEWER -->
    <div id="modal-payload" class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 hidden p-4">
        <div class="glass-modal max-w-xl w-full rounded-2xl p-5 shadow-2xl border border-slate-700 flex flex-col max-h-[85vh]">
            <div class="flex justify-between items-center mb-3">
                <h3 class="text-sm font-bold text-white flex items-center gap-2">
                    <i class="fa-solid fa-code text-emerald-400"></i> CEISA 4.0 API EDIFACT / JSON Payload
                </h3>
                <button onclick="app.closeModal('modal-payload')" class="text-slate-400 hover:text-white text-lg"><i class="fa-solid fa-xmark"></i></button>
            </div>
            <pre id="raw-payload-box" class="bg-slate-950 p-3 rounded-xl border border-slate-800 text-[10px] font-mono text-emerald-400 overflow-y-auto flex-grow leading-relaxed"></pre>
            <div class="mt-3 flex justify-end gap-2">
                <button onclick="app.copyPayload()" class="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold">
                    <i class="fa-regular fa-copy mr-1"></i> Salin JSON
                </button>
                <button onclick="app.closeModal('modal-payload')" class="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold">Tutup</button>
            </div>
        </div>
    </div>

