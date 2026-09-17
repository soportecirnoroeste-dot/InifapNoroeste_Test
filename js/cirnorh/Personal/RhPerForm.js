// js/SisPer/SisPerForm.js

function abrirMatrizPermisosUsuario(nombreColaborador, noEmp) {
    const contenedorDinamico = document.getElementById('contenido-submodulo-dinamico');
    if (contenedorDinamico) {
        contenedorDinamico.className = "col-span-1 sm:col-span-2 md:col-span-3 space-y-6 animate-fade-in";
        contenedorDinamico.innerHTML = `
            <!-- Barra de navegación superior con diseño exacto -->
            <div class="bg-white border border-stone-200 rounded-2xl p-5 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
                <div class="flex items-center gap-3 w-full md:w-auto">
                    <button onclick="cargarPermisosSis()" class="p-2.5 bg-stone-50 border border-stone-200 hover:bg-stone-100 text-stone-600 rounded-xl transition-all flex items-center justify-center shrink-0" title="Regresar al listado">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                    </button>
                    <div>
                        <h4 class="font-bold text-stone-800 text-sm uppercase">Configurando Permisos para: <span class="text-[#249444]">${nombreColaborador}</span></h4>
                        <p class="text-xs text-stone-500">No. Empleado: ${noEmp} — Habilita o deshabilita el acceso específico por Módulos Principales y sus Submódulos complementarios.</p>
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

            <!-- Tabla de Matriz de Permisos con IDs únicos por submódulo -->
            <div class="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
                <table class="w-full text-left border-collapse text-xs">
                    <thead>
                        <tr class="bg-stone-100 text-stone-600 font-bold border-b border-stone-200 text-[11px]">
                            <th class="p-3 pl-4">MÓDULO PRINCIPAL / SUBMÓDULO</th>
                            <th class="p-3 text-center">VER / LEER</th>
                            <th class="p-3 text-center">CREAR / EDITAR</th>
                            <th class="p-3 text-center pr-4">ELIMINAR</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-stone-100 text-stone-700">
                        <!-- Módulo 1: Sistemas -->
                        <tr class="bg-stone-50/80 font-bold text-stone-800">
                            <td class="p-3 pl-4 uppercase tracking-wider" colspan="4">📁 MÓDULO PRINCIPAL: SISTEMAS</td>
                        </tr>
                        <tr>
                            <td class="p-3 pl-8 font-medium text-stone-600">↳ REUNIONES DE SISTEMAS</td>
                            <td class="p-3 text-center"><input type="checkbox" id="chk_sis_reuniones_ver" checked class="accent-[#249444] w-4 h-4 cursor-pointer"></td>
                            <td class="p-3 text-center"><input type="checkbox" id="chk_sis_reuniones_editar" checked class="accent-[#249444] w-4 h-4 cursor-pointer"></td>
                            <td class="p-3 text-center pr-4"><input type="checkbox" id="chk_sis_reuniones_eliminar" class="accent-[#249444] w-4 h-4 cursor-pointer"></td>
                        </tr>
                        <tr>
                            <td class="p-3 pl-8 font-medium text-stone-600">↳ CONTRASEÑAS Y CREDENCIALES</td>
                            <td class="p-3 text-center"><input type="checkbox" id="chk_sis_contra_ver" checked class="accent-[#249444] w-4 h-4 cursor-pointer"></td>
                            <td class="p-3 text-center"><input type="checkbox" id="chk_sis_contra_editar" checked class="accent-[#249444] w-4 h-4 cursor-pointer"></td>
                            <td class="p-3 text-center pr-4"><input type="checkbox" id="chk_sis_contra_eliminar" class="accent-[#249444] w-4 h-4 cursor-pointer"></td>
                        </tr>
                        <tr>
                            <td class="p-3 pl-8 font-medium text-stone-600">↳ LICENCIAMIENTO DE SOFTWARE</td>
                            <td class="p-3 text-center"><input type="checkbox" id="chk_sis_lic_ver" checked class="accent-[#249444] w-4 h-4 cursor-pointer"></td>
                            <td class="p-3 text-center"><input type="checkbox" id="chk_sis_lic_editar" checked class="accent-[#249444] w-4 h-4 cursor-pointer"></td>
                            <td class="p-3 text-center pr-4"><input type="checkbox" id="chk_sis_lic_eliminar" checked class="accent-[#249444] w-4 h-4 cursor-pointer"></td>
                        </tr>
                        <tr>
                            <td class="p-3 pl-8 font-medium text-stone-600">↳ INVENTARIOS DE CÓMPUTO</td>
                            <td class="p-3 text-center"><input type="checkbox" id="chk_sis_inv_ver" checked class="accent-[#249444] w-4 h-4 cursor-pointer"></td>
                            <td class="p-3 text-center"><input type="checkbox" id="chk_sis_inv_editar" checked class="accent-[#249444] w-4 h-4 cursor-pointer"></td>
                            <td class="p-3 text-center pr-4"><input type="checkbox" id="chk_sis_inv_eliminar" checked class="accent-[#249444] w-4 h-4 cursor-pointer"></td>
                        </tr>
                        <tr>
                            <td class="p-3 pl-8 font-medium text-stone-600">↳ FORMATOS OFICIALES</td>
                            <td class="p-3 text-center"><input type="checkbox" id="chk_sis_form_ver" checked class="accent-[#249444] w-4 h-4 cursor-pointer"></td>
                            <td class="p-3 text-center"><input type="checkbox" id="chk_sis_form_editar" checked class="accent-[#249444] w-4 h-4 cursor-pointer"></td>
                            <td class="p-3 text-center pr-4"><input type="checkbox" id="chk_sis_form_eliminar" class="accent-[#249444] w-4 h-4 cursor-pointer"></td>
                        </tr>

                        <!-- Módulo 2: Administración del Sistema -->
                        <tr class="bg-stone-50/80 font-bold text-stone-800">
                            <td class="p-3 pl-4 uppercase tracking-wider" colspan="4">📁 MÓDULO PRINCIPAL: ADMINISTRACIÓN DEL SISTEMA</td>
                        </tr>
                        <tr>
                            <td class="p-3 pl-8 font-medium text-stone-600">↳ MÓDULO DE PERMISOS Y ACCESOS</td>
                            <td class="p-3 text-center"><input type="checkbox" id="chk_adm_perm_ver" class="accent-[#249444] w-4 h-4 cursor-pointer"></td>
                            <td class="p-3 text-center"><input type="checkbox" id="chk_adm_perm_editar" class="accent-[#249444] w-4 h-4 cursor-pointer"></td>
                            <td class="p-3 text-center pr-4"><input type="checkbox" id="chk_adm_perm_eliminar" class="accent-[#249444] w-4 h-4 cursor-pointer"></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        `;
    }
}

async function guardarMatrizPermisosSis(noEmp) {
    // Recopilar los estados de los checkboxes de la matriz
    const permisosPayload = {
        numEmp: noEmp,
        reunionesVer: document.getElementById('chk_sis_reuniones_ver')?.checked ? 1 : 0,
        reunionesEditar: document.getElementById('chk_sis_reuniones_editar')?.checked ? 1 : 0,
        reunionesEliminar: document.getElementById('chk_sis_reuniones_eliminar')?.checked ? 1 : 0,
        
        contraVer: document.getElementById('chk_sis_contra_ver')?.checked ? 1 : 0,
        contraEditar: document.getElementById('chk_sis_contra_editar')?.checked ? 1 : 0,
        contraEliminar: document.getElementById('chk_sis_contra_eliminar')?.checked ? 1 : 0,
        
        licVer: document.getElementById('chk_sis_lic_ver')?.checked ? 1 : 0,
        licEditar: document.getElementById('chk_sis_lic_editar')?.checked ? 1 : 0,
        licEliminar: document.getElementById('chk_sis_lic_eliminar')?.checked ? 1 : 0,
        
        invVer: document.getElementById('chk_sis_inv_ver')?.checked ? 1 : 0,
        invEditar: document.getElementById('chk_sis_inv_editar')?.checked ? 1 : 0,
        invEliminar: document.getElementById('chk_sis_inv_eliminar')?.checked ? 1 : 0,
        
        formVer: document.getElementById('chk_sis_form_ver')?.checked ? 1 : 0,
        formEditar: document.getElementById('chk_sis_form_editar')?.checked ? 1 : 0,
        formEliminar: document.getElementById('chk_sis_form_eliminar')?.checked ? 1 : 0,
        
        admPermVer: document.getElementById('chk_adm_perm_ver')?.checked ? 1 : 0,
        admPermEditar: document.getElementById('chk_adm_perm_editar')?.checked ? 1 : 0,
        admPermEliminar: document.getElementById('chk_adm_perm_eliminar')?.checked ? 1 : 0
    };

    try {
        // Enviar al backend (Google Sheets) usando tu FetchAPI habitual o google.script.run
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