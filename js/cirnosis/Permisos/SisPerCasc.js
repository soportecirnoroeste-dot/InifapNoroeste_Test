// js/SisPer/SisPerCasc.js

function cargarPermisosSis() {
    if (typeof renderizarListadoPermisosSis === 'function') {
        renderizarListadoPermisosSis();
    } else {
        console.error("SisPerCore no está cargado correctamente.");
    }
}

function actualizarDatosPermisosSis() {
    // Acción para refrescar el listado o sincronizar con el backend
    cargarPermisosSis();
}