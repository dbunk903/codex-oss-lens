import { execFile } from "node:child_process";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

const root = path.dirname(path.dirname(new URL(import.meta.url).pathname));
const temp = await mkdtemp(path.join(os.tmpdir(), "codex-oss-lens-pack-"));

try {
  const { stdout } = await execFileAsync("npm", ["pack", "--json"], { cwd: root });
  const [{ filename }] = JSON.parse(stdout);
  const tarball = path.join(root, filename);
  await execFileAsync("npm", ["install", tarball], { cwd: temp });

  const bin = path.join(temp, "node_modules", ".bin", process.platform === "win32" ? "codex-oss-lens.cmd" : "codex-oss-lens");
  const outputPath = path.join(temp, "demo-report.json");
  await execFileAsync(bin, ["demo", "--out", outputPath], { cwd: temp });

  const report = JSON.parse(await readFile(outputPath, "utf8"));
  if (report.totals?.sessions !== 4) {
    throw new Error(`Unexpected demo session count: ${report.totals?.sessions}`);
  }

  await rm(tarball, { force: true });
  console.log(`Packed CLI smoke test passed in ${temp}`);
} finally {
  await rm(temp, { recursive: true, force: true });
}
