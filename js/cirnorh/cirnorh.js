window.cirnorhConfig = {
    deptoKey: "cirnorh",
    subtitle: "Gestión de personal, incidencias, nómina y desarrollo humano.",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-handshake"><path d="m11 17 2 2a1 1 0 1 0 3-3"/><path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4"/><path d="m21 3 1 11h-2"/><path d="M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3"/><path d="M3 4h8"/></svg>`,
    options: [
        { 
            id: "personal", 
            title: "Personal", 
            icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 21a8 8 0 0 0-16 0"/><circle cx="10" cy="8" r="5"/><path d="M22 20c0-3.37-2-6.5-4-8a5 5 0 0 0-.45-8.3"/></svg>`, 
            action: "manejarAccionSeccion('personal')" 
        },
        { 
            id: "asistencia", 
            title: "Asistencia", 
            icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 21a8 8 0 0 1 13.292-6"/><circle cx="10" cy="8" r="5"/><path d="m16 19 2 2 4-4"/></svg>`, 
            action: "manejarAccionSeccion('asistencia')" 
        },
        { 
            id: "vacaciones", 
            title: "Vacaciones", 
            icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.5 11.134 18.196 21"/><path d="M20.425 5.299a10 10 0 0 0-16.941 9.78c.183.563.843.774 1.355.478L20.16 6.711c.512-.296.66-.973.264-1.413"/><path d="M21 21H3"/></svg>`, 
            action: "manejarAccionSeccion('vacaciones')" 
        },
        { 
            id: "capacitacion", 
            title: "Capacitación", 
            icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="8" height="18" x="3" y="3" rx="1"/><path d="M7 3v18"/><path d="M20.4 18.9c.2.5-.1 1.1-.6 1.3l-1.9.7c-.5.2-1.1-.1-1.3-.6L11.1 5.1c-.2-.5.1-1.1.6-1.3l1.9-.7c.5-.2 1.1.1 1.3.6Z"/></svg>`, 
            action: "manejarAccionSeccion('capacitacion')" 
        },
        { 
            id: "expedientes", 
            title: "Expedientes", 
            icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="5" x="2" y="3" rx="1"/><path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8"/><path d="M10 12h4"/></svg>`, 
            action: "manejarAccionSeccion('expedientes')" 
        },
        { 
            id: "generar-oficios", 
            title: "Generar Oficios", 
            icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"/><path d="M14 2v5a1 1 0 0 0 1 1h5"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg>`, 
            action: "manejarAccionSeccion('generar-oficios')" 
        }
    ]
};

function obtenerContenedor() {
    return document.getElementById('app-container') || document.querySelector('main') || document.body;
}

// Módulo de Personal adaptado a las columnas reales del Sheet
function cargarPersonalRh() {
    renderizarVistaModulo('personal', "Directorio de empleados, altas, bajas y estructura organizacional.");
    
    const contenedorDinamico = document.getElementById('contenido-submodulo-dinamico');
    if (!contenedorDinamico) return;

    contenedorDinamico.className = "w-full space-y-6";

    contenedorDinamico.innerHTML = `
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-stone-50 p-4 rounded-xl border border-stone-200">
            <div>
                <h4 class="font-bold text-stone-800 text-sm">Gestión de Personal - Conectado a Sheets</h4>
                <p class="text-xs text-stone-500">Visualiza el padrón de empleados o registra un nuevo elemento.</p>
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
            <h5 class="font-bold text-stone-800 text-sm mb-4 pb-2 border-b border-stone-100 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-[#059669]"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                Capturar Nuevo Empleado
            </h5>
            <form id="form-nuevo-personal" onsubmit="guardarPersonalSheets(event)" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                <div>
                    <label class="block font-bold text-stone-700 mb-1">Clave Reg:</label>
                    <input type="text" name="claveReg" required class="w-full p-2.5 border border-stone-300 rounded-lg focus:outline-none focus:border-[#249444]">
                </div>
                <div>
                    <label class="block font-bold text-stone-700 mb-1">Núm. Empleado:</label>
                    <input type="text" name="numEmp" required class="w-full p-2.5 border border-stone-300 rounded-lg focus:outline-none focus:border-[#249444]">
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
                Listado General de Empleados (Google Sheets)
            </div>
            <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse text-xs">
                    <thead>
                        <tr class="bg-stone-50 text-stone-600 border-b border-stone-200">
                            <th class="p-3 font-bold">Núm. Emp</th>
                            <th class="p-3 font-bold">Nombre</th>
                            <th class="p-3 font-bold">RFC</th>
                            <th class="p-3 font-bold">Puesto</th>
                            <th class="p-3 font-bold">Departamento</th>
                            <th class="p-3 font-bold">Ciudad / Estado</th>
                        </tr>
                    </thead>
                    <tbody id="tabla-personal-body">
                        <tr>
                            <td colspan="6" class="p-6 text-center text-stone-400 italic">Cargando registros desde Google Sheets...</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    `;

    cargarDatosPersonalSheets();
}

function mostrarFormularioNuevoPersonal() {
    const formContainer = document.getElementById('contenedor-formulario-personal');
    if (formContainer) formContainer.classList.remove('hidden');
}

function ocultarFormularioPersonal() {
    const formContainer = document.getElementById('contenedor-formulario-personal');
    if (formContainer) formContainer.classList.add('hidden');
}

// Lectura de datos reales del Google Sheet
async function cargarDatosPersonalSheets() {
    const tbody = document.getElementById('tabla-personal-body');
    if (!tbody) return;

    tbody.innerHTML = `<tr><td colspan="6" class="p-6 text-center text-stone-400 italic">Sincronizando con Google Sheets...</td></tr>`;

    try {
        // REEMPLAZA ESTA URL CON TU URL DE IMPLEMENTACIÓN DE GOOGLE APPS SCRIPT (WEB APP)
        const URL_GOOGLE_SHEETS = "TU_URL_DE_APPS_SCRIPT_AQUI"; 

        if (URL_GOOGLE_SHEETS === "TU_URL_DE_APPS_SCRIPT_AQUI") {
            // Simulación exacta con el registro que aparece en tu imagen de Sheets (Ilse Elena Tapia Lopez)
            setTimeout(() => {
                renderizarTablaPersonal([
                    { 
                        numEmp: "4398", 
                        nombre: "ILSE ELENA TAPIA LOPEZ", 
                        rfc: "TALI9208039T1", 
                        puesto: "COORDINADOF", 
                        departamento: "DIRECCION DE...", 
                        ciudad: "CAJEME", 
                        estado: "SONORA" 
                    }
                ]);
            }, 400);
            return;
        }

        const response = await fetch(URL_GOOGLE_SHEETS);
        const data = await response.json();
        renderizarTablaPersonal(data);

    } catch (error) {
        console.error("Error al cargar datos de Sheets:", error);
        tbody.innerHTML = `<tr><td colspan="6" class="p-6 text-center text-red-500 italic">Error al conectar con Google Sheets. Verifica la URL.</td></tr>`;
    }
}

function renderizarTablaPersonal(registros) {
    const tbody = document.getElementById('tabla-personal-body');
    if (!tbody) return;

    if (!registros || registros.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" class="p-6 text-center text-stone-400 italic">No se encontraron registros en Google Sheets.</td></tr>`;
        return;
    }

    tbody.innerHTML = registros.map(row => `
        <tr class="border-b border-stone-100 hover:bg-stone-50 transition">
            <td class="p-3 font-mono text-stone-600">${row.numEmp || row[3] || 'N/A'}</td>
            <td class="p-3 font-semibold text-stone-800">${row.nombre || row[5] || ''}</td>
            <td class="p-3 font-mono text-stone-600">${row.rfc || row[6] || 'N/A'}</td>
            <td class="p-3 text-stone-600">${row.puesto || row[7] || ''}</td>
            <td class="p-3 text-stone-600">${row.departamento || row[8] || ''}</td>
            <td class="p-3 text-stone-600">${(row.ciudad || row[14] || '') + ', ' + (row.estado || row[13] || '')}</td>
        </tr>
    `).join('');
}

async function guardarPersonalSheets(event) {
    event.preventDefault();
    const form = document.getElementById('form-nuevo-personal');
    const formData = new FormData(form);
    const nuevoRegistro = Object.fromEntries(formData.entries());

    const URL_GOOGLE_SHEETS = "TU_URL_DE_APPS_SCRIPT_AQUI"; 

    if (URL_GOOGLE_SHEETS === "TU_URL_DE_APPS_SCRIPT_AQUI") {
        alert("¡Registro simulado guardado con éxito! (Configura tu URL de Google Apps Script para guardar en vivo)");
        form.reset();
        ocultarFormularioPersonal();
        cargarDatosPersonalSheets();
        return;
    }

    try {
        const response = await fetch(URL_GOOGLE_SHEETS, {
            method: 'POST',
            body: JSON.stringify(nuevoRegistro),
            headers: { 'Content-Type': 'application/json' }
        });
        
        if (response.ok) {
            alert("¡Registro guardado correctamente en Google Sheets!");
            form.reset();
            ocultarFormularioPersonal();
            cargarDatosPersonalSheets();
        } else {
            alert("Hubo un error al guardar en Google Sheets.");
        }
    } catch (error) {
        console.error("Error al enviar datos:", error);
        alert("Error de red al intentar guardar los datos.");
    }
}

// Resto de vistas de Recursos Humanos
function cargarAsistenciaRh() {
    renderizarVistaModulo('asistencia', "Registro de retardos, faltas, permisos y justificantes.");
}

function cargarVacacionesRh() {
    renderizarVistaModulo('vacaciones', "Calendario de descansos y control de días económicos disponibles.");
}

function cargarCapacitacionRh() {
    renderizarVistaModulo('capacitacion', "Cursos, talleres y constancias de desarrollo profesional para el personal.");
}

function cargarExpedientesRh() {
    renderizarVistaModulo('expedientes', "Documentación oficial, contratos y resguardos de los trabajadores.");
}

function cargarGenerarOficiosRh() {
    let opt = window.cirnorhConfig.options.find(o => o.id === 'generar-oficios');
    const contenedor = obtenerContenedor();
    
    if (contenedor && opt) {
        contenedor.innerHTML = `
            <div class="bg-white rounded-2xl p-6 md:p-8 soft-shadow border border-[#249444]/10 mb-8 w-full box-border">
                <div class="flex items-center gap-3 mb-4">
                    <div class="p-2.5 bg-[#f0fdf4] border border-[#c6f6d5] text-[#059669] rounded-xl flex items-center justify-center">
                        ${opt.icon}
                    </div>
                    <div>
                        <h3 class="font-black text-stone-800 text-lg">Generación de Oficios - Recursos Humanos</h3>
                        <p class="text-xs text-stone-500">Elaboración de constancias laborales, comisiones y avisos internos.</p>
                    </div>
                </div>
                <div class="p-4 bg-stone-50 rounded-xl border border-dashed border-stone-300 text-xs text-stone-400 text-center mt-4">
                    Aquí irá el formulario o generador de documentos específico para RH.
                </div>
            </div>
        `;
    }
}

function renderizarVistaModulo(idOpt, descripcion) {
    const nombreCortoActual = localStorage.getItem('depto_activo_actual') || '';
    const configActual = window[nombreCortoActual + 'Config'];
    
    const opt = configActual ? configActual.options.find(o => o.id === idOpt) : null;
    const contenedor = document.getElementById('app-container');
    
    if (contenedor && opt) {
        if (typeof window.actualizarBotonRegresar === 'function') {
            window.actualizarBotonRegresar('submodulo', nombreCortoActual);
        }

        contenedor.innerHTML = `
            <section class="bg-white rounded-2xl p-6 md:p-8 soft-shadow border border-[#249444]/10 mb-8 animate-fade-in">
                <div class="flex items-center gap-3 mb-6 pb-4 border-b border-stone-100">
                    <div class="p-2.5 bg-[#f0fdf4] border border-[#c6f6d5] text-[#059669] rounded-xl flex items-center justify-center">
                        ${opt.icon}
                    </div>
                    <div>
                        <h3 class="font-black text-stone-800 text-lg uppercase tracking-wide">${opt.title}</h3>
                        <p class="text-xs text-stone-500">${descripcion}</p>
                    </div>
                </div>

                <div id="contenido-submodulo-dinamico" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    </div>
            </section>
        `;
    }
}