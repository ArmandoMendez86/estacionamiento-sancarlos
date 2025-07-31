import { state } from './state.js';
import * as ui from './ui.js';
import { getObjectStore } from './database.js';
import { TICKET_STORE_NAME, SALES_STORE_NAME, EXPENSES_STORE_NAME } from './config.js';

/**
 * Abre el modal de reportes y carga todos los datos necesarios.
 */
export function openReportsModal() {
    // Carga todos los datos necesarios para los reportes
    Promise.all([
        new Promise((resolve) => getObjectStore(TICKET_STORE_NAME, 'readonly').getAll().onsuccess = e => resolve(e.target.result || [])),
        new Promise((resolve) => getObjectStore(SALES_STORE_NAME, 'readonly').getAll().onsuccess = e => resolve(e.target.result || [])),
        new Promise((resolve) => getObjectStore(EXPENSES_STORE_NAME, 'readonly').getAll().onsuccess = e => resolve(e.target.result || []))
    ]).then(([tickets, sales, expenses]) => {
        state.allRecords = tickets;
        state.allSales = sales;
        state.allExpenses = expenses;
        applyReportFilters(); // Aplica filtros y renderiza la tabla
        ui.toggleModal(ui.reportsModal, true);
    }).catch(err => {
        console.error("Error al cargar datos para reportes:", err);
        ui.showToast('Error al cargar los datos del historial.', 'error');
    });
}

/**
 * Filtra los registros basados en los criterios de búsqueda, estado y fecha.
 */
export function applyReportFilters() {
    const searchTerm = ui.reportSearchFilter.value.toUpperCase();
    const activeStatusBtn = ui.reportStatusFilterButtons.querySelector('.bg-primary');
    const statusFilter = activeStatusBtn ? activeStatusBtn.dataset.status : 'all';
    const dateRange = state.dateFilterInstance ? state.dateFilterInstance.selectedDates : [];

    let startDate, endDate;
    if (dateRange.length === 2) {
        startDate = dateRange[0];
        startDate.setHours(0, 0, 0, 0);
        endDate = dateRange[1];
        endDate.setHours(23, 59, 59, 999);
    }

    state.filteredRecords = state.allRecords.filter(record => {
        const searchMatch = searchTerm === '' || record.barcode.toUpperCase().includes(searchTerm) || record.plate.toUpperCase().includes(searchTerm);
        const statusMatch = statusFilter === 'all' || record.status === statusFilter;
        const dateMatch = !startDate || (new Date(record.entryTime) >= startDate && new Date(record.entryTime) <= endDate);
        return searchMatch && statusMatch && dateMatch;
    });

    sortReportRecords(state.recordsSortColumn, false); // Ordena sin cambiar la dirección
    state.recordsCurrentPage = 1;
    ui.renderReportTable(); // Renderiza la tabla con los datos filtrados
    generateSalesReport(state.filteredRecords, startDate, endDate); // Genera el resumen financiero
}

/**
 * Ordena los registros filtrados basados en una columna y dirección.
 * @param {string} sortKey La columna por la que se ordenará.
 * @param {boolean} toggleDirection Si es true, invierte la dirección actual del ordenamiento.
 */
export function sortReportRecords(sortKey, toggleDirection = true) {
    if (toggleDirection) {
        if (state.recordsSortColumn === sortKey) {
            state.recordsSortDirection = state.recordsSortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            state.recordsSortColumn = sortKey;
            state.recordsSortDirection = 'desc';
        }
    }

    state.filteredRecords.sort((a, b) => {
        let valA = a[state.recordsSortColumn];
        let valB = b[state.recordsSortColumn];

        if (state.recordsSortColumn === 'entryTime' || state.recordsSortColumn === 'exitTime') {
            valA = valA ? new Date(valA).getTime() : 0;
            valB = valB ? new Date(valB).getTime() : 0;
        }

        if (valA < valB) return state.recordsSortDirection === 'asc' ? -1 : 1;
        if (valA > valB) return state.recordsSortDirection === 'asc' ? 1 : -1;
        return 0;
    });
}


/**
 * Genera el resumen financiero (ingresos, gastos, neto) para los registros filtrados.
 * @param {Array<object>} records Los registros filtrados.
 * @param {Date} startDate Fecha de inicio del filtro.
 * @param {Date} endDate Fecha de fin del filtro.
 */
function generateSalesReport(records, startDate, endDate) {
    let parkingRevenue = 0;
    const userTotals = {};

    // Inicializar usuarios
    state.usersCache.forEach(user => {
        userTotals[user.name] = { parking: 0, services: 0, total: 0 };
    });

    records.forEach(ticket => {
        if ((ticket.status === 'paid' || ticket.status === 'moroso') && ticket.cost > 0) {
            parkingRevenue += ticket.cost;
            if (ticket.userPayment && userTotals[ticket.userPayment]) {
                userTotals[ticket.userPayment].parking += ticket.cost;
                userTotals[ticket.userPayment].total += ticket.cost;
            }
        }
    });

    const filteredSales = state.allSales.filter(sale => {
        return !startDate || (new Date(sale.timestamp) >= startDate && new Date(sale.timestamp) <= endDate);
    });

    const servicesRevenue = filteredSales.reduce((sum, sale) => {
        if (sale.user && userTotals[sale.user]) {
            userTotals[sale.user].services += sale.price;
            userTotals[sale.user].total += sale.price;
        }
        return sum + sale.price;
    }, 0);

    const filteredExpenses = state.allExpenses.filter(expense => {
        if (!startDate) return true;
        const expenseDate = new Date(expense.date + 'T00:00:00');
        return expenseDate >= startDate && expenseDate <= endDate;
    });

    const totalExpenses = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    const netTotal = (parkingRevenue + servicesRevenue) - totalExpenses;

    ui.renderSalesReport({ parkingRevenue, servicesRevenue, totalExpenses, netTotal, userTotals });
}