// ==========================================
// CONFIGURACIÓN OFICIAL DEL MÓDULO: SISTEMAS (cirnosis.js)
// ==========================================
window.cirnosisConfig = {
    deptoKey: "cirnosis",
    claveDep: "7", // Clave numérica exacta en la pestaña SubModulo de Google Sheets
    subtitle: "Gestión de infraestructura tecnológica, redes y soporte técnico.",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-file-terminal"><path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"/><path d="M14 2v5a1 1 0 0 0 1 1h5"/><path d="m8 16 2-2-2-2"/><path d="M12 18h4"/></svg>`,

    // HERENCIA DINÁMICA GENERALIZADA: 
    // Utiliza el motor central de appConfig para leer los submódulos directamente de Google Sheets.
    get options() {
        if (window.AppConfigUtils && typeof window.AppConfigUtils.crearOpcionesDinamicas === 'function') {
            return window.AppConfigUtils.crearOpcionesDinamicas(this.claveDep, this.deptoKey);
        }
        return [];
    }
};

// Alias global para compatibilidad con el router
window.cirnosis = window.cirnosisConfig;

// ==========================================
// FUNCIONES DE ACCIÓN Y CARGA DE SECCIONES
// ==========================================
function obtenerContenedor() {
    return document.getElementById('app-container') || document.querySelector('main') || document.body;
}

function manejarAccionSeccionSis(idOpt) {
    if (typeof window.manejarAccionSeccionGenerica === 'function') {
        window.manejarAccionSeccionGenerica(idOpt);
    } else {
        const urlParams = new URLSearchParams(window.location.search);
        const deptoActual = urlParams.get('depto') || 'cirnosis';
        const nuevaUrl = `main.html?depto=${deptoActual}&seccion=${idOpt}`;

        window.history.pushState({ seccion: idOpt }, '', nuevaUrl);
        sessionStorage.setItem(`submodulo_activo_${deptoActual}`, idOpt);
        ejecutarCargaSeccionSis(idOpt);
    }
}

function ejecutarCargaSeccionSis(idOpt) {
    if (idOpt === 'permisos' || idOpt === '6') { 
        cargarPermisosSis();
    } else {
        const configDepto = window.cirnosisConfig;
        const opciones = configDepto.options || [];
        const optEncontrada = opciones.find(o => o.id === String(idOpt));

        renderizarVistaModuloSis(idOpt, optEncontrada ? optEncontrada.title : "Módulo del sistema.");
    }
}

function limpiarSeccionUrlSis() {
    const urlParams = new URLSearchParams(window.location.search);
    const deptoActual = urlParams.get('depto') || 'cirnosis';
    sessionStorage.removeItem(`submodulo_activo_${deptoActual}`);
    
    if (urlParams.has('seccion')) {
        const nuevaUrl = `main.html?depto=${deptoActual}`;
        window.history.replaceState({}, '', nuevaUrl);
    }
}

function cargarPermisosSis() {
    if (typeof window.renderizarListadoPermisosSis === 'function') {
        if (typeof window.actualizarBotonRegresar === 'function') {
            const deptoActual = new URLSearchParams(window.location.search).get('depto') || 'cirnosis';
            window.actualizarBotonRegresar('submodulo', deptoActual);
        }
        window.renderizarListadoPermisosSis();
    } else {
        console.error("No se encontró la función renderizarListadoPermisosSis en SisPerCore.js");
    }
}

// ==========================================
// MATRIZ DE PERMISOS DINÁMICA (LEE DESDE GOOGLE SHEETS)
// ==========================================
function abrirMatrizPermisosUsuario(nombreColaborador, noEmp) {
    const contenedorDinamico = document.getElementById('contenido-submodulo-dinamico');
    if (contenedorDinamico) {
        contenedorDinamico.className = "col-span-1 sm:col-span-2 md:col-span-3 space-y-6 animate-fade-in";

        const configDepto = window.cirnosisConfig;
        const submodulosDelDepto = configDepto ? configDepto.options : [];

        let filasHTML = "";

        if (submodulosDelDepto.length > 0) {
            submodulosDelDepto.forEach(sub => {
                filasHTML += `
                    <tr class="hover:bg-stone-50/80 transition-colors border-b border-stone-100">
                        <td class="p-3 pl-4 font-semibold text-stone-800 flex items-center gap-2">
                            <span class="w-6 h-6 inline-flex items-center justify-center text-sky-600">${sub.icon}</span>
                            <span>${sub.title}</span>
                        </td>
                        <td class="p-3 text-center">
                            <input type="checkbox" class="permiso-ver rounded text-green-600 focus:ring-green-500" data-sub="${sub.id}">
                        </td>
                        <td class="p-3 text-center">
                            <input type="checkbox" class="permiso-editar rounded text-green-600 focus:ring-green-500" data-sub="${sub.id}">
                        </td>
                        <td class="p-3 text-center pr-4">
                            <input type="checkbox" class="permiso-eliminar rounded text-green-600 focus:ring-green-500" data-sub="${sub.id}">
                        </td>
                    </tr>
                `;
            });
        } else {
            filasHTML = `
                <tr>
                    <td colspan="4" class="p-4 text-center text-stone-500">No hay submódulos disponibles en Google Sheets para este departamento.</td>
                </tr>
            `;
        }

        contenedorDinamico.innerHTML = `
            <div class="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
                <div class="p-4 border-b border-stone-100 flex flex-wrap justify-between items-center gap-4 bg-white">
                    <div class="font-bold text-xs text-stone-700 uppercase tracking-wider"> 
                        <p class="text-xs text-stone-500">Editando permisos para: <span class="font-bold text-stone-800">${nombreColaborador}</span> (No. Empleado: ${noEmp})</p>
                    </div>
                </div>

                <div class="max-h-[500px] overflow-y-auto custom-scrollbar p-4">
                    <table class="w-full text-left border-collapse text-xs">
                        <thead class="sticky top-0 z-10 bg-stone-100">
                            <tr class="text-stone-600 font-bold border-b border-stone-200 text-[11px]">
                                <th class="p-3 pl-4">SUBMÓDULO (SHEETS)</th>
                                <th class="p-3 text-center">VER / LEER</th>
                                <th class="p-3 text-center">CREAR / EDITAR</th>
                                <th class="p-3 text-center pr-4">ELIMINAR</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-stone-100 text-stone-700">
                            ${filasHTML}
                        </tbody>
                    </table>
                </div>

                <div class="p-4 border-t border-stone-100 flex items-center gap-3 bg-stone-50/50">
                    <button onclick="guardarMatrizPermisosSis('${noEmp}')" class="bg-[#249444] hover:bg-[#1e7a37] text-white text-xs font-bold px-6 py-2.5 rounded-xl transition-all shadow-sm">
                        Guardar
                    </button>
                    <button onclick="cargarPermisosSis()" class="bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold px-6 py-2.5 rounded-xl transition-all">
                        Cancelar
                    </button>
                </div>
            </div>
        `;
    }
}

function renderizarVistaModuloSis(idOpt, tituloModulo) {
    const contenedor = obtenerContenedor();
    const nombreCortoActual = new URLSearchParams(window.location.search).get('depto') || 'cirnosis';

    if (contenedor) {
        if (typeof window.actualizarBotonRegresar === 'function') {
            window.actualizarBotonRegresar('submodulo', nombreCortoActual);
        }

        contenedor.innerHTML = `
            <section class="bg-white rounded-2xl p-6 md:p-8 soft-shadow border border-sky-500/10 mb-8 animate-fade-in">
                <div class="flex items-center gap-3 mb-6 pb-4 border-b border-stone-100">
                    <div class="p-2.5 bg-sky-50 border border-sky-100 text-sky-600 rounded-xl flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width='18' height='18' x='3' y='3' rx='2'/></svg>
                    </div>
                    <div>
                        <h3 class="font-black text-stone-800 text-lg uppercase tracking-wide">${tituloModulo}</h3>
                        <p class="text-xs text-stone-500">Módulo cargado dinámicamente desde Google Sheets.</p>
                    </div>
                </div>

                <div id="contenido-submodulo-dinamico" class="w-full space-y-6">
                    <div class="p-6 rounded-xl border border-dashed border-stone-200 bg-stone-50 text-center">
                        <p class="text-xs text-stone-500 font-medium">Área de trabajo para: ${tituloModulo}</p>
                    </div>
                </div>
            </section>
        `;
    }
}

// ==========================================
// CONTROLADOR MAESTRO DE NAVEGACIÓN Y HISTORIAL
// ==========================================
function procesarCargaInicialSeccionSis(event) {
    const urlParams = new URLSearchParams(window.location.search);

    const seccion = event && event.state && 'seccion' in event.state
        ? event.state.seccion
        : urlParams.get('seccion');

    const depto = urlParams.get('depto') || 'cirnosis';
    const contenedor = obtenerContenedor();

    if (seccion) {
        sessionStorage.setItem(`submodulo_activo_${depto}`, seccion);

        if (typeof window.actualizarBotonRegresar === 'function') {
            window.actualizarBotonRegresar('submodulo', depto);
        }

        ejecutarCargaSeccionSis(seccion);
    } else {
        sessionStorage.removeItem(`submodulo_activo_${depto}`);

        if (typeof window.actualizarBotonRegresar === 'function') {
            window.actualizarBotonRegresar('principal', depto);
        }

        if (contenedor) {
            contenedor.innerHTML = '';
        }
        if (typeof window.cargarMenuDepartamento === 'function') {
            window.cargarMenuDepartamento();
        } else if (typeof window.restaurarMenuDepto === 'function') {
            window.restaurarMenuDepto(depto);
        }
    }

    if (contenedor) {
        contenedor.style.transition = 'opacity 0.2s ease-in';
        contenedor.style.opacity = '1';
        contenedor.style.visibility = 'visible';
    }
}

// ==========================================
// LISTENERS DE HISTORIAL Y ARRANQUE
// ==========================================
window.addEventListener('popstate', (event) => {
    procesarCargaInicialSeccionSis(event);
});

document.addEventListener('DOMContentLoaded', () => {
    procesarCargaInicialSeccionSis();
});