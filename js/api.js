// ========================================================
// MÓDULO DE CONEXIÓN CON APPS SCRIPT / BACKEND
// ========================================================
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzDs5fvFxykQniWFZnbUqpbuDAmrIDhMHlVwU4r5B3iPLxBp4FDG7uKrtDBDQEXxEX8fQ/exec";

// Hacemos la URL global para que cualquier submódulo pueda usarla
window.APPS_SCRIPT_URL = APPS_SCRIPT_URL;

async function FetchAPI(action, payload = {}) {
    try {
        let bodyData;

        // Si el payload es un FormData (viene de un <form>), lo convertimos a un objeto plano
        if (payload instanceof FormData) {
            let plainObject = {};
            payload.forEach((value, key) => {
                plainObject[key] = value;
            });
            plainObject.action = action;
            bodyData = JSON.stringify(plainObject);
        } else {
            // Si es un objeto normal de JavaScript
            payload.action = action;
            bodyData = JSON.stringify(payload);
        }

        let response = await fetch(APPS_SCRIPT_URL, {
            method: "POST",
            mode: "cors", // Permite la comunicación cruzada con Google Apps Script
            headers: {
                "Content-Type": "text/plain;charset=utf-8", // Evita bloqueos de preflight OPTIONS en los despliegues de Google
            },
            body: bodyData
        });

        let data = await response.json();
        return data;
    } catch (error) {
        console.error("Error en FetchAPI:", error);
        throw error;
    }
}

window.FetchAPI = FetchAPI;