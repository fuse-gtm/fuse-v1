# SPEC-007 Upstream Staging Runbook

Status: staging preflight and execution plan. This does not replace the old
Partner OS production runbook; it creates the new app-based path required by
SPEC-007.

## Decision

The staging tracer must boot an upstream-based Fuse shell and install Fuse
partner apps through Twenty application deployment. It must not run
`workspace:bootstrap:partner-os`, `fuse-tenant-bootstrap.sh`, or any old Partner
OS MCP/bootstrap activation path.

The existing `deploy-fuse-prod.sh` script can still be used as the Docker
Compose executor only when `WORKSPACE_ID` is unset. If `WORKSPACE_ID` is set,
that script runs `workspace:bootstrap:partner-os`, which is explicitly out of
scope for SPEC-007.

## Current Preflight Finding

As of June 20, 2026, `aws sts get-caller-identity` on this machine resolves to
the AWS root principal for account `141591874293`. Do not run mutating staging
commands from that principal. Create or assume a staging deploy IAM role first,
then rerun the preflight.

## Required Inputs

- Staging DNS name and HTTPS ingress target.
- Staging deploy IAM role or non-root IAM user.
- GHCR read/write credentials for `ghcr.io/fuse-gtm/fuse-v1`.
- A staging env file at `packages/twenty-docker/.env.fuse-staging`.
- A Twenty deploy API key for app publishing/install, kept outside Git.
- A clean branch containing the Fuse shell overlay and Fuse app packages.

## Staging Env Contract

Start from `packages/twenty-docker/.env.fuse-prod.example`, but save the staging
copy as `packages/twenty-docker/.env.fuse-staging`. Required staging deltas:

```bash
TWENTY_IMAGE=ghcr.io/fuse-gtm/fuse-v1:fuse-upstream-staging-<sha>
SERVER_URL=https://<staging-host>
PUBLIC_BASE_URL=https://<staging-host>
VERIFY_PUBLIC_URL=true
IS_MULTIWORKSPACE_ENABLED=true
IS_CONFIG_VARIABLES_IN_DB_ENABLED=false
TELEMETRY_ENABLED=false
ANALYTICS_ENABLED=false
AI_TELEMETRY_ENABLED=false
ALLOW_REQUESTS_TO_TWENTY_ICONS=false
COMPANY_ENRICHMENT_ENABLED=false
COMPANY_ENRICHMENT_PROVIDER=none
MARKETPLACE_REMOTE_FETCH_ENABLED=false
ADMIN_VERSION_CHECK_ENABLED=false
HELP_CENTER_SEARCH_ENABLED=false
HELP_CENTER_SEARCH_PROVIDER=none
SUPPORT_DRIVER=none
```

Do not set `WORKSPACE_ID` in this env file. App install replaces Partner OS
workspace bootstrap.

## Step 1: Non-Mutating Preflight

```bash
ENV_FILE=packages/twenty-docker/.env.fuse-staging \
bash packages/twenty-docker/scripts/fuse-upstream-staging-preflight.sh
```

Expected:

```text
Upstream staging preflight passed (env=packages/twenty-docker/.env.fuse-staging)
No Partner OS bootstrap variables detected.
```

This validates:

- Docker, Compose, buildx, curl, git, and yarn are available.
- AWS caller is not root unless explicitly overridden.
- The env file does not use placeholder secrets or a legacy `partner-os-*`
  image tag.
- HTTPS public verification is enabled.
- Fuse sovereignty flags are locked down.
- `WORKSPACE_ID` is unset, preventing old Partner OS bootstrap.
- `fuse-partner-core` and `fuse-agency-partner-program` app validators pass.

## Step 2: Build and Push the Shell Image

Use a staging tag that reflects the new architecture:

```bash
IMAGE_REPO=ghcr.io/fuse-gtm/fuse-v1 \
IMAGE_TAG=fuse-upstream-staging-$(git rev-parse --short HEAD) \
WRITE_ENV_FILE=packages/twenty-docker/.env.fuse-staging \
bash packages/twenty-docker/scripts/build-push-fuse-image.sh
```

Verify:

```bash
docker manifest inspect ghcr.io/fuse-gtm/fuse-v1:fuse-upstream-staging-$(git rev-parse --short HEAD)
```

## Step 3: Boot Staging

Run with `WORKSPACE_ID` intentionally absent:

```bash
unset WORKSPACE_ID
ENV_FILE=packages/twenty-docker/.env.fuse-staging \
bash packages/twenty-docker/scripts/deploy-fuse-prod.sh
```

Expected boot evidence:

- `Server healthy`
- `Public health check passed`
- `WORKSPACE_ID not set. Skipping Partner OS bootstrap.`
- `docker compose ps` shows server, worker, db or external DB, and redis up.

## Step 4: Publish and Install Fuse Apps

Use the app deployment path from the in-repo Twenty docs. Keep the API token out
of Git.

```bash
export TWENTY_DEPLOY_URL=https://<staging-host>
export TWENTY_DEPLOY_API_KEY=<staging-api-key>

cd packages/twenty-apps/internal/fuse-partner-core
yarn twenty publish --server "$TWENTY_DEPLOY_URL" --token "$TWENTY_DEPLOY_API_KEY"

cd ../fuse-agency-partner-program
yarn twenty publish --server "$TWENTY_DEPLOY_URL" --token "$TWENTY_DEPLOY_API_KEY"
```

If the CLI version in the staging image requires remotes instead of
`publish --server`, use:

```bash
yarn twenty remote add --api-url "$TWENTY_DEPLOY_URL" --as fuse-staging
yarn twenty deploy --remote fuse-staging
yarn twenty install --remote fuse-staging
```

Install order is `fuse-partner-core` first, then
`fuse-agency-partner-program`.

## Step 5: Smoke Checks

Record exact command output in the issue comment for #43 or #51.

```bash
curl -fsS https://<staging-host>/healthz
curl -fsS https://<staging-host>/readyz
curl -sI https://<staging-host>/auth/google | head -5
```

Application smoke:

- Settings > Applications shows both Fuse private apps.
- Core Partner Profile objects/views exist after install.
- Agency Applications, Agency Groups, Referral Events, and Referral Rollups
  appear in navigation.
- Agency Application Review and Agency Performance panels render loading,
  empty, error, and ready states against staging app data.
- Agency application submit/approve/reject routes respond through app-owned
  routes.
- Referral event ingestion accepts valid signed events and rejects bad
  signatures.
- Worker logs show logic function execution without restart loops.

Brand smoke:

```bash
yarn fuse:brand-audit
```

Expected: required Fuse shell strings pass and primary user-facing surfaces do
not regress to Twenty branding.

## Rollback

Shell rollback:

1. Find the previous known-good `fuse-upstream-staging-*` image tag.
2. Update `TWENTY_IMAGE` in `.env.fuse-staging`.
3. Rerun `deploy-fuse-prod.sh` with `WORKSPACE_ID` unset.
4. Recheck `/healthz`, `/readyz`, auth, and worker logs.

App rollback:

- Twenty app install rejects lower semver versions. For staging rollback, either
  publish the previous app code with a higher rollback patch version or uninstall
  and reinstall in the clean staging workspace.
- Record the app package version, git SHA, and registration/install result in
  the issue comment.

## #43 Completion Evidence

Issue #43 can be closed only after all of the following are recorded:

- AWS caller identity used for staging deploy, excluding root.
- Image tag and git SHA.
- Preflight output.
- Public health and ready checks.
- Confirmation that Partner OS bootstrap was skipped.
- Worker/app-deployment prerequisites enabled.
- Rollback command and result.

Issue #51 remains responsible for the full end-to-end Agency workflow and
separate shell/app rollback drill.
