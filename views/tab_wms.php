        <section id="tab-wms" class="hidden flex-grow p-6 overflow-y-auto">
            <div class="max-w-6xl mx-auto space-y-6">
                <div>
                    <h2 class="text-xl font-extrabold text-white flex items-center gap-2">
                        <i class="fa-solid fa-boxes-stacked text-amber-400"></i> WMS PLB & Alokasi Bin Lokasi Rak
                    </h2>
                    <p class="text-xs text-slate-400 mt-1">Sistem Manajemen Pergudangan Pusat Logistik Berikat: pemetaan rak zonasi berikat, penangguhan bea masuk, dan tracking koli.</p>
                </div>

                <!-- WMS Key Metrics -->
                <div class="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                    <div class="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
                        <span class="text-slate-400 text-[10px] uppercase font-semibold">Kapasitas Rak Terpakai</span>
                        <div class="text-2xl font-black text-amber-400 mt-1">78.5%</div>
                        <div class="w-full bg-slate-800 rounded-full h-1.5 mt-2">
                            <div class="bg-amber-500 h-1.5 rounded-full" style="width: 78.5%"></div>
                        </div>
                    </div>
                    <div class="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
                        <span class="text-slate-400 text-[10px] uppercase font-semibold">Total Stok Koli di Gudang</span>
                        <div class="text-2xl font-black text-white mt-1">1,480 Koli</div>
                        <span class="text-[10px] text-emerald-400">+38 Koli baru masuk</span>
                    </div>
                    <div class="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
                        <span class="text-slate-400 text-[10px] uppercase font-semibold">Bea Masuk Ditangguhkan</span>
                        <div class="text-2xl font-black text-emerald-400 mt-1">Rp 4.28 M</div>
                        <span class="text-[10px] text-slate-400">Fasilitas Fiskal PLB Resmi</span>
                    </div>
                    <div class="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
                        <span class="text-slate-400 text-[10px] uppercase font-semibold">Zona Gudang Aktif</span>
                        <div class="text-2xl font-black text-cyan-400 mt-1">4 Zona</div>
                        <span class="text-[10px] text-slate-400">A (Oto), B (Elek), C (Kim), D (Karantina)</span>
                    </div>
                </div>

                <!-- Warehouse Visual Rack Grid -->
                <div class="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
                    <div class="flex justify-between items-center">
                        <h3 class="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                            <i class="fa-solid fa-cubes-stacked text-blue-400"></i> Peta Visual Tata Letak Rak Gudang PLB (Bay-Row-Tier)
                        </h3>
                        <div class="flex items-center gap-3 text-[10px]">
                            <span class="flex items-center gap-1 text-slate-300"><span class="w-2.5 h-2.5 rounded bg-blue-600 inline-block"></span> Terisi</span>
                            <span class="flex items-center gap-1 text-slate-300"><span class="w-2.5 h-2.5 rounded bg-emerald-600 inline-block"></span> Masuk Hari Ini</span>
                            <span class="flex items-center gap-1 text-slate-300"><span class="w-2.5 h-2.5 rounded bg-slate-800 inline-block"></span> Kosong</span>
                        </div>
                    </div>

                    <!-- 4 Warehouse Zones Grid -->
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
                        <!-- Zone A -->
                        <div class="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                            <div class="flex justify-between items-center text-xs font-bold text-blue-400">
                                <span>ZONA A - OTOMOTIF</span>
                                <span class="text-[10px] text-slate-500">Rack A01-A12</span>
                            </div>
                            <div class="grid grid-cols-4 gap-1.5 py-2">
                                <div class="h-8 rounded bg-blue-600/80 flex items-center justify-center text-[10px] font-mono text-white font-bold">A-01</div>
                                <div class="h-8 rounded bg-blue-600/80 flex items-center justify-center text-[10px] font-mono text-white font-bold">A-02</div>
                                <div class="h-8 rounded bg-emerald-600 flex items-center justify-center text-[10px] font-mono text-white font-bold">A-03</div>
                                <div class="h-8 rounded bg-blue-600/80 flex items-center justify-center text-[10px] font-mono text-white font-bold">A-04</div>
                                <div class="h-8 rounded bg-blue-600/80 flex items-center justify-center text-[10px] font-mono text-white font-bold">A-05</div>
                                <div class="h-8 rounded bg-slate-800 flex items-center justify-center text-[10px] font-mono text-slate-500">A-06</div>
                                <div class="h-8 rounded bg-blue-600/80 flex items-center justify-center text-[10px] font-mono text-white font-bold">A-07</div>
                                <div class="h-8 rounded bg-slate-800 flex items-center justify-center text-[10px] font-mono text-slate-500">A-08</div>
                            </div>
                            <p class="text-[10px] text-slate-400">Toyota Parts & Astra Components</p>
                        </div>

                        <!-- Zone B -->
                        <div class="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                            <div class="flex justify-between items-center text-xs font-bold text-cyan-400">
                                <span>ZONA B - ELEKTRONIK</span>
                                <span class="text-[10px] text-slate-500">Rack B01-B12</span>
                            </div>
                            <div class="grid grid-cols-4 gap-1.5 py-2">
                                <div class="h-8 rounded bg-blue-600/80 flex items-center justify-center text-[10px] font-mono text-white font-bold">B-01</div>
                                <div class="h-8 rounded bg-emerald-600 flex items-center justify-center text-[10px] font-mono text-white font-bold">B-02</div>
                                <div class="h-8 rounded bg-blue-600/80 flex items-center justify-center text-[10px] font-mono text-white font-bold">B-03</div>
                                <div class="h-8 rounded bg-blue-600/80 flex items-center justify-center text-[10px] font-mono text-white font-bold">B-04</div>
                                <div class="h-8 rounded bg-slate-800 flex items-center justify-center text-[10px] font-mono text-slate-500">B-05</div>
                                <div class="h-8 rounded bg-blue-600/80 flex items-center justify-center text-[10px] font-mono text-white font-bold">B-06</div>
                                <div class="h-8 rounded bg-slate-800 flex items-center justify-center text-[10px] font-mono text-slate-500">B-07</div>
                                <div class="h-8 rounded bg-slate-800 flex items-center justify-center text-[10px] font-mono text-slate-500">B-08</div>
                            </div>
                            <p class="text-[10px] text-slate-400">Samsung PCB & Semi-conductor</p>
                        </div>

                        <!-- Zone C -->
                        <div class="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                            <div class="flex justify-between items-center text-xs font-bold text-purple-400">
                                <span>ZONA C - KIMIA & FMCG</span>
                                <span class="text-[10px] text-slate-500">Rack C01-C12</span>
                            </div>
                            <div class="grid grid-cols-4 gap-1.5 py-2">
                                <div class="h-8 rounded bg-blue-600/80 flex items-center justify-center text-[10px] font-mono text-white font-bold">C-01</div>
                                <div class="h-8 rounded bg-blue-600/80 flex items-center justify-center text-[10px] font-mono text-white font-bold">C-02</div>
                                <div class="h-8 rounded bg-blue-600/80 flex items-center justify-center text-[10px] font-mono text-white font-bold">C-03</div>
                                <div class="h-8 rounded bg-slate-800 flex items-center justify-center text-[10px] font-mono text-slate-500">C-04</div>
                                <div class="h-8 rounded bg-blue-600/80 flex items-center justify-center text-[10px] font-mono text-white font-bold">C-05</div>
                                <div class="h-8 rounded bg-blue-600/80 flex items-center justify-center text-[10px] font-mono text-white font-bold">C-06</div>
                                <div class="h-8 rounded bg-slate-800 flex items-center justify-center text-[10px] font-mono text-slate-500">C-07</div>
                                <div class="h-8 rounded bg-emerald-600 flex items-center justify-center text-[10px] font-mono text-white font-bold">C-08</div>
                            </div>
                            <p class="text-[10px] text-slate-400">Unilever Raw Material</p>
                        </div>

                        <!-- Zone D (Quarantine) -->
                        <div class="bg-slate-950 p-4 rounded-xl border border-rose-900/40 space-y-2">
                            <div class="flex justify-between items-center text-xs font-bold text-rose-400">
                                <span>ZONA D - KARANTINA PABEAN</span>
                                <span class="text-[10px] text-rose-500">Segregasi BC</span>
                            </div>
                            <div class="grid grid-cols-4 gap-1.5 py-2">
                                <div class="h-8 rounded bg-rose-600/80 flex items-center justify-center text-[10px] font-mono text-white font-bold blink-slow">Q-01</div>
                                <div class="h-8 rounded bg-slate-800 flex items-center justify-center text-[10px] font-mono text-slate-500">Q-02</div>
                                <div class="h-8 rounded bg-slate-800 flex items-center justify-center text-[10px] font-mono text-slate-500">Q-03</div>
                                <div class="h-8 rounded bg-slate-800 flex items-center justify-center text-[10px] font-mono text-slate-500">Q-04</div>
                                <div class="h-8 rounded bg-slate-800 flex items-center justify-center text-[10px] font-mono text-slate-500">Q-05</div>
                                <div class="h-8 rounded bg-slate-800 flex items-center justify-center text-[10px] font-mono text-slate-500">Q-06</div>
                                <div class="h-8 rounded bg-slate-800 flex items-center justify-center text-[10px] font-mono text-slate-500">Q-07</div>
                                <div class="h-8 rounded bg-slate-800 flex items-center justify-center text-[10px] font-mono text-slate-500">Q-08</div>
                            </div>
                            <p class="text-[10px] text-rose-400">Kargo Ditahan / Inspeksi Khusus</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

