// js/router.js

// Mapa general que unifica las configuraciones de cada departamento
const departmentsRegistry = {
    'sis': typeof sistemasConfig !== 'undefined' ? sistemasConfig : null,
    // Aquí puedes agregar después 'rh': recursosConfig, etc.
};

document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const deptoKey = (urlParams.get('depto') || 'sis').toLowerCase();

    const deptoData = departmentsRegistry[deptoKey];
    const navContainer = document.getElementById('dept-options-nav');
    const container = document.getElementById('app-container');

    if (deptoData) {
        // 1. Pintar los botones del menú superior en la barra central
        let navHtml = '';
        deptoData.options.forEach((opt, index) => {
            navHtml += `
                <button onclick="activarSubmenu('${opt.id}', this); ${opt.action}" 
                    class="dept-opt-btn px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 text-stone-600 hover:text-[#249444] hover:bg-white cursor-pointer ${index === 0 ? 'active-dept-opt bg-white shadow-xs text-[#249444]' : ''}">
                    <span>${opt.icon}</span>
                    <span>${opt.title}</span>
                </button>
            `;
        });
        navContainer.innerHTML = navHtml;

        // 2. Ejecutar por defecto la primera opción
        if (deptoData.options.length > 0) {
            eval(deptoData.options[0].action);
        }
    } else {
        navContainer.innerHTML = `<span class="text-xs text-red-500 font-bold px-3">Departamento no encontrado</span>`;
        container.innerHTML = `
            <div class="text-center py-20 bg-white rounded-2xl border border-stone-200">
                <h2 class="text-2xl font-bold text-red-500">Clave de departamento inválida</h2>
                <a href="index.html" class="inline-block mt-6 px-6 py-2 bg-[#249444] text-white rounded-xl text-xs font-bold">Regresar al inicio</a>
            </div>
        `;
    }
});

function activarSubmenu(idOpt, btnElement) {
    document.querySelectorAll('.dept-opt-btn').forEach(btn => {
        btn.classList.remove('bg-white', 'shadow-xs', 'text-[#249444]');
        btn.classList.add('text-stone-600');
    });
    btnElement.classList.remove('text-stone-600');
    btnElement.classList.add('bg-white', 'shadow-xs', 'text-[#249444]');
}