// ==========================================
// UTILS - Delay con animación de puntos
// Uso: await loading('Guardando', 400)
// ==========================================
 
// Pausa simple en ms — base de todo
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
 
// Muestra un mensaje con puntos animados por un tiempo dado
// Ejemplo: "Guardando   " → "Guardando.  " → "Guardando.. " → "Guardando..."
export async function loading(mensaje: string, duracion: number = 100): Promise<void> {
  const frames = ['   ', '.  ', '.. ', '...'];
  const intervalo = duracion / frames.length;
 
  for (const frame of frames) {
    process.stdout.write(`\r  ${mensaje}${frame}`);
    await delay(intervalo);
  }
 
  // Limpia la línea al terminar para que el siguiente console.log quede limpio
  process.stdout.write('\r' + ' '.repeat(mensaje.length + 6) + '\r');
}
 