# Automatic agent directory

The workshop site is deployed on Cloudflare Pages as `suibasecampworkshop`:

- `/agents`: public directory, search, and profile cards.
- `/api/agents`: same-origin Pages Function returning a page of live Sui testnet profiles.
- `/register-agent`: participant registration instructions with the common package address.

## Discovery

The API queries current `AgentProfileV2` objects using Sui GraphQL, filtered to:

```text
0x73795ef21ec3554a141ddcf8d8b6696245762c8a071eeec4bbda2b0818f694c7::agent_profile::AgentProfileV2
```

This works for the existing `biaragent.sui` profile, without re-registering it or publishing an upgraded package. It also discovers future profiles created through the same package. No profile data is hardcoded in the UI. The package is the allowlist; the GraphQL endpoint is fixed server-side. Visitors cannot inject arbitrary upstream URLs or object types.

`AgentRegistered` events remain a possible future indexing mechanism. The currently deployed package does not need those events for this directory: it lists current objects by type. No new chain transaction is required to list an existing profile.

The endpoint returns 24 profiles per page and an opaque cursor. The page offers Load more and searches the currently loaded profiles. Refresh reloads the first page. Successful API responses may be cached for up to 60 seconds; GraphQL indexing can add delay. This is on-demand automatic discovery, not a background database ingestion service. A persistent database/checkpoint indexer can be added when volume or historical queries require it.

## Trust and failure behavior

The server validates the object type, addresses, and field sizes. Unsupported profiles are omitted with a count. Transport and GraphQL failures return HTTP 503 rather than a misleading empty directory. The browser displays a refresh failure explicitly if older cards remain visible.

Profile names, skills, and endpoints are registrant claims. The badge says "On-chain profile"; it does not certify SuiNS control, wallet control, safety, or agent availability. Endpoint strings are rendered as text and never fetched. All external explorer links are generated from validated addresses, and all chain text is inserted with `textContent`.

The directory has no signing keys, memory credentials, or OpenRouter credentials. It shows only public profile metadata. The `registrant` field records the profile creator, not necessarily its current owner after transfers.

## Development and deployment

Use Node 22 or later:

```bash
npm ci
npm run check
npm test
npm run dev
```

Visit `http://localhost:8788/agents`. For a preview deployment:

```bash
npx wrangler pages deploy site --project-name suibasecampworkshop --branch agent-directory-preview
```

After checking the preview, deploy the existing production Pages project:

```bash
npm run deploy
```

Only the `site` directory is uploaded as static content; `functions` is compiled into the Pages Worker. The source repository also contains workshop presentation files that are not part of this change.

## Verification

1. Request `/api/agents` and verify the profile ID is `0x0a330c10cfa604cc0c45e16a9b33a503758bb1d7a1738b5a9570e2efe047d049` and the name is `biaragent.sui`.
2. Check that seven registered skills and the actual wallet/namespace/version are shown on `/agents`.
3. Search by name and by a skill. Verify unmatched searches, Refresh, and mobile layout.
4. Create a profile through the public guide to test a new participant, then allow indexing time and refresh. Do not create duplicate demo profiles just to test an existing one.

For long-term maintenance, preserve V2's type-origin ID in the query after compatible package upgrades. Change the registration call target to the latest package when upgrading. A separately published package is not included automatically.

## Pending: wallet-ownership check

`agent_profile.move` (in the tutorial repo, [`justbiar/suibasecamp`](https://github.com/justbiar/suibasecamp), at `move/agent_profile/`) now asserts `wallet == tx_context::sender(ctx)` inside `create_v2`, so the registered wallet must be the address that signs the registration transaction — the signature itself is the proof, no separate verification logic needed. This is a compatible upgrade (the `AgentProfileV2` struct is unchanged), so existing profiles including `biaragent.sui` remain valid and readable.

The change is only in source until it is published with `sui client upgrade` against the held `UpgradeCap` for the deployed package. Until that upgrade runs, the live testnet package still accepts a `wallet` argument that differs from the sender; `register-agent.html`'s example command already follows the new convention (`wallet = active-address`) so participants using it are unaffected either way.
