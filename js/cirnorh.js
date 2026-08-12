// js/cirnorh.js
window.cirnorhConfig = {
    deptoKey: "cirnorh",
    subtitle: "Gestión de personal, incidencias, nómina y desarrollo humano.",
    options: [
        { 
            id: "personal", 
            title: "Personal", 
            icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-users-round"><path d="M18 21a8 8 0 0 0-16 0"/><circle cx="10" cy="8" r="5"/><path d="M22 20c0-3.37-2-6.5-4-8a5 5 0 0 0-.45-8.3"/></svg>', 
            colorClass: 'bg-[#f0fdf4] border-[#c6f6d5] text-[#059669]',
            action: "cargarPersonalRh()" 
        },
        { 
            id: "asistencia", 
            title: "Asistencia", 
            icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-user-round-check"><path d="M2 21a8 8 0 0 1 13.292-6"/><circle cx="10" cy="8" r="5"/><path d="m16 19 2 2 4-4"/></svg>', 
            colorClass: 'bg-[#fffbeb] border-[#fef3c7] text-[#d97706]',
            action: "cargarAsistenciaRh()" 
        },
        { 
            id: "vacaciones", 
            title: "Vacaciones", 
            icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-parasol"><path d="M12.5 11.134 18.196 21"/><path d="M20.425 5.299a10 10 0 0 0-16.941 9.78c.183.563.843.774 1.355.478L20.16 6.711c.512-.296.66-.973.264-1.413"/><path d="M21 21H3"/></svg>', 
            colorClass: 'bg-[#eff6ff] border-[#bfdbfe] text-[#2563eb]',
            action: "cargarVacacionesRh()" 
        },
        { 
            id: "capacitacion", 
            title: "Capacitación", 
            icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-library-big"><rect width="8" height="18" x="3" y="3" rx="1"/><path d="M7 3v18"/><path d="M20.4 18.9c.2.5-.1 1.1-.6 1.3l-1.9.7c-.5.2-1.1-.1-1.3-.6L11.1 5.1c-.2-.5.1-1.1.6-1.3l1.9-.7c.5-.2 1.1.1 1.3.6Z"/></svg>', 
            colorClass: 'bg-[#faf5ff] border-[#f3e8ff] text-[#7e22ce]',
            action: "cargarCapacitacionRh()" 
        },
        { 
            id: "expedientes", 
            title: "Expedientes", 
            icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-archive"><rect width="20" height="5" x="2" y="3" rx="1"/><path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8"/><path d="M10 12h4"/></svg>', 
            colorClass: 'bg-[#fff1f2] border-[#ffe4e6] text-[#e11d48]',
            action: "cargarExpedientesRh()" 
        },
        { 
            id: "generar-oficios", 
            title: "Generar Oficios", 
            icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-file-text"><path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"/><path d="M14 2v5a1 1 0 0 0 1 1h5"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg>', 
            colorClass: 'bg-[#f0fdf4] border-[#c6f6d5] text-[#059669]',
            action: "cargarGenerarOficiosRh()" 
        }
    ]
};

function obtenerContenedor() {
    return document.getElementById('app-container') || document.querySelector('main') || document.body;
}

function cargarBienvenidaRh() {
    let tarjetasHtml = '';
    if (window.cirnorhConfig && window.cirnorhConfig.options) {
        window.cirnorhConfig.options.forEach(opt => {
            const bgSolo = opt.colorClass.split(' ')[0];
            tarjetasHtml += `
                <div onclick="${opt.action}" class="p-5 rounded-xl border cursor-pointer hover:shadow-md transition-all bg-white flex flex-col justify-between group">
                    <div>
                        <div class="flex items-center gap-2 mb-2">
                            <span class="text-xl p-2 rounded-lg ${bgSolo}">${opt.icon}</span>
                            <h4 class="font-bold text-stone-800 text-sm group-hover:text-[#249444] transition-colors">${opt.title}</h4>
                        </div>
                        <p class="text-xs text-stone-500">Módulo de gestión para ${opt.title.toLowerCase()}.</p>
                    </div>
                    <div class="mt-4 text-[10px] font-bold uppercase tracking-wider text-stone-400 group-hover:text-[#249444] flex items-center gap-1">
                        <span>Abrir módulo</span> &rarr;
                    </div>
                </div>
            `;
        });
    }

    const iconoHandshakeFijo = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-handshake"><path d="m11 17 2 2a1 1 0 1 0 3-3"/><path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4"/><path d="m21 3 1 11h-2"/><path d="M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3"/><path d="M3 4h8"/></svg>';

    const contenedor = obtenerContenedor();
    if (contenedor) {
        contenedor.innerHTML = `
            <div class="bg-white rounded-2xl p-8 border border-stone-200 shadow-sm animate-fade-in m-6">
                <div class="flex items-center gap-4 mb-6 pb-6 border-b border-stone-100">
                    <div class="p-3 bg-stone-100 rounded-2xl text-stone-700 flex items-center justify-center shadow-xs">
                        ${iconoHandshakeFijo}
                    </div>
                    <div>
                        <h2 class="font-black text-stone-900 text-2xl mb-1">¡Bienvenido/a!</h2>
                        <p class="text-sm text-stone-600 max-w-xl">${window.cirnorhConfig.subtitle}</p>
                    </div>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    ${tarjetasHtml}
                </div>
                <p class="mt-6 text-xs text-stone-400 italic text-center">Última actualización de datos: ${new Date().toLocaleDateString()}</p>
            </div>
        `;
    }
}

function cargarPersonalRh() {
    const opt = window.cirnorhConfig.options.find(o => o.id === 'personal');
    renderizarVistaModulo(opt, "Directorio de empleados, altas, bajas y estructura organizacional.");
}

function cargarAsistenciaRh() {
    const opt = window.cirnorhConfig.options.find(o => o.id === 'asistencia');
    renderizarVistaModulo(opt, "Registro de retardos, faltas, permisos y justificantes.");
}

function cargarVacacionesRh() {
    const opt = window.cirnorhConfig.options.find(o => o.id === 'vacaciones');
    renderizarVistaModulo(opt, "Calendario de descansos y control de días económicos disponibles.");
}

function cargarCapacitacionRh() {
    const opt = window.cirnorhConfig.options.find(o => o.id === 'capacitacion');
    renderizarVistaModulo(opt, "Cursos, talleres y constancias de desarrollo profesional para el personal.");
}

function cargarExpedientesRh() {
    const opt = window.cirnorhConfig.options.find(o => o.id === 'expedientes');
    renderizarVistaModulo(opt, "Documentación oficial, contratos y resguardos de los trabajadores.");
}

function cargarGenerarOficiosRh() {
    const opt = window.cirnorhConfig.options.find(o => o.id === 'generar-oficios');
    const contenedor = obtenerContenedor();
    if (contenedor) {
        contenedor.innerHTML = `
            <div class="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm animate-fade-in m-6">
                <div class="flex items-center gap-3 mb-4">
                    <div class="p-2.5 ${opt.colorClass} rounded-xl border">
                        ${opt.icon}
                    </div>
                    <div>
                        <h3 class="font-black text-stone-800 text-lg">Generación de Oficios - Recursos Humanos</h3>
                        <p class="text-xs text-stone-500">Elaboración de constancias laborales, comisiones y avisos internos.</p>
                    </div>
                </div>
                <div class="p-4 bg-stone-50 rounded-xl border border-dashed border-stone-300 text-xs text-stone-400 text-center mt-4">
                    Aquí irá el formulario o generador de documentos específico para RH.
                </div>
            </div>
        `;
    }
}

function renderizarVistaModulo(opt, descripcion) {
    const contenedor = obtenerContenedor();
    if (contenedor) {
        contenedor.innerHTML = `
            <div class="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm animate-fade-in m-6">
                <div class="flex items-center gap-3 mb-4">
                    <div class="p-2.5 ${opt.colorClass} rounded-xl border">
                        ${opt.icon}
                    </div>
                    <div>
                        <h3 class="font-black text-stone-800 text-lg">${opt.title}</h3>
                        <p class="text-xs text-stone-500">${descripcion}</p>
                    </div>
                </div>
            </div>
        `;
    }
}

if (new URLSearchParams(window.location.search).get('depto') === 'cirnorh') {
    cargarBienvenidaRh();
}