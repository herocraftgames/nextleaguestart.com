/**
 * Generates favicon.ico from the site logo.
 * Run with: node scripts/generate-favicon.mjs
 */
import { readFile, writeFile } from "fs/promises";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";
import toIco from "to-ico";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC = join(__dirname, "..", "public");
const LOGO = join(PUBLIC, "images", "nextleaguelaunch-logo-clean.png");

const sizes = [16, 32, 48];

const buffers = await Promise.all(
  sizes.map(async (size) => {
    return sharp(await readFile(LOGO))
      .resize(size, size)
      .png()
      .toBuffer();
  })
);

const ico = await toIco(buffers);
await writeFile(join(PUBLIC, "favicon.ico"), ico);
console.log("Generated favicon.ico");
