import * as scheduler from "tool-scheduler";
import { runWorkflow } from "./agent.ts";
import type { Workflow } from "./workflow-loader.ts";

const log = (msg: string) => process.stdout.write(`[dispatch] ${msg}\n`);

// Skill descriptions in .claude/skills/handle-*/SKILL.md match these prefixes
// literally — that's how the agent picks the right skill on resume. Keep in sync.
const RESUMING_WAIT_PREFIX = "[RESUMING WAIT]";
const WAIT_TIMED_OUT_PREFIX = "[WAIT TIMED OUT]";

export type IncomingEvent = {
  type: string;
  data: Record<string, unknown>;
};

export async function dispatchEvent(
  workflows: Map<string, Workflow>,
  event: IncomingEvent,
): Promise<void> {
  const matchingWaits = scheduler.findMatchingWaits(event.type, event.data);
  const triggered = [...workflows.values()].filter((w) => w.triggers.includes(event.type));
  log(
    `event ${event.type}: ${matchingWaits.length} wait(s) matched, ` +
      `${triggered.length} workflow(s) match triggers`,
  );

  // Resume any waiting workflows. We pass resume: wait.session_id so the
  // agent picks up its prior conversation (issue creation, link, first reply)
  // instead of starting fresh.
  for (const wait of matchingWaits) {
    scheduler.deleteWait(wait.id);
    const workflow = workflows.get(wait.resume_workflow);
    if (!workflow) {
      log(`wait ${wait.id} references unknown workflow '${wait.resume_workflow}'`);
      continue;
    }
    const prompt = [
      RESUMING_WAIT_PREFIX,
      `You previously scheduled a wait with this context:`,
      wait.resume_context,
      ``,
      `The event you were waiting for has arrived:`,
      JSON.stringify(event, null, 2),
      ``,
      `Continue the workflow from where you left off.`,
    ].join("\n");
    runWorkflow({
      workflow,
      userPrompt: prompt,
      resumeSessionId: wait.session_id ?? undefined,
    }).catch((e) => log(`resume failed for wait ${wait.id}: ${e.message}`));
  }

  // Fresh trigger-matched runs are suppressed when a wait already handled
  // this event. A wait IS the response — firing both causes duplicate work
  // and races on was_replied/mark_replied.
  if (matchingWaits.length > 0) {
    if (triggered.length > 0) {
      log(`suppressing ${triggered.length} fresh trigger(s) — wait already handled this event`);
    }
    return;
  }

  for (const workflow of triggered) {
    const prompt = [
      `An event of type '${event.type}' just arrived. Handle it per your instructions.`,
      ``,
      `Event payload:`,
      JSON.stringify(event, null, 2),
    ].join("\n");
    runWorkflow({ workflow, userPrompt: prompt }).catch((e) =>
      log(`workflow '${workflow.name}' failed: ${e.message}`),
    );
  }
}

// Periodically fire expired waits as synthetic timeouts.
export function startWaker(workflows: Map<string, Workflow>, intervalMs = 30_000) {
  const tick = () => {
    const expired = scheduler.findExpiredWaits();
    for (const wait of expired) {
      scheduler.deleteWait(wait.id);
      const workflow = workflows.get(wait.resume_workflow);
      if (!workflow) continue;
      const prompt = [
        WAIT_TIMED_OUT_PREFIX,
        `You previously scheduled a wait with this context:`,
        wait.resume_context,
        ``,
        `The timeout has elapsed without the event arriving. Decide how to`,
        `proceed — close out the workflow, retry, escalate, or do nothing.`,
      ].join("\n");
      log(`firing timeout for wait ${wait.id}`);
      runWorkflow({
        workflow,
        userPrompt: prompt,
        resumeSessionId: wait.session_id ?? undefined,
      }).catch((e) => log(`timeout-resume failed: ${e.message}`));
    }
  };
  const handle = setInterval(tick, intervalMs);
  return () => clearInterval(handle);
}
