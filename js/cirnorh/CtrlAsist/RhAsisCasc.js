window.RhAsisCasc = {
    mostrarVistaBiometrico: function() {
        console.log("🚀 TESTIGO: Entró correctamente a mostrarVistaBiometrico()");

        const contenedor = document.getElementById('app-container') || document.querySelector('main') || document.body;
        
        if (!contenedor) {
            console.error("❌ ERROR: No se encontró ningún contenedor para pintar la vista.");
            return;
        }
        
        console.log("🎨 TESTIGO: Contenedor encontrado, inyectando HTML del biométrico...");

contenedor.innerHTML = `
            <div class="space-y-6 animate-fade-in">
                <!-- Cabecera de la sección -->
                <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-stone-200">
                    <div>
                        <h4 class="font-bold text-stone-800 text-sm uppercase">Módulo Biométrico - INIFAP</h4>
                        <p class="text-xs text-stone-500">Cargue el reporte oficial RH_CONTROL_ASISTENCIA_V2 para gestionar incidencias.</p>
                    </div>
                    <div class="flex items-center gap-2">
                        <button onclick="
                            console.log('🔙 Volviendo al menú principal y actualizando historial...');
                            sessionStorage.removeItem('submodulo_activo_cirnorh');
                            const urlParams = new URLSearchParams(window.location.search);
                            const deptoActual = urlParams.get('depto') || 'cirnorh';
                            window.history.pushState({}, '', \`main.html?depto=\${deptoActual}&seccion=asistencia\`);
                            if(window.RhAsisCore && typeof window.RhAsisCore.init === 'function') {
                                window.RhAsisCore.init();
                            } else {
                                location.reload();
                            }
                        " class="px-4 py-2 text-xs font-semibold text-stone-600 bg-stone-100 hover:bg-stone-200 rounded-xl transition-all cursor-pointer">
                            ← Volver
                        </button>
                    </div>
                </div>

                <!-- Barra de Acciones y Carga de Archivo -->
                <div class="flex flex-wrap items-center justify-between gap-4 bg-stone-50 p-4 rounded-2xl border border-stone-200">
                    <div class="flex items-center gap-3">
                        <input type="file" id="uploadBiometrico" class="hidden" accept=".xlsx, .xlsm, .csv" onchange="RhAsisFBio.manejarCargaArchivo(this)">
                        <label for="uploadBiometrico" class="px-4 py-2.5 bg-[#249444] hover:bg-[#1b7033] text-white text-xs font-bold rounded-xl cursor-pointer shadow-sm transition-all flex items-center gap-2">
                            <span>📂</span> Cargar Reporte Biométrico
                        </label>
                        <button id="exportBtn" disabled onclick="RhAsisFBio.exportarExcel()" class="bg-stone-300 opacity-50 cursor-not-allowed text-stone-700 px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2">
                            <span>📥</span> Exportar Todo
                        </button>
                    </div>
                    <div id="statsCounter" class="text-xs text-stone-600 font-medium"></div>
                </div>

                <!-- Buscador y Toolbar -->
                <div id="toolbarBiometrico" class="hidden flex items-center justify-between bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
                    <div class="relative w-full max-w-md">
                        <span class="absolute left-3 top-1/2 -translate-y-1/2 opacity-50">🔍</span>
                        <input type="text" id="searchInputBio" placeholder="Buscar empleado por nombre o ID..." oninput="RhAsisCasc.filtrarPestañas(this.value)"
                            class="w-full pl-10 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-[#249444] transition-all">
                    </div>
                    <button onclick="RhAsisFBio.guardarDatosProcesados()" class="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center gap-1.5 cursor-pointer">
                        💾 Guardar Datos en Sistema
                    </button>
                </div>

                <!-- Contenedor Principal de Pestañas y Datos -->
                <div id="appContainerBio" class="hidden bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden flex flex-col min-h-[450px]">
                    <div class="flex border-b border-stone-200 bg-stone-100 overflow-x-auto custom-scrollbar" id="tabContainerBio"></div>
                    <div id="tabContentBio" class="p-6"></div>
                </div>

                <!-- Estado Vacío Inicial -->
                <div id="emptyStateBio" class="py-16 text-center">
                    <div class="max-w-md mx-auto bg-stone-50 p-8 rounded-2xl border border-dashed border-stone-300">
                        <div class="text-4xl mb-3">📊</div>
                        <h5 class="text-sm font-bold text-stone-700">Sin datos cargados</h5>
                        <p class="text-xs text-stone-400 mt-1">Seleccione un archivo de asistencia para comenzar la revisión.</p>
                    </div>
                </div>
            </div>
        `;
        console.log("✅ TESTIGO: HTML del biométrico inyectado con éxito.");
    },

    renderTabs: function(filter = "") {
        const tabContainer = document.getElementById('tabContainerBio');
        const emptyState = document.getElementById('emptyStateBio');
        const appContainer = document.getElementById('appContainerBio');
        const toolbar = document.getElementById('toolbarBiometrico');
        const exportBtn = document.getElementById('exportBtn');

        if (!tabContainer || !window.RhAsisFBio || !window.RhAsisFBio.groupedData) return;

        emptyState.classList.add('hidden');
        appContainer.classList.remove('hidden');
        toolbar.classList.remove('hidden');

        exportBtn.disabled = false;
        exportBtn.className = "bg-[#249444] hover:bg-[#1b7033] text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-2 cursor-pointer";

        tabContainer.innerHTML = "";
        const ids = Object.keys(RhAsisFBio.groupedData).filter(id =>
            RhAsisFBio.groupedData[id].nombre.toLowerCase().includes(filter.toLowerCase()) || id.includes(filter)
        );

        ids.forEach((id, index) => {
            const tabBtn = document.createElement('button');
            tabBtn.className = `px-4 py-3 text-[11px] font-bold uppercase whitespace-nowrap border-b-2 transition-all cursor-pointer ${index === 0 ? 'border-[#249444] text-[#249444] bg-white' : 'border-transparent text-stone-500 hover:bg-stone-200/50'}`;
            tabBtn.innerHTML = id;
            tabBtn.onclick = () => RhAsisCasc.switchTab(id, tabBtn);
            tabContainer.appendChild(tabBtn);
            if (index === 0) RhAsisCasc.switchTab(id, tabBtn);
        });
    },

    switchTab: function(id, element) {
        document.querySelectorAll('#tabContainerBio button').forEach(b => {
            b.classList.remove('border-[#249444]', 'text-[#249444]', 'bg-white');
            b.classList.add('border-transparent', 'text-stone-500');
        });
        element.classList.remove('border-transparent', 'text-stone-500');
        element.classList.add('border-[#249444]', 'text-[#249444]', 'bg-white');

        const emp = RhAsisFBio.groupedData[id];
        const contentDiv = document.getElementById('tabContentBio');

        if (!emp) return;

        contentDiv.innerHTML = `
            <h3 class="text-base font-black mb-4 uppercase tracking-tight text-[#249444]">${emp.nombre}</h3>
            <div class="overflow-x-auto rounded-xl border border-stone-200">
                <table class="w-full text-[10px]">
                    <thead class="bg-stone-100 font-bold text-stone-700">
                        <tr>${RhAsisFBio.rawHeader.map(h => `<th class="p-2 border border-stone-200 text-center">${h}</th>`).join('')}</tr>
                    </thead>
                    <tbody>
                        ${emp.rows.map(r => `
                            <tr class="${RhAsisCasc.getRowVisualClass(r)}">
                                ${r.map(c => `<td class="p-2 border border-stone-200/50 text-center">${c instanceof Date ? c.toLocaleDateString() : c}</td>`).join('')}
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    },

    getRowVisualClass: function(row) {
        if (row[13] && row[13] !== "") return "bg-red-500 text-white font-bold";
        if (row[12] && row[12] !== "") return "bg-orange-600 text-white";
        if (row[11] && row[11] !== "") return "bg-orange-400 text-black";
        if (row[10] && row[10] !== "") return "bg-yellow-400 text-black";
        return "bg-emerald-50/40 text-stone-700";
    },

    filtrarPestañas: function(texto) {
        RhAsisCasc.renderTabs(texto);
    },

    mostrarControlRetardos: function() {
        alert("Control de Retardos cargado desde la estructura modular.");
    },

    mostrarReporteGlobal: function() {
        alert("Reporte de Asistencia global.");
    }
};