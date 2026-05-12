import * as scheduler from "tool-scheduler";
import { runSkill } from "./agent.ts";
import type { Skill } from "./skill-loader.ts";

const log = (msg: string) => process.stdout.write(`[dispatch] ${msg}\n`);

export type IncomingEvent = {
  type: string;
  data: Record<string, unknown>;
};

export async function dispatchEvent(
  skills: Map<string, Skill>,
  event: IncomingEvent,
): Promise<void> {
  const matchingWaits = scheduler.findMatchingWaits(event.type, event.data);
  const triggered = [...skills.values()].filter((s) => s.triggers.includes(event.type));
  log(
    `event ${event.type}: ${matchingWaits.length} wait(s) matched, ` +
      `${triggered.length} skill(s) match triggers`,
  );

  // Resume any waiting workflows. We pass resume: wait.session_id so the
  // agent picks up its prior conversation (issue creation, link, first reply)
  // instead of starting fresh.
  for (const wait of matchingWaits) {
    scheduler.deleteWait(wait.id);
    const skill = skills.get(wait.resume_skill);
    if (!skill) {
      log(`wait ${wait.id} references unknown skill '${wait.resume_skill}'`);
      continue;
    }
    const prompt = [
      `[RESUMING WAIT]`,
      `You previously scheduled a wait with this context:`,
      wait.resume_context,
      ``,
      `The event you were waiting for has arrived:`,
      JSON.stringify(event, null, 2),
      ``,
      `Continue the workflow from where you left off.`,
    ].join("\n");
    runSkill({
      skill,
      userPrompt: prompt,
      resumeSessionId: wait.session_id ?? undefined,
    }).catch((e) => log(`resume failed for wait ${wait.id}: ${e.message}`));
  }

  // Fresh trigger-matched runs.
  for (const skill of triggered) {
    const prompt = [
      `An event of type '${event.type}' just arrived. Handle it per your instructions.`,
      ``,
      `Event payload:`,
      JSON.stringify(event, null, 2),
    ].join("\n");
    runSkill({ skill, userPrompt: prompt }).catch((e) =>
      log(`skill '${skill.name}' failed: ${e.message}`),
    );
  }
}

// Periodically fire expired waits as synthetic timeouts.
export function startWaker(skills: Map<string, Skill>, intervalMs = 30_000) {
  const tick = () => {
    const expired = scheduler.findExpiredWaits();
    for (const wait of expired) {
      scheduler.deleteWait(wait.id);
      const skill = skills.get(wait.resume_skill);
      if (!skill) continue;
      const prompt = [
        `[WAIT TIMED OUT]`,
        `You previously scheduled a wait with this context:`,
        wait.resume_context,
        ``,
        `The timeout has elapsed without the event arriving. Decide how to`,
        `proceed — close out the workflow, retry, escalate, or do nothing.`,
      ].join("\n");
      log(`firing timeout for wait ${wait.id}`);
      runSkill({
        skill,
        userPrompt: prompt,
        resumeSessionId: wait.session_id ?? undefined,
      }).catch((e) => log(`timeout-resume failed: ${e.message}`));
    }
  };
  const handle = setInterval(tick, intervalMs);
  return () => clearInterval(handle);
}
