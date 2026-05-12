// Stub implementations. Replace with real Gmail API calls (googleapis package).
// Each function logs to stderr so the agent's behavior is observable in dev.

const log = (msg: string) => process.stderr.write(`[tool-gmail] ${msg}\n`);

export async function getThread(threadId: string) {
  log(`getThread(${threadId})`);
  return {
    threadId,
    messages: [
      {
        id: `${threadId}-msg-1`,
        from: "user@example.com",
        subject: "Bug in your library",
        body: "Hi, I think there's a bug when calling foo() with an empty array.",
      },
    ],
  };
}

export async function sendReply(threadId: string, body: string) {
  log(`sendReply(thread=${threadId}, body=${body.slice(0, 60)}...)`);
  return { ok: true, messageId: `sent-${Date.now()}` };
}
