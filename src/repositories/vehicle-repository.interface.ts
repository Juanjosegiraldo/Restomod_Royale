// ==========================================
// REPOSITORY INTERFACE - Contrato para persistencia
// Aplica: DIP (Dependencia de abstracción)
// ==========================================

import type { Vehicle } from '../types/interfaces';

export interface IVehicleRepository {
  findAll(): Vehicle[];
  findById(id: string): Vehicle | undefined;
  create(vehicle: Vehicle): Vehicle;
  update(id: string, vehicle: Partial<Vehicle>): Vehicle | undefined;
  delete(id: string): boolean;
}
