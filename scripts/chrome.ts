/**
 * Locate a Chrome / Chromium / Edge binary on Linux, macOS, Windows or WSL.
 *
 * Order: $CHROME_PATH, then Windows Chrome seen from WSL, then the usual
 * native install paths. Under WSL, Windows Chrome needs Windows-style paths,
 * which `toUrl` handles through `wslpath`.
 */
import { existsSync } from "node:fs";

const WSL_WIN_CHROME = "/mnt/c/Program Files/Google/Chrome/Application/chrome.exe";

const CANDIDATES = [
  process.env.CHROME_PATH,
  WSL_WIN_CHROME,
  "/usr/bin/google-chrome",
  "/usr/bin/google-chrome-stable",
  "/usr/bin/chromium",
  "/usr/bin/chromium-browser",
  "/snap/bin/chromium",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Chromium.app/Contents/MacOS/Chromium",
  "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
].filter((p): p is string => Boolean(p));

/** All usable browsers, best first. */
export function findChromes(): string[] {
  return CANDIDATES.filter((p) => existsSync(p));
}

export function isWslWindows(chrome: string): boolean {
  return chrome.startsWith("/mnt/");
}

/** Convert a local path into something the given browser can open or write to. */
export async function toBrowserPath(chrome: string, p: string): Promise<string> {
  if (!isWslWindows(chrome)) return p;
  const proc = Bun.spawn(["wslpath", "-w", p]);
  return (await new Response(proc.stdout).text()).trim();
}

export async function toUrl(chrome: string, p: string): Promise<string> {
  const bp = await toBrowserPath(chrome, p);
  if (isWslWindows(chrome) || /^[A-Za-z]:\\/.test(bp)) return `file:///${bp.replace(/\\/g, "/")}`;
  return `file://${bp}`;
}

export function noChromeMessage(): string {
  return (
    "Aucun Chrome, Chromium ou Edge trouve.\n" +
    "Installe-en un, ou indique son chemin : CHROME_PATH=/chemin/vers/chrome bun <script>"
  );
}
