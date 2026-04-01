import { generateId } from '../utils/id-generator.js';

// ==========================================
// CART SERVICE - CRUD del carrito
// Historia: HU9 (Agregar), HU11 (Editar), HU12 (Eliminar)
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
  // HU11 - EDITAR CONFIGURACIÓN DE VEHÍCULO
  // ==========================================
  @Log()
  updateVehicle(vehicleId: string, newConfig: Partial<VehicleConfig>): OperationResult<Vehicle> {
    const found = this.findVehicleOrError(vehicleId);
    if (!found.success) return { success: false, error: found.error };
    
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
  // HU12 - ELIMINAR VEHÍCULO (Cancelar contrato)
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

  // ==========================================
  // HELPERS PÚBLICOS
  // ==========================================
  getVehicleById(vehicleId: string): OperationResult<Vehicle> {
    const vehicle = this.vehicles.get(vehicleId);
    if (!vehicle) {
      return { success: false, error: `Vehículo con ID ${vehicleId} no encontrado` };
    }
    return { success: true, data: vehicle };
  }

  getAllVehicles(): OperationResult<Vehicle[]> {
    const vehicles = Array.from(this.vehicles.values());
    return {
      success: true,
      data: vehicles,
      message: vehicles.length > 0 ? `${vehicles.length} vehículo(s) en el carrito` : 'Carrito vacío'
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
