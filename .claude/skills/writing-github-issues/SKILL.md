---
name: writing-github-issues
description: Use this skill when drafting a GitHub issue title or body — especially when filing an issue based on a user-reported bug from an email, chat, or other unstructured source. Provides patterns for clear titles, structured bodies, and how to preserve user wording.
---

# Writing GitHub Issues

## Titles

Format: `<Kind>: <one-line description in present tense>`

- `Bug: foo() throws TypeError when called with empty array`
- `Feature: support batch mode in foo()`
- `Question: how to configure rate limits`

**Avoid:**
- Vague titles (`bug in code`, `not working`)
- Titles describing the fix instead of the symptom (`Add null check to foo`)
- Titles longer than ~80 chars

## Bodies

Structure, in order:

1. **Summary** — one paragraph explaining the user-visible problem.
2. **Steps to reproduce** — numbered, copy-pasteable. Include exact inputs.
3. **Expected behavior** — what should happen.
4. **Actual behavior** — what does happen, with error messages quoted verbatim.
5. **Environment** — versions, OS, anything load-bearing.

Skip sections that don't apply. Feature requests usually skip steps/expected/actual; questions usually skip everything but Summary.

## When the report comes from a user (email, chat, etc.)

- Lead with a one-sentence summary you write yourself — don't paste the whole user message at the top.
- Quote the original user message verbatim in a collapsible `<details>` block at the bottom:
  ```markdown
  <details>
  <summary>Original message from user</summary>

  <quoted text>

  </details>
  ```
- In Steps to reproduce, preserve the user's exact phrasing for inputs (function names, argument values, error strings). Literal wording matters for searchability and later bug triage.
- Don't editorialize the user's report. If they say "it crashes", don't change it to "it throws an exception" unless you have evidence of which one is accurate.
- If the user's description is ambiguous (e.g. they say "doesn't work"), note the ambiguity rather than guessing what they meant.

## What goes in the body vs. the title

Body, not title:
- Stack traces
- Code samples
- Multiple repro paths

Title, not body:
- The symptom in a few words
- Just enough to make duplicate-search productive
