import { resolve } from "node:path";
import { createSdkMcpServer, type McpServerConfig, tool } from "@anthropic-ai/claude-agent-sdk";
import * as scheduler from "tool-scheduler";
import { z } from "zod";
import { ROOT } from "./paths.ts";
import { runContext } from "./run-context.ts";

// Which short tool names each MCP server provides. This is the source of
// truth for `allowedTools` translation from workflow frontmatter.
export const SERVER_TOOLS: Record<string, string[]> = {
  gmail: ["get_thread", "send_reply"],
  github: ["create_issue", "comment_on_issue", "get_issue"],
  correlation: ["link", "find_by_issue", "was_replied", "mark_replied"],
  scheduler: ["wait_for_event"],
};

const STDIO_SUBPROCESSES = [
  { id: "gmail", path: "packages/tool-gmail/src/mcp.ts" },
  { id: "github", path: "packages/tool-github/src/mcp.ts" },
  { id: "correlation", path: "packages/tool-correlation/src/mcp.ts" },
];

// Built once at runtime startup. The scheduler instance is shared across
// queries; stdio configs are static (the Agent SDK spawns subprocesses
// per query() — that's the cost of process isolation).
let cached: Record<string, McpServerConfig> | null = null;

export function buildMcpServers(): Record<string, McpServerConfig> {
  if (cached) return cached;

  const config: Record<string, McpServerConfig> = {};

  for (const { id, path } of STDIO_SUBPROCESSES) {
    config[id] = {
      type: "stdio",
      command: "bun",
      args: [resolve(ROOT, path)],
    };
  }

  config.scheduler = createSdkMcpServer({
    name: "scheduler",
    tools: [
      tool(
        "wait_for_event",
        [
          "Schedule a durable wait for an external event. Use when a workflow",
          "needs to react to something that happens later (e.g. 'when this issue",
          "closes, notify the user'). The wait survives process restarts.",
          "After calling this tool, end your turn — the runtime will resume the",
          "session when a matching event arrives or the timeout expires.",
        ].join(" "),
        {
          event_type: z
            .string()
            .describe("Event to wait for, e.g. 'github.issue.closed' or 'gmail.received'"),
          filter: z
            .record(z.unknown())
            .describe("Exact-match filter over event.data. e.g. { issueUrl: 'https://...' }"),
          timeout_seconds: z.number().int().min(60),
          resume_workflow: z.string().describe("Which workflow to re-invoke when this wait fires."),
          resume_context: z
            .string()
            .describe("Note to your future self explaining what to do on resume."),
        },
        async (args) => {
          const result = scheduler.waitForEvent({
            eventType: args.event_type,
            filter: args.filter as Record<string, unknown>,
            timeoutSeconds: args.timeout_seconds,
            resumeWorkflow: args.resume_workflow,
            resumeContext: args.resume_context,
            sessionId: runContext.getStore()?.sessionId ?? null,
          });
          return {
            content: [{ type: "text", text: JSON.stringify(result) }],
          };
        },
      ),
    ],
  });

  cached = config;
  return config;
}

// Translate the workflow's short tool names (e.g. "send_reply") into the full
// MCP-prefixed names the Agent SDK uses for allowedTools (e.g.
// "mcp__gmail__send_reply").
export function expandAllowedTools(shortNames: string[]): string[] {
  const result: string[] = [];
  for (const short of shortNames) {
    for (const [server, tools] of Object.entries(SERVER_TOOLS)) {
      if (tools.includes(short)) {
        result.push(`mcp__${server}__${short}`);
      }
    }
  }
  return result;
}
