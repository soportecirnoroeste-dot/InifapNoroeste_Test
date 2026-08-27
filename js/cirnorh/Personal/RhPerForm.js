// js/cirnorh/personal_form.js

async function mostrarFormularioNuevoPersonal() {
    const formContainer = document.getElementById('contenedor-formulario-personal');
    const gestionContainer = document.getElementById('contenedor-gestion-personal');
    const listadoContainer = document.getElementById('contenedor-listado-personal');
    const form = document.getElementById('form-nuevo-personal');
    const titulo = document.getElementById('titulo-formulario');
    const inputNumEmp = document.getElementById('input-numEmp');

    if (formContainer && form) {
        form.reset();
        if (!window._catRegs || window._catRegs.length === 0) {
            await cargarCatalogosSheets(true);
        }

        if (typeof poblarSelectoresCascada === 'function') {
            poblarSelectoresCascada('', '', '');
        }

        inputNumEmp.removeAttribute('readonly');
        titulo.innerHTML = `Capturar Nuevo Empleado`;
        formContainer.classList.remove('hidden');
        if (gestionContainer) gestionContainer.classList.add('hidden');
        if (listadoContainer) listadoContainer.classList.add('hidden');
        formContainer.scrollIntoView({ behavior: 'smooth' });
    }
}

function ocultarFormularioPersonal() {
    const formContainer = document.getElementById('contenedor-formulario-personal');
    const gestionContainer = document.getElementById('contenedor-gestion-personal');
    const listadoContainer = document.getElementById('contenedor-listado-personal');

    if (formContainer) formContainer.classList.add('hidden');
    if (gestionContainer) gestionContainer.classList.remove('hidden');
    if (listadoContainer) listadoContainer.classList.remove('hidden');

    // 👉 ¡AQUÍ ESTABA EL DETALLE! Forzamos a que pinte la tabla al regresar
    if (window._empleadosCache && window._empleadosCache.length > 0) {
        renderizarTablaPersonal(window._empleadosCache);
    }
}

function cancelarEdicionPersonal() {
    const formContainer = document.getElementById('contenedor-formulario-personal');
    const gestionContainer = document.getElementById('contenedor-gestion-personal');
    const listadoContainer = document.getElementById('contenedor-listado-personal');

    if (formContainer) formContainer.classList.add('hidden');
    if (gestionContainer) gestionContainer.classList.remove('hidden');
    if (listadoContainer) listadoContainer.classList.remove('hidden');

    // 👉 Y aseguramos lo mismo para la cancelación de edición
    if (window._empleadosCache && window._empleadosCache.length > 0) {
        renderizarTablaPersonal(window._empleadosCache);
    }
}

async function seleccionarEmpleadoParaEditar(index) {
    if (!window._empleadosCache || window._empleadosCache.length === 0) {
        try {
            const data = await FetchAPI('obtenerPersonal');
            window._empleadosCache = data || [];
        } catch (error) {
            console.error("❌ Error al recuperar empleados:", error);
        }
    }

    const emp = window._empleadosCache[index];
    if (!emp) {
        alert("No se pudieron cargar los datos del empleado.");
        return;
    }

    cargarPersonalRh(false);
    await cargarCatalogosSheets();

    const form = document.getElementById('form-nuevo-personal');
    const formContainer = document.getElementById('contenedor-formulario-personal');
    const gestionContainer = document.getElementById('contenedor-gestion-personal');
    const listadoContainer = document.getElementById('contenedor-listado-personal');
    const titulo = document.getElementById('titulo-formulario');
    const inputNumEmp = document.getElementById('input-numEmp');

    if (formContainer && form) {
        const regVal = extraerClave(emp.claveReg || emp.textoReg);
        const centroVal = extraerClave(emp.claveCentro || emp.textoCentro);
        let rawSit = extraerClave(emp.claveSit || emp.textoSit);
        const sitVal = (!rawSit || rawSit === 0 || rawSit === '0' || String(rawSit).trim().toUpperCase() === 'N/A') ? 'N/A' : rawSit;

        // Poblamos selectores en cascada con los valores del empleado
        if (typeof poblarSelectoresCascada === 'function') {
            poblarSelectoresCascada(regVal, centroVal, sitVal);
        }

        // Llenamos inputs del formulario
        form.elements['numEmp'].value = limpiarValor(emp.numEmp);
        inputNumEmp.setAttribute('readonly', true);
        form.elements['nombre'].value = limpiarValor(emp.nombre);
        form.elements['ext'].value = limpiarValor(emp.ext);
        form.elements['numPers'].value = limpiarValor(emp.numPers);
        form.elements['escolaridad'].value = limpiarValor(emp.escolaridad);
        form.elements['direccion'].value = limpiarValor(emp.direccion);
        form.elements['cp'].value = limpiarValor(emp.cp);
        form.elements['email'].value = limpiarValor(emp.email);
        form.elements['rfc'].value = limpiarValor(emp.rfc);
        form.elements['puesto'].value = limpiarValor(emp.puesto);
        form.elements['departamento'].value = limpiarValor(emp.departamento);
        form.elements['ciudad'].value = limpiarValor(emp.ciudad);
        form.elements['estado'].value = limpiarValor(emp.estado);

        titulo.innerHTML = `Editando: <span class="text-[#249444]">${limpiarValor(emp.nombre)}</span>`;

        formContainer.classList.remove('hidden');
        if (gestionContainer) gestionContainer.classList.add('hidden');
        if (listadoContainer) listadoContainer.classList.add('hidden');
    }
}

async function guardarOActualizarPersonal(event) {
    event.preventDefault();
    const form = event.target;
    
    // 1. Activamos el spinner de carga inmediatamente
    if (typeof mostrarCarga === 'function') mostrarCarga();

    const formData = new FormData(form);
    let datosEmpleado = Object.fromEntries(formData.entries());

    // 2. RECUPERAR LOS TEXTOS COMPLETOS DE LOS SELECTS (REGIONAL Y CENTRO)
    const selectReg = form.querySelector('#select-claveReg');
    if (selectReg && selectReg.selectedIndex >= 0) {
        const optionText = selectReg.options[selectReg.selectedIndex].text;
        datosEmpleado.textoReg = optionText !== 'Seleccione una región...' ? optionText : datosEmpleado.claveReg;
    }

    const selectCentro = form.querySelector('#select-claveCentro');
    if (selectCentro && selectCentro.selectedIndex >= 0) {
        const optionText = selectCentro.options[selectCentro.selectedIndex].text;
        datosEmpleado.textoCentro = optionText !== 'Seleccione un centro...' ? optionText : datosEmpleado.claveCentro;
    }

    // 3. DECLARAR Y ASEGURAR EL CAMPO DE DEPARTAMENTO (Nombre Corto)
    const selectDepto = form.querySelector('#select-departamento');
    if (selectDepto) {
        datosEmpleado.departamento = selectDepto.value || '';
    }

    // 4. Aseguramos el campo de sitio
    if (!datosEmpleado.claveSit || String(datosEmpleado.claveSit).trim() === '') {
        datosEmpleado.claveSit = 'N/A';
    }

    // 5. Convertimos todos los textos a mayúsculas usando tu función global
    if (typeof convertirObjetoAMayusculas === 'function') {
        datosEmpleado = convertirObjetoAMayusculas(datosEmpleado);
    }

    // 6. Armamos el FormData final con todas las propiedades necesarias para la tabla
    const formDataFinal = new FormData();
    for (const key in datosEmpleado) {
        formDataFinal.append(key, datosEmpleado[key]);
    }

    const actionName = window._empleadosCache.some(e => String(e.numEmp).trim() === String(datosEmpleado.numEmp).trim()) ? 'actualizarPersonal' : 'guardarPersonal';

    const btnSubmit = form.querySelector('button[type="submit"]');
    if (btnSubmit) btnSubmit.disabled = true;

    try {
        const res = await FetchAPI(actionName, formDataFinal);
        alert(res.message || "Guardado exitoso");
        ocultarFormularioPersonal();
        cargarDatosGenerales(true);
    } catch (e) {
        console.error("Error al guardar:", e);
        alert("Error de conexión al guardar.");
    } finally {
        if (btnSubmit) btnSubmit.disabled = false;
        // 7. Ocultamos el spinner pase lo que pase
        if (typeof ocultarCarga === 'function') ocultarCarga();
    }
}

function limpiarValor(val) {
    return (!val || val === 0 || val === '0' || String(val).trim() === '') ? '' : val;
}

function extraerClave(val) {
    if (!val) return '';
    const str = String(val).trim();
    if (str.includes(' - ')) return str.split(' - ')[0].trim();
    return str;
}