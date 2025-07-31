import { state } from './state.js';
import * as ui from './ui.js';
import { getObjectStore } from './database.js';
import { TICKET_STORE_NAME, DEFAULTER_STORE_NAME, horarios } from './config.js';
import { calculateStayCost } from './calculation.js';
import { updateDashboardCards } from './reports.js';

/**
 * Busca un ticket por su código de barras y lo muestra en la UI.
 * @param {string} barcode El código de barras a buscar.
 */
export function findTicket(barcode) {
    if (!state.db || !barcode) {
        ui.ticketInfoSection.classList.add('hidden');
        return;
    }
    
    const finalBarcode = barcode.startsWith('R-') ? barcode.substring(2) : barcode;

    getObjectStore(TICKET_STORE_NAME, 'readonly').get(finalBarcode).onsuccess = (event) => {
        const ticket = event.target.result;
        if (ticket) {
            if (ui.quickChargeToggle.checked && ticket.status === 'active' && ticket.type === 'hourly') {
                handleQuickCharge(barcode, ticket);
            } else {
                state.currentTicket = ticket;
                displayTicketInfo(ticket);
                ui.ticketInfoSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        } else {
            ui.showToast('Ticket no encontrado.', 'error');
            ui.ticketInfoSection.classList.add('hidden');
        }
    };
}

/**
 * Procesa un cobro rápido para un ticket activo.
 * @param {string} originalBarcode El código de barras escaneado (puede tener prefijo 'R-').
 * @param {object} ticket El objeto del ticket.
 */
function handleQuickCharge(originalBarcode, ticket) {
    if (!ticket || ticket.status !== 'active') return;

    const vehicleType = state.vehicleTypesCache.find(v => v.id === ticket.vehicleTypeId);
    if (!vehicleType) {
        ui.showToast('Error: Tipo de vehículo no encontrado.', 'error');
        return;
    }

    let finalCost;
    let updatedTicket;

    if (originalBarcode.startsWith('R-')) { // Boleto de negocio = Boleto perdido
        const { totalCost: stayCost } = calculateStayCost(new Date(ticket.entryTime), new Date(), vehicleType, state.businessInfoCache, horarios);
        const lostTicketCharge = 50.00;
        finalCost = stayCost < 100 ? 100.00 : stayCost + lostTicketCharge;
        const feeApplied = finalCost - stayCost;

        updatedTicket = { ...ticket, exitTime: new Date(), status: 'paid', cost: finalCost, userPayment: state.currentUser.name, isLost: true, lostTicketFee: feeApplied };
        ui.showToast(`Cobro rápido (Boleto Perdido): ${ui.formatCurrency(finalCost)}`, 'success');
    } else {
        const { totalCost } = calculateStayCost(new Date(ticket.entryTime), new Date(), vehicleType, state.businessInfoCache, horarios);
        finalCost = totalCost;
        updatedTicket = { ...ticket, exitTime: new Date(), status: 'paid', cost: finalCost, userPayment: state.currentUser.name };
        ui.showToast(`Cobro rápido: ${ui.formatCurrency(finalCost)}`, 'success');
    }

    getObjectStore(TICKET_STORE_NAME, 'readwrite').put(updatedTicket).onsuccess = () => {
        ui.showQuickChargeModal(updatedTicket, finalCost);
        updateDashboardCards();
    };
}


/**
 * Muestra la información detallada de un ticket en la interfaz.
 * @param {object} ticket El objeto del ticket a mostrar.
 */
export function displayTicketInfo(ticket) {
    // ... (Pega aquí el cuerpo completo de tu función displayTicketInfo, 
    // asegurándote de usar 'ui.' y 'state.' donde corresponda)
}

/**
 * Marca un ticket como pagado, calculando el costo final.
 */
export async function markTicketAsPaid() {
    if (!state.db || !state.currentTicket || state.currentTicket.status !== 'active') return;
    try {
        const vehicleType = state.vehicleTypesCache.find(v => v.id === state.currentTicket.vehicleTypeId);
        if (!vehicleType) throw new Error("Vehicle type not found.");

        const { totalCost } = calculateStayCost(new Date(state.currentTicket.entryTime), new Date(), vehicleType, state.businessInfoCache, horarios);
        const updatedTicket = { ...state.currentTicket, exitTime: new Date(), status: 'paid', cost: totalCost, userPayment: state.currentUser.name };

        getObjectStore(TICKET_STORE_NAME, 'readwrite').put(updatedTicket).onsuccess = () => {
            state.currentTicket = updatedTicket;
            ui.showToast(`Ticket ${updatedTicket.barcode} cobrado: ${ui.formatCurrency(totalCost)}`, 'success');
            displayTicketInfo(updatedTicket);
            updateDashboardCards();
            setTimeout(() => { ui.resetUI(); }, 4000);
        };
    } catch (error) { ui.showToast('Error al procesar el pago.', 'error'); console.error(error); }
}

/**
 * Permite a un administrador condonar horas de un ticket activo.
 */
export async function handleWaiveHours() {
    // ... (Pega aquí el cuerpo completo de tu función handleWaiveHours)
}

/**
 * Marca un ticket como moroso, con opción de registrar un pago parcial.
 */
export async function handleMarkAsDefaulter() {
    // ... (Pega aquí el cuerpo completo de tu función handleMarkAsDefaulter)
}

/**
 * Cambia un ticket de "por horas" a "pensión nocturna".
 */
export async function handleConvertToOvernight() {
    // ... (Pega aquí el cuerpo completo de tu función handleConvertToOvernight)
}

/**
 * Cancela una pensión nocturna y cobra por horas usadas.
 */
export async function handleCancelPension() {
    // ... (Pega aquí el cuerpo completo de tu función handleCancelPension)
}

/**
 * Cancela un ticket activo sin generar cobro.
 */
export async function handleCancelTicket() {
    // ... (Pega aquí el cuerpo completo de tu función handleCancelTicket)
}


// --- Lógica de Boleto Perdido ---

/**
 * Busca un ticket activo por placa en el modal de boleto perdido.
 * @param {string} plate La placa a buscar.
 */
export function findActiveTicketByPlate(plate) {
    // ... (Pega aquí el cuerpo completo de tu función findActiveTicketByPlate)
}

/**
 * Realiza el cobro de un boleto perdido.
 */
export function chargeLostTicket() {
    // ... (Pega aquí el cuerpo completo de tu función chargeLostTicket)
}

/**
 * Ajusta un cobro que se hizo como perdido si el cliente encuentra el boleto después.
 * @param {object} ticket El ticket pagado como perdido.
 */
export function handleFoundLostTicket(ticket) {
    // ... (Pega aquí el cuerpo completo de tu función handleFoundLostTicket)
}

/**
 * Resetea el modal de boleto perdido a su estado inicial.
 */
export function resetLostTicketModal() {
    ui.lostTicketForm.reset();
    ui.lostTicketResults.classList.add('hidden');
    state.currentLostTicket = null;
}