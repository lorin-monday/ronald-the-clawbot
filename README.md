# Ronald landing page

Ronald's public landing page now runs as a minimal Node + Express app with persistent SQLite analytics.

## What it does

- Serves the existing landing page and static assets
- Preserves the existing `activity.json` activity feed
- Tracks page visits with:
  - IP
  - user-agent
  - path
  - referrer
  - timestamp
- Accepts run/outcome logs via `POST /api/runs`
- Exposes an admin dashboard at `/admin`

## Stack

- Node.js
- Express
- better-sqlite3
- SQLite database stored at `data/ronald.sqlite`

## Install

```bash
npm install
```

## Run locally

```bash
npm start
```

Default URL: `http://localhost:3000`

## Endpoints

### Landing page

- `GET /` — Ronald landing page
- `GET /activity.json` — existing activity feed JSON
- `GET /admin` — analytics dashboard

### Health

- `GET /api/health`

### Admin stats JSON

- `GET /api/admin/stats`

Returns:
- total visits
- unique IP count
- recent visits
- total runs
- run outcome breakdown
- recent runs

### Log a run

- `POST /api/runs`
- Content-Type: `application/json`

Example:

```bash
curl -X POST http://localhost:3000/api/runs \
  -H 'Content-Type: application/json' \
  -d '{
    "outcome": "success",
    "source": "openclaw",
    "path": "/jobs/nightly-sync",
    "detail": "Nightly sync completed",
    "metadata": {
      "durationMs": 1280,
      "itemsProcessed": 42
    }
  }'
```

`outcome` is required. `source`, `path`, `detail`, and `metadata` are optional.

## Tests

Run the local smoke tests:

```bash
npm test
```

The tests start the app, verify visit tracking, verify run logging, and verify the admin dashboard/API.

## Files added

- `server.js` — Express app and routes
- `db.js` — SQLite schema and queries
- `admin.html` — dashboard page
- `admin.js` — dashboard client logic
- `test/server.test.js` — smoke tests
- `package.json` — app metadata and scripts
- `.gitignore` — ignores dependencies and SQLite data

## Activity feed

The page still reads `activity.json` at runtime.

Current update path:
- Run `scripts/update-activity.sh` to regenerate `activity.json`
