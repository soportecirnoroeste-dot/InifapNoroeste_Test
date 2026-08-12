document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const nombreCortoUrl = (urlParams.get('depto') || '').toLowerCase().trim();

    const navContainer = document.getElementById('dept-options-nav');
    const headerTitleSpan = document.getElementById('header-depto-title');

    if (!nombreCortoUrl) {
        mostrarErrorDepto("No se especificó ningún departamento en la URL.");
        return;
    }

    let nombreOficialDep = "";

    try {
        const cacheBruto = localStorage.getItem('sistema_cache_datos');
        if (cacheBruto) {
            const cacheObj = JSON.parse(cacheBruto);
            const departamentos = cacheObj.departamentos || [];

            const deptoEncontrado = departamentos.find(row => {
                const cor = (row.nomCorDep || '').toLowerCase().trim();
                if (cor) return cor === nombreCortoUrl;
                return (row.nomDep || '').toLowerCase().includes(nombreCortoUrl);
            });

            if (deptoEncontrado && deptoEncontrado.nomDep) {
                nombreOficialDep = deptoEncontrado.nomDep;
            }
        }
    } catch (e) {
        console.warn("No se pudo leer la caché local para el título.");
    }

    if (!nombreOficialDep) {
        nombreOficialDep = nombreCortoUrl;
    }

    if (headerTitleSpan) {
        headerTitleSpan.innerHTML = `SISTEMA REGIONAL INTERNO <span class="text-stone-400 font-normal">/</span> ${nombreOficialDep.toUpperCase()}`;
    }

    const rutaScript = `js/${nombreCortoUrl}.js`;
    const script = document.createElement('script');
    script.src = rutaScript;
    script.defer = true;

script.onload = () => {
        const nombreVariableConfig = nombreCortoUrl + 'Config';
        const deptoData = window[nombreVariableConfig];

        if (deptoData && deptoData.options) {
            let navHtml = '';
            deptoData.options.forEach((opt) => {
                navHtml += `
                    <button onclick="activarSubmenu('${opt.id}', this); ${opt.action}" 
                        class="dept-opt-btn px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 text-stone-600 hover:text-[#249444] hover:bg-white cursor-pointer">
                        <span>${opt.icon}</span>
                        <span>${opt.title}</span>
                    </button>
                `;
            });
            navContainer.innerHTML = navHtml;

            // --- AGREGAR ESTA LÓGICA AQUÍ ---
            // Buscamos dinámicamente si existe una función de bienvenida para este depto y la ejecutamos
            // Ejemplo: si nombreCortoUrl es 'cirnorh', buscará 'cargarBienvenidaRh' o similar.
            // O podemos buscar cualquier función global que empiece con "cargarBienvenida"
            const fnBienvenidaNombre = Object.keys(window).find(key => 
                key.toLowerCase().includes('bienvenida') && typeof window[key] === 'function'
            );

            if (fnBienvenidaNombre) {
                window[fnBienvenidaNombre]();
            } else {
                // Respaldo por si acaso: muestra un contenedor limpio de bienvenida genérico
                document.getElementById('app-container').innerHTML = `
                    <div class="bg-white rounded-2xl p-8 border border-stone-200 shadow-sm animate-fade-in">
                        <h2 class="font-black text-stone-900 text-xl mb-2">👋 ¡Bienvenido/a al módulo!</h2>
                        <p class="text-xs text-stone-500">Selecciona una opción del menú superior para comenzar.</p>
                    </div>
                `;
            }
            // ---------------------------------

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