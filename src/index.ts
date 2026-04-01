// ==========================================
// RESTOMOD ROYALE - HU11 (Editar Vehículo)
// Entry point - Demonstrates CartService functionality
// ==========================================

import { CartService } from './services/cart.service.js';
import { CONFIG_OPTIONS } from './config/constants.js';
import type { VehicleConfig } from './types/index.js';

console.log('========================================');
console.log('   RESTOMOD ROYALE - HU11 (Edit Vehicle) ');
console.log('========================================\n');

const cartService = new CartService();

// Demo: Create a vehicle with full config
const demoConfig: VehicleConfig = {
  motor: CONFIG_OPTIONS.MOTOR[1],
  pintura: CONFIG_OPTIONS.PINTURA[2],
  rines: CONFIG_OPTIONS.RINES[1],
  interior: CONFIG_OPTIONS.INTERIOR[2],
  suspension: CONFIG_OPTIONS.SUSPENSION[1],
  tecnologia: CONFIG_OPTIONS.TECNOLOGIA[2],
  techo: CONFIG_OPTIONS.TECHO[1],
  llantas: CONFIG_OPTIONS.LLANTAS[2]
};

console.log('1. Creating vehicle...');
const createResult = cartService.addVehicle('My Sport Camaro', demoConfig);
console.log('Result:', createResult);

if (createResult.success && createResult.data) {
  const vehicleId = createResult.data.id;

  console.log('\n2. Editing vehicle (changing multiple fields)...');
  const updateResult = cartService.updateVehicle(vehicleId, {
    pintura: CONFIG_OPTIONS.PINTURA[4],
    rines: CONFIG_OPTIONS.RINES[3],
    llantas: CONFIG_OPTIONS.LLANTAS[3]
  });
  console.log('Result:', updateResult);

  console.log('\n3. Getting updated vehicle...');
  const getResult = cartService.getVehicleById(vehicleId);
  console.log('Result:', getResult);

  console.log('\n4. Testing edit non-existing vehicle (should fail)...');
  const failResult = cartService.updateVehicle('invalid-id', { motor: CONFIG_OPTIONS.MOTOR[0] });
  console.log('Result:', failResult);

  console.log('\n5. Removing vehicle...');
  const deleteResult = cartService.removeVehicle(vehicleId);
  console.log('Result:', deleteResult);
}

console.log('\n========================================');
console.log('   HU11 Demo Complete!                ');
console.log('========================================');
