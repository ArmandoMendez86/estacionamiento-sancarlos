import { state } from './state.js';
import { ICONS, ICON_OPTIONS, COLORS } from './config.js';
import { getObjectStore } from './database.js';
import { SERVICES_STORE_NAME, VEHICLE_TYPES_STORE_NAME, USERS_STORE_NAME } from './config.js';
import { openReportsModal, updateDashboardCards } from './reports.js';
import { displayExpenses } from './expenses.js';
import { toggleModal as toggleModalGeneric, showConfirmModal as showConfirmModalGeneric, populateSelect as populateSelectGeneric } from './utils.js'; // Asumiendo que utils.js tiene funciones genéricas


// ==================================
//  Selección de Elementos del DOM
// ==================================
export const loginScreen = document.getElementById('login-screen');
export const mainApp = document.getElementById('main-app');
export const loginForm = document.getElementById('login-form');
export const logoutBtn = document.getElementById('logout-btn');
export const sessionUsername = document.getElementById('session-username');
export const sessionRole = document.getElementById('session-role');
export const barcodeInput = document.getElementById('barcode-input');
export const ticketInfoSection = document.getElementById('ticket-info');
export const ticketStatusBanner = document.getElementById('ticket-status-banner');
export const hourlyDetails = document.getElementById('hourly-details');
export const pensionDetails = document.getElementById('pension-details');
export const vehiclePlateHourly = document.getElementById('vehicle-plate-hourly');
export const vehicleTypeHourly = document.getElementById('vehicle-type-hourly');
export const vehicleBrandHourly = document.getElementById('vehicle-brand-hourly');
export const vehicleColorHourly = document.getElementById('vehicle-color-hourly');
export const entryTimeHourly = document.getElementById('entry-time-hourly');
export const timeElapsedHourly = document.getElementById('time-elapsed-hourly');
export const exitTimeHourly = document.getElementById('exit-time-hourly');
export const totalCostHourly = document.getElementById('total-cost-hourly');
export const chargeButton = document.getElementById('charge-button');
export const vehiclePlatePension = document.getElementById('vehicle-plate-pension');
export const pensionTypeDetails = document.getElementById('pension-type-details');
export const endDatePension = document.getElementById('end-date-pension');
export const vehicleTypePension = document.getElementById('vehicle-type-pension');
export const vehicleBrandPension = document.getElementById('vehicle-brand-pension');
export const vehicleColorPension = document.getElementById('vehicle-color-pension');
export const newEntryBtn = document.getElementById('new-entry-btn');
export const newEntryModal = document.getElementById('new-entry-modal');
export const newEntryForm = document.getElementById('new-entry-form');
export const cancelEntryBtn = document.getElementById('cancel-entry-btn');
export const newPlateInput = document.getElementById('new-plate-input');
export const typeHourlyBtn = document.getElementById('type-hourly-btn');
export const typePensionBtn = document.getElementById('type-pension-btn');
export const typeOvernightBtn = document.getElementById('type-overnight-btn');
export const pensionFieldsWrapper = document.getElementById('pension-fields-wrapper');
export const newPensionTypeInput = document.getElementById('new-pension-type-input');
export const newPensionEndDate = document.getElementById('new-pension-end-date');
export const newPensionAmount = document.getElementById('new-pension-amount');
export const vehicleTypeSelect = document.getElementById('vehicle-type-select');
export const newBrandSelect = document.getElementById('new-brand-select');
export const newColorInput = document.getElementById('new-color-input');
export const colorSuggestions = document.getElementById('color-suggestions');
export const plateLookupMsg = document.getElementById('plate-lookup-msg');
export const fabContainer = document.getElementById('fab-container');
export const fabMainBtn = document.getElementById('fab-main');
export const fabOptionsContainer = document.getElementById('fab-options');
export const calculatorModal = document.getElementById('calculator-modal');
export const calculatorForm = document.getElementById('calculator-form');
export const calcVehicleType = document.getElementById('calc-vehicle-type');
export const calcEntryTime = document.getElementById('calc-entry-time');
export const calcExitTime = document.getElementById('calc-exit-time');
export const calculatorResults = document.getElementById('calculator-results');
export const calcBreakdown = document.getElementById('calc-breakdown');
export const calcTotalCost = document.getElementById('calc-total-cost');
export const cancelCalcBtn = document.getElementById('cancel-calc-btn');
export const settingsModal = document.getElementById('settings-modal');
export const closeSettingsBtn = document.getElementById('close-settings-btn');
export const settingsTabs = document.getElementById('settings-tabs');
export const confirmModal = document.getElementById('confirm-modal');
export const confirmModalMessage = document.getElementById('confirm-modal-message');
export const confirmModalCancelBtn = document.getElementById('confirm-modal-cancel-btn');
export const confirmModalConfirmBtn = document.getElementById('confirm-modal-confirm-btn');
export const toastContainer = document.getElementById('toast-container');
export const cancelPensionBtn = document.getElementById('cancel-pension-btn');
export const pensionTypeContainer = document.getElementById('pension-type-container');
export const pensionEndDateContainer = document.getElementById('pension-end-date-container');
export const pensionAmountContainer = document.getElementById('pension-amount-container');
export const convertToOvernightBtn = document.getElementById('convert-to-overnight-btn');
export const cancelTicketBtn = document.getElementById('cancel-ticket-btn');
export const expensesModal = document.getElementById('expenses-modal');
export const closeExpensesBtn = document.getElementById('close-expenses-btn');
export const expenseForm = document.getElementById('expense-form');
export const expenseIdInput = document.getElementById('expense-id-input');
export const expenseDescriptionInput = document.getElementById('expense-description-input');
export const expenseAmountInput = document.getElementById('expense-amount-input');
export const cancelExpenseEditBtn = document.getElementById('cancel-expense-edit-btn');
export const saveExpenseBtn = document.getElementById('save-expense-btn');
export const expensesListContainer = document.getElementById('expenses-list-container');
export const expensesTotal = document.getElementById('expenses-total');
export const serviceForm = document.getElementById('service-form');
export const serviceFormTitle = document.getElementById('service-form-title');
export const serviceIdInput = document.getElementById('service-id-input');
export const serviceNameInput = document.getElementById('service-name-input');
export const servicePriceInput = document.getElementById('service-price-input');
export const serviceIconSelect = document.getElementById('service-icon-select');
export const saveServiceBtn = document.getElementById('save-service-btn');
export const cancelServiceEditBtn = document.getElementById('cancel-service-edit-btn');
export const servicesListContainer = document.getElementById('services-list-container');
export const vehicleTypeForm = document.getElementById('vehicle-type-form');
export const vehicleTypeFormTitle = document.getElementById('vehicle-type-form-title');
export const vehicleTypeIdInput = document.getElementById('vehicle-type-id-input');
export const vehicleTypeNameInput = document.getElementById('vehicle-type-name-input');
export const vehicleTypeRateInput = document.getElementById('vehicle-type-rate-input');
export const saveVehicleTypeBtn = document.getElementById('save-vehicle-type-btn');
export const cancelVehicleTypeEditBtn = document.getElementById('cancel-vehicle-type-edit-btn');
export const vehicleTypesListContainer = document.getElementById('vehicle-types-list-container');
export const businessInfoForm = document.getElementById('business-info-form');
export const businessNameInput = document.getElementById('business-name');
export const businessAddressInput = document.getElementById('business-address');
export const businessPhoneInput = document.getElementById('business-phone');
export const businessHoursInput = document.getElementById('business-hours');
export const businessOvernightRateInput = document.getElementById('business-overnight-rate');
export const userForm = document.getElementById('user-form');
export const userFormTitle = document.getElementById('user-form-title');
export const userIdInput = document.getElementById('user-id-input');
export const userNameInput = document.getElementById('user-name-input');
export const userRoleSelect = document.getElementById('user-role-select');
export const userPasswordInput = document.getElementById('user-password-input');
export const saveUserBtn = document.getElementById('save-user-btn');
export const cancelUserEditBtn = document.getElementById('cancel-user-edit-btn');
export const usersListContainer = document.getElementById('users-list-container');
export const themeToggleBtn = document.getElementById('theme-toggle-btn');
export const themePopover = document.getElementById('theme-popover');
export const themeSelector = document.getElementById('theme-selector');
export const quickChargeToggle = document.getElementById('quick-charge-toggle');
export const quickChargeModal = document.getElementById('quick-charge-modal');
export const activeVehiclesCard = document.getElementById('active-vehicles-card');
export const parkingRevenueCard = document.getElementById('parking-revenue-card');
export const pensionRevenueCard = document.getElementById('pension-revenue-card');
export const servicesRevenueCard = document.getElementById('services-revenue-card');
export const expensesCard = document.getElementById('expenses-card');
export const servicesRevenueContainer = document.getElementById('services-revenue-container');
export const shiftReportModal = document.getElementById('shift-report-modal');
export const shiftReportContent = document.getElementById('shift-report-content');
export const shiftReportUserInfo = document.getElementById('shift-report-user-info');
export const printShiftReportBtn = document.getElementById('print-shift-report-btn');
export const logoutConfirmBtn = document.getElementById('logout-confirm-btn');
export const servicesRevenueModal = document.getElementById('services-revenue-modal');
export const closeServicesRevenueBtn = document.getElementById('close-services-revenue-btn');
export const servicesRevenueBreakdownList = document.getElementById('services-revenue-breakdown-list');
export const servicesRevenueTotalModal = document.getElementById('services-revenue-total-modal');
export const connectQzBtn = document.getElementById('connect-qz-btn');
export const qzStatusIndicator = document.getElementById('qz-status-indicator');
export const qzStatusText = document.getElementById('qz-status-text');
export const printerSelect = document.getElementById('printer-select');
export const savePrinterBtn = document.getElementById('save-printer-btn');
export const paperWidthSlider = document.getElementById('paper-width-slider');
export const paperWidthValue = document.getElementById('paper-width-value');
export const testPrintBtn = document.getElementById('test-print-btn');
export const lostTicketBtn = document.getElementById('lost-ticket-btn');
export const lostTicketModal = document.getElementById('lost-ticket-modal');
export const closeLostTicketModalBtn = document.getElementById('close-lost-ticket-modal');
export const lostTicketForm = document.getElementById('lost-ticket-form');
export const lostTicketPlateInput = document.getElementById('lost-ticket-plate-input');
export const lostTicketResults = document.getElementById('lost-ticket-results');
export const lostTicketInfo = document.getElementById('lost-ticket-info');
export const lostTicketBreakdown = document.getElementById('lost-ticket-breakdown');
export const lostTicketTotalCost = document.getElementById('lost-ticket-total-cost');
export const chargeLostTicketBtn = document.getElementById('charge-lost-ticket-btn');
export const reportsModal = document.getElementById('reports-modal');
export const closeReportsModalBtn = document.getElementById('close-reports-modal');
export const reportsTableBody = document.getElementById('reports-table-body');
export const reportDateFilter = document.getElementById('report-date-filter');
export const reportSearchFilter = document.getElementById('report-search-filter');
export const reportStatusFilterButtons = document.getElementById('report-status-filter-buttons');
export const reportsPaginationControls = document.getElementById('reports-pagination-controls');
export const reportPrevPageBtn = document.getElementById('report-prev-page-btn');
export const reportNextPageBtn = document.getElementById('report-next-page-btn');
export const reportPageInfo = document.getElementById('report-page-info');
export const reportRecordsInfo = document.getElementById('report-records-info');
export const reportParkingRevenue = document.getElementById('report-parking-revenue');
export const reportServicesRevenue = document.getElementById('report-services-revenue');
export const reportExpensesTotal = document.getElementById('report-expenses-total');
export const reportNetTotal = document.getElementById('report-net-total');
export const reportUserBreakdown = document.getElementById('report-user-breakdown');


// ==================================
//  Funciones de Manipulación de UI
// ==================================

export function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = 'toast p-4 rounded-lg shadow-lg flex items-center space-x-3 w-full';

    const icons = {
        success: `<svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`,
        error: `<svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`,
        info: `<svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`
    };

    const colors = {
        success: 'bg-green-500',
        error: 'bg-red-500',
        info: 'bg-slate-800'
    };

    toast.classList.add(colors[type]);
    toast.innerHTML = `
                <div>${icons[type]}</div>
                <p class="text-white font-medium text-sm">${message}</p>
            `;

    toastContainer.appendChild(toast);

    setTimeout(() => { toast.classList.add('show'); }, 10);
    setTimeout(() => {
        toast.classList.remove('show');
        toast.addEventListener('transitionend', () => toast.remove());
    }, 4000);
}

export function toggleModal(modal, show) {
    const content = modal.querySelector('.modal-content');
    if (show) {
        modal.classList.remove('opacity-0', 'pointer-events-none');
        if (content) content.classList.remove('opacity-0', 'scale-95');
    } else {
        modal.classList.add('opacity-0');
        if (content) content.classList.add('opacity-0', 'scale-95');
        setTimeout(() => modal.classList.add('pointer-events-none'), 200);
    }
}

export function showConfirmModal(message, onConfirm) {
    confirmModalMessage.innerHTML = message;
    state.confirmCallback = onConfirm;
    toggleModal(confirmModal, true);
}

export function resetUI() {
    barcodeInput.value = '';
    ticketInfoSection.classList.add('hidden');
    barcodeInput.focus();
    state.currentTicket = null;
}

export function showLoginScreen() {
    loginScreen.classList.remove('opacity-0', 'pointer-events-none');
    mainApp.classList.add('hidden');
}

export function showMainApp() {
    loginScreen.classList.add('opacity-0', 'pointer-events-none');
    mainApp.classList.remove('hidden');
    sessionUsername.textContent = state.currentUser.name;
    sessionRole.textContent = state.currentUser.role;
    loadFabOptions();
    updateDashboardCards();
    barcodeInput.focus();
}

export function showQuickChargeModal(ticket, totalCost) {
    document.getElementById('quick-charge-amount').textContent = formatCurrency(totalCost);
    document.getElementById('quick-charge-ticket-id').textContent = ticket.barcode;
    document.getElementById('quick-charge-plate').textContent = ticket.plate;
    document.getElementById('quick-charge-time').textContent = formatElapsedTime(new Date(ticket.exitTime) - new Date(ticket.entryTime));
    toggleModal(quickChargeModal, true);

    setTimeout(() => {
        toggleModal(quickChargeModal, false);
        resetUI();
    }, 4000);
}


// ==================================
//  Funciones de Carga de Datos en UI
// ==================================

export function loadInitialData() {
    loadPrinterSetting();
    loadFabOptions();
    loadVehicleTypesFromDB();
    loadBusinessInfo();
    loadUsersFromDB();
    populateThemeSelector();
    populateSelect(serviceIconSelect, ICON_OPTIONS, 'id', 'name');
    const quickChargePref = localStorage.getItem('quickChargeMode') === 'true';
    quickChargeToggle.checked = quickChargePref;
}

export function loadFabOptions() {
    const store = getObjectStore(SERVICES_STORE_NAME, 'readonly');
    store.getAll().onsuccess = (event) => {
        const services = event.target.result;
        fabOptionsContainer.innerHTML = '';

        if (state.currentUser && state.currentUser.role === 'Administrador') {
            const reportsBtn = document.createElement('button');
            reportsBtn.id = 'reports-btn';
            reportsBtn.className = 'fab-option bg-base-200 text-teal-600 w-14 h-14 rounded-full flex items-center justify-center';
            reportsBtn.title = 'Historial de Registros';
            reportsBtn.innerHTML = `<svg class="w-7 h-7" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25A2.25 2.25 0 015.25 3h4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>`;
            reportsBtn.addEventListener('click', () => {
                openReportsModal();
                fabContainer.classList.remove('active');
            });
            fabOptionsContainer.appendChild(reportsBtn);
        }

        const expensesBtn = document.createElement('button');
        expensesBtn.id = 'expenses-btn';
        expensesBtn.className = 'fab-option bg-base-200 text-green-600 w-14 h-14 rounded-full flex items-center justify-center';
        expensesBtn.title = 'Registrar Gasto';
        expensesBtn.innerHTML = `<svg class="w-7 h-7" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>`;
        expensesBtn.addEventListener('click', () => {
            toggleModal(expensesModal, true);
            displayExpenses();
            fabContainer.classList.remove('active');
        });
        fabOptionsContainer.appendChild(expensesBtn);

        services.forEach(service => fabOptionsContainer.appendChild(createServiceButton(service)));
        displayServicesInSettings(services);

        const calculatorBtn = document.createElement('button');
        calculatorBtn.id = 'calculator-btn';
        calculatorBtn.className = 'fab-option bg-base-200 text-primary w-14 h-14 rounded-full flex items-center justify-center';
        calculatorBtn.title = 'Calculadora';
        calculatorBtn.innerHTML = `<svg class="w-7 h-7" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008zm0 3h.008v.008H8.25v-.008zm0 3h.008v.008H8.25v-.008zm3-6h.008v.008H11.25v-.008zm0 3h.008v.008H11.25v-.008zm0 3h.008v.008H11.25v-.008zm3-6h.008v.008H14.25v-.008zm0 3h.008v.008H14.25v-.008zM4.5 21V3.75A1.75 1.75 0 016.25 2h11.5A1.75 1.75 0 0119.5 3.75V21a1.75 1.75 0 01-1.75 1.75H6.25A1.75 1.75 0 014.5 21z" /></svg>`;
        calculatorBtn.addEventListener('click', () => {
            calculatorResults.classList.add('hidden');
            calculatorForm.reset();
            toggleModal(calculatorModal, true);
            fabContainer.classList.remove('active');
        });
        fabOptionsContainer.appendChild(calculatorBtn);

        const settingsBtn = document.createElement('button');
        settingsBtn.id = 'settings-btn';
        settingsBtn.className = 'fab-option bg-base-200 text-base-content-secondary w-14 h-14 rounded-full flex items-center justify-center';
        settingsBtn.title = 'Configuración';
        settingsBtn.innerHTML = `<svg class="w-7 h-7" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path fill-rule="evenodd" d="M11.078 2.25c-.917 0-1.699.663-1.946 1.55l-.26 1.038a.75.75 0 00.44 1.043l1.1-.368a.75.75 0 01.942.233l.25.433a.75.75 0 01-.233.942l-1.1.368a.75.75 0 00-.44 1.043l.26 1.038c.247.887 1.03.1.55 1.946h2.844c.917 0 1.699-.663 1.946-1.55l.26-1.038a.75.75 0 00-.44-1.043l-1.1.368a.75.75 0 01-.942-.233l-.25-.433a.75.75 0 01.233-.942l1.1-.368a.75.75 0 00.44-1.043l-.26-1.038A1.99 1.99 0 0013.922 2.25H11.08zM12 8.25a3.75 3.75 0 100 7.5 3.75 3.75 0 000-7.5z" clip-rule="evenodd" /><path d="M1.5 9.75a.75.75 0 01.75-.75h1.316a.75.75 0 01.75.75v3a.75.75 0 01-.75.75H2.25a.75.75 0 01-.75-.75v-3zM20.25 9.75a.75.75 0 01.75-.75h1.316a.75.75 0 01.75.75v3a.75.75 0 01-.75.75h-1.316a.75.75 0 01-.75-.75v-3zM9.75 1.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75v1.316a.75.75 0 01-.75.75h-3a.75.75 0 01-.75-.75V1.5zM9.75 20.25a.75.75 0 01.75-.75h3a.75.75 0 01.75.75v1.316a.75.75 0 01-.75.75h-3a.75.75 0 01-.75-.75V20.25z" /></svg>`;
        settingsBtn.addEventListener('click', () => {
            toggleModal(settingsModal, true);
            fabContainer.classList.remove('active');
        });
        fabOptionsContainer.appendChild(settingsBtn);
    };
}


// ... (El resto de las funciones de UI, renderizado y formato)