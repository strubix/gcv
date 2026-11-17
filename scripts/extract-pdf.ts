#!/usr/bin/env bun
/**
 * Extract raw text from a PDF, page by page.
 *
 * The host machine has no poppler / pdftotext, so the native PDF reader is
 * unavailable. `unpdf` is a pure-JS build of pdf.js with no native deps, which
 * makes it the only reliable extraction path here.
 *
 * Usage: bun scripts/extract-pdf.ts <file.pdf> [--out <file.txt>]
 */
import { extractText, getDocumentProxy } from "unpdf";

const [, , input, ...rest] = process.argv;
if (!input) {
  console.error("usage: bun extract-pdf.ts <file.pdf> [--out <file.txt>]");
  process.exit(1);
}

const outIdx = rest.indexOf("--out");
const outPath = outIdx !== -1 ? rest[outIdx + 1] : undefined;

const buffer = new Uint8Array(await Bun.file(input).arrayBuffer());
const pdf = await getDocumentProxy(buffer);
const { totalPages, text } = await extractText(pdf, { mergePages: false });

const body = (text as string[])
  .map((page, i) => `\n\n===== PAGE ${i + 1} / ${totalPages} =====\n\n${page.trim()}`)
  .join("");

if (outPath) {
  await Bun.write(outPath, body);
  console.error(`${totalPages} page(s) -> ${outPath}`);
} else {
  console.log(body);
}
