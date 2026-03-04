# Fuse Production Incident Log

- Date: 2026-03-04
- Service: `https://app.fusegtm.com`
- Severity: Sev-1
- Category: Infrastructure reachability (host-level)

## Symptoms

- Public URL timed out.
- `app.fusegtm.com` resolved to `52.20.136.71`, but TCP connect to `80/443` timed out.
- CloudWatch alarms were `ALARM`:
  - `fuse-ec2-status-check`
  - `fuse-app-health-check`
- EC2 `i-05b90467e22fec9d2` showed `InstanceStatus=impaired`, `InstanceReachability=failed`.

## Restore Actions

1. Validated network baseline (SG, route table, NACL, EIP association).
2. Confirmed EIP `eipalloc-047bb773550ddc232` stayed attached to `i-05b90467e22fec9d2`.
3. Rebooted host: `aws ec2 reboot-instances --instance-ids i-05b90467e22fec9d2 --region us-east-1`.
4. Polled until EC2 status checks passed and ingress recovered.
5. SSH validation after host recovery:
   - `caddy` active
   - `server/worker/redis` containers up
   - `/healthz` returned healthy

## Recovery Evidence

- External checks recovered:
  - `https://app.fusegtm.com/healthz` => `200`
  - `https://app.fusegtm.com` => `200`
  - Auth flow endpoint reachable (`/auth/google` redirect)
- EC2 status checks recovered to `ok/passed`.

## Root Cause (Current)

- Primary failure domain was host reachability, not frontend/rendering code.
- During recovery window, Caddy returned transient `502` while app restarted.

## Hardening Completed

1. Production deploy guardrail documented and enforced:
   - `VERIFY_PUBLIC_URL=true` default in prod env template.
   - Break-glass bypass requires explicit `ALLOW_DEPLOY_WITHOUT_PUBLIC_HEALTHCHECK=true`.
2. Runtime guardrail installer added:
   - `packages/twenty-docker/scripts/fuse-install-runtime-guardrails.sh`
3. External synthetic checks setup script added:
   - `packages/twenty-docker/scripts/fuse-setup-external-health-check.sh`
4. Runbook updated to force infra-first triage.

## Follow-up

- Confirm all alarm states return to `OK` after metric windows close.
- Keep deploy freeze until one clean deploy verification passes with public health checks enabled.
- Grant Route53 IAM permissions to `fuse-deploy` (`ListHealthChecks`, `CreateHealthCheck`, `ChangeTagsForResource`) and then run `fuse-setup-external-health-check.sh`.
