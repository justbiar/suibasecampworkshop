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
