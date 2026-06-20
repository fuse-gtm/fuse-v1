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
the AWS root principal for account `141591874293`. For normal staging and
production deploys, create or assume a staging deploy IAM role first. For the
SPEC-007 disposable staging tracer only, root was explicitly approved as an
exception and must be recorded in the issue/PR evidence.

## Required Inputs

- Staging DNS name with wildcard-subdomain behavior. For a raw EC2 IP tracer,
  use `nip.io` or equivalent; a bare IP breaks Twenty multi-workspace subdomain
  routing.
- Staging deploy IAM role or non-root IAM user, unless the root exception is
  explicitly approved for a disposable tracer.
- GHCR read/write credentials for `ghcr.io/fuse-gtm/fuse-v1`.
- A staging env file at `packages/twenty-docker/.env.fuse-staging`.
- A Twenty deploy API key for app publishing/install, kept outside Git.
- A clean branch containing the Fuse shell overlay and Fuse app packages.

## Staging Env Contract

Start from `packages/twenty-docker/.env.fuse-prod.example`, but save the staging
copy as `packages/twenty-docker/.env.fuse-staging`. Required staging deltas:

```bash
TWENTY_IMAGE=ghcr.io/fuse-gtm/fuse-v1:fuse-upstream-staging-<sha>
SERVER_URL=http://server:3000
FRONTEND_URL=https://<staging-host>
PUBLIC_BASE_URL=https://<staging-host>
VERIFY_PUBLIC_URL=true
IS_MULTIWORKSPACE_ENABLED=true
DEFAULT_SUBDOMAIN=staging
LOGIC_FUNCTION_TYPE=LOCAL
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

`SERVER_URL` is intentionally the internal Compose service URL for this staging
shape. Local logic function execution injects `SERVER_URL` as `TWENTY_API_URL`;
using the public EC2 host there can fail on public-IP hairpin networking. Keep
`FRONTEND_URL`/`PUBLIC_BASE_URL` external so workspace subdomain parsing works.
For a raw EC2 tracer, `FRONTEND_URL`/`PUBLIC_BASE_URL` can be
`http://<ip>.nip.io:<port>`; use HTTPS for durable staging ingress.

`LOGIC_FUNCTION_TYPE=LOCAL` is acceptable for the disposable staging tracer. A
durable production deployment should use the intended sandbox/Lambda execution
driver instead.

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

The image build must use Dockerfile target `twenty`. Do not deploy the
`twenty-app-dev` target to staging; that target is the all-in-one SDK/dev image
and starts embedded Postgres/Redis services.

## Step 3: Boot Staging

When running against Twenty's upstream Docker Compose file, add a staging
override that pins the server and worker image. The upstream compose file uses
`twentycrm/twenty:${TAG:-latest}` by default and does not read `TWENTY_IMAGE`
without this override.

```yaml
services:
  server:
    image: ${TWENTY_IMAGE}
    environment:
      PG_SSL_ALLOW_SELF_SIGNED: "false"
      LOGIC_FUNCTION_TYPE: ${LOGIC_FUNCTION_TYPE:-LOCAL}
    ports: !override
      - "${TWENTY_SERVER_HOST_PORT:-3001}:3000"
    volumes:
      - server-local-data:/app/packages/twenty-server/.local-storage

  worker:
    image: ${TWENTY_IMAGE}
    environment:
      PG_SSL_ALLOW_SELF_SIGNED: "false"
      LOGIC_FUNCTION_TYPE: ${LOGIC_FUNCTION_TYPE:-LOCAL}
    volumes:
      - server-local-data:/app/packages/twenty-server/.local-storage
```

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
of Git. In this branch, the internal app packages are not root Yarn workspaces,
so use the built SDK CLI directly from the repository root instead of `yarn
twenty`.

```bash
export TWENTY_DEPLOY_URL=https://<staging-host>
export TWENTY_DEPLOY_API_KEY_FILE=/path/to/staging-api-key

node packages/twenty-sdk/dist/cli.cjs remote:add \
  --as fuse-staging \
  --url "$TWENTY_DEPLOY_URL" \
  --api-key "$(cat "$TWENTY_DEPLOY_API_KEY_FILE")"

node packages/twenty-sdk/dist/cli.cjs remote:status --remote fuse-staging
```

Publish and install in dependency order:

```bash
node packages/twenty-sdk/dist/cli.cjs app:publish \
  packages/twenty-apps/internal/fuse-partner-core \
  --private \
  --remote fuse-staging

node packages/twenty-sdk/dist/cli.cjs app:install \
  packages/twenty-apps/internal/fuse-partner-core \
  --remote fuse-staging

node packages/twenty-sdk/dist/cli.cjs app:publish \
  packages/twenty-apps/internal/fuse-agency-partner-program \
  --private \
  --remote fuse-staging

node packages/twenty-sdk/dist/cli.cjs app:install \
  packages/twenty-apps/internal/fuse-agency-partner-program \
  --remote fuse-staging
```

Install order is `fuse-partner-core` first, then
`fuse-agency-partner-program`. Partner-type apps that extend
`fuse-partner-core` require dependency-aware metadata sync and scoped GraphQL
SDL generation; otherwise app-owned relations to core objects can fail during
install or SDK generation.

## Step 5: Smoke Checks

Record exact command output in the issue comment for #43 or #51.

```bash
curl -fsS https://<staging-host>/healthz
curl -sI https://<staging-host>/auth/google | head -5
curl -fsS -X POST https://<staging-host>/graphql \
  -H "Authorization: Bearer $(cat "$TWENTY_DEPLOY_API_KEY_FILE")" \
  -H "Content-Type: application/json" \
  --data '{"query":"query { agencyApplications { edges { node { id name } } } }"}'
```

App-owned routes are mounted under the workspace/app route prefix. Use the
workspace subdomain host and `/s/agency/...` paths:

```bash
curl -fsS -X POST https://<workspace-subdomain>.<staging-host>/s/agency/applications/submit \
  -H "Content-Type: application/json" \
  --data @/tmp/spec007-submit-payload.json

curl -fsS -X POST https://<workspace-subdomain>.<staging-host>/s/agency/applications/approve \
  -H "Authorization: Bearer $(cat "$TWENTY_DEPLOY_API_KEY_FILE")" \
  -H "Content-Type: application/json" \
  --data @/tmp/spec007-approve-payload.json
```

Before smoking referral events, set the app-scoped signing secret. Query
`findManyApplications` on `/metadata` to get the Agency app id, then run:

```graphql
mutation SetAgencySecret(
  $key: String!
  $value: String!
  $applicationId: UUID!
) {
  updateOneApplicationVariable(
    key: $key
    value: $value
    applicationId: $applicationId
  )
}
```

The referral route is `POST /s/agency/referrals/events`. A signed lead event
followed by a signed sale event for the approved enrollment should return
`status: "accepted"` for both events; the sale response should include rollup
totals with `leadCount: 1`, `saleCount: 1`, and `revenueCents` equal to the sale
payload amount.

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
- Database metadata smoke shows both Fuse apps installed, all nine Agency
  objects present, and zero dangling relation fields.
- Post-install seed smoke shows core partner records and starter Agency
  application/capability/resource/task/group records.
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
4. Recheck `/healthz`, GraphQL app reads, auth, and worker logs.

App rollback:

- Twenty app install rejects lower semver versions. For staging rollback, either
  publish the previous app code with a higher rollback patch version or uninstall
  and reinstall in the clean staging workspace.
- The private app registry rejects republishing the same app version. If a
  manifest changes after a failed staging publish/install attempt, bump the app
  package version before republishing.
- Record the app package version, git SHA, and registration/install result in
  the issue comment.

## #43 Completion Evidence

Issue #43 can be closed only after all of the following are recorded:

- AWS caller identity used for staging deploy, including any explicit root
  exception approval.
- Image tag and git SHA.
- Preflight output.
- Public health check plus GraphQL/API and database smoke.
- Confirmation that Partner OS bootstrap was skipped.
- Worker/app-deployment prerequisites enabled.
- Rollback command and result.

Issue #51 remains responsible for the full end-to-end Agency workflow and
separate shell/app rollback drill.
