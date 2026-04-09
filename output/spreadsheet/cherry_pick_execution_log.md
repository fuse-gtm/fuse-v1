# Cherry-Pick Execution Log

Branch: `codex/upstream-wave1-security`

| Order | Chunk | SHA | Subject | Status | Notes |
| --- | --- | --- | --- | --- | --- |
| 1 | 1A-01 | `aeedcf3353` | Enable password reset from app.twenty.com with workspace fallback (#18271) | applied | Cherry-picked cleanly as `2ddb9a8183` |
| 2 | 1A-01 | `38ad0820c0` | Fix server logs leak (#18423) | applied | Resolved a small import-path conflict; cherry-picked as `e3aa8d2ca7` |
| 3 | 1A-01 | `ef003fb929` | fix blocklist (#18332) | applied | Resolved two hook conflicts by porting upstream auth-context checks; cherry-picked as `9d15cfade0` |
| 4 | 1A-01 | `d825ac06dd` | fix server production build (#18458) | applied | Cherry-picked cleanly as `2b66db3346` |
| 5 | 1A-01 | `05c2da2d0f` | Improve SSRF IP validation and add protocol allowlist (#18518) | applied | Cherry-picked cleanly as `3d283a6c7d` |
| 6 | 1A-01 | `d9b3507866` | Run vulnerable operation in isolated environment (#18523) | applied | Resolved a stale import conflict in `lambda.driver.ts`; cherry-picked as `8842de9281` |
| 7 | 1A-01 | `f0c83434a7` | feat: default code interpreter and logic function to Disabled in production (#18559) | applied | Cherry-picked cleanly as `24cf0755f9` |
| 8 | 1A-01 | `b1a7c5c4d6` | Fix null connectedAccount crash in blocklist message deletion job (#18723) | applied | Cherry-picked cleanly as `ee3075eeb8` |
| 9 | 1A-02 | `b6c62b3812` | fix(auth): use dynamic SSE headers and add token renewal retry logic (#18706) | applied | Resolved three frontend auth/SSE conflicts by porting behavior into Fuse’s existing Apollo stack; cherry-picked as `af6f949a6b` |
| 10 | 1A-02 | `0a6b514898` | fix: remove redundant cookie write that made tokenPair a session cookie (#18795) | applied | Cherry-picked cleanly as `7902550e29` |
| 11 | 1A-02 | `1a0588d233` | fix: auto-retry Microsoft OAuth on AADSTS650051 race condition (#18405) | applied | Cherry-picked cleanly as `ead7af99e8` |
| 12 | 1A-02 | `6f4f7a1198` | fix: add security headers to file serving endpoints to prevent stored XSS (#18857) | applied | Ported file-response header hardening and kept deleted upstream-only files deleted; cherry-picked as `a519770966` |
| 13 | 1A-02 | `bf22373315` | Fix: use user role for OAuth tokens bearing user context (#18954) | applied | Cherry-picked cleanly as `69ffa5e42b` |
| 14 | 1A-02 | `08077476f3` | fix: remove remaining direct cookie writes that make tokenPair a session cookie on renewal (#19031) | applied | Resolved useAgentChat.ts conflict (removed cookieStorage import, accepted new function signature); cherry-picked as `260ab35bfc` |
| 15 | 1A-02 | `2ebff5f4d7` | fix: harden token renewal and soften refresh token revocation (#19175) | applied | Resolved apollo.factory.ts (added rxjs import, replaced fromPromise with from/switchMap) and test file (softened assertion); cherry-picked as `eb799b1c8e` |
| 16 | 1A-02 | `c521ba29be` | fix: CalDAV sync broken by SSRF hostname replacement (#19291) | applied | Cherry-picked cleanly as `2219c807f9` |
| 17 | 1A-03 | `8da69e0f77` | Fix stored XSS via unsafe URL protocols in href attributes (#19282) | applied | Resolved 6 conflicts: added getSafeUrl/isSafeUrl to twenty-shared, accepted upstream security additions for rich-text validator, InformationBannerMaintenance, oxlintrc; dropped ensureAbsoluteUrl export (file not present); cherry-picked as `893cf3c87d` |
| 18 | 1B-01 | `e6f1bdd1c8` | fix: yauzl contains an off-by-one error (#18662) | applied | Cherry-picked with -Xtheirs for yarn.lock as `e560700133` |
| 19 | 1B-01 | `1b20bdaf6d` | fix: @isaacs/brace-expansion has uncontrolled resource consumption (#18660) | applied | Cherry-picked with -Xtheirs as `03ccf3fb54` |
| 20 | 1B-01 | `87c519b72f` | fix: multer vulnerable to denial of service via uncontrolled recursion (#18659) | applied | Cherry-picked with -Xtheirs as `c47115d91d` |
| 21 | 1B-01 | `2c2f66b584` | fix: DOMPurify contains a cross-site scripting vulnerability (#18665) | applied | Cherry-picked with -Xtheirs as `800a2a3d92` |
| 22 | 1B-01 | `6e36ad9fa2` | fix: mailparser vulnerable to cross-site scripting (#18664) | applied | Cherry-picked with -Xtheirs as `e3ba08d02e` |
| 23 | 1B-01 | `36dece43c7` | Fix: Upgrade Nodemailer to address SMTP command injection vulnerability (#19151) | applied | Cherry-picked with -Xtheirs as `c80946439f` |
| 24 | 1B-01 | `2ae6a9bb98` | fix: bump handlebars to 4.7.9 (CVE-2026-33937) (#19288) | applied | Cherry-picked with -Xtheirs as `3189d14b63` |
| 25 | 1B-01 | `8c9228cb2b` | fix: SVGO DoS through entity expansion in DOCTYPE (#19359) | applied | Cherry-picked with -Xtheirs as `b2342ec35a` |
| 26 | 1B-02 | `68cd2f6d61` | fix: node-tar symlink path traversal via drive-relative linkpath (#19360) | applied | Cherry-picked with -Xtheirs as `9e65dba080` |
| -- | -- | -- | chore: regenerate yarn.lock after Wave 1B dependency patches | applied | yarn install to ensure lockfile consistency; committed as `1de40498f9` |
| -- | -- | -- | fix: resolve typecheck regressions from Wave 1 cherry-picks | applied | Apollo factory rxjs→fromPromise, AgentChatProvider stub arg, remove dead InformationBannerMaintenance; committed as `ad449a0bb8` |

## Ship Status

- **PR**: https://github.com/fuse-gtm/fuse-v1/pull/4
- **State**: OPEN, MERGEABLE
- **Branch**: `codex/upstream-wave1-security` → `main`
- **Commits**: 28 (26 cherry-picks + 1 yarn.lock regen + 1 typecheck fix)
- **Changed files**: 148 (+4,405 / -857)
- **Typecheck**: twenty-front PASS, twenty-server 0 new regressions
- **Date shipped**: 2026-04-07
