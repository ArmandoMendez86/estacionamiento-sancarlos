import { state } from './state.js';
import * as ui from './ui.js';
import { getObjectStore } from './database.js';
import { TICKET_STORE_NAME, COUNTER_STORE_NAME, DEFAULTER_STORE_NAME, MONTH_NAMES, BRANDS } from './config.js';
import { printEntryReceipt } from './printing.js';
import { updateDashboardCards } from './reports.js';

/**
 * Maneja el registro de una nueva entrada de vehículo.
 * @param {Event} e El objeto del evento del formulario.
 */
export async function registerEntry(e) {
    e.preventDefault();
    try {
        let clientBarcode, businessBarcode;
        const baseBarcode = await generateNewTicketId(state.currentEntryType);

        if (state.currentEntryType === 'hourly') {
            clientBarcode = baseBarcode;
            businessBarcode = 'R-' + baseBarcode;
        } else {
            clientBarcode = businessBarcode = baseBarcode;
        }

        const selectedVehicleType = state.vehicleTypesCache.find(v => v.id === parseInt(ui.vehicleTypeSelect.value));
        const newTicket = {
            barcode: clientBarcode,
            plate: ui.newPlateInput.value.trim().toUpperCase(),
            entryTime: new Date(),
            status: 'active',
            type: state.currentEntryType,
            vehicleTypeId: selectedVehicleType.id,
            vehicleTypeName: selectedVehicleType.name,
            brand: ui.newBrandSelect.value,
            color: ui.newColorInput.value,
            userEntry: state.currentUser.name,
            isLost: false,
            lostTicketFee: 0,
            isDefaulter: false,
            unpaidAmount: 0,
            notes: ''
        };

        if (state.currentEntryType === 'pension' || state.currentEntryType === 'overnight') {
            newTicket.cost = parseFloat(ui.newPensionAmount.value);
            newTicket.status = 'paid';
            newTicket.exitTime = new Date();
            newTicket.userPayment = state.currentUser.name;
            if (state.currentEntryType === 'pension') {
                newTicket.pensionTypeName = ui.newPensionTypeInput.value.trim();
                newTicket.pensionEndDate = new Date(ui.newPensionEndDate.value + 'T23:59:59');
            } else {
                newTicket.pensionTypeName = 'Pensión Nocturna';
                const nextDay = new Date();
                nextDay.setDate(nextDay.getDate() + 1);
                newTicket.pensionEndDate = nextDay;
            }
        } else {
            newTicket.exitTime = null;
            newTicket.cost = null;
        }

        getObjectStore(TICKET_STORE_NAME, 'readwrite').add(newTicket).onsuccess = () => {
            ui.showToast(`Entrada registrada: ${clientBarcode}`, 'success');
            printEntryReceipt(newTicket, clientBarcode, businessBarcode);
            ui.toggleModal(ui.newEntryModal, false);
            ui.resetUI();
            resetNewEntryForm();
            updateDashboardCards();
        };
    } catch (error) {
        ui.showToast('Error al registrar la entrada.', 'error');
        console.error(error);
    }
}

/**
 * Cambia el tipo de entrada en el formulario (por horas, pensión, etc.) y ajusta la UI.
 * @param {string} type El tipo de entrada ('hourly', 'overnight', 'pension').
 */
export function setEntryType(type) {
    state.currentEntryType = type;
    const buttons = [ui.typeHourlyBtn, ui.typeOvernightBtn, ui.typePensionBtn];
    buttons.forEach(btn => {
        const btnType = btn.id.split('-')[1];
        const isActive = btnType === type;
        btn.classList.toggle('bg-primary', isActive);
        btn.classList.toggle('text-primary-content', isActive);
        btn.classList.toggle('text-base-content-secondary', !isActive);
    });

    const isPaidStay = type === 'pension' || type === 'overnight';
    const isLongTermPension = type === 'pension';

    ui.pensionFieldsWrapper.classList.toggle('show', isPaidStay);
    ui.newPensionAmount.required = isPaidStay;
    ui.newPensionAmount.readOnly = type === 'overnight';
    ui.newPensionAmount.value = type === 'overnight' ? (state.businessInfoCache.overnightRate || '') : '';
    ui.pensionTypeContainer.classList.toggle('hidden', !isLongTermPension);
    ui.newPensionTypeInput.required = isLongTermPension;
    ui.pensionEndDateContainer.classList.toggle('hidden', !isLongTermPension);
    ui.newPensionEndDate.required = isLongTermPension;
    ui.pensionAmountContainer.classList.toggle('md:col-span-2', !isLongTermPension);
}

/**
 * Busca entradas previas por placa para autocompletar el formulario y alerta si es moroso.
 */
export async function findPreviousEntryByPlate() {
    const plate = ui.newPlateInput.value.trim().toUpperCase();
    const defaulterWarningMsg = document.getElementById('defaulter-warning-msg');

    ui.plateLookupMsg.textContent = '';
    defaulterWarningMsg.classList.add('hidden');
    defaulterWarningMsg.innerHTML = '';

    if (!plate) return;

    // 1. Verificar si es moroso
    const defaulterStore = getObjectStore(DEFAULTER_STORE_NAME, 'readonly');
    const defaulterRequest = defaulterStore.get(plate);
    defaulterRequest.onsuccess = () => {
        const defaulterRecord = defaulterRequest.result;
        if (defaulterRecord) {
            defaulterWarningMsg.innerHTML = `<p class="font-bold">¡ALERTA DE MOROSO!</p><p>Esta placa tiene un adeudo pendiente de <strong>${ui.formatCurrency(defaulterRecord.unpaidAmount)}</strong>.</p>`;
            defaulterWarningMsg.classList.remove('hidden');
        }
    };

    // 2. Autocompletar datos
    const ticketIndex = getObjectStore(TICKET_STORE_NAME, 'readonly').index('plate_idx');
    const ticketRequest = ticketIndex.getAll(plate);
    ticketRequest.onsuccess = () => {
        if (ticketRequest.result && ticketRequest.result.length > 0) {
            const lastEntry = ticketRequest.result.sort((a, b) => new Date(b.entryTime) - new Date(a.entryTime))[0];
            ui.vehicleTypeSelect.value = lastEntry.vehicleTypeId;
            updateBrandSelect();
            setTimeout(() => {
                ui.newBrandSelect.value = lastEntry.brand;
                ui.newColorInput.value = lastEntry.color;
            }, 50);
            ui.plateLookupMsg.textContent = 'Datos rellenados';
            ui.plateLookupMsg.className = 'absolute right-2 top-1/2 -translate-y-1/2 text-xs font-semibold text-green-600';
            setTimeout(() => ui.plateLookupMsg.textContent = '', 2500);
        }
    };
}

/**
 * Actualiza el select de marcas de vehículo basado en el tipo seleccionado.
 */
export function updateBrandSelect() {
    if (state.vehicleTypesCache.length === 0) return;
    const selectedTypeId = parseInt(ui.vehicleTypeSelect.value);
    const selectedType = state.vehicleTypesCache.find(v => v.id === selectedTypeId);
    const brandOptions = selectedType && BRANDS[selectedType.name] ? BRANDS[selectedType.name].map(name => ({ id: name, name })) : [{ id: 'Otro', name: 'Otro' }];
    ui.populateSelect(ui.newBrandSelect, brandOptions, 'id', 'name');
}


/**
 * Genera un nuevo ID de ticket único y secuencial.
 * @param {string} type El tipo de ticket ('hourly', 'pension', etc.).
 * @returns {Promise<string>} El ID del nuevo ticket.
 */
async function generateNewTicketId(type) {
    return new Promise((resolve, reject) => {
        const prefix = (type === 'hourly') ? 'TKT' : 'PEN';
        const monthYear = `${MONTH_NAMES[new Date().getMonth()]}-${new Date().getFullYear()}`;
        const counterId = `${prefix}-${monthYear}`;
        const counterStore = getObjectStore(COUNTER_STORE_NAME, 'readwrite');
        const request = counterStore.get(counterId);
        request.onsuccess = () => {
            let nextId = request.result ? request.result.lastId + 1 : 1;
            counterStore.put({ counterId: counterId, lastId: nextId });
            resolve(`${prefix}-${monthYear.substring(0, 3)}-${String(nextId).padStart(4, '0')}`);
        };
        request.onerror = (e) => reject(e.target.error);
    });
}

/**
 * Resetea el formulario de nueva entrada a su estado inicial.
 */
export function resetNewEntryForm() {
    ui.newEntryForm.reset();
    setEntryType('hourly');
    document.getElementById('defaulter-warning-msg').classList.add('hidden');
}