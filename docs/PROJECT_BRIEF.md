# Project Brief

## Public Format

The public format is:

**"Справится ли AI? / Can AI Handle This?"**

Public framing:

**"Реальные задачи • AI-сетапы • честный вердикт"**

This is not just a dev workstream. It is a public experiment format where each stream asks one bounded question and evaluates the result in front of viewers.

The format uses setup-aware evaluation: the verdict is about the specific AI setup used for the task, not about AI in general. Multi-setup comparison is optional, not mandatory. A valid episode may test one clearly documented setup if the final verdict stays honest about that setup.

## Core Mechanic

task → setup → criteria → AI attempt → human review → scorecard → verdict

The stream should always make the question, setup, success criteria, and final verdict visible. The goal is not to demo tools in general, but to test whether a specific AI setup can handle a concrete operator task.

## Stream 001 Question

Справится ли этот AI-сетап помочь подготовить MVP помощника для стрима?

The first stream should produce a clear project base: repository, brief, stream plan, decisions, and a roadmap for OBS, summaries, speech-to-text, and voice experiments.

## Tool Roles

- ChatGPT = planning/context.
- Codex = small coding/docs tasks.
- GitHub = source of truth.
- OBS = execution layer.
- Stream = Live Lab / Operator Mode.

Stream 001 tests one primary setup: ChatGPT Project + Codex + GitHub repo + human operator review.

## MVP Boundary

The MVP focuses on the smallest useful assistant loop for streaming:

- prepare the stream task and criteria;
- keep repo docs as source of truth;
- capture or summarize stream output;
- explore speech-to-text input;
- explore voice output later;
- keep OBS as the place where the live session happens.

This project should avoid premature production architecture. The first useful output is a reliable public experiment loop, not a finished assistant product.

## Safety Boundary

Do not include `.env` files, API keys, stream keys, tokens, private URLs, local credentials, personal data, or other credentials in the repo, stream, screenshots, examples, logs, or prompts.
