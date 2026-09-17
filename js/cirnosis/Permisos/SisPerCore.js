// js/SisPer/SisPerCore.js

function renderizarListadoPermisosSis() {
    renderizarVistaModuloSis('permisos', "Selecciona un colaborador para administrar su matriz de accesos por módulos y submódulos.");
    
    const contenedorDinamico = document.getElementById('contenido-submodulo-dinamico');
    if (contenedorDinamico) {
        contenedorDinamico.className = "col-span-1 sm:col-span-2 md:col-span-3 space-y-6 animate-fade-in";
        contenedorDinamico.innerHTML = `
            <!-- Barra superior idéntica a Personal -->
            <div class="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4">
                <div class="flex items-center gap-2">
                    <span class="text-xs font-bold text-stone-700 uppercase tracking-wider">Gestión de Permisos por Empleado</span>
                </div>
                <div class="flex items-center gap-2 w-full sm:w-auto justify-end">
                    <button onclick="renderizarListadoPermisosSis()" class="bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold px-4 py-2.5 rounded-xl transition-all flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 21h5v-5"/></svg>
                        Actualizar Datos
                    </button>
                </div>
            </div>

            <!-- Tabla General de Empleados adaptada para Permisos -->
            <div class="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
                <div class="p-4 border-b border-stone-100 flex flex-col sm:flex-row justify-between items-center gap-3">
                    <span class="text-xs font-bold text-stone-500 uppercase tracking-wide">Listado General de Empleados</span>
                    <div class="w-full sm:w-72">
                        <input type="text" id="input-buscar-permisos" placeholder="BUSCAR POR NOMBRE, PUESTO, CENTRO..." onkeyup="filtrarTablaPermisosSis()" class="w-full bg-stone-50 border border-stone-200 text-[11px] rounded-xl px-3 py-2 focus:outline-none focus:border-[#249444] uppercase">
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
                        <tbody id="tbody-permisos-empleados" class="divide-y divide-stone-100 text-stone-700">
                            <tr>
                                <td colspan="6" class="p-6 text-center text-stone-400 italic">Cargando listado desde Google Sheets...</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        `;

        // Llamar a la función que consulta la pestaña "Personal" del Sheets
        cargarEmpleadosParaPermisosSis();
    }
}

// Función para traer los datos reales de la pestaña Personal
function cargarEmpleadosParaPermisosSis() {
    if (typeof google !== 'undefined' && google.script && google.script.run) {
        google.script.run
            .withSuccessHandler(function(data) {
                window.listaEmpleadosPermisosCache = data; // Guardamos en caché para el buscador
                renderizarFilasPermisosSis(data);
            })
            .withFailureHandler(function(err) {
                const tbody = document.getElementById('tbody-permisos-empleados');
                if (tbody) tbody.innerHTML = `<tr><td colspan="6" class="p-4 text-center text-red-500">Error al cargar datos: ${err.message}</td></tr>`;
            })
            .obtenerPersonalDesdeSheet(); // Esta función ya la tienes en tu Apps Script
    } else {
        // Datos de respaldo para pruebas locales si no estás dentro de Apps Script
        const simulados = [
            { reg: "100 - CIRNO", centro: "108 - DIRECCION", numEmp: "4227", nombre: "VILLICAÑA BOTELLO MARIA DEL CARMEN", puesto: "JEFE DE DEPARTAMENTO", depto: "RECURSOS MATERIALES" },
            { reg: "100 - CIRNO", centro: "107 - CETOD", numEmp: "4229", nombre: "GONZALEZ GARCIA YOLANDA", puesto: "INVESTIGADOR TITULAR C", depto: "INVESTIGACIÓN" }
        ];
        window.listaEmpleadosPermisosCache = simulados;
        renderizarFilasPermisosSis(simulados);
    }
}

// Función para pintar las filas en el tbody
function renderizarFilasPermisosSis(empleados) {
    const tbody = document.getElementById('tbody-permisos-empleados');
    if (!tbody) return;

    if (!empleados || empleados.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" class="p-4 text-center text-stone-400">No se encontraron registros en la pestaña Personal.</td></tr>`;
        return;
    }

    let html = "";
    empleados.forEach(emp => {
        // Adaptable por si las propiedades vienen con otro nombre desde tu Apps Script
        const reg = emp.reg || emp.REG || "100 - CIRNO";
        const centro = emp.centro || emp.CENTRO || "---";
        const numEmp = emp.numEmp || emp.NO_EMP || emp.NumEmp || "";
        const nombre = emp.nombre || emp.NOMBRE || "";
        const puesto = emp.puesto || emp.PUESTO || "";
        const depto = emp.depto || emp.DEPARTAMENTO || "";

        html += `
            <tr class="hover:bg-stone-50/85 transition-all">
                <td class="p-3 pl-4 text-stone-500">${reg}</td>
                <td class="p-3 text-stone-600">${centro}</td>
                <td class="p-3 text-stone-600 font-medium">${numEmp}</td>
                <td class="p-3">
                    <button onclick="abrirMatrizPermisosUsuario('${nombre.replace(/'/g, "\\'")}', '${numEmp}')" class="text-[#249444] hover:underline font-bold text-left uppercase">
                        ${nombre}
                    </button>
                </td>
                <td class="p-3 text-stone-600 uppercase">${puesto}</td>
                <td class="p-3 pr-4 text-stone-600 uppercase">${depto}</td>
            </tr>
        `;
    });
    tbody.innerHTML = html;
}

// Función para filtrar en tiempo real con el input de búsqueda
function filtrarTablaPermisosSis() {
    const filtro = document.getElementById('input-buscar-permisos').value.toUpperCase();
    const lista = window.listaEmpleadosPermisosCache || [];
    
    const filtrados = lista.filter(emp => {
        const texto = `${emp.numEmp || ''} ${emp.nombre || ''} ${emp.puesto || ''} ${emp.depto || ''} ${emp.centro || ''}`.toUpperCase();
        return texto.includes(filtro);
    });

    renderizarFilasPermisosSis(filtrados);
}