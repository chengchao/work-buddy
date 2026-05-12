import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import Database from "better-sqlite3";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DB_PATH =
  process.env.WB_CORRELATION_DB ?? resolve(__dirname, "..", "..", "..", "data", "correlation.db");

const db = new Database(DB_PATH);
db.pragma("journal_mode = WAL");
db.exec(`
  CREATE TABLE IF NOT EXISTS correlations (
    issue_url   TEXT PRIMARY KEY,
    source      TEXT NOT NULL,
    source_ref  TEXT NOT NULL,
    user_ref    TEXT NOT NULL,
    created_at  INTEGER NOT NULL
  );
  CREATE INDEX IF NOT EXISTS idx_correlations_source_ref
    ON correlations(source, source_ref);

  CREATE TABLE IF NOT EXISTS reply_receipts (
    event_key   TEXT PRIMARY KEY,
    replied_at  INTEGER NOT NULL
  );
`);

export type Correlation = {
  issue_url: string;
  source: string;
  source_ref: string;
  user_ref: string;
  created_at: number;
};

export function link(args: {
  issueUrl: string;
  source: string;
  sourceRef: string;
  userRef: string;
}) {
  db.prepare(
    `INSERT OR REPLACE INTO correlations
     (issue_url, source, source_ref, user_ref, created_at)
     VALUES (?, ?, ?, ?, ?)`,
  ).run(args.issueUrl, args.source, args.sourceRef, args.userRef, Date.now());
  return { ok: true };
}

export function findByIssue(issueUrl: string): Correlation | null {
  return (
    (db.prepare(`SELECT * FROM correlations WHERE issue_url = ?`).get(issueUrl) as
      | Correlation
      | undefined) ?? null
  );
}

export function findBySource(source: string, sourceRef: string): Correlation | null {
  return (
    (db
      .prepare(`SELECT * FROM correlations WHERE source = ? AND source_ref = ?`)
      .get(source, sourceRef) as Correlation | undefined) ?? null
  );
}

export function wasReplied(eventKey: string): boolean {
  return db.prepare(`SELECT 1 FROM reply_receipts WHERE event_key = ?`).get(eventKey) !== undefined;
}

export function markReplied(eventKey: string) {
  db.prepare(`INSERT OR IGNORE INTO reply_receipts (event_key, replied_at) VALUES (?, ?)`).run(
    eventKey,
    Date.now(),
  );
  return { ok: true };
}
