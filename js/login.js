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
    }
};

window.AuthModule = AuthModule;

// ========================================================
// EVENTOS Y FUNCIONES GLOBALES DE LOGIN
// ========================================================
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

function manejarLoginExitoso(datosUsuario) {
    console.warn('Entra');
    localStorage.setItem('usuario_sesion', 'Activo');
    window.location.href = 'index.html';
}

function logout() {
    localStorage.removeItem('usuario_sesion');
    window.location.href = 'login.html';
}

// Función principal de acceso con spinner y llamadas unificadas
async function ejecutarLogin(event) {
    if (event) event.preventDefault();

    const form = event.target;
    const btnIngresar = form.querySelector('button[type="submit"]') || document.getElementById('btn-ingresar');
    
    if (!btnIngresar) return;

    var usuarioInput = document.getElementById('login-user').value.trim();
    var passwordInput = document.getElementById('login-pass').value.trim();

    if (!usuarioInput || !passwordInput) {
        alert("Por favor llena todos los campos.");
        return;
    }

    const textoOriginal = btnIngresar.innerHTML;

    try {
        // Deshabilitar botón y activar spinner de carga
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

        // Petición al backend unificada (usando user y pass como espera tu Apps Script)
        var respuesta = await FetchAPI("login", { user: usuarioInput, pass: passwordInput });

        if (respuesta && respuesta.success) {
            // Guardamos las variables de sesión del sistema
            localStorage.setItem('usuario_sesion', respuesta.usuario || usuarioInput);
            localStorage.setItem('session_userName', respuesta.userName || "Usuario");
            localStorage.setItem('session_area', respuesta.area || "CIRNODIR");
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('usuarioActivo', JSON.stringify(respuesta));
            localStorage.setItem('ultima_seccion', 'home');

            setTimeout(() => {
                window.location.href = "./index.html";
            }, 400);
        } else {
            var msg = respuesta && respuesta.message ? respuesta.message : "Número de empleado o contraseña incorrectos.";
            alert(msg);
            restaurarBoton(btnIngresar, textoOriginal);
        }

    } catch (error) {
        console.error("Error atrapado en el login:", error);
        alert("Error al conectar con el servidor.");
        restaurarBoton(btnIngresar, textoOriginal);
    }
}

function restaurarBoton(boton, textoOriginal) {
    boton.disabled = false;
    boton.style.opacity = "1";
    boton.style.cursor = "pointer";
    boton.innerHTML = textoOriginal;
}