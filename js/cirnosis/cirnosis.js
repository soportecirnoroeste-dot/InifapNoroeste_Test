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
                    Mostrando personal activo del sistema
                </div>
            </div>

            <div id="grid-permisos-empleados" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div class="col-span-full p-8 text-center text-stone-400 italic bg-white rounded-2xl border border-stone-200 shadow-sm">
                    Sincronizando colaboradores desde Google Sheets...
                </div>
            </div>
        `;

        // Cargar catálogos y datos utilizando la misma estructura que RH
        cargarDatosPermisosConCatalogos();
    }
}

async function cargarDatosPermisosConCatalogos() {
    const grid = document.getElementById('grid-permisos-empleados');

    try {
        // 1. Asegurarnos de tener los catálogos cargados (igual que en RhPerCore)
        if (!window._catPuestos || window._catPuestos.length === 0 || !window._catDepartamentos || window._catDepartamentos.length === 0) {
            const dataSys = await FetchAPI('obtenerDatosSistema', {});
            window._catDepartamentos = dataSys.departamentos || dataSys.deptos || [];
            window._catPuestos = dataSys.puestos || dataSys.catPuestos || [];
        }

        // 2. Obtener el personal (sincronizado con la caché general o consultando la API)
        let data = window._empleadosCache || [];
        if (!data || data.length === 0) {
            data = await FetchAPI('obtenerPersonal');
            window._empleadosCache = data || [];
        }

        window.listaEmpleadosPermisosCache = window._empleadosCache;
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

// Función para pintar las tarjetas con nombres de puestos y departamentos cruzados correctamente
function renderizarTarjetasPermisosSis(empleados) {
    const grid = document.getElementById('grid-permisos-empleados');
    if (!grid) return;

    if (!empleados || empleados.length === 0) {
        grid.innerHTML = `<div class="col-span-full p-8 text-center text-stone-400 bg-white rounded-2xl border border-stone-200 shadow-sm">No se encontraron colaboradores registrados.</div>`;
        return;
    }

    // Construir mapas de catálogos si no existen (idéntico a RhPerCore)
    if (!window._mapPuestosCache && window._catPuestos && Array.isArray(window._catPuestos)) {
        window._mapPuestosCache = {};
        window._catPuestos.forEach(p => {
            const k = String(p.NumPto || p.numPto || p.clave || '').trim();
            const v = p.NomPto || p.nomPto || p.nombre || '';
            if (k) window._mapPuestosCache[k] = v;
        });
    }

    if (!window._mapDeptosCache && window._catDepartamentos && Array.isArray(window._catDepartamentos)) {
        window._mapDeptosCache = {};
        window._catDepartamentos.forEach(d => {
            const nomCor = String(d.nomCorDep || '').trim();
            const cDep = String(d.claveDep || '').trim();
            const nomLargo = d.nomDep || d.nombre || '';
            if (nomCor) window._mapDeptosCache[nomCor] = nomLargo;
            if (cDep) window._mapDeptosCache[cDep] = nomLargo;
        });
    }

    let html = "";
    empleados.forEach(emp => {
        const numEmp = String(emp.numEmp || emp.noEmp || emp.NO_EMP || emp.NumEmp || '').trim();
        const nombre = emp.nombre || emp.NOMBRE || "SIN NOMBRE";
        
        // Resolver Puesto mediante catálogo
        const cNumPto = String(emp.NumPto || emp.numPto || emp.puesto || '').trim();
        let puestoVisual = cNumPto;
        if (cNumPto) {
            if (window._mapPuestosCache && window._mapPuestosCache[cNumPto]) {
                puestoVisual = window._mapPuestosCache[cNumPto];
            } else if (Array.isArray(window._catPuestos)) {
                const encontrado = window._catPuestos.find(p => String(p.NumPto || p.numPto || '').trim() === cNumPto);
                if (encontrado) puestoVisual = encontrado.NomPto || encontrado.nomPto || encontrado.nombre || cNumPto;
            }
        }

        // Resolver Departamento mediante catálogo
        const cNomCorDep = String(emp.NomCorDep || emp.nomCorDep || emp.depto || '').trim();
        let deptoVisual = cNomCorDep;
        if (cNomCorDep) {
            if (window._mapDeptosCache && window._mapDeptosCache[cNomCorDep]) {
                deptoVisual = window._mapDeptosCache[cNomCorDep];
            } else if (Array.isArray(window._catDepartamentos)) {
                const encontrado = window._catDepartamentos.find(d => 
                    String(d.nomCorDep || '').trim().toUpperCase() === cNomCorDep.toUpperCase() ||
                    String(d.claveDep || '').trim() === cNomCorDep
                );
                if (encontrado) deptoVisual = encontrado.nomDep || encontrado.nombre || cNomCorDep;
            }
        }

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
                        <p class="text-[11px] text-stone-500 truncate uppercase" title="${puestoVisual}">${puestoVisual}</p>
                        ${deptoVisual && deptoVisual !== 'N/A' ? `<p class="text-[10px] text-stone-400 truncate uppercase mt-0.5" title="${deptoVisual}">${deptoVisual}</p>` : ''}
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
    const filtro = document.getElementById('input-buscar-permisos').value.toUpperCase().traducir?.() || document.getElementById('input-buscar-permisos').value.toUpperCase().trim();
    const lista = window.listaEmpleadosPermisosCache || [];
    
    if (!filtro) {
        renderizarTarjetasPermisosSis(lista);
        return;
    }

    const filtrados = lista.filter(emp => {
        const texto = `${emp.numEmp || ''} ${emp.noEmp || ''} ${emp.nombre || ''} ${emp.NumPto || ''} ${emp.NomCorDep || ''}`.toUpperCase();
        return texto.includes(filtro);
    });

    renderizarTarjetasPermisosSis(filtrados);
}

// Funciones de control de vista
function cargarPermisosSis() {
    if (typeof window.renderizarListadoPermisosSis === 'function') {
        window.renderizarListadoPermisosSis();
    }
}

function actualizarDatosPermisosSis() {
    cargarPermisosSis();
}

window.renderizarListadoPermisosSis = renderizarListadoPermisosSis;
window.cargarPermisosSis = cargarPermisosSis;
window.actualizarDatosPermisosSis = actualizarDatosPermisosSis;