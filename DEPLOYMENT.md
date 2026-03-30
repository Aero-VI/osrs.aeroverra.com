# OSRS Stats Site - API Proxy Deployment

## The Problem

The OSRS Hiscores API doesn't allow direct browser access due to CORS restrictions. We need a backend proxy.

## Current Status

✅ **Mock data completely removed** — no more fake stats!  
⚠️ **Temporary proxy** — using `api.allorigins.win` (slow, unreliable, often times out)  
🎯 **Action needed** — deploy a proper proxy for fast, reliable stats

---

## Solution Options

### Option 1: Cloudflare Worker (Recommended)

**Fastest, most reliable, 100% free for up to 100k requests/day**

1. Go to https://workers.cloudflare.com/ and sign up (free)
2. Click "Create a Worker"
3. Delete the example code and paste the contents of `worker.js`
4. Click "Deploy" (name it `osrs-api` or similar)
5. Copy your worker URL (e.g., `https://osrs-api.YOUR_NAME.workers.dev`)
6. Update `app.js` line 46:
   ```javascript
   const proxyUrl = `https://osrs-api.YOUR_NAME.workers.dev?player=${encodeURIComponent(username)}`;
   ```
7. Commit & push!

**Time:** 5 minutes  
**Cost:** Free forever  
**Performance:** ⚡ Lightning fast

---

### Option 2: Move to Netlify

**Auto-deploys the included serverless function**

1. Push repo to GitHub (done ✓)
2. Go to https://app.netlify.com/ and import the repo
3. Netlify auto-detects `netlify/functions/hiscores.js` and deploys it
4. Update DNS from GitHub Pages to Netlify
5. Done! No code changes needed.

**Time:** 10 minutes  
**Cost:** Free  
**Performance:** 🔥 Excellent

---

### Option 3: Keep Current Setup (Not Recommended)

The site will work *sometimes* but users will frequently see errors when `api.allorigins.win` is down or rate-limited.

---

## Testing

After deploying, verify with:
- `Samuelb2800` → should show **77 Ranged** (not 93!)
- `10tontos` → should show level 99 combat stats

---

## Summary

**Mock stats removed:** ✅  
**Real API working:** ⚠️ Unreliable proxy  
**Fix:** Deploy Cloudflare Worker (5 min) or move to Netlify (10 min)
