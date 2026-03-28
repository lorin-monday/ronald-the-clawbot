const express = require('express');
const path = require('path');
const { recordVisit, recordRun, getAdminStats } = require('./db');

const app = express();
const PORT = Number(process.env.PORT || 3000);
const publicDir = __dirname;

app.disable('x-powered-by');
app.set('trust proxy', true);
app.use(express.json({ limit: '256kb' }));

app.use((req, res, next) => {
  if (req.method !== 'GET') {
    return next();
  }

  const pathname = req.path;
  const shouldTrack = pathname === '/' || pathname === '/index.html' || pathname === '/admin' || pathname === '/admin.html';

  if (shouldTrack) {
    recordVisit({
      ip: getClientIp(req),
      user_agent: req.get('user-agent') || null,
      path: pathname,
      referrer: req.get('referer') || null,
    });
  }

  next();
});

app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

app.get('/api/admin/stats', (_req, res) => {
  res.json(getAdminStats());
});

app.post('/api/runs', (req, res) => {
  const payload = req.body || {};
  const outcome = typeof payload.outcome === 'string' ? payload.outcome.trim() : '';

  if (!outcome) {
    return res.status(400).json({ error: 'outcome is required' });
  }

  const result = recordRun({
    outcome,
    source: normalizeOptionalString(payload.source),
    path: normalizeOptionalString(payload.path),
    detail: normalizeOptionalString(payload.detail),
    metadata: isPlainObject(payload.metadata) || Array.isArray(payload.metadata) ? payload.metadata : null,
  });

  res.status(201).json({
    ok: true,
    id: result.lastInsertRowid,
  });
});

app.get('/admin', (_req, res) => {
  res.sendFile(path.join(publicDir, 'admin.html'));
});

app.use(express.static(publicDir, { extensions: ['html'] }));

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Ronald landing app listening on http://localhost:${PORT}`);
  });
}

function getClientIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded.trim()) {
    return forwarded.split(',')[0].trim();
  }

  const ip = req.ip || req.socket?.remoteAddress || null;
  return typeof ip === 'string' ? ip.replace(/^::ffff:/, '') : ip;
}

function normalizeOptionalString(value) {
  if (typeof value !== 'string') {
    return null;
  }

  const trimmed = value.trim();
  return trimmed || null;
}

function isPlainObject(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

module.exports = app;
