import { randomUUID } from "crypto"; 

import { vehicles } from "../data/database.js";
import { ACCESSORIES, MATERIALS, keyInSelect, keyInYN } from "../config/constants.js"; // ✅ tenía .j

import type {
  Vehicle,
  CreateVehicleDTO,
  UpdateVehicleDTO,
  Accessory
} from "../types";

export class VehicleService {

  addAccessories(vehicle: Vehicle): void {
    const accessories: Accessory[] = [];

    while (true) {
      const accessoryIndex = keyInSelect(
        [...ACCESSORIES],
        "Seleccione un accesorio:"
      );

      if (accessoryIndex === -1) break;

      const materialIndex = keyInSelect(
        [...MATERIALS],
        "Seleccione el material:"
      );

      if (materialIndex === -1) break;

      const newAccessory: Accessory = {
        name: ACCESSORIES[accessoryIndex] as string,
        material: MATERIALS[materialIndex] as string,
      };

      // evitar duplicados
      if (!accessories.find(a => a.name === newAccessory.name)) {
        accessories.push(newAccessory);
      }

      const addMore = keyInYN("Desea agregar otro accesorio?");
      if (!addMore) break;
    }

    vehicle.accessories = accessories;
  }

  // ==========================
  // CREATE
  // ==========================
  create(data: CreateVehicleDTO): Vehicle {
    const newVehicle: Vehicle = {
      id: randomUUID(), // ✅ FIX AQUÍ
      createdAt: new Date(),
      updatedAt: new Date(),
      ...data
    };

    vehicles.push(newVehicle);
    return newVehicle;
  }

  // ==========================
  // READ
  // ==========================
  findAll(): Vehicle[] {
    return vehicles;
  }

  findById(id: string): Vehicle | undefined {
    return vehicles.find(v => v.id === id);
  }

  // ==========================
  // UPDATE
  // ==========================
  update(id: string, data: UpdateVehicleDTO): Vehicle | null {
    const vehicle = this.findById(id);

    if (!vehicle) return null;

    Object.assign(vehicle, data, {
      updatedAt: new Date()
    });

    return vehicle;
  }

  // ==========================
  // DELETE
  // ==========================
  delete(id: string): boolean {
    const index = vehicles.findIndex(v => v.id === id);

    if (index === -1) return false;

    vehicles.splice(index, 1);
    return true;
  }

}