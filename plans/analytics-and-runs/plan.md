# Ronald landing analytics + runs plan

## What
Convert the static landing page into a minimal Node app with persistent SQLite-backed analytics and run logging, while preserving the current landing page and activity feed.

## Why
The site should keep serving as Ronald’s public landing page, but also provide durable visibility into traffic and execution outcomes via a small admin dashboard.

## How
- Add a small Express server (`server.js`) to serve the landing page/assets and expose JSON APIs.
- Add a SQLite layer (`db.js`) with tables for `visits` and `runs`.
- Track page visits server-side for non-admin requests, capturing IP, user-agent, path, referrer, and timestamp.
- Preserve the existing front-end by continuing to serve `index.html`, `styles.css`, `app.js`, and `activity.json`.
- Add an admin dashboard page (`admin.html`, `admin.js`) that reads a `/api/admin/stats` endpoint.
- Add a `POST /api/runs` endpoint for logging run outcomes and metadata.
- Add package metadata and scripts for starting the app.
- Document setup and usage in `README.md`.

## Tests
- Start the server locally.
- Request `/` and verify visit rows are created.
- POST sample run entries and verify dashboard stats render through the API.
- Check the landing page still serves `activity.json` and existing assets.

## Definition of done
- Node app runs locally with SQLite persistence.
- Landing page still works.
- Visit tracking works.
- Run logging endpoint works.
- Admin dashboard shows totals, breakdowns, and recent rows.
- README explains setup and usage.
- Changes are committed on a feature branch.
