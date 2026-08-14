// js/router.js
(function () {
    console.log("Router iniciado correctamente.");

    const params = new URLSearchParams(window.location.search);
    let nombreCortoUrl = (params.get('depto') || '').toLowerCase().trim();

    // Si no viene en la URL, intentamos recuperarlo de la memoria local para mantener la continuidad
    if (!nombreCortoUrl) {
        nombreCortoUrl = (localStorage.getItem('depto_activo_actual') || '').toLowerCase().trim();
    }

    if (!nombreCortoUrl) {
        console.warn("No se especificó ningún departamento en la URL.");
        mostrarErrorDepto("No se especificó ningún departamento.");
        return;
    }

    // Guardar el departamento activo actual en memoria para los submódulos
    localStorage.setItem('depto_activo_actual', nombreCortoUrl);

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
            // Actualizar dinámicamente el título superior con la ruta completa
            const headerDeptoTitle = document.getElementById('header-depto-title');
            if (headerDeptoTitle) {
                headerDeptoTitle.textContent = `SISTEMA REGIONAL INTERNO / ${nombreOficialDep.toUpperCase()}`;
            }

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
                    <h2 style="font-size: 20px; font-weight: 900; color: #249444; margin: 0 0 4px 0;">MENÚ DEL DEPARTAMENTO</h2>
                    <p style="font-size: 14px; color: #4b5563; margin: 0;">${deptoData.subtitle || 'Selecciona una opción para comenzar.'}</p>
                </div>
            `;
            wrapper.appendChild(headerDiv);

            // Grid de tarjetas
            const gridDiv = document.createElement('div');
            gridDiv.style.cssText = "display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 16px; align-items: stretch;";

            deptoData.options.forEach((opt) => {
                const card = document.createElement('div');
                card.style.cssText = "background: #f9fafb; border: 1px solid #e5e7eb; padding: 20px; border-radius: 12px; cursor: pointer; display: flex; flex-direction: column; justify-content: space-between; height: 100%; box-sizing: border-box;";

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

window.addEventListener('DOMContentLoaded', () => {
    document.body.classList.add('auth-checked');

    const mainContainer = document.getElementById('app-container');
    if (mainContainer) {
        mainContainer.style.position = 'relative';
        mainContainer.style.zIndex = '9999';
        mainContainer.style.display = 'block';
        mainContainer.style.visibility = 'visible';
        mainContainer.style.opacity = '1';
    }

    const btnRegresar = document.getElementById('btn-regresar');

    if (btnRegresar) {
        const rutaCompleta = window.location.pathname;
        const paginaActual = rutaCompleta.split('/').pop().toLowerCase();
        const deptoGuardado = localStorage.getItem('depto_activo_actual');

        const pathSegments = rutaCompleta.split('/').filter(Boolean);
        let basePath = '';
        if (window.location.hostname.includes('github.io') && pathSegments.length > 0) {
            basePath = `/${pathSegments[0]}`;
        }

        console.group("🔍 Control del Botón Regresar");
        console.log("Página actual:", paginaActual);
        console.log("Departamento en localStorage:", deptoGuardado);

        // Si estamos en main.html, el botón de retroceso debe llevar al panel principal (index.html)
        if (paginaActual === 'main.html') {
            btnRegresar.href = `${basePath}/index.html`;
            btnRegresar.title = 'Regresar al panel principal';
            console.log("Acción: main.html -> index.html");
        } 
        // Si estamos en cualquier submódulo (ej. personal, asistencia, etc.), el botón SIEMPRE debe regresar al main.html de ese depto
        else if (deptoGuardado) {
            btnRegresar.href = `${basePath}/main.html?depto=${deptoGuardado}`;
            btnRegresar.title = 'Regresar al menú del departamento';
            console.log(`Acción: Submódulo -> main.html?depto=${deptoGuardado}`);
        } 
        // Si no hay nada guardado, mandamos al index por seguridad
        else {
            btnRegresar.href = `${basePath}/index.html`;
            btnRegresar.title = 'Regresar al inicio';
            console.log("Acción por defecto -> index.html");
        }
        console.groupEnd();
    }
});