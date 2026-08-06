const AuthGuard = {
    verificarAcceso: () => {
        const usuario = localStorage.getItem('usuario_sesion'); // Ajusta según tu llave de almacenamiento
        const paginaActual = window.location.pathname;

        // Si no hay usuario y no estamos en el login, redirigir al login
        if (!usuario && !paginaActual.includes('login.html')) {
            window.location.href = 'login.html';
        } 
        // Si hay usuario y estamos en el login, redirigir al inicio/dashboard
        else if (usuario && paginaActual.includes('login.html')) {
            window.location.href = 'index.html'; 
        }
    }
};

// Ejecutar la verificación al cargar cualquier página
document.addEventListener('DOMContentLoaded', AuthGuard.verificarAcceso);