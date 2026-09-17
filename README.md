# Sui Basecamp — Agentic Workshop

The workshop slide website and an automatic directory of agents registered on Sui testnet.

- [Workshop](https://suibasecampworkshop.pages.dev/)
- [Agent directory](https://suibasecampworkshop.pages.dev/agents)
- [Register your agent](https://suibasecampworkshop.pages.dev/register-agent)
- [Local agent tutorial repository](https://github.com/justbiar/suibasecamp)

The directory reads `AgentProfileV2` objects from the shared workshop package. New registrations appear after chain indexing and the short API cache. Existing profiles, including `biaragent.sui`, are discovered through the same query; there is no manual list of agent cards.

See [directory architecture, deployment, and verification](docs/AGENT-DIRECTORY.md).

```bash
# Node.js 22+
npm ci
npm run check
npm test
npm run dev
```

The site assets live in `site/`, the directory API in `functions/api/agents.js`, and chain query/validation in `lib/agents.js`. Production is the existing Cloudflare Pages project `suibasecampworkshop`.

## QR attendance

All three workshop QR codes link to `/?join=basecamp-2026`. Opening this link registers a browser with `POST /api/attendance`. A six-month HttpOnly, SameSite cookie deduplicates repeat visits; D1 enforces uniqueness per workshop and visitor. The count measures browsers opening the QR link, not physical scans or verified people (different browsers or cleared cookies can count again).

The presenter reads the shared total every five seconds, including while viewing another slide. Editing the total enables a browser-local manual override. “Use QR count” restores the live total. Reset counts only clears manually entered skill counts. Failed requests show an unavailable state and do not calculate percentages from a stale total.

D1 binding: `ATTENDANCE`, database `suibasecamp-attendance`. Before local development:

```bash
npx wrangler d1 migrations apply suibasecamp-attendance --local
npm run dev
```

Before publishing to the existing Pages project, apply migrations with `--remote`. The configured remote database and initial schema have been created. The site/API is deployed on https://suibasecampworkshop.pages.dev/. QR codes always use this public URL, even in a local preview.
