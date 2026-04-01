// ==========================================
// MIDDLEWARE - Validaciones para el sistema
// Valida configuraciones de vehículo y datos de entrada
// ==========================================

import type { VehicleConfig, ValidationResult } from '../types/interfaces';
import { CONFIG_OPTIONS } from '../config/constants';

// ==========================================
// VALIDACIÓN: Configuración completa de vehículo
// ==========================================
const CONFIG_FIELDS: { key: keyof VehicleConfig; options: readonly string[]; label: string }[] = [
  { key: 'motor', options: CONFIG_OPTIONS.MOTOR, label: 'Motor' },
  { key: 'pintura', options: CONFIG_OPTIONS.PINTURA, label: 'Pintura' },
  { key: 'rines', options: CONFIG_OPTIONS.RINES, label: 'Rines' },
  { key: 'interior', options: CONFIG_OPTIONS.INTERIOR, label: 'Interior' },
  { key: 'suspension', options: CONFIG_OPTIONS.SUSPENSION, label: 'Suspensión' },
  { key: 'tecnologia', options: CONFIG_OPTIONS.TECNOLOGIA, label: 'Tecnología' },
  { key: 'techo', options: CONFIG_OPTIONS.TECHO, label: 'Techo' },
  { key: 'llantas', options: CONFIG_OPTIONS.LLANTAS, label: 'Llantas' }
];

function validateField(value: string | undefined, options: readonly string[], label: string): ValidationResult {
  if (value === undefined) return { valid: true };
  return options.includes(value as string) 
    ? { valid: true } 
    : { valid: false, message: `${label} inválido. Opciones: ${options.join(', ')}` };
}

export function validateVehicleConfig(config: Partial<VehicleConfig>): ValidationResult {
  if (!config) return { valid: false, message: 'Configuración no proporcionada' };
  for (const field of CONFIG_FIELDS) {
    const result = validateField(config[field.key], field.options, field.label);
    if (!result.valid) return result;
  }
  return { valid: true };
}

// ==========================================
// VALIDACIÓN: Nombre de vehículo
// ==========================================
export function validateVehicleName(name: string): ValidationResult {
  if (!name || typeof name !== 'string') return { valid: false, message: 'El nombre es requerido' };
  if (name.trim().length < 2) return { valid: false, message: 'El nombre debe tener al menos 2 caracteres' };
  if (name.trim().length > 30) return { valid: false, message: 'El nombre debe tener máximo 30 caracteres' };
  return { valid: true };
}

// ==========================================
// VALIDACIÓN: ID de vehículo existe
// ==========================================
export function validateVehicleExists(vehicleId: string, existingIds: string[]): ValidationResult {
  if (!vehicleId) return { valid: false, message: 'ID de vehículo no proporcionado' };
  if (!existingIds.includes(vehicleId)) return { valid: false, message: `Vehículo con ID ${vehicleId} no existe` };
  return { valid: true };
}

// ==========================================
// VALIDADOR COMPUESTO (para usar con @Validate)
// ==========================================
export function createVehicleConfigValidator() {
  return function(args: unknown[]): boolean | string {
    const config = args[0] as Partial<VehicleConfig>;
    const result = validateVehicleConfig(config);
    return result.valid || result.message || 'Configuración de vehículo inválida';
  };
}

// ==========================================
// VALIDADOR: Argumentos no vacíos
// ==========================================
export function createNotEmptyValidator() {
  return function(args: unknown[]): boolean | string {
    for (let i = 0; i < args.length; i++) {
      const arg = args[i];
      if (arg === null || arg === undefined) return `Argumento ${i + 1} es null o undefined`;
      if (typeof arg === 'string' && arg.trim() === '') return `Argumento ${i + 1} es un string vacío`;
    }
    return true;
  };
}
