import { execFile } from "node:child_process";
import { promises as fs } from "node:fs";
import path from "node:path";
import { promisify } from "node:util";
import { defaultCodexHome, findRolloutFiles } from "./parser.js";

const execFileAsync = promisify(execFile);

export async function runDoctor(options = {}) {
  const codexHome = options.codexHome || defaultCodexHome();
  const sessionsDir = path.join(codexHome, "sessions");
  const rolloutFiles = await findRolloutFiles(sessionsDir, Number.isFinite(options.limit) ? options.limit : 500);
  const gh = await commandVersion("gh", ["--version"]);

  return {
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    status: doctorStatus({ rolloutFiles, gh }),
    checks: {
      node: {
        ok: nodeMajor() >= 20,
        version: process.version,
        required: ">=20",
      },
      codexHome: {
        ok: await exists(codexHome),
        path: codexHome,
      },
      sessionsDir: {
        ok: await exists(sessionsDir),
        path: sessionsDir,
      },
      rolloutFiles: {
        ok: rolloutFiles.length > 0,
        count: rolloutFiles.length,
      },
      githubCli: {
        ok: gh.ok,
        version: gh.version,
        requiredFor: ["github-import"],
      },
    },
    privacy: {
      rawLogsIncluded: false,
      promptsIncluded: false,
      sourceCodeIncluded: false,
      rolloutFileNamesIncluded: false,
    },
  };
}

function doctorStatus({ rolloutFiles, gh }) {
  if (nodeMajor() < 20) return "error";
  if (rolloutFiles.length === 0) return "warning";
  if (!gh.ok) return "warning";
  return "ok";
}

function nodeMajor() {
  return Number(process.version.replace(/^v/, "").split(".")[0]);
}

async function exists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function commandVersion(command, args) {
  try {
    const { stdout } = await execFileAsync(command, args, { maxBuffer: 1024 * 1024 });
    return { ok: true, version: stdout.split(/\r?\n/)[0] || null };
  } catch {
    return { ok: false, version: null };
  }
}
