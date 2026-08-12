// js/cirnosis.js
window.cirnosisConfig = {
    deptoKey: "cirnosis",
    subtitle: "Gestión de infraestructura tecnológica, redes y soporte técnico.",
    options: [
        { id: "reuniones", title: "Reuniones", icon: "📅", action: "cargarReunionesSis()" },
        { id: "contrasenias", title: "Contraseñas", icon: "🔑", action: "cargarContraseniasSis()" },
        { id: "licencias", title: "Licencias", icon: "🛡️", action: "cargarLicenciasSis()" },
        { id: "inventarios", title: "Inventarios", icon: "💻", action: "cargarInventariosSis()" },
        { id: "formatos", title: "Formatos Of.", icon: "📄", action: "cargarFormatosSis()" }
    ]
};

// Función de Bienvenida Específica para Sistemas
function cargarBienvenidaSis() {
    const nombreUsuario = localStorage.getItem('session_userName') || 'Usuario';
    document.getElementById('app-container').innerHTML = `
        <div class="bg-white rounded-2xl p-8 border border-stone-200 shadow-sm animate-fade-in">
            <div class="flex items-center gap-4 mb-6 pb-6 border-b border-stone-100">
                <div class="p-3 bg-stone-100 rounded-2xl text-2xl">💻</div>
                <div>
                    <h2 class="font-black text-stone-900 text-2xl mb-1">👋 ¡Bienvenido/a, ${nombreUsuario}!</h2>
                    <p class="text-sm text-stone-600 max-w-xl">Te encuentras en el portal del Departamento de Sistemas (CIRNOSIS). Selecciona una opción en el menú superior para administrar la infraestructura tecnológica.</p>
                </div>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div class="p-5 bg-[#f0fdf4] rounded-xl border border-[#c6f6d5]">
                    <h4 class="font-bold text-[#059669] text-sm mb-1.5">Infraestructura y Redes</h4>
                    <p class="text-xs text-stone-700">Control de equipos de cómputo, inventarios de hardware y licencias activas.</p>
                </div>
                <div class="p-5 bg-[#fffbeb] rounded-xl border border-[#fef3c7]">
                    <h4 class="font-bold text-[#d97706] text-sm mb-1.5">Seguridad y Accesos</h4>
                    <p class="text-xs text-stone-700">Gestión segura de credenciales institucionales y bitácoras de juntas.</p>
                </div>
                <div class="p-5 bg-[#eff6ff] rounded-xl border border-[#bfdbfe]">
                    <h4 class="font-bold text-[#2563eb] text-sm mb-1.5">Soporte y Formatos</h4>
                    <p class="text-xs text-stone-700">Acceso rápido a formatos de resguardo, altas y reportes de atención técnica.</p>
                </div>
            </div>
            <p class="mt-6 text-xs text-stone-400 italic text-center">Última actualización de datos: ${new Date().toLocaleDateString()}</p>
        </div>
    `;
}

// Funciones de visualización específicas de Sistemas
function cargarReunionesSis() {
    document.getElementById('app-container').innerHTML = `
        <div class="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm animate-fade-in">
            <h3 class="font-black text-stone-800 text-lg mb-2">📅 Reuniones y Bitácoras - Sistemas</h3>
            <p class="text-xs text-stone-500">Registro y minuta de juntas del departamento de sistemas.</p>
        </div>
    `;
}

function cargarContraseniasSis() {
    document.getElementById('app-container').innerHTML = `
        <div class="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm animate-fade-in">
            <h3 class="font-black text-stone-800 text-lg mb-2">🔑 Control de Contraseñas y Accesos</h3>
            <p class="text-xs text-stone-500">Gestión segura de credenciales institucionales de servidores y sistemas.</p>
        </div>
    `;
}

function cargarLicenciasSis() {
    document.getElementById('app-container').innerHTML = `
        <div class="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm animate-fade-in">
            <h3 class="font-black text-stone-800 text-lg mb-2">🛡️ Control de Licencias de Software</h3>
            <p class="text-xs text-stone-500">Inventario de licencias activas, fechas de expiración y costos.</p>
        </div>
    `;
}

function cargarInventariosSis() {
    document.getElementById('app-container').innerHTML = `
        <div class="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm animate-fade-in">
            <h3 class="font-black text-stone-800 text-lg mb-2">💻 Inventario de Equipos y Hardware</h3>
            <p class="text-xs text-stone-500">Listado general de equipos de cómputo asignados por área.</p>
        </div>
    `;
}

function cargarFormatosSis() {
    document.getElementById('app-container').innerHTML = `
        <div class="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm animate-fade-in">
            <h3 class="font-black text-stone-800 text-lg mb-2">📄 Formatos Oficiales - Sistemas</h3>
            <p class="text-xs text-stone-500">Descarga de formatos de resguardo, altas y reportes técnicos.</p>
        </div>
    `;
}