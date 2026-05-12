import { readdir, readFile } from "node:fs/promises";
import { basename, dirname, extname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";

const __dirname = dirname(fileURLToPath(import.meta.url));
const WORKFLOWS_DIR =
  process.env.WB_WORKFLOWS_DIR ?? resolve(__dirname, "..", "..", "..", "workflows");

export type Workflow = {
  name: string;
  triggers: string[];
  tools: string[];
  /**
   * Agent SDK Skills to make available to the agent while this workflow runs.
   * Skills are loaded by the model on demand based on their description — they
   * provide reusable domain knowledge (e.g. how to write a good issue title)
   * that's orthogonal to the workflow's routing logic.
   */
  skills: string[];
  body: string;
};

export async function loadWorkflows(): Promise<Map<string, Workflow>> {
  const files = await readdir(WORKFLOWS_DIR);
  const workflows = new Map<string, Workflow>();
  for (const f of files) {
    if (extname(f) !== ".md") continue;
    const raw = await readFile(resolve(WORKFLOWS_DIR, f), "utf8");
    const { data, content } = matter(raw);
    const name = basename(f, ".md");
    workflows.set(name, {
      name,
      triggers: Array.isArray(data.triggers) ? data.triggers : [],
      tools: Array.isArray(data.tools) ? data.tools : [],
      skills: Array.isArray(data.skills) ? data.skills : [],
      body: content.trim(),
    });
  }
  return workflows;
}
