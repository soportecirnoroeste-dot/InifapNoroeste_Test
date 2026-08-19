// js/cirnorh/RhPersonal.js

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
                        Guardar en Sheets
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
        cargarDatosGenerales(false); // Carga rápida inicial con caché si existe
    }
}

// Variables globales de caché
window._catRegsCache = window._catRegsCache || null;
window._catCentrosCache = window._catCentrosCache || null;
window._catSitiosCache = window._catSitiosCache || null;
window._empleadosCache = window._empleadosCache || [];

async function cargarDatosGenerales(forzarRecarga = false) {
    // Si ya tenemos empleados en memoria y no se fuerza la recarga, los mostramos de inmediato
    if (!forzarRecarga && window._empleadosCache.length > 0) {
        renderizarTablaPersonal(window._empleadosCache);
        // Cargamos catálogos en segundo plano de manera silenciosa
        cargarCatalogosSheets();
        return;
    }

    // Si es forzado o no hay caché, mostramos estado de carga rápido en la tabla si está vacía
    if (window._empleadosCache.length === 0) {
        const tbody = document.getElementById('tabla-personal-body');
        if (tbody) tbody.innerHTML = `<tr><td colspan="6" class="p-6 text-center text-stone-400 italic">Sincronizando con Sheets...</td></tr>`;
    }

    await Promise.all([
        cargarCatalogosSheets(forzarRecarga),
        cargarDatosPersonalSheets(forzarRecarga)
    ]);
}

async function cargarCatalogosSheets(forzar = false) {
    if (!forzar && window._catRegsCache && window._catCentrosCache && window._catSitiosCache) {
        window._catRegs = window._catRegsCache;
        window._catCentros = window._catCentrosCache;
        window._catSitios = window._catSitiosCache;
        return;
    }

    try {
        const [regs, centros, sitios] = await Promise.all([
            FetchAPI('obtenerRegiones').catch(() => null),
            FetchAPI('obtenerCentros').catch(() => null),
            FetchAPI('obtenerSitios').catch(() => null)
        ]);

        window._catRegs = Array.isArray(regs) ? regs : (regs?.data || regs?.resultado || []);
        window._catCentros = Array.isArray(centros) ? centros : (centros?.data || centros?.resultado || []);
        window._catSitios = Array.isArray(sitios) ? sitios : (sitios?.data || sitios?.resultado || []);

        if (window._catRegs.length === 0 && window._empleadosCache.length > 0) {
            const regsMap = new Map();
            const centrosMap = new Map();
            const sitiosMap = new Map();

            window._empleadosCache.forEach(e => {
                if (e.claveReg) {
                    let claveR = String(e.claveReg).trim();
                    if (claveR.includes(' - ')) claveR = claveR.split(' - ')[0].trim();
                    const nombreR = e.textoReg ? String(e.textoReg).replace(new RegExp(`^${claveR}\\s*-\\s*`), '').trim() : claveR;
                    regsMap.set(claveR, { clave: claveR, nombre: nombreR });
                }
                if (e.claveCentro) {
                    let claveC = String(e.claveCentro).trim();
                    if (claveC.includes(' - ')) claveC = claveC.split(' - ')[0].trim();
                    const nombreC = e.textoCentro ? String(e.textoCentro).replace(new RegExp(`^${claveC}\\s*-\\s*`), '').trim() : claveC;
                    const regAsociada = e.claveReg ? String(e.claveReg).split(' - ')[0].trim() : '';
                    centrosMap.set(claveC, { clave: claveC, claveReg: regAsociada, nombre: nombreC });
                }
                let rawSit = e.claveSit || e.textoSit;
                let claveS = (!rawSit || rawSit === 0 || rawSit === '0' || String(rawSit).trim().toUpperCase() === 'N/A') ? 'N/A' : String(rawSit).trim();
                if (claveS.includes(' - ')) claveS = claveS.split(' - ')[0].trim();
                
                const centroAsociado = e.claveCentro ? String(e.claveCentro).split(' - ')[0].trim() : '';
                sitiosMap.set(claveS, { clave: claveS, claveCentro: centroAsociado, nombre: claveS === 'N/A' ? 'N/A' : (e.textoSit || claveS) });
            });

            window._catRegs = Array.from(regsMap.values());
            window._catCentros = Array.from(centrosMap.values());
            window._catSitios = Array.from(sitiosMap.values());
        }

        window._catRegsCache = window._catRegs;
        window._catCentrosCache = window._catCentros;
        window._catSitiosCache = window._catSitios;
        
    } catch (error) {
        console.error("Error al cargar catálogos:", error);
    }
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

function poblarSelectoresCascada(regActual = '', centroActual = '', sitActual = '') {
    const selReg = document.getElementById('select-claveReg');
    if (!selReg) return;

    const regsArray = Array.isArray(window._catRegs) ? window._catRegs : [];
    const regClean = (!regActual || regActual === '0' || regActual === 'N/A' || regActual === 0) ? '' : String(regActual).trim();

    selReg.innerHTML = `<option value="" disabled selected>Seleccione una región...</option>` + 
        regsArray.map(r => `<option value="${r.clave}">${r.clave} - ${r.nombre}</option>`).join('');

    let matchReg = "";
    if (regClean !== "") {
        const encontrada = regsArray.find(r => String(r.clave).trim().toLowerCase() === regClean.toLowerCase());
        if (encontrada) matchReg = encontrada.clave;
    }

    selReg.value = matchReg;
    filtrarCentrosPorRegion(centroActual, sitActual);
}

function filtrarCentrosPorRegion(centroActual = '', sitActual = '') {
    const selReg = document.getElementById('select-claveReg');
    const selCentro = document.getElementById('select-claveCentro');
    const selSit = document.getElementById('select-claveSit');
    
    if (!selReg || !selCentro || !selSit) return;
    const regionSeleccionada = selReg.value;

    selCentro.innerHTML = `<option value="" disabled selected>Seleccione un centro...</option>`;
    selSit.innerHTML = `<option value="" disabled selected>Seleccione un sitio...</option>`;

    const centrosArray = Array.isArray(window._catCentros) ? window._catCentros : [];

    if (regionSeleccionada) {
        const centrosFiltrados = centrosArray.filter(c => String(c.claveReg).trim() === String(regionSeleccionada).trim());
        selCentro.innerHTML += centrosFiltrados.map(c => 
            `<option value="${c.clave}">${c.clave} - ${c.nombre}</option>`
        ).join('');
    }

    const centroClean = (!centroActual || centroActual === '0' || centroActual === 'N/A' || centroActual === 0) ? '' : String(centroActual).trim();
    let matchCentro = "";
    if (centroClean !== "") {
        const encontrada = centrosArray.find(c => String(c.clave).trim().toLowerCase() === centroClean.toLowerCase());
        if (encontrada) matchCentro = encontrada.clave;
    }

    selCentro.value = matchCentro;

    requestAnimationFrame(() => {
        filtrarSitiosPorCentro(sitActual);
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

        if (!window._catRegs.length && !window._catCentros.length) {
            await cargarCatalogosSheets();
        }

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

    // Si ya tenemos caché y no se fuerza, renderizamos inmediatamente
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
    const emp = window._empleadosCache[index];
    if (!emp) {
        console.error("❌ No se encontró el empleado en _empleadosCache");
        return;
    }

    await cargarCatalogosSheets();
    cargarPersonalRh(false);

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
        // Forzamos actualización de caché tras guardar para reflejar cambios reales
        cargarDatosGenerales(true);
    } catch (e) {
        alert("Error al guardar");
    }
}