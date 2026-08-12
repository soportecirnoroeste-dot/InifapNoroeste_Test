// js/cirnodirad.js
window.cirnodiradConfig = {
    deptoKey: "cirnodirad",
    title: "Dirección Regional",
    subtitle: "Supervisión general, toma de decisiones estratégicas y vinculación institucional.",
    options: [
        { id: "dashboard", title: "Resumen", icon: "📊", action: "cargarDashboardDir()" },
        { id: "proyectos", title: "Proyectos", icon: "🚀", action: "cargarProyectosDir()" },
        { id: "agenda", title: "Agenda", icon: "📅", action: "cargarAgendaDir()" },
        { id: "reportes", title: "Reportes", icon: "📈", action: "cargarReportesDir()" },
        { id: "normativa", title: "Normativa", icon: "⚖️", action: "cargarNormativaDir()" },
        { id: "generar-oficios", title: "Generar Oficios", icon: "✍️", action: "cargarGenerarOficiosDir()" } // <-- Opción añadida
    ]
};

// Funciones de visualización específicas de la Dirección Regional
function cargarDashboardDir() {
    document.getElementById('app-container').innerHTML = `
        <div class="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm animate-fade-in">
            <h3 class="font-black text-stone-800 text-lg mb-2">📊 Resumen Ejecutivo y Estadísticas</h3>
            <p class="text-xs text-stone-500">Indicadores clave de desempeño y estatus general de la región.</p>
        </div>
    `;
}

function cargarProyectosDir() {
    document.getElementById('app-container').innerHTML = `
        <div class="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm animate-fade-in">
            <h3 class="font-black text-stone-800 text-lg mb-2">🚀 Proyectos Estratégicos</h3>
            <p class="text-xs text-stone-500">Seguimiento y avances de los proyectos prioritarios de investigación y operación.</p>
        </div>
    `;
}

function cargarAgendaDir() {
    document.getElementById('app-container').innerHTML = `
        <div class="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm animate-fade-in">
            <h3 class="font-black text-stone-800 text-lg mb-2">📅 Agenda Institucional</h3>
            <p class="text-xs text-stone-500">Calendario de eventos, juntas directivas y compromisos de la dirección.</p>
        </div>
    `;
}

function cargarReportesDir() {
    document.getElementById('app-container').innerHTML = `
        <div class="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm animate-fade-in">
            <h3 class="font-black text-stone-800 text-lg mb-2">📈 Reportes Gerenciales</h3>
            <p class="text-xs text-stone-500">Generación y consulta de informes consolidados para oficinas centrales.</p>
        </div>
    `;
}

function cargarNormativaDir() {
    document.getElementById('app-container').innerHTML = `
        <div class="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm animate-fade-in">
            <h3 class="font-black text-stone-800 text-lg mb-2">⚖️ Normativa y Lineamientos</h3>
            <p class="text-xs text-stone-500">Políticas internas, manuales de procedimientos y marcos legales de operación.</p>
        </div>
    `;
}

// Función estándar para la vista de generar oficios en Dirección
function cargarGenerarOficiosDir() {
    document.getElementById('app-container').innerHTML = `
        <div class="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm animate-fade-in">
            <h3 class="font-black text-stone-800 text-lg mb-2">✍️ Generación de Oficios - Dirección Regional</h3>
            <p class="text-xs text-stone-500 mb-4">Elaboración y emisión de documentos oficiales firmados por la dirección.</p>
            <div class="p-4 bg-stone-50 rounded-xl border border-dashed border-stone-300 text-xs text-stone-400 text-center">
                Aquí irá el formulario o generador de documentos específico para Dirección.
            </div>
        </div>
    `;
}