import { AsyncLocalStorage } from "node:async_hooks";

// Per-query state that needs to be reachable from in-process MCP tool handlers
// (without threading it through the Agent SDK explicitly). Mutated in place as
// the query runs — e.g. when the system init message arrives we stamp the
// session_id, so the scheduler tool can attach it to any wait it records.
export type RunStore = {
  sessionId: string | null;
};

export const runContext = new AsyncLocalStorage<RunStore>();
