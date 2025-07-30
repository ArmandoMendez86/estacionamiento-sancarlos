document.addEventListener('DOMContentLoaded', () => {
    // =====================================================================
    // ======================= INICIO: CONSTANTES Y VARIABLES =======================
    // =====================================================================
    const DB_NAME = 'parkingLotDB';
    const DB_VERSION = 14;
    const TICKET_STORE_NAME = 'tickets';
    const COUNTER_STORE_NAME = 'counters';
    const SERVICES_STORE_NAME = 'services';
    const SALES_STORE_NAME = 'sales';
    const VEHICLE_TYPES_STORE_NAME = 'vehicleTypes';
    const BUSINESS_INFO_STORE_NAME = 'businessInfo';
    const USERS_STORE_NAME = 'users';
    const EXPENSES_STORE_NAME = 'expenses';
    const MONTH_NAMES = ["ENE", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL", "AGO", "SEP", "OCT", "NOV", "DIC"];

    const BRANDS = { Carro: ["Nissan", "Chevrolet", "Volkswagen", "Toyota", "Honda", "Ford", "Kia", "Mazda", "Otro"], Moto: ["Italika", "Honda", "Yamaha", "Suzuki", "Bajaj", "Vento", "Otro"] };
    const COLORS = ["Blanco", "Negro", "Gris", "Plata", "Rojo", "Azul", "Verde"];

    const horarios = {
        0: { apertura: "10:00", cierre: "22:00" }, 1: { apertura: "09:00", cierre: "22:00" }, 2: { apertura: "09:00", cierre: "22:00" }, 3: { apertura: "09:00", cierre: "22:00" }, 4: { apertura: "09:00", cierre: "20:00" }, 5: { apertura: "09:00", cierre: "22:00" }, 6: { apertura: "09:00", cierre: "22:00" },
    };

    const ICONS = {
        restroom: `<svg class="w-7 h-7" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M8.5 4.5a2.5 2.5 0 100 5 2.5 2.5 0 000-5zM6 11h5v10H9v-5H6v-5zm7.5-6.5a2.5 2.5 0 100 5 2.5 2.5 0 000-5zM13 11h5v5h-2v5h-3v-10z" /></svg>`,
        toilet_paper: `<svg class="w-7 h-7" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M19 2c-1.654 0-3 1.346-3 3v14c0 1.654 1.346 3 3 3s3-1.346 3-3V5c0-1.654-1.346-3-3-3zm-1 14.5c0 .276-.224.5-.5.5s-.5-.224-.5-.5v-11c0-.276.224-.5.5-.5s.5.224.5.5v11zM2 6v14h11V6H2zm3 2h5v2H5V8zm0 4h5v2H5v-2z" /></svg>`,
        key: `<svg class="w-7 h-7" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M16.5 8.25a3.75 3.75 0 10-7.5 0 3.75 3.75 0 007.5 0zM21 12a9 9 0 11-18 0 9 9 0 0118 0z" /><path d="M12 1.5a.75.75 0 01.75.75v1.133a10.48 10.48 0 015.667 2.334.75.75 0 01-.833 1.242 9 9 0 00-11.168 0 .75.75 0 01-.833-1.242A10.48 10.48 0 0111.25 3.383V2.25a.75.75 0 01.75-.75z" /></svg>`
    };
    const ICON_OPTIONS = [{ id: 'restroom', name: 'Baño' }, { id: 'toilet_paper', name: 'Papel' }, { id: 'key', name: 'Llaves' }];

    // DOM Elements
    const loginScreen = document.getElementById('login-screen');
    const mainApp = document.getElementById('main-app');
    const loginForm = document.getElementById('login-form');
    const logoutBtn = document.getElementById('logout-btn');
    const sessionUsername = document.getElementById('session-username');
    const sessionRole = document.getElementById('session-role');
    const barcodeInput = document.getElementById('barcode-input'), ticketInfoSection = document.getElementById('ticket-info'), ticketStatusBanner = document.getElementById('ticket-status-banner'), hourlyDetails = document.getElementById('hourly-details'), pensionDetails = document.getElementById('pension-details'), vehiclePlateHourly = document.getElementById('vehicle-plate-hourly'), vehicleTypeHourly = document.getElementById('vehicle-type-hourly'), vehicleBrandHourly = document.getElementById('vehicle-brand-hourly'), vehicleColorHourly = document.getElementById('vehicle-color-hourly'), entryTimeHourly = document.getElementById('entry-time-hourly'), timeElapsedHourly = document.getElementById('time-elapsed-hourly'), exitTimeHourly = document.getElementById('exit-time-hourly'), totalCostHourly = document.getElementById('total-cost-hourly'), chargeButton = document.getElementById('charge-button'), vehiclePlatePension = document.getElementById('vehicle-plate-pension'), pensionTypeDetails = document.getElementById('pension-type-details'), endDatePension = document.getElementById('end-date-pension'), vehicleTypePension = document.getElementById('vehicle-type-pension'), vehicleBrandPension = document.getElementById('vehicle-brand-pension'), vehicleColorPension = document.getElementById('vehicle-color-pension'), newEntryBtn = document.getElementById('new-entry-btn'), newEntryModal = document.getElementById('new-entry-modal'), newEntryForm = document.getElementById('new-entry-form'), cancelEntryBtn = document.getElementById('cancel-entry-btn'), newPlateInput = document.getElementById('new-plate-input'), typeHourlyBtn = document.getElementById('type-hourly-btn'), typePensionBtn = document.getElementById('type-pension-btn'), typeOvernightBtn = document.getElementById('type-overnight-btn'), pensionFields = document.getElementById('pension-fields'), newPensionTypeInput = document.getElementById('new-pension-type-input'), newPensionEndDate = document.getElementById('new-pension-end-date'), newPensionAmount = document.getElementById('new-pension-amount'), vehicleTypeSelect = document.getElementById('vehicle-type-select'), newBrandSelect = document.getElementById('new-brand-select'), newColorInput = document.getElementById('new-color-input'), colorSuggestions = document.getElementById('color-suggestions'), plateLookupMsg = document.getElementById('plate-lookup-msg'), fabContainer = document.getElementById('fab-container'), fabMainBtn = document.getElementById('fab-main'), fabOptionsContainer = document.getElementById('fab-options');
    const calculatorModal = document.getElementById('calculator-modal'), calculatorForm = document.getElementById('calculator-form'), calcVehicleType = document.getElementById('calc-vehicle-type'), calcEntryTime = document.getElementById('calc-entry-time'), calcExitTime = document.getElementById('calc-exit-time'), calculatorResults = document.getElementById('calculator-results'), calcBreakdown = document.getElementById('calc-breakdown'), calcTotalCost = document.getElementById('calc-total-cost'), cancelCalcBtn = document.getElementById('cancel-calc-btn');
    const settingsModal = document.getElementById('settings-modal'), closeSettingsBtn = document.getElementById('close-settings-btn'), settingsTabs = document.getElementById('settings-tabs');
    const confirmModal = document.getElementById('confirm-modal'), confirmModalMessage = document.getElementById('confirm-modal-message'), confirmModalCancelBtn = document.getElementById('confirm-modal-cancel-btn'), confirmModalConfirmBtn = document.getElementById('confirm-modal-confirm-btn');
    const toastContainer = document.getElementById('toast-container');
    const cancelPensionBtn = document.getElementById('cancel-pension-btn');
    const pensionTypeContainer = document.getElementById('pension-type-container');
    const pensionEndDateContainer = document.getElementById('pension-end-date-container');
    const convertToOvernightBtn = document.getElementById('convert-to-overnight-btn');
    const cancelTicketBtn = document.getElementById('cancel-ticket-btn');
    const expensesModal = document.getElementById('expenses-modal'), closeExpensesBtn = document.getElementById('close-expenses-btn'), expenseForm = document.getElementById('expense-form'), expenseIdInput = document.getElementById('expense-id-input'), expenseDescriptionInput = document.getElementById('expense-description-input'), expenseAmountInput = document.getElementById('expense-amount-input'), cancelExpenseEditBtn = document.getElementById('cancel-expense-edit-btn'), saveExpenseBtn = document.getElementById('save-expense-btn'), expensesListContainer = document.getElementById('expenses-list-container'), expensesTotal = document.getElementById('expenses-total');
    const serviceForm = document.getElementById('service-form'), serviceFormTitle = document.getElementById('service-form-title'), serviceIdInput = document.getElementById('service-id-input'), serviceNameInput = document.getElementById('service-name-input'), servicePriceInput = document.getElementById('service-price-input'), serviceIconSelect = document.getElementById('service-icon-select'), saveServiceBtn = document.getElementById('save-service-btn'), cancelServiceEditBtn = document.getElementById('cancel-service-edit-btn'), servicesListContainer = document.getElementById('services-list-container');
    const vehicleTypeForm = document.getElementById('vehicle-type-form'), vehicleTypeFormTitle = document.getElementById('vehicle-type-form-title'), vehicleTypeIdInput = document.getElementById('vehicle-type-id-input'), vehicleTypeNameInput = document.getElementById('vehicle-type-name-input'), vehicleTypeRateInput = document.getElementById('vehicle-type-rate-input'), saveVehicleTypeBtn = document.getElementById('save-vehicle-type-btn'), cancelVehicleTypeEditBtn = document.getElementById('cancel-vehicle-type-edit-btn'), vehicleTypesListContainer = document.getElementById('vehicle-types-list-container');
    const businessInfoForm = document.getElementById('business-info-form'), businessNameInput = document.getElementById('business-name'), businessAddressInput = document.getElementById('business-address'), businessPhoneInput = document.getElementById('business-phone'), businessHoursInput = document.getElementById('business-hours'), businessOvernightRateInput = document.getElementById('business-overnight-rate');
    const userForm = document.getElementById('user-form'), userFormTitle = document.getElementById('user-form-title'), userIdInput = document.getElementById('user-id-input'), userNameInput = document.getElementById('user-name-input'), userRoleSelect = document.getElementById('user-role-select'), userPasswordInput = document.getElementById('user-password-input'), saveUserBtn = document.getElementById('save-user-btn'), cancelUserEditBtn = document.getElementById('cancel-user-edit-btn'), usersListContainer = document.getElementById('users-list-container');
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const themePopover = document.getElementById('theme-popover');
    const themeSelector = document.getElementById('theme-selector');
    const quickChargeToggle = document.getElementById('quick-charge-toggle');
    const quickChargeModal = document.getElementById('quick-charge-modal');
    // Dashboard Cards
    const activeVehiclesCard = document.getElementById('active-vehicles-card');
    const parkingRevenueCard = document.getElementById('parking-revenue-card');
    const pensionRevenueCard = document.getElementById('pension-revenue-card');
    const servicesRevenueCard = document.getElementById('services-revenue-card');
    const expensesCard = document.getElementById('expenses-card');
    // Shift Report Modal
    const shiftReportModal = document.getElementById('shift-report-modal');
    const shiftReportContent = document.getElementById('shift-report-content');
    const shiftReportUserInfo = document.getElementById('shift-report-user-info');
    const printShiftReportBtn = document.getElementById('print-shift-report-btn');
    const logoutConfirmBtn = document.getElementById('logout-confirm-btn');


    let db;
    let currentUser = null;
    let currentTicket = null;
    let currentEntryType = 'hourly';
    let vehicleTypesCache = [];
    let businessInfoCache = {};
    let usersCache = [];
    let confirmCallback = null;
    let searchDebounceTimer;
    let shiftReportData = null; // To store data for printing
    // ======================== FIN: CONSTANTES Y VARIABLES ========================

    // =====================================================================
    // ======================= INICIO: LÓGICA DE BASE DE DATOS =======================
    // =====================================================================
    function initDB() {
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        request.onerror = (event) => console.error('DB Error:', event.target.errorCode);
        request.onupgradeneeded = (event) => {
            db = event.target.result;
            if (!db.objectStoreNames.contains(TICKET_STORE_NAME)) {
                const ticketStore = db.createObjectStore(TICKET_STORE_NAME, { keyPath: 'barcode' });
                ticketStore.createIndex('plate_idx', 'plate', { unique: false });
                ticketStore.createIndex('status_idx', 'status', { unique: false });
                ticketStore.createIndex('user_payment_idx', 'userPayment', { unique: false });
                ticketStore.createIndex('exit_time_idx', 'exitTime', { unique: false });
            }
            if (!db.objectStoreNames.contains(COUNTER_STORE_NAME)) db.createObjectStore(COUNTER_STORE_NAME, { keyPath: 'counterId' });
            if (!db.objectStoreNames.contains(SERVICES_STORE_NAME)) db.createObjectStore(SERVICES_STORE_NAME, { keyPath: 'id', autoIncrement: true });
            if (!db.objectStoreNames.contains(SALES_STORE_NAME)) {
                const salesStore = db.createObjectStore(SALES_STORE_NAME, { keyPath: 'id', autoIncrement: true });
                salesStore.createIndex('timestamp_idx', 'timestamp', { unique: false });
                salesStore.createIndex('user_idx', 'user', { unique: false });
            }
            if (!db.objectStoreNames.contains(VEHICLE_TYPES_STORE_NAME)) db.createObjectStore(VEHICLE_TYPES_STORE_NAME, { keyPath: 'id', autoIncrement: true });
            if (!db.objectStoreNames.contains(BUSINESS_INFO_STORE_NAME)) db.createObjectStore(BUSINESS_INFO_STORE_NAME, { keyPath: 'id' });
            if (!db.objectStoreNames.contains(USERS_STORE_NAME)) {
                const userStore = db.createObjectStore(USERS_STORE_NAME, { keyPath: 'id', autoIncrement: true });
                userStore.createIndex('name_idx', 'name', { unique: true });
            }
            if (!db.objectStoreNames.contains(EXPENSES_STORE_NAME)) {
                const expenseStore = db.createObjectStore(EXPENSES_STORE_NAME, { keyPath: 'id', autoIncrement: true });
                expenseStore.createIndex('date_idx', 'date', { unique: false });
                expenseStore.createIndex('user_idx', 'user', { unique: false });
            }
        };
        request.onsuccess = (event) => {
            db = event.target.result;
            loadTheme(); // Cargar tema primero para la pantalla de login
            checkSession();
            Promise.all([seedServices(), seedVehicleTypes(), seedUsers()]).then(loadInitialData);
        };
    }

    function getObjectStore(storeName, mode) { return db.transaction(storeName, mode).objectStore(storeName); }

    async function seedData(storeName, data) {
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(storeName, 'readwrite');
            const store = transaction.objectStore(storeName);
            const countRequest = store.count();

            countRequest.onsuccess = () => {
                if (countRequest.result === 0) {
                    data.forEach(item => {
                        store.add(item);
                    });
                }
            };
            transaction.oncomplete = () => resolve();
            transaction.onerror = (e) => reject(e.target.error);
        });
    }

    function seedServices() { return seedData(SERVICES_STORE_NAME, [{ name: 'Venta Baños', price: 5, icon: 'restroom' }, { name: 'Venta Papel', price: 10, icon: 'toilet_paper' }]); }
    function seedVehicleTypes() { return seedData(VEHICLE_TYPES_STORE_NAME, [{ name: 'Carro', hourlyRate: 15 }, { name: 'Moto', hourlyRate: 10 }]); }

    async function seedUsers() {
        const hashedPassword = await hashPassword('admin');
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(USERS_STORE_NAME, 'readwrite');
            const store = transaction.objectStore(USERS_STORE_NAME);
            const countRequest = store.count();
            countRequest.onsuccess = () => {
                if (countRequest.result === 0) {
                    store.add({ name: 'admin', role: 'Administrador', password: hashedPassword });
                }
            };
            transaction.oncomplete = () => resolve();
            transaction.onerror = (e) => reject(e.target.error);
        });
    }
    // ======================== FIN: LÓGICA DE BASE DE DATOS ========================

    // =====================================================================
    // ======================= INICIO: LÓGICA DE TEMAS =======================
    // =====================================================================

    const themes = [
        { id: 'dorado', name: 'Dorado', colors: ['#D9A743', '#ffffff', '#f8fafc'] },
        { id: 'bosque', name: 'Bosque', colors: ['#22c55e', '#f0fdf4', '#dcfce7'] },
        { id: 'oceano', name: 'Océano', colors: ['#3b82f6', '#eff6ff', '#dbeafe'] },
        { id: 'atardecer', name: 'Atardecer', colors: ['#f97316', '#fff7ed', '#ffedd5'] },
        { id: 'nocturno', name: 'Nocturno', colors: ['#818cf8', '#1f2937', '#374151'] }
    ];

    function applyTheme(themeId) {
        document.documentElement.setAttribute('data-theme', themeId);
        localStorage.setItem('parkingTheme', themeId);
        document.querySelectorAll('.theme-btn').forEach(btn => {
            const isSelected = btn.dataset.theme === themeId;
            btn.classList.toggle('ring-2', isSelected);
            btn.classList.toggle('ring-offset-2', isSelected);
            btn.classList.toggle('ring-[var(--primary)]', isSelected);
        });
    }

    function loadTheme() {
        const savedTheme = localStorage.getItem('parkingTheme') || 'dorado';
        applyTheme(savedTheme);
    }

    function populateThemeSelector() {
        themeSelector.innerHTML = '';
        themes.forEach(theme => {
            const button = document.createElement('button');
            button.className = 'theme-btn p-1 rounded-md focus:outline-none';
            button.dataset.theme = theme.id;
            button.title = theme.name;
            button.innerHTML = `
                        <div class="flex justify-center items-center space-x-1 h-8 w-full rounded" style="background-color: ${theme.colors[1]}">
                            <span class="w-5 h-5 rounded-full" style="background-color: ${theme.colors[0]}"></span>
                            <span class="w-5 h-5 rounded-full" style="background-color: ${theme.colors[2]}"></span>
                        </div>
                    `;
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                applyTheme(theme.id);
                toggleThemePopover(false);
            });
            themeSelector.appendChild(button);
        });
        const currentTheme = localStorage.getItem('parkingTheme') || 'dorado';
        applyTheme(currentTheme);
    }

    function toggleThemePopover(show) {
        if (show) {
            themePopover.classList.remove('opacity-0', 'scale-95', 'pointer-events-none');
        } else {
            themePopover.classList.add('opacity-0', 'scale-95', 'pointer-events-none');
        }
    }

    // ======================== FIN: LÓGICA DE TEMAS ========================

    // =====================================================================
    // ======================= INICIO: LÓGICA DE SESIÓN Y CORTE DE CAJA =======================
    // =====================================================================

    function checkSession() {
        const userSession = sessionStorage.getItem('parkingUser');
        if (userSession) {
            currentUser = JSON.parse(userSession);
            showMainApp();
        } else {
            showLoginScreen();
        }
    }

    async function handleLogin(e) {
        e.preventDefault();
        const username = document.getElementById('login-username').value.trim();
        const password = document.getElementById('login-password').value;
        const hashedPassword = await hashPassword(password);

        const index = getObjectStore(USERS_STORE_NAME, 'readonly').index('name_idx');
        const request = index.get(username);

        request.onsuccess = () => {
            const user = request.result;
            if (user && user.password === hashedPassword) {
                currentUser = { name: user.name, role: user.role };
                sessionStorage.setItem('parkingUser', JSON.stringify(currentUser));
                showMainApp();
                loginForm.reset();
            } else {
                showToast('Usuario o contraseña incorrectos.', 'error');
            }
        };
        request.onerror = () => showToast('Error al intentar iniciar sesión.', 'error');
    }

    function performLogout() {
        currentUser = null;
        sessionStorage.removeItem('parkingUser');
        toggleModal(shiftReportModal, false);
        showLoginScreen();
    }

    function showLoginScreen() {
        loginScreen.classList.remove('opacity-0', 'pointer-events-none');
        mainApp.classList.add('hidden');
    }

    function showMainApp() {
        loginScreen.classList.add('opacity-0', 'pointer-events-none');
        mainApp.classList.remove('hidden');
        sessionUsername.textContent = currentUser.name;
        sessionRole.textContent = currentUser.role;
        updateDashboardCards();
        barcodeInput.focus();
    }

    // ======================== FIN: LÓGICA DE SESIÓN Y CORTE DE CAJA ========================

    // =====================================================================
    // ======================= INICIO: CARGA DE DATOS Y DASHBOARD =======================
    // =====================================================================
    function loadInitialData() {
        loadFabOptions();
        loadVehicleTypesFromDB();
        loadBusinessInfo();
        loadUsersFromDB();
        populateThemeSelector();
        populateSelect(serviceIconSelect, ICON_OPTIONS, 'id', 'name');
        const quickChargePref = localStorage.getItem('quickChargeMode') === 'true';
        quickChargeToggle.checked = quickChargePref;
    }

    function formatCurrency(value) {
        return value.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });
    }

    async function updateDashboardCards() {
        if (!db) return;

        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);

        const todayEnd = new Date();
        todayEnd.setHours(23, 59, 59, 999);

        // 1. Get Active Vehicles
        const activeVehiclesPromise = new Promise((resolve, reject) => {
            const index = getObjectStore(TICKET_STORE_NAME, 'readonly').index('status_idx');
            const request = index.count('active');
            request.onsuccess = () => resolve(request.result || 0);
            request.onerror = () => reject(request.error);
        });

        // 2. Get All Paid Tickets for today
        const paidTicketsPromise = new Promise((resolve, reject) => {
            const index = getObjectStore(TICKET_STORE_NAME, 'readonly').index('exit_time_idx');
            const range = IDBKeyRange.bound(todayStart, todayEnd);
            const request = index.getAll(range);
            request.onsuccess = () => resolve(request.result || []);
            request.onerror = () => reject(request.error);
        });

        // 3. Get All Sales for today
        const salesPromise = new Promise((resolve, reject) => {
            const index = getObjectStore(SALES_STORE_NAME, 'readonly').index('timestamp_idx');
            const range = IDBKeyRange.bound(todayStart, todayEnd);
            const request = index.getAll(range);
            request.onsuccess = () => resolve(request.result || []);
            request.onerror = () => reject(request.error);
        });

        // 4. Get All Expenses for today
        const expensesPromise = new Promise((resolve, reject) => {
            const index = getObjectStore(EXPENSES_STORE_NAME, 'readonly').index('date_idx');
            const todayStr = new Date().toISOString().split('T')[0];
            const request = index.getAll(todayStr);
            request.onsuccess = () => resolve(request.result || []);
            request.onerror = () => reject(request.error);
        });

        try {
            const [activeCount, paidTickets, sales, expenses] = await Promise.all([activeVehiclesPromise, paidTicketsPromise, salesPromise, expensesPromise]);

            let parkingRevenue = 0;
            let pensionRevenue = 0;
            paidTickets.forEach(ticket => {
                if (ticket.status === 'paid') {
                    if (ticket.type === 'hourly' || (ticket.type === 'overnight' && ticket.originalPensionCost)) {
                        parkingRevenue += ticket.cost;
                    } else if (ticket.type === 'pension' || ticket.type === 'overnight') {
                        pensionRevenue += ticket.cost;
                    }
                }
            });

            const servicesRevenue = sales.reduce((sum, sale) => sum + sale.price, 0);
            const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

            activeVehiclesCard.textContent = activeCount;
            parkingRevenueCard.textContent = formatCurrency(parkingRevenue);
            pensionRevenueCard.textContent = formatCurrency(pensionRevenue);
            servicesRevenueCard.textContent = formatCurrency(servicesRevenue);
            expensesCard.textContent = formatCurrency(totalExpenses);

        } catch (error) {
            console.error("Error updating dashboard cards:", error);
            showToast("Error al actualizar el panel de indicadores.", "error");
        }
    }


    function loadFabOptions() {
        const store = getObjectStore(SERVICES_STORE_NAME, 'readonly');
        store.getAll().onsuccess = (event) => {
            const services = event.target.result;
            fabOptionsContainer.innerHTML = '';

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

    function loadVehicleTypesFromDB() {
        getObjectStore(VEHICLE_TYPES_STORE_NAME, 'readonly').getAll().onsuccess = (event) => {
            vehicleTypesCache = event.target.result;
            populateSelect(vehicleTypeSelect, vehicleTypesCache.map(v => ({ id: v.id, name: v.name })));
            populateSelect(calcVehicleType, vehicleTypesCache.map(v => ({ id: v.id, name: v.name })));
            updateBrandSelect();
            displayVehicleTypesInSettings(vehicleTypesCache);
        };
    }

    function loadBusinessInfo() {
        getObjectStore(BUSINESS_INFO_STORE_NAME, 'readonly').get(1).onsuccess = (event) => {
            const info = event.target.result;
            if (info) {
                businessInfoCache = info;
                businessNameInput.value = info.name || '';
                businessAddressInput.value = info.address || '';
                businessPhoneInput.value = info.phone || '';
                businessHoursInput.value = info.hours || '';
                businessOvernightRateInput.value = info.overnightRate || '';
            }
        };
    }

    function loadUsersFromDB() {
        getObjectStore(USERS_STORE_NAME, 'readonly').getAll().onsuccess = (event) => {
            usersCache = event.target.result;
            displayUsersInSettings(usersCache);
        };
    }
    // ======================== FIN: CARGA DE DATOS Y DASHBOARD ========================

    // =====================================================================
    // ======================= INICIO: FUNCIONES DE UI GENERALES =======================
    // =====================================================================
    function showToast(message, type = 'info') {
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

    function createServiceButton(service) {
        const button = document.createElement('button');
        button.className = `fab-option bg-base-200 text-primary w-14 h-14 rounded-full flex items-center justify-center`;
        button.title = `${service.name} ($${service.price})`;
        button.innerHTML = ICONS[service.icon] || '';
        button.addEventListener('click', () => registerSale(service));
        return button;
    }

    function registerSale(service) {
        const saleData = {
            serviceName: service.name,
            price: service.price,
            timestamp: new Date(),
            user: currentUser.name
        };
        getObjectStore(SALES_STORE_NAME, 'readwrite').add(saleData).onsuccess = () => {
            showToast(`${service.name} registrada.`, 'success');
            updateDashboardCards();
        };
        fabContainer.classList.remove('active');
    }

    function resetUI() {
        barcodeInput.value = '';
        ticketInfoSection.classList.add('hidden');
        barcodeInput.focus();
        currentTicket = null;
    }
    function formatDateTime(date) { return date ? new Date(date).toLocaleString('es-MX', { dateStyle: 'short', timeStyle: 'short' }) : 'N/A'; }
    function formatDate(date) { return date ? new Date(date).toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'; }
    function formatInputDate(date) {
        if (!date) return '';
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
    function formatElapsedTime(ms) { if (ms < 0) ms = 0; const totalMinutes = Math.floor(ms / 60000); return `${Math.floor(totalMinutes / 60)}h ${totalMinutes % 60}m`; }

    function toggleModal(modal, show) {
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

    function showConfirmModal(message, onConfirm) {
        confirmModalMessage.innerHTML = message;
        confirmCallback = onConfirm;
        toggleModal(confirmModal, true);
    }

    function populateSelect(selectElement, items, valueKey = 'id', textKey = 'name') {
        selectElement.innerHTML = '';
        items.forEach(item => {
            const option = document.createElement('option');
            option.value = item[valueKey];
            option.textContent = item[textKey];
            selectElement.appendChild(option);
        });
    }
    // ======================== FIN: FUNCIONES DE UI GENERALES ========================

    // =====================================================================
    // ======================= INICIO: LÓGICA DE GASTOS (EXPENSES) =======================
    // =====================================================================

    function displayExpenses() {
        const today = new Date().toISOString().split('T')[0];
        const range = IDBKeyRange.only(today);
        const index = getObjectStore(EXPENSES_STORE_NAME, 'readonly').index('date_idx');

        let total = 0;
        expensesListContainer.innerHTML = '';

        index.openCursor(range).onsuccess = (event) => {
            const cursor = event.target.result;
            if (cursor) {
                const expense = cursor.value;
                total += expense.amount;
                const div = document.createElement('div');
                div.className = 'flex items-center justify-between bg-base-200 p-3 rounded-lg border border-theme';
                div.innerHTML = `
                            <div>
                                <p class="font-medium text-base-content">${expense.description}</p>
                                <p class="text-sm text-base-content-secondary">$${expense.amount.toFixed(2)} (Registrado por: ${expense.user})</p>
                            </div>
                            <div class="space-x-2">
                                <button class="edit-expense-btn text-primary hover:text-primary-focus text-sm font-medium" data-id="${expense.id}">Editar</button>
                                <button class="delete-expense-btn text-red-600 hover:text-red-800 text-sm font-medium" data-id="${expense.id}">Eliminar</button>
                            </div>
                        `;
                expensesListContainer.appendChild(div);
                cursor.continue();
            } else {
                if (expensesListContainer.innerHTML === '') {
                    expensesListContainer.innerHTML = '<p class="text-base-content-secondary text-sm text-center">No hay gastos registrados hoy.</p>';
                }
                expensesTotal.textContent = `$${total.toFixed(2)}`;
            }
        };
    }

    function handleSaveExpense(e) {
        e.preventDefault();
        const id = parseInt(expenseIdInput.value);
        const expenseData = {
            description: expenseDescriptionInput.value.trim(),
            amount: parseFloat(expenseAmountInput.value),
            date: new Date().toISOString().split('T')[0],
            user: currentUser.name
        };

        const store = getObjectStore(EXPENSES_STORE_NAME, 'readwrite');
        const request = id ? store.put({ ...expenseData, id }) : store.add(expenseData);

        request.onsuccess = () => {
            showToast(`Gasto ${id ? 'actualizado' : 'guardado'} con éxito.`, 'success');
            resetExpenseForm();
            displayExpenses();
            updateDashboardCards();
        };
        request.onerror = () => showToast('Error al guardar el gasto.', 'error');
    }

    function handleEditExpense(id) {
        getObjectStore(EXPENSES_STORE_NAME, 'readonly').get(id).onsuccess = (event) => {
            const expense = event.target.result;
            expenseIdInput.value = expense.id;
            expenseDescriptionInput.value = expense.description;
            expenseAmountInput.value = expense.amount;
            saveExpenseBtn.textContent = 'Actualizar Gasto';
            cancelExpenseEditBtn.classList.remove('hidden');
        };
    }

    function handleDeleteExpense(id) {
        showConfirmModal('¿Está seguro de que desea eliminar este gasto?', () => {
            getObjectStore(EXPENSES_STORE_NAME, 'readwrite').delete(id).onsuccess = () => {
                showToast('Gasto eliminado.', 'success');
                resetExpenseForm();
                displayExpenses();
                updateDashboardCards();
            };
        });
    }

    function resetExpenseForm() {
        expenseForm.reset();
        expenseIdInput.value = '';
        saveExpenseBtn.textContent = 'Guardar Gasto';
        cancelExpenseEditBtn.classList.add('hidden');
    }

    // ======================== FIN: LÓGICA DE GASTOS (EXPENSES) ========================


    // =====================================================================
    // ======================= INICIO: LÓGICA DE ENTRADA DE VEHÍCULOS =======================
    // =====================================================================
    function setEntryType(type) {
        currentEntryType = type;
        const buttons = [typeHourlyBtn, typeOvernightBtn, typePensionBtn];
        buttons.forEach(btn => {
            const btnType = btn.id.split('-')[1];
            const isActive = btnType === type;
            btn.classList.toggle('bg-primary', isActive);
            btn.classList.toggle('text-primary-content', isActive);
            btn.classList.toggle('text-base-content-secondary', !isActive);
        });

        const isPaidStay = type === 'pension' || type === 'overnight';
        pensionFields.classList.toggle('show', isPaidStay);
        newPensionAmount.required = isPaidStay;
        newPensionAmount.readOnly = type === 'overnight';
        newPensionAmount.value = type === 'overnight' ? (businessInfoCache.overnightRate || '') : '';


        const isLongTermPension = type === 'pension';
        pensionTypeContainer.style.display = isLongTermPension ? 'block' : 'none';
        pensionEndDateContainer.style.display = isLongTermPension ? 'block' : 'none';
        newPensionTypeInput.required = isLongTermPension;
        newPensionEndDate.required = isLongTermPension;
    }

    function updateBrandSelect() {
        if (vehicleTypesCache.length === 0) return;
        const selectedTypeId = parseInt(vehicleTypeSelect.value);
        const selectedType = vehicleTypesCache.find(v => v.id === selectedTypeId);
        populateSelect(newBrandSelect, selectedType && BRANDS[selectedType.name] ? BRANDS[selectedType.name].map(name => ({ id: name, name })) : [{ id: 'Otro', name: 'Otro' }], 'id', 'name');
    }

    function populateColorSuggestions() {
        colorSuggestions.innerHTML = '';
        COLORS.forEach(color => colorSuggestions.appendChild(Object.assign(document.createElement('option'), { value: color })));
    }

    async function findPreviousEntryByPlate() {
        const plate = newPlateInput.value.trim().toUpperCase();
        plateLookupMsg.textContent = '';
        if (!plate) return;
        const index = getObjectStore(TICKET_STORE_NAME, 'readonly').index('plate_idx');
        const request = index.getAll(plate);
        request.onsuccess = () => {
            if (request.result && request.result.length > 0) {
                const lastEntry = request.result.sort((a, b) => new Date(b.entryTime) - new Date(a.entryTime))[0];
                vehicleTypeSelect.value = lastEntry.vehicleTypeId;
                updateBrandSelect();
                setTimeout(() => {
                    newBrandSelect.value = lastEntry.brand;
                    newColorInput.value = lastEntry.color;
                    if (lastEntry.type === 'pension') {
                        newPensionTypeInput.value = lastEntry.pensionTypeName || '';
                        newPensionEndDate.value = formatInputDate(lastEntry.pensionEndDate);
                    }
                }, 50);
                plateLookupMsg.textContent = 'Datos rellenados';
                plateLookupMsg.className = 'absolute right-2 top-1/2 -translate-y-1/2 text-xs font-semibold text-green-600';
                setTimeout(() => plateLookupMsg.textContent = '', 2500);
            }
        };
    }

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

    function resetNewEntryForm() {
        newEntryForm.reset();
        setEntryType('hourly');
    }

    async function registerEntry(e) {
        e.preventDefault();
        try {
            const newBarcode = await generateNewTicketId(currentEntryType);
            const selectedVehicleType = vehicleTypesCache.find(v => v.id === parseInt(vehicleTypeSelect.value));
            const newTicket = {
                barcode: newBarcode,
                plate: newPlateInput.value.trim().toUpperCase(),
                entryTime: new Date(),
                status: 'active',
                type: currentEntryType,
                vehicleTypeId: selectedVehicleType.id,
                vehicleTypeName: selectedVehicleType.name,
                brand: newBrandSelect.value,
                color: newColorInput.value,
                userEntry: currentUser.name
            };

            if (currentEntryType === 'pension' || currentEntryType === 'overnight') {
                newTicket.cost = parseFloat(newPensionAmount.value);
                newTicket.status = 'paid'; // Paid upfront
                newTicket.exitTime = new Date(); // Mark as a transaction for today's report
                newTicket.userPayment = currentUser.name;
                if (currentEntryType === 'pension') {
                    newTicket.pensionTypeName = newPensionTypeInput.value.trim();
                    newTicket.pensionEndDate = new Date(newPensionEndDate.value + 'T23:59:59');
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
                showToast(`Entrada registrada: ${newBarcode}`, 'success');
                toggleModal(newEntryModal, false);
                resetUI();
                resetNewEntryForm();
                updateDashboardCards();
            };
        } catch (error) { showToast('Error al registrar la entrada.', 'error'); console.error(error); }
    }
    // ======================== FIN: LÓGICA DE ENTRADA DE VEHÍCULOS ========================

    // =====================================================================
    // ======================= INICIO: LÓGICA DE TICKETS Y COBRO =======================
    // =====================================================================
    function findTicket(barcode) {
        if (!db || !barcode) {
            ticketInfoSection.classList.add('hidden');
            return;
        }
        getObjectStore(TICKET_STORE_NAME, 'readonly').get(barcode).onsuccess = (event) => {
            const ticket = event.target.result;
            if (ticket) {
                currentTicket = ticket;
                if (quickChargeToggle.checked && ticket.status === 'active' && ticket.type === 'hourly') {
                    markTicketAsPaid();
                } else {
                    displayTicketInfo(ticket);
                    ticketInfoSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            } else {
                showToast('Ticket no encontrado.', 'error');
                ticketInfoSection.classList.add('hidden');
            }
        };
    }

    function displayTicketInfo(ticket) {
        ticketInfoSection.classList.remove('hidden');
        cancelPensionBtn.classList.add('hidden');
        convertToOvernightBtn.classList.add('hidden');
        cancelTicketBtn.classList.add('hidden');

        if (ticket.type === 'pension' || (ticket.type === 'overnight' && !ticket.originalPensionCost)) {
            hourlyDetails.classList.add('hidden');
            pensionDetails.classList.remove('hidden');
            vehiclePlatePension.textContent = ticket.plate;
            vehicleTypePension.textContent = ticket.vehicleTypeName;
            vehicleBrandPension.textContent = ticket.brand;
            vehicleColorPension.textContent = ticket.color;
            pensionTypeDetails.textContent = ticket.pensionTypeName;

            const today = new Date().setHours(0, 0, 0, 0);
            const endDate = new Date(ticket.pensionEndDate).setHours(0, 0, 0, 0);
            ticketStatusBanner.textContent = today > endDate ? 'Pensión Vencida' : 'Pensión Vigente';
            ticketStatusBanner.className = `p-3 rounded-lg mb-4 text-center font-bold ${today > endDate ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`;
            ticketStatusBanner.classList.remove('hidden');

            if (ticket.type === 'overnight') {
                const expirationDate = new Date(ticket.pensionEndDate);
                const expirationDayOfWeek = expirationDate.getDay();
                const openingTimeStr = horarios[expirationDayOfWeek].apertura;
                const exactExpirationTime = parseTime(expirationDate, openingTimeStr);
                exactExpirationTime.setMinutes(exactExpirationTime.getMinutes() + 30);
                endDatePension.textContent = formatDateTime(exactExpirationTime);
                cancelPensionBtn.classList.remove('hidden');
            } else {
                endDatePension.textContent = formatDate(ticket.pensionEndDate);
            }
        } else {
            pensionDetails.classList.add('hidden');
            hourlyDetails.classList.remove('hidden');
            vehiclePlateHourly.textContent = ticket.plate;
            vehicleTypeHourly.textContent = ticket.vehicleTypeName;
            vehicleBrandHourly.textContent = ticket.brand;
            vehicleColorHourly.textContent = ticket.color;
            entryTimeHourly.textContent = formatDateTime(ticket.entryTime);
            if (ticket.status === 'paid') {
                timeElapsedHourly.textContent = formatElapsedTime(new Date(ticket.exitTime).getTime() - new Date(ticket.entryTime).getTime());
                exitTimeHourly.textContent = formatDateTime(ticket.exitTime);
                totalCostHourly.textContent = formatCurrency(ticket.cost);
                chargeButton.classList.add('hidden');
                ticketStatusBanner.textContent = `Pagado por ${ticket.userPayment || 'N/A'}.`;
                ticketStatusBanner.className = 'p-3 rounded-lg mb-4 text-center font-bold bg-amber-100 text-amber-800';
                ticketStatusBanner.classList.remove('hidden');
            } else if (ticket.status === 'cancelled') {
                timeElapsedHourly.textContent = '-';
                exitTimeHourly.textContent = '-';
                totalCostHourly.textContent = formatCurrency(0);
                chargeButton.classList.add('hidden');
                ticketStatusBanner.textContent = `CANCELADO por ${ticket.userCancel || 'N/A'}`;
                ticketStatusBanner.className = 'p-3 rounded-lg mb-4 text-center font-bold bg-red-100 text-red-800';
                ticketStatusBanner.classList.remove('hidden');
            } else { // Active
                timeElapsedHourly.textContent = formatElapsedTime(new Date().getTime() - new Date(ticket.entryTime).getTime());
                exitTimeHourly.textContent = 'Aún en estacionamiento';
                const vehicleType = vehicleTypesCache.find(v => v.id === ticket.vehicleTypeId);
                const { totalCost } = calculateStayCost(new Date(ticket.entryTime), new Date(), vehicleType, businessInfoCache, horarios);
                totalCostHourly.textContent = formatCurrency(totalCost);
                chargeButton.classList.remove('hidden');
                convertToOvernightBtn.classList.remove('hidden');
                cancelTicketBtn.classList.remove('hidden');
                ticketStatusBanner.classList.add('hidden');
            }
        }
    }

    function showQuickChargeModal(ticket, totalCost) {
        document.getElementById('quick-charge-amount').textContent = formatCurrency(totalCost);
        document.getElementById('quick-charge-ticket-id').textContent = ticket.barcode;
        document.getElementById('quick-charge-plate').textContent = ticket.plate;
        document.getElementById('quick-charge-time').textContent = formatElapsedTime(new Date(ticket.exitTime) - new Date(ticket.entryTime));
        toggleModal(quickChargeModal, true);

        setTimeout(() => {
            toggleModal(quickChargeModal, false);
            resetUI();
        }, 4000); // El modal se oculta después de 4 segundos
    }

    async function markTicketAsPaid() {
        if (!db || !currentTicket || currentTicket.status !== 'active') return;
        try {
            const vehicleType = vehicleTypesCache.find(v => v.id === currentTicket.vehicleTypeId);
            if (!vehicleType) throw new Error("Vehicle type not found.");

            const { totalCost } = calculateStayCost(new Date(currentTicket.entryTime), new Date(), vehicleType, businessInfoCache, horarios);

            const updatedTicket = { ...currentTicket, exitTime: new Date(), status: 'paid', cost: totalCost, userPayment: currentUser.name };

            getObjectStore(TICKET_STORE_NAME, 'readwrite').put(updatedTicket).onsuccess = () => {
                currentTicket = updatedTicket;
                if (quickChargeToggle.checked) {
                    showQuickChargeModal(updatedTicket, totalCost);
                } else {
                    showToast(`Ticket ${updatedTicket.barcode} cobrado: ${formatCurrency(totalCost)}`, 'success');
                    displayTicketInfo(updatedTicket);
                    setTimeout(() => { resetUI(); }, 4000);
                }
                updateDashboardCards();
            };
        } catch (error) { showToast('Error al procesar el pago.', 'error'); console.error(error); }
    }

    async function handleConvertToOvernight() {
        if (!currentTicket || currentTicket.type !== 'hourly' || currentTicket.status !== 'active') return;

        const vehicleType = vehicleTypesCache.find(v => v.id === currentTicket.vehicleTypeId);
        if (!vehicleType) { showToast('Error: Tipo de vehículo no encontrado.', 'error'); return; }
        if (!businessInfoCache.overnightRate) { showToast('Por favor, configure la "Tarifa Nocturna" en los ajustes del negocio.', 'error'); return; }

        const { totalCost: hourlyCost } = calculateStayCost(new Date(currentTicket.entryTime), new Date(), vehicleType, businessInfoCache, horarios);
        const overnightRate = parseFloat(businessInfoCache.overnightRate);
        const totalToPayNow = hourlyCost + overnightRate;

        const message = `<div class="text-left space-y-2"><p class="flex justify-between"><span>Cargo por horas ya usadas:</span> <span class="font-semibold">${formatCurrency(hourlyCost)}</span></p><p class="flex justify-between"><span>+ Tarifa de Pensión Nocturna:</span> <span class="font-semibold">${formatCurrency(overnightRate)}</span></p><hr><p class="flex justify-between text-lg"><strong>Total a Pagar AHORA:</strong> <strong class="text-green-600">${formatCurrency(totalToPayNow)}</strong></p></div>`;

        showConfirmModal(message, () => {
            const nextDay = new Date();
            nextDay.setDate(nextDay.getDate() + 1);
            const updatedTicket = { ...currentTicket, status: 'paid', cost: totalToPayNow, type: 'overnight', pensionTypeName: 'Pensión Nocturna', pensionEndDate: nextDay, exitTime: new Date(), userPayment: currentUser.name };
            getObjectStore(TICKET_STORE_NAME, 'readwrite').put(updatedTicket).onsuccess = () => {
                showToast('Se cambió a Pensión Nocturna exitosamente.', 'success');
                currentTicket = updatedTicket;
                displayTicketInfo(updatedTicket);
                updateDashboardCards();
                setTimeout(() => { resetUI(); }, 4000);
            };
        });
    }

    async function handleCancelPension() {
        if (!currentTicket || currentTicket.type !== 'overnight') return;

        const vehicleType = vehicleTypesCache.find(v => v.id === currentTicket.vehicleTypeId);
        if (!vehicleType) { showToast('Error: Tipo de vehículo no encontrado.', 'error'); return; }

        const { totalCost: hourlyCost } = calculateStayCost(new Date(currentTicket.entryTime), new Date(), vehicleType, businessInfoCache, horarios);
        const pensionPaid = currentTicket.cost || 0;
        const refund = pensionPaid - hourlyCost;

        const message = `<div class="text-left space-y-2"><p class="flex justify-between"><span>Monto Pagado:</span> <span class="font-semibold">${formatCurrency(pensionPaid)}</span></p><p class="flex justify-between"><span>Cargo por Horas Usadas:</span> <span class="font-semibold">-${formatCurrency(hourlyCost)}</span></p><hr><p class="flex justify-between text-lg"><strong>Reembolso al Cliente:</strong> <strong class="text-green-600">${formatCurrency(refund)}</strong></p></div>`;

        showConfirmModal(message, () => {
            const updatedTicket = { ...currentTicket, exitTime: new Date(), status: 'paid', cost: hourlyCost, type: 'hourly', originalPensionCost: pensionPaid, userPayment: currentUser.name };
            getObjectStore(TICKET_STORE_NAME, 'readwrite').put(updatedTicket).onsuccess = () => {
                showToast('Pensión cancelada y cobro por horas registrado.', 'success');
                currentTicket = updatedTicket;
                displayTicketInfo(updatedTicket);
                updateDashboardCards();
                setTimeout(() => { resetUI(); }, 4000);
            };
        });
    }

    async function handleCancelTicket() {
        if (!currentTicket || currentTicket.status !== 'active') return;

        showConfirmModal('¿Está seguro de que desea cancelar este ticket? Esta acción no se puede deshacer.', () => {
            const updatedTicket = { ...currentTicket, exitTime: new Date(), status: 'cancelled', cost: 0, userCancel: currentUser.name };
            getObjectStore(TICKET_STORE_NAME, 'readwrite').put(updatedTicket).onsuccess = () => {
                showToast('Ticket cancelado con éxito.', 'success');
                currentTicket = updatedTicket;
                displayTicketInfo(updatedTicket);
                updateDashboardCards();
                setTimeout(() => { resetUI(); }, 4000);
            };
        });
    }
    // ======================== FIN: LÓGICA DE TICKETS Y COBRO ========================

    // =====================================================================
    // ======================= INICIO: LÓGICA DE CORTE DE CAJA E IMPRESIÓN =======================
    // =====================================================================

    async function generateAndShowShiftReport() {
        if (!currentUser) return;

        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        const todayEnd = new Date(); // now

        // 1. Get Paid Tickets by current user for today
        const ticketsPromise = new Promise((resolve, reject) => {
            const index = getObjectStore(TICKET_STORE_NAME, 'readonly').index('user_payment_idx');
            const request = index.getAll(currentUser.name);
            request.onsuccess = () => {
                const userTickets = request.result || [];
                const todaysTickets = userTickets.filter(t => {
                    const exitTime = new Date(t.exitTime);
                    return exitTime >= todayStart && exitTime <= todayEnd;
                });
                resolve(todaysTickets);
            };
            request.onerror = () => reject(request.error);
        });

        // 2. Get Sales by current user for today
        const salesPromise = new Promise((resolve, reject) => {
            const index = getObjectStore(SALES_STORE_NAME, 'readonly').index('user_idx');
            const request = index.getAll(currentUser.name);
            request.onsuccess = () => {
                const userSales = request.result || [];
                const todaysSales = userSales.filter(s => {
                    const saleTime = new Date(s.timestamp);
                    return saleTime >= todayStart && saleTime <= todayEnd;
                });
                resolve(todaysSales);
            };
            request.onerror = () => reject(request.error);
        });

        // 3. Get Expenses by current user for today
        const expensesPromise = new Promise((resolve, reject) => {
            const index = getObjectStore(EXPENSES_STORE_NAME, 'readonly').index('user_idx');
            const request = index.getAll(currentUser.name);
            request.onsuccess = () => {
                const userExpenses = request.result || [];
                const todayStr = new Date().toISOString().split('T')[0];
                const todaysExpenses = userExpenses.filter(e => e.date === todayStr);
                resolve(todaysExpenses);
            };
            request.onerror = () => reject(request.error);
        });

        try {
            const [tickets, sales, expenses] = await Promise.all([ticketsPromise, salesPromise, expensesPromise]);

            let parkingRevenue = 0;
            let pensionRevenue = 0;
            tickets.forEach(ticket => {
                if (ticket.status === 'paid') {
                    if (ticket.type === 'hourly' || (ticket.type === 'overnight' && ticket.originalPensionCost)) {
                        parkingRevenue += ticket.cost;
                    } else if (ticket.type === 'pension' || ticket.type === 'overnight') {
                        pensionRevenue += ticket.cost;
                    }
                }
            });

            const servicesRevenue = sales.reduce((sum, sale) => sum + sale.price, 0);
            const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
            const totalRevenue = parkingRevenue + pensionRevenue + servicesRevenue;
            const netTotal = totalRevenue - totalExpenses;

            shiftReportData = {
                parking: { count: tickets.filter(t => t.type === 'hourly').length, total: parkingRevenue },
                pensions: { count: tickets.filter(t => t.type !== 'hourly').length, total: pensionRevenue },
                services: { count: sales.length, total: servicesRevenue },
                expenses: { count: expenses.length, total: totalExpenses },
                totalRevenue,
                netTotal
            };

            // Display in Modal
            shiftReportUserInfo.textContent = `Reporte para ${currentUser.name} - ${new Date().toLocaleDateString('es-MX')}`;
            shiftReportContent.innerHTML = `
                <div class="space-y-3">
                    <h3 class="font-bold text-lg border-b border-theme pb-2">Resumen de Ingresos</h3>
                    <div class="flex justify-between"><span>Estacionamiento por Hora:</span> <span class="font-medium">${formatCurrency(shiftReportData.parking.total)}</span></div>
                    <div class="flex justify-between"><span>Pensiones y Pagos Únicos:</span> <span class="font-medium">${formatCurrency(shiftReportData.pensions.total)}</span></div>
                    <div class="flex justify-between"><span>Servicios Adicionales:</span> <span class="font-medium">${formatCurrency(shiftReportData.services.total)}</span></div>
                    <div class="flex justify-between font-bold text-base-content pt-2 border-t border-dashed border-theme"><span>Total Ingresos:</span> <span>${formatCurrency(totalRevenue)}</span></div>
                </div>
                <div class="space-y-3 mt-4">
                    <h3 class="font-bold text-lg border-b border-theme pb-2">Resumen de Gastos</h3>
                    <div class="flex justify-between"><span>Total de Gastos Registrados:</span> <span class="font-medium">${formatCurrency(totalExpenses)}</span></div>
                </div>
                <div class="mt-6 pt-4 border-t-2 border-theme">
                    <div class="flex justify-between text-xl font-extrabold">
                        <span>TOTAL EN CAJA:</span>
                        <span>${formatCurrency(netTotal)}</span>
                    </div>
                </div>
            `;
            toggleModal(shiftReportModal, true);

        } catch (error) {
            console.error("Error generating shift report:", error);
            showToast("Error al generar el corte de caja.", "error");
        }
    }

    function printShiftReportWithQZ() {
        if (!shiftReportData) {
            showToast("No hay datos de reporte para imprimir.", "error");
            return;
        }

        // Conectar a QZ Tray
        if (!qz.websocket.isActive()) {
            qz.websocket.connect().then(() => {
                showToast("Conectado a QZ Tray.", "info");
                findAndPrint();
            }).catch(err => {
                console.error(err);
                showToast("Error al conectar con QZ Tray. Asegúrate que está corriendo.", "error");
            });
        } else {
            findAndPrint();
        }

        function findAndPrint() {
            // Busca la impresora. Puedes cambiar 'EPSON' por el nombre de tu impresora, o dejarlo null para usar la predeterminada.
            qz.printers.find().then(printer => {
                const config = qz.configs.create(printer);

                // Comandos ESC/POS para el recibo
                const data = [
                    '\x1B' + '\x40', // Inicializar impresora
                    '\x1B' + '\x61' + '\x01', // Centrar
                    '\x1B' + '\x21' + '\x20', // Doble altura
                    businessInfoCache.name || 'Estacionamiento',
                    '\x0A',
                    '\x1B' + '\x21' + '\x00', // Texto normal
                    businessInfoCache.address || '',
                    '\x0A',
                    businessInfoCache.phone || '',
                    '\x0A',
                    '\x1B' + '\x61' + '\x00', // Alinear a la izquierda
                    '--------------------------------\x0A',
                    `Corte para: ${currentUser.name}\x0A`,
                    `Fecha: ${new Date().toLocaleString('es-MX')}\x0A`,
                    '--------------------------------\x0A',
                    '\x1B' + '\x21' + '\x08', // Negrita
                    'INGRESOS\x0A',
                    '\x1B' + '\x21' + '\x00', // Normal
                    `Estacionamiento: ${formatCurrency(shiftReportData.parking.total)}\x0A`,
                    `Pensiones:       ${formatCurrency(shiftReportData.pensions.total)}\x0A`,
                    `Servicios:       ${formatCurrency(shiftReportData.services.total)}\x0A`,
                    '--------------------------------\x0A',
                    '\x1B' + '\x21' + '\x08', // Negrita
                    `TOTAL INGRESOS:  ${formatCurrency(shiftReportData.totalRevenue)}\x0A`,
                    '\x1B' + '\x21' + '\x00', // Normal
                    '\x0A',
                    '\x1B' + '\x21' + '\x08', // Negrita
                    'GASTOS\x0A',
                    '\x1B' + '\x21' + '\x00', // Normal
                    `Total Gastos:    ${formatCurrency(shiftReportData.expenses.total)}\x0A`,
                    '--------------------------------\x0A',
                    '\x0A',
                    '\x1B' + '\x21' + '\x10', // Doble ancho
                    `TOTAL EN CAJA:   ${formatCurrency(shiftReportData.netTotal)}\x0A`,
                    '\x0A',
                    '\x0A',
                    '\x0A',
                    '\x0A',
                    '\x1D' + '\x56' + '\x42' + '\x00' // Cortar papel
                ];

                qz.print(config, data).then(() => {
                    showToast("Reporte enviado a la impresora.", "success");
                }).catch(err => {
                    console.error(err);
                    showToast("Error al imprimir.", "error");
                });
            }).catch(err => {
                console.error(err);
                showToast("No se encontró la impresora.", "error");
            });
        }
    }


    // ======================== FIN: LÓGICA DE CORTE DE CAJA E IMPRESIÓN ========================


    // =====================================================================
    // ======================= INICIO: LÓGICA DE LA CALCULADORA =======================
    // =====================================================================

    const parseTime = (date, timeStr) => {
        const [hours, minutes] = timeStr.split(':').map(Number);
        const newDate = new Date(date);
        newDate.setHours(hours, minutes, 0, 0);
        return newDate;
    };

    function calculateHourlyCost(start, end, hourlyRate) {
        const diffMs = end.getTime() - start.getTime();
        if (diffMs <= 0) return { billableHours: 0, cost: 0, totalMinutes: 0 };

        const totalMinutes = Math.ceil(diffMs / 60000);
        let billableHours = 0;

        if (totalMinutes > 0) {
            const firstHourMinutes = Math.min(totalMinutes, 60);
            if (firstHourMinutes > 3) { billableHours = 1; }

            let remainingMinutes = totalMinutes - firstHourMinutes;
            while (remainingMinutes > 0) {
                const currentHourMinutes = Math.min(remainingMinutes, 60);
                if (currentHourMinutes > 10) { billableHours++; }
                remainingMinutes -= currentHourMinutes;
            }
        }

        return { billableHours, cost: billableHours * hourlyRate, totalMinutes };
    }

    function calculateStayCost(entry, exit, vehicleType, businessInfo, schedule) {
        let totalCost = 0;
        const breakdown = [];
        let currentTime = new Date(entry);

        const overnightRate = parseFloat(businessInfo.overnightRate) || 0;
        const firstDaySchedule = schedule[currentTime.getDay()];
        const firstDayOpeningTime = parseTime(currentTime, firstDaySchedule.apertura);
        if (currentTime < firstDayOpeningTime) { currentTime = firstDayOpeningTime; }

        while (currentTime < exit) {
            const dayOfWeek = currentTime.getDay();
            const daySchedule = schedule[dayOfWeek];
            const closingTime = parseTime(currentTime, daySchedule.cierre);
            const overnightEntryStart = new Date(closingTime.getTime() - 30 * 60000);
            const nextDay = new Date(currentTime);
            nextDay.setDate(nextDay.getDate() + 1);
            nextDay.setHours(0, 0, 0, 0);
            const nextDaySchedule = schedule[nextDay.getDay()];
            const nextDayOpeningTime = parseTime(nextDay, nextDaySchedule.apertura);
            const nextDayExitToleranceEnd = new Date(nextDayOpeningTime.getTime() + 30 * 60000);

            if (exit < nextDayOpeningTime) {
                const hoursResult = calculateHourlyCost(currentTime, exit, vehicleType.hourlyRate);
                if (hoursResult.cost > 0) {
                    breakdown.push({ description: `Estacionamiento (${formatDate(currentTime)})`, details: `Tiempo: ${formatElapsedTime(hoursResult.totalMinutes * 60000)} (${hoursResult.billableHours}h facturadas)`, cost: hoursResult.cost });
                    totalCost += hoursResult.cost;
                }
                currentTime = exit;
            } else {
                if (currentTime < overnightEntryStart) {
                    const hoursResult = calculateHourlyCost(currentTime, overnightEntryStart, vehicleType.hourlyRate);
                    if (hoursResult.cost > 0) {
                        breakdown.push({ description: `Estacionamiento (${formatDate(currentTime)})`, details: `Tiempo: ${formatElapsedTime(hoursResult.totalMinutes * 60000)} (${hoursResult.billableHours}h facturadas)`, cost: hoursResult.cost });
                        totalCost += hoursResult.cost;
                    }
                }
                breakdown.push({ description: `Pensión Nocturna (${formatDate(currentTime)})`, details: `1 Noche`, cost: overnightRate });
                totalCost += overnightRate;
                currentTime = new Date(nextDayExitToleranceEnd);
            }
        }
        return { totalCost, breakdown };
    }

    function handleCalculation(e) {
        e.preventDefault();
        const entry = new Date(calcEntryTime.value);
        const exit = new Date(calcExitTime.value);

        if (!calcEntryTime.value || !calcExitTime.value || entry >= exit) { showToast('Ingrese una fecha de salida posterior a la de entrada.', 'error'); return; }
        const selectedVehicleType = vehicleTypesCache.find(v => v.id === parseInt(calcVehicleType.value));
        if (!selectedVehicleType) { showToast('Seleccione un tipo de vehículo válido.', 'error'); return; }
        if (!businessInfoCache.overnightRate) { showToast('Por favor, configure la "Tarifa Nocturna" en los ajustes del negocio.', 'error'); return; }

        const { totalCost, breakdown } = calculateStayCost(entry, exit, selectedVehicleType, businessInfoCache, horarios);

        calcBreakdown.innerHTML = '';
        if (breakdown.length > 0) {
            breakdown.forEach(item => {
                const div = document.createElement('div');
                div.className = 'bg-base-100 p-3 rounded-lg border border-theme';
                div.innerHTML = `<div class="flex justify-between items-center"><div><p class="font-semibold text-base-content">${item.description}</p><p class="text-xs text-base-content-secondary">${item.details}</p></div><p class="font-bold text-base-content">${formatCurrency(item.cost)}</p></div>`;
                calcBreakdown.appendChild(div);
            });
        } else {
            calcBreakdown.innerHTML = '<p class="text-base-content-secondary text-center">Sin cargos por la estancia.</p>';
        }
        calcTotalCost.textContent = formatCurrency(totalCost);
        calculatorResults.classList.remove('hidden');
    }
    // ======================== FIN: LÓGICA DE LA CALCULADORA ========================

    // =====================================================================
    // ======================= INICIO: LÓGICA DEL MODAL DE CONFIGURACIÓN =======================
    // =====================================================================

    function switchTab(tabName) {
        document.querySelectorAll('.tab-content').forEach(tc => tc.classList.remove('active'));
        document.querySelectorAll('.tab-button').forEach(tb => tb.classList.remove('active'));
        document.getElementById(`tab-content-${tabName}`).classList.add('active');
        document.querySelector(`.tab-button[data-tab="${tabName}"]`).classList.add('active');
    }

    function handleSaveBusinessInfo(e) {
        e.preventDefault();
        const businessData = { id: 1, name: businessNameInput.value, address: businessAddressInput.value, phone: businessPhoneInput.value, hours: businessHoursInput.value, overnightRate: parseFloat(businessOvernightRateInput.value) || 0 };
        getObjectStore(BUSINESS_INFO_STORE_NAME, 'readwrite').put(businessData).onsuccess = () => {
            showToast('Información del negocio guardada con éxito.', 'success');
            businessInfoCache = businessData;
        };
    }

    function displayServicesInSettings(services) {
        servicesListContainer.innerHTML = '';
        if (services.length === 0) { servicesListContainer.innerHTML = '<p class="text-base-content-secondary text-sm">No hay servicios registrados.</p>'; return; }
        services.forEach(service => {
            const div = document.createElement('div');
            div.className = 'flex items-center justify-between bg-base-200 p-3 rounded-lg border border-theme';
            div.innerHTML = `<div class="flex items-center gap-3"><span class="w-8 h-8 rounded-full flex items-center justify-center bg-primary/20 text-primary">${ICONS[service.icon]}</span><div><p class="font-medium text-base-content">${service.name}</p><p class="text-sm text-base-content-secondary">${formatCurrency(service.price)}</p></div></div><div class="space-x-2"><button class="edit-service-btn text-primary hover:text-primary-focus text-sm font-medium" data-id="${service.id}">Editar</button><button class="delete-service-btn text-red-600 hover:text-red-800 text-sm font-medium" data-id="${service.id}">Eliminar</button></div>`;
            servicesListContainer.appendChild(div);
        });
    }

    function handleSaveService(e) {
        e.preventDefault();
        const id = parseInt(serviceIdInput.value);
        const serviceData = { name: serviceNameInput.value, price: parseFloat(servicePriceInput.value), icon: serviceIconSelect.value };
        const store = getObjectStore(SERVICES_STORE_NAME, 'readwrite');
        const request = id ? store.put({ ...serviceData, id }) : store.add(serviceData);
        request.onsuccess = () => {
            showToast(`Servicio ${id ? 'actualizado' : 'guardado'} con éxito.`, 'success');
            resetServiceForm();
            loadFabOptions();
        };
        request.onerror = () => showToast('Error al guardar el servicio.', 'error');
    }

    function handleEditService(id) {
        getObjectStore(SERVICES_STORE_NAME, 'readonly').get(id).onsuccess = (event) => {
            const service = event.target.result;
            serviceIdInput.value = service.id;
            serviceNameInput.value = service.name;
            servicePriceInput.value = service.price;
            serviceIconSelect.value = service.icon;
            serviceFormTitle.textContent = 'Editar Servicio';
            saveServiceBtn.textContent = 'Actualizar';
            cancelServiceEditBtn.classList.remove('hidden');
        };
    }

    function handleDeleteService(id) {
        showConfirmModal('¿Está seguro de que desea eliminar este servicio?', () => {
            getObjectStore(SERVICES_STORE_NAME, 'readwrite').delete(id).onsuccess = () => {
                showToast('Servicio eliminado.', 'success');
                resetServiceForm();
                loadFabOptions();
            };
        });
    }

    function resetServiceForm() {
        serviceForm.reset();
        serviceIdInput.value = '';
        serviceFormTitle.textContent = 'Añadir Nuevo Servicio';
        saveServiceBtn.textContent = 'Guardar Servicio';
        cancelServiceEditBtn.classList.add('hidden');
    }

    function displayVehicleTypesInSettings(types) {
        vehicleTypesListContainer.innerHTML = '';
        if (types.length === 0) { vehicleTypesListContainer.innerHTML = '<p class="text-base-content-secondary text-sm">No hay tipos de vehículo registrados.</p>'; return; }
        types.forEach((type) => {
            const div = document.createElement('div');
            div.className = 'flex items-center justify-between bg-base-200 p-3 rounded-lg border border-theme';
            div.innerHTML = `<div><p class="font-medium text-base-content">${type.name}</p><p class="text-sm text-base-content-secondary">Tarifa: ${formatCurrency(type.hourlyRate)}/hr</p></div><div class="space-x-2"><button class="edit-vehicle-type-btn text-primary hover:text-primary-focus text-sm font-medium" data-id="${type.id}">Editar</button><button class="delete-vehicle-type-btn text-red-600 hover:text-red-800 text-sm font-medium ${types.length === 1 ? 'opacity-50 cursor-not-allowed' : ''}" data-id="${type.id}" ${types.length === 1 ? 'disabled' : ''}>Eliminar</button></div>`;
            vehicleTypesListContainer.appendChild(div);
        });
    }

    function handleSaveVehicleType(e) {
        e.preventDefault();
        const id = parseInt(vehicleTypeIdInput.value);
        const vehicleTypeData = { name: vehicleTypeNameInput.value, hourlyRate: parseFloat(vehicleTypeRateInput.value) };
        const store = getObjectStore(VEHICLE_TYPES_STORE_NAME, 'readwrite');
        const request = id ? store.put({ ...vehicleTypeData, id }) : store.add(vehicleTypeData);
        request.onsuccess = () => {
            showToast(`Tipo de vehículo ${id ? 'actualizado' : 'guardado'} con éxito.`, 'success');
            resetVehicleTypeForm();
            loadVehicleTypesFromDB();
        };
        request.onerror = () => showToast('Error al guardar el tipo de vehículo.', 'error');
    }

    function handleEditVehicleType(id) {
        getObjectStore(VEHICLE_TYPES_STORE_NAME, 'readonly').get(id).onsuccess = (event) => {
            const type = event.target.result;
            vehicleTypeIdInput.value = type.id;
            vehicleTypeNameInput.value = type.name;
            vehicleTypeRateInput.value = type.hourlyRate;
            vehicleTypeFormTitle.textContent = 'Editar Tipo de Vehículo';
            saveVehicleTypeBtn.textContent = 'Actualizar';
            cancelVehicleTypeEditBtn.classList.remove('hidden');
        };
    }

    function handleDeleteVehicleType(id) {
        showConfirmModal('¿Está seguro? Eliminar un tipo de vehículo puede afectar tickets existentes.', () => {
            getObjectStore(VEHICLE_TYPES_STORE_NAME, 'readwrite').delete(id).onsuccess = () => {
                showToast('Tipo de vehículo eliminado.', 'success');
                resetVehicleTypeForm();
                loadVehicleTypesFromDB();
            };
        });
    }

    function resetVehicleTypeForm() {
        vehicleTypeForm.reset();
        vehicleTypeIdInput.value = '';
        vehicleTypeFormTitle.textContent = 'Añadir Nuevo Tipo';
        saveVehicleTypeBtn.textContent = 'Guardar Tipo';
        cancelVehicleTypeEditBtn.classList.add('hidden');
    }

    async function hashPassword(password) {
        const encoder = new TextEncoder();
        const data = encoder.encode(password);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
    }

    function displayUsersInSettings(users) {
        usersListContainer.innerHTML = '';
        if (users.length === 0) { usersListContainer.innerHTML = '<p class="text-base-content-secondary text-sm">No hay usuarios registrados.</p>'; return; }
        const adminCount = users.filter(u => u.role === 'Administrador').length;
        users.forEach(user => {
            const div = document.createElement('div');
            div.className = 'flex items-center justify-between bg-base-200 p-3 rounded-lg border border-theme';
            const isLastAdmin = user.role === 'Administrador' && adminCount === 1;
            div.innerHTML = `<div><p class="font-medium text-base-content">${user.name}</p><p class="text-sm text-base-content-secondary">${user.role}</p></div><div class="space-x-2"><button class="edit-user-btn text-primary hover:text-primary-focus text-sm font-medium" data-id="${user.id}">Editar</button><button class="delete-user-btn text-red-600 hover:text-red-800 text-sm font-medium ${isLastAdmin ? 'opacity-50 cursor-not-allowed' : ''}" data-id="${user.id}" ${isLastAdmin ? 'disabled' : ''}>Eliminar</button></div>`;
            usersListContainer.appendChild(div);
        });
    }

    async function handleSaveUser(e) {
        e.preventDefault();
        const id = parseInt(userIdInput.value);
        const name = userNameInput.value;
        const role = userRoleSelect.value;
        const password = userPasswordInput.value;

        if (!id && !password) { showToast('La contraseña es obligatoria para nuevos usuarios.', 'error'); return; }

        if (id) {
            let newHashedPassword = null;
            if (password) { newHashedPassword = await hashPassword(password); }
            const transaction = db.transaction(USERS_STORE_NAME, 'readwrite');
            const store = transaction.objectStore(USERS_STORE_NAME);
            const getRequest = store.get(id);
            getRequest.onsuccess = () => {
                const userData = getRequest.result;
                if (!userData) { showToast('Error: no se pudo encontrar el usuario para actualizar.', 'error'); return; }
                userData.name = name;
                userData.role = role;
                if (newHashedPassword) { userData.password = newHashedPassword; }
                store.put(userData);
            };
            transaction.oncomplete = () => { showToast('Usuario actualizado con éxito.', 'success'); resetUserForm(); loadUsersFromDB(); };
            transaction.onerror = () => showToast('Error al actualizar el usuario.', 'error');
        } else {
            const hashedPassword = await hashPassword(password);
            const userData = { name, role, password: hashedPassword };
            const transaction = db.transaction(USERS_STORE_NAME, 'readwrite');
            const store = transaction.objectStore(USERS_STORE_NAME);
            store.add(userData);
            transaction.oncomplete = () => { showToast('Usuario añadido con éxito.', 'success'); resetUserForm(); loadUsersFromDB(); };
            transaction.onerror = () => showToast('Error al añadir el usuario.', 'error');
        }
    }

    function handleEditUser(id) {
        getObjectStore(USERS_STORE_NAME, 'readonly').get(id).onsuccess = (event) => {
            const user = event.target.result;
            userIdInput.value = user.id;
            userNameInput.value = user.name;
            userRoleSelect.value = user.role;
            userPasswordInput.value = '';
            userPasswordInput.placeholder = 'Dejar en blanco para no cambiar';
            userFormTitle.textContent = 'Editar Usuario';
            saveUserBtn.textContent = 'Actualizar';
            cancelUserEditBtn.classList.remove('hidden');
        };
    }

    function handleDeleteUser(id) {
        showConfirmModal('¿Está seguro de que desea eliminar este usuario?', () => {
            getObjectStore(USERS_STORE_NAME, 'readwrite').delete(id).onsuccess = () => {
                showToast('Usuario eliminado.', 'success');
                resetUserForm();
                loadUsersFromDB();
            };
        });
    }

    function resetUserForm() {
        userForm.reset();
        userIdInput.value = '';
        userPasswordInput.placeholder = 'Contraseña';
        userFormTitle.textContent = 'Añadir Nuevo Usuario';
        saveUserBtn.textContent = 'Guardar Usuario';
        cancelUserEditBtn.classList.add('hidden');
    }
    // ======================== FIN: LÓGICA DEL MODAL DE CONFIGURACIÓN ========================

    // =====================================================================
    // ======================= INICIO: EVENT LISTENERS =======================
    // =====================================================================
    loginForm.addEventListener('submit', handleLogin);
    logoutBtn.addEventListener('click', generateAndShowShiftReport);
    logoutConfirmBtn.addEventListener('click', performLogout);
    printShiftReportBtn.addEventListener('click', printShiftReportWithQZ);


    themeToggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isHidden = themePopover.classList.contains('opacity-0');
        toggleThemePopover(isHidden);
    });

    document.addEventListener('click', (e) => {
        if (!themePopover.contains(e.target) && !themeToggleBtn.contains(e.target)) {
            toggleThemePopover(false);
        }
    });

    quickChargeToggle.addEventListener('change', (e) => {
        localStorage.setItem('quickChargeMode', e.target.checked);
    });


    barcodeInput.addEventListener('input', (e) => {
        clearTimeout(searchDebounceTimer);
        const barcode = e.target.value.trim().toUpperCase();
        if (!barcode) { ticketInfoSection.classList.add('hidden'); return; }
        searchDebounceTimer = setTimeout(() => { findTicket(barcode); }, 500);
    });

    newEntryBtn.addEventListener('click', () => { resetNewEntryForm(); toggleModal(newEntryModal, true); });
    cancelEntryBtn.addEventListener('click', () => toggleModal(newEntryModal, false));
    newEntryForm.addEventListener('submit', registerEntry);
    chargeButton.addEventListener('click', markTicketAsPaid);
    cancelPensionBtn.addEventListener('click', handleCancelPension);
    convertToOvernightBtn.addEventListener('click', handleConvertToOvernight);
    cancelTicketBtn.addEventListener('click', handleCancelTicket);
    fabMainBtn.addEventListener('click', () => fabContainer.classList.toggle('active'));
    typeHourlyBtn.addEventListener('click', () => setEntryType('hourly'));
    typeOvernightBtn.addEventListener('click', () => setEntryType('overnight'));
    typePensionBtn.addEventListener('click', () => setEntryType('pension'));
    vehicleTypeSelect.addEventListener('change', updateBrandSelect);
    newPlateInput.addEventListener('blur', findPreviousEntryByPlate);

    cancelCalcBtn.addEventListener('click', () => toggleModal(calculatorModal, false));
    calculatorForm.addEventListener('submit', handleCalculation);

    closeSettingsBtn.addEventListener('click', () => toggleModal(settingsModal, false));

    settingsTabs.addEventListener('click', (e) => { if (e.target.matches('.tab-button')) switchTab(e.target.dataset.tab); });

    businessInfoForm.addEventListener('submit', handleSaveBusinessInfo);

    serviceForm.addEventListener('submit', handleSaveService);
    cancelServiceEditBtn.addEventListener('click', resetServiceForm);
    servicesListContainer.addEventListener('click', (e) => {
        if (e.target.matches('.edit-service-btn')) handleEditService(parseInt(e.target.dataset.id));
        if (e.target.matches('.delete-service-btn')) handleDeleteService(parseInt(e.target.dataset.id));
    });

    vehicleTypeForm.addEventListener('submit', handleSaveVehicleType);
    cancelVehicleTypeEditBtn.addEventListener('click', resetVehicleTypeForm);
    vehicleTypesListContainer.addEventListener('click', (e) => {
        if (e.target.matches('.edit-vehicle-type-btn')) handleEditVehicleType(parseInt(e.target.dataset.id));
        if (e.target.matches('.delete-vehicle-type-btn')) handleDeleteVehicleType(parseInt(e.target.dataset.id));
    });

    userForm.addEventListener('submit', handleSaveUser);
    cancelUserEditBtn.addEventListener('click', resetUserForm);
    usersListContainer.addEventListener('click', (e) => {
        if (e.target.matches('.edit-user-btn')) handleEditUser(parseInt(e.target.dataset.id));
        if (e.target.matches('.delete-user-btn')) handleDeleteUser(parseInt(e.target.dataset.id));
    });

    closeExpensesBtn.addEventListener('click', () => toggleModal(expensesModal, false));
    expenseForm.addEventListener('submit', handleSaveExpense);
    cancelExpenseEditBtn.addEventListener('click', resetExpenseForm);
    expensesListContainer.addEventListener('click', (e) => {
        if (e.target.matches('.edit-expense-btn')) handleEditExpense(parseInt(e.target.dataset.id));
        if (e.target.matches('.delete-expense-btn')) handleDeleteExpense(parseInt(e.target.dataset.id));
    });

    confirmModalCancelBtn.addEventListener('click', () => toggleModal(confirmModal, false));
    confirmModalConfirmBtn.addEventListener('click', () => {
        if (typeof confirmCallback === 'function') confirmCallback();
        toggleModal(confirmModal, false);
    });
    // ======================== FIN: EVENT LISTENERS ========================

    // Inicialización
    initDB();
    populateColorSuggestions();

    // Inicializar Flatpickr
    flatpickr(calcEntryTime, { enableTime: true, dateFormat: "Y-m-d H:i", time_24hr: true, defaultDate: new Date(), locale: "es" });
    flatpickr(calcExitTime, { enableTime: true, dateFormat: "Y-m-d H:i", time_24hr: true, defaultDate: new Date(), locale: "es" });
});
