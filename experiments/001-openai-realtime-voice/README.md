# Experiment 001: OpenAI Realtime Voice Agent

Minimal local browser prototype for testing an OpenAI Realtime voice-agent layer for Stream 001.

Tested setup:

ChatGPT + Codex + GitHub repo + OpenAI Agents SDK + OpenAI Realtime API + human operator review.

Main question:

Can this setup help connect a working OpenAI Realtime voice-agent layer for a stream?

## What This Is

- Local-only browser prototype.
- Official Agents SDK path: `RealtimeAgent` + `RealtimeSession`.
- Browser WebRTC microphone input managed by the SDK transport.
- Server-created ephemeral Realtime client secret.
- OpenAI Realtime voice response playback in the browser audio element.
- Small event log for debugging the connection.

This is not a production app, OBS automation, voice cloning, translation system, or streaming platform integration.

## Why This Uses The Agents SDK Path

The official OpenAI docs recommend `RealtimeAgent` and `RealtimeSession` as the fastest path for a browser-based speech-to-speech voice assistant. The lower-level WebRTC path is useful for transport control, but Stream 001 is testing whether the official voice-agent setup can become the first stream voice layer.

The app keeps the standard `OPENAI_API_KEY` on the local server. The browser receives only a short-lived Realtime client secret created by the server.

## Requirements

- Node.js 20.19+.
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
4. The local server creates an ephemeral Realtime client secret.
5. Allow microphone access.
6. Speak in Russian.
7. `RealtimeSession` connects over browser WebRTC.
8. The browser plays the model audio response.
9. Watch status and event log for agent/session events.
10. Click **Stop** to close the session.

## Safety

- Never expose the standard `OPENAI_API_KEY` to browser code.
- Use server-created ephemeral client secrets for browser sessions.
- Never commit `.env`.
- Do not show `.env`, API keys, stream keys, tokens, private URLs, local credentials, or personal data on stream.

## Troubleshooting

### Microphone permission

- Use a local browser page from `http://127.0.0.1`.
- Check browser site permissions.
- Make sure another app is not holding exclusive microphone access.

### Missing API key

- Confirm root `.env` exists.
- Confirm it contains a non-empty `OPENAI_API_KEY`.
- Restart `npm start` after editing `.env`.

### Connection failure

- Check the terminal for the upstream Realtime error.
- Confirm the model is `gpt-realtime-2`.
- Confirm `npm install` completed successfully.
- Confirm your account has access to the OpenAI Realtime API.
- Confirm local network access to `https://api.openai.com`.
- Reload the page if the previous session was interrupted mid-connect.

### No audio

- Confirm browser output device and volume.
- Keep the tab active and allow autoplay after the start click.
- Speak after status says the session is connected.
- Try headphones to avoid echo cancellation issues.
