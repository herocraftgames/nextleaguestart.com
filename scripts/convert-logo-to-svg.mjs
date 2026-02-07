/**
 * Converts the site logo PNG to SVG, masking out the Gemini icon in the bottom-right.
 * Run with: node scripts/convert-logo-to-svg.mjs
 */
import { readFile, writeFile } from "fs/promises";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";
import ImageTracer from "imagetracerjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC = join(__dirname, "..", "public");
const LOGO_PNG = join(PUBLIC, "images", "nextleaguelaunch-logo.png");
const LOGO_SVG = join(PUBLIC, "images", "nextleaguelaunch-logo.svg");
const LOGO_PNG_CLEAN = join(PUBLIC, "images", "nextleaguelaunch-logo-clean.png");

const { width, height } = await sharp(LOGO_PNG).metadata();
// Mask bottom-right ~15% to remove Gemini icon
const maskSize = Math.round(Math.min(width, height) * 0.18);
const maskLeft = width - maskSize;
const maskTop = height - maskSize;

const blackRect = await sharp({
  create: {
    width: maskSize,
    height: maskSize,
    channels: 4,
    background: { r: 0, g: 0, b: 0, alpha: 1 },
  },
})
  .png()
  .toBuffer();

const masked = await sharp(LOGO_PNG).composite([
  { input: blackRect, left: maskLeft, top: maskTop },
]);

const { data: rawData, info } = await masked.ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const contentThreshold = 30;
const padPercent = 0.04; // 4% padding around content

// Find bounding box of non-black (content) pixels
let minX = info.width,
  minY = info.height,
  maxX = 0,
  maxY = 0;
for (let y = 0; y < info.height; y++) {
  for (let x = 0; x < info.width; x++) {
    const i = (y * info.width + x) * 4;
    const r = rawData[i];
    const g = rawData[i + 1];
    const b = rawData[i + 2];
    if (r > contentThreshold || g > contentThreshold || b > contentThreshold) {
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);
    }
  }
}

// Add padding, clamp to image bounds
const padX = Math.round((maxX - minX) * padPercent);
const padY = Math.round((maxY - minY) * padPercent);
const left = Math.max(0, minX - padX);
const top = Math.max(0, minY - padY);
const cropWidth = Math.min(info.width - left, maxX - minX + padX * 2);
const cropHeight = Math.min(info.height - top, maxY - minY + padY * 2);

const cropped = await masked.extract({ left, top, width: cropWidth, height: cropHeight });
const cropInfo = { width: cropWidth, height: cropHeight };

// Output PNG with transparent background
const pngData = await cropped.raw().toBuffer({ resolveWithObject: true });
for (let i = 0; i < pngData.data.length; i += 4) {
  const r = pngData.data[i];
  const g = pngData.data[i + 1];
  const b = pngData.data[i + 2];
  if (r <= contentThreshold && g <= contentThreshold && b <= contentThreshold) {
    pngData.data[i + 3] = 0;
  }
}
await sharp(Buffer.from(pngData.data), {
  raw: { width: cropInfo.width, height: cropInfo.height, channels: 4 },
})
  .png()
  .toFile(LOGO_PNG_CLEAN);
console.log("Generated", LOGO_PNG_CLEAN);

// Trace cropped image for SVG
const imageData = {
  width: cropInfo.width,
  height: cropInfo.height,
  data: new Uint8ClampedArray(pngData.data),
};

let svg = ImageTracer.imagedataToSVG(imageData, {
  scale: 1,
  viewbox: true,
  ltres: 1,
  qtres: 1,
  pathomit: 4,
  rightangleenhance: true,
  colorsampling: 0,
  numberofcolors: 2,
});

// Remove black background paths so the logo has a transparent background
svg = svg.replace(
  /<path[^>]*fill="rgb\(0,0,0\)"[^>]*\/>/g,
  ""
);

await writeFile(LOGO_SVG, svg);
console.log("Generated", LOGO_SVG);
