# Format Protocol

## 1. Public format

Name: **"Справится ли AI? / Can AI Handle This?"**

Public framing: **"Реальные задачи • AI-сетапы • честный вердикт"**

## 2. Core principle

We test real tasks with AI, but the verdict is always about the specific setup used for the task, not about AI in general.

The format should avoid universal claims like "AI can do this" or "AI cannot do this". A useful verdict says whether this model, context, toolchain, workflow, and human review loop handled this concrete task.

## 3. What is an AI setup?

An AI setup is the concrete combination used during an episode:

- model;
- prompt / task brief;
- context;
- files;
- repo;
- tools;
- browser/search if used;
- memory/project instructions;
- iterations;
- human-in-the-loop;
- review checklist.

## 4. Setup comparison is optional

Some episodes may compare multiple setups.

Some episodes may test only one setup.

Both are valid if the setup is explicit and the verdict is honest.

## 5. Base episode protocol

- task;
- setup;
- success criteria;
- AI attempt;
- human review;
- scorecard;
- verdict;
- what to change in the next setup.

## 6. Verdict language

Verdicts should say:

- this setup passed;
- this setup passed only with human control;
- this setup failed;
- this setup was dangerously confident.

Verdicts should not say:

- AI passed universally;
- AI failed universally.

## 7. Scorecard

| Item | Score / Answer | Notes |
| --- | --- | --- |
| Completed? | Yes / Partial / No |  |
| Time saved? | High / Medium / Low / None |  |
| Setup overhead? | Low / Medium / High |  |
| Human control needed? | Low / Medium / High |  |
| Mistakes or hallucinations? | None / Minor / Major |  |
| Trust level? | Low / Medium / High |  |
| Repeatability? | Low / Medium / High |  |
| Final verdict | TBD |  |

## 8. Real time-saving formula

Real time saved = manual time - setup time - AI time - review time - correction time

## 9. Safety boundary

Do not show `.env`, API keys, stream keys, tokens, private URLs, local credentials, or personal data on stream.

