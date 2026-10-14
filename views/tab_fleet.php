        <!-- TAB 6: IOT FLEET & E-SEAL TELEMATICS MONITOR (LAYER 1 & LAYER 2) -->
        <section id="tab-fleet" class="hidden flex-grow p-6 overflow-y-auto">
            <div class="max-w-6xl mx-auto space-y-6">
                <div>
                    <h2 class="text-xl font-extrabold text-white flex items-center gap-2">
                        <i class="fa-solid fa-tower-broadcast text-emerald-400"></i> IoT Fleet & E-Seal Telematics Monitor
                    </h2>
                    <p class="text-xs text-slate-400 mt-1">Pemantauan status gembok elektronik, baterai perangkat aktif, daya jangkau sinyal Wi-Fi 6, dan koordinat GPS geofence rute Priok ➔ Gudang PLB.</p>
                </div>

                <!-- IoT Device Telemetry Status Grid -->
                <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div class="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
                        <div class="flex items-center justify-between text-slate-400 text-xs mb-2">
                            <span>Konektivitas Wi-Fi 6 Mesh</span>
                            <i class="fa-solid fa-wifi text-emerald-400"></i>
                        </div>
                        <div class="text-2xl font-black text-white">99.98%</div>
                        <p class="text-[11px] text-emerald-400 mt-1"><i class="fa-solid fa-circle-check mr-1"></i> 12 Industrial AP Online</p>
                    </div>

                    <div class="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
                        <div class="flex items-center justify-between text-slate-400 text-xs mb-2">
                            <span>E-Seal Aktif di Lapangan</span>
                            <i class="fa-solid fa-lock text-blue-400"></i>
                        </div>
                        <div class="text-2xl font-black text-blue-400">18 Unit</div>
                        <p class="text-[11px] text-slate-400 mt-1">Standar ISO 17712 High Security</p>
                    </div>

                    <div class="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
                        <div class="flex items-center justify-between text-slate-400 text-xs mb-2">
                            <span>Status Integritas Kabel Kawat</span>
                            <i class="fa-solid fa-shield-cat text-emerald-400"></i>
                        </div>
                        <div class="text-2xl font-black text-emerald-400">NORMAL</div>
                        <p class="text-[11px] text-slate-400 mt-1">17 Intact / 1 Alarm Triggered</p>
                    </div>

                    <div class="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
                        <div class="flex items-center justify-between text-slate-400 text-xs mb-2">
                            <span>Suhu & Baterai Rata-rata</span>
                            <i class="fa-solid fa-battery-three-quarters text-amber-400"></i>
                        </div>
                        <div class="text-2xl font-black text-amber-400">92% / 28°C</div>
                        <p class="text-[11px] text-slate-400 mt-1">Lithium-Thionyl Chloride (Li-SOCl2)</p>
                    </div>
                </div>

                <!-- Armada Fleet Table -->
                <div class="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                    <div class="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/80">
                        <h3 class="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                            <i class="fa-solid fa-truck-front text-emerald-400"></i> Status Real-Time Armada Truk & E-Seal IoT
                        </h3>
                        <span class="text-[11px] text-slate-400">Telemetri refresh tiap 2.5s</span>
                    </div>
                    <div class="overflow-x-auto">
                        <table class="w-full text-left text-xs text-slate-300">
                            <thead class="bg-slate-950 text-slate-400 uppercase text-[10px] font-bold tracking-wider border-b border-slate-800">
                                <tr>
                                    <th class="p-3">No. Polisi Armada</th>
                                    <th class="p-3">ID E-Seal (SSCC)</th>
                                    <th class="p-3">Lokasi / Geofence</th>
                                    <th class="p-3 text-center">Baterai IoT</th>
                                    <th class="p-3 text-center">Sinyal RF</th>
                                    <th class="p-3 text-center">Status Gembok</th>
                                    <th class="p-3 text-center">Kabel Sensor</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-800/60 font-mono text-[11px]">
                                <?php 
                                $fleetList = $initialDbData['fleet'] ?? [
                                    ['plate'=>'B 9214 UXT','eseal_sscc'=>'(00)389912345000000127','location'=>'Gerbang PLB Gate 01','battery'=>96,'signal_dbm'=>-62,'lock_status'=>'UNLOCKED (SPPB)','sensor_cable'=>'UTUH','status_color'=>'emerald'],
                                    ['plate'=>'B 9531 KLD','eseal_sscc'=>'(00)389912345000000128','location'=>'Transit Tol Tj. Priok (KM 12)','battery'=>91,'signal_dbm'=>-71,'lock_status'=>'LOCKED','sensor_cable'=>'UTUH','status_color'=>'blue'],
                                    ['plate'=>'B 9802 SAA','eseal_sscc'=>'(00)389912345000000129','location'=>'Transit Tol Pluit (KM 04)','battery'=>89,'signal_dbm'=>-68,'lock_status'=>'LOCKED','sensor_cable'=>'UTUH','status_color'=>'blue'],
                                    ['plate'=>'B 9119 TAM','eseal_sscc'=>'(00)389912345000000131','location'=>'Pos Karantina Bea Cukai','battery'=>74,'signal_dbm'=>-84,'lock_status'=>'SABOTASE','sensor_cable'=>'TERPUTUS!','status_color'=>'rose'],
                                ];
                                foreach ($fleetList as $f): 
                                    $isSabotage = ($f['status_color'] === 'rose');
                                    $isTransit = ($f['status_color'] === 'blue');
                                ?>
                                <tr class="hover:bg-slate-800/40 transition-colors <?= $isSabotage ? 'bg-rose-950/15' : ($f['plate']==='B 9531 KLD' ? 'bg-blue-950/10' : '') ?>">
                                    <td class="p-3 font-bold <?= $isSabotage ? 'text-rose-300' : 'text-white' ?>"><?= htmlspecialchars($f['plate']) ?></td>
                                    <td class="p-3 <?= $isSabotage ? 'text-rose-400' : 'text-slate-400' ?>"><?= htmlspecialchars($f['eseal_sscc']) ?></td>
                                    <td class="p-3 font-sans <?= $isSabotage ? 'text-rose-400' : ($isTransit ? 'text-blue-400' : 'text-emerald-400') ?> flex items-center gap-1.5">
                                        <span class="w-2 h-2 rounded-full <?= $isSabotage ? 'bg-rose-500 blink-fast' : ($isTransit ? 'bg-blue-400 blink-slow' : 'bg-emerald-400') ?>"></span> <?= htmlspecialchars($f['location']) ?>
                                    </td>
                                    <td class="p-3 text-center font-bold <?= (int)$f['battery'] < 80 ? 'text-amber-400' : 'text-emerald-400' ?>"><?= (int)$f['battery'] ?>%</td>
                                    <td class="p-3 text-center <?= $isSabotage ? 'text-rose-400' : ($isTransit ? 'text-blue-400' : 'text-emerald-400') ?>"><?= (int)$f['signal_dbm'] ?> dBm</td>
                                    <td class="p-3 text-center">
                                        <span class="px-2 py-0.5 rounded-full <?= $isSabotage ? 'bg-rose-950 text-rose-400 border border-rose-500' : ($isTransit ? 'bg-rose-950 text-rose-300 border border-rose-500/30' : 'bg-emerald-950 text-emerald-400 border border-emerald-500/30') ?> font-sans font-bold text-[10px]"><?= htmlspecialchars($f['lock_status']) ?></span>
                                    </td>
                                    <td class="p-3 text-center <?= $isSabotage ? 'text-rose-400 blink-slow' : 'text-emerald-400' ?> font-sans font-bold"><?= htmlspecialchars($f['sensor_cable']) ?></td>
                                </tr>
                                <?php endforeach; ?>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </section>

        <!-- TAB 7: WMS PLB & DENAH ALOKASI RAK (LAYER 3 WMS LOGISTICS) -->
