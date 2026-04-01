
// ==========================================
// UTILS - Generador de imagen con IA
// Usa Pollinations AI (gratis, sin API key)
// Construye un prompt desde la config del auto
// y abre la imagen en el navegador
// ==========================================
 
import { exec } from 'child_process';
import type { VehicleConfig } from '../types/interfaces.js';
 
// ------------------------------------------
// Traduce las opciones del proyecto a
// términos que la IA entiende mejor en inglés
// ------------------------------------------
const MOTOR_EN: Record<string, string> = {
  'V8 5.0L Classic':      'V8 5.0L classic engine',
  'V8 6.2L Supercharged': 'V8 6.2L supercharged engine',
  'V6 3.5L Twin-Turbo':   'V6 3.5L twin-turbo engine',
  'Electric 800HP':       'electric powertrain 800HP',
  'V12 7.0L Racing':      'V12 7.0L racing engine',
};
 
const PINTURA_EN: Record<string, string> = {
  'Midnight Black': 'glossy midnight black paint',
  'Racing Red':     'vibrant racing red paint',
  'Pearl White':    'pearl white metallic paint',
  'Gunmetal Gray':  'gunmetal gray matte paint',
  'Ocean Blue':     'deep ocean blue metallic paint',
  'Gold Rush':      'gold rush custom paint',
};
 
const RINES_EN: Record<string, string> = {
  '18" Classic Chrome':  '18 inch classic chrome wheels',
  '19" Sport Alloy':     '19 inch sport alloy wheels',
  '20" Carbon Fiber':    '20 inch carbon fiber wheels',
  '21" Gold Plated':     '21 inch gold plated wheels',
  '22" Racing Forged':   '22 inch racing forged wheels',
};
 
const TECHO_EN: Record<string, string> = {
  'Hardtop Clasico':        'classic hardtop roof',
  'Convertible Electrico':  'electric convertible soft top',
  'Targa Carbon Edition':   'targa carbon fiber roof panel',
};
 
// ------------------------------------------
// Abre una URL en el navegador del sistema
// Compatible con Windows, Mac y Linux
// ------------------------------------------
function abrirEnNavegador(url: string): void {
  const plataforma = process.platform;
 
  const comando =
    plataforma === 'win32'  ? `start "" "${url}"` :
    plataforma === 'darwin' ? `open "${url}"` :
                              `xdg-open "${url}"`;
 
  exec(comando, (error) => {
    if (error) {
      // Si no puede abrir automático, el usuario igual tiene el link impreso
      console.log('  (No se pudo abrir automaticamente, copia el link manualmente)');
    }
  });
}
 
// ------------------------------------------
// Función principal exportada
// Recibe la config del vehículo y su nombre,
// construye el prompt, imprime el link y abre el navegador
// ------------------------------------------
export function generarImagenAuto(nombre: string, config: VehicleConfig): void {
  const motor   = MOTOR_EN[config.motor]   ?? config.motor;
  const pintura = PINTURA_EN[config.pintura] ?? config.pintura;
  const rines   = RINES_EN[config.rines]   ?? config.rines;
  const techo   = TECHO_EN[config.techo]   ?? config.techo;
 
  // Prompt diseñado para que Pollinations genere autos clásicos de calidad
  const prompt = [
    `classic american muscle car restomod named ${nombre}`,
    motor,
    pintura,
    rines,
    techo,
    'studio photography',
    'dramatic lighting',
    'ultra realistic',
    '8k',
    'car magazine photo',
  ].join(', ');
 
  // Pollinations solo necesita el prompt en la URL — sin API key
  const urlEncoded = encodeURIComponent(prompt);
  const imageUrl = `https://image.pollinations.ai/prompt/${urlEncoded}?width=1280&height=720&nologo=true`;
 
  console.log('\n========================================');
  console.log('  🎨 VISUALIZACION CON IA');
  console.log('========================================');
  console.log(`  Auto   : ${nombre}`);
  console.log(`  Motor  : ${config.motor}`);
  console.log(`  Pintura: ${config.pintura}`);
  console.log('\n  Generando imagen... (puede tardar unos segundos)');
  console.log('\n  🔗 Link:');
  console.log(`  ${imageUrl}`);
  console.log('\n  Abriendo en tu navegador...');
  console.log('========================================');
 
  abrirEnNavegador(imageUrl);
}