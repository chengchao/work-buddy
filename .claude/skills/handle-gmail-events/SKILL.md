---
name: handle-gmail-events
description: Use this skill when the incoming event type starts with `gmail.` (currently `gmail.received`). Covers classifying an inbound email into bug-report / question / ignore and the exact tool sequence for each branch, including scheduling a follow-up wait when a bug becomes a GitHub issue.
---

# Handling Gmail events

You are invoked with an event whose type begins with `gmail.`. The user prompt contains the event payload (thread id, sender, subject, body).

## `gmail.received` — classify and route

Decide which category the email falls into and execute the corresponding tool sequence.

### bug report

The user is reporting that something is broken, crashes, returns wrong output, or otherwise misbehaves.

1. Call `create_issue` targeting `example/repo` (scaffold default). For title/body conventions, load the `writing-github-issues` skill.
2. Call `link` to record the mapping from the new issue URL to the email thread:
   - `source: "gmail"`
   - `source_ref: <gmail thread id>`
   - `user_ref: <sender email>`
3. Call `send_reply` on the thread confirming you filed the issue. Include the issue URL.
4. Call `wait_for_event` to schedule a follow-up for when the issue closes:
   - `event_type: "github.issue.closed"`
   - `filter: { issueUrl: <the created issue URL> }`
   - `timeout_seconds: 2592000` (30 days)
   - `resume_workflow: "main"`
   - `resume_context: "Filed issue <URL> from gmail thread <id> for <email>. When it closes, reply to that thread confirming resolution."`
5. End your turn.

### question / clarification

The user asked something but did not report a bug. Reply directly via `send_reply`. No issue, no wait. End your turn.

### ignore

Newsletter, automated mail, calendar invite, obviously off-topic. Do nothing. End your turn.

### Disambiguation

- "doesn't work", "broken", "crashes", "throws", "wrong result" → bug report.
- "how do I", "can you", "what does" → question.
- Marketing copy, no salutation, unsubscribe footer → ignore.

If ambiguous between bug and question, prefer question — filing a no-op issue is more expensive to undo than a missed file.
