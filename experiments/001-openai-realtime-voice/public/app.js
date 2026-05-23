const startButton = document.querySelector("#startButton");
const stopButton = document.querySelector("#stopButton");
const clearLogButton = document.querySelector("#clearLogButton");
const statusText = document.querySelector("#statusText");
const eventLog = document.querySelector("#eventLog");
const remoteAudio = document.querySelector("#remoteAudio");

let peerConnection = null;
let dataChannel = null;
let localStream = null;

startButton.addEventListener("click", startVoiceSession);
stopButton.addEventListener("click", stopVoiceSession);
clearLogButton.addEventListener("click", () => {
  eventLog.replaceChildren();
});

async function startVoiceSession() {
  startButton.disabled = true;
  setStatus("Requesting microphone permission...");

  try {
    await stopVoiceSession({ quiet: true });
    stopButton.disabled = false;

    localStream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
      },
    });
    log("microphone.ready");

    peerConnection = new RTCPeerConnection();
    peerConnection.addEventListener("connectionstatechange", () => {
      log(`peer.${peerConnection.connectionState}`);
      setStatus(`Peer connection: ${peerConnection.connectionState}`);
    });
    peerConnection.addEventListener("iceconnectionstatechange", () => {
      log(`ice.${peerConnection.iceConnectionState}`);
    });
    peerConnection.addEventListener("track", (event) => {
      remoteAudio.srcObject = event.streams[0];
      remoteAudio.play().catch(() => {
        log("audio.play_blocked");
      });
      log("remote_audio.track");
    });

    for (const track of localStream.getAudioTracks()) {
      peerConnection.addTrack(track, localStream);
    }

    dataChannel = peerConnection.createDataChannel("oai-events");
    dataChannel.addEventListener("open", () => {
      log("data_channel.open");
      setStatus("Connected. Speak into the microphone.");
    });
    dataChannel.addEventListener("close", () => {
      log("data_channel.close");
    });
    dataChannel.addEventListener("message", (event) => {
      logRealtimeEvent(event.data);
    });

    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);

    setStatus("Creating OpenAI Realtime session...");
    const response = await fetch("/session", {
      method: "POST",
      headers: {
        "Content-Type": "application/sdp",
      },
      body: offer.sdp,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Session request failed: ${response.status} ${errorText}`);
    }

    const answer = {
      type: "answer",
      sdp: await response.text(),
    };
    await peerConnection.setRemoteDescription(answer);
    log("session.ready");
  } catch (error) {
    log(`error.${error.message}`);
    setStatus(error.message);
    await stopVoiceSession({ quiet: true });
    startButton.disabled = false;
  }
}

async function stopVoiceSession(options = {}) {
  if (dataChannel) {
    dataChannel.close();
    dataChannel = null;
  }

  if (peerConnection) {
    peerConnection.close();
    peerConnection = null;
  }

  if (localStream) {
    for (const track of localStream.getTracks()) {
      track.stop();
    }
    localStream = null;
  }

  remoteAudio.srcObject = null;
  stopButton.disabled = true;

  if (!options.quiet) {
    startButton.disabled = false;
    setStatus("Stopped.");
    log("session.stopped");
  }
}

function logRealtimeEvent(payload) {
  try {
    const event = JSON.parse(payload);
    const label = event.type || "realtime.event";
    log(label, event);
  } catch {
    log("realtime.raw", payload);
  }
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
