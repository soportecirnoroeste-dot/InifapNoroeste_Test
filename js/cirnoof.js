// js/cirnoof.js
window.cirnoofConfig = {
    deptoKey: "cirnoof",
    subtitle: "Control centralizado de correspondencia, folios y documentación oficial.",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-file-text"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg>`,
    options: [
        { 
            id: "recibidos", 
            title: "Recibidos", 
            icon: "<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242'/><path d='M12 12v9'/><path d='m8 17 4 4 4-4'/></svg>", 
            action: "cargarRecibidosOfiGen()" 
        },
        { 
            id: "emitidos", 
            title: "Emitidos", 
            icon: "<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242'/><path d='M12 21v-9'/><path d='m16 16-4-4-4 4'/></svg>", 
            action: "cargarEmitidosOfiGen()" 
        },
        { 
            id: "pendientes", 
            title: "Pendientes", 
            icon: "<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><circle cx='12' cy='12' r='10'/><polyline points='12 6 12 12 16 14'/></svg>", 
            action: "cargarPendientesOfiGen()" 
        },
        { 
            id: "busqueda", 
            title: "Buscar Folio", 
            icon: "<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><circle cx='11' cy='11' r='8'/><path d='m21 21-4.3-4.3'/></svg>", 
            action: "cargarBusquedaOfiGen()" 
        },
        { 
            id: "nuevo", 
            title: "Nuevo Oficio", 
            icon: "<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M5 12h14'/><path d='M12 5v14'/></svg>", 
            action: "cargarNuevoOfiGen()" 
        }
    ]
};

function obtenerContenedor() {
    return document.getElementById('app-container') || document.querySelector('main') || document.body;
}

function cargarRecibidosOfiGen() {
    renderizarVistaModuloOfi('recibidos', "Listado general de documentos oficiales ingresados a la institución.");
}

function cargarEmitidosOfiGen() {
    renderizarVistaModuloOfi('emitidos', "Registro y seguimiento de salidas de correspondencia y circulares.");
}

function cargarPendientesOfiGen() {
    renderizarVistaModuloOfi('pendientes', "Seguimiento de turnos y respuestas pendientes por área.");
}

function cargarBusquedaOfiGen() {
    renderizarVistaModuloOfi('busqueda', "Localiza rápidamente documentos por número de folio, emisor o asunto.");
}

function cargarNuevoOfiGen() {
    renderizarVistaModuloOfi('nuevo', "Formulario de captura para alta y asignación de folios oficiales.");
}

function renderizarVistaModuloOfi(idOpt, descripcion) {
    const nombreCortoActual = localStorage.getItem('depto_activo_actual') || 'cirnoof';
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
                        <h3 class="font-black text-stone-800 text-lg uppercase tracking-wide">${opt.title} - Oficialía</h3>
                        <p class="text-xs text-stone-500">${descripcion}</p>
                    </div>
                </div>

                <div id="contenido-submodulo-dinamico" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    </div>
            </section>
        `;
    }
}