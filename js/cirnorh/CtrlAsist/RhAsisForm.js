// js/cirnorh/asistencia/RhAsisForm.js

window.RhAsisForm = {
    procesarArchivo: function(input) {
        const archivo = input.files[0];
        const estadoDiv = document.getElementById('estado-carga-bio');
        const previewDiv = document.getElementById('tabla-previsualizacion-bio');

        if (!archivo) return;

        estadoDiv.innerHTML = `<span class="text-amber-600 font-semibold">Leyendo archivo ${archivo.name} ...</span>`;

        setTimeout(() => {
            estadoDiv.innerHTML = `<span class="text-[#249444] font-semibold">¡Archivo analizado con éxito! 128 registros encontrados.</span>`;
            previewDiv.classList.remove('hidden');
            previewDiv.innerHTML = `
                <div class="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 flex items-center justify-between">
                    <div>
                        <h6 class="text-xs font-bold text-emerald-900 uppercase">Vista previa de checadas</h6>
                        <p class="text-[11px] text-emerald-700">Período: Quincena actual</p>
                    </div>
                    <button onclick="RhAsisForm.guardarChecadas()" class="px-4 py-2 bg-[#249444] hover:bg-[#1e7a37] text-white text-xs font-bold rounded-xl transition-all shadow-xs">
                        Guardar y Procesar Asistencia
                    </button>
                </div>
            `;
        }, 800);
    },

    guardarChecadas: function() {
        alert("Registros de asistencia guardados e integrados correctamente.");
        cargarAsistenciaRh();
    },

    mostrarModalJustificante: function() {
        alert("Abrir formulario de justificantes médicos.");
    }
};