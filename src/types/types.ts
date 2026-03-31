// ==========================================
// TYPES - Type aliases
// Generados desde CONFIG_OPTIONS para mantener sincronizacion
// ==========================================

import { CONFIG_OPTIONS } from '../config/constants.js';

// Tipos de configuracion (extraidos de CONFIG_OPTIONS)
export type MotorType = typeof CONFIG_OPTIONS.MOTOR[number];
export type PinturaType = typeof CONFIG_OPTIONS.PINTURA[number];
export type RinesType = typeof CONFIG_OPTIONS.RINES[number];
export type InteriorType = typeof CONFIG_OPTIONS.INTERIOR[number];
export type SuspensionType = typeof CONFIG_OPTIONS.SUSPENSION[number];
export type TecnologiaType = typeof CONFIG_OPTIONS.TECNOLOGIA[number];

// Constructor para clases genericas
export type Constructor<T = {}> = new (...args: unknown[]) => T;
