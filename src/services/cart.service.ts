import { generateId } from '../utils/id-generator.js';

// ==========================================
// CART SERVICE - CRUD del carrito con decoradores
// Historia: HU11 (Editar)
// ==========================================

import { Log, Validate, createVehicleConfigValidator } from '../middleware/index.js';
import type { Vehicle, VehicleConfig, OperationResult } from '../types/index.js';

// ==========================================
// CLASE: CartService
// Responsabilidad: Gestionar el carrito de vehículos
// ==========================================
export class CartService {
  private vehicles: Map<string, Vehicle> = new Map();

  // ==========================================
  // HU11 - EDITAR CONFIGURACIÓN DE VEHÍCULO
  // Flujo:
  // 1. Usuario selecciona vehículo de la lista
  // 2. Menú: [1] Ver config [2] Editar [3] Cancelar contrato [0] Volver
  // 3. Si edita: mostrar opciones keyInSelect para cada categoría
  // ==========================================
  @Log()
  @Validate(createVehicleConfigValidator())
  updateVehicleConfig(vehicleId: string, newConfig: Partial<VehicleConfig>): OperationResult<Vehicle> {
    const found = this.findVehicleOrError(vehicleId);
    if (!found.success) return found;
    const vehicle = found.vehicle;
    vehicle.config = { ...vehicle.config, ...newConfig };
    vehicle.updatedAt = new Date();
    this.vehicles.set(vehicleId, vehicle);
    return {
      success: true,
      data: vehicle,
      message: `Configuración de "${vehicle.name}" actualizada exitosamente`
    };
  }

  // ==========================================
  // HELPERS PRIVADOS
  // ==========================================
  private findVehicleOrError(vehicleId: string): { success: false; error: string } | { success: true; vehicle: Vehicle } {
    const vehicle = this.vehicles.get(vehicleId);
    return vehicle 
      ? { success: true, vehicle }
      : { success: false, error: `Vehículo con ID ${vehicleId} no encontrado` };
  }
}
