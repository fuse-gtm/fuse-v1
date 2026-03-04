# Fuse Production Incident Runbook (Sanitized)

This runbook has been intentionally sanitized for the repository.

## What was removed
- Production hostnames and network topology
- Cloud account and infrastructure identifiers
- Operational command sequences tied to live environments

## Canonical source
- Private operations repository / vault (internal only)

## Public-safe protocol
1. Confirm incident severity and blast radius.
2. Freeze new deploys.
3. Check infrastructure reachability before app debugging:
   - EC2 status check alarms (`StatusCheckFailed`) and EC2 instance status checks.
   - Public TCP reachability on `80/443`.
4. If host reachability is impaired, restore host first (reboot, then stop/start, then replace host if needed).
5. Only after host reachability is healthy, debug ingress/runtime and execute rollback if app remains unhealthy.
6. Validate public health and core auth flows.
7. Record timeline, root cause, and preventive action.
