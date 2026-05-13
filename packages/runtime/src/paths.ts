import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

export const ROOT = resolve(__dirname, "..", "..", "..");
export const WORKFLOWS_DIR = process.env.WB_WORKFLOWS_DIR ?? resolve(ROOT, "workflows");
