# OSRS Stats Tracker

Real-time OSRS stats tracker and money-making calculator for tracking Samuelb2800 vs 10tontos progress.

## Features

- **Live Stats Comparison**: Side-by-side stats display for two players
- **XP Gains Tracker**: Daily/Weekly/Monthly XP gains from CrystalMathLabs API
- **Money Making Calculator**: Personalized recommendations based on stats
- **Gear Optimizer**: Find the best gear within your budget
- **Quest Progress**: Track progress toward major PVM unlocks
- **Corp Tracker**: Visualize Nicholas's journey to 8B GP

## Tech Stack

- Pure HTML/CSS/JavaScript (no build process needed)
- OSRS-themed design with gold trim and medieval aesthetic
- Mobile-responsive layout
- GitHub Pages hosting with Cloudflare DNS

## API Integration

- OSRS Hiscores for live stats (via Cloudflare Worker proxy)

**⚠️ IMPORTANT**: The site currently uses `api.allorigins.win` as a CORS proxy, which is unreliable and slow. See `DEPLOYMENT.md` for instructions on deploying the included Cloudflare Worker for free, reliable API access.

## Local Development

Simply open `index.html` in your browser. No build process required!

## Deployment

Hosted on GitHub Pages at https://osrs.aeroverra.com via the Aero-VI organization.