// js/cirnorh/asistencia/RhAsisCasc.js

window.RhAsisCasc = {
    mostrarVistaBiometrico: function() {
        const contenedor = document.getElementById('app-container') || document.querySelector('main') || document.body;
        
        if (!contenedor) {
            console.error("❌ ERROR: No se encontró ningún contenedor para pintar la vista.");
            return;
        }

        const nombreCortoActual = localStorage.getItem('depto_activo_actual') || 'cirnorh';
        if (typeof window.actualizarBotonRegresar === 'function') {
            window.actualizarBotonRegresar('vista-interna', nombreCortoActual, () => {
                if (typeof cargarAsistenciaRh === 'function') {
                    cargarAsistenciaRh();
                } else {
                    window.location.href = `main.html?depto=${nombreCortoActual}&seccion=asistencia`;
                }
            });
        }

        contenedor.innerHTML = `
            <div class="space-y-6 animate-fade-in">
                <!-- Cabecera de la sección -->
                <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-stone-200">
                    <div>
                        <h4 class="font-bold text-stone-800 text-sm uppercase">Módulo Biométrico - INIFAP</h4>
                        <p class="text-xs text-stone-500">Cargue el reporte oficial RH_CONTROL_ASISTENCIA_V2 para gestionar incidencias.</p>
                    </div>
                </div>

                <!-- Barra de Acciones Principales y Buscador alineado a la derecha -->
                <div class="flex flex-wrap items-center justify-between gap-4 bg-stone-50 p-4 rounded-2xl border border-stone-200">
                    <!-- Grupo Izquierdo: Botones principales (Carga de Datos fusionada y Exportar) -->
                    <div class="flex flex-wrap items-center gap-3">
                        <input type="file" id="uploadBiometrico" class="hidden" accept=".xlsx, .xlsm, .csv" onchange="RhAsisCasc.manejarCargaYGuardadoAutomatico(this)">
                        
                        <!-- 🎯 Botón fusionado: Carga de Datos -->
                        <label for="uploadBiometrico" class="px-4 py-2.5 bg-[#249444] hover:bg-[#1b7033] text-white text-xs font-bold rounded-xl cursor-pointer shadow-sm transition-all flex items-center gap-2">
                            <span>📂</span> Carga de Datos
                        </label>

                        <!-- Botón Exportar reporte -->
                        <button id="exportBtn" disabled onclick="RhAsisFBio.exportarExcel()" class="bg-stone-300 opacity-50 cursor-not-allowed text-stone-700 px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2">
                            <span>📥</span> Exportar reporte
                        </button>
                    </div>

                    <!-- 🎯 Grupo Derecho: Buscador por nombre o número de empleado alineado a la línea principal -->
                    <div class="relative w-full sm:w-80">
                        <span class="absolute left-3 top-1/2 -translate-y-1/2 opacity-50">🔍</span>
                        <input type="text" id="searchInputBio" placeholder="Buscar por nombre o N° emp..." oninput="RhAsisCasc.filtrarPestañas(this.value)"
                            class="w-full pl-10 pr-4 py-2.5 bg-white border border-stone-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-[#249444] transition-all shadow-xs">
                    </div>
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

        // Si ya había datos en memoria/sesión al pintar la vista, los renderizamos de inmediato
        if (window.RhAsisFBio && window.RhAsisFBio.groupedData && Object.keys(window.RhAsisFBio.groupedData).length > 0) {
            RhAsisCasc.renderTabs();
        }
    },

    // 🎯 FUSIÓN DE ACCIÓN: Carga el archivo, lo procesa en pantalla y lo guarda automáticamente en Sheets
    manejarCargaYGuardadoAutomatico: async function(input) {
        const file = input.files[0];
        if (!file) return;

        try {
            // 1. Ejecutamos la función original que procesa el archivo y llena RhAsisFBio.groupedData
            if (typeof RhAsisFBio.manejarCargaArchivo === 'function') {
                await RhAsisFBio.manejarCargaArchivo(input);
            } else if (typeof RhAsisFBio.procesarArchivoBiometrico === 'function') {
                await RhAsisFBio.procesarArchivoBiometrico(file);
            }

            if (!window.RhAsisFBio.groupedData || Object.keys(window.RhAsisFBio.groupedData).length === 0) {
                alert("El archivo se leyó pero no se encontraron datos válidos.");
                return;
            }

            // 2. Renderizamos las pestañas en pantalla de inmediato
            RhAsisCasc.renderTabs();

            // 3. Preparamos los datos estructurados para enviarlos a Google Sheets
            const rowsParaSheets = [];
            Object.keys(RhAsisFBio.groupedData).forEach(id => {
                const empleado = RhAsisFBio.groupedData[id];
                empleado.rows.forEach(row => {
                    rowsParaSheets.push([
                        row[0] || "",   // NumEmp
                        row[4] || "",   // RHBHraEnt
                        row[5] || "",   // RHBHraSal
                        row[6] || "",   // RHBHraReg
                        row[7] || "",   // RHBNomReg
                        row[8] || "",   // RHBFecReg
                        row[9] || "",   // RHBDía
                        row[10] || "",  // RHBRetMen
                        row[11] || "",  // RHBRetMed
                        row[12] || "",  // RHBRetMay
                        row[13] || ""   // RHBFalta
                    ]);
                });
            });

            console.log("Enviando " + rowsParaSheets.length + " registros a Google Sheets...");

            // 4. Guardado automático usando la FetchAPI centralizada de api.js
            if (typeof FetchAPI === 'function') {
                const resultado = await FetchAPI("guardarBiometrico", {
                    filas: rowsParaSheets
                });

                if (resultado && resultado.success) {
                    console.log("✅ Guardado en Sheets exitoso:", resultado.message);
                } else {
                    console.warn("⚠️ Aviso al guardar en Sheets:", resultado ? resultado.message : "Desconocido");
                }
            } else {
                console.error("FetchAPI no está disponible globalmente.");
            }

        } catch (error) {
            console.error("Error en la carga y guardado automático:", error);
            alert("❌ Ocurrió un error al procesar el archivo o guardarlo en el sistema.");
        } finally {
            // Limpiamos el input file para permitir volver a cargar el mismo archivo si es necesario
            input.value = "";
        }
    },

    renderTabs: function(filter = "") {
        const tabContainer = document.getElementById('tabContainerBio');
        const emptyState = document.getElementById('emptyStateBio');
        const appContainer = document.getElementById('appContainerBio');
        const exportBtn = document.getElementById('exportBtn');

        if (!tabContainer || !window.RhAsisFBio || !window.RhAsisFBio.groupedData) return;

        emptyState.classList.add('hidden');
        appContainer.classList.remove('hidden');

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

    // Alias para evitar errores de sincronización de nombres
    renderTabsBiometrico: function(filter = "") {
        RhAsisCasc.renderTabs(filter);
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
    }
};