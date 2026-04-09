# Project: Fuse

**What:** AI-native operating system for partnerships teams
**Status:** Pre-launch MVP build
**Website:** fusegtm.com

## Thesis

Partner types are structurally different and must be operated differently. Most tools flatten partner work into one motion. Fuse is built on the opposite assumption.

The wedge is discovery. The company is the operating system across the full partner lifecycle.

## Compound advantage

More workflows → more structured data → better matching/scoring/attribution → stronger adoption → broader lifecycle coverage → deeper moat.

## Technical Foundation

- Fork of Twenty CRM v1.18.1 (Organization Self-Hosted enterprise license)
- Nx monorepo: React 18 frontend, NestJS backend, PostgreSQL, Redis
- All Fuse code isolated in `packages/twenty-server/src/modules/partner-os/`
- Zero modifications to Twenty core or twenty-ui
- 16 custom objects across 3 motion modules (core, cosell, discovery)
- Discovery powered by Exa Websets API (webhook-driven async search)

## Target Customer

B2B partnerships teams at Series B-F companies, 50-500 employees, managing multiple partner types simultaneously. Already using CRM but lacking a partnerships-native execution layer.

## Current State (as of 2026-03-04)

- Fork branch: `feat/partner-os-schema-spine`
- Production: 31 objects (30 standard Twenty + 1 custom partnerTrack — still named partnerPlay in DB, needs rename during bootstrap)
- 15 of 16 partner-os objects still need to be created via bootstrap
- Bootstrap scripts written and hardened (checkpoint/resume, pagination, retry)
- Server running at app.fusegtm.com on EC2 t3.small (recovered from Sev-1 host reachability incident 2026-03-04)
- MCP endpoint responding (200)
- No Fuse-specific frontend code — custom objects render through Twenty's generic metadata UI
- Styling: Emotion (Linaria cherry-pick FUSE-206 pending)
- Uncommitted: Fuse branding baseline (emails, manifest, footers, field configs) + play→track rename across all docs/schema
- Schema evolution diagram: `docs/fuse-schema-evolution.html`
- 5-day launch plan active: `docs/fuse-5-day-launch-plan.md` (Day 2 complete)

## Key Dependencies

| Dependency | Status | Notes |
|------------|--------|-------|
| Schema bootstrap (15 remaining objects) | Blocked on server mitigation | Dhruv working on failure plan |
| Linaria cherry-pick (FUSE-206) | Not started | Must land before theme pass |
| Theme pass (FUSE-502) | Blocked on FUSE-206 | Visual customization |
| Instance upgrade (t3.small → t3.medium) | Recommended | OOM risk during heavy metadata ops |
| SSM agent install | Not done | No remote debug access currently |

## Key Documents

| Doc | Path |
|-----|------|
| Execution tracker | docs/fuse-mvp-execution-tracker.md |
| Architecture plan | docs/fuse-mvp-architecture-plan-v2.md |
| Design system tokens | docs/fuse-design-system-token-map.md |
| Data model reference | docs/fuse-partner-os-data-model.md |
| Schema definitions (Python) | scripts/mcp-bootstrap/schema_modules.py |
| Bootstrap runner | scripts/mcp-bootstrap/bootstrap.py |
| MCP client | scripts/mcp-bootstrap/mcp_client.py |
