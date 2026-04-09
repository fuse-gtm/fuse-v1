#!/usr/bin/env python3
"""
Fuse MCP Bootstrap — stamps partner-os schema onto a Twenty workspace.

Usage:
    # All modules (default for full partnerships team)
    python bootstrap.py --url https://app.fusegtm.com/mcp

    # Only core + discovery (integration-focused team)
    python bootstrap.py --url ... --modules core,discovery

    # Dry run (print what would be created)
    python bootstrap.py --url ... --dry-run

    # Resume from checkpoint and print machine-parseable logs
    python bootstrap.py --url ... --output json --resume-from-checkpoint ./.bootstrap-checkpoint.json

Environment:
    FUSE_MCP_TOKEN       Preferred MCP auth token
    MCP_TIMEOUT_SECONDS  Request timeout (default 60)
    MCP_MAX_RETRIES      Retry attempts after first failure (default 3)
    MCP_BACKOFF_MS       Base backoff in milliseconds (default 2000)
    MCP_JITTER_MS        Added jitter in milliseconds (default 500)
"""

import argparse
import json
import os
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from mcp_client import McpClient, McpError
from schema_modules import MODULE_MAP, OBJECT_CREATION_ORDER, ObjectDef


REQUIRED_BUILTIN_OBJECTS = ["company", "person", "opportunity", "workspaceMember"]
CHECKPOINT_PHASES = {
    "object": "completed_objects",
    "scalar_field": "completed_scalar_fields",
    "relation": "completed_relations",
    "view": "completed_views",
}


def now_iso() -> str:
    return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


class BootstrapRunner:
    def __init__(
        self,
        client: McpClient,
        modules: list[str],
        dry_run: bool = False,
        output_mode: str = "text",
        checkpoint_path: str | None = None,
    ):
        self.client = client
        self.modules = modules
        self.dry_run = dry_run
        self.output_mode = output_mode
        self.checkpoint_path = checkpoint_path
        self.obj_id_map: dict[str, str] = {}
        self.field_cache: dict[str, set[str]] = {}
        self.view_cache: dict[str, set[str]] = {}
        self.stats = {
            "objects": 0,
            "fields": 0,
            "relations": 0,
            "views": 0,
            "skipped": 0,
            "errors": 0,
        }
        self.events: list[dict[str, Any]] = []
        self.checkpoint = self._load_checkpoint()

    def _emit(self, level: str, message: str, **details: Any) -> None:
        event = {"timestamp": now_iso(), "level": level, "message": message}
        if details:
            event.update(details)
        self.events.append(event)
        if self.output_mode == "json":
            print(json.dumps(event, ensure_ascii=True))
        else:
            print(message)

    def _load_checkpoint(self) -> dict[str, Any]:
        default_checkpoint: dict[str, Any] = {
            "completed_objects": [],
            "completed_scalar_fields": {},
            "completed_relations": {},
            "completed_views": {},
        }
        if not self.checkpoint_path:
            return default_checkpoint

        path = Path(self.checkpoint_path)
        if not path.exists():
            return default_checkpoint

        try:
            payload = json.loads(path.read_text(encoding="utf-8"))
            for key in default_checkpoint:
                payload.setdefault(key, default_checkpoint[key])
            return payload
        except (json.JSONDecodeError, OSError):
            self._emit(
                "warn",
                f"WARN checkpoint file is unreadable, starting fresh: {self.checkpoint_path}",
            )
            return default_checkpoint

    def _save_checkpoint(self) -> None:
        if not self.checkpoint_path:
            return

        path = Path(self.checkpoint_path)
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(
            json.dumps(self.checkpoint, indent=2, sort_keys=True),
            encoding="utf-8",
        )

    def _is_checkpointed(self, phase: str, object_name: str, item_name: str | None = None) -> bool:
        key = CHECKPOINT_PHASES[phase]
        bucket = self.checkpoint.get(key)
        if phase == "object":
            return object_name in set(bucket or [])
        if not isinstance(bucket, dict):
            return False
        return item_name in set(bucket.get(object_name, []))

    def _mark_checkpoint(self, phase: str, object_name: str, item_name: str | None = None) -> None:
        key = CHECKPOINT_PHASES[phase]
        if phase == "object":
            values = set(self.checkpoint.get(key, []))
            values.add(object_name)
            self.checkpoint[key] = sorted(values)
        else:
            group = self.checkpoint.get(key, {})
            if not isinstance(group, dict):
                group = {}
            values = set(group.get(object_name, []))
            if item_name:
                values.add(item_name)
            group[object_name] = sorted(values)
            self.checkpoint[key] = group
        self._save_checkpoint()

    def run(self) -> bool:
        if self.output_mode == "text":
            print(f"\n{'='*60}")
            print("  Fuse MCP Bootstrap")
            print(f"  Modules: {', '.join(self.modules)}")
            print(f"  Dry run: {self.dry_run}")
            if self.checkpoint_path:
                print(f"  Checkpoint: {self.checkpoint_path}")
            print(f"{'='*60}\n")
        else:
            self._emit(
                "info",
                "bootstrap-start",
                modules=self.modules,
                dry_run=self.dry_run,
                checkpoint_path=self.checkpoint_path,
            )

        all_objects: dict[str, ObjectDef] = {}
        for module_name in self.modules:
            module = MODULE_MAP[module_name]
            for obj in module.objects:
                all_objects[obj.name_singular] = obj

        ordered_names = [name for name in OBJECT_CREATION_ORDER if name in all_objects]
        for name in all_objects:
            if name not in ordered_names:
                ordered_names.append(name)

        if not self.dry_run:
            self.obj_id_map = self.client.get_object_map()
            self._emit(
                "info",
                f"Existing workspace objects: {len(self.obj_id_map)}",
                existing_objects=len(self.obj_id_map),
            )

        self._emit("info", f"--- Phase 1: Objects ({len(ordered_names)}) ---")
        for name in ordered_names:
            self._ensure_object(all_objects[name])

        self._emit("info", "--- Phase 2: Scalar fields ---")
        for name in ordered_names:
            obj = all_objects[name]
            obj_id = self.obj_id_map.get(name)
            if not obj_id:
                self._emit(
                    "warn",
                    f"  SKIP {name}: no object ID (creation may have failed)",
                    object_name=name,
                    phase="scalar_field",
                )
                continue
            if not self.dry_run:
                self.field_cache[name] = self.client.get_fields_for_object(obj_id)
            for field in obj.fields:
                self._create_field(name, obj_id, field)

        self._emit("info", "--- Phase 3: Relations ---")
        for name in ordered_names:
            obj = all_objects[name]
            obj_id = self.obj_id_map.get(name)
            if not obj_id:
                continue
            for rel in obj.relations:
                self._create_relation(name, obj_id, rel)

        self._emit("info", "--- Phase 4: Views ---")
        for name in ordered_names:
            obj = all_objects[name]
            if not self.dry_run:
                self.view_cache[name] = self.client.get_views_for_object(obj.name_singular)
            for view in obj.views:
                self._create_view(name, obj, view)

        summary_payload = {
            "objects_created": self.stats["objects"],
            "fields_created": self.stats["fields"],
            "relations_created": self.stats["relations"],
            "views_created": self.stats["views"],
            "skipped": self.stats["skipped"],
            "errors": self.stats["errors"],
        }

        if self.output_mode == "text":
            print(f"\n{'='*60}")
            print("  Bootstrap complete")
            print(f"  Objects created:   {self.stats['objects']}")
            print(f"  Fields created:    {self.stats['fields']}")
            print(f"  Relations created: {self.stats['relations']}")
            print(f"  Views created:     {self.stats['views']}")
            print(f"  Skipped:           {self.stats['skipped']}")
            print(f"  Errors:            {self.stats['errors']}")
            print(f"{'='*60}\n")
        else:
            self._emit("info", "bootstrap-summary", **summary_payload)

        return self.stats["errors"] == 0

    def _ensure_object(self, obj: ObjectDef) -> None:
        if self._is_checkpointed("object", obj.name_singular) and (
            self.dry_run or obj.name_singular in self.obj_id_map
        ):
            self.stats["skipped"] += 1
            self._emit(
                "info",
                f"  RESUME-SKIP: {obj.name_singular}",
                object_name=obj.name_singular,
                phase="object",
                reason="checkpoint",
            )
            return

        if obj.name_singular in self.obj_id_map:
            self.stats["skipped"] += 1
            self._mark_checkpoint("object", obj.name_singular)
            self._emit(
                "info",
                f"  EXISTS: {obj.name_singular} ({self.obj_id_map[obj.name_singular][:8]}...)",
                object_name=obj.name_singular,
                phase="object",
                status="exists",
            )
            return

        if self.dry_run:
            self.obj_id_map[obj.name_singular] = "dry-run-id"
            self._emit(
                "info",
                f"  WOULD CREATE: {obj.name_singular} ({obj.label_singular})",
                object_name=obj.name_singular,
                phase="object",
                status="dry_run",
            )
            return

        result = self.client.execute("create_object_metadata", obj.to_mcp_args())
        created_id = None
        if isinstance(result, dict):
            nested = result.get("result", result)
            if isinstance(nested, dict):
                created_id = nested.get("id")

        if isinstance(created_id, str):
            self.obj_id_map[obj.name_singular] = created_id
            self.stats["objects"] += 1
            self._mark_checkpoint("object", obj.name_singular)
            self._emit(
                "info",
                f"  CREATED: {obj.name_singular} -> {created_id[:8]}...",
                object_name=obj.name_singular,
                phase="object",
                status="created",
                object_id=created_id,
            )
            return

        error_message = (
            result.get("error", {}).get("message", str(result)[:120])
            if isinstance(result, dict)
            else str(result)[:120]
        )
        self.stats["errors"] += 1
        self._emit(
            "error",
            f"  ERROR: {obj.name_singular}: {error_message}",
            object_name=obj.name_singular,
            phase="object",
            status="error",
            error=error_message,
        )

    def _create_field(self, obj_name: str, obj_id: str, field: Any) -> None:
        existing = self.field_cache.get(obj_name, set())
        if (
            self._is_checkpointed("scalar_field", obj_name, field.name)
            and field.name in existing
        ):
            self.stats["skipped"] += 1
            self._emit(
                "info",
                f"  RESUME-SKIP: {obj_name}.{field.name}",
                object_name=obj_name,
                field_name=field.name,
                phase="scalar_field",
                reason="checkpoint",
            )
            return

        if self.dry_run:
            self._emit(
                "info",
                f"  WOULD CREATE: {obj_name}.{field.name} ({field.type})",
                object_name=obj_name,
                field_name=field.name,
                phase="scalar_field",
                status="dry_run",
            )
            return

        if field.name in existing:
            self.stats["skipped"] += 1
            self._mark_checkpoint("scalar_field", obj_name, field.name)
            self._emit(
                "info",
                f"  EXISTS: {obj_name}.{field.name}",
                object_name=obj_name,
                field_name=field.name,
                phase="scalar_field",
                status="exists",
            )
            return

        result = self.client.execute("create_field_metadata", field.to_mcp_args(obj_id))
        created_id = None
        if isinstance(result, dict):
            nested = result.get("result", result)
            if isinstance(nested, dict):
                created_id = nested.get("id")

        if isinstance(created_id, str):
            self.field_cache.setdefault(obj_name, set()).add(field.name)
            self.stats["fields"] += 1
            self._mark_checkpoint("scalar_field", obj_name, field.name)
            self._emit(
                "info",
                f"  OK: {obj_name}.{field.name} ({field.type})",
                object_name=obj_name,
                field_name=field.name,
                phase="scalar_field",
                status="created",
                field_id=created_id,
            )
            return

        error_message = (
            result.get("error", {}).get("message", str(result)[:120])
            if isinstance(result, dict)
            else str(result)[:120]
        )
        if "already exists" in error_message.lower() or "duplicate" in error_message.lower():
            self.field_cache.setdefault(obj_name, set()).add(field.name)
            self.stats["skipped"] += 1
            self._mark_checkpoint("scalar_field", obj_name, field.name)
            self._emit(
                "info",
                f"  EXISTS: {obj_name}.{field.name}",
                object_name=obj_name,
                field_name=field.name,
                phase="scalar_field",
                status="exists",
            )
            return

        self.stats["errors"] += 1
        self._emit(
            "error",
            f"  ERROR: {obj_name}.{field.name}: {error_message}",
            object_name=obj_name,
            field_name=field.name,
            phase="scalar_field",
            status="error",
            error=error_message,
        )

    def _create_relation(self, obj_name: str, obj_id: str, rel: Any) -> None:
        existing = self.field_cache.get(obj_name, set())
        if self._is_checkpointed("relation", obj_name, rel.name) and rel.name in existing:
            self.stats["skipped"] += 1
            self._emit(
                "info",
                f"  RESUME-SKIP: {obj_name}.{rel.name}",
                object_name=obj_name,
                field_name=rel.name,
                phase="relation",
                reason="checkpoint",
            )
            return

        target_id = self.obj_id_map.get(rel.target_object_name)
        if not target_id:
            self.stats["skipped"] += 1
            self._emit(
                "warn",
                f"  SKIP: {obj_name}.{rel.name} -> {rel.target_object_name} (target not found)",
                object_name=obj_name,
                relation_name=rel.name,
                target_object=rel.target_object_name,
                phase="relation",
                status="missing_target",
            )
            return

        if self.dry_run:
            self._emit(
                "info",
                f"  WOULD CREATE: {obj_name}.{rel.name} -> {rel.target_object_name}",
                object_name=obj_name,
                relation_name=rel.name,
                target_object=rel.target_object_name,
                phase="relation",
                status="dry_run",
            )
            return

        if rel.name in existing:
            self.stats["skipped"] += 1
            self._mark_checkpoint("relation", obj_name, rel.name)
            self._emit(
                "info",
                f"  EXISTS: {obj_name}.{rel.name}",
                object_name=obj_name,
                relation_name=rel.name,
                phase="relation",
                status="exists",
            )
            return

        result = self.client.execute(
            "create_field_metadata",
            rel.to_mcp_args(obj_id, target_id),
        )
        created_id = None
        if isinstance(result, dict):
            nested = result.get("result", result)
            if isinstance(nested, dict):
                created_id = nested.get("id")

        if isinstance(created_id, str):
            self.field_cache.setdefault(obj_name, set()).add(rel.name)
            self.stats["relations"] += 1
            self._mark_checkpoint("relation", obj_name, rel.name)
            self._emit(
                "info",
                f"  OK: {obj_name}.{rel.name} -> {rel.target_object_name}",
                object_name=obj_name,
                relation_name=rel.name,
                target_object=rel.target_object_name,
                phase="relation",
                status="created",
                field_id=created_id,
            )
            return

        error_message = (
            result.get("error", {}).get("message", str(result)[:120])
            if isinstance(result, dict)
            else str(result)[:120]
        )
        if "already exists" in error_message.lower() or "duplicate" in error_message.lower():
            self.field_cache.setdefault(obj_name, set()).add(rel.name)
            self.stats["skipped"] += 1
            self._mark_checkpoint("relation", obj_name, rel.name)
            self._emit(
                "info",
                f"  EXISTS: {obj_name}.{rel.name}",
                object_name=obj_name,
                relation_name=rel.name,
                phase="relation",
                status="exists",
            )
            return

        self.stats["errors"] += 1
        self._emit(
            "error",
            f"  ERROR: {obj_name}.{rel.name}: {error_message}",
            object_name=obj_name,
            relation_name=rel.name,
            phase="relation",
            status="error",
            error=error_message,
        )

    def _create_view(self, obj_name: str, obj: ObjectDef, view: Any) -> None:
        existing = self.view_cache.get(obj_name, set())
        if self._is_checkpointed("view", obj_name, view.name) and view.name in existing:
            self.stats["skipped"] += 1
            self._emit(
                "info",
                f"  RESUME-SKIP: {obj_name} / '{view.name}'",
                object_name=obj_name,
                view_name=view.name,
                phase="view",
                reason="checkpoint",
            )
            return

        if self.dry_run:
            self._emit(
                "info",
                f"  WOULD CREATE: {obj_name} / '{view.name}' ({view.type})",
                object_name=obj_name,
                view_name=view.name,
                phase="view",
                status="dry_run",
            )
            return

        if view.name in existing:
            self.stats["skipped"] += 1
            self._mark_checkpoint("view", obj_name, view.name)
            self._emit(
                "info",
                f"  EXISTS: {obj_name} / '{view.name}'",
                object_name=obj_name,
                view_name=view.name,
                phase="view",
                status="exists",
            )
            return

        args: dict[str, Any] = {
            "name": view.name,
            "objectNameSingular": obj.name_singular,
            "icon": obj.icon,
            "type": view.type,
            "visibility": "WORKSPACE",
        }

        if view.type == "KANBAN" and view.kanban_field:
            args["mainGroupByFieldName"] = view.kanban_field
        elif view.type == "KANBAN":
            for field in obj.fields:
                if field.type == "SELECT":
                    args["mainGroupByFieldName"] = field.name
                    break

        result = self.client.execute("create_view", args)
        created_id = None
        if isinstance(result, dict):
            nested = result.get("result", result)
            if isinstance(nested, dict):
                created_id = nested.get("id")

        if isinstance(created_id, str):
            self.view_cache.setdefault(obj_name, set()).add(view.name)
            self.stats["views"] += 1
            self._mark_checkpoint("view", obj_name, view.name)
            self._emit(
                "info",
                f"  OK: {obj_name} / '{view.name}' ({view.type})",
                object_name=obj_name,
                view_name=view.name,
                phase="view",
                status="created",
                view_id=created_id,
            )
            return

        error_message = (
            result.get("error", {}).get("message", str(result)[:120])
            if isinstance(result, dict)
            else str(result)[:120]
        )
        if "already exists" in error_message.lower() or "duplicate" in error_message.lower():
            self.view_cache.setdefault(obj_name, set()).add(view.name)
            self.stats["skipped"] += 1
            self._mark_checkpoint("view", obj_name, view.name)
            self._emit(
                "info",
                f"  EXISTS: {obj_name} / '{view.name}'",
                object_name=obj_name,
                view_name=view.name,
                phase="view",
                status="exists",
            )
            return

        self.stats["errors"] += 1
        self._emit(
            "error",
            f"  ERROR: {obj_name} view '{view.name}': {error_message}",
            object_name=obj_name,
            view_name=view.name,
            phase="view",
            status="error",
            error=error_message,
        )


def main() -> None:
    parser = argparse.ArgumentParser(description="Fuse MCP Bootstrap")
    parser.add_argument("--url", required=True, help="MCP server URL")
    parser.add_argument(
        "--token",
        default=None,
        help="MCP token fallback. Preferred path is FUSE_MCP_TOKEN env var.",
    )
    parser.add_argument(
        "--modules",
        default="core,cosell,discovery",
        help="Comma-separated module names (default: all)",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Print what would be created without making changes",
    )
    parser.add_argument(
        "--output",
        choices=["text", "json"],
        default=os.environ.get("FUSE_MCP_OUTPUT", "text"),
        help="Output format (default: text)",
    )
    parser.add_argument(
        "--resume-from-checkpoint",
        default=os.environ.get("FUSE_MCP_CHECKPOINT_PATH"),
        help="Checkpoint file for resumable runs",
    )
    parser.add_argument(
        "--mcp-timeout-seconds",
        type=int,
        default=int(os.environ.get("MCP_TIMEOUT_SECONDS", "60")),
        help="MCP request timeout seconds",
    )
    parser.add_argument(
        "--mcp-max-retries",
        type=int,
        default=int(os.environ.get("MCP_MAX_RETRIES", "3")),
        help="MCP retry attempts after first failure",
    )
    parser.add_argument(
        "--mcp-backoff-ms",
        type=int,
        default=int(os.environ.get("MCP_BACKOFF_MS", "2000")),
        help="MCP retry base backoff in milliseconds",
    )
    parser.add_argument(
        "--mcp-jitter-ms",
        type=int,
        default=int(os.environ.get("MCP_JITTER_MS", "500")),
        help="MCP retry jitter in milliseconds",
    )
    args = parser.parse_args()

    modules = [module.strip() for module in args.modules.split(",") if module.strip()]
    available_modules = sorted(MODULE_MAP.keys())
    for module in modules:
        if module not in MODULE_MAP:
            print(
                f"ERROR: Unknown module '{module}'. Available: {', '.join(available_modules)}",
            )
            sys.exit(1)

    if "core" not in modules:
        modules.insert(0, "core")
        if args.output == "json":
            print(
                json.dumps(
                    {
                        "timestamp": now_iso(),
                        "level": "info",
                        "message": "Core module added automatically",
                        "module": "core",
                    },
                    ensure_ascii=True,
                ),
            )
        else:
            print("NOTE: 'core' module is always included (added automatically)")

    try:
        client = McpClient(
            args.url,
            token=args.token,
            timeout=max(args.mcp_timeout_seconds, 1),
            max_retries=max(args.mcp_max_retries, 0),
            retry_base_delay=max(args.mcp_backoff_ms, 0) / 1000,
            retry_jitter=max(args.mcp_jitter_ms, 0) / 1000,
        )
        client.initialize()
    except McpError as exc:
        print(f"ERROR: {exc}")
        sys.exit(1)

    if not args.dry_run:
        obj_map = client.get_object_map()
        missing = [name for name in REQUIRED_BUILTIN_OBJECTS if name not in obj_map]
        if missing:
            print(f"ERROR: Required built-in objects not found: {', '.join(missing)}")
            print("This workspace may be on an incompatible Twenty version.")
            sys.exit(1)

    runner = BootstrapRunner(
        client,
        modules,
        dry_run=args.dry_run,
        output_mode=args.output,
        checkpoint_path=args.resume_from_checkpoint,
    )
    success = runner.run()

    sys.exit(0 if success else 1)


if __name__ == "__main__":
    main()
