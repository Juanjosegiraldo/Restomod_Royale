import { generateId } from '../utils/id-generator.js';

// ==========================================
// CART SERVICE - CRUD del carrito con decoradores
// Historias: HU9 (Agregar), HU11 (Editar), HU12 (Eliminar)
// ==========================================

import { Log, Validate, createVehicleConfigValidator, createNotEmptyValidator } from '../middleware/index.js';
import type { Vehicle, VehicleConfig, OperationResult } from '../types/index.js';

// ==========================================
// CLASE: CartService
// Responsabilidad: Gestionar el carrito de vehículos
// - Agregar vehículos con configuración completa
// - Listar vehículos guardados
// - Editar configuración de vehículo
// - Eliminar vehículo (cancelar contrato)
// ==========================================
export class CartService {
  // Almacenamiento local (in-memory)
  private vehicles: Map<string, Vehicle> = new Map();

  // ==========================================
  // HU9 - AGREGAR VEHÍCULO AL CARRITO
  // Flujo: 
  // 1. Usuario configura vehículo (8 categorías: motor, pintura, rines, interior, suspension, tecnologia, techo, llantas)
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
  // Retorna array de vehículos para mostrar en menú
  // ==========================================
  @Log()
  listVehicles(): OperationResult<Vehicle[]> {
    const vehicles = Array.from(this.vehicles.values());
    
    return {
      success: true,
      data: vehicles,
      message: vehicles.length > 0 
        ? `Se encontraron ${vehicles.length} vehículo(s)` 
        : 'No hay vehículos registrados'
    };
  }

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

  // ==========================================
  // OBTENER VEHÍCULO POR ID
  // Para mostrar detalles en "Ver configuración"
  // ==========================================
  @Log()
  getVehicle(vehicleId: string): OperationResult<Vehicle> {
    const found = this.findVehicleOrError(vehicleId);
    return found.success 
      ? { success: true, data: found.vehicle }
      : found;
  }

  // ==========================================
  // CONTAR VEHÍCULOS
  // Para mostrar cantidad en el menú principal
  // ==========================================
  @Log()
  count(): number {
    return this.vehicles.size;
  }
}
