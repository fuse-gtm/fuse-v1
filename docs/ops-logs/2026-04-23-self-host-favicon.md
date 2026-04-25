# Self-hosted favicon service deploy runbook

- Date: 2026-04-23
- Service: `https://icons.fusegtm.com`
- Host: EC2 `52.20.136.71` (Fuse prod), docker-compose + Caddy
- Owner: founder (DNS + Caddy edits are manual)

## Why

Stops the Fuse app from phoning home to `https://twenty-icons.com` to render
company and link favicons. Every company URL in the CRM currently leaks as
a GET path to a third-party edge (Cloudflare in front of the Twenty-owned
favicon NestJS service). Sovereignty charter forbids this — we now host
the same open-source service on our own EC2 under `icons.fusegtm.com`.

Upstream: https://github.com/twentyhq/favicon (NestJS + Sharp, port 3000,
local filesystem cache). There is **no published Docker image** (verified
by inspecting Docker Hub and GHCR on 2026-04-23), so the compose file
builds from a pinned commit via remote build context.

## What ships in the PR

- `packages/twenty-docker/docker-compose.yml` — new `twenty-icons` service,
  built from upstream source at commit `fac390abfb324bcdcc2afa4ea9b1261ca358a628`,
  mounts a `twenty-icons-cache` named volume, exposes port 3000 internally
  only.
- `packages/twenty-shared/src/constants/TwentyIconsBaseUrl.ts` — default
  now `https://icons.fusegtm.com`, with an isomorphic runtime override via
  `REACT_APP_ICONS_BASE_URL` (read from `window._env_` on the browser and
  `process.env` on the server).
- `packages/twenty-shared/src/utils/image/getLogoUrlFromDomainName.ts` —
  now reads from the constant instead of a hardcoded literal.
- `packages/twenty-shared/src/utils/image/__tests__/getLogoUrlFromDomainName.test.ts`
  — pins the base URL via `jest.mock` so test assertions are stable.
- `packages/twenty-front/src/modules/object-metadata/hooks/__tests__/useGetObjectRecordIdentifierByNameSingular.test.tsx`
  — assertion rewritten from `https://twenty-icons.com/...` to the Fuse host.

## Pre-deploy checks (already green on the PR branch)

- `npx nx test twenty-shared` passes.
- `npx nx typecheck twenty-shared` passes.
- `npx nx lint:diff-with-main twenty-shared` clean.
- `docker compose -f packages/twenty-docker/docker-compose.yml config` parses.

## Deploy steps (founder-driven, in order)

### 1. DNS

On the Fuse DNS provider (Route 53 — same hosted zone as `app.fusegtm.com`):

```
Type: A
Name: icons.fusegtm.com
Value: 52.20.136.71
TTL: 300
```

Wait for propagation: `dig +short icons.fusegtm.com` should return `52.20.136.71`.

### 2. Caddy site block

SSH to `52.20.136.71` and append to `/etc/caddy/Caddyfile` (or equivalent
sourced file — match the existing `app.fusegtm.com` block):

```caddy
icons.fusegtm.com {
    encode zstd gzip

    # Reverse-proxy to the internal compose service. The container name
    # `twenty-icons` resolves via Docker's embedded DNS when Caddy shares
    # the compose network. If Caddy is on the host (systemd), use
    # the host loopback + mapped port instead — in that case, add a
    # `ports: ["127.0.0.1:3001:3000"]` mapping to the twenty-icons service
    # and proxy to 127.0.0.1:3001.
    reverse_proxy twenty-icons:3000

    # Favicons are effectively immutable per-domain for the cache window,
    # let the browser hold them.
    header Cache-Control "public, max-age=86400"

    log {
        output file /var/log/caddy/icons-access.log
    }
}
```

Reload: `sudo systemctl reload caddy` (or `caddy reload --config /etc/caddy/Caddyfile`).

> If Caddy is on the host and not inside compose, the recommendation above
> uses a loopback port mapping. Check what the existing `app.fusegtm.com`
> block looks like — mirror whichever pattern it uses.

### 3. Start the container

From the repo on the EC2 host (or wherever `docker-compose.yml` lives):

```sh
cd /opt/fuse   # or current deploy path
git pull       # assumes PR has been merged to main
docker compose -f packages/twenty-docker/docker-compose.yml pull twenty-icons || true
docker compose -f packages/twenty-docker/docker-compose.yml build twenty-icons
docker compose -f packages/twenty-docker/docker-compose.yml up -d twenty-icons
docker compose -f packages/twenty-docker/docker-compose.yml ps twenty-icons
```

Wait for the healthcheck to report healthy (`docker inspect --format='{{.State.Health.Status}}' twenty-twenty-icons-1`).

### 4. Smoke test

```sh
# TLS + correct host
curl -I https://icons.fusegtm.com/apple.com
# Expect: HTTP/2 200, content-type: image/png (or image/x-icon)

# Specific size
curl -I https://icons.fusegtm.com/github.com/128

# Internal health (via Caddy only — the service itself only listens internally)
curl -I https://icons.fusegtm.com/health
```

Then hit the app — open any company record that has a domain and confirm
the avatar renders. Browser DevTools -> Network should show the request
going to `icons.fusegtm.com`, not `twenty-icons.com`.

### 5. (Optional) enforce the cutover on the app containers

The code in this PR defaults to `https://icons.fusegtm.com` — no env var
is strictly required. If you want to verify the env-override wiring works
(or pin against accidental drift), set on `server` and `worker` services:

```
REACT_APP_ICONS_BASE_URL=https://icons.fusegtm.com
```

(Server env overrides the shared constant at runtime on the Node side; the
frontend picks it up through `window._env_` via `generate-front-config.ts`
— note: the generator currently only injects `REACT_APP_SERVER_BASE_URL`.
If you want the frontend override as well, extend `generate-front-config.ts`
in a follow-up. The compiled default of `https://icons.fusegtm.com` is
sufficient for this deploy.)

## Rollback

If the service misbehaves (wrong images, 5xx, OOM), the safe fallback is
**not** to re-enable `twenty-icons.com` — that violates the sovereignty
charter. Instead:

1. Stop the container:
   ```sh
   docker compose -f packages/twenty-docker/docker-compose.yml stop twenty-icons
   ```
2. Avatars will fall back to initials / letter placeholders in the UI —
   the app does not hard-fail when icon URLs 404.
3. (Optional) point `icons.fusegtm.com` DNS at `127.0.0.1` or delete the
   record to short-circuit further requests.
4. File an ops ticket, fix forward — do not reintroduce upstream.

## Verification checklist

- [ ] `dig +short icons.fusegtm.com` returns `52.20.136.71`
- [ ] `curl -I https://icons.fusegtm.com/apple.com` returns 200 with image mime
- [ ] Inspect a company record in the Fuse app → favicon renders from `icons.fusegtm.com`
- [ ] DevTools Network shows zero requests to `twenty-icons.com`
- [ ] `docker compose logs twenty-icons` shows domain lookups, no auth errors, no S3 config attempts (storage is local)
- [ ] `/app/.local-storage` inside the container persists across restarts (test by `docker compose restart twenty-icons`)

## Caveats discovered during build

- Upstream favicon repo publishes no Docker image — remote build context
  on first deploy will pull the upstream sources and compile. First
  `docker compose build` on an EC2 t3.medium-class host took several
  minutes locally in testing; rebuilds are fast due to layer cache.
- The service boots a NestJS app on port 3000. Since the Fuse `server`
  also uses 3000, the compose file uses `expose:` (internal-only) rather
  than `ports:` to avoid a host-port collision.
- Storage is `local` by default (filesystem, mounted volume). If icon
  cache size grows beyond a few GB, flip to S3 via the upstream env vars
  (`STORAGE_TYPE=s3`, `STORAGE_S3_REGION`, `STORAGE_S3_NAME`,
  `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`).
- The upstream service does **not** set CORS headers. This is fine for
  `<img src="...">` tags (no preflight), but if anything ever calls this
  via `fetch()` with credentials, CORS will need to be added upstream or
  at the Caddy layer.
- `ALLOW_REQUESTS_TO_TWENTY_ICONS` server flag (defaults `false` in prod
  compose) is untouched. Semantics unchanged — it gates a different
  code path in the admin panel.
