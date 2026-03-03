# Fuse Production Incident Runbook

## Access

| Resource | How |
|----------|-----|
| EC2 SSH | `ssh -i ~/.ssh/fuse-prod.pem ubuntu@52.20.136.71` |
| RDS | `fuse-prod-db.cgnqkm0s4v6f.us-east-1.rds.amazonaws.com:5432` |
| Docker logs | `docker compose -f packages/twenty-docker/docker-compose.yml -f packages/twenty-docker/docker-compose.fuse.yml -f packages/twenty-docker/docker-compose.aws.yml --env-file packages/twenty-docker/.env logs -f server` |
| Caddy logs | `sudo journalctl -u caddy -f` |
| Watchdog log | `tail -f /var/log/fuse-watchdog.log` |
| Health (local) | `curl -fsS http://localhost:3000/healthz` |
| Health (public) | `curl -fsS https://app.fusegtm.com/healthz` |

## Triage checklist

When something breaks, work through this list top to bottom. Each step either resolves the issue or narrows the scope.

### 1. Is the app process running?

```bash
docker compose -f packages/twenty-docker/docker-compose.yml \
  -f packages/twenty-docker/docker-compose.fuse.yml \
  -f packages/twenty-docker/docker-compose.aws.yml \
  --env-file packages/twenty-docker/.env ps
```

If `server` is not running or unhealthy:

```bash
docker compose -f packages/twenty-docker/docker-compose.yml \
  -f packages/twenty-docker/docker-compose.fuse.yml \
  -f packages/twenty-docker/docker-compose.aws.yml \
  --env-file packages/twenty-docker/.env restart server
```

Wait 30s, then re-check `/healthz`. If still down, check server logs for startup errors.

#### 1a. Is startup stuck on cron registration?

```bash
docker top twenty-server-1
```

If you see `yarn command:prod cron:register:all` running for more than 60 seconds, startup is blocked before `node dist/main`.

Immediate mitigation:

```bash
cd /opt/fuse
sed -i 's/^DISABLE_CRON_JOBS_REGISTRATION=.*/DISABLE_CRON_JOBS_REGISTRATION=true/' packages/twenty-docker/.env

docker compose -f packages/twenty-docker/docker-compose.yml \
  -f packages/twenty-docker/docker-compose.fuse.yml \
  -f packages/twenty-docker/docker-compose.aws.yml \
  --env-file packages/twenty-docker/.env up -d server
```

After local/public health are green, run one-shot cron registration separately:

```bash
docker compose -f packages/twenty-docker/docker-compose.yml \
  -f packages/twenty-docker/docker-compose.fuse.yml \
  -f packages/twenty-docker/docker-compose.aws.yml \
  --env-file packages/twenty-docker/.env exec -T server \
  yarn command:prod cron:register:all
```

### 2. Is the database reachable?

```bash
docker compose -f packages/twenty-docker/docker-compose.yml \
  -f packages/twenty-docker/docker-compose.fuse.yml \
  -f packages/twenty-docker/docker-compose.aws.yml \
  --env-file packages/twenty-docker/.env exec server \
  sh -c 'pg_isready -h $PG_DATABASE_HOST -p 5432 -U $PG_DATABASE_USER'
```

If unreachable, check RDS status in AWS Console or via CLI:

```bash
aws rds describe-db-instances \
  --db-instance-identifier fuse-prod-db \
  --query 'DBInstances[0].DBInstanceStatus' \
  --output text --region us-east-1
```

Common causes: RDS maintenance window, storage full, security group change.

### 3. Is HTTPS working?

```bash
curl -vvv https://app.fusegtm.com/healthz 2>&1 | head -30
```

If TLS errors:

```bash
sudo systemctl status caddy
sudo journalctl -u caddy --since "10 minutes ago"
```

Restart Caddy:

```bash
sudo systemctl restart caddy
```

If certs are the issue, check the ask service:

```bash
curl http://127.0.0.1:9080/allow?domain=app.fusegtm.com
# Should return 200
```

### 4. Is DNS resolving correctly?

```bash
dig +short app.fusegtm.com
# Should return 52.20.136.71
```

If wrong: DNS change propagation issue. Check Hostinger DNS panel.

### 5. Is the EC2 instance reachable?

If SSH hangs, check EC2 instance status in AWS Console:

```bash
aws ec2 describe-instance-status \
  --instance-ids i-05b90467e22fec9d2 \
  --region us-east-1 \
  --query 'InstanceStatuses[0].{Instance:InstanceStatus.Status,System:SystemStatus.Status}' \
  --output table
```

If instance or system check failed, reboot:

```bash
aws ec2 reboot-instances \
  --instance-ids i-05b90467e22fec9d2 \
  --region us-east-1
```

## Rollback

Deploy a known-good tag:

```bash
cd /opt/fuse
ENV_FILE=packages/twenty-docker/.env \
EXTRA_COMPOSE_FILE=packages/twenty-docker/docker-compose.aws.yml \
VERIFY_PUBLIC_URL=true \
bash packages/twenty-docker/scripts/deploy-fuse-prod.sh partner-os-<known-good-sha>
```

Current known-good tag: `partner-os-45e979039d`

## Escalation

| Severity | Definition | Response |
|----------|-----------|----------|
| Sev-1 | App unreachable for >5 minutes | Immediate. Run triage checklist. If not resolved in 15 min, rollback. |
| Sev-2 | Degraded (slow responses, intermittent errors) | Within 1 hour. Check logs, restart if needed. |
| Sev-3 | Non-critical (worker lag, minor UI issue) | Next business day. |

## Post-incident

After resolving any Sev-1 or Sev-2:

1. Write a brief incident log in `docs/ops-logs/` with: timeline, root cause, fix applied, prevention action.
2. Run restart drill and capture evidence:
   - `bash packages/twenty-docker/scripts/fuse-runtime-restart-drill.sh`
3. Update this runbook if the triage steps were missing something.
4. If the fix involved a config change, commit it to the repo.
