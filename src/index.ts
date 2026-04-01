import { CONFIG_LABELS, CONFIG_OPTIONS, MENU_OPTIONS, MESSAGES, PROMPTS, keyInSelect, keyInYN, question } from './config/constants.js';
import { VehicleService } from './services/vehicle.service.js';
import type { Vehicle, VehicleConfig } from './types/interfaces.js';

const vehicleService = new VehicleService();

function pause(): void {
  question(`\n${PROMPTS.CONTINUE}`);
}

function matchesOption(input: string, aliases: readonly string[]): boolean {
  return aliases.includes(input.trim().toLowerCase());
}

function selectOption<T extends string>(options: readonly T[], prompt: string, currentValue?: T): T {
  const fallbackOption = options[0]!;
  const label = currentValue ? `${prompt}\nActual: ${currentValue}` : prompt;
  const selectedIndex = keyInSelect([...options], `${label}\n`);

  if (selectedIndex === -1) {
    return currentValue ?? fallbackOption;
  }

  return options[selectedIndex] ?? fallbackOption;
}

function configureVehicle(baseConfig?: VehicleConfig): VehicleConfig {
  const currentConfig = baseConfig ?? vehicleService.createDefaultConfig();

  return {
    motor: selectOption(CONFIG_OPTIONS.MOTOR, PROMPTS.SELECT_MOTOR, currentConfig.motor),
    pintura: selectOption(CONFIG_OPTIONS.PINTURA, PROMPTS.SELECT_PINTURA, currentConfig.pintura),
    rines: selectOption(CONFIG_OPTIONS.RINES, PROMPTS.SELECT_RINES, currentConfig.rines),
    techo: selectOption(CONFIG_OPTIONS.TECHO, PROMPTS.SELECT_TECHO, currentConfig.techo),
    interior: selectOption(CONFIG_OPTIONS.INTERIOR, PROMPTS.SELECT_INTERIOR, currentConfig.interior),
    suspension: selectOption(CONFIG_OPTIONS.SUSPENSION, PROMPTS.SELECT_SUSPENSION, currentConfig.suspension),
    tecnologia: selectOption(CONFIG_OPTIONS.TECNOLOGIA, PROMPTS.SELECT_TECNOLOGIA, currentConfig.tecnologia)
  };
}

function printVehicleConfig(vehicle: Vehicle): void {
  console.log('\n========================================');
  console.log(`Configuracion de ${vehicle.name}`);
  console.log('========================================');
  console.log(`ID: ${vehicle.id}`);
  console.log(`${CONFIG_LABELS.MOTOR}: ${vehicle.config.motor}`);
  console.log(`${CONFIG_LABELS.PINTURA}: ${vehicle.config.pintura}`);
  console.log(`${CONFIG_LABELS.RINES}: ${vehicle.config.rines}`);
  console.log(`${CONFIG_LABELS.TECHO}: ${vehicle.config.techo}`);
  console.log(`${CONFIG_LABELS.INTERIOR}: ${vehicle.config.interior}`);
  console.log(`${CONFIG_LABELS.SUSPENSION}: ${vehicle.config.suspension}`);
  console.log(`${CONFIG_LABELS.TECNOLOGIA}: ${vehicle.config.tecnologia}`);
  console.log(`Creado: ${vehicle.createdAt.toLocaleString()}`);
  console.log(`Actualizado: ${vehicle.updatedAt.toLocaleString()}`);
}

function createVehicleFlow(): void {
  const vehicleName = question(`\n${PROMPTS.VEHICLE_NAME}`).trim();

  if (!vehicleName) {
    console.log(MESSAGES.CANCELLED);
    pause();
    return;
  }

  const vehicleConfig = configureVehicle();
  const result = vehicleService.saveVehicle(vehicleName, vehicleConfig);

  console.log(result.message ?? result.error ?? MESSAGES.ERROR_INVALID);

  if (result.data) {
    printVehicleConfig(result.data);
  }

  pause();
}

function editVehicleFlow(vehicle: Vehicle): void {
  const updatedConfig = { ...vehicle.config };
  let shouldContinueEditing = true;

  while (shouldContinueEditing) {
    const selectedOption = question(PROMPTS.EDIT_MENU).trim();

    switch (selectedOption) {
      case '1':
        updatedConfig.motor = selectOption(CONFIG_OPTIONS.MOTOR, PROMPTS.SELECT_MOTOR, updatedConfig.motor);
        break;
      case '2':
        updatedConfig.pintura = selectOption(CONFIG_OPTIONS.PINTURA, PROMPTS.SELECT_PINTURA, updatedConfig.pintura);
        break;
      case '3':
        updatedConfig.rines = selectOption(CONFIG_OPTIONS.RINES, PROMPTS.SELECT_RINES, updatedConfig.rines);
        break;
      case '4':
        updatedConfig.techo = selectOption(CONFIG_OPTIONS.TECHO, PROMPTS.SELECT_TECHO, updatedConfig.techo);
        break;
      case '5':
        updatedConfig.interior = selectOption(CONFIG_OPTIONS.INTERIOR, PROMPTS.SELECT_INTERIOR, updatedConfig.interior);
        break;
      case '6':
        updatedConfig.suspension = selectOption(CONFIG_OPTIONS.SUSPENSION, PROMPTS.SELECT_SUSPENSION, updatedConfig.suspension);
        break;
      case '7':
        updatedConfig.tecnologia = selectOption(CONFIG_OPTIONS.TECNOLOGIA, PROMPTS.SELECT_TECNOLOGIA, updatedConfig.tecnologia);
        break;
      case '0':
        shouldContinueEditing = false;
        break;
      default:
        console.log(MESSAGES.ERROR_INVALID);
    }
  }

  const result = vehicleService.updateVehicleConfig(vehicle.id, updatedConfig);
  console.log(result.message ?? result.error ?? MESSAGES.ERROR_INVALID);
  pause();
}

function selectedVehicleMenu(vehicle: Vehicle): void {
  let goBack = false;

  while (!goBack) {
    const option = question(PROMPTS.VEHICLE_SUBMENU(vehicle.name)).trim().toLowerCase();

    if (matchesOption(option, MENU_OPTIONS.VIEW_CONFIG)) {
      printVehicleConfig(vehicle);
      pause();
      continue;
    }

    if (matchesOption(option, MENU_OPTIONS.EDIT_CONFIG)) {
      editVehicleFlow(vehicle);
      continue;
    }

    if (matchesOption(option, MENU_OPTIONS.DELETE_VEHICLE)) {
      const confirmed = keyInYN(`\n${PROMPTS.CONFIRM_DELETE}`);

      if (confirmed) {
        const result = vehicleService.deleteVehicle(vehicle.id);
        console.log(result.message ?? result.error ?? MESSAGES.ERROR_INVALID);
        pause();
        return;
      }

      console.log(MESSAGES.CANCELLED);
      pause();
      continue;
    }

    if (matchesOption(option, MENU_OPTIONS.GO_BACK)) {
      goBack = true;
      continue;
    }

    console.log(MESSAGES.ERROR_INVALID);
    pause();
  }
}

function viewVehiclesFlow(): void {
  const vehicles = vehicleService.getAllVehicles();

  if (vehicles.length === 0) {
    console.log(MESSAGES.ERROR_EMPTY);
    pause();
    return;
  }

  const selectedIndex = keyInSelect(
    vehicles.map((vehicle) => vehicle.name),
    '\nSeleccione un vehiculo: '
  );

  if (selectedIndex === -1) {
    return;
  }

  const selectedVehicle = vehicles[selectedIndex];

  if (!selectedVehicle) {
    console.log(MESSAGES.ERROR_NOT_FOUND);
    pause();
    return;
  }

  selectedVehicleMenu(selectedVehicle);
}

function main(): void {
  let running = true;

  while (running) {
    const selectedOption = question(PROMPTS.MAIN_MENU).trim().toLowerCase();

    if (matchesOption(selectedOption, MENU_OPTIONS.CREATE_VEHICLE)) {
      createVehicleFlow();
      continue;
    }

    if (matchesOption(selectedOption, MENU_OPTIONS.VIEW_VEHICLES)) {
      viewVehiclesFlow();
      continue;
    }

    if (matchesOption(selectedOption, MENU_OPTIONS.EXIT)) {
      const confirmed = keyInYN(`\n${PROMPTS.CONFIRM_EXIT}`);

      if (confirmed) {
        console.log(MESSAGES.SUCCESS_EXIT);
        running = false;
      }

      continue;
    }

    console.log(MESSAGES.ERROR_INVALID);
    pause();
  }
}

main();
