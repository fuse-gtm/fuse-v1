# Fuse Runtime Restart Drill

- Timestamp (UTC):
- Operator:
- Environment:
- Image tag:

## Drill Goal

Confirm three consecutive server restarts recover without public outage.

## Restart Cycles

| Cycle | Start (UTC) | Local Health Recovery (s) | Public Health Recovery (s) | `docker top` process | Result |
|---|---|---:|---:|---|---|
| 1 |  |  |  |  |  |
| 2 |  |  |  |  |  |
| 3 |  |  |  |  |  |

## Command Set

```bash
docker compose -f packages/twenty-docker/docker-compose.yml \
  -f packages/twenty-docker/docker-compose.fuse.yml \
  -f packages/twenty-docker/docker-compose.aws.yml \
  --env-file packages/twenty-docker/.env restart server
```

## Pass/Fail

- Pass condition: all cycles recover local/public health and server process is `node dist/main`.
- Final result:

