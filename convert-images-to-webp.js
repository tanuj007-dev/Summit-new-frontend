import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define directories to process
const directories = [
  'asset/images',
  'asset/iconvector',
  'public/asset/images',
  'public/asset/iconvector',
  'src/components/assets'
];

// Configuration
const config = {
  quality: 80,
  effort: 6, // 0-6, higher = better compression but slower
  alphaQuality: 100,
};

// Track converted files
let converted = 0;
let failed = 0;
let skipped = 0;

/**
 * Convert a single image to WebP
 */
async function convertImageToWebP(filePath) {
  try {
    // Skip if already WebP
    if (filePath.endsWith('.webp')) {
      return null;
    }

    // Only process PNG and JPG
    const ext = path.extname(filePath).toLowerCase();
    if (!['.png', '.jpg', '.jpeg'].includes(ext)) {
      return null;
    }

    // Get output path
    const outputPath = filePath.replace(/\.(png|jpg|jpeg)$/i, '.webp');

    // Skip if WebP already exists
    if (fs.existsSync(outputPath)) {
      return 'skipped';
    }

    // Read the image
    const image = sharp(filePath);

    // Get metadata to preserve transparency
    const metadata = await image.metadata();

    // Convert based on format
    if (metadata.hasAlpha || ext === '.png') {
      // PNG - preserve transparency
      await image
        .webp({ quality: config.quality, effort: config.effort, alphaQuality: config.alphaQuality })
        .toFile(outputPath);
    } else {
      // JPG - no transparency needed
      await image
        .webp({ quality: config.quality, effort: config.effort })
        .toFile(outputPath);
    }

    console.log(`✓ Converted: ${filePath} → ${outputPath}`);
    return 'converted';
  } catch (error) {
    console.error(`✗ Failed to convert ${filePath}:`, error.message);
    return 'failed';
  }
}

/**
 * Process directory recursively
 */
async function processDirectory(dirPath) {
  try {
    if (!fs.existsSync(dirPath)) {
      console.log(`⚠ Directory not found: ${dirPath}`);
      return;
    }

    const files = fs.readdirSync(dirPath);

    for (const file of files) {
      const fullPath = path.join(dirPath, file);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        // Recursively process subdirectories
        await processDirectory(fullPath);
      } else if (stat.isFile()) {
        // Convert the image
        const result = await convertImageToWebP(fullPath);
        if (result === 'converted') converted++;
        else if (result === 'skipped') skipped++;
        else if (result === 'failed') failed++;
      }
    }
  } catch (error) {
    console.error(`Error processing directory ${dirPath}:`, error.message);
  }
}

/**
 * Main execution
 */
async function main() {
  console.log('🚀 Starting image conversion to WebP...\n');

  for (const dir of directories) {
    const fullPath = path.join(process.cwd(), dir);
    console.log(`📁 Processing: ${dir}`);
    await processDirectory(fullPath);
  }

  console.log('\n✅ Conversion complete!');
  console.log(`   Converted: ${converted} images`);
  console.log(`   Skipped: ${skipped} images (already exist)`);
  console.log(`   Failed: ${failed} images`);
}

// Check if sharp is installed
try {
  await import('sharp');
} catch (error) {
  console.error('❌ Error: sharp module not found');
  console.error('Please install it first: npm install sharp');
  process.exit(1);
}

// Run the script
main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
