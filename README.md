# work-buddy

A skill-based agent runtime. Workflows are markdown files; tools are MCP servers; the agent (Claude Opus 4.7) reads a skill, calls tools, and can durably wait for external events.

## Architecture

```
              ┌──────────────────┐
HTTP events ─▶│      runtime      │
              │ ─ skill loader    │   query() + mcpServers config
              │ ─ event router    │ ──────────────────────────▶ tool-gmail (stdio)
              │ ─ Claude Agent SDK│ ──────────────────────────▶ tool-github (stdio)
              │ ─ waker (timer)   │ ──────────────────────────▶ tool-correlation (stdio)
              │ ─ scheduler (lib) │   createSdkMcpServer →      tool-scheduler (in-process)
              └──────────────────┘                                │
                                                                  ▼
                                                          scheduler.db
                                                         correlation.db
```

- **Skills** (`skills/*.md`) define triggers, tool allowlist, and prose instructions.
- **Tools** are MCP servers under `packages/tool-*/`. Gmail/GitHub/Correlation run as stdio subprocesses spawned by the Agent SDK per query. Scheduler is in-process via `createSdkMcpServer`.
- **Scheduler** is the engine reified as a tool. `wait_for_event` persists a pending wait in SQLite (with the originating session ID); the runtime resumes the same session when a matching event arrives.
- **Correlation** owns the mapping table from GitHub issues to source threads + users.

The agent loop is owned by `@anthropic-ai/claude-agent-sdk` (`query()`). The runtime translates skill frontmatter (`tools: [send_reply, ...]`) into the SDK's MCP-prefixed `allowedTools` (`mcp__gmail__send_reply`, …).

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
- `[agent] skill 'email-handler' completed (end_turn)`

The agent has paused waiting for the issue to close. Inspect the pending wait via SQLite:

```sh
sqlite3 data/scheduler.db "SELECT id, event_type, resume_context FROM pending_waits"
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
├── skills/
│   └── email-handler.md              # workflow definitions
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

## Adding a skill

Drop a new `.md` file in `skills/` with frontmatter listing triggers and an allowed tool list. The runtime hot-loads at startup (no hot-reload yet — restart to pick up changes).

## Design notes

See the conversation that produced this scaffold for the reasoning. Key points:

- **One owner per piece of state.** `tool-correlation` is the only thing that opens `correlation.db`; `tool-scheduler` owns `scheduler.db`. The scheduler is in-process inside the runtime via `createSdkMcpServer` because the engine and the runtime need to share the same SQLite handle without cross-process coordination.
- **Sessions are first-class.** Each agent run gets a session ID from the Agent SDK. When the agent calls `wait_for_event`, the runtime records that session ID on the pending wait. On resume, `query()` is called with `resume: sessionId` so the agent picks up its prior turns (issue creation, link, first reply) as actual conversation history — not a synthetic `resume_context` prose summary. The `resume_context` is still passed as a user message for the agent to read; the session is the durable memory.
- **Idempotency lives in the skill.** The skill prose tells the agent to call `was_replied`/`mark_replied` on resume paths. The engine doesn't enforce this — if you don't trust the agent to be disciplined, move the check into the `send_reply` tool itself.
- **Allowed-tools translation.** Skills list short tool names (`send_reply`); the runtime expands them to MCP-prefixed names (`mcp__gmail__send_reply`) via a hard-coded server→tools map in `mcp-clients.ts`. If you add a tool, update that map.
