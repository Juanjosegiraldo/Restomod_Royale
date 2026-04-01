// ==========================================
// INTERFACES - Interfaces del sistema
// ==========================================

import type { 
  MotorType, 
  PinturaType, 
  RinesType, 
  InteriorType, 
  SuspensionType, 
  TecnologiaType 
} from './types.js';

// ==========================
// CONFIGURACION VEHICULO
// ==========================
export interface VehicleConfig {
  motor: MotorType;
  pintura: PinturaType;
  rines: RinesType;
  interior: InteriorType;
  suspension: SuspensionType;
  tecnologia: TecnologiaType;
}

// ==========================
// ACCESORIOS (STORY 5 y 6)
// ==========================
export interface Accessory {
  name: string;
  material: string;
}

// ==========================
// ENTIDAD BASE
// ==========================
export interface Entity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

// ==========================
// VEHICULO (MODELO PRINCIPAL)
// ==========================
export interface Vehicle extends Entity {
  name: string;
  config: VehicleConfig;

  accessories?: Accessory[]; // 👈 integrado correctamente
}

// ==========================
// CARRITO (STORY 10)
// ==========================
export interface CartItem {
  vehicleId: string;
  vehicleName: string;
  quantity: number;
  config: VehicleConfig;
  accessories?: Accessory[];
}

export interface Cart {
  id: string;
  items: CartItem[];
  totalItems: number;
}

// ==========================
// RESULTADOS Y UTILS
// ==========================
export interface OperationResult<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface MenuOption {
  key: string;
  label: string;
  aliases: string[];
  action?: () => void;
}

export interface ValidationResult {
  valid: boolean;
  message?: string;
}

export interface DecoratorMetadata {
  designType: unknown;
  designParamTypes: unknown[];
  designReturnType: unknown;
}