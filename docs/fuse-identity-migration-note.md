# Fuse Identity Migration Note (Cloud -> Self-Hosted)

**Issue:** FUSE-108  
**Date:** 2026-03-01  
**Owner:** Dhruv

## Plain Reality

Cloud identity is not the same as self-hosted identity.

A user account in Twenty Cloud does not automatically become an account in Fuse self-hosted. Treat self-hosted as a separate identity system unless a specific migration/import path is executed.

## What Users Must Do When Moving

1. Accept a new invite into the self-hosted workspace.
2. Create or confirm credentials in the self-hosted environment.
3. Reconnect Google or Microsoft OAuth in the self-hosted app.
4. Validate access to required objects/views after first login.

## What Carries Over

1. Application data that is explicitly migrated (database export/import or managed migration).
2. Configuration that is explicitly copied and validated in self-hosted (environment variables, feature flags, domain config).
3. Fuse custom modules and workflows shipped in the deployed image.

## What Does Not Carry Over Automatically

1. Existing cloud sessions and refresh tokens.
2. Cloud-issued OAuth grants for end-user accounts.
3. Cloud-specific workspace identity state not included in migration data.
4. Any provider secrets that were only configured in cloud settings.

## Migration Checklist (Operator)

1. Freeze writes on cloud source during final sync window.
2. Run final data sync to self-hosted database.
3. Confirm OAuth callbacks are configured for `https://app.fusegtm.com/auth/*/redirect`.
4. Invite pilot users into self-hosted and validate login.
5. Verify one create/update flow and one background job.
6. Announce cutover and provide re-auth instructions.

## Customer Message Template

"Fuse is now running on a dedicated self-hosted environment. Please sign in again at `https://app.fusegtm.com`. Your data is preserved, but your previous cloud session does not carry over."

