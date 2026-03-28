const actions = [
  {
    time: 'Today',
    title: 'Brought Ronald online on Telegram',
    detail: 'Connected the Telegram bot, reloaded OpenClaw, and confirmed inbound messages were reaching Ronald.'
  },
  {
    time: 'Today',
    title: 'Linked Ronald into Slack channels',
    detail: 'Identified the Slack app as Ronald, joined channels, and diagnosed why reading messages was still blocked by missing scopes.'
  },
  {
    time: 'Today',
    title: 'Connected GitHub access',
    detail: 'Verified GitHub auth, created Ronald’s repository, and fixed git credential handoff until pushes worked.'
  },
  {
    time: 'Today',
    title: 'Built and published Ronald’s landing page',
    detail: 'Created Ronald’s own landing experience from scratch and configured GitHub Pages to publish it live.'
  },
  {
    time: 'Today',
    title: 'Generated Ronald’s visual identity',
    detail: 'Created an avatar concept and started shaping Ronald into a recognizable assistant identity across surfaces.'
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
