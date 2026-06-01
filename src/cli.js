#!/usr/bin/env node
import http from "node:http";
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { demoReport, scanCodexHome } from "./parser.js";
import { renderWeeklyReport } from "./report.js";

const rootDir = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const publicDir = path.join(rootDir, "public");

async function main() {
  const [command = "scan", ...args] = process.argv.slice(2);
  const options = parseArgs(args);

  if (command === "scan") {
    const report = options.demo ? demoReport() : await scanCodexHome(options);
    await writeReport(report, options.out);
    return;
  }

  if (command === "weekly") {
    const report = options.demo ? demoReport() : await scanCodexHome(options);
    await writeText(renderWeeklyReport(report), options.out);
    return;
  }

  if (command === "serve") {
    await serve(options);
    return;
  }

  if (command === "demo") {
    await writeReport(demoReport(), options.out);
    return;
  }

  printHelp();
  process.exitCode = 1;
}

function parseArgs(args) {
  const options = { port: 5057 };
  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (arg === "--codex-home") options.codexHome = args[++i];
    else if (arg === "--out") options.out = args[++i];
    else if (arg === "--limit") options.limit = Number(args[++i]);
    else if (arg === "--port") options.port = Number(args[++i]);
    else if (arg === "--demo") options.demo = true;
    else if (arg === "--show-paths") options.redactPaths = false;
    else if (arg === "--redaction") options.redaction = args[++i];
    else if (arg === "--help" || arg === "-h") options.help = true;
  }
  if (options.help) printHelp();
  return options;
}

async function writeReport(report, outPath) {
  const json = `${JSON.stringify(report, null, 2)}\n`;
  if (!outPath) {
    process.stdout.write(json);
    return;
  }
  await fs.mkdir(path.dirname(path.resolve(outPath)), { recursive: true });
  await fs.writeFile(outPath, json, "utf8");
}

async function writeText(text, outPath) {
  if (!outPath) {
    process.stdout.write(text);
    return;
  }
  await fs.mkdir(path.dirname(path.resolve(outPath)), { recursive: true });
  await fs.writeFile(outPath, text, "utf8");
}

async function serve(options) {
  const server = http.createServer(async (request, response) => {
    try {
      const url = new URL(request.url || "/", `http://localhost:${options.port}`);
      if (url.pathname === "/codex-lens-report.json") {
        const report = options.demo ? demoReport() : await scanCodexHome(options);
        send(response, 200, "application/json", JSON.stringify(report));
        return;
      }

      const filePath = url.pathname === "/" ? "index.html" : url.pathname.slice(1);
      const safePath = path.normalize(filePath).replace(/^(\.\.[/\\])+/, "");
      const absolutePath = path.join(publicDir, safePath);
      const body = await fs.readFile(absolutePath);
      send(response, 200, contentType(absolutePath), body);
    } catch (error) {
      send(response, 404, "text/plain; charset=utf-8", `Not found\n${error.message}\n`);
    }
  });

  await new Promise((resolve) => server.listen(options.port, "127.0.0.1", resolve));
  console.log(`Codex OSS Lens running at http://127.0.0.1:${options.port}`);
}

function send(response, status, type, body) {
  response.writeHead(status, { "content-type": type, "cache-control": "no-store" });
  response.end(body);
}

function contentType(filePath) {
  if (filePath.endsWith(".html")) return "text/html; charset=utf-8";
  if (filePath.endsWith(".css")) return "text/css; charset=utf-8";
  if (filePath.endsWith(".js")) return "application/javascript; charset=utf-8";
  if (filePath.endsWith(".json")) return "application/json; charset=utf-8";
  return "application/octet-stream";
}

function printHelp() {
  console.log(`Codex OSS Lens

Usage:
  codex-oss-lens scan [--codex-home ~/.codex] [--limit 250] [--out report.json]
  codex-oss-lens weekly [--codex-home ~/.codex] [--limit 250] [--out weekly.md]
  codex-oss-lens serve [--codex-home ~/.codex] [--port 5057] [--demo]
  codex-oss-lens demo [--out report.json]

Privacy:
  Workspace paths use --redaction basename by default.
  Use --redaction hash for stable anonymous workspace ids.
  Use --show-paths for private local reports.
`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
