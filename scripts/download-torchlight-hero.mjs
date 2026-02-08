import { writeFile, mkdir } from "fs/promises";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const url = "https://images.igdb.com/igdb/image/upload/t_original/ar53yj.jpg";
const out = join(__dirname, "..", "public", "images", "torchlight-infinite-hero.jpg");

await mkdir(dirname(out), { recursive: true });
const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
await writeFile(out, Buffer.from(await res.arrayBuffer()));
console.log("Saved", out);
