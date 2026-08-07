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

            // Si estamos en el index, inicializamos la carga del menú dinámico de departamentos
            if (paginaActual.includes('index.html') || paginaActual.endsWith('/')) {
                inicializarMenuDepartamentos();
            }
        }
    }
};

// Función para solicitar los departamentos a Google Apps Script
function inicializarMenuDepartamentos() {
    const URL_DIRECTA = "https://script.google.com/macros/s/AKfycbwpyFlplS4e2C3UrfF5Ap9xkqn6Dr4FElpfj10JxMotZtKo2Drs9vE7eP43dsPeiPaKOA/exec";

    fetch(URL_DIRECTA, {
        method: 'POST',
        headers: {
            'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify({ action: "obtenerDatosSistema" }) // <-- Coincide exactamente con el doPost
    })
    .then(res => res.json())
    .then(data => {
        // Como tu función devuelve { success: true, movimientos, categorias, departamentos }
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


// Renderiza las tarjetas del menú según la tabla de Apps Script
function renderizarMenuDepartamentos(todosLosDepartamentos) {
    const contenedorMenu = document.getElementById('menu-dinamico-departamentos');
    if (!contenedorMenu) return;

    contenedorMenu.innerHTML = '';

    // Recuperamos el área o rol del usuario logueado
    const areaDelUsuario = localStorage.getItem('session_area') || 'CIRNODIR'; 

    // Aquí puedes filtrar si lo deseas, o mostrar todos los de la regional
    const departamentosPermitidos = todosLosDepartamentos.filter(dep => {
        // Ejemplo: Si quieres filtrar estricto por el área del usuario:
        // return dep.nomCotDep === areaDelUsuario;
        return true; // Muestra todos los de la tabla por defecto
    });

    departamentosPermitidos.forEach((dep, index) => {
        const esActivo = index === 0 ? 'border-[#249444] bg-emerald-50/80 shadow-sm' : 'border-stone-200';
        const iconoBg = index === 0 ? 'bg-[#249444] text-white' : 'bg-emerald-50 text-[#249444]';

        const btnHTML = `
            <button onclick="seleccionarDepartamento('${dep.nomCotDep}', this)" 
                class="area-btn ${esActivo} flex flex-col items-center justify-center p-4 rounded-xl border hover:border-[#249444] hover:bg-emerald-50/50 transition-all text-center cursor-pointer group">
                <div class="w-10 h-10 rounded-lg ${iconoBg} flex items-center justify-center mb-2 group-hover:bg-[#249444] group-hover:text-white transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg>
                </div>
                <span class="text-xs font-bold text-stone-700 group-hover:text-[#249444]">${dep.nomDep}</span>
            </button>
        `;
        contenedorMenu.innerHTML += btnHTML;
    });
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