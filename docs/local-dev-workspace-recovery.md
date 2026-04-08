# Local Dev Workspace Recovery Runbook

## Canonical local URLs
- App UI: `http://app.localhost:3001`
- API: `http://app.localhost:3000`
- Health: `http://app.localhost:3000/healthz`

Use only `app.localhost` during sign-in/onboarding. Do not mix with `localhost` in the same browser session.

## Required env settings

### `packages/twenty-server/.env`
- `IS_MULTIWORKSPACE_ENABLED=true`
- `DEFAULT_SUBDOMAIN=app`
- `FRONTEND_URL=http://app.localhost:3001`
- `IS_WORKSPACE_CREATION_LIMITED_TO_SERVER_ADMINS=true`

### `packages/twenty-front/.env`
- `REACT_APP_SERVER_BASE_URL=http://app.localhost:3000`
- `REACT_APP_PORT=3001`
- `VITE_HOST=0.0.0.0`
- `VITE_DISABLE_TYPESCRIPT_CHECKER=true`

## Start order
From repo root:

```bash
npm exec nx run twenty-server:start:ci
npm exec nx run twenty-front:start
npx wait-on tcp:3000 && npm exec nx run twenty-server:worker
```

## Health checks

```bash
curl -sS http://app.localhost:3000/healthz
curl -I http://app.localhost:3001
```

Expected: API returns 200 with JSON status; UI returns 200 HTML.

## If onboarding/profile is stuck on `/welcome`
Symptoms:
- "Creating your workspace" spinner never ends
- "No role found for this user in the workspace"
- Cannot complete profile

### First-line recovery (safe)
1. Flush cache:
```bash
redis-cli FLUSHALL
```
2. Restart server/front/worker.
3. Clear browser site data for all:
- `app.localhost`
- `localhost`
- `<workspace>.localhost` (example: `fusegtm.localhost`)

### DB integrity checks

```sql
-- Workspace status
select id, subdomain, "activationStatus", "defaultRoleId"
from core."workspace"
where subdomain = 'fusegtm';

-- User workspace membership
select u.email, uw.id as user_workspace_id, uw."workspaceId"
from core."userWorkspace" uw
join core."user" u on u.id = uw."userId"
where u.email = 'dhruv@fusegtm.com';

-- Role assignment
select rt.id, rt."roleId", rt."userWorkspaceId", rt."applicationId"
from core."roleTarget" rt
join core."userWorkspace" uw on uw.id = rt."userWorkspaceId"
join core."user" u on u.id = uw."userId"
where u.email = 'dhruv@fusegtm.com';
```

Expected:
- Workspace is `ACTIVE`
- User has a `userWorkspace`
- User has at least one `roleTarget`

## Workspace creation policy
This instance is configured so only server admins can create new workspaces:
- `IS_WORKSPACE_CREATION_LIMITED_TO_SERVER_ADMINS=true`
- User must have `canAccessFullAdminPanel=true`.

Code path:
- `packages/twenty-server/src/engine/core-modules/auth/services/sign-in-up.service.ts`
- `assertWorkspaceCreationAllowed(...)`

Non-admin users are blocked with:
- `Workspace creation is restricted to admins`

## Known-good baseline checklist
- API/Front/Worker all running
- `app.localhost` only
- workspace `ACTIVE`
- role target exists for active user
- no onboarding pending keys for the active user/workspace
