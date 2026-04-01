import { CONFIG_OPTIONS } from '../config/constants.js';
import { vehicles } from '../data/database.js';
import type { OperationResult, Vehicle, VehicleConfig } from '../types/interfaces.js';

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

    const newVehicle: Vehicle = {
      id: this.generateId(),
      name: trimmedName,
      config,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    vehicles.push(newVehicle);

    return {
      success: true,
      data: newVehicle,
      message: 'Vehiculo guardado exitosamente!'
    };
  }

  updateVehicleConfig(id: string, config: VehicleConfig): OperationResult<Vehicle> {
    const vehicle = this.getVehicleById(id);

    if (!vehicle) {
      return { success: false, error: 'No se encontro el vehiculo.' };
    }

    vehicle.config = config;
    vehicle.updatedAt = new Date();

    return {
      success: true,
      data: vehicle,
      message: 'Configuracion actualizada!'
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
      message: 'Contrato cancelado y vehiculo eliminado.'
    };
  }

  createDefaultConfig(): VehicleConfig {
    return {
      motor: CONFIG_OPTIONS.MOTOR[0],
      pintura: CONFIG_OPTIONS.PINTURA[0],
      rines: CONFIG_OPTIONS.RINES[0],
      techo: CONFIG_OPTIONS.TECHO[0],
      interior: CONFIG_OPTIONS.INTERIOR[0],
      suspension: CONFIG_OPTIONS.SUSPENSION[0],
      tecnologia: CONFIG_OPTIONS.TECNOLOGIA[0]
    };
  }

  private generateId(): string {
    return `veh-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  }
}
