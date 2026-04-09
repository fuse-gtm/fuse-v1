#!/usr/bin/env python3

import csv
import json
import subprocess
from collections import Counter
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
OUTPUT_DIR = ROOT / "output" / "spreadsheet"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)


def git(*args: str) -> str:
    return subprocess.check_output(["git", *args], cwd=ROOT, text=True)


def top_dirs(paths: list[str], limit: int = 4) -> str:
    counts: Counter[str] = Counter()
    for path in paths:
        if not path:
            continue
        parts = path.split("/")
        if path.startswith(".github/"):
            key = ".github"
        elif len(parts) >= 2 and parts[0] == "packages":
            key = "/".join(parts[:2])
        elif len(parts) >= 2 and parts[0] == "docs":
            key = "docs"
        elif len(parts) >= 2 and parts[0] == "packages":
            key = "/".join(parts[:2])
        else:
            key = parts[0]
        counts[key] += 1
    return ", ".join(f"{name} ({count})" for name, count in counts.most_common(limit))


def classify_path(paths: list[str]) -> str:
    unique = set(paths)
    if unique and all(path.startswith(".github/") for path in unique):
        return "ci"
    if unique and all(path.startswith("docs/") or path == "README.md" for path in unique):
        return "docs"
    if unique and all(path.startswith("packages/twenty-website/") for path in unique):
        return "website"
    if unique and all("test" in path.lower() or path.endswith(".spec.ts") or path.endswith(".test.ts") for path in unique):
        return "tests"
    if any(path.startswith("packages/twenty-server/") for path in unique):
        return "server"
    if any(path.startswith("packages/twenty-front/") for path in unique):
        return "front"
    if any(path.startswith("packages/twenty-ui/") for path in unique):
        return "ui"
    if any(path.startswith("packages/twenty-emails/") for path in unique):
        return "emails"
    if any(path.startswith("packages/twenty-shared/") for path in unique):
        return "shared"
    if any(path.startswith("packages/twenty-enterprise/") for path in unique):
        return "enterprise"
    if any(path.startswith("packages/twenty-docker/") for path in unique):
        return "docker"
    return "mixed"


def main() -> None:
    cherry_lines = git("cherry", "origin/main", "upstream/main").splitlines()
    cherry_status = {line.split()[1]: line.split()[0] for line in cherry_lines if line.strip()}

    origin_subjects = set(git("log", "--format=%s", "upstream/main..origin/main").splitlines())

    raw_headers = git(
        "log",
        "--reverse",
        "--format=%H%x1f%h%x1f%ad%x1f%an%x1f%s%x1e",
        "--date=short",
        "origin/main..upstream/main",
    )

    raw_numstat = git(
        "log",
        "--reverse",
        "--format=COMMIT %H",
        "--numstat",
        "origin/main..upstream/main",
    )

    numstat_by_sha: dict[str, list[tuple[str, str, str]]] = {}
    current_sha = ""
    for line in raw_numstat.splitlines():
        if not line:
            continue
        if line.startswith("COMMIT "):
            current_sha = line.split(" ", 1)[1]
            numstat_by_sha[current_sha] = []
            continue
        if "\t" not in line or not current_sha:
            continue
        add, delete, path = line.split("\t", 2)
        numstat_by_sha[current_sha].append((add, delete, path))

    records: list[dict[str, str]] = []
    for entry in raw_headers.strip("\n\x1e").split("\x1e"):
        full_sha, short_sha, date, author, subject = entry.strip().split("\x1f")
        numstat = numstat_by_sha.get(full_sha, [])
        paths = [path for _, _, path in numstat if path]
        insertions = 0
        deletions = 0
        for add, delete, _ in numstat:
            if add.isdigit():
                insertions += int(add)
            if delete.isdigit():
                deletions += int(delete)

        records.append(
            {
                "sha": full_sha,
                "short_sha": short_sha,
                "date": date,
                "author": author,
                "subject": subject,
                "patch_equivalent_in_origin": "yes" if cherry_status.get(full_sha) == "-" else "no",
                "same_subject_in_origin": "yes" if subject in origin_subjects else "no",
                "path_class": classify_path(paths),
                "files_changed": str(len(paths)),
                "insertions": str(insertions),
                "deletions": str(deletions),
                "top_dirs": top_dirs(paths),
                "paths_json": json.dumps(paths, ensure_ascii=True),
                "commit_url": f"https://github.com/twentyhq/twenty/commit/{full_sha}",
            }
        )

    out_csv = OUTPUT_DIR / "upstream_commit_inventory.csv"
    with out_csv.open("w", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=list(records[0].keys()))
        writer.writeheader()
        writer.writerows(records)

    print(out_csv)
    print(f"wrote {len(records)} rows")


if __name__ == "__main__":
    main()
