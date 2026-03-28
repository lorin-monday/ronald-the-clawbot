const PAGE_SIZE = 6;

async function loadActivity() {
  const timeline = document.getElementById('timeline');
  const prevButton = document.getElementById('feedPrev');
  const nextButton = document.getElementById('feedNext');

  try {
    const res = await fetch('activity.json', { cache: 'no-store' });
    const actions = await res.json();
    let page = 0;

    function renderPage() {
      const start = page * PAGE_SIZE;
      const visible = actions.slice(start, start + PAGE_SIZE);

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

      prevButton.disabled = page === 0;
      nextButton.disabled = start + PAGE_SIZE >= actions.length;
    }

    prevButton?.addEventListener('click', () => {
      if (page > 0) {
        page -= 1;
        renderPage();
      }
    });

    nextButton?.addEventListener('click', () => {
      if ((page + 1) * PAGE_SIZE < actions.length) {
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
