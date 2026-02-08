import { writeFile, mkdir } from "fs/promises";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const url =
  "https://norestforthewicked.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fno-rest-for-the-wicked-key-art.12470d2c.jpg&w=640&q=100";
const out = join(__dirname, "..", "public", "images", "no-rest-for-the-wicked-hero.jpg");

await mkdir(dirname(out), { recursive: true });
const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
await writeFile(out, Buffer.from(await res.arrayBuffer()));
console.log("Saved", out);
