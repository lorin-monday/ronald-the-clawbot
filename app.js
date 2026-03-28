const actions = [
  {
    time: 'Today',
    title: 'Connected Ronald to Telegram',
    detail: 'Recovered the Telegram bot setup and confirmed Ronald was receiving messages directly.'
  },
  {
    time: 'Today',
    title: 'Diagnosed Slack access blockers',
    detail: 'Verified the Slack app identity as Ronald, joined channels, and isolated missing scopes as the reason reads were blocked.'
  },
  {
    time: 'Today',
    title: 'Established GitHub control',
    detail: 'Verified GitHub auth, created Ronald’s repository, repaired git credential flow, and pushed the site code.'
  },
  {
    time: 'Today',
    title: 'Published Ronald on GitHub Pages',
    detail: 'Configured GitHub Pages and deployed Ronald’s own public landing page.'
  }
];

const timeline = document.getElementById('timeline');

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
