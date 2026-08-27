// js/cirnorh/asistencia/RhAsisCore.js

function cargarAsistenciaRh() {
    renderizarVistaModulo('asistencia', "Registro de retardos, faltas, permisos y carga biométrica.", [
        { 
            titulo: "Carga de Datos Biométrico", 
            desc: "Importación y procesamiento de checadas (.xlsx, .csv) con estilos INIFAP.", 
            action: "RhAsisCasc.mostrarVistaBiometrico()" 
        },
        { 
            titulo: "Control de Retardos", 
            desc: "Monitoreo y acumulación quincenal de entradas tarde.", 
            action: "RhAsisCasc.mostrarControlRetardos()" 
        },
        { 
            titulo: "Justificantes Médicos", 
            desc: "Carga y validación de incapacidades o permisos oficiales.", 
            action: "RhAsisForm.mostrarModalJustificante()" 
        },
        { 
            titulo: "Reporte de Asistencia", 
            desc: "Generación de listas de asistencia globales por centro.", 
            action: "RhAsisCasc.mostrarReporteGlobal()" 
        }
    ]);
}

window.RhAsisCore = {
    init: function() {
        cargarAsistenciaRh();
    }
};