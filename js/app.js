// ==========================================
// 1. CONTROLADOR DE AUTENTICACIÓN Y SESIÓN
// ==========================================
const AuthGuard = {
    verificarAcceso: () => {
        const usuarioSesion = localStorage.getItem('usuario_sesion');
        const paginaActual = window.location.pathname;

        if (!usuarioSesion && !paginaActual.includes('login.html')) {
            window.location.href = 'login.html';
        } else if (usuarioSesion && paginaActual.includes('login.html')) {
            window.location.href = 'index.html';
        } else {
            document.body.classList.add('auth-checked');

            const labelUser = document.getElementById('user-display-name');
            if (labelUser) {
                labelUser.textContent = localStorage.getItem('session_userName') || 'Usuario';
            }

            if (!paginaActual.includes('login.html')) {
                SistemaGlobal.init();
            }
        }
    }
};

// ==========================================
// 2. NÚCLEO CENTRAL DEL SISTEMA (CON CACHÉ Y FILTRO INICIAL)
// ==========================================
const SistemaGlobal = {
    datos: null,

    init() {
        const datosEnCache = localStorage.getItem('sistema_cache_datos');
        const tiempoCache = localStorage.getItem('sistema_cache_tiempo');
        const ahora = new Date().getTime();

        if (datosEnCache && tiempoCache && (ahora - tiempoCache < 30 * 60 * 1000)) {
            try {
                const datosProcesados = JSON.parse(datosEnCache);
                this.procesarRespuestaServidor(datosProcesados);
                return;
            } catch (e) {
                console.error("Error al leer la caché, procediendo a red...", e);
            }
        }

        if (typeof google !== 'undefined' && google.script && google.script.run) {
            google.script.run
                .withSuccessHandler(respuesta => this.guardarYCargar(respuesta))
                .withFailureHandler(err => console.error("Error al obtener datos de Sheets:", err))
                .obtenerDatosSistema();
        } else {
            console.warn("Entorno Google Apps Script no detectado. Usando conexión Fetch...");
            const URL_DIRECTA = "https://script.google.com/macros/s/AKfycbzDs5fvFxykQniWFZnbUqpbuDAmrIDhMHlVwU4r5B3iPLxBp4FDG7uKrtDBDQEXxEX8fQ/exec?action=obtenerDatosSistema";

            fetch(URL_DIRECTA)
                .then(res => res.json())
                .then(data => this.guardarYCargar(data))
                .catch(err => console.error("Error de conexión Fetch:", err));
        }
    },

    guardarYCargar(respuestaServidor) {
        const datosReales = respuestaServidor.success ? respuestaServidor : {
            departamentos: respuestaServidor.departamentos || [],
            regionales: respuestaServidor.regionales || [],
            campos: respuestaServidor.campos || []
        };

        localStorage.setItem('sistema_cache_datos', JSON.stringify(datosReales));
        localStorage.setItem('sistema_cache_tiempo', new Date().getTime());

        this.procesarRespuestaServidor(datosReales);
    },

    procesarRespuestaServidor(datosReales) {
        this.datos = datosReales;

        const todosLosDepartamentos = datosReales.departamentos || [];
        const todasLasRegionales = datosReales.regionales || [];
        let todosLosCampos = datosReales.campos || [];

        const areaUsuario = String(localStorage.getItem('session_area') || '').trim().toUpperCase();
        let claveRegUsuario = "";

        const regionalEncontrada = todasLasRegionales.find(r =>
            String(r.claveReg).trim().toUpperCase() === areaUsuario ||
            String(r.nomCorto).trim().toUpperCase() === areaUsuario
        );

        if (regionalEncontrada) {
            claveRegUsuario = String(regionalEncontrada.claveReg).trim();
        } else {
            const depUsuario = todosLosDepartamentos.find(dep =>
                String(dep.nomCorDep).trim().toUpperCase() === areaUsuario ||
                String(dep.claveCentro).trim().toUpperCase() === areaUsuario
            );

            if (depUsuario) {
                claveRegUsuario = String(depUsuario.claveReg).trim();
            } else {
                claveRegUsuario = todasLasRegionales.length > 0 ? String(todasLasRegionales[0].claveReg).trim() : "";
            }
        }

        this.renderizarRegional(claveRegUsuario, todasLasRegionales);

        const departamentosDeLaRegional = todosLosDepartamentos.filter(dep => String(dep.claveReg).trim() === claveRegUsuario);

        if (todosLosCampos.length === 0 && departamentosDeLaRegional.length > 0) {
            const centrosUnicos = [...new Set(departamentosDeLaRegional.map(d => d.claveCentro))];
            todosLosCampos = centrosUnicos.map(c => ({
                claveReg: claveRegUsuario,
                claveCentro: c,
                centro: `Centro ${c}`
            }));
            this.datos.campos = todosLosCampos;
        }

        this.renderizarFiltroCampos(todosLosCampos, claveRegUsuario);

        // Búsqueda inteligente del campo inicial
        const camposDeLaRegional = todosLosCampos.filter(c => String(c.claveReg).trim() === claveRegUsuario);
        const depDelUsuarioLogueado = departamentosDeLaRegional.find(dep =>
            String(dep.nomCorDep).trim().toUpperCase() === areaUsuario ||
            String(dep.claveCentro).trim().toUpperCase() === areaUsuario
        );

        let claveCentroInicial = "";
        if (depDelUsuarioLogueado) {
            claveCentroInicial = String(depDelUsuarioLogueado.claveCentro).trim();
        } else if (camposDeLaRegional.length > 0) {
            // Si el usuario es de toda la regional, seleccionamos el primer campo por defecto para que no aparezca vacío
            claveCentroInicial = String(camposDeLaRegional[0].claveCentro).trim();
        }

        const selectFiltro = document.getElementById('filtro-campos-regional');
        if (selectFiltro && claveCentroInicial) {
            selectFiltro.value = claveCentroInicial;
        }

        if (claveCentroInicial) {
            const filtradosIniciales = departamentosDeLaRegional.filter(dep => String(dep.claveCentro).trim() === claveCentroInicial);
            this.pintarTarjetasDepartamentos(filtradosIniciales);
        } else {
            this.pintarTarjetasDepartamentos(departamentosDeLaRegional);
        }
    },

    renderizarRegional(claveReg, regionales) {
        const infoRegional = regionales.find(r => String(r.claveReg).trim() === claveReg);
        const nombreRegionalOficial = infoRegional ? infoRegional.regional : "REGIONAL NO ENCONTRADA EN SHEETS";

        const labelRegional = document.getElementById('user-regional-display');
        if (labelRegional) {
            labelRegional.textContent = `${claveReg} - ${nombreRegionalOficial}`;
        }
    },

    renderizarFiltroCampos(campos, claveReg) {
        const camposDeLaRegional = campos.filter(c => String(c.claveReg).trim() === claveReg);
        const selectFiltro = document.getElementById('filtro-campos-regional');

        if (selectFiltro) {
            selectFiltro.innerHTML = '<option value="">Seleccionar campo</option>';
            camposDeLaRegional.forEach(campo => {
                const textoOpcion = `${campo.claveCentro} - ${campo.centro}`;
                selectFiltro.innerHTML += `<option value="${campo.claveCentro}">${textoOpcion}</option>`;
            });
        }
    },

    pintarTarjetasDepartamentos(listaDepartamentos) {
        const contenedorMenu = document.getElementById('menu-dinamico-departamentos');
        if (!contenedorMenu) return;

        contenedorMenu.innerHTML = '';

        if (listaDepartamentos.length === 0) {
            contenedorMenu.innerHTML = '<p class="text-xs text-stone-400 col-span-full">No se encontraron departamentos disponibles en las pestañas.</p>';
            return;
        }

        listaDepartamentos.forEach((dep) => {
            const nombreDepLower = (dep.nomDep || '').toLowerCase();
            let iconoSvg = '';

            // Selector dinámico de iconos según palabras clave en el nombre del departamento
            if (nombreDepLower.includes('finanz') || nombreDepLower.includes('contab') || nombreDepLower.includes('presupuesto')) {
                // Icono de dinero / finanzas
                iconoSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chart-no-axes-combined-icon lucide-chart-no-axes-combined"><path d="M12 16v5"/><path d="M16 14.639V21"/><path d="M20 10.656V21"/><path d="m22 3-8.646 8.646a.5.5 0 0 1-.708 0L9.354 8.354a.5.5 0 0 0-.707 0L2 15"/><path d="M4 18.463V21"/><path d="M8 14.656V21"/></svg>`;
            } else if (nombreDepLower.includes('sistem') || nombreDepLower.includes('tecnolog') || nombreDepLower.includes('ti') || nombreDepLower.includes('informat')) {
                // Icono de código / sistemas
                iconoSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-code-xml-icon lucide-code-xml"><path d="m18 16 4-4-4-4"/><path d="m6 8-4 4 4 4"/><path d="m14.5 4-5 16"/></svg>`;
            } else if (nombreDepLower.includes('recursos human') || nombreDepLower.includes('personal') || nombreDepLower.includes('talento')) {
                // Icono de personas / RH
                iconoSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-handshake-icon lucide-handshake"><path d="m11 17 2 2a1 1 0 1 0 3-3"/><path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4"/><path d="m21 3 1 11h-2"/><path d="M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3"/><path d="M3 4h8"/></svg>`;
            } else if (nombreDepLower.includes('material') || nombreDepLower.includes('compras') || nombreDepLower.includes('almacen') || nombreDepLower.includes('logist')) {
                // Icono de caja / materiales
                iconoSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-receipt-icon lucide-receipt"><path d="M12 17V7"/><path d="M16 8h-6a2 2 0 0 0 0 4h4a2 2 0 0 1 0 4H8"/><path d="M4 3a1 1 0 0 1 1-1 1.3 1.3 0 0 1 .7.2l.933.6a1.3 1.3 0 0 0 1.4 0l.934-.6a1.3 1.3 0 0 1 1.4 0l.933.6a1.3 1.3 0 0 0 1.4 0l.933-.6a1.3 1.3 0 0 1 1.4 0l.934.6a1.3 1.3 0 0 0 1.4 0l.933-.6A1.3 1.3 0 0 1 19 2a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1 1.3 1.3 0 0 1-.7-.2l-.933-.6a1.3 1.3 0 0 0-1.4 0l-.934.6a1.3 1.3 0 0 1-1.4 0l-.933-.6a1.3 1.3 0 0 0-1.4 0l-.933.6a1.3 1.3 0 0 1-1.4 0l-.934-.6a1.3 1.3 0 0 0-1.4 0l-.933.6a1.3 1.3 0 0 1-.7.2 1 1 0 0 1-1-1z"/></svg>`;
            } else if (nombreDepLower.includes('investigac') || nombreDepLower.includes('desarrollo')) {
                // Icono de lupa / investigación
                iconoSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>`;
            } else {
                // Icono genérico por defecto (edificio / oficina)
                iconoSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-network-icon lucide-network"><rect x="16" y="16" width="6" height="6" rx="1"/><rect x="2" y="16" width="6" height="6" rx="1"/><rect x="9" y="2" width="6" height="6" rx="1"/><path d="M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3"/><path d="M12 12V8"/></svg>`;
            }

            const btnHTML = `
                <button onclick="seleccionarDepartamento('${dep.nomCorDep}', this)" 
                    class="area-btn border-stone-200 flex flex-col items-center justify-center p-4 rounded-xl border hover:border-[#249444] hover:bg-emerald-50/50 transition-all text-center cursor-pointer group">
                    <span class="uppercase text-xs font-bold text-stone-700 group-hover:text-[#249444] mb-2">${dep.nomDep}</span>
                    <div class="w-10 h-10 rounded-lg bg-emerald-50 text-[#249444] flex items-center justify-center group-hover:bg-[#249444] group-hover:text-white transition-all">
                        ${iconoSvg}
                    </div>
                </button>
            `;
            contenedorMenu.innerHTML += btnHTML;
        });
    },

    filtrarPorCampo(claveCentroSeleccionado) {
        if (!this.datos || !this.datos.departamentos) return;

        const areaUsuario = String(localStorage.getItem('session_area') || '').trim().toUpperCase();
        const depUsuario = this.datos.departamentos.find(dep => String(dep.claveReg).trim() === areaUsuario);
        const claveRegUsuario = depUsuario ? String(depUsuario.claveReg).trim() : (this.datos.regionales[0]?.claveReg || "");

        const departamentosDeLaRegional = this.datos.departamentos.filter(dep => String(dep.claveReg).trim() === claveRegUsuario);

        if (!claveCentroSeleccionado) {
            this.pintarTarjetasDepartamentos(departamentosDeLaRegional);
        } else {
            const filtrados = departamentosDeLaRegional.filter(dep => String(dep.claveCentro).trim() === String(claveCentroSeleccionado).trim());
            this.pintarTarjetasDepartamentos(filtrados);
        }
    },

    seleccionarDepartamento(NomCorDep, elementoBtn) {
        document.querySelectorAll('.area-btn').forEach(btn => {
            btn.classList.remove('border-[#249444]', 'bg-emerald-50/80', 'shadow-sm');
            btn.classList.add('border-stone-200');
            let divIcon = btn.querySelector('div');
            if (divIcon) {
                divIcon.classList.remove('bg-[#249444]', 'text-white');
                divIcon.classList.add('bg-emerald-50', 'text-[#249444]');
            }
        });

        elementoBtn.classList.remove('border-stone-200');
        elementoBtn.classList.add('border-[#249444]', 'bg-emerald-50/80', 'shadow-sm');
        let iconoDiv = elementoBtn.querySelector('div');
        if (iconoDiv) {
            iconoDiv.classList.remove('bg-emerald-50', 'text-[#249444]');
            iconoDiv.classList.add('bg-[#249444]', 'text-white');
        }

        console.log("Departamento seleccionado:", NomCorDep);
    }
};

// ==========================================
// 3. PUENTES GLOBALES PARA EL HTML
// ==========================================
function filtrarPorCampoRegional(claveCentro) {
    SistemaGlobal.filtrarPorCampo(claveCentro);
}

function seleccionarDepartamento(NomCorDep, elementoBtn) {
    SistemaGlobal.seleccionarDepartamento(NomCorDep, elementoBtn);
}

// ==========================================
// 4. DISPARADOR ÚNICO DE INICIO
// ==========================================
document.addEventListener('DOMContentLoaded', AuthGuard.verificarAcceso);