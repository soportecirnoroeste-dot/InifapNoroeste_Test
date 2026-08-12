// js/cirnorh.js
window.cirnorhConfig = {
    deptoKey: "cirnorh",
    title: "Departamento de Recursos Humanos",
    subtitle: "Gestión de personal, incidencias, nómina y desarrollo humano.",
    options: [
        { id: "personal", title: "Personal", icon: "👥", action: "cargarPersonalRh()" },
        { id: "asistencia", title: "Asistencia", icon: "⏱️", action: "cargarAsistenciaRh()" },
        { id: "vacaciones", title: "Vacaciones", icon: "🏖️", action: "cargarVacacionesRh()" },
        { id: "capacitacion", title: "Capacitación", icon: "📚", action: "cargarCapacitacionRh()" },
        { id: "expedientes", title: "Expedientes", icon: "📁", action: "cargarExpedientesRh()" }
    ]
};

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