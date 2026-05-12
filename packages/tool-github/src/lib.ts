// Stub implementations. Replace with real GitHub API calls (octokit).

const log = (msg: string) => process.stderr.write(`[tool-github] ${msg}\n`);
let stubIssueCounter = 100;

export async function createIssue(args: { repo: string; title: string; body: string }) {
  const number = ++stubIssueCounter;
  const url = `https://github.com/${args.repo}/issues/${number}`;
  log(`createIssue(${args.repo}, "${args.title}") -> ${url}`);
  return { url, number, title: args.title };
}

export async function commentOnIssue(args: { issueUrl: string; body: string }) {
  log(`commentOnIssue(${args.issueUrl}, "${args.body.slice(0, 40)}...")`);
  return { ok: true };
}

export async function getIssue(issueUrl: string) {
  log(`getIssue(${issueUrl})`);
  return { url: issueUrl, state: "open", title: "(stub) example issue" };
}
