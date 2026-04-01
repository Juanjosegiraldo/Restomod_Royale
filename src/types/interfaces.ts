// ==========================================
// INTERFACES - Interfaces del sistema
// ==========================================

import type { MotorType, PinturaType, RinesType, InteriorType, SuspensionType, TecnologiaType, TechoType, LlantasType } from './types';

// Configuracion completa del vehiculo
export interface VehicleConfig {
  motor: MotorType;
  pintura: PinturaType;
  rines: RinesType;
  interior: InteriorType;
  suspension: SuspensionType;
  tecnologia: TecnologiaType;
  techo: TechoType;
  llantas: LlantasType;
}

// Entidad base con ID y timestamps
export interface Entity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

// Vehiculo completo
export interface Vehicle extends Entity {
  name: string;
  config: VehicleConfig;
}

// Item del carrito
export interface CartItem {
  vehicleId: string;
  vehicleName: string;
  quantity: number;
}

// Carrito
export interface Cart {
  id: string;
  items: CartItem[];
  totalItems: number;
}

// Resultado de operacion CRUD
export interface OperationResult<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Opcion de menu
export interface MenuOption {
  key: string;
  label: string;
  aliases: string[];
  action?: () => void;
}

// Validacion
export interface ValidationResult {
  valid: boolean;
  message?: string;
}

// Metadata para decoradores
export interface DecoratorMetadata {
  designType: unknown;
  designParamTypes: unknown[];
  designReturnType: unknown;
}
