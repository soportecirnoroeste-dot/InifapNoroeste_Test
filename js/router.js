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
            // 1. Vaciamos o dejamos limpio el contenedor superior del menú (ya no va arriba)
            navContainer.innerHTML = '';

            // 2. Función genérica para pintar la bienvenida y las tarjetas en el #app-container
            window.cargarBienvenidaGeneral = () => {
                let tarjetasHtml = '';
                const coloresBg = [
                    'bg-[#f0fdf4] border-[#c6f6d5] text-[#059669]',
                    'bg-[#fffbeb] border-[#fef3c7] text-[#d97706]',
                    'bg-[#eff6ff] border-[#bfdbfe] text-[#2563eb]',
                    'bg-[#faf5ff] border-[#f3e8ff] text-[#7e22ce]',
                    'bg-[#fff1f2] border-[#ffe4e6] text-[#e11d48]'
                ];

                deptoData.options.forEach((opt, index) => {
                    const estiloColor = coloresBg[index % coloresBg.length];
                    tarjetasHtml += `
                    <div onclick="${opt.action}" 
                         class="p-5 rounded-xl border cursor-pointer hover:shadow-md transition-all bg-white flex flex-col justify-between group">
                        <div>
                            <div class="flex items-center gap-2 mb-2">
                                <span class="text-xl p-2 rounded-lg ${estiloColor.split(' ')[0]}">${opt.icon}</span>
                                <h4 class="font-bold text-stone-800 text-sm group-hover:text-[#249444] transition-colors">${opt.title}</h4>
                            </div>
                            <p class="text-xs text-stone-500">Módulo de gestión para ${opt.title.toLowerCase()}.</p>
                        </div>
                        <div class="mt-4 text-[10px] font-bold uppercase tracking-wider text-stone-400 group-hover:text-[#249444] flex items-center gap-1">
                            <span>Abrir módulo</span> &rarr;
                        </div>
                    </div>
                `;
                });

                document.getElementById('app-container').innerHTML = `
                <div class="bg-white rounded-2xl p-8 border border-stone-200 shadow-sm animate-fade-in">
                    <div class="flex items-center gap-4 mb-6 pb-6 border-b border-stone-100">
                        <div class="p-3 bg-stone-100 rounded-2xl text-3xl shadow-xs">
                            ${deptoData.options[0]?.icon || '📂'}
                        </div>
                        <div>
                            <h2 class="font-black text-stone-900 text-2xl mb-1">¡Bienvenido/a!</h2>
                            <p class="text-sm text-stone-600 max-w-xl">${deptoData.subtitle || 'Selecciona una de las tarjetas inferiores para comenzar.'}</p>
                        </div>
                    </div>
                    
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        ${tarjetasHtml}
                    </div>

                    <p class="mt-6 text-xs text-stone-400 italic text-center">Última actualización de datos: ${new Date().toLocaleDateString()}</p>
                </div>
            `;
            };

            // 3. Ejecutamos la bienvenida por defecto al entrar al depto
            window.cargarBienvenidaGeneral();

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

