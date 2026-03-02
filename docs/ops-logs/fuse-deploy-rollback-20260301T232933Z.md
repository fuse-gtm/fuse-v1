# Fuse Deploy/Rollback Drill

- generated_at_utc: 2026-03-01T23:29:33Z
- env_file: packages/twenty-docker/.env
- extra_compose_file: packages/twenty-docker/docker-compose.aws.yml
- verify_public_url: true
- baseline_tag_a: partner-os-45e979039d
- candidate_tag_b: partner-os-7c718a54

## Deploy baseline A: partner-os-45e979039d
- start: 2026-03-01T23:29:33Z
- command:
```bash
ENV_FILE=packages/twenty-docker/.env EXTRA_COMPOSE_FILE=packages/twenty-docker/docker-compose.aws.yml VERIFY_PUBLIC_URL=true bash packages/twenty-docker/scripts/deploy-fuse-prod.sh partner-os-45e979039d
```
- end: 2026-03-01T23:29:37Z
- duration_seconds: 4
- local_health: PASS
- public_health: PASS

## Deploy candidate B: partner-os-7c718a54
- start: 2026-03-01T23:29:38Z
- command:
```bash
ENV_FILE=packages/twenty-docker/.env EXTRA_COMPOSE_FILE=packages/twenty-docker/docker-compose.aws.yml VERIFY_PUBLIC_URL=true bash packages/twenty-docker/scripts/deploy-fuse-prod.sh partner-os-7c718a54
```
- end: 2026-03-01T23:31:35Z
- duration_seconds: 117
- local_health: PASS
- public_health: PASS

## Rollback to A: partner-os-45e979039d
- start: 2026-03-01T23:31:36Z
- command:
```bash
ENV_FILE=packages/twenty-docker/.env EXTRA_COMPOSE_FILE=packages/twenty-docker/docker-compose.aws.yml VERIFY_PUBLIC_URL=true bash packages/twenty-docker/scripts/deploy-fuse-prod.sh partner-os-45e979039d
```
- end: 2026-03-01T23:33:23Z
- duration_seconds: 107
- local_health: PASS
- public_health: PASS

## Summary
- rollback_recovery_seconds: 108
- status: PASS
