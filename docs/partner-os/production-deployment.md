# Fuse Partner OS Production Deployment

This repository now contains Partner OS code.
Do not deploy the public `twentycrm/twenty` image if you want these changes in production.

## One-Path Deploy (Fuse branch)

Use this when you want a single repeatable flow from your current branch.

```bash
# 1) Build + push custom image
IMAGE_REPO=ghcr.io/fuse-gtm/fuse-v1 \
IMAGE_TAG=partner-os-$(git rev-parse --short HEAD) \
bash packages/twenty-docker/scripts/build-push-fuse-image.sh

# 2) Prepare env once
cp packages/twenty-docker/.env.fuse-prod.example packages/twenty-docker/.env
# Edit packages/twenty-docker/.env and set:
# - TWENTY_IMAGE=ghcr.io/fuse-gtm/fuse-v1:partner-os-<sha>
# - SERVER_URL
# - APP_SECRET
# - PG_DATABASE_PASSWORD

# 3) Deploy and bootstrap (set WORKSPACE_ID when known)
WORKSPACE_ID=<workspace-id> \
bash packages/twenty-docker/scripts/deploy-fuse-prod.sh
```

## Option A: Single-VM production (fastest)

Use this when you want production quickly with one Linux VM and Docker.

### 1) Build and push your custom image

```bash
export IMAGE_TAG=partner-os-$(git rev-parse --short HEAD)
export IMAGE_REPO=ghcr.io/fuse-gtm/fuse-v1

docker buildx build \
  --platform linux/amd64 \
  -f packages/twenty-docker/twenty/Dockerfile \
  -t ${IMAGE_REPO}:${IMAGE_TAG} \
  --push .
```

### 2) Configure runtime env

```bash
cp packages/twenty-docker/.env.fuse-prod.example packages/twenty-docker/.env
```

Set at minimum:
- `TWENTY_IMAGE=${IMAGE_REPO}:${IMAGE_TAG}`
- `SERVER_URL=https://crm.your-domain.com`
- `APP_SECRET` (strong random value)
- `PG_DATABASE_PASSWORD` (strong random value)

### 3) Run production stack

```bash
docker compose \
  -f packages/twenty-docker/docker-compose.yml \
  -f packages/twenty-docker/docker-compose.fuse.yml \
  --env-file packages/twenty-docker/.env \
  up -d
```

### 4) Verify health

```bash
curl -fsS https://crm.your-domain.com/healthz
```

### 5) Bootstrap Partner OS metadata for a workspace

Find workspace id:

```bash
docker compose \
  -f packages/twenty-docker/docker-compose.yml \
  -f packages/twenty-docker/docker-compose.fuse.yml \
  --env-file packages/twenty-docker/.env \
  exec db psql -U ${PG_DATABASE_USER:-postgres} -d ${PG_DATABASE_NAME:-default} \
  -c 'select id, "displayName", "createdAt" from core.workspace order by "createdAt" desc;'
```

Bootstrap Partner OS objects/views:

```bash
docker compose \
  -f packages/twenty-docker/docker-compose.yml \
  -f packages/twenty-docker/docker-compose.fuse.yml \
  --env-file packages/twenty-docker/.env \
  exec server yarn command:prod workspace:bootstrap:partner-os -w <workspace-id>
```

## Option B: Kubernetes production (scalable)

Use this when you want HA and managed infra.

### 1) Build and push custom image

Use the same image build step as Option A.

### 2) Create your values file

Start from:

```bash
cp packages/twenty-docker/helm/twenty/values-fuse-prod.example.yaml values-fuse-prod.yaml
```

Set at minimum:
- `image.repository`
- `image.tag`
- `server.env.SERVER_URL`
- DB/Redis connection values
- `secrets.tokens.accessToken`

### 3) Deploy with Helm

```bash
helm upgrade --install fuse-v1 ./packages/twenty-docker/helm/twenty \
  --namespace twentycrm --create-namespace \
  -f values-fuse-prod.yaml
```

### 4) Bootstrap Partner OS metadata

```bash
kubectl -n twentycrm exec deploy/fuse-v1-server -- \
  yarn command:prod workspace:bootstrap:partner-os -w <workspace-id>
```

## Notes

- `workspace:bootstrap:partner-os` is idempotent. Running it again only adds missing fields/relations/views.
- Keep `app-extend` and production branch image tags immutable. Roll forward with new tags.
- For auditability, log each bootstrap run with workspace id and git SHA.
