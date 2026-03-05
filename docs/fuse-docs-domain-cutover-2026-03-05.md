# Docs Domain Cutover Log

- Date: 2026-03-05
- Domain: `docs.fusegtm.com`
- Goal: move docs traffic from EC2/Twenty to Vercel-hosted docs site

## Final State

- GitHub docs repo: `https://github.com/fuse-gtm/fuse-docs`
- Active Vercel team: `fuse-2c1be89f` (`Fuse`)
- Vercel project serving docs: `website`
- `fusegtm.com` ownership moved from `dhruv-sevapartners-projects` to `fuse-2c1be89f`
- `docs.fusegtm.com` attached to Vercel project `website`

## DNS Record (Hostinger)

- Record required for docs:
  - Type: `CNAME`
  - Name: `docs`
  - Value: `3f385cd32c226537.vercel-dns-017.com`
  - TTL: `300`

Notes:
- Existing wildcard record `A * -> 52.20.136.71` can remain.
- Explicit `docs` CNAME overrides wildcard routing for docs.

## What Was Changed

1. Vercel CLI session switched to account `dhruv-7632`.
2. Apex domain moved:
   - `vercel domains move fusegtm.com fuse-2c1be89f --scope dhruv-sevapartners-projects`
3. Docs domain attached to project:
   - `vercel domains add docs.fusegtm.com website --scope fuse-2c1be89f`
4. Hostinger DNS updated to the `docs` CNAME above.

## Verification Commands

```bash
dig +short CNAME docs.fusegtm.com
curl -I https://docs.fusegtm.com
```

Expected:
- CNAME resolves to `3f385cd32c226537.vercel-dns-017.com.`
- Response headers include Vercel/Next.js (`server: Vercel`, `x-powered-by: Next.js`)
- No `via: 1.1 Caddy` header on successful cutover path

## Route Checks Completed

- `/` -> `200`
- `/docs` -> `200`
- `/user-guide/introduction` -> `308` to `/docs/user-guide/introduction`
- `/user-guide/workflows/capabilities/workflow-actions` -> `308` to `/docs/user-guide/workflows`
- `/developers/extend/capabilities/apps` -> `308` to `/docs/developers/extend`
