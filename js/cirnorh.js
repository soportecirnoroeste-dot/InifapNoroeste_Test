// js/cirnorh/cirnorh.js
window.cirnorhConfig = {
    deptoKey: "cirnorh",
    subtitle: "Gestión de personal, incidencias, nómina y desarrollo humano.",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-handshake"><path d="m11 17 2 2a1 1 0 1 0 3-3"/><path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4"/><path d="m21 3 1 11h-2"/><path d="M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3"/><path d="M3 4h8"/></svg>`,
    options: [
        { 
            id: "personal", 
            title: "Personal", 
            icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 21a8 8 0 0 0-16 0"/><circle cx="10" cy="8" r="5"/><path d="M22 20c0-3.37-2-6.5-4-8a5 5 0 0 0-.45-8.3"/></svg>`, 
            action: "manejarAccionSeccion('personal')" 
        },
        { 
            id: "asistencia", 
            title: "Asistencia", 
            icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 21a8 8 0 0 1 13.292-6"/><circle cx="10" cy="8" r="5"/><path d="m16 19 2 2 4-4"/></svg>`, 
            action: "manejarAccionSeccion('asistencia')" 
        },
        { 
            id: "vacaciones", 
            title: "Vacaciones", 
            icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.5 11.134 18.196 21"/><path d="M20.425 5.299a10 10 0 0 0-16.941 9.78c.183.563.843.774 1.355.478L20.16 6.711c.512-.296.66-.973.264-1.413"/><path d="M21 21H3"/></svg>`, 
            action: "manejarAccionSeccion('vacaciones')" 
        },
        { 
            id: "capacitacion", 
            title: "Capacitación", 
            icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="8" height="18" x="3" y="3" rx="1"/><path d="M7 3v18"/><path d="M20.4 18.9c.2.5-.1 1.1-.6 1.3l-1.9.7c-.5.2-1.1-.1-1.3-.6L11.1 5.1c-.2-.5.1-1.1.6-1.3l1.9-.7c.5-.2 1.1.1 1.3.6Z"/></svg>`, 
            action: "manejarAccionSeccion('capacitacion')" 
        },
        { 
            id: "expedientes", 
            title: "Expedientes", 
            icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="5" x="2" y="3" rx="1"/><path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8"/><path d="M10 12h4"/></svg>`, 
            action: "manejarAccionSeccion('expedientes')" 
        },
        { 
            id: "generar-oficios", 
            title: "Generar Oficios", 
            icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"/><path d="M14 2v5a1 1 0 0 0 1 1h5"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg>`, 
            action: "manejarAccionSeccion('generar-oficios')" 
        }
    ]
};

function obtenerContenedor() {
    return document.getElementById('app-container') || document.querySelector('main') || document.body;
}

// Enrutador centralizado para actualizar la URL y disparar la función correspondiente
function manejarAccionSeccion(idOpt) {
    const urlParams = new URLSearchParams(window.location.search);
    const deptoActual = urlParams.get('depto') || 'cirnorh';

    // Actualiza la URL limpiamente sin recargar la página
    const nuevaUrl = `main.html?depto=${deptoActual}&seccion=${idOpt}`;
    window.history.replaceState({}, '', nuevaUrl);

    // Dispara la función específica de cada módulo
    if (idOpt === 'personal') {
        if (typeof cargarPersonalRh === 'function') cargarPersonalRh(true);
    } else if (idOpt === 'asistencia') {
        cargarAsistenciaRh();
    } else if (idOpt === 'vacaciones') {
        cargarVacacionesRh();
    } else if (idOpt === 'capacitacion') {
        cargarCapacitacionRh();
    } else if (idOpt === 'expedientes') {
        cargarExpedientesRh();
    } else if (idOpt === 'generar-oficios') {
        cargarGenerarOficiosRh();
    }
}

// Funciones de índice para las demás secciones
function cargarAsistenciaRh() {
    renderizarVistaModulo('asistencia', "Registro de retardos, faltas, permisos y justificantes.", [
        { titulo: "Control de Retardos", desc: "Monitoreo y acumulación quincenal de entradas tarde." },
        { titulo: "Justificantes Médicos", desc: "Carga y validación de incapacidades o permisos oficiales." },
        { titulo: "Reporte de Asistencia", desc: "Generación de listas de asistencia globales por centro." }
    ]);
}

function cargarVacacionesRh() {
    renderizarVistaModulo('vacaciones', "Calendario de descansos y control de días económicos disponibles.", [
        { titulo: "Solicitud de Vacaciones", desc: "Formulario para periodos vacacionales del trabajador." },
        { titulo: "Días Económicos", desc: "Consulta de saldos y días disfrutados en el año en curso." },
        { titulo: "Calendario General", desc: "Vista general de ausencias programadas por área." }
    ]);
}

function cargarCapacitacionRh() {
    renderizarVistaModulo('capacitacion', "Cursos, talleres y constancias de desarrollo profesional para el personal.", [
        { titulo: "Catálogo de Cursos", desc: "Inscripciones a talleres internos y externos." },
        { titulo: "Historial de Constancias", desc: "Registro de acreditaciones y diplomas obtenidos." }
    ]);
}

function cargarExpedientesRh() {
    renderizarVistaModulo('expedientes', "Documentación oficial, contratos y resguardos de los trabajadores.", [
        { titulo: "Documentos Digitales", desc: "Actas de nacimiento, CURP, INE y comprobantes." },
        { titulo: "Contratos y Nombramientos", desc: "Historial laboral y vigencia de contratos." }
    ]);
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
    const opt = configActual ? configActual.options.find(o => o.id === idOpt) : null;
    const contenedor = document.getElementById('app-container');
    
    if (contenedor && opt) {
        if (typeof window.actualizarBotonRegresar === 'function') {
            window.actualizarBotonRegresar('submodulo', nombreCortoActual);
        }

        let htmlTarjetasIndice = '';
        if (itemsIndice && itemsIndice.length > 0) {
            htmlTarjetasIndice = itemsIndice.map(item => `
                <div class="p-4 rounded-xl border border-stone-200 bg-stone-50/50 hover:border-[#249444] hover:bg-emerald-50/30 transition-all cursor-pointer group shadow-xs">
                    <h4 class="font-bold text-xs text-stone-800 uppercase group-hover:text-[#249444] mb-1">${item.titulo}</h4>
                    <p class="text-[11px] text-stone-500 leading-relaxed">${item.desc}</p>
                </div>
            `).join('');
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

                <div id="contenido-submodulo-dinamico" class="${idOpt === 'personal' ? 'w-full space-y-6' : 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'}">
                    ${htmlTarjetasIndice}
                </div>
            </section>
        `;
    }
}

// Autodetección al recargar (F5): Lee la URL y ejecuta exactamente la sección guardada
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const seccionEnUrl = urlParams.get('seccion');

    if (seccionEnUrl) {
        manejarAccionSeccion(seccionEnUrl);
    }
});