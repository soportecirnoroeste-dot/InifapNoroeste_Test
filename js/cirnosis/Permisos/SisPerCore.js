// js/SisPer/SisPerCore.js

function renderizarListadoPermisosSis() {
    console.log("1. Entrando a renderizarListadoPermisosSis (Contenedor Maestro Exacto)");

    if (typeof renderizarVistaModuloSis === 'function') {
        try {
            renderizarVistaModuloSis('permisos', "Selecciona un colaborador para administrar su matriz de accesos por módulos y submódulos.");
        } catch (e) {
            console.warn("renderizarVistaModuloSis lanzó un aviso...", e);
        }
    }
    
    // Ocultar menús de tarjetas principales previos si se quedan colgados
    const elementosPagina = document.querySelectorAll('div, section');
    elementosPagina.forEach(el => {
        if (el.innerText && el.innerText.includes("MENÚ DEL DEPARTAMENTO") && el.id !== 'contenido-submodulo-dinamico') {
            el.style.display = 'none';
        }
    });

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
        contenedorDinamico.style.display = 'block';
        // Contenedor principal idéntico al módulo Personal
        contenedorDinamico.className = "space-y-6 animate-fade-in w-full p-4 md:p-6 max-w-7xl mx-auto bg-white rounded-3xl border border-stone-200 shadow-sm";
        contenedorDinamico.innerHTML = `
            <!-- Encabezado del Módulo -->
            <div class="flex items-center gap-3 pb-2 border-b border-stone-100">
                <div class="p-2.5 bg-[#f0fdf4] border border-[#c6f6d5] text-[#059669] rounded-xl flex items-center justify-center">
                <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' class='lucide lucide-user-round-key'><path d='M19 11v6'/><path d='M19 13h2'/><path d='M2 21a8 8 0 0 1 12.868-6.349'/><circle cx='10' cy='8' r='5'/><circle cx='19' cy='19' r='2'/></svg>                </div>
                <h3 class="font-black text-stone-800 text-lg uppercase tracking-wide">Permisos</h3>
            </div>

            <!-- Barra de acciones -->
            <div class="bg-stone-50/50 p-4 rounded-2xl border border-stone-200/80 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div>
                    <h4 class="font-bold text-stone-800 text-sm">Gestión de Permisos</h4>
                </div>
                <div class="flex items-center gap-2 w-full sm:w-auto justify-end">
                    <button type="button" onclick="actualizarDatosPermisosSis()" class="bg-white hover:bg-stone-50 border border-stone-200 text-stone-700 text-xs font-bold px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 shadow-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 21h5v-5"/></svg>
                        Actualizar Datos
                    </button>
                </div>
            </div>

            <!-- Contenedor interno de la tabla -->
            <div class="rounded-2xl border border-stone-200 overflow-hidden bg-white">
                <div class="p-4 md:p-5 border-b border-stone-100 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div class="font-bold text-xs text-stone-500 uppercase tracking-wider pl-2">
                        Listado General de Empleados
                    </div>
                    <div class="w-full sm:w-80">
                        <div class="relative">
                            <span class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-stone-400">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                            </span>
                            <input type="text" id="input-buscar-permisos" placeholder="BUSCAR POR NOMBRE, PUESTO, CENTRO..." onkeyup="filtrarTarjetasPermisosSis()" class="w-full bg-stone-50 border border-stone-200 text-xs rounded-xl pl-9 pr-3.5 py-2.5 focus:outline-none focus:border-[#249444] uppercase">
                        </div>
                    </div>
                </div>

                <div class="overflow-x-auto">
                    <table class="w-full text-left border-collapse">
                        <thead>
                            <tr class="bg-stone-50 border-b border-stone-200 text-[11px] font-bold text-stone-500 uppercase">
                                <th class="py-3.5 px-6">Reg</th>
                                <th class="py-3.5 px-4">Centro</th>
                                <th class="py-3.5 px-4">No. Emp</th>
                                <th class="py-3.5 px-4">Nombre</th>
                                <th class="py-3.5 px-4">Puesto</th>
                                <th class="py-3.5 px-6">Departamento</th>
                            </tr>
                        </thead>
                        <tbody id="grid-permisos-empleados" class="divide-y divide-stone-100 text-xs text-stone-700">
                            <tr>
                                <td colspan="6" class="p-8 text-center text-stone-400 italic">
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
            tbody.innerHTML = `<tr><td colspan="6" class="p-6 text-center text-red-500">Error al conectar con Sheets: ${err.message || 'Error de red'}</td></tr>`;
        }
    }
}

function renderizarTarjetasPermisosSis(empleados) {
    const tbody = document.getElementById('grid-permisos-empleados');
    if (!tbody) return;

    if (!empleados || empleados.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" class="p-8 text-center text-stone-400">No se encontraron colaboradores registrados en Google Sheets.</td></tr>`;
        return;
    }

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
                <td class="py-3.5 px-6 font-medium text-stone-600">${reg}</td>
                <td class="py-3.5 px-4 text-stone-600">${centro}</td>
                <td class="py-3.5 px-4 font-semibold text-stone-800">${numEmp}</td>
                <td class="py-3.5 px-4 font-bold text-[#249444] uppercase">
                    <button type="button" onclick="abrirMatrizPermisosUsuario('${nombre.replace(/'/g, "\\'")}', '${numEmp}')" class="hover:underline text-left cursor-pointer focus:outline-none">
                        ${nombre}
                    </button>
                </td>
                <td class="py-3.5 px-4 text-stone-600 uppercase">${puestoVisual}</td>
                <td class="py-3.5 px-6 text-stone-600 uppercase">${deptoVisual || 'N/A'}</td>
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
    window._empleadosCache = null;
    cargarPermisosSis();
}

window.renderizarListadoPermisosSis = renderizarListadoPermisosSis;
window.cargarPermisosSis = cargarPermisosSis;
window.actualizarDatosPermisosSis = actualizarDatosPermisosSis;