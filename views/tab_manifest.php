        <section id="tab-manifest" class="hidden flex-grow p-6 overflow-y-auto">
            <div class="max-w-6xl mx-auto space-y-6">
                <div class="flex flex-col md:flex-row justify-between md:items-center gap-4">
                    <div>
                        <h2 class="text-xl font-extrabold text-white flex items-center gap-2">
                            <i class="fa-solid fa-file-lines text-cyan-400"></i> Manifes Kargo & Integrasi BC 2.3 / BC 2.7
                        </h2>
                        <p class="text-xs text-slate-400 mt-1">Data live mutasi peti kemas, dokumen kepabeanan impor/ekspor, dan verifikasi nomor segel elektronik.</p>
                    </div>
                    <div class="flex items-center gap-2 text-xs">
                        <span class="px-3 py-1.5 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 font-bold flex items-center gap-1.5">
                            <span class="w-2 h-2 rounded-full bg-emerald-400 blink-slow"></span> CEISA 4.0 Synced
                        </span>
                        <button onclick="app.generateSPPBDocument()" class="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all flex items-center gap-1.5">
                            <i class="fa-solid fa-print"></i> SPPB Cetak
                        </button>
                    </div>
                </div>

                <!-- Manifest Filter Cards -->
                <div class="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                    <div class="bg-slate-900 border border-slate-800 p-3 rounded-xl">
                        <span class="text-slate-400 text-[10px] uppercase font-semibold">Total Manifes Hari Ini</span>
                        <div class="text-lg font-black text-white mt-0.5">24 Kontainer</div>
                        <span class="text-[10px] text-cyan-400">18 Inbound / 6 Outbound</span>
                    </div>
                    <div class="bg-slate-900 border border-slate-800 p-3 rounded-xl">
                        <span class="text-slate-400 text-[10px] uppercase font-semibold">Jalur Hijau (SPPB Auto)</span>
                        <div class="text-lg font-black text-emerald-400 mt-0.5">21 TEUs</div>
                        <span class="text-[10px] text-emerald-400">87.5% Fast-Track</span>
                    </div>
                    <div class="bg-slate-900 border border-slate-800 p-3 rounded-xl">
                        <span class="text-slate-400 text-[10px] uppercase font-semibold">Jalur Merah (Pemeriksaan)</span>
                        <div class="text-lg font-black text-amber-400 mt-0.5">2 TEUs</div>
                        <span class="text-[10px] text-slate-400">Random Physical Check</span>
                    </div>
                    <div class="bg-slate-900 border border-slate-800 p-3 rounded-xl">
                        <span class="text-slate-400 text-[10px] uppercase font-semibold">Status Sabotase / Hold</span>
                        <div class="text-lg font-black text-rose-400 mt-0.5">1 Kasus</div>
                        <span class="text-[10px] text-rose-400">Zona Karantina Pabean</span>
                    </div>
                </div>

                <!-- Live Manifest Table -->
                <div class="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                    <div class="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/80">
                        <h3 class="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                            <i class="fa-solid fa-list-check text-blue-400"></i> Daftar Muatan Peti Kemas (Inbound dari Singapore ➔ PLB)
                        </h3>
                        <span class="text-[11px] text-slate-400">Auto-update via UHF RFID Portal</span>
                    </div>
                    <div class="overflow-x-auto">
                        <table class="w-full text-left text-xs text-slate-300">
                            <thead class="bg-slate-950 text-slate-400 uppercase text-[10px] font-bold tracking-wider border-b border-slate-800">
                                <tr>
                                    <th class="p-3">No. Dokumen BC</th>
                                    <th class="p-3">No. Kontainer</th>
                                    <th class="p-3">E-Seal RFID (SSCC)</th>
                                    <th class="p-3">Perusahaan Importir</th>
                                    <th class="p-3">Komoditas / HS</th>
                                    <th class="p-3 text-right">Berat (Kg)</th>
                                    <th class="p-3 text-center">Status CEISA</th>
                                    <th class="p-3 text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-800/60 font-mono text-[11px]">
                                <?php 
                                $manifestList = $initialDbData['manifest'] ?? [
                                    ['bc_doc'=>'000481/BC23/2026','container_no'=>'TEMU481920-4','sscc'=>'(00)389912345000000127','importer'=>'PT Astra Agro Lestari Tbk','commodity'=>'Komponen Traktor (8432.90)','gross_weight'=>18450,'ceisa_status'=>'SPPB HIJAU','status_badge'=>'emerald'],
                                    ['bc_doc'=>'000482/BC23/2026','container_no'=>'MSKU901234-7','sscc'=>'(00)389912345000000128','importer'=>'PT Samsung Electronics ID','commodity'=>'Microchip PCB (8542.31)','gross_weight'=>14200,'ceisa_status'=>'SPPB HIJAU','status_badge'=>'emerald'],
                                    ['bc_doc'=>'000483/BC23/2026','container_no'=>'CMAU551029-1','sscc'=>'(00)389912345000000129','importer'=>'PT Unilever Indonesia Tbk','commodity'=>'Bahan Kimia Baku (2915.21)','gross_weight'=>22800,'ceisa_status'=>'JALUR MERAH','status_badge'=>'amber'],
                                    ['bc_doc'=>'000484/BC23/2026','container_no'=>'ONEU338102-8','sscc'=>'(00)389912345000000130','importer'=>'PT Toyota Motor Mfg','commodity'=>'Steel Coil Otomotif (7225.40)','gross_weight'=>25500,'ceisa_status'=>'SPPB HIJAU','status_badge'=>'emerald'],
                                    ['bc_doc'=>'000485/BC23/2026','container_no'=>'HLXU110294-0','sscc'=>'(00)389912345000000131','importer'=>'PT Maju Logistik Sentosa','commodity'=>'Tekstil Poliester (5407.52)','gross_weight'=>16300,'ceisa_status'=>'HOLD (SABOTASE)','status_badge'=>'rose'],
                                ];
                                foreach ($manifestList as $m): 
                                    $isSabotage = ($m['status_badge'] === 'rose');
                                ?>
                                <tr class="hover:bg-slate-800/40 transition-colors <?= $isSabotage ? 'bg-rose-950/10' : ($m['status_badge']==='emerald' && $m['container_no']==='MSKU901234-7' ? 'bg-blue-950/10' : '') ?>">
                                    <td class="p-3 font-bold <?= $isSabotage ? 'text-rose-300' : 'text-white' ?>"><?= htmlspecialchars($m['bc_doc']) ?></td>
                                    <td class="p-3 <?= $isSabotage ? 'text-rose-400 font-bold' : 'text-cyan-400 font-bold' ?>"><?= htmlspecialchars($m['container_no']) ?></td>
                                    <td class="p-3 text-slate-400"><?= htmlspecialchars($m['sscc']) ?></td>
                                    <td class="p-3 font-sans text-slate-200"><?= htmlspecialchars($m['importer']) ?></td>
                                    <td class="p-3 font-sans"><?= htmlspecialchars($m['commodity']) ?></td>
                                    <td class="p-3 text-right"><?= number_format((int)$m['gross_weight'], 0, ',', '.') ?></td>
                                    <td class="p-3 text-center"><span class="px-2 py-0.5 rounded-full bg-<?= $m['status_badge'] ?>-950 text-<?= $m['status_badge'] ?>-400 border border-<?= $m['status_badge'] ?>-500/30 text-[10px] font-sans font-bold"><?= htmlspecialchars($m['ceisa_status']) ?></span></td>
                                    <td class="p-3 text-center"><button onclick="app.showPayloadViewer()" class="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-white font-sans text-[10px]">JSON</button></td>
                                </tr>
                                <?php endforeach; ?>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </section>

