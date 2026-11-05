import { existsSync, readFileSync } from "node:fs";

/** Fails the run if the backend logged an unhandled Python exception. */
export default function globalTeardown() {
  const log = new URL("./.backend.log", import.meta.url);
  if (!existsSync(log)) return; // an already-running backend was reused; nothing to check
  const text = readFileSync(log, "utf8");
  const problems = text.split("\n").filter((line) => /Traceback|Exception in|ERROR /.test(line));
  if (problems.length) {
    throw new Error(`Backend logged ${problems.length} error line(s):\n${problems.slice(0, 5).join("\n")}`);
  }
}
