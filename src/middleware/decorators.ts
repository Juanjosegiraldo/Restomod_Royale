// ==========================================
// MIDDLEWARE - Decoradores profesionales
// @Log: Registra entradas/salidas de métodos
// @Validate: Valida argumentos antes de ejecutar
// ==========================================

import 'reflect-metadata';

// Metadatos keys para evitar colisiones
const VALIDATION_KEY = Symbol('validation');
const LOG_KEY = Symbol('log');

// ==========================================
// HELPERS PRIVADOS
// ==========================================
function logResult(result: unknown, methodName: string, timestamp: string): unknown {
  if (result instanceof Promise) {
    return result.then(
      (v) => { console.log(`[${timestamp}] [LOG - SALIDA] ${methodName}() resolved:`, v); return v; },
      (e) => { console.error(`[${timestamp}] [LOG - REJECTED] ${methodName}() rejected:`, e); throw e; }
    );
  }
  console.log(`[${timestamp}] [LOG - SALIDA] ${methodName}() returned:`, result);
  return result;
}

// ==========================================
// DECORADOR @Log - Logging de métodos
// ==========================================
export function Log(): MethodDecorator {
  return function (target: object, propertyKey: string | symbol, descriptor: PropertyDescriptor): void {
    const original = descriptor.value;
    descriptor.value = function (...args: unknown[]) {
      const method = String(propertyKey);
      const ts = new Date().toISOString();
      console.log(`[${ts}] [LOG - ENTRADA] ${method}() args:`, args);
      try {
        return logResult(original.apply(this, args), method, ts);
      } catch (error) {
        console.error(`[${ts}] [LOG - ERROR] ${method}() threw:`, error);
        throw error;
      }
    };
    Reflect.defineMetadata(LOG_KEY, true, target, propertyKey);
  };
}

// ==========================================
// DECORADOR @Validate - Validación de argumentos
// ==========================================
export function Validate(validator: (args: unknown[]) => boolean | string): MethodDecorator {
  return function (target: object, propertyKey: string | symbol, descriptor: PropertyDescriptor): void {
    const originalMethod = descriptor.value;
    descriptor.value = function (...args: unknown[]) {
      const methodName = String(propertyKey);
      const validationResult = validator(args);
      if (validationResult !== true) {
        const errorMessage = typeof validationResult === 'string' ? validationResult : `Validación fallida en ${methodName}()`;
        console.error(`[VALIDATE - ERROR] ${methodName}(): ${errorMessage}`);
        throw new Error(errorMessage);
      }
      console.log(`[VALIDATE - OK] ${methodName}() validación exitosa`);
      return originalMethod.apply(this, args);
    };
    Reflect.defineMetadata(VALIDATION_KEY, validator, target, propertyKey);
  };
}

// ==========================================
// HELPER - Obtener metadatos de validación
// ==========================================
export function getValidationMetadata(target: object, propertyKey: string | symbol): unknown {
  return Reflect.getMetadata(VALIDATION_KEY, target, propertyKey);
}
