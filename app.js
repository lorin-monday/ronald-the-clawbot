async function loadActivity() {
  const timeline = document.getElementById('timeline');

  try {
    const res = await fetch('activity.json', { cache: 'no-store' });
    const actions = await res.json();

    timeline.innerHTML = '';
    actions.forEach((action) => {
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
  } catch (err) {
    timeline.innerHTML = '<article class="timeline-item"><div class="timeline-time">Feed</div><div><h3>Activity feed unavailable</h3><p>The page structure is ready for a live operational feed, but the source did not load.</p></div></article>';
  }
}

loadActivity();
