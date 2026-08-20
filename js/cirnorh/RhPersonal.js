// js/cirnorh/RhPersonal.js

// Variables globales de caché (protegidas para no perder velocidad)
window._catRegsCache = window._catRegsCache || null;
window._catCentrosCache = window._catCentrosCache || null;
window._catSitiosCache = window._catSitiosCache || null;
window._empleadosCache = window._empleadosCache || [];

function cargarPersonalRh(cargarLista = true) {
    renderizarVistaModulo('personal', "Directorio de empleados, altas, bajas y estructura organizacional.");

    const contenedorDinamico = document.getElementById('contenido-submodulo-dinamico');
    if (!contenedorDinamico) return;

    contenedorDinamico.className = "w-full space-y-6";

    contenedorDinamico.innerHTML = `
        <!-- Contenedor del encabezado y botones de Gestión de Personal -->
        <div id="contenedor-gestion-personal" class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-stone-50 p-4 rounded-xl border border-stone-200">
            <div>
                <h4 class="font-bold text-stone-800 text-sm">Gestión de Personal</h4>
                <p class="text-xs text-stone-500">Visualiza el padrón completo, da de alta o haz clic en un empleado para editar sus datos.</p>
            </div>
            <div class="flex gap-2">
                <button onclick="mostrarFormularioNuevoPersonal()" class="px-4 py-2 bg-[#249444] text-white rounded-xl text-xs font-bold hover:bg-[#1e7a37] transition flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                    Nuevo Registro
                </button>
                <button onclick="cargarDatosGenerales(true)" class="px-4 py-2 bg-stone-200 text-stone-700 rounded-xl text-xs font-bold hover:bg-stone-300 transition flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 21h5v-5"/></svg>
                    Actualizar Datos
                </button>
            </div>
        </div>

        <div id="contenedor-formulario-personal" class="hidden bg-white p-6 rounded-xl border border-[#249444]/20 shadow-sm animate-fade-in">
            <h5 id="titulo-formulario" class="font-bold text-stone-800 text-sm mb-4 pb-2 border-b border-stone-100 flex items-center gap-2">
                Capturar Nuevo Empleado
            </h5>
            <form id="form-nuevo-personal" onsubmit="guardarOActualizarPersonal(event)" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                
                <!-- Selectores dinámicos en cascada -->
                <div>
                    <label class="block font-bold text-stone-700 mb-1">Clave Reg:</label>
                    <select name="claveReg" id="select-claveReg" onchange="filtrarCentrosPorRegion()" required class="w-full p-2.5 border border-stone-300 rounded-lg bg-white focus:outline-none focus:border-[#249444]">
                        <option value="" disabled selected>Seleccione una región...</option>
                    </select>
                </div>
                <div>
                    <label class="block font-bold text-stone-700 mb-1">Clave Centro:</label>
                    <select name="claveCentro" id="select-claveCentro" onchange="filtrarSitiosPorCentro()" required class="w-full p-2.5 border border-stone-300 rounded-lg bg-white focus:outline-none focus:border-[#249444]">
                        <option value="" disabled selected>Seleccione un centro...</option>
                    </select>
                </div>
                <div>
                    <label class="block font-bold text-stone-700 mb-1">Clave Sitio:</label>
                    <select name="claveSit" id="select-claveSit" required class="w-full p-2.5 border border-stone-300 rounded-lg bg-white focus:outline-none focus:border-[#249444]">
                        <option value="" disabled selected>Seleccione un sitio...</option>
                    </select>
                </div>
                
                <div><label class="block font-bold text-stone-700 mb-1">Núm. Empleado:</label><input type="text" name="numEmp" id="input-numEmp" required class="w-full p-2.5 border border-stone-300 rounded-lg focus:outline-none focus:border-[#249444]"></div>
                <div><label class="block font-bold text-stone-700 mb-1">Nombre Completo:</label><input type="text" name="nombre" required class="w-full p-2.5 border border-stone-300 rounded-lg focus:outline-none focus:border-[#249444]"></div>
                
                <div><label class="block font-bold text-stone-700 mb-1">Extensión:</label><input type="text" name="ext" class="w-full p-2.5 border border-stone-300 rounded-lg focus:outline-none focus:border-[#249444]"></div>
                <div><label class="block font-bold text-stone-700 mb-1">Núm. Personal:</label><input type="text" name="numPers" class="w-full p-2.5 border border-stone-300 rounded-lg focus:outline-none focus:border-[#249444]"></div>
                <div><label class="block font-bold text-stone-700 mb-1">Escolaridad:</label><input type="text" name="escolaridad" class="w-full p-2.5 border border-stone-300 rounded-lg focus:outline-none focus:border-[#249444]"></div>
                <div><label class="block font-bold text-stone-700 mb-1">Dirección:</label><input type="text" name="direccion" class="w-full p-2.5 border border-stone-300 rounded-lg focus:outline-none focus:border-[#249444]"></div>
                <div><label class="block font-bold text-stone-700 mb-1">C.P.:</label><input type="text" name="cp" class="w-full p-2.5 border border-stone-300 rounded-lg focus:outline-none focus:border-[#249444]"></div>
                <div><label class="block font-bold text-stone-700 mb-1">Email:</label><input type="email" name="email" class="w-full p-2.5 border border-stone-300 rounded-lg focus:outline-none focus:border-[#249444]"></div>
                <div><label class="block font-bold text-stone-700 mb-1">RFC:</label><input type="text" name="rfc" required class="w-full p-2.5 border border-stone-300 rounded-lg focus:outline-none focus:border-[#249444]"></div>
                <div><label class="block font-bold text-stone-700 mb-1">Puesto:</label><input type="text" name="puesto" required class="w-full p-2.5 border border-stone-300 rounded-lg focus:outline-none focus:border-[#249444]"></div>
                <div><label class="block font-bold text-stone-700 mb-1">Departamento:</label><input type="text" name="departamento" required class="w-full p-2.5 border border-stone-300 rounded-lg focus:outline-none focus:border-[#249444]"></div>
                <div><label class="block font-bold text-stone-700 mb-1">Ciudad:</label><input type="text" name="ciudad" class="w-full p-2.5 border border-stone-300 rounded-lg focus:outline-none focus:border-[#249444]"></div>
                <div><label class="block font-bold text-stone-700 mb-1">Estado:</label><input type="text" name="estado" class="w-full p-2.5 border border-stone-300 rounded-lg focus:outline-none focus:border-[#249444]"></div>
                
                <div class="sm:col-span-2 md:col-span-3 flex items-end gap-2 pt-2">
                    <button type="submit" class="py-2.5 px-6 bg-[#059669] text-white font-bold rounded-lg hover:bg-[#047857] transition flex items-center justify-center gap-1.5">
                        Guardar
                    </button>
                    <button type="button" onclick="ocultarFormularioPersonal()" class="px-4 py-2.5 bg-stone-100 text-stone-600 font-bold rounded-lg hover:bg-stone-200 transition">Cancelar</button>
                </div>
            </form>
        </div>

        <div id="contenedor-listado-personal" class="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-sm">
            <div class="p-4 border-b border-stone-100 font-bold text-xs text-stone-700 uppercase tracking-wider">Listado General de Empleados</div>
            <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse text-xs">
                    <thead>
                        <tr class="bg-stone-50 text-stone-600 border-b border-stone-200">
                            <th class="p-3">REG</th><th class="p-3">CENTRO</th><th class="p-3">NO. EMP</th><th class="p-3">NOMBRE</th><th class="p-3">PUESTO</th><th class="p-3">DEPARTAMENTO</th>
                        </tr>
                    </thead>
                    <tbody id="tabla-personal-body"><tr><td colspan="6" class="p-6 text-center text-stone-400 italic">Cargando registros...</td></tr></tbody>
                </table>
            </div>
        </div>
    `;

    if (cargarLista) {
        cargarDatosGenerales(false);
    }
}

async function cargarDatosGenerales(forzarRecarga = false) {
    if (forzarRecarga) {
        window._catRegsCache = null;
        window._catCentrosCache = null;
        window._catSitiosCache = null;
        window._empleadosCache = [];
    }

    if (!forzarRecarga && window._empleadosCache.length > 0) {
        renderizarTablaPersonal(window._empleadosCache);
        cargarCatalogosSheets();
        return;
    }

    const tbody = document.getElementById('tabla-personal-body');
    if (tbody && window._empleadosCache.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" class="p-6 text-center text-stone-400 italic">Sincronizando con Sheets...</td></tr>`;
    }

    await Promise.all([
        cargarCatalogosSheets(forzarRecarga),
        cargarDatosPersonalSheets(forzarRecarga)
    ]);
}

// Al hacer clic en Cancelar o volver al listado
function cancelarEdicionPersonal() {
    const formContainer = document.getElementById('contenedor-formulario-personal');
    const gestionContainer = document.getElementById('contenedor-gestion-personal');
    const listadoContainer = document.getElementById('contenedor-listado-personal');

    // 1. Ocultamos el formulario
    if (formContainer) formContainer.classList.add('hidden');
    
    // 2. Mostramos el listado al instante
    if (gestionContainer) gestionContainer.classList.remove('hidden');
    if (listadoContainer) listadoContainer.classList.remove('hidden');

    // 3. Pintamos directamente con la caché global para evitar demoras
    if (window._empleadosCache && window._empleadosCache.length > 0) {
        // Intentamos usar la función oficial de renderizado si existe
        if (typeof renderizarTablaPersonal === 'function') {
            renderizarTablaPersonal(window._empleadosCache);
            return;
        }
        
        // Si no, buscamos el tbody común y lo llenamos a mano
        const tbody = document.getElementById('tabla-personal-body') || document.querySelector('#tabla-personal tbody');
        if (tbody) {
            tbody.innerHTML = window._empleadosCache.map((emp, index) => `
                <tr onclick="seleccionarEmpleadoParaEditar(${index})" class="cursor-pointer hover:bg-gray-50 border-b">
                    <td class="py-3 px-4">${emp.claveReg || emp.textoReg || ''}</td>
                    <td class="py-3 px-4">${emp.claveCentro || emp.textoCentro || ''}</td>
                    <td class="py-3 px-4">${emp.numEmp || ''}</td>
                    <td class="py-3 px-4 font-medium text-gray-900">${emp.nombre || ''}</td>
                    <td class="py-3 px-4">${emp.puesto || ''}</td>
                    <td class="py-3 px-4">${emp.departamento || ''}</td>
                </tr>
            `).join('');
        }
    }
}

// Al hacer clic en Guardar en Sheets
async function guardarEmpleadoFormulario(event) {
    if (event) event.preventDefault();

    const form = document.getElementById('form-nuevo-personal');
    const formData = new FormData(form);

    // Mostramos algún indicador visual rápido o desactivamos el botón
    const btnGuardar = form.querySelector('button[type="submit"]');
    if (btnGuardar) btnGuardar.disabled = true;

    try {
        // Enviamos los datos a Google Sheets
        const respuesta = await FetchAPI('guardarPersonal', formData); // Ajusta la acción según tu backend

        if (respuesta && respuesta.success !== false) {
            // Actualizamos opcionalmente el registro modificado en nuestra caché local 
            // para que refleje los cambios al instante sin necesidad de un nuevo fetch completo
            // (O puedes actualizar la caché local con los datos del formulario)

            // Regresamos al listado de forma inmediata
            cancelarEdicionPersonal();
        } else {
            alert("Hubo un error al guardar los datos.");
        }
    } catch (error) {
        console.error("Error al guardar:", error);
        alert("Error de conexión al guardar.");
    } finally {
        if (btnGuardar) btnGuardar.disabled = false;
    }
}

async function cargarCatalogosSheets(forzar = false) {
    const regsMap = new Map();
    const centrosMap = new Map();
    const sitiosMap = new Map();

    if (window._empleadosCache && Array.isArray(window._empleadosCache)) {
        window._empleadosCache.forEach(e => {
            // 1. Extraer Región
            const regTxt = e.textoReg || e.claveReg || '';
            if (regTxt) {
                const str = String(regTxt).trim();
                const clave = str.includes(' - ') ? str.split(' - ')[0].trim() : str;
                const nombre = str.includes(' - ') ? str.split(' - ')[1].trim() : str;
                if (clave) regsMap.set(clave, { clave, nombre });
            }

            // 2. Extraer Centro y asegurar su claveReg asociada
            const centTxt = e.textoCentro || e.claveCentro || '';
            if (centTxt) {
                const str = String(centTxt).trim();
                const claveC = str.includes(' - ') ? str.split(' - ')[0].trim() : str;
                const nombreC = str.includes(' - ') ? str.split(' - ')[1].trim() : str;
                
                // Extraemos la región limpia desde el empleado
                const regAsociadaTxt = e.textoReg || e.claveReg || '';
                const claveR = regAsociadaTxt.includes(' - ') ? regAsociadaTxt.split(' - ')[0].trim() : String(regAsociadaTxt).trim();

                if (claveC) {
                    centrosMap.set(claveC, { 
                        clave: claveC, 
                        claveReg: claveR, 
                        nombre: nombreC 
                    });
                }
            }

            // 3. Extraer Sitio y asegurar su claveCentro asociada
            const sitTxt = e.textoSit || e.claveSit || '';
            if (sitTxt && sitTxt !== '0' && String(sitTxt).toUpperCase() !== 'N/A') {
                const str = String(sitTxt).trim();
                const claveS = str.includes(' - ') ? str.split(' - ')[0].trim() : str;
                const nombreS = str.includes(' - ') ? str.split(' - ')[1].trim() : str;
                
                const centAsociadoTxt = e.textoCentro || e.claveCentro || '';
                const claveC = centAsociadoTxt.includes(' - ') ? centAsociadoTxt.split(' - ')[0].trim() : String(centAsociadoTxt).trim();

                if (claveS) {
                    sitiosMap.set(claveS, { 
                        clave: claveS, 
                        claveCentro: claveC, 
                        nombre: nombreS 
                    });
                }
            }
        });
    }

    window._catRegs = Array.from(regsMap.values());
    window._catCentros = Array.from(centrosMap.values());
    window._catSitios = Array.from(sitiosMap.values());
}

function poblarSelectoresCascada(regSeleccionada = '', centroSeleccionado = '', sitioSeleccionado = '') {
    const selectReg = document.getElementById('input-claveReg') || document.querySelector('select[name="claveReg"]');
    const selectCentro = document.getElementById('input-claveCentro') || document.querySelector('select[name="claveCentro"]');
    const selectSitio = document.getElementById('input-claveSit') || document.querySelector('select[name="claveSit"]');

    if (!selectReg || !selectCentro || !selectSitio) return;

    // 1. Cargar Regiones (Asegurando que existan en el catálogo global)
    if (selectReg.options.length <= 1 && window._catRegs) {
        selectReg.innerHTML = '<option value="">Seleccione una región...</option>' + 
            window._catRegs.map(r => `<option value="${r.clave}">${r.clave} - ${r.nombre}</option>`).join('');
    }
    if (regSeleccionada) selectReg.value = String(regSeleccionada).trim();

    // 2. Función estricta para actualizar Centros usando SOLO el catálogo maestro
    const actualizarCentros = (regClave) => {
        const regLimpia = String(regClave || '').trim();
        
        // Filtramos estrictamente del catálogo global de centros
        const centrosArray = Array.isArray(window._catCentros) ? window._catCentros : [];
        
        const centrosFiltrados = centrosArray.filter(c => {
            const cReg = String(c.claveReg || c.ClaveReg || '').trim();
            return !regLimpia || cReg === regLimpia;
        });

        // Pintamos única y exclusivamente los centros que pertenecen a esa región
        selectCentro.innerHTML = '<option value="">Seleccione un centro...</option>' + 
            centrosFiltrados.map(c => {
                const claveC = c.clave || c.ClaveCentro || c.claveCentro || '';
                const nombreC = c.nombre || c.Centro || '';
                return `<option value="${claveC}">${claveC} - ${nombreC}</option>`;
            }).join('');
        
        selectSitio.innerHTML = '<option value="0">N/A</option>';
    };

    // 3. Función para actualizar Sitios
    const actualizarSitios = (centroClave) => {
        let htmlSitios = '<option value="0">N/A</option>';
        const centLimpio = String(centroClave || '').trim();
        
        const sitiosArray = Array.isArray(window._catSitios) ? window._catSitios : [];
        const sitiosFiltrados = sitiosArray.filter(s => {
            const sCent = String(s.claveCentro || s.ClaveCentro || '').trim();
            return centLimpio && sCent === centLimpio;
        });

        if (sitiosFiltrados.length > 0) {
            htmlSitios += sitiosFiltrados.map(s => {
                const val = (!s.clave || s.clave === 'N/A' || s.clave === '0') ? '0' : s.clave;
                return `<option value="${val}">${s.nombre || s.clave}</option>`;
            }).join('');
        }
        
        selectSitio.innerHTML = htmlSitios;
    };

    // Aplicar valores iniciales si estamos editando un empleado existente
    const regActual = regSeleccionada || selectReg.value;
    if (regActual) {
        actualizarCentros(regActual);
        if (centroSeleccionado) {
            selectCentro.value = String(centroSeleccionado).trim();
            actualizarSitios(centroSeleccionado);
            if (sitioSeleccionado) {
                selectSitio.value = (sitioSeleccionado === 'N/A' || !sitioSeleccionado) ? '0' : String(sitioSeleccionado).trim();
            }
        }
    }

    // Eventos interactivos en tiempo real
    selectReg.onchange = (e) => {
        actualizarCentros(e.target.value);
    };

    selectCentro.onchange = (e) => {
        actualizarSitios(e.target.value);
    };
}

function filtrarSitiosPorCentro(sitActual = '') {
    const selCentro = document.getElementById('select-claveCentro');
    const selSit = document.getElementById('select-claveSit');

    if (!selCentro || !selSit) return;
    const centroSeleccionado = selCentro.value;

    selSit.innerHTML = `<option value="" disabled selected>Seleccione un sitio...</option>`;
    const sitiosArray = Array.isArray(window._catSitios) ? window._catSitios : [];

    if (centroSeleccionado) {
        const sitiosFiltrados = sitiosArray.filter(s => {
            const cAsociado = String(s.claveCentro || '').trim();
            const esNA = String(s.clave).trim().toUpperCase() === 'N/A';
            return cAsociado === String(centroSeleccionado).trim() || esNA;
        });

        const unicosMap = new Map();
        sitiosFiltrados.forEach(s => {
            const claveStr = String(s.clave).trim();
            if (!unicosMap.has(claveStr)) unicosMap.set(claveStr, s);
        });

        selSit.innerHTML += Array.from(unicosMap.values()).map(s => {
            const claveStr = String(s.clave).trim();
            const textoDisplay = (claveStr.toUpperCase() === 'N/A') ? 'N/A' : `${s.clave} - ${s.nombre}`;
            return `<option value="${s.clave}">${textoDisplay}</option>`;
        }).join('');
    }

    const sitClean = (!sitActual || sitActual === '0' || sitActual === 'N/A' || sitActual === 0 || String(sitActual).trim() === '') ? 'N/A' : String(sitActual).trim();
    let matchSit = "";
    if (sitClean !== "") {
        const encontrada = sitiosArray.find(s => String(s.clave).trim().toLowerCase() === sitClean.toLowerCase());
        if (encontrada) matchSit = encontrada.clave;
    }

    selSit.value = matchSit;
}

function filtrarCentrosPorRegion(centroActual = '', sitActual = '') {
    const selReg = document.getElementById('select-claveReg') || document.getElementById('input-claveReg') || document.querySelector('select[name="claveReg"]');
    const selCentro = document.getElementById('select-claveCentro') || document.getElementById('input-claveCentro') || document.querySelector('select[name="claveCentro"]');
    const selSit = document.getElementById('select-claveSit') || document.getElementById('input-claveSit') || document.querySelector('select[name="claveSit"]');

    if (!selReg || !selCentro || !selSit) return;
    const regionSeleccionada = selReg.value;

    selCentro.innerHTML = `<option value="" disabled selected>Seleccione un centro...</option>`;
    selSit.innerHTML = `<option value="0">N/A</option>`;

    // Tomamos la conexión real de Sheets desde window._catCentros
    const centrosArray = Array.isArray(window._catCentros) ? window._catCentros : [];

    // IMPRESIÓN CLAVE EN CONSOLA: Vamos a ver qué trae exactamente un elemento de Sheets para revisar sus nombres de propiedades (keys)
    if (centrosArray.length > 0) {
        console.log("🔍 [SHEETS DATA] Estructura del primer centro recibido:", centrosArray[0]);
    } else {
        console.warn("⚠️ [SHEETS DATA] window._catCentros está completamente vacío o no es un arreglo.");
    }

    if (regionSeleccionada) {
        // Buscamos haciendo match flexible tanto en minúsculas como en mayúsculas (ClaveReg vs claveReg)
        const centrosFiltrados = centrosArray.filter(c => {
            const regEnFila = String(c.ClaveReg || c.claveReg || c.CLAVEREG || '').trim();
            return regEnFila === String(regionSeleccionada).trim();
        });

        console.log("✅ [SHEETS DATA] Centros que hicieron match con la región", regionSeleccionada, ":", centrosFiltrados);

        if (centrosFiltrados.length > 0) {
            selCentro.innerHTML += centrosFiltrados.map(c => {
                const claveC = c.ClaveCentro || c.claveCentro || c.CLAVECENTRO || c.clave || '';
                const nombreC = c.Centro || c.centro || c.nombre || '';
                return `<option value="${claveC}">${claveC} - ${nombreC}</option>`;
            }).join('');
        }
    }

    // Condición de edición
    if (centroActual && centroActual !== '0' && centroActual !== 'N/A') {
        const centroClean = String(centroActual).trim();
        const encontrada = centrosArray.find(c => {
            const claveC = String(c.ClaveCentro || c.claveCentro || c.CLAVECENTRO || c.clave || '').trim();
            return claveC.toLowerCase() === centroClean.toLowerCase();
        });
        if (encontrada) {
            selCentro.value = encontrada.ClaveCentro || encontrada.claveCentro || encontrada.CLAVECENTRO || encontrada.clave;
        }
    }

    requestAnimationFrame(() => {
        if (typeof filtrarSitiosPorCentro === 'function') {
            filtrarSitiosPorCentro(sitActual);
        }
    });
}

async function mostrarFormularioNuevoPersonal() {
    const formContainer = document.getElementById('contenedor-formulario-personal');
    const gestionContainer = document.getElementById('contenedor-gestion-personal');
    const listadoContainer = document.getElementById('contenedor-listado-personal');
    const form = document.getElementById('form-nuevo-personal');
    const titulo = document.getElementById('titulo-formulario');
    const inputNumEmp = document.getElementById('input-numEmp');

    if (formContainer && form) {
        form.reset();
        await cargarCatalogosSheets();
        poblarSelectoresCascada('', '', '');
        inputNumEmp.removeAttribute('readonly');
        titulo.innerHTML = `Capturar Nuevo Empleado`;
        formContainer.classList.remove('hidden');
        if (gestionContainer) gestionContainer.classList.add('hidden');
        if (listadoContainer) listadoContainer.classList.add('hidden');
        formContainer.scrollIntoView({ behavior: 'smooth' });
    }
}

function ocultarFormularioPersonal() {
    const formContainer = document.getElementById('contenedor-formulario-personal');
    const gestionContainer = document.getElementById('contenedor-gestion-personal');
    const listadoContainer = document.getElementById('contenedor-listado-personal');
    if (formContainer) formContainer.classList.add('hidden');
    if (gestionContainer) gestionContainer.classList.remove('hidden');
    if (listadoContainer) listadoContainer.classList.remove('hidden');
}

async function cargarDatosPersonalSheets(forzar = false) {
    const tbody = document.getElementById('tabla-personal-body');
    if (!tbody) return;

    if (!forzar && window._empleadosCache.length > 0) {
        renderizarTablaPersonal(window._empleadosCache);
        return;
    }

    try {
        const data = await FetchAPI('obtenerPersonal');
        window._empleadosCache = data || [];
        renderizarTablaPersonal(window._empleadosCache);
    } catch (error) {
        tbody.innerHTML = `<tr><td colspan="6" class="p-6 text-center text-red-500 italic">Error al conectar con Sheets.</td></tr>`;
    }
}

function renderizarTablaPersonal(registros) {
    const tbody = document.getElementById('tabla-personal-body');
    if (!tbody) return;

    if (!registros.length) {
        tbody.innerHTML = `<tr><td colspan="6" class="p-6 text-center text-stone-400 italic">No hay registros.</td></tr>`;
        return;
    }

    tbody.innerHTML = registros.map((row, index) => {
        const reg = row.textoReg || row.claveReg;
        const centro = row.textoCentro || row.claveCentro;
        const noEmp = row.numEmp;
        const nombre = row.nombre;
        const puesto = row.puesto;
        const departamento = row.departamento;

        const valNa = (v) => (!v || v === 0 || v === '0' || String(v).trim() === '') ? 'N/A' : v;

        return `
            <tr class="border-b border-stone-100 hover:bg-stone-50 transition">
                <td class="p-3 font-mono text-stone-600">${valNa(reg)}</td>
                <td class="p-3 font-mono text-stone-600">${valNa(centro)}</td>
                <td class="p-3 font-mono text-stone-600">${valNa(noEmp)}</td>
                <td class="p-3"><button onclick="seleccionarEmpleadoParaEditar(${index})" class="font-semibold text-[#249444] hover:underline">${valNa(nombre)}</button></td>
                <td class="p-3 text-stone-600">${valNa(puesto)}</td>
                <td class="p-3 text-stone-600">${valNa(departamento)}</td>
            </tr>
        `;
    }).join('');
}

async function seleccionarEmpleadoParaEditar(index) {
    // Si la caché está vacía (por ejemplo, si se recargó la página directamente aquí), 
    // primero consultamos los datos a Google Sheets para recuperar el padrón.
    if (!window._empleadosCache || window._empleadosCache.length === 0) {
        try {
            const data = await FetchAPI('obtenerPersonal');
            window._empleadosCache = data || [];
        } catch (error) {
            console.error("❌ Error al recuperar empleados:", error);
        }
    }

    const emp = window._empleadosCache[index];
    if (!emp) {
        console.error("❌ No se encontró el empleado en _empleadosCache en el índice:", index);
        alert("No se pudieron cargar los datos del empleado. Intenta actualizar el listado.");
        return;
    }

    // 1. Dibujamos la estructura del formulario en el DOM
    cargarPersonalRh(false);

    // 2. Cargamos/generamos los catálogos ahora que tenemos la caché de empleados segura
    await cargarCatalogosSheets();

    const form = document.getElementById('form-nuevo-personal');
    const formContainer = document.getElementById('contenedor-formulario-personal');
    const gestionContainer = document.getElementById('contenedor-gestion-personal');
    const listadoContainer = document.getElementById('contenedor-listado-personal');
    const titulo = document.getElementById('titulo-formulario');
    const inputNumEmp = document.getElementById('input-numEmp');

    if (formContainer && form) {
        const limpiarValor = (val) => (!val || val === 0 || val === '0' || String(val).trim() === '') ? '' : val;

        const extraerClave = (val) => {
            if (!val) return '';
            const str = String(val).trim();
            if (str.includes(' - ')) return str.split(' - ')[0].trim();
            return str;
        };

        const regVal = extraerClave(emp.claveReg || emp.textoReg);
        const centroVal = extraerClave(emp.claveCentro || emp.textoCentro);
        let rawSit = extraerClave(emp.claveSit || emp.textoSit);
        const sitVal = (!rawSit || rawSit === 0 || rawSit === '0' || String(rawSit).trim().toUpperCase() === 'N/A') ? 'N/A' : rawSit;

        // 3. Poblamos los selectores en cascada con las claves limpias
        poblarSelectoresCascada(regVal, centroVal, sitVal);

        form.elements['numEmp'].value = limpiarValor(emp.numEmp);
        inputNumEmp.setAttribute('readonly', true);

        form.elements['nombre'].value = limpiarValor(emp.nombre);
        form.elements['ext'].value = limpiarValor(emp.ext);
        form.elements['numPers'].value = limpiarValor(emp.numPers);
        form.elements['escolaridad'].value = limpiarValor(emp.escolaridad);
        form.elements['direccion'].value = limpiarValor(emp.direccion);
        form.elements['cp'].value = limpiarValor(emp.cp);
        form.elements['email'].value = limpiarValor(emp.email);
        form.elements['rfc'].value = limpiarValor(emp.rfc);
        form.elements['puesto'].value = limpiarValor(emp.puesto);
        form.elements['departamento'].value = limpiarValor(emp.departamento);
        form.elements['ciudad'].value = limpiarValor(emp.ciudad);
        form.elements['estado'].value = limpiarValor(emp.estado);

        titulo.innerHTML = `Editando: <span class="text-[#249444]">${limpiarValor(emp.nombre)}</span>`;
        formContainer.classList.remove('hidden');
        if (gestionContainer) gestionContainer.classList.add('hidden');
        if (listadoContainer) listadoContainer.classList.add('hidden');
    }
}

async function guardarOActualizarPersonal(event) {
    event.preventDefault();
    const datosEmpleado = Object.fromEntries(new FormData(event.target).entries());
    const actionName = window._empleadosCache.some(e => String(e.numEmp).trim() === String(datosEmpleado.numEmp).trim()) ? 'actualizarPersonal' : 'guardarPersonal';

    try {
        const res = await FetchAPI(actionName, datosEmpleado);
        alert(res.message || "Guardado exitoso");
        ocultarFormularioPersonal();
        cargarDatosGenerales(true);
    } catch (e) {
        alert("Error al guardar");
    }
}