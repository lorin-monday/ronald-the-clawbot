async function loadDashboard() {
  const totalVisits = document.getElementById('totalVisits');
  const uniqueIps = document.getElementById('uniqueIps');
  const totalRuns = document.getElementById('totalRuns');
  const outcomeBreakdown = document.getElementById('outcomeBreakdown');
  const recentVisits = document.getElementById('recentVisits');
  const recentRuns = document.getElementById('recentRuns');

  try {
    const response = await fetch('/api/admin/stats', { cache: 'no-store' });
    if (!response.ok) {
      throw new Error(`Dashboard request failed: ${response.status}`);
    }

    const stats = await response.json();

    totalVisits.textContent = formatNumber(stats.totalVisits);
    uniqueIps.textContent = formatNumber(stats.uniqueIps);
    totalRuns.textContent = formatNumber(stats.totalRuns);

    renderOutcomeBreakdown(outcomeBreakdown, stats.outcomeBreakdown || []);
    renderVisits(recentVisits, stats.recentVisits || []);
    renderRuns(recentRuns, stats.recentRuns || []);
  } catch (error) {
    outcomeBreakdown.textContent = 'Dashboard data unavailable right now.';
    recentVisits.textContent = 'Dashboard data unavailable right now.';
    recentRuns.textContent = 'Dashboard data unavailable right now.';
  }
}

function renderOutcomeBreakdown(container, rows) {
  if (!rows.length) {
    container.textContent = 'No runs recorded yet.';
    return;
  }

  container.innerHTML = rows
    .map((row) => `
      <div class="stack-item">
        <span>${escapeHtml(row.outcome)}</span>
        <strong>${formatNumber(row.count)}</strong>
      </div>
    `)
    .join('');
}

function renderVisits(container, visits) {
  if (!visits.length) {
    container.textContent = 'No visits recorded yet.';
    return;
  }

  container.innerHTML = createTable(
    ['Time', 'IP', 'Path', 'Referrer', 'User agent'],
    visits.map((visit) => [
      formatDate(visit.visitedAt),
      visit.ip || '—',
      visit.path || '—',
      visit.referrer || '—',
      visit.userAgent || '—',
    ])
  );
}

function renderRuns(container, runs) {
  if (!runs.length) {
    container.textContent = 'No runs recorded yet.';
    return;
  }

  container.innerHTML = createTable(
    ['Time', 'Outcome', 'Source', 'Path', 'Detail', 'Metadata'],
    runs.map((run) => [
      formatDate(run.createdAt),
      run.outcome || '—',
      run.source || '—',
      run.path || '—',
      run.detail || '—',
      run.metadata ? JSON.stringify(run.metadata) : '—',
    ])
  );
}

function createTable(headers, rows) {
  const head = headers.map((header) => `<th>${escapeHtml(header)}</th>`).join('');
  const body = rows
    .map(
      (row) => `<tr>${row.map((cell) => `<td>${escapeHtml(String(cell))}</td>`).join('')}</tr>`
    )
    .join('');

  return `<div class="table-scroll"><table><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table></div>`;
}

function formatDate(value) {
  if (!value) {
    return '—';
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString();
}

function formatNumber(value) {
  return new Intl.NumberFormat().format(Number(value || 0));
}

function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

loadDashboard();
