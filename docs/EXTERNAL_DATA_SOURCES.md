# External data gathering for launch dates

This doc describes how we **consistently check** upcoming game/league launch dates using external APIs and feeds. The goal is to reduce manual lag when studios announce or change dates.

## Overview

- **Source of truth** remains `src/data/leagues.json`. External data is used to *gather* and *compare* dates, not to overwrite the site automatically.
- **Script:** `scripts/gather-launch-dates.mjs` — fetches from configured sources and prints a comparison table (our date vs external).
- **Config:** `src/data/external-sources.json` — maps each league to its external source(s).

Run the script locally or in CI (e.g. weekly) and use the output to decide when to update `leagues.json`.

## Sources by type

### 1. Path of Exile (PoE1 & PoE2) — Official API

- **Endpoint:** `GET https://api.pathofexile.com/league?type=main&realm=pc` (or `realm=poe2` for PoE2).
- **Data:** League list with `startTime` / `endTime`. Good for “next league” and current league end.
- **Auth:** OAuth 2 with scope `service:leagues`. You need a GGG developer account and a client (e.g. client_credentials or account-based token).
- **Setup:** [Path of Exile Developer Docs](https://www.pathofexile.com/developer/docs) → register app → obtain token and set `POE_OAUTH_TOKEN` when running the script.

### 2. Steam — News (GetNewsForApp)

- **Endpoint:** `https://api.steampowered.com/ISteamNews/GetNewsForApp/v2/?appid={appId}&count=15&key={key}&format=json`.
- **Data:** Recent news items (title + content). Launch/season dates are in text, not a dedicated “release_date” field; the script parses date-like strings from titles and body.
- **Auth:** Free Steam Web API key from [steamcommunity.com/dev/apikey](https://steamcommunity.com/dev/apikey). Set `STEAM_API_KEY` when running the script.
- **App IDs we use:** Last Epoch `899770`, Slormancer `1228820`, No Rest for the Wicked `1371980`, Torchlight Infinite `1974050`.

### 3. Blizzard — RSS

- **URL:** [Diablo 4 news feed](https://news.blizzard.com/en-us/feed/diablo-4).
- **Data:** Feed items (title, description, pubDate). The script parses items and extracts date-like strings from title/description to catch expansion or patch dates.
- **Auth:** None. Public RSS.

## Running the gather script

```bash
# Optional: set keys for Steam and/or PoE
export STEAM_API_KEY=your_steam_key
export POE_OAUTH_TOKEN=your_poe_oauth_token

node scripts/gather-launch-dates.mjs
```

Output: one line per league with “Our date” (from `leagues.json`) and “External / status” (from API or “(no future dates found)” / error message). Use this to spot:

- Our date in the past → update or disable the league.
- External date differs from ours → check official announcement and update if correct.
- No external date found → keep monitoring or leave as-is.

## Making it consistent (CI / schedule)

- **GitHub Actions:** Add a workflow that runs `node scripts/gather-launch-dates.mjs` on a schedule (e.g. weekly). You can fail the job if any “our date” is in the past, or open an issue when the script reports a mismatch.
- **Cron / Task Scheduler:** Same command on a schedule; redirect output to a log or email.
- **Manual:** Run before each site update to quickly see what to verify against official sources.

## Limitations

- **PoE:** Requires OAuth; without `POE_OAUTH_TOKEN`, the script reports “Set POE_OAUTH_TOKEN” for PoE leagues.
- **Steam:** News is free text. Dates are best-effort from parsing; always confirm with the official announcement.
- **RSS:** Same as Steam — date extraction is heuristic. Blizzard’s feed is for “latest news,” not a dedicated “next expansion date” API.
- **Torchlight Infinite:** We use Steam news only; they also post on their own site (no public API). Keep an eye on [torchlight.xd.com/en/news](https://torchlight.xd.com/en/news) manually if needed.

Adding new games: add an entry to `src/data/external-sources.json` (and the league to `leagues.json` if needed), then extend `scripts/gather-launch-dates.mjs` if you need a new source type (e.g. another RSS or API).
