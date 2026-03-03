# Fuse MCP Bootstrap

Stamps the partner-os schema onto a Twenty workspace via the MCP API.
No custom Docker build required — runs against stock Twenty.

## Architecture

Three motion modules, composed at onboarding time:

| Module | Objects | Use case |
|---|---|---|
| **core** | partnerProfile, partnerContactAssignment, lead | Always included. Partner entity model. |
| **cosell** | partnerCustomerMap, partnerAttributionEvent, partnerAttributionSnapshot, customerEvent, customerSnapshot | Pipeline mapping + attribution + reporting |
| **discovery** | partnerPlay, playCheck, playEnrichment, playExclusion, discoveryRun, partnerCandidate, checkEvaluation, enrichmentEvaluation | AI-powered partner finding via Exa websets |

## Usage

```bash
# Preferred auth path (avoids token in process args)
export FUSE_MCP_TOKEN=<jwt-api-key>

# Full setup (all 16 objects)
python3 bootstrap.py \
  --url https://app.fusegtm.com/mcp

# Referral-focused team (core + cosell only)
python3 bootstrap.py \
  --url https://app.fusegtm.com/mcp \
  --modules core,cosell

# Integration-focused team (core + discovery only)
python3 bootstrap.py \
  --url https://app.fusegtm.com/mcp \
  --modules core,discovery

# Dry run (print what would be created)
python3 bootstrap.py --url ... --dry-run

# Resumable run with machine-parseable logs
python3 bootstrap.py \
  --url https://app.fusegtm.com/mcp \
  --output json \
  --resume-from-checkpoint ./bootstrap-checkpoint.json
```

Optional runtime tuning:

```bash
export MCP_TIMEOUT_SECONDS=60
export MCP_MAX_RETRIES=3
export MCP_BACKOFF_MS=2000
export MCP_JITTER_MS=500
```

## How it works

1. **Objects** — creates custom objects via `create_object_metadata` (skips existing)
2. **Fields** — creates scalar fields via `create_field_metadata` (SELECT, TEXT, NUMBER, etc.)
3. **Relations** — creates relation fields linking objects together (MANY_TO_ONE)
4. **Views** — creates TABLE and KANBAN views per object

The bootstrap is idempotent:

- object existence checks before create
- field/relation/view existence checks before create
- pagination-safe metadata reads for large workspaces
- retry/backoff for transient MCP failures
- optional checkpoint resume for partial runs

## After bootstrap

Customers can customize further:
- Add custom fields to any object
- Create additional views (filters, sorts, field visibility)
- Modify SELECT option labels/colors
- Add objects not in the standard modules

## Requirements

- Python 3.10+
- `requests` library (`pip install requests`)
- Twenty workspace with MCP enabled
- API key with workspace admin permissions

## Files

- `bootstrap.py` — CLI entry point and orchestration
- `schema_modules.py` — object/field/relation definitions per motion module
- `mcp_client.py` — thin MCP-over-HTTP client for Twenty's 3-step protocol
