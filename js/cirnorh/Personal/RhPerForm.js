// ==========================================
// js/SisPer/SisPerForm.js
// ==========================================

// Catálogo completo de módulos principales y submódulos institucionales (SISPER)
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
        
        // Construir dinámicamente las filas de la tabla usando el catálogo completo
        let filasHTML = "";
        CATALOGO_MODULOS_SISTEMA.forEach((grupo, idxMod) => {
            filasHTML += `
                <tr class="bg-stone-50/80 font-bold text-stone-800 border-t border-stone-200">
                    <td class="p-3 pl-4 uppercase tracking-wider" colspan="4">📁 MÓDULO PRINCIPAL: ${grupo.modulo}</td>
                </tr>
            `;

            grupo.submodulos.forEach((sub, idxSub) => {
                const idBase = `mod_${idxMod}_sub_${idxSub}`;
                
                filasHTML += `
                    <tr class="hover:bg-stone-50 transition-all border-b border-stone-100">
                        <td class="p-3 pl-8 font-medium text-stone-600">↳ ${sub}</td>
                        <td class="p-3 text-center"><input type="checkbox" id="${idBase}_ver" data-modulo="${grupo.modulo}" data-submodulo="${sub}" data-tipo="ver" class="accent-[#249444] w-4 h-4 cursor-pointer checkbox-permiso"></td>
                        <td class="p-3 text-center"><input type="checkbox" id="${idBase}_editar" data-modulo="${grupo.modulo}" data-submodulo="${sub}" data-tipo="editar" class="accent-[#249444] w-4 h-4 cursor-pointer checkbox-permiso"></td>
                        <td class="p-3 text-center pr-4"><input type="checkbox" id="${idBase}_eliminar" data-modulo="${grupo.modulo}" data-submodulo="${sub}" data-tipo="eliminar" class="accent-[#249444] w-4 h-4 cursor-pointer checkbox-permiso"></td>
                    </tr>
                `;
            });
        });

        contenedorDinamico.innerHTML = `
            <!-- Barra de navegación superior -->
            <div class="bg-white border border-stone-200 rounded-2xl p-5 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
                <div class="flex items-center gap-3 w-full md:w-auto">
                    <button onclick="cargarPermisosSis()" class="p-2.5 bg-stone-50 border border-stone-200 hover:bg-stone-100 text-stone-600 rounded-xl transition-all flex items-center justify-center shrink-0" title="Regresar al listado">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                    </button>
                    <div>
                        <h4 class="font-bold text-stone-800 text-sm uppercase">Configurando Permisos para: <span class="text-[#249444]">${nombreColaborador}</span></h4>
                        <p class="text-xs text-stone-500">No. Empleado: ${noEmp} — Habilita o deshabilita el acceso específico por Módulos Principales y sus Submódulos.</p>
                    </div>
                </div>
                <div class="flex items-center gap-2 shrink-0 w-full md:w-auto justify-end">
                    <button onclick="cargarPermisosSis()" class="bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold px-4 py-2.5 rounded-xl transition-all">
                        Cancelar
                    </button>
                    <button onclick="guardarMatrizPermisosSis('${noEmp}')" class="bg-[#249444] hover:bg-[#1e7a37] text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-sm flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
                        Guardar Cambios
                    </button>
                </div>
            </div>

            <!-- Tabla de Matriz de Permisos Completa con Scroll -->
            <div class="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
                <div class="max-h-[600px] overflow-y-auto custom-scrollbar">
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
        `;
    }
}

async function guardarMatrizPermisosSis(noEmp) {
    // Recopilar de forma inteligente todos los checkboxes marcados/desmarcados por su atributo
    const checkboxes = document.querySelectorAll('.checkbox-permiso');
    const matrizPermisos = {};

    checkboxes.forEach(chk => {
        const modulo = chk.getAttribute('data-modulo');
        const submodulo = chk.getAttribute('data-submodulo');
        const tipo = chk.getAttribute('data-tipo'); // ver, editar, eliminar

        if (!matrizPermisos[modulo]) {
            matrizPermisos[modulo] = {};
        }
        if (!matrizPermisos[modulo][submodulo]) {
            matrizPermisos[modulo][submodulo] = { ver: 0, editar: 0, eliminar: 0 };
        }

        matrizPermisos[modulo][submodulo][tipo] = chk.checked ? 1 : 0;
    });

    const permisosPayload = {
        numEmp: noEmp,
        permisos: matrizPermisos
    };

    try {
        if (typeof FetchAPI === 'function') {
            await FetchAPI('guardarPermisos', permisosPayload);
        } else if (typeof google !== 'undefined' && google.script && google.script.run) {
            await new Promise((resolve, reject) => {
                google.script.run
                    .withSuccessHandler(resolve)
                    .withFailureHandler(reject)
                    .guardarPermisosEnSheet(permisosPayload);
            });
        }

        alert("¡Permisos actualizados y guardados correctamente en Google Sheets!");
        cargarPermisosSis();
    } catch (err) {
        console.error("Error al guardar permisos:", err);
        alert("Error al guardar los permisos: " + (err.message || err));
    }
}