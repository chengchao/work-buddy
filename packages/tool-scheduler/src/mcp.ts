#!/usr/bin/env tsx
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import * as scheduler from "./lib.ts";

const server = new Server(
  { name: "wb-scheduler", version: "0.1.0" },
  { capabilities: { tools: {} } },
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: "wait_for_event",
      description: [
        "Schedule a durable wait for an external event. Use this when a workflow",
        "needs to react to something that happens later (e.g. 'when this issue closes,",
        "notify the user'). The wait persists across process restarts.",
        "After calling this tool, end your turn — the runtime will re-invoke the",
        "skill with the resume_context when the event arrives or the timeout expires.",
      ].join(" "),
      inputSchema: {
        type: "object",
        properties: {
          event_type: {
            type: "string",
            description: "Event to wait for (e.g. 'github.issue.closed', 'gmail.received')",
          },
          filter: {
            type: "object",
            description:
              'Exact-match filter over event.data. Example: {"issueUrl": "https://github.com/owner/repo/issues/42"}',
            additionalProperties: true,
          },
          timeout_seconds: {
            type: "integer",
            description:
              "Maximum wait time. After this elapses, the wait fires anyway with a timeout flag.",
            minimum: 60,
            maximum: 60 * 60 * 24 * 90,
          },
          resume_skill: {
            type: "string",
            description: "The skill file (e.g. 'email-handler') to re-invoke when the wait fires.",
          },
          resume_context: {
            type: "string",
            description:
              "A short note to your future self explaining what was scheduled and what to do when resumed. The runtime will replay this as a user message.",
          },
        },
        required: ["event_type", "filter", "timeout_seconds", "resume_skill", "resume_context"],
      },
    },
    {
      name: "list_pending_waits",
      description: "Debug helper: list all currently-scheduled waits.",
      inputSchema: { type: "object", properties: {} },
    },
  ],
}));

server.setRequestHandler(CallToolRequestSchema, async (req) => {
  const args = req.params.arguments as Record<string, unknown>;
  let result: unknown;
  switch (req.params.name) {
    case "wait_for_event":
      result = scheduler.waitForEvent({
        eventType: args.event_type as string,
        filter: (args.filter as Record<string, unknown>) ?? {},
        timeoutSeconds: args.timeout_seconds as number,
        resumeSkill: args.resume_skill as string,
        resumeContext: args.resume_context as string,
      });
      break;
    case "list_pending_waits":
      result = scheduler.listPending();
      break;
    default:
      throw new Error(`unknown tool: ${req.params.name}`);
  }
  return { content: [{ type: "text", text: JSON.stringify(result) }] };
});

await server.connect(new StdioServerTransport());
