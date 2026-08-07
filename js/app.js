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

function renderizarMenuDepartamentos(respuestaServidor) {
    // Guardamos todo el objeto global que viene del servidor
    datosGlobalesSistema = respuestaServidor;
    
    const todosLosDepartamentos = respuestaServidor.departamentos || [];
    const todasLasRegionales = respuestaServidor.regionales || [];
    const todosLosCampos = respuestaServidor.campos || [];

    // Obtenemos el área o clave del usuario logueado (ej. "CIRNODIR" o "100")
    const areaUsuario = localStorage.getItem('session_area') || 'CIRNODIR';
    
    // Identificamos la ClaveReg del usuario buscando en sus departamentos o regionales
    const depUsuario = todosLosDepartamentos.find(dep => dep.nomCorDep === areaUsuario || dep.claveReg === areaUsuario);
    const claveRegUsuario = depUsuario ? depUsuario.claveReg : "100"; // Por defecto 100 según tu tabla

    // Buscamos el nombre real de la regional en la pestaña "Regional" (Columna B -> Regional)
    const infoRegional = todasLasRegionales.find(r => r.claveReg === claveRegUsuario || r.nomCorto === areaUsuario);
    const nombreRegionalOficial = infoRegional ? infoRegional.regional : "CIR NOROESTE";

    // Mostramos el nombre real de la regional en el encabezado
    const labelRegional = document.getElementById('user-regional-display');
    if (labelRegional) {
        labelRegional.textContent = `${nombreRegionalOficial} (Clave: ${claveRegUsuario})`;
    }

    // Filtramos los campos que pertenecen estrictamente a la ClaveReg del usuario
    const camposDeLaRegional = todosLosCampos.filter(c => c.claveReg === claveRegUsuario);

    // Poblamos el selector desplegable con el nombre de la columna "Centro"
    const selectFiltro = document.getElementById('filtro-campos-regional');
    if (selectFiltro) {
        selectFiltro.innerHTML = '<option value="">Todos los campos de la región</option>';
        camposDeLaRegional.forEach(campo => {
            selectFiltro.innerHTML += `<option value="${campo.claveCentro}">${campo.centro}</option>`;
        });
    }

    // Filtramos los departamentos iniciales de esta regional
    const departamentosDeLaRegional = todosLosDepartamentos.filter(dep => dep.claveReg === claveRegUsuario);
    pintarTarjetasDepartamentos(departamentosDeLaRegional);
}

// Función que dibuja las tarjetas en pantalla
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
            <button onclick="seleccionarDepartamento('${dep.nomCorDep}', this)" 
                class="area-btn ${esActivo} flex flex-col items-center justify-center p-4 rounded-xl border hover:border-[#249444] hover:bg-emerald-50/50 transition-all text-center cursor-pointer group">
                <div class="w-10 h-10 rounded-lg ${iconoBg} flex items-center justify-center mb-2 group-hover:bg-[#249444] group-hover:text-white transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg>
                </div>
                <span class="text-xs font-bold text-stone-700 group-hover:text-[#249444]">${dep.nomDep}</span>
                <span class="text-[10px] text-stone-400 mt-1">Centro: ${dep.claveCentro}</span>
            </button>
        `;
        contenedorMenu.innerHTML += btnHTML;
    });
}

// Función que filtra las tarjetas al seleccionar un Centro específico en el desplegable
function filtrarPorCampoRegional(claveCentroSeleccionado) {
    if (!datosGlobalesSistema || !datosGlobalesSistema.departamentos) return;

    const areaUsuario = localStorage.getItem('session_area') || 'CIRNODIR';
    const depUsuario = datosGlobalesSistema.departamentos.find(dep => dep.NomCorDep === areaUsuario || dep.claveReg === areaUsuario);
    const claveRegUsuario = depUsuario ? depUsuario.claveReg : "100";

    const departamentosDeLaRegional = datosGlobalesSistema.departamentos.filter(dep => dep.claveReg === claveRegUsuario);

    if (!claveCentroSeleccionado) {
        pintarTarjetasDepartamentos(departamentosDeLaRegional);
    } else {
        const filtrados = departamentosDeLaRegional.filter(dep => String(dep.claveCentro) === String(claveCentroSeleccionado));
        pintarTarjetasDepartamentos(filtrados);
    }
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
            <button onclick="seleccionarDepartamento('${dep.NomCorDep}', this)" 
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

// Acción al hacer clic en una opción del menú de departamentos
function seleccionarDepartamento(NomCorDep, elementoBtn) {
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

    console.log("Departamento seleccionado:", NomCorDep);
    // Aquí puedes disparar la función que recarga los movimientos o registros de la tabla principal según el departamento
}

document.addEventListener('DOMContentLoaded', AuthGuard.verificarAcceso);