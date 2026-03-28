const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');

const dataDir = path.join(__dirname, 'data');
fs.mkdirSync(dataDir, { recursive: true });

const db = new Database(path.join(dataDir, 'ronald.sqlite'));
db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS visits (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ip TEXT,
    user_agent TEXT,
    path TEXT NOT NULL,
    referrer TEXT,
    visited_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
  );

  CREATE TABLE IF NOT EXISTS runs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    outcome TEXT NOT NULL,
    source TEXT,
    path TEXT,
    detail TEXT,
    metadata TEXT,
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
  );
`);

const insertVisitStmt = db.prepare(`
  INSERT INTO visits (ip, user_agent, path, referrer)
  VALUES (@ip, @user_agent, @path, @referrer)
`);

const insertRunStmt = db.prepare(`
  INSERT INTO runs (outcome, source, path, detail, metadata)
  VALUES (@outcome, @source, @path, @detail, @metadata)
`);

function recordVisit(visit) {
  return insertVisitStmt.run(visit);
}

function recordRun(run) {
  return insertRunStmt.run({
    outcome: run.outcome,
    source: run.source || null,
    path: run.path || null,
    detail: run.detail || null,
    metadata: run.metadata ? JSON.stringify(run.metadata) : null,
  });
}

function getAdminStats() {
  const summary = db.prepare(`
    SELECT
      (SELECT COUNT(*) FROM visits) AS totalVisits,
      (SELECT COUNT(DISTINCT ip) FROM visits WHERE ip IS NOT NULL AND ip != '') AS uniqueIps,
      (SELECT COUNT(*) FROM runs) AS totalRuns
  `).get();

  const recentVisits = db.prepare(`
    SELECT id, ip, user_agent AS userAgent, path, referrer, visited_at AS visitedAt
    FROM visits
    ORDER BY datetime(visited_at) DESC, id DESC
    LIMIT 20
  `).all();

  const recentRunsRaw = db.prepare(`
    SELECT id, outcome, source, path, detail, metadata, created_at AS createdAt
    FROM runs
    ORDER BY datetime(created_at) DESC, id DESC
    LIMIT 20
  `).all();

  const outcomeBreakdown = db.prepare(`
    SELECT outcome, COUNT(*) AS count
    FROM runs
    GROUP BY outcome
    ORDER BY count DESC, outcome ASC
  `).all();

  const recentRuns = recentRunsRaw.map((run) => ({
    ...run,
    metadata: run.metadata ? safeJsonParse(run.metadata) : null,
  }));

  return {
    totalVisits: summary.totalVisits || 0,
    uniqueIps: summary.uniqueIps || 0,
    totalRuns: summary.totalRuns || 0,
    outcomeBreakdown,
    recentVisits,
    recentRuns,
  };
}

function safeJsonParse(value) {
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

module.exports = {
  db,
  recordVisit,
  recordRun,
  getAdminStats,
};
