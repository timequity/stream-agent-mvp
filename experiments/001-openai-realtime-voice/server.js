import { createServer as createHttpServer } from "node:http";
import { readFileSync, existsSync } from "node:fs";
import { join, resolve } from "node:path";
import { spawn } from "node:child_process";
import { createServer as createViteServer } from "vite";

const ROOT_DIR = resolve(import.meta.dirname, "../..");
const PUBLIC_DIR = join(import.meta.dirname, "public");
const HOST = process.env.HOST || "127.0.0.1";
const PORT = Number(process.env.PORT || 3333);
const CLIENT_SECRET_TTL_SECONDS = 600;

const ASSISTANT_INSTRUCTIONS =
  "Ты AI-помощник для технического стрима. Отвечай кратко, по-русски, живо и без лишней официальности. Помогай ведущему объяснять, что происходит.";

loadEnvFile(join(ROOT_DIR, ".env"));

const vite = await createViteServer({
  root: PUBLIC_DIR,
  appType: "spa",
  logLevel: "warn",
  server: {
    middlewareMode: true,
  },
});

const server = createHttpServer(async (req, res) => {
  try {
    const url = new URL(req.url || "/", `http://${req.headers.host || HOST}`);

    if (url.pathname === "/client-secret") {
      if (req.method !== "POST") {
        sendJson(res, 405, { error: "Method not allowed" });
        return;
      }

      await handleClientSecret(res);
      return;
    }

    vite.middlewares(req, res, (error) => {
      if (error) {
        vite.ssrFixStacktrace(error);
        console.error("Vite middleware error:", error);
        sendJson(res, 500, { error: "Local dev server error" });
        return;
      }

      sendJson(res, 404, { error: "Not found" });
    });
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

async function handleClientSecret(res) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    sendJson(res, 500, {
      error: "Missing OPENAI_API_KEY on the local server",
    });
    return;
  }

  const response = await fetch("https://api.openai.com/v1/realtime/client_secrets", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      expires_after: {
        anchor: "created_at",
        seconds: CLIENT_SECRET_TTL_SECONDS,
      },
      session: {
        type: "realtime",
        model: "gpt-realtime-2",
        instructions: ASSISTANT_INSTRUCTIONS,
        audio: {
          output: {
            voice: "marin",
          },
        },
      },
    }),
  });

  const body = await response.text();

  if (!response.ok) {
    console.error("OpenAI Realtime client secret error:", response.status);
    sendJson(res, response.status, {
      error: "OpenAI Realtime client secret request failed",
      status: response.status,
    });
    return;
  }

  res.writeHead(200, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
  });
  res.end(body);
}

function sendJson(res, status, payload) {
  if (res.headersSent) {
    return;
  }

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
