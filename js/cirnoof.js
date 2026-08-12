// js/oficios.js
window.cirnoofConfig = {
    deptoKey: "oficios",
    title: "Oficios",
    subtitle: "Control centralizado de correspondencia, folios y documentación oficial.",
    options: [
        { id: "recibidos", title: "Recibidos", icon: "📥", action: "cargarRecibidosOfiGen()" },
        { id: "emitidos", title: "Emitidos", icon: "📤", action: "cargarEmitidosOfiGen()" },
        { id: "pendientes", title: "Pendientes", icon: "⏳", action: "cargarPendientesOfiGen()" },
        { id: "busqueda", title: "Buscar Folio", icon: "🔍", action: "cargarBusquedaOfiGen()" },
        { id: "nuevo", title: "Nuevo Oficio", icon: "➕", action: "cargarNuevoOfiGen()" }
    ]
};

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