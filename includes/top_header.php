        <!-- Top Header Bar -->
        <header id="plb-header" class="h-14 bg-slate-900/90 border-b border-slate-800 px-5 flex items-center justify-between shrink-0 gap-2">
            <!-- Sidebar toggle + Breadcrumb / Route Info -->
            <div class="flex items-center gap-2 min-w-0">
                <div class="w-9 h-9 shrink-0 rounded-lg bg-slate-950 border border-slate-800 grid place-items-center text-cyan-400" title="PLB Command Center">
                    <i class="fa-solid fa-anchor"></i>
                </div>
                <div class="flex items-center gap-3 min-w-0">
                    <div class="flex items-center gap-2 text-xs font-semibold bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 route-main min-w-0">
                        <span class="w-2 h-2 shrink-0 rounded-full bg-emerald-500 blink-slow"></span>
                        <span class="text-emerald-400 truncate">Hub Pelabuhan: Tanjung Priok - Gudang PLB</span>
                    </div>
                    <div class="hidden md:flex items-center gap-2 text-xs text-slate-400 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 route-extra">
                        <i class="fa-solid fa-ship text-blue-400"></i>
                        <span>Kapal Rute: <strong>Singapore (SGSIN) ➔ Jakarta (IDTPP)</strong></span>
                    </div>
                </div>
            </div>

            <!-- Network, Wi-Fi 6 & Speed widgets -->
            <div class="flex items-center gap-3 shrink-0">
                <!-- Mode Switch: Inbound vs Outbound -->
                <div class="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs mode-switch">
                    <button id="btn-mode-inbound" onclick="app.setLogisticsMode('INBOUND')" class="px-3 py-1 rounded-lg font-bold bg-blue-600 text-white transition-all">
                        <i class="fa-solid fa-arrow-down-long mr-1"></i> Inbound (Masuk)
                    </button>
                    <button id="btn-mode-outbound" onclick="app.setLogisticsMode('OUTBOUND')" class="px-3 py-1 rounded-lg font-bold text-slate-400 hover:text-white transition-all">
                        <i class="fa-solid fa-arrow-up-long mr-1"></i> Outbound (Keluar)
                    </button>
                </div>

                <!-- Wi-Fi 6 Infrastructure Indicator -->
                <div class="hidden sm:flex items-center gap-2 bg-slate-950 px-2.5 py-1.5 rounded-lg border border-slate-800 text-xs text-slate-400 network-widget">
                    <i class="fa-solid fa-wifi text-emerald-400"></i>
                    <span class="font-mono text-[11px] text-slate-300">Wi-Fi 6 (1.2 Gbps / 4ms)</span>
                </div>

                <!-- Simulation Speed -->
                <div class="flex items-center bg-slate-950 px-2 py-1 rounded-lg border border-slate-800 gap-1 text-[10px] header-speed">
                    <span class="text-slate-500 font-bold uppercase">Spd:</span>
                    <button id="spd-0.5" onclick="app.setSpeed(0.5)" class="px-2 py-0.5 rounded font-bold bg-slate-800 text-slate-300">0.5x</button>
                    <button id="spd-1" onclick="app.setSpeed(1)" class="px-2 py-0.5 rounded font-bold bg-blue-600 text-white">1x</button>
                    <button id="spd-2" onclick="app.setSpeed(2)" class="px-2 py-0.5 rounded font-bold bg-slate-800 text-slate-300">2x</button>
                </div>

                <!-- Clock -->
                <div id="clock" class="font-mono text-xs text-slate-300 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 clock-widget">--:--:-- WIB</div>
            </div>
        </header>

