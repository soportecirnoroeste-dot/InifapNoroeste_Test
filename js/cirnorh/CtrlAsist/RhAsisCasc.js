// js/cirnorh/asistencia/RhAsisCasc.js

window.RhAsisCasc = {
    registrosBiometrico: [],
    // Cabeceras exactas basadas en el formato visual de tu imagen
    rawHeaderGlobal: [
        "NO. EMPLEADO", "ADSCRIPCIÓN", "NOMBRE", "RFC",
        "HORA ENTRADA", "HORA SALIDA", "REGISTRO", "SALIDA / ENTRADA",
        "FECHA", "DÍA", "RETARDO MENOR", "RETARDO MEDIANO", "RETARDO MAYOR", "FALTA"
    ],

    extraerHoraLegible: function (valor, esRegistroCompleto = false) {
        if (!valor) return "";
        let strVal = String(valor).trim();

        if (strVal.includes('1899-12-30T') || strVal.includes('T')) {
            const fechaObj = new Date(strVal);
            if (!isNaN(fechaObj.getTime())) {
                const horas = String(fechaObj.getHours()).padStart(2, '0');
                const minutos = String(fechaObj.getMinutes()).padStart(2, '0');
                if (esRegistroCompleto) {
                    const segundos = String(fechaObj.getSeconds()).padStart(2, '0');
                    return `${horas}:${minutos}:${segundos}`;
                }
                return `${horas}:${minutos}`;
            }
        }
        return strVal;
    },

    mostrarVistaBiometrico: async function () {
        const contenedor = document.getElementById('app-container') || document.querySelector('main') || document.body;

        if (!contenedor) return;

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
            <div class="space-y-6 animate-fade-in pb-10">
                <div class="bg-white rounded-2xl shadow-sm border border-stone-200 p-6 space-y-6">
                    
                    <div class="flex items-center gap-3 mb-6 pb-4 border-b border-stone-100">
                        <div class="p-2.5 bg-[#f0fdf4] border border-[#c6f6d5] text-[#059669] rounded-xl flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 21a8 8 0 0 1 13.292-6"/><circle cx="10" cy="8" r="5"/><path d="m16 19 2 2 4-4"/></svg>
                        </div>
                        <div>
                            <h3 class="font-black text-stone-800 text-lg uppercase tracking-wide">CONTROL DE ASISTENCIA</h3>
                            <p class="text-xs text-stone-500"></p>
                        </div>
                    </div>

                    <div class="bg-stone-50/60 rounded-2xl border border-stone-200 p-5 space-y-4">
                        <div class="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4">
                            <h4 class="font-bold text-stone-800 text-sm pt-1">Gestión de Asistencias</h4>

                            <input type="file" id="uploadBiometrico" class="hidden" accept=".xlsx, .xlsm, .csv" onchange="RhAsisCasc.manejarCargaYGuardadoAutomatico(this)">

                            <div class="flex flex-wrap items-end gap-3 w-full xl:w-auto">
                                <div class="flex flex-col gap-1">
                                    <label for="filtroFechaDesde" class="text-[10px] font-bold text-stone-500 uppercase tracking-wider">De</label>
                                    <input type="date" id="filtroFechaDesde" onchange="RhAsisCasc.aplicarFiltrosCombinados()"
                                        class="px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs uppercase outline-none focus:ring-2 focus:ring-[#249444] text-stone-700 shadow-xs cursor-pointer">
                                </div>

                                <div class="flex flex-col gap-1">
                                    <label for="filtroFechaHasta" class="text-[10px] font-bold text-stone-500 uppercase tracking-wider">Hasta</label>
                                    <input type="date" id="filtroFechaHasta" onchange="RhAsisCasc.aplicarFiltrosCombinados()"
                                        class="px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs uppercase outline-none focus:ring-2 focus:ring-[#249444] text-stone-700 shadow-xs cursor-pointer">
                                </div>

                                <div class="flex flex-col gap-1">
                                    <label for="filtroCentroBio" class="text-[10px] font-bold text-stone-500 uppercase tracking-wider">Centro</label>
                                    <input type="text" id="filtroCentroBio" oninput="RhAsisCasc.aplicarFiltrosCombinados()" placeholder="Centro..."
                                        class="w-32 px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs uppercase outline-none focus:ring-2 focus:ring-[#249444] transition-all shadow-xs text-stone-700">
                                </div>

                                <div class="flex flex-col gap-1">
                                    <label for="filtroNumEmpBio" class="text-[10px] font-bold text-stone-500 uppercase tracking-wider">N° Empleado</label>
                                    <input type="text" id="filtroNumEmpBio" oninput="RhAsisCasc.aplicarFiltrosCombinados()" placeholder="Núm..."
                                        class="w-32 px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs uppercase outline-none focus:ring-2 focus:ring-[#249444] transition-all shadow-xs text-stone-700">
                                </div>

                                <button id="labelCargaDatos" class="px-4 py-2 bg-[#249444] text-white rounded-xl text-xs font-bold hover:bg-[#1e7a37] transition flex items-center gap-2 cursor-pointer shadow-xs h-[34px]" onclick="document.getElementById('uploadBiometrico').click();">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-file-up"><path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"/><path d="M14 2v5a1 1 0 0 0 1 1h5"/><path d="M12 12v6"/><path d="m15 15-3-3-3 3"/></svg>
                                    <span id="textoCargaBtn">Carga de Datos</span>
                                </button>

                                <button id="exportBtn" disabled onclick="if(window.RhAsisCasc && typeof RhAsisCasc.exportarExcelCasc === 'function') RhAsisCasc.exportarExcelCasc()" class="px-4 py-2 bg-[#249444] text-white rounded-xl text-xs font-bold hover:bg-[#1e7a37] transition flex items-center gap-2 shadow-xs opacity-60 cursor-not-allowed h-[34px]">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-file-down"><path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"/><path d="M14 2v5a1 1 0 0 0 1 1h5"/><path d="M12 18v-6"/><path d="m9 15 3 3 3-3"/></svg>
                                    Exportar Información
                                </button>
                            </div>
                        </div>
                    </div>

                    <div class="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
                        <div class="px-6 py-4 border-b border-stone-100 flex justify-between items-center bg-white">
                            <h4 class="font-bold text-stone-800 text-xs uppercase tracking-wider">LISTADO GENERAL DE BIOMÉTRICO</h4>
                            <span id="contadorRegistrosBio" class="text-xs font-bold text-stone-500"></span>
                        </div>

                        <div id="gridContentBio" class="max-h-[500px] overflow-y-auto overflow-x-auto custom-scrollbar">
                            <table class="w-full text-[11px] text-left border-collapse min-w-[950px]">
                                <thead class="bg-stone-50 font-bold text-stone-700 sticky top-0 z-10 border-b border-stone-200">
                                    <tr>${RhAsisCasc.rawHeaderGlobal.map(h => `<th class="p-3 border-b border-stone-200 text-center whitespace-nowrap">${h}</th>`).join('')}</tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td colspan="${RhAsisCasc.rawHeaderGlobal.length}" class="py-12 text-center text-stone-400 italic font-medium">
                                            SINCRONIZANDO DATOS...
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
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
            const claveCentroActivo = RhAsisCasc.obtenerClaveCentroActual ? String(RhAsisCasc.obtenerClaveCentroActual()).trim() : "";
            const res = await FetchAPI("obtenerTodosLosRegistrosPlano", {
                claveCentro: claveCentroActivo,
                centro: claveCentroActivo
            });

            if (res && res.success && Array.isArray(res.registros)) {
                RhAsisCasc.registrosBiometrico = res.registros;
                RhAsisCasc.renderGrid(RhAsisCasc.registrosBiometrico);
            } else {
                RhAsisCasc.registrosBiometrico = [];
                RhAsisCasc.renderGrid([]);
            }
        } catch (e) {
            RhAsisCasc.registrosBiometrico = [];
            RhAsisCasc.renderGrid([]);
        }
    },

    manejarCargaYGuardadoAutomatico: async function (input) {
        const file = input.files[0];
        if (!file) return;

        try {
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
            if (primerId && RhAsisFBio.groupedData[primerId].rows && RhAsisFBio.groupedData[primerId].rows.length > 0) {
                const primeraFila = RhAsisFBio.groupedData[primerId].rows[0];
                primerNumEmp = primeraFila[0] || "";
                rawFecha = primeraFila[8] || primeraFila[7] || "";
            }

            let fechaNormalizada = RhAsisCasc.normalizarFechaFiltro(rawFecha);
            let claveCentroSeleccionado = RhAsisCasc.obtenerClaveCentroActual() || localStorage.getItem('centro_activo_actual') || "";

            if (typeof FetchAPI === 'function') {
                const rowsParaSheets = [];
                Object.keys(RhAsisFBio.groupedData).forEach(id => {
                    const empleado = RhAsisFBio.groupedData[id];
                    if (empleado && Array.isArray(empleado.rows)) {
                        empleado.rows.forEach(row => {
                            rowsParaSheets.push([
                                row[0] || "",                  // No. Empleado
                                row[1] || "",                  // Adscripción
                                row[2] || "",                  // Nombre
                                row[3] || "",                  // RFC
                                row[4] || "",                  // Hora Entrada
                                row[5] || "",                  // Hora Salida
                                row[6] || "",                  // Registro
                                row[7] || "",                  // Salida / Entrada
                                row[8] || "",                  // Fecha
                                row[9] || "",                  // Día
                                row[10] || "",                 // Retardo Menor
                                row[11] || "",                 // Retardo Mediano
                                row[12] || "",                 // Retardo Mayor
                                row[13] || ""                  // Falta
                            ]);
                        });
                    }
                });

                const resultado = await FetchAPI("guardarBiometrico", { filas: rowsParaSheets });
                if (resultado && resultado.success) {
                    alert(`✅ ¡Datos cargados y guardados exitosamente (${rowsParaSheets.length} registros)!`);
                    await RhAsisCasc.cargarDatosDesdeSheets();
                }
            }
        } catch (error) {
            if (window.RhAsisFBio) window.RhAsisFBio.groupedData = {};
        } finally {
            input.value = "";
        }
    },

    renderGrid: function (listaRegistros) {
        const gridContent = document.getElementById('gridContentBio');
        const exportBtn = document.getElementById('exportBtn');
        const contador = document.getElementById('contadorRegistrosBio');
        if (!gridContent) return;

        const headers = RhAsisCasc.rawHeaderGlobal;

        if (!listaRegistros || listaRegistros.length === 0) {
            if (exportBtn) {
                exportBtn.disabled = true;
                exportBtn.className = "bg-stone-100 border border-stone-200 text-stone-400 opacity-60 cursor-not-allowed px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2";
            }
            if (contador) contador.innerText = "";
            gridContent.innerHTML = `<table class="w-full text-[11px] text-left border-collapse min-w-[950px]"><thead class="bg-stone-100 font-bold text-stone-700 sticky top-0 z-10 border-b border-stone-200"><tr>${headers.map(h => `<th class="p-3 border-b border-stone-200 text-center whitespace-nowrap">${h}</th>`).join('')}</tr></thead><tbody><tr><td colspan="${headers.length}" class="py-12 text-center text-stone-400 italic font-medium">SIN DATOS REGISTRADOS</td></tr></tbody></table>`;
            return;
        }

        if (exportBtn) {
            exportBtn.disabled = false;
            exportBtn.className = "px-4 py-2 bg-[#249444] hover:bg-[#1e7a37] text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer";
        }
        if (contador) contador.innerText = `${listaRegistros.length} registros`;

        gridContent.innerHTML = `
            <table class="w-full text-[11px] text-left border-collapse min-w-[950px]">
                <thead class="bg-stone-100 font-bold text-stone-700 sticky top-0 z-10 border-b border-stone-200">
                    <tr>${headers.map(h => `<th class="p-3 border-b border-stone-200 text-center whitespace-nowrap">${h}</th>`).join('')}</tr>
                </thead>
                <tbody class="divide-y divide-stone-100">
                    ${listaRegistros.map(r => {
            const celdas = Array.isArray(r) ? [...r.slice(0, 14)] : headers.map(h => r[h] || "");
            return `<tr class="bg-white hover:bg-stone-50 transition text-stone-700">${celdas.map((c, index) => {
                let val = c;
                if (index === 4 || index === 5) val = RhAsisCasc.extraerHoraLegible(val, false);
                else if (index === 6) val = RhAsisCasc.extraerHoraLegible(val, true);
                return `<td class="p-2.5 border-b border-stone-100 text-center whitespace-nowrap">${val !== null && val !== undefined ? val : ''}</td>`;
            }).join('')}</tr>`;
        }).join('')}
                </tbody>
            </table>
        `;
    },

    obtenerClaveCentroActual: function () {
        let clave = "";
        const selectCentro = document.getElementById('filtro-campos-regional') || document.querySelector('select');
        if (selectCentro && selectCentro.value) {
            const matchVal = selectCentro.value.match(/^(\d+)/);
            clave = matchVal ? matchVal[1] : selectCentro.value;
        }
        return String(clave || localStorage.getItem('centro_activo_actual') || "").trim();
    },

    normalizarFechaFiltro: function (fechaStr) {
        if (!fechaStr) return "";
        let str = String(fechaStr).trim();
        if (str.includes('T')) str = str.split('T')[0];
        return str;
    },

    aplicarFiltrosCombinados: function () {
        const fechaDesde = document.getElementById('filtroFechaDesde')?.value || "";
        const fechaHasta = document.getElementById('filtroFechaHasta')?.value || "";
        const numEmpFiltro = document.getElementById('filtroNumEmpBio')?.value.toLowerCase().trim() || "";
        const centroFiltro = document.getElementById('filtroCentroBio')?.value.toLowerCase().trim() || "";

        const filtrados = RhAsisCasc.registrosBiometrico.filter(row => {
            if (!Array.isArray(row)) return false;
            const numEmp = String(row[0] || "").toLowerCase();
            const adscripcion = String(row[1] || "").toLowerCase();
            const fechaRegRaw = RhAsisCasc.normalizarFechaFiltro(String(row[8] || ""));

            if (centroFiltro && !adscripcion.includes(centroFiltro)) return false;
            if (numEmpFiltro && !numEmp.includes(numEmpFiltro)) return false;
            if (fechaDesde && fechaRegRaw < fechaDesde) return false;
            if (fechaHasta && fechaRegRaw > fechaHasta) return false;
            return true;
        });

        RhAsisCasc.renderGrid(filtrados);
    },

    obtenerRegistrosFiltradosActuales: function () {
        const fechaDesdeInput = document.getElementById('filtroFechaDesde')?.value || "";
        const fechaHastaInput = document.getElementById('filtroFechaHasta')?.value || "";
        const numEmpFiltro = document.getElementById('filtroNumEmpBio')?.value.toLowerCase().trim() || "";
        const centroFiltro = document.getElementById('filtroCentroBio')?.value.toLowerCase().trim() || "";

        return RhAsisCasc.registrosBiometrico.filter(row => {
            if (!Array.isArray(row)) return false;
            const numEmp = String(row[0] || "").toLowerCase();
            const adscripcion = String(row[1] || "").toLowerCase();
            if (centroFiltro && !adscripcion.includes(centroFiltro)) return false;
            if (numEmpFiltro && !numEmp.includes(numEmpFiltro)) return false;
            return true;
        });
    },

    generateWorkbookCasc: function () {
        const wb = XLSX.utils.book_new();
        const fondoHoja = "E9F5E9"; // Fondo verde claro visible como en tu imagen
        const MaxCol = RhAsisCasc.rawHeaderGlobal.length;

        const registrosAExportar = RhAsisCasc.obtenerRegistrosFiltradosActuales();
        const numEmpFiltro = document.getElementById('filtroNumEmpBio')?.value.trim() || "";

        const mapearRegistros = (lista) => {
            return lista.map(r => {
                const celdas = Array.isArray(r) ? [...r.slice(0, 14)] : RhAsisCasc.rawHeaderGlobal.map(h => r[h] || "");
                return celdas.map((c, index) => {
                    let val = c;
                    if (index === 4 || index === 5) val = RhAsisCasc.extraerHoraLegible(val, false);
                    else if (index === 6) val = RhAsisCasc.extraerHoraLegible(val, true);
                    return val !== null && val !== undefined ? val : "";
                });
            });
        };

        let gruposAProcesar = {};
        if (!numEmpFiltro) {
            registrosAExportar.forEach(row => {
                const empId = String(row[0] || "S_N").trim();
                if (!gruposAProcesar[empId]) gruposAProcesar[empId] = [];
                gruposAProcesar[empId].push(row);
            });
        } else {
            gruposAProcesar[`Emp_${numEmpFiltro}`] = registrosAExportar;
        }

        Object.keys(gruposAProcesar).forEach(key => {
            const rowsMapeadas = mapearRegistros(gruposAProcesar[key]);
            const etiquetaEmp = numEmpFiktro = numEmpFiltro ? numEmpFiltro : key;

            // Estructura exacta de filas superiores idéntica a tu captura de pantalla
            const wsData = [
                ["inifap", "", "INSTITUTO NACIONAL DE INVESTIGACIONES FORESTALES AGRÍCOLAS Y PECUARIAS"],
                ["Instituto Nacional de Investigaciones", "", "COORDINACIÓN DE ADMINISTRACIÓN Y SISTEMAS"],
                ["Forestales, Agrícolas y Pecuarias", "", "DIRECCIÓN DE DESARROLLO HUMANO Y PROFESIONALIZACIÓN"],
                ["", "", "INCIDENCIAS GENERADAS DE ACUERDO AL REGISTRO ELECTRÓNICO V2"],
                ["", "", "Reporte: RH_CONTROL_ASISTENCIA_V2"],
                [],
                RhAsisCasc.rawHeaderGlobal,
                ...rowsMapeadas
            ];

            const ws = XLSX.utils.aoa_to_sheet(wsData);
            ws['!ref'] = `A1:${XLSX.utils.encode_col(MaxCol - 1)}${wsData.length + 10}`;
            
            // IMPORTANTE: Mantiene las líneas de cuadrícula visibles como se observa en tu captura
            ws['!view'] = { showGridLines: true };

            // Fusiones idénticas a la imagen para que el membrete encaje perfecto
            ws['!merges'] = [
                { s: { r: 0, c: 0 }, e: { r: 0, c: 1 } },
                { s: { r: 1, c: 0 }, e: { r: 1, c: 1 } },
                { s: { r: 2, c: 0 }, e: { r: 2, c: 1 } },
                { s: { r: 0, c: 2 }, e: { r: 0, c: MaxCol - 1 } },
                { s: { r: 1, c: 2 }, e: { r: 1, c: MaxCol - 1 } },
                { s: { r: 2, c: 2 }, e: { r: 2, c: MaxCol - 1 } },
                { s: { r: 3, c: 2 }, e: { r: 3, c: MaxCol - 1 } },
                { s: { r: 4, c: 2 }, e: { r: 4, c: MaxCol - 1 } }
            ];

            // Anchos dinámicos generosos para que ninguna celda salga cortada
            const colWidths = RhAsisCasc.rawHeaderGlobal.map((h, i) => {
                if (i === 1) return { wch: 35 }; // Adscripción
                if (i === 2) return { wch: 30 }; // Nombre
                if (i === 3) return { wch: 15 }; // RFC
                return { wch: 14 };
            });
            ws['!cols'] = colWidths;

            // Pintado de estilos con soporte para xlsx-js-style
            const totalFilasHoja = Math.max(500, wsData.length);
            for (let r = 0; r < totalFilasHoja; r++) {
                for (let c = 0; c < MaxCol; c++) {
                    const cellRef = XLSX.utils.encode_cell({ r: r, c: c });
                    if (!ws[cellRef]) ws[cellRef] = { v: "" };

                    let style = {
                        fill: { type: 'pattern', pattern: 'solid', fgColor: { rgb: fondoHoja } },
                        font: { sz: 10, name: "Calibri", color: { rgb: "000000" } },
                        alignment: { vertical: "center", horizontal: "left" }
                    };

                    // Logotipo INIFAP en celda A1: grande, verde y negrita
                    if (r === 0 && c === 0) {
                        style.font = { bold: true, sz: 20, color: { rgb: "249444" }, name: "Calibri" };
                        style.alignment.horizontal = "left";
                    }
                    // Subtítulos izquierdos (Filas 1 y 2)
                    else if (r >= 1 && r <= 2 && c === 0) {
                        style.font = { sz: 9, color: { rgb: "333333" }, bold: true, name: "Calibri" };
                        style.alignment.horizontal = "left";
                    }
                    // Textos institucionales derechos (Filas 0 a 4)
                    else if (r >= 0 && r <= 4 && c >= 2) {
                        style.font = { sz: 10, bold: (r <= 3), color: { rgb: "000000" }, name: "Calibri" };
                        style.alignment.horizontal = "left";
                    }
                    // Cabecera de la tabla (Fila 6): Gris corporativo con bordes oscuros limpios
                    else if (r === 6) {
                        style.fill = { type: 'pattern', pattern: 'solid', fgColor: { rgb: "D9D9D9" } };
                        style.font = { bold: true, sz: 10, color: { rgb: "000000" }, name: "Calibri" };
                        style.alignment.horizontal = "center";
                        style.border = {
                            top: { style: "medium", color: { rgb: "000000" } },
                            bottom: { style: "medium", color: { rgb: "000000" } },
                            left: { style: "thin", color: { rgb: "000000" } },
                            right: { style: "thin", color: { rgb: "000000" } }
                        };
                    }
                    // Celdas de Datos (Fila 7 en adelante)
                    else if (r >= 7) {
                        style.alignment.horizontal = (c <= 3 || c === 8 || c === 9) ? "center" : "center";
                        style.border = {
                            top: { style: "thin", color: { rgb: "BFBFBF" } },
                            bottom: { style: "thin", color: { rgb: "BFBFBF" } },
                            left: { style: "thin", color: { rgb: "BFBFBF" } },
                            right: { style: "thin", color: { rgb: "BFBFBF" } }
                        };
                    }

                    ws[cellRef].s = style;
                }
            }

            const nombreHojaLimpio = String(etiquetaEmp).replace(/[:\\\/?*\[\]]/g, "_").substring(0, 31);
            XLSX.utils.book_append_sheet(wb, ws, nombreHojaLimpio);
        });

        return wb;
    },

    exportarExcelCasc: function () {
        const wb = RhAsisCasc.generateWorkbookCasc();
        const centroActual = RhAsisCasc.obtenerClaveCentroActual() || "General";
        const numEmpFiltro = document.getElementById('filtroNumEmpBio')?.value.trim() || "";
        const sufijo = numEmpFiltro ? `Emp_${numEmpFiltro}` : "Todos_Empleados";
        XLSX.writeFile(wb, `Reporte_Biometrico_${centroActual}_${sufijo}.xlsx`);
    }
};