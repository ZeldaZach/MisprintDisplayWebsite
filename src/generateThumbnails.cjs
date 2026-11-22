#!/usr/bin/env node

// Makes a webp thumbnail of every image in resources/images-large for each
// size below, skipping any thumbnail that already exists. The site's 300px
// and 750px views load these; the "large" view loads the original file.

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// The 300px view is rendered 450px wide so it stays sharp on high-DPI screens.
const sizes = [
    { width: 450, dir: 'resources/images-300px', quality: 80 },
    { width: 750, dir: 'resources/images-750px', quality: 80 },
];

async function generateThumbnails() {
    const largeDir = 'resources/images-large';

    if (!fs.existsSync(largeDir)) {
        console.error(`Error: ${largeDir} does not exist`);
        process.exit(1);
    }

    for (const size of sizes) {
        fs.mkdirSync(size.dir, { recursive: true });
    }

    const imageFiles = fs.readdirSync(largeDir).filter(file => /\.(jpg|jpeg|png|webp)$/i.test(file));
    console.log(`Found ${imageFiles.length} images to process`);

    let processed = 0;
    let skipped = 0;
    let failed = 0;

    for (const file of imageFiles) {
        const inputPath = path.join(largeDir, file);

        for (const size of sizes) {
            const outputPath = path.join(size.dir, file.replace(/\.[^.]+$/, '.webp'));

            if (fs.existsSync(outputPath)) {
                skipped++;
                continue;
            }

            try {
                await sharp(inputPath)
                    .rotate() // apply EXIF orientation before metadata is dropped
                    .resize(size.width, null, { fit: 'inside', withoutEnlargement: true })
                    .webp({ quality: size.quality })
                    .toFile(outputPath);
                processed++;
                if (processed % 100 === 0) {
                    console.log(`Processed ${processed} thumbnails...`);
                }
            } catch (err) {
                failed++;
                console.error(`Error processing ${file} at ${size.width}px:`, err.message);
            }
        }
    }

    console.log(`\nComplete! Processed: ${processed}, Skipped: ${skipped}, Failed: ${failed}`);
}

generateThumbnails().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});
