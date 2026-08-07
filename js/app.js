const AuthGuard = {
    verificarAcceso: () => {
        const usuarioSesion = localStorage.getItem('usuario_sesion');
        const paginaActual = window.location.pathname;

        if (!usuarioSesion && !paginaActual.includes('login.html')) {
            window.location.href = 'login.html';
        } else if (usuarioSesion && paginaActual.includes('login.html')) {
            window.location.href = 'index.html';
        } else {
            document.body.classList.add('auth-checked');

            // Mostrar el nombre del usuario en el header
            const labelUser = document.getElementById('user-display-name');
            if (labelUser) {
                labelUser.textContent = localStorage.getItem('session_userName') || 'Usuario';
            }

            // Si no estamos en el login, cargamos el menú de departamentos directamente
            if (!paginaActual.includes('login.html')) {
                inicializarMenuDepartamentos();
            }
        }
    }
};

// Función para solicitar los departamentos a Google Apps Script
function inicializarMenuDepartamentos() {
    const URL_DIRECTA = "https://script.google.com/macros/s/AKfycbzDs5fvFxykQniWFZnbUqpbuDAmrIDhMHlVwU4r5B3iPLxBp4FDG7uKrtDBDQEXxEX8fQ/exec?action=obtenerDatosSistema";

    fetch(URL_DIRECTA, {
        method: 'GET'
    })
        .then(res => res.json())
        .then(data => {
            if (data.success && data.departamentos) {
                renderizarMenuDepartamentos(data.departamentos);
            } else {
                console.warn("No se pudieron cargar los departamentos:", data.message);
            }
        })
        .catch(err => {
            console.error("Error de conexión al obtener departamentos:", err);
        });
}

let datosGlobalesSistema = null;

function renderizarMenuDepartamentos(todosLosDepartamentos) {
    datosGlobalesSistema = todosLosDepartamentos;
    
    // Obtenemos el área o clave de regional guardada al iniciar sesión (ej: "CIRNODIR" o la clave numérica)
    const areaUsuario = localStorage.getItem('session_area') || 'CIRNODIR';
    
    // Filtramos los departamentos que corresponden al usuario logueado según su ClaveReg o nomCotDep
    const departamentosDelUsuario = todosLosDepartamentos.filter(dep => 
        dep.nomCotDep === areaUsuario || dep.claveReg === areaUsuario
    );

    // Si encontramos coincidencia, tomamos su ClaveReg real, si no, usamos el área por defecto
    const claveRegUsuario = departamentosDelUsuario.length > 0 ? departamentosDelUsuario[0].claveReg : areaUsuario;

    // Mostramos la Regional actual en el encabezado
    const labelRegional = document.getElementById('user-regional-display');
    if (labelRegional) {
        labelRegional.textContent = `Región: ${claveRegUsuario} (${areaUsuario})`;
    }

    // Filtramos inicialmente la tabla de departamentos que pertenecen a esta ClaveReg del usuario
    const departamentosDeLaRegional = todosLosDepartamentos.filter(dep => dep.claveReg === claveRegUsuario);

    // Poblamos el selector desplegable exclusivamente con los centros/campos de esta ClaveReg
    const selectFiltro = document.getElementById('filtro-campos-regional');
    if (selectFiltro) {
        // Extraemos las claves de centro (o el campo correspondiente, ej: claveCentro o nomDep) únicas de esta regional
        const camposUnicos = [...new Set(departamentosDeLaRegional.map(d => d.claveCentro))].filter(Boolean);
        
        selectFiltro.innerHTML = '<option value="">Todos los campos de la región</option>';
        camposUnicos.forEach(centro => {
            selectFiltro.innerHTML += `<option value="${centro}">Campo / Centro: ${centro}</option>`;
        });
    }

    // Pintamos las tarjetas iniciales filtradas por la región del usuario
    pintarTarjetasDepartamentos(departamentosDeLaRegional);
}

// Función para pintar las tarjetas de departamentos en pantalla
function pintarTarjetasDepartamentos(listaDepartamentos) {
    const contenedorMenu = document.getElementById('menu-dinamico-departamentos');
    if (!contenedorMenu) return;

    contenedorMenu.innerHTML = '';

    if (listaDepartamentos.length === 0) {
        contenedorMenu.innerHTML = '<p class="text-xs text-stone-400 col-span-full">No se encontraron departamentos para este filtro.</p>';
        return;
    }

    listaDepartamentos.forEach((dep, index) => {
        const esActivo = index === 0 ? 'border-[#249444] bg-emerald-50/80 shadow-sm' : 'border-stone-200';
        const iconoBg = index === 0 ? 'bg-[#249444] text-white' : 'bg-emerald-50 text-[#249444]';

        const btnHTML = `
            <button onclick="seleccionarDepartamento('${dep.nomCotDep}', this)" 
                class="area-btn ${esActivo} flex flex-col items-center justify-center p-4 rounded-xl border hover:border-[#249444] hover:bg-emerald-50/50 transition-all text-center cursor-pointer group">
                <div class="w-10 h-10 rounded-lg ${iconoBg} flex items-center justify-center mb-2 group-hover:bg-[#249444] group-hover:text-white transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg>
                </div>
                <span class="text-xs font-bold text-stone-700 group-hover:text-[#249444]">${dep.nomDep}</span>
                <span class="text-[10px] text-stone-400 mt-1">Reg: ${dep.claveReg} | Centro: ${dep.claveCentro}</span>
            </button>
        `;
        contenedorMenu.innerHTML += btnHTML;
    });
}

// Función que ejecuta el filtro cuando seleccionas un campo específico del menú desplegable
function filtrarPorCampoRegional(campoSeleccionado) {
    if (!datosGlobalesSistema) return;

    const areaUsuario = localStorage.getItem('session_area') || 'CIRNODIR';
    
    // Primero acotamos a la regional del usuario
    const baseRegional = datosGlobalesSistema.filter(dep => 
        dep.nomCotDep === areaUsuario || dep.claveReg === areaUsuario
    );
    const claveRegUsuario = baseRegional.length > 0 ? baseRegional[0].claveReg : areaUsuario;
    const departamentosDeLaRegional = datosGlobalesSistema.filter(dep => dep.claveReg === claveRegUsuario);

    // Si se selecciona un campo en específico, filtramos sobre la regional del usuario
    if (!campoSeleccionado) {
        pintarTarjetasDepartamentos(departamentosDeLaRegional);
    } else {
        const filtradosPorCampo = departamentosDeLaRegional.filter(dep => dep.claveCentro === campoSeleccionado);
        pintarTarjetasDepartamentos(filtradosPorCampo);
    }
}
// Acción al hacer clic en una opción del menú de departamentos
function seleccionarDepartamento(nomCotDep, elementoBtn) {
    document.querySelectorAll('.area-btn').forEach(btn => {
        btn.classList.remove('border-[#249444]', 'bg-emerald-50/80', 'shadow-sm');
        let divIcon = btn.querySelector('div');
        divIcon.classList.remove('bg-[#249444]', 'text-white');
        divIcon.classList.add('bg-emerald-50', 'text-[#249444]');
    });

    elementoBtn.classList.add('border-[#249444]', 'bg-emerald-50/80', 'shadow-sm');
    let iconoDiv = elementoBtn.querySelector('div');
    iconoDiv.classList.remove('bg-emerald-50', 'text-[#249444]');
    iconoDiv.classList.add('bg-[#249444]', 'text-white');

    console.log("Departamento seleccionado:", nomCotDep);
    // Aquí puedes disparar la función que recarga los movimientos o registros de la tabla principal según el departamento
}

document.addEventListener('DOMContentLoaded', AuthGuard.verificarAcceso);