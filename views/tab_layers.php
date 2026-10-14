        <section id="tab-layers" class="hidden flex-grow p-6 overflow-y-auto">
            <div class="max-w-5xl mx-auto space-y-6">
                <div>
                    <h2 class="text-xl font-extrabold text-white flex items-center gap-2">
                        <i class="fa-solid fa-layer-group text-indigo-400"></i> Arsitektur 4 Layer Ekosistem IT Logistik PLB
                    </h2>
                    <p class="text-xs text-slate-400 mt-1">Sesuai blueprint arsitektur logistik lintas batas: integrasi fisik ke digital (Physical-to-Digital Convergence).</p>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <!-- Layer 1 -->
                    <div class="bg-slate-900 border border-slate-800 p-5 rounded-2xl relative overflow-hidden">
                        <div class="flex items-center gap-3 mb-3">
                            <div class="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center font-black">L1</div>
                            <div>
                                <h3 class="text-sm font-bold text-white">Layer 1: Sensing & Hardware</h3>
                                <p class="text-[11px] text-blue-400">E-Seal RFID, Automatic UHF Gate & Weighbridge</p>
                            </div>
                        </div>
                        <ul class="text-xs text-slate-300 space-y-2 leading-relaxed">
                            <li><strong class="text-white">• E-Seal Cerdas:</strong> Gembok elektronik berstandar internasional pengganti segel logam konvensional. Dilengkapi sensor sabotase (*tamper switch*) internal yang langsung memicu alarm jika dipotong.</li>
                            <li><strong class="text-white">• Automatic RFID Gate:</strong> Antena pembaca UHF (920-925 MHz) bekerja layaknya gerbang tol otomatis tanpa henti manual, menihilkan *human error*.</li>
                            <li><strong class="text-white">• Jembatan Timbang Digital:</strong> Validasi otomatis berat kotor kontainer terhadap manifes pabean.</li>
                        </ul>
                    </div>

                    <!-- Layer 2 -->
                    <div class="bg-slate-900 border border-slate-800 p-5 rounded-2xl relative overflow-hidden">
                        <div class="flex items-center gap-3 mb-3">
                            <div class="w-10 h-10 rounded-xl bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-black">L2</div>
                            <div>
                                <h3 class="text-sm font-bold text-white">Layer 2: Network & Connectivity</h3>
                                <p class="text-[11px] text-emerald-400">Infrastruktur Wi-Fi 6 Industri & Telemetri 4G/5G</p>
                            </div>
                        </div>
                        <ul class="text-xs text-slate-300 space-y-2 leading-relaxed">
                            <li><strong class="text-white">• Wi-Fi 6 Industri:</strong> Dipilih khusus di area penumpukan yard dan gerbang PLB untuk transmisi data pemindaian dengan latensi ultra-rendah (&lt;5 ms) dan keandalan tinggi di lingkungan berinterferensi logam.</li>
                            <li><strong class="text-white">• Cellular Telematics:</strong> Mengirimkan titik koordinat GPS dan status kesehatan gembok (baterai, tamper) secara kontinu selama truk transit di jalan raya.</li>
                        </ul>
                    </div>

                    <!-- Layer 3 -->
                    <div class="bg-slate-900 border border-slate-800 p-5 rounded-2xl relative overflow-hidden">
                        <div class="flex items-center gap-3 mb-3">
                            <div class="w-10 h-10 rounded-xl bg-amber-600/20 border border-amber-500/30 text-amber-400 flex items-center justify-center font-black">L3</div>
                            <div>
                                <h3 class="text-sm font-bold text-white">Layer 3: WMS & Core Applications</h3>
                                <p class="text-[11px] text-amber-400">Warehouse Management System & End-to-End Visibility</p>
                            </div>
                        </div>
                        <ul class="text-xs text-slate-300 space-y-2 leading-relaxed">
                            <li><strong class="text-white">• Perekaman & Rekonsiliasi Otomatis:</strong> Mencocokkan data barang masuk dengan inventori gudang PLB tanpa entri manual.</li>
                            <li><strong class="text-white">• Alokasi Bin & Penyortiran Cerdas:</strong> Memastikan penempatan kargo di rak gudang sesuai kategori kepabeanan untuk mencegah risiko penyelundupan atau salah bongkar.</li>
                            <li><strong class="text-white">• Dashboard Visibilitas:</strong> Menampilkan status segel dan jejak kargo secara real-time.</li>
                        </ul>
                    </div>

                    <!-- Layer 4 -->
                    <div class="bg-slate-900 border border-slate-800 p-5 rounded-2xl relative overflow-hidden">
                        <div class="flex items-center gap-3 mb-3">
                            <div class="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/30 text-purple-400 flex items-center justify-center font-black">L4</div>
                            <div>
                                <h3 class="text-sm font-bold text-white">Layer 4: Data Integration (Bridge)</h3>
                                <p class="text-[11px] text-purple-400">Sinkronisasi REST API & EDI CEISA 4.0 Bea Cukai</p>
                            </div>
                        </div>
                        <ul class="text-xs text-slate-300 space-y-2 leading-relaxed">
                            <li><strong class="text-white">• Integrasi CEISA 4.0:</strong> Menggunakan protokol REST Webhook / EDIFACT berstandar DJBC dengan enkripsi RSA-SHA256 untuk pertukaran status kepabeanan otomatis.</li>
                            <li><strong class="text-white">• Automated Release Mechanism:</strong> Pemicu pembukaan kunci E-Seal secara nirkabel murni diatur oleh sistem berdasarkan respon status SPPB (Jalur Hijau) dari Bea Cukai.</li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>

        <!-- TAB 3: DWELLING TIME ANALYTICS (DOSEN REQUIREMENT 4) -->
