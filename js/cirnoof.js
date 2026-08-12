// js/oficialia.js
window.cirnoofConfig = {
    deptoKey: "oficialia",
    title: "Oficialía Mayor",
    subtitle: "Gestión de recursos materiales, servicios generales y normatividad.",
    options: [
        { id: "oficios", title: "Oficios", icon: "📬", action: "cargarOficiosOfi()" },
        { id: "vehiculos", title: "Vehículos", icon: "🚗", action: "cargarVehiculosOfi()" },
        { id: "almacen", title: "Almacén", icon: "📦", action: "cargarAlmacenOfi()" },
        { id: "comisiones", title: "Comisiones", icon: "✈️", action: "cargarComisionesOfi()" },
        { id: "inventario", title: "Inventario", icon: "📋", action: "cargarInventarioOfi()" }
    ]
};

// Funciones de visualización específicas de Oficialía
function cargarOficiosOfi() {
    document.getElementById('app-container').innerHTML = `
        <div class="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm animate-fade-in">
            <h3 class="font-black text-stone-800 text-lg mb-2">📬 Control de Oficios y Correspondencia</h3>
            <p class="text-xs text-stone-500">Recepción, despacho y seguimiento de documentos oficiales.</p>
        </div>
    `;
}

function cargarVehiculosOfi() {
    document.getElementById('app-container').innerHTML = `
        <div class="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm animate-fade-in">
            <h3 class="font-black text-stone-800 text-lg mb-2">🚗 Asignación de Vehículos</h3>
            <p class="text-xs text-stone-500">Bitácoras de uso, solicitudes de transporte y mantenimiento vehicular.</p>
        </div>
    `;
}

function cargarAlmacenOfi() {
    document.getElementById('app-container').innerHTML = `
        <div class="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm animate-fade-in">
            <h3 class="font-black text-stone-800 text-lg mb-2">📦 Control de Almacén y Suministros</h3>
            <p class="text-xs text-stone-500">Entradas, salidas y stock de papelería y materiales generales.</p>
        </div>
    `;
}

function cargarComisionesOfi() {
    document.getElementById('app-container').innerHTML = `
        <div class="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm animate-fade-in">
            <h3 class="font-black text-stone-800 text-lg mb-2">✈️ Viáticos y Comisiones</h3>
            <p class="text-xs text-stone-500">Gestión y comprobación de viáticos para el personal.</p>
        </div>
    `;
}

function cargarInventarioOfi() {
    document.getElementById('app-container').innerHTML = `
        <div class="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm animate-fade-in">
            <h3 class="font-black text-stone-800 text-lg mb-2">📋 Inventario General de Bienes</h3>
            <p class="text-xs text-stone-500">Resguardos patrimoniales y mobiliario asignado por áreas.</p>
        </div>
    `;
}