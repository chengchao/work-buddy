import { readdir, readFile } from "node:fs/promises";
import { basename, dirname, extname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SKILLS_DIR = process.env.WB_SKILLS_DIR ?? resolve(__dirname, "..", "..", "..", "skills");

export type Skill = {
  name: string;
  triggers: string[];
  tools: string[];
  body: string;
};

export async function loadSkills(): Promise<Map<string, Skill>> {
  const files = await readdir(SKILLS_DIR);
  const skills = new Map<string, Skill>();
  for (const f of files) {
    if (extname(f) !== ".md") continue;
    const raw = await readFile(resolve(SKILLS_DIR, f), "utf8");
    const { data, content } = matter(raw);
    const name = basename(f, ".md");
    skills.set(name, {
      name,
      triggers: Array.isArray(data.triggers) ? data.triggers : [],
      tools: Array.isArray(data.tools) ? data.tools : [],
      body: content.trim(),
    });
  }
  return skills;
}
