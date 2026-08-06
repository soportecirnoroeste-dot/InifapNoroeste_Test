const AuthGuard = {
    verificarAcceso: () => {
        const usuario = localStorage.getItem('usuario_sesion');
        const paginaActual = window.location.pathname;

        // Si estamos en el login y ya hay sesión, mandamos al index
        if (usuario && (paginaActual.includes('login.html') || paginaActual.endsWith('/'))) {
            window.location.href = 'index.html';
            return;
        }

        // Si NO hay usuario y NO estamos en el login, redirigir al login
        if (!usuario && !paginaActual.includes('login.html')) {
            window.location.href = 'login.html';
            return;
        } 

        // Si todo está bien, mostramos el contenido eliminando el ocultamiento del CSS
        document.body.classList.add('auth-checked');
    }
};

// Ejecutar la verificación al cargar la página
document.addEventListener('DOMContentLoaded', AuthGuard.verificarAcceso);
