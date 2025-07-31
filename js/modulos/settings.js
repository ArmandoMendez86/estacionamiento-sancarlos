import { state } from './state.js';
import * as ui from './ui.js';
import { getObjectStore } from './database.js';
import { hashPassword } from './auth.js';
import { BUSINESS_INFO_STORE_NAME, SERVICES_STORE_NAME, VEHICLE_TYPES_STORE_NAME, USERS_STORE_NAME, ICON_OPTIONS, ICONS } from './config.js';
import { loadFabOptions } from './ui.js'; // FAB se actualiza cuando cambian los servicios

/**
 * Cambia la pestaña activa en el modal de configuración.
 * @param {string} tabName El nombre de la pestaña a activar.
 */
export function switchTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(tc => tc.classList.remove('active'));
    document.querySelectorAll('.tab-button').forEach(tb => {
        tb.classList.remove('bg-primary', 'text-primary-content');
        tb.classList.add('text-base-content-secondary');
    });

    const activeTab = document.getElementById(`tab-content-${tabName}`);
    const activeButton = document.querySelector(`.tab-button[data-tab="${tabName}"]`);

    if (activeTab) activeTab.classList.add('active');
    if (activeButton) {
        activeButton.classList.add('bg-primary', 'text-primary-content');
        activeButton.classList.remove('text-base-content-secondary');
    }
}


// --- Lógica de Información del Negocio ---

/**
 * Guarda la información del negocio en la base de datos.
 * @param {Event} e El objeto del evento del formulario.
 */
export function handleSaveBusinessInfo(e) {
    e.preventDefault();
    const businessData = {
        id: 1,
        name: ui.businessNameInput.value,
        address: ui.businessAddressInput.value,
        phone: ui.businessPhoneInput.value,
        hours: ui.businessHoursInput.value,
        overnightRate: parseFloat(ui.businessOvernightRateInput.value) || 0
    };
    getObjectStore(BUSINESS_INFO_STORE_NAME, 'readwrite').put(businessData).onsuccess = () => {
        ui.showToast('Información del negocio guardada con éxito.', 'success');
        state.businessInfoCache = businessData;
    };
}

// --- Lógica de Servicios ---

/**
 * Guarda o actualiza un servicio.
 * @param {Event} e El objeto del evento del formulario.
 */
export function handleSaveService(e) {
    e.preventDefault();
    const id = parseInt(ui.serviceIdInput.value);
    const serviceData = { name: ui.serviceNameInput.value, price: parseFloat(ui.servicePriceInput.value), icon: ui.serviceIconSelect.value };
    const store = getObjectStore(SERVICES_STORE_NAME, 'readwrite');
    const request = id ? store.put({ ...serviceData, id }) : store.add(serviceData);
    request.onsuccess = () => {
        ui.showToast(`Servicio ${id ? 'actualizado' : 'guardado'} con éxito.`, 'success');
        resetServiceForm();
        loadFabOptions(); // Recarga los botones FAB para reflejar los cambios
    };
    request.onerror = () => ui.showToast('Error al guardar el servicio.', 'error');
}

/**
 * Carga el formulario para editar un servicio existente.
 * @param {number} id El ID del servicio a editar.
 */
export function handleEditService(id) {
    getObjectStore(SERVICES_STORE_NAME, 'readonly').get(id).onsuccess = (event) => {
        const service = event.target.result;
        ui.serviceIdInput.value = service.id;
        ui.serviceNameInput.value = service.name;
        ui.servicePriceInput.value = service.price;
        ui.serviceIconSelect.value = service.icon;
        ui.serviceFormTitle.textContent = 'Editar Servicio';
        ui.saveServiceBtn.textContent = 'Actualizar';
        ui.cancelServiceEditBtn.classList.remove('hidden');
    };
}

/**
 * Elimina un servicio de la base de datos.
 * @param {number} id El ID del servicio a eliminar.
 */
export function handleDeleteService(id) {
    ui.showConfirmModal('¿Está seguro de que desea eliminar este servicio?', () => {
        getObjectStore(SERVICES_STORE_NAME, 'readwrite').delete(id).onsuccess = () => {
            ui.showToast('Servicio eliminado.', 'success');
            resetServiceForm();
            loadFabOptions();
        };
    });
}

/**
 * Resetea el formulario de servicios a su estado inicial.
 */
export function resetServiceForm() {
    ui.serviceForm.reset();
    ui.serviceIdInput.value = '';
    ui.serviceFormTitle.textContent = 'Añadir Nuevo Servicio';
    ui.saveServiceBtn.textContent = 'Guardar Servicio';
    ui.cancelServiceEditBtn.classList.add('hidden');
}


// --- Lógica de Tipos de Vehículo ---

/**
 * Guarda o actualiza un tipo de vehículo.
 * @param {Event} e El objeto del evento del formulario.
 */
export function handleSaveVehicleType(e) {
    e.preventDefault();
    const id = parseInt(ui.vehicleTypeIdInput.value);
    const vehicleTypeData = { name: ui.vehicleTypeNameInput.value, hourlyRate: parseFloat(ui.vehicleTypeRateInput.value) };
    const store = getObjectStore(VEHICLE_TYPES_STORE_NAME, 'readwrite');
    const request = id ? store.put({ ...vehicleTypeData, id }) : store.add(vehicleTypeData);
    request.onsuccess = () => {
        ui.showToast(`Tipo de vehículo ${id ? 'actualizado' : 'guardado'} con éxito.`, 'success');
        resetVehicleTypeForm();
        ui.loadVehicleTypesFromDB();
    };
    request.onerror = () => ui.showToast('Error al guardar el tipo de vehículo.', 'error');
}

/**
 * Carga el formulario para editar un tipo de vehículo.
 * @param {number} id El ID del tipo de vehículo a editar.
 */
export function handleEditVehicleType(id) {
    getObjectStore(VEHICLE_TYPES_STORE_NAME, 'readonly').get(id).onsuccess = (event) => {
        const type = event.target.result;
        ui.vehicleTypeIdInput.value = type.id;
        ui.vehicleTypeNameInput.value = type.name;
        ui.vehicleTypeRateInput.value = type.hourlyRate;
        ui.vehicleTypeFormTitle.textContent = 'Editar Tipo de Vehículo';
        ui.saveVehicleTypeBtn.textContent = 'Actualizar';
        ui.cancelVehicleTypeEditBtn.classList.remove('hidden');
    };
}

/**
 * Elimina un tipo de vehículo.
 * @param {number} id El ID del tipo de vehículo a eliminar.
 */
export function handleDeleteVehicleType(id) {
    ui.showConfirmModal('¿Está seguro? Eliminar un tipo de vehículo puede afectar tickets existentes.', () => {
        getObjectStore(VEHICLE_TYPES_STORE_NAME, 'readwrite').delete(id).onsuccess = () => {
            ui.showToast('Tipo de vehículo eliminado.', 'success');
            resetVehicleTypeForm();
            ui.loadVehicleTypesFromDB();
        };
    });
}

/**
 * Resetea el formulario de tipos de vehículo.
 */
export function resetVehicleTypeForm() {
    ui.vehicleTypeForm.reset();
    ui.vehicleTypeIdInput.value = '';
    ui.vehicleTypeFormTitle.textContent = 'Añadir Nuevo Tipo';
    ui.saveVehicleTypeBtn.textContent = 'Guardar Tipo';
    ui.cancelVehicleTypeEditBtn.classList.add('hidden');
}


// --- Lógica de Usuarios ---

/**
 * Guarda o actualiza un usuario.
 * @param {Event} e El objeto del evento del formulario.
 */
export async function handleSaveUser(e) {
    e.preventDefault();
    const id = parseInt(ui.userIdInput.value);
    const name = ui.userNameInput.value;
    const role = ui.userRoleSelect.value;
    const password = ui.userPasswordInput.value;

    if (!id && !password) {
        ui.showToast('La contraseña es obligatoria para nuevos usuarios.', 'error');
        return;
    }

    if (id) { // Actualizar usuario existente
        const newHashedPassword = password ? await hashPassword(password) : null;
        const store = getObjectStore(USERS_STORE_NAME, 'readwrite');
        const getRequest = store.get(id);
        getRequest.onsuccess = () => {
            const userData = getRequest.result;
            if (!userData) { ui.showToast('Error: no se pudo encontrar el usuario.', 'error'); return; }
            userData.name = name;
            userData.role = role;
            if (newHashedPassword) { userData.password = newHashedPassword; }
            store.put(userData).onsuccess = () => {
                ui.showToast('Usuario actualizado con éxito.', 'success');
                resetUserForm();
                ui.loadUsersFromDB();
            };
        };
    } else { // Crear nuevo usuario
        const hashedPassword = await hashPassword(password);
        const userData = { name, role, password: hashedPassword };
        getObjectStore(USERS_STORE_NAME, 'readwrite').add(userData).onsuccess = () => {
            ui.showToast('Usuario añadido con éxito.', 'success');
            resetUserForm();
            ui.loadUsersFromDB();
        };
    }
}

/**
 * Carga el formulario para editar un usuario.
 * @param {number} id El ID del usuario a editar.
 */
export function handleEditUser(id) {
    getObjectStore(USERS_STORE_NAME, 'readonly').get(id).onsuccess = (event) => {
        const user = event.target.result;
        ui.userIdInput.value = user.id;
        ui.userNameInput.value = user.name;
        ui.userRoleSelect.value = user.role;
        ui.userPasswordInput.value = '';
        ui.userPasswordInput.placeholder = 'Dejar en blanco para no cambiar';
        ui.userFormTitle.textContent = 'Editar Usuario';
        ui.saveUserBtn.textContent = 'Actualizar';
        ui.cancelUserEditBtn.classList.remove('hidden');
    };
}

/**
 * Elimina un usuario.
 * @param {number} id El ID del usuario a eliminar.
 */
export function handleDeleteUser(id) {
    ui.showConfirmModal('¿Está seguro de que desea eliminar este usuario?', () => {
        getObjectStore(USERS_STORE_NAME, 'readwrite').delete(id).onsuccess = () => {
            ui.showToast('Usuario eliminado.', 'success');
            resetUserForm();
            ui.loadUsersFromDB();
        };
    });
}

/**
 * Resetea el formulario de usuarios.
 */
export function resetUserForm() {
    ui.userForm.reset();
    ui.userIdInput.value = '';
    ui.userPasswordInput.placeholder = 'Contraseña';
    ui.userFormTitle.textContent = 'Añadir Nuevo Usuario';
    ui.saveUserBtn.textContent = 'Guardar Usuario';
    ui.cancelUserEditBtn.classList.add('hidden');
}