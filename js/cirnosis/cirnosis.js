// js/cirnosis.js
window.cirnosisConfig = {
    deptoKey: "cirnosis",
    subtitle: "Gestión de infraestructura tecnológica, redes y soporte técnico.",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-file-terminal"><path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"/><path d="M14 2v5a1 1 0 0 0 1 1h5"/><path d="m8 16 2-2-2-2"/><path d="M12 18h4"/></svg>`,
    options: [
        { 
            id: "reuniones", 
            title: "Reuniones", 
            icon: "<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M8 2v4'/><path d='M16 2v4'/><rect width='18' height='18' x='3' y='4' rx='2'/><path d='M3 10h18'/></svg>", 
            action: "cargarReunionesSis()" 
        },
        { 
            id: "contrasenias", 
            title: "Contraseñas", 
            icon: "<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><rect width='18' height='11' x='3' y='11' rx='2' ry='2'/><path d='M7 11V7a5 5 0 0 1 10 0v4'/></svg>", 
            action: "cargarContraseniasSis()" 
        },
        { 
            id: "licencias", 
            title: "Licencias", 
            icon: "<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10'/></svg>", 
            action: "cargarLicenciasSis()" 
        },
        { 
            id: "inventarios", 
            title: "Inventarios", 
            icon: "<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><rect width='20' height='14' x='2' y='3' rx='2'/><line x1='8' x2='16' y1='21' y2='21'/><line x1='12' x2='12' y1='17' y2='21'/></svg>", 
            action: "cargarInventariosSis()" 
        },
        { 
            id: "formatos", 
            title: "Formatos Of.", 
            icon: "<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z'/><path d='M14 2v5a1 1 0 0 0 1 1h5'/><path d='M10 9H8'/><path d='M16 13H8'/><path d='M16 17H8'/></svg>", 
            action: "cargarFormatosSis()" 
        }
    ]
};

function obtenerContenedor() {
    return document.getElementById('app-container') || document.querySelector('main') || document.body;
}

function cargarReunionesSis() {
    renderizarVistaModuloSis('reuniones', "Registro y minuta de juntas del departamento de sistemas.");
}

function cargarContraseniasSis() {
    renderizarVistaModuloSis('contrasenias', "Gestión segura de credenciales institucionales de servidores y sistemas.");
}

function cargarLicenciasSis() {
    renderizarVistaModuloSis('licencias', "Inventario de licencias activas, fechas de expiración y costos.");
}

function cargarInventariosSis() {
    renderizarVistaModuloSis('inventarios', "Listado general de equipos de cómputo asignados por área.");
}

function cargarFormatosSis() {
    renderizarVistaModuloSis('formatos', "Descarga de formatos de resguardo, altas y reportes técnicos.");
}

function renderizarVistaModuloSis(idOpt, descripcion) {
    const nombreCortoActual = localStorage.getItem('depto_activo_actual') || 'cirnosis';
    const configActual = window[nombreCortoActual + 'Config'];
    
    const opt = configActual ? configActual.options.find(o => o.id === idOpt) : null;
    const contenedor = obtenerContenedor();
    
    if (contenedor && opt) {
        if (typeof window.actualizarBotonRegresar === 'function') {
            window.actualizarBotonRegresar('submodulo', nombreCortoActual);
        }

        contenedor.innerHTML = `
            <section class="bg-white rounded-2xl p-6 md:p-8 soft-shadow border border-[#249444]/10 mb-8 animate-fade-in">
                <div class="flex items-center gap-3 mb-6 pb-4 border-b border-stone-100">
                    <div class="p-2.5 bg-[#f0fdf4] border border-[#c6f6d5] text-[#059669] rounded-xl flex items-center justify-center">
                        ${opt.icon}
                    </div>
                    <div>
                        <h3 class="font-black text-stone-800 text-lg uppercase tracking-wide">${opt.title} - Sistemas</h3>
                        <p class="text-xs text-stone-500">${descripcion}</p>
                    </div>
                </div>

                <div id="contenido-submodulo-dinamico" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    <!-- Contenido del submódulo -->
                </div>
            </section>
        `;
    }
}
