# Fuse Incident Runbook: OOM

## Summary
This is the short path when the app stops serving because the host or the server process ran out of memory.

Do not start with DNS.

Start with whether the app can still serve traffic.

## Checks
1. Check shallow liveness:
   `curl -v http://localhost:3000/healthz`
2. Check real readiness:
   `curl -v http://localhost:3000/readyz`
3. Check kernel OOM history:
   `sudo dmesg -T | grep -i oom`
4. Check Docker restart count:
   `docker inspect twenty-server-1 --format '{{.RestartCount}}'`
5. Check Caddy for upstream failures:
   `sudo journalctl -u caddy -n 200 --no-pager`

## Interpretation
- `/healthz` green and `/readyz` red means the process is alive but should not serve traffic.
- Kernel OOM lines mean Linux killed the process. That is not a deploy bug by default.
- Rising restart count means Docker is masking instability, not fixing it.
- Caddy `502` usually means the upstream app is gone or wedged.

## First Response
1. Verify whether `localhost:3000/readyz` returns `503`.
2. Confirm whether the last failure was an OOM kill.
3. If the server is in a restart loop, restore service first.
4. After restore, capture memory usage, restart count, and the deployed image tag.
