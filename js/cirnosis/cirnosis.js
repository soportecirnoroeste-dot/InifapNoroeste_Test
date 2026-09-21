// ==========================================
// CONFIGURACIÓN OFICIAL DEL MÓDULO: SISTEMAS (cirnosis.js)
// ==========================================
window.cirnosisConfig = {
_optionsCache: [],
    deptoKey: "cirnosis",
    claveDep: "7", 
    subtitle: "Gestión de infraestructura tecnológica, redes y soporte técnico.",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"/><path d="M14 2v5a1 1 0 0 0 1 1h5"/><path d="m8 16 2-2-2-2"/><path d="M12 18h4"/></svg>`,

    get options() {
        // 1. Intentar capturar de la caché o variables globales si ya cargaron
        let fuenteDatos = window.allSubModulosData || window.subModulosData;
        if (!fuenteDatos) {
            try {
                const cacheLocal = localStorage.getItem('sistema_cache_datos') || localStorage.getItem('cache_submodulos');
                if (cacheLocal) {
                    const parsed = JSON.parse(cacheLocal);
                    fuenteDatos = parsed.submodulos || parsed;
                }
            } catch (e) {}
        }

        if (Array.isArray(fuenteDatos) && fuenteDatos.length > 0) {
            return this.procesarDatos(fuenteDatos);
        }

        // 2. Si no hay datos, retornamos los 5 módulos exactos de tu Sheet de respaldo inmediato
        return [
            { id: "1", title: "Permisos", icon: this.icon, action: "manejarAccionSeccionSis('1')" },
            { id: "2", title: "Licencias", icon: this.icon, action: "manejarAccionSeccionSis('2')" },
            { id: "3", title: "Documentos", icon: this.icon, action: "manejarAccionSeccionSis('3')" },
            { id: "4", title: "Configuración de Menú", icon: this.icon, action: "manejarAccionSeccionSis('4')" },
            { id: "5", title: "Formatos de Of.", icon: this.icon, action: "manejarAccionSeccionSis('5')" }
        ];
    },

    procesarDatos(fuenteDatos) {
        const filtrados = fuenteDatos.filter(item => {
            const dep = item.ClaveDep !== undefined ? item.ClaveDep : item.claveDep;
            return String(dep).trim() === String(this.claveDep);
        });

        if (filtrados.length === 0) return this.options; // fallback si filtra vacío

        return filtrados.map(sub => {
            const idSheet = String(sub.SModClave !== undefined ? sub.SModClave : sub.sModClave);
            const nombreSheet = String(sub.SModNom !== undefined ? sub.SModNom : sub.sModNom);
            const iconoSheet = sub.SModIcon !== undefined ? sub.SModIcon : sub.sModIcon;

            return {
                id: idSheet,
                title: nombreSheet,
                icon: iconoSheet && String(iconoSheet).trim() !== "" ? iconoSheet : this.icon,
                action: `manejarAccionSeccionSis('${idSheet}')`
            };
        });
    }
};

window.cirnosis = window.cirnosisConfig;

// ==========================================
// FUNCIONES DE ACCIÓN Y RENDERIZADO VISUAL
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
    if (idOpt === '1' || idOpt === 'permisos' || idOpt === '6') { 
        cargarPermisosSis();
    } else {
        const opciones = window.cirnosisConfig.options || [];
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
        console.error("No se encontró renderizarListadoPermisosSis en SisPerCore.js");
    }
}

// ==========================================
// MATRIZ DE PERMISOS DINÁMICA
// ==========================================
function abrirMatrizPermisosUsuario(nombreColaborador, noEmp) {
    const contenedorDinamico = document.getElementById('contenido-submodulo-dinamico');
    if (contenedorDinamico) {
        contenedorDinamico.className = "col-span-1 sm:col-span-2 md:col-span-3 space-y-6 animate-fade-in";
        const submodulosDelDepto = window.cirnosisConfig.options || [];
        let filasHTML = "";

        submodulosDelDepto.forEach(sub => {
            filasHTML += `
                <tr class="hover:bg-stone-50/80 transition-colors border-b border-stone-100">
                    <td class="p-3 pl-4 font-semibold text-stone-800 flex items-center gap-2">
                        <span class="w-6 h-6 inline-flex items-center justify-center text-sky-600">${sub.icon}</span>
                        <span>${sub.title}</span>
                    </td>
                    <td class="p-3 text-center"><input type="checkbox" class="permiso-ver rounded text-green-600" data-sub="${sub.id}"></td>
                    <td class="p-3 text-center"><input type="checkbox" class="permiso-editar rounded text-green-600" data-sub="${sub.id}"></td>
                    <td class="p-3 text-center pr-4"><input type="checkbox" class="permiso-eliminar rounded text-green-600" data-sub="${sub.id}"></td>
                </tr>
            `;
        });

        contenedorDinamico.innerHTML = `
            <div class="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
                <div class="p-4 border-b border-stone-100 flex justify-between items-center bg-white">
                    <p class="text-xs text-stone-500">Editando permisos para: <span class="font-bold text-stone-800">${nombreColaborador}</span> (No. ${noEmp})</p>
                </div>
                <div class="max-h-[500px] overflow-y-auto p-4">
                    <table class="w-full text-left border-collapse text-xs">
                        <thead class="bg-stone-100 text-stone-600 font-bold">
                            <tr><th class="p-3 pl-4">SUBMÓDULO</th><th class="p-3 text-center">VER</th><th class="p-3 text-center">EDITAR</th><th class="p-3 text-center pr-4">ELIMINAR</th></tr>
                        </thead>
                        <tbody class="divide-y divide-stone-100">${filasHTML}</tbody>
                    </table>
                </div>
                <div class="p-4 border-t border-stone-100 flex gap-3 bg-stone-50">
                    <button onclick="guardarMatrizPermisosSis('${noEmp}')" class="bg-[#249444] text-white text-xs font-bold px-6 py-2.5 rounded-xl">Guardar</button>
                    <button onclick="cargarPermisosSis()" class="bg-stone-100 text-stone-700 text-xs font-bold px-6 py-2.5 rounded-xl">Cancelar</button>
                </div>
            </div>
        `;
    }
}

function renderizarVistaModuloSis(idOpt, tituloModulo) {
    const contenedor = obtenerContenedor();
    const deptoActual = new URLSearchParams(window.location.search).get('depto') || 'cirnosis';
    if (contenedor) {
        if (typeof window.actualizarBotonRegresar === 'function') window.actualizarBotonRegresar('submodulo', deptoActual);
        contenedor.innerHTML = `
            <section class="bg-white rounded-2xl p-6 md:p-8 soft-shadow border border-sky-500/10 mb-8 animate-fade-in">
                <div class="flex items-center gap-3 mb-6 pb-4 border-b border-stone-100">
                    <h3 class="font-black text-stone-800 text-lg uppercase">${tituloModulo}</h3>
                </div>
                <div id="contenido-submodulo-dinamico" class="w-full space-y-6">
                    <p class="text-xs text-stone-500 font-medium">Área de trabajo para: ${tituloModulo}</p>
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

// Sobrescribir o inyectar las tarjetas visuales al cargar la página si el menú principal estaba estático
window.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        const urlParams = new URLSearchParams(window.location.search);
        if (!urlParams.get('seccion') && urlParams.get('depto') === 'cirnosis') {
            const gridCards = document.querySelector('.grid') || document.querySelector('main');
            const opciones = window.cirnosisConfig.options;
            
            if (gridCards && opciones && opciones.length > 0) {
                let htmlTarjetas = '';
                opciones.forEach(opt => {
                    htmlTarjetas += `
                        <div class="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                            <div>
                                <div class="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center mb-4">${opt.icon}</div>
                                <h4 class="font-bold text-stone-800 text-base mb-1">${opt.title}</h4>
                                <p class="text-xs text-stone-500 mb-4">Módulo configurado para ${opt.title}.</p>
                            </div>
                            <button onclick="${opt.action}" class="text-xs font-bold text-[#249444] hover:text-[#1e7a37] flex items-center gap-1">
                                ABRIR MÓDULO &rarr;
                            </button>
                        </div>
                    `;
                });
                // Inyectamos de forma limpia los 5 submódulos reales en pantalla
                gridCards.innerHTML = htmlTarjetas;
            }
        }
    }, 300);
});