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

// Variable global para almacenar los datos crudos que vienen de Google Sheets
let datosGlobalesSistema = null;

// Función modificada para guardar los datos globales y poblar los filtros
function renderizarMenuDepartamentos(todosLosDepartamentos) {
    datosGlobalesSistema = todosLosDepartamentos;

    // Mostramos la regional del usuario logueado en pantalla
    const areaUsuario = localStorage.getItem('session_area') || 'CIRNODIR';
    const labelRegional = document.getElementById('user-regional-display');
    if (labelRegional) {
        labelRegional.textContent = areaUsuario;
    }

    // Poblar el selector con las regionales únicas de la tabla de departamentos
    const selectFiltro = document.getElementById('filtro-regional');
    if (selectFiltro) {
        // Obtenemos las claves regionales únicas (claveReg o nomCotDep según prefieras)
        const regionalesUnicas = [...new Set(todosLosDepartamentos.map(d => d.claveReg))].filter(Boolean);

        selectFiltro.innerHTML = '<option value="">Todas las Regionales</option>';
        regionalesUnicas.forEach(reg => {
            selectFiltro.innerHTML += `<option value="${reg}">Regional: ${reg}</option>`;
        });
    }

    // Dibujamos todos por defecto (o filtrados por el área del usuario si lo deseas)
    pintarTarjetasDepartamentos(todosLosDepartamentos);
}

// Función que dibuja las tarjetas en el contenedor debajo de "Menu"
function pintarTarjetasDepartamentos(listaDepartamentos) {
    const contenedorMenu = document.getElementById('menu-dinamico-departamentos');
    if (!contenedorMenu) return;

    contenedorMenu.innerHTML = '';

    if (listaDepartamentos.length === 0) {
        contenedorMenu.innerHTML = '<p class="text-xs text-stone-400 col-span-full">No se encontraron departamentos para esta selección.</p>';
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
                <span class="text-[10px] text-stone-400 mt-1">Reg: ${dep.claveReg}</span>
            </button>
        `;
        contenedorMenu.innerHTML += btnHTML;
    });
}

// Función que filtra los departamentos al cambiar la opción del selector convertido
function filtrarDepartamentosPorRegional(regionalSeleccionada) {
    if (!datosGlobalesSistema) return;

    if (!regionalSeleccionada) {
        pintarTarjetasDepartamentos(datosGlobalesSistema);
    } else {
        const filtrados = datosGlobalesSistema.filter(dep => dep.claveReg === regionalSeleccionada);
        pintarTarjetasDepartamentos(filtrados);
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