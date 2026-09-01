// js/cirnorh/asistencia/RhAsisCasc.js

window.RhAsisCasc = {
    registrosBiometrico: [],
    rawHeaderGlobal: [
        "ClaveCentro", "NumEmp", "RHBHraEnt", "RHBHraSal", 
        "RHBHraReg", "RHBNomReg", "RHBFecReg", "RHBDía", 
        "RHBRetMen", "RHBRetMed", "RHBRetMay", "RHBFalta"
    ],

    // ... (mantén mostrarVistaBiometrico y cargarDatosDesdeSheets)

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

            if (typeof RhAsisFBio.manejarCargaArchivo === 'function') {
                await RhAsisFBio.manejarCargaArchivo(input);
            } else if (typeof RhAsisFBio.procesarArchivoBiometrico === 'function') {
                await RhAsisFBio.procesarArchivoBiometrico(file);
            }

            if (!window.RhAsisFBio.groupedData || Object.keys(window.RhAsisFBio.groupedData).length === 0) {
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

            // 🏢 OBTENER LA CLAVE DEL CENTRO DESDE EL SELECTOR DE LA VISTA
            let claveCentroSeleccionado = "";
            const selectCentro = document.querySelector('select') || document.getElementById('selectCentro') || document.querySelector('[role="combobox"]');
            if (selectCentro && selectCentro.value) {
                const matchVal = selectCentro.value.match(/^(\d+)/);
                claveCentroSeleccionado = matchVal ? matchVal[1] : selectCentro.value;
            }
            if (!claveCentroSeleccionado) {
                claveCentroSeleccionado = localStorage.getItem('centro_activo_actual') || "102";
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
                        textCarga.innerText = "Guardando datos...";
                    }

                    const rowsParaSheets = [];
                    Object.keys(RhAsisFBio.groupedData).forEach(id => {
                        const empleado = RhAsisFBio.groupedData[id];
                        empleado.rows.forEach(row => {
                            rowsParaSheets.push([
                                claveCentroSeleccionado, // 👈 1er campo: ClaveCentro obtenido de la sesión/interfaz
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
            window.RhAsisFBio.groupedData = {};
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

        if (!listaRegistros || listaRegistros.length === 0) {
            if (emptyState) emptyState.classList.remove('hidden');
            if (appContainer) appContainer.classList.add('hidden');
            if (exportBtn) {
                exportBtn.disabled = true;
                exportBtn.className = "bg-stone-300 opacity-50 cursor-not-allowed text-stone-700 px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2";
            }
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
                        ${listaRegistros.map(r => `
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