import { serve } from "@hono/node-server";
import { AnyEvent } from "@wb/contracts";
import { Hono } from "hono";
import { dispatchEvent, startWaker } from "./dispatch.ts";
import { buildMcpServers, SERVER_TOOLS } from "./mcp-clients.ts";
import { loadSkills } from "./skill-loader.ts";

const log = (msg: string) => process.stdout.write(`[runtime] ${msg}\n`);

async function main() {
  if (!process.env.ANTHROPIC_API_KEY) {
    log("ANTHROPIC_API_KEY not set — agent calls will fail");
  }

  const skills = await loadSkills();
  log(`loaded ${skills.size} skill(s): ${[...skills.keys()].join(", ") || "(none)"}`);

  // Eagerly construct the cached mcpServers config so the in-process scheduler
  // tool is wired up before any event arrives.
  buildMcpServers();
  log(
    `tool surface: ${Object.entries(SERVER_TOOLS)
      .map(([s, ts]) => `${s}[${ts.length}]`)
      .join(" ")}`,
  );

  const stopWaker = startWaker(skills);

  const app = new Hono();

  app.get("/", (c) =>
    c.json({
      ok: true,
      skills: [...skills.keys()],
      servers: Object.keys(SERVER_TOOLS),
      tools: Object.values(SERVER_TOOLS).flat(),
    }),
  );

  app.post("/events", async (c) => {
    const body = await c.req.json();
    const parsed = AnyEvent.safeParse(body);
    if (!parsed.success) {
      return c.json({ ok: false, error: parsed.error.flatten() }, 400);
    }
    dispatchEvent(skills, parsed.data).catch((e) => log(`dispatch error: ${e.message}`));
    return c.json({ ok: true, accepted: parsed.data.type });
  });

  // Real handler would verify X-Hub-Signature-256 before parsing body.
  app.post("/webhooks/github", async (c) => {
    const ghEvent = c.req.header("X-GitHub-Event");
    const body = await c.req.json();
    if (ghEvent === "issues" && body.action === "closed") {
      dispatchEvent(skills, {
        type: "github.issue.closed",
        data: {
          issueUrl: body.issue.html_url,
          issueNumber: body.issue.number,
          title: body.issue.title,
          closedBy: body.sender?.login,
        },
      }).catch((e) => log(`dispatch error: ${e.message}`));
    }
    return c.json({ ok: true });
  });

  const port = Number(process.env.PORT ?? 3000);
  const server = serve({ fetch: app.fetch, port });
  log(`listening on http://localhost:${port}`);

  const shutdown = async () => {
    log("shutting down");
    stopWaker();
    server.close();
    process.exit(0);
  };
  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
