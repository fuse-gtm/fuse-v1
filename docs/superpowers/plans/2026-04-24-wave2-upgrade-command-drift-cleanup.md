# Wave-2 upgrade-command drift cleanup — handoff for next CTO session

**Status as of 2026-04-24 04:45 UTC:** prod healthy on `partner-os-33d82e948c`. Wave-2 image cannot deploy. This doc is what to do next.

---

## What happened

Prior wave syncs repeatedly cherry-picked upstream commits that modified
`1-N/1-N-upgrade-version-command.module.ts` or `instance-commands.constant.ts`
WITHOUT bringing the files those modules import. Upstream has since renamed
most of the old command filenames to include a timestamp+numeric prefix
(e.g. `1-21-workspace-command-1775500003000-backfill-datasource-to-workspace.command.ts`).

When the Fuse image boots, Node's require chain walks through
`command.js → app.module.js → ... → 1-21-upgrade-version-command.module.js`
and fails with `MODULE_NOT_FOUND` on the first missing import. Lazy evaluation
means each round of deploy surfaces exactly one at a time.

Two files were fixed inline during the deploy attempt (PRs #38, #40). The
broader scan found **36 additional missing `src/` imports** across:
- `database/commands/command-runners/*` (3)
- `database/commands/core-migration-runner/services/core-migration-runner.service` (1)
- `database/commands/upgrade-version-command/1-20/*` (16 command files)
- `database/commands/upgrade-version-command/1-21/*` (2 command files)
- `database/commands/upgrade-version-command/1-22/*` (1 workspace-command file)
- `engine/core-engine-version/services/core-engine-version.service` (1)
- `engine/core-modules/tool-provider/*` (3)
- `engine/metadata-event-emitter/types/metadata-event-batch.type` (1)
- `engine/metadata-modules/ai/ai-agent/*` (2)
- `engine/metadata-modules/{calendar-channel,message-folder}/data-access/*-data-access.module` (2)
- `engine/metadata-modules/view-sort/enums/view-sort-direction` (1)
- `engine/metadata-modules/view/enums/view-calendar-layout.enum` (1)
- `modules/workspace-member/query-hooks/workspace-member-pre-query-hook.service` (1)
- `utils/parse-email-body` (1)

Full list in `docs/ops-logs/2026-04-24-wave2-deploy-blocker.md`.

---

## Two viable strategies

### Strategy A: Cherry-pick + rename reconciliation (high-fidelity)

For each missing import:
1. Look up the current upstream filename (they've been renamed — old `1-21-backfill-datasource-to-workspace.command.ts` is now `1-21-workspace-command-1775500003000-backfill-datasource-to-workspace.command.ts`).
2. Copy the file from `upstream/main` into the Fuse tree under the same name upstream uses.
3. Update the Fuse importer (`1-21-upgrade-version-command.module.ts` etc.) to point at the new filename.
4. Repeat the recursion — the copied file may itself import missing deps.

Pro: preserves intent of prior wave syncs. Backfills will actually run.
Con: large surface area. High risk of pulling in transitive deps that conflict with Fuse modifications.

### Strategy B: Neutralize stale modules (pragmatic)

Prod is already on 1.22+ (image `partner-os-33d82e948c`). All the 1-20 and
1-21 backfills ran in earlier deploys. Running them again = no-op.

For each broken `*-upgrade-version-command.module.ts`:
1. Remove imports of missing files.
2. Remove those providers / exports from the module decorator.
3. Keep the module itself as an empty `@Module({})` — NestJS is happy, the
   upgrade command for that version becomes a no-op.

Pro: small, low-risk, resolves the startup crash fully. No transitive
dependency surprises.
Con: loses the ability to run old backfills on a fresh DB. Acceptable
because Fuse only supports upgrading forward-from-existing-prod, not
fresh-install-from-v1.18.

**Recommended: Strategy B.** Future upgrades (1.23, 1.24) can be added
cleanly; the 1-20/1-21/1-22 backfills have all already run on prod.

---

## Step-by-step plan (Strategy B)

### Step 1 — Scan current drift
```bash
cd packages/twenty-server
python3 << 'PY'
import os, re
missing = set()
for dp, _, fns in os.walk('src'):
  for fn in fns:
    if not fn.endswith('.ts'): continue
    src = open(os.path.join(dp, fn)).read()
    for m in re.finditer(r"from 'src/([^']+)'", src):
      rel = m.group(1)
      if not any(os.path.exists(f'src/{rel}{ext}') for ext in ['.ts', '/index.ts']):
        missing.add(rel)
print(len(missing), 'missing:')
for m in sorted(missing): print(' ', m)
PY
```

### Step 2 — Audit each missing import

For each, decide:
- **Remove the import** (usable for `1-20/1-21` backfills — they've all run on prod).
- **Re-copy from upstream** (needed for tool-provider / AI agent / metadata-event-emitter / view enum — these are referenced at runtime by live features, not one-time migrations).

### Step 3 — Apply fixes

Two PRs ideally:
1. `fix(server): neutralize stale 1-20/1-21 upgrade-command imports` — remove the dead backfill references from module.ts files. ~3 files edited.
2. `fix(server): re-cherry-pick 20 missing runtime src/ imports from upstream` — add the actual renamed/new files for tool-provider, ai-agent, metadata-event-emitter, etc.

### Step 4 — Validate

```bash
cd packages/twenty-server
NODE_OPTIONS='--max-old-space-size=8192' npx nx build twenty-server
```

Server build must complete without MODULE_NOT_FOUND.

Then: dispatch a new `Fuse Image Build`, deploy locally in a scratch
container with `docker run --env-file /tmp/test.env` to confirm startup
works before touching prod.

### Step 5 — Deploy (same as wave-2 runbook Phase C)

- `cd /opt/fuse/packages/twenty-docker`
- Snapshot .env
- `sudo sed -i.inplace "s|^TWENTY_IMAGE=.*|TWENTY_IMAGE=ghcr.io/fuse-gtm/fuse-v1:partner-os-<new-sha>|" .env`
- `docker compose -f docker-compose.yml -f docker-compose.fuse.yml pull server worker`
- `docker compose -f docker-compose.yml -f docker-compose.fuse.yml up -d`
- Wait for `twenty-server-1 (healthy)`, then `curl healthz`.

If any startup crash: stop + rm server, revert `TWENTY_IMAGE` to
`partner-os-33d82e948c`, up, diagnose, repeat.

---

## Non-goals (defer to wave-3)

- Do NOT pull PR #19532 in full (the broader DataSourceService removal).
  Single-file cherry-pick is enough per #38.
- Do NOT re-apply `1f2dccb047` TOCTOU fix this session — separate P1 item.
- Do NOT try to resolve the full 36 missing imports in one commit unless
  you're certain none of them have transitive deps. Iterate.

---

## What to read first (in order)

1. `docs/ops-logs/2026-04-24-wave2-deploy-blocker.md` — full chronology.
2. The prior handoff: `docs/superpowers/plans/2026-04-23-wave2-deploy-unblock-handoff.md` (what this session inherited).
3. The prior-prior handoff: `docs/superpowers/plans/2026-04-23-wave2-deploy-handoff.md` (wave-2 sub-wave merges).

## Memory snapshot (`~/.claude/projects/.../memory/MEMORY.md`)

Active Work section lists this blocker as P0. Footguns section has a new
entry for upgrade-version-command module drift with a grep checklist.
