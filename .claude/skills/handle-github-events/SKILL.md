---
name: handle-github-events
description: Use this skill when the incoming event type starts with `github.` (e.g. `github.issue.closed`, `github.issue.commented`). Covers the resume path after a wait fires — idempotency check, correlation lookup, notifying the originating source thread, and recording the reply.
---

# Handling GitHub events

You are invoked with an event whose type begins with `github.`. By design, fresh GitHub events only reach the agent when they match a wait that was scheduled earlier (the runtime suppresses fresh trigger fires when a wait matched). So the prompt will be prefixed `[RESUMING WAIT]` and contain your prior `resume_context`.

## `github.issue.closed` — resume and notify

1. Parse the issue URL from the event payload.
2. Call `was_replied` with `event_key = "issue:<issue_url>:closed"`. If `true`, you already notified — do nothing, end your turn. This guards against duplicate webhook deliveries.
3. Call `find_by_issue` to look up which source thread this issue originated from. The result tells you the `source` (e.g. `"gmail"`), `source_ref` (e.g. the gmail thread id), and `user_ref` (e.g. sender email).
4. Send a resolution reply on that source:
   - If `source === "gmail"`: call `send_reply` with `thread_id = source_ref` and a short note that the issue is resolved, referencing the issue URL.
   - For other sources (when their tools land): use the corresponding `send_*` tool on `source_ref`.
5. Call `mark_replied` with the same event_key from step 2.
6. End your turn.

## `github.issue.commented` — resume and notify (when needed)

Same pattern as `github.issue.closed`. Use an event_key like `"issue:<issue_url>:comment:<comment_id>"` so each comment notification is idempotent on its own.

## Rules

- The `was_replied` check is non-negotiable. Webhook redelivery is normal, not exceptional.
- `mark_replied` must come **after** a successful send — never before. If the send fails and you've already marked, a retry won't fire.
- Don't invent issue URLs, thread IDs, or user refs. Read them from the event payload and the `find_by_issue` result.
