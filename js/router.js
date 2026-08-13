// js/router.js
(function () {
    console.log("Router iniciado correctamente.");

    const params = new URLSearchParams(window.location.search);
    const nombreCortoUrl = (params.get('depto') || '').toLowerCase().trim();

    if (!nombreCortoUrl) {
        console.warn("No se especificó ningún departamento en la URL.");
        mostrarErrorDepto("No se especificó ningún departamento.");
        return;
    }

    // 1. Obtener el nombre oficial (intentando leer caché, si no, usa el de la URL)
    let nombreOficialDep = nombreCortoUrl;
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
        console.warn("No se pudo leer la caché local, usando nombre por defecto.");
    }

    // 2. Cargar dinámicamente el archivo de script del departamento correspondiente
    const script = document.createElement('script');
    script.src = `js/${nombreCortoUrl}.js`;

    script.onload = () => {
        const nombreVariableConfig = nombreCortoUrl + 'Config';
        const deptoData = window[nombreVariableConfig];

        if (deptoData && deptoData.options) {
            const contenedorApp = document.getElementById('app-container');
            if (!contenedorApp) {
                console.error("No se encontró el contenedor #app-container");
                return;
            }

            let tarjetasHtml = '';
            const coloresBg = [
                'bg-[#f0fdf4] border-[#c6f6d5] text-[#059669]',
                'bg-[#fffbeb] border-[#fef3c7] text-[#d97706]',
                'bg-[#eff6ff] border-[#bfdbfe] text-[#2563eb]',
                'bg-[#faf5ff] border-[#f3e8ff] text-[#7e22ce]',
                'bg-[#fff1f2] border-[#ffe4e6] text-[#e11d48]'
            ];

            deptoData.options.forEach((opt, index) => {
                tarjetasHtml += `
                <div onclick="${opt.action}" style="background: #f9fafb; border: 1px solid #e5e7eb; padding: 20px; border-radius: 12px; cursor: pointer; display: flex; flex-direction: column; justify-content: space-between;">
                    <div>
                        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
                            <span style="font-size: 20px; background: #d1fae5; color: #065f46; padding: 8px; border-radius: 8px;">${opt.icon}</span>
                            <h4 style="font-size: 14px; font-weight: 700; color: #1f2937; margin: 0;">${opt.title}</h4>
                        </div>
                        <p style="font-size: 12px; color: #4b5563; margin: 0;">Módulo de gestión para ${opt.title.toLowerCase()}.</p>
                    </div>
                    <div style="margin-top: 16px; font-size: 10px; font-weight: 700; text-transform: uppercase; color: #059669;">
                        Abrir módulo &rarr;
                    </div>
                </div>
                `;
            });

            contenedorApp.innerHTML = `
            <div style="background-color: #ffffff; padding: 30px; border-radius: 16px; border: 1px solid #e5e7eb; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); margin: 20px auto; max-width: 1000px;">
                <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 24px; padding-bottom: 24px; border-bottom: 2px solid #f3f4f6;">
                    <div style="font-size: 32px; background: #f3f4f6; padding: 12px; border-radius: 12px;">📂</div>
                    <div>
                        <h2 style="font-size: 24px; font-weight: 900; color: #111827; margin: 0 0 4px 0;">${nombreOficialDep.toUpperCase()}</h2>
                        <p style="font-size: 14px; color: #4b5563; margin: 0;">${deptoData.subtitle || 'Selecciona una opción para comenzar.'}</p>
                    </div>
                </div>
                
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px;">
                    ${tarjetasHtml}
                </div>
            </div>
            `;
            console.log("¡Interfaz pintada con éxito!");
        } else {
            console.error("No se encontró la configuración global para: " + nombreVariableConfig);
            mostrarErrorConfig(nombreCortoUrl, "No se encontró el objeto " + nombreVariableConfig);
        }
    };

    script.onerror = () => {
        console.error("No se pudo cargar el archivo de script: js/" + nombreCortoUrl + ".js");
        mostrarErrorConfig(nombreCortoUrl, "Archivo js/" + nombreCortoUrl + ".js no encontrado");
    };

    document.head.appendChild(script);
})();

function activarSubmenu(idOpt, btnElement) {
    document.querySelectorAll('.dept-opt-btn').forEach(btn => {
        btn.classList.remove('bg-white', 'shadow-xs', 'text-[#249444]');
        btn.classList.add('text-stone-600');
    });
    btnElement.classList.remove('text-stone-600');
    btnElement.classList.add('bg-white', 'shadow-xs', 'text-[#249444]');
}

function mostrarErrorDepto(mensaje) {
    const navElem = document.getElementById('dept-options-nav');
    const appElem = document.getElementById('app-container');
    if (navElem) navElem.innerHTML = `<span class="text-xs text-red-500 font-bold px-3">Sin departamento</span>`;
    if (appElem) appElem.innerHTML = `<div class="text-center py-20 font-bold text-red-500">${mensaje}</div>`;
}

function mostrarErrorConfig(nombreCorto, detalle) {
    const navElem = document.getElementById('dept-options-nav');
    const appElem = document.getElementById('app-container');
    if (navElem) navElem.innerHTML = `<span class="text-xs text-red-500 font-bold px-3">Sin configuración</span>`;
    if (appElem) {
        appElem.innerHTML = `
        <div class="text-center py-20 bg-white rounded-2xl border border-stone-200 shadow-sm">
            <h2 class="text-2xl font-bold text-red-500">Departamento no configurado</h2>
            <p class="text-xs text-stone-500 mt-2">No se pudo cargar correctamente el archivo o la estructura para: <strong class="text-stone-800">"${nombreCorto}"</strong> (<code class="bg-stone-100 px-2 py-1 rounded text-stone-700">${detalle}</code>)</p>
            <a href="index.html" class="inline-block mt-6 px-6 py-2 bg-[#249444] text-white rounded-xl text-xs font-bold">Regresar al inicio</a>
        </div>
    `;
    }
}