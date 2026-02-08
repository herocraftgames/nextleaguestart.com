/**
 * Downloads game logos from remote URLs to public/assets/logos/
 * Run with: node scripts/download-logos.mjs
 *
 * ID → Game (must match leagues.json "id" and logo path /assets/logos/{id}.{ext})
 * -------------------------------------------------------------------------------
 * torchlight-infinite   → Torchlight Infinite
 * path-of-exile-1       → Path of Exile 1
 * last-epoch            → Last Epoch
 * poe-2                 → Path of Exile 2
 * diablo-4              → Diablo 4
 * slormancer            → Slormancer
 * no-rest-for-the-wicked → No Rest for the Wicked
 */
import { mkdir, writeFile } from "fs/promises";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ASSETS_DIR = join(__dirname, "..", "public", "assets", "logos");

const logos = [
  {
    id: "torchlight-infinite",
    game: "Torchlight Infinite",
    url: "https://cdn2.steamgriddb.com/logo_thumb/b7afda4f7aaf182d35567901387b9831.png",
    ext: "png",
  },
  {
    id: "path-of-exile-1",
    game: "Path of Exile 1",
    url: "https://web.poecdn.com/protected/image/layout/keepersoftheflamelogo.png?v=1759263207478&key=ozVdgzq0hTJF8b083cHjig",
    ext: "png",
  },
  {
    id: "last-epoch",
    game: "Last Epoch",
    url: "https://lastepoch.com/_nuxt/img/78281a5.png",
    ext: "png",
  },
  {
    id: "poe-2",
    game: "Path of Exile 2",
    url: "https://pathofexile2.com/protected/image/poe2/layout/navbar/logo-2x.webp?key=kJebCnboYx6R4wt88ISxhQ",
    ext: "webp",
  },
  {
    id: "diablo-4",
    game: "Diablo 4",
    url: "https://blz-contentstack-images.akamaized.net/v3/assets/blt9c12f249ac15c7ec/bltf02e9771079d579c/691faca3521fe68049244ffa/D4_X2_Logo_enUS.png?format=webp",
    ext: "png",
  },
  {
    id: "slormancer",
    game: "Slormancer",
    url: "https://cdn.sanity.io/images/s0pirkvm/production/fae535546eafa4f6a49058717ecdb42a56e19dc4-1280x439.png",
    ext: "png",
  },
  {
    id: "no-rest-for-the-wicked",
    game: "No Rest for the Wicked",
    url: "https://norestforthewicked.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fno-rest-for-the-wicked-together-logo.1dfe7164.png&w=640&q=100",
    ext: "png",
  },
];

await mkdir(ASSETS_DIR, { recursive: true });

for (const logo of logos) {
  if (!logo.url) {
    console.log(`Skipping ${logo.id} (no URL — add logo to public/assets/logos/ manually)`);
    continue;
  }
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
