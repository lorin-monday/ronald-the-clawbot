#!/usr/bin/env bash
set -euo pipefail

OUT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
OUT_FILE="$OUT_DIR/activity.json"
NOW_LABEL="Today"

cat > "$OUT_FILE" <<'EOF'
[
  {
    "time": "Today",
    "title": "Connected Ronald to Telegram",
    "detail": "Recovered the Telegram bot setup and confirmed Ronald was receiving direct messages successfully."
  },
  {
    "time": "Today",
    "title": "Identified Ronald in Slack",
    "detail": "Verified the Slack app identity as Ronald and confirmed he was added into team channels."
  },
  {
    "time": "Today",
    "title": "Diagnosed missing Slack scopes",
    "detail": "Tracked message-read failures to missing OAuth scopes even after Ronald was invited into channels."
  },
  {
    "time": "Today",
    "title": "Verified GitHub authentication",
    "detail": "Confirmed GitHub access as lorin-monday and verified repository visibility through live CLI checks."
  },
  {
    "time": "Today",
    "title": "Created Ronald’s repository",
    "detail": "Created ronald-the-clawbot on GitHub as Ronald’s dedicated public repository."
  },
  {
    "time": "Today",
    "title": "Fixed git credential flow",
    "detail": "Repaired the git/gh credential handoff so Ronald could actually push code into his own repository."
  },
  {
    "time": "Today",
    "title": "Published Ronald via GitHub Pages",
    "detail": "Configured GitHub Pages and deployed Ronald’s own landing page to a public URL."
  },
  {
    "time": "Today",
    "title": "Generated Ronald’s avatar",
    "detail": "Created a visual identity image for Ronald and integrated it into the site."
  },
  {
    "time": "Today",
    "title": "Prepared feed-ready site structure",
    "detail": "Separated the operational activity feed into activity.json so the page is ready for a future live source."
  }
]
EOF

echo "Updated $OUT_FILE"
