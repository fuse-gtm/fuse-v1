# Fuse Upstream Patch Ledger — Wave 2

Base: `4583bd0af7` (last synced commit on Fuse main — wave 1 merge, 2026-03-20)
Upstream tip at triage: `80e8f6d516` (`upstream/main` at fetch time, 2026-04-23)
Triage date: 2026-04-23
Total commits in range: 1,222
Default verdict: ACCEPT (see `docs/superpowers/plans/2026-04-23-upstream-sync-wave-2.md` §Ledger Guidance)

## Summary

| Wave | Count |
|---|---|
| 2A-security | 23 |
| 2B-backend | 231 |
| 2C-frontend | 126 |
| 2D-flags-rbac (conditional — defer by default) | 16 |
| i18n-bulk | 94 |
| reject | 6 |
| defer (already landed + feature-flag moves) | 726 |
| **Total** | **1,222** |

_CTO adjustments (2026-04-23) applied on top of initial triage: #18430 moved from 2D → 2C, #18951 defer → reject, #19657 2D → reject._

**Verdict key:** ACCEPT = take in the listed wave. DEFER = skip this sync (either already landed via prior cherry-pick, or requires a separate rebase block). REJECT = sovereignty violation; never cherry-pick.

**Classification notes:**
- 726 commits show verdict=DEFER with reason "already landed in fuse main". These were cherry-picked in wave 1 or earlier and retain their upstream SHA in the range only because `git log A..B` compares reachability, not content. They are safe to skip.
- The 2D-flags-rbac wave is conditional. Per `docs/superpowers/plans/2026-04-23-upstream-sync-wave-2.md` Task 4, these commits are only cherry-picked if the founder explicitly scopes the feature-flag + RBAC rebase in this sync. Otherwise they roll into the next ledger.
- i18n-bulk commits are taken at the end of wave 2C (or their own mini-PR) to avoid churning every wave.

## Rejected commits

| SHA | PR | Title | Reason |
|---|---|---|---|
| `a51b5ed589` | #19039 | fix: resolve settings/usage chart crash and add ClickHouse usage event seeds | Reintroduces ClickHouse usage-event seeding — Fuse disabled ClickHouse in `377664545c` |
| `36fbfca069` | #19486 | Add application-logs module with driver pattern for logic function log persistence | New ClickHouse driver for application logs — adds Twenty-controlled telemetry path |
| `455022f652` | #19586 | Add ClickHouse-backed metered credit cap enforcement | ClickHouse-backed subscription billing polling — Twenty endpoint surveillance vector |
| `2fccd194f3` | #19560 | [Billing for self host] End dummy enterprise key validity | Re-enables enterprise key validity gating — directly reverses `377664545c` sovereignty stub |
| `03c94727be` | #18951 | fix: wrap standard object/field metadata labels in msg for i18n extraction | Touches ClickHouse usage-event integration test — CTO 2026-04-23: don't import |
| `cdc7339da1` | #19657 | Fix testimonials background, faq clickability and some case-studies page edits | Website-only (twenty-website/*), zero runtime impact — CTO 2026-04-23: drop |

## Full triage table

| # | SHA | PR | Title | Verdict | Wave | Reason (reject/defer only) |
|---|-----|----|-------|---------|------|----------------------------|
| 1 | `1db2a40961` | #18307 | Migrate twenty ui to linaria (#18307) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 2 | `68d2297338` | #18316 | Fix expression injection in cross-repo GitHub Actions workflow (#18316) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 3 | `8d47d8ae38` | #18315 | Fix E2E tests broken by redesigned navigation menu (#18315) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 4 | `0223975bbd` | #18318 | Harden GitHub Actions: fix injections, isolate privileged operations to ci-privileged repo (#18318) | ACCEPT | 2A-security |  |
| 5 | `2a5b2746c9` |  | Fix preview-env-dispatch: repository_dispatch requires contents:write | ACCEPT | 2A-security |  |
| 6 | `a06abb1d60` | #18169 | Fields widget rename group (#18169) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 7 | `5afc46ebd3` | #18321 | i18n - translations (#18321) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 8 | `1b67ba6a75` | #18310 | Draft emails fix onblur on text input and callout banner component overflow (#18310) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 9 | `d021f7e369` | #18292 | Fix self host application (#18292) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 10 | `1a8be234de` | #18305 | OAuth security hardening: RFC compliance, PKCE binding, rate limiting (#18305) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 11 | `5e92fb4fc6` | #18322 | Do not console.log while consoleListener (#18322) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 12 | `ff3326a53b` | #18323 | i18n - translations (#18323) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 13 | `78a0197643` | #18294 | Prevent deletion of il-else branches  (#18294) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 14 | `37bcb35391` | #18229 | Migrate pagelayout position frontend (#18229) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 15 | `9c4b0f526c` | #18313 | Refactor chip component hierarchy: AvatarChip → AvatarOrIcon (#18313) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 16 | `c4140f85df` | #18314 | chore(twenty-front): migrate small modules from Emotion to Linaria (PR 1/10) (#18314) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 17 | `1eb284c87f` | #18283 | Fix command menu text/number inputs to commit on blur and cancel cleanly on Escape (#18283) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 18 | `20a2c3836e` | #18085 | feat: introduce role selector when inviting members to a workspace (#18085) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 19 | `6351c6c1c6` | #18308 | feat: remember original URL and redirect after login (#18308) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 20 | `27847f6ac6` | #18330 | i18n - translations (#18330) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 21 | `7809f83e72` | #13838 | fix: [Note] Title not filled by default #13838 (#18297) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 22 | `ae291c99ba` | #17131 | fix: record does not open in side panel after returning from fullscreen (#17131) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 23 | `802a5b0af6` | #18328 | chore(twenty-front): migrate auth, activities, AI, pages and small modules from Emotion to Linaria (PR 2-3/10) (#18328) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 24 | `0b766464e4` | #18317 | Composite action: Spawn twenty instance (#18317) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 25 | `58e37a118c` | #18272 | Builder runs delete update and then create (#18272) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 26 | `2e9624858c` | #18339 | Fix name singular updates in dev mode (#18339) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 27 | `083df3e7ca` | #18326 | OAuth Edge case crash + cleanup (#18326) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 28 | `2f09fb8c04` | #18320 | SDK Split command and cli logic (#18320) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 29 | `005223de8c` | #18343 | [SDK] Make public-operations non throw (#18343) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 30 | `d48c58640c` | #18347 | Migrate CI runners from Depot back to GitHub-hosted runners (#18347) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 31 | `b2b3a3f860` | #18325 | Workflow iterator continues on faillure (#18325) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 32 | `4266f4022a` | #18349 | i18n - translations (#18349) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 33 | `5c4a1f931a` | #18348 | Fix trigger missing (#18348) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 34 | `b1107c823a` | #18277 | Apollo enrich (#18277) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 35 | `8b26020a0b` | #18354 | Fix missing omit in application config (#18354) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 36 | `3bfdc2c83f` | #18342 | chore(twenty-front): migrate command-menu, workflow, page-layout and UI modules from Emotion to Linaria (PR 4-6/10) (#18342) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 37 | `132a19f688` | #18351 | `[SDK]` Execute logic function e2e test (#18351) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 38 | `8a3b96d911` | #18360 |  Remove files (#18360) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 39 | `7a2e397ad1` | #18361 | Complete linaria migration (#18361) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 40 | `07dd27f6c4` | #18368 | i18n - translations (#18368) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 41 | `a9c4920fcc` | #18370 | i18n - docs translations (#18370) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 42 | `2f9c94d9a0` | #18374 | fix: upgrade nestjs dependencies to upgrade multer transitive import (#18374) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 43 | `ca1d49c6cd` | #18373 | fix: rollup 4 has arbitrary file write via path traversal (#18373) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 44 | `225f185278` | #18375 | fix: fast-xml-parser has stack overflow in XMLBuilder with preserve order (#18375) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 45 | `995793c0ac` | #18345 | `[CREATE_APP]` Integration testing scaffold (#18345) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 46 | `3b2bf39565` | #18377 | Refactor modal (#18377) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 47 | `5b544809f7` | #18224 | Support ungrouped fields + improve edition UX (#18224) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 48 | `80d054563e` | #18225 | followup: centralize widget common properties and add widget bulk update integration tests (#18225) | ACCEPT | 2B-backend |  |
| 49 | `906a0aed38` | #18187 | Common API - Filter validation layer (#18187) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 50 | `c97d872b9f` | #17609 | `[BREAKING_CHANGE_VIEW_SORT]` Refactor view sort to v2 (#17609) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 51 | `845a1934d3` | #18281 | Tt call recording app (#18281) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 52 | `aaa483c020` | #18380 | i18n - translations (#18380) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 53 | `07803f232f` | #18378 | fix: use ForbiddenException in DevelopmentGuard to prevent Sentry noise (#18378) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 54 | `d59d2efb8b` | #18383 | i18n - translations (#18383) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 55 | `f09a9cc25a` | #18384 | Replace align-center with padding (#18384) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 56 | `b11f77df2a` | #18319 | [FRONT COMPONENTS] Introduce conditionalAvailabilityExpression to command menu items (#18319) | DEFER | 2D-flags-rbac | feature-flag enum location/RBAC stack (wave 2D) |
| 57 | `999dcd4468` | #18369 | Increase size of input in test setting logic function tab (#18369) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 58 | `be01a85d67` | #18387 | i18n - translations (#18387) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 59 | `eda905f271` | #18382 | [DevXP] Improve Linaria pre-build speed (#18382) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 60 | `aeedcf3353` | #18271 | Enable password reset from app.twenty.com with workspace fallback (#18271) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 61 | `c94657dc0a` | #18336 | Navbar AI chats followup (#18336) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 62 | `7f6b270a76` | #18388 | i18n - translations (#18388) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 63 | `c53d281960` | #18385 | Fix invalid universal identifier format command cache flush (#18385) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 64 | `911a46aa45` | #18376 | Improve workflow perfs (#18376) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 65 | `4c001778c2` | #18365 | fix google signup edge case (#18365) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 66 | `c41a8e2b23` | #18389 | [DevXP] Simplify twenty-ui theme system: replace auto-generated files with static CSS variables (#18389) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 67 | `26f0a416a1` | #18381 | File storage cleaning (#18381) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 68 | `2493adbb87` | #18396 | fix: minimatch related dependabot alerts (#18396) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 69 | `228865bd94` | #18398 | i18n - translations (#18398) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 70 | `72086fe111` | #18409 | Bump @dagrejs/dagre from 1.1.3 to 1.1.8 (#18409) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 71 | `6a2e0182ab` | #18408 | Bump @blocknote/server-util from 0.47.0 to 0.47.1 (#18408) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 72 | `338a38682d` | #18404 | feat: upgrade nx to latest (#18404) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 73 | `bfa50f566e` | #18410 | Bump @clickhouse/client from 1.11.0 to 1.18.1 (#18410) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 74 | `0e89c96170` | #18358 | feat: add npm and tarball app distribution with upgrade mechanism (#18358) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 75 | `4cfd738312` | #18270 | Headless action modal (#18270) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 76 | `9d4ff7820d` | #18415 | i18n - translations (#18415) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 77 | `abd9709291` | #18391 | Update Command Menu Item entity (#18391) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 78 | `a2f80d882b` | #18392 | Stop catching all workflow errors (#18392) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 79 | `2a82df7073` | #18236 | AI tools to create a demo workspace (#18236) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 80 | `c571473d67` | #18416 | fix: SVGO DoS through entity expansion in DOCTYPE (#18416) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 81 | `ecbc0ac013` | #18419 | i18n - translations (#18419) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 82 | `57499342f1` | #18411 | Set widget position's type according to parent tab (#18411) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 83 | `1b9d188e4a` | #18386 | Added SSE effect for view relations objects (#18386) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 84 | `1decd40eea` | #18421 | Remove unecessary queries for aggregate (#18421) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 85 | `1acbf28316` | #18350 | Only update value at creation (#18350) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 86 | `7293d4c1f8` | #18424 | Fix missing test input values (#18424) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 87 | `647c32ff3e` | #18402 | Deprecate runtime theme objects in favor of CSS variables (#18402) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 88 | `38ad0820c0` | #18423 | Fix server logs leak (#18423) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 89 | `5853891b02` | #18393 | refactor!: rename Command Menu page/navigation layer to Side Panel (#18393) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 90 | `cfeea43eaf` | #18164 | Improve workspace auth context surface (#18164) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 91 | `57d8954973` | #18427 | `[SDK]` Pure ESM (#18427) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 92 | `12257f4cc7` | #18429 | i18n - translations (#18429) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 93 | `fc2b1de860` | #18395 | fix: composite field sub-menu not showing in advanced filter (#18395) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 94 | `4965790ecc` | #18428 | Backfill record page layouts for custom objects (#18428) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 95 | `e5e3132ddd` | #18422 | Add ESLint rules to disallow jotaiStore and direct atomFamily usage in selectors (#18422) | ACCEPT | 2C-frontend |  |
| 96 | `c53a13417e` | #18430 | Remove all styled(Component) patterns in favor of parent wrappers and props (#18430) | ACCEPT | 2C-frontend | reclassified from 2D (regex false positive — pure styling refactor on role-admin screens, not a RBAC change) |
| 97 | `1affa1e004` | #18437 | chore(front): remove vite-plugin-checker background TS/ESLint checks (#18437) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 98 | `13e569eaac` | #18436 | Removed z-index dynamic logic for table (#18436) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 99 | `1ec7244d1b` | #18440 | i18n - docs translations (#18440) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 100 | `62a634831d` | #18438 | feat: create specialized component for header (#18438) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 101 | `ef003fb929` | #18332 | fix blocklist (#18332) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 102 | `61f9cf9260` | #18442 | i18n - translations (#18442) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 103 | `2f3399fd5f` | #18445 | i18n - docs translations (#18445) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 104 | `4797f97a95` | #18446 | fix: vertical alignment of +N More tab overflow button (#18446) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 105 | `e27a8b5107` | #18447 | Fix Workflow layout show page (#18447) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 106 | `b421efbff7` | #18448 | fix: remove add record on workflow runs/versions (#18448) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 107 | `9d57bc39e5` | #18443 | Migrate from ESLint to OxLint (#18443) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 108 | `4d0b8a8644` | #18450 | i18n - translations (#18450) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 109 | `90cced0e74` | #18451 | i18n - docs translations (#18451) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 110 | `514d0017ea` | #18432 | Refactor application module architecture for clarity and explicitness (#18432) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 111 | `9d808302aa` | #18452 | i18n - docs translations (#18452) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 112 | `3d7cb4499f` | #18454 | i18n - translations (#18454) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 113 | `aa062644c8` | #18367 | Fixed scrollbar height issue in Kanban view and adjusted the calendar view to adjust with the new change (#18367) | ACCEPT | 2C-frontend |  |
| 114 | `364c944ca6` | #18449 | Improve build performance 2x (#18449) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 115 | `1c898f36d6` | #18456 | Fix workflow nodes color in dark mode (#18456) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 116 | `d825ac06dd` | #18458 | fix server production build (#18458) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 117 | `d37ed7e07c` | #18459 | Optimize merge queue to only run E2E and integrate prettier into lint (#18459) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 118 | `a79b816117` | #18420 | Allow users to set where new fields must be created in a record page layout (#18420) | ACCEPT | 2C-frontend |  |
| 119 | `f65aafe96b` | #18462 | i18n - translations (#18462) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 120 | `1f1da901ea` | #18457 | Bug fixes batch (#18457) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 121 | `9f9a6a45dd` | #18335 | fix: enforce the user to pass in property with id suffix for morph relations in Rest API (#18335) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 122 | `ef499b6d47` | #18461 | Re-enable disabled lint rules and right-size CI runners (#18461) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 123 | `403db7ad3f` | #18441 | Add default viewField when creating object (#18441) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 124 | `cac4999e9f` | #18107 | fix: handle Escape in date/datetime pickers and remove ValidationStep any (#18107) | ACCEPT | 2C-frontend |  |
| 125 | `59029a0035` | #18414 | [Fix] : Dragged element is considered to be part of a dropdown in dashboard tab list (#18414) | ACCEPT | 2C-frontend |  |
| 126 | `06451407ce` | #18464 | i18n - docs translations (#18464) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 127 | `faee5ee63d` | #18352 | fix: morph relation persist uses wrong foreign key naming, producing invalid field parentObjectId. (#18352) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 128 | `02bd71052b` | #18468 | i18n - docs translations (#18468) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 129 | `73268535dc` | #18149 | Added record filter hidden fields in query (#18149) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 130 | `fea47aa9f8` | #18467 | Add twenty/folder-structure custom oxlint rule (#18467) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 131 | `2c69102f15` | #18474 | i18n - translations (#18474) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 132 | `66d93c4d28` | #18460 | Fix app:dev CLI by removing deleted createOneApplication mutation (#18460) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 133 | `5b28e59ca7` | #18288 | Navbar drag drop using dnd kit (#18288) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 134 | `c2a79fc0c2` | #18475 | i18n - translations (#18475) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 135 | `0acc08c333` | #18494 | i18n - translations (#18494) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 136 | `a9696705c1` | #18471 | Make all widgets of record page layouts non-editable except Fields widgets (#18471) | ACCEPT | 2C-frontend |  |
| 137 | `06bdb5ad6a` | #18431 | `[SDK]` Agent in manifest (#18431) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 138 | `36bcc71f3d` | #18489 | refactor(command-menu-item): rename Actions to CommandMenuItem (#18489) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 139 | `22a203680e` | #18499 | Fix wrong type usage (#18499) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 140 | `a3aae5c857` | #18498 | i18n - translations (#18498) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 141 | `1993614637` | #18496 | i18n - docs translations (#18496) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 142 | `662de17644` | #18503 | ci: replace 4-core runners with ubuntu-latest (#18503) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 143 | `82a1179e23` | #18500 | Fix empty record index page (#18500) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 144 | `75bb3a904d` | #18433 | `[SDK]` Refactor clients (#18433) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 145 | `5ab3eeb830` | #18495 | fix: throw clear error on invalid LOG_LEVELS (#18495) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 146 | `309fd7a526` | #18505 | feat: unpin action (#18505) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 147 | `c433b2b73f` | #18472 | Implement page layout override (#18472) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 148 | `ae122f4bb1` | #18371 | Add draft message persistence for AI chat threads (#18371) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 149 | `882e9fd231` | #18517 | Docs: restructure Extend section with API, Webhooks, and Apps pages (#18517) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 150 | `6f6a9a55fb` | #18519 | Add doc on standard object u ids (#18519) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 151 | `8bbda86eb6` | #18511 | `[CREATE_APP]` Generate basic CI workflow (#18511) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 152 | `f9f7e2f929` | #18508 | i18n - translations (#18508) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 153 | `6995420b71` | #18520 | Remove IS_APPLICATION_INSTALLATION_FROM_TARBALL_ENABLED feature flag (#18520) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 154 | `05c2da2d0f` | #18518 | Improve SSRF IP validation and add protocol allowlist (#18518) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 155 | `c73a660e46` | #18522 | Fix task rows (#18522) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 156 | `59e9563fc7` | #18528 | i18n - docs translations (#18528) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 157 | `1656bb5568` | #18118 | [Feat] : add source to actor fields (#18118) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 158 | `4370788023` | #18530 | Cancel in progress only if different event than merge (#18530) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 159 | `045faf018a` | #18509 | Design fixes batch post linaria migration (#18509) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 160 | `dee55b635f` | #18466 | Table refactor : removed z-index dynamic logic completely and flex-wrap (#18466) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 161 | `033d297695` | #15057 | feat: add visual time picker to DateTimePicker (#15057) (#17952) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 162 | `6399e11220` | #18532 | i18n - translations (#18532) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 163 | `d1c95e380e` | #18521 | Update front components documentation (#18521) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 164 | `982f0c4a4d` | #18534 | i18n - docs translations (#18534) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 165 | `8e003aa6cf` | #18535 | Fix permission settings page (#18535) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 166 | `926dd545f4` | #18525 | Create fake hidden fields group (#18525) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 167 | `dd58eb6814` | #18492 | Fix linaria css regressions (#18492) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 168 | `ec1f08bc3b` | #18537 | i18n - translations (#18537) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 169 | `7b9939b43e` | #18334 | fix: validate input before formatting in MultiItemFieldInput (#18334) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 170 | `621962e049` | #18531 | Move fixture apps from twenty-sdk to twenty-apps/fixtures (#18531) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 171 | `e7fe435f60` | #18541 | i18n - docs translations (#18541) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 172 | `40a8d18d38` | #18289 | feat : Added "Quarter" as a time unity to filter on date (#18289) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 173 | `6e628bb751` | #18529 | Fix add more tab bottom separator (#18529) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 174 | `25d9f2fcce` | #18469 | fix: respect number format in currency input (#18469) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 175 | `2de022afcf` | #18527 | Add standard command menu items (#18527) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 176 | `0fe7e9d5fe` | #18547 | small ai chat fix (#18547) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 177 | `f855dacec9` | #18546 | i18n - docs translations (#18546) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 178 | `1d95670252` | #18538 | Fix form field select + form field number (#18538) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 179 | `7fb8cc1c39` | #18549 | Improve apps settings UI and remove unused tarball upload code (#18549) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 180 | `e4e7137660` | #18526 | Navigate to page when clicking nav item in edit mode (#18526) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 181 | `ab5fb1f658` | #18539 | Replace newFieldDefaultConfiguration with newFieldDefaultVisibility (#18539) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 182 | `413d1124bb` | #18515 | Fix navigation drag drop indicator position (#18515) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 183 | `99f885306e` | #18553 | i18n - translations (#18553) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 184 | `00c3cd1051` | #18536 | Add system view fallback (#18536) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 185 | `ef92d2d321` | #18540 | Backfill standard views command (#18540) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 186 | `744ef3aa9d` | #18555 | i18n - translations (#18555) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 187 | `6cbc7725b7` | #18558 | fix standard app for server build (#18558) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 188 | `2c5af2654d` | #18542 | Separate code pathways for IS_COMMAND_MENU_ITEM_ENABLED flag (#18542) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 189 | `b346f4fb59` | #18556 | Add common loader (#18556) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 190 | `d9b3507866` | #18523 | Run vulnerable operation in isolated environment (#18523) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 191 | `21de221420` | #18557 | i18n - translations (#18557) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 192 | `b2f053490d` | #18560 | Add standard front component ci (#18560) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 193 | `b699619756` | #18497 | Create twenty app e2e test ci (#18497) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 194 | `f0c83434a7` | #18559 | feat: default code interpreter and logic function to Disabled in production (#18559) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 195 | `a024a04e01` | #18561 | Fix breadcrumb infinite loop (#18561) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 196 | `2af3121c51` | #18565 | Fix dashboard creation + role permission page design (#18565) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 197 | `102b49f919` | #18516 | Fix new navbar item position after reordering existing items (#18516) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 198 | `5726bd6e17` | #18569 | Bump oxlint from 1.51.0 to 1.53.0 (#18569) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 199 | `1adc325887` | #18571 | Bump path-to-regexp from 8.2.0 to 8.3.0 (#18571) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 200 | `15d0970f72` | #18570 | Bump @swc/core from 1.15.11 to 1.15.18 (#18570) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 201 | `f262437da6` | #18564 | Refactor dev environment setup with auto-detection and Docker support (#18564) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 202 | `2eac82c207` | #18484 | fix(front): stabilize downloadFile unit test and return promise chain (#18484) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 203 | `09beddb63d` | #18566 | i18n - docs translations (#18566) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 204 | `69542898a1` | #18563 | Display a single Add a Section button (#18563) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 205 | `38664249cf` | #18576 | i18n - translations (#18576) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 206 | `b21fb4aa6f` | #18533 | Fix PDF Upload edge case (#18533) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 207 | `78473a606a` | #18562 | Fix app dev flickering (#18562) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 208 | `e8f8189167` | #18554 | [COMMAND MENU ITEMS] Add engine component key (#18554) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 209 | `660536d6bb` | #18577 | Fix onboarding flow: workspace creation modal and invite team skip (#18577) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 210 | `db5b4d9c6c` | #18513 | fix: replace unsafe JSON.parse casts with parseJson in filter dropdowns (#18513) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 211 | `cb3e32df86` | #18575 | Fix AI demo workspace skill (#18575) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 212 | `f19fcd0010` | #18578 | i18n - translations (#18578) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 213 | `eb4665bc98` | #18543 | Create missing standard table and fields widget views (#18543) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 214 | `06d4d62e90` | #18582 | Move 1.19 backfill pagelayout and views to 1.20 (#18582) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 215 | `c59f420d21` | #18583 | Hide tabs for system objects (#18583) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 216 | `c1da7be6d7` | #18075 | Billing for self-hosts (#18075) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 217 | `c9deab4373` | #18581 | [COMMAND MENU ITEMS] Remove standard front components (#18581) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 218 | `501fcc737f` | #18586 | i18n - translations (#18586) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 219 | `0897575fd0` | #18580 | Fix flaky return-to-path e2e tests (#18580) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 220 | `741e9a8f81` | #18589 | Update yarn lock (#18589) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 221 | `6a3281a18d` | #18588 | Bug fix batches (#18588) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 222 | `1685d066be` | #18591 | i18n - translations (#18591) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 223 | `5bfa4c5c39` | #18590 | Fix wrong uuid error (#18590) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 224 | `2a6fcfcfb3` | #18579 | Side Panel Sub Page Framework® (#18579) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 225 | `b5db955ac8` | #18599 | Fix sdk metadata client codegen (#18599) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 226 | `0ef4741473` | #18595 | i18n - translations (#18595) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 227 | `3f420c84d7` | #18602 | Fix Flow tab missing for workflow run (#18602) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 228 | `ab13020e2b` | #18598 | Fix wrong uuid error on field metadata (#18598) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 229 | `a3c392ce8b` | #18603 | Reset selected widget when exiting record page layout edit mode (#18603) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 230 | `1cb4c98cb3` | #18594 | Add dataloader and read from cache for view entities (#18594) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 231 | `5f558e5539` | #18611 | fix: accept production enterprise keys in development environment (#18611) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 232 | `262f9f5fe1` | #18601 | Re-fetch conditional display property in the frontend (#18601) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 233 | `349bfc8462` | #18596 | Backfill existing workspaces with standard command menu items (#18596) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 234 | `dfd28f5b4a` | #18613 | Separate create draft cases op (#18613) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 235 | `0641e07ca6` | #18600 | Bring back relations notes tasks targets (#18600) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 236 | `f3e0c12ce6` | #18593 | Fix app install file upload (#18593) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 237 | `0379aea0b1` | #18614 | fix: split tsvector migration, add configurable DB timeout, reorder 1.19 commands (#18614) | ACCEPT | 2B-backend |  |
| 238 | `58f534939c` | #18617 | i18n - docs translations (#18617) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 239 | `172bbd01bc` | #18597 | Add Gemini 3.1 Flash Lite model to AI registry (#18597) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 240 | `b470cb21a1` | #18584 | Upgrade Apollo Client to v4 and refactor error handling (#18584) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 241 | `4b6c8d52e5` | #18622 | Improve type safety and remove unnecessary store operations (#18622) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 242 | `3f01249967` | #18620 | i18n - translations (#18620) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 243 | `49bdcd6bd5` | #18621 | i18n - docs translations (#18621) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 244 | `46e515436e` | #18623 | Deprecate legacy RICH_TEXT field metadata type (#18623) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 245 | `1b1d79b08f` | #18625 | i18n - docs translations (#18625) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 246 | `3054679411` | #18615 | fix: add missing React key props to ButtonGroup and FloatingButtonGro… (#18615) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 247 | `d9eb317bb5` | #18628 | feat: rename RICH_TEXT_V2 → RICH_TEXT in codebase (keep DB value) (#18628) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 248 | `55d675bba7` | #18633 | i18n - translations (#18633) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 249 | `2a8912b17a` | #18636 | i18n - docs translations (#18636) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 250 | `6b48f197d4` | #18624 | feat: deprecate WorkspaceFavorite in favor of NavigationMenuItem (#18624) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 251 | `3a9247d9d1` | #18639 | i18n - translations (#18639) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 252 | `602db4ffea` | #18634 | feat: enable Rich Text as a creatable field type (#18634) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 253 | `6552ec83ec` | #18642 | i18n - translations (#18642) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 254 | `0b0ffcb8fa` | #18627 | Add pitfall reminders to LLMS guidance (#18627) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 255 | `48172d60fd` | #18572 | View field override (#18572) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 256 | `40ff109179` | #18643 | feat: migrate objectMetadata reads to granular metadata store (#18643) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 257 | `70a060b4ee` | #18637 | docs: fix contributor docs links and typos (#18637) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 258 | `c753b2bee1` | #18644 | i18n - docs translations (#18644) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 259 | `6711b40922` | #18645 | i18n - docs translations (#18645) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 260 | `7a3540788a` | #18647 | feat: uniformize metadata store with flat types, SSE alignment, presentation endpoint & localStorage (#18647) | ACCEPT | 2C-frontend | mixed server/frontend — front lines=1238 vs server lines=207 |
| 261 | `06efee1eef` | #18649 | feat: hash-based metadata staleness detection (#18649) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 262 | `ba9aa41bba` | #18651 | refactor: metadata store cleanup, SSE unification, mock metadata loading & login redirect fix (#18651) | ACCEPT | 2C-frontend | mixed server/frontend — front lines=6479 vs server lines=272 |
| 263 | `e6f1bdd1c8` | #18662 | fix: yauzl contains an off-by-one error (#18662) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 264 | `67866ff59c` | #18661 | fix: expr-eval related dependabot alerts (#18661) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 265 | `1b20bdaf6d` | #18660 | fix: @isaacs/brace-expansion has uncontrolled resource consumption (#18660) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 266 | `87c519b72f` | #18659 | fix: multer vulnerable to denial of service via uncontrolled recursion (#18659) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 267 | `95a35f8a1d` | #18608 | Implement OAuth 2.0 Dynamic Client Registration (RFC 7591) (#18608) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 268 | `2c2f66b584` | #18665 | fix: DOMPurify contains a cross-site scripting vulnerability (#18665) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 269 | `6340b9e2f7` | #18669 | i18n - translations (#18669) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 270 | `5c745059ad` | #18667 | refactor: remove "core" naming from views and eliminate converter layer (#18667) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 271 | `6e36ad9fa2` | #18664 | fix: mailparser vulnerable to cross-site scripting (#18664) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 272 | `a07337fea0` | #18671 | fix: return method-specific MCP responses (#18671) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 273 | `5011e1d77b` | #18674 | i18n - docs translations (#18674) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 274 | `ddedecbb36` | #18677 | i18n - docs translations (#18677) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 275 | `e552704201` | #18676 | fix: add viewFieldGroupId to ViewField fragment and connect page layout selectors to live metadata store (#18676) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 276 | `32d7fa09a3` | #18626 | Fix timeline activities + breadcrumb (#18626) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 277 | `5dfdc1d81d` | #18670 | refactor: consolidate database query timeout config variables (#18670) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 278 | `cb4efb1d0e` | #18650 | fix: respect standard object rename across all locales (Closes #18650) (#18652) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 279 | `93bd4960e3` | #18632 | Fix styles side column (#18632) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 280 | `b6b96be603` | #18629 | Fix custom object view fields creation (#18629) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 281 | `13ff7af297` | #18631 | Update sidebar section toggle to match Figma chevron (#18631) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 282 | `c4e55d08ff` | #18678 | fix: allow identical singular and plural labels for objects (#18678) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 283 | `087ee19807` | #18683 | i18n - translations (#18683) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 284 | `a121d00ddd` | #18672 | feat: add color property to ObjectMetadata for object icon customization (#18672) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 285 | `48285be164` | #18686 | i18n - translations (#18686) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 286 | `1bb642d7cd` | #18687 | refactor: remove ProcessedNavigationMenuItem, derive display fields at point of use (#18687) | ACCEPT | 2C-frontend |  |
| 287 | `1735c7527c` | #18688 | fix 2FA UI layout (#18688) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 288 | `1be87eb97b` | #18690 | chore: frontend dead code removal and naming cleanup (#18690) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 289 | `f1dfcfd163` | #18691 | refactor(twenty-front): reorganize NavigationMenuItem module into common/display/edit subfolders (#18691) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 290 | `770a685556` | #18696 | i18n - translations (#18696) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 291 | `111debc1ce` | #18692 | i18n - docs translations (#18692) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 292 | `731e297147` | #18638 | Twenty sdk cli oauth (#18638) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 293 | `05a81c82a9` | #18682 | Add hotkeys to command menu items (#18682) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 294 | `3204175065` | #18700 | [FIx]: using the dynamic {objectLabelPlural} instead of hardcoded name (#18700) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 295 | `f38d72a4c2` | #18184 | Setup local instance on app creation (#18184) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 296 | `ab881350b2` | #18640 | refactor: unify layout customization mode (record pages + navigation) (#18640) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 297 | `bee474afdf` | #18703 | i18n - translations (#18703) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 298 | `abdab2fb7e` | #18681 | [Command menu items] Create engine commands (#18681) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 299 | `5a51764b8e` | #18704 | i18n - translations (#18704) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 300 | `9f7c29bce8` | #18697 | refactor(twenty-front): unify Favorites and Workspace navigation menu item code (#18697) | ACCEPT | 2C-frontend |  |
| 301 | `e62dfae741` | #18709 | i18n - translations (#18709) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 302 | `994215e0dc` | #18684 | Update store on data model mutation (#18684) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 303 | `058414fae5` | #18705 | Upgrade Ink to v6 and pause TUI on idle/error (#18705) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 304 | `a82739cdb1` | #18710 | feat: optimistic metadata store updates for navigation menu items (#18710) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 305 | `2d4f6f8f6f` | #18716 | fix: make 1.19 upgrade commands resilient to pre-existing data (#18716) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 306 | `fb5b68f1d8` | #18725 | Skip threads with no participants in timeline formatting (#18725) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 307 | `0ae62898a3` | #18722 | fix: restructure navigationMenuItem type migration for safe upgrade path (#18722) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 308 | `a74edbf715` | #18717 | fix: route object color through standardOverrides for standard objects (#18717) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 309 | `a8c445a1c2` | #18726 | Treat Microsoft Graph 400 with empty body as transient error (#18726) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 310 | `b1a7c5c4d6` | #18723 | Fix null connectedAccount crash in blocklist message deletion job (#18723) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 311 | `13a357ab9f` | #18727 | Publish new version (#18727) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 312 | `928194cee4` | #18719 | fix Draft Email stuck Callout (#18719) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 313 | `dedcf4e9b9` | #18707 | Support template variables in command menu item labels (#18707) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 314 | `87efaf2ff8` | #18695 | workspace:export command (#18695) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 315 | `58336fb70f` | #18730 | fix: navigation menu item type backfill and frontend loading (#18730) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 316 | `c7e89a18f0` | #18567 | Migrate permission flag to syncable entity (#18567) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 317 | `c676e46a1d` | #18736 | i18n - translations (#18736) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 318 | `b6c62b3812` | #18706 | fix(auth): use dynamic SSE headers and add token renewal retry logic (#18706) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 319 | `eb51f8e6da` | #18737 | Remove front component and command menu item old seeds (#18737) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 320 | `f2fa958f20` | #18732 | Add progress tracking to command menu items (#18732) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 321 | `fe4512f80c` | #18702 | Add record page layout tabs editing (#18702) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 322 | `c6f11d8adb` | #18731 | fix: migrate driver modules to DriverFactoryBase lazy-loading pattern (#18731) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 323 | `91d6a69bf8` | #18738 | i18n - translations (#18738) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 324 | `8ccaf635bc` | #18568 | fix: replace > button with button selector in styled wrappers (#18568) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 325 | `6d4d1a97bc` | #18609 | Migrate object permission to syncable entity (#18609) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 326 | `189c564840` | #18742 | i18n - translations (#18742) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 327 | `394a3cef15` | #18745 | fix: restore ViewFilter value stringification lost in converter removal (#18745) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 328 | `2f095c8903` | #18734 | Scaffold light twenty app dev container (#18734) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 329 | `a370a26b79` | #18749 | i18n - docs translations (#18749) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 330 | `8ab8f80687` | #18756 | fix: use unique concurrency group per merge queue entry (#18756) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 331 | `e0e25eac2b` | #18755 | chore(deps): bump @ai-sdk/mistral from 3.0.20 to 3.0.25 (#18755) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 332 | `ef2a113a16` | #18753 | chore(deps): bump @dagrejs/dagre from 1.1.3 to 1.1.8 (#18753) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 333 | `0d27a255a9` | #18754 | chore(deps): bump nodemailer from 7.0.11 to 7.0.13 (#18754) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 334 | `5526d2e5d0` | #18740 | Separate metadata and object record publisher (#18740) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 335 | `a9f8a7e1fa` | #18760 | Fix: prevent record navigation when clicking Remove from favorite in nav sidebar (#18760) | ACCEPT | 2C-frontend |  |
| 336 | `b86e6189c0` | #18777 | Remove postition from Timeline Activities + fix workflow title placeholder (#18777) | ACCEPT | 2B-backend | mixed server/frontend — server lines=54 vs front lines=5 |
| 337 | `02bfebccc2` | #18765 | Fix: cascade delete favorite folder children on backend (#18765) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 338 | `8005b35b56` | #18605 | Fix relation connect where failing on mixed-case email and URL (#18605) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 339 | `26139ee463` | #18779 | fix: stop event propagation when removing file in AI chat preview (#18779) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 340 | `cd594ce8bd` | #18766 | Fix: Hide object from Opened section when it already has a workspace nav item (#18766) | ACCEPT | 2C-frontend |  |
| 341 | `cee4cf6452` | #18784 | feat: migrate ConnectedAccount infrastructure entities to metadata schema (#18784) | DEFER | 2D-flags-rbac | feature-flag enum location/RBAC stack (wave 2D) |
| 342 | `3cbd9f2b5d` | #18786 | i18n - translations (#18786) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 343 | `ffb02a6878` | #18768 | Improve workflow metrics with faillure reason (#18768) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 344 | `0a6b514898` | #18795 | fix: remove redundant cookie write that made tokenPair a session cookie (#18795) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 345 | `66be7c3ef4` | #18796 | fix: autogrow input sizing + surface nested error details in upgrade command (#18796) | ACCEPT | 2B-backend | mixed server/frontend — server lines=53 vs front lines=3 |
| 346 | `34b3158308` | #18797 | fix: backfill missing ids on SELECT/MULTI_SELECT field metadata options (#18797) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 347 | `698c15b8cd` | #18800 | Avoid side panel tab overriden by show page (#18800) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 348 | `217adc8d17` | #18798 | fix: add missing LEFT JOIN for relation fields in groupBy orderByForRecords (#18798) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 349 | `91793ef930` | #18799 | fix: update workspace members state on profile onboarding completion (#18799) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 350 | `9a850e2241` | #18770 | fix - handle invoice.paid webhook to recover unpaid subscriptions (#18770) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 351 | `e7434bdc39` | #18759 | Direct graphql execution (#18759) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 352 | `89300564ba` | #18752 | Add a note to documentation about variable change (#18752) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 353 | `7c8f060b08` | #18791 | Fix orphan navigation menu items for deleted views (#18791) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 354 | `3d49c21b51` | #18803 | fix: decouple viewPicker favorite detection from sorted navigation menu items (#18803) | ACCEPT | 2C-frontend |  |
| 355 | `a8625d8bfb` | #18804 | Clean workflow query invalid input errors from sentry (#18804) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 356 | `9cb21e71fa` | #18787 | feat: secure and user-scope metadata resolvers for messaging infrastructure (#18787) | ACCEPT | 2B-backend | mixed server/frontend — server lines=2745 vs front lines=1324 |
| 357 | `9698996771` | #18805 | fix useless auth in sdk gql codegen command (#18805) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 358 | `d149c2a041` | #18806 | i18n - translations (#18806) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 359 | `1be0f1554f` | #18807 | i18n - docs translations (#18807) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 360 | `42269cc45b` | #18792 | fix(links): preserve percent-encoded URLs during normalization (#18792) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 361 | `732aea9121` | #18810 | fix: restore original migration timestamp for messaging infrastructure (#18810) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 362 | `2a1d22d870` | #18802 | Fix page scrolling when layout customization bar is visible (#18802) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 363 | `d389a4341d` | #18748 | [Fix]: Vertical bar charts with max data range do not show data up to the top if above max data range (#18748) | ACCEPT | 2B-backend | mixed server/frontend — server lines=731 vs front lines=440 |
| 364 | `fc9723949b` | #18585 | Fix AI chat re-renders and refactored code (#18585) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 365 | `cd651f57cb` | #18812 | fix: prevent blank subdomain from being saved (#18812) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 366 | `50a0bef0e4` | #18822 | i18n - translations (#18822) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 367 | `908aefe7c1` | #18818 | feat: replace hardcoded AI model constants with JSON seed catalog (#18818) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 368 | `c01fc3bafb` | #18823 | i18n - translations (#18823) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 369 | `03a2abb305` | #18824 | fix: board view loads all records instead of showing skeleton placeholders (#18824) | ACCEPT | 2C-frontend |  |
| 370 | `d69e4d7008` | #18814 | fix: prevent FIND_RECORDS from silently dropping unresolved filter variables (#18814) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 371 | `246afe0f2a` | #18828 | fix: skip chat messages query when thread ID is the unknown-thread default (#18828) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 372 | `9a306ddb9a` | #18825 | feat: store SSO connections as connected accounts during sign-in (#18825) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 373 | `bdaff0b7e2` | #18811 | Fetch load more on group by (#18811) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 374 | `96c5728ed0` | #18809 | fix: prevent localStorage bloat from derived fields on mock metadata (#18809) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 375 | `d5a7dec117` | #18830 | refactor: rename ObjectMetadataItem to EnrichedObjectMetadataItem and clean up metadata flows (#18830) | DEFER | 2D-flags-rbac | RBAC/permissions stack change (wave 2D) |
| 376 | `7bde8a4dfa` | #18701 | [Chore]: Migration to dynamic view names for standard views (#18701) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 377 | `8ef32c4781` | #18641 | Add `In-Reply-To` to Email Workflow Node (#18641) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 378 | `1a0588d233` | #18405 | fix: auto-retry Microsoft OAuth on AADSTS650051 race condition (#18405) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 379 | `fa04e7077e` | #18831 | i18n - translations (#18831) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 380 | `23fb2a0d58` | #18832 | i18n - docs translations (#18832) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 381 | `9d613dc19d` | #18157 | Improve helm chart // Fix linting issues & introduce Redis externalSecret for redis password // Add additional ENVs // Improve migrations (#18157) | ACCEPT | 2B-backend | other-only paths (no server/front files) — default 2B |
| 382 | `e95adcc757` | #18836 | fix(helm): add unit tests, extraEnv schema validation, and minor fixes (#18836) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 383 | `d16b94bde6` | #18835 | fix: reset form defaultValues after save to fix dirty detection (#18835) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 384 | `c107d804d2` | #18746 | Create command menu items for workflows with manual trigger (#18746) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 385 | `a1b1622d94` | #18837 | i18n - translations (#18837) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 386 | `dc00701448` | #18333 | Fix: TypeError: Cannot convert undefined or null to object (#18333) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 387 | `e9aa6f47e5` | #18801 | Allow users to create Fields and Field widget (#18801) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 388 | `d90d2e3151` | #18838 | i18n - translations (#18838) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 389 | `be89ef30cd` | #18808 | Migrate field widgets to backend (#18808) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 390 | `68a508a353` | #18839 | i18n - translations (#18839) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 391 | `49af539032` | #18844 | Fix migration crash: agent.modelId NOT NULL violation (#18844) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 392 | `77d4bd9158` | #18592 | Add billing usage analytics dashboard with ClickHouse integration (#18592) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 393 | `bb9e3c44a1` | #18845 | Show AI provider sections regardless of billing status (#18845) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 394 | `e618cc6cf9` | #18846 | i18n - translations (#18846) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 395 | `2dfa742543` | #18850 | chore: improve i18n workflow to prevent stale compiled translations (#18850) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 396 | `c9ca4dfa14` | #18853 | fix: run AI catalog sync as standalone script to avoid DB dependency (#18853) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 397 | `b813d64324` | #18854 | chore: sync AI model catalog from models.dev (#18854) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 398 | `630f3a0fd7` | #18855 | chore: trigger automerge for AI catalog sync PRs (#18855) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 399 | `0626f3e469` | #18863 | Fix deploy: remove stale @ai-sdk/groq from yarn.lock (#18863) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 400 | `6f4f7a1198` | #18857 | fix: add security headers to file serving endpoints to prevent stored XSS (#18857) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 401 | `1cfdd2e8ed` | #18848 | Update BackfillCommandMenuItemsCommand with workflow backfill (#18848) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 402 | `07a4cf2d26` | #18858 | Ensure command backfills all relations as Field widget (#18858) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 403 | `c58bf9cf06` | #18866 | Fix e2e test (#18866) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 404 | `24055527c8` | #18859 | Rename "New sidebar item" to "New menu item" (#18859) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 405 | `93de331428` | #18873 | i18n - translations (#18873) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 406 | `c6d4162b73` | #18870 | Fix: Background color selected row + border bottom settings tab (#18870) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 407 | `e2c85b5af0` | #18869 | Fix workspace dropdown truncation and center auth titles (#18869) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 408 | `708e53d829` | #18871 | Fix multi-select option removal crashing when records contain removed values (#18871) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 409 | `0ded15b363` | #18877 | Add visual regression CI for twenty-ui (#18877) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 410 | `69fe6fcadd` | #18878 | chore: add explicit return type to getBackgroundColor (#18878) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 411 | `fd044ba9a2` | #18885 | chore: sync AI model catalog from models.dev (#18885) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 412 | `dd84ab25df` | #18856 | chore: optimize app-dev Docker image and add CI test (#18856) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 413 | `493830204a` | #18875 | [AI] Fix new chat button stacking side panel and auto-focus editor (#18875) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 414 | `cc2be505c0` | #18852 | Fix twenty app dev image (#18852) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 415 | `960c80999e` | #18903 | i18n - docs translations (#18903) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 416 | `8eff9efab2` | #18899 | Fix rich text widget edition (#18899) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 417 | `e0b36c3931` | #18910 | fix: ai providers json formatting (#18910) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 418 | `ec459d8dc8` | #18883 | Fix cropped view/link overlay icons in collapsed navigation sidebar (#18883) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 419 | `d3c7b0131d` | #18907 | Fix lambda driver (#18907) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 420 | `56ea79d98c` | #18911 | Perf investigation - Time qgl query (#18911) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 421 | `7b6fb52df7` | #18902 | fix: validate blocknote JSON in rich text fields (#18902) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 422 | `4104b1d2bc` | #18915 | i18n - translations (#18915) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 423 | `7a1780e415` | #18900 | Fix duplicate views creation in command (#18900) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 424 | `c1ec5567ce` | #18789 | fix: insert-before folder for workspace DnD and add-to-nav drags (#18789) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 425 | `4c6e102493` | #18914 | Display found items after full items loaded (#18914) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 426 | `2317a701bd` | #18916 | Fix double arrow (#18916) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 427 | `611947e031` | #18901 | fix: metadata store lifecycle during sign-in, sign-out, and locale change (#18901) | ACCEPT | 2C-frontend |  |
| 428 | `37787defc2` | #18918 | Fix readme (#18918) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 429 | `341c13bf32` | #18917 | Fix documentation (#18917) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 430 | `27c0ca975f` | #18879 | Fix navigation “add before/after” insertion index (#18879) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 431 | `49afe5dbc4` | #18908 | Refactor: Unify command menu item execution (#18908) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 432 | `cec23e89fa` | #17213 | Fix batch update optimistic and prevent accidental mass-update (#17213) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 433 | `856c72c5d6` | #18920 | i18n - translations (#18920) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 434 | `8696e3b7ec` | #18922 | i18n - translations (#18922) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 435 | `77bade8114` | #18925 | i18n - docs translations (#18925) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 436 | `d9eef5f351` | #18921 | Fix visual regression dispatch for fork PRs (#18921) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 437 | `cac92bffe3` | #18923 | Refactor backfill-command-menu-items to use a single validateBuildAndRun call (#18923) | ACCEPT | 2B-backend |  |
| 438 | `c94aa7316a` | #18924 | send X-Schema-Version header when metadataVersion is 0 (#18924) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 439 | `96f3ff0e90` | #18747 | Add record table widget to dashboards (#18747) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 440 | `16451ee2ee` | #18926 | i18n - translations (#18926) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 441 | `4ea2e32366` | #18544 | Refactor twenty client sdk provisioning for logic function and front-component (#18544) | ACCEPT | 2A-security |  |
| 442 | `5c99d7205f` | #18930 | i18n - translations (#18930) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 443 | `a6519f2c97` | #18931 | i18n - docs translations (#18931) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 444 | `0af7760441` | #18932 | i18n - docs translations (#18932) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 445 | `37640521d5` | #18882 | Batch create, update, and delete navigation menu items (#18882) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 446 | `d5b41b2801` | #18927 | Unify auth context → role permission config resolution into a single pure utility (#18927) | ACCEPT | 2B-backend |  |
| 447 | `01af7bc7fb` | #18934 | i18n - docs translations (#18934) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 448 | `4a099ed097` | #18872 | Use side panel sub-pages for add-to-folder flow (#18872) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 449 | `98c21f958a` | #18933 | Add twenty-sdk-client to deployed packages unique version check (#18933) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 450 | `981e83ecb1` | #18935 | i18n - translations (#18935) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 451 | `766f956a15` | #18862 | Set system object icon colors to gray in New menu item flows (#18862) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 452 | `b642d1b114` | #18867 | Animate the sidebar when opening/closing an element in the "opened" section (#18867) | ACCEPT | 2C-frontend |  |
| 453 | `42d9e25bf2` | #18936 | i18n - translations (#18936) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 454 | `fb34d2ce80` | #18938 | i18n - docs translations (#18938) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 455 | `cc7131b0b5` | #18941 | i18n - docs translations (#18941) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 456 | `5de269a64e` | #18942 | i18n - docs translations (#18942) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 457 | `2bfd2f6b85` | #18937 | fix navigation menu item overflow issue (#18937) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 458 | `3295f5ee07` | #18905 | fix logo upload during workspace onboarding (#18905) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 459 | `790a58945b` | #18946 | Migrate twenty-companion from npm to yarn workspaces (#18946) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 460 | `e6bb39deea` | #18843 | fix: reset throttle state on channel relaunch (#18843) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 461 | `523289efad` | #18947 | Do not rollback on cache invalidation failure in workspace migration runner (#18947) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 462 | `e1374e34a7` | #18948 | Fix object permission override (#18948) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 463 | `bf22373315` | #18954 | Fix: use user role for OAuth tokens bearing user context (#18954) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 464 | `03c94727be` | #18951 | fix: wrap standard object/field metadata labels in msg for i18n extraction (#18951) | REJECT | reject | CTO decision 2026-04-23: do not import — touches a ClickHouse usage-event integration test that would re-seed the ClickHouse path Fuse disabled in `377664545c` |
| 465 | `ba0108944f` | #18955 | i18n - translations (#18955) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 466 | `f7ef41959b` | #18956 | i18n - translations (#18956) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 467 | `e25ea6069d` | #18958 | i18n - translations (#18958) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 468 | `13ea3ec75c` | #18957 | Split command menu items backfill into separate migration runs per application (#18957) | ACCEPT | 2B-backend |  |
| 469 | `5f0d6553f6` | #18912 | Add object type filter dropdown to side panel record searches (#18912) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 470 | `4fbe0a92ae` | #18967 | i18n - translations (#18967) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 471 | `895bb58fc6` | #18864 | feat: add S3 presigned URL redirect for file downloads (#18864) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 472 | `a8dad6c882` | #18971 | Fix: default to allow-read when object permissions are not yet loaded (#18971) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 473 | `4d6c8db205` | #18976 | i18n - docs translations (#18976) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 474 | `cc247c2e8e` | #18962 | Fix record page layout upgrade commands (#18962) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 475 | `33a474c8e6` | #18960 | Add record table widget feature flag (#18960) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 476 | `d47ddad4c5` | #18979 | Add multiselect option to form step (#18979) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 477 | `511d1bd7ab` | #18966 | Fix SSE event stream errors when impersonating users with limited permissions (#18966) | ACCEPT | 2C-frontend |  |
| 478 | `6c1db2e7fb` | #18964 | Do not run loop when iterator is skipped (#18964) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 479 | `72dd3af155` | #18974 | fix SVG icon sizing broken in Chrome 142 (#18974) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 480 | `441a9464d1` | #18977 | Fixed board no value column not fetching more (#18977) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 481 | `3abef48663` | #18981 | i18n - docs translations (#18981) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 482 | `bfdbc93b1c` | #18982 | i18n - docs translations (#18982) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 483 | `7335d352a9` | #18984 | chore(deps): bump @linaria/core from 6.2.0 to 6.3.0 (#18984) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 484 | `91374262f2` | #18986 | chore(deps): bump @ai-sdk/xai from 3.0.59 to 3.0.74 (#18986) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 485 | `dfe9cb4346` | #18985 | chore(deps): bump @microsoft/microsoft-graph-types from 2.40.0 to 2.43.1 (#18985) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 486 | `578d990b9c` | #18874 | [AI] Match ai chat composer to figma (#18874) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 487 | `b87762b1c2` | #18987 | i18n - translations (#18987) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 488 | `4985270e69` | #18876 | [AI] Refactor settings search to use SearchInput and restructure Skills tab (#18876) | ACCEPT | 2C-frontend |  |
| 489 | `340a01567a` | #18988 | i18n - translations (#18988) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 490 | `1e2b31b040` | #18970 | fix: prevent saving API key with empty name (#18970) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 491 | `5041b3e14b` | #18990 | i18n - translations (#18990) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 492 | `d126d54bbc` | #18906 | feat: make workflow objects searchable (#18906) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 493 | `cfefe9273b` | #18961 | Use record page layouts in the merge records feature (#18961) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 494 | `3c5796bdb0` | #18512 | fix: handle dashboard filters referencing deleted fields (#18512) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 495 | `b732b2efd4` | #18997 | i18n - translations (#18997) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 496 | `c28e637ea7` | #18995 | fix: prevent empty array `id.in` filter in single record picker (#18995) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 497 | `b1e449d764` | #18965 | fix dashboard widget edit mode content (#18965) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 498 | `29979f535d` | #18996 | [Ai] fix overflow on new chat button (#18996) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 499 | `b651a74b1f` | #18992 | fix: hide "Move to folder" when no destination folder is available (#18992) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 500 | `052aecccc7` | #18963 | Refactor dependency graph for SDK, client-sdk and create-app (#18963) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 501 | `160a80cbcb` | #19000 | Bump prelease version sdk, sdk-client, create-twenty-app (#19000) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 502 | `36c7c99e34` | #18993 | fix: hide objects with no addable views in sidebar view picker (#18993) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 503 | `82611de9b6` | #18998 | connected accounts follow up (#18998) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 504 | `2e015ee68d` | #19002 | Add missing row lvl permission check on Kanban view (#19002) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 505 | `92635b960b` | #18999 | [AI] Navigation panel scroll refactor + Non chat placeholder (#18999) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 506 | `f771b13a20` | #19011 | i18n - translations (#19011) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 507 | `b171a23216` | #19003 | [AI] replace custom styles with MenuItem and SidePanelGroup in AI agent persmissions tab (#19003) | ACCEPT | 2C-frontend |  |
| 508 | `ec5ab2b84a` | #18975 | Fix format result (#18975) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 509 | `c7f6036a47` | #19010 | `[SDK]` twenty-ui/display selective re-export to avoid bloating icons (#19010) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 510 | `afeef8e04a` | #18764 | feat: add command menu item to layout customization (#18764) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 511 | `39b9ae6a76` | #19014 | i18n - translations (#19014) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 512 | `e63a23ea00` | #18969 | Fix create new with filters (#18969) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 513 | `8ef99671e2` | #19005 | Fix board drag and drop issues (#19005) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 514 | `c3a3cf9c67` | #19006 | [Apps SDK] Add error message if relationType is missing (#19006) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 515 | `1c297e5ace` | #19018 | i18n - translations (#19018) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 516 | `7a341c6475` | #19016 | feat: support authType on AI providers for IAM role authentication (#19016) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 517 | `34832815e6` | #18991 | fix: update settings page for mobile viewport (#18991) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 518 | `9eba54134d` | #19019 | i18n - translations (#19019) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 519 | `34ab72c460` | #19015 | Fix: Cannot create two workflow agent nodes because these have the same name (#19015) | ACCEPT | 2B-backend |  |
| 520 | `695518a15e` | #19020 | Fix not shared chip height + hard coded border radius (#19020) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 521 | `f47608de07` | #18940 | Clear navbar edit selection when closing the side panel (#18940) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 522 | `31718d163c` | #19017 | [Dashboards] fix rich text widget AGAIN (#19017) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 523 | `da1b1f1cbc` | #19004 | Combine and clean upgrade commands for record page layouts (#19004) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 524 | `6360fb3bce` | #19028 | chore: sync AI model catalog from models.dev (#19028) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 525 | `17424320e3` | #19029 | fix: gate command-menu-items query behind feature flag (#19029) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 526 | `6f0ac88e20` | #19027 | fix: batch viewGroup mutations sequentially to prevent race conditions (#19027) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 527 | `08077476f3` | #19031 | fix: remove remaining direct cookie writes that make tokenPair a session cookie on renewal (#19031) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 528 | `68f5e70ade` | #19001 | fix: sign file URLs in timeline and file loss on click outside (#19001) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 529 | `db9da3194f` | #19032 | Refactor client auto heal (#19032) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 530 | `56056b885d` | #19033 | refacto - remove hello-pangea/dnd from navigation-menu-item module (#19033) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 531 | `50ea560e57` | #18909 | Seed company workflow for email upserts (#18909) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 532 | `22c9693ce5` | #19035 | First PR to bring in the new twenty website. (#19035) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 533 | `c2b058a6a7` | #19038 | fix: use workspace-generated id for core dual-write in message folder save (#19038) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 534 | `5efe69f8d3` | #18751 | Migrate field permission to syncable entity (#18751) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 535 | `c96c034908` | #19040 | i18n - translations (#19040) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 536 | `281bb6d783` | #19008 | Guard `yarn database:migrate:prod` (#19008) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 537 | `fb21f3ccf5` | #19041 | fix: resolve availabilityObjectMetadataUniversalIdentifier in backfill command (#19041) | ACCEPT | 2B-backend |  |
| 538 | `cd2e08b912` | #19036 | Enforce workspace count limit for multi-workspace setups (#19036) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 539 | `34b81adce8` | #19046 | i18n - translations (#19046) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 540 | `7f1814805d` | #19043 | Fix backfill record page layout command (#19043) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 541 | `191a277ddf` | #19044 | fix: invalidate rolesPermissions cache + add Docker Hub auth to CI (#19044) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 542 | `9498a60f74` | #19048 | i18n - translations (#19048) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 543 | `cb44b22e15` | #19049 | Fix INDEX view showing labelPlural instead of resolved view name in nav (#19049) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 544 | `81fc960712` | #19059 | Deprecate dataSource table with dual-write to workspace.databaseSchema (#19059) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 545 | `c407341912` | #19068 | feat: optimize hot database queries with multi-layer caching (#19068) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 546 | `6efd9ad26e` | #19073 | i18n - translations (#19073) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 547 | `a51b5ed589` | #19039 | fix: resolve settings/usage chart crash and add ClickHouse usage event seeds (#19039) | REJECT | reject | telemetry SDK (reject rule: surveillance dependency) |
| 548 | `ccaea1ba36` | #19076 | i18n - translations (#19076) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 549 | `f651413297` | #19078 | chore: sync AI model catalog from models.dev (#19078) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 550 | `e8cb086b64` | #19074 | chore: remove completed migration feature flags and upgrade commands <= 1.18 (#19074) | DEFER | 2D-flags-rbac | feature-flag enum location/RBAC stack (wave 2D) |
| 551 | `28de34cf20` | #19079 | chore: remove IS_DASHBOARD_V2_ENABLED feature flag (#19079) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 552 | `05c0713474` | #19080 | i18n - translations (#19080) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 553 | `4d74cc0a28` | #19081 | chore: remove IS_APPLICATION_ENABLED feature flag (#19081) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 554 | `a3f468ef98` | #19082 | chore: remove IS_ROW_LEVEL_PERMISSION_PREDICATES_ENABLED and IS_DATE_TIME_WHOLE_DAY_FILTER_ENABLED feature flags (#19082) | DEFER | 2D-flags-rbac | feature-flag enum location/RBAC stack (wave 2D) |
| 555 | `58189e1c05` | #19100 | chore: sync AI model catalog from models.dev (#19100) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 556 | `fe1377f18b` | #18973 | Provide applicatiion assets (#18973) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 557 | `039a04bc2f` | #19105 | Fix warning about ../../tsconfig.base.json not found (#19105) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 558 | `0b2f435b3e` | #19108 | i18n - translations (#19108) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 559 | `d246b16063` | #19094 | More parts of the new website. (#19094) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 560 | `6af7e32c54` | #19113 | i18n - docs translations (#19113) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 561 | `ee479001a1` | #19106 | Fix workspace dropdown (#19106) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 562 | `ef8789fad6` | #19110 | fix: convert empty parentFolderId to null in messageFolder core dual-write (#19110) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 563 | `cb85a1b5a3` | #19109 | Fix record name hover (#19109) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 564 | `107914b437` | #19119 | i18n - docs translations (#19119) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 565 | `1109b89cd7` | #19111 | fix: use Redis metadata version for GraphQL response cache key (#19111) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 566 | `b8374f5531` | #19117 | Fix export view (#19117) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 567 | `696a202bb9` | #19115 | Fix navigation menu edition (#19115) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 568 | `d2cf05f4f4` | #19103 | Fix - Not shared message on record index (#19103) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 569 | `30bdc24bf8` | #19125 | i18n - translations (#19125) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 570 | `2fccd29ec6` | #19124 | messaging cleanup  (#19124) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 571 | `08b041633a` | #19083 | chore: remove 1-19 upgrade commands and navigation menu item feature flags (#19083) | DEFER | 2D-flags-rbac | feature-flag enum location/RBAC stack (wave 2D) |
| 572 | `c0086646fd` | #19114 | [APP] Stricter API assertions (#19114) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 573 | `6c128a35dd` | #19126 | Fix cropped calendar event name (#19126) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 574 | `40abe1e6d0` | #19128 | i18n - docs translations (#19128) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 575 | `8985dfbc5d` | #19120 | Improve apps (#19120) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 576 | `2a5aab0c44` | #19129 | i18n - translations (#19129) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 577 | `3d1c53ec9d` | #18972 | Gql direct execution - Improvements (#18972) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 578 | `ecf8161d0e` | #19121 | Fix - Remove signFileUrl method (#19121) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 579 | `2263e14394` | #19112 | clean paddings in favorites section (#19112) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 580 | `ca00e8dece` | #19132 | Fix databaseSchema migration (#19132) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 581 | `8fa3962e1c` | #19107 | feat: add resumable stream support for agent chat (#19107) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 582 | `5bde41ebbb` | #19134 | i18n - translations (#19134) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 583 | `369ae2862f` | #19135 | i18n - docs translations (#19135) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 584 | `37908114fc` | #19021 | `[SDK]` Extract `twenty-front-component-renderer` outside of `twenty-sdk` ( 2.8MB ) (#19021) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 585 | `383935d0d9` | #19133 | Fix widgets drag handles (#19133) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 586 | `a6cecdbd49` | #19137 | i18n - docs translations (#19137) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 587 | `8d539f0e49` | #19139 | i18n - docs translations (#19139) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 588 | `fd21d0c6ca` | #19142 | i18n - docs translations (#19142) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 589 | `61a27984e8` | #19150 | `0.8.0.canary.7` bump (#19150) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 590 | `e0630b8653` | #19155 | Fix TransactionNotStartedError (#19155) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 591 | `bcca5d0002` | #19045 | fix: show disabled file chip when file no longer exists in timeline (#19045) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 592 | `ef66d6b337` | #19158 | i18n - translations (#19158) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 593 | `1ce4da5b67` | #19157 | Fix upgrade commands 2 (#19157) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 594 | `176e81cd76` | #19153 | fix: clear navigation stack immediately in goBackFromSidePanel (#19153) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 595 | `d10c0a6439` | #19053 | Fix: composite update events not received (#19053) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 596 | `287fe90ce9` | #19164 | Add link to workspace members index view page from the settings (#19164) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 597 | `c3b969ab74` | #19166 | i18n - translations (#19166) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 598 | `ec283b8f2d` | #18989 | Fix dropping workspace nav items at the bottom of the list (#18989) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 599 | `436333f110` | #19163 | Add see records link to data model (#19163) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 600 | `6dedb35a1f` | #19168 | i18n - translations (#19168) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 601 | `bb5c64952c` | #19169 | i18n - translations (#19169) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 602 | `888fa271f0` | #19007 | [Apps SDK] Fix rich app link in documentation  (#19007) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 603 | `08f019e9c9` | #19165 | [AI] More tab new design (#19165) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 604 | `4c97642258` | #19171 | i18n - translations (#19171) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 605 | `2612145436` | #19172 | Fix sdk tests (#19172) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 606 | `c23961fa81` | #19075 | Fix navbar object color not updating immediately when changed in edit mode (#19075) | ACCEPT | 2C-frontend |  |
| 607 | `94e019f012` | #19162 | Complete the structure for homepage in new website. (#19162) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 608 | `887e0283c5` | #19177 | Direct execution - Follow up (#19177) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 609 | `5bbfce7789` | #19180 | Add 1-21 upgrade command to backfill datasource to workspace table (#19180) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 610 | `c11e4ece39` | #19131 | Fallback to field metadata (#19131) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 611 | `ee3ebd0ca0` | #19181 | Add "search" to reserved metadata name keywords (#19181) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 612 | `ac8e0d4217` | #19182 | Replace twentycrm/twenty-postgres-spilo with official postgres:16 in CI (#19182) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 613 | `36dece43c7` | #19151 | Fix: Upgrade Nodemailer to address SMTP command injection vulnerability (#19151) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 614 | `aa0ea96582` | #19174 | Improve app errors logs at sync (#19174) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 615 | `b002930554` | #19197 | Update documentation on how to upload a file (#19197) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 616 | `a0c6727a61` | #19212 | i18n - docs translations (#19212) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 617 | `19dd4d6c1b` | #19210 | Fix workflow date fields (#19210) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 618 | `9054d3aef6` | #19211 | [COMMAND MENU ITEMS] Resolve object metadata label in dynamic command menu item label (#19211) | ACCEPT | 2C-frontend |  |
| 619 | `291792f864` | #19208 | Repair Edit Layout command menu item and add a button in settings to start edition too (#19208) | ACCEPT | 2C-frontend | mixed server/frontend — front lines=269 vs server lines=102 |
| 620 | `136f362b24` | #19214 | i18n - translations (#19214) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 621 | `20ac5b7e84` | #19209 | Field widget edition (#19209) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 622 | `e6fe48b66d` | #19215 | i18n - translations (#19215) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 623 | `9f95c4763c` | #19199 | [COMMAND MENU ITEMS] Remove deprecated code (#19199) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 624 | `e15feda3c3` | #19216 | i18n - translations (#19216) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 625 | `4cc3deb937` | #19217 | i18n - docs translations (#19217) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 626 | `16e3e38b79` | #19138 | Improve getting started doc (#19138) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 627 | `ae202a1b59` | #19226 | i18n - docs translations (#19226) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 628 | `6eb4c4ca4b` | #19227 | i18n - docs translations (#19227) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 629 | `5de5ed2cb4` | #19228 | i18n - docs translations (#19228) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 630 | `f3e2e00e79` | #19229 | i18n - docs translations (#19229) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 631 | `1622c87b7a` | #19234 | i18n - docs translations (#19234) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 632 | `0b2f4cdb57` | #19167 | Add delete widget action in fields widget side panel (#19167) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 633 | `3733a5a763` | #19236 | i18n - translations (#19236) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 634 | `fd7387928c` | #19203 | feat: queue messages + replace AI SDK with GraphQL SSE subscription (#19203) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 635 | `7991ce7823` | #19237 | i18n - translations (#19237) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 636 | `19c710b87f` | #19223 | fix read only text editor color (#19223) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 637 | `ade6ed9c32` | #19012 | [AI] agent node prompt tab new design + refactor (#19012) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 638 | `986256f56d` | #19240 | i18n - docs translations (#19240) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 639 | `72ac10fb7a` | #19242 | i18n - translations (#19242) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 640 | `1af7ac5fc4` | #19231 | Bump react-hotkeys-hook from 4.5.0 to 4.6.2 (#19231) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 641 | `691c86a4a7` | #19238 | Fix front component not opening in side panel (#19238) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 642 | `6d5580c6fd` | #19233 | Bump qs from 6.14.2 to 6.15.0 (#19233) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 643 | `2c73d47555` | #19232 | Bump @storybook/react-vite from 10.2.13 to 10.3.3 (#19232) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 644 | `16033e9f99` | #19245 |  Fix front component worker re-creation on every render (#19245) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 645 | `f688db30a9` | #19202 | Command to deduplicate command menu items (#19202) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 646 | `9438b9869c` | #19249 | i18n - translations (#19249) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 647 | `81f10c586f` | #19130 | Add workspace DDL lock env var and maintenance mode UI (#19130) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 648 | `391f6c0dab` | #19250 | i18n - translations (#19250) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 649 | `1c7bda8448` | #19251 | i18n - docs translations (#19251) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 650 | `223943550c` | #19235 | [AI] Unify code-interpreter streaming rendering and fix assistant width jitter (#19235) | ACCEPT | 2C-frontend | mixed server/frontend — front lines=119 vs server lines=38 |
| 651 | `c854d28d60` | #19225 | fix: make models.dev provider logos theme-aware (#19225) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 652 | `268543a08e` | #19239 | Complete sections of the new website. (#19239) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 653 | `885ab8b444` | #19220 | Seed Front Components (#19220) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 654 | `579714b62f` | #19213 | Investigate memory leak (#19213) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 655 | `a303d9ca1b` | #19219 | Gql direct execution - Handle introspection queries (#19219) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 656 | `b1a7155431` | #19248 | Disable edition for record page layouts disabled in the side panel (#19248) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 657 | `b8e7179a85` | #19253 | Add missing index on viewField.viewFieldGroupId (#19253) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 658 | `2ebff5f4d7` | #19175 | fix: harden token renewal and soften refresh token revocation (#19175) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 659 | `8581c11d56` | #19257 | i18n - docs translations (#19257) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 660 | `45c1c60acc` | #19255 | Fix maintenance mode banner button color, timezone and date picker UX (#19255) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 661 | `634a5e9599` | #19263 | i18n - translations (#19263) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 662 | `6f89098340` | #19259 | Prevent hovered tab to overflow (#19259) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 663 | `6ae5900ac9` | #19243 | Fix field permission validation rejecting undefined optional fields (#19243) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 664 | `cd23a2bc80` | #19241 | Cleaning `UpgradeCommand` code flow (#19241) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 665 | `3c067f072c` | #19221 | [AI] Improve tools tab (#19221) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 666 | `047dd350f6` | #19262 | fix workflow node (#19262) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 667 | `6a8bab6a47` | #19266 | i18n - translations (#19266) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 668 | `e1caf6caa1` | #19268 | Add datasource migration and connected account feature flag (#19268) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 669 | `d7e31ab2f0` | #19261 | Interactive home visual for website. (#19261) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 670 | `aadbf67ec8` | #19264 | [CommandMenu] Disable record selection dropdown on record pages in command menu editor (#19264) | ACCEPT | 2C-frontend |  |
| 671 | `4dfd6426c2` | #19265 | Disable going to settings in layout edit mode (#19265) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 672 | `6f3a86c4a9` | #19244 | Fix insert conflict between field permission and RLS (#19244) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 673 | `67d34be7c8` | #19270 | Add new workspace feature flag fix (#19270) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 674 | `c1e4756f9c` | #19200 | Add is active to overridable entities and deactivation logic for page layouts (#19200) | ACCEPT | 2B-backend |  |
| 675 | `7f2b853ae1` | #19205 | feat: add message compaction for AI chats (#19205) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 676 | `779e613df3` | #19269 | Fixes: relation settings design + workflow input border (#19269) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 677 | `a53b9cb68a` | #19271 | On workspace creation generate sdk client through a job (#19271) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 678 | `5022bf03ba` | #19277 | Add AI as a public feature flag in the Lab (#19277) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 679 | `331c223e73` | #19278 | Fix create e2e app ci set version flakiness (#19278) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 680 | `30517eb06c` | #19281 | Remove more button in edit mode (#19281) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 681 | `a2533baa66` | #19267 | Local driver layer resolution wipe partial local layers relicas (#19267) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 682 | `77315b7f6e` | #19276 | Sync record selection with the edit mode (#19276) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 683 | `a7b2bec529` | #19279 | Remove try catch from generate sdk client job (#19279) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 684 | `43baf7b91c` | #19246 | fix: prepend UTF-8 BOM to fix non-Latin characters in csv (#19246) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 685 | `2d6c8be7df` | #19206 | [Apps] Fix - app-synced object should be searchable (#19206) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 686 | `04d22feef6` | #19285 | i18n - translations (#19285) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 687 | `175ae5f0aa` | #19284 | polishing next home hero visual (#19284) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 688 | `2ae6a9bb98` | #19288 | fix: bump handlebars to 4.7.9 (CVE-2026-33937) (#19288) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 689 | `12b031b67d` | #19298 | chore: sync AI model catalog from models.dev (#19298) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 690 | `bb3d556799` | #19274 | Refined demo workspace creation skill (rebased, review fixes) (#19274) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 691 | `baa4fda3d2` | #19289 | fix: create company workflow (use psl for domain suffix) (#19289) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 692 | `c521ba29be` | #19291 | fix: CalDAV sync broken by SSRF hostname replacement (#19291) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 693 | `f01bcf60ee` | #19260 | [AI] Fix record chips not rendering inside markdown tables in AI chat (#19260) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 694 | `da72075841` | #19304 | Fix search fallback command menu item (#19304) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 695 | `2ff2c39cf4` | #19305 | i18n - translations (#19305) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 696 | `119014f86d` | #19256 | Improve apps (#19256) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 697 | `8543576dae` | #19307 | Dynamic icon for command menu items (#19307) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 698 | `4ba2f3b184` | #19313 | Read cache value for total event stream count (#19313) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 699 | `0b8421a45a` | #19314 | i18n - docs translations (#19314) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 700 | `b55765a991` | #19311 | Fix delete/restore/destroy commands unavailable in select-all mode (#19311) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 701 | `90597e47ca` | #19306 | Add redis cache for cron triggers (#19306) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 702 | `d562a384c2` | #19254 | Remove direct execution feature flag - WIP (#19254) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 703 | `f8c3960cf2` | #19315 | Disable setting tab when empty (#19315) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 704 | `93c0c98495` | #19317 | i18n - translations (#19317) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 705 | `e1a58df140` | #19318 | i18n - translations (#19318) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 706 | `0b44c9e4e5` | #19316 | Remove connected account upgrade command (#19316) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 707 | `282ee9ac42` | #19320 | i18n - docs translations (#19320) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 708 | `8da69e0f77` | #19282 | Fix stored XSS via unsafe URL protocols in href attributes (#19282) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 709 | `4db7ae20c4` | #19329 | i18n - translations (#19329) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 710 | `804e0539d9` | #19323 | Publish 0.8.0 (#19323) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 711 | `80c5cfc2ec` | #19324 | Add npm packages app settings list (#19324) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 712 | `9cc794ddb6` | #19330 | i18n - translations (#19330) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 713 | `563e27831b` | #19321 | Clean up tool output architecture: remove wrappers, enforce ToolOutput everywhere (#19321) | ACCEPT | 2B-backend | mixed server/frontend — server lines=609 vs front lines=81 |
| 714 | `ed912ec548` | #19339 | chore: sync AI model catalog from models.dev (#19339) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 715 | `265b2582ee` | #19342 | Fix zh-CN sidebar translations in minimalMetadata API (#19342) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 716 | `f25e040712` | #19344 | fix: replace npm pkg set with node script in set-local-version target (#19344) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 717 | `bad488494f` | #19336 | Fix dark mode text color on permissions tab empty stat (#19336) (#19340) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 718 | `3747af4b5a` | #19334 | Fix readonly date still editable (#19334) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 719 | `e062343802` | #19275 | Refactor typeorm migration lifecycle and generation (#19275) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 720 | `3a1e112b86` | #19350 | Fixes and updates to the website. (#19350) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 721 | `d3f0162cf5` | #19286 | Remove connected account feature flag (#19286) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 722 | `0d44d7c6d7` | #19352 | i18n - translations (#19352) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 723 | `8d61bb9ae6` | #19348 | Migrate messageFolder parentFolderId from UUID to externalId (#19348) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 724 | `7bf309ba73` | #19332 | Update last interaction app (#19332) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 725 | `4aa1d71b12` | #19353 | few website improvements (#19353) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 726 | `8acfacc69c` | #19351 | Add email thread widget and message thread record page layout (#19351) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 727 | `ea572975d8` | #19341 | feat: generic web search driver abstraction with Exa support and billing (#19341) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 728 | `646edec104` | #19354 | i18n - translations (#19354) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 729 | `aec43da1e2` | #19355 | i18n - translations (#19355) | ACCEPT | i18n-bulk |  |
| 730 | `83d30f8b76` | #19363 | feat: Send email from UI — inline reply composer & SendEmail mutation (#19363) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 731 | `c7d1cd11e0` | #19370 | i18n - translations (#19370) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 732 | `ea4ef99565` | #19366 | Salesforce section (#19366) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 733 | `35b76539cc` | #19357 | fix: minimatch related dependabot alerts. (#19357) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 734 | `8c9228cb2b` | #19359 | fix: SVGO DoS through entity expansion in DOCTYPE (#19359) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 735 | `68cd2f6d61` | #19360 | fix: node-tar symlink path traversal via drive-relative linkpath (#19360) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 736 | `3f87d27d5d` | #19071 | fix: use AND instead of OR in neq filter for null-equivalent values (#19071) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 737 | `955aa9191f` | #19373 | fix: unify settings layout prep when entering settings from outside (#19373) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 738 | `7053e1bbc5` | #19375 | fix: bypass permission checks in 1.21 backfill-message-thread-subject command (#19375) | ACCEPT | 2B-backend |  |
| 739 | `f33ad53e72` | #19376 | chore: remove registeredCoreMigration (#19376) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 740 | `2d552fc9fd` | #19369 | Remove hover and scroll transitions from website. (#19369) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 741 | `601dc02ed7` | #19361 | Fix s3 driver empty objects (#19361) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 742 | `b23d2b4e73` | #19365 | messaging post migration cleanup (#19365) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 743 | `23874848a4` | #19356 | Instance commands and `upgrade_migrations` table (#19356) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 744 | `a2188cb0eb` | #19283 | Reset Fields widget implementation (#19283) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 745 | `c0c0cbb896` | #19382 | i18n - translations (#19382) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 746 | `7c2a9abed4` | #19378 | fix: prevent NaN in health indicator calculations (#19378) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 747 | `d324bbfc25` | #19387 | Styled illustrations for Hero, ThreeCards, Helped sections. (#19387) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 748 | `ac1ec91f25` | #19383 | Direct execution - Remove conditional schema (#19383) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 749 | `f39fccc3c4` | #19388 | fix(messaging): split thread create/update statements and stop clobbering accumulator (#19388) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 750 | `6ad9566043` | #19389 | Add messaging upgrade command 1 21 (#19389) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 751 | `1b14e7e1f1` | #19390 | Fix - Update package.json (#19390) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 752 | `d3ec64072b` | #19391 | [AI] Improve AI System Prompt page layout and token display (#19391) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 753 | `d10ef156c1` | #19395 | i18n - translations (#19395) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 754 | `1c9fc94c1f` | #19379 | Workspace commands writes in`upgradeMigration` (#19379) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 755 | `fe07de63b0` | #19393 | Enterprise plan required for private app sharing (#19393) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 756 | `dd2a09576b` | #19392 | Imap-smtp-caldav form fixes (#19392) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 757 | `c844109ffc` | #19398 | i18n - translations (#19398) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 758 | `d97a1cfc27` | #19399 | i18n - docs translations (#19399) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 759 | `96a242eb7d` | #19394 | fix(messaging): create messageThread.subject field metadata + column in 1-21 backfill (#19394) | ACCEPT | 2B-backend |  |
| 760 | `6e23ca35e6` | #19380 | Pagelayout backfill command standard app (#19380) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 761 | `8702300b07` | #19386 | App feedbacks fix option id required in apps (#19386) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 762 | `653180d10f` | #19403 | i18n - translations (#19403) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 763 | `e048d03872` | #19381 | Improve workflow crons efficiency (#19381) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 764 | `1f3965e5f8` | #19310 | Add Manage and Placement sections in widget side panel page for record page layouts (#19310) | ACCEPT | 2C-frontend |  |
| 765 | `e692e97428` | #19404 | i18n - translations (#19404) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 766 | `38802bd0b8` | #19401 | Style the remaining website visuals. (#19401) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 767 | `5e9792009f` | #19405 | i18n - docs translations (#19405) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 768 | `d341d0d624` | #19303 | Refactor navigation commands to use NAVIGATION engine key with payload (#19303) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 769 | `91f8f7329a` | #19385 | improve pricing card header [website] (#19385) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 770 | `137e068ced` | #19407 | Fix `yarn-install-lambda` and `lambda-build` `target` (#19407) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 771 | `54be3b7e87` | #19400 | docs: remove reference to sync metadata (#19400) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 772 | `61abfd103d` | #18721 | fix TextVariableEditor layout and add support for multi line paste  (#18721) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 773 | `607e708670` | #19408 | [COMMAND MENU ITEMS] Add navigate to settings pages commands (#19408) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 774 | `24a5273a79` | #19410 | i18n - docs translations (#19410) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 775 | `c0eacedfec` | #19397 | Workspace command decorators (#19397) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 776 | `e2bd3e8ef4` | #19411 | Unselect widget when exiting layout customization mode (#19411) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 777 | `9bdef449e6` | #19414 | Fix messageThread view and labelIdentifier on legacy workspaces (#19414) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 778 | `5c8b6e395b` | #19416 | App feedbacks front (#19416) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 779 | `a0484f686a` | #19368 | Add color to object icon picker in data model (#19368) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 780 | `af3423dc6f` | #19421 | i18n - translations (#19421) | DEFER | defer | already landed in fuse main (wave 1 / prior cherry-pick) |
| 781 | `15eb3e7edc` | #19409 | feat(sdk): use config file as single source of truth, remove env var fallbacks (#19409) | ACCEPT | 2A-security |  |
| 782 | `c91d642f29` | #19417 | App feedbacks front (#19417) | ACCEPT | 2C-frontend | mixed server/frontend — front lines=63 vs server lines=3 |
| 783 | `20adb86917` | #19402 | fix: IMAP skip no-select flag folders properly (#19402) | ACCEPT | 2B-backend |  |
| 784 | `b540ae9735` | #19424 | i18n - translations (#19424) | ACCEPT | i18n-bulk |  |
| 785 | `a8085db5fd` | #19425 | i18n - translations (#19425) | ACCEPT | i18n-bulk |  |
| 786 | `b3d46b0fa3` | #19420 | feat: Add support for CLF currency code (#19420) | ACCEPT | 2C-frontend |  |
| 787 | `8026451220` | #19426 | chore: sync AI model catalog from models.dev (#19426) | ACCEPT | 2B-backend |  |
| 788 | `90de1d4a34` | #19413 | Add twenty sync command (#19413) | ACCEPT | 2B-backend | other-only paths (no server/front files) — default 2B |
| 789 | `8090fa4364` | #19437 | i18n - docs translations (#19437) | ACCEPT | i18n-bulk |  |
| 790 | `e9310555fb` | #19436 | Fix tab selection in layout edit mode (#19436) | ACCEPT | 2C-frontend |  |
| 791 | `9d96e529c8` | #19440 | Fix last widget bottom bar inconsistencies (#19440) | ACCEPT | 2C-frontend |  |
| 792 | `9a58f3d459` | #19428 | Add a lock on function creation (#19428) | ACCEPT | 2B-backend |  |
| 793 | `8aa208fc93` | #19433 | Fix overridable entities logic for SSE (#19433) | ACCEPT | 2B-backend | mixed server/frontend — server lines=721 vs front lines=4 |
| 794 | `8a84e32cf6` | #19438 | fix(ai): use @ai-sdk/openai-compatible for third-party providers (#19438) | ACCEPT | 2B-backend |  |
| 795 | `85be463487` | #19431 | Slow instance commands (#19431) | ACCEPT | 2B-backend |  |
| 796 | `1ae88f4e4f` | #19430 | chore: add CD workflow template and point spawn action to main (#19430) | ACCEPT | 2A-security |  |
| 797 | `265d859c6e` | #19446 | i18n - docs translations (#19446) | ACCEPT | i18n-bulk |  |
| 798 | `d07c27a907` | #19432 | [COMMAND MENU ITEMS] Create union type for command menu item payload (#19432) | ACCEPT | 2B-backend | mixed server/frontend — server lines=210 vs front lines=133 |
| 799 | `ac4819758d` | #19451 | i18n - translations (#19451) | ACCEPT | i18n-bulk |  |
| 800 | `83917f0dca` | #19447 | Isolate illustrations from sections to style them independently. (#19447) | ACCEPT | 2B-backend | other-only paths (no server/front files) — default 2B |
| 801 | `0e0fb246e6` | #19429 | Refactor the website hero into an interactive multi-view illustration (#19429) | ACCEPT | 2B-backend | other-only paths (no server/front files) — default 2B |
| 802 | `6cd3f2db2b` | #19449 | chore: replace spawn-twenty-app-dev-test with native postgres/redis services (#19449) | ACCEPT | 2A-security |  |
| 803 | `3306d66f5b` | #19445 | cleaning - remove logs (#19445) | ACCEPT | 2B-backend |  |
| 804 | `31b6dbc583` | #19435 | [COMMAND MENU ITEMS] Remove object metadata name from search commands (#19435) | ACCEPT | 2B-backend |  |
| 805 | `bc7b5aee58` | #19454 | chore: centralize deploy/install CD actions in twentyhq/twenty (#19454) | ACCEPT | 2A-security |  |
| 806 | `8905d860c7` | #19443 | Store upgrade commands error message (#19443) | ACCEPT | 2B-backend |  |
| 807 | `4df3539ba1` | #19457 | Fix: Staled data on record table after merging records (#19457) | ACCEPT | 2C-frontend |  |
| 808 | `7d6111b0a5` | #19458 | Fix workspace command name inserted in db (#19458) | ACCEPT | 2B-backend |  |
| 809 | `fda3eabb5f` | #19455 | introduce MESSAGING_MESSAGES_GET_BATCH_SIZE as config variable (#19455) | ACCEPT | 2B-backend |  |
| 810 | `5c867303e0` | #19434 | Fix documentation about importing dates (#19434) | ACCEPT | 2B-backend | other-only paths (no server/front files) — default 2B |
| 811 | `7aed9291cd` | #19461 | fix(ai-chat): preload web_search action tool when driver is enabled (#19461) | ACCEPT | 2B-backend |  |
| 812 | `2267c56f15` | #19464 | [COMMAND MENU ITEMS] Disable hide label toggle for items with no short label (#19464) | ACCEPT | 2C-frontend |  |
| 813 | `238018dc7b` | #19453 | Reset Tab Page Layout (#19453) | ACCEPT | 2B-backend | mixed server/frontend — server lines=841 vs front lines=744 |
| 814 | `37dbd94596` | #19466 | i18n - docs translations (#19466) | ACCEPT | i18n-bulk |  |
| 815 | `5874fb5f39` | #19467 | i18n - translations (#19467) | ACCEPT | i18n-bulk |  |
| 816 | `6073bb6706` | #19427 | Fix AI model registry staleness on self-hosted instances (#19427) | ACCEPT | 2B-backend |  |
| 817 | `ffb6029c2d` | #19470 | fix(ai-models): use AWS provider chain for Bedrock IRSA auth (#19470) | ACCEPT | 2B-backend |  |
| 818 | `c27e3cd1a0` | #19478 | chore: sync AI model catalog from models.dev (#19478) | ACCEPT | 2B-backend |  |
| 819 | `91b40b391d` | #19477 | Bump graphql-sse from 2.5.4 to 2.6.0 (#19477) | ACCEPT | 2B-backend | other-only paths (no server/front files) — default 2B |
| 820 | `80337d5c37` | #19476 | Bump tsdav from 2.1.5 to 2.1.8 (#19476) | ACCEPT | 2B-backend | other-only paths (no server/front files) — default 2B |
| 821 | `1b8f26323a` | #19475 | Bump @babel/preset-react from 7.26.3 to 7.28.5 (#19475) | ACCEPT | 2B-backend | other-only paths (no server/front files) — default 2B |
| 822 | `f8dff23a3e` | #19480 | Refactor: Extract EventRow shared types and styles to EventRowBase (#19480) | ACCEPT | 2C-frontend |  |
| 823 | `9080180156` | #19456 | [COMMAND MENU ITEMS] Sync object metadata with navigation command menu items (#19456) | ACCEPT | 2B-backend | mixed server/frontend — server lines=557 vs front lines=108 |
| 824 | `5edc034f8b` | #19465 | Enqueue a snack bar on merge preview errors (#19465) | ACCEPT | 2C-frontend |  |
| 825 | `5eaabe95e7` | #19469 | Fix role synchronisation (#19469) | DEFER | 2D-flags-rbac | RBAC/permissions stack change (wave 2D) |
| 826 | `a78a843419` | #19481 | Fix install and deploy commands (#19481) | ACCEPT | 2B-backend |  |
| 827 | `dc6e76b6ab` | #19488 | i18n - translations (#19488) | ACCEPT | i18n-bulk |  |
| 828 | `64c7f52f06` | #19490 | i18n - docs translations (#19490) | ACCEPT | i18n-bulk |  |
| 829 | `9b8cb610c3` | #19491 | Flush Redis between server runs in breaking changes CI (#19491) | ACCEPT | 2A-security |  |
| 830 | `19f11b1216` | #19452 | [COMMAND MENU ITEMS] Add dynamic label and icon to command menu navigation items (#19452) | ACCEPT | 2B-backend |  |
| 831 | `086ea644bb` | #19493 | Resolve frontComponent relation on command menu items via selector (#19493) | ACCEPT | 2C-frontend |  |
| 832 | `1577a1933f` | #19483 | Move page layout backfill command out of 1-21 release (#19483) | ACCEPT | 2B-backend |  |
| 833 | `7bd84a6029` | #19492 | messaging fix relaunch cron jobs (#19492) | ACCEPT | 2B-backend |  |
| 834 | `c76824e69f` | #19497 | i18n - docs translations (#19497) | ACCEPT | i18n-bulk |  |
| 835 | `37acd15033` | #19489 | More website fixes. (#19489) | ACCEPT | 2B-backend | other-only paths (no server/front files) — default 2B |
| 836 | `34972f6167` | #19479 | Record table widget - Follow up (#19479) | ACCEPT | 2C-frontend |  |
| 837 | `1df9942416` | #19500 | i18n - translations (#19500) | ACCEPT | i18n-bulk |  |
| 838 | `d495a9f412` | #19482 | reorganize standard page layouts (#19482) | ACCEPT | 2B-backend |  |
| 839 | `1e908e5f0f` | #19484 | fix: SendEmail workflow ConnectedAccount query (#19484) | ACCEPT | 2C-frontend | mixed server/frontend — front lines=191 vs server lines=45 |
| 840 | `16e145b036` | #19450 | Fix moving a widget to another tab (#19450) | ACCEPT | 2B-backend | mixed server/frontend — server lines=540 vs front lines=1 |
| 841 | `5e3cf7cd2b` | #19501 | Prepare 1.21 (#19501) | ACCEPT | 2B-backend |  |
| 842 | `74e26ae635` | #19463 | Fix Date/DateTime/Relation field forms (#19463) | ACCEPT | 2C-frontend |  |
| 843 | `50c5a1a8de` | #19384 | [AI] new model tab design (#19384) | ACCEPT | 2C-frontend | mixed server/frontend — front lines=1235 vs server lines=144 |
| 844 | `a5174c0519` | #19504 | i18n - translations (#19504) | ACCEPT | i18n-bulk |  |
| 845 | `d3a1f45027` | #19506 | i18n - translations (#19506) | ACCEPT | i18n-bulk |  |
| 846 | `caac791421` | #19498 | Cleaning - Remove logs (#19498) | ACCEPT | 2B-backend |  |
| 847 | `5116002ca2` | #19503 | chore: replace glb files and lottie with optimized variants (#19503) | ACCEPT | 2B-backend | other-only paths (no server/front files) — default 2B |
| 848 | `36fbfca069` | #19486 | Add application-logs module with driver pattern for logic function log persistence (#19486) | REJECT | reject | telemetry SDK path (reject rule: surveillance dependency) |
| 849 | `93eeeb2397` | #19509 | i18n - docs translations (#19509) | ACCEPT | i18n-bulk |  |
| 850 | `086256eb8d` | #19510 | i18n - translations (#19510) | ACCEPT | i18n-bulk |  |
| 851 | `0c7712926d` | #19510 | i18n - translations (#19510) | ACCEPT | i18n-bulk |  |
| 852 | `082822b790` | #19507 | Fix AI chat threads query firing for users without AI permissions (#19507) | ACCEPT | 2C-frontend |  |
| 853 | `07745947ee` | #19511 | Fix rolesPermissions cache query cartesian product (62k → 162 rows) (#19511) | DEFER | 2D-flags-rbac | RBAC/permissions stack change (wave 2D) |
| 854 | `e411f076f1` | #19515 | Replace typeorm binary by `database:migrate:generate` (#19515) | ACCEPT | 2B-backend |  |
| 855 | `00208dbf1f` | #19516 | Build lambda error - catch user code compilation errors (#19516) | ACCEPT | 2B-backend |  |
| 856 | `c54747379a` | #19520 | i18n - translations (#19520) | ACCEPT | i18n-bulk |  |
| 857 | `9bea5f73f1` | #19502 | Fix system objects not appearing in sidebar View picker due to filtering mismatch (#19502) | ACCEPT | 2C-frontend |  |
| 858 | `77498d2f73` | #19519 | Fix/align microsoft calendar error handling (#19519) | ACCEPT | 2B-backend |  |
| 859 | `afdd914b83` | #19512 | Add rich-text field widget (#19512) | ACCEPT | 2C-frontend | mixed server/frontend — front lines=329 vs server lines=9 |
| 860 | `8fde5d9da3` | #19521 | i18n - translations (#19521) | ACCEPT | i18n-bulk |  |
| 861 | `7ef80dd238` | #19523 | Add standard skills backfill and improve skill availability messaging (#19523) | ACCEPT | 2B-backend |  |
| 862 | `8a10071253` | #19522 | add workspaceId to indirect entities (#19522) | ACCEPT | 2B-backend |  |
| 863 | `e3077691d1` | #19499 | Edit visibility restriction (#19499) | ACCEPT | 2C-frontend | mixed server/frontend — front lines=363 vs server lines=92 |
| 864 | `df1d0d877d` | #19524 | Flatten AI tool call output structure (#19524) | ACCEPT | 2C-frontend |  |
| 865 | `7a317b9182` | #19525 | i18n - translations (#19525) | ACCEPT | i18n-bulk |  |
| 866 | `d2f51cc939` | #19462 | Fix pre post logic function not executed (#19462) | ACCEPT | 2B-backend |  |
| 867 | `2bb939b4b5` | #19517 | Add file attachment support to agent chat messaging (#19517) | ACCEPT | 2B-backend | mixed server/frontend — server lines=163 vs front lines=9 |
| 868 | `fb950cf312` | #19527 | i18n - translations (#19527) | ACCEPT | i18n-bulk |  |
| 869 | `0fa7beba44` | #19496 | fix mcp streamable-http method handling (#19496) | ACCEPT | 2B-backend |  |
| 870 | `20f28d6593` | #19529 | i18n - docs translations (#19529) | ACCEPT | i18n-bulk |  |
| 871 | `4fd721a3c9` | #19533 | chore: sync AI model catalog from models.dev (#19533) | ACCEPT | 2B-backend |  |
| 872 | `f6423f5925` | #19532 | Remove DataSourceService and clean up datasource migration logic (#19532) | DEFER | 2D-flags-rbac | feature-flag enum location/RBAC stack (wave 2D) |
| 873 | `cbefd42c4c` | #19528 | Add SSE streaming support on POST /mcp (Phase 2) (#19528) | ACCEPT | 2B-backend |  |
| 874 | `67e7f05a68` | #19485 | feat: email attachments and open-in-app click action (#19485) | ACCEPT | 2C-frontend | mixed server/frontend — front lines=1114 vs server lines=445 |
| 875 | `f8c35a95b5` | #19537 | i18n - translations (#19537) | ACCEPT | i18n-bulk |  |
| 876 | `2ea62317d8` | #19534 | Pre-sync only pre-install-logic-function (#19534) | ACCEPT | 2B-backend |  |
| 877 | `43ce396152` | #19538 | Upgrade cli tool version (#19538) | ACCEPT | 2B-backend | other-only paths (no server/front files) — default 2B |
| 878 | `f13e7e01fe` | #19406 | [AI] Add `group_by_*` database tools and centralize groupBy validation (#19406) | ACCEPT | 2B-backend |  |
| 879 | `4b3a46d953` | #19508 | Refactor command menu items deprecated code (#19508) | ACCEPT | 2C-frontend |  |
| 880 | `63c407e2f7` | #19548 | i18n - translations (#19548) | ACCEPT | i18n-bulk |  |
| 881 | `e03ac126ab` | #19539 | halftone generator v1 + new 3d shapes effect start (#19539) | ACCEPT | 2B-backend | other-only paths (no server/front files) — default 2B |
| 882 | `186bc02533` | #19544 | Skip email/calendar tab creation for custom object record page layouts (#19544) | ACCEPT | 2B-backend |  |
| 883 | `847e7124d7` | #19541 | Upgrade command internal doc (#19541) | ACCEPT | 2B-backend |  |
| 884 | `aed81a54a2` | #19542 | Upgrade cli tool version in technical apps (#19542) | ACCEPT | 2B-backend | other-only paths (no server/front files) — default 2B |
| 885 | `34a903b4fa` | #19374 | Object icon visual parity (#19374) | ACCEPT | 2C-frontend |  |
| 886 | `b284c8323c` | #19536 | Remove Favorite and FavoriteFolder from workspace schema (#19536) | ACCEPT | 2C-frontend | mixed server/frontend — front lines=36100 vs server lines=5892 |
| 887 | `ed07afa774` | #19549 |   Workspace export command follow-up (#19549) | ACCEPT | 2B-backend |  |
| 888 | `ec7d19a3af` | #19551 | i18n - translations (#19551) | ACCEPT | i18n-bulk |  |
| 889 | `001b7285e6` | #19518 | Support junction relations in Field widget (#19518) | ACCEPT | 2C-frontend |  |
| 890 | `4e6cf185fa` | #19550 | Fix error handling in stream agent chat job (#19550) | ACCEPT | 2B-backend |  |
| 891 | `217957f2a1` | #19553 | Optim - Increase connection idle timeout (#19553) | ACCEPT | 2B-backend |  |
| 892 | `31baf52528` | #19547 | Workflow - Avoid billing skipped steps (#19547) | ACCEPT | 2B-backend |  |
| 893 | `61720470c5` | #18897 | fix: expand kanban column drop zone to full height (#18897) | ACCEPT | 2C-frontend |  |
| 894 | `a82d078906` | #19116 | Lambda build update instead of delete existing logic function while building (#19116) | ACCEPT | 2B-backend |  |
| 895 | `9a403b84f3` | #19555 | `database:init:prod` triggers instance slow command too (#19555) | ACCEPT | 2B-backend |  |
| 896 | `5a22cc88c5` | #19557 | `database:reset` depends on `database:init` that runs slow instance commands (#19557) | ACCEPT | 2B-backend |  |
| 897 | `c99db7d9c6` | #19558 | Fix server-validation ci pending instance command detection (#19558) | ACCEPT | 2A-security |  |
| 898 | `f99c05f0e8` | #19546 | Fix merge command being available in exclusion mode (#19546) | ACCEPT | 2B-backend |  |
| 899 | `8c4a6cd663` | #19552 | Replace AGENT_CHAT_UNKNOWN_THREAD_ID with null for thread state (#19552) | ACCEPT | 2C-frontend |  |
| 900 | `83653a463c` | #19556 | fix: side panel close animation cleanup not firing due to invalid CSS transition (#19556) | ACCEPT | 2C-frontend |  |
| 901 | `8dd172ba00` | #19505 | Fix: Select next sidebar menu item after removing current item (#19505) | ACCEPT | 2C-frontend |  |
| 902 | `66d9f92e60` | #19569 | i18n - translations (#19569) | ACCEPT | i18n-bulk |  |
| 903 | `65b2baca7a` | #19566 | Remove IS_USAGE_ANALYTICS_ENABLED feature flag (#19566) | DEFER | 2D-flags-rbac | feature-flag enum location/RBAC stack (wave 2D) |
| 904 | `f52d66b960` | #19570 | i18n - translations (#19570) | ACCEPT | i18n-bulk |  |
| 905 | `c26c0b9d71` | #19563 | Use app's own OAuth credentials for CoreApiClient generation (#19563) | ACCEPT | 2A-security |  |
| 906 | `0a76db94bc` | #19580 | Bump twenty-sdk, twenty-client-sdk, create-twenty-app to 1.22.0-canary.1 (#19580) | ACCEPT | 2B-backend | other-only paths (no server/front files) — default 2B |
| 907 | `300be990b0` | #19573 | halftone v2 (#19573) | ACCEPT | 2B-backend | other-only paths (no server/front files) — default 2B |
| 908 | `53065f241f` | #19582 | Exchange clientSecret for tokens after app registration + bump canary (#19582) | ACCEPT | 2B-backend | other-only paths (no server/front files) — default 2B |
| 909 | `3b55026452` | #19581 | Improve NullCheckEnum filter descriptions with usage examples (#19581) | ACCEPT | 2B-backend |  |
| 910 | `baf2fc4cc9` | #19583 | Fix sdk-e2e-test: ensure DB is ready before server starts (#19583) | ACCEPT | 2A-security |  |
| 911 | `4d877d072d` | #19587 | Bump twenty-sdk, twenty-client-sdk, create-twenty-app to 1.22.0-canary.3 (#19587) | ACCEPT | 2B-backend | other-only paths (no server/front files) — default 2B |
| 912 | `b37ef3e7da` | #19589 | Add app-path input to deploy and install composite actions (#19589) | ACCEPT | 2B-backend | other-only paths (no server/front files) — default 2B |
| 913 | `4c57352450` | #19578 | Improve sensitive config variable masking and editing UX (#19578) | ACCEPT | 2C-frontend | mixed server/frontend — front lines=82 vs server lines=57 |
| 914 | `c268a50e4e` | #19591 | i18n - translations (#19591) | ACCEPT | i18n-bulk |  |
| 915 | `55b1624210` | #19585 | Convert AI chat state atoms to component family states (#19585) | ACCEPT | 2C-frontend |  |
| 916 | `c8f5ecb2b6` | #19600 | Add APPLICATION_LOG_DRIVER=CONSOLE to twenty-app-dev container (#19600) | ACCEPT | 2B-backend |  |
| 917 | `3ae63f0574` | #19599 | Fix syncApplication failing when navigation menu item child is listed before folder in manifest (#19599) | ACCEPT | 2B-backend |  |
| 918 | `6e259d3ded` | #19605 | Inline twenty-shared types in SDK declarations (#19605) | ACCEPT | 2B-backend | other-only paths (no server/front files) — default 2B |
| 919 | `4264741281` | #19608 | Clear stale SDK config on uninstall and invalid client (#19608) | ACCEPT | 2B-backend | other-only paths (no server/front files) — default 2B |
| 920 | `fda5aba9ec` | #19603 | small fixes on pricing (#19603) | ACCEPT | 2B-backend | other-only paths (no server/front files) — default 2B |
| 921 | `d9d3648baa` | #19598 | Halftone studio v3 (glass effect) (#19598) | ACCEPT | 2B-backend | other-only paths (no server/front files) — default 2B |
| 922 | `ad1a4ecca0` | #19609 | Add isUnique support for application-defined fields (#19609) | ACCEPT | 2B-backend |  |
| 923 | `7540bb064f` | #19610 | Re-export missing types from SDK public API (#19610) | ACCEPT | 2B-backend | other-only paths (no server/front files) — default 2B |
| 924 | `63806b24fe` | #19611 | Export field settings types from SDK public API (#19611) | ACCEPT | 2B-backend | other-only paths (no server/front files) — default 2B |
| 925 | `9e385e44f9` | #19562 | Fields widget draft view (#19562) | ACCEPT | 2C-frontend |  |
| 926 | `4e46aa32bb` | #19612 | i18n - translations (#19612) | ACCEPT | i18n-bulk |  |
| 927 | `c73cdd0844` | #19572 | fix: prevent image upload panel from being clipped in side panel (#19572) | ACCEPT | 2C-frontend |  |
| 928 | `150c326369` | #19613 | fix: prevent image upload panel from being clipped in side panel (#19613) | ACCEPT | 2C-frontend |  |
| 929 | `09806d7d8c` | #19579 | Add admin panel workspace detail page with chat viewer (#19579) | ACCEPT | 2C-frontend | mixed server/frontend — front lines=1824 vs server lines=1276 |
| 930 | `de401d96fe` | #19621 | i18n - translations (#19621) | ACCEPT | i18n-bulk |  |
| 931 | `7091561489` | #19622 | Fix command `FixMessageThreadViewAndLabelIdentifierCommand` (#19622) | ACCEPT | 2B-backend |  |
| 932 | `21142d98fe` | #19559 | Implement cross version upgrade (#19559) | ACCEPT | 2B-backend |  |
| 933 | `63666547fb` | #19639 | Fix e2e (#19639) | ACCEPT | 2B-backend | other-only paths (no server/front files) — default 2B |
| 934 | `884b06936e` | #19623 | Switch app test infra to globalSetup with appDevOnce (#19623) | ACCEPT | 2B-backend | other-only paths (no server/front files) — default 2B |
| 935 | `2ac93bd803` | #19628 | Fix design (#19628) | ACCEPT | 2C-frontend |  |
| 936 | `8bf9b12ace` | #19629 | Fix installed app setting tab (#19629) | ACCEPT | 2C-frontend |  |
| 937 | `bf5cc68f25` | #19631 | Rename standard and custom apps (#19631) | ACCEPT | 2B-backend | mixed server/frontend — server lines=19 vs front lines=2 |
| 938 | `cd10f3cbd9` | #19630 | Disable permission tab when empty (#19630) | ACCEPT | 2C-frontend |  |
| 939 | `64e031b9dd` | #19643 | i18n - translations (#19643) | ACCEPT | i18n-bulk |  |
| 940 | `8425afd930` | #19645 | i18n - translations (#19645) | ACCEPT | i18n-bulk |  |
| 941 | `6829fc315a` | #19568 | Implement full tab widget frontend (#19568) | ACCEPT | 2C-frontend | mixed server/frontend — front lines=787 vs server lines=6 |
| 942 | `6182918a66` | #19641 | Document isAuthRequired: true instead of false (#19641) | ACCEPT | 2B-backend | other-only paths (no server/front files) — default 2B |
| 943 | `5e7e5dd466` | #19637 | Colliding `subject` field fix on `messageThread` command (#19637) | ACCEPT | 2B-backend |  |
| 944 | `1382790c80` | #19638 | Fix side panel close button title (#19638) | ACCEPT | 2C-frontend |  |
| 945 | `227d24512e` | #19636 | Fix permission flag deletion validator (#19636) | ACCEPT | 2B-backend |  |
| 946 | `e34ca3817c` | #19646 | i18n - translations (#19646) | ACCEPT | i18n-bulk |  |
| 947 | `c67602f2e8` | #19647 | i18n - translations (#19647) | ACCEPT | i18n-bulk |  |
| 948 | `87bb2f94bb` | #19625 | Fixes on website (#19625) | ACCEPT | 2B-backend | other-only paths (no server/front files) — default 2B |
| 949 | `88c0b24d9e` | #19640 | Add per-workspace error handling to CronTriggerCronJob (#19640) | ACCEPT | 2B-backend |  |
| 950 | `84b325876d` | #19624 | More website updates. (#19624) | ACCEPT | 2B-backend | other-only paths (no server/front files) — default 2B |
| 951 | `12233e6c47` | #19648 | few fixes (#19648) | ACCEPT | 2B-backend | other-only paths (no server/front files) — default 2B |
| 952 | `ce2723d6cf` | #19642 | Move view field label identifier deletion validation into the cross entity validation (#19642) | ACCEPT | 2B-backend |  |
| 953 | `33c74c4d28` | #19651 | i18n - docs translations (#19651) | ACCEPT | i18n-bulk |  |
| 954 | `9f6855e7dd` | #19652 | i18n - translations (#19652) | ACCEPT | i18n-bulk |  |
| 955 | `7dfc556250` | #19626 | refactor messaging jobs (#19626) | ACCEPT | 2B-backend |  |
| 956 | `87f5c0083f` | #19627 | Prevent cross version upgrade mismatch in `1.22` (#19627) | ACCEPT | 2B-backend |  |
| 957 | `353d1e89d5` | #19633 | Fix merge with null value + reset data virtualization before init load (#19633) | ACCEPT | 2B-backend | mixed server/frontend — server lines=286 vs front lines=28 |
| 958 | `3f495124a5` | #19619 | Fix navbar folder not opening on page refresh when it has an active child item (#19619) | ACCEPT | 2C-frontend |  |
| 959 | `96959b43ba` | #19620 | Fix: Filter out deactivated objects from navigation sidebar (#19620) | ACCEPT | 2C-frontend |  |
| 960 | `d2a99ef72d` | #19614 | Fix VariablePicker and Fullscreen Icon overlap in FormAdvancedTextFieldInput (#19614) | ACCEPT | 2C-frontend |  |
| 961 | `123d6241d7` | #19654 | Fix `AddPermissionFlagRoleIdIndexFastInstanceCommand` (#19654) | ACCEPT | 2B-backend |  |
| 962 | `fb772c7695` | #19650 | Sync command menu with main context store (#19650) | ACCEPT | 2C-frontend |  |
| 963 | `76d3e4ad2e` | #19656 | i18n - translations (#19656) | ACCEPT | i18n-bulk |  |
| 964 | `64a7725ac7` | #19655 | Add banner for not vetted apps (#19655) | ACCEPT | 2C-frontend |  |
| 965 | `665db83bb5` | #19661 | i18n - translations (#19661) | ACCEPT | i18n-bulk |  |
| 966 | `0894f2004b` | #19659 | Remove app record if first install fails (#19659) | ACCEPT | 2B-backend |  |
| 967 | `fa354b4c1c` | #19660 | Remove orphaned workspaceId column from BillingSubscriptionItemEntity (#19660) | ACCEPT | 2B-backend |  |
| 968 | `455022f652` | #19586 | Add ClickHouse-backed metered credit cap enforcement (#19586) | REJECT | reject | telemetry SDK (reject rule: surveillance dependency) |
| 969 | `69d228d8a1` | #19662 | Deprecate IS_RECORD_TABLE_WIDGET_ENABLED feature flag (#19662) | DEFER | 2D-flags-rbac | feature-flag enum location/RBAC stack (wave 2D) |
| 970 | `cdc7339da1` | #19657 | Fix testimonials background, faq clickability and some case-studies page edits. (#19657) | REJECT | reject | CTO decision 2026-04-23: website-only commit (twenty-website/*), zero runtime impact, regex false-positive pulled it into 2D — drop |
| 971 | `d88fb2bd65` | #19561 | Clean event creation exception (#19561) | ACCEPT | 2C-frontend |  |
| 972 | `e041125426` | #19439 | fix: return 404 for deleted workspace webhook race (#19439) | ACCEPT | 2B-backend |  |
| 973 | `87f8e5ca19` | #19663 | few website updates (#19663) | ACCEPT | 2B-backend | other-only paths (no server/front files) — default 2B |
| 974 | `5fa3094800` | #19593 | test: fix failing useColorScheme test and remove FIXME (#19593) | ACCEPT | 2C-frontend | mixed server/frontend — front lines=30 vs server lines=4 |
| 975 | `194f0963dc` | #19669 | Remove 'twenty-app' keyword by default (#19669) | ACCEPT | 2B-backend | other-only paths (no server/front files) — default 2B |
| 976 | `714f149b0c` | #19670 | Move backfill page layout to `1.23` (#19670) | ACCEPT | 2B-backend |  |
| 977 | `d583984bf0` | #19590 | fix(api-key): batch role resolution with DataLoader to fix N+1 (#19590) | ACCEPT | 2B-backend |  |
| 978 | `40c6c63bf5` | #19672 | i18n - docs translations (#19672) | ACCEPT | i18n-bulk |  |
| 979 | `49aac04b84` | #19596 | fix: edit button not coming up on avatar right after image upload (#19596) | ACCEPT | 2C-frontend |  |
| 980 | `f738961127` | #19564 | Add gql operationName metadata in sentry (#19564) | ACCEPT | 2B-backend |  |
| 981 | `3e699c4458` | #19671 | Fix upgrade commands discovery outside of cli (#19671) | ACCEPT | 2B-backend |  |
| 982 | `eb13378760` | #19635 | Fix Quick Lead command menu item not appearing (#19635) | ACCEPT | 2B-backend |  |
| 983 | `9c07ecd363` | #19567 | Fix view filter/sort deletion (#19567) | ACCEPT | 2C-frontend |  |
| 984 | `b817bdca02` | #19668 | Rpl various fixes (#19668) | ACCEPT | 2C-frontend |  |
| 985 | `47bdcb11d8` | #19649 | Move is active to fe (#19649) | ACCEPT | 2C-frontend | mixed server/frontend — front lines=606 vs server lines=314 |
| 986 | `edc47bd458` | #19677 | i18n - docs translations (#19677) | ACCEPT | i18n-bulk |  |
| 987 | `fb4d037b93` | #19680 | Upgrade self hosting application (#19680) | ACCEPT | 2A-security |  |
| 988 | `eaf54ae02f` | #19678 | website new fixes (#19678) | ACCEPT | 2B-backend | other-only paths (no server/front files) — default 2B |
| 989 | `b194b67ac4` | #19326 | fix(address): populate street line from place details (#19326) | ACCEPT | 2B-backend | mixed server/frontend — server lines=531 vs front lines=56 |
| 990 | `1e42be5a44` | #19684 | Expend field widget field supported types (#19684) | ACCEPT | 2C-frontend |  |
| 991 | `ef328755bb` | #19683 | Bump current version to `1.23.0` (#19683) | ACCEPT | 2B-backend | mixed server/frontend — server lines=217 vs front lines=1 |
| 992 | `edba7fe085` | #19682 | Reset to default page layout (#19682) | ACCEPT | 2B-backend | mixed server/frontend — server lines=225 vs front lines=197 |
| 993 | `c8a3de6c65` | #19688 | Test workflow with webhook expected body (#19688) | ACCEPT | 2C-frontend |  |
| 994 | `573ecea753` | #19691 | i18n - translations (#19691) | ACCEPT | i18n-bulk |  |
| 995 | `762de40c3d` | #19689 | Improve upgrade registry logging for pre-release bundles (#19689) | ACCEPT | 2B-backend |  |
| 996 | `b3354ab6e7` | #19685 | Fix multi-workspace-registration (#19685) | ACCEPT | 2C-frontend | mixed server/frontend — front lines=244 vs server lines=9 |
| 997 | `ed9dd3c275` | #19692 | i18n - translations (#19692) | ACCEPT | i18n-bulk |  |
| 998 | `43249d80e8` | #19693 | Add missing doc (#19693) | ACCEPT | 2B-backend | other-only paths (no server/front files) — default 2B |
| 999 | `a88d1f4442` | #19675 | Introduce standalone page (#19675) | ACCEPT | 2C-frontend | mixed server/frontend — front lines=1674 vs server lines=1317 |
| 1000 | `9cf6f42313` | #19699 | i18n - translations (#19699) | ACCEPT | i18n-bulk |  |
| 1001 | `3463ee5dc4` | #19697 | Switch default remote to lastly added remote (#19697) | ACCEPT | 2B-backend | other-only paths (no server/front files) — default 2B |
| 1002 | `307b6c94de` | #19690 | Align GraphQL error handling for billing and AI chat (#19690) | ACCEPT | 2C-frontend | mixed server/frontend — front lines=687 vs server lines=279 |
| 1003 | `59a222e0f0` | #19703 | i18n - translations (#19703) | ACCEPT | i18n-bulk |  |
| 1004 | `42f452311b` | #19705 | i18n - docs translations (#19705) | ACCEPT | i18n-bulk |  |
| 1005 | `bc28e1557c` | #19441 | Introduce updateWorkspaceMemberSettings and clarify product (#19441) | DEFER | 2D-flags-rbac | RBAC/permissions stack change (wave 2D) |
| 1006 | `77e5b06a50` | #19707 | i18n - translations (#19707) | ACCEPT | i18n-bulk |  |
| 1007 | `7a721ef5dd` | #19709 | i18n - docs translations (#19709) | ACCEPT | i18n-bulk |  |
| 1008 | `a9ea1c6eed` | #19710 | i18n - docs translations (#19710) | ACCEPT | i18n-bulk |  |
| 1009 | `3e48be4c31` | #19711 | Update home card visuals and partner marketing assets (#19711) | ACCEPT | 2B-backend | other-only paths (no server/front files) — default 2B |
| 1010 | `c805a351ab` | #19702 | Reactivate disabled full tab widgets (#19702) | ACCEPT | 2C-frontend |  |
| 1011 | `f953aea3c5` | #19715 | i18n - translations (#19715) | ACCEPT | i18n-bulk |  |
| 1012 | `46ee72160d` | #19714 | Fix infinite recursion in iterator loop traversal when If/Else branch loops back to enclosing iterator (#19714) | ACCEPT | 2B-backend |  |
| 1013 | `2df32f7003` | #19700 | Hide fallback command menu items in edit mode (#19700) | ACCEPT | 2C-frontend |  |
| 1014 | `e12b55a951` | #19696 | Fix duplicate Fields widget (#19696) | ACCEPT | 2B-backend | mixed server/frontend — server lines=607 vs front lines=404 |
| 1015 | `7956ecc7b2` | #19717 | Invert pinned and dots icon buttons in command menu items edit mode (#19717) | ACCEPT | 2C-frontend |  |
| 1016 | `762fb6fd64` | #19664 | Fix active navigation item disambiguation (#19664) | ACCEPT | 2C-frontend |  |
| 1017 | `2fccd194f3` | #19560 | [Billing for self host] End dummy enterprise key validity  (#19560) | REJECT | reject | telemetry/phone-home (reject rule: Twenty endpoint egress) |
| 1018 | `94b8e34362` | #19545 | Object view widget - Introduce new TABLE_WIDGET view type (#19545) | ACCEPT | 2C-frontend | mixed server/frontend — front lines=100 vs server lines=36 |
| 1019 | `0c4a194c7a` | #19720 | i18n - translations (#19720) | ACCEPT | i18n-bulk |  |
| 1020 | `8a968d1e31` | #19718 | Hide workflow manual trigger from command menu on "Select All" (#19718) | ACCEPT | 2C-frontend | mixed server/frontend — front lines=21 vs server lines=2 |
| 1021 | `7601dbc218` | #19722 | i18n - translations (#19722) | ACCEPT | i18n-bulk |  |
| 1022 | `7ba5fe32f8` | #19723 | Add new html tags to the remote elements (#19723) | ACCEPT | 2B-backend | other-only paths (no server/front files) — default 2B |
| 1023 | `5e83ad43de` | #19687 | Update backfill page layout command (#19687) | ACCEPT | 2B-backend |  |
| 1024 | `8cb803cedf` | #19719 | Various bug fixes Record page layouts (#19719) | ACCEPT | 2C-frontend |  |
| 1025 | `a328c127f3` | #19724 | Fix standalone page migration failing on navigationMenuItem enum type change (#19724) | ACCEPT | 2B-backend |  |
| 1026 | `0f8152f536` | #19725 | Fix command menu item edit record selection dropdown icons (#19725) | ACCEPT | 2C-frontend |  |
| 1027 | `a4cc7fb9c5` | #19701 | `[Upgrade]` Fix workspace creation cursor (#19701) | ACCEPT | 2B-backend |  |
| 1028 | `3b85747d3f` | #19727 | Go back to the original command K button (#19727) | ACCEPT | 2C-frontend |  |
| 1029 | `725171bfd3` | #19729 | i18n - translations (#19729) | ACCEPT | i18n-bulk |  |
| 1030 | `56d6e13b5d` | #19726 | Fix fields widget flash during reset (#19726) | ACCEPT | 2C-frontend |  |
| 1031 | `b9605a3003` | #19712 | Refactor SnackBar duration handling and progress bar visibility logic (#19712) | ACCEPT | 2C-frontend |  |
| 1032 | `5eda10760c` | #19686 | Fix navbar folder opening lag by deferring navigation until expand animation completes (#19686) | ACCEPT | 2C-frontend |  |
| 1033 | `446c39d1c0` | #19698 | Fix silent failures in logic function route trigger execution (#19698) | ACCEPT | 2B-backend |  |
| 1034 | `cddc47b61f` | #19731 | i18n - translations (#19731) | ACCEPT | i18n-bulk |  |
| 1035 | `da8fe7f6f7` | #19732 | Homepage 3 cards finished (#19732) | ACCEPT | 2B-backend | other-only paths (no server/front files) — default 2B |
| 1036 | `6101a4f113` | #19736 | Update website hero to use shared local avatars and logos (#19736) | ACCEPT | 2B-backend | other-only paths (no server/front files) — default 2B |
| 1037 | `7adab8884b` | #19746 | Add isUnique update in query + invalidate cache on rollback (#19746) | ACCEPT | 2B-backend | mixed server/frontend — server lines=12 vs front lines=2 |
| 1038 | `e420ee8746` | #19751 | Release v1.22.0 for twenty-sdk, twenty-client-sdk, and create-twenty-app (#19751) | ACCEPT | 2B-backend | other-only paths (no server/front files) — default 2B |
| 1039 | `a49d8386aa` | #19743 | Fix calendar event "Not shared" content alignment and background (#19743) | ACCEPT | 2C-frontend |  |
| 1040 | `7ce3e2b065` | #19742 | Fix spacing between workspace domain cards (#19742) | ACCEPT | 2C-frontend |  |
| 1041 | `97832af778` | #19747 | [Website] Resolve animations breaking due to renderer context being lost. (#19747) | ACCEPT | 2B-backend | other-only paths (no server/front files) — default 2B |
| 1042 | `5583254f58` | #19752 | Remove workspace-migrations deadcode (#19752) | ACCEPT | 2B-backend |  |
| 1043 | `48c540eb6f` | #19721 | Add event forwarding stories to the front component renderer (#19721) | ACCEPT | 2B-backend | other-only paths (no server/front files) — default 2B |
| 1044 | `f5e8c05267` | #19753 | Add logs before and after instance slow data migration (#19753) | ACCEPT | 2B-backend |  |
| 1045 | `64470baa1e` | #19749 | fix compute folders to update util (#19749) | ACCEPT | 2B-backend |  |
| 1046 | `381f3ba7d9` | #19735 | Fix app design 1/2 (#19735) | ACCEPT | 2C-frontend | mixed server/frontend — front lines=2421 vs server lines=146 |
| 1047 | `60701c2cf9` | #19754 | i18n - translations (#19754) | ACCEPT | i18n-bulk |  |
| 1048 | `d54092b0e2` | #19679 | fix: add missing LayoutRenderingProvider in SettingsApplicationCustomTab (#19679) | ACCEPT | 2C-frontend |  |
| 1049 | `9beb1ca326` | #19734 | Support Select All for workflow manual triggers (#19734) | ACCEPT | 2C-frontend |  |
| 1050 | `7af82fb6a4` | #19758 | i18n - translations (#19758) | ACCEPT | i18n-bulk |  |
| 1051 | `2b5b8a8b13` | #19706 | Link command menu items to specific page layout (#19706) | ACCEPT | 2B-backend | mixed server/frontend — server lines=265 vs front lines=110 |
| 1052 | `2413af0ba9` | #19757 | `[run-instance-commands]` Preserve `fast` `slow` sequentiality (#19757) | ACCEPT | 2B-backend |  |
| 1053 | `270069c3e3` | #19750 | Add search to Fields dropdown (#19750) | ACCEPT | 2C-frontend |  |
| 1054 | `c0fef0be08` | #19762 | i18n - translations (#19762) | ACCEPT | i18n-bulk |  |
| 1055 | `cd31d9e0de` | #19760 | Add test tab to tool step (#19760) | ACCEPT | 2C-frontend | mixed server/frontend — front lines=197 vs server lines=15 |
| 1056 | `9bc803d0c7` | #19765 | i18n - translations (#19765) | ACCEPT | i18n-bulk |  |
| 1057 | `cb6953abe3` | #19755 | fix(server): make OAuth discovery and MCP auth metadata host-aware (#19755) | ACCEPT | 2A-security |  |
| 1058 | `d3df58046c` | #19768 | chore(server): drop api-host branch in OAuth discovery (#19768) | ACCEPT | 2A-security |  |
| 1059 | `4103efcb84` | #19771 | fix: replace slow `deep-equal` with `fastDeepEqual` to resolve CPU bottleneck (#19771) | ACCEPT | 2B-backend |  |
| 1060 | `4f4f723ed0` | #19766 | Fix MCP discovery: path-aware well-known URL and protocol version (#19766) | ACCEPT | 2B-backend |  |
| 1061 | `446a3923f2` | #19764 | Add workspace id in job logs (#19764) | ACCEPT | 2B-backend |  |
| 1062 | `aecbc89a3f` | #19770 | Fix slow db query issue (#19770) | ACCEPT | 2B-backend |  |
| 1063 | `bf410ae438` | #19584 | `upgrade:status` command (#19584) | ACCEPT | 2B-backend |  |
| 1064 | `75235f4621` | #19767 | Validate `universalIdentifier` uniqueness among application and its dependencies (#19767) | ACCEPT | 2B-backend |  |
| 1065 | `d7453303b8` | #19782 | chore: sync AI model catalog from models.dev (#19782) | ACCEPT | 2B-backend |  |
| 1066 | `fcba0ca30a` | #19763 | Add search to add column dropdown (#19763) | ACCEPT | 2C-frontend |  |
| 1067 | `ba1195d92e` | #19784 | i18n - translations (#19784) | ACCEPT | i18n-bulk |  |
| 1068 | `b31f84fbb8` | #19786 | fix(server): workspace member permissions and profile onboarding (#19786) | ACCEPT | 2B-backend |  |
| 1069 | `70603a1af6` |  | Fix | ACCEPT | 2C-frontend |  |
| 1070 | `7aa60fd20b` |  | Revert "Fix" | ACCEPT | 2C-frontend |  |
| 1071 | `76ea0f37ed` | #19787 | Surface structured validation errors during application install (#19787) | ACCEPT | 2B-backend |  |
| 1072 | `5cd8b7899d` | #19774 | shouldIncludeRecordPageLayouts deprecation (#19774) | ACCEPT | 2B-backend | mixed server/frontend — server lines=132 vs front lines=5 |
| 1073 | `beeb8b7406` | #19792 | chore: move pageLayoutWidget.conditionalAvailabilityExpression migration to 1.23 fast instance command (#19792) | ACCEPT | 2B-backend |  |
| 1074 | `a93f23a150` | #19794 | Fix AI chat dropzone persisting when dragging file out without dropping (#19794) | ACCEPT | 2C-frontend |  |
| 1075 | `bb464b2ffb` | #19783 | Forbid other app role extension (#19783) | DEFER | 2D-flags-rbac | RBAC/permissions stack change (wave 2D) |
| 1076 | `f94ee2d495` | #19795 | i18n - translations (#19795) | ACCEPT | i18n-bulk |  |
| 1077 | `e70269b9d3` | #19796 | Fix: aggregate Calculate not updating in dashboard Table widgets (#19796) | ACCEPT | 2C-frontend |  |
| 1078 | `4ed6fcd19e` | #19797 | chore: move TABLE_WIDGET view type migration to 1.23 fast instance command (#19797) | ACCEPT | 2B-backend |  |
| 1079 | `68746e22a0` | #19756 | Send Email Tool: Don't persist message on SMTP only connections (#19756) | ACCEPT | 2B-backend |  |
| 1080 | `3268a86f4b` | #19799 | Skip backfill record page layouts for missing standard objects (#19799) | ACCEPT | 2B-backend |  |
| 1081 | `120ced44a9` | #19803 | Fix app design 4 (#19803) | ACCEPT | 2C-frontend |  |
| 1082 | `47a742fd01` | #19805 | i18n - translations (#19805) | ACCEPT | i18n-bulk |  |
| 1083 | `0cb50f8a9d` | #19806 | Fix indexFieldMetadata select missing workspaceId (#19806) | ACCEPT | 2B-backend |  |
| 1084 | `6095798434` | #19813 | Add SVG export and refine halftone studio controls (#19813) | ACCEPT | 2B-backend | other-only paths (no server/front files) — default 2B |
| 1085 | `a18840f3cd` | #19811 | Fix deactivated tabs not visible in new tab action (#19811) | ACCEPT | 2C-frontend |  |
| 1086 | `ce2a0bfbe5` | #19812 | fix: socket.io allows an unbounded number of binary attachments (#19812) | ACCEPT | 2B-backend | other-only paths (no server/front files) — default 2B |
| 1087 | `619ea13649` | #19804 | Twenty for twenty app (#19804) | ACCEPT | 2A-security |  |
| 1088 | `df9c4e26b5` | #19814 | Disable reset to default when custom tab or widget (#19814) | ACCEPT | 2C-frontend | mixed server/frontend — front lines=258 vs server lines=3 |
| 1089 | `b8f8892b67` | #19817 | i18n - translations (#19817) | ACCEPT | i18n-bulk |  |
| 1090 | `b320de966c` | #19800 | Add reset page layout in record page layout edit mode tab (#19800) | ACCEPT | 2C-frontend |  |
| 1091 | `9307c718cf` | #19816 | Add twenty-managed Docker target with AWS CLI for EKS deployments (#19816) | ACCEPT | 2B-backend | other-only paths (no server/front files) — default 2B |
| 1092 | `4a5702328a` | #19819 | i18n - translations (#19819) | ACCEPT | i18n-bulk |  |
| 1093 | `13b32a22b6` | #19818 | Add page layout tab icon picker (#19818) | ACCEPT | 2C-frontend |  |
| 1094 | `38a03abc06` | #19820 | Fix app design 5 (#19820) | ACCEPT | 2C-frontend |  |
| 1095 | `ab85946102` | #19821 | i18n - translations (#19821) | ACCEPT | i18n-bulk |  |
| 1096 | `59e4ed715a` | #19775 | fix(server): normalize empty composite phone sub-fields to NULL (#19775) | ACCEPT | 2B-backend |  |
| 1097 | `3eeaebb0cc` | #19822 | fix(server): make `workspace:seed:dev --light` actually seed only one workspace (#19822) | ACCEPT | 2B-backend |  |
| 1098 | `fb5a1988b1` | #19823 | fix(server): log inner errors of WorkspaceMigrationRunnerException in workspace iterator (#19823) | ACCEPT | 2B-backend |  |
| 1099 | `e878d646ed` | #19826 | chore(server): bump logic-function executor lambda memory to 512MB (#19826) | ACCEPT | 2B-backend |  |
| 1100 | `4fa2c400c0` | #19825 | fix(server): skip standard page layout widgets referencing missing field metadatas during 1.23 backfill (#19825) | ACCEPT | 2B-backend |  |
| 1101 | `b292a93376` | #19824 | fix(server): honor X-Forwarded-* via configurable trust proxy (#19824) | ACCEPT | 2B-backend |  |
| 1102 | `768469f2bd` | #19828 | chore: sync AI model catalog from models.dev (#19828) | ACCEPT | 2B-backend |  |
| 1103 | `1d575f0496` | #19829 | fix oauth permission check (#19829) | ACCEPT | 2A-security |  |
| 1104 | `70a73534c0` | #19830 | perf(server): reuse ESM module cache across warm Lambda invocations of logic functions (#19830) | ACCEPT | 2B-backend |  |
| 1105 | `fd495ee61b` | #19832 | fix(server): deliver user-scoped metadata events only to the owning user (#19832) | ACCEPT | 2B-backend |  |
| 1106 | `eb1ca1b9ec` | #19834 | perf(sdk): split twenty-sdk barrel into per-purpose subpaths to cut logic-function bundle ~700x (#19834) | ACCEPT | 2B-backend |  |
| 1107 | `4c94699376` | #19841 | Bump twenty-sdk, twenty-client-sdk, create-twenty-app to 1.23.0-canary.1 (#19841) | ACCEPT | 2B-backend | other-only paths (no server/front files) — default 2B |
| 1108 | `c28c20143b` | #19831 | refactor(server): rename Agent exception to Ai; add THREAD_NOT_FOUND / MESSAGE_NOT_FOUND codes (fixes 500s) (#19831) | ACCEPT | 2B-backend |  |
| 1109 | `be9616db60` | #19842 | chore: remove draft email feature flag (#19842) | DEFER | 2D-flags-rbac | feature-flag enum location/RBAC stack (wave 2D) |
| 1110 | `1c54e79d6c` | #19843 | i18n - translations (#19843) | ACCEPT | i18n-bulk |  |
| 1111 | `53d22a3b70` | #19840 | fix(server): require PKCE code_challenge for public OAuth clients (#19840) | ACCEPT | 2A-security |  |
| 1112 | `3292f1758e` | #19844 | i18n - translations (#19844) | ACCEPT | i18n-bulk |  |
| 1113 | `5223c4771d` | #19838 | fix(server): align OAuth discovery metadata with MCP / RFC 9728 spec (#19838) | ACCEPT | 2A-security |  |
| 1114 | `1f3defa7b3` | #19836 | fix(server): expose WWW-Authenticate header for browser-based MCP clients (#19836) | ACCEPT | 2B-backend |  |
| 1115 | `066003cb04` | #19846 | Hero 2.0 (#19846) | ACCEPT | 2B-backend | other-only paths (no server/front files) — default 2B |
| 1116 | `dbf43d792c` | #19835 | [Website] Fix testimonials shape, diamond direction, and integrate partner application form. (#19835) | ACCEPT | 2B-backend | other-only paths (no server/front files) — default 2B |
| 1117 | `1e27c3b621` | #19845 | fix: correct sSOService → ssoService camelCase typo (#19845) | ACCEPT | 2B-backend |  |
| 1118 | `6117a1d6c0` | #19837 | refactor: standardize AI acronym to Ai (PascalCase) across internal identifiers (#19837) | ACCEPT | 2C-frontend | mixed server/frontend — front lines=924 vs server lines=175 |
| 1119 | `90661cc821` | #19851 | i18n - translations (#19851) | ACCEPT | i18n-bulk |  |
| 1120 | `75848ff8ea` | #19852 | feat: move admin panel to dedicated /admin-panel GraphQL endpoint (#19852) | ACCEPT | 2A-security |  |
| 1121 | `46aedcf133` | #19866 | chore: sync AI model catalog from models.dev (#19866) | ACCEPT | 2B-backend |  |
| 1122 | `0729ad27b7` | #19862 | Partners, customers and more (#19862) | ACCEPT | 2B-backend | other-only paths (no server/front files) — default 2B |
| 1123 | `42f57db005` | #19858 | fix(server): add registration_client_uri to DCR response for Claude.ai connector (#19858) | ACCEPT | 2B-backend |  |
| 1124 | `5dd7eba911` | #19827 | Fix app design 6 (#19827) | ACCEPT | 2C-frontend | mixed server/frontend — front lines=2226 vs server lines=17 |
| 1125 | `903ae5cb09` | #19869 | i18n - translations (#19869) | ACCEPT | i18n-bulk |  |
| 1126 | `e68842c268` | #19867 | Billing - fixes (#19867) | ACCEPT | 2C-frontend | mixed server/frontend — front lines=416 vs server lines=93 |
| 1127 | `e4d8cbdb39` | #19873 | i18n - translations (#19873) | ACCEPT | i18n-bulk |  |
| 1128 | `01928fc786` | #19874 | i18n - docs translations (#19874) | ACCEPT | i18n-bulk |  |
| 1129 | `de1e592cd3` | #19875 | fix(front): suppress full-page skeleton inside auth modal (#19875) | ACCEPT | 2C-frontend |  |
| 1130 | `fd2288bfff` | #19870 | fix: prototype pollution via parse in nodejs flatted (#19870) | ACCEPT | 2A-security |  |
| 1131 | `f9768d057e` | #19880 | i18n - docs translations (#19880) | ACCEPT | i18n-bulk |  |
| 1132 | `5c2a0cf115` | #19878 | fix(front): gate renewToken Apollo logger on IS_DEBUG_MODE (#19878) | ACCEPT | 2C-frontend |  |
| 1133 | `10c49a49c4` | #19881 | feat(sdk): support viewSorts in app manifests (#19881) | ACCEPT | 2B-backend |  |
| 1134 | `ade55e293f` | #19868 | fix 1.22 upgrade command add-workspace-id-to-indirect-entities (#19868) | ACCEPT | 2B-backend |  |
| 1135 | `c959998111` | #19883 | Bump twenty-sdk, twenty-client-sdk, create-twenty-app to 1.23.0-canary.9 (#19883) | ACCEPT | 2B-backend | other-only paths (no server/front files) — default 2B |
| 1136 | `9f5688ab13` | #19882 | Redesign why-twenty page with three-section narrative (#19882) | ACCEPT | 2B-backend | other-only paths (no server/front files) — default 2B |
| 1137 | `117909e10a` | #19886 | Billing - Adapt to new unit (#19886) | ACCEPT | 2B-backend | mixed server/frontend — server lines=30 vs front lines=8 |
| 1138 | `4ecde0e161` | #19888 | i18n - translations (#19888) | ACCEPT | i18n-bulk |  |
| 1139 | `13c4a71594` | #19884 | fix(ui): make CardPicker hover cover the whole card and align content left (#19884) | ACCEPT | 2C-frontend |  |
| 1140 | `b140f70260` | #19887 | Website - Plan pricing update (#19887) | ACCEPT | 2B-backend | other-only paths (no server/front files) — default 2B |
| 1141 | `27e1caf9cc` | #19891 | Cleanup files that were committed with website PR, but should not be there. (#19891) | ACCEPT | 2B-backend | other-only paths (no server/front files) — default 2B |
| 1142 | `9a95cd02ed` | #19892 | Fix applications query cartesian product causing read timeouts (#19892) | ACCEPT | 2B-backend |  |
| 1143 | `6d3ff4c9ce` | #19890 | Translate standard page layouts (#19890) | ACCEPT | 2B-backend | mixed server/frontend — server lines=593 vs front lines=51 |
| 1144 | `755f1c92d1` | #19893 | i18n - translations (#19893) | ACCEPT | i18n-bulk |  |
| 1145 | `83bc6d1a1b` | #19894 | [Website] Self-host billing migration and some responsiveness fixes. (#19894) | ACCEPT | 2B-backend | other-only paths (no server/front files) — default 2B |
| 1146 | `13afef5d1d` | #19896 | fix(server): scope loadingMessage wrap/strip to AI-chat callers (#19896) | ACCEPT | 2B-backend |  |
| 1147 | `9a963ddeca` | #19901 | feat(infra): add Dockerfile for twenty-website-new (#19901) | ACCEPT | 2B-backend | other-only paths (no server/front files) — default 2B |
| 1148 | `96fc98e710` | #19897 | Fix Apps UI: replace 'Managed' label with actual app name and unify app icons (#19897) | ACCEPT | 2C-frontend | mixed server/frontend — front lines=807 vs server lines=36 |
| 1149 | `a174aff5c8` | #19902 | fix(infra): copy nx.json and tsconfig.base.json into website-new image (#19902) | ACCEPT | 2B-backend | other-only paths (no server/front files) — default 2B |
| 1150 | `57de05ea74` | #19903 | i18n - translations (#19903) | ACCEPT | i18n-bulk |  |
| 1151 | `1b469168c8` | #19904 | chore(workflow): temporarily lift credit-cap gate on workflow steps (#19904) | ACCEPT | 2B-backend |  |
| 1152 | `192a842f57` | #19905 | fix(website-new): pre-resolve wyw-in-js babel presets to absolute paths (#19905) | ACCEPT | 2B-backend | other-only paths (no server/front files) — default 2B |
| 1153 | `5c58254eb4` | #19898 | Fix activity relation picker (#19898) | ACCEPT | 2C-frontend |  |
| 1154 | `b4f996e0c4` | #19906 | Release v1.23.0 for twenty-sdk, twenty-client-sdk, and create-twenty-app (#19906) | ACCEPT | 2B-backend | other-only paths (no server/front files) — default 2B |
| 1155 | `41ee6eac7a` | #19907 | chore(server): bump current version to 2.0.0 and add 2.1.0 as next (#19907) | ACCEPT | 2B-backend |  |
| 1156 | `0adaf8aa7b` | #19908 | docs: use twenty-sdk/define subpath in docs and website demo (#19908) | ACCEPT | 2B-backend | other-only paths (no server/front files) — default 2B |
| 1157 | `dc50dbdb20` | #19909 | i18n - docs translations (#19909) | ACCEPT | i18n-bulk |  |
| 1158 | `6ef15713b1` | #19910 | Release v2.0.0 for twenty-sdk, twenty-client-sdk, and create-twenty-app (#19910) | ACCEPT | 2B-backend | other-only paths (no server/front files) — default 2B |
| 1159 | `3ee1b528a1` | #19895 | Website last fixes (#19895) | ACCEPT | 2B-backend | other-only paths (no server/front files) — default 2B |
| 1160 | `e1c200527d` | #19913 | fix: pricing card cutoff on website (#19913) | ACCEPT | 2B-backend | other-only paths (no server/front files) — default 2B |
| 1161 | `34e3b1b90b` | #19911 | feat(website-new): add robots.txt, sitemap.xml and legacy redirects (#19911) | ACCEPT | 2B-backend | other-only paths (no server/front files) — default 2B |
| 1162 | `8d24551e71` | #19912 | fix(settings): force display "Standard" and "Custom" for app chips (#19912) | ACCEPT | 2C-frontend |  |
| 1163 | `4fd80ee470` | #19915 | i18n - translations (#19915) | ACCEPT | i18n-bulk |  |
| 1164 | `a8d4039629` | #19914 | chore: sync AI model catalog from models.dev (#19914) | ACCEPT | 2B-backend |  |
| 1165 | `a1de37e424` | #19872 | Fix Email composer rich text to HTML conversion  (#19872) | ACCEPT | 2B-backend | mixed server/frontend — server lines=114 vs front lines=6 |
| 1166 | `5d438bb70c` | #19728 | Docs: restructure navigation, add halftone illustrations, clean up hero images (#19728) | ACCEPT | 2B-backend |  |
| 1167 | `4f88aab57f` | #19917 | chore(website-new): reword FAQ copy on hosting and Organization plan (#19917) | ACCEPT | 2B-backend | other-only paths (no server/front files) — default 2B |
| 1168 | `69868a0ab6` | #19919 | docs: remove alpha warning from apps pages except skills & agents (#19919) | ACCEPT | 2B-backend | other-only paths (no server/front files) — default 2B |
| 1169 | `30b8663a74` | #19916 | chore: remove IS_AI_ENABLED feature flag (#19916) | DEFER | 2D-flags-rbac | feature-flag enum location/RBAC stack (wave 2D) |
| 1170 | `e3d7d0199d` | #19849 | Fix side panel hotkeys breaking when opening records from table (#19849) | ACCEPT | 2C-frontend |  |
| 1171 | `071980d511` | #19749 | Revert "fix compute folders to update util (#19749)" (#19921) | ACCEPT | 2B-backend |  |
| 1172 | `15938c1fca` | #19923 | Add 2.0.0 release changelog (#19923) | ACCEPT | 2B-backend | other-only paths (no server/front files) — default 2B |
| 1173 | `cd73088be6` | #19925 | i18n - docs translations (#19925) | ACCEPT | i18n-bulk |  |
| 1174 | `a583ee405b` | #19926 | Cross version and upgrade status docs (#19926) | ACCEPT | 2B-backend | other-only paths (no server/front files) — default 2B |
| 1175 | `1db242d399` | #19918 | Website - small fixes (#19918) | ACCEPT | 2B-backend | other-only paths (no server/front files) — default 2B |
| 1176 | `8cdd2a3319` | #19928 | i18n - docs translations (#19928) | ACCEPT | i18n-bulk |  |
| 1177 | `62ea14a072` | #19929 | fix email workflow (#19929) | ACCEPT | 2B-backend |  |
| 1178 | `65e01400c0` | #19932 | Cross version ci placeholder (#19932) | ACCEPT | 2A-security |  |
| 1179 | `44ba7725ae` | #19934 | i18n - docs translations (#19934) | ACCEPT | i18n-bulk |  |
| 1180 | `2b399fc94e` | #19920 | [Website] Fix flickering of faq illustration. (#19920) | ACCEPT | 2B-backend | other-only paths (no server/front files) — default 2B |
| 1181 | `7947b1b843` | #19930 | Fix self-hosting pricing page design. (#19930) | ACCEPT | 2B-backend | other-only paths (no server/front files) — default 2B |
| 1182 | `61fdb613e6` | #19931 | Reset default app packages command (#19931) | ACCEPT | 2B-backend |  |
| 1183 | `8f34a02fea` | #19938 | Import - Fix (#19938) | ACCEPT | 2C-frontend |  |
| 1184 | `8bb98c309a` | #19939 | i18n - docs translations (#19939) | ACCEPT | i18n-bulk |  |
| 1185 | `3eabdf302e` | #19936 | Allow closing navbar folder while viewing an active child item (#19936) | ACCEPT | 2C-frontend |  |
| 1186 | `a7b10b281c` | #19935 | Optimize 3d models (#19935) | ACCEPT | 2B-backend | other-only paths (no server/front files) — default 2B |
| 1187 | `a2099d22b5` | #19933 | Optimize website images (#19933) | ACCEPT | 2B-backend | other-only paths (no server/front files) — default 2B |
| 1188 | `76582dc04a` | #19937 | Export generateDefaultFieldUniversalIdentifier from SDK (#19937) | ACCEPT | 2B-backend | other-only paths (no server/front files) — default 2B |
| 1189 | `66857ca77b` | #19940 | Remove cross version upgrade placeholder (#19940) | ACCEPT | 2A-security |  |
| 1190 | `0aaffe3212` | #19943 | i18n - docs translations (#19943) | ACCEPT | i18n-bulk |  |
| 1191 | `f19b3bfd38` | #19759 | Fix left/right arrow keys not working in dropdown search inputs (#19759) | ACCEPT | 2C-frontend |  |
| 1192 | `92c8965dd3` | #19944 | i18n - docs translations (#19944) | ACCEPT | i18n-bulk |  |
| 1193 | `2a6fed5f5f` | #19948 | i18n - docs translations (#19948) | ACCEPT | i18n-bulk |  |
| 1194 | `b77c65946f` | #19952 | i18n - docs translations (#19952) | ACCEPT | i18n-bulk |  |
| 1195 | `11fd3bd6ee` | #19954 | i18n - docs translations (#19954) | ACCEPT | i18n-bulk |  |
| 1196 | `800d0f28ff` | #19955 | i18n - docs translations (#19955) | ACCEPT | i18n-bulk |  |
| 1197 | `40b1cdaba6` | #19956 | i18n - docs translations (#19956) | ACCEPT | i18n-bulk |  |
| 1198 | `710e3e2dfe` | #19957 | i18n - docs translations (#19957) | ACCEPT | i18n-bulk |  |
| 1199 | `e184732af4` | #19958 | i18n - docs translations (#19958) | ACCEPT | i18n-bulk |  |
| 1200 | `3d164640c8` | #19959 | Remove Product Hunt banner section (#19959) | ACCEPT | 2B-backend | other-only paths (no server/front files) — default 2B |
| 1201 | `b77c44fd20` | #19960 | refactor(tool-provider): dedupe descriptor/generator paths (#19960) | ACCEPT | 2B-backend |  |
| 1202 | `66a68d8e1c` | #19967 | i18n - docs translations (#19967) | ACCEPT | i18n-bulk |  |
| 1203 | `2a5d5b36db` | #19962 | refactor(tool-provider): kill execute_tool's dual dispatch (#19962) | ACCEPT | 2B-backend |  |
| 1204 | `44309a6fd9` | #19966 | refactor(tool-provider): rename NativeModelToolProvider to NativeToolBinderService (#19966) | ACCEPT | 2B-backend |  |
| 1205 | `a486ead39d` | #19968 | fix: restore Try Twenty button text visibility on docs navbar (#19968) | ACCEPT | 2B-backend | other-only paths (no server/front files) — default 2B |
| 1206 | `f018f17133` | #19970 | i18n - docs translations (#19970) | ACCEPT | i18n-bulk |  |
| 1207 | `0c929e7903` | #19969 | refactor(tool-provider): rename web_search to exa_web_search, drop XOR toggle (#19969) | ACCEPT | 2B-backend | mixed server/frontend — server lines=112 vs front lines=24 |
| 1208 | `68d509e98d` | #19964 | Update settings application illustrations and app metadata previews (#19964) | ACCEPT | 2C-frontend | mixed server/frontend — front lines=410 vs server lines=6 |
| 1209 | `789f8aba5d` | #19975 | i18n - translations (#19975) | ACCEPT | i18n-bulk |  |
| 1210 | `c2cf3eac50` | #19947 | feat(sdk): confirm authentication method on remote add (#19947) | ACCEPT | 2B-backend | other-only paths (no server/front files) — default 2B |
| 1211 | `b010599000` | #19946 | fix(server): preserve kanban/calendar fields in view manifest sync (#19946) | ACCEPT | 2B-backend |  |
| 1212 | `f0a625c3f8` | #19981 | Cleanup application and app registration test util (#19981) | ACCEPT | 2B-backend |  |
| 1213 | `f34ba6ac12` | #19983 | i18n - docs translations (#19983) | ACCEPT | i18n-bulk |  |
| 1214 | `32e0425a65` | #19976 | Docs - Update getting started (#19976) | ACCEPT | 2B-backend | other-only paths (no server/front files) — default 2B |
| 1215 | `0696290af4` | #19984 | fix(page-layout): hide deactivated fields from FIELDS widget and layout editor (#19984) | ACCEPT | 2C-frontend |  |
| 1216 | `921a0f01c8` | #19982 | Forbid permissions update cross app role retarget (#19982) | DEFER | 2D-flags-rbac | RBAC/permissions stack change (wave 2D) |
| 1217 | `f30ef2432f` | #19987 | i18n - translations (#19987) | ACCEPT | i18n-bulk |  |
| 1218 | `3ebeb3a3e8` | #19961 | feat(community): add github-connector example app (#19961) | ACCEPT | 2B-backend | other-only paths (no server/front files) — default 2B |
| 1219 | `0d996a5629` | #19986 | Resend app improvements (#19986) | ACCEPT | 2A-security |  |
| 1220 | `876214bc1d` | #19977 | scaffold record page layout + fields view when adding an object (#19977) | ACCEPT | 2B-backend |  |
| 1221 | `39831338f7` | #19988 | i18n - translations (#19988) | ACCEPT | i18n-bulk |  |
| 1222 | `80e8f6d516` | #19997 | chore(deps): bump @blocknote/server-util from 0.47.1 to 0.47.3 (#19997) | ACCEPT | 2C-frontend | mixed server/frontend — front lines=8 vs server lines=2 |
