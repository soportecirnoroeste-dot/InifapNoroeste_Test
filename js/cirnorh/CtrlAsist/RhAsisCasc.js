// js/cirnorh/asistencia/RhAsisCasc.js

window.RhAsisCasc = {
    registrosBiometrico: [],
    rawHeaderGlobal: [
        "Centro", "Núm. Emp", "Hra.Entrada", "Hra. Salida",
        "Hra.Registro", "Registro", "Fecha Reg.", "Día Reg.",
        "Retardo Men.", "Retardo Med.", "Retardo May.", "Falta"
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
        renderizarVistaModulo('CONTROL DE ASISTENCIA', "");
        const contenedor = document.getElementById('contenido-submodulo-dinamico');
        if (!contenedor) return;

        contenedor.className = "w-full space-y-6";
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
            <div id="contenedor-gestion-personal" class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-stone-50 p-4 rounded-xl border border-stone-200">
                <div>
                    <h4 class="font-bold text-stone-800 text-sm">Gestión de Asistencias</h4>
                </div>
                <div class="flex gap-2">
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
                        <input type="text" id="filtroCentroBio" oninput="RhAsisCasc.aplicarFiltrosCombinados()"
                            class="w-28 px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs uppercase outline-none focus:ring-2 focus:ring-[#249444] transition-all shadow-xs text-stone-700">
                    </div>

                    <div class="flex flex-col gap-1">
                        <label for="filtroNumEmpBio" class="text-[10px] font-bold text-stone-500 uppercase tracking-wider">N° Empleado</label>
                        <input type="text" id="filtroNumEmpBio" oninput="RhAsisCasc.aplicarFiltrosCombinados()"
                            class="w-28 px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs uppercase outline-none focus:ring-2 focus:ring-[#249444] transition-all shadow-xs text-stone-700">
                    </div>

                    <input type="file" id="uploadBiometrico" class="hidden" accept=".xlsx, .xlsm, .csv" onchange="RhAsisCasc.manejarCargaYGuardadoAutomatico(this)">
                    
                    <div class="flex items-center gap-2 pt-4 xl:pt-0">
                        <button id="labelCargaDatos" class="px-4 py-2 bg-[#249444] text-white rounded-xl text-xs font-bold hover:bg-[#1e7a37] transition flex items-center gap-2 cursor-pointer shadow-xs" onclick="document.getElementById('uploadBiometrico').click();">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-file-up"><path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"/><path d="M14 2v5a1 1 0 0 0 1 1h5"/><path d="M12 12v6"/><path d="m15 15-3-3-3 3"/></svg>
                            <span id="textoCargaBtn">Carga de Datos</span>
                        </button>

                        <button id="exportBtn" disabled onclick="if(window.RhAsisFBio && typeof RhAsisFBio.exportarExcel === 'function') RhAsisFBio.exportarExcel()" class="px-4 py-2 bg-[#249444] text-white rounded-xl text-xs font-bold hover:bg-[#1e7a37] transition flex items-center gap-2 shadow-xs opacity-60 cursor-not-allowed">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-file-down"><path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"/><path d="M14 2v5a1 1 0 0 0 1 1h5"/><path d="M12 18v-6"/><path d="m9 15 3 3 3-3"/></svg>
                            Exportar reporte
                        </button>
                    </div>
                </div>
            </div>

            <div class="space-y-6 animate-fade-in">
      
                <!-- Tarjeta de Gestión con filtros y botones -->
                <div class="bg-white rounded-2xl shadow-sm border border-stone-200 p-6">
                    <div class="flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-6">
                        <div>
                            <h4 class="font-bold text-stone-800 text-sm">Gestión de Asistencias</h4>
                        </div>

                        <div class="flex flex-wrap items-end gap-3">

                        </div>
                    </div>
                </div>

                <!-- Tarjeta 3: Listado General de Biométrico -->
                <div class="bg-white rounded-2xl shadow-sm border border-stone-200 p-6 space-y-4">
                    <div class="flex justify-between items-center pb-2 border-b border-stone-100">
                        <h4 class="font-bold text-stone-700 text-xs uppercase tracking-wider">Listado General de Biométrico</h4>
                        <span id="contadorRegistrosBio" class="text-xs text-stone-400 font-medium"></span>
                    </div>

                    <div id="appContainerBio" class="rounded-xl border border-stone-200 overflow-hidden bg-white">
                        <div id="gridContentBio" class="max-h-[500px] overflow-y-auto overflow-x-auto custom-scrollbar">
                            <table class="w-full text-[11px] text-left border-collapse min-w-[950px]">
                                <thead class="bg-stone-100 font-bold text-stone-700 sticky top-0 z-10 border-b border-stone-200">
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
            console.error("❌ Error crítico capturado en cargarDatosDesdeSheets:", e);
            RhAsisCasc.registrosBiometrico = [];
            RhAsisCasc.renderGrid([]);
        }
    },

    manejarCargaYGuardadoAutomatico: async function (input) {
        const file = input.files[0];
        if (!file) return;

        const labelCarga = document.getElementById('labelCargaDatos');
        const textCarga = document.getElementById('textoCargaBtn');

        try {
            if (labelCarga) {
                labelCarga.classList.remove('cursor-pointer', 'bg-[#249444]', 'hover:bg-[#1e7a37]');
                labelCarga.classList.add('bg-stone-400', 'cursor-wait');
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
            if (primerId && RhAsisFBio.groupedData[primerId].rows && RhAsisFBio.groupedData[primerId].rows.length > 0) {
                const primeraFila = RhAsisFBio.groupedData[primerId].rows[0];
                primerNumEmp = primeraFila[0] || "";
                rawFecha = primeraFila[8] || primeraFila[9] || "";
            }

            if (!rawFecha) {
                alert("⚠️ No se pudo detectar la fecha en el archivo.");
                window.RhAsisFBio.groupedData = {};
                return;
            }

            let fechaNormalizada = RhAsisCasc.normalizarFechaFiltro(rawFecha);

            if (textCarga) {
                textCarga.innerText = "Verificando...";
            }

            let claveCentroSeleccionado = RhAsisCasc.obtenerClaveCentroActual();
            if (!claveCentroSeleccionado) {
                claveCentroSeleccionado = localStorage.getItem('centro_activo_actual') || "";
            }
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
                        if (empleado && Array.isArray(empleado.rows)) {
                            empleado.rows.forEach(row => {
                                let horaRegistro = row[6] || "";
                                let tipoReg = String(row[7] || "").toUpperCase().trim();

                                let hraEntradaFinal = row[4] || "";
                                let hraSalidaFinal = row[5] || "";

                                if (tipoReg.includes("ENTRADA") && horaRegistro) {
                                    hraEntradaFinal = horaRegistro;
                                } else if (tipoReg.includes("SALIDA") && horaRegistro) {
                                    hraSalidaFinal = horaRegistro;
                                }

                                rowsParaSheets.push([
                                    claveCentroSeleccionado,
                                    row[0] || "",
                                    hraEntradaFinal,
                                    hraSalidaFinal,
                                    horaRegistro,
                                    row[7] || "",
                                    row[8] || "",
                                    row[9] || "",
                                    row[10] || "",
                                    row[11] || "",
                                    row[12] || "",
                                    row[13] || ""
                                ]);
                            });
                        }
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
            }
            if (textCarga) {
                textCarga.innerText = "Carga de Datos";
            }
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
                exportBtn.className = "px-4 py-2 bg-stone-100 border border-stone-200 text-stone-400 opacity-60 cursor-not-allowed rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-xs";
            }
            if (contador) contador.innerText = "0 registros";

            gridContent.innerHTML = `
                <table class="w-full text-[11px] text-left border-collapse min-w-[950px]">
                    <thead class="bg-stone-100 font-bold text-stone-700 sticky top-0 z-10 border-b border-stone-200">
                        <tr>${headers.map(h => `<th class="p-3 border-b border-stone-200 text-center whitespace-nowrap">${h}</th>`).join('')}</tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td colspan="${headers.length}" class="py-12 text-center text-stone-400 italic font-medium">
                                SIN DATOS REGISTRADOS
                            </td>
                        </tr>
                    </tbody>
                </table>
            `;
            return;
        }

        if (exportBtn) {
            exportBtn.disabled = false;
            exportBtn.className = "px-4 py-2 bg-[#249444] hover:bg-[#1b7033] text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer";
        }

        if (contador) {
            contador.innerText = `${listaRegistros.length} registros`;
        }

        gridContent.innerHTML = `
            <table class="w-full text-[11px] text-left border-collapse min-w-[950px]">
                <thead class="bg-stone-100 font-bold text-stone-700 sticky top-0 z-10 border-b border-stone-200">
                    <tr>${headers.map(h => `<th class="p-3 border-b border-stone-200 text-center whitespace-nowrap">${h}</th>`).join('')}</tr>
                </thead>
                <tbody class="divide-y divide-stone-100">
                    ${listaRegistros.map(r => {
            const celdas = Array.isArray(r) ? [...r.slice(0, 12)] : headers.map(h => r[h] || "");

            return `
                            <tr class="bg-white hover:bg-stone-50 transition text-stone-700">
                                ${celdas.map((c, index) => {
                let val = c;

                if (index === 2 || index === 3) {
                    val = RhAsisCasc.extraerHoraLegible(val, false);
                } else if (index === 4) {
                    val = RhAsisCasc.extraerHoraLegible(val, true);
                } else if (val instanceof Date) {
                    val = val.toLocaleDateString();
                } else if (typeof val === 'string' && val.includes('T') && val.length > 18 && !val.includes('1899-12-30')) {
                    const d = new Date(val);
                    if (!isNaN(d)) val = d.toLocaleDateString();
                }

                return `<td class="p-2.5 border-b border-stone-100 text-center whitespace-nowrap">${val !== null && val !== undefined && String(val).trim() !== '' ? val : ''}</td>`;
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

    normalizarFechaFiltro: function (fechaStr) {
        if (!fechaStr) return "";
        if (fechaStr instanceof Date) {
            return fechaStr.toISOString().split('T')[0];
        }
        let str = String(fechaStr).trim();
        if (str.includes('T')) {
            str = str.split('T')[0];
        } else if (str.includes(' ')) {
            str = str.split(' ')[0];
        }
        if (str.includes('/')) {
            const partes = str.split('/');
            if (partes.length === 3) {
                return `${partes[2]}-${partes[1].padStart(2, '0')}-${partes[0].padStart(2, '0')}`;
            }
        }
        return str;
    },

    aplicarFiltrosCombinados: function () {
        const fechaDesde = document.getElementById('filtroFechaDesde')?.value || "";
        const fechaHasta = document.getElementById('filtroFechaHasta')?.value || "";
        const numEmpFiltro = document.getElementById('filtroNumEmpBio')?.value.toLowerCase().trim() || "";
        const centroFiltro = document.getElementById('filtroCentroBio')?.value.toLowerCase().trim() || "";

        const filtrados = RhAsisCasc.registrosBiometrico.filter(row => {
            if (!Array.isArray(row)) return false;

            const centro = String(row[0] || "").toLowerCase();
            const numEmp = String(row[1] || "").toLowerCase();
            const fechaRegRaw = String(row[6] || "").trim();
            const fechaRegNorm = RhAsisCasc.normalizarFiltroFecha ? RhAsisCasc.normalizarFiltroFecha(fechaRegRaw) : RhAsisCasc.normalizarFechaFiltro(fechaRegRaw);

            if (centroFiltro && !centro.includes(centroFiltro)) return false;
            if (numEmpFiltro && !numEmp.includes(numEmpFiltro)) return false;

            if (fechaDesde && fechaRegNorm < fechaDesde) return false;
            if (fechaHasta && fechaRegNorm > fechaHasta) return false;

            return true;
        });

        RhAsisCasc.renderGrid(filtrados);
    }
};