#!/usr/bin/env bun
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import * as gmail from "./lib.ts";

const server = new Server({ name: "wb-gmail", version: "0.1.0" }, { capabilities: { tools: {} } });

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: "get_thread",
      description: "Fetch a Gmail thread by ID (returns sender, subject, body).",
      inputSchema: {
        type: "object",
        properties: { thread_id: { type: "string" } },
        required: ["thread_id"],
      },
    },
    {
      name: "send_reply",
      description: "Send a reply on a Gmail thread. Use this to respond to a user.",
      inputSchema: {
        type: "object",
        properties: {
          thread_id: { type: "string" },
          body: { type: "string", description: "Reply body (plain text)" },
        },
        required: ["thread_id", "body"],
      },
    },
  ],
}));

server.setRequestHandler(CallToolRequestSchema, async (req) => {
  const args = req.params.arguments as Record<string, unknown>;
  let result: unknown;
  switch (req.params.name) {
    case "get_thread":
      result = await gmail.getThread(args.thread_id as string);
      break;
    case "send_reply":
      result = await gmail.sendReply(args.thread_id as string, args.body as string);
      break;
    default:
      throw new Error(`unknown tool: ${req.params.name}`);
  }
  return { content: [{ type: "text", text: JSON.stringify(result) }] };
});

await server.connect(new StdioServerTransport());
