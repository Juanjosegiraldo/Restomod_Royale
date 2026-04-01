//import './services/index.js'; 
import {
  question,
  keyInYN,
  keyInSelect,
  PROMPTS,
  MESSAGES,
  CONFIG_OPTIONS,
  MENU_OPTIONS
} from "./config/constants";

import { VehicleService } from "./services/vehicle.service.js";
import { Cart } from "./models/cart.model.js";
import type { Vehicle } from "./types";

const service = new VehicleService();
const cart = new Cart();

// ==========================
// VALIDADOR DE OPCIONES
// ==========================
function matchOption(input: string, options: readonly string[]): boolean {
  return options.includes(input.toLowerCase());
}

// ==========================
// HELPER PARA SELECT
// ==========================
function questionSelect(options: readonly string[], prompt: string): number {
  return keyInSelect([...options], prompt);
}

// ==========================
// MENU PRINCIPAL
// ==========================
function mainMenu(): void {
  while (true) {
    const option = question(PROMPTS.MAIN_MENU).toLowerCase();

    if (matchOption(option, MENU_OPTIONS.CREATE_VEHICLE)) {
      createVehicle();

    } else if (matchOption(option, MENU_OPTIONS.VIEW_VEHICLES)) {
      viewVehicles();

    } else if (option === "3") {
      viewCart();

    } else if (matchOption(option, MENU_OPTIONS.EXIT)) {
      if (keyInYN(PROMPTS.CONFIRM_EXIT)) {
        console.log(MESSAGES.SUCCESS_EXIT);
        break;
      }

    } else {
      console.log(MESSAGES.ERROR_INVALID);
    }
  }
}

// ==========================
// CREAR VEHICULO
// ==========================
function createVehicle(): void {
  const name = question(PROMPTS.VEHICLE_NAME);

  const motorIndex = questionSelect(CONFIG_OPTIONS.MOTOR, PROMPTS.SELECT_MOTOR);
  if (motorIndex === -1) return;

  const pinturaIndex = questionSelect(CONFIG_OPTIONS.PINTURA, PROMPTS.SELECT_PINTURA);
  if (pinturaIndex === -1) return;

  const rinesIndex = questionSelect(CONFIG_OPTIONS.RINES, PROMPTS.SELECT_RINES);
  if (rinesIndex === -1) return;

  const interiorIndex = questionSelect(CONFIG_OPTIONS.INTERIOR, PROMPTS.SELECT_INTERIOR);
  if (interiorIndex === -1) return;

  const suspensionIndex = questionSelect(CONFIG_OPTIONS.SUSPENSION, PROMPTS.SELECT_SUSPENSION);
  if (suspensionIndex === -1) return;

  const tecnologiaIndex = questionSelect(CONFIG_OPTIONS.TECNOLOGIA, PROMPTS.SELECT_TECNOLOGIA);
  if (tecnologiaIndex === -1) return;

  const vehicle: Vehicle = service.create({
    name,
    config: {
        motor: CONFIG_OPTIONS.MOTOR[motorIndex] as typeof CONFIG_OPTIONS.MOTOR[number],
        pintura: CONFIG_OPTIONS.PINTURA[pinturaIndex] as typeof CONFIG_OPTIONS.PINTURA[number],
        rines: CONFIG_OPTIONS.RINES[rinesIndex] as typeof CONFIG_OPTIONS.RINES[number],
        interior: CONFIG_OPTIONS.INTERIOR[interiorIndex] as typeof CONFIG_OPTIONS.INTERIOR[number],
        suspension: CONFIG_OPTIONS.SUSPENSION[suspensionIndex] as typeof CONFIG_OPTIONS.SUSPENSION[number],
        tecnologia: CONFIG_OPTIONS.TECNOLOGIA[tecnologiaIndex] as typeof CONFIG_OPTIONS.TECNOLOGIA[number]
    }
  });

  service.addAccessories(vehicle);

  cart.add(vehicle);

  console.log(MESSAGES.SUCCESS_CREATED);
}

// ==========================
// VER VEHICULOS
// ==========================
function viewVehicles(): void {
  const vehicles = service.findAll();

  if (vehicles.length === 0) {
    console.log(PROMPTS.NO_VEHICLES);
    question("");
    return;
  }

  vehicles.forEach((v, i) => {
    console.log(`[${i}] ${v.name}`);
  });

  const index = Number(question(PROMPTS.SELECT_VEHICLE));
  const selected = vehicles[index];

  if (!selected) {
    console.log(MESSAGES.ERROR_NOT_FOUND);
    return;
  }

  vehicleMenu(selected);
}

// ==========================
// SUBMENU VEHICULO
// ==========================
function vehicleMenu(vehicle: Vehicle): void {
  while (true) {
    const option = question(PROMPTS.VEHICLE_SUBMENU(vehicle.name)).toLowerCase();

    if (matchOption(option, MENU_OPTIONS.VIEW_CONFIG)) {

      console.log("\nConfiguracion:");
      console.log(vehicle.config);

      console.log("\nAccesorios:");
      if (vehicle.accessories?.length) {
        vehicle.accessories.forEach(a =>
          console.log(`- ${a.name} (${a.material})`)
        );
      } else {
        console.log("Sin accesorios");
      }

      question(PROMPTS.CONTINUE);

    } else if (matchOption(option, MENU_OPTIONS.EDIT_CONFIG)) {

      console.log("Edicion no implementada aun 🚧");

    } else if (matchOption(option, MENU_OPTIONS.DELETE_VEHICLE)) {

      if (keyInYN(PROMPTS.CONFIRM_DELETE)) {
        service.delete(vehicle.id);
        console.log(MESSAGES.SUCCESS_DELETED);
        return;
      }

    } else if (matchOption(option, MENU_OPTIONS.GO_BACK)) {

      return;

    } else {
      console.log(MESSAGES.ERROR_INVALID);
    }
  }
}

// ==========================
// VER CARRITO
// ==========================
function viewCart(): void {
  const items = cart.getAll();

  if (items.length === 0) {
    console.log(MESSAGES.ERROR_EMPTY);
    return;
  }

  console.log("\n========= CARRITO =========\n");

  items.forEach((v, i) => {
    console.log(` [${i}] ${v.name}`);

    console.log("  Configuracion:");
    console.log(v.config);

    console.log("  Accesorios:");
    if (v.accessories?.length) {
      v.accessories.forEach(a =>
        console.log(`   - ${a.name} (${a.material})`)
      );
    } else {
      console.log("   Sin accesorios");
    }

    console.log("\n--------------------------\n");
  });

  question(PROMPTS.CONTINUE);
}

// ==========================
// START
// ==========================
mainMenu();

