// ==========================================
// VEHICLE SERVICE
// Cambios mínimos respecto al original:
//   1. Crea VehicleModel en vez de objeto plano
//   2. Usa generateId() de utils/id-generator
//   3. El setter config de VehicleModel actualiza updatedAt solo
//      (se elimina la línea vehicle.updatedAt = new Date())
// Todo lo demás queda idéntico
// ==========================================
 
import { CONFIG_OPTIONS } from '../config/constants.js';
import { vehicles } from '../data/database.js';
import { VehicleModel } from '../models/vehicle.model.js';
import type { OperationResult, Vehicle, VehicleConfig } from '../types/interfaces.js';
import { generateId } from '../utils/id-generator.js';
 
export class VehicleService {
  getAllVehicles(): Vehicle[] {
    return vehicles;
  }
 
  getVehicleById(id: string): Vehicle | undefined {
    return vehicles.find((vehicle) => vehicle.id === id);
  }
 
  createVehicle(name: string, config: VehicleConfig): OperationResult<Vehicle> {
    return this.saveVehicle(name, config);
  }
 
  saveVehicle(name: string, config: VehicleConfig): OperationResult<Vehicle> {
    const trimmedName = name.trim();
 
    if (!trimmedName) {
      return { success: false, error: 'El nombre del vehiculo es obligatorio.' };
    }
 
    // Ahora es un VehicleModel real en lugar de objeto plano
    const newVehicle = new VehicleModel(generateId('veh'), trimmedName, config);
 
    vehicles.push(newVehicle);
 
    return {
      success: true,
      data: newVehicle,
      message: 'Vehiculo guardado exitosamente!',
    };
  }
 
  updateVehicleConfig(id: string, config: VehicleConfig): OperationResult<Vehicle> {
    const vehicle = this.getVehicleById(id);
 
    if (!vehicle) {
      return { success: false, error: 'No se encontro el vehiculo.' };
    }
 
    // El setter config de VehicleModel llama a touch() internamente
    // ya no necesitamos vehicle.updatedAt = new Date() aquí
    vehicle.config = config;
 
    return {
      success: true,
      data: vehicle,
      message: 'Configuracion actualizada!',
    };
  }
 
  deleteVehicle(id: string): OperationResult {
    const vehicleIndex = vehicles.findIndex((vehicle) => vehicle.id === id);
 
    if (vehicleIndex === -1) {
      return { success: false, error: 'No se encontro el vehiculo.' };
    }
 
    vehicles.splice(vehicleIndex, 1);
 
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
 