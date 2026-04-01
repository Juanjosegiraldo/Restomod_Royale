// ==========================================
// RESTOMOD ROYALE - HU9 (Agregar Vehículo)
// Entry point - Demonstrates CartService functionality
// ==========================================

import { CartService } from './services/cart.service.js';
import { CONFIG_OPTIONS } from './config/constants.js';
import type { VehicleConfig } from './types/index.js';

console.log('========================================');
console.log('   RESTOMOD ROYALE - HU9 (Add Vehicle)  ');
console.log('========================================\n');

const cartService = new CartService();

// Demo: Create a vehicle with full config
const demoConfig: VehicleConfig = {
  motor: CONFIG_OPTIONS.MOTOR[0],
  pintura: CONFIG_OPTIONS.PINTURA[0],
  rines: CONFIG_OPTIONS.RINES[0],
  interior: CONFIG_OPTIONS.INTERIOR[0],
  suspension: CONFIG_OPTIONS.SUSPENSION[0],
  tecnologia: CONFIG_OPTIONS.TECNOLOGIA[0],
  techo: CONFIG_OPTIONS.TECHO[0],
  llantas: CONFIG_OPTIONS.LLANTAS[0]
};

console.log('1. Creating vehicle...');
const createResult = cartService.addVehicle('My Classic Mustang', demoConfig);
console.log('Result:', createResult);

if (createResult.success && createResult.data) {
  const vehicleId = createResult.data.id;

  console.log('\n2. Getting all vehicles...');
  const listResult = cartService.getAllVehicles();
  console.log('Result:', listResult);

  console.log('\n3. Updating vehicle config...');
  const updateResult = cartService.updateVehicle(vehicleId, { pintura: CONFIG_OPTIONS.PINTURA[1] });
  console.log('Result:', updateResult);

  console.log('\n4. Getting vehicle by ID...');
  const getResult = cartService.getVehicleById(vehicleId);
  console.log('Result:', getResult);

  console.log('\n5. Removing vehicle...');
  const deleteResult = cartService.removeVehicle(vehicleId);
  console.log('Result:', deleteResult);

  console.log('\n6. Verifying deletion (should fail)...');
  const verifyResult = cartService.getVehicleById(vehicleId);
  console.log('Result:', verifyResult);
}

console.log('\n========================================');
console.log('   HU9 Demo Complete!                 ');
console.log('========================================');
