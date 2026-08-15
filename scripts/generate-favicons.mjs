import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

// Rasterises public/favicon.svg into every size browsers and PWAs ask for.
// Run with: npm run icons

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const svg = fs.readFileSync(path.join(root, "public", "favicon.svg"));

const sizes = [
  { file: "favicon-16x16.png", size: 16 },
  { file: "favicon-32x32.png", size: 32 },
  { file: "apple-touch-icon.png", size: 180 },
  { file: "icon-192.png", size: 192 },
  { file: "icon-512.png", size: 512 },
];

for (const { file, size } of sizes) {
  // A high density keeps the vector crisp before it is downsampled.
  await sharp(svg, { density: 512 })
    .resize(size, size, { fit: "contain" })
    .png({ compressionLevel: 9 })
    .toFile(path.join(root, "public", file));
}

console.log(`Favicons generated: ${sizes.map((s) => s.file).join(", ")}`);
