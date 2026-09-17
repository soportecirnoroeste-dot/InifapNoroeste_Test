// js/SisPer/SisPerCore.js

function renderizarListadoPermisosSis() {
    renderizarVistaModuloSis('permisos', "Selecciona un colaborador para administrar su matriz de accesos por módulos y submódulos.");
    
    const contenedorDinamico = document.getElementById('contenido-submodulo-dinamico');
    if (contenedorDinamico) {
        contenedorDinamico.className = "col-span-1 sm:col-span-2 md:col-span-3 space-y-6 animate-fade-in";
        contenedorDinamico.innerHTML = `
            <div class="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4">
                <div class="w-full sm:w-96">
                    <input type="text" id="input-buscar-permisos" placeholder="BUSCAR POR NOMBRE, PUESTO, DEPARTAMENTO..." onkeyup="filtrarTarjetasPermisosSis()" class="w-full bg-stone-50 border border-stone-200 text-xs rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#249444] uppercase">
                </div>
                <div class="text-xs text-stone-400 font-medium text-right w-full sm:w-auto">
                    Mostrando personal activo
                </div>
            </div>

            <div id="grid-permisos-empleados" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div class="col-span-full p-8 text-center text-stone-400 italic bg-white rounded-2xl border border-stone-200 shadow-sm">
                    Cargando colaboradores desde Google Sheets...
                </div>
            </div>
        `;

        // Llamar de forma inmediata y segura a la carga de datos
        cargarEmpleadosParaPermisosSis();
    }
}

// Función para traer los datos reales de la pestaña Personal
async function cargarEmpleadosParaPermisosSis() {
    const grid = document.getElementById('grid-permisos-empleados');
    
    if (window.listaEmpleadosPermisosCache && window.listaEmpleadosPermisosCache.length > 0) {
        renderizarTarjetasPermisosSis(window.listaEmpleadosPermisosCache);
        return;
    }

    try {
        let data = [];
        if (typeof FetchAPI === 'function') {
            data = await FetchAPI('obtenerPersonal');
        } else if (typeof google !== 'undefined' && google.script && google.script.run) {
            data = await new Promise((resolve, reject) => {
                google.script.run.withSuccessHandler(resolve).withFailureHandler(reject).obtenerPersonalDesdeSheet();
            });
        }

        window.listaEmpleadosPermisosCache = data || [];
        renderizarTarjetasPermisosSis(window.listaEmpleadosPermisosCache);
    } catch (err) {
        console.error("Error al cargar empleados para permisos:", err);
        if (grid) {
            grid.innerHTML = `<div class="col-span-full p-6 text-center text-red-500 bg-white rounded-2xl border border-stone-200 shadow-sm">Error al cargar datos: ${err.message || 'Error de conexión'}</div>`;
        }
    }
}

// Función para generar iniciales
function obtenerInicialesNombre(nombre) {
    if (!nombre) return "US";
    const partes = nombre.trim().split(" ");
    if (partes.length >= 2) {
        return (partes[0][0] + partes[1][0]).toUpperCase();
    }
    return nombre.substring(0, 2).toUpperCase();
}

// Función para pintar las tarjetas en el grid
function renderizarTarjetasPermisosSis(empleados) {
    const grid = document.getElementById('grid-permisos-empleados');
    if (!grid) return;

    if (!empleados || empleados.length === 0) {
        grid.innerHTML = `<div class="col-span-full p-8 text-center text-stone-400 bg-white rounded-2xl border border-stone-200 shadow-sm">No se encontraron colaboradores registrados.</div>`;
        return;
    }

    let html = "";
    empleados.forEach(emp => {
        const numEmp = emp.numEmp || emp.noEmp || emp.NO_EMP || emp.NumEmp || "";
        const nombre = emp.nombre || emp.NOMBRE || "SIN NOMBRE";
        const puesto = emp.puesto || emp.PUESTO || emp.NumPto || "SIN PUESTO";
        const depto = emp.depto || emp.DEPARTAMENTO || emp.NomCorDep || "";
        const rol = emp.rol || emp.ROL || "Usuario";
        const iniciales = obtenerInicialesNombre(nombre);

        html += `
            <div class="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm flex items-center justify-between gap-3 hover:border-stone-300 transition-all">
                <div class="flex items-center gap-3.5 overflow-hidden">
                    <div class="w-11 h-11 rounded-full bg-emerald-50 border border-emerald-100 text-[#249444] font-bold text-xs flex items-center justify-center shrink-0">
                        ${iniciales}
                    </div>
                    <div class="overflow-hidden">
                        <h4 class="text-xs font-bold text-stone-800 truncate uppercase" title="${nombre}">${nombre}</h4>
                        <p class="text-[11px] text-stone-500 truncate uppercase" title="${puesto}">${puesto}</p>
                        ${depto && depto !== 'N/A' ? `<p class="text-[10px] text-stone-400 truncate uppercase mt-0.5">${depto}</p>` : ''}
                        <span class="inline-block mt-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                            Rol: ${rol}
                        </span>
                    </div>
                </div>
                <button type="button" onclick="abrirMatrizPermisosUsuario('${nombre.replace(/'/g, "\\'")}', '${numEmp}')" class="shrink-0 bg-stone-50 hover:bg-stone-100 border border-stone-200 text-stone-700 text-xs font-bold px-3 py-2 rounded-xl transition-all flex items-center gap-1.5">
                    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v4"/><path d="m16.2 7.8 2.9-2.9"/><path d="M18 12h4"/><path d="m16.2 16.2 2.9 2.9"/><path d="M12 18v4"/><path d="m4.9 19.1 2.9-2.9"/><path d="M2 12h4"/><path d="m4.9 4.9 2.9 2.9"/></svg>
                    Permisos
                </button>
            </div>
        `;
    });

    grid.innerHTML = html;
}

// Función para filtrar el grid en tiempo real
function filtrarTarjetasPermisosSis() {
    const filtro = document.getElementById('input-buscar-permisos').value.toUpperCase().trim();
    const lista = window.listaEmpleadosPermisosCache || [];
    
    if (!filtro) {
        renderizarTarjetasPermisosSis(lista);
        return;
    }

    const filtrados = lista.filter(emp => {
        const texto = `${emp.numEmp || ''} ${emp.noEmp || ''} ${emp.nombre || ''} ${emp.puesto || ''} ${emp.NumPto || ''} ${emp.depto || ''} ${emp.NomCorDep || ''} ${emp.centro || ''}`.toUpperCase();
        return texto.includes(filtro);
    });

    renderizarTarjetasPermisosSis(filtrados);
}

// Asegurar que el enrutador principal de tu app llame a esta función al hacer clic en la opción de permisos
window.renderizarListadoPermisosSis = renderizarListadoPermisosSis;