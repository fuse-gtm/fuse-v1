# Fuse Runtime Restart Drill

- timestamp_utc: 2026-03-02T11:27:30Z
- env_file: packages/twenty-docker/.env
- verify_public: true
- max_wait_seconds: 180
- curl_max_time_seconds: 5
- cycles: 1

| Cycle | Start (UTC) | Local Recovery (s) | Public Recovery (s) | server process | Result |
|---|---|---:|---:|---|---|
| 1 | 2026-03-02T11:27:30Z | 123 | 1 | dist/main | PASS |
