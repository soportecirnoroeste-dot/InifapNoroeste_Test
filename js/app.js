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

            // Si estamos en el dashboard, iniciamos el sistema centralizado
            if (!paginaActual.includes('login.html')) {
                SistemaGlobal.init();
            }
        }
    }
};

// ==========================================
// 2. NÚCLEO CENTRAL DEL SISTEMA (STATE & UI)
// ==========================================
const SistemaGlobal = {
    datos: null,

    init() {
        console.log("Iniciando Sistema Regional Interno...");

        // Verificamos si estamos dentro del entorno de Google Apps Script
        if (typeof google !== 'undefined' && google.script && google.script.run) {
            google.script.run
                .withSuccessHandler(respuesta => this.procesarRespuestaServidor(respuesta))
                .withFailureHandler(err => console.error("Error al obtener datos de Sheets:", err))
                .obtenerDatosSistema();
        } else {
            // Modo de respaldo vía Fetch (para pruebas locales o despliegue web directo)
            console.warn("Entorno Google Apps Script no detectado. Usando conexión Fetch...");
            const URL_DIRECTA = "https://script.google.com/macros/s/AKfycbzDs5fvFxykQniWFZnbUqpbuDAmrIDhMHlVwU4r5B3iPLxBp4FDG7uKrtDBDQEXxEX8fQ/exec?action=obtenerDatosSistema";

            fetch(URL_DIRECTA)
                .then(res => res.json())
                .then(data => this.procesarRespuestaServidor(data))
                .catch(err => console.error("Error de conexión Fetch:", err));
        }
    },

    procesarRespuestaServidor(respuestaServidor) {
        // Validación robusta por si el JSON viene envuelto de otra forma
        const datosReales = respuestaServidor.success ? respuestaServidor : {
            departamentos: respuestaServidor.departamentos || [],
            regionales: respuestaServidor.regionales || [],
            campos: respuestaServidor.campos || []
        };

        this.datos = datosReales;

        const todosLosDepartamentos = datosReales.departamentos || [];
        const todasLasRegionales = datosReales.regionales || [];
        let todosLosCampos = datosReales.campos || [];

        // Obtenemos el área de la sesión actual
        const areaUsuario = String(localStorage.getItem('session_area') || '').trim().toUpperCase();
        let claveRegUsuario = "";

        // 1. Coincidencia con regional o nombre corto
        const regionalEncontrada = todasLasRegionales.find(r =>
            String(r.claveReg).trim().toUpperCase() === areaUsuario ||
            String(r.nomCorto).trim().toUpperCase() === areaUsuario
        );

        if (regionalEncontrada) {
            claveRegUsuario = String(regionalEncontrada.claveReg).trim();
        } else {
            // 2. Coincidencia con departamentos
            const depUsuario = todosLosDepartamentos.find(dep =>
                String(dep.nomCorDep).trim().toUpperCase() === areaUsuario ||
                String(dep.claveCentro).trim().toUpperCase() === areaUsuario
            );

            if (depUsuario) {
                claveRegUsuario = String(depUsuario.claveReg).trim();
            } else {
                // 3. Fallback a la primera regional disponible
                claveRegUsuario = todasLasRegionales.length > 0 ? String(todasLasRegionales[0].claveReg).trim() : "";
            }
        }

        // Renderizar componentes visuales
        this.renderizarRegional(claveRegUsuario, todasLasRegionales);

        const departamentosDeLaRegional = todosLosDepartamentos.filter(dep => String(dep.claveReg).trim() === claveRegUsuario);

        // Respaldo dinámico si Campos viene vacío
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
        this.pintarTarjetasDepartamentos(departamentosDeLaRegional);
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
                // Concatenamos claveCentro y el nombre del centro tal como lo pediste
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

        listaDepartamentos.forEach((dep, index) => {
            const esActivo = index === 0 ? 'border-[#249444] bg-emerald-50/80 shadow-sm' : 'border-stone-200';
            const iconoBg = index === 0 ? 'bg-[#249444] text-white' : 'bg-emerald-50 text-[#249444]';

            const btnHTML = `
                <button onclick="seleccionarDepartamento('${dep.nomCorDep}', this)" 
                    class="area-btn ${esActivo} flex flex-col items-center justify-center p-4 rounded-xl border hover:border-[#249444] hover:bg-emerald-50/50 transition-all text-center cursor-pointer group">
                    <div class="w-10 h-10 rounded-lg ${iconoBg} flex items-center justify-center mb-2 group-hover:bg-[#249444] group-hover:text-white transition-all">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg>
                    </div>
                    <span class="text-xs font-bold text-stone-700 group-hover:text-[#249444]">${dep.nomDep}</span>
                    <span class="text-[10px] text-stone-400 mt-1">Centro: ${dep.claveCentro}</span>
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
            let divIcon = btn.querySelector('div');
            if (divIcon) {
                divIcon.classList.remove('bg-[#249444]', 'text-white');
                divIcon.classList.add('bg-emerald-50', 'text-[#249444]');
            }
        });

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