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
                    <!-- Agregamos el onchange aquí -->
                    <select name="claveReg" id="select-claveReg" onchange="filtrarCentrosPorRegion()" required class="w-full p-2.5 border border-stone-300 rounded-lg bg-white focus:outline-none focus:border-[#249444]">
                        <option value="" disabled selected>Seleccione una región...</option>
                    </select>
                </div>
                <div>
                    <label class="block font-bold text-stone-700 mb-1">Clave Centro:</label>
                    <select name="claveCentro" id="select-claveCentro" onchange="filtrarSitiosPorCentro(this.value)" required class="w-full p-2.5 border border-stone-300 rounded-lg bg-white focus:outline-none focus:border-[#249444]">
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
    // 1. Si ya hay caché y no es forzado, no hacemos nada
    if (!forzar && window._catRegs && window._catRegs.length > 0) return;

    try {
        const URL = "https://script.google.com/macros/s/AKfycbzDs5fvFxykQniWFZnbUqpbuDAmrIDhMHlVwU4r5B3iPLxBp4FDG7uKrtDBDQEXxEX8fQ/exec?action=obtenerDatosSistema";
        const response = await fetch(URL);
        const data = await response.json();

        // 2. Asignamos los datos usando la propiedad correcta para sitios
        window._catRegs = data.regionales || [];
        window._catCentros = data.campos || [];
        window._catSitios = data.sitios || []; // <--- Leemos la nueva propiedad limpia

        console.log("Catálogos cargados desde servidor:", window._catRegs, window._catCentros, window._catSitios);

        // 👉 DISPARAMOS EL FILTRO AQUÍ:
        const centroActual = document.getElementById('select-claveCentro') ? document.getElementById('select-claveCentro').value : '';
        if (typeof window.filtrarSitiosPorCentro === 'function') {
            window.filtrarSitiosPorCentro(centroActual);
        }

    } catch (e) {
        console.error("Error al cargar catálogos desde servidor...", e);
    }
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

        // Nos aseguramos de tener los catálogos listos antes de poblar
        if (!window._catRegs || window._catRegs.length === 0) {
            await cargarCatalogosSheets(true);
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

function poblarSelectoresCascada(regSeleccionada = '', centroSeleccionado = '', sitioSeleccionado = '') {
    const selectReg = document.getElementById('select-claveReg');
    const selectCentro = document.getElementById('select-claveCentro');
    const selectSitio = document.getElementById('select-claveSit');

    if (!selectReg || !selectCentro || !selectSitio) return;

    // 1. Llenar Regiones usando las propiedades correctas de tu JSON (claveReg y regional)
    selectReg.innerHTML = '<option value="" disabled selected>Seleccione una región...</option>' +
        window._catRegs.map(r => `<option value="${r.claveReg}">${r.claveReg} - ${r.regional}</option>`).join('');

    // 2. Si nos pasan una región (al editar), la seleccionamos y filtramos centros pasándole los valores que le corresponden
    if (regSeleccionada) {
        selectReg.value = regSeleccionada;
        // Llamamos a la función de filtrado pasándole el centro y el sitio que trae el empleado a editar
        filtrarCentrosPorRegion(centroSeleccionado, sitioSeleccionado);
    }

    // 3. Conectar eventos de cambio para cuando el usuario interactúe manualmente
    selectReg.onchange = () => filtrarCentrosPorRegion();
    selectCentro.onchange = () => filtrarSitiosPorCentro();
}
// Función principal que hace todo el trabajo
window.filtrarCentrosPorRegion = function (centroActual = '', sitActual = '') {
    const selReg = document.getElementById('select-claveReg') || document.querySelector('select[name="claveReg"]');
    const selCentro = document.getElementById('select-claveCentro') || document.querySelector('select[name="claveCentro"]');
    const selSit = document.getElementById('select-claveSit') || document.querySelector('select[name="claveSit"]');

    if (!selReg || !selCentro || !selSit) return;

    const regionSeleccionada = selReg.value;

    // 1. Resetear Centros y Sitios
    selCentro.innerHTML = `<option value="" disabled selected>Seleccione un centro...</option>`;
    selSit.innerHTML = `<option value="" disabled selected>Seleccione un sitio...</option>`;

    // 2. Filtrar Centros por Región
    const centrosArray = Array.isArray(window._catCentros) ? window._catCentros : [];
    const centrosFiltrados = regionSeleccionada ? centrosArray.filter(c => {
        const regEnFila = String(c.ClaveReg || c.claveReg || c.CLAVEREG || '').trim();
        return regEnFila === String(regionSeleccionada).trim();
    }) : [];

    if (centrosFiltrados.length > 0) {
        selCentro.innerHTML += centrosFiltrados.map(c => {
            const claveC = c.ClaveCentro || c.claveCentro || c.CLAVECENTRO || c.clave || '';
            const nombreC = c.Centro || c.centro || c.nombre || '';
            const selected = (String(claveC) === String(centroActual)) ? 'selected' : '';
            return `<option value="${claveC}" ${selected}>${claveC} - ${nombreC}</option>`;
        }).join('');
    }

    // 3. Si hay un centro seleccionado (o pre-cargado), filtrar sitios automáticamente
    if (centroActual || selCentro.value) {
        filtrarSitiosPorCentro(centroActual || selCentro.value, sitActual);
    }
};

window.filtrarSitiosPorCentro = function (claveCentro = '', sitActual = '') {
    const selSit = document.getElementById('select-claveSit');
    if (!selSit) return;

    // 1. Obtenemos el valor del centro actual en pantalla
    const centroId = (claveCentro || document.getElementById('select-claveCentro').value || '').trim();

    // 🛑 REGLA CLAVE: Si no hay un centro seleccionado (está vacío o dice por defecto), 
    // limpiamos el select de sitios y no mostramos nada hasta que elijan uno.
    if (!centroId || centroId === "" || centroId.includes("Seleccione")) {
        selSit.innerHTML = `<option value="" disabled selected>Seleccione un sitio...</option>`;
        return;
    }

    // 2. Filtramos sitios basados en el centro seleccionado
    const sitiosArray = Array.isArray(window._catSitios) ? window._catSitios : [];
    const sitiosFiltrados = sitiosArray.filter(s => {
        const cAsociado = String(s.claveCentro || s.ClaveCentro || '').trim();
        return cAsociado === centroId;
    });

    // 3. Construimos las opciones (N/A por defecto si no hay sitio o es 0)
    let esNulo = (!sitActual || sitActual === '0' || sitActual === 0 || sitActual === 'N/A');
    let opcionesHTML = `<option value="N/A" ${esNulo ? 'selected' : ''}>N/A - No aplica</option>`;

    if (sitiosFiltrados.length > 0) {
        opcionesHTML += sitiosFiltrados.map(s => {
            const claveS = String(s.claveS || s.claveSit || s.ClaveSitio || '').trim();
            const nombreS = s.sitio || s.Sitio || s.nombre || '';
            return `<option value="${claveS}">${claveS} - ${nombreS}</option>`;
        }).join('');
    }

    // Insertamos el HTML en el select
    selSit.innerHTML = opcionesHTML;

    // 4. Si estamos editando y hay un sitio válido, lo seleccionamos
    if (!esNulo) {
        selSit.value = sitActual;
    }
};

// Auto-conector universal para asegurar que funcione sin depender del HTML
document.addEventListener("DOMContentLoaded", () => {
    // 1. Configurar región (como ya lo tenías)
    const selReg = document.getElementById('select-claveReg') || document.querySelector('select[name="claveReg"]');
    if (selReg) {
        console.log("🔗 [AUTO-CONECTOR] Select de región encontrado. Enlazando evento change...");
        selReg.addEventListener('change', () => {
            window.filtrarCentrosPorRegion();
        });
    } else {
        console.warn("⚠️ [AUTO-CONECTOR] No se encontró el select de región en el DOM.");
    }

    // 2. 👉 AGREGAR AQUÍ LA CONFIGURACIÓN DEL CENTRO Y SITIOS:
    const selCentro = document.getElementById('select-claveCentro');
    if (selCentro) {
        console.log("🔗 [AUTO-CONECTOR] Select de centro encontrado. Enlazando evento change para sitios...");
        selCentro.addEventListener('change', function(e) {
            window.filtrarSitiosPorCentro(e.target.value);
        });
    }
});

window.filtrarSitiosPorCentro = function (claveCentro = '', sitActual = '') {
    const selSit = document.getElementById('select-claveSit');
    if (!selSit) return;

    // 1. Limpiamos y ponemos la opción por defecto
    selSit.innerHTML = `<option value="" disabled selected>Seleccione un sitio...</option>`;

    // 2. Obtenemos el valor si no nos lo pasaron
    const centroId = claveCentro || document.getElementById('select-claveCentro').value;

    // 3. Filtramos sitios basados en el centro
    const sitiosArray = Array.isArray(window._catSitios) ? window._catSitios : [];
    const sitiosFiltrados = sitiosArray.filter(s => {
        // Aseguramos que comparamos los mismos tipos de datos (strings)
        const cAsociado = String(s.claveCentro || s.ClaveCentro || '').trim();
        return cAsociado === String(centroId).trim();
    });

    // 4. Lógica: Si hay sitios, los agregamos. Si NO hay, agregamos solo "N/A"
    if (sitiosFiltrados.length > 0) {
        selSit.innerHTML += sitiosFiltrados.map(s => {
            const claveS = s.clave || s.ClaveSitio || '';
            const nombreS = s.nombre || s.Sitio || '';
            return `<option value="${claveS}">${claveS} - ${nombreS}</option>`;
        }).join('');
    } else {
        // No hay resultados, agregamos N/A
        selSit.innerHTML += `<option value="N/A" selected>N/A - No aplica</option>`;
    }

    // 5. Si estamos editando, seleccionamos el valor que traía el empleado
    if (sitActual) {
        selSit.value = sitActual;
    }
};

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
        alert("No se pudieron cargar los datos del empleado.");
        return;
    }

    cargarPersonalRh(false);
    await cargarCatalogosSheets();

    const form = document.getElementById('form-nuevo-personal');
    const formContainer = document.getElementById('contenedor-formulario-personal');
    const gestionContainer = document.getElementById('contenedor-gestion-personal');
    const listadoContainer = document.getElementById('contenedor-listado-personal');
    const titulo = document.getElementById('titulo-formulario');
    const inputNumEmp = document.getElementById('input-numEmp');

    if (formContainer && form) {
        const regVal = extraerClave(emp.claveReg || emp.textoReg);
        const centroVal = extraerClave(emp.claveCentro || emp.textoCentro);
        let rawSit = extraerClave(emp.claveSit || emp.textoSit);
        const sitVal = (!rawSit || rawSit === 0 || rawSit === '0' || String(rawSit).trim().toUpperCase() === 'N/A') ? 'N/A' : rawSit;

        // Poblamos selectores
        poblarSelectoresCascada(regVal, centroVal, sitVal);

        // Llenamos inputs
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

function limpiarValor(val) {
    return (!val || val === 0 || val === '0' || String(val).trim() === '') ? '' : val;
}

function extraerClave(val) {
    if (!val) return '';
    const str = String(val).trim();
    if (str.includes(' - ')) return str.split(' - ')[0].trim();
    return str;
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

