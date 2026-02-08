import { writeFile, mkdir } from "fs/promises";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const url =
  "https://blz-contentstack-images.akamaized.net/v3/assets/blt9c12f249ac15c7ec/blt25231963f9980159/692737716da530ed3307b203/D4_X2_PrePurchaseBG_960.png";
const out = join(__dirname, "..", "public", "images", "d4-vessel.png");

await mkdir(dirname(out), { recursive: true });
const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
await writeFile(out, Buffer.from(await res.arrayBuffer()));
console.log("Saved", out);
