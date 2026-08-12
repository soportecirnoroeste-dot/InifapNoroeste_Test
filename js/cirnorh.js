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

// Nueva Función de Bienvenida Específica para Recursos Humanos
function cargarBienvenidaRh() {
    const nombreUsuario = localStorage.getItem('session_userName') || 'Usuario'; // Obtenemos el nombre del usuario del localStorage
    document.getElementById('app-container').innerHTML = `
        <div class="bg-white rounded-2xl p-8 border border-stone-200 shadow-sm animate-fade-in">
            <div class="flex items-center gap-4 mb-6 pb-6 border-b border-stone-100">
                <img src="img/logo_rh.svg" alt="Logo RH" class="w-16 h-16 opacity-75"> <!-- Puedes añadir un logo representativo aquí -->
                <div>
                    <h2 class="font-black text-stone-900 text-2xl mb-1">👋 ¡Bienvenido/a, ${nombreUsuario}!</h2>
                    <p class="text-sm text-stone-600 max-w-xl">Te encuentras en el portal del Departamento de Recursos Humanos (CIRNORH). Selecciona una de las opciones en el menú superior para comenzar a gestionar la información del personal.</p>
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

// Funciones de visualización existentes (sin cambios)...
function cargarPersonalRh() { /* ... */ }
function cargarAsistenciaRh() { /* ... */ }
function cargarVacacionesRh() { /* ... */ }
function cargarCapacitacionRh() { /* ... */ }
function cargarExpedientesRh() { /* ... */ }
function cargarGenerarOficiosRh() { /* ... */ }