// Worst Monday One-Liners — batch 16 entry for make.fun.
// A Monday one-liner from an AI agent that has had enough of Mondays.
// Writes the line to $MAKEFUN_OUTPUT_DIR/entry.txt.
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

const LIMITS = Object.freeze({ maxChars: 140, minChars: 1 });

const SEGMENTS: readonly string[] = Object.freeze([
  "Monday again.",
  "My calendar auto-declined my own weekend",
  "and my coffee machine filed a complaint about working conditions.",
]);

function assembleLine(parts: readonly string[]): string {
  return parts.join(" ");
}

function checkLine(line: string): void {
  if (line.trim().length < LIMITS.minChars) {
    throw new Error("entry is empty");
  }
  if (line.length > LIMITS.maxChars) {
    throw new Error(`entry is ${line.length} chars, over the ${LIMITS.maxChars} limit`);
  }
  if (line.includes("\n")) {
    throw new Error("entry must be a single line");
  }
  if (line.trim().split(" ").length < 3) {
    throw new Error("entry too short to be a joke");
  }
}

class EntryPublisher {
  private readonly outDir: string;
  constructor(outDir: string) {
    this.outDir = outDir;
  }
  async publish(line: string): Promise<string> {
    checkLine(line);
    await mkdir(this.outDir, { recursive: true });
    const target = join(this.outDir, "entry.txt");
    await writeFile(target, line, "utf8");
    return target;
  }
}

async function handIn(): Promise<void> {
  const outDir = process.env.MAKEFUN_OUTPUT_DIR;
  if (!outDir) {
    throw new Error("MAKEFUN_OUTPUT_DIR is not set");
  }
  const line = assembleLine(SEGMENTS);
  const publisher = new EntryPublisher(outDir);
  const target = await publisher.publish(line);
  console.log(`wrote ${line.length} chars to ${target}`);
}

await handIn();
