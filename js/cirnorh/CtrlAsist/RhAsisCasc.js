// js/cirnorh/asistencia/RhAsisCasc.js

window.RhAsisCasc = {
    mostrarVistaBiometrico: function() {
        const contenedor = document.getElementById('contenido-submodulo-dinamico') || obtenerContenedor();
        
        contenedor.innerHTML = `
            <div class="space-y-6 animate-fade-in">
                <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-stone-200">
                    <div>
                        <h4 class="font-bold text-stone-800 text-sm uppercase">Importación de Checadas - Reloj Biométrico</h4>
                        <p class="text-xs text-stone-500">Sube el archivo de registros para procesar asistencias y retardos automáticamente.</p>
                    </div>
                    <button onclick="cargarAsistenciaRh()" class="px-4 py-2 text-xs font-semibold text-stone-600 bg-stone-100 hover:bg-stone-200 rounded-xl transition-all self-start">
                        ← Volver a Asistencia
                    </button>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div class="md:col-span-1 p-6 rounded-2xl border-2 border-dashed border-stone-300 bg-stone-50 flex flex-col items-center justify-center text-center hover:border-[#249444] transition-all cursor-pointer" onclick="document.getElementById('input-file-bio').click()">
                        <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-stone-400 mb-2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
                        <span class="text-xs font-bold text-stone-700 mb-1">Selecciona o arrastra el archivo</span>
                        <span class="text-[10px] text-stone-400">Formatos compatibles: .dat, .txt, .csv</span>
                        <input type="file" id="input-file-bio" class="hidden" onchange="RhAsisForm.procesarArchivo(this)">
                    </div>

                    <div class="md:col-span-2 p-6 rounded-2xl border border-stone-200 bg-white shadow-xs flex flex-col justify-between">
                        <div>
                            <h5 class="text-xs font-bold text-stone-800 uppercase mb-2">Instrucciones de Importación</h5>
                            <ul class="text-xs text-stone-500 space-y-1.5 list-disc list-inside">
                               <li>Verifica que el reloj biométrico esté sincronizado antes de exportar.</li>
                               <li>El archivo debe contener checadas de entrada y salida válidas.</li>
                            </ul>
                        </div>
                        <div id="estado-carga-bio" class="mt-4 pt-3 border-t border-stone-100 text-xs text-stone-400">
                            Esperando archivo del dispositivo...
                        </div>
                    </div>
                </div>

                <div id="tabla-previsualizacion-bio" class="hidden"></div>
            </div>
        `;
    },

    mostrarControlRetardos: function() {
        alert("Módulo de Control de Retardos en desarrollo con estructura RhAsisCasc.");
    },

    mostrarReporteGlobal: function() {
        alert("Módulo de Reporte de Asistencia en desarrollo.");
    }
};