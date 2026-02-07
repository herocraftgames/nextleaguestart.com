/**
 * Downloads game logos from remote URLs to public/assets/logos/
 * Run with: node scripts/download-logos.mjs
 */
import { mkdir, writeFile } from "fs/promises";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ASSETS_DIR = join(__dirname, "..", "public", "assets", "logos");

const logos = [
  {
    id: "torchlight-infinite",
    url: "https://cdn2.steamgriddb.com/logo_thumb/b7afda4f7aaf182d35567901387b9831.png",
    ext: "png",
  },
  {
    id: "path-of-exile-1",
    url: "https://web.poecdn.com/protected/image/layout/keepersoftheflamelogo.png?v=1759263207478&key=ozVdgzq0hTJF8b083cHjig",
    ext: "png",
  },
  {
    id: "last-epoch",
    url: "https://lastepoch.com/_nuxt/img/78281a5.png",
    ext: "png",
  },
  // poe-2: uses /images/poe2-logo.webp directly (manually managed)
  {
    id: "diablo-4",
    url: "https://blz-contentstack-images.akamaized.net/v3/assets/blt9c12f249ac15c7ec/bltf02e9771079d579c/691faca3521fe68049244ffa/D4_X2_Logo_enUS.png?format=webp",
    ext: "png",
  },
];

await mkdir(ASSETS_DIR, { recursive: true });

for (const logo of logos) {
  const filename = `${logo.id}.${logo.ext}`;
  const filepath = join(ASSETS_DIR, filename);

  const response = await fetch(logo.url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${logo.id}: ${response.status} ${response.statusText}`);
  }
  const buffer = await response.arrayBuffer();
  await writeFile(filepath, Buffer.from(buffer));
  console.log(`Downloaded ${filename}`);
}

console.log("Done! Logos saved to public/assets/logos/");
