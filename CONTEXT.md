# Work Buddy

Work Buddy is an application that helps an Executive turn Intent into
accountable, trackable work through a Chief of Staff and AI Employees.

## Language

**Executive**:
The primary person using Work Buddy to direct work and review outcomes.
_Avoid_: Manager, operator, requester

**Intent**:
The outcome an Executive wants before it has been translated into a request to
an Accountable Owner.
_Avoid_: Prompt, query, command

**Accountable Owner**:
The single AI Employee expected to answer for achieving the outcome of a
Routed Request.
_Avoid_: Contact, assignee, recipient

**AI Employee**:
A persistent AI agent with a defined role that can accept ownership of work
and report its outcomes within the Executive's control boundaries.
_Avoid_: Bot, tool, workflow, disposable agent

**Chief of Staff**:
The permanent built-in AI agent that is the Executive's default interface,
supervises all AI Employees, and consolidates matters that need attention.
_Avoid_: Work Buddy, AI Employee, bot, coordinator

**Supporting Employee**:
An AI Employee that contributes to a Routed Request without becoming its
Accountable Owner.
_Avoid_: Co-owner, collaborator, helper agent

**Capacity State**:
A qualitative indication of whether an AI Employee can accept more work:
Available, Working, or At capacity.
_Avoid_: Utilization percentage, token limit, concurrency count

**Attention Item**:
A matter the Chief of Staff brings to the Executive because it needs Approval,
judgment, or a response to work that is at risk.
_Avoid_: Notification, alert, inbox item

**Employee Definition**:
The Executive-approved identity and scope of an AI Employee: its name, role,
responsibility, capabilities, access limits, and Chief of Staff supervision.
_Avoid_: Profile, configuration, system prompt

**Retirement**:
The permanent end of an AI Employee's ability to receive work while its
history remains available as evidence.
_Avoid_: Deletion, removal, termination

**Owner Recommendation**:
Work Buddy's proposal of the AI Employee most likely to be the Accountable
Owner for an Intent.
_Avoid_: Search result, candidate, match

**Routing Confidence**:
Work Buddy's qualitative assessment of how strongly available evidence
supports an Owner Recommendation.
_Avoid_: Confidence score, probability, match percentage

**Routed Request**:
A well-scoped request addressed to an Accountable Owner, with the expected
outcome and follow-up conditions made explicit.
_Avoid_: Message, task, assignment

**Routed Request State**:
The durable lifecycle position of a Routed Request: Proposed, Queued, Working,
Blocked, Completed, or Cancelled.
_Avoid_: Activity, progress percentage, attention status

**At Risk**:
A warning that a Queued or Working Routed Request is likely to miss its
expected outcome or deadline without stopping the work.
_Avoid_: Blocked, failed, delayed

**Revision**:
A material change to an approved Routed Request that preserves the prior
version, pauses the work, and returns it to Proposed for new Approval.
_Avoid_: Edit, overwrite, restart

**Follow-through**:
The observable progress of a Routed Request from confirmation through its
eventual outcome.
_Avoid_: Activity, status tracking

**External Action**:
An action that communicates outside Work Buddy, changes shared state, commits
resources, or deletes data.
_Avoid_: Tool call, write operation, side effect

**Approval**:
The Executive's permission for Work Buddy to perform a specific Routed Request
and the follow-up actions shown with it. A changed plan or escalation requires
new permission.
_Avoid_: Confirmation click, authorization token
