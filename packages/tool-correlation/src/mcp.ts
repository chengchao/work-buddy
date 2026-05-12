#!/usr/bin/env tsx
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import * as corr from "./lib.ts";

const server = new Server(
  { name: "wb-correlation", version: "0.1.0" },
  { capabilities: { tools: {} } },
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: "link",
      description:
        "Record that a GitHub issue was created from a specific source (e.g. Gmail thread). Call this immediately after creating an issue so the system can route follow-ups back to the original user.",
      inputSchema: {
        type: "object",
        properties: {
          issue_url: { type: "string" },
          source: {
            type: "string",
            description: "Source system identifier",
            enum: ["gmail", "discord"],
          },
          source_ref: {
            type: "string",
            description: "Source-specific reference (e.g. Gmail thread id)",
          },
          user_ref: {
            type: "string",
            description: "How to reach the originating user (email, discord id)",
          },
        },
        required: ["issue_url", "source", "source_ref", "user_ref"],
      },
    },
    {
      name: "find_by_issue",
      description:
        "Look up the original source for a GitHub issue. Use this when handling an issue update to find who to notify.",
      inputSchema: {
        type: "object",
        properties: { issue_url: { type: "string" } },
        required: ["issue_url"],
      },
    },
    {
      name: "was_replied",
      description:
        "Check whether a reply has already been sent for a given event key (idempotency check before sending notifications).",
      inputSchema: {
        type: "object",
        properties: {
          event_key: {
            type: "string",
            description: "Unique key for the event, e.g. 'issue:123:closed'",
          },
        },
        required: ["event_key"],
      },
    },
    {
      name: "mark_replied",
      description:
        "Record that a reply has been sent for a given event key. Always call this immediately after sending a reply.",
      inputSchema: {
        type: "object",
        properties: { event_key: { type: "string" } },
        required: ["event_key"],
      },
    },
  ],
}));

server.setRequestHandler(CallToolRequestSchema, async (req) => {
  const args = req.params.arguments as Record<string, unknown>;
  let result: unknown;
  switch (req.params.name) {
    case "link":
      result = corr.link({
        issueUrl: args.issue_url as string,
        source: args.source as string,
        sourceRef: args.source_ref as string,
        userRef: args.user_ref as string,
      });
      break;
    case "find_by_issue":
      result = corr.findByIssue(args.issue_url as string);
      break;
    case "was_replied":
      result = { replied: corr.wasReplied(args.event_key as string) };
      break;
    case "mark_replied":
      result = corr.markReplied(args.event_key as string);
      break;
    default:
      throw new Error(`unknown tool: ${req.params.name}`);
  }
  return { content: [{ type: "text", text: JSON.stringify(result) }] };
});

await server.connect(new StdioServerTransport());
