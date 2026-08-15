import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

// Rasterises public/favicon.svg into the PNG sizes browsers still ask for.
// Run with: npm run icons

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const source = await readFile(path.join(root, "public", "favicon.svg"));

const targets = [
  { file: "favicon-32x32.png", size: 32 },
  { file: "apple-touch-icon.png", size: 180 },
];

for (const { file, size } of targets) {
  // A high density keeps the vector crisp before it is downsampled.
  await sharp(source, { density: 512 })
    .resize(size, size, { fit: "contain" })
    .png({ compressionLevel: 9 })
    .toFile(path.join(root, "public", file));
  console.log(`icons: public/${file} (${size}x${size})`);
}
