import { generateId } from '../utils/id-generator.js';

// ==========================================
// CART SERVICE - CRUD del carrito con decoradores
// Historia: HU12 (Eliminar)
// ==========================================

import { Log, Validate, createNotEmptyValidator } from '../middleware/index.js';
import type { Vehicle, VehicleConfig, OperationResult } from '../types/index.js';

// ==========================================
// CLASE: CartService
// Responsabilidad: Gestionar el carrito de vehículos
// ==========================================
export class CartService {
  private vehicles: Map<string, Vehicle> = new Map();

  // ==========================================
  // HU12 - ELIMINAR VEHÍCULO (Cancelar contrato)
  // Flujo:
  // 1. Confirmar con keyInYN: "¿Cancelar contrato? No se puede deshacer"
  // 2. Si sí: eliminar del map
  // 3. Retornar resultado
  // ==========================================
  @Log()
  @Validate(createNotEmptyValidator())
  removeVehicle(vehicleId: string): OperationResult<void> {
    if (!this.vehicles.has(vehicleId)) {
      return {
        success: false,
        error: `Vehículo con ID ${vehicleId} no encontrado`
      };
    }
    this.vehicles.delete(vehicleId);
    return {
      success: true,
      message: 'Vehículo eliminado exitosamente'
    };
  }
}
