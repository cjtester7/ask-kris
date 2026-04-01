# Ask Kris — The Real Estate Roundup

AI-powered tools for Kris Haskins' real estate investing platform.

## What's in this repo

| Path | Description |
|---|---|
| `index.html` | Landing page linking to both tools |
| `chatbot/index.html` | Ask Kris AI chatbot |
| `qotd/index.html` | Question of the Day landing page |
| `netlify.toml` | Netlify routing + security headers |

## Live URLs (once deployed)

| Page | URL |
|---|---|
| Landing | `https://your-site.netlify.app/` |
| Chatbot | `https://your-site.netlify.app/chatbot/` |
| QOTD | `https://your-site.netlify.app/qotd/` |

## Configuration

Before deploying, update the `API_URL` constant in both:
- `chatbot/index.html`
- `qotd/index.html`

Replace `REPLACE_WITH_YOUR_APPS_SCRIPT_URL` with your Google Apps Script Web App URL.

## Deployment

Deployed via [Netlify](https://netlify.com) — connected to this GitHub repo.
Any push to `main` triggers an automatic redeploy.

## Part of the Ask Kris System

1. ✅ Google Sheets + Apps Script API
2. ✅ n8n QOTD automation
3. ✅ QOTD landing page
4. ✅ Ask Kris chatbot
5. 🔜 Kris CMS admin panel
