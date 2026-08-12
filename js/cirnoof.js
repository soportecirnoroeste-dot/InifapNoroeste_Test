// js/oficios.js
window.cirnoofConfig = {
    deptoKey: "oficios",
    subtitle: "Control centralizado de correspondencia, folios y documentación oficial.",
    options: [
        { id: "recibidos", title: "Recibidos", icon: "📥", action: "cargarRecibidosOfiGen()" },
        { id: "emitidos", title: "Emitidos", icon: "📤", action: "cargarEmitidosOfiGen()" },
        { id: "pendientes", title: "Pendientes", icon: "⏳", action: "cargarPendientesOfiGen()" },
        { id: "busqueda", title: "Buscar Folio", icon: "🔍", action: "cargarBusquedaOfiGen()" },
        { id: "nuevo", title: "Nuevo Oficio", icon: "➕", action: "cargarNuevoOfiGen()" }
    ]
};

// Función de Bienvenida Específica para Oficios / Oficialía
function cargarBienvenidaOfiGen() {
    const nombreUsuario = localStorage.getItem('session_userName') || 'Usuario';
    document.getElementById('app-container').innerHTML = `
        <div class="bg-white rounded-2xl p-8 border border-stone-200 shadow-sm animate-fade-in">
            <div class="flex items-center gap-4 mb-6 pb-6 border-b border-stone-100">
                <div class="p-3 bg-stone-100 rounded-2xl text-2xl">✍️</div>
                <div>
                    <h2 class="font-black text-stone-900 text-2xl mb-1">👋 ¡Bienvenido/a, ${nombreUsuario}!</h2>
                    <p class="text-sm text-stone-600 max-w-xl">Te encuentras en el portal de Control de Correspondencia y Oficios (CIRNOOF). Selecciona una opción en el menú superior para comenzar.</p>
                </div>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div class="p-5 bg-[#f0fdf4] rounded-xl border border-[#c6f6d5]">
                    <h4 class="font-bold text-[#059669] text-sm mb-1.5">Control de Folios</h4>
                    <p class="text-xs text-stone-700">Gestiona de forma centralizada la recepción y salida de correspondencia oficial.</p>
                </div>
                <div class="p-5 bg-[#fffbeb] rounded-xl border border-[#fef3c7]">
                    <h4 class="font-bold text-[#d97706] text-sm mb-1.5">Seguimiento Oportuno</h4>
                    <p class="text-xs text-stone-700">Revisa turnos, pendientes y documentos en proceso por cada área de la institución.</p>
                </div>
                <div class="p-5 bg-[#eff6ff] rounded-xl border border-[#bfdbfe]">
                    <h4 class="font-bold text-[#2563eb] text-sm mb-1.5">Búsqueda Rápida</h4>
                    <p class="text-xs text-stone-700">Localiza expedientes y oficios al instante mediante filtros por número, emisor o asunto.</p>
                </div>
            </div>
            <p class="mt-6 text-xs text-stone-400 italic text-center">Última actualización de datos: ${new Date().toLocaleDateString()}</p>
        </div>
    `;
}

// Funciones de visualización específicas del módulo de Oficios
function cargarRecibidosOfiGen() {
    document.getElementById('app-container').innerHTML = `
        <div class="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm animate-fade-in">
            <h3 class="font-black text-stone-800 text-lg mb-2">📥 Oficios Recibidos</h3>
            <p class="text-xs text-stone-500">Listado general de documentos oficiales ingresados a la institución.</p>
        </div>
    `;
}

function cargarEmitidosOfiGen() {
    document.getElementById('app-container').innerHTML = `
        <div class="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm animate-fade-in">
            <h3 class="font-black text-stone-800 text-lg mb-2">📤 Oficios Emitidos</h3>
            <p class="text-xs text-stone-500">Registro y seguimiento de salidas de correspondencia y circulares.</p>
        </div>
    `;
}

function cargarPendientesOfiGen() {
    document.getElementById('app-container').innerHTML = `
        <div class="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm animate-fade-in">
            <h3 class="font-black text-stone-800 text-lg mb-2">⏳ Oficios en Proceso / Pendientes</h3>
            <p class="text-xs text-stone-500">Seguimiento de turnos y respuestas pendientes por área.</p>
        </div>
    `;
}

function cargarBusquedaOfiGen() {
    document.getElementById('app-container').innerHTML = `
        <div class="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm animate-fade-in">
            <h3 class="font-black text-stone-800 text-lg mb-2">🔍 Búsqueda Avanzada de Folios</h3>
            <p class="text-xs text-stone-500">Localiza rápidamente documentos por número de folio, emisor o asunto.</p>
        </div>
    `;
}

function cargarNuevoOfiGen() {
    document.getElementById('app-container').innerHTML = `
        <div class="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm animate-fade-in">
            <h3 class="font-black text-stone-800 text-lg mb-2">➕ Registrar Nuevo Oficio</h3>
            <p class="text-xs text-stone-500">Formulario de captura para alta y asignación de folios oficiales.</p>
        </div>
    `;
}