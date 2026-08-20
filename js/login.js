// ========================================================
// MÓDULO DE AUTENTICACIÓN - SISTEMA INIFAP
// ========================================================
var AuthModule = {

    togglePasswordVisibility: function () {
        var passInput = document.getElementById('login-pass');
        var eyeOpen = document.getElementById('eye-open');
        var eyeClosed = document.getElementById('eye-closed');

        if (!passInput) return;

        if (passInput.type === 'password') {
            passInput.type = 'text';
            if (eyeOpen) eyeOpen.style.display = 'none';
            if (eyeClosed) eyeClosed.style.display = 'block';
        } else {
            passInput.type = 'password';
            if (eyeOpen) eyeOpen.style.display = 'block';
            if (eyeClosed) eyeClosed.style.display = 'none';
        }
    },

    // Reemplaza la función ejecutarLogin en tu login.js por esta:
    ejecutarLogin: async function () {
        if (window._loginEnProceso) return;
        window._loginEnProceso = true;

        var usuarioInput = document.getElementById('login-user').value.trim();
        var passwordInput = document.getElementById('login-pass').value.trim();

        if (!usuarioInput || !passwordInput) {
            alert("Por favor llena todos los campos.");
            window._loginEnProceso = false;
            return;
        }

        const overlay = document.getElementById('loading-overlay');
        if (overlay) {
            overlay.style.display = 'flex';
            overlay.style.opacity = '1';
        }

        try {
            // Petición al backend que ya tienes configurado
            var res = await FetchAPI("login", { user: usuarioInput, pass: passwordInput });

            if (res && res.success) {
                // AQUÍ ESTÁ LA CLAVE: Guardamos exactamente los campos que devuelve tu Apps Script
                localStorage.setItem('usuario_sesion', res.usuario || usuarioInput);
                localStorage.setItem('session_userName', res.userName || "Usuario");
                localStorage.setItem('session_area', res.area || "CIRNODIR"); // <-- Guardamos el área/departamento recibido
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('ultima_seccion', 'home');

                setTimeout(() => {
                    window.location.href = "./index.html";
                }, 400);
            } else {
                if (overlay) overlay.style.display = 'none';
                var msg = res && res.message ? res.message : "Número de empleado o contraseña incorrectos.";
                alert(msg);
                window._loginEnProceso = false;
            }
        } catch (err) {
            if (overlay) overlay.style.display = 'none';
            console.error("Error atrapado en el login:", err);
            alert("Error al conectar con el servidor.");
            window._loginEnProceso = false;
        }
    }
};

window.AuthModule = AuthModule;

document.addEventListener("DOMContentLoaded", () => {
    const overlay = document.getElementById('loading-overlay');
    if (overlay) {
        overlay.style.opacity = '0';
        setTimeout(() => overlay.remove(), 300);
    }

    var btnToggle = document.getElementById('btn-toggle-pass');
    if (btnToggle) {
        btnToggle.addEventListener('click', AuthModule.togglePasswordVisibility);
    }
});

// Dentro de tu función de login exitoso
function manejarLoginExitoso(datosUsuario) {
    console.warn('Entra');
    localStorage.setItem('usuario_sesion', 'Activo');
    window.location.href = 'index.html';
}

function logout() {
    localStorage.removeItem('usuario_sesion');
    window.location.href = 'login.html';
}

async function ejecutarLogin(event) {
    if (event) event.preventDefault();

    const form = event.target;
    const btnIngresar = form.querySelector('button[type="submit"]');
    
    // Guardamos el texto original del botón para poder restaurarlo si hay error
    const textoOriginal = btnIngresar.innerHTML;

    try {
        // 1. Desactivar el botón y mostrar el Spinner + Texto de carga
        btnIngresar.disabled = true;
        btnIngresar.innerHTML = `
            <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Verificando credenciales...
        `;

        // Extraemos los datos del formulario
        const formData = new FormData(form);
        const datos = Object.fromEntries(formData.entries());

        // 2. Llamada a FetchAPI
        const respuesta = await FetchAPI('login', datos);

        if (respuesta && respuesta.success) {
            // Guardamos sesión y redirigimos
            localStorage.setItem('usuarioActivo', JSON.stringify(respuesta));
            window.location.href = "dashboard.html"; // O tu vista principal
        } else {
            alert(respuesta.message || "Credenciales incorrectas.");
            // Restauramos el botón si el login falla
            btnIngresar.disabled = false;
            btnIngresar.innerHTML = textoOriginal;
        }

    } catch (error) {
        console.error("Error en el login:", error);
        alert("Ocurrió un error al conectar con el servidor.");
        // Restauramos el botón en caso de error de red/CORS
        btnIngresar.disabled = false;
        btnIngresar.innerHTML = textoOriginal;
    }
}


