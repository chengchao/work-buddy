import { query } from "@anthropic-ai/claude-agent-sdk";
import * as scheduler from "tool-scheduler";
import { buildMcpServers, expandAllowedTools, ROOT } from "./mcp-clients.ts";
import { runContext } from "./run-context.ts";
import type { Workflow } from "./workflow-loader.ts";

const MODEL = "claude-opus-4-7";

const log = (msg: string) => process.stdout.write(`[agent] ${msg}\n`);

export type RunRequest = {
  workflow: Workflow;
  userPrompt: string;
  resumeSessionId?: string;
};

export async function runWorkflow(req: RunRequest): Promise<string | null> {
  const allowedTools = expandAllowedTools(req.workflow.tools);
  const startedAt = Date.now();
  const store = { sessionId: req.resumeSessionId ?? null };

  return await runContext.run(store, async () => {
    const q = query({
      prompt: req.userPrompt,
      options: {
        model: MODEL,
        // Without cwd, the SDK uses process.cwd() — which is packages/runtime/
        // under `pnpm dev`, so it would fail to find `.claude/skills/` at the
        // repo root. Pin it to the repo root explicitly.
        cwd: ROOT,
        systemPrompt: req.workflow.body,
        mcpServers: buildMcpServers(),
        allowedTools,
        // Agent SDK Skills that this workflow declares. The model loads each
        // skill's full SKILL.md on demand when its description matches the task.
        skills: req.workflow.skills.length > 0 ? req.workflow.skills : undefined,
        permissionMode: "bypassPermissions",
        // We need "project" so the Agent SDK picks up Skills from .claude/skills/.
        // No .claude/settings.json or .claude/agents/ exist in this repo, so
        // "project" effectively only contributes Skills here.
        settingSources: req.workflow.skills.length > 0 ? ["project"] : [],
        resume: req.resumeSessionId,
      },
    });

    let capturedSessionId: string | null = null;

    for await (const msg of q) {
      switch (msg.type) {
        case "system":
          if (msg.subtype === "init") {
            capturedSessionId = msg.session_id;
            store.sessionId = msg.session_id;
            log(
              `session ${msg.session_id.slice(0, 8)}… ` +
                `tools=${msg.tools.length} skills=${msg.skills?.length ?? 0} ` +
                `mcp=${msg.mcp_servers.map((s) => `${s.name}:${s.status}`).join(",")}`,
            );
          }
          break;

        case "assistant":
          for (const block of msg.message.content) {
            if (block.type === "text" && block.text.trim()) {
              log(`text: ${block.text.trim().slice(0, 200)}`);
            } else if (block.type === "tool_use") {
              log(`tool ${block.name}(${JSON.stringify(block.input).slice(0, 120)})`);
            }
          }
          break;

        case "result":
          if (msg.subtype === "success") {
            log(
              `workflow '${req.workflow.name}' done ` +
                `(${msg.num_turns} turns, $${msg.total_cost_usd.toFixed(4)})`,
            );
          } else {
            log(`workflow '${req.workflow.name}' ended: ${msg.subtype}`);
          }
          break;
      }
    }

    // Stamp the session id onto any waits this run created so the future
    // resume can pass `resume: sessionId` and the agent picks up its own
    // prior context instead of starting fresh.
    if (capturedSessionId) {
      scheduler.bindSessionToWaitsIn(capturedSessionId, startedAt, Date.now() + 1000);
    }

    return capturedSessionId;
  });
}
