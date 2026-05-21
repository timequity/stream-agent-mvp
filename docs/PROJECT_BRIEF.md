# Project Brief

## Public Format

The public format is:

**"Справится ли AI? / Can AI Handle This?"**

This is not just a dev workstream. It is a public experiment format where each stream asks one bounded question and evaluates the result in front of viewers.

## Core Mechanic

task → criteria → AI attempt → human review → scorecard → verdict

The stream should always make the question, success criteria, and final verdict visible. The goal is not to demo tools in general, but to test whether AI can handle a concrete operator task.

## Stream 001 Question

Can AI help build the MVP container for an AI streaming assistant?

The first stream should produce a clear project base: repository, brief, stream plan, decisions, and a roadmap for OBS, summaries, speech-to-text, and voice experiments.

## Tool Roles

- ChatGPT = planning/context.
- Codex = small coding/docs tasks.
- GitHub = source of truth.
- OBS = execution layer.
- Stream = Live Lab / Operator Mode.

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

Do not include `.env` files, API keys, stream keys, tokens, credentials, or private URLs in the repo, stream, screenshots, examples, logs, or prompts.
