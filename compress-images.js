#!/usr/bin/env node

/**
 * Image Compression Script
 * Automatically compresses all images in the asset/images folder
 * 
 * Installation:
 * npm install -D sharp
 * 
 * Usage:
 * node compress-images.js
 */

import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputDir = path.join(__dirname, 'asset/images');
const backupDir = path.join(__dirname, 'asset/images/backup');

const QUALITY = 80; // Adjust between 1-100
const WEBP_QUALITY = 80;

async function ensureBackupDir() {
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
    console.log(`✅ Created backup directory: ${backupDir}`);
  }
}

async function compressImages() {
  try {
    console.log('🖼️  Starting image compression...\n');

    await ensureBackupDir();

    const files = fs.readdirSync(inputDir);
    const imageFiles = files.filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file));

    if (imageFiles.length === 0) {
      console.log('ℹ️  No image files found to compress');
      return;
    }

    console.log(`Found ${imageFiles.length} image(s) to compress\n`);

    let compressed = 0;
    let skipped = 0;
    let totalSizeBefore = 0;
    let totalSizeAfter = 0;

    for (const file of imageFiles) {
      const filePath = path.join(inputDir, file);
      const backupPath = path.join(backupDir, file);
      const stats = fs.statSync(filePath);
      const fileSize = stats.size;

      // Skip if already in backup directory
      if (file.includes('backup')) {
        skipped++;
        continue;
      }

      totalSizeBefore += fileSize;

      try {
        // Backup original
        if (!fs.existsSync(backupPath)) {
          fs.copyFileSync(filePath, backupPath);
        }

        // Get file info
        const ext = path.extname(file).toLowerCase();
        const basename = path.basename(file, ext);
        const tempPath = path.join(inputDir, `temp-${file}`);

        // Compress JPG/PNG
        if (/\.(jpg|jpeg|png)$/i.test(ext)) {
          // Compress to temp file first
          await sharp(filePath)
            .resize(2000, 2000, {
              fit: 'inside',
              withoutEnlargement: true
            })
            .toFormat(ext === '.png' ? 'png' : 'jpeg', { 
              quality: QUALITY, 
              progressive: ext !== '.png'
            })
            .toFile(tempPath);

          // Replace original with compressed
          fs.unlinkSync(filePath);
          fs.renameSync(tempPath, filePath);

          // Also create WebP version
          const webpPath = path.join(inputDir, `${basename}.webp`);
          await sharp(filePath)
            .resize(2000, 2000, {
              fit: 'inside',
              withoutEnlargement: true
            })
            .webp({ quality: WEBP_QUALITY })
            .toFile(webpPath);

          const newStats = fs.statSync(filePath);
          const reduction = ((fileSize - newStats.size) / fileSize * 100).toFixed(1);

          console.log(`✅ ${file}`);
          console.log(`   Original: ${(fileSize / 1024).toFixed(2)}KB`);
          console.log(`   Compressed: ${(newStats.size / 1024).toFixed(2)}KB`);
          console.log(`   Reduction: ${reduction}%`);
          console.log(`   WebP created: ${basename}.webp\n`);

          totalSizeAfter += newStats.size;
          compressed++;
        }
      } catch (error) {
        console.error(`❌ Error compressing ${file}: ${error.message}\n`);
        skipped++;
      }
    }

    // Summary
    console.log('\n' + '='.repeat(50));
    console.log('📊 COMPRESSION SUMMARY');
    console.log('='.repeat(50));
    console.log(`Total files processed: ${compressed}`);
    console.log(`Files skipped: ${skipped}`);
    console.log(`Total size before: ${(totalSizeBefore / 1024 / 1024).toFixed(2)}MB`);
    console.log(`Total size after: ${(totalSizeAfter / 1024 / 1024).toFixed(2)}MB`);
    const totalReduction = ((totalSizeBefore - totalSizeAfter) / totalSizeBefore * 100).toFixed(1);
    console.log(`Total reduction: ${totalReduction}%`);
    console.log('='.repeat(50) + '\n');

    console.log('✨ Image compression complete!');
    console.log('📝 Backups saved in: asset/images/backup/');
    console.log('🌐 WebP versions created for modern browsers\n');

  } catch (error) {
    console.error('Fatal error:', error);
    process.exit(1);
  }
}

// Run compression
compressImages().catch(error => {
  console.error('Error:', error);
  process.exit(1);
});
