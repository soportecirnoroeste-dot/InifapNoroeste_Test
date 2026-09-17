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

// 1. VISTA INICIAL: Listado del Personal para configurar permisos
function cargarPermisosSis() {
    renderizarVistaModuloSis('permisos', "Selecciona un colaborador para administrar su matriz de accesos por módulos y submódulos.");
    
    const contenedorDinamico = document.getElementById('contenido-submodulo-dinamico');
    if (contenedorDinamico) {
        contenedorDinamico.className = "col-span-1 sm:col-span-2 md:col-span-3 space-y-4";
        contenedorDinamico.innerHTML = `
            <div class="flex flex-col md:flex-row justify-between items-center gap-4 bg-stone-50 p-4 rounded-xl border border-stone-200">
                <div class="w-full md:w-1/3">
                    <input type="text" placeholder="Buscar colaborador..." class="w-full bg-white border border-stone-200 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#249444]">
                </div>
                <div class="text-xs text-stone-500 font-medium">
                    Mostrando personal activo del departamento de sistemas
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <!-- Tarjeta de Ejemplo Colaborador 1 -->
                <div class="bg-white border border-stone-200 rounded-xl p-4 flex items-center justify-between shadow-sm hover:border-[#249444] transition-all">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-full bg-[#f0fdf4] text-[#059669] font-bold flex items-center justify-center border border-[#c6f6d5] text-sm">
                            EG
                        </div>
                        <div>
                            <h4 class="font-bold text-stone-800 text-xs uppercase">Elías González</h4>
                            <p class="text-[11px] text-stone-500">Administrador de Redes</p>
                            <span class="inline-block mt-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-md">Rol: Administrador</span>
                        </div>
                    </div>
                    <button onclick="abrirMatrizPermisosUsuario(' González', 'Administrador')" class="bg-stone-100 hover:bg-[#249444] hover:text-white text-stone-700 p-2.5 rounded-xl transition-all text-xs font-bold flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a10 10 0 1 0 7.54 16.63"/><path d="M12 6v6l4 2"/></svg>
                        Permisos
                    </button>
                </div>

                <!-- Tarjeta de Ejemplo Colaborador 2 -->
                <div class="bg-white border border-stone-200 rounded-xl p-4 flex items-center justify-between shadow-sm hover:border-[#249444] transition-all">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-full bg-stone-100 text-stone-600 font-bold flex items-center justify-center border border-stone-200 text-sm">
                            JR
                        </div>
                        <div>
                            <h4 class="font-bold text-stone-800 text-xs uppercase">Juan Ruiz</h4>
                            <p class="text-[11px] text-stone-500">Soporte Técnico</p>
                            <span class="inline-block mt-1 bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-md">Rol: Soporte</span>
                        </div>
                    </div>
                    <button onclick="abrirMatrizPermisosUsuario('Juan Ruiz', 'Soporte Técnico')" class="bg-stone-100 hover:bg-[#249444] hover:text-white text-stone-700 p-2.5 rounded-xl transition-all text-xs font-bold flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a10 10 0 1 0 7.54 16.63"/><path d="M12 6v6l4 2"/></svg>
                        Permisos
                    </button>
                </div>
            </div>
        `;
    }
}

// 2. VISTA DETALLE: Matriz de Control de Acceso por Módulos y Submódulos para el usuario seleccionado
function abrirMatrizPermisosUsuario(nombreColaborador, rolActual) {
    const contenedorDinamico = document.getElementById('contenido-submodulo-dinamico');
    if (contenedorDinamico) {
        contenedorDinamico.className = "col-span-1 sm:col-span-2 md:col-span-3 space-y-6 animate-fade-in";
        contenedorDinamico.innerHTML = `
            <div class="bg-stone-50 border border-stone-200 rounded-xl p-4 flex flex-col md:flex-row justify-between items-center gap-4">
                <div class="flex items-center gap-3">
                    <button onclick="cargarPermisosSis()" class="p-2 bg-white border border-stone-200 hover:bg-stone-100 text-stone-600 rounded-xl transition-all flex items-center justify-center" title="Regresar al listado">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                    </button>
                    <div>
                        <h4 class="font-bold text-stone-800 text-sm">Configurando Permisos para: <span class="text-[#249444]">${nombreColaborador}</span> (${rolActual})</h4>
                        <p class="text-xs text-stone-500">Habilita o deshabilita el acceso específico por Módulos Principales y sus Submódulos complementarios.</p>
                    </div>
                </div>
                <div class="flex items-center gap-2">
                    <button onclick="cargarPermisosSis()" class="bg-stone-200 hover:bg-stone-300 text-stone-700 text-xs font-bold px-4 py-2.5 rounded-xl transition-all">
                        Cancelar
                    </button>
                    <button onclick="guardarMatrizPermisosSis()" class="bg-[#249444] hover:bg-[#1e7a37] text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-sm flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
                        Guardar Cambios
                    </button>
                </div>
            </div>

            <div class="overflow-x-auto border border-stone-200 rounded-xl">
                <table class="w-full text-left border-collapse text-xs">
                    <thead>
                        <tr class="bg-stone-100 text-stone-600 font-bold border-b border-stone-200">
                            <th class="p-3">MÓDULO PRINCIPAL / SUBMÓDULO</th>
                            <th class="p-3 text-center">VER / LEER</th>
                            <th class="p-3 text-center">CREAR / EDITAR</th>
                            <th class="p-3 text-center">ELIMINAR</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-stone-200 text-stone-700">
                        <!-- Módulo 1: Sistemas -->
                        <tr class="bg-stone-100/70 font-bold text-stone-800">
                            <td class="p-3 uppercase tracking-wider" colspan="4">📁 Módulo Principal: Sistemas</td>
                        </tr>
                        <tr>
                            <td class="p-3 pl-6 font-medium">↳ Reuniones de Sistemas</td>
                            <td class="p-3 text-center"><input type="checkbox" checked class="accent-[#249444] w-4 h-4 cursor-pointer"></td>
                            <td class="p-3 text-center"><input type="checkbox" checked class="accent-[#249444] w-4 h-4 cursor-pointer"></td>
                            <td class="p-3 text-center"><input type="checkbox" class="accent-[#249444] w-4 h-4 cursor-pointer"></td>
                        </tr>
                        <tr class="bg-stone-50/50">
                            <td class="p-3 pl-6 font-medium">↳ Contraseñas y Credenciales</td>
                            <td class="p-3 text-center"><input type="checkbox" checked class="accent-[#249444] w-4 h-4 cursor-pointer"></td>
                            <td class="p-3 text-center"><input type="checkbox" class="accent-[#249444] w-4 h-4 cursor-pointer"></td>
                            <td class="p-3 text-center"><input type="checkbox" disabled class="accent-[#249444] w-4 h-4 opacity-50 cursor-not-allowed"></td>
                        </tr>
                        <tr>
                            <td class="p-3 pl-6 font-medium">↳ Licenciamiento de Software</td>
                            <td class="p-3 text-center"><input type="checkbox" checked class="accent-[#249444] w-4 h-4 cursor-pointer"></td>
                            <td class="p-3 text-center"><input type="checkbox" checked class="accent-[#249444] w-4 h-4 cursor-pointer"></td>
                            <td class="p-3 text-center"><input type="checkbox" checked class="accent-[#249444] w-4 h-4 cursor-pointer"></td>
                        </tr>
                        <tr class="bg-stone-50/50">
                            <td class="p-3 pl-6 font-medium">↳ Inventarios de Cómputo</td>
                            <td class="p-3 text-center"><input type="checkbox" checked class="accent-[#249444] w-4 h-4 cursor-pointer"></td>
                            <td class="p-3 text-center"><input type="checkbox" checked class="accent-[#249444] w-4 h-4 cursor-pointer"></td>
                            <td class="p-3 text-center"><input type="checkbox" checked class="accent-[#249444] w-4 h-4 cursor-pointer"></td>
                        </tr>
                        <tr>
                            <td class="p-3 pl-6 font-medium">↳ Formatos Oficiales</td>
                            <td class="p-3 text-center"><input type="checkbox" checked class="accent-[#249444] w-4 h-4 cursor-pointer"></td>
                            <td class="p-3 text-center"><input type="checkbox" checked class="accent-[#249444] w-4 h-4 cursor-pointer"></td>
                            <td class="p-3 text-center"><input type="checkbox" class="accent-[#249444] w-4 h-4 cursor-pointer"></td>
                        </tr>

                        <!-- Módulo 2: Configuración y Seguridad -->
                        <tr class="bg-stone-100/70 font-bold text-stone-800">
                            <td class="p-3 uppercase tracking-wider" colspan="4">📁 Módulo Principal: Administración del Sistema</td>
                        </tr>
                        <tr>
                            <td class="p-3 pl-6 font-medium">↳ Módulo de Permisos y Accesos</td>
                            <td class="p-3 text-center"><input type="checkbox" disabled class="accent-[#249444] w-4 h-4 opacity-50 cursor-not-allowed"></td>
                            <td class="p-3 text-center"><input type="checkbox" disabled class="accent-[#249444] w-4 h-4 opacity-50 cursor-not-allowed"></td>
                            <td class="p-3 text-center"><input type="checkbox" disabled class="accent-[#249444] w-4 h-4 opacity-50 cursor-not-allowed"></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        `;
    }
}

function guardarMatrizPermisosSis() {
    alert("¡Permisos del colaborador actualizados correctamente!");
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