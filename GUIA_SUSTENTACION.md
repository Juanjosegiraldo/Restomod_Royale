# RESTOMOD ROYALE - GUÍA COMPLETA DE SUSTENTACIÓN

---

## 1. DESCRIPCIÓN GENERAL DEL PROYECTO

**¿Qué es Restomod Royale?**

Restomod Royale es una aplicación de consola para la personalización de autos clásicos. Permite a los usuarios configurar vehículos combinando estilo clásico con tecnología moderna, y gestionar sus diseños mediante operaciones CRUD completas.

**Objetivo:** Permitir que clientes diseñen autos personalizados seleccionando componentes (motor, pintura, rines, interior, suspensión, tecnología, techo, llantas) antes de solicitar su construcción.

**Metodología:** Scrum con historias de usuario (HU01 - Personalizar auto clásico)

---

## 2. TECNOLOGÍAS UTILIZADAS

| Tecnología | Uso en el proyecto |
|------------|-------------------|
| **TypeScript** | Lenguaje principal con tipado estricto |
| **Node.js** | Runtime de ejecución |
| **tsx** | Ejecutor TypeScript con hot-reload |
| **chalk** | Colores y estilos en consola |
| **readline-sync** | Interacción síncrona con usuario |
| **reflect-metadata** | Soporte para decoradores |
| **Pollinations AI** | Generación de imágenes de autos (API gratuita) |

---

## 3. ARQUITECTURA DEL SISTEMA

### Estructura de Carpetas (Clean Architecture)

```
src/
├── config/          # Constantes y configuración global
├── types/           # Interfaces y tipos TypeScript
├── models/          # Clases del dominio (VehicleModel, RestromodPremium)
├── repositories/    # Persistencia (JSON + Interfaz)
├── services/        # Lógica de negocio (VehicleService)
├── middleware/      # Decoradores (@Log, @Validate) y validaciones
├── utils/           # Funciones auxiliares
└── index.ts         # Punto de entrada (UI/CLI)
```

### Flujo de Datos

```
Usuario → index.ts (UI) → VehicleService (lógica) 
    → VehicleRepository (persistencia) → vehicles.json
```

---

## 4. PREGUNTAS Y RESPUESTAS PARA SUSTENTACIÓN

### A. CONCEPTOS GENERALES

**P: ¿Cuál es la historia de usuario principal?**
> **R:** HU01 - Personalizar auto clásico. Como cliente, quiero seleccionar las características de un auto clásico para diseñar un vehículo personalizado según mis preferencias.

**P: ¿Qué es un "restomod"?**
> **R:** Es la combinación de "restoration" (restauración) + "modern" (moderno). Son autos clásicos restaurados pero con componentes modernos (motor, tecnología, suspensiones).

**P: ¿Qué patrón de arquitectura usaste?**
> **R:** Repository Pattern + Layered Architecture. Separamos:
> - Capa de presentación (index.ts - UI)
> - Capa de servicio (VehicleService - lógica de negocio)
> - Capa de datos (JsonVehicleRepository - persistencia)

---

### B. TYPESCRIPT Y TIPADO

**P: ¿Por qué usaste TypeScript en vez de JavaScript?**
> **R:** 
> - Tipado estático que previene errores en tiempo de compilación
> - Autocompletado en IDE
> - Interfaces que definen contratos claros
> - Mejor mantenibilidad a largo plazo

**P: Muestra un ejemplo de interfaz y explícala**
> **R:**
```typescript
export interface Vehicle extends Entity {
  name: string;
  config: VehicleConfig;
}
```
> Define la estructura de un vehículo con nombre y configuración. Extiende Entity que tiene id, createdAt, updatedAt.

**P: ¿Qué son los utility types que usaste?**
> **R:** Usé `Partial<Vehicle>` para crear objetos con propiedades opcionales, útil para updates donde no se modifican todos los campos.

---

### C. PROGRAMACIÓN ORIENTADA A OBJETOS

**P: ¿Qué clases principales tienes?**
> **R:**
> - **BaseEntity** (abstracta): id, timestamps, encapsulamiento de updatedAt
> - **VehicleModel**: Hereda de BaseEntity, implementa IVehicle, contiene la configuración
> - **RestromodPremium**: Hereda de VehicleModel, agrega nivel de exclusividad
> - **Vehicle**: Extensión de VehicleModel con método factory create()

**P: Explica los modificadores de acceso usados**
> **R:**
> - **public readonly id**: Visible en todo el proyecto, no reasignable
> - **private _updatedAt**: Solo la clase BaseEntity puede modificarlo directamente
> - **protected _motor**: Accesible en VehicleModel y sus subclases
> - **public name**: Lectura/escritura libre desde cualquier lado

**P: ¿Qué es encapsulamiento y cómo lo aplicaste?**
> **R:** Es ocultar la implementación interna. Por ejemplo, `_updatedAt` es privado y solo se actualiza mediante el método protegido `touch()`, llamado desde los setters. El mundo exterior solo ve el getter `updatedAt`.

**P: ¿Cómo funciona la herencia en tu código?**
> **R:**
> ```
> BaseEntity (abstract) → VehicleModel → RestromodPremium
>                                  ↓
>                               Vehicle
> ```
> RestromodPremium accede a campos protected como `_suspension` del padre.

**P: Muestra un getter/setter y su utilidad**
> **R:**
```typescript
set motor(value: MotorType) {
  this._motor = value;
  this.touch();  // Actualiza updatedAt automáticamente
}
```
> Al cambiar el motor, se actualiza automáticamente la fecha de modificación.

---

### D. DECORADORES (PATRÓN AVANZADO)

**P: ¿Qué son los decoradores en TypeScript?**
> **R:** Son funciones especiales que añaden comportamiento a clases, métodos o propiedades en tiempo de diseño. Requieren `experimentalDecorators` y `reflect-metadata`.

**P: ¿Qué decoradores implementaste?**
> **R:**
> - **@Log()**: Registra entrada, salida y errores de métodos con timestamp
> - **@Validate()**: Valida argumentos antes de ejecutar el método

**P: Muestra cómo se usan los decoradores**
> **R:**
```typescript
export class VehicleService {
  @Log()
  @Validate(createNotEmptyValidator())
  saveVehicle(name: string, config: VehicleConfig): OperationResult<Vehicle> {
    // lógica del método
  }
}
```

**P: ¿Para qué sirve reflect-metadata?**
> **R:** Permite almacenar y recuperar metadatos en objetos en tiempo de ejecución. Usamos `Reflect.defineMetadata()` para guardar validadores y `Reflect.getMetadata()` para recuperarlos.

---

### E. PERSISTENCIA Y REPOSITORIES

**P: ¿Dónde se guardan los datos?**
> **R:** En un archivo JSON (`src/data/vehicles.json`) mediante `JsonVehicleRepository`.

**P: ¿Por qué creaste una interfaz IVehicleRepository?**
> **R:** Porque cumple con el **Principio de Inversión de Dependencias (DIP)** de SOLID. El Service depende de la abstracción (interfaz), no de la implementación concreta. Esto permite cambiar la persistencia (JSON, DB, API) sin tocar el Service.

**P: Muestra la interfaz del repositorio**
> **R:**
```typescript
export interface IVehicleRepository {
  findAll(): Vehicle[];
  findById(id: string): Vehicle | undefined;
  create(vehicle: Vehicle): Vehicle;
  update(id: string, vehicle: Partial<Vehicle>): Vehicle | undefined;
  delete(id: string): boolean;
}
```

**P: ¿Cómo reconstruyes objetos desde JSON?**
> **R:** Al leer el archivo, uso `JSON.parse()` y luego reconstruyo cada vehículo como instancia de `VehicleModel` con el constructor, pasando las propiedades del JSON parseado.

---

### F. VALIDACIONES

**P: ¿Cómo validas la configuración de un vehículo?**
> **R:** Tengo funciones validadoras que verifican:
> - Que los campos existan en las opciones permitidas (`CONFIG_OPTIONS`)
> - Que el nombre tenga entre 2 y 30 caracteres
> - Que el ID del vehículo exista en el repositorio

**P: Muestra un ejemplo de validación**
> **R:**
```typescript
export function validateVehicleConfig(config: Partial<VehicleConfig>): ValidationResult {
  if (!config) return { valid: false, message: 'Configuración no proporcionada' };
  for (const field of CONFIG_FIELDS) {
    const result = validateField(config[field.key], field.options, field.label);
    if (!result.valid) return result;
  }
  return { valid: true };
}
```

---

### G. FUNCIONALIDADES ESPECIALES

**P: ¿Cómo calculas el precio de un vehículo?**
> **R:** Base de $50,000 + suma de precios según índices seleccionados. Cada opción en `CONFIG_OPTIONS` tiene su precio correspondiente en `CONFIG_PRICES` en la misma posición del array.

**P: ¿Qué es la generación de imágenes con IA?**
> **R:** Usa Pollinations AI (API gratuita sin key). Construye un prompt en inglés desde la configuración del auto y genera una URL que abre en el navegador mostrando una imagen del vehículo personalizado.

**P: Muestra cómo funciona el sistema de potencia**
> **R:**
```typescript
const MOTOR_POTENCIA: Record<MotorType, number> = {
  'V8 5.0L Classic': 400,
  'V8 6.2L Supercharged': 650,
  // ...
};

get potenciaHP(): number {
  return MOTOR_POTENCIA[this._motor];
}
```
> La potencia se calcula dinámicamente según el motor seleccionado.

---

### H. INTERFAZ DE USUARIO (CLI)

**P: ¿Cómo manejas la interacción con el usuario?**
> **R:** Usamos `readline-sync` para input síncrono. Menús con `keyInSelect` para seleccionar de listas, y `keyInYN` para confirmaciones sí/no.

**P: ¿Cómo está estructurado el menú?**
> **R:** 
> 1. Menú Principal: Crear vehículo / Ver mis vehículos / Salir
> 2. Menú de Vehículo: Ver config / Editar / Eliminar / Volver
> 3. Menú de Edición: Seleccionar qué componente modificar

**P: ¿Qué librería usas para colores?**
> **R:** `chalk` v5.6.2 para dar color y estilo a la consola (categorías en colores distintos: motor en amarillo, rines en azul, etc.)

---

### I. CONFIGURACIÓN Y CONSTANTES

**P: ¿Dónde están definidas las opciones de configuración?**
> **R:** En `src/config/constants.ts`:
> - `CONFIG_OPTIONS`: Arrays con opciones válidas (motor, pintura, etc.)
> - `CONFIG_PRICES`: Precios correspondientes
> - `CONFIG_LABELS`: Nombres para mostrar
> - `PROMPTS`: Mensajes para el usuario
> - `MESSAGES`: Mensajes de éxito/error

**P: ¿Cuántas opciones de configuración tiene un vehículo?**
> **R:** 8 categorías: Motor, Pintura, Rines, Techo, Interior, Suspensión, Tecnología, Llantas.

---

### J. DEPENDENCIAS Y CONFIGURACIÓN

**P: Muestra las dependencias del proyecto**
> **R:**
```json
"dependencies": {
  "chalk": "^5.6.2",
  "reflect-metadata": "^0.2.2"
}
```

**P: ¿Qué configuración de TypeScript usas?**
> **R:** 
> - `target`: ESNext
> - `module`: NodeNext
> - `strict`: true
> - `experimentalDecorators`: true
> - `emitDecoratorMetadata`: true

---

### K. COMANDOS DISPONIBLES

| Comando | Descripción |
|---------|-------------|
| `npm install` | Instala dependencias |
| `npm run dev` | Ejecuta con tsx en modo desarrollo |
| `npm run dev:watch` | Ejecuta con hot-reload |
| `npm run typecheck` | Verifica tipos sin ejecutar |

---

### L. PREGUNTAS DE CIERRE

**P: ¿Qué fue lo más difícil de implementar?**
> **R:** Los decoradores @Log y @Validate requirieron entender bien cómo TypeScript transpila los decoradores, el uso de `reflect-metadata`, y cómo envolver métodos manteniendo el contexto (`this`).

**P: ¿Qué mejorarías en el futuro?**
> **R:**
> - Agregar persistencia en base de datos real (SQLite/PostgreSQL)
> - Implementar autenticación de usuarios
> - Crear interfaz web con React
> - Agregar más historias de usuario (HU02-HU12 completas)
> - Tests unitarios con Jest

**P: ¿Qué aprendiste con este proyecto?**
> **R:**
> - Decoradores avanzados en TypeScript
> - Patrón Repository para persistencia
> - Encapsulamiento real con private/protected
> - Generación de imágenes con IA
> - Arquitectura limpia en aplicaciones CLI

---

## 5. RESUMEN VISUAL DE LA ARQUITECTURA

```
┌─────────────────────────────────────────────────────────┐
│  INTERFAZ DE USUARIO (index.ts)                          │
│  - Menús interactivos                                     │
│  - Captura de input                                       │
│  - Visualización con chalk                               │
└─────────────────┬───────────────────────────────────────┘
                  │ llama a
┌─────────────────▼───────────────────────────────────────┐
│  SERVICIO (VehicleService)                               │
│  - @Log() y @Validate() decoradores                      │
│  - Lógica de negocio CRUD                                │
│  - Cálculo de precios                                    │
└─────────────────┬───────────────────────────────────────┘
                  │ usa
┌─────────────────▼───────────────────────────────────────┐
│  REPOSITORIO (JsonVehicleRepository)                    │
│  - Implementa IVehicleRepository                         │
│  - Persistencia en vehicles.json                        │
└─────────────────┬───────────────────────────────────────┘
                  │ lee/escribe
┌─────────────────▼───────────────────────────────────────┐
│  MODELOS (VehicleModel, RestromodPremium)                │
│  - BaseEntity (abstract) con id/timestamps               │
│  - Herencia y encapsulamiento                          │
│  - Getters/setters con lógica (touch())                │
└─────────────────────────────────────────────────────────┘
```

---

## 6. CÓDIGOS CLAVE PARA MOSTRAR

Si te piden mostrar código en la sustentación, estos son los mejores ejemplos:

### Ejemplo 1: Decorador @Log
```typescript
export function Log(): MethodDecorator {
  return function (target, propertyKey, descriptor) {
    const original = descriptor.value;
    descriptor.value = function (...args) {
      const method = String(propertyKey);
      const ts = new Date().toISOString();
      console.log(`[${ts}] [LOG - ENTRADA] ${method}() args:`, args);
      // ...
    };
  };
}
```

### Ejemplo 2: Herencia con encapsulamiento
```typescript
abstract class BaseEntity {
  private _updatedAt: Date;
  get updatedAt(): Date { return this._updatedAt; }
  protected touch(): void { this._updatedAt = new Date(); }
}

class VehicleModel extends BaseEntity {
  protected _motor: MotorType;
  set motor(value: MotorType) {
    this._motor = value;
    this.touch();  // Solo puede llamarse desde subclases
  }
}
```

### Ejemplo 3: Repository Pattern
```typescript
export interface IVehicleRepository {
  findAll(): Vehicle[];
  create(vehicle: Vehicle): Vehicle;
  // ...
}

export class JsonVehicleRepository implements IVehicleRepository {
  // Implementación concreta
}
```

---

**¡ÉXITO EN TU SUSTENTACIÓN! 🚗💨**
