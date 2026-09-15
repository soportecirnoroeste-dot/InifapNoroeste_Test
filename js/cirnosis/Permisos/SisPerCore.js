// js/SisPer/SisPerCore.js

function renderizarListadoPermisosSis() {
    renderizarVistaModuloSis('permisos', "Control institucional de accesos y privilegios por colaborador.");
    
    const contenedorDinamico = document.getElementById('contenido-submodulo-dinamico');
    if (contenedorDinamico) {
        contenedorDinamico.className = "col-span-1 sm:col-span-2 md:col-span-3 space-y-6 animate-fade-in";
        contenedorDinamico.innerHTML = `
            <!-- Barra de acciones superior estilo Personal -->
            <div class="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4">
                <div class="flex items-center gap-2">
                    <span class="text-xs font-bold text-stone-700 uppercase tracking-wider">Gestión de Permisos</span>
                </div>
                <div class="flex items-center gap-2 w-full sm:w-auto justify-end">
                    <button onclick="actualizarDatosPermisosSis()" class="bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold px-4 py-2.5 rounded-xl transition-all flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 21h5v-5"/></svg>
                        Actualizar Datos
                    </button>
                </div>
            </div>

            <!-- Tabla de Empleados (Estilo institucional INIFAP / Personal) -->
            <div class="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
                <div class="p-4 border-b border-stone-100 flex flex-col sm:flex-row justify-between items-center gap-3">
                    <span class="text-xs font-bold text-stone-500 uppercase tracking-wide">Listado General de Empleados (Permisos)</span>
                    <div class="w-full sm:w-72">
                        <input type="text" placeholder="BUSCAR POR NOMBRE, PUESTO, CENTRO..." class="w-full bg-stone-50 border border-stone-200 text-[11px] rounded-xl px-3 py-2 focus:outline-none focus:border-[#249444] uppercase">
                    </div>
                </div>

                <div class="overflow-x-auto">
                    <table class="w-full text-left border-collapse text-xs">
                        <thead>
                            <tr class="bg-stone-100 text-stone-600 font-bold border-b border-stone-200 text-[11px]">
                                <th class="p-3 pl-4">REG</th>
                                <th class="p-3">CENTRO</th>
                                <th class="p-3">NO. EMP</th>
                                <th class="p-3">NOMBRE</th>
                                <th class="p-3">PUESTO</th>
                                <th class="p-3 pr-4">DEPARTAMENTO</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-stone-100 text-stone-700">
                            <tr class="hover:bg-stone-50/80 transition-all">
                                <td class="p-3 pl-4 text-stone-500">100 - CIRNO</td>
                                <td class="p-3 text-stone-600">108 - DIRECCION</td>
                                <td class="p-3 text-stone-600">4227</td>
                                <td class="p-3">
                                    <button onclick="abrirMatrizPermisosUsuario('VILLICAÑA BOTELLO MARIA DEL CARMEN', '4227')" class="text-[#249444] hover:underline font-bold text-left uppercase">
                                        VILLICAÑA BOTELLO MARIA DEL CARMEN
                                    </button>
                                </td>
                                <td class="p-3 text-stone-600 uppercase">JEFE DE DEPARTAMENTO</td>
                                <td class="p-3 pr-4 text-stone-600 uppercase">RECURSOS MATERIALES</td>
                            </tr>
                            <tr class="hover:bg-stone-50/80 transition-all">
                                <td class="p-3 pl-4 text-stone-500">100 - CIRNO</td>
                                <td class="p-3 text-stone-600">107 - CETOD</td>
                                <td class="p-3 text-stone-600">4229</td>
                                <td class="p-3">
                                    <button onclick="abrirMatrizPermisosUsuario('GONZALEZ GARCIA YOLANDA', '4229')" class="text-[#249444] hover:underline font-bold text-left uppercase">
                                        GONZALEZ GARCIA YOLANDA
                                    </button>
                                </td>
                                <td class="p-3 text-stone-600 uppercase">INVESTIGADOR TITULAR C</td>
                                <td class="p-3 pr-4 text-stone-600 uppercase">INVESTIGACIÓN</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }
}