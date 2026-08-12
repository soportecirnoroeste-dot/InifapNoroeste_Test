// js/cirnorh.js
window.cirnorhConfig = {
    deptoKey: "cirnorh",
    subtitle: "Gestión de personal, incidencias, nómina y desarrollo humano.",
    options: [
        { id: "personal", title: "Personal", icon: "👥", action: "cargarPersonalRh()" },
        { id: "asistencia", title: "Asistencia", icon: "⏱️", action: "cargarAsistenciaRh()" },
        { id: "vacaciones", title: "Vacaciones", icon: "🏖️", action: "cargarVacacionesRh()" },
        { id: "capacitacion", title: "Capacitación", icon: "📚", action: "cargarCapacitacionRh()" },
        { id: "expedientes", title: "Expedientes", icon: "📁", action: "cargarExpedientesRh()" },
        { id: "generar-oficios", title: "Generar Oficios", icon: "✍️", action: "cargarGenerarOficiosRh()" }
    ]
};

// Función de Bienvenida Específica para Recursos Humanos
function cargarBienvenidaRh() {
    const nombreUsuario = localStorage.getItem('session_userName') || 'Usuario';
    document.getElementById('app-container').innerHTML = `
        <div class="bg-white rounded-2xl p-8 border border-stone-200 shadow-sm animate-fade-in">
            <div class="flex items-center gap-4 mb-6 pb-6 border-b border-stone-100">
                <div class="p-3 bg-stone-100 rounded-2xl text-2xl">👥</div>
                <div>
                    <h2 class="font-black text-stone-900 text-2xl mb-1">👋 ¡Bienvenido/a, ${nombreUsuario}!</h2>
                    <p class="text-sm text-stone-600 max-w-xl">Te encuentras en el portal del Departamento de Recursos Humanos (CIRNORH). Selecciona una de las opciones en el menú superior para comenzar.</p>
                </div>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div class="p-5 bg-[#f0fdf4] rounded-xl border border-[#c6f6d5]">
                    <h4 class="font-bold text-[#059669] text-sm mb-1.5">Gestión Ágil</h4>
                    <p class="text-xs text-stone-700">Accede a la información de empleados y procesos clave de manera rápida y segura.</p>
                </div>
                <div class="p-5 bg-[#fffbeb] rounded-xl border border-[#fef3c7]">
                    <h4 class="font-bold text-[#d97706] text-sm mb-1.5">Información Precisa</h4>
                    <p class="text-xs text-stone-700">Mantén los datos actualizados sobre asistencias, vacaciones y expedientes digitales.</p>
                </div>
                <div class="p-5 bg-[#eff6ff] rounded-xl border border-[#bfdbfe]">
                    <h4 class="font-bold text-[#2563eb] text-sm mb-1.5">Procesos Eficientes</h4>
                    <p class="text-xs text-stone-700">Utiliza herramientas para la generación de oficios y seguimiento del personal.</p>
                </div>
            </div>
            <p class="mt-6 text-xs text-stone-400 italic text-center">Última actualización de datos: ${new Date().toLocaleDateString()}</p>
        </div>
    `;
}

// Funciones de visualización específicas de Recursos Humanos
function cargarPersonalRh() {
    document.getElementById('app-container').innerHTML = `
        <div class="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm animate-fade-in">
            <h3 class="font-black text-stone-800 text-lg mb-2">👥 Plantilla de Personal</h3>
            <p class="text-xs text-stone-500">Directorio de empleados, altas, bajas y estructura organizacional.</p>
        </div>
    `;
}

function cargarAsistenciaRh() {
    document.getElementById('app-container').innerHTML = `
        <div class="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm animate-fade-in">
            <h3 class="font-black text-stone-800 text-lg mb-2">⏱️ Control de Asistencia e Incidencias</h3>
            <p class="text-xs text-stone-500">Registro de retardos, faltas, permisos y justificantes.</p>
        </div>
    `;
}

function cargarVacacionesRh() {
    document.getElementById('app-container').innerHTML = `
        <div class="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm animate-fade-in">
            <h3 class="font-black text-stone-800 text-lg mb-2">🏖️ Solicitudes de Vacaciones y Permisos</h3>
            <p class="text-xs text-stone-500">Calendario de descansos y control de días económicos disponibles.</p>
        </div>
    `;
}

function cargarCapacitacionRh() {
    document.getElementById('app-container').innerHTML = `
        <div class="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm animate-fade-in">
            <h3 class="font-black text-stone-800 text-lg mb-2">📚 Programas de Capacitación</h3>
            <p class="text-xs text-stone-500">Cursos, talleres y constancias de desarrollo profesional para el personal.</p>
        </div>
    `;
}

function cargarExpedientesRh() {
    document.getElementById('app-container').innerHTML = `
        <div class="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm animate-fade-in">
            <h3 class="font-black text-stone-800 text-lg mb-2">📁 Expedientes Digitales</h3>
            <p class="text-xs text-stone-500">Documentación oficial, contratos y resguardos de los trabajadores.</p>
        </div>
    `;
}

function cargarGenerarOficiosRh() {
    document.getElementById('app-container').innerHTML = `
        <div class="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm animate-fade-in">
            <h3 class="font-black text-stone-800 text-lg mb-2">✍️ Generación de Oficios - Recursos Humanos</h3>
            <p class="text-xs text-stone-500 mb-4">Elaboración de constancias laborales, comisiones y avisos internos.</p>
            <div class="p-4 bg-stone-50 rounded-xl border border-dashed border-stone-300 text-xs text-stone-400 text-center">
                Aquí irá el formulario o generador de documentos específico para RH.
            </div>
        </div>
    `;
}