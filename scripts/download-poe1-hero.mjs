import { writeFile, mkdir } from "fs/promises";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const url =
  "https://web.poecdn.com/protected/image/layout/keepersoftheflame-bg.jpg?v=1760327226353&key=6rOD4hOtdXO9aKxw9OER0A";
const out = join(__dirname, "..", "public", "images", "poe1-hero.jpg");

await mkdir(dirname(out), { recursive: true });
const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
await writeFile(out, Buffer.from(await res.arrayBuffer()));
console.log("Saved", out);
