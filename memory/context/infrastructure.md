# Infrastructure Context

## Production Environment

| Component | Value |
|-----------|-------|
| EC2 Instance | i-05b90467e22fec9d2 |
| Public IP | 52.20.136.71 |
| Instance type | t3.small (2 vCPU / 2GB RAM) |
| Domain | app.fusegtm.com |
| MCP endpoint | https://app.fusegtm.com/mcp |
| Workspace ID | 06e070b2-80eb-4097-8813-8d2ebe632108 |
| Docker image | ghcr.io/fuse-gtm/fuse-v1:partner-os-45e979039d |
| AWS Account | 141591874293 |
| Region | us-east-1 |
| Branch | feat/partner-os-schema-spine |

## Access

- SSH restricted to Dhruv's IP: 173.34.174.118/32
- No SSM agent installed (no remote command execution from CI/automation)
- MCP JWT: stored in FUSE_MCP_TOKEN env var
- JWT expiry: ~2126 (long-lived API key)

## Architecture

- Caddy reverse proxy → Twenty server container + worker container
- PostgreSQL + Redis on same instance
- Image tags: partner-os-<sha> (immutable)
- Deploy script: ./deploy-fuse-prod.sh <tag>
- Preflight: ./fuse-deploy-preflight.sh
- Health check: ./check-runtime-and-ingress.sh

## Known Issues

- **OOM risk on t3.small**: Heavy metadata operations (object/field/relation creation) trigger schema sync that can push memory over 2GB limit, causing crash-restart loop. Recommendation: upgrade to t3.medium (4GB).
- **502 from Caddy**: Means backend container is down. Check CPU for sustained high usage (crash-restart loop indicator).
- **Reboot as recovery**: `aws ec2 reboot-instances --instance-ids i-05b90467e22fec9d2` when SSH is not available.

## MCP Details

- Transport: streamable-HTTP
- 206 tools across 6 categories
- Three-step tool usage: get_tool_catalog → learn_tools → execute_tool
- All tool arguments require undocumented `loadingMessage` parameter
- Pagination: cursor-based with offset fallback

## Production Database State (as of 2026-03-02)

- 31 total objects: 30 standard Twenty + 1 custom (partnerTrack, formerly partnerPlay)
- partnerTrack ID: 48f5190b-4a80-4459-b4a3-83ab904e99b5
- partnerTrack has 20 fields: 8 custom + 12 standard auto-generated
- NOTE: The object in production DB still has nameSingular='partnerPlay' — will need rename or delete+recreate during next bootstrap
- 7 message-related objects are isSystem:true (hidden from Data Model UI)
- 15 of 16 partner-os objects awaiting bootstrap
