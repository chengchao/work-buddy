# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Working norms

**Tradeoff:** These guidelines bias toward caution over speed. For trivial tasks, use judgment.

### 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them — don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

### 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

### 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it — don't delete it.

When your changes create orphans:
- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: every changed line should trace directly to the user's request.

### 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:

```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

**These guidelines are working if:** fewer unnecessary changes in diffs, fewer rewrites due to overcomplication, and clarifying questions come before implementation rather than after mistakes.

## Commands

```sh
pnpm install          # bootstrap all workspace packages
pnpm dev              # start the runtime (HTTP server on PORT, default 3000)
pnpm typecheck        # tsc --noEmit across every package
pnpm check            # biome check (lint + format dry-run)
pnpm check:fix        # biome check --write (apply fixes)
pnpm format           # biome format --write
pnpm lint             # biome lint only

# Run any tool's MCP server standalone (for mcp-inspector or Claude Desktop):
pnpm mcp:gmail
pnpm mcp:github
pnpm mcp:correlation
pnpm mcp:scheduler
```

There is no test suite yet. Pre-commit baseline: `pnpm check:fix && pnpm typecheck`.

Requires Node 22+ (uses `node:` builtins and modern ESM). `ANTHROPIC_API_KEY` must be set for agent calls — the runtime boots without it but the agent path 401s.

## Architecture

An event-routed agent runtime. Each incoming event triggers an LLM agent that follows a markdown **workflow** (the system prompt), can load on-demand **Agent SDK Skills** for reusable domain knowledge, and calls MCP tools. The agent loop is owned by `@anthropic-ai/claude-agent-sdk` — **do not reach for `@anthropic-ai/sdk` directly**; the raw SDK was used in an earlier iteration and intentionally removed.

### Workflows ≠ Agent SDK Skills

These are different abstractions despite both using markdown + frontmatter. Don't confuse them in code or docs:

| | Workflow (`workflows/*.md`) | Agent SDK Skill (`.claude/skills/<name>/SKILL.md`) |
|---|---|---|
| Loaded by | Runtime, eagerly, based on event triggers | Model, on demand, when the description matches the task |
| Format | One file = entire system prompt for the run | Folder with `SKILL.md` + supporting files |
| Frontmatter | `triggers`, `tools`, `skills` | `name`, `description` |
| Purpose | "When event X arrives, do Y" (routing + workflow) | "When working on task type X, here's the knowledge" |
| Passed to `query()` as | `systemPrompt: workflow.body` | `skills: workflow.skills` (requires `settingSources: ["project"]`) |

When a workflow declares `skills: [foo, bar]`, the runtime sets `settingSources: ["project"]` so the Agent SDK picks them up from `.claude/skills/`. If a workflow declares no skills, `settingSources: []` is used (no filesystem-resolved Claude Code settings bleed in).

### Package layout (pnpm monorepo)

- `packages/contracts/` — zod schemas for normalized events (`gmail.received`, `github.issue.closed`, …). The discriminated union `AnyEvent` is the wire contract triggers POST to `/events`.
- `packages/tool-{gmail,github}/` — stub MCP servers (lib.ts returns fake data, logs to stderr). Replace `lib.ts` with real API clients when wiring real integrations; `mcp.ts` doesn't need to change.
- `packages/tool-correlation/` — owns `data/correlation.db`. MCP tools for linking GitHub issues ↔ source threads + idempotency receipts.
- `packages/tool-scheduler/` — owns `data/scheduler.db`. Persists `wait_for_event` calls so workflows survive process restarts.
- `packages/runtime/` — HTTP server (Hono), workflow loader, event dispatcher, the Agent SDK glue.
- `workflows/` — workflow definitions as `.md` with frontmatter (`triggers:`, `tools:`, `skills:`). Loaded at startup; no hot-reload.
- `.claude/skills/<name>/SKILL.md` — Agent SDK Skills referenced from workflow `skills:` lists.

### Critical asymmetry: scheduler is in-process, other tools are stdio subprocesses

The runtime must call `scheduler.findMatchingWaits` directly when each event arrives (see `dispatch.ts`). If the scheduler ran as a subprocess, two processes would need to coordinate writes to `scheduler.db` — the in-process agent's `wait_for_event` calls and the runtime's session-binding updates. Avoiding that is why `mcp-clients.ts` uses `createSdkMcpServer({ tools: [tool(...)] })` for the scheduler while gmail/github/correlation are `type: "stdio"` configs (spawned by the Agent SDK per `query()`).

A standalone `tool-scheduler/src/mcp.ts` does exist for Claude Desktop integration. The runtime does **not** use it.

### Tool-name translation

Workflows list short tool names in frontmatter (`tools: [send_reply, ...]`). The Agent SDK expects MCP-prefixed names in `allowedTools` (`mcp__gmail__send_reply`). Translation happens in `runtime/src/mcp-clients.ts` via the `SERVER_TOOLS` constant — **this is the source of truth for which server owns which tool. Update it when adding a tool.**

### Session resume

When the agent calls `wait_for_event`, the runtime records the originating Agent SDK session ID on the pending wait (`resume_workflow`, `session_id`, and `resume_context` columns). When a matching event arrives later, `dispatchEvent` calls `runWorkflow({..., resumeSessionId: wait.session_id})` which passes `resume: sessionId` into `query()` — the resumed agent picks up its prior conversation (issue creation, link, first reply) as actual history, not a synthetic summary.

The session ID is captured two ways for robustness:
1. `runContext` (AsyncLocalStorage in `runtime/src/run-context.ts`) — set inline when the `system.init` message arrives, read by the in-process scheduler tool handler when it stores a wait.
2. `scheduler.bindSessionToWaitsIn(...)` — a post-run backfill in `agent.ts` that catches anything (1) missed.

`resume_context` (a prose note from the agent to its future self) is also passed as a user message on resume — belt-and-suspenders alongside the session.

### State ownership

One owner per SQLite file. `tool-correlation/src/lib.ts` is the only thing that opens `correlation.db`. `tool-scheduler/src/lib.ts` is the only thing that opens `scheduler.db` — but it runs in the runtime process (because of the asymmetry above), so the runtime can `import * as scheduler from "tool-scheduler"` and call it directly. Do not bypass these libraries to read from the DBs elsewhere.

The scheduler lib runs an idempotent migration on boot: `ALTER TABLE pending_waits RENAME COLUMN resume_skill TO resume_workflow` if the old column is present. Pre-existing DB files keep working.

### Triggers

There is no separate `trigger-*` package in the scaffold. Triggers are HTTP routes on the runtime (`/events`, `/webhooks/github`) that normalize provider-specific payloads into `AnyEvent`. Real Gmail watch / Discord gateway would be standalone processes POSTing to `/events`.

### Agent configuration

- Model: `claude-opus-4-7` with `thinking: { type: "adaptive" }` and `effort: "xhigh"` (per claude-api skill guidance for agentic workloads).
- `permissionMode: "bypassPermissions"` — no human-in-the-loop in this scaffold.
- `settingSources`: `[]` if the workflow declares no skills, `["project"]` if it does. The Skills loader is the only reason `"project"` is ever set; we don't want other Claude Code project settings bleeding in.

## Common gotchas

- **Don't conflate workflows and Skills.** See the table above. The word "skill" by itself is ambiguous — say "workflow" or "Agent SDK Skill" explicitly.
- **Don't add the raw Anthropic SDK back.** All Claude calls go through `query()` from `@anthropic-ai/claude-agent-sdk`.
- **Don't make `mcp-clients.ts` rebuild the config per query.** `buildMcpServers()` caches; the in-process scheduler instance must be shared across queries.
- **Workspace package imports.** `runtime` imports `tool-scheduler` as a workspace package (`"tool-scheduler": "workspace:*"`) and `@wb/contracts` (note the `@wb/` scope is only on contracts). Other tool packages aren't imported by the runtime — they're spawned as stdio subprocesses.
- **`zod` peer dep warning is benign.** Agent SDK declares a peer dep on `zod@^4.0.0` but works with the `3.x` we have. If something breaks, that's the first thing to check.
- **Adding a tool requires three edits**: the tool's `lib.ts` + `mcp.ts`, the `SERVER_TOOLS` map in `runtime/src/mcp-clients.ts`, and the workflow frontmatter `tools:` list. Forgetting `SERVER_TOOLS` is silent — the agent just won't have access.
- **Adding a Skill requires two edits**: create `.claude/skills/<name>/SKILL.md` with `name`/`description` frontmatter, and reference it from a workflow's `skills:` list. The description is what the model uses to decide whether to load — write it about *when* to use the skill.
