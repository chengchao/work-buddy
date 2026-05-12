import { z } from "zod";

export const GmailReceivedEvent = z.object({
  type: z.literal("gmail.received"),
  data: z.object({
    threadId: z.string(),
    messageId: z.string(),
    from: z.string(),
    subject: z.string(),
    body: z.string(),
  }),
});

export const GithubIssueClosedEvent = z.object({
  type: z.literal("github.issue.closed"),
  data: z.object({
    issueUrl: z.string(),
    issueNumber: z.number(),
    title: z.string(),
    closedBy: z.string().optional(),
  }),
});

export const GithubIssueCommentedEvent = z.object({
  type: z.literal("github.issue.commented"),
  data: z.object({
    issueUrl: z.string(),
    issueNumber: z.number(),
    commentBody: z.string(),
    commentAuthor: z.string(),
  }),
});

export const DiscordMessageEvent = z.object({
  type: z.literal("discord.message.received"),
  data: z.object({
    channelId: z.string(),
    messageId: z.string(),
    authorId: z.string(),
    body: z.string(),
  }),
});

export const AnyEvent = z.discriminatedUnion("type", [
  GmailReceivedEvent,
  GithubIssueClosedEvent,
  GithubIssueCommentedEvent,
  DiscordMessageEvent,
]);

export type AnyEvent = z.infer<typeof AnyEvent>;
export type EventType = AnyEvent["type"];
