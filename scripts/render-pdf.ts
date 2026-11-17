#!/usr/bin/env bun
/**
 * Render a CV HTML file to A4 PDF via headless Chrome, then verify the result.
 *
 * Chrome exits 0 even when it rendered its own "site can't be reached" error
 * page, so a successful exit code proves nothing. Everything here is built
 * around checking the actual PDF: it must contain the CV's text, and its page
 * count must match what was asked for.
 *
 * Browsers are tried in the order given by chrome.ts ($CHROME_PATH first).
 *
 * Usage: bun scripts/render-pdf.ts <input.html> [output.pdf] [--pages N]
 */
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { extractText, getDocumentProxy } from "unpdf";
import { findChromes, noChromeMessage, toBrowserPath, toUrl } from "./chrome.ts";
const ERROR_PAGE = /site can.t be reached|ERR_FILE_NOT_FOUND|Aw, Snap/i;

const argv = process.argv.slice(2);
const pagesIdx = argv.indexOf("--pages");
const expectedPages = pagesIdx !== -1 ? Number(argv[pagesIdx + 1]) : undefined;
const positional = argv.filter((a, i) => !a.startsWith("--") && i !== pagesIdx + 1);

if (!positional[0] || !existsSync(positional[0])) {
  console.error("usage: bun render-pdf.ts <input.html> [output.pdf] [--pages N]");
  process.exit(1);
}
const input = resolve(positional[0]);
const output = resolve(positional[1] ?? input.replace(/\.html?$/i, ".pdf"));

async function render(chrome: string): Promise<boolean> {
  const cmd = [
    chrome,
    "--headless",
    "--disable-gpu",
    "--no-sandbox",
    "--no-pdf-header-footer",
    `--print-to-pdf=${await toBrowserPath(chrome, output)}`,
    await toUrl(chrome, input),
  ];

  const proc = Bun.spawn(cmd, { stderr: "pipe", stdout: "pipe" });
  await proc.exited;
  return existsSync(output);
}

/** Chrome exits 0 on its error page, so the PDF itself is the only proof. */
async function verify(): Promise<{ ok: boolean; pages: number; reason?: string }> {
  const pdf = await getDocumentProxy(new Uint8Array(await Bun.file(output).arrayBuffer()));
  const { text } = await extractText(pdf, { mergePages: true });
  const body = (text as string).trim();
  if (ERROR_PAGE.test(body)) return { ok: false, pages: pdf.numPages, reason: "Chrome a rendu sa page d'erreur" };
  if (body.length < 500) return { ok: false, pages: pdf.numPages, reason: `PDF quasi vide (${body.length} caracteres)` };
  return { ok: true, pages: pdf.numPages };
}

const engines = findChromes();
if (engines.length === 0) {
  console.error(noChromeMessage());
  process.exit(1);
}

let done = false;
for (const engine of engines) {
  if (!(await render(engine))) continue;
  const check = await verify();
  if (!check.ok) {
    console.error(`${engine} : ${check.reason}, tentative suivante`);
    continue;
  }

  const size = Math.round(Bun.file(output).size / 1024);
  console.log(`OK ${output}`);
  console.log(`   ${check.pages} page(s), ${size} Ko, ${engine}`);

  if (expectedPages && check.pages !== expectedPages) {
    console.log(
      `\nATTENTION : ${check.pages} page(s) rendues pour ${expectedPages} attendue(s).\n` +
        `Le debordement se joue souvent sur une ou deux lignes. Pistes, par ordre de degat croissant :\n` +
        `  1. passer une mission ancienne en ligne .compact\n` +
        `  2. retirer un bullet secondaire de la mission la moins pertinente\n` +
        `  3. raccourcir le paragraphe de profil d'une ligne\n` +
        `Ne touche pas au CSS du gabarit, il est calibre.`,
    );
  }
  done = true;
  break;
}

if (!done) {
  console.error(
    `\nRendu PDF impossible avec ${engines.join(" puis ")}.\n` +
      `Verifie que le HTML s'ouvre correctement, puis reessaie. En dernier recours :\n` +
      `ouvrir le fichier dans Chrome, Ctrl+P, destination "Enregistrer au format PDF",\n` +
      `marges "Aucune", cocher "Graphiques d'arriere-plan".`,
  );
  process.exit(1);
}
