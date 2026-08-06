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

    ejecutarLogin: async function () {
        if (window._loginEnProceso) return;
        window._loginEnProceso = true;

        var usuario = document.getElementById('login-user').value.trim();
        var password = document.getElementById('login-pass').value.trim();

        if (!usuario || !password) {
            alert("Por favor llena todos los campos.");
            window._loginEnProceso = false;
            return;
        }

        // Activamos el overlay de carga si existe en el DOM
        const overlay = document.getElementById('loading-overlay');
        if (overlay) {
            overlay.style.display = 'flex';
            overlay.style.opacity = '1';
        }

        if (typeof toggleLoading === 'function') {
            toggleLoading(true);
        }

        await new Promise(resolve => setTimeout(resolve, 50));

        try {
            // Envía la acción de login al backend (Google Apps Script)
            var res = await FetchAPI("login", { user: usuario, pass: password });

            if (res && res.success) {
                localStorage.setItem('session_user', res.usuario || res.user);
                localStorage.setItem('session_userName', res.userName || "Usuario");
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('ultima_seccion', 'home');

                // Sincronización inicial si el módulo lo requiere
                if (typeof inicializarSincronizacion === 'function') {
                    await inicializarSincronizacion();
                }

                setTimeout(() => {
                    window.location.href = "./index.html";
                }, 600);
            } else {
                if (overlay) {
                    overlay.style.display = 'none';
                }
                if (typeof toggleLoading === 'function') {
                    toggleLoading(false);
                }
                var msg = res && res.message ? res.message : "Número de empleado o contraseña incorrectos.";
                alert(msg);
                window._loginEnProceso = false;
            }
        } catch (err) {
            if (overlay) {
                overlay.style.display = 'none';
            }
            if (typeof toggleLoading === 'function') {
                toggleLoading(false);
            }
            console.error("Error atrapado en el login:", err);
            alert("Error al conectar con el servidor. Revisa la consola.");
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
    localStorage.setItem('usuario_sesion', 'Activo');
    window.location.href = 'index.html';
}

function logout() {
    localStorage.removeItem('usuario_sesion');
    window.location.href = 'login.html';
}
