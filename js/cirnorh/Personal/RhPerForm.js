// js/SisPer/SisPerForm.js

function abrirMatrizPermisosUsuario(nombreColaborador, noEmp) {
    const contenedorDinamico = document.getElementById('contenido-submodulo-dinamico');
    if (contenedorDinamico) {
        contenedorDinamico.className = "col-span-1 sm:col-span-2 md:col-span-3 space-y-6 animate-fade-in";
        contenedorDinamico.innerHTML = `
            <!-- Barra de navegación superior con diseño exacto a tu imagen -->
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
                    <button onclick="guardarMatrizPermisosSis()" class="bg-[#249444] hover:bg-[#1e7a37] text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-sm flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
                        Guardar Cambios
                    </button>
                </div>
            </div>

            <!-- Tabla de Matriz de Permisos idéntica a tu diseño -->
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
                            <td class="p-3 text-center"><input type="checkbox" checked class="accent-[#249444] w-4 h-4 cursor-pointer"></td>
                            <td class="p-3 text-center"><input type="checkbox" checked class="accent-[#249444] w-4 h-4 cursor-pointer"></td>
                            <td class="p-3 text-center pr-4"><input type="checkbox" class="accent-[#249444] w-4 h-4 cursor-pointer"></td>
                        </tr>
                        <tr>
                            <td class="p-3 pl-8 font-medium text-stone-600">↳ CONTRASEÑAS Y CREDENCIALES</td>
                            <td class="p-3 text-center"><input type="checkbox" checked class="accent-[#249444] w-4 h-4 cursor-pointer"></td>
                            <td class="p-3 text-center"><input type="checkbox" class="accent-[#249444] w-4 h-4 cursor-pointer"></td>
                            <td class="p-3 text-center pr-4"><input type="checkbox" class="accent-[#249444] w-4 h-4 cursor-pointer"></td>
                        </tr>
                        <tr>
                            <td class="p-3 pl-8 font-medium text-stone-600">↳ LICENCIAMIENTO DE SOFTWARE</td>
                            <td class="p-3 text-center"><input type="checkbox" checked class="accent-[#249444] w-4 h-4 cursor-pointer"></td>
                            <td class="p-3 text-center"><input type="checkbox" checked class="accent-[#249444] w-4 h-4 cursor-pointer"></td>
                            <td class="p-3 text-center pr-4"><input type="checkbox" checked class="accent-[#249444] w-4 h-4 cursor-pointer"></td>
                        </tr>
                        <tr>
                            <td class="p-3 pl-8 font-medium text-stone-600">↳ INVENTARIOS DE CÓMPUTO</td>
                            <td class="p-3 text-center"><input type="checkbox" checked class="accent-[#249444] w-4 h-4 cursor-pointer"></td>
                            <td class="p-3 text-center"><input type="checkbox" checked class="accent-[#249444] w-4 h-4 cursor-pointer"></td>
                            <td class="p-3 text-center pr-4"><input type="checkbox" checked class="accent-[#249444] w-4 h-4 cursor-pointer"></td>
                        </tr>
                        <tr>
                            <td class="p-3 pl-8 font-medium text-stone-600">↳ FORMATOS OFICIALES</td>
                            <td class="p-3 text-center"><input type="checkbox" checked class="accent-[#249444] w-4 h-4 cursor-pointer"></td>
                            <td class="p-3 text-center"><input type="checkbox" checked class="accent-[#249444] w-4 h-4 cursor-pointer"></td>
                            <td class="p-3 text-center pr-4"><input type="checkbox" class="accent-[#249444] w-4 h-4 cursor-pointer"></td>
                        </tr>

                        <!-- Módulo 2: Administración del Sistema -->
                        <tr class="bg-stone-50/80 font-bold text-stone-800">
                            <td class="p-3 pl-4 uppercase tracking-wider" colspan="4">📁 MÓDULO PRINCIPAL: ADMINISTRACIÓN DEL SISTEMA</td>
                        </tr>
                        <tr>
                            <td class="p-3 pl-8 font-medium text-stone-600">↳ MÓDULO DE PERMISOS Y ACCESOS</td>
                            <td class="p-3 text-center"><input type="checkbox" class="accent-[#249444] w-4 h-4 cursor-pointer"></td>
                            <td class="p-3 text-center"><input type="checkbox" class="accent-[#249444] w-4 h-4 cursor-pointer"></td>
                            <td class="p-3 text-center pr-4"><input type="checkbox" class="accent-[#249444] w-4 h-4 cursor-pointer"></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        `;
    }
}

function guardarMatrizPermisosSis() {
    alert("¡Permisos actualizados correctamente para el colaborador!");
    cargarPermisosSis();
}