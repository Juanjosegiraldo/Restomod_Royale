// ==========================================
// VEHICLE SERVICE
// Cambios mínimos respecto al original:
//   1. Crea VehicleModel en vez de objeto plano
//   2. Usa generateId() de utils/id-generator
//   3. El setter config de VehicleModel actualiza updatedAt solo
//      (se elimina la línea vehicle.updatedAt = new Date())
// Todo lo demás queda idéntico
// ==========================================

import { CONFIG_OPTIONS } from '../config/constants';
import { Log, Validate } from '../middleware/decorators';
import { createNotEmptyValidator, createVehicleConfigValidator } from '../middleware/validations';
import { VehicleModel } from '../models/vehicle.model';
import { InMemoryVehicleRepository } from '../repositories/in-memory-vehicle.repository';
import { JsonVehicleRepository } from '../repositories/json-vehicle.repository';
import type { OperationResult, Vehicle, VehicleConfig } from '../types/interfaces';
import { generateId } from '../utils/id-generator';

// Repositorio para almacenar vehiculos (persiste en archivo JSON)
const vehicleRepository = new JsonVehicleRepository();

export class VehicleService {
  @Log()
  getAllVehicles(): Vehicle[] {
    return vehicleRepository.findAll();
  }

  @Log()
  getVehicleById(id: string): Vehicle | undefined {
    return vehicleRepository.findById(id);
  }
 
  createVehicle(name: string, config: VehicleConfig): OperationResult<Vehicle> {
    return this.saveVehicle(name, config);
  }
 
  @Log()
  @Validate(createNotEmptyValidator())
  saveVehicle(name: string, config: VehicleConfig): OperationResult<Vehicle> {
    const trimmedName = name.trim();

    if (!trimmedName) {
      return { success: false, error: 'El nombre del vehiculo es obligatorio.' };
    }

    // Ahora es un VehicleModel real en lugar de objeto plano
    const newVehicle = new VehicleModel(generateId(), trimmedName, config);
    vehicleRepository.create(newVehicle);

    return {
      success: true,
      data: newVehicle,
      message: 'Vehiculo guardado exitosamente!',
    };
  }
 
  @Log()
  @Validate(createVehicleConfigValidator())
  updateVehicleConfig(id: string, config: VehicleConfig): OperationResult<Vehicle> {
    const vehicle = this.getVehicleById(id);

    if (!vehicle) {
      return { success: false, error: 'No se encontro el vehiculo.' };
    }

    vehicleRepository.update(id, { config });

    return {
      success: true,
      data: vehicle,
      message: 'Configuracion actualizada!',
    };
  }
 
  @Log()
  deleteVehicle(id: string): OperationResult {
    const deleted = vehicleRepository.delete(id);

    if (!deleted) {
      return { success: false, error: 'No se encontro el vehiculo.' };
    }

    return {
      success: true,
      message: 'Contrato cancelado y vehiculo eliminado.',
    };
  }

  createDefaultConfig(): VehicleConfig {
    return {
      motor:      CONFIG_OPTIONS.MOTOR[0],
      pintura:    CONFIG_OPTIONS.PINTURA[0],
      rines:      CONFIG_OPTIONS.RINES[0],
      techo:      CONFIG_OPTIONS.TECHO[0],
      interior:   CONFIG_OPTIONS.INTERIOR[0],
      suspension: CONFIG_OPTIONS.SUSPENSION[0],
      tecnologia: CONFIG_OPTIONS.TECNOLOGIA[0],
      llantas:    CONFIG_OPTIONS.LLANTAS[0],
    };
  }
}