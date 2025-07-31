import { DB_NAME, DB_VERSION, TICKET_STORE_NAME, COUNTER_STORE_NAME, SERVICES_STORE_NAME, SALES_STORE_NAME, VEHICLE_TYPES_STORE_NAME, BUSINESS_INFO_STORE_NAME, USERS_STORE_NAME, EXPENSES_STORE_NAME, PRINTER_SETTINGS_STORE_NAME, DEFAULTER_STORE_NAME } from './config.js';
import { state } from './state.js';
import { loadInitialData } from './ui.js';
import { hashPassword } from './auth.js';

/**
 * Inicializa la conexión con la base de datos IndexedDB y define su estructura.
 * Esta función maneja la creación y actualización del esquema de la base de datos.
 */
export function initDB() {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = (event) => {
        console.error('Error al abrir la base de datos:', event.target.errorCode);
        // Podríamos mostrar un error fatal al usuario aquí si la BD no carga.
    };

    // Se ejecuta solo si la versión de la BD en el navegador es más antigua que DB_VERSION
    request.onupgradeneeded = (event) => {
        state.db = event.target.result;
        console.log(`Actualizando base de datos a la versión ${DB_VERSION}...`);

        // --- Creación/Actualización de Object Stores (Tablas) ---

        // Tickets
        let ticketStore;
        if (state.db.objectStoreNames.contains(TICKET_STORE_NAME)) {
            ticketStore = event.target.transaction.objectStore(TICKET_STORE_NAME);
        } else {
            ticketStore = state.db.createObjectStore(TICKET_STORE_NAME, { keyPath: 'barcode' });
        }
        // Índices para búsquedas eficientes en tickets
        if (!ticketStore.indexNames.contains('plate_idx')) ticketStore.createIndex('plate_idx', 'plate', { unique: false });
        if (!ticketStore.indexNames.contains('status_idx')) ticketStore.createIndex('status_idx', 'status', { unique: false });
        if (!ticketStore.indexNames.contains('user_payment_idx')) ticketStore.createIndex('user_payment_idx', 'userPayment', { unique: false });
        if (!ticketStore.indexNames.contains('exit_time_idx')) ticketStore.createIndex('exit_time_idx', 'exitTime', { unique: false });
        if (!ticketStore.indexNames.contains('plate_status_idx')) ticketStore.createIndex('plate_status_idx', ['plate', 'status'], { unique: false });
        if (!ticketStore.indexNames.contains('entry_time_idx')) ticketStore.createIndex('entry_time_idx', 'entryTime', { unique: false });
        if (!ticketStore.indexNames.contains('is_defaulter_idx')) ticketStore.createIndex('is_defaulter_idx', 'isDefaulter', { unique: false });

        // Otros Object Stores
        if (!state.db.objectStoreNames.contains(COUNTER_STORE_NAME)) state.db.createObjectStore(COUNTER_STORE_NAME, { keyPath: 'counterId' });
        if (!state.db.objectStoreNames.contains(SERVICES_STORE_NAME)) state.db.createObjectStore(SERVICES_STORE_NAME, { keyPath: 'id', autoIncrement: true });
        if (!state.db.objectStoreNames.contains(SALES_STORE_NAME)) {
            const salesStore = state.db.createObjectStore(SALES_STORE_NAME, { keyPath: 'id', autoIncrement: true });
            salesStore.createIndex('timestamp_idx', 'timestamp', { unique: false });
            salesStore.createIndex('user_idx', 'user', { unique: false });
        }
        if (!state.db.objectStoreNames.contains(VEHICLE_TYPES_STORE_NAME)) state.db.createObjectStore(VEHICLE_TYPES_STORE_NAME, { keyPath: 'id', autoIncrement: true });
        if (!state.db.objectStoreNames.contains(BUSINESS_INFO_STORE_NAME)) state.db.createObjectStore(BUSINESS_INFO_STORE_NAME, { keyPath: 'id' });
        if (!state.db.objectStoreNames.contains(USERS_STORE_NAME)) {
            const userStore = state.db.createObjectStore(USERS_STORE_NAME, { keyPath: 'id', autoIncrement: true });
            userStore.createIndex('name_idx', 'name', { unique: true });
        }
        if (!state.db.objectStoreNames.contains(EXPENSES_STORE_NAME)) {
            const expenseStore = state.db.createObjectStore(EXPENSES_STORE_NAME, { keyPath: 'id', autoIncrement: true });
            expenseStore.createIndex('date_idx', 'date', { unique: false });
            expenseStore.createIndex('user_idx', 'user', { unique: false });
        }
        if (!state.db.objectStoreNames.contains(PRINTER_SETTINGS_STORE_NAME)) state.db.createObjectStore(PRINTER_SETTINGS_STORE_NAME, { keyPath: 'id' });
        if (!state.db.objectStoreNames.contains(DEFAULTER_STORE_NAME)) {
            const defaulterStore = state.db.createObjectStore(DEFAULTER_STORE_NAME, { keyPath: 'plate' });
            defaulterStore.createIndex('date_marked_idx', 'dateMarked', { unique: false });
        }
    };

    // Se ejecuta cuando la conexión a la BD es exitosa
    request.onsuccess = (event) => {
        state.db = event.target.result;
        console.log("Base de datos cargada exitosamente.");
        // Una vez cargada la BD, se puebla con datos iniciales si es necesario
        Promise.all([seedServices(), seedVehicleTypes(), seedUsers()]).then(loadInitialData);
    };
}

/**
 * Proporciona una forma estandarizada de acceder a un objectStore para realizar transacciones.
 * @param {string} storeName El nombre del objectStore.
 * @param {IDBTransactionMode} mode El modo de la transacción ('readonly' o 'readwrite').
 * @returns {IDBObjectStore}
 */
export function getObjectStore(storeName, mode) {
    if (!state.db) {
        console.error("La base de datos no está inicializada.");
        return null;
    }
    const transaction = state.db.transaction(storeName, mode);
    return transaction.objectStore(storeName);
}

// --- Funciones para poblar la BD (Semillas) ---

/**
 * Función genérica para poblar un objectStore con datos si está vacío.
 * @param {string} storeName Nombre del objectStore.
 * @param {Array<object>} data Array de objetos a insertar.
 * @returns {Promise<void>}
 */
async function seedData(storeName, data) {
    return new Promise((resolve, reject) => {
        const store = getObjectStore(storeName, 'readwrite');
        const countRequest = store.count();

        countRequest.onsuccess = () => {
            if (countRequest.result === 0) {
                console.log(`Poblando ${storeName} con datos iniciales...`);
                const transaction = store.transaction;
                data.forEach(item => {
                    store.add(item);
                });
                transaction.oncomplete = () => resolve();
                transaction.onerror = (e) => reject(e.target.error);
            } else {
                resolve(); // Ya tiene datos, no se hace nada
            }
        };
        countRequest.onerror = (e) => reject(e.target.error);
    });
}

function seedServices() {
    return seedData(SERVICES_STORE_NAME, [{ name: 'Venta Baños', price: 5, icon: 'restroom' }, { name: 'Venta Papel', price: 10, icon: 'toilet_paper' }]);
}

function seedVehicleTypes() {
    return seedData(VEHICLE_TYPES_STORE_NAME, [{ name: 'Carro', hourlyRate: 15 }, { name: 'Moto', hourlyRate: 10 }]);
}

async function seedUsers() {
    const hashedPassword = await hashPassword('admin');
    return seedData(USERS_STORE_NAME, [{ name: 'admin', role: 'Administrador', password: hashedPassword }]);
}