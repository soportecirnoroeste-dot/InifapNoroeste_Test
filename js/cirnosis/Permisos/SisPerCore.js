// ==========================================
// MÓDULO DE PERMISOS - SISPER CORE
// ==========================================

function renderizarListadoPermisosSis() {
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
        contenedorDinamico.className = "w-full space-y-6 bg-white p-6 md:p-8 rounded-2xl soft-shadow border border-[#249444]/10 mb-8 animate-fade-in";
        contenedorDinamico.innerHTML = `
            <div class="flex items-center gap-3 pb-4 border-b border-stone-100">
                <div class="p-2.5 bg-[#f0fdf4] border border-[#c6f6d5] text-[#059669] rounded-xl flex items-center justify-center">
                    <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' class='lucide lucide-user-round-key'><path d='M19 11v6'/><path d='M19 13h2'/><path d='M2 21a8 8 0 0 1 12.868-6.349'/><circle cx='10' cy='8' r='5'/><circle cx='19' cy='19' r='2'/></svg>
                </div>
                <div>
                    <h3 class="font-black text-stone-800 text-lg uppercase tracking-wide">Permisos</h3>
                </div>
            </div>

            <div id="contenedor-gestion-permisos" class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-stone-50 p-4 rounded-xl border border-stone-200">
                <div>
                    <h4 class="font-bold text-stone-800 text-sm">Gestión de Permisos por Colaborador</h4>
                </div>
                <div class="flex gap-2">
                    <button type="button" onclick="actualizarDatosPermisosSis()" class="px-4 py-2 bg-stone-200 text-stone-700 rounded-xl text-xs font-bold hover:bg-stone-300 transition flex items-center gap-2 cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 21h5v-5"/></svg>
                        Actualizar Datos
                    </button>
                </div>
            </div>

            <div id="contenedor-listado-permisos" class="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-sm">
                <div class="p-4 border-b border-stone-100 flex flex-wrap justify-between items-center gap-4 bg-white">
                    <div class="font-bold text-xs text-stone-700 uppercase tracking-wider">Listado General de Empleados</div>
                    
                    <div class="relative">
                        <span class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-stone-400">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                        </span>
                        <input type="text" id="input-buscar-permisos" oninput="filtrarTarjetasPermisosSis()" placeholder="Buscar por nombre, puesto, centro..." 
                            class="w-64 sm:w-72 pl-9 pr-4 py-1.5 bg-stone-50 border border-stone-200 rounded-lg text-xs outline-none focus:ring-2 focus:ring-[#249444] text-stone-700 transition-all shadow-xs uppercase">
                    </div>
                </div>
                
                <div class="rounded-xl bg-white">
                    <div class="max-h-[500px] overflow-y-auto overflow-x-auto custom-scrollbar">
                        <table class="w-full text-left border-collapse text-xs min-w-[950px]">
                            <thead class="bg-stone-100 font-bold text-stone-700 sticky top-0 z-10 border-b border-stone-200">
                                <tr>
                                    <th class="p-3 border-b border-stone-200">REG</th>
                                    <th class="p-3 border-b border-stone-200">CENTRO</th>
                                    <th class="p-3 border-b border-stone-200">NO. EMP</th>
                                    <th class="p-3 border-b border-stone-200">NOMBRE</th>
                                    <th class="p-3 border-b border-stone-200">PUESTO</th>
                                    <th class="p-3 border-b border-stone-200">DEPARTAMENTO</th>
                                </tr>
                            </thead>
                            <tbody id="grid-permisos-empleados" class="divide-y divide-stone-100">
                                <tr><td colspan="6" class="p-6 text-center text-stone-400 italic">Cargando registros...</td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
        
        cargarDatosPermisosConCatalogos();
    }
}

async function cargarDatosPermisosConCatalogos() {
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
                <td class="p-3 font-mono text-stone-600">${reg}</td>
                <td class="p-3 font-mono text-stone-600">${centro}</td>
                <td class="p-3 font-mono text-stone-600">${numEmp}</td>
                <td class="p-3 font-bold text-[#249444] uppercase">
                    <button type="button" onclick="abrirMatrizPermisosUsuario('${nombre.replace(/'/g, "\\'")}', '${numEmp}')" class="hover:underline text-left cursor-pointer focus:outline-none">
                        ${nombre}
                    </button>
                </td>
                <td class="p-3 text-stone-600 uppercase">${puestoVisual}</td>
                <td class="p-3 text-stone-600 uppercase">${deptoVisual || 'N/A'}</td>
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


// ==========================================
// LÓGICA DE NEGOCIO Y TESTIGOS (AUTÓNOMA)
// ==========================================
async function cargarYMarcarPermisosColaborador(noEmp) {
    try {
        console.group(`🚀 [TESTIGO 1] Iniciando carga de permisos para empleado: ${noEmp}`);
        
        let permisosMap = {};
        if (typeof FetchAPI === 'function') {
            console.log("📡 [TESTIGO 2] Llamando a FetchAPI('obtenerPermisosColaborador')...");
            permisosMap = await FetchAPI('obtenerPermisosColaborador', { numEmp: noEmp });
        } else if (typeof google !== 'undefined' && google.script && google.script.run) {
            console.log("📡 [TESTIGO 2-B] Llamando a google.script.run...");
            permisosMap = await new Promise((resolve, reject) => {
                google.script.run
                    .withSuccessHandler(resolve)
                    .withFailureHandler(reject)
                    .obtenerPermisosColaborador({ numEmp: noEmp });
            });
        }

        console.log("📥 [TESTIGO 3] Objeto completo recibido del backend:", permisosMap);

        if (!permisosMap || Object.keys(permisosMap).length === 0) {
            console.warn("⚠️ [TESTIGO 4] El mapa de permisos llegó vacío o sin datos para este empleado.");
            console.groupEnd();
            return;
        }

        // Damos tiempo a que el DOM pinte las filas de la matriz
        setTimeout(() => {
            const filas = document.querySelectorAll('tr');
            console.log(`🔍 [TESTIGO 5] Total de filas <tr> encontradas en pantalla: ${filas.length}`);

            if (filas.length === 0) {
                console.error("❌ [ERROR TESTIGO] No se encontró ninguna etiqueta <tr> en la interfaz. La tabla no está renderizada.");
            }

            filas.forEach((fila, index) => {
                const textoFila = fila.innerText ? fila.innerText.toUpperCase().trim() : "";
                
                let sModClaveMatch = null;
                if (textoFila.includes("↳ PERMISOS")) sModClaveMatch = "1";
                else if (textoFila.includes("↳ LICENCIAS")) sModClaveMatch = "2";
                else if (textoFila.includes("↳ DOCUMENTOS")) sModClaveMatch = "3";
                else if (textoFila.includes("↳ CONFIGURACIÓN DE MENÚ")) sModClaveMatch = "4";
                else if (textoFila.includes("↳ FORMATOS DE OF.")) sModClaveMatch = "5";

                if (sModClaveMatch) {
                    const checkboxes = fila.querySelectorAll('input[type="checkbox"]');
                    console.log(`📋 [TESTIGO 6] Fila ${index} detectada -> Submódulo Clave: ${sModClaveMatch} | Checkboxes encontrados: ${checkboxes.length}`);

                    // Buscamos dentro del departamento "7" (Sistemas) que es el de las capturas
                    const deptoSistemas = permisosMap["7"] || permisosMap[Object.keys(permisosMap)[0]] || {};
                    const permisosSub = deptoSistemas[sModClaveMatch];

                    console.log(`🔑 [TESTIGO 7] Datos buscados para depto '7', submódulo '${sModClaveMatch}':`, permisosSub);

                    if (permisosSub && checkboxes.length >= 3) {
                        console.log(`✨ [TESTIGO 8] ¡Marcando casillas! Ver: ${permisosSub.ver}, Editar: ${permisosSub.editar}, Eliminar: ${permisosSub.eliminar}`);

                        checkboxes[0].checked = (permisosSub.ver === 1);
                        checkboxes[1].checked = (permisosSub.editar === 1);
                        checkboxes[2].checked = (permisosSub.eliminar === 1);
                    } else {
                        console.warn(`⚠️ [TESTIGO 9] No se pudieron marcar los checks para el submódulo ${sModClaveMatch}. Faltan datos o checkboxes.`);
                    }
                }
            });

            console.log("🏁 [TESTIGO 10] Proceso de marcado por testigos finalizado.");
            console.groupEnd();
        }, 800);

    } catch (err) {
        console.error("❌ [ERROR CRÍTICO EN TESTIGOS]:", err);
        console.groupEnd();
    }
}

// Interceptor automático: Envuelve la función global existente para que se ejecute sola al hacer clic en un empleado
const _originalAbrirMatriz = window.abrirMatrizPermisosUsuario;
window.abrirMatrizPermisosUsuario = function(nombre, numEmp) {
    console.log(`🎯 [INTERCEPTOR] Se abrió la matriz para: ${nombre} (${numEmp})`);
    if (typeof _originalAbrirMatriz === 'function') {
        _originalAbrirMatriz(nombre, numEmp);
    }
    cargarYMarcarPermisosColaborador(numEmp);
};

// ==========================================
// EXPORTACIÓN GLOBAL EN WINDOW
// ==========================================
window.renderizarListadoPermisosSis = renderizarListadoPermisosSis;
window.cargarPermisosSis = cargarPermisosSis;
window.actualizarDatosPermisosSis = actualizarDatosPermisosSis;
window.cargarYMarcarPermisosColaborador = cargarYMarcarPermisosColaborador;

// Función para manejar la selección en cascada de los checkboxes en pantalla
document.addEventListener('change', function(e) {
    if (!e.target.classList.contains('chk-permiso')) return;

    const chk = e.target;
    const tipo = chk.getAttribute('data-tipo'); // 'ver', 'editar', 'eliminar'
    
    // Encontramos la fila contenedora de este submódulo para manipular sus hermanos
    const fila = chk.closest('tr') || chk.closest('.permiso-row');
    if (!fila) return;

    const chkVer = fila.querySelector('[data-tipo="ver"]');
    const chkEditar = fila.querySelector('[data-tipo="editar"]');
    const chkEliminar = fila.querySelector('[data-tipo="eliminar"]');

    if (tipo === 'eliminar' && chk.checked) {
        if (chkEditar) chkEditar.checked = true;
        if (chkVer) chkVer.checked = true;
    } else if (tipo === 'editar' && chk.checked) {
        if (chkVer) chkVer.checked = true;
    } else if (tipo === 'ver' && !chk.checked) {
        // Si desmarca 'ver', por lógica se apagan los superiores
        if (chkEditar) chkEditar.checked = false;
        if (chkEliminar) chkEliminar.checked = false;
    }
});