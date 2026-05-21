# Stream 001 Plan

## Title

Справится ли AI собрать помощника для стрима? OBS, голос, агенты

## Date

24 May 2026, 15:00 MSK

## Main Question

Can AI help build the MVP container for an AI streaming assistant?

## 1. Intro

Frame the stream as Episode 0 / Live Lab of **"Справится ли AI? / Can AI Handle This?"**.

Explain the format briefly:

task → criteria → AI attempt → human review → scorecard → verdict

The episode is about checking whether AI can help create the operating base for a streaming assistant, not about shipping a production system.

## 2. Task and Success Criteria

Task: create a minimal repo and docs base for the AI streaming assistant MVP.

Success criteria:

- repo exists as the source of truth;
- README explains the public format and MVP boundary;
- project brief defines the tool roles and experiment mechanic;
- Stream 001 plan has a clear structure;
- decisions are recorded;
- no implementation code, dependencies, API clients, secrets, stream keys, tokens, or private URLs are added.

## 3. ChatGPT Project + GitHub Repo

Use ChatGPT for planning/context and GitHub as the source of truth.

Show the repo structure at a high level:

- `README.md`
- `docs/PROJECT_BRIEF.md`
- `docs/STREAM_001_PLAN.md`
- `docs/DECISIONS.md`

Keep the repo docs-first. Do not turn the stream into package setup or infrastructure work.

## 4. Codex Task

Use Codex for a small bounded docs task:

- initialize the repo if needed;
- create or update the four docs files;
- keep changes readable;
- commit and publish the docs-only repo when ready.

Codex should not add implementation code, package metadata, dependencies, API clients, secrets, or generated artifacts.

## 5. Operator Mode Review

Review the result as an operator, not as a tool demo:

- Is the task clear?
- Are success criteria explicit?
- Is the repo usable as source of truth?
- Did AI stay inside the requested scope?
- Did the output avoid secrets and private data?
- Is the next step obvious?

## 6. OBS / Voice / Summaries Roadmap

Roadmap after Stream 001:

- OBS: define the minimal live production setup.
- Speech-to-text: test capture options for live speech input.
- Summaries: produce post-stream notes and decisions.
- Voice: test assistant voice responses only after the input and summary loop is stable.
- Agent loop: keep AI tasks small, reviewable, and reversible.

## 7. Scorecard

Score each item from 0 to 2:

| Criterion | Score | Notes |
| --- | ---: | --- |
| Task stayed bounded | TBD |  |
| Repo became usable source of truth | TBD |  |
| Docs explain the public format | TBD |  |
| MVP scope stayed clear | TBD |  |
| No secrets or private data exposed | TBD |  |
| Next step is clear | TBD |  |

## 8. Verdict

Verdict to fill after the stream:

- Can AI handle this?
- What worked?
- What failed?
- What should be done manually next time?

## Fallback

If AI tools fail, continue with the normal microphone and manual explanation. The stream should still finish with a human-readable summary, scorecard, and verdict.

## Safety

Do not show `.env`, API keys, stream keys, tokens, credentials, private dashboards, private repository settings, or private URLs on stream.
