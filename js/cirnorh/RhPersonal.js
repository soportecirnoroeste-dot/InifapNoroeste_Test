// js/cirnorh/RhPersonal.js

function cargarPersonalRh() {
    renderizarVistaModulo('personal', "Directorio de empleados, altas, bajas y estructura organizacional.");

    const contenedorDinamico = document.getElementById('contenido-submodulo-dinamico');
    if (!contenedorDinamico) return;

    contenedorDinamico.className = "w-full space-y-6";

    contenedorDinamico.innerHTML = `
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-stone-50 p-4 rounded-xl border border-stone-200">
            <div>
                <h4 class="font-bold text-stone-800 text-sm">Gestión de Personal</h4>
                <p class="text-xs text-stone-500">Visualiza el padrón completo, da de alta o haz clice en un empleado para editar sus datos.</p>
            </div>
            <div class="flex gap-2">
                <button onclick="mostrarFormularioNuevoPersonal()" class="px-4 py-2 bg-[#249444] text-white rounded-xl text-xs font-bold hover:bg-[#1e7a37] transition flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                    Nuevo Registro
                </button>
                <button onclick="cargarDatosPersonalSheets()" class="px-4 py-2 bg-stone-200 text-stone-700 rounded-xl text-xs font-bold hover:bg-stone-300 transition flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 21h5v-5"/></svg>
                    Actualizar Datos
                </button>
            </div>
        </div>

        <div id="contenedor-formulario-personal" class="hidden bg-white p-6 rounded-xl border border-[#249444]/20 shadow-sm animate-fade-in">
            <h5 id="titulo-formulario" class="font-bold text-stone-800 text-sm mb-4 pb-2 border-b border-stone-100 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-[#059669]"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                Capturar Nuevo Empleado
            </h5>
            <form id="form-nuevo-personal" onsubmit="guardarOActualizarPersonal(event)" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                <div>
                    <label class="block font-bold text-stone-700 mb-1">Clave Reg:</label>
                    <input type="text" name="claveReg" required class="w-full p-2.5 border border-stone-300 rounded-lg focus:outline-none focus:border-[#249444]">
                </div>
                <div>
                    <label class="block font-bold text-stone-700 mb-1">Núm. Empleado:</label>
                    <input type="text" name="numEmp" id="input-numEmp" required class="w-full p-2.5 border border-stone-300 rounded-lg focus:outline-none focus:border-[#249444]">
                </div>
                <div>
                    <label class="block font-bold text-stone-700 mb-1">Nombre Completo:</label>
                    <input type="text" name="nombre" required class="w-full p-2.5 border border-stone-300 rounded-lg focus:outline-none focus:border-[#249444]">
                </div>
                <div>
                    <label class="block font-bold text-stone-700 mb-1">RFC:</label>
                    <input type="text" name="rfc" required class="w-full p-2.5 border border-stone-300 rounded-lg focus:outline-none focus:border-[#249444]">
                </div>
                <div>
                    <label class="block font-bold text-stone-700 mb-1">Puesto:</label>
                    <input type="text" name="puesto" required class="w-full p-2.5 border border-stone-300 rounded-lg focus:outline-none focus:border-[#249444]">
                </div>
                <div>
                    <label class="block font-bold text-stone-700 mb-1">Departamento:</label>
                    <input type="text" name="departamento" required class="w-full p-2.5 border border-stone-300 rounded-lg focus:outline-none focus:border-[#249444]">
                </div>
                <div>
                    <label class="block font-bold text-stone-700 mb-1">Ciudad:</label>
                    <input type="text" name="ciudad" class="w-full p-2.5 border border-stone-300 rounded-lg focus:outline-none focus:border-[#249444]">
                </div>
                <div>
                    <label class="block font-bold text-stone-700 mb-1">Estado:</label>
                    <input type="text" name="estado" class="w-full p-2.5 border border-stone-300 rounded-lg focus:outline-none focus:border-[#249444]">
                </div>
                <div class="sm:col-span-2 md:col-span-3 flex items-end gap-2 pt-2">
                    <button type="submit" class="py-2.5 px-6 bg-[#059669] text-white font-bold rounded-lg hover:bg-[#047857] transition flex items-center justify-center gap-1.5">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
                        Guardar en Sheets
                    </button>
                    <button type="button" onclick="ocultarFormularioPersonal()" class="px-4 py-2.5 bg-stone-100 text-stone-600 font-bold rounded-lg hover:bg-stone-200 transition">Cancelar</button>
                </div>
            </form>
        </div>

        <div class="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-sm">
            <div class="p-4 border-b border-stone-100 font-bold text-xs text-stone-700 uppercase tracking-wider flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-[#059669]"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                Listado General de Empleados
            </div>
            <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse text-xs">
                    <thead>
                        <tr class="bg-stone-50 text-stone-600 border-b border-stone-200">
                            <th class="p-3 font-bold">REG</th>
                            <th class="p-3 font-bold">CENTRO</th>
                            <th class="p-3 font-bold">NO. EMP</th>
                            <th class="p-3 font-bold">NOMBRE</th>
                            <th class="p-3 font-bold">PUESTO</th>
                            <th class="p-3 font-bold">DEPARTAMENTO</th>
                        </tr>
                    </thead>
                    <tbody id="tabla-personal-body">
                        <tr>
                            <td colspan="6" class="p-6 text-center text-stone-400 italic">Cargando registros...</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    `;

    cargarDatosPersonalSheets();
}

window._empleadosCache = [];

function mostrarFormularioNuevoPersonal() {
    const formContainer = document.getElementById('contenedor-formulario-personal');
    const form = document.getElementById('form-nuevo-personal');
    const titulo = document.getElementById('titulo-formulario');
    const inputNumEmp = document.getElementById('input-numEmp');

    if (formContainer && form) {
        form.reset();
        inputNumEmp.removeAttribute('readonly');
        titulo.innerHTML = `Capturar Nuevo Empleado`;
        formContainer.classList.remove('hidden');
        formContainer.scrollIntoView({ behavior: 'smooth' });
    }
}

function ocultarFormularioPersonal() {
    const formContainer = document.getElementById('contenedor-formulario-personal');
    if (formContainer) formContainer.classList.add('hidden');
}

async function cargarDatosPersonalSheets() {
    const tbody = document.getElementById('tabla-personal-body');
    if (!tbody) return;

    tbody.innerHTML = `<tr><td colspan="6" class="p-6 text-center text-stone-400 italic">Sincronizando los datos...</td></tr>`;

    try {
        const data = await FetchAPI('obtenerPersonal');
        window._empleadosCache = data || [];
        renderizarTablaPersonal(window._empleadosCache);
    } catch (error) {
        console.error("Error al cargar datos de Sheets:", error);
        tbody.innerHTML = `<tr><td colspan="6" class="p-6 text-center text-red-500 italic">Error al conectar con Sheets.</td></tr>`;
    }
}

function renderizarTablaPersonal(registros) {
    const tbody = document.getElementById('tabla-personal-body');
    if (!tbody) return;

    if (!registros || registros.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" class="p-6 text-center text-stone-400 italic">No se encontraron registros.</td></tr>`;
        return;
    }

    tbody.innerHTML = registros.map((row, index) => {
        const reg = row.textoReg || row.claveReg || 'N/A';
        const centro = row.textoCentro || row.claveCentro || 'N/A';
        const noEmp = row.numEmp || 'N/A';
        const nombre = row.nombre || 'Sin Nombre';
        const puesto = row.puesto || '';
        const departamento = row.departamento || '';

        return `
            <tr class="border-b border-stone-100 hover:bg-stone-50 transition">
                <td class="p-3 font-mono text-stone-600">${reg}</td>
                <td class="p-3 font-mono text-stone-600">${centro}</td>
                <td class="p-3 font-mono text-stone-600">${noEmp}</td>
                <td class="p-3">
                    <button onclick="seleccionarEmpleadoParaEditar(${index})" class="font-semibold text-[#249444] hover:underline text-left">
                        ${nombre}
                    </button>
                </td>
                <td class="p-3 text-stone-600">${puesto}</td>
                <td class="p-3 text-stone-600">${departamento}</td>
            </tr>
        `;
    }).join('');
}

function seleccionarEmpleadoParaEditar(index) {
    const emp = window._empleadosCache[index];
    if (!emp) return;

    const formContainer = document.getElementById('contenedor-formulario-personal');
    const form = document.getElementById('form-nuevo-personal');
    const titulo = document.getElementById('titulo-formulario');
    const inputNumEmp = document.getElementById('input-numEmp');

    if (formContainer && form) {
        // Asignación completa de todos los campos a la ficha/formulario
        form.elements['claveReg'].value = emp.claveReg || '';
        if (form.elements['claveCentro']) form.elements['claveCentro'].value = emp.claveCentro || '';
        if (form.elements['claveSit']) form.elements['claveSit'].value = emp.claveSit || '';

        form.elements['numEmp'].value = emp.numEmp || '';
        inputNumEmp.setAttribute('readonly', true);

        if (form.elements['pass']) form.elements['pass'].value = emp.pass || '';
        form.elements['nombre'].value = emp.nombre || '';
        form.elements['rfc'].value = emp.rfc || '';
        form.elements['puesto'].value = emp.puesto || '';
        form.elements['departamento'].value = emp.departamento || '';

        if (form.elements['ext']) form.elements['ext'].value = emp.ext || '';
        if (form.elements['numPers']) form.elements['numPers'].value = emp.numPers || '';
        if (form.elements['escolaridad']) form.elements['escolaridad'].value = emp.escolaridad || '';
        if (form.elements['direccion']) form.elements['direccion'].value = emp.direccion || '';

        form.elements['ciudad'].value = emp.ciudad || '';
        form.elements['estado'].value = emp.estado || '';

        if (form.elements['cp']) form.elements['cp'].value = emp.cp || '';
        if (form.elements['email']) form.elements['email'].value = emp.email || '';

        titulo.innerHTML = `Editando Empleado: <span class="text-[#249444]">${emp.nombre || ''}</span>`;
        formContainer.classList.remove('hidden');
        formContainer.scrollIntoView({ behavior: 'smooth' });
    }
}

async function guardarOActualizarPersonal(event) {
    event.preventDefault();
    const form = document.getElementById('form-nuevo-personal');
    const formData = new FormData(form);
    const datosEmpleado = Object.fromEntries(formData.entries());

    const existe = window._empleadosCache.some(e => String(e.numEmp).trim() === String(datosEmpleado.numEmp).trim());
    const actionName = existe ? 'actualizarPersonal' : 'guardarPersonal';

    try {
        const resultado = await FetchAPI(actionName, datosEmpleado);
        alert(resultado.message || "¡Operación realizada correctamente!");
        form.reset();
        ocultarFormularioPersonal();
        cargarDatosPersonalSheets();
    } catch (error) {
        console.error("Error al procesar los datos:", error);
        alert("Error de red al intentar guardar los datos.");
    }
}