// ==========================================
// PUENTES GLOBALES PARA EL ROUTER DE LA APP
// ==========================================
window.manejarAccionSeccion_cirnosis = function(idOpt) {
    manejarAccionSeccionSis(idOpt);
};

window.manejarAccionSeccionCirnosis = function(idOpt) {
    manejarAccionSeccionSis(idOpt);
};

// ==========================================
// CARGA INSTÁNTANEA CON CACHÉ Y RED EN SEGUNDO PLANO
// ==========================================
function cargarDatosDelSistema() {
    return new Promise((resolve) => {
        // 1. CARGA INMEDIATA DESDE CACHÉ (Velocidad de 0 milisegundos)
        let datosCacheados = { success: true, submodulos: [] };
        try {
            const cacheGuardada = localStorage.getItem('sistema_cache_datos');
            if (cacheGuardada) {
                datosCacheados = JSON.parse(cacheGuardada);
            }
        } catch (err) {}

        window.allSubModulosData = datosCacheados.submodulos || [];
        window.datosSistema = datosCacheados;

        // Pintar el menú al instante con los datos guardados
        if (typeof window.cargarMenuDepartamento === 'function') {
            window.cargarMenuDepartamento();
        }

        resolve(datosCacheados);

        // 2. SINCRONIZACIÓN EN SEGUNDO PLANO (No bloquea la pantalla al usuario)
        setTimeout(async () => {
            try {
                let respuesta = null;
                if (typeof window.FetchAPI === 'function') {
                    respuesta = await window.FetchAPI('obtenerDatosSistema');
                } else {
                    const response = await fetch("https://script.google.com/macros/s/AKfycbz1wzz5zC_6Cf4thUdl_5BkAca6m_MM7IWQyPwVAQcMaraPqfX8nBGMQpSdy31_tjz1Aw/exec", {
                        method: "POST",
                        redirect: "follow",
                        headers: { "Content-Type": "text/plain;charset=utf-8" },
                        body: JSON.stringify({ action: "obtenerDatosSistema" })
                    });
                    respuesta = await response.json();
                }

                if (respuesta && respuesta.success && respuesta.submodulos) {
                    window.allSubModulosData = respuesta.submodulos;
                    window.datosSistema = respuesta;
                    localStorage.setItem('sistema_cache_datos', JSON.stringify(respuesta));
                    
                    // Si hubo cambios en Sheets, actualiza el menú visualmente de forma imperceptible
                    if (typeof window.cargarMenuDepartamento === 'function') {
                        window.cargarMenuDepartamento();
                    }
                }
            } catch (e) {
                // Silencioso si no hay internet o falla la red, la caché sigue respondiendo
            }
        }, 100);
    });
}

// ==========================================
// CONFIGURACIÓN OFICIAL (DETECTADA POR EL ROUTER)
// ==========================================
window.cirnosisConfig = {
    deptoKey: "cirnosis",
    claveDep: "7", // Clave numérica para buscar en la pestaña SubModulo de Sheets
    subtitle: "Gestión de infraestructura tecnológica, redes y soporte técnico.",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-file-terminal"><path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"/><path d="M14 2v5a1 1 0 0 0 1 1h5"/><path d="m8 16 2-2-2-2"/><path d="M12 18h4"/></svg>`,

    get options() {
        if (window.AppConfigUtils && typeof window.AppConfigUtils.crearOpcionesDinamicas === 'function') {
            return window.AppConfigUtils.crearOpcionesDinamicas(this.claveDep, this.deptoKey);
        }

        const fuenteDatos = window.allSubModulosData || (window.datosSistema && window.datosSistema.submodulos);
        if (!fuenteDatos || !Array.isArray(fuenteDatos)) return [];

        const submodulosFiltrados = fuenteDatos.filter(item => {
            const dep = item.ClaveDep !== undefined ? item.ClaveDep : item.claveDep;
            return String(dep) === String(this.claveDep);
        });

        return submodulosFiltrados.map(sub => {
            const idSheet = String(sub.SModClave !== undefined ? sub.SModClave : sub.sModClave);
            const nombreSheet = String(sub.SModNom !== undefined ? sub.SModNom : sub.sModNom);
            const iconoSheet = sub.SModIcon !== undefined ? sub.SModIcon : (sub.sModIcon || sub.icono);
            const iconoPorDefecto = "<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><rect width='18' height='18' x='3' y='3' rx='2'/></svg>";

            return {
                id: idSheet,
                title: nombreSheet,
                icon: iconoSheet && iconoSheet.trim() !== "" ? iconoSheet : iconoPorDefecto,
                action: `manejarAccionSeccion_cirnosis('${idSheet}')`
            };
        });
    }
};

// Alias por si algún otro script busca directamente 'window.cirnosis'
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
    const configDepto = window.cirnosisConfig;
    const opciones = configDepto.options || [];
    const optEncontrada = opciones.find(o => o.id === String(idOpt));
    const tituloOpt = optEncontrada ? optEncontrada.title.toLowerCase() : '';

    // Detectar si es el submódulo de permisos por ID, clave o texto del título en Sheets
    if (idOpt === 'permisos' || idOpt === '6' || tituloOpt.includes('permiso')) { 
        cargarPermisosSis();
    } else {
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
// js/SisPer/SisPerForm.js - VERSIÓN DINÁMICA DEPARTAMENTOS Y SUBMÓDULOS
// ==========================================

function abrirMatrizPermisosUsuario(nombreColaborador, noEmp) {
    const contenedorDinamico = document.getElementById('contenido-submodulo-dinamico');
    if (contenedorDinamico) {
        contenedorDinamico.className = "col-span-1 sm:col-span-2 md:col-span-3 space-y-6 animate-fade-in";

        // Obtenemos los catálogos globales sincronizados desde Google Sheets
        const deptos = window._catDepartamentos || (window.datosSistema && window.datosSistema.departamentos) || [];
        const submodulos = window.allSubModulosData || (window.datosSistema && window.datosSistema.submodulos) || [];

        let filasHTML = "";

        if (deptos.length > 0 && submodulos.length > 0) {
            deptos.forEach(dep => {
                const cDep = String(dep.claveDep !== undefined ? dep.claveDep : dep.ClaveDep).trim();
                const nombreDep = dep.nomDep || dep.nombre || dep.NomDep || `Departamento ${cDep}`;

                // Filtramos los submódulos que pertenecen a este departamento
                const subsDelDepto = submodulos.filter(sub => {
                    const subDep = String(sub.ClaveDep !== undefined ? sub.ClaveDep : sub.claveDep).trim();
                    return subDep === cDep;
                });

                if (subsDelDepto.length > 0) {
                    filasHTML += `
                        <tr class="bg-stone-50 font-bold text-stone-800 border-t border-stone-200">
                            <td class="p-3 pl-4 uppercase tracking-wider" colspan="4">📁 Departamento: ${nombreDep}</td>
                        </tr>
                    `;

                    subsDelDepto.forEach(sub => {
                        const nombreSub = sub.SModNom !== undefined ? sub.SModNom : (sub.sModNom || sub.nombre || 'Submódulo');
                        const idSub = sub.SModClave !== undefined ? sub.SModClave : (sub.sModClave || sub.id || '');

                        filasHTML += `
                            <tr class="hover:bg-stone-50 transition-all border-b border-stone-100">
                                <td class="p-3 pl-8 font-medium text-stone-600 flex items-center gap-2">
                                    <span>↳ ${nombreSub}</span>
                                </td>
                                <td class="p-3 text-center"><input type="checkbox" data-depto="${cDep}" data-submodulo="${idSub}" data-tipo="ver" class="accent-[#249444] w-4 h-4 cursor-pointer chk-permiso"></td>
                                <td class="p-3 text-center"><input type="checkbox" data-depto="${cDep}" data-submodulo="${idSub}" data-tipo="editar" class="accent-[#249444] w-4 h-4 cursor-pointer chk-permiso"></td>
                                <td class="p-3 text-center pr-4"><input type="checkbox" data-depto="${cDep}" data-submodulo="${idSub}" data-tipo="eliminar" class="accent-[#249444] w-4 h-4 cursor-pointer chk-permiso"></td>
                            </tr>
                        `;
                    });
                }
            });
        }

        if (!filasHTML) {
            filasHTML = `
                <tr>
                    <td colspan="4" class="p-6 text-center text-stone-400">No se encontraron departamentos o submódulos sincronizados desde Google Sheets.</td>
                </tr>
            `;
        }

        contenedorDinamico.innerHTML = `
            <!-- Contenedor con el formato exacto de tarjeta institucional -->
            <div class="w-full space-y-6 bg-white p-6 md:p-8 rounded-2xl soft-shadow border border-[#249444]/10 mb-8 animate-fade-in">
                
                <div class="flex items-center gap-3 pb-4 border-b border-stone-100">
                    <div class="p-2.5 bg-[#f0fdf4] border border-[#c6f6d5] text-[#059669] rounded-xl flex items-center justify-center">
                        <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' class='lucide lucide-user-round-key'><path d='M19 11v6'/><path d='M19 13h2'/><path d='M2 21a8 8 0 0 1 12.868-6.349'/><circle cx='10' cy='8' r='5'/><circle cx='19' cy='19' r='2'/></svg>
                    </div>
                    <div>
                        <h3 class="font-black text-stone-800 text-lg uppercase tracking-wide">Permisos</h3>
                    </div>
                </div>

                <!-- Tabla de Departamentos, Submódulos y Permisos -->
                <div class="rounded-xl border border-stone-200 overflow-hidden shadow-sm">

                    <div class="p-4 border-b border-stone-100 flex flex-wrap justify-between items-center gap-4 bg-white">
                        <div class="font-bold p-2 text-xs text-stone-700 uppercase tracking-wider"> 
                            <p class="text-xs text-stone-500">Editando permisos para: <span class="font-bold text-stone-800">${nombreColaborador}</span> (No. Empleado: ${noEmp})</p>
                        </div>
                    </div>

                    <div class="max-h-[500px] overflow-y-auto custom-scrollbar">
                        <table class="w-full text-left border-collapse text-xs">
                            <thead class="sticky top-0 z-10 bg-stone-100">
                                <tr class="text-stone-600 font-bold border-b border-stone-200 text-[11px]">
                                    <th class="p-3 pl-4">DEPARTAMENTO / SUBMÓDULO (SHEETS)</th>
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
                </div>

                <!-- Botones de Acción inferiores -->
                <div class="flex items-center gap-3 pt-2">
                    <button onclick="guardarMatrizPermisosSis('${noEmp}')" class="bg-[#249444] hover:bg-[#1e7a37] text-white text-xs font-bold px-6 py-2.5 rounded-xl transition-all shadow-sm flex items-center gap-2">
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

async function guardarMatrizPermisosSis(noEmp) {
    const checkboxes = document.querySelectorAll('.chk-permiso');
    const permisosEstructura = {};

    checkboxes.forEach(chk => {
        const depto = chk.getAttribute('data-depto');
        const submodulo = chk.getAttribute('data-submodulo');
        const tipo = chk.getAttribute('data-tipo');

        if (!permisosEstructura[depto]) {
            permisosEstructura[depto] = {};
        }
        if (!permisosEstructura[depto][submodulo]) {
            permisosEstructura[depto][submodulo] = { ver: 0, editar: 0, eliminar: 0 };
        }

        permisosEstructura[depto][submodulo][tipo] = chk.checked ? 1 : 0;
    });

    const payload = {
        numEmp: noEmp,
        permisos: permisosEstructura
    };

    try {
        if (typeof FetchAPI === 'function') {
            await FetchAPI('guardarPermisos', payload);
        } else if (typeof google !== 'undefined' && google.script && google.script.run) {
            await new Promise((resolve, reject) => {
                google.script.run
                    .withSuccessHandler(resolve)
                    .withFailureHandler(reject)
                    .guardarPermisosEnSheet(payload);
            });
        }

        alert("¡Permisos actualizados correctamente para el colaborador!");
        cargarPermisosSis();
    } catch (err) {
        console.error("Error al guardar permisos:", err);
        alert("Error al guardar los permisos: " + (err.message || err));
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
// LISTENERS DE HISTORIAL Y ARRANQUE ULTRA-RÁPIDO
// ==========================================
window.addEventListener('popstate', (event) => {
    procesarCargaInicialSeccionSis(event);
});

document.addEventListener('DOMContentLoaded', () => {
    cargarDatosDelSistema();
    procesarCargaInicialSeccionSis();
});