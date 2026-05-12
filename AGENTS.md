# Repository Guidelines

## Project Structure & Module Organization

This is a pnpm TypeScript monorepo for a skill-based agent runtime. Source code lives under
`packages/`, with one package per runtime or MCP tool:

- `packages/runtime/` contains the HTTP server, event dispatch, skill loading, and Agent SDK glue.
- `packages/contracts/` defines shared Zod event schemas.
- `packages/tool-gmail/`, `packages/tool-github/`, `packages/tool-correlation/`, and
  `packages/tool-scheduler/` contain MCP tool implementations.
- `skills/*.md` contains workflow definitions with frontmatter triggers and allowed tools.
- `data/` is for local SQLite state and is excluded from formatting and versioned source.

## Build, Test, and Development Commands

Use Node 22+ and pnpm 9.

```sh
pnpm install          # install workspace dependencies
pnpm dev              # start the runtime on PORT, default 3000
pnpm typecheck        # run tsc --noEmit across all packages
pnpm check            # run Biome lint + format checks
pnpm check:fix        # apply Biome fixes
pnpm format           # format files with Biome
pnpm lint             # run Biome lint only
pnpm mcp:gmail        # run a tool MCP server standalone
pnpm mcp:github
pnpm mcp:correlation
pnpm mcp:scheduler
```

## Coding Style & Naming Conventions

The repository uses ESM TypeScript and Biome. Follow `biome.json`: 2-space indentation,
double quotes, semicolons, trailing commas, and 100-character line width. Prefer `node:`
built-in imports. Package names are lowercase and hyphenated, while shared scoped packages use
`@wb/*` only where already established. Keep tool APIs split between `src/lib.ts` for behavior
and `src/mcp.ts` for MCP wiring.

## Testing Guidelines

There is no automated test suite yet. Before submitting changes, run:

```sh
pnpm check:fix && pnpm typecheck
```

For runtime behavior, start `pnpm dev` and exercise `/events` with the sample curl payloads in
`README.md`. If adding tests, place them near the package they validate and use clear names such
as `dispatch.test.ts` or `scheduler.test.ts`.

## Commit & Pull Request Guidelines

The current history uses concise imperative commit messages, for example
`Scaffold work-buddy: skill-based agent runtime`. Keep commits focused and describe the user-facing
or architectural change. Pull requests should include a short summary, validation commands run,
linked issues when relevant, and screenshots or logs for observable workflow changes.

## Agent-Specific Notes

Do not bypass package ownership of state: `tool-correlation` owns `correlation.db`, and
`tool-scheduler` owns `scheduler.db`. When adding MCP tools, update the tool package, the
`SERVER_TOOLS` map in `packages/runtime/src/mcp-clients.ts`, and the relevant skill frontmatter.

## LLM Coding Guidelines

These behavioral guidelines reduce common LLM coding mistakes. They bias toward caution over
speed; for trivial tasks, use judgment.

### Think Before Coding

Do not assume or hide confusion. Before implementing, state assumptions explicitly. If multiple
interpretations exist, present them instead of choosing silently. If a simpler approach exists,
say so and push back when warranted. If something is unclear, stop, name what is confusing, and ask.

### Simplicity First

Write the minimum code that solves the problem. Do not add features, abstractions, flexibility,
configuration, or speculative error handling that was not requested. If a 200-line change could be
50 lines, simplify it.

### Surgical Changes

Touch only what the request requires. Do not improve adjacent code, comments, or formatting, and do
not refactor unrelated code. Match the existing style even if you would choose differently. Remove
imports, variables, or functions made unused by your changes, but do not delete pre-existing dead
code unless asked. Every changed line should trace directly to the request.

### Goal-Driven Execution

Turn tasks into verifiable goals and loop until checked. For example, "fix the bug" means reproduce
it with a test or clear command, implement the fix, then verify it passes. For multi-step work, state
a brief plan with a verification check for each step:

```text
1. [Step] -> verify: [check]
2. [Step] -> verify: [check]
3. [Step] -> verify: [check]
```

These guidelines are working when diffs contain fewer unnecessary changes, solutions are less
overcomplicated, and clarifying questions come before implementation mistakes.
