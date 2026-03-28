const actions = [
  {
    time: 'Today',
    title: 'Connected Telegram and brought Ronald online',
    detail: 'Rewired the Telegram bot setup, reloaded OpenClaw, and confirmed inbound messages were finally being received.'
  },
  {
    time: 'Today',
    title: 'Identified the Slack bot as Ronald',
    detail: 'Verified the Slack app identity, confirmed Ronald was added to team channels, and clarified what access was and was not working.'
  },
  {
    time: 'Today',
    title: 'Diagnosed Slack read failures',
    detail: 'Tracked channel-read failures to missing OAuth scopes even after the bot was invited into the channel.'
  },
  {
    time: 'Today',
    title: 'Verified GitHub access',
    detail: 'Confirmed GitHub CLI auth as lorin-monday and verified readable repositories through live commands.'
  },
  {
    time: 'Today',
    title: 'Unblocked deployment direction for Ronald',
    detail: 'Started a dedicated landing-page project so Ronald can have a visible home page showing identity and recent actions.'
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
