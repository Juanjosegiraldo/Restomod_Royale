// ==========================================
// CONFIG - Constantes y textos normalizados
// Para prompts y mensajes de consola
// ==========================================
import readlineSync from 'readline-sync';

export const question = readlineSync.question;
export const keyInSelect = readlineSync.keyInSelect;
export const keyInYN = readlineSync.keyInYN;

// Opciones de configuracion para keyInSelect
export const CONFIG_OPTIONS = {
  MOTOR: ['V8 5.0L Classic', 'V8 6.2L Supercharged', 'V6 3.5L Twin-Turbo', 'Electric 800HP', 'V12 7.0L Racing'],
  PINTURA: ['Midnight Black', 'Racing Red', 'Pearl White', 'Gunmetal Gray', 'Ocean Blue', 'Gold Rush'],
  RINES: ['18" Classic Chrome', '19" Sport Alloy', '20" Carbon Fiber', '21" Gold Plated', '22" Racing Forged'],
  INTERIOR: ['Black Leather Classic', 'Tan Leather Vintage', 'Red Sport Suede', 'White Luxury Diamond', 'Carbon Fiber Racing'],
  SUSPENSION: ['Comfort Touring', 'Sport Lowered', 'Racing Coilover', 'Air Ride Adjustable', 'Track Performance'],
  TECNOLOGIA: ['Basic Analog', 'Digital Touch', 'Full Digital + HUD', 'Racing Telemetry', 'Autonomous+Classic UI'],
  TECHO: ['Hardtop Classic', 'Convertible Soft Top', 'Targa Glass', 'Panoramic Roof', 'Carbon Fiber Top'],
  LLANTAS: ['All-Season Touring', 'Sport Performance', 'Racing Slick', 'Off-Road All Terrain', 'Vintage White Wall']
} as const;

export const CONFIG_LABELS = {
  MOTOR: 'Motor',
  PINTURA: 'Pintura',
  RINES: 'Rines',
  INTERIOR: 'Interior',
  SUSPENSION: 'Suspension',
  TECNOLOGIA: 'Tecnologia',
  TECHO: 'Techo',
  LLANTAS: 'Llantas'
} as const;

export const MENU_OPTIONS = {
  // Menu Principal
  CREATE_VEHICLE: ['1', 'crear', 'c', 'nuevo'],
  VIEW_VEHICLES: ['2', 'ver', 'v', 'mis'],
  EXIT: ['0', 'salir', 's', 'exit', 'q', 'quit'],
  
  // Menu Vehiculo Seleccionado
  VIEW_CONFIG: ['1', 'ver', 'v', 'configuracion', 'config'],
  EDIT_CONFIG: ['2', 'editar', 'e', 'modificar', 'm'],
  DELETE_VEHICLE: ['3', 'eliminar', 'd', 'cancelar', 'borrar'],
  GO_BACK: ['0', 'volver', 'atras', 'b', 'back']
} as const;

export const PROMPTS = {
  MAIN_MENU: [
    '',
    '========================================',
    '        RESTOMOD ROYALE - MENU',
    '========================================',
    '  [1] Crear nuevo vehiculo',
    '  [2] Ver mis vehiculos',
    '  [0] Salir',
    '',
    'Seleccione una opcion: '
  ].join('\n'),
  
  VEHICLE_SUBMENU: (vehicleName: string) => [
    '',
    '========================================',
    `        ${vehicleName.toUpperCase()}`,
    '========================================',
    '  [1] Ver configuracion',
    '  [2] Editar configuracion',
    '  [3] Cancelar contrato (eliminar)',
    '  [0] Volver atras',
    '',
    'Seleccione una opcion: '
  ].join('\n'),
  
  VEHICLE_NAME: 'Nombre de tu vehiculo: ',
  
  // Configuracion por categorias (usando keyInSelect)
  SELECT_MOTOR: 'Seleccione el motor:',
  SELECT_PINTURA: 'Seleccione la pintura:',
  SELECT_RINES: 'Seleccione los rines:',
  SELECT_INTERIOR: 'Seleccione el interior:',
  SELECT_SUSPENSION: 'Seleccione la suspension:',
  SELECT_TECNOLOGIA: 'Seleccione la tecnologia:',
  
  // Editar configuracion - menu
  EDIT_MENU: [
    '',
    '--- Que desea modificar? ---',
    '  [1] Motor',
    '  [2] Pintura',
    '  [3] Rines',
    '  [4] Interior',
    '  [5] Suspension',
    '  [6] Tecnologia',
    '  [7] Techo',
    '  [8] Llantas',
    '  [0] Terminar edicion',
    '',
    'Seleccione: '
  ].join('\n'),
  ENGINE_TYPE: 'Tipo de motor (v6/v8/v12/electric): ',
  ENGINE_POWER: 'Potencia en HP (300-800): ',
  COLOR: 'Color del vehiculo: ',
  WHEELS: 'Estilo de llantas (classic/sport/racing): ',
  ROOF: 'Tipo de techo (hardtop/convertible/targa): ',
  ADD_ACCESSORY: 'Agregar accesorio? (s/n): ',
  ACCESSORY_NAME: 'Nombre del accesorio: ',
  ACCESSORY_MATERIAL: 'Material (chrome/carbon/leather/wood): ',
  
  CONFIRM_DELETE: 'Esta seguro de cancelar el contrato? Esta accion no se puede deshacer. (s/n): ',
  CONFIRM_EXIT: 'Desea salir del programa? (s/n): ',
  CONFIRM_CANCEL_ACTION: 'Desea cancelar esta accion y volver atras? (s/n): ',
  EDIT_COMPLETE: 'Configuracion actualizada! Presione ENTER para volver al vehiculo.',
  CONTINUE: 'Presione ENTER para continuar...',
  SELECT_VEHICLE: 'Seleccione el numero del vehiculo: ',
  NO_VEHICLES: 'No tiene vehiculos registrados. Presione ENTER para volver.'
} as const;

export const MESSAGES = {
  SUCCESS_CREATED: 'Vehiculo creado exitosamente!',
  SUCCESS_UPDATED: 'Configuracion actualizada!',
  SUCCESS_DELETED: 'Contrato cancelado y vehiculo eliminado.',
  SUCCESS_EXIT: 'Gracias por usar Restomod Royale. Hasta pronto!',
  CANCELLED: 'Accion cancelada.',
  ERROR_INVALID: 'Opcion invalida. Intente nuevamente.',
  ERROR_NOT_FOUND: 'No se encontro el vehiculo.',
  ERROR_EMPTY: 'No hay vehiculos registrados.'
} as const;

export const VALID_OPTIONS = {
  YES: ['s', 'si', 'sí', 'y', 'yes', '1'],
  NO: ['n', 'no', '0']
} as const;
