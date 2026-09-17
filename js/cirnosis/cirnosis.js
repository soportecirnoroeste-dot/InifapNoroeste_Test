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
        },
        { 
            id: "permisos", 
            title: "Permisos", 
            icon: "<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' class='lucide lucide-user-round-key'><path d='M19 11v6'/><path d='M19 13h2'/><path d='M2 21a8 8 0 0 1 12.868-6.349'/><circle cx='10' cy='8' r='5'/><circle cx='19' cy='19' r='2'/></svg>", 
            action: "cargarPermisosSis()" 
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

// PUENTE: Conecta el menú de cirnosis con la lógica avanzada de SisPerCore.js
function cargarPermisosSis() {
    if (typeof window.renderizarListadoPermisosSis === 'function') {
        window.renderizarListadoPermisosSis();
    } else {
        console.error("No se encontró la función renderizarListadoPermisosSis en SisPerCore.js");
    }
}