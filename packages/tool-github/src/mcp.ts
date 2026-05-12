#!/usr/bin/env tsx
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import * as github from "./lib.ts";

const server = new Server({ name: "wb-github", version: "0.1.0" }, { capabilities: { tools: {} } });

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: "create_issue",
      description: "Create a new GitHub issue. Returns the issue URL and number.",
      inputSchema: {
        type: "object",
        properties: {
          repo: { type: "string", description: "owner/repo" },
          title: { type: "string" },
          body: { type: "string" },
        },
        required: ["repo", "title", "body"],
      },
    },
    {
      name: "comment_on_issue",
      description: "Post a comment on an existing GitHub issue.",
      inputSchema: {
        type: "object",
        properties: {
          issue_url: { type: "string" },
          body: { type: "string" },
        },
        required: ["issue_url", "body"],
      },
    },
    {
      name: "get_issue",
      description: "Fetch the current state of an issue (title, state, etc.).",
      inputSchema: {
        type: "object",
        properties: { issue_url: { type: "string" } },
        required: ["issue_url"],
      },
    },
  ],
}));

server.setRequestHandler(CallToolRequestSchema, async (req) => {
  const args = req.params.arguments as Record<string, unknown>;
  let result: unknown;
  switch (req.params.name) {
    case "create_issue":
      result = await github.createIssue({
        repo: args.repo as string,
        title: args.title as string,
        body: args.body as string,
      });
      break;
    case "comment_on_issue":
      result = await github.commentOnIssue({
        issueUrl: args.issue_url as string,
        body: args.body as string,
      });
      break;
    case "get_issue":
      result = await github.getIssue(args.issue_url as string);
      break;
    default:
      throw new Error(`unknown tool: ${req.params.name}`);
  }
  return { content: [{ type: "text", text: JSON.stringify(result) }] };
});

await server.connect(new StdioServerTransport());
