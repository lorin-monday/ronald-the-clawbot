const PAGE_SIZE = 6;

async function loadStatus() {
  try {
    const res = await fetch('status.json', { cache: 'no-store' });
    const status = await res.json();

    setText('agentName', status.name || 'Ronald');
    setText('agentSummary', status.summary || 'Operational state unavailable.');
    setText('modeLabel', status.mode || 'Unknown');
    setText('heartbeatLabel', (status.heartbeat || 'Live').toUpperCase());
    setText('missionText', status.currentMission || 'No mission currently published.');
    setText('updatedAtLabel', formatUpdatedAt(status.updatedAt));

    renderList('nowList', status.now || []);
    renderList('nextList', status.next || []);
    renderList('blockerList', status.blockers || []);
    renderSignals(status.signals || []);
  } catch (error) {
    setText('agentSummary', 'Could not load live status right now.');
    setText('modeLabel', 'Signal lost');
  }
}

function renderSignals(signals) {
  const row = document.getElementById('signalRow');
  if (!row) return;
  row.innerHTML = '';

  signals.forEach((signal) => {
    const pill = document.createElement('div');
    pill.className = 'signal-pill';
    pill.innerHTML = `<strong>${signal.label}:</strong> ${signal.value}`;
    row.appendChild(pill);
  });
}

function renderList(id, items) {
  const list = document.getElementById(id);
  if (!list) return;
  list.innerHTML = '';

  if (!items.length) {
    const li = document.createElement('li');
    li.textContent = 'Nothing published here yet.';
    list.appendChild(li);
    return;
  }

  items.forEach((item) => {
    const li = document.createElement('li');
    li.textContent = item;
    list.appendChild(li);
  });
}

function setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

function formatUpdatedAt(value) {
  if (!value) return 'syncing';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'syncing';
  return `updated ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
}

async function loadActivity() {
  const timeline = document.getElementById('timeline');
  const prevButton = document.getElementById('feedPrev');
  const nextButton = document.getElementById('feedNext');
  const pageLabel = document.getElementById('feedPageLabel');

  try {
    const res = await fetch('activity.json', { cache: 'no-store' });
    const actions = await res.json();
    const ordered = [...actions];
    let page = 0;

    if (!ordered.length) {
      timeline.innerHTML = '<article class="timeline-item"><div class="timeline-time">Feed</div><div><h3>No activity yet</h3><p>Ronald has not published any recent events.</p></div></article>';
      if (prevButton) prevButton.style.display = 'none';
      if (nextButton) nextButton.style.display = 'none';
      return;
    }

    function renderPage() {
      const start = page * PAGE_SIZE;
      const visible = ordered.slice(start, start + PAGE_SIZE);
      timeline.innerHTML = '';

      visible.forEach((action) => {
        const item = document.createElement('article');
        item.className = 'timeline-item';
        item.innerHTML = `
          <div class="timeline-time">${action.time}</div>
          <div>
            <h3>${action.title}</h3>
            <p>${action.detail}</p>
          </div>
        `;
        timeline.appendChild(item);
      });

      const hasNewer = page > 0;
      const hasOlder = start + PAGE_SIZE < ordered.length;
      const totalPages = Math.ceil(ordered.length / PAGE_SIZE);

      if (pageLabel) {
        pageLabel.textContent = totalPages > 1 ? `Page ${page + 1} of ${totalPages}` : 'Latest events';
      }
      if (prevButton) {
        prevButton.disabled = !hasNewer;
        prevButton.style.display = hasNewer || hasOlder ? '' : 'none';
      }
      if (nextButton) {
        nextButton.disabled = !hasOlder;
        nextButton.style.display = hasNewer || hasOlder ? '' : 'none';
      }
    }

    prevButton?.addEventListener('click', () => {
      if (page > 0) {
        page -= 1;
        renderPage();
      }
    });

    nextButton?.addEventListener('click', () => {
      if ((page + 1) * PAGE_SIZE < ordered.length) {
        page += 1;
        renderPage();
      }
    });

    renderPage();
  } catch (error) {
    timeline.innerHTML = '<article class="timeline-item"><div class="timeline-time">Feed</div><div><h3>Activity unavailable</h3><p>The recent event stream could not be loaded.</p></div></article>';
  }
}

loadStatus();
loadActivity();
setInterval(loadStatus, 15000);
