/**
 * Almacena el estado global y dinámico de la aplicación.
 * Todos los módulos importarán este objeto para leer o modificar el estado,
 * asegurando una única fuente de verdad.
 */
export const state = {
    // Estado de la Base de Datos
    db: null,

    // Estado de la Sesión y Usuario
    currentUser: null,
    shiftReportData: null, // Datos para el corte de caja

    // Estado del Flujo Principal
    currentTicket: null, // El ticket que se está viendo/cobrando
    currentLostTicket: null, // El ticket que se busca en el modal de boleto perdido
    currentEntryType: 'hourly', // Tipo de entrada seleccionado en el formulario

    // Caché de Datos de Configuración
    vehicleTypesCache: [],
    businessInfoCache: {},
    usersCache: [],

    // Estado de la Impresora
    selectedPrinter: null,
    paperWidth: 32, // Ancho de papel por defecto

    // Estado de la UI y Componentes
    confirmCallback: null, // Función a ejecutar en el modal de confirmación

    // Estado del Módulo de Reportes
    allRecords: [], // Cache de todos los tickets para el historial
    allSales: [],   // Cache de todas las ventas para el historial
    allExpenses: [],// Cache de todos los gastos para el historial
    filteredRecords: [], // Tickets filtrados que se muestran en la tabla
    recordsCurrentPage: 1,
    recordsPerPage: 15, // Cuántos registros mostrar por página
    recordsSortColumn: 'entryTime',
    recordsSortDirection: 'desc',
    dateFilterInstance: null, // Instancia de Flatpickr para el filtro de fecha
};