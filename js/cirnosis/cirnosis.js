// ==========================================
// CONFIGURACIÓN DINÁMICA DEL MÓDULO CIRNOSIS
// ==========================================
window.cirnosisConfig = {
    deptoKey: "cirnosis",
    claveDep: "7", // Clave numérica para buscar en la pestaña SubModulo de Sheets[cite: 8]
    subtitle: "Gestión de infraestructura tecnológica, redes y soporte técnico.",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-file-terminal"><path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"/><path d="M14 2v5a1 1 0 0 0 1 1h5"/><path d="m8 16 2-2-2-2"/><path d="M12 18h4"/></svg>`,
    
    // Hacemos que 'options' actúe como un evaluador dinámico para que el router.js no falle
    get options() {
        if (!window.allSubModulosData) return [];
        
        return window.allSubModulosData
            .filter(item => String(item.ClaveDep) === String(this.claveDep))
            .map(sub => ({
                id: String(sub.SModClave),
                title: sub.SModNom,
                icon: "<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><rect width='18' height='18' x='3' y='3' rx='2'/></svg>",
                action: `manejarAccionSeccionSis('${sub.SModClave}')`
            }));
    }
};

// ==========================================
// FUNCIONES DE ACCIÓN Y CARGA DE SECCIONES
// ==========================================
function obtenerContenedor() {
    return document.getElementById('app-container') || document.querySelector('main') || document.body;
}

function manejarAccionSeccionSis(idOpt) {
    const urlParams = new URLSearchParams(window.location.search);
    const deptoActual = urlParams.get('depto') || 'cirnosis';
    const nuevaUrl = `main.html?depto=${deptoActual}&seccion=${idOpt}`;

    window.history.pushState({ seccion: idOpt }, '', nuevaUrl);
    sessionStorage.setItem('submodulo_activo_cirnosis', idOpt);
    ejecutarCargaSeccionSis(idOpt);
}

function ejecutarCargaSeccionSis(idOpt) {
    // Si la sección es 'permisos', abrimos la gestión de permisos
    if (idOpt === 'permisos' || idOpt === '6') { // Ajusta según tu ID de permisos en Sheets
        cargarPermisosSis();
    } else {
        // Para cualquier otro submódulo leído del Sheets, renderizamos su vista genérica o específica
        const configDepto = window.cirnosisConfig;
        const opciones = configDepto.getOptions ? configDepto.getOptions() : [];
        const optEncontrada = opciones.find(o => o.id === String(idOpt));
        
        renderizarVistaModuloSis(idOpt, optEncontrada ? optEncontrada.title : "Módulo del sistema.");
    }
}

function limpiarSeccionUrlSis() {
    sessionStorage.removeItem('submodulo_activo_cirnosis');
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('seccion')) {
        const deptoActual = urlParams.get('depto') || 'cirnosis';
        const nuevaUrl = `main.html?depto=${deptoActual}`;
        window.history.replaceState({}, '', nuevaUrl);
    }
}

// PUENTE: Conecta el menú con la lógica avanzada de permisos
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
        
        const urlParams = new URLSearchParams(window.location.search);
        const deptoActual = urlParams.get('depto') || 'cirnosis';
        const configDepto = window[deptoActual + 'Config'];
        const claveDepBuscada = configDepto ? configDepto.claveDep : "7";

        let filasHTML = "";

        // Lee directamente los submódulos de la pestaña "SubModulo" de Sheets según la ClaveDep
        const submodulosDelDepto = window.allSubModulosData 
            ? window.allSubModulosData.filter(item => String(item.ClaveDep) === String(claveDepBuscada)) 
            : [];

        if (submodulosDelDepto.length > 0) {
            filasHTML += `
                <tr class="bg-stone-50 font-bold text-stone-800 border-t border-stone-200">
                    <td class="p-3 pl-4 uppercase tracking-wider" colspan="4">📁 Submódulos desde Google Sheets (ClaveDep: ${claveDepBuscada})</td>
                </tr>
            `;

            submodulosDelDepto.forEach((sub) => {
                filasHTML += `
                    <tr class="hover:bg-stone-50 transition-all border-b border-stone-100">
                        <td class="p-3 pl-8 font-medium text-stone-600 flex items-center gap-2">
                            <span class="w-5 h-5 flex items-center justify-center text-stone-400">↳</span>
                            ${sub.SModNom}
                        </td>
                        <td class="p-3 text-center"><input type="checkbox" data-smod="${sub.SModClave}" data-tipo="ver" class="accent-[#249444] w-4 h-4 cursor-pointer chk-permiso" checked></td>
                        <td class="p-3 text-center"><input type="checkbox" data-smod="${sub.SModClave}" data-tipo="editar" class="accent-[#249444] w-4 h-4 cursor-pointer chk-permiso" checked></td>
                        <td class="p-3 text-center pr-4"><input type="checkbox" data-smod="${sub.SModClave}" data-tipo="eliminar" class="accent-[#249444] w-4 h-4 cursor-pointer chk-permiso"></td>
                    </tr>
                `;
            });
        } else {
            filasHTML = `<tr><td colspan="4" class="p-4 text-center text-xs text-stone-400">No se encontraron submódulos en Google Sheets para la ClaveDep: ${claveDepBuscada}</td></tr>`;
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
        sessionStorage.setItem('submodulo_activo_cirnosis', seccion);

        if (typeof window.actualizarBotonRegresar === 'function') {
            window.actualizarBotonRegresar('submodulo', depto);
        }

        ejecutarCargaSeccionSis(seccion);
    } else {
        sessionStorage.removeItem('submodulo_activo_cirnosis');

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