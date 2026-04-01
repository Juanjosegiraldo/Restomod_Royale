// ==========================================
// RESTOMOD ROYALE - HU12 (Eliminar Vehículo)
// Entry point - Demonstrates CartService functionality
// ==========================================

import { CartService } from './services/cart.service.js';
import { CONFIG_OPTIONS } from './config/constants.js';
import type { VehicleConfig } from './types/index.js';

console.log('========================================');
console.log('   RESTOMOD ROYALE - HU12 (Delete Vehicle) ');
console.log('========================================\n');

const cartService = new CartService();

// Demo: Create multiple vehicles
const configs: VehicleConfig[] = [
  {
    motor: CONFIG_OPTIONS.MOTOR[2],
    pintura: CONFIG_OPTIONS.PINTURA[3],
    rines: CONFIG_OPTIONS.RINES[2],
    interior: CONFIG_OPTIONS.INTERIOR[3],
    suspension: CONFIG_OPTIONS.SUSPENSION[2],
    tecnologia: CONFIG_OPTIONS.TECNOLOGIA[3],
    techo: CONFIG_OPTIONS.TECHO[2],
    llantas: CONFIG_OPTIONS.LLANTAS[1]
  },
  {
    motor: CONFIG_OPTIONS.MOTOR[3],
    pintura: CONFIG_OPTIONS.PINTURA[1],
    rines: CONFIG_OPTIONS.RINES[4],
    interior: CONFIG_OPTIONS.INTERIOR[4],
    suspension: CONFIG_OPTIONS.SUSPENSION[3],
    tecnologia: CONFIG_OPTIONS.TECNOLOGIA[4],
    techo: CONFIG_OPTIONS.TECHO[3],
    llantas: CONFIG_OPTIONS.LLANTAS[4]
  }
];

console.log('1. Creating vehicles...');
const result1 = cartService.addVehicle('First Vehicle', configs[0]!);
const result2 = cartService.addVehicle('Second Vehicle', configs[1]!);
console.log('Result 1:', result1);
console.log('Result 2:', result2);

console.log('\n2. Listing all vehicles...');
const listResult = cartService.getAllVehicles();
console.log('Result:', listResult);

if (result1.success && result1.data) {
  const vehicleId = result1.data.id;

  console.log('\n3. Deleting first vehicle...');
  const deleteResult = cartService.removeVehicle(vehicleId);
  console.log('Result:', deleteResult);

  console.log('\n4. Verifying deletion (should fail)...');
  const verifyResult = cartService.getVehicleById(vehicleId);
  console.log('Result:', verifyResult);

  console.log('\n5. Testing delete non-existing vehicle (should fail)...');
  const failResult = cartService.removeVehicle('non-existing-id');
  console.log('Result:', failResult);
}

console.log('\n6. Listing remaining vehicles...');
const finalList = cartService.getAllVehicles();
console.log('Result:', finalList);

console.log('\n========================================');
console.log('   HU12 Demo Complete!                 ');
console.log('========================================');
