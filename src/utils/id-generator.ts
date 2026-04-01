// ==========================================
// UTILS - Generador de IDs
// Movido desde VehicleService para reutilización
// ==========================================
 
export function generateId(prefix: string = 'veh'): string {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}
 