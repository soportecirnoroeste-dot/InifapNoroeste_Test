// ========================================================
// MÓDULO DE CONEXIÓN CON APPS SCRIPT / BACKEND
// ========================================================
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzDs5fvFxykQniWFZnbUqpbuDAmrIDhMHlVwU4r5B3iPLxBp4FDG7uKrtDBDQEXxEX8fQ/exec";

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
