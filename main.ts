// x-promo entry: hand the grader the URL of our X post.
//
// The whole job of this program is deliberately tiny: take the POST.json
// that sits next to this file in the repository root and copy it, byte for
// byte, into the output directory as POST.json. The grader then reads the
// post URL out of that file and scores the post it points at.

import { copyFileSync, mkdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

// The harness tells us where the bot's files live and where output goes;
// fall back to the current directory and /output when run by hand.
const botDir: string = process.env.MAKEFUN_BOT_DIR ?? ".";
const outputDir: string = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

const sourcePath: string = join(botDir, "POST.json");
const targetPath: string = join(outputDir, "POST.json");

// Sanity-check the payload before shipping it: it must be JSON holding a
// single "url" string that looks like an X status link. Failing loudly
// here beats handing the grader a file it cannot use.
const parsed: unknown = JSON.parse(readFileSync(sourcePath, "utf8"));
if (
  typeof parsed !== "object" ||
  parsed === null ||
  typeof (parsed as { url?: unknown }).url !== "string" ||
  !(parsed as { url: string }).url.startsWith("https://x.com/")
) {
  throw new Error("POST.json must hold an https://x.com/ status URL");
}

// Make sure the output directory exists before copying into it.
mkdirSync(outputDir, { recursive: true });
copyFileSync(sourcePath, targetPath);

console.log(`copied ${sourcePath} -> ${targetPath}`);
