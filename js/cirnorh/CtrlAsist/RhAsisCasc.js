// js/cirnorh/asistencia/RhAsisCasc.js

window.RhAsisCasc = {
    registrosBiometrico: [],
    rawHeaderGlobal: [
        "ClaveCentro", "NumEmp", "RHBHraEnt", "RHBHraSal",
        "RHBHraReg", "RHBNomReg", "RHBFecReg", "RHBDía",
        "RHBRetMen", "RHBRetMed", "RHBRetMay", "RHBFalta"
    ],

    mostrarVistaBiometrico: async function () {
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

                <!-- Barra de Acciones Principales y Buscador -->
                <div class="flex flex-wrap items-center justify-between gap-4 bg-stone-50 p-4 rounded-2xl border border-stone-200">
                    <div class="flex flex-wrap items-center gap-3">
                        <input type="file" id="uploadBiometrico" class="hidden" accept=".xlsx, .xlsm, .csv" onchange="RhAsisCasc.manejarCargaYGuardadoAutomatico(this)">
                        
                        <label id="labelCargaDatos" for="uploadBiometrico" class="px-4 py-2.5 bg-[#249444] hover:bg-[#1b7033] text-white text-xs font-bold rounded-xl cursor-pointer shadow-sm transition-all flex items-center gap-2">
                            <span id="iconoCarga">📂</span> <span id="textoCargaBtn">Carga de Datos</span>
                        </label>

                        <button id="exportBtn" disabled onclick="if(window.RhAsisFBio && typeof RhAsisFBio.exportarExcel === 'function') RhAsisFBio.exportarExcel()" class="bg-stone-300 opacity-50 cursor-not-allowed text-stone-700 px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2">
                            <span>📥</span> Exportar reporte
                        </button>
                    </div>

                    <!-- Buscador general en tiempo real -->
                    <div class="relative w-full sm:w-80">
                        <span class="absolute left-3 top-1/2 -translate-y-1/2 opacity-50">🔍</span>
                        <input type="text" id="searchInputBio" placeholder="Buscar por centro, N° emp o fecha..." oninput="RhAsisCasc.filtrarTablaGeneral(this.value)"
                            class="w-full pl-10 pr-4 py-2.5 bg-white border border-stone-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-[#249444] transition-all shadow-xs">
                    </div>
                </div>

                <!-- Contenedor Principal de la Tabla con Scroll -->
                <div id="appContainerBio" class="hidden bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden flex flex-col">
                    <div id="gridContentBio" class="p-4 max-h-[600px] overflow-y-auto custom-scrollbar"></div>
                </div>

                <!-- Estado Vacío Inicial -->
                <div id="emptyStateBio" class="py-16 text-center">
                    <div class="max-w-md mx-auto bg-stone-50 p-8 rounded-2xl border border-dashed border-stone-300">
                        <div class="text-4xl mb-3">📊</div>
                        <h5 class="text-sm font-bold text-stone-700">Sin datos cargados</h5>
                        <p class="text-xs text-stone-400 mt-1">La hoja de cálculo Biometrico no contiene registros actualmente.</p>
                    </div>
                </div>
            </div>
        `;

        if (window.RhAsisFBio) {
            window.RhAsisFBio.groupedData = {};
        }
        RhAsisCasc.registrosBiometrico = [];

        await RhAsisCasc.cargarDatosDesdeSheets();
    },

    cargarDatosDesdeSheets: async function () {
        try {
            if (typeof FetchAPI !== 'function') return;

            const res = await FetchAPI("obtenerTodosLosRegistrosPlano", {
                action: "obtenerTodosLosRegistrosPlano"
            });

            console.log("📊 [DEBUG] Lo que devolvió Google Sheets:", res);

            if (res && res.registros && res.registros.length > 0) {
                // 🔍 IGNORAR EL FILTRO POR UN MOMENTO: Asignamos todo directo para ver qué hay
                RhAsisCasc.registrosBiometrico = res.registros;

                console.log("👀 Mostrando todos los registros sin filtro:", RhAsisCasc.registrosBiometrico.length);
                console.log("📌 Ejemplo de la primera fila (Columna A / Centro):", RhAsisCasc.registrosBiometrico[0][0]);

                RhAsisCasc.renderGrid(RhAsisCasc.registrosBiometrico);
            } else {
                console.warn("⚠️ La hoja de Google Sheets no devolvió ningún registro.");
                RhAsisCasc.registrosBiometrico = [];
                RhAsisCasc.renderGrid([]);
            }
        } catch (e) {
            console.error("❌ Error cargando datos:", e);
            RhAsisCasc.registrosBiometrico = [];
            RhAsisCasc.renderGrid([]);
        }
    },

    manejarCargaYGuardadoAutomatico: async function (input) {
        const file = input.files[0];
        if (!file) return;

        const labelCarga = document.getElementById('labelCargaDatos');
        const iconoCarga = document.getElementById('iconoCarga');
        const textCarga = document.getElementById('textoCargaBtn');

        try {
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

            if (window.RhAsisFBio && typeof RhAsisFBio.manejarCargaArchivo === 'function') {
                await RhAsisFBio.manejarCargaArchivo(input);
            } else if (window.RhAsisFBio && typeof RhAsisFBio.procesarArchivoBiometrico === 'function') {
                await RhAsisFBio.procesarArchivoBiometrico(file);
            }

            if (!window.RhAsisFBio || !window.RhAsisFBio.groupedData || Object.keys(window.RhAsisFBio.groupedData).length === 0) {
                alert("El archivo se leyó pero no se encontraron datos válidos.");
                return;
            }

            let primerNumEmp = "";
            let rawFecha = "";

            const primerId = Object.keys(RhAsisFBio.groupedData)[0];
            if (primerId && RhAsisFBio.groupedData[primerId].rows.length > 0) {
                const primeraFila = RhAsisFBio.groupedData[primerId].rows[0];
                primerNumEmp = primeraFila[0] || "";
                rawFecha = primeraFila[8] || primeraFila[9] || "";
            }

            if (!rawFecha) {
                alert("⚠️ No se pudo detectar la fecha en el archivo.");
                window.RhAsisFBio.groupedData = {};
                return;
            }

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

            if (textCarga) {
                textCarga.innerText = "Verificando en sistema...";
            }

            // 🏢 OBTENER LA CLAVE DEL CENTRO: DIAGNÓSTICO DEL SELECT
            let claveCentroSeleccionado = "";
            const selectCentro = document.getElementById('filtro-campos-regional');

            console.log("🔍 [DEBUG] Elemento select encontrado:", selectCentro);
            console.log("🔍 [DEBUG] Valor actual del select (.value):", selectCentro ? selectCentro.value : "NO EXISTE EL SELECT");

            if (selectCentro && selectCentro.value) {
                const matchVal = selectCentro.value.match(/^(\d+)/);
                claveCentroSeleccionado = matchVal ? matchVal[1] : selectCentro.value.trim();
            }

            console.log("🔍 [DEBUG] ClaveCentro extraída final:", claveCentroSeleccionado);

            // 🛑 VALIDACIÓN ESTRICTA
            if (!claveCentroSeleccionado) {
                alert("⚠️ Por favor selecciona un Centro de Trabajo válido en el menú superior antes de continuar.");
                window.RhAsisFBio.groupedData = {};
                return;
            }

            claveCentroSeleccionado = String(claveCentroSeleccionado).trim();

            if (typeof FetchAPI === 'function') {
                const verificacion = await FetchAPI("verificarFechaBiometrico", {
                    action: "verificarFechaBiometrico",
                    numEmp: primerNumEmp,
                    fecha: fechaNormalizada
                });
                const yaExiste = verificacion && (verificacion.existe === true || verificacion.existe === "true");

                if (yaExiste) {
                    window.RhAsisFBio.groupedData = {};
                    alert(`🛑 Los datos de los empleados para el periodo del formato ya fueron cargados anteriormente.`);
                    return;
                } else {
                    if (textCarga) {
                        textCarga.innerText = "Guardando datos...";
                    }

                    const rowsParaSheets = [];
                    Object.keys(RhAsisFBio.groupedData).forEach(id => {
                        const empleado = RhAsisFBio.groupedData[id];
                        empleado.rows.forEach(row => {
                            rowsParaSheets.push([
                                claveCentroSeleccionado, // 👈 1er campo: ClaveCentro real
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
                        alert(`✅ ¡Datos cargados y guardados exitosamente para el centro ${claveCentroSeleccionado} (${rowsParaSheets.length} registros)!`);
                        await RhAsisCasc.cargarDatosDesdeSheets();
                    } else {
                        alert("⚠️ Aviso al guardar en Sheets: " + (resultado ? resultado.message : "Desconocido"));
                    }
                }
            }

        } catch (error) {
            console.error("Error en la validación y carga:", error);
            alert("❌ Ocurrió un error al procesar la validación y carga.");
            if (window.RhAsisFBio) window.RhAsisFBio.groupedData = {};
        } finally {
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

    renderGrid: function (listaRegistros) {
        const gridContent = document.getElementById('gridContentBio');
        const emptyState = document.getElementById('emptyStateBio');
        const appContainer = document.getElementById('appContainerBio');
        const exportBtn = document.getElementById('exportBtn');

        if (!gridContent) return;

        // 🏢 Obtener la clave de centro activa y normalizarla a texto plano sin espacios
        const claveCentroActivo = RhAsisCasc.obtenerClaveCentroActual ? String(RhAsisCasc.obtenerClaveCentroActual()).trim() : "";

        // 🔒 Filtrado estricto y limpio para evitar duplicados fantasma por espacios o tipos
        const registrosFiltradosPorCentro = (listaRegistros || []).filter(r => {
            if (!claveCentroActivo) return true;
            const centroFila = String(r[0] || "").trim();
            return centroFila === claveCentroActivo;
        });

        if (!registrosFiltradosPorCentro || registrosFiltradosPorCentro.length === 0) {
            if (emptyState) emptyState.classList.remove('hidden');
            if (appContainer) appContainer.classList.add('hidden');
            if (exportBtn) {
                exportBtn.disabled = true;
                exportBtn.className = "bg-stone-300 opacity-50 cursor-not-allowed text-stone-700 px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2";
            }
            gridContent.innerHTML = "";
            return;
        }

        if (emptyState) emptyState.classList.add('hidden');
        if (appContainer) appContainer.classList.remove('hidden');

        if (exportBtn) {
            exportBtn.disabled = false;
            exportBtn.className = "bg-[#249444] hover:bg-[#1b7033] text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-2 cursor-pointer";
        }

        const headers = RhAsisCasc.rawHeaderGlobal;

        gridContent.innerHTML = `
            <div class="overflow-x-auto rounded-xl border border-stone-200">
                <table class="w-full text-[10px]">
                    <thead class="bg-stone-100 font-bold text-stone-700 sticky top-0 z-10">
                        <tr>${headers.map(h => `<th class="p-2.5 border border-stone-200 text-center">${h}</th>`).join('')}</tr>
                    </thead>
                    <tbody>
                        ${registrosFiltradosPorCentro.map(r => `
                            <tr class="bg-white hover:bg-stone-50 text-stone-700">
                                ${r.slice(0, 12).map(c => {
            let val = c;
            if (val instanceof Date) {
                val = val.toLocaleDateString();
            } else if (typeof val === 'string' && val.includes('T') && val.length > 18) {
                const d = new Date(val);
                if (!isNaN(d)) val = d.toLocaleDateString();
            }
            return `<td class="p-2 border border-stone-200/50 text-center">${val !== null && val !== undefined ? val : ''}</td>`;
        }).join('')}
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    },

    obtenerClaveCentroActual: function () {
        let clave = "";

        // 1. Buscar el valor directamente en el selector visual activo de la interfaz
        const selectCentro = document.querySelector('select') || document.getElementById('selectCentro') || document.querySelector('[role="combobox"]');
        if (selectCentro && selectCentro.value) {
            const matchVal = selectCentro.value.match(/^(\d+)/);
            clave = matchVal ? matchVal[1] : selectCentro.value;
        }

        // 2. Si no hay select activo, buscar estrictamente en el almacenamiento local de la sesión
        if (!clave) {
            clave = localStorage.getItem('centro_activo_actual') || localStorage.getItem('depto_activo_actual') || "";
        }

        return String(clave).trim();
    },

    filtrarTablaGeneral: function (texto) {
        const query = texto.toLowerCase().trim();
        if (!query) {
            RhAsisCasc.renderGrid(RhAsisCasc.registrosBiometrico);
            return;
        }

        const filtrados = RhAsisCasc.registrosBiometrico.filter(row => {
            const centro = String(row[0] || "").toLowerCase();
            const numEmp = String(row[1] || "").toLowerCase();
            const fecha = String(row[6] || "").toLowerCase();

            return centro.includes(query) || numEmp.includes(query) || fecha.includes(query);
        });

        RhAsisCasc.renderGrid(filtrados);
    }
};