#!/usr/bin/env python3
"""
Thin MCP client for Twenty's streamable-HTTP transport.
Handles the 3-step pattern: initialize → learn_tools → execute_tool.
Includes retry logic for transient failures.
"""

import json
import os
import random
import time
import requests
from typing import Any


class McpError(Exception):
    """Raised when an MCP call fails after all retries."""
    pass


class McpClient:
    def __init__(self, url: str, token: str | None = None, timeout: int = 60,
                 max_retries: int = 3, retry_base_delay: float = 2.0,
                 retry_jitter: float = 0.5):
        self.url = url
        self.timeout = timeout
        self.max_retries = max_retries
        self.retry_base_delay = retry_base_delay
        self.retry_jitter = retry_jitter

        # Token: env var first to avoid leaking tokens through process args.
        resolved_token = os.environ.get("FUSE_MCP_TOKEN") or token or ""
        if not resolved_token:
            raise McpError("No MCP token provided. Pass --token or set FUSE_MCP_TOKEN.")

        self.headers = {
            "Authorization": f"Bearer {resolved_token}",
            "Content-Type": "application/json",
        }
        self._req_id = 0
        self._initialized = False

    def _next_id(self) -> int:
        self._req_id += 1
        return self._req_id

    def _rpc(self, method: str, params: dict | None = None) -> dict:
        body: dict[str, Any] = {
            "jsonrpc": "2.0",
            "id": self._next_id(),
            "method": method,
        }
        if params:
            body["params"] = params

        last_err = None
        for attempt in range(self.max_retries + 1):
            try:
                resp = requests.post(
                    self.url, headers=self.headers, json=body, timeout=self.timeout,
                )
                resp.raise_for_status()
                return resp.json()
            except (requests.ConnectionError, requests.Timeout, requests.HTTPError) as exc:
                last_err = exc
                # Don't retry on 4xx (client errors) — only 5xx and network issues
                if isinstance(exc, requests.HTTPError) and exc.response is not None:
                    if 400 <= exc.response.status_code < 500:
                        raise McpError(f"Client error {exc.response.status_code}: {exc}") from exc
                if attempt >= self.max_retries:
                    break

                delay = self.retry_base_delay * (2 ** attempt)
                jitter = random.uniform(0, self.retry_jitter)
                sleep_time = delay + jitter
                print(
                    f"  RETRY {attempt + 1}/{self.max_retries}: {exc} "
                    f"(waiting {sleep_time:.1f}s)",
                )
                time.sleep(sleep_time)

        raise McpError(f"Failed after {self.max_retries} retries: {last_err}") from last_err

    def initialize(self) -> dict:
        result = self._rpc("initialize", {
            "protocolVersion": "2025-03-26",
            "capabilities": {},
            "clientInfo": {"name": "fuse-bootstrap", "version": "1.0.0"},
        })
        self._initialized = True
        return result.get("result", {})

    def execute(self, tool_name: str, arguments: dict) -> dict:
        """Execute a tool via the 3-step MCP pattern. Returns parsed result."""
        if not self._initialized:
            self.initialize()

        # loadingMessage is required by the Twenty MCP server (undocumented)
        tool_args = dict(arguments)
        tool_args["loadingMessage"] = f"{tool_name}..."

        resp = self._rpc("tools/call", {
            "name": "execute_tool",
            "arguments": {
                "toolName": tool_name,
                "arguments": tool_args,
            },
        })

        # Parse the nested JSON from content blocks
        for block in resp.get("result", {}).get("content", []):
            if block.get("type") == "text":
                try:
                    return json.loads(block["text"])
                except (json.JSONDecodeError, TypeError):
                    return {"raw": block["text"]}

        return resp

    @staticmethod
    def _extract_result_list(data: dict) -> list[dict]:
        result = data.get("result", [])
        if isinstance(result, list):
            return [item for item in result if isinstance(item, dict)]

        if isinstance(result, dict):
            for key in ("items", "data", "nodes", "result"):
                nested = result.get(key)
                if isinstance(nested, list):
                    return [item for item in nested if isinstance(item, dict)]

        return []

    @staticmethod
    def _extract_next_cursor(data: dict) -> str | None:
        result = data.get("result")

        if isinstance(result, dict):
            for key in ("nextCursor", "cursor", "next"):
                value = result.get(key)
                if isinstance(value, str) and value:
                    return value

            page_info = result.get("pageInfo")
            if isinstance(page_info, dict):
                for key in ("nextCursor", "endCursor"):
                    value = page_info.get(key)
                    if isinstance(value, str) and value:
                        return value

        return None

    def get_object_map(self, page_size: int = 250) -> dict[str, str]:
        """Returns {nameSingular: objectMetadataId} for all objects in the workspace."""
        object_map: dict[str, str] = {}
        seen_ids: set[str] = set()
        offset = 0
        cursor: str | None = None

        while True:
            args: dict[str, Any] = {"limit": page_size}
            if cursor is not None:
                args["cursor"] = cursor
            elif offset > 0:
                args["offset"] = offset

            data = self.execute("get_object_metadata", args)
            result = self._extract_result_list(data)
            if not result:
                break

            new_rows = 0
            for obj in result:
                obj_id = obj.get("id")
                name = obj.get("nameSingular")
                if not isinstance(obj_id, str) or not isinstance(name, str):
                    continue
                if obj_id in seen_ids:
                    continue
                seen_ids.add(obj_id)
                object_map[name] = obj_id
                new_rows += 1

            if new_rows == 0:
                break

            cursor = self._extract_next_cursor(data)
            if cursor is not None:
                continue

            if len(result) < page_size:
                break

            offset += page_size

        return object_map

    def get_fields_for_object(self, object_metadata_id: str, page_size: int = 250) -> set[str]:
        """Returns set of field names for a given object. Used for idempotency."""
        names: set[str] = set()
        offset = 0
        cursor: str | None = None

        while True:
            args: dict[str, Any] = {
                "objectMetadataId": object_metadata_id,
                "limit": page_size,
            }
            if cursor is not None:
                args["cursor"] = cursor
            elif offset > 0:
                args["offset"] = offset

            data = self.execute("get_field_metadata", args)
            result = self._extract_result_list(data)
            if not result:
                break

            before_count = len(names)
            for field in result:
                name = field.get("name")
                if isinstance(name, str):
                    names.add(name)

            if len(names) == before_count:
                break

            cursor = self._extract_next_cursor(data)
            if cursor is not None:
                continue

            if len(result) < page_size:
                break

            offset += page_size

        return names

    def get_views_for_object(
        self,
        object_name_singular: str,
        page_size: int = 250,
    ) -> set[str]:
        """Returns set of view names for a given object. Used for idempotency."""
        names: set[str] = set()
        offset = 0
        cursor: str | None = None

        while True:
            args: dict[str, Any] = {
                "objectNameSingular": object_name_singular,
                "limit": page_size,
            }
            if cursor is not None:
                args["cursor"] = cursor
            elif offset > 0:
                args["offset"] = offset

            data = self.execute("get_views", args)
            result = self._extract_result_list(data)
            if not result:
                break

            before_count = len(names)
            for view in result:
                name = view.get("name")
                if isinstance(name, str):
                    names.add(name)

            if len(names) == before_count:
                break

            cursor = self._extract_next_cursor(data)
            if cursor is not None:
                continue

            if len(result) < page_size:
                break

            offset += page_size

        return names
