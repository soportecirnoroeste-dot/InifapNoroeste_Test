// js/router.js

// Registro central por nombre corto (puedes pasarlo a minúsculas para estandarizar)
const departmentsRegistry = {
    'sistemas': typeof sistemasConfig !== 'undefined' ? sistemasConfig : null,
    'sis': typeof sistemasConfig !== 'undefined' ? sistemasConfig : null, // Por si acaso usas la clave corta
    // 'recursos': typeof recursosConfig !== 'undefined' ? recursosConfig : null,
};

document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);

    // Capturamos el valor que venga en la variable (ej. ?depto=sistemas o ?depto=sis)
    const nombreCorto = (urlParams.get('depto') || '').toLowerCase().trim();
    console.log("Valor recibido en la variable depto:", nombreCorto);
    
    const deptoData = departmentsRegistry[nombreCorto];
    const navContainer = document.getElementById('dept-options-nav');
    const container = document.getElementById('app-container');

    if (deptoData) {
        // 1. Pintar el título/menú superior dinámicamente según lo que traiga la variable
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

        // 2. Ejecutar por defecto la primera opción del menú
        if (deptoData.options.length > 0) {
            eval(deptoData.options[0].action);
        }
    } else {
        // Si la variable llega vacía o con un nombre no registrado, lo indicamos claramente
        navContainer.innerHTML = `<span class="text-xs text-red-500 font-bold px-3">Sin departamento</span>`;
        container.innerHTML = `
            <div class="text-center py-20 bg-white rounded-2xl border border-stone-200 shadow-sm">
                <h2 class="text-2xl font-bold text-red-500">Departamento no identificado</h2>
                <p class="text-xs text-stone-500 mt-2">La variable de la URL no contiene un nombre corto válido o activo: <strong class="text-stone-800">"${nombreCorto}"</strong></p>
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