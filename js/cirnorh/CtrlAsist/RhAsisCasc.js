// js/cirnorh/asistencia/RhAsisCasc.js

window.RhAsisCasc = {
    registrosBiometrico: [],
    rawHeaderGlobal: [
        "Centro", "Núm. Emp", "Hra.Entrada", "Hra. Salida",
        "Hra.Registro", "Registro", "Fecha Reg.", "Día Reg.",
        "Retardo Men.", "Retardo Med.", "Retardo May.", "Falta"
    ],

    mostrarVistaBiometrico: async function () {
        const contenedorDinamico = document.getElementById('contenido-submodulo-dinamico') || document.getElementById('app-container') || document.querySelector('main') || document.body;

        if (!contenedorDinamico) {
            console.error("❌ ERROR: No se encontró ningún contenedor para pintar la vista.");
            return;
        }

        contenedorDinamico.className = "w-full space-y-6";

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

        // 🎯 ESTRUCTURA IDÉNTICA AL MÓDULO DE PERSONAL
        contenedorDinamico.innerHTML = `
            <div id="contenedor-gestion-biometrico" class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-stone-50 p-4 rounded-xl border border-stone-200">
                <div>
                    <h4 class="font-bold text-stone-800 text-sm">Módulo Biométrico - INIFAP</h4>
                    <p class="text-xs text-stone-500">Cargue el reporte oficial RH_CONTROL_ASISTENCIA_V2 para gestionar incidencias.</p>
                </div>
                <div class="flex flex-wrap items-center gap-2">
                    <input type="file" id="uploadBiometrico" class="hidden" accept=".xlsx, .xlsm, .csv" onchange="RhAsisCasc.manejarCargaYGuardadoAutomatico(this)">
                    
                    <label id="labelCargaDatos" for="uploadBiometrico" class="px-4 py-2 bg-[#249444] text-white rounded-xl text-xs font-bold hover:bg-[#1e7a37] transition flex items-center gap-2 cursor-pointer shadow-sm">
                        <span id="iconoCarga">📂</span> <span id="textoCargaBtn">Carga de Datos</span>
                    </label>

                    <button id="exportBtn" disabled onclick="if(window.RhAsisFBio && typeof RhAsisFBio.exportarExcel === 'function') RhAsisFBio.exportarExcel()" class="px-4 py-2 bg-stone-200 text-stone-400 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-not-allowed">
                        <span>📥</span> Exportar reporte
                    </button>
                </div>
            </div>

            <div class="bg-stone-50 p-4 rounded-xl border border-stone-200 flex items-center gap-3">
                <div class="relative w-full">
                    <span class="absolute left-3 top-1/2 -translate-y-1/2 opacity-50 text-xs">🔍</span>
                    <input type="text" id="searchInputBio" placeholder="Buscar por centro, N° emp o fecha..." oninput="RhAsisCasc.filtrarTablaGeneral(this.value)"
                        class="w-full pl-9 pr-4 py-2 bg-white border border-stone-300 rounded-lg text-xs outline-none focus:border-[#249444] transition-all">
                </div>
            </div>

            <div id="contenedor-listado-biometrico" class="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-sm">
                <div class="p-4 border-b border-stone-100 font-bold text-xs text-stone-700 uppercase tracking-wider flex justify-between items-center">
                    <span>Listado General de Biométrico</span>
                    <span id="contadorRegistrosBio" class="text-[11px] font-normal text-stone-500"></span>
                </div>
                <div class="overflow-x-auto">
                    <div id="gridContentBio" class="max-h-[600px] overflow-y-auto custom-scrollbar"></div>
                </div>
            </div>

            <div id="emptyStateBio" class="py-16 text-center">
                <div class="max-w-md mx-auto bg-stone-50 p-8 rounded-xl border border-dashed border-stone-300">
                    <div class="text-3xl mb-2">📊</div>
                    <h5 class="text-xs font-bold text-stone-700">Sin datos cargados</h5>
                    <p class="text-[11px] text-stone-400 mt-1">La hoja de cálculo Biometrico no contiene registros actualmente.</p>
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

            const claveCentroActivo = RhAsisCasc.obtenerClaveCentroActual ? String(RhAsisCasc.obtenerClaveCentroActual()).trim() : "";

            const res = await FetchAPI("obtenerTodosLosRegistrosPlano", {
                claveCentro: claveCentroActivo,
                centro: claveCentroActivo
            });

            if (res && res.success && res.registros) {
                RhAsisCasc.registrosBiometrico = res.registros;
                RhAsisCasc.renderGrid(RhAsisCasc.registrosBiometrico);
            } else {
                RhAsisCasc.registrosBiometrico = [];
                RhAsisCasc.renderGrid([]);
            }
        } catch (e) {
            console.error("❌ Error crítico capturado en cargarDatosDesdeSheets:", e);
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
                labelCarga.classList.remove('cursor-pointer', 'bg-[#249444]', 'hover:bg-[#1e7a37]');
                labelCarga.classList.add('bg-stone-400', 'cursor-wait');
                labelCarga.removeAttribute('for');
            }
            if (iconoCarga) {
                iconoCarga.innerHTML = `<svg class="animate-spin h-3.5 w-3.5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>`;
            }
            if (textCarga) {
                textCarga.innerText = "Analizando...";
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
                textCarga.innerText = "Verificando...";
            }

            let claveCentroSeleccionado = localStorage.getItem('centro_activo_actual') || "";
            claveCentroSeleccionado = String(claveCentroSeleccionado).trim();

            if (!claveCentroSeleccionado) {
                alert("⚠️ Por favor selecciona un Centro de Trabajo válido en el panel principal antes de continuar.");
                window.RhAsisFBio.groupedData = {};
                return;
            }

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
                        textCarga.innerText = "Guardando...";
                    }

                    const rowsParaSheets = [];
                    Object.keys(RhAsisFBio.groupedData).forEach(id => {
                        const empleado = RhAsisFBio.groupedData[id];
                        empleado.rows.forEach(row => {
                            rowsParaSheets.push([
                                claveCentroSeleccionado,
                                row[0] || "",
                                row[4] || "",
                                row[5] || "",
                                row[6] || "",
                                row[7] || "",
                                row[8] || "",
                                row[9] || "",
                                row[10] || "",
                                row[11] || "",
                                row[12] || "",
                                row[13] || ""
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
                labelCarga.classList.add('bg-[#249444]', 'hover:bg-[#1e7a37]', 'cursor-pointer');
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
        const contenedorListado = document.getElementById('contenedor-listado-biometrico');
        const exportBtn = document.getElementById('exportBtn');
        const contador = document.getElementById('contadorRegistrosBio');

        if (!gridContent) return;

        if (!listaRegistros || listaRegistros.length === 0) {
            if (emptyState) emptyState.classList.remove('hidden');
            if (contenedorListado) contenedorListado.classList.add('hidden');
            if (exportBtn) {
                exportBtn.disabled = true;
                exportBtn.className = "px-4 py-2 bg-stone-200 text-stone-400 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-not-allowed";
            }
            if (contador) contador.innerText = "";
            gridContent.innerHTML = "";
            return;
        }

        if (emptyState) emptyState.classList.add('hidden');
        if (contenedorListado) contenedorListado.classList.remove('hidden');

        if (exportBtn) {
            exportBtn.disabled = false;
            exportBtn.className = "px-4 py-2 bg-[#249444] text-white rounded-xl text-xs font-bold hover:bg-[#1e7a37] transition flex items-center gap-2 cursor-pointer shadow-sm";
        }

        if (contador) {
            contador.innerText = `${listaRegistros.length} registros encontrados`;
        }

        const headers = RhAsisCasc.rawHeaderGlobal;

        // Tabla idéntica a la de personal (text-xs, cabecera stone-50, bordes finos stone-200)
        gridContent.innerHTML = `
            <table class="w-full text-left border-collapse text-xs">
                <thead>
                    <tr class="bg-stone-50 text-stone-600 border-b border-stone-200">
                        ${headers.map(h => `<th class="p-3 text-center">${h}</th>`).join('')}
                    </tr>
                </thead>
                <tbody>
                    ${listaRegistros.map(r => {
                        const celdas = Array.isArray(r) ? r.slice(0, 12) : headers.map(h => r[h] || "");
                        return `
                            <tr class="border-b border-stone-100 hover:bg-stone-50 transition text-stone-700">
                                ${celdas.map(c => {
                                    let val = c;
                                    if (val instanceof Date) {
                                        val = val.toLocaleDateString();
                                    } else if (typeof val === 'string' && val.includes('T') && val.length > 18) {
                                        const d = new Date(val);
                                        if (!isNaN(d)) val = d.toLocaleDateString();
                                    }
                                    return `<td class="p-3 text-center font-mono">${val !== null && val !== undefined && String(val).trim() !== '' ? val : 'N/A'}</td>`;
                                }).join('')}
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>
        `;
    },

    obtenerClaveCentroActual: function () {
        let clave = "";
        const selectCentro = document.getElementById('filtro-campos-regional') || document.querySelector('select') || document.querySelector('[role="combobox"]');
        if (selectCentro && selectCentro.value) {
            const matchVal = selectCentro.value.match(/^(\d+)/);
            clave = matchVal ? matchVal[1] : selectCentro.value;
        }

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