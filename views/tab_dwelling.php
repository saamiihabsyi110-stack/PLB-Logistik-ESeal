        <section id="tab-dwelling" class="hidden flex-grow p-6 overflow-y-auto">
            <div class="max-w-5xl mx-auto space-y-6">
                <div>
                    <h2 class="text-xl font-extrabold text-white flex items-center gap-2">
                        <i class="fa-solid fa-stopwatch text-emerald-400"></i> Pengukuran & Pemangkasan Dwelling Time
                    </h2>
                    <p class="text-xs text-slate-400 mt-1">Komparasi waktu tunggu proses logistik pelabuhan: Metode Manual Tradisional vs Otomasi E-Seal PLB.</p>
                </div>

                <!-- Big Comparison Metric Cards -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div class="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
                        <span class="text-xs text-slate-400 font-semibold block uppercase">Metode Manual Konvensional</span>
                        <div class="text-2xl font-black text-rose-400 mt-1">3.8 Hari</div>
                        <p class="text-[11px] text-slate-500 mt-1">Pemeriksaan fisik dokumen, potong segel timah manual, antrean loket gerbang pelabuhan.</p>
                    </div>

                    <div class="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
                        <span class="text-xs text-slate-400 font-semibold block uppercase">Sistem E-Seal & Automatic Gate</span>
                        <div class="text-2xl font-black text-emerald-400 mt-1">1.2 Hari</div>
                        <p class="text-[11px] text-slate-500 mt-1">Pemindaian RFID instan saat truk jalan, verifikasi API CEISA & pelepasan kunci nirkabel.</p>
                    </div>

                    <div class="bg-slate-900 border border-emerald-500/30 p-4 rounded-2xl bg-emerald-950/20">
                        <span class="text-xs text-emerald-400 font-semibold block uppercase">Efisiensi Dwelling Time</span>
                        <div class="text-2xl font-black text-white mt-1">68.4% Lebih Cepat</div>
                        <p class="text-[11px] text-emerald-300 mt-1">Menghilangkan hambatan birokrasi di pintu gerbang (*demurrage cost saving*).</p>
                    </div>
                </div>

                <!-- Step-by-Step Dwelling Time Breakdown Bar -->
                <div class="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
                    <h3 class="text-sm font-bold text-white">Breakdown Titik Waktu Tunggu Logistik (Pelabuhan ➔ PLB)</h3>
                    
                    <div class="space-y-3 text-xs">
                        <div>
                            <div class="flex justify-between mb-1">
                                <span class="text-slate-300 font-semibold">1. Pre-Clearance (Bongkar Kapal di Dermaga & Penumpukan Yard)</span>
                                <span class="font-mono text-blue-400">18 Jam</span>
                            </div>
                            <div class="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                                <div class="bg-blue-600 h-2.5 rounded-full" style="width: 50%"></div>
                            </div>
                        </div>

                        <div>
                            <div class="flex justify-between mb-1">
                                <span class="text-slate-300 font-semibold">2. Customs Clearance (Validasi Manifest & Keputusan CEISA 4.0)</span>
                                <span class="font-mono text-emerald-400">6 Jam (Otomatis) vs 24 Jam (Manual)</span>
                            </div>
                            <div class="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                                <div class="bg-emerald-500 h-2.5 rounded-full" style="width: 25%"></div>
                            </div>
                        </div>

                        <div>
                            <div class="flex justify-between mb-1">
                                <span class="text-slate-300 font-semibold">3. Post-Clearance (Pemindaian Gate RFID, Jembatan Timbang & Release E-Seal)</span>
                                <span class="font-mono text-amber-400">&lt; 3 Detik per Kontainer</span>
                            </div>
                            <div class="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                                <div class="bg-amber-500 h-2.5 rounded-full" style="width: 5%"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- TAB 4: ALUR KEPABEANAN LENGKAP (DOSEN REQUIREMENT 2 & 3) -->
