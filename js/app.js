const AuthGuard = {
    verificarAcceso: () => {
        const estaLogueado = localStorage.getItem('isLoggedIn');
        const paginaActual = window.location.pathname;

        // Si ya hay sesión y estamos en el login, mandamos al index
        if (estaLogueado === 'true' && (paginaActual.includes('login.html') || paginaActual.endsWith('/'))) {
            window.location.href = 'index.html';
            return;
        }

        // Si NO hay sesión y NO estamos en el login, redirigir al login
        if (estaLogueado !== 'true' && !paginaActual.includes('login.html')) {
            window.location.href = 'login.html';
            return;
        } 

        // Si todo está bien, mostramos el contenido eliminando el ocultamiento del CSS
        document.body.classList.add('auth-checked');
    }
};

document.addEventListener('DOMContentLoaded', AuthGuard.verificarAcceso);