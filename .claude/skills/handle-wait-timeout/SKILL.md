---
name: handle-wait-timeout
description: Use this skill when resuming because a previously-scheduled wait timed out (prompt is prefixed `[WAIT TIMED OUT]`). Covers the one-shot status reply to the original thread and the rule against rescheduling another wait.
---

# Handling a wait timeout

You scheduled a wait that did not fire within the timeout. You are resuming with `[WAIT TIMED OUT]` and your prior `resume_context`.

## Sequence

1. From the `resume_context`, identify the gmail thread id and what was being awaited (e.g. an issue close).
2. Call `send_reply` on that thread with a short status update — note that the issue is still open and you'll stop watching it.
3. End your turn.

## Rules

- **Do not reschedule another `wait_for_event`.** One timeout is enough; chaining them is how silent infinite loops happen.
- **Do not call `was_replied` / `mark_replied`.** Those guard the resolution path. A timeout is a different event and shouldn't collide with a future legitimate close.
- If the `resume_context` does not contain enough information to identify the thread, end your turn without sending anything rather than guessing.
