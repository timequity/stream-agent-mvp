# Experiment 001: OpenAI Realtime Voice

Minimal local browser prototype for testing an OpenAI Realtime voice layer for Stream 001.

Tested setup:

ChatGPT + Codex + GitHub repo + OpenAI Realtime API + human operator review.

Main question:

Can this setup help connect a working OpenAI Realtime voice layer for a stream?

## What This Is

- Local-only browser prototype.
- WebRTC microphone input from the browser.
- OpenAI Realtime voice response playback in the browser.
- Small event log for debugging the connection.

This is not a production app, OBS automation, voice cloning, translation system, or streaming platform integration.

## Requirements

- Node.js 20+.
- An OpenAI API key with access to Realtime.
- Root `.env` file containing:

```bash
OPENAI_API_KEY=
```

The `.env` file must never be committed. The root `.gitignore` already ignores `.env` and `.env.*` while keeping `.env.example` trackable.

## Run Locally

From this experiment folder:

```bash
npm install
npm start
```

The server starts on `http://127.0.0.1:3333` by default and opens the page in your browser.

Optional:

```bash
PORT=3334 npm start
STREAM_AGENT_NO_OPEN=1 npm start
```

## Expected Demo Flow

1. Start the local server with `npm start`.
2. The browser opens the local page.
3. Click **Start voice session**.
4. Allow microphone access.
5. Speak in Russian.
6. The browser sends microphone audio through WebRTC.
7. The browser plays the model audio response.
8. Watch status and event log for connection events.
9. Click **Stop** to close the peer connection and microphone stream.

## Safety

- Never expose the standard `OPENAI_API_KEY` to browser code.
- Never commit `.env`.
- Do not show `.env`, API keys, stream keys, tokens, private URLs, local credentials, or personal data on stream.

## Troubleshooting

### Microphone permission

- Use a local browser page from `http://127.0.0.1`.
- Check browser site permissions.
- Make sure another app is not holding exclusive microphone access.

### Missing API key

- Confirm root `.env` exists.
- Confirm it contains `OPENAI_API_KEY=...`.
- Restart `npm start` after editing `.env`.

### Connection failure

- Check the terminal for the upstream Realtime error.
- Confirm the model is `gpt-realtime-2`.
- Confirm your account has access to the OpenAI Realtime API.
- Confirm local network access to `https://api.openai.com`.

### No audio

- Confirm browser output device and volume.
- Keep the tab active and allow autoplay after the start click.
- Speak after status says the session is connected.
- Try headphones to avoid echo cancellation issues.

