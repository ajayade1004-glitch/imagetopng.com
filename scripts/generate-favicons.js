import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const svgPath = path.join(rootDir, 'public', 'favicon.svg');
const svgBuffer = fs.readFileSync(svgPath);

async function generate() {
  console.log('Generating PNG favicons and app logo from SVG...');

  // 1. favicon-16x16.png
  await sharp(svgBuffer)
    .resize(16, 16)
    .png()
    .toFile(path.join(rootDir, 'public', 'favicon-16x16.png'));

  // 2. favicon-32x32.png
  await sharp(svgBuffer)
    .resize(32, 32)
    .png()
    .toFile(path.join(rootDir, 'public', 'favicon-32x32.png'));

  // 3. apple-touch-icon.png (180x180)
  await sharp(svgBuffer)
    .resize(180, 180)
    .png()
    .toFile(path.join(rootDir, 'public', 'apple-touch-icon.png'));

  // 4. icon-192.png (192x192 PWA)
  await sharp(svgBuffer)
    .resize(192, 192)
    .png()
    .toFile(path.join(rootDir, 'public', 'icon-192.png'));

  // 5. icon-512.png (512x512 PWA)
  await sharp(svgBuffer)
    .resize(512, 512)
    .png()
    .toFile(path.join(rootDir, 'public', 'icon-512.png'));

  // 6. logo.png (512x512)
  await sharp(svgBuffer)
    .resize(512, 512)
    .png()
    .toFile(path.join(rootDir, 'public', 'logo.png'));

  // 7. og-image.png (1200x630 Social card preview)
  const bgCard = sharp({
    create: {
      width: 1200,
      height: 630,
      channels: 4,
      background: { r: 10, g: 83, b: 228, alpha: 1 },
    },
  });

  const logoResized = await sharp(svgBuffer)
    .resize(320, 320)
    .png()
    .toBuffer();

  await bgCard
    .composite([
      {
        input: logoResized,
        top: 155,
        left: 440,
      },
    ])
    .png()
    .toFile(path.join(rootDir, 'public', 'og-image.png'));

  console.log('All favicons and brand assets generated successfully!');
}

generate().catch(console.error);
