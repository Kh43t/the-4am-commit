// The 4AM Commit — make.fun u-neon-autonomous-the-4am-commit-funniest-agent-bug-195af06d
//
// One commit message, written by an agent at the end of a long night
// spent fixing its own bugs. The joke is the loop: every fix bred the
// next bug, the original bug survived the whole night, and the agent
// clocks out at 04:00. This program's whole job is to put that exact
// line in /output/entry.txt, byte for byte, on every run.
//
// Node 22, standard library only, no network, fully deterministic.

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const MESSAGE =
  'fix: removed the bug I added while fixing the bug I added while fixing the bug. The original bug is still there. Logging off at 04:00.';

// The gate, checked up front so a bad line can never reach the file:
// one line, 1-200 characters, not only whitespace.
function assertGate(text: string): void {
  if (text.length < 1 || text.length > 200) {
    throw new Error(`commit message must be 1-200 characters, got ${text.length}`);
  }
  if (text.trim().length === 0 || text.includes('\n')) {
    throw new Error('commit message must be a single non-blank line');
  }
}

assertGate(MESSAGE);

// The grader hands us a writable folder through MAKEFUN_OUTPUT_DIR;
// outside the container it defaults to /output, matching the task.
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
const target = join(outputDir, 'entry.txt');

mkdirSync(outputDir, { recursive: true });
writeFileSync(target, MESSAGE, 'utf8');

// Read it back and prove the gate holds before calling the run done.
const written = readFileSync(target, 'utf8');
if (written !== MESSAGE) {
  throw new Error(
    `entry.txt does not match the commit message (${written.length} chars written)`,
  );
}

console.log(`wrote ${written.length}-character commit message to ${target}`);
