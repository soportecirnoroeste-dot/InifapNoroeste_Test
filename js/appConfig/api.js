// ========================================================
// MÓDULO DE CONEXIÓN CON APPS SCRIPT / BACKEND (BLINDADO CONTRA REDIRECCIONES)
// ========================================================
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzDs5fvFxykQniWFZnbUqpbuDAmrIDhMHlVwU4r5B3iPLxBp4FDG7uKrtDBDQEXxEX8fQ/exec";

// Hacemos la URL global para que cualquier submódulo pueda usarla
window.APPS_SCRIPT_URL = APPS_SCRIPT_URL;

async function FetchAPI(action, payload = {}) {
    try {
        let bodyData;

        // Creamos una copia limpia para no mutar el objeto original del usuario
        if (payload instanceof FormData) {
            let plainObject = {};
            payload.forEach((value, key) => {
                plainObject[key] = value;
            });
            plainObject.action = action;
            bodyData = JSON.stringify(plainObject);
        } else {
            let clonedPayload = Object.assign({}, payload);
            clonedPayload.action = action;
            bodyData = JSON.stringify(clonedPayload);
        }

        let response = await fetch(APPS_SCRIPT_URL, {
            method: "POST",
            redirect: "manual", // 👈 CAMBIO CRUCIAL: Evita que el navegador brinque a script.googleusercontent.com y mantenga el POST directo
            headers: {
                "Content-Type": "text/plain;charset=utf-8", 
            },
            body: bodyData
        });

        // Si el servidor responde con una redirección manual, manejamos el texto de la respuesta directamente
        let rawText = "";
        if (response.type ===opaqueredirect || response.status === 0) {
            // Caso seguro donde el navegador contuvo la redirección
            rawText = await response.text();
        } else {
            rawText = await response.text();
        }
        
        try {
            let data = JSON.parse(rawText);
            return data;
        } catch (parseError) {
            console.error("El servidor no devolvió un JSON válido. Respuesta cruda:", rawText);
            throw new Error("Respuesta inválida del servidor (verifica los permisos de implementación en Apps Script).");
        }

    } catch (error) {
        console.error("Error en FetchAPI:", error);
        throw error;
    }
}

window.FetchAPI = FetchAPI;