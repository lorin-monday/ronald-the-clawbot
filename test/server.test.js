const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '..', 'data');
fs.rmSync(dataDir, { recursive: true, force: true });

const app = require('../server');

let server;
let baseUrl;

test.before(async () => {
  server = app.listen(0);
  await new Promise((resolve) => server.once('listening', resolve));
  const { port } = server.address();
  baseUrl = `http://127.0.0.1:${port}`;
});

test.after(async () => {
  await new Promise((resolve, reject) => server.close((error) => (error ? reject(error) : resolve())));
});

test('landing page visit tracking and run logging work', async () => {
  const landingResponse = await fetch(`${baseUrl}/`, {
    headers: {
      'user-agent': 'node-test-agent',
      referer: 'https://example.com/source',
      'x-forwarded-for': '203.0.113.10',
    },
  });

  assert.equal(landingResponse.status, 200);
  const landingHtml = await landingResponse.text();
  assert.match(landingHtml, /I’m Ronald\./);

  const runResponse = await fetch(`${baseUrl}/api/runs`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      outcome: 'success',
      source: 'test-suite',
      path: '/jobs/demo',
      detail: 'Smoke test run',
      metadata: { durationMs: 1250, model: 'gpt-5.4' },
    }),
  });

  assert.equal(runResponse.status, 201);
  const runBody = await runResponse.json();
  assert.equal(runBody.ok, true);

  const statsResponse = await fetch(`${baseUrl}/api/admin/stats`);
  assert.equal(statsResponse.status, 200);
  const stats = await statsResponse.json();

  assert.equal(stats.totalVisits, 1);
  assert.equal(stats.uniqueIps, 1);
  assert.equal(stats.totalRuns, 1);
  assert.deepEqual(stats.outcomeBreakdown, [{ outcome: 'success', count: 1 }]);
  assert.equal(stats.recentVisits[0].ip, '203.0.113.10');
  assert.equal(stats.recentVisits[0].path, '/');
  assert.equal(stats.recentRuns[0].source, 'test-suite');
  assert.deepEqual(stats.recentRuns[0].metadata, { durationMs: 1250, model: 'gpt-5.4' });
});

test('admin page is served and validation rejects missing outcome', async () => {
  const adminResponse = await fetch(`${baseUrl}/admin`);
  assert.equal(adminResponse.status, 200);
  const adminHtml = await adminResponse.text();
  assert.match(adminHtml, /Ronald dashboard/);

  const badRunResponse = await fetch(`${baseUrl}/api/runs`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ source: 'missing-outcome' }),
  });

  assert.equal(badRunResponse.status, 400);
  const body = await badRunResponse.json();
  assert.equal(body.error, 'outcome is required');
});
