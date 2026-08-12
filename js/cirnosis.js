// En tu archivo js/cirnosis.js (sin usar const para que no marque error si se reescribe)
window.cirnosisConfig = {
    deptoKey: "cirnosis",
    title: "Sistemas",
    subtitle: "Gestión de infraestructura tecnológica, redes y soporte técnico.",
    options: [
        { id: "reuniones", title: "Reuniones", icon: "📅", action: "cargarReunionesSis()" },
        { id: "contrasenias", title: "Contraseñas", icon: "🔑", action: "cargarContraseniasSis()" },
        { id: "licencias", title: "Licencias", icon: "🛡️", action: "cargarLicenciasSis()" },
        { id: "inventarios", title: "Inventarios", icon: "💻", action: "cargarInventariosSis()" },
        { id: "formatos", title: "Formatos Of.", icon: "📄", action: "cargarFormatosSis()" }
    ]
}
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