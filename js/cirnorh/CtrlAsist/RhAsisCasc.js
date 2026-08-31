// js/cirnorh/asistencia/RhAsisCasc.js

window.RhAsisCasc = {
    mostrarVistaBiometrico: function () {
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
                    <!-- Grupo Izquierdo: Botones principales con ID en el label para control del spinner -->
                    <div class="flex flex-wrap items-center gap-3">
                        <input type="file" id="uploadBiometrico" class="hidden" accept=".xlsx, .xlsm, .csv" onchange="RhAsisCasc.manejarCargaYGuardadoAutomatico(this)">
                        
                        <label id="labelCargaDatos" for="uploadBiometrico" class="px-4 py-2.5 bg-[#249444] hover:bg-[#1b7033] text-white text-xs font-bold rounded-xl cursor-pointer shadow-sm transition-all flex items-center gap-2">
                            <span id="iconoCarga">📂</span> <span id="textoCargaBtn">Carga de Datos</span>
                        </label>

                        <button id="exportBtn" disabled onclick="RhAsisFBio.exportarExcel()" class="bg-stone-300 opacity-50 cursor-not-allowed text-stone-700 px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2">
                            <span>📥</span> Exportar reporte
                        </button>
                    </div>

                    <!-- Grupo Derecho: Buscador por nombre o número de empleado -->
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

        if (window.RhAsisFBio && window.RhAsisFBio.groupedData && Object.keys(window.RhAsisFBio.groupedData).length > 0) {
            RhAsisCasc.renderTabs();
        }
    },

    manejarCargaYGuardadoAutomatico: async function (input) {
        const file = input.files[0];
        if (!file) return;

        const labelCarga = document.getElementById('labelCargaDatos');
        const iconoCarga = document.getElementById('iconoCarga');
        const textCarga = document.getElementById('textoCargaBtn');

        try {
            // 🔄 1. ACTIVAR SPINNER DE CARGA
            if (labelCarga) {
                labelCarga.classList.remove('cursor-pointer', 'bg-[#249444]', 'hover:bg-[#1b7033]');
                labelCarga.classList.add('bg-stone-400', 'cursor-wait');
                labelCarga.removeAttribute('for');
            }
            if (iconoCarga) {
                iconoCarga.innerHTML = `<svg class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>`;
            }
            if (textCarga) {
                textCarga.innerText = "Analizando archivo...";
            }

            // 2. Procesamos el archivo localmente en memoria
            if (typeof RhAsisFBio.manejarCargaArchivo === 'function') {
                await RhAsisFBio.manejarCargaArchivo(input);
            } else if (typeof RhAsisFBio.procesarArchivoBiometrico === 'function') {
                await RhAsisFBio.procesarArchivoBiometrico(file);
            }

            if (!window.RhAsisFBio.groupedData || Object.keys(window.RhAsisFBio.groupedData).length === 0) {
                alert("El archivo se leyó pero no se encontraron datos válidos.");
                return;
            }

            // 3. Extraer el primer NumEmp y la primera Fecha de los datos cargados
            let primerNumEmp = "";
            let rawFecha = "";

            const primerId = Object.keys(RhAsisFBio.groupedData)[0];
            if (primerId && RhAsisFBio.groupedData[primerId].rows.length > 0) {
                const primeraFila = RhAsisFBio.groupedData[primerId].rows.length > 0 ? RhAsisFBio.groupedData[primerId].rows[0] : [];
                primerNumEmp = primeraFila[0] || ""; // Columna 0 (NumEmp)
                rawFecha = primeraFila[8] || primeraFila[9] || ""; // Columna de Fecha
            }

            if (!rawFecha) {
                alert("⚠️ No se pudo detectar la fecha en el archivo.");
                window.RhAsisFBio.groupedData = {};
                return;
            }

            // Normalizar formato de fecha a YYYY-MM-DD
            let fechaNormalizada = "";
            if (rawFecha instanceof Date) {
                fechaNormalizada = rawFecha.toISOString().split('T')[0];
            } else {
                let fechaStr = String(rawFecha).trim();
                if (fechaStr.includes('/')) {
                    const partes = fechaStr.split('/');
                    if (partes.length === 3) {
                        fechaNormalizada = `${partes[2]}-${partes[1].padStart(2, '0')}-${partes[0].padStart(2, '0')}`;
                    }
                } else if (fechaStr.includes('-')) {
                    fechaNormalizada = fechaStr.split('T')[0];
                } else {
                    fechaNormalizada = fechaStr;
                }
            }

            // 📢 [PASO 1] MOSTRAR EN PANTALLA EL PRIMER REGISTRO LEÍDO
            alert(`🔍 [PASO 1] Primer registro leído:\n\n• NumEmp: ${primerNumEmp}\n• Fecha: ${fechaNormalizada}`);

            if (textCarga) {
                textCarga.innerText = "Verificando en sistema...";
            }

            // 4. CONSULTAR AL BACKEND SI LA FECHA YA EXISTE EN GOOGLE SHEETS
            if (typeof FetchAPI === 'function') {
                const verificacion = await FetchAPI("verificarFechaBiometrico", { fecha: fechaNormalizada });
                console.log("📥 Respuesta cruda del servidor:", verificacion);

                // Forzamos la validación a booleano real
                const yaExiste = verificacion && (verificacion.existe === true || verificacion.existe === "true" || String(verificacion.existe).toLowerCase() === "true");

                console.log("🔎 ¿Se encontró la fecha en Sheets (Evaluado)?", yaExiste);
                alert(`📋 [PASO 2] Resultado de búsqueda en Google Sheets:\n\n¿La fecha ${fechaNormalizada} fue encontrada? -> ${yaExiste}`);

                // 🛑 BLOQUE CONDICIONAL ESTRICTO (IF / ELSE)
                if (yaExiste) {
                    // SI YA EXISTE: FRENAMOS TODO AQUÍ Y NO GUARDAMOS NADA
                    window.RhAsisFBio.groupedData = {};
                    alert(`🛑 Los datos de la fecha ${fechaNormalizada} ya fueron cargados anteriormente. No se realizará ningún guardado.`);
                    return;
                } else {
                    // SI NO EXISTE: ÚNICAMENTE AQUÍ SE PROCEDE A GUARDAR
                    if (textCarga) {
                        textCarga.innerText = "Guardando datos...";
                    }

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

                    const resultado = await FetchAPI("guardarBiometrico", {
                        filas: rowsParaSheets
                    });

                    if (resultado && resultado.success) {
                        alert(`✅ ¡Datos cargados y guardados exitosamente en Google Sheets (${rowsParaSheets.length} registros)!`);
                        if (typeof RhAsisCasc.renderTabs === 'function') {
                            RhAsisCasc.renderTabs();
                        }
                    } else {
                        alert("⚠️ Aviso al guardar en Sheets: " + (resultado ? resultado.message : "Desconocido"));
                    }
                }

            } else {
                console.error("FetchAPI no está disponible globalmente.");
            }

        } catch (error) {
            console.error("Error en la validación y carga:", error);
            alert("❌ Ocurrió un error al procesar la validación y carga.");
            window.RhAsisFBio.groupedData = {};
        } finally {
            // 🔄 RESTAURAR BOTÓN Y SPINNER
            if (labelCarga) {
                labelCarga.classList.remove('bg-stone-400', 'cursor-wait');
                labelCarga.classList.add('bg-[#249444]', 'hover:bg-[#1b7033]', 'cursor-pointer');
                labelCarga.setAttribute('for', 'uploadBiometrico');
            }
            if (iconoCarga) {
                iconoCarga.innerHTML = "📂";
            }
            if (textCarga) {
                textCarga.innerText = "Carga de Datos";
            }
            input.value = "";
        }
    },

    renderTabs: function (filter = "") {
        const tabContainer = document.getElementById('tabContainerBio');
        const emptyState = document.getElementById('emptyStateBio');
        const appContainer = document.getElementById('appContainerBio');
        const exportBtn = document.getElementById('exportBtn');

        if (!tabContainer || !window.RhAsisFBio || !window.RhAsisFBio.groupedData) return;

        if (Object.keys(window.RhAsisFBio.groupedData).length === 0) {
            emptyState.classList.remove('hidden');
            appContainer.classList.add('hidden');
            return;
        }

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

    renderTabsBiometrico: function (filter = "") {
        RhAsisCasc.renderTabs(filter);
    },

    switchTab: function (id, element) {
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

    getRowVisualClass: function (row) {
        if (row[13] && row[13] !== "") return "bg-red-500 text-white font-bold";
        if (row[12] && row[12] !== "") return "bg-orange-600 text-white";
        if (row[11] && row[11] !== "") return "bg-orange-400 text-black";
        if (row[10] && row[10] !== "") return "bg-yellow-400 text-black";
        return "bg-emerald-50/40 text-stone-700";
    },

    filtrarPestañas: function (texto) {
        RhAsisCasc.renderTabs(texto);
    }
};