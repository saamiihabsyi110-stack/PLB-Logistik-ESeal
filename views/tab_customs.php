        <section id="tab-customs" class="hidden flex-grow p-6 overflow-y-auto">
            <div class="max-w-5xl mx-auto space-y-6">
                <div>
                    <h2 class="text-xl font-extrabold text-white flex items-center gap-2">
                        <i class="fa-solid fa-shield-halved text-amber-400"></i> Alur Kepabeanan (Customs Clearance) & Rantai Logistik
                    </h2>
                    <p class="text-xs text-slate-400 mt-1">Diagram alur operasional pergerakan kargo impor/ekspor dengan fasilitas penangguhan bea masuk PLB.</p>
                </div>

                <div class="space-y-4">
                    <div class="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-start gap-4">
                        <div class="w-9 h-9 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold shrink-0">1</div>
                        <div>
                            <h3 class="text-sm font-bold text-white">Kedatangan Kapal & Penampungan Pelabuhan</h3>
                            <p class="text-xs text-slate-400 mt-1">Kapal kontainer dari luar negeri (contoh: Singapura) bersandar di dermaga Tanjung Priok. Kontainer diturunkan oleh Ship-to-Shore (STS) Crane ke area penampungan sementara (*Container Yard*).</p>
                        </div>
                    </div>

                    <div class="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-start gap-4">
                        <div class="w-9 h-9 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center font-bold shrink-0">2</div>
                        <div>
                            <h3 class="text-sm font-bold text-white">Pemasangan & Penguncian E-Seal oleh Petugas Bea Cukai</h3>
                            <p class="text-xs text-slate-400 mt-1">Setelah dokumen barang diserahkan ke sistem Bea Cukai dan fisik kargo diverifikasi, petugas pabean yang berwenang memasang dan mengunci E-Seal RFID pada pintu kontainer. Data nomor seri SSCC didaftarkan ke manifes pabean. Kunci tidak boleh dirusak selama perjalanan.</p>
                        </div>
                    </div>

                    <div class="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-start gap-4">
                        <div class="w-9 h-9 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center font-bold shrink-0">3</div>
                        <div>
                            <h3 class="text-sm font-bold text-white">Transit Terpantau (Geofencing Telematics)</h3>
                            <p class="text-xs text-slate-400 mt-1">Truk bergerak dari pelabuhan menuju fasilitas Pusat Logistik Berikat (PLB). Telemetri GPS memetakan koordinat secara konstan. Jika terjadi penyimpangan rute atau usaha pembobolan paksa, sinyal sabotase (*tamper*) seketika terkirim ke dasbor pengawas.</p>
                        </div>
                    </div>

                    <div class="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-start gap-4">
                        <div class="w-9 h-9 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center font-bold shrink-0">4</div>
                        <div>
                            <h3 class="text-sm font-bold text-white">Otomasi Pemindaian Gerbang & Pelepasan Kunci E-Seal di PLB</h3>
                            <p class="text-xs text-slate-400 mt-1">Saat tiba di gerbang PLB, antena Fixed UHF RFID membaca identitas kontainer secara nirsentuh. Jembatan timbang memverifikasi bobot aktual kargo. Sistem CEISA 4.0 mengonfirmasi status SPPB, palang gerbang terbuka otomatis, dan kunci elektronik E-Seal dilepas secara nirkabel agar kargo dapat dibongkar.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- TAB 5: MANIFEST INBOUND / OUTBOUND (REAL-TIME LOGISTICS LEDGER) -->
