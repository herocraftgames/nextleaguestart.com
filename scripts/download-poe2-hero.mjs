import { writeFile, mkdir } from "fs/promises";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const url =
  "https://web.poecdn.com/protected/image/poe2/banner_1_1x.webp?v=1728251733485&key=sxN-bhmG-zOGtQbswEaI5g";
const out = join(__dirname, "..", "public", "images", "poe2-hero.webp");

await mkdir(dirname(out), { recursive: true });
const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
await writeFile(out, Buffer.from(await res.arrayBuffer()));
console.log("Saved", out);
