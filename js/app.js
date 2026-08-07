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
    datosGlobalesSistema = respuestaServidor;
    
    console.log("Datos recibidos del servidor:", respuestaServidor);

    const todosLosDepartamentos = respuestaServidor.departamentos || [];
    const todasLasRegionales = respuestaServidor.regionales || [];
    const todosLosCampos = respuestaServidor.campos || [];

    const areaUsuario = String(localStorage.getItem('session_area') || 'CIRNODIR').trim();
    
    // Buscamos al usuario en los departamentos
    const depUsuario = todosLosDepartamentos.find(dep => 
        String(dep.nomCorDep).trim().toUpperCase() === areaUsuario.toUpperCase() || 
        String(dep.claveReg).trim() === areaUsuario
    );
    
    const claveRegUsuario = depUsuario ? String(depUsuario.claveReg).trim() : "100"; 
    
    // Identificamos el ClaveCentro predeterminado del usuario logueado (si existe)
    const centroUsuarioLogueado = depUsuario ? String(depUsuario.claveCentro).trim() : "";

    // Regional oficial
    const infoRegional = todasLasRegionales.find(r => String(r.claveReg).trim() === claveRegUsuario);
    const nombreRegionalOficial = infoRegional ? infoRegional.regional : "CIR NOROESTE";

    const labelRegional = document.getElementById('user-regional-display');
    if (labelRegional) {
        labelRegional.textContent = `${claveRegUsuario} - ${nombreRegionalOficial}`;
    }

    // Filtramos los campos de la regional
    const camposDeLaRegional = todosLosCampos.filter(c => String(c.claveReg).trim() === claveRegUsuario);
    console.log("Campos encontrados para la regional:", camposDeLaRegional);

    // Poblamos el select con los campos
    const selectFiltro = document.getElementById('filtro-campos-regional');
    if (selectFiltro) {
        selectFiltro.innerHTML = '<option value="">Seleccionar campo</option>';
        camposDeLaRegional.forEach(campo => {
            selectFiltro.innerHTML += `<option value="${campo.claveCentro}">${campo.centro}</option>`;
        });
    }

    // Departamentos de la regional
    const departamentosDeLaRegional = todosLosDepartamentos.filter(dep => String(dep.claveReg).trim() === claveRegUsuario);

    // DE PRIMERA INSTANCIA: Si el usuario tiene un centro asignado, mostramos ese. Si no, mostramos todos los de la regional.
    if (centroUsuarioLogueado) {
        if (selectFiltro) selectFiltro.value = centroUsuarioLogueado;
        const filtradosPorCentro = departamentosDeLaRegional.filter(dep => String(dep.claveCentro).trim() === centroUsuarioLogueado);
        pintarTarjetasDepartamentos(filtradosPorCentro.length > 0 ? filtradosPorCentro : departamentosDeLaRegional);
    } else {
        pintarTarjetasDepartamentos(departamentosDeLaRegional);
    }
}

// Función que dibuja las tarjetas en pantalla
function pintarTarjetasDepartamentos(listaDepartamentos) {
    const contenedorMenu = document.getElementById('menu-dinamico-departamentos');
    if (!contenedorMenu) return;

    contenedorMenu.innerHTML = '';

    if (listaDepartamentos.length === 0) {
        contenedorMenu.innerHTML = '<p class="text-xs text-stone-400 col-span-full">No se encontraron departamentos disponibles.</p>';
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

// Función que filtra las tarjetas cuando seleccionas un campo en el desplegable
function filtrarPorCampoRegional(claveCentroSeleccionado) {
    if (!datosGlobalesSistema || !datosGlobalesSistema.departamentos) return;

    const areaUsuario = String(localStorage.getItem('session_area') || 'CIRNODIR').trim();
    const depUsuario = datosGlobalesSistema.departamentos.find(dep => String(dep.claveReg).trim() === areaUsuario);
    const claveRegUsuario = depUsuario ? String(depUsuario.claveReg).trim() : "100";

    const departamentosDeLaRegional = datosGlobalesSistema.departamentos.filter(dep => String(dep.claveReg).trim() === claveRegUsuario);

    if (!claveCentroSeleccionado) {
        pintarTarjetasDepartamentos(departamentosDeLaRegional);
    } else {
        const filtrados = departamentosDeLaRegional.filter(dep => String(dep.claveCentro).trim() === String(claveCentroSeleccionado).trim());
        pintarTarjetasDepartamentos(filtrados);
    }
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