import { Database } from "bun:sqlite";
import { randomUUID } from "node:crypto";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DB_PATH =
  process.env.WB_SCHEDULER_DB ?? resolve(__dirname, "..", "..", "..", "data", "scheduler.db");

const db = new Database(DB_PATH);
db.exec("PRAGMA journal_mode = WAL");
db.exec(`
  CREATE TABLE IF NOT EXISTS pending_waits (
    id              TEXT PRIMARY KEY,
    event_type      TEXT NOT NULL,
    filter_json     TEXT NOT NULL,
    resume_workflow TEXT NOT NULL,
    resume_context  TEXT NOT NULL,
    session_id      TEXT,
    expires_at      INTEGER NOT NULL,
    created_at      INTEGER NOT NULL
  );
  CREATE INDEX IF NOT EXISTS idx_pending_waits_event_type
    ON pending_waits(event_type);
`);

export type PendingWait = {
  id: string;
  event_type: string;
  filter_json: string;
  resume_workflow: string;
  resume_context: string;
  session_id: string | null;
  expires_at: number;
  created_at: number;
};

export type WaitForEventArgs = {
  eventType: string;
  filter: Record<string, unknown>;
  timeoutSeconds: number;
  resumeWorkflow: string;
  resumeContext: string;
  sessionId?: string | null;
};

export function waitForEvent(args: WaitForEventArgs) {
  const id = `wait_${randomUUID()}`;
  const now = Date.now();
  db.prepare(
    `INSERT INTO pending_waits
     (id, event_type, filter_json, resume_workflow, resume_context, session_id, expires_at, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
  ).run(
    id,
    args.eventType,
    JSON.stringify(args.filter),
    args.resumeWorkflow,
    args.resumeContext,
    args.sessionId ?? null,
    now + args.timeoutSeconds * 1000,
    now,
  );
  return { wait_id: id, expires_at: now + args.timeoutSeconds * 1000 };
}

// Best-effort: stamp the agent session ID onto every wait that was created
// during a known time window and doesn't already have one. Called by the
// runtime after a query finishes. Not concurrency-safe across overlapping
// queries with similar timing — fine for the scaffold.
export function bindSessionToWaitsIn(sessionId: string, fromMs: number, toMs: number) {
  db.prepare(
    `UPDATE pending_waits
     SET session_id = ?
     WHERE session_id IS NULL
       AND created_at >= ?
       AND created_at <= ?`,
  ).run(sessionId, fromMs, toMs);
}

export function findMatchingWaits(
  eventType: string,
  eventData: Record<string, unknown>,
): PendingWait[] {
  const rows = db
    .prepare(
      `SELECT * FROM pending_waits
       WHERE event_type = ? AND expires_at > ?`,
    )
    .all(eventType, Date.now()) as PendingWait[];

  return rows.filter((row) => {
    const filter = JSON.parse(row.filter_json) as Record<string, unknown>;
    return Object.entries(filter).every(([k, v]) => eventData[k] === v);
  });
}

export function deleteWait(id: string) {
  db.prepare(`DELETE FROM pending_waits WHERE id = ?`).run(id);
}

export function findExpiredWaits(): PendingWait[] {
  return db
    .prepare(`SELECT * FROM pending_waits WHERE expires_at <= ?`)
    .all(Date.now()) as PendingWait[];
}

export function listPending(): PendingWait[] {
  return db.prepare(`SELECT * FROM pending_waits ORDER BY created_at DESC`).all() as PendingWait[];
}
