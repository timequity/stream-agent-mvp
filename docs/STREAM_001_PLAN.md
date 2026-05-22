# Stream 001 Plan

## Title

Справится ли AI собрать помощника для стрима? OBS, голос, агенты

## Date

24 May 2026, 15:00 MSK

## Main Question

Справится ли этот AI-сетап помочь подготовить MVP помощника для стрима?

Primary setup: ChatGPT Project + Codex + GitHub repo + human operator review.

Stream 001 does not require comparing multiple setups. The verdict should be about this setup, not about AI in general.

## 1. Intro

Frame the stream as Episode 0 / Live Lab of **"Справится ли AI? / Can AI Handle This?"**.

Explain the format briefly:

task → setup → criteria → AI attempt → human review → scorecard → verdict

The episode is about checking whether this AI setup can help create the operating base for a streaming assistant, not about shipping a production system.

## 2. Task and Success Criteria

Task: create a minimal repo and docs base for the AI streaming assistant MVP.

Success criteria:

- repo exists as the source of truth;
- README explains the public format and MVP boundary;
- project brief defines the tool roles and experiment mechanic;
- the tested setup is explicit;
- Stream 001 plan has a clear structure;
- final verdict is about the tested setup, not AI in general;
- decisions are recorded;
- no implementation code, dependencies, API clients, secrets, stream keys, tokens, or private URLs are added.

## 3. ChatGPT Project + GitHub Repo

Test one primary setup:

- ChatGPT Project for planning/context;
- Codex for small docs tasks;
- GitHub repo as the source of truth;
- human operator review for constraints, usefulness, and verdict.

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

- Did this setup handle the task?
- What worked?
- What failed?
- How much human control was needed?
- What should be done manually next time?
- What should change in the next setup?

## Fallback

If AI tools fail, continue with the normal microphone and manual explanation. The stream should still finish with a human-readable summary, scorecard, and verdict.

## Safety

Do not show `.env`, API keys, stream keys, tokens, private URLs, local credentials, personal data, private dashboards, or private repository settings on stream.
