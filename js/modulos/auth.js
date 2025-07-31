import { state } from './state.js';
import * as ui from './ui.js';
import { USERS_STORE_NAME } from './config.js';
import { getObjectStore } from './database.js';

/**
 * Genera un hash SHA-256 de una cadena de texto (contraseña).
 * @param {string} password La contraseña a hashear.
 * @returns {Promise<string>} El hash en formato hexadecimal.
 */
export async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Verifica si hay una sesión de usuario activa en sessionStorage y actualiza la UI.
 */
export function checkSession() {
    const userSession = sessionStorage.getItem('parkingUser');
    if (userSession) {
        state.currentUser = JSON.parse(userSession);
        ui.showMainApp();
    } else {
        ui.showLoginScreen();
    }
}

/**
 * Maneja el evento de envío del formulario de login.
 * @param {Event} e El objeto del evento.
 */
export async function handleLogin(e) {
    e.preventDefault();
    // Suponiendo que los elementos del form están en el módulo UI
    const username = document.getElementById('login-username').value.trim();
    const password = document.getElementById('login-password').value;
    const hashedPassword = await hashPassword(password);

    const index = getObjectStore(USERS_STORE_NAME, 'readonly').index('name_idx');
    const request = index.get(username);

    request.onsuccess = () => {
        const user = request.result;
        if (user && user.password === hashedPassword) {
            state.currentUser = { name: user.name, role: user.role };
            sessionStorage.setItem('parkingUser', JSON.stringify(state.currentUser));
            ui.showMainApp();
            document.getElementById('login-form').reset();
        } else {
            ui.showToast('Usuario o contraseña incorrectos.', 'error');
        }
    };
    request.onerror = () => ui.showToast('Error al intentar iniciar sesión.', 'error');
}

/**
 * Cierra la sesión del usuario actual, borra los datos de sesión y muestra la pantalla de login.
 */
export function performLogout() {
    state.currentUser = null;
    sessionStorage.removeItem('parkingUser');
    ui.toggleModal(document.getElementById('shift-report-modal'), false);
    ui.showLoginScreen();
}