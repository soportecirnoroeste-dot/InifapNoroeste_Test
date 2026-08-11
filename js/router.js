document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    
    // 1. Capturamos el nombre corto que viene en la URL (ej. 'sistemas', 'rh', etc.)
    const nombreCorto = (urlParams.get('depto') || '').toLowerCase().trim();
    
    console.log("Nombre corto recibido en el main:", nombreCorto);

    const navContainer = document.getElementById('dept-options-nav');
    const container = document.getElementById('app-container');

    if (!nombreCorto) {
        mostrarError("No se especificó ningún departamento en la URL.");
        return;
    }

    // 2. Buscamos de forma automática la variable de configuración global correspondiente
    // Por ejemplo, si llega 'sistemas', buscará una variable llamada 'sistemasConfig'
    // Si llega 'rh', buscarará 'rhConfig'
    const nombreVariableConfig = nombreCorto + 'Config';
    const deptoData = window[nombreVariableConfig]; // Busca la variable globalmente en el navegador

    if (deptoData === 'cirnosisConfig ') {
        // 3. Pintar el menú superior dinámicamente con las opciones que traiga ese depto
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

        // 4. Ejecutar por defecto la primera opción del menú
        if (deptoData.options.length > 0) {
            eval(deptoData.options[0].action);
        }
    } else {
        // Si el archivo JS de ese departamento no ha sido cargado o no existe su configuración
        navContainer.innerHTML = `<span class="text-xs text-red-500 font-bold px-3">Sin configuración</span>`;
        container.innerHTML = `
            <div class="text-center py-20 bg-white rounded-2xl border border-stone-200 shadow-sm">
                <h2 class="text-2xl font-bold text-red-500">Departamento no configurado</h2>
                <p class="text-xs text-stone-500 mt-2">No se encontró la configuración <code class="bg-stone-100 px-2 py-1 rounded text-stone-700">${nombreVariableConfig}</code> para el departamento: <strong class="text-stone-800">"${nombreCorto}"</strong></p>
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