import { writeFile, mkdir } from "fs/promises";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const url =
  "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1104280/837002dc0219483fcb3cc717040bfbefde8e7d18/page_bg_raw.jpg?t=1755278434";
const out = join(__dirname, "..", "public", "images", "slormancer-hero.jpg");

await mkdir(dirname(out), { recursive: true });
const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
await writeFile(out, Buffer.from(await res.arrayBuffer()));
console.log("Saved", out);
