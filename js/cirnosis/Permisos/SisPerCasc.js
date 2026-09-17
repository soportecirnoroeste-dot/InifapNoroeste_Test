// js/SisPer/SisPerCasc.js

function cargarPermisosSis() {
    if (typeof renderizarListadoPermisosSis === 'function') {
        renderizarListadoPermisosSis();
    } else {
        console.error("SisPerCore no está cargado correctamente.");
    }
}

function actualizarDatosPermisosSis() {
    cargarPermisosSis();
}

// Hacemos global la función para que el menú principal la encuentre de inmediato
window.cargarPermisosSis = cargarPermisosSis;
window.renderizarListadoPermisosSis = renderizarListadoPermisosSis;