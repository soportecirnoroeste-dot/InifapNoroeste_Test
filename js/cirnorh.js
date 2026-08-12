// js/cirnorh.js
window.cirnorhConfig = {
    deptoKey: "cirnorh",
    subtitle: "Gestión de personal, incidencias, nómina y desarrollo humano.",
    options: [
        { id: "personal", title: "Personal", icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-users-round-icon lucide-users-round"><path d="M18 21a8 8 0 0 0-16 0"/><circle cx="10" cy="8" r="5"/><path d="M22 20c0-3.37-2-6.5-4-8a5 5 0 0 0-.45-8.3"/></svg>`, action: "cargarPersonalRh()" },
        { id: "asistencia", title: "Asistencia", icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-user-round-check"><path d="M2 21a8 8 0 0 1 13.292-6"/><circle cx="10" cy="8" r="5"/><path d="m16 19 2 2 4-4"/></svg>`, action: "cargarAsistenciaRh()" },
        { id: "vacaciones", title: "Vacaciones", icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-parasol"><path d="M12.5 11.134 18.196 21"/><path d="M20.425 5.299a10 10 0 0 0-16.941 9.78c.183.563.843.774 1.355.478L20.16 6.711c.512-.296.66-.973.264-1.413"/><path d="M21 21H3"/></svg>`, action: "cargarVacacionesRh()" },
        { id: "capacitacion", title: "Capacitación", icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-library-big"><rect width="8" height="18" x="3" y="3" rx="1"/><path d="M7 3v18"/><path d="M20.4 18.9c.2.5-.1 1.1-.6 1.3l-1.9.7c-.5.2-1.1-.1-1.3-.6L11.1 5.1c-.2-.5.1-1.1.6-1.3l1.9-.7c.5-.2 1.1.1 1.3.6Z"/></svg>`, action: "cargarCapacitacionRh()" },
        { id: "expedientes", title: "Expedientes", icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-archive"><rect width="20" height="5" x="2" y="3" rx="1"/><path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8"/><path d="M10 12h4"/></svg>`, action: "cargarExpedientesRh()" },
        { id: "generar-oficios", title: "Generar Oficios", icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-file-text"><path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"/><path d="M14 2v5a1 1 0 0 0 1 1h5"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg>`, action: "cargarGenerarOficiosRh()" }
    ]
};

// Función de Bienvenida Específica para Recursos Humanos
function cargarBienvenidaRh() {
    let tarjetasHtml = '';
    const coloresBg = [
        'bg-[#f0fdf4] border-[#c6f6d5] text-[#059669]',
        'bg-[#fffbeb] border-[#fef3c7] text-[#d97706]',
        'bg-[#eff6ff] border-[#bfdbfe] text-[#2563eb]',
        'bg-[#faf5ff] border-[#f3e8ff] text-[#7e22ce]',
        'bg-[#fff1f2] border-[#ffe4e6] text-[#e11d48]'
    ];

    // Generamos las tarjetas dinámicamente basadas en el menú de opciones
    if (window.cirnorhConfig && window.cirnorhConfig.options) {
        window.cirnorhConfig.options.forEach((opt, index) => {
            const estiloColor = coloresBg[index % coloresBg.length];
            tarjetasHtml += `
                <div onclick="${opt.action}" 
                     class="p-5 rounded-xl border cursor-pointer hover:shadow-md transition-all bg-white flex flex-col justify-between group">
                    <div>
                        <div class="flex items-center gap-2 mb-2">
                            <span class="text-xl p-2 rounded-lg ${estiloColor.split(' ')[0]}">${opt.icon}</span>
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

    document.getElementById('app-container').innerHTML = `
        <div class="bg-white rounded-2xl p-8 border border-stone-200 shadow-sm animate-fade-in">
            <div class="flex items-center gap-4 mb-6 pb-6 border-b border-stone-100">
                <div class="p-3 bg-stone-100 rounded-2xl text-stone-700 flex items-center justify-center shadow-xs">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-handshake"><path d="m11 17 2 2a1 1 0 1 0 3-3"/><path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4"/><path d="m21 3 1 11h-2"/><path d="M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3"/><path d="M3 4h8"/></svg>
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

// Funciones de visualización específicas de Recursos Humanos con sus respectivos SVGs
function cargarPersonalRh() {
    document.getElementById('app-container').innerHTML = `
        <div class="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm animate-fade-in">
            <div class="flex items-center gap-3 mb-4">
                <div class="p-2.5 bg-[#f0fdf4] text-[#059669] rounded-xl border border-[#c6f6d5]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-book-user"><path d="M15 13a3 3 0 1 0-6 0"/><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20"/><circle cx="12" cy="8" r="2"/></svg>
                </div>
                <div>
                    <h3 class="font-black text-stone-800 text-lg">Plantilla de Personal</h3>
                    <p class="text-xs text-stone-500">Directorio de empleados, altas, bajas y estructura organizacional.</p>
                </div>
            </div>
        </div>
    `;
}

function cargarAsistenciaRh() {
    document.getElementById('app-container').innerHTML = `
        <div class="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm animate-fade-in">
            <div class="flex items-center gap-3 mb-4">
                <div class="p-2.5 bg-[#fffbeb] text-[#d97706] rounded-xl border border-[#fef3c7]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-user-round-check"><path d="M2 21a8 8 0 0 1 13.292-6"/><circle cx="10" cy="8" r="5"/><path d="m16 19 2 2 4-4"/></svg>
                </div>
                <div>
                    <h3 class="font-black text-stone-800 text-lg">Control de Asistencia e Incidencias</h3>
                    <p class="text-xs text-stone-500">Registro de retardos, faltas, permisos y justificantes.</p>
                </div>
            </div>
        </div>
    `;
}

function cargarVacacionesRh() {
    document.getElementById('app-container').innerHTML = `
        <div class="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm animate-fade-in">
            <div class="flex items-center gap-3 mb-4">
                <div class="p-2.5 bg-[#eff6ff] text-[#2563eb] rounded-xl border border-[#bfdbfe]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-parasol"><path d="M12.5 11.134 18.196 21"/><path d="M20.425 5.299a10 10 0 0 0-16.941 9.78c.183.563.843.774 1.355.478L20.16 6.711c.512-.296.66-.973.264-1.413"/><path d="M21 21H3"/></svg>
                </div>
                <div>
                    <h3 class="font-black text-stone-800 text-lg">Solicitudes de Vacaciones y Permisos</h3>
                    <p class="text-xs text-stone-500">Calendario de descansos y control de días económicos disponibles.</p>
                </div>
            </div>
        </div>
    `;
}

function cargarCapacitacionRh() {
    document.getElementById('app-container').innerHTML = `
        <div class="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm animate-fade-in">
            <div class="flex items-center gap-3 mb-4">
                <div class="p-2.5 bg-[#faf5ff] text-[#7e22ce] rounded-xl border border-[#f3e8ff]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-library-big"><rect width="8" height="18" x="3" y="3" rx="1"/><path d="M7 3v18"/><path d="M20.4 18.9c.2.5-.1 1.1-.6 1.3l-1.9.7c-.5.2-1.1-.1-1.3-.6L11.1 5.1c-.2-.5.1-1.1.6-1.3l1.9-.7c.5-.2 1.1.1 1.3.6Z"/></svg>
                </div>
                <div>
                    <h3 class="font-black text-stone-800 text-lg">Programas de Capacitación</h3>
                    <p class="text-xs text-stone-500">Cursos, talleres y constancias de desarrollo profesional para el personal.</p>
                </div>
            </div>
        </div>
    `;
}

function cargarExpedientesRh() {
    document.getElementById('app-container').innerHTML = `
        <div class="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm animate-fade-in">
            <div class="flex items-center gap-3 mb-4">
                <div class="p-2.5 bg-[#fff1f2] text-[#e11d48] rounded-xl border border-[#ffe4e6]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-archive"><rect width="20" height="5" x="2" y="3" rx="1"/><path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8"/><path d="M10 12h4"/></svg>
                </div>
                <div>
                    <h3 class="font-black text-stone-800 text-lg">Expedientes Digitales</h3>
                    <p class="text-xs text-stone-500">Documentación oficial, contratos y resguardos de los trabajadores.</p>
                </div>
            </div>
        </div>
    `;
}

function cargarGenerarOficiosRh() {
    document.getElementById('app-container').innerHTML = `
        <div class="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm animate-fade-in">
            <div class="flex items-center gap-3 mb-4">
                <div class="p-2.5 bg-[#f0fdf4] text-[#059669] rounded-xl border border-[#c6f6d5]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-file-text"><path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"/><path d="M14 2v5a1 1 0 0 0 1 1h5"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg>
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