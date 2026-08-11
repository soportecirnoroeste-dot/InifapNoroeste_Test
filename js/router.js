// js/router.js
const routes = {
    'home': '<h1>Panel Principal</h1><p>Selecciona un depto...</p>',
    'sistemas': `
        <section class="bg-white rounded-2xl p-8">
            <h2 class="text-2xl font-bold text-[#249444]">Departamento de Sistemas</h2>
            <div class="mt-4">
                <button class="bg-[#249444] text-white px-4 py-2 rounded">Reporte de Servidores</button>
                <button class="bg-stone-800 text-white px-4 py-2 rounded">Gestión de Usuarios</button>
            </div>
        </section>
    `,
    'recursos': `
        <section class="bg-white rounded-2xl p-8">
            <h2 class="text-2xl font-bold text-[#249444]">Recursos Humanos</h2>
            <!-- Contenido de RH -->
        </section>
    `
};

function navigateTo(page) {
    const container = document.getElementById('app-container');
    container.innerHTML = routes[page] || '<h1>Página no encontrada</h1>';
}