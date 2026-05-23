const { createServer } = require("node:http");
const { readFileSync, existsSync } = require("node:fs");
const { extname, join, normalize, resolve } = require("node:path");
const { spawn } = require("node:child_process");

const ROOT_DIR = resolve(__dirname, "../..");
const PUBLIC_DIR = join(__dirname, "public");
const HOST = process.env.HOST || "127.0.0.1";
const PORT = Number(process.env.PORT || 3333);

const ASSISTANT_INSTRUCTIONS =
  "Ты AI-помощник для технического стрима. Отвечай кратко, по-русски, живо и без лишней официальности. Помогай ведущему объяснять, что происходит.";

loadEnvFile(join(ROOT_DIR, ".env"));

const sessionConfig = {
  type: "realtime",
  model: "gpt-realtime-2",
  instructions: ASSISTANT_INSTRUCTIONS,
  audio: {
    output: {
      voice: "marin",
    },
  },
};

const server = createServer(async (req, res) => {
  try {
    if (req.method === "POST" && req.url === "/session") {
      await handleSession(req, res);
      return;
    }

    if (req.method === "GET" || req.method === "HEAD") {
      serveStatic(req, res);
      return;
    }

    sendJson(res, 405, { error: "Method not allowed" });
  } catch (error) {
    console.error("Server error:", error);
    sendJson(res, 500, { error: "Internal server error" });
  }
});

server.listen(PORT, HOST, () => {
  const url = `http://${HOST}:${PORT}`;
  console.log(`Realtime voice experiment running at ${url}`);
  maybeOpenBrowser(url);
});

async function handleSession(req, res) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    sendJson(res, 500, {
      error: "Missing OPENAI_API_KEY on the local server",
    });
    return;
  }

  const sdp = await readRequestBody(req);
  if (!sdp.trim()) {
    sendJson(res, 400, { error: "Missing SDP offer" });
    return;
  }

  const form = new FormData();
  form.set("sdp", sdp);
  form.set("session", JSON.stringify(sessionConfig));

  const response = await fetch("https://api.openai.com/v1/realtime/calls", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
    body: form,
  });

  const body = await response.text();

  if (!response.ok) {
    console.error("OpenAI Realtime API error:", response.status, body);
    sendJson(res, response.status, {
      error: "OpenAI Realtime session failed",
      status: response.status,
      details: body.slice(0, 1000),
    });
    return;
  }

  res.writeHead(200, { "Content-Type": "application/sdp" });
  res.end(body);
}

function serveStatic(req, res) {
  const rawPath = req.url === "/" ? "/index.html" : req.url || "/index.html";
  const cleanPath = normalize(decodeURIComponent(rawPath.split("?")[0])).replace(
    /^(\.\.[/\\])+/,
    ""
  );
  const filePath = join(PUBLIC_DIR, cleanPath);

  if (!filePath.startsWith(PUBLIC_DIR) || !existsSync(filePath)) {
    sendJson(res, 404, { error: "Not found" });
    return;
  }

  res.writeHead(200, { "Content-Type": contentType(filePath) });
  if (req.method === "HEAD") {
    res.end();
    return;
  }

  res.end(readFileSync(filePath));
}

function contentType(filePath) {
  const types = {
    ".html": "text/html; charset=utf-8",
    ".js": "text/javascript; charset=utf-8",
    ".css": "text/css; charset=utf-8",
  };

  return types[extname(filePath)] || "application/octet-stream";
}

function readRequestBody(req) {
  return new Promise((resolveBody, rejectBody) => {
    let body = "";
    req.setEncoding("utf8");
    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 2_000_000) {
        rejectBody(new Error("Request body too large"));
        req.destroy();
      }
    });
    req.on("end", () => resolveBody(body));
    req.on("error", rejectBody);
  });
}

function sendJson(res, status, payload) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(payload));
}

function loadEnvFile(filePath) {
  if (!existsSync(filePath)) {
    return;
  }

  const lines = readFileSync(filePath, "utf8").split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const separator = trimmed.indexOf("=");
    if (separator === -1) {
      continue;
    }

    const key = trimmed.slice(0, separator).trim();
    const value = trimmed.slice(separator + 1).trim();
    if (key && process.env[key] === undefined) {
      process.env[key] = unquote(value);
    }
  }
}

function unquote(value) {
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1);
  }

  return value;
}

function maybeOpenBrowser(url) {
  if (process.env.STREAM_AGENT_NO_OPEN === "1") {
    return;
  }

  const command =
    process.platform === "darwin"
      ? "open"
      : process.platform === "win32"
        ? "cmd"
        : "xdg-open";
  const args = process.platform === "win32" ? ["/c", "start", "", url] : [url];

  const child = spawn(command, args, {
    detached: true,
    stdio: "ignore",
  });
  child.unref();
}
