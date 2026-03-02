# Fuse Phase 1 Closeout Runbook

This runbook closes:

- FUSE-105 (Google OAuth for ICP path)
- FUSE-106 (deploy + rollback drill)
- FUSE-108 (identity migration note)
- Phase 1 7-day soak gate

## FUSE-105: OAuth

### 1) Provider setup

Create Google OAuth app with these callback URLs:

- `https://app.fusegtm.com/auth/google/redirect`
- `https://app.fusegtm.com/auth/google-apis/get-access-token`

Microsoft OAuth is optional for Phase 1 and can be deferred.

### 2) Host env update

Edit `packages/twenty-docker/.env`:

- `AUTH_GOOGLE_ENABLED=true`
- `AUTH_GOOGLE_CLIENT_ID=<value>`
- `AUTH_GOOGLE_CLIENT_SECRET=<value>`

### 3) Readiness check

```bash
ENV_FILE=packages/twenty-docker/.env \
EXPECTED_BASE_URL=https://app.fusegtm.com \
CHECK_PROVIDERS=google \
bash packages/twenty-docker/scripts/fuse-oauth-readiness-check.sh
```

### 4) Deploy + verify

```bash
ENV_FILE=packages/twenty-docker/.env \
EXTRA_COMPOSE_FILE=packages/twenty-docker/docker-compose.aws.yml \
VERIFY_PUBLIC_URL=true \
bash packages/twenty-docker/scripts/deploy-fuse-prod.sh
```

Then verify Google OAuth flow end-to-end with fresh users.

## FUSE-106: Deploy/Rollback Drill

### 1) Capture baseline tag A

```bash
grep '^TWENTY_IMAGE=' packages/twenty-docker/.env
```

### 2) Create next tag B

```bash
git commit --allow-empty -m "chore: rollback drill tag B"
git push origin <branch>

IMAGE_TAG=partner-os-$(git rev-parse --short HEAD) \
WRITE_ENV_FILE=packages/twenty-docker/.env \
bash packages/twenty-docker/scripts/build-push-fuse-image.sh
```

### 3) Run drill (A -> B -> A)

```bash
bash packages/twenty-docker/scripts/fuse-deploy-rollback-drill.sh \
  --tag-a partner-os-<tag-a> \
  --tag-b partner-os-<tag-b>
```

Evidence is written to `docs/ops-logs/fuse-deploy-rollback-<timestamp>.md`.

## FUSE-108: Identity Migration Note

Canonical note location:

- `docs/fuse-identity-migration-note.md`

Use that doc in customer migration messaging and Closed acceptance evidence.

## 7-Day Soak

Template location:

- `docs/fuse-phase1-soak-log-template.md`

Run once per day for 7 consecutive days after OAuth is live.
Do not skip days.

Pass if:

- no Sev-1 incidents
- all daily checks pass
