import { state } from './state.js';
import * as ui from './ui.js';
import { horarios } from './config.js';

/**
 * Convierte una cadena de tiempo (ej. "09:00") a un objeto Date completo para el día especificado.
 * @param {Date} date El día para el que se establecerá la hora.
 * @param {string} timeStr La hora en formato "HH:MM".
 * @returns {Date} Un objeto Date completo.
 */
export const parseTime = (date, timeStr) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    const newDate = new Date(date);
    newDate.setHours(hours, minutes, 0, 0);
    return newDate;
};

/**
 * Calcula el costo por horas, aplicando la lógica de tolerancia (primeros 3 min gratis, >10 min se cobra la hora).
 * @param {Date} start La hora de inicio del cálculo.
 * @param {Date} end La hora de fin del cálculo.
 * @param {number} hourlyRate La tarifa por hora del tipo de vehículo.
 * @returns {{billableHours: number, cost: number, totalMinutes: number}}
 */
export function calculateHourlyCost(start, end, hourlyRate) {
    const diffMs = end.getTime() - start.getTime();
    if (diffMs <= 0) return { billableHours: 0, cost: 0, totalMinutes: 0 };

    const totalMinutes = Math.ceil(diffMs / 60000);
    let billableHours = 0;

    if (totalMinutes > 0) {
        // Lógica para la primera hora
        const firstHourMinutes = Math.min(totalMinutes, 60);
        if (firstHourMinutes > 3) { // Tolerancia de 3 minutos para la primera hora
            billableHours = 1;
        }

        // Lógica para las horas subsecuentes
        let remainingMinutes = totalMinutes - firstHourMinutes;
        while (remainingMinutes > 0) {
            const currentHourMinutes = Math.min(remainingMinutes, 60);
            if (currentHourMinutes > 10) { // Tolerancia de 10 minutos para las siguientes
                billableHours++;
            }
            remainingMinutes -= currentHourMinutes;
        }
    }

    return { billableHours, cost: billableHours * hourlyRate, totalMinutes };
}

/**
 * Calcula el costo total de una estancia, manejando tarifas nocturnas y horarios de operación.
 * @param {Date} entry La fecha y hora de entrada.
 * @param {Date} exit La fecha y hora de salida.
 * @param {object} vehicleType El objeto del tipo de vehículo.
 * @param {object} businessInfo La información del negocio (para la tarifa nocturna).
 * @param {object} schedule El objeto con los horarios de operación.
 * @returns {{totalCost: number, breakdown: Array<object>}}
 */
export function calculateStayCost(entry, exit, vehicleType, businessInfo, schedule) {
    let totalCost = 0;
    const breakdown = [];
    let currentTime = new Date(entry);

    const overnightRate = parseFloat(businessInfo.overnightRate) || 0;
    const firstDaySchedule = schedule[currentTime.getDay()];
    const firstDayOpeningTime = parseTime(currentTime, firstDaySchedule.apertura);

    // Si la entrada fue antes de la hora de apertura, el cálculo empieza a la hora de apertura
    if (currentTime < firstDayOpeningTime) {
        currentTime = firstDayOpeningTime;
    }

    while (currentTime < exit) {
        const dayOfWeek = currentTime.getDay();
        const daySchedule = schedule[dayOfWeek];
        const closingTime = parseTime(currentTime, daySchedule.cierre);
        
        // El periodo para entrar a pensión nocturna empieza 30 mins antes del cierre
        const overnightEntryStart = new Date(closingTime.getTime() - 30 * 60000);
        
        const nextDay = new Date(currentTime);
        nextDay.setDate(nextDay.getDate() + 1);
        nextDay.setHours(0, 0, 0, 0);
        
        const nextDaySchedule = schedule[nextDay.getDay()];
        const nextDayOpeningTime = parseTime(nextDay, nextDaySchedule.apertura);
        
        // La tolerancia para salir de la pensión nocturna son 30 mins después de la apertura
        const nextDayExitToleranceEnd = new Date(nextDayOpeningTime.getTime() + 30 * 60000);

        if (exit < nextDayOpeningTime) {
            // El cobro se realiza completamente por horas dentro del mismo día operativo
            const hoursResult = calculateHourlyCost(currentTime, exit, vehicleType.hourlyRate);
            if (hoursResult.cost > 0) {
                breakdown.push({ description: `Estacionamiento (${ui.formatDate(currentTime)})`, details: `Tiempo: ${ui.formatElapsedTime(hoursResult.totalMinutes * 60000)} (${hoursResult.billableHours}h facturadas)`, cost: hoursResult.cost });
                totalCost += hoursResult.cost;
            }
            currentTime = exit; // Termina el bucle
        } else {
            // El cobro incluye al menos una noche de pensión
            if (currentTime < overnightEntryStart) {
                const hoursResult = calculateHourlyCost(currentTime, overnightEntryStart, vehicleType.hourlyRate);
                if (hoursResult.cost > 0) {
                    breakdown.push({ description: `Estacionamiento (${ui.formatDate(currentTime)})`, details: `Tiempo: ${ui.formatElapsedTime(hoursResult.totalMinutes * 60000)} (${hoursResult.billableHours}h facturadas)`, cost: hoursResult.cost });
                    totalCost += hoursResult.cost;
                }
            }
            breakdown.push({ description: `Pensión Nocturna (${ui.formatDate(currentTime)})`, details: `1 Noche`, cost: overnightRate });
            totalCost += overnightRate;
            
            // Avanzamos el tiempo hasta el final de la tolerancia del día siguiente
            currentTime = new Date(nextDayExitToleranceEnd);
        }
    }
    return { totalCost, breakdown };
}


/**
 * Maneja el evento de submit del formulario de la calculadora.
 * @param {Event} e El objeto del evento.
 */
export function handleCalculation(e) {
    e.preventDefault();
    const entry = new Date(document.getElementById('calc-entry-time').value);
    const exit = new Date(document.getElementById('calc-exit-time').value);
    
    // Suponiendo que los elementos del form están en el módulo UI
    if (!document.getElementById('calc-entry-time').value || !document.getElementById('calc-exit-time').value || entry >= exit) {
        ui.showToast('Ingrese una fecha de salida posterior a la de entrada.', 'error');
        return;
    }

    const selectedVehicleType = state.vehicleTypesCache.find(v => v.id === parseInt(document.getElementById('calc-vehicle-type').value));
    if (!selectedVehicleType) {
        ui.showToast('Seleccione un tipo de vehículo válido.', 'error');
        return;
    }
    if (!state.businessInfoCache.overnightRate) {
        ui.showToast('Por favor, configure la "Tarifa Nocturna" en los ajustes del negocio.', 'error');
        return;
    }

    const { totalCost, breakdown } = calculateStayCost(entry, exit, selectedVehicleType, state.businessInfoCache, horarios);
    
    const calcBreakdownEl = document.getElementById('calc-breakdown');
    calcBreakdownEl.innerHTML = '';
    if (breakdown.length > 0) {
        breakdown.forEach(item => {
            const div = document.createElement('div');
            div.className = 'bg-base-100 p-3 rounded-lg border border-theme';
            div.innerHTML = `<div class="flex justify-between items-center"><div><p class="font-semibold text-base-content">${item.description}</p><p class="text-xs text-base-content-secondary">${item.details}</p></div><p class="font-bold text-base-content">${ui.formatCurrency(item.cost)}</p></div>`;
            calcBreakdownEl.appendChild(div);
        });
    } else {
        calcBreakdownEl.innerHTML = '<p class="text-base-content-secondary text-center">Sin cargos por la estancia.</p>';
    }
    document.getElementById('calc-total-cost').textContent = ui.formatCurrency(totalCost);
    document.getElementById('calculator-results').classList.remove('hidden');
}