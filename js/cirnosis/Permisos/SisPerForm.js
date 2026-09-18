// ==========================================
// js/SisPer/SisPerForm.js
// ==========================================

const CATALOGO_MODULOS_SISTEMA = [
    {
        modulo: "DIRECCIÓN REGIONAL",
        submodulos: ["PANEL GENERAL", "INFORMES Y REPORTES", "DIRECTORIOS"]
    },
    {
        modulo: "DIRECCIÓN DE INVESTIGACIÓN",
        submodulos: ["PROYECTOS DE INVESTIGACIÓN", "AVANCES Y EVALUACIONES", "CATÁLOGO DE INVESTIGADORES"]
    },
    {
        modulo: "DIRECCIÓN DE ADMINISTRACIÓN",
        submodulos: ["CONTROL ADMINISTRATIVO", "RECURSOS Y PRESUPUESTO", "NORMATIVA INTERNA"]
    },
    {
        modulo: "RECURSOS FINANCIEROS",
        submodulos: ["PRESUPUESTOS", "COMPROBACIÓN DE GASTOS", "ESTADOS FINANCIEROS"]
    },
    {
        modulo: "RECURSOS HUMANOS",
        submodulos: ["EXPEDIENTES DE PERSONAL", "ASISTENCIA Y BIOMETRÍA", "VACACIONES Y PERMISOS"]
    },
    {
        modulo: "RECURSOS MATERIALES",
        submodulos: ["INVENTARIO DE ACTIVOS", "RESGUARDOS", "SOLICITUDES DE MATERIAL"]
    },
    {
        modulo: "SISTEMAS",
        submodulos: ["REUNIONES DE SISTEMAS", "CONTRASEÑAS Y CREDENCIALES", "LICENCIAMIENTO DE SOFTWARE", "INVENTARIOS DE CÓMPUTO", "FORMATOS OFICIALES"]
    },
    {
        modulo: "OFICIALÍA",
        submodulos: ["CORRESPONDENCIA RECIBIDA", "CORRESPONDENCIA ENVIADA", "GESTIÓN DE OFICIOS"]
    },
    {
        modulo: "INVESTIGACIÓN",
        submodulos: ["CENTROS DE TRABAJO", "PROGRAMAS DE ESTUDIO", "PUBLICACIONES"]
    },
    {
        modulo: "ADMINISTRACIÓN DEL SISTEMA",
        submodulos: ["MÓDULO DE PERMISOS Y ACCESOS", "CATÁLOGOS DEL SISTEMA", "AUDITORÍA Y LOGS"]
    }
];

function abrirMatrizPermisosUsuario(nombreColaborador, noEmp) {
    const contenedorDinamico = document.getElementById('contenido-submodulo-dinamico');
    if (contenedorDinamico) {
        contenedorDinamico.className = "col-span-1 sm:col-span-2 md:col-span-3 space-y-6 animate-fade-in";
        
        let filasHTML = "";
        CATALOGO_MODULOS_SISTEMA.forEach((grupo, idxMod) => {
            filasHTML += `
                <tr class="bg-stone-50 font-bold text-stone-800 border-t border-stone-200">
                    <td class="p-3 pl-4 uppercase tracking-wider" colspan="4">📁 Módulo Principal: ${grupo.modulo}</td>
                </tr>
            `;

            grupo.submodulos.forEach((sub, idxSub) => {
                filasHTML += `
                    <tr class="hover:bg-stone-50 transition-all border-b border-stone-100">
                        <td class="p-3 pl-8 font-medium text-stone-600">↳ ${sub}</td>
                        <td class="p-3 text-center"><input type="checkbox" data-modulo="${grupo.modulo}" data-submodulo="${sub}" data-tipo="ver" class="accent-[#249444] w-4 h-4 cursor-pointer chk-permiso" checked></td>
                        <td class="p-3 text-center"><input type="checkbox" data-modulo="${grupo.modulo}" data-submodulo="${sub}" data-tipo="editar" class="accent-[#249444] w-4 h-4 cursor-pointer chk-permiso" checked></td>
                        <td class="p-3 text-center pr-4"><input type="checkbox" data-modulo="${grupo.modulo}" data-submodulo="${sub}" data-tipo="eliminar" class="accent-[#249444] w-4 h-4 cursor-pointer chk-permiso"></td>
                    </tr>
                `;
            });
        });

        contenedorDinamico.innerHTML = `
            <!-- Contenedor con el formato exacto de tarjeta institucional (igual a la vista de Personal) -->
            <div class="bg-white rounded-2xl border border-stone-200 shadow-sm p-6 space-y-6">
                
                <!-- Encabezado con título de edición -->
                <div class="border-b border-stone-100 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <div class="flex items-center gap-2 text-[#249444] font-bold text-sm mb-1">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                            MATRIZ DE ACCESO Y PRIVILEGIOS
                        </div>
                        <p class="text-xs text-stone-500">Editando permisos para: <span class="font-bold text-stone-800">${nombreColaborador}</span> (No. Empleado: ${noEmp})</p>
                    </div>
                    <div class="flex items-center gap-2">
                        <span class="text-xs bg-stone-100 text-stone-600 font-semibold px-3 py-1.5 rounded-lg">Sistema Regional Interno</span>
                    </div>
                </div>

                <!-- Tabla de Módulos y Permisos con Scroll -->
                <div class="rounded-xl border border-stone-200 overflow-hidden">
                    <div class="max-h-[500px] overflow-y-auto custom-scrollbar">
                        <table class="w-full text-left border-collapse text-xs">
                            <thead class="sticky top-0 z-10 bg-stone-100">
                                <tr class="text-stone-600 font-bold border-b border-stone-200 text-[11px]">
                                    <th class="p-3 pl-4">MÓDULO PRINCIPAL / SUBMÓDULO</th>
                                    <th class="p-3 text-center">VER / LEER</th>
                                    <th class="p-3 text-center">CREAR / EDITAR</th>
                                    <th class="p-3 text-center pr-4">ELIMINAR</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-stone-100 text-stone-700">
                                ${filasHTML}
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Botones de Acción inferiores (Guardar / Cancelar) -->
                <div class="flex items-center gap-3 pt-2">
                    <button onclick="guardarMatrizPermisosSis('${noEmp}')" class="bg-[#249444] hover:bg-[#1e7a37] text-white text-xs font-bold px-6 py-2.5 rounded-xl transition-all shadow-sm flex items-center gap-2">
                        Guardar
                    </button>
                    <button onclick="cargarPermisosSis()" class="bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold px-6 py-2.5 rounded-xl transition-all">
                        Cancelar
                    </button>
                </div>

            </div>
        `;
    }
}

async function guardarMatrizPermisosSis(noEmp) {
    const checkboxes = document.querySelectorAll('.chk-permiso');
    const permisosEstructura = {};

    checkboxes.forEach(chk => {
        const modulo = chk.getAttribute('data-modulo');
        const submodulo = chk.getAttribute('data-submodulo');
        const tipo = chk.getAttribute('data-tipo');

        if (!permisosEstructura[modulo]) {
            permisosEstructura[modulo] = {};
        }
        if (!permisosEstructura[modulo][submodulo]) {
            permisosEstructura[modulo][submodulo] = { ver: 0, editar: 0, eliminar: 0 };
        }

        permisosEstructura[modulo][submodulo][tipo] = chk.checked ? 1 : 0;
    });

    const payload = {
        numEmp: noEmp,
        permisos: permisosEstructura
    };

    try {
        if (typeof FetchAPI === 'function') {
            await FetchAPI('guardarPermisos', payload);
        } else if (typeof google !== 'undefined' && google.script && google.script.run) {
            await new Promise((resolve, reject) => {
                google.script.run
                    .withSuccessHandler(resolve)
                    .withFailureHandler(reject)
                    .guardarPermisosEnSheet(payload);
            });
        }

        alert("¡Permisos actualizados correctamente para el colaborador!");
        cargarPermisosSis();
    } catch (err) {
        console.error("Error al guardar permisos:", err);
        alert("Error al guardar los permisos: " + (err.message || err));
    }
}