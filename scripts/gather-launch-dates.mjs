/**
 * External data gathering: fetch launch/league dates from APIs and feeds,
 * then compare with src/data/leagues.json. Run periodically (e.g. weekly in CI).
 *
 * Env (optional): set in .env or environment
 *   STEAM_API_KEY   - https://steamcommunity.com/dev/apikey (for Steam news)
 *   POE_OAUTH_TOKEN - GGG access token, OR use POE_CLIENT_ID + POE_CLIENT_SECRET (client_credentials)
 *
 * Usage: node scripts/gather-launch-dates.mjs  (or npm run gather-dates)
 */

import "dotenv/config";
import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

const leagues = JSON.parse(
  readFileSync(join(ROOT, "src", "data", "leagues.json"), "utf8")
);
const { sources } = JSON.parse(
  readFileSync(join(ROOT, "src", "data", "external-sources.json"), "utf8")
);

const leagueById = Object.fromEntries(leagues.map((l) => [l.id, l]));

/** Parse ISO or common date strings from text; return array of Date or [] */
function extractDatesFromText(text) {
  if (!text || typeof text !== "string") return [];
  const out = [];
  // ISO
  const iso = /(\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2}(?::\d{2})?(?:Z|[+-]\d{2}:?\d{2})?)?)/g;
  let m;
  while ((m = iso.exec(text)) !== null) {
    const d = new Date(m[1]);
    if (!Number.isNaN(d.getTime())) out.push(d);
  }
  // "Month DD, YYYY" or "Month DD YYYY"
  const long = /(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+\d{1,2},?\s+\d{4}/gi;
  while ((m = long.exec(text)) !== null) {
    const d = new Date(m[0]);
    if (!Number.isNaN(d.getTime())) out.push(d);
  }
  return out;
}

/** Get PoE access token: use POE_OAUTH_TOKEN or exchange POE_CLIENT_ID + POE_CLIENT_SECRET */
async function getPoeAccessToken() {
  if (process.env.POE_OAUTH_TOKEN) return process.env.POE_OAUTH_TOKEN;
  const id = process.env.POE_CLIENT_ID;
  const secret = process.env.POE_CLIENT_SECRET;
  if (!id || !secret) return null;
  const res = await fetch("https://www.pathofexile.com/oauth/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: id,
      client_secret: secret,
      grant_type: "client_credentials",
      scope: "service:leagues",
    }),
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.access_token || null;
}

async function fetchPoeLeagues(realm = "pc") {
  const token = await getPoeAccessToken();
  if (!token) {
    return {
      error:
        "Set POE_OAUTH_TOKEN, or POE_CLIENT_ID + POE_CLIENT_SECRET (see docs/POE_API_ACCESS.md)",
    };
  }
  const url = `https://api.pathofexile.com/league?type=main&realm=${realm}&limit=20`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return { error: `PoE API ${res.status}: ${await res.text()}` };
  const data = await res.json();
  const leagues = (data.leagues || []).filter(
    (l) => l.startTime && (l.endTime === null || new Date(l.endTime) > new Date())
  );
  const withStart = leagues.map((l) => ({
    name: l.id,
    start: l.startTime ? new Date(l.startTime) : null,
    end: l.endTime ? new Date(l.endTime) : null,
  }));
  return { dates: withStart };
}

async function fetchSteamNews(appId) {
  const key = process.env.STEAM_API_KEY;
  if (!key) {
    return { error: "Set STEAM_API_KEY (https://steamcommunity.com/dev/apikey)" };
  }
  const url = `https://api.steampowered.com/ISteamNews/GetNewsForApp/v2/?appid=${appId}&count=15&key=${key}&format=json`;
  const res = await fetch(url);
  if (!res.ok) return { error: `Steam API ${res.status}` };
  const data = await res.json();
  const items = data?.appnews?.newsitems || [];
  const dates = [];
  for (const item of items) {
    const text = [item.title, item.contents].filter(Boolean).join(" ");
    dates.push(...extractDatesFromText(text));
  }
  return { dates: [...new Set(dates.map((d) => d.toISOString()))].map((s) => new Date(s)) };
}

async function fetchRss(url) {
  const res = await fetch(url, {
    headers: { "User-Agent": "NextLeagueStart/1.0 (data gathering)" },
  });
  if (!res.ok) return { error: `RSS ${res.status}: ${url}` };
  const xml = await res.text();
  const dates = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/gi;
  const pubDateRegex = /<pubDate>([^<]+)<\/pubDate>/i;
  let block;
  while ((block = itemRegex.exec(xml)) !== null) {
    const pub = pubDateRegex.exec(block[1]);
    if (pub) {
      const d = new Date(pub[1].trim());
      if (!Number.isNaN(d.getTime())) dates.push(d);
    }
    dates.push(...extractDatesFromText(block[1]));
  }
  return { dates };
}

async function gatherOne(source) {
  const league = leagueById[source.leagueId];
  const ourDate = league ? new Date(league.date) : null;

  if (source.type === "poe") {
    const result = await fetchPoeLeagues(source.realm || "pc");
    if (result.error) return { source, ourDate, error: result.error };
    const nextStart = result.dates
      .filter((l) => l.start && l.start > new Date())
      .sort((a, b) => a.start - b.start)[0];
    return {
      source,
      ourDate,
      externalDates: nextStart ? [nextStart.start] : [],
      externalLabel: nextStart ? nextStart.name : null,
    };
  }

  if (source.type === "steam_news") {
    const result = await fetchSteamNews(source.appId);
    if (result.error) return { source, ourDate, error: result.error };
    const future = (result.dates || []).filter((d) => d > new Date()).sort((a, b) => a - b);
    return { source, ourDate, externalDates: future.slice(0, 5), externalLabel: null };
  }

  if (source.type === "rss") {
    const result = await fetchRss(source.url);
    if (result.error) return { source, ourDate, error: result.error };
    const future = (result.dates || []).filter((d) => d > new Date()).sort((a, b) => a - b);
    return { source, ourDate, externalDates: future.slice(0, 5), externalLabel: null };
  }

  return { source, ourDate, error: `Unknown type: ${source.type}` };
}

function formatDate(d) {
  return d ? d.toISOString().slice(0, 16) + "Z" : "—";
}

async function main() {
  console.log("External launch date gathering (compare to leagues.json)\n");

  const results = [];
  for (const source of sources) {
    const r = await gatherOne(source);
    results.push(r);
  }

  console.log("League ID                    | Our date              | External / status");
  console.log("-".repeat(80));
  for (const r of results) {
    const id = (r.source.leagueId + " ").padEnd(28);
    const our = formatDate(r.ourDate).padEnd(22);
    let ext = "";
    if (r.error) ext = r.error;
    else if (r.externalLabel) ext = `${r.externalLabel}: ${formatDate(r.externalDates[0])}`;
    else if (r.externalDates?.length) ext = r.externalDates.map(formatDate).join(", ");
    else ext = "(no future dates found)";
    console.log(`${id} | ${our} | ${ext}`);
  }

  console.log("\nTo use: set STEAM_API_KEY and/or POE_OAUTH_TOKEN and re-run.");
  console.log("See docs/EXTERNAL_DATA_SOURCES.md for setup.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
