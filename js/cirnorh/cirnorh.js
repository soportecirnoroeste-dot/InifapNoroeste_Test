// ==========================================
// js/cirnorh/cirnorh.js - VERSIÓN DINÁMICA DESDE GOOGLE SHEETS
// ==========================================

window.cirnorhConfig = {
    deptoKey: "cirnorh",
    subtitle: "Gestión de personal, incidencias, nómina y desarrollo humano.",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-handshake"><path d="m11 17 2 2a1 1 0 1 0 3-3"/><path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4"/><path d="m21 3 1 11h-2"/><path d="M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3"/><path d="M3 4h8"/></svg>`,
    
    // Método dinámico para obtener las opciones/submódulos desde Google Sheets
    get options() {
        const submodulos = window.allSubModulosData || (window.datosSistema && window.datosSistema.submodulos) || [];
        
        // Filtramos los submódulos que pertenecen específicamente a 'cirnorh' (o variantes)
        const subsCirnorh = submodulos.filter(sub => {
            const subDep = String(sub.ClaveDep !== undefined ? sub.ClaveDep : sub.claveDep || '').trim().toLowerCase();
            return subDep === 'cirnorh';
        });

        // Si hay submódulos sincronizados en Sheets, los mapeamos al formato visual
        if (subsCirnorh.length > 0) {
            return subsCirnorh.map(sub => {
                const idSub = String(sub.SModClave !== undefined ? sub.SModClave : (sub.sModClave || sub.id || '')).trim();
                const nombreSub = sub.SModNom !== undefined ? sub.SModNom : (sub.sModNom || sub.nombre || 'Submódulo');
                
                return {
                    id: idSub.toLowerCase(),
                    title: nombreSub,
                    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z"/></svg>`,
                    action: `manejarAccionSeccion('${idSub.toLowerCase()}')`
                };
            });
        }

        // Fallback de respaldo por si Sheets aún no sincroniza o está vacío
        return [
            {
                id: "personal",
                title: "Personal",
                icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 21a8 8 0 0 0-16 0"/><circle cx="10" cy="8" r="5"/><path d="M22 20c0-3.37-2-6.5-4-8a5 5 0 0 0-.45-8.3"/></svg>`,
                action: "manejarAccionSeccion('personal')"
            },
            {
                id: "asistencia",
                title: "Control de Asistencia",
                icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 21a8 8 0 0 1 13.292-6"/><circle cx="10" cy="8" r="5"/><path d="m16 19 2 2 4-4"/></svg>`,
                action: "manejarAccionSeccion('asistencia')"
            }
        ];
    }
};

function manejarAccionSeccion(idOpt) {
    const urlParams = new URLSearchParams(window.location.search);
    const deptoActual = urlParams.get('depto') || 'cirnorh';
    const nuevaUrl = `main.html?depto=${deptoActual}&seccion=${idOpt}`;

    window.history.pushState({ seccion: idOpt }, '', nuevaUrl);
    sessionStorage.setItem('submodulo_activo_cirnorh', idOpt);
    ejecutarCargaSeccion(idOpt);
}

function ejecutarCargaSeccion(idOpt) {
    const idMinus = String(idOpt).toLowerCase();

    if (idMinus.includes('personal') || idMinus === 'per') {
        if (typeof cargarPersonalRh === 'function') cargarPersonalRh(true);
    } else if (idMinus.includes('asistencia') || idMinus.includes('asis') || idMinus === 'biometrico') {
        if (typeof RhAsisCasc !== 'undefined' && RhAsisCasc.mostrarVistaBiometrico) {
            RhAsisCasc.mostrarVistaBiometrico();
        } else if (typeof cargarVistaBiometrico === 'function') {
            cargarVistaBiometrico();
        }
    } else if (idMinus.includes('vacaciones')) {
        cargarVacacionesRh();
    } else if (idMinus.includes('capacitacion')) {
        cargarCapacitacionRh();
    } else if (idMinus.includes('expedientes')) {
        cargarExpedientesRh();
    } else if (idMinus.includes('oficios') || idMinus.includes('generar')) {
        cargarGenerarOficiosRh();
    } else {
        // Vista genérica por defecto para cualquier submódulo nuevo creado en Sheets
        renderizarVistaModulo(idOpt, "Módulo sincronizado desde Google Sheets.", []);
    }
}

function limpiarSeccionUrl() {
    sessionStorage.removeItem('submodulo_activo_cirnorh');
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('seccion') || urlParams.has('vista')) {
        const deptoActual = urlParams.get('depto') || 'cirnorh';
        const nuevaUrl = `main.html?depto=${deptoActual}`;
        window.history.replaceState({}, '', nuevaUrl);
    }
}

function cargarAsistenciaRh() {
    const urlActual = new URL(window.location);
    urlActual.searchParams.set('seccion', 'asistencia');
    window.history.pushState({ seccion: 'asistencia' }, '', urlActual);

    sessionStorage.setItem('seccion_activa_actual', 'asistencia');

    if (typeof window.RhAsisCasc !== 'undefined' && window.RhAsisCasc.mostrarVistaBiometrico) {
        window.RhAsisCasc.mostrarVistaBiometrico();
    } else if (typeof cargarVistaBiometrico === 'function') {
        cargarVistaBiometrico();
    }

    const deptoActual = localStorage.getItem('depto_activo_actual') || 'cirnorh';
    if (typeof window.actualizarBotonRegresar === 'function') {
        window.actualizarBotonRegresar('submodulo', deptoActual);
    }
}

function cargarVacacionesRh() {
    renderizarVistaModulo('vacaciones', "Calendario de descansos y control de días económicos disponibles.", []);
}

function cargarCapacitacionRh() {
    renderizarVistaModulo('capacitacion', "Cursos, talleres y constancias de desarrollo profesional para el personal.", []);
}

function cargarExpedientesRh() {
    renderizarVistaModulo('expedientes', "Documentación oficial, contratos y resguardos de los trabajadores.", []);
}

function cargarGenerarOficiosRh() {
    renderizarVistaModulo('generar-oficios', "Elaboración de constancias laborales, comisiones y avisos internos.", [
        { titulo: "Constancias Laborales", desc: "Generación de cartas de antigüedad y sueldos." },
        { titulo: "Oficios de Comisión", desc: "Autorización de viáticos y traslados oficiales." }
    ]);
}

function renderizarVistaModulo(idOpt, descripcion, itemsIndice = []) {
    const nombreCortoActual = localStorage.getItem('depto_activo_actual') || 'cirnorh';
    const configActual = window[nombreCortoActual + 'Config'];
    const opt = configActual ? configActual.options.find(o => o.id.toLowerCase() === String(idOpt).toLowerCase()) : null;
    const contenedor = obtenerContenedor();

    if (contenedor && opt) {
        if (typeof window.actualizarBotonRegresar === 'function') {
            window.actualizarBotonRegresar('submodulo', nombreCortoActual);
        }

        let htmlTarjetasIndice = '';
        if (itemsIndice && itemsIndice.length > 0) {
            htmlTarjetasIndice = itemsIndice.map(item => {
                const laAccion = item.action || item.accion || '';
                return `
                    <div data-accion="${laAccion}" class="tarjeta-accion p-4 rounded-xl border border-stone-200 bg-stone-50/50 hover:border-[#249444] hover:bg-emerald-50/30 transition-all cursor-pointer group shadow-xs">
                        <h4 class="font-bold text-xs text-stone-800 uppercase group-hover:text-[#249444] mb-1">${item.titulo}</h4>
                        <p class="text-[11px] text-stone-500 leading-relaxed">${item.desc}</p>
                    </div>
                `;
            }).join('');
        } else {
            htmlTarjetasIndice = `
                <div class="col-span-full py-12 px-4 text-center bg-stone-50/80 rounded-2xl border border-dashed border-stone-300">
                    <div class="inline-flex p-3 bg-emerald-50 text-[#249444] rounded-2xl mb-3 border border-emerald-200">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                    </div>
                    <h4 class="font-bold text-stone-800 text-sm uppercase tracking-wide mb-1">Módulo Sincronizado</h4>
                    <p class="text-xs text-stone-500 max-w-sm mx-auto">Este apartado está vinculado correctamente con Google Sheets y listo para operar.</p>
                </div>
            `;
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

                <div id="contenido-submodulo-dinamico" class="${String(idOpt).toLowerCase().includes('personal') ? 'w-full space-y-6' : 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'}">
                    ${htmlTarjetasIndice}
                </div>
            </section>
        `;
    }
}

// ==========================================
// CONTROLADOR MAESTRO DE NAVEGACIÓN Y HISTORIAL
// ==========================================
function obtenerContenedor() {
    return document.getElementById('app-container') || document.querySelector('main') || document.body;
}

function procesarCargaInicialSeccion(event) {
    const urlParams = new URLSearchParams(window.location.search);

    const seccion = event && event.state && 'seccion' in event.state
        ? event.state.seccion
        : urlParams.get('seccion');

    const vista = event && event.state && 'vista' in event.state
        ? event.state.vista
        : urlParams.get('vista');

    const depto = urlParams.get('depto') || 'cirnorh';
    const contenedor = obtenerContenedor();

    if (seccion) {
        sessionStorage.setItem('submodulo_activo_cirnorh', seccion);

        if (typeof window.actualizarBotonRegresar === 'function') {
            window.actualizarBotonRegresar('submodulo', depto);
        }

        ejecutarCargaSeccion(seccion);
    } else {
        sessionStorage.removeItem('submodulo_activo_cirnorh');

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
// GESTIÓN GLOBAL DE CLICS Y TARJETAS
// ==========================================
document.addEventListener('click', function (e) {
    const tarjeta = e.target.closest('.tarjeta-accion');
    if (!tarjeta) return;

    const accion = tarjeta.getAttribute('data-accion') || '';
    if (accion) {
        try {
            eval(accion);
        } catch (err) {
            console.error("Error al ejecutar acción de tarjeta:", err);
        }
    }
});

// ==========================================
// LISTENERS DE HISTORIAL Y ARRANQUE
// ==========================================
window.addEventListener('popstate', (event) => {
    procesarCargaInicialSeccion(event);
});

document.addEventListener('DOMContentLoaded', () => {
    procesarCargaInicialSeccion();
});