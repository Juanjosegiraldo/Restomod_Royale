// ==========================================
// REPOSITORY - Implementación en memoria
// Aplica: DIP (implementa interfaz abstracta)
// ==========================================

import type { IVehicleRepository } from './vehicle-repository.interface';
import type { Vehicle } from '../types/interfaces';

export class InMemoryVehicleRepository implements IVehicleRepository {
  private vehicles: Vehicle[] = [];

  findAll(): Vehicle[] {
    return [...this.vehicles];
  }

  findById(id: string): Vehicle | undefined {
    return this.vehicles.find(v => v.id === id);
  }

  create(vehicle: Vehicle): Vehicle {
    this.vehicles.push(vehicle);
    return vehicle;
  }

  update(id: string, vehicle: Partial<Vehicle>): Vehicle | undefined {
    const index = this.vehicles.findIndex(v => v.id === id);
    if (index === -1) return undefined;
    
    const existing = this.vehicles[index]!;
    if (vehicle.name) existing.name = vehicle.name;
    if (vehicle.config) existing.config = vehicle.config;
    
    return existing;
  }

  delete(id: string): boolean {
    const index = this.vehicles.findIndex(v => v.id === id);
    if (index === -1) return false;
    this.vehicles.splice(index, 1);
    return true;
  }
}
