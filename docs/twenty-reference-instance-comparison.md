# Twenty Reference Instance Comparison

**Date:** 2026-03-02
**Instances:** YCombinator (`yc.localhost:3000`) and Apple (`apple.localhost:3000`)
**Version:** Twenty v1.18.1 (Fuse fork, branch `feat/partner-os-schema-spine`)
**Purpose:** FUSE-200 reference parity baseline for Phase 2 deployment

---

## 1. Workspace Identity

| Property | YCombinator | Apple |
|----------|-------------|-------|
| Subdomain | `yc` | `apple` |
| Workspace ID | `3b8e6458-5fc1-4e63-8563-008ccddaa6db` | `20202020-1c25-4d02-bf25-6aeccf7ea419` |
| DB Schema | `workspace_3ixj3i1a5avy16ptijtb3lae3` | `workspace_1wgvd1injqtife6y4rvfbu3h5` |

---

## 2. Object Metadata

YC has **47 active objects**. Apple has **51 active objects** (4 extra demo objects).

### Objects Unique to Apple

| Object | Notes |
|--------|-------|
| `employmentHistory` | Demo custom object |
| `pet` | Demo custom object |
| `petCareAgreement` | Demo custom object |
| `rocket` | Demo custom object |

### Objects Shared (47 objects)

Both workspaces contain identical sets of standard Twenty objects plus the 16 Fuse partner-os custom objects: `checkEvaluation`, `customerEvent`, `customerSnapshot`, `discoveryRun`, `enrichmentEvaluation`, `lead`, `partnerAttributionEvent`, `partnerAttributionSnapshot`, `partnerCandidate`, `partnerContactAssignment`, `partnerCustomerMap`, `partnerPlay`, `partnerProfile`, `playCheck`, `playEnrichment`, `playExclusion`, `surveyResult`.

---

## 3. Sidebar Navigation

Both instances share the same navigation structure via `core.navigationMenuItem`, with differences only from Apple's extra custom objects.

### Shared Sidebar Structure

```
Workspace (section header, with + button)
  Companies
  People
  Opportunities
  Tasks
  Notes
  Dashboards
  Workflows
  Survey results
  Leads
  Partner Profiles
  Partner Contact Assignments
  Partner Customer Maps
  Partner Attribution Events
  Partner Attribution Snapshots
  Customer Events
  Customer Snapshots
  Partner Plays
  Play Checks
  Play Enrichments
  Play Exclusions
  Discovery Runs
  Partner Candidates
  Check Evaluations
  Enrichment Evaluations

Other (section)
  Settings
  Documentation
```

### Apple-Only Sidebar Items

Apple additionally shows: `Pets`, `Employment Histories`, `Pet Care Agreements` (from its extra custom objects). Apple also has an "Add menu item" button at the bottom.

### Sidebar Customization Panel

Right-click on any sidebar item opens a contextual menu with: Color, Move up, Move down, Move to folder, Add menu item before, Add menu item after, Remove from sidebar.

Feature flags governing this: `IS_NAVIGATION_MENU_ITEM_ENABLED=true`, `IS_NAVIGATION_MENU_ITEM_EDITING_ENABLED=true`.

---

## 4. Feature Flags

Both workspaces have **identical feature flags** (20 each):

| Flag | Value |
|------|-------|
| `IS_AI_ENABLED` | true |
| `IS_APPLICATION_ENABLED` | true |
| `IS_ATTACHMENT_MIGRATED` | true |
| `IS_COMMAND_MENU_ITEM_ENABLED` | true |
| `IS_CORE_PICTURE_MIGRATED` | true |
| `IS_DASHBOARD_V2_ENABLED` | true |
| `IS_DATE_TIME_WHOLE_DAY_FILTER_ENABLED` | true |
| `IS_EMAILING_DOMAIN_ENABLED` | true |
| `IS_FILES_FIELD_MIGRATED` | true |
| `IS_JUNCTION_RELATIONS_ENABLED` | true |
| `IS_MARKETPLACE_ENABLED` | true |
| `IS_NAVIGATION_MENU_ITEM_EDITING_ENABLED` | true |
| `IS_NAVIGATION_MENU_ITEM_ENABLED` | true |
| `IS_NOTE_TARGET_MIGRATED` | true |
| `IS_OTHER_FILE_MIGRATED` | true |
| `IS_PUBLIC_DOMAIN_ENABLED` | true |
| `IS_RECORD_PAGE_LAYOUT_EDITING_ENABLED` | true |
| `IS_ROW_LEVEL_PERMISSION_PREDICATES_ENABLED` | true |
| `IS_TASK_TARGET_MIGRATED` | true |
| `IS_UNIQUE_INDEXES_ENABLED` | false |

---

## 5. Page Layouts

Page layouts are stored in `core.pageLayout` -> `core.pageLayoutTab` -> `core.pageLayoutWidget`.

### Layout Counts

| Type | YC | Apple |
|------|-----|-------|
| RECORD_PAGE | 17 | 22 |
| DASHBOARD | 4 | 3 |
| **Total** | **21** | **25** |

### Apple-Only Layouts

| Layout | Type |
|--------|------|
| Pet (RECORD_PAGE) | Extra custom object |
| Pet Care Agreement (RECORD_PAGE) | Extra custom object |
| Employment History (RECORD_PAGE) | Extra custom object |
| Rocket (RECORD_PAGE) | Extra custom object |
| Customer Dashboard Layout (DASHBOARD) | Extra dashboard |

### Dashboard Layouts (shared)

Both: "My First Dashboard", "Sales Dashboard Layout", "Team Dashboard Layout". Apple additionally has "Customer Dashboard Layout".

### Record Page Tab Structure

All record page layouts share the same tab pattern (Partner Profile as representative):

| Tab | Position | Type |
|-----|----------|------|
| Home | 10 | FIELDS (VERTICAL_LIST widget) |
| Timeline | 20 | CANVAS |
| Tasks | 30 | CANVAS |
| Notes | 40 | CANVAS |
| Files | 50 | CANVAS |
| Emails | 60 | CANVAS |
| Calendar | 70 | CANVAS |

Feature flag: `IS_RECORD_PAGE_LAYOUT_EDITING_ENABLED=true` (beta).

---

## 6. Settings Pages

### Settings Sidebar Structure

```
User
  Profile
  Experience
  Accounts
    Emails
    Calendars

Workspace
  General
  Data model
  Members
  Roles
  Domains
  APIs & Webhooks
  Apps [New]
  AI [New]
  Security

Other
  Admin Panel
  Updates
  Documentation
  Logout

[Advanced toggle at bottom]
```

---

## 7. AI Configuration

### 7.1 AI Settings Page (`/settings/ai`)

The AI settings page has **4 tabs** (from codebase analysis):

#### Tab 1: Models

- **Smart Model selector** — used for chats, agents, and complex reasoning
- **Fast Model selector** — used for lightweight tasks like title generation
- **"Use best models only" toggle** — restricts available models
- **"Automatically mark new models as available" toggle**
- **Models availability section** — searchable list with per-model toggles

#### Tab 2: Skills

- Skills table with search
- Sortable columns
- Activate/deactivate toggles
- Delete functionality

#### Tab 3: Tools

- **Custom Tools section** — logic functions marked as tools (none exist in either workspace)
- **System Tools section** — built-in tools categorized
- **Create new tool button**

#### Tab 4: More

- **System Prompt section** — link to view/customize AI instructions (`/settings/ai/prompts`)
- **MCP Server section** — configuration for MCP client integration (Claude Desktop, Windsurf, Cursor)

### 7.2 Agents

| Property | YC | Apple |
|----------|-----|-------|
| Built-in "Helper" agent | Yes | Yes |
| Custom agents | 1 (`workflowAgent8B21`) | 0 |
| Total agents | 2 | 1 |

#### Helper Agent (identical on both)

| Field | Value |
|-------|-------|
| Name | `helper` |
| Label | `Helper` |
| Description | AI agent specialized in helping users learn how to use Twenty CRM |
| Model | `default-smart-model` |
| Response format | `{"type": "text"}` |
| Is Custom | false |

Prompt summary: Searches Twenty help center documentation to answer how-to questions, feature explanations, setup/config help, troubleshooting, and best practices. Uses `search_help_center` tool.

#### Workflow Agent (YC only)

| Field | Value |
|-------|-------|
| Name | `workflowAgent8B21` |
| Label | `Workflow Agent8b21` |
| Is Custom | true |
| Model | `default-smart-model` |
| Prompt | "You are a helpful AI assistant. Complete the task based on the workflow context." |

#### Agent Settings UI (from codebase)

Agent detail page (`/settings/ai/agents/:agentId`) has **4 tabs**:

1. **Settings** — icon picker, name/label, description, model selector, system prompt
2. **Role** — permission/role assignment
3. **Evals** — evaluation inputs for testing/benchmarking
4. **Logs** — execution logs and debugging

### 7.3 Skills (identical on both — 10 each)

| Skill | Description |
|-------|-------------|
| code-interpreter | Python code execution for data analysis, complex multi-step operations, and efficient bulk processing via MCP bridge |
| dashboard-building | Creating and managing dashboards with widgets and layouts |
| data-manipulation | Searching, filtering, creating, and updating records across all objects |
| docx | Word document creation, editing, template processing, and OOXML manipulation |
| metadata-building | Managing the data model: creating objects, fields, and relations |
| pdf | PDF form filling, field extraction, table parsing, and validation |
| pptx | PowerPoint creation, editing, templates, thumbnails, and slide manipulation |
| research | Finding information and gathering facts from the web |
| workflow-building | Creating and managing automation workflows with triggers and steps |
| xlsx | Excel/spreadsheet creation, editing, and analysis with formulas, formatting, and visualization |

All skills are active (`isActive=true`).

### 7.4 Applications

| Application | Workspace | Source Type | Can Uninstall |
|------------|-----------|-------------|---------------|
| Twenty Standard | Apple | local | No |
| Apple's custom application | Apple | local | No |
| Twenty Standard | YC | local | No |
| YCombinator's custom application | YC | local | No |

### 7.5 Logic Functions (Tools)

Neither workspace has any custom logic functions/tools.

### 7.6 Chat Threads

| Workspace | Agent Turns | Chat Threads |
|-----------|-------------|-------------|
| YC | 2 | Multiple (empty, 0 tokens) |
| Apple | 2 | Multiple (empty, 0 tokens) |

All threads have 0 input/output tokens and 0 conversation size, indicating the chat feature has been opened but not actively used with real conversations.

### 7.7 AI Chat Interface (from codebase)

The AI chat is accessed via the command menu "Ask AI" action. UI structure:

- **Messages area** (scrollable) with user/assistant messages and streaming support
- **Empty state** with prompt suggestions
- **Input box** with:
  - Rich text editor (Tiptap-based)
  - File upload button (drag-and-drop)
  - Context usage indicator
  - Model selector (read-only, shows Smart Model)
  - Send button
- **Message rendering**: code execution display, thinking steps, tool step renderer, terminal output
- **Provider**: `AgentChatProvider` manages chat state

### 7.8 Admin AI Settings

The admin panel (`/settings/admin-panel`) includes server-wide AI configuration:

- **Auto-enable new models toggle**
- **All Models section** with search, filter (unconfigured/deprecated), and per-model enable/disable toggles

---

## 8. Core Database Tables

The `core` schema contains 56 tables. Key AI-related tables:

| Table | Purpose |
|-------|---------|
| `agent` | Agent definitions (name, prompt, model, response format) |
| `agentChatThread` | Chat conversation threads (token tracking) |
| `agentMessage` | Individual messages (role, thread, turn, agent) |
| `agentMessagePart` | Message content parts (text, tool calls, tool outputs, files, sources) |
| `agentTurn` | Agent execution turns within threads |
| `agentTurnEvaluation` | Evaluation scores and comments for agent turns |
| `skill` | AI skill definitions with descriptions |
| `application` | Application registry (Twenty Standard + custom per workspace) |
| `applicationRegistration` | OAuth application registrations |
| `logicFunction` | Custom logic functions/tools |
| `keyValuePair` | Configuration key-value storage |

---

## 9. Summary of Differences

| Dimension | YC | Apple | Impact for Fuse |
|-----------|-----|-------|----------------|
| Custom objects | 47 | 51 (4 extra demos) | None — Fuse uses shared set |
| Agents | 2 (helper + workflow) | 1 (helper only) | YC has workflow agent example |
| Dashboard layouts | 4 | 3 + 1 extra | Minor — dashboards are workspace-specific |
| Sidebar items | Fewer | More (extra objects) | None — driven by objects |
| Skills | 10 (identical) | 10 (identical) | None |
| Feature flags | 20 (identical) | 20 (identical) | None |
| Chat usage | Minimal | Minimal | Neither heavily tested |

### Key Takeaways for Fuse Production

1. **Feature flags are consistent** — both instances have the same flags enabled. Fuse production should match these exactly, particularly `IS_AI_ENABLED`, `IS_NAVIGATION_MENU_ITEM_ENABLED`, `IS_RECORD_PAGE_LAYOUT_EDITING_ENABLED`.

2. **AI infrastructure is present but lightly used** — the Helper agent, 10 skills, and chat interface exist but chat threads show no real usage. This is expected for demo instances.

3. **The agent/skill/tool architecture is extensible** — custom agents can be created per workspace, skills are modular, and logic functions can serve as custom tools. Fuse should leverage this for partner-os specific AI capabilities.

4. **Page layout editing is a beta feature** — `IS_RECORD_PAGE_LAYOUT_EDITING_ENABLED=true` enables customizable record page tabs (Home/Timeline/Tasks/Notes/Files/Emails/Calendar). Fuse partner record pages should follow this pattern.

5. **The MCP integration path exists** — the AI settings "More" tab has MCP Server configuration for Claude Desktop/Windsurf/Cursor integration. This could be relevant for Fuse's AI strategy.

6. **No custom logic functions exist** — the Tools tab infrastructure is ready but neither demo workspace has created custom tools. Fuse could build partner-os specific tools here.
