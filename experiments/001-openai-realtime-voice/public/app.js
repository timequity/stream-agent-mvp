import {
  OpenAIRealtimeWebRTC,
  RealtimeAgent,
  RealtimeSession,
} from "@openai/agents/realtime";

const startButton = document.querySelector("#startButton");
const stopButton = document.querySelector("#stopButton");
const clearLogButton = document.querySelector("#clearLogButton");
const statusText = document.querySelector("#statusText");
const eventLog = document.querySelector("#eventLog");
const remoteAudio = document.querySelector("#remoteAudio");

const ASSISTANT_INSTRUCTIONS =
  "Ты AI-помощник для технического стрима. Отвечай кратко, по-русски, живо и без лишней официальности. Помогай ведущему объяснять, что происходит.";

let session = null;

startButton.addEventListener("click", startVoiceSession);
stopButton.addEventListener("click", stopVoiceSession);
clearLogButton.addEventListener("click", () => {
  eventLog.replaceChildren();
});

async function startVoiceSession() {
  startButton.disabled = true;
  stopButton.disabled = false;
  setStatus("Creating ephemeral Realtime client secret...");

  try {
    await stopVoiceSession({ quiet: true });
    stopButton.disabled = false;

    const clientSecret = await createClientSecret();
    log("client_secret.created", {
      expiresAt: clientSecret.expires_at,
      sessionModel: clientSecret.session?.model,
    });

    const agent = new RealtimeAgent({
      name: "Stream voice assistant",
      instructions: ASSISTANT_INSTRUCTIONS,
      voice: "marin",
    });

    const transport = new OpenAIRealtimeWebRTC({
      audioElement: remoteAudio,
    });

    session = new RealtimeSession(agent, {
      model: "gpt-realtime-2",
      transport,
      config: {
        audio: {
          output: {
            voice: "marin",
          },
        },
      },
    });

    bindSessionEvents(session);

    setStatus("Connecting RealtimeSession over browser WebRTC...");
    await session.connect({
      apiKey: clientSecret.value,
    });
    log("session.ready");
    setStatus("Connected. Speak into the microphone.");
  } catch (error) {
    log("error", safeError(error));
    setStatus(error.message || "Failed to start voice session.");
    await stopVoiceSession({ quiet: true });
    startButton.disabled = false;
  }
}

async function stopVoiceSession(options = {}) {
  if (session) {
    session.close();
    session = null;
  }

  remoteAudio.srcObject = null;
  stopButton.disabled = true;

  if (!options.quiet) {
    startButton.disabled = false;
    setStatus("Stopped.");
    log("session.stopped");
  }
}

async function createClientSecret() {
  const response = await fetch("/client-secret", {
    method: "POST",
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      payload.error || `Client secret request failed: ${response.status}`
    );
  }

  if (!payload.value) {
    throw new Error("Client secret response did not include a value.");
  }

  return payload;
}

function bindSessionEvents(activeSession) {
  activeSession.on("transport_event", (event) => {
    log(`transport.${event.type || "event"}`, summarizeEvent(event));
  });

  activeSession.on("agent_start", () => {
    log("agent.start");
  });

  activeSession.on("agent_end", (_context, _agent, output) => {
    log("agent.end", output);
  });

  activeSession.on("audio_start", () => {
    log("audio.start");
  });

  activeSession.on("audio_stopped", () => {
    log("audio.stopped");
  });

  activeSession.on("audio_interrupted", () => {
    log("audio.interrupted");
  });

  activeSession.on("history_added", (item) => {
    log("history.added", summarizeEvent(item));
  });

  activeSession.on("error", (error) => {
    log("session.error", safeError(error));
  });
}

function setStatus(message) {
  statusText.textContent = message;
}

function log(label, details) {
  const item = document.createElement("li");
  const time = new Date().toLocaleTimeString();
  const title = document.createElement("strong");
  title.textContent = `[${time}] ${label}`;
  item.append(title);

  if (details !== undefined) {
    const pre = document.createElement("pre");
    pre.textContent =
      typeof details === "string" ? details : JSON.stringify(details, null, 2);
    item.append(pre);
  }

  eventLog.prepend(item);
}

function summarizeEvent(value) {
  return JSON.parse(
    JSON.stringify(value, (key, nestedValue) => {
      const normalizedKey = key.toLowerCase();
      if (
        [
          "apikey",
          "authorization",
          "client_secret",
          "secret",
          "token",
          "value",
          "headers",
          "audio",
          "sdp",
        ].includes(normalizedKey)
      ) {
        return "[redacted]";
      }

      if (nestedValue instanceof ArrayBuffer) {
        return `[ArrayBuffer ${nestedValue.byteLength} bytes]`;
      }

      if (typeof nestedValue === "string" && nestedValue.length > 512) {
        return `[redacted ${nestedValue.length} chars]`;
      }

      return nestedValue;
    })
  );
}

function safeError(error) {
  if (!error) {
    return "Unknown error";
  }

  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
    };
  }

  return summarizeEvent(error);
}
