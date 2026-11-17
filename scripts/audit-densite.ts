#!/usr/bin/env bun
/**
 * Measure a CV's real typographic density in a headless browser.
 *
 * A CV can be technically correct and still unreadable: the HTML says nothing
 * about where the ink actually lands. This instruments the rendered page and
 * reports the handful of numbers that predict "too cramped", each against a
 * threshold derived from measuring real, reviewed CVs.
 *
 * Usage: bun scripts/audit-densite.ts <fichier.html>
 */
import { existsSync } from "node:fs";
import { resolve, dirname, join } from "node:path";
import { findChromes, noChromeMessage, toUrl } from "./chrome.ts";

const argv = process.argv.slice(2);
const iPages = argv.indexOf("--pages");
const pagesCible = iPages !== -1 ? Number(argv[iPages + 1]) : 1;
const input = argv.find((a, i) => !a.startsWith("--") && !(iPages !== -1 && i === iPages + 1));
if (!input || !existsSync(resolve(input))) {
  console.error("usage: bun audit-densite.ts <fichier.html> [--pages N]");
  process.exit(1);
}
const chemin = resolve(input);

const PROBE = `<script>
(function(){
  var page = document.querySelector('.page');
  if (!page) { document.title = '@@ERREUR=pas de .page@@'; return; }
  var pr = page.getBoundingClientRect(), o = {};
  function fin(sel){ var m=0; document.querySelectorAll(sel+' *').forEach(function(e){
    var r = e.getBoundingClientRect(); if (r.height > 0 && r.bottom > m) m = r.bottom; }); return m; }
  var pages = +(document.body.dataset.pagesCible || 1);
  var reference = 1123 * pages;
  o.hauteurPage = +pr.height.toFixed(0);
  o.pagesCible = pages;
  o.debordement = +(pr.height - reference).toFixed(0);
  o.margeBasse = +(reference - fin('.main')).toFixed(0);
  o.videSidebar = +(reference - fin('.side')).toFixed(0);
  var sm = document.querySelector('.summary');
  o.profileHauteur = sm ? +sm.getBoundingClientRect().height.toFixed(0) : 0;
  // longueur de ligne : largeur utile divisee par la largeur moyenne d'un caractere
  var li = document.querySelector('.job li') || sm;
  if (li) {
    var cs = getComputedStyle(li), taille = parseFloat(cs.fontSize);
    var largeur = li.getBoundingClientRect().width - parseFloat(cs.paddingLeft || '0');
    o.corpsPx = +taille.toFixed(1);
    o.interligne = +(parseFloat(cs.lineHeight) / taille).toFixed(2);
    o.caracteresParLigne = Math.round(largeur / (taille * 0.5));
  }
  var replis = 0;
  document.querySelectorAll('.c-row .c-left').forEach(function(g){
    var r = g.getBoundingClientRect(), lh = parseFloat(getComputedStyle(g).lineHeight) || 15;
    if (Math.round(r.height / lh) > 1) replis++;
  });
  o.replisCompact = replis;
  o.chips = document.querySelectorAll('.chip').length;
  // saturation du gras : part des mots mis en valeur dans le resume et dans le premier bloc
  function ratio(racine){
    if (!racine) return 0;
    var tot = (racine.textContent || '').split(/\\s+/).filter(Boolean).length;
    var g = 0;
    racine.querySelectorAll('b, strong, .hi').forEach(function(e){
      g += (e.textContent || '').split(/\\s+/).filter(Boolean).length; });
    return tot ? +(g / tot * 100).toFixed(0) : 0;
  }
  o.grasProfile = ratio(sm);
  o.grasPremierBloc = ratio(document.querySelector('.job'));
  document.title = '@@' + JSON.stringify(o) + '@@';
})();
</script>`;

const html = (await Bun.file(chemin).text())
  .replace("<body", `<body data-pages-cible="${pagesCible}"`)
  .replace("</body>", PROBE + "</body>");
const sonde = join(dirname(chemin), "_audit-densite.html");
await Bun.write(sonde, html);

const chrome = findChromes()[0];
if (!chrome) {
  await Bun.file(sonde).delete();
  console.error(noChromeMessage());
  process.exit(1);
}
const proc = Bun.spawn(
  [chrome, "--headless", "--disable-gpu", "--no-sandbox", "--virtual-time-budget=4000", "--dump-dom", await toUrl(chrome, sonde)],
  { stdout: "pipe", stderr: "pipe" },
);
const dom = await new Response(proc.stdout).text();
await proc.exited;
await Bun.file(sonde).delete();

const brut = dom.match(/@@(.*?)@@/)?.[1];
if (!brut) {
  console.error("Mesure impossible : la sonde n'a pas repondu. Le fichier s'ouvre-t-il correctement ?");
  process.exit(1);
}
if (brut.startsWith("ERREUR")) {
  console.error(brut);
  process.exit(1);
}
const m = JSON.parse(brut);

/** Seuils etablis en mesurant des CV reels, cf. references/densite.md */
const controles: Array<[string, number | string, boolean, string]> = [
  [
    "Debordement hors A4",
    m.debordement > 0 ? `+${m.debordement} px` : "aucun",
    m.debordement <= 0,
    "la page depasse le format vise, le CV partira sur une feuille de plus",
  ],
  ["Marge basse colonne principale", `${m.margeBasse} px`, m.margeBasse >= 20, "≥ 20 px, sinon le texte touche le bord"],
  ["Vide inutilise en sidebar", `${m.videSidebar} px`, m.videSidebar >= 0 && m.videSidebar <= 30, "entre 0 et 30 px : negatif elle deborde, au-dela c'est du blanc perdu dans la mauvaise colonne"],
  ["Caracteres par ligne", m.caracteresParLigne, m.caracteresParLigne <= 90, "≤ 90, l'oeil rate la ligne suivante au-dela"],
  ["Interligne du corps", m.interligne, m.interligne >= 1.45, "≥ 1.45, en dessous les lignes se collent"],
  ["Lignes compactes qui se replient", m.replisCompact, m.replisCompact === 0, "0, chaque repli coute 15 px pour quelques caracteres"],
  ["Gras dans le profil", `${m.grasProfile} %`, m.grasProfile <= 12, "≤ 12 %, au-dela le gras ne hierarchise plus rien"],
  ["Gras dans le premier bloc", `${m.grasPremierBloc} %`, m.grasPremierBloc <= 15, "≤ 15 %, meme raison"],
  ["Nombre de chips", m.chips, m.chips <= 26, "≤ 26, au-dela la liste se lit comme une texture"],
];

console.log(`\nAudit de densite : ${chemin} (cible ${pagesCible} page)\n`);
let echecs = 0;
for (const [nom, valeur, ok, seuil] of controles) {
  if (!ok) echecs++;
  console.log(`  ${ok ? "ok  " : "  ->"} ${nom.padEnd(34)} ${String(valeur).padStart(8)}   ${ok ? "" : seuil}`);
}
console.log(`\n  Hauteur du bloc profil : ${m.profileHauteur} px (${(m.profileHauteur * 0.2646).toFixed(1)} mm)`);
console.log(
  echecs === 0
    ? "\nAucun point de densite a corriger.\n"
    : `\n${echecs} point(s) a corriger. Corrige par le contenu et la repartition du blanc, jamais en reduisant le corps.\n`,
);
