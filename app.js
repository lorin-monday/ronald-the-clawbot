const PAGE_SIZE = 6;

async function loadActivity() {
  const timeline = document.getElementById('timeline');
  const prevButton = document.getElementById('feedPrev');
  const nextButton = document.getElementById('feedNext');

  try {
    const res = await fetch('activity.json', { cache: 'no-store' });
    const actions = await res.json();
    const ordered = [...actions].reverse();
    let page = 0;

    if (!ordered.length) {
      timeline.innerHTML = '<article class="timeline-item"><div class="timeline-time">Feed</div><div><h3>No activity to show</h3><p>There are currently no actions logged in the activity feed.</p></div></article>';
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

      const hasPrev = page > 0;
      const hasNext = start + PAGE_SIZE < ordered.length;

      if (prevButton) {
        prevButton.disabled = !hasPrev;
        prevButton.style.display = hasPrev || hasNext ? '' : 'none';
      }
      if (nextButton) {
        nextButton.disabled = !hasNext;
        nextButton.style.display = hasPrev || hasNext ? '' : 'none';
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
  } catch (err) {
    timeline.innerHTML = '<article class="timeline-item"><div class="timeline-time">Feed</div><div><h3>Activity feed unavailable</h3><p>The operational feed could not be loaded right now.</p></div></article>';
    if (prevButton) prevButton.disabled = true;
    if (nextButton) nextButton.disabled = true;
  }
}

loadActivity();
