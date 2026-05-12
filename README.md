# work-buddy

An agent runtime. Workflows are markdown files; tools are MCP servers; Agent SDK Skills carry reusable domain knowledge. The agent (Claude Opus 4.7) reads a workflow, loads relevant Skills on demand, calls tools, and can durably wait for external events.

## Architecture

```
              ┌──────────────────┐
HTTP events ─▶│      runtime      │
              │ ─ workflow loader │   query() + mcpServers config
              │ ─ event router    │ ──────────────────────────▶ tool-gmail (stdio)
              │ ─ Claude Agent SDK│ ──────────────────────────▶ tool-github (stdio)
              │ ─ waker (timer)   │ ──────────────────────────▶ tool-correlation (stdio)
              │ ─ scheduler (lib) │   createSdkMcpServer →      tool-scheduler (in-process)
              └──────────────────┘                                │
                                                                  ▼
                                                          scheduler.db
                                                         correlation.db
```

- **Workflows** (`workflows/*.md`) define triggers, an allowed tool list, optional Agent SDK Skills, and prose instructions. Each workflow is the system prompt the agent runs against when its trigger fires.
- **Tools** are MCP servers under `packages/tool-*/`. Gmail/GitHub/Correlation run as stdio subprocesses spawned by the Agent SDK per query. Scheduler is in-process via `createSdkMcpServer`.
- **Agent SDK Skills** (`.claude/skills/<name>/SKILL.md`) are reusable knowledge modules the model loads on demand based on each Skill's description. They are distinct from workflows: a workflow is gated by an event trigger and is loaded eagerly as the system prompt; a Skill is gated by task relevance and is loaded by the model when needed.
- **Scheduler** is the engine reified as a tool. `wait_for_event` persists a pending wait in SQLite (with the originating session ID); the runtime resumes the same session when a matching event arrives.
- **Correlation** owns the mapping table from GitHub issues to source threads + users.

The agent loop is owned by `@anthropic-ai/claude-agent-sdk` (`query()`). The runtime translates workflow frontmatter (`tools: [send_reply, ...]`) into the SDK's MCP-prefixed `allowedTools` (`mcp__gmail__send_reply`, …), and passes the workflow's `skills:` list to the SDK's Skills loader.

## Setup

Requires Node 22+ and pnpm.

```sh
pnpm install
cp .env.example .env   # then add ANTHROPIC_API_KEY
pnpm dev
```

You should see `[runtime] listening on http://localhost:3000`.

## Lint, format, typecheck

```sh
pnpm check          # biome check (lint + format dry-run)
pnpm check:fix      # biome check --write (apply fixes)
pnpm format         # biome format --write
pnpm lint           # biome lint
pnpm typecheck      # tsc --noEmit across all packages
```

Biome config is in `biome.json` (2-space indent, double quotes, 100-char line width). It respects `.gitignore`, so `data/`, `node_modules/`, and `*.db` are excluded automatically.

## Exercise the email → issue → close-notification flow

In a second terminal, send a fake email-received event:

```sh
curl -X POST http://localhost:3000/events \
  -H "content-type: application/json" \
  -d '{
    "type": "gmail.received",
    "data": {
      "threadId": "thread-abc",
      "messageId": "msg-1",
      "from": "alice@example.com",
      "subject": "Bug: foo() crashes on empty array",
      "body": "When I call foo([]) it throws TypeError instead of returning null."
    }
  }'
```

Watch the runtime logs. You should see:
- `[agent] tool create_issue(...)`
- `[agent] tool link(...)`
- `[agent] tool send_reply(...)`
- `[agent] tool wait_for_event(...)`
- `[agent] workflow 'email-handler' done`

The agent has paused waiting for the issue to close. Inspect the pending wait:

```sh
sqlite3 data/scheduler.db "SELECT id, event_type, resume_workflow, resume_context FROM pending_waits"
```

Now fire the close event with the issue URL the agent created (check tool-github logs — issues are numbered starting at 101):

```sh
curl -X POST http://localhost:3000/events \
  -H "content-type: application/json" \
  -d '{
    "type": "github.issue.closed",
    "data": {
      "issueUrl": "https://github.com/example/repo/issues/101",
      "issueNumber": 101,
      "title": "Bug: foo() crashes on empty array"
    }
  }'
```

You should see the agent resume, look up the correlation, and call `send_reply` again.

## Layout

```
work-buddy/
├── workflows/
│   └── email-handler.md              # event-triggered workflow definitions
├── .claude/skills/
│   └── writing-github-issues/        # Agent SDK Skill (loaded by model on demand)
│       └── SKILL.md
├── packages/
│   ├── contracts/                    # zod event schemas
│   ├── tool-gmail/                   # MCP server + lib (stubbed)
│   ├── tool-github/                  # MCP server + lib (stubbed)
│   ├── tool-correlation/             # MCP server, owns correlation.db
│   ├── tool-scheduler/               # MCP server + lib, owns scheduler.db
│   └── runtime/                      # HTTP + MCP client + agent loop
└── data/                             # SQLite files live here (gitignored)
```

## Running tools standalone

Each tool is a working MCP server you can connect to from Claude Desktop or `mcp-inspector`:

```sh
pnpm mcp:gmail        # tsx packages/tool-gmail/src/mcp.ts
pnpm mcp:github
pnpm mcp:correlation
pnpm mcp:scheduler
```

To wire one into Claude Desktop, point its MCP config at the absolute path of any `tool-*/src/mcp.ts` (or `wb-*-mcp` bin after `pnpm install`).

## Wiring real APIs

The `lib.ts` files in each `tool-*` package contain stub implementations that return fake data and log to stderr. Replace them with real API calls:

- `tool-gmail/src/lib.ts` — `googleapis` + a refresh-token flow
- `tool-github/src/lib.ts` — `octokit`
- `tool-discord/src/...` — not built; add as `packages/tool-discord/` mirroring gmail

The MCP server wrapper (`mcp.ts`) doesn't need to change.

## Adding a trigger

Triggers normalize provider-specific events into the schemas in `packages/contracts/src/events.ts`, then POST them to `/events`. The included `/webhooks/github` handler is a minimal example — a real one would verify the HMAC signature.

For Gmail watch and Discord gateway, run them as separate processes that POST to the runtime. They aren't included in the scaffold.

## Adding a workflow

Drop a new `.md` file in `workflows/` with frontmatter listing triggers, an allowed tool list, and optionally Agent SDK Skills:

```yaml
---
triggers:
  - some.event.type
tools:
  - send_reply
  - create_issue
skills:
  - writing-github-issues
---
```

The runtime loads workflows at startup (no hot-reload — restart to pick up changes).

## Adding an Agent SDK Skill

Create `.claude/skills/<skill-name>/SKILL.md` with frontmatter:

```yaml
---
name: <skill-name>
description: <when the model should load this skill>
---

# Skill body
```

The description is the prompt the model uses to decide whether to read the full file. Make it specific about *when* to invoke. Then reference the skill from a workflow's `skills:` list.

## Design notes

- **Workflows are not Agent SDK Skills.** Workflows are event-routed system prompts loaded eagerly by the runtime. Skills are model-loaded knowledge modules that activate based on the description matching the task. The runtime uses both: workflow as system prompt, Skills as on-demand context.
- **One owner per piece of state.** `tool-correlation` is the only thing that opens `correlation.db`; `tool-scheduler` owns `scheduler.db`. The scheduler is in-process inside the runtime via `createSdkMcpServer` because the engine and the runtime need to share the same SQLite handle without cross-process coordination.
- **Sessions are first-class.** Each agent run gets a session ID from the Agent SDK. When the agent calls `wait_for_event`, the runtime records that session ID on the pending wait. On resume, `query()` is called with `resume: sessionId` so the agent picks up its prior turns (issue creation, link, first reply) as actual conversation history — not a synthetic `resume_context` prose summary. The `resume_context` is still passed as a user message for the agent to read; the session is the durable memory.
- **Idempotency lives in the workflow.** The workflow prose tells the agent to call `was_replied`/`mark_replied` on resume paths. The engine doesn't enforce this — if you don't trust the agent to be disciplined, move the check into the `send_reply` tool itself.
- **Allowed-tools translation.** Workflows list short tool names (`send_reply`); the runtime expands them to MCP-prefixed names (`mcp__gmail__send_reply`) via a hard-coded server→tools map in `mcp-clients.ts`. If you add a tool, update that map.
