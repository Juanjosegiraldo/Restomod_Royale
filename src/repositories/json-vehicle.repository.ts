// ==========================================
// REPOSITORY - Persistencia en archivo JSON
// Guarda vehiculos en data/vehicles.json
// ==========================================

import * as fs from 'fs';
import * as path from 'path';
import type { IVehicleRepository } from './vehicle-repository.interface';
import type { Vehicle } from '../types/interfaces';
import { VehicleModel } from '../models/vehicle.model';

export class JsonVehicleRepository implements IVehicleRepository {
  private filePath: string;

  constructor() {
    // Guardar en src/data/vehicles.json
    this.filePath = path.join(__dirname, '..', 'data', 'vehicles.json');
    this.ensureFileExists();
  }

  private ensureFileExists(): void {
    const dir = path.dirname(this.filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    if (!fs.existsSync(this.filePath)) {
      fs.writeFileSync(this.filePath, '[]', 'utf-8');
    }
  }

  private readFile(): Vehicle[] {
    try {
      const data = fs.readFileSync(this.filePath, 'utf-8');
      const parsed = JSON.parse(data) as any[];
      // Reconstruir objetos VehicleModel desde JSON plano
      return parsed.map(v => new VehicleModel(
        v.id,
        v.name,
        v.config
      ));
    } catch {
      return [];
    }
  }

  private writeFile(vehicles: Vehicle[]): void {
    fs.writeFileSync(this.filePath, JSON.stringify(vehicles, null, 2), 'utf-8');
  }

  findAll(): Vehicle[] {
    return this.readFile();
  }

  findById(id: string): Vehicle | undefined {
    const vehicles = this.readFile();
    return vehicles.find(v => v.id === id);
  }

  create(vehicle: Vehicle): Vehicle {
    const vehicles = this.readFile();
    vehicles.push(vehicle);
    this.writeFile(vehicles);
    return vehicle;
  }

  update(id: string, vehicleData: Partial<Vehicle>): Vehicle | undefined {
    const vehicles = this.readFile();
    const index = vehicles.findIndex(v => v.id === id);
    if (index === -1) return undefined;

    const existing = vehicles[index]!;
    if (vehicleData.name) existing.name = vehicleData.name;
    if (vehicleData.config) existing.config = vehicleData.config;

    this.writeFile(vehicles);
    return existing;
  }

  delete(id: string): boolean {
    const vehicles = this.readFile();
    const index = vehicles.findIndex(v => v.id === id);
    if (index === -1) return false;

    vehicles.splice(index, 1);
    this.writeFile(vehicles);
    return true;
  }
}
