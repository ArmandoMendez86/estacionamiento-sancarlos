import { state } from './state.js';
import * as ui from './ui.js';
import { getObjectStore } from './database.js';
import { PRINTER_SETTINGS_STORE_NAME } from './config.js';

/**
 * Actualiza los indicadores visuales del estado de conexión con QZ Tray.
 * @param {boolean} connected Verdadero si la conexión está activa.
 */
function updateQZStatus(connected) {
    if (connected) {
        ui.qzStatusIndicator.classList.remove('bg-red-500', 'animate-pulse');
        ui.qzStatusIndicator.classList.add('bg-green-500');
        ui.qzStatusText.textContent = 'Conectado';
        ui.connectQzBtn.disabled = true;
        ui.connectQzBtn.classList.add('opacity-50');
        findPrinters();
    } else {
        ui.qzStatusIndicator.classList.add('bg-red-500', 'animate-pulse');
        ui.qzStatusIndicator.classList.remove('bg-green-500');
        ui.qzStatusText.textContent = 'Desconectado';
        ui.connectQzBtn.disabled = false;
        ui.connectQzBtn.classList.remove('opacity-50');
        ui.printerSelect.innerHTML = '<option>Conecte a QZ Tray para buscar impresoras</option>';
        ui.printerSelect.disabled = true;
        ui.savePrinterBtn.disabled = true;
        ui.testPrintBtn.disabled = true;
    }
}

/**
 * Inicia la conexión con el websocket de QZ Tray.
 */
export function connectQZ() {
    if (qz.websocket.isActive()) return;
    qz.websocket.connect().then(() => {
        ui.showToast("Conectado a QZ Tray.", "success");
        updateQZStatus(true);
    }).catch(err => {
        console.error(err);
        ui.showToast("No se pudo conectar a QZ Tray. Asegúrate que la aplicación está corriendo.", "error");
        updateQZStatus(false);
    });
}

/**
 * Busca las impresoras disponibles a través de QZ Tray y las puebla en el select.
 */
function findPrinters() {
    qz.printers.find().then(printers => {
        ui.printerSelect.innerHTML = '';
        printers.forEach(printer => {
            const option = document.createElement('option');
            option.value = printer;
            option.textContent = printer;
            if (printer === state.selectedPrinter) {
                option.selected = true;
            }
            ui.printerSelect.appendChild(option);
        });
        ui.printerSelect.disabled = false;
        ui.savePrinterBtn.disabled = false;
        ui.testPrintBtn.disabled = false;
    }).catch(err => {
        console.error(err);
        ui.showToast("Error al buscar impresoras.", "error");
    });
}

/**
 * Guarda la impresora seleccionada y el ancho del papel en la base de datos.
 */
export function savePrinterSelection() {
    const printerName = ui.printerSelect.value;
    const width = parseInt(ui.paperWidthSlider.value);

    if (!printerName) {
        ui.showToast("Seleccione una impresora válida.", "error");
        return;
    }
    const setting = { id: 1, printerName: printerName, paperWidth: width };
    getObjectStore(PRINTER_SETTINGS_STORE_NAME, 'readwrite').put(setting).onsuccess = () => {
        state.selectedPrinter = printerName;
        state.paperWidth = width;
        ui.showToast(`Configuración de impresora guardada.`, "success");
    };
}

/**
 * Carga la configuración de la impresora desde la base de datos al iniciar la aplicación.
 */
export function loadPrinterSetting() {
    const store = getObjectStore(PRINTER_SETTINGS_STORE_NAME, 'readonly');
    if (!store) return; // La BD podría no estar lista aún
    store.get(1).onsuccess = (event) => {
        const setting = event.target.result;
        if (setting) {
            if (setting.printerName) state.selectedPrinter = setting.printerName;
            if (setting.paperWidth) {
                state.paperWidth = setting.paperWidth;
                ui.paperWidthSlider.value = setting.paperWidth;
                ui.paperWidthValue.textContent = `${setting.paperWidth} chars`;
            }
            connectQZ();
        }
    };
}

/**
 * Realiza una impresión de prueba con datos ficticios.
 */
export function testPrint() {
    state.paperWidth = parseInt(ui.paperWidthSlider.value);
    const testTicket = {
        barcode: 'TKT-TEST-01',
        type: 'hourly',
        entryTime: new Date(),
        plate: 'TEST-001',
        vehicleTypeName: 'Vehículo de Prueba'
    };
    printEntryReceipt(testTicket, 'TKT-TEST-01', 'R-TKT-TEST-01');
}

/**
 * Imprime el recibo de entrada de un vehículo.
 * @param {object} ticket El objeto del ticket a imprimir.
 * @param {string} clientBarcode El código de barras para el cliente.
 * @param {string} businessBarcode El código de barras para el negocio.
 */
export function printEntryReceipt(ticket, clientBarcode, businessBarcode) {
    if (!state.selectedPrinter) {
        ui.showToast("Impresora no configurada. Recibo no impreso.", "error");
        return;
    }
    if (!qz.websocket.isActive()) {
        ui.showToast("QZ Tray no conectado. Recibo no impreso.", "error");
        connectQZ();
        return;
    }

    const config = qz.configs.create(state.selectedPrinter, { encoding: 'CP850' });

    const generateReceiptData = (copyType, barcodeData) => {
        let entryTypeDescription = "Por Hora";
        if (ticket.type === 'pension') entryTypeDescription = "Estancia Pagada";
        if (ticket.type === 'overnight') entryTypeDescription = "Pension Nocturna";
        
        return [
            '\x1B' + '\x40', // Reset
            '\x1B' + '\x61' + '\x01', // Centrar
            '\x1B' + '\x21' + '\x20', // Doble alto
            state.businessInfoCache.name || 'Estacionamiento', '\x0A',
            '\x1B' + '\x21' + '\x00', // Normal
            state.businessInfoCache.address || '', '\x0A',
            '-'.repeat(state.paperWidth) + '\x0A',
            // ... (resto de los comandos de impresión)
            `--- ${copyType} ---\x0A`,
            '\x0A', '\x0A', '\x0A',
            '\x1D' + '\x56' + '\x42' + '\x00' // Cortar papel
        ];
    };

    const clientReceiptData = generateReceiptData("COPIA CLIENTE", clientBarcode);
    const businessReceiptData = generateReceiptData("COPIA NEGOCIO", businessBarcode);

    qz.print(config, clientReceiptData)
        .then(() => qz.print(config, businessReceiptData))
        .catch(err => {
            console.error(err);
            ui.showToast("Error al imprimir recibo.", "error");
        });
}

/**
 * Imprime el reporte de corte de caja.
 */
export function printShiftReportWithQZ() {
    if (!state.shiftReportData || !state.selectedPrinter) {
        ui.showToast("No hay datos o impresora para imprimir.", "error");
        return;
    }
    if (!qz.websocket.isActive()) {
        ui.showToast("QZ Tray no conectado.", "error");
        return;
    }

    const config = qz.configs.create(state.selectedPrinter, { encoding: 'CP850' });
    const data = [
        // ... (comandos de impresión para el reporte de corte)
    ];

    qz.print(config, data).catch(err => {
        console.error(err);
        ui.showToast("Error al imprimir el reporte.", "error");
    });
}