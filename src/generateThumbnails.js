#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const sizes = [
    { width: 300, dir: 'resources/images-300px', quality: 100 },
    { width: 750, dir: 'resources/images-750px', quality: 100 }
];

async function generateThumbnails() {
    const largeDir = 'resources/images-large';

    if (!fs.existsSync(largeDir)) {
        console.error(`Error: ${largeDir} does not exist`);
        process.exit(1);
    }

    // Create thumbnail directories
    for (const size of sizes) {
        if (!fs.existsSync(size.dir)) {
            fs.mkdirSync(size.dir, { recursive: true });
        }
    }

    const files = fs.readdirSync(largeDir);
    const imageFiles = files.filter(file => /\.(jpg|jpeg|png|webp)$/i.test(file));

    console.log(`Found ${imageFiles.length} images to process`);

    let processed = 0;
    let skipped = 0;

    for (const file of imageFiles) {
        const inputPath = path.join(largeDir, file);

        for (const size of sizes) {
            const outputPath = path.join(size.dir, file);
            const webpOutputPath = outputPath.replace(/\.(jpg|jpeg|png)$/i, '.webp');

            // Skip if both JPEG and WebP thumbnails already exist
            if (fs.existsSync(outputPath) && fs.existsSync(webpOutputPath)) {
                skipped += 2;
                continue;
            }

            try {
                // Generate JPEG thumbnail
                if (!fs.existsSync(outputPath)) {
                    await sharp(inputPath)
                        .resize(size.width, null, {
                            width: size.width,
                            fit: 'inside',
                            withoutEnlargement: true
                        })
                        .jpeg({
                            quality: size.quality,
                            progressive: true,
                            mozjpeg: true
                        })
                        .toFile(outputPath);
                    processed++;
                } else {
                    skipped++;
                }

                // Generate WebP thumbnail
                if (!fs.existsSync(webpOutputPath)) {
                    await sharp(inputPath)
                        .resize(size.width, null, {
                            width: size.width,
                            fit: 'inside',
                            withoutEnlargement: true
                        })
                        .webp({
                            quality: size.quality,
                        })
                        .toFile(webpOutputPath);
                    processed++;
                } else {
                    skipped++;
                }

                if (processed % 50 === 0) {
                    console.log(`Processed ${processed} thumbnails...`);
                }
            } catch (err) {
                console.error(`Error processing ${file} at ${size.width}px:`, err.message);
            }
        }
    }

    console.log(`\nComplete! Processed: ${processed}, Skipped: ${skipped}`);
    console.log(`Generated thumbnails in:`);
    for (const size of sizes) {
        const count = fs.readdirSync(size.dir).length;
        console.log(`  - ${size.dir}: ${count} files`);
    }
}

generateThumbnails().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});
