// ==================================
//  Configuración de la Base de Datos
// ==================================
export const DB_NAME = 'parkingLotDB';
export const DB_VERSION = 18; // Mantén la última versión que establecimos

// Nombres de los Object Stores (Tablas)
export const TICKET_STORE_NAME = 'tickets';
export const COUNTER_STORE_NAME = 'counters';
export const SERVICES_STORE_NAME = 'services';
export const SALES_STORE_NAME = 'sales';
export const VEHICLE_TYPES_STORE_NAME = 'vehicleTypes';
export const BUSINESS_INFO_STORE_NAME = 'businessInfo';
export const USERS_STORE_NAME = 'users';
export const EXPENSES_STORE_NAME = 'expenses';
export const PRINTER_SETTINGS_STORE_NAME = 'printerSettings';
export const DEFAULTER_STORE_NAME = 'defaulters';

// ==================================
//  Datos Predefinidos
// ==================================
export const MONTH_NAMES = ["ENE", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL", "AGO", "SEP", "OCT", "NOV", "DIC"];

export const BRANDS = {
    Carro: ["Nissan", "Chevrolet", "Volkswagen", "Toyota", "Honda", "Ford", "Kia", "Mazda", "Otro"],
    Moto: ["Italika", "Honda", "Yamaha", "Suzuki", "Bajaj", "Vento", "Otro"]
};

export const COLORS = ["Blanco", "Negro", "Gris", "Plata", "Rojo", "Azul", "Verde"];

// Horarios de Operación (0: Domingo, 1: Lunes, etc.)
export const horarios = {
    0: { apertura: "10:00", cierre: "22:00" },
    1: { apertura: "09:00", cierre: "22:00" },
    2: { apertura: "09:00", cierre: "22:00" },
    3: { apertura: "09:00", cierre: "22:00" },
    4: { apertura: "09:00", cierre: "20:00" },
    5: { apertura: "09:00", cierre: "22:00" },
    6: { apertura: "09:00", cierre: "22:00" },
};

// ==================================
//  Configuración de UI (Iconos)
// ==================================
export const ICONS = {
    restroom: `<svg class="w-7 h-7" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M8.5 4.5a2.5 2.5 0 100 5 2.5 2.5 0 000-5zM6 11h5v10H9v-5H6v-5zm7.5-6.5a2.5 2.5 0 100 5 2.5 2.5 0 000-5zM13 11h5v5h-2v5h-3v-10z" /></svg>`,
    toilet_paper: `<svg class="w-7 h-7" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M19 2c-1.654 0-3 1.346-3 3v14c0 1.654 1.346 3 3 3s3-1.346 3-3V5c0-1.654-1.346-3-3-3zm-1 14.5c0 .276-.224.5-.5.5s-.5-.224-.5-.5v-11c0-.276.224-.5.5-.5s.5.224.5.5v11zM2 6v14h11V6H2zm3 2h5v2H5V8zm0 4h5v2H5v-2z" /></svg>`,
    key: `<svg class="w-7 h-7" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M16.5 8.25a3.75 3.75 0 10-7.5 0 3.75 3.75 0 007.5 0zM21 12a9 9 0 11-18 0 9 9 0 0118 0z" /><path d="M12 1.5a.75.75 0 01.75.75v1.133a10.48 10.48 0 015.667 2.334.75.75 0 01-.833 1.242 9 9 0 00-11.168 0 .75.75 0 01-.833-1.242A10.48 10.48 0 0111.25 3.383V2.25a.75.75 0 01.75-.75z" /></svg>`
};

export const ICON_OPTIONS = [
    { id: 'restroom', name: 'Baño' },
    { id: 'toilet_paper', name: 'Papel' },
    { id: 'key', name: 'Llaves' }
];