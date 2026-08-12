document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const nombreCortoUrl = (urlParams.get('depto') || '').toLowerCase().trim();
    
    const navContainer = document.getElementById('dept-options-nav');
    const headerTitleSpan = document.getElementById('header-depto-title');

    if (!nombreCortoUrl) {
        mostrarErrorDepto("No se especificó ningún departamento en la URL.");
        return;
    }

    let nombreOficialDep = nombreCortoUrl; // Valor por defecto si no se encuentra

    try {
        // Obtenemos los datos directamente de la caché local existente
        const cacheBruto = localStorage.getItem('sistema_cache_datos');
        if (cacheBruto) {
            const cacheObj = JSON.parse(cacheBruto);
            const departamentos = cacheObj.departamentos || [];

            // Buscamos el departamento coincidente por su clave o identificador corto
            const deptoEncontrado = departamentos.find(row => {
                const depNom = (row.nomDep || '').toLowerCase().trim();
                // Puedes adaptar esta validación si en tu caché guardas un campo como 'nomCorDep'
                return depNom.includes(nombreCortoUrl) || depNom === nombreCortoUrl;
                alert(depNom);
            });

            if (deptoEncontrado && deptoEncontrado.nomDep) {
                nombreOficialDep = deptoEncontrado.nomDep;
            }
        }
    } catch (e) {
        console.warn("No se pudo leer la caché local para el título, usando el parámetro de la URL.");
    }

    // Inyectamos el nombre oficial en el header
    if (headerTitleSpan) {
        headerTitleSpan.innerHTML = `SISTEMA REGIONAL INTERNO <span class="text-stone-400 font-normal">/</span> ${nombreOficialDep.toUpperCase()}`;
    }

    // Cargamos el archivo .js del departamento correspondiente
    const rutaScript = `js/${nombreCortoUrl}.js`;
    const script = document.createElement('script');
    script.src = rutaScript;
    script.defer = true;

    script.onload = () => {
        const nombreVariableConfig = nombreCortoUrl + 'Config';
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
            mostrarErrorConfig(nombreCortoUrl, nombreVariableConfig);
        }
    };

    script.onerror = () => {
        mostrarErrorConfig(nombreCortoUrl, `js/${nombreCortoUrl}.js`);
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