// ==========================================
// SERVICE LAYER - Logica de negocio
// Aplica: SRP (orquesta repositorio), DIP (inyeccion de dependencias)
// ==========================================

import type { IVehicleRepository } from '../repositories/vehicle-repository.interface.js';
import type { VehicleConfig } from '../types/index.js';
import { Vehicle } from '../models/vehicle.model.js';
import type { OperationResult } from '../types/index.js';

export class VehicleService {
  constructor(private readonly repository: IVehicleRepository) {}

  create(name: string, config: VehicleConfig): OperationResult<Vehicle> {
    try {
      const vehicle = Vehicle.create(name, config);
      const saved = this.repository.create(vehicle);
      return { success: true, data: saved, message: 'Vehiculo creado' };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  }

  getById(id: string): OperationResult<Vehicle> {
    const vehicle = this.repository.findById(id);
    if (!vehicle) {
      return { success: false, error: 'Vehiculo no encontrado' };
    }
    return { success: true, data: vehicle };
  }

  listAll(): OperationResult<Vehicle[]> {
    const vehicles = this.repository.findAll();
    return { 
      success: true, 
      data: vehicles, 
      message: vehicles.length > 0 ? `${vehicles.length} vehiculos` : 'Sin vehiculos' 
    };
  }

  updateConfig(id: string, config: Partial<VehicleConfig>): OperationResult<Vehicle> {
    const vehicle = this.repository.findById(id);
    if (!vehicle) {
      return { success: false, error: 'Vehiculo no encontrado' };
    }
    vehicle.updateConfig(config);
    return { success: true, data: vehicle, message: 'Configuracion actualizada' };
  }

  delete(id: string): OperationResult<void> {
    const exists = this.repository.findById(id);
    if (!exists) {
      return { success: false, error: 'Vehiculo no encontrado' };
    }
    const deleted = this.repository.delete(id);
    return deleted 
      ? { success: true, message: 'Contrato cancelado' }
      : { success: false, error: 'Error al eliminar' };
  }
}
