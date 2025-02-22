import { createCanvas } from 'canvas';
import fs from 'fs';

const canvas = createCanvas(400, 250);
const ctx = canvas.getContext('2d');

// Arka plan
ctx.fillStyle = '#E5E7EB';
ctx.fillRect(0, 0, 400, 250);

// Proje ikonu
ctx.fillStyle = '#9CA3AF';
ctx.font = '48px Arial';
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';
ctx.fillText('🖼️', 200, 125);

// Metin
ctx.font = '24px Arial';
ctx.fillText('Proje Görseli', 200, 180);

const buffer = canvas.toBuffer('image/png');
fs.writeFileSync('./public/projects/default-project.png', buffer); 