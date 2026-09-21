// ==========================================
// js/SisPer/SisPerForm.js - VERSIÓN LIMPIA Y DINÁMICA
// ==========================================

function abrirMatrizPermisosUsuario(nombreColaborador, noEmp) {
    const contenedorDinamico = document.getElementById('contenido-submodulo-dinamico');
    if (contenedorDinamico) {
        contenedorDinamico.className = "col-span-1 sm:col-span-2 md:col-span-3 space-y-6 animate-fade-in";

        // Obtenemos los catálogos globales sincronizados desde Google Sheets
        const deptos = window._catDepartamentos || (window.datosSistema && window.datosSistema.departamentos) || [];
        const submodulos = window.allSubModulosData || (window.datosSistema && window.datosSistema.submodulos) || [];

        let filasHTML = "";

        if (deptos.length > 0) {
            deptos.forEach(dep => {
                const cDep = String(dep.claveDep !== undefined ? dep.claveDep : dep.ClaveDep).trim();
                const nombreDep = dep.nomDep || dep.nombre || dep.NomDep || `Departamento ${cDep}`;

                // Filtramos los submódulos que pertenecen a este departamento
                const subsDelDepto = submodulos.filter(sub => {
                    const subDep = String(sub.ClaveDep !== undefined ? sub.ClaveDep : sub.claveDep).trim();
                    return subDep === cDep;
                });

                // Pintamos siempre el departamento, tenga o no submódulos
                filasHTML += `
                    <tr class="bg-stone-50 font-bold text-stone-800 border-t border-stone-200">
                        <td class="p-3 pl-4 uppercase tracking-wider" colspan="4">📁 Departamento: ${nombreDep}</td>
                    </tr>
                `;

                if (subsDelDepto.length > 0) {
                    subsDelDepto.forEach(sub => {
                        const nombreSub = sub.SModNom !== undefined ? sub.SModNom : (sub.sModNom || sub.nombre || 'Submódulo');
                        const idSub = sub.SModClave !== undefined ? sub.SModClave : (sub.sModClave || sub.id || '');

                        filasHTML += `
                            <tr class="hover:bg-stone-50 transition-all border-b border-stone-100">
                                <td class="p-3 pl-8 font-medium text-stone-600 flex items-center gap-2">
                                    <span>↳ ${nombreSub}</span>
                                </td>
                                <td class="p-3 text-center"><input type="checkbox" data-depto="${cDep}" data-submodulo="${idSub}" data-tipo="ver" class="accent-[#249444] w-4 h-4 cursor-pointer chk-permiso"></td>
                                <td class="p-3 text-center"><input type="checkbox" data-depto="${cDep}" data-submodulo="${idSub}" data-tipo="editar" class="accent-[#249444] w-4 h-4 cursor-pointer chk-permiso"></td>
                                <td class="p-3 text-center pr-4"><input type="checkbox" data-depto="${cDep}" data-submodulo="${idSub}" data-tipo="eliminar" class="accent-[#249444] w-4 h-4 cursor-pointer chk-permiso"></td>
                            </tr>
                        `;
                    });
                } else {
                    filasHTML += `
                        <tr class="border-b border-stone-100 bg-stone-50/40">
                            <td class="p-3 pl-8 text-stone-400 italic text-xs" colspan="4">
                                Sin submódulos registrados en Google Sheets para este departamento.
                            </td>
                        </tr>
                    `;
                }
            });
        }

        if (!filasHTML) {
            filasHTML = `
                <tr>
                    <td colspan="4" class="p-6 text-center text-stone-400">No se encontraron departamentos sincronizados desde Google Sheets.</td>
                </tr>
            `;
        }

        contenedorDinamico.innerHTML = `
            <!-- Contenedor con el formato exacto de tarjeta institucional -->
            <div class="w-full space-y-6 bg-white p-6 md:p-8 rounded-2xl soft-shadow border border-[#249444]/10 mb-8 animate-fade-in">
                
                <div class="flex items-center gap-3 pb-4 border-b border-stone-100">
                    <div class="p-2.5 bg-[#f0fdf4] border border-[#c6f6d5] text-[#059669] rounded-xl flex items-center justify-center">
                        <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' class='lucide lucide-user-round-key'><path d='M19 11v6'/><path d='M19 13h2'/><path d='M2 21a8 8 0 0 1 12.868-6.349'/><circle cx='10' cy='8' r='5'/><circle cx='19' cy='19' r='2'/></svg>
                    </div>
                    <div>
                        <h3 class="font-black text-stone-800 text-lg uppercase tracking-wide">Permisos</h3>
                    </div>
                </div>

                <!-- Tabla de Departamentos, Submódulos y Permisos -->
                <div class="rounded-xl border border-stone-200 overflow-hidden shadow-sm">

                    <div class="p-4 border-b border-stone-100 flex flex-wrap justify-between items-center gap-4 bg-white">
                        <div class="font-bold p-2 text-xs text-stone-700 uppercase tracking-wider"> 
                            <p class="text-xs text-stone-500">Editando permisos para: <span class="font-bold text-stone-800">${nombreColaborador}</span> (No. Empleado: ${noEmp})</p>
                        </div>
                    </div>

                    <div class="max-h-[500px] overflow-y-auto custom-scrollbar">
                        <table class="w-full text-left border-collapse text-xs">
                            <thead class="sticky top-0 z-10 bg-stone-100">
                                <tr class="text-stone-600 font-bold border-b border-stone-200 text-[11px]">
                                    <th class="p-3 pl-4">DEPARTAMENTO / SUBMÓDULO (SHEETS)</th>
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

                <!-- Botones de Acción inferiores -->
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
        const depto = chk.getAttribute('data-depto');
        const submodulo = chk.getAttribute('data-submodulo');
        const tipo = chk.getAttribute('data-tipo');

        if (!permisosEstructura[depto]) {
            permisosEstructura[depto] = {};
        }
        if (!permisosEstructura[depto][submodulo]) {
            permisosEstructura[depto][submodulo] = { ver: 0, editar: 0, eliminar: 0 };
        }

        permisosEstructura[depto][submodulo][tipo] = chk.checked ? 1 : 0;
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