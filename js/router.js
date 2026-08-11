// js/router.js

const departmentsRegistry = {
    'sis': typeof sistemasConfig !== 'undefined' ? sistemasConfig : null,
    // Aquí agregarás los demás cuando gustes (ej. 'rh', 'inv')
};

document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const deptoKey = (urlParams.get('depto') || 'sis').toLowerCase();

    const deptoData = departmentsRegistry[deptoKey];
    const navContainer = document.getElementById('dept-options-nav');
    const container = document.getElementById('app-container');
    console.warn(deptoData)
    if (deptoData) {
        // 1. Pintar el menú superior en la cabecera dentro de main.html
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

        // 2. Cargar por defecto la primera opción (Reuniones) al abrir el main
        if (deptoData.options.length > 0) {
            eval(deptoData.options[0].action);
        }
    } else {
        navContainer.innerHTML = `<span class="text-xs text-red-500 font-bold px-3">Departamento no encontrado</span>`;
        container.innerHTML = `
            <div class="text-center py-20 bg-white rounded-2xl border border-stone-200">
                <h2 class="text-2xl font-bold text-red-500">Clave de departamento inválida</h2>
                <p class="text-xs text-stone-500 mt-2">No se encontró información para la clave especificada.</p>
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