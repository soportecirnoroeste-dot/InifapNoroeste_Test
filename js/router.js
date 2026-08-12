document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const nombreCorto = (urlParams.get('depto') || '').toLowerCase().trim();

    const navContainer = document.getElementById('dept-options-nav');
    const headerTitleSpan = document.getElementById('header-depto-title');

    if (!nombreCorto) {
        mostrarErrorDepto("No se especificó ningún departamento en la URL.");
        return;
    }

    // AQUÍ VA EL CAMBIO: Inyectamos el nombre de Sheets o usamos respaldo si el localStorage está vacío
    const nombreOficialSheets = localStorage.getItem('nomDepActual');
    if (headerTitleSpan) {
        if (nombreOficialSheets) {
            headerTitleSpan.innerHTML = `SISTEMA REGIONAL INTERNO <span class="text-stone-400 font-normal">/</span> ${nombreOficialSheets.toUpperCase()}`;
        } else {
            // Respaldo de emergencia por si abres el enlace directo y no pasa por el index
            headerTitleSpan.innerHTML = `SISTEMA REGIONAL INTERNO <span class="text-stone-400 font-normal">/</span> ${nombreCorto.toUpperCase()}`;
        }
    }

    const rutaScript = `js/${nombreCorto}.js`;
    const script = document.createElement('script');
    script.src = rutaScript;
    script.defer = true;

    script.onload = () => {
        const nombreVariableConfig = nombreCorto + 'Config';
        const deptoData = window[nombreVariableConfig];

        if (deptoData && deptoData.options) {
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

            if (deptoData.options.length > 0) {
                eval(deptoData.options[0].action);
            }
        } else {
            mostrarErrorConfig(nombreCorto, nombreVariableConfig);
        }
    };

    script.onerror = () => {
        mostrarErrorConfig(nombreCorto, `js/${nombreCorto}.js`);
    };

    document.head.appendChild(script);
});

function activarSubmenu(idOpt, btnElement) {
    document.querySelectorAll('.dept-opt-btn').forEach(btn => {
        btn.classList.remove('bg-white', 'shadow-xs', 'text-[#249444]');
        btn.classList.add('text-stone-600');
    });
    btnElement.classList.remove('text-stone-600');
    btnElement.classList.add('bg-white', 'shadow-xs', 'text-[#249444]');
}

function mostrarErrorDepto(mensaje) {
    document.getElementById('dept-options-nav').innerHTML = `<span class="text-xs text-red-500 font-bold px-3">Sin departamento</span>`;
    document.getElementById('app-container').innerHTML = `<div class="text-center py-20 font-bold text-red-500">${mensaje}</div>`;
}

function mostrarErrorConfig(nombreCorto, detalle) {
    document.getElementById('dept-options-nav').innerHTML = `<span class="text-xs text-red-500 font-bold px-3">Sin configuración</span>`;
    document.getElementById('app-container').innerHTML = `
        <div class="text-center py-20 bg-white rounded-2xl border border-stone-200 shadow-sm">
            <h2 class="text-2xl font-bold text-red-500">Departamento no configurado</h2>
            <p class="text-xs text-stone-500 mt-2">No se pudo cargar correctamente el archivo o la estructura para: <strong class="text-stone-800">"${nombreCorto}"</strong> (<code class="bg-stone-100 px-2 py-1 rounded text-stone-700">${detalle}</code>)</p>
            <a href="index.html" class="inline-block mt-6 px-6 py-2 bg-[#249444] text-white rounded-xl text-xs font-bold">Regresar al inicio</a>
        </div>
    `;
}