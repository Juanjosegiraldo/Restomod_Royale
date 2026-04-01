import { BASE_PRICE, CONFIG_LABELS, CONFIG_OPTIONS, CONFIG_PRICES, MENU_OPTIONS, MESSAGES, PROMPTS, keyInSelect, keyInYN, question } from './config/constants';
import { VehicleModel } from './models/vehicle.model';
import { VehicleService } from './services/vehicle.service';
import type { Vehicle, VehicleConfig } from './types/interfaces';
import { generarImagenAuto } from './utils/image-generator';
import { delay, loading } from './utils/delay';

const vehicleService = new VehicleService();

// Funcion para calcular el precio total de un vehiculo
function calculateTotalPrice(config: VehicleConfig): number {
  const motorIndex = CONFIG_OPTIONS.MOTOR.indexOf(config.motor);
  const pinturaIndex = CONFIG_OPTIONS.PINTURA.indexOf(config.pintura);
  const rinesIndex = CONFIG_OPTIONS.RINES.indexOf(config.rines);
  const techoIndex = CONFIG_OPTIONS.TECHO.indexOf(config.techo);
  const interiorIndex = CONFIG_OPTIONS.INTERIOR.indexOf(config.interior);
  const suspensionIndex = CONFIG_OPTIONS.SUSPENSION.indexOf(config.suspension);
  const tecnologiaIndex = CONFIG_OPTIONS.TECNOLOGIA.indexOf(config.tecnologia);
  const llantasIndex = CONFIG_OPTIONS.LLANTAS.indexOf(config.llantas);

  const motorPrice = CONFIG_PRICES.MOTOR[motorIndex] ?? 0;
  const pinturaPrice = CONFIG_PRICES.PINTURA[pinturaIndex] ?? 0;
  const rinesPrice = CONFIG_PRICES.RINES[rinesIndex] ?? 0;
  const techoPrice = CONFIG_PRICES.TECHO[techoIndex] ?? 0;
  const interiorPrice = CONFIG_PRICES.INTERIOR[interiorIndex] ?? 0;
  const suspensionPrice = CONFIG_PRICES.SUSPENSION[suspensionIndex] ?? 0;
  const tecnologiaPrice = CONFIG_PRICES.TECNOLOGIA[tecnologiaIndex] ?? 0;
  const llantasPrice = CONFIG_PRICES.LLANTAS[llantasIndex] ?? 0;

  return BASE_PRICE + motorPrice + pinturaPrice + rinesPrice + techoPrice + interiorPrice + suspensionPrice + tecnologiaPrice + llantasPrice;
}

function formatPrice(price: number): string {
  return `$${price.toLocaleString('en-US')}`;
}

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
    motor:      selectOption(CONFIG_OPTIONS.MOTOR,      PROMPTS.SELECT_MOTOR,      currentConfig.motor),
    pintura:    selectOption(CONFIG_OPTIONS.PINTURA,    PROMPTS.SELECT_PINTURA,    currentConfig.pintura),
    rines:      selectOption(CONFIG_OPTIONS.RINES,      PROMPTS.SELECT_RINES,      currentConfig.rines),
    techo:      selectOption(CONFIG_OPTIONS.TECHO,      PROMPTS.SELECT_TECHO,      currentConfig.techo),
    interior:   selectOption(CONFIG_OPTIONS.INTERIOR,   PROMPTS.SELECT_INTERIOR,   currentConfig.interior),
    suspension: selectOption(CONFIG_OPTIONS.SUSPENSION, PROMPTS.SELECT_SUSPENSION, currentConfig.suspension),
    tecnologia: selectOption(CONFIG_OPTIONS.TECNOLOGIA, PROMPTS.SELECT_TECNOLOGIA, currentConfig.tecnologia),
    llantas:    selectOption(CONFIG_OPTIONS.LLANTAS,    PROMPTS.SELECT_LLANTAS,    currentConfig.llantas),
  };
}

function printVehicleConfig(vehicle: Vehicle): void {
  console.log('\n========================================');
  console.log(`Configuracion de ${vehicle.name}`);
  console.log('========================================');
  console.log(`ID: ${vehicle.id}`);

  if (vehicle instanceof VehicleModel) {
    console.log(`${CONFIG_LABELS.MOTOR}: ${vehicle.config.motor}`);
    console.log(`  ↳ Potencia    : ${vehicle.potenciaHP} HP  |  ${vehicle.categoriaRendimiento}`);
    console.log(`${CONFIG_LABELS.PINTURA}: ${vehicle.config.pintura}`);
    console.log(`  ↳ Acabado     : ${vehicle.acabadoPintura}`);
  } else {
    console.log(`${CONFIG_LABELS.MOTOR}: ${vehicle.config.motor}`);
    console.log(`${CONFIG_LABELS.PINTURA}: ${vehicle.config.pintura}`);
  }

  console.log(`${CONFIG_LABELS.RINES}: ${vehicle.config.rines}`);
  console.log(`${CONFIG_LABELS.TECHO}: ${vehicle.config.techo}`);
  console.log(`${CONFIG_LABELS.INTERIOR}: ${vehicle.config.interior}`);
  console.log(`${CONFIG_LABELS.SUSPENSION}: ${vehicle.config.suspension}`);
  console.log(`${CONFIG_LABELS.TECNOLOGIA}: ${vehicle.config.tecnologia}`);
  console.log(`${CONFIG_LABELS.LLANTAS}: ${vehicle.config.llantas}`);
  console.log(`\n----------------------------------------`);
  console.log(`PRECIO TOTAL: ${formatPrice(calculateTotalPrice(vehicle.config))}`);
  console.log(`----------------------------------------`);
  console.log(`Creado: ${vehicle.createdAt.toLocaleString()}`);
  console.log(`Actualizado: ${vehicle.updatedAt.toLocaleString()}`);
}

// ─────────────────────────────────────────
// Flows ahora son async para poder usar await
// ─────────────────────────────────────────

async function createVehicleFlow(): Promise<void> {
  const vehicleName = question(`\n${PROMPTS.VEHICLE_NAME}`).trim();

  if (!vehicleName) {
    console.log(MESSAGES.CANCELLED);
    pause();
    return;
  }

  const vehicleConfig = configureVehicle();

  await loading('Armando tu restomod', 200);

  const result = vehicleService.saveVehicle(vehicleName, vehicleConfig);

  console.log(result.message ?? result.error ?? MESSAGES.ERROR_INVALID);

  if (result.data) {
    await delay(300);
    printVehicleConfig(result.data);

    const quiereImagen = keyInYN('\n¿Quieres ver una imagen de tu auto generada por IA?');
    if (quiereImagen) {
      await loading('Preparando visualizacion', 200);
      generarImagenAuto(result.data.name, result.data.config);
    }
  }

  pause();
}

async function editVehicleFlow(vehicle: Vehicle): Promise<void> {
  const updatedConfig = { ...vehicle.config };
  let shouldContinueEditing = true;

  while (shouldContinueEditing) {
    const selectedOption = question(PROMPTS.EDIT_MENU).trim();

    switch (selectedOption) {
      case '1':
        updatedConfig.motor = selectOption(CONFIG_OPTIONS.MOTOR, PROMPTS.SELECT_MOTOR, updatedConfig.motor);
        console.log(`✓ Motor actualizado: ${updatedConfig.motor}`);
        break;
      case '2':
        updatedConfig.pintura = selectOption(CONFIG_OPTIONS.PINTURA, PROMPTS.SELECT_PINTURA, updatedConfig.pintura);
        console.log(`✓ Pintura actualizada: ${updatedConfig.pintura}`);
        break;
      case '3':
        updatedConfig.rines = selectOption(CONFIG_OPTIONS.RINES, PROMPTS.SELECT_RINES, updatedConfig.rines);
        console.log(`✓ Rines actualizados: ${updatedConfig.rines}`);
        break;
      case '4':
        updatedConfig.techo = selectOption(CONFIG_OPTIONS.TECHO, PROMPTS.SELECT_TECHO, updatedConfig.techo);
        console.log(`✓ Techo actualizado: ${updatedConfig.techo}`);
        break;
      case '5':
        updatedConfig.interior = selectOption(CONFIG_OPTIONS.INTERIOR, PROMPTS.SELECT_INTERIOR, updatedConfig.interior);
        console.log(`✓ Interior actualizado: ${updatedConfig.interior}`);
        break;
      case '6':
        updatedConfig.suspension = selectOption(CONFIG_OPTIONS.SUSPENSION, PROMPTS.SELECT_SUSPENSION, updatedConfig.suspension);
        console.log(`✓ Suspension actualizada: ${updatedConfig.suspension}`);
        break;
      case '7':
        updatedConfig.tecnologia = selectOption(CONFIG_OPTIONS.TECNOLOGIA, PROMPTS.SELECT_TECNOLOGIA, updatedConfig.tecnologia);
        console.log(`✓ Tecnologia actualizada: ${updatedConfig.tecnologia}`);
        break;
      case '8':
        updatedConfig.llantas = selectOption(CONFIG_OPTIONS.LLANTAS, PROMPTS.SELECT_LLANTAS, updatedConfig.llantas);
        console.log(`✓ Llantas actualizadas: ${updatedConfig.llantas}`);
        break;
      case '0':
        shouldContinueEditing = false;
        break;
      default:
        console.log(MESSAGES.ERROR_INVALID);
    }
  }

  await loading('Guardando cambios', 200);
  const result = vehicleService.updateVehicleConfig(vehicle.id, updatedConfig);
  console.log(result.message ?? result.error ?? MESSAGES.ERROR_INVALID);
  pause();
}

async function selectedVehicleMenu(vehicle: Vehicle): Promise<void> {
  let goBack = false;

  while (!goBack) {
    const option = question(PROMPTS.VEHICLE_SUBMENU(vehicle.name)).trim().toLowerCase();

    if (matchesOption(option, MENU_OPTIONS.VIEW_CONFIG)) {
      await loading('Cargando configuracion', 350);
      printVehicleConfig(vehicle);
      pause();
      continue;
    }

    if (matchesOption(option, MENU_OPTIONS.EDIT_CONFIG)) {
      await editVehicleFlow(vehicle);
      continue;
    }

    if (matchesOption(option, MENU_OPTIONS.DELETE_VEHICLE)) {
      const confirmed = keyInYN(`\n${PROMPTS.CONFIRM_DELETE}`);

      if (confirmed) {
        await loading('Cancelando contrato', 200);
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
 
async function viewVehiclesFlow(): Promise<void> {
  await loading('Buscando vehiculos', 350);
 
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
 
  await selectedVehicleMenu(selectedVehicle);
}
 
async function main(): Promise<void> {
  let running = true;
 
  while (running) {
    const selectedOption = question(PROMPTS.MAIN_MENU).trim().toLowerCase();
 
    if (matchesOption(selectedOption, MENU_OPTIONS.CREATE_VEHICLE)) {
      await createVehicleFlow();
      continue;
    }
 
    if (matchesOption(selectedOption, MENU_OPTIONS.VIEW_VEHICLES)) {
      await viewVehiclesFlow();
      continue;
    }
 
    if (matchesOption(selectedOption, MENU_OPTIONS.EXIT)) {
      const confirmed = keyInYN(`\n${PROMPTS.CONFIRM_EXIT}`);
 
      if (confirmed) {
        await loading('Cerrando Restomod Royale', 200);
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