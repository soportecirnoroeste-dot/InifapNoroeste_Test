const AuthGuard = {
    verificarAcceso: () => {
        const usuario = localStorage.getItem('usuario_sesion');
        const paginaActual = window.location.pathname;

        console.log("Usuario encontrado:", usuario); // Para ver el valor en consola
        console.log("Página actual:", paginaActual);

        if (!usuario && !paginaActual.includes('login.html')) {
            window.location.href = 'login.html';
        } 
        else if (usuario && paginaActual.includes('login.html')) {
            window.location.href = 'index.html'; 
        } 
        else {
            document.body.classList.add('auth-checked');
        }
    }
};
document.addEventListener('DOMContentLoaded', AuthGuard.verificarAcceso);
