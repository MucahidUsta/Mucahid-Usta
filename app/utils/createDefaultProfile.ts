import { createCanvas } from 'canvas';
import fs from 'fs';

const canvas = createCanvas(150, 150);
const ctx = canvas.getContext('2d');

// Arka plan
ctx.fillStyle = '#4B5563';
ctx.fillRect(0, 0, 150, 150);

// Kullanıcı ikonu
ctx.fillStyle = '#9CA3AF';
ctx.beginPath();
ctx.arc(75, 60, 30, 0, Math.PI * 2);
ctx.fill();

ctx.beginPath();
ctx.arc(75, 140, 50, Math.PI, Math.PI * 2);
ctx.fill();

const buffer = canvas.toBuffer('image/png');
fs.writeFileSync('./public/default-profile.png', buffer); 