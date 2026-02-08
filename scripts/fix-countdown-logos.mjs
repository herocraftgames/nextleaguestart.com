/**
 * Fix countdown banner logos: files are shifted (each contains the next game's image).
 * Rotates: diablo-4.png ← slormancer.png (D4), slormancer ← nrftw (Slormancer),
 * no-rest-for-the-wicked ← poe-2 (NRFTW), poe-2 ← fresh download (POE2).
 * Run once: node scripts/fix-countdown-logos.mjs
 */
import { readFile, writeFile } from "fs/promises";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const LOGOS_DIR = join(__dirname, "..", "public", "assets", "logos");

const POE2_URL =
  "https://pathofexile2.com/protected/image/poe2/layout/navbar/logo-2x.webp?key=kJebCnboYx6R4wt88ISxhQ";

async function main() {
  // Read current files (each contains the NEXT game's image)
  const slormancerBuf = await readFile(join(LOGOS_DIR, "slormancer.png")); // has D4
  const nrftwBuf = await readFile(join(LOGOS_DIR, "no-rest-for-the-wicked.png")); // has Slormancer
  const poe2Buf = await readFile(join(LOGOS_DIR, "poe-2.webp")); // has NRFTW

  // Download correct POE2 logo
  const res = await fetch(POE2_URL);
  if (!res.ok) throw new Error(`Failed to fetch POE2: ${res.status}`);
  const poe2Correct = Buffer.from(await res.arrayBuffer());

  // Write in correct order so we don't overwrite before reading
  await writeFile(join(LOGOS_DIR, "diablo-4.png"), slormancerBuf);
  await writeFile(join(LOGOS_DIR, "slormancer.png"), nrftwBuf);
  await writeFile(join(LOGOS_DIR, "no-rest-for-the-wicked.png"), poe2Buf);
  await writeFile(join(LOGOS_DIR, "poe-2.webp"), poe2Correct);

  console.log("Fixed: diablo-4.png, slormancer.png, no-rest-for-the-wicked.png, poe-2.webp");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
