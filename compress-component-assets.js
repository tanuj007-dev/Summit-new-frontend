#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputDir = path.join(__dirname, 'src/components/assets');
const backupDir = path.join(__dirname, 'src/components/assets/backup');

const QUALITY = 75; // Slightly lower quality for visible savings on large images
const WEBP_QUALITY = 75;

async function ensureBackupDir() {
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
    console.log(`✅ Created backup directory: ${backupDir}`);
  }
}

async function compressComponentImages() {
  try {
    console.log('🎨 Compressing component asset images...\n');

    await ensureBackupDir();

    const files = fs.readdirSync(inputDir);
    const imageFiles = files.filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file) && !file.includes('backup'));

    if (imageFiles.length === 0) {
      console.log('ℹ️  No image files found to compress');
      return;
    }

    console.log(`Found ${imageFiles.length} image(s) to compress\n`);

    let totalSizeBefore = 0;
    let totalSizeAfter = 0;

    for (const file of imageFiles) {
      const filePath = path.join(inputDir, file);
      const backupPath = path.join(backupDir, file);
      const stats = fs.statSync(filePath);
      const fileSize = stats.size;

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

        // Compress PNG/JPG
        if (/\.(jpg|jpeg|png)$/i.test(ext)) {
          await sharp(filePath)
            .resize(2560, 2560, {
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

          const newStats = fs.statSync(filePath);
          const newSize = newStats.size;
          totalSizeAfter += newSize;

          const reduction = ((fileSize - newSize) / fileSize * 100).toFixed(1);
          const beforeMB = (fileSize / 1024 / 1024).toFixed(2);
          const afterMB = (newSize / 1024 / 1024).toFixed(2);

          console.log(`✅ ${file}`);
          console.log(`   Before: ${beforeMB} MB → After: ${afterMB} MB`);
          console.log(`   Reduction: ${reduction}%\n`);
        }
      } catch (error) {
        console.error(`❌ Error compressing ${file}:`, error.message);
      }
    }

    // Final summary
    const beforeMB = (totalSizeBefore / 1024 / 1024).toFixed(2);
    const afterMB = (totalSizeAfter / 1024 / 1024).toFixed(2);
    const totalReduction = ((totalSizeBefore - totalSizeAfter) / totalSizeBefore * 100).toFixed(1);

    console.log('='.repeat(50));
    console.log('📊 COMPRESSION SUMMARY');
    console.log('='.repeat(50));
    console.log(`Total size before: ${beforeMB} MB`);
    console.log(`Total size after:  ${afterMB} MB`);
    console.log(`Total reduction:   ${totalReduction}%`);
    console.log('='.repeat(50));
    console.log('\n✨ Component assets compression complete!');
    console.log(`📝 Backups saved in: ${backupDir}/`);

  } catch (error) {
    console.error('Fatal error:', error);
    process.exit(1);
  }
}

compressComponentImages();
