// ==========================================
// VEHICLE MODEL
// Clases, constructores, modificadores de acceso y herencia
// Stories: 1 (Motor), 2 (Pintura), 7 (Potencia)
// ==========================================

import type { Entity, Vehicle as IVehicle, VehicleConfig } from '../types/interfaces';
import type { MotorType, PinturaType } from '../types/types';

// ------------------------------------------
// Mapa de potencia por motor (Story 7)
// Derivado 1:1 de CONFIG_OPTIONS.MOTOR — sin duplicar las opciones
// ------------------------------------------
const MOTOR_POTENCIA: Record<MotorType, number> = {
  'V8 5.0L Classic':      400,
  'V8 6.2L Supercharged': 650,
  'V6 3.5L Twin-Turbo':   350,
  'Electric 800HP':       800,
  'V12 7.0L Racing':      720,
};
 
// ==========================================
// CLASE ABSTRACTA BASE: BaseEntity
// Gestiona id y timestamps con encapsulamiento
// ==========================================
abstract class BaseEntity implements Entity {
  // public readonly: visible en todo el proyecto, no reasignable
  public readonly id: string;
  public readonly createdAt: Date;
 
  // private: solo esta clase lo toca directamente
  private _updatedAt: Date;
 
  constructor(id: string) {
    this.id         = id;
    this.createdAt  = new Date();
    this._updatedAt = new Date();
  }
 
  // getter público — el resto del proyecto lee updatedAt normalmente
  get updatedAt(): Date {
    return this._updatedAt;
  }
 
  // protected: solo VehicleModel (y sus subclases) pueden llamarlo
  protected touch(): void {
    this._updatedAt = new Date();
  }
}
 
// ==========================================
// CLASE PRINCIPAL: VehicleModel
// Hereda BaseEntity, implementa IVehicle
// Reemplaza el objeto plano { id, name, config, createdAt, updatedAt }
// que usaba el service — forma externa idéntica, sin romper nada
// ==========================================
export class VehicleModel extends BaseEntity implements IVehicle {
 
  // public: el name se lee/escribe desde el service y la UI
  public name: string;

  // protected: motor y pintura solo se cambian por sus setters
  protected _motor: MotorType;
  protected _pintura: PinturaType;

  // protected: el resto de la config es accesible en subclases
  protected _rines:      VehicleConfig['rines'];
  protected _techo:      VehicleConfig['techo'];
  protected _interior:   VehicleConfig['interior'];
  protected _suspension: VehicleConfig['suspension'];
  protected _tecnologia: VehicleConfig['tecnologia'];
  protected _llantas:    VehicleConfig['llantas'];

  constructor(id: string, name: string, config: VehicleConfig) {
    super(id);                          // BaseEntity → id, timestamps
    this.name        = name;
    this._motor      = config.motor;
    this._pintura    = config.pintura;
    this._rines      = config.rines;
    this._techo      = config.techo;
    this._interior   = config.interior;
    this._suspension = config.suspension;
    this._tecnologia = config.tecnologia;
    this._llantas    = config.llantas;
  }

  // ------------------------------------------
  // Story 1 – Motor: getter/setter controlado
  // ------------------------------------------
  get motor(): MotorType {
    return this._motor;
  }

  set motor(value: MotorType) {
    this._motor = value;
    this.touch();   // actualiza updatedAt automáticamente
  }

  // ------------------------------------------
  // Story 7 – Potencia: calculada desde el motor, solo lectura
  // ------------------------------------------
  get potenciaHP(): number {
    return MOTOR_POTENCIA[this._motor];
  }

  get categoriaRendimiento(): string {
    const hp = this.potenciaHP;
    if (hp >= 700) return 'EXTREMO ';
    if (hp >= 500) return 'ALTO ';
    if (hp >= 350) return 'MEDIO ';
    return 'CLASICO ';
  }

  // ------------------------------------------
  // Story 2 – Pintura: getter/setter controlado
  // ------------------------------------------
  get pintura(): PinturaType {
    return this._pintura;
  }

  set pintura(value: PinturaType) {
    this._pintura = value;
    this.touch();
  }

  get acabadoPintura(): string {
    const p = this._pintura.toLowerCase();
    if (p.includes('gold') || p.includes('pearl')) return 'Premium ';
    if (p.includes('racing') || p.includes('midnight')) return 'Sport ';
    return 'Clasico ';
  }

  // ------------------------------------------
  // Propiedad config — mantiene compatibilidad total con
  // vehicle.service.ts e index.ts sin tocar esos archivos
  // ------------------------------------------
  get config(): VehicleConfig {
    return {
      motor:      this._motor,
      pintura:    this._pintura,
      rines:      this._rines,
      techo:      this._techo,
      interior:   this._interior,
      suspension: this._suspension,
      tecnologia: this._tecnologia,
      llantas:    this._llantas,
    };
  }

  set config(newConfig: VehicleConfig) {
    this._motor      = newConfig.motor;
    this._pintura    = newConfig.pintura;
    this._rines      = newConfig.rines;
    this._techo      = newConfig.techo;
    this._interior   = newConfig.interior;
    this._suspension = newConfig.suspension;
    this._tecnologia = newConfig.tecnologia;
    this._llantas    = newConfig.llantas;
    this.touch();
  }
}

// ==========================================
// SUBCLASE: RestromodPremium
// Hereda VehicleModel — demuestra herencia real
// Agrega lógica exclusiva accediendo a campos protected del padre
// ==========================================
export class RestromodPremium extends VehicleModel {
 
  // private: solo existe en esta subclase
  private _nivelExclusividad: number;
 
  constructor(id: string, name: string, config: VehicleConfig) {
    super(id, name, config);    // hereda constructor de VehicleModel
    this._nivelExclusividad = Math.floor(this.potenciaHP / 100);
  }
 
  get nivelExclusividad(): number {
    return this._nivelExclusividad;
  }
 
  // Accede a _suspension (protected heredado de VehicleModel)
  public esConfiguracionPremium(): boolean {
    const premium: VehicleConfig['suspension'][] = [
      'Racing Coilover',
      'Air Ride Adjustable',
      'Track Performance',
    ];
    return premium.includes(this._suspension);
  }
}

// ==========================================
// CLASE Vehicle (para HU12 - compatibilidad)
// ==========================================
export class Vehicle extends VehicleModel {
  static create(name: string, config: VehicleConfig): Vehicle {
    const id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    return new Vehicle(id, name, config);
  }

  updateConfig(config: Partial<VehicleConfig>): void {
    if (config.motor) this._motor = config.motor;
    if (config.pintura) this._pintura = config.pintura;
    if (config.rines) this._rines = config.rines;
    if (config.techo) this._techo = config.techo;
    if (config.interior) this._interior = config.interior;
    if (config.suspension) this._suspension = config.suspension;
    if (config.tecnologia) this._tecnologia = config.tecnologia;
    if (config.llantas) this._llantas = config.llantas;
    this.touch();
  }
}