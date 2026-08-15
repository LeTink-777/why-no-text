import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

// Builds public/og-image.png (1200x630) from og.json + the project favicon.
// Run with: npm run og

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const config = JSON.parse(fs.readFileSync(path.join(root, "scripts", "og.json"), "utf8"));
const favicon = fs.readFileSync(path.join(root, "public", "favicon.svg")).toString("base64");

/** SVG has no text wrapping — break the headline on whole words. */
function wrap(text, maxChars) {
  const lines = [];
  let line = "";
  for (const word of text.split(" ")) {
    if (line && (line + " " + word).length > maxChars) {
      lines.push(line);
      line = word;
    } else {
      line = line ? `${line} ${word}` : word;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function escapeXml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const headlineLines = wrap(config.headline, 22);
const headlineSize = headlineLines.length > 1 ? 72 : 84;
const startY = 316 - (headlineLines.length - 1) * (headlineSize * 0.58);

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="glow" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${config.accent}" stop-opacity="0.30"/>
      <stop offset="60%" stop-color="${config.accent}" stop-opacity="0.05"/>
      <stop offset="100%" stop-color="${config.bg}" stop-opacity="0"/>
    </linearGradient>
  </defs>

  <rect width="1200" height="630" fill="${config.bg}"/>
  <rect width="1200" height="630" fill="url(#glow)"/>
  <rect x="0" y="0" width="1200" height="8" fill="${config.accent}"/>

  <image href="data:image/svg+xml;base64,${favicon}" x="88" y="86" width="84" height="84"/>

  ${headlineLines
    .map(
      (line, index) =>
        `<text x="88" y="${startY + index * headlineSize * 1.12}" font-family="Helvetica, Arial, sans-serif" font-size="${headlineSize}" font-weight="bold" fill="${config.ink}">${escapeXml(line)}</text>`,
    )
    .join("\n  ")}

  <text x="88" y="${startY + headlineLines.length * headlineSize * 1.12 + 34}" font-family="Helvetica, Arial, sans-serif" font-size="34" fill="${config.accent}">${escapeXml(config.sub)}</text>

  <text x="88" y="556" font-family="Helvetica, Arial, sans-serif" font-size="24" fill="${config.muted}">${escapeXml(config.domain)}</text>
</svg>`;

await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile(path.join(root, "public", "og-image.png"));

console.log("OG image generated: public/og-image.png (1200x630)");
