import { Vehicle } from "../types";

export class Cart {
  private items: Vehicle[] = [];

  add(vehicle: Vehicle): void {
    this.items.push(vehicle);
  }

  getAll(): Vehicle[] {
    return this.items;
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }
} 

