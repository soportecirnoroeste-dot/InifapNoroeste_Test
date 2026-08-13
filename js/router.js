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

            // Limpiar contenedor de forma segura
            contenedorApp.innerHTML = '';

            // Crear contenedor principal visual con nodos nativos
            const wrapper = document.createElement('section');
            wrapper.className = "bg-white rounded-2xl p-6 md:p-8 soft-shadow border border-[#249444]/10 mb-8 w-full box-border animate-fade-in";

            // Cabecera
            const headerDiv = document.createElement('div');
            headerDiv.style.cssText = "display: flex; align-items: center; gap: 16px; margin-bottom: 24px; padding-bottom: 24px; border-bottom: 2px solid #f3f4f6;";

            const iconoCabecera = deptoData.icon || '';

            headerDiv.innerHTML = `
                <div style="font-size: 24px; background: #f0fdf4; color: #059669; padding: 12px; border-radius: 12px; border: 1px solid #c6f6d5; display: flex; align-items: center; justify-content: center;">
                    ${iconoCabecera}
                </div>
                <div>
                    <h2 style="font-size: 24px; font-weight: 900; color: #111827; margin: 0 0 4px 0;">${nombreOficialDep.toUpperCase()}</h2>
                    <p style="font-size: 14px; color: #4b5563; margin: 0;">${deptoData.subtitle || 'Selecciona una opción para comenzar.'}</p>
                </div>
            `;
            wrapper.appendChild(headerDiv);

            // Grid de tarjetas con un diseño de columnas controlado para que no se estire de más
            const gridDiv = document.createElement('div');
            gridDiv.style.cssText = "display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 16px; align-items: stretch;";

            deptoData.options.forEach((opt) => {
                const card = document.createElement('div');
                // Agregamos height: 100% y box-sizing para que todas midan lo mismo
                card.style.cssText = "background: #f9fafb; border: 1px solid #e5e7eb; padding: 20px; border-radius: 12px; cursor: pointer; display: flex; flex-direction: column; justify-content: space-between; height: 100%; box-sizing: border-box;";

                // Asignar la acción de manera segura
                if (opt.action) {
                    card.onclick = new Function(opt.action);
                }

                card.innerHTML = `
                <div>
                    <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
                        <span style="font-size: 20px; background: #d1fae5; color: #065f46; padding: 8px; border-radius: 8px; display: flex; align-items: center; justify-content: center;">${opt.icon}</span>
                        <h4 style="font-size: 14px; font-weight: 700; color: #1f2937; margin: 0;">${opt.title}</h4>
                    </div>
                    <p style="font-size: 12px; color: #4b5563; margin: 0;">Módulo de gestión para ${opt.title.toLowerCase()}.</p>
                </div>
                <div style="margin-top: 16px; font-size: 10px; font-weight: 700; text-transform: uppercase; color: #059669;">
                    Abrir módulo &rarr;
                </div>
            `;
                gridDiv.appendChild(card);
            });

            wrapper.appendChild(gridDiv);
            contenedorApp.appendChild(wrapper);
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

// Forzar visibilidad absoluta del contenedor principal y el body
window.addEventListener('DOMContentLoaded', () => {
    // Añade esta línea para quitar el ocultamiento del CSS
    document.body.classList.add('auth-checked');

    const mainContainer = document.getElementById('app-container');
    if (mainContainer) {
        mainContainer.style.position = 'relative';
        mainContainer.style.zIndex = '9999';
        mainContainer.style.display = 'block';
        mainContainer.style.visibility = 'visible';
        mainContainer.style.opacity = '1';
    }
});