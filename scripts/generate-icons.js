// Icon generation script
// Converts source images to PNG files for Chrome extension
// Run with: node scripts/generate-icons.js

import { existsSync, mkdirSync, copyFileSync } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, '..');
const iconsDir = resolve(rootDir, 'public/icons');

const SIZES = [16, 48, 128];

// Supported source image formats (in order of preference)
const SOURCE_IMAGES = [
  'icon.png',
  'icon.svg',
  'icon.jpg',
  'icon.jpeg',
  'icon.webp',
];

async function generateIcons() {
  // Ensure icons directory exists
  if (!existsSync(iconsDir)) {
    mkdirSync(iconsDir, { recursive: true });
  }

  // Check if all required PNGs already exist
  const existingPngs = SIZES.every(size =>
    existsSync(resolve(iconsDir, `icon${size}.png`))
  );

  if (existingPngs) {
    console.log('All icon PNGs already exist, skipping generation.');
    return;
  }

  // Try to find a source image
  for (const filename of SOURCE_IMAGES) {
    const sourcePath = resolve(rootDir, filename);
    if (existsSync(sourcePath)) {
      console.log(`Found ${filename}, converting to PNG icons...`);
      try {
        await convertSourceImage(sourcePath);
        return;
      } catch (error) {
        console.warn(`Failed to convert ${filename}:`, error.message);
      }
    }
  }

  // No source image found, generate placeholders
  console.log('No source image found, generating placeholder icons...');
  console.log('To use a custom icon, add icon.png (recommended), icon.svg, or icon.jpg to the project root.');
  await generatePlaceholderIcons();
}

async function convertSourceImage(sourcePath) {
  for (const size of SIZES) {
    const outputPath = resolve(iconsDir, `icon${size}.png`);

    await sharp(sourcePath)
      .resize(size, size, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 0 }
      })
      .png()
      .toFile(outputPath);

    console.log(`Created icon${size}.png`);
  }

  console.log('Icons generated successfully!');
}

async function generatePlaceholderIcons() {
  for (const size of SIZES) {
    const outputPath = resolve(iconsDir, `icon${size}.png`);

    // Create a simple clock icon placeholder
    const svg = `
      <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
        <circle cx="${size/2}" cy="${size/2}" r="${size*0.4}" fill="none" stroke="#3B82F6" stroke-width="${Math.max(1, size*0.08)}"/>
        <circle cx="${size/2}" cy="${size/2}" r="${Math.max(1, size*0.06)}" fill="#3B82F6"/>
        <line x1="${size/2}" y1="${size/2}" x2="${size/2}" y2="${size*0.2}" stroke="#3B82F6" stroke-width="${Math.max(1, size*0.06)}" stroke-linecap="round"/>
        <line x1="${size/2}" y1="${size/2}" x2="${size*0.7}" y2="${size*0.4}" stroke="#3B82F6" stroke-width="${Math.max(1, size*0.04)}" stroke-linecap="round"/>
      </svg>
    `;

    await sharp(Buffer.from(svg))
      .png()
      .toFile(outputPath);

    console.log(`Created placeholder icon${size}.png`);
  }

  console.log('Placeholder icons generated!');
}

generateIcons().catch(console.error);
