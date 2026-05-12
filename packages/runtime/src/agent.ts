import { query } from "@anthropic-ai/claude-agent-sdk";
import * as scheduler from "tool-scheduler";
import { buildMcpServers, expandAllowedTools } from "./mcp-clients.ts";
import { runContext } from "./run-context.ts";
import type { Skill } from "./skill-loader.ts";

const MODEL = "claude-opus-4-7";

const log = (msg: string) => process.stdout.write(`[agent] ${msg}\n`);

export type RunRequest = {
  skill: Skill;
  userPrompt: string;
  resumeSessionId?: string;
};

export async function runSkill(req: RunRequest): Promise<string | null> {
  const allowedTools = expandAllowedTools(req.skill.tools);
  const startedAt = Date.now();
  const store = { sessionId: req.resumeSessionId ?? null };

  return await runContext.run(store, async () => {
    const q = query({
      prompt: req.userPrompt,
      options: {
        model: MODEL,
        systemPrompt: req.skill.body,
        mcpServers: buildMcpServers(),
        allowedTools,
        permissionMode: "bypassPermissions",
        // We provide a custom system prompt; we don't want filesystem-resolved
        // user/project/local Claude Code settings bleeding in.
        settingSources: [],
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
                `tools=${msg.tools.length} mcp=${msg.mcp_servers
                  .map((s) => `${s.name}:${s.status}`)
                  .join(",")}`,
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
              `skill '${req.skill.name}' done ` +
                `(${msg.num_turns} turns, $${msg.total_cost_usd.toFixed(4)})`,
            );
          } else {
            log(`skill '${req.skill.name}' ended: ${msg.subtype}`);
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
