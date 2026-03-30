# OSRS Stats Site - Deployment Guide

## The CORS Problem

The OSRS Hiscores API (`secure.runescape.com`) doesn't allow browser-based JavaScript to fetch data directly due to CORS restrictions. We need a proxy.

## Solution: Cloudflare Worker (Free & Reliable)

Deploy the included `worker.js` as a Cloudflare Worker — it's free for up to 100,000 requests/day.

### Quick Deployment Steps:

1. Go to https://workers.cloudflare.com/
2. Sign up (free tier)
3. Create a new Worker
4. Copy the content of `worker.js` into the worker editor
5. Deploy it (give it a name like `osrs-api`)
6. You'll get a URL like: `https://osrs-api.YOUR_SUBDOMAIN.workers.dev`
7. Update `app.js` line 43 to use your worker URL:
   ```javascript
   const proxyUrl = `https://osrs-api.YOUR_SUBDOMAIN.workers.dev?player=${encodeURIComponent(username)}`;
   ```
8. Commit, push, done!

### Alternative: Use a Public Proxy (Unreliable)

If you don't want to deploy a worker, the code currently tries `api.allorigins.win/raw` which works... sometimes. Free CORS proxies are slow, rate-limited, and often down.

## Current Status

- Mock stats have been **completely removed**
- Real API integration is implemented
- Waiting for worker deployment to replace `api.allorigins.win`

## Testing

Once deployed, test with:
- `Samuelb2800` (should show 77 Ranged, NOT 93)
- `10tontos` (should show level 99 in most combat stats)
