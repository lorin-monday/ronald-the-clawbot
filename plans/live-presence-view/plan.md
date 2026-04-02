# Live Ronald Presence View

## What
Build a live, non-landing experience that shows Ronald as an active agent: current mode, active missions, blockers, recent events, and a living visual state.

## Why
The user wants a real-time feeling of presence and work-in-progress, not a static landing page.

## How
- Replace the static hero-first layout with a live ops / presence interface.
- Add a visual avatar/state core with changing status labels.
- Add sections for Now / Next / Blockers / Recent events.
- Drive the page from a local status data file plus activity feed.
- Keep it deployable as a static Vercel site for now.

## Files
- index.html
- styles.css
- app.js
- add status.json

## Tests
- Open locally in browser/static deploy
- Ensure activity and status render correctly
- Deploy to Vercel

## Definition of done
- Does not feel like a landing page
- Feels alive and operational
- Shows real-time-ish state from data files
- Deployed
