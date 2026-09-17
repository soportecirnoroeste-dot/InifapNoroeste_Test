// js/SisPer/SisPerCore.js

function renderizarListadoPermisosSis() {
    console.log("1. Entrando a renderizarListadoPermisosSis (Modo Tabla)");

    if (typeof renderizarVistaModuloSis === 'function') {
        try {
            renderizarVistaModuloSis('permisos', "Selecciona un colaborador para administrar su matriz de accesos por módulos y submódulos.");
        } catch (e) {
            console.warn("renderizarVistaModuloSis lanzó un aviso...", e);
        }
    }
    
    let contenedorDinamico = document.getElementById('contenido-submodulo-dinamico');
    
    if (!contenedorDinamico) {
        const areaTrabajo = document.getElementById('app-container') || document.querySelector('main') || document.body;
        if (areaTrabajo) {
            contenedorDinamico = document.createElement('div');
            contenedorDinamico.id = 'contenido-submodulo-dinamico';
            areaTrabajo.appendChild(contenedorDinamico);
        }
    }

    if (contenedorDinamico) {
        contenedorDinamico.className = "space-y-6 animate-fade-in w-full p-4";
        contenedorDinamico.innerHTML = `
            <!-- Barra superior estilo Vista 2 -->
            <div class="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4">
                <div class="font-bold text-stone-700 text-sm uppercase tracking-wide">
                    Gestión de Permisos por Colaborador
                </div>
                <div class="flex items-center gap-2 w-full sm:w-auto justify-end">
                    <button type="button" onclick="actualizarDatosPermisosSis()" class="bg-stone-50 hover:bg-stone-100 border border-stone-200 text-stone-700 text-xs font-bold px-4 py-2.5 rounded-xl transition-all flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 21h5v-5"/></svg>
                        Actualizar Datos
                    </button>
                </div>
            </div>

            <!-- Contenedor principal de la tabla -->
            <div class="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
                <div class="p-4 border-b border-stone-100 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div class="font-bold text-xs text-stone-500 uppercase tracking-wider">
                        Listado General de Empleados
                    </div>
                    <div class="w-full sm:w-80">
                        <input type="text" id="input-buscar-permisos" placeholder="BUSCAR POR NOMBRE, PUESTO, CENTRO..." onkeyup="filtrarTarjetasPermisosSis()" class="w-full bg-stone-50 border border-stone-200 text-xs rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#249444] uppercase">
                    </div>
                </div>

                <div class="overflow-x-auto">
                    <table class="w-full text-left border-collapse">
                        <thead>
                            <tr class="bg-stone-50 border-b border-stone-200 text-[11px] font-bold text-stone-500 uppercase">
                                <th class="p-3.5 pl-6">Reg</th>
                                <th class="p-3.5">Centro</th>
                                <th class="p-3.5">No. Emp</th>
                                <th class="p-3.5">Nombre</th>
                                <th class="p-3.5">Puesto</th>
                                <th class="p-3.5">Departamento</th>
                                <th class="p-3.5 pr-6 text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody id="grid-permisos-empleados" class="divide-y divide-stone-100 text-xs text-stone-700">
                            <tr>
                                <td colspan="7" class="p-8 text-center text-stone-400 italic">
                                    Sincronizando colaboradores desde Google Sheets...
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        `;
        
        cargarDatosPermisosConCatalogos();
    } else {
        console.error("❌ Error crítico: No se pudo ubicar ningún contenedor base en el DOM.");
    }
}

async function cargarDatosPermisosConCatalogos() {
    console.log("5. Entrando a cargarDatosPermisosConCatalogos");
    const tbody = document.getElementById('grid-permisos-empleados');

    try {
        if (!window._catPuestos || window._catPuestos.length === 0 || !window._catDepartamentos || window._catDepartamentos.length === 0) {
            const dataSys = await FetchAPI('obtenerDatosSistema', {});
            window._catDepartamentos = dataSys.departamentos || dataSys.deptos || [];
            window._catPuestos = dataSys.puestos || dataSys.catPuestos || [];
        }

        let data = window._empleadosCache || [];
        if (!data || data.length === 0) {
            data = await FetchAPI('obtenerPersonal');
            window._empleadosCache = data || [];
        }

        window.listaEmpleadosPermisosCache = window._empleadosCache;
        renderizarTarjetasPermisosSis(window.listaEmpleadosPermisosCache);

    } catch (err) {
        console.error("❌ Error en carga:", err);
        if (tbody) {
            tbody.innerHTML = `<tr><td colspan="7" class="p-6 text-center text-red-500">Error al conectar con Sheets: ${err.message || 'Error de red'}</td></tr>`;
        }
    }
}

function renderizarTarjetasPermisosSis(empleados) {
    const tbody = document.getElementById('grid-permisos-empleados');
    if (!tbody) return;

    if (!empleados || empleados.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" class="p-8 text-center text-stone-400">No se encontraron colaboradores registrados en Google Sheets.</td></tr>`;
        return;
    }

    // Mapeos de catálogos
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
        const reg = emp.reg || emp.REG || "100 - CIRNO";
        const centro = emp.centro || emp.CENTRO || "108 - DIRECCION";
        const numEmp = String(emp.numEmp || emp.noEmp || emp.NO_EMP || emp.NumEmp || '').trim();
        const nombre = emp.nombre || emp.NOMBRE || "SIN NOMBRE";
        
        const cNumPto = String(emp.NumPto || emp.numPto || emp.puesto || '').trim();
        let puestoVisual = cNumPto;
        if (cNumPto && window._mapPuestosCache && window._mapPuestosCache[cNumPto]) {
            puestoVisual = window._mapPuestosCache[cNumPto];
        }

        const cNomCorDep = String(emp.NomCorDep || emp.nomCorDep || emp.depto || '').trim();
        let deptoVisual = cNomCorDep;
        if (cNomCorDep && window._mapDeptosCache && window._mapDeptosCache[cNomCorDep]) {
            deptoVisual = window._mapDeptosCache[cNomCorDep];
        }

        html += `
            <tr class="hover:bg-stone-50/80 transition-all border-b border-stone-100">
                <td class="p-3.5 pl-6 font-medium text-stone-600">${reg}</td>
                <td class="p-3.5 text-stone-600">${centro}</td>
                <td class="p-3.5 font-semibold text-stone-800">${numEmp}</td>
                <td class="p-3.5 font-bold text-[#249444] uppercase">${nombre}</td>
                <td class="p-3.5 text-stone-600 uppercase">${puestoVisual}</td>
                <td class="p-3.5 text-stone-600 uppercase">${deptoVisual || 'N/A'}</td>
                <td class="p-3.5 pr-6 text-center">
                    <button type="button" onclick="abrirMatrizPermisosUsuario('${nombre.replace(/'/g, "\\'")}', '${numEmp}')" class="bg-stone-50 hover:bg-stone-100 border border-stone-200 text-stone-700 text-xs font-bold px-3 py-1.5 rounded-xl transition-all inline-flex items-center gap-1.5 shadow-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v4"/><path d="m16.2 7.8 2.9-2.9"/><path d="M18 12h4"/><path d="m16.2 16.2 2.9 2.9"/><path d="M12 18v4"/><path d="m4.9 19.1 2.9-2.9"/><path d="M2 12h4"/><path d="m4.9 4.9 2.9 2.9"/></svg>
                        Permisos
                    </button>
                </td>
            </tr>
        `;
    });

    tbody.innerHTML = html;
}

function filtrarTarjetasPermisosSis() {
    const inputBusqueda = document.getElementById('input-buscar-permisos');
    if (!inputBusqueda) return;

    const filtro = inputBusqueda.value.toUpperCase().trim();
    const lista = window.listaEmpleadosPermisosCache || [];
    
    if (!filtro) {
        renderizarTarjetasPermisosSis(lista);
        return;
    }

    const filtrados = lista.filter(emp => {
        const texto = `${emp.reg || ''} ${emp.centro || ''} ${emp.numEmp || ''} ${emp.noEmp || ''} ${emp.nombre || ''} ${emp.NumPto || ''} ${emp.NomCorDep || ''}`.toUpperCase();
        return texto.includes(filtro);
    });

    renderizarTarjetasPermisosSis(filtrados);
}

function cargarPermisosSis() {
    if (typeof window.renderizarListadoPermisosSis === 'function') {
        window.renderizarListadoPermisosSis();
    }
}

function actualizarDatosPermisosSis() {
    window._empleadosCache = null; // Limpiar caché para forzar recarga fresca
    cargarPermisosSis();
}

window.renderizarListadoPermisosSis = renderizarListadoPermisosSis;
window.cargarPermisosSis = cargarPermisosSis;
window.actualizarDatosPermisosSis = actualizarDatosPermisosSis;