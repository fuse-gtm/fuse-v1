#!/usr/bin/env python3

import csv
import json
import re
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
INPUT_CSV = ROOT / "output" / "spreadsheet" / "upstream_commit_inventory.csv"
OUTPUT_CSV = ROOT / "output" / "spreadsheet" / "upstream_commit_review_draft.csv"


PLATFORM_TOPS = {
    "packages/twenty-sdk",
    "packages/twenty-client-sdk",
    "packages/create-twenty-app",
    "packages/twenty-apps",
    "packages/twenty-standard-application",
    "packages/twenty-docs",
    "package.json",
    "yarn.lock",
    "nx.json",
    ".github",
    ".cursor",
    "CLAUDE.md",
    "packages/twenty-website",
    "packages/twenty-website-new",
    "packages/twenty-docker",
    "packages/twenty-oxlint-rules",
    "packages/twenty-eslint-rules",
    "packages/twenty-e2e-testing",
}

CORE_TOPS = {
    "packages/twenty-front",
    "packages/twenty-server",
    "packages/twenty-ui",
    "packages/twenty-shared",
    "packages/twenty-emails",
    "packages/twenty-worker",
    "package.json",
    "yarn.lock",
    "nx.json",
}


def path_only(kind: str, paths: list[str]) -> bool:
    if not paths:
        return False
    if kind == "docs":
        return all(
            p.startswith("docs/") or p == "README.md" or p.startswith("packages/twenty-docs/")
            for p in paths
        )
    if kind == "ci":
        return all(p.startswith(".github/") for p in paths)
    if kind == "website":
        return all(p.startswith("packages/twenty-website") for p in paths)
    if kind == "tests":
        return all("test" in p.lower() or ".spec." in p or ".test." in p for p in paths)
    return False


def tops(paths: list[str]) -> list[str]:
    return sorted(
        set("/".join(p.split("/")[:2]) if p.startswith("packages/") else p.split("/")[0] for p in paths)
    )


def recommend(subject: str, paths: list[str], patch_equivalent: bool) -> tuple[str, str, str]:
    s = subject
    tops_list = tops(paths)
    platform_only = bool(tops_list) and all(t in PLATFORM_TOPS for t in tops_list)
    core_only = bool(tops_list) and all(t in CORE_TOPS for t in tops_list)

    if patch_equivalent:
        return "no", "already integrated in Fuse", "duplicate"
    if re.search(r"\bi18n\b|translations?", s, re.I):
        return "no", "translations only", "translations"
    if path_only("docs", paths) or re.search(r"^docs:|\bdocs\b", s, re.I):
        return "no", "docs only", "docs"
    if path_only("ci", paths) or re.search(
        r"github actions|merge queue|visual regression ci|preview-env-dispatch|\bci\b|chromatic|storybook",
        s,
        re.I,
    ):
        return "no", "CI only", "ci"
    if path_only("website", paths) or re.search(
        r"\bwebsite\b|pricing card|hero|illustrations|threecards|helped sections|hover and scroll transitions",
        s,
        re.I,
    ):
        return "no", "website only", "website"
    if path_only("tests", paths) or re.search(r"\be2e\b|unit test|integration test|tests?$", s, re.I):
        return "no", "tests only", "tests"
    if platform_only:
        if re.search(
            r"self host|password reset|production build|ssrf|server logs leak|blocklist|vulnerable operation|security|path traversal|entity expansion|stack overflow|arbitrary file write|off-by-one|resource consumption",
            s,
            re.I,
        ):
            return "yes", "security/build hardening", "platform_fix"
        return "no", "SDK/app-platform only", "platform"
    if re.search(
        r"linaria|emotion to linaria|theme system|css variables|oxlint|eslint rules|refactor|rename command menu|breaking_change|breaking change|migrate from eslint|remove all styled\(component\)|deprecate runtime theme objects|split command and cli logic|pure esm|refactor clients|application module architecture|remove files",
        s,
        re.I,
    ):
        return "no", "broad refactor or tooling churn", "refactor"
    if re.search(r"enterprise plan required|private app sharing|billing", s, re.I):
        return "no", "enterprise monetization", "enterprise"
    if re.search(
        r"demo workspace|call recording app|salesforce section|last interaction app|standard command menu items|standard views command|standard table and fields widget|app distribution|tarball|manifest|headless action modal|command menu item entity|engine component key|widget side panel|placement sections|reset fields widget|page layout override|create fake hidden fields group|fake hidden fields group|source to actor fields|unpin action|system view fallback",
        s,
        re.I,
    ):
        return "no", "non-core upstream feature", "noncore_feature"
    if re.search(
        r"workspace command decorators|workspace commands writes|instance commands|upgrade_migrations|upgradeMigration|registeredCoreMigration|direct execution - remove conditional schema|pagelayout backfill command standard app|add messaging upgrade command|messaging post migration cleanup|upgrade command|backfill",
        s,
        re.I,
    ):
        return "no", "migration/framework churn", "migration"
    if re.search(
        r"security|self host|oauth|pkce|rate limiting|auth failure|revocation|client secret|confidential oauth|query runner leak|deterministic backfill|orphaned registrations|seed-server-id|workspaceId before delete|expression injection|path traversal|entity expansion|stack overflow|arbitrary file write|server logs leak|ssrf|isolated environment|blocklist|vulnerable operation|password reset|production build",
        s,
        re.I,
    ):
        return "yes", "security or auth hardening", "security"
    if re.search(r"workflow|trigger missing|workflow layout|nodes color|stop catching all workflow errors|improve workflow perfs", s, re.I):
        if re.search(r"fix|improve|continues|missing|stop catching", s, re.I):
            return "yes", "workflow reliability fix", "workflow_fix"
        return "no", "workflow feature churn", "workflow_feature"
    if re.search(
        r"^fix\b|\bfix[: ]|bug fixes batch|followup:|follow-up:|prevent |handle Escape|respect number format|wrong foreign key|empty record index page|breadcrumb infinite loop|workspace creation modal|invite team skip|missing omit|missing test input values|file storage cleaning|remove unnecessary queries|replace unsafe JSON.parse|onboarding flow|permission settings page|validate input before formatting|form field select|currency input|task rows|pdf upload|nav item position|drag drop indicator|role permission page design|readonly date|dark mode text color|health indicator|imap-smtp-caldav form|onblur|google signup|record does not open|title not filled|forbiddenexception|universal identifier|composite field sub-menu|downloadFile|dashboard creation|multiitemfieldinput|kanban view|calendar view|server build|production build",
        s,
        re.I,
    ):
        if re.search(r"alignment|color|scrollbar|separator|button|header|design", s, re.I):
            return "no", "cosmetic UI polish", "cosmetic"
        return "yes", "core product bug fix", "core_fix"
    if re.search(r"^feat\b|\badd\b|\bintroduce\b|implement ", s, re.I):
        return "no", "new feature, not core fix", "feature"
    if re.search(
        r"allow users to set where new fields|support ungrouped fields|fields widget rename group|display a single add a section button|make all widgets non-editable|remove add record on workflow runs/versions|vertical alignment of \+n more|add common loader|fix add more tab bottom separator|single add a section button",
        s,
        re.I,
    ):
        return "no", "UI behavior tweak", "ux_tweak"
    if re.search(r"navigate to page when clicking nav item", s, re.I):
        return "yes", "small UX fix", "ux_fix"
    if core_only and re.search(
        r"improve|remove|optimize|update|only update value at creation|migrate pagelayout position frontend|builder|apollo enrich|navbar ai chats followup|ai tools|sse effect|added record filter hidden fields|quarter|system view fallback",
        s,
        re.I,
    ):
        return "no", "ambiguous change, not essential", "ambiguous_no"
    if core_only:
        return "yes", "core app change worth pulling", "default_core_yes"
    return "no", "not clearly worth cherry-picking", "default_no"


def main() -> None:
    rows = list(csv.DictReader(INPUT_CSV.open()))
    output_rows = []
    for idx, row in enumerate(rows, start=1):
        paths = json.loads(row["paths_json"])
        recommend_yes_no, rationale, tag = recommend(
            row["subject"],
            paths,
            row["patch_equivalent_in_origin"] == "yes",
        )
        output_rows.append(
            {
                "index": idx,
                "date": row["date"],
                "sha": row["sha"],
                "short_sha": row["short_sha"],
                "author": row["author"],
                "subject": row["subject"],
                "top_dirs": row["top_dirs"],
                "files_changed": row["files_changed"],
                "insertions": row["insertions"],
                "deletions": row["deletions"],
                "patch_equivalent_in_origin": row["patch_equivalent_in_origin"],
                "same_subject_in_origin": row["same_subject_in_origin"],
                "draft_recommendation": recommend_yes_no,
                "draft_rationale": rationale,
                "draft_tag": tag,
                "commit_url": row["commit_url"],
            }
        )

    with OUTPUT_CSV.open("w", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=list(output_rows[0].keys()))
        writer.writeheader()
        writer.writerows(output_rows)

    print(OUTPUT_CSV)
    print(f"wrote {len(output_rows)} rows")


if __name__ == "__main__":
    main()
