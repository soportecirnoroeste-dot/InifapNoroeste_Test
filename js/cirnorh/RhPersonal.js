// js/cirnorh/RhPersonal.js

window._empleadosCache = [];
window._catRegs = [];
window._catCentros = [];
window._catSitios = [];

function cargarPersonalRh(cargarLista = true) {
    renderizarVistaModulo('personal', "Directorio de empleados, altas, bajas y estructura organizacional.");

    const contenedorDinamico = document.getElementById('contenido-submodulo-dinamico');
    if (!contenedorDinamico) return;

    contenedorDinamico.className = "w-full space-y-6";

    contenedorDinamico.innerHTML = `
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
                <button onclick="cargarDatosGenerales()" class="px-4 py-2 bg-stone-200 text-stone-700 rounded-xl text-xs font-bold hover:bg-stone-300 transition flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 21h5v-5"/></svg>
                    Actualizar Datos
                </button>
            </div>
        </div>

        <div id="contenedor-formulario-personal" class="hidden bg-white p-6 rounded-xl border border-[#249444]/20 shadow-sm animate-fade-in">
            <h5 id="titulo-formulario" class="font-bold text-stone-800 text-sm mb-4 pb-2 border-b border-stone-100 flex items-center gap-2">Capturar Nuevo Empleado</h5>
            <form id="form-nuevo-personal" onsubmit="guardarOActualizarPersonal(event)" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                <div>
                    <label class="block font-bold text-stone-700 mb-1">Clave Reg:</label>
                    <select name="claveReg" id="select-claveReg" onchange="filtrarCentrosPorRegionEfectiva(this.value)" required class="w-full p-2.5 border border-stone-300 rounded-lg bg-white focus:outline-none focus:border-[#249444]">
                        <option value="0">N/A</option>
                    </select>
                </div>
                <div>
                    <label class="block font-bold text-stone-700 mb-1">Clave Centro:</label>
                    <select name="claveCentro" id="select-claveCentro" onchange="filtrarSitiosPorCentroEfectivo(this.value)" required class="w-full p-2.5 border border-stone-300 rounded-lg bg-white focus:outline-none focus:border-[#249444]">
                        <option value="0">N/A</option>
                    </select>
                </div>
                <div>
                    <label class="block font-bold text-stone-700 mb-1">Clave Sitio:</label>
                    <select name="claveSit" id="select-claveSit" required class="w-full p-2.5 border border-stone-300 rounded-lg bg-white focus:outline-none focus:border-[#249444]">
                        <option value="0">N/A</option>
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
                    <button type="submit" class="py-2.5 px-6 bg-[#059669] text-white font-bold rounded-lg hover:bg-[#047857] transition">Guardar en Sheets</button>
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

    if (cargarLista) cargarDatosGenerales();
}

/** Funciones de Cascada (Corregidas y Robustecidas) **/

function poblarSelectoresCascada(regActual = '0', centroActual = '0', sitActual = '0') {
    const selReg = document.getElementById('select-claveReg');
    if (!selReg) return;
    const regsArray = Array.isArray(window._catRegs) ? window._catRegs : [];
    const regClean = (!regActual || regActual === '0' || regActual === 'N/A' || regActual === 0) ? '0' : String(regActual).trim();

    selReg.innerHTML = `<option value="0" ${regClean === '0' ? 'selected' : ''}>N/A</option>` + 
        regsArray.map(r => {
            const match = String(r.clave).trim() === regClean || String(r.nombre).trim().toLowerCase() === regClean.toLowerCase();
            return `<option value="${r.clave}" ${match ? 'selected' : ''}>${r.nombre}</option>`;
        }).join('');

    const optionSeleccionada = selReg.selectedIndex >= 0 ? selReg.options[selReg.selectedIndex] : null;
    const claveRegEfectiva = optionSeleccionada && optionSeleccionada.value !== "0" ? optionSeleccionada.value : regClean;
    filtrarCentrosPorRegionEfectiva(claveRegEfectiva, centroActual, sitActual);
}

function filtrarCentrosPorRegionEfectiva(regionClave, centroActual = '0', sitActual = '0') {
    const selCentro = document.getElementById('select-claveCentro');
    const selSit = document.getElementById('select-claveSit');
    if (!selCentro || !selSit) return;

    selCentro.innerHTML = `<option value="0">N/A</option>`;
    selSit.innerHTML = `<option value="0">N/A</option>`;

    const centrosArray = Array.isArray(window._catCentros) ? window._catCentros : [];
    const centroClean = (!centroActual || centroActual === '0' || centroActual === 'N/A' || centroActual === 0) ? '0' : String(centroActual).trim();

    if (regionClave !== "0") {
        const centrosFiltrados = centrosArray.filter(c => String(c.claveReg).trim() === String(regionClave).trim());
        selCentro.innerHTML += centrosFiltrados.map(c => {
            const match = String(c.clave).trim() === centroClean || String(c.nombre).trim().toLowerCase() === centroClean.toLowerCase();
            return `<option value="${c.clave}" ${match ? 'selected' : ''}>${c.nombre}</option>`;
        }).join('');
    }

    const optionCentroSel = selCentro.selectedIndex >= 0 ? selCentro.options[selCentro.selectedIndex] : null;
    const claveCentroEfectiva = optionCentroSel && optionCentroSel.value !== "0" ? optionCentroSel.value : centroClean;
    filtrarSitiosPorCentroEfectivo(claveCentroEfectiva, sitActual);
}

function filtrarSitiosPorCentroEfectivo(centroClave, sitActual = '0') {
    const selSit = document.getElementById('select-claveSit');
    if (!selSit) return;
    selSit.innerHTML = `<option value="0">N/A</option>`;

    const sitiosArray = Array.isArray(window._catSitios) ? window._catSitios : [];
    const sitClean = (!sitActual || sitActual === '0' || sitActual === 'N/A' || sitActual === 0) ? '0' : String(sitActual).trim();

    if (centroClave !== "0") {
        const sitiosFiltrados = sitiosArray.filter(s => String(s.claveCentro).trim() === String(centroClave).trim());
        selSit.innerHTML += sitiosFiltrados.map(s => {
            const match = String(s.clave).trim() === sitClean || String(s.nombre).trim().toLowerCase() === sitClean.toLowerCase();
            return `<option value="${s.clave}" ${match ? 'selected' : ''}>${s.clave} - ${s.nombre}</option>`;
        }).join('');
    }
}

/** Lógica de carga y edición **/

async function cargarDatosGenerales() {
    await cargarCatalogosSheets();
    await cargarDatosPersonalSheets();
}

async function cargarCatalogosSheets() {
    try {
        const [regs, centros, sitios] = await Promise.all([
            FetchAPI('obtenerRegiones').catch(() => []),
            FetchAPI('obtenerCentros').catch(() => []),
            FetchAPI('obtenerSitios').catch(() => [])
        ]);
        window._catRegs = Array.isArray(regs) ? regs : (regs?.data || []);
        window._catCentros = Array.isArray(centros) ? centros : (centros?.data || []);
        window._catSitios = Array.isArray(sitios) ? sitios : (sitios?.data || []);
    } catch (error) { console.error("Error al cargar catálogos:", error); }
}

async function mostrarFormularioNuevoPersonal() {
    const formContainer = document.getElementById('contenedor-formulario-personal');
    const form = document.getElementById('form-nuevo-personal');
    if (!formContainer || !form) return;
    form.reset();
    poblarSelectoresCascada('0', '0', '0');
    document.getElementById('input-numEmp').removeAttribute('readonly');
    document.getElementById('titulo-formulario').innerText = `Capturar Nuevo Empleado`;
    formContainer.classList.remove('hidden');
    document.getElementById('contenedor-gestion-personal').classList.add('hidden');
    document.getElementById('contenedor-listado-personal').classList.add('hidden');
}

function ocultarFormularioPersonal() {
    document.getElementById('contenedor-formulario-personal').classList.add('hidden');
    document.getElementById('contenedor-gestion-personal').classList.remove('hidden');
    document.getElementById('contenedor-listado-personal').classList.remove('hidden');
}

async function cargarDatosPersonalSheets() {
    const tbody = document.getElementById('tabla-personal-body');
    if (!tbody) return;
    tbody.innerHTML = `<tr><td colspan="6" class="p-6 text-center text-stone-400 italic">Sincronizando...</td></tr>`;
    try {
        const data = await FetchAPI('obtenerPersonal');
        window._empleadosCache = data || [];
        renderizarTablaPersonal(window._empleadosCache);
    } catch (e) { tbody.innerHTML = `<tr><td colspan="6" class="p-6 text-center text-red-500 italic">Error de conexión.</td></tr>`; }
}

function renderizarTablaPersonal(registros) {
    const tbody = document.getElementById('tabla-personal-body');
    if (!tbody) return;
    if (!registros.length) { tbody.innerHTML = `<tr><td colspan="6" class="p-6 text-center text-stone-400 italic">No hay registros.</td></tr>`; return; }
    tbody.innerHTML = registros.map((row, index) => `
        <tr class="border-b border-stone-100 hover:bg-stone-50 transition">
            <td class="p-3 font-mono text-stone-600">${row.claveReg || 'N/A'}</td>
            <td class="p-3 font-mono text-stone-600">${row.claveCentro || 'N/A'}</td>
            <td class="p-3 font-mono text-stone-600">${row.numEmp || 'N/A'}</td>
            <td class="p-3"><button onclick="seleccionarEmpleadoParaEditar(${index})" class="font-semibold text-[#249444] hover:underline">${row.nombre || 'N/A'}</button></td>
            <td class="p-3 text-stone-600">${row.puesto || 'N/A'}</td>
            <td class="p-3 text-stone-600">${row.departamento || 'N/A'}</td>
        </tr>
    `).join('');
}

async function seleccionarEmpleadoParaEditar(index) {
    const emp = window._empleadosCache[index];
    if (!emp) return;

    // 1. Aseguramos descargar los catálogos antes de continuar si están vacíos
    if (!window._catRegs || !window._catRegs.length || !window._catCentros || !window._catCentros.length) {
        await cargarCatalogosSheets();
    }

    // 2. PRIMERO renderizamos el contenedor/formulario limpio con el DOM base
    cargarPersonalRh(false); 

    const form = document.getElementById('form-nuevo-personal');
    const formContainer = document.getElementById('contenedor-formulario-personal');
    const gestionContainer = document.getElementById('contenedor-gestion-personal');
    const listadoContainer = document.getElementById('contenedor-listado-personal');
    const titulo = document.getElementById('titulo-formulario');
    const inputNumEmp = document.getElementById('input-numEmp');

    if (formContainer && form) {
        const limpiarValor = (val) => (!val || val === 0 || val === '0' || String(val).trim() === '') ? 'N/A' : val;

        // 3. SEGUNDO poblamos la cascada y seleccionamos las claves del empleado ahora que el DOM existe
        poblarSelectoresCascada(emp.claveReg, emp.claveCentro, emp.claveSit);

        form.elements['numEmp'].value = limpiarValor(emp.numEmp);
        inputNumEmp.setAttribute('readonly', true);
        
        const fields = ['nombre', 'ext', 'numPers', 'escolaridad', 'direccion', 'cp', 'email', 'rfc', 'puesto', 'departamento', 'ciudad', 'estado'];
        fields.forEach(f => {
            if (form.elements[f]) form.elements[f].value = limpiarValor(emp[f]);
        });

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
        cargarDatosPersonalSheets();
    } catch (e) { alert("Error al guardar"); }
}