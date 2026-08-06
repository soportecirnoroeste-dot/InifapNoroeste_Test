// ========================================================
// MÓDULO DE CONEXIÓN CON APPS SCRIPT / BACKEND
// ========================================================
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwpyFlplS4e2C3UrfF5Ap9xkqn6Dr4FElpfj10JxMotZtKo2Drs9vE7eP43dsPeiPaKOA/exec";

async function FetchAPI(action, payload = {}) {
    try {
        payload.action = action;
        
        let response = await fetch(APPS_SCRIPT_URL, {
            method: "POST",
            mode: "cors", // Permite la comunicación cruzada con Google Apps Script
            headers: {
                "Content-Type": "text/plain;charset=utf-8", // Evita bloqueos de preflight OPTIONS en los despliegues de Google
            },
            body: JSON.stringify(payload)
        });

        let data = await response.json();
        return data;
    } catch (error) {
        console.error("Error en FetchAPI:", error);
        throw error;
    }
}

window.FetchAPI = FetchAPI;