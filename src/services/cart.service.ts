import { generateId } from '../utils/id-generator.js';

// ==========================================
// CART SERVICE - CRUD del carrito con decoradores
// Historia: HU9 (Agregar)
// ==========================================

import { Log, Validate, createVehicleConfigValidator, createNotEmptyValidator } from '../middleware/index.js';
import type { Vehicle, VehicleConfig, OperationResult } from '../types/index.js';

// ==========================================
// CLASE: CartService
// Responsabilidad: Gestionar el carrito de vehículos
// ==========================================
export class CartService {
  private vehicles: Map<string, Vehicle> = new Map();

  // ==========================================
  // HU9 - AGREGAR VEHÍCULO AL CARRITO
  // Flujo: 
  // 1. Usuario configura vehículo (8 categorías)
  // 2. Se guarda en el carrito
  // 3. Vuelve al menú principal
  // ==========================================
  @Log()
  @Validate(createNotEmptyValidator())
  @Validate(createVehicleConfigValidator())
  addVehicle(name: string, config: VehicleConfig): OperationResult<Vehicle> {
    const vehicle: Vehicle = {
      id: generateId(),
      name: name.trim(),
      config,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.vehicles.set(vehicle.id, vehicle);
    return {
      success: true,
      data: vehicle,
      message: `Vehículo "${vehicle.name}" creado exitosamente con ID: ${vehicle.id}`
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
