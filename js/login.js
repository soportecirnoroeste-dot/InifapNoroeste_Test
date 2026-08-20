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
    const btnIngresar = form.querySelector('button[type="submit"]') || document.getElementById('btn-ingresar');
    
    if (!btnIngresar) return;

    const textoOriginal = btnIngresar.innerHTML;

    try {
        // Deshabilitar el botón y aplicar el spinner estilo control financiero
        btnIngresar.disabled = true;
        btnIngresar.style.opacity = "0.8";
        btnIngresar.style.cursor = "not-allowed";
        
        btnIngresar.innerHTML = `
            <span style="display: inline-flex; align-items: center; justify-content: center; gap: 8px;">
                <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style="animation: rotarSpinner 0.8s linear infinite;">
                    <style>
                        @keyframes rotarSpinner {
                            0% { transform: rotate(0deg); }
                            100% { transform: rotate(360deg); }
                        }
                    </style>
                    <path d="M12,4V2A10,10 0 0,0 2,12H4A8,8 0 0,1 12,4Z" fill="currentColor"/>
                </svg>
                Procesando acceso...
            </span>
        `;

        const formData = new FormData(form);
        const datos = Object.fromEntries(formData.entries());

        const respuesta = await FetchAPI('login', datos);

        if (respuesta && respuesta.success) {
            localStorage.setItem('usuarioActivo', JSON.stringify(respuesta));
            window.location.href = "dashboard.html"; 
        } else {
            alert(respuesta.message || "Credenciales incorrectas.");
            restaurarBoton(btnIngresar, textoOriginal);
        }

    } catch (error) {
        console.error("Error en el login:", error);
        alert("Ocurrió un error al conectar con el servidor.");
        restaurarBoton(btnIngresar, textoOriginal);
    }
}

function restaurarBoton(boton, textoOriginal) {
    boton.disabled = false;
    boton.style.opacity = "1";
    boton.style.cursor = "pointer";
    boton.innerHTML = textoOriginal;
}


