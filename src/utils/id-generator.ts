// ==========================================
// UTILS - Generador de IDs y formateadores
// ==========================================

export function generateId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 9)}`;
}

export function formatCurrency(amount: number): string {
  return `$${amount.toLocaleString('en-US')}`;
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}
