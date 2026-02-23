# Getting a Path of Exile API key (OAuth)

PoE’s API is **not self-serve**. You request access by email; GGG approves and sends **client_id** and **client_secret**. Use those in `.env` and the gather script will obtain an access token automatically.

## 1. Email GGG

**To:** [oauth@grindinggear.com](mailto:oauth@grindinggear.com)  
**Subject:** OAuth Application (or similar)

They explicitly **reject low-effort or LLM-generated requests**. Write the email yourself and show you’ve read the docs. Keep it short and concrete.

## 2. What to include in the email

(from [Developer Docs – Registering your Application](https://www.pathofexile.com/developer/docs)):

| Item | What to say |
|------|---------------------|
| **Application name** | e.g. “Next League Start” or “nextleaguestart.com” |
| **Client type** | Confidential (server-side only; credentials never in the browser) |
| **Grant type** | `client_credentials` (no user login; we only need league list with start/end dates) |
| **Scope** | `service:leagues` — to call the league API and show next league start dates on the site |
| **Redirect URI** | Not needed for client_credentials. If they insist, give your site’s HTTPS URL (e.g. `https://nextleaguestart.com`) |
| **Your PoE account** | Your account name including the 4-digit discriminator (e.g. `YourName#1234`) |

**Why you need it:** “I run nextleaguestart.com, a countdown site for ARPG league starts. I need to fetch the list of leagues and their start/end times so the site stays accurate. I only need read-only league data, no account or ladder access.”

## 3. After they approve

They’ll send **client_id** and **client_secret** (by email). Add them to your `.env`:

```env
POE_CLIENT_ID=your_client_id_here
POE_CLIENT_SECRET=your_client_secret_here
```

Do **not** commit `.env`. The script will use these to get an access token when you run `npm run gather-dates`.

## 4. If you already have an access token

If you obtained an access token yourself (e.g. from testing with a different tool), you can use it directly:

```env
POE_OAUTH_TOKEN=your_access_token_here
```

Client_credentials tokens from GGG do not expire; you can use one token until it’s revoked.

## Links

- [Developer docs – Authorization](https://www.pathofexile.com/developer/docs/authorization)
- [Developer docs – Getting started / Registering](https://www.pathofexile.com/developer/docs)
- [Manage your applications](https://www.pathofexile.com/my-account/applications) (after you’re approved)
