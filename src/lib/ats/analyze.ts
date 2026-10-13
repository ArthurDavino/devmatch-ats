/**
 * DevMatch ATS — v1 analysis engine (local, no generative AI).
 *
 * VERSÃO INICIAL: extração por dicionário + sinônimos. Para trocar por um modelo
 * de linguagem depois, basta substituir `extractKeywords` e `rewriteResume`
 * (ex.: por uma server function) mantendo o formato `AnalysisResult` — as telas
 * dependem apenas desse tipo.
 */
import { CATEGORIES, DICTIONARY, type Category, type KeywordDef } from "./dictionary";

export interface KeywordHit {
  name: string;
  category: Category;
  weight: number;
}

export interface AnalysisResult {
  score: number; // 0-100
  found: Record<Category, KeywordHit[]>;
  missing: Record<Category, KeywordHit[]>;
  foundCount: number;
  missingCount: number;
  adjustedResume: string;
}

function escapeRe(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\/]/g, "\\$&");
}

function aliasRegex(def: KeywordDef): RegExp {
  const alts = [...def.aliases].sort((a, b) => b.length - a.length).map(escapeRe).join("|");
  // Custom boundaries so "C++", "C#", ".NET", "Node.js" work, and "React." still matches.
  return new RegExp(`(?<![\\p{L}\\p{N}_+#.])(?:${alts})(?![\\p{L}\\p{N}_+#])`, def.caseSensitive ? "gu" : "giu");
}

const REGEXES = new Map(DICTIONARY.map((d) => [d.name, aliasRegex(d)]));

export function countMatches(text: string, def: KeywordDef): number {
  const re = REGEXES.get(def.name)!;
  re.lastIndex = 0;
  return text.match(re)?.length ?? 0;
}

/** Text portion that looks like a "required" section (requisitos / obrigatório). */
function requiredSection(job: string): string {
  const lower = job.toLowerCase();
  const start = lower.search(/requisitos|obrigat[óo]ri|required|must have|o que buscamos/);
  if (start < 0) return "";
  const rest = lower.slice(start);
  const end = rest.search(/diferencia|desej[áa]v|nice to have|b[ôo]nus|benef[íi]cios/);
  return end > 0 ? rest.slice(0, end) : rest;
}

export function extractKeywords(job: string): KeywordHit[] {
  const req = requiredSection(job);
  const hits: KeywordHit[] = [];
  for (const def of DICTIONARY) {
    const n = countMatches(job, def);
    if (!n) continue;
    let weight = 1;
    if (req && countMatches(req, def) > 0) weight += 1;
    if (n > 1) weight += 0.5;
    hits.push({ name: def.name, category: def.category, weight });
  }
  return hits;
}

function emptyGroups(): Record<Category, KeywordHit[]> {
  return Object.fromEntries(CATEGORIES.map((c) => [c, []])) as unknown as Record<Category, KeywordHit[]>;
}

/**
 * Rewrites the resume WITHOUT inventing anything:
 * - normalizes spacing/bullets;
 * - replaces aliases of keywords the person already has with the vaga's canonical term
 *   (e.g. "JS" -> "JavaScript (JS)");
 * - adds a "Competências técnicas" section listing ONLY keywords found in the original.
 * Missing keywords are never inserted here.
 */
export function rewriteResume(resume: string, found: KeywordHit[]): string {
  let text = resume
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/^\s*[•●▪◦*–-]\s*/gm, "• ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  for (const hit of found) {
    const def = DICTIONARY.find((d) => d.name === hit.name)!;
    const re = REGEXES.get(def.name)!;
    re.lastIndex = 0;
    let first = true;
    text = text.replace(re, (m) => {
      if (m.toLowerCase() === def.name.toLowerCase()) return m;
      // Only expand short abbreviations once, keeping the original term visible.
      if (first && m.length <= 4) {
        first = false;
        return `${def.name} (${m})`;
      }
      return m;
    });
  }

  if (found.length) {
    const lines = CATEGORIES.map((cat) => {
      const names = found.filter((f) => f.category === cat).map((f) => f.name);
      return names.length ? `• ${cat}: ${names.join(", ")}` : null;
    }).filter(Boolean);
    const block = `COMPETÊNCIAS TÉCNICAS\n${lines.join("\n")}`;
    const parts = text.split("\n\n");
    // Place after the header/summary block (first paragraph).
    parts.splice(Math.min(1, parts.length), 0, block);
    text = parts.join("\n\n");
  }
  return text;
}

export function analyze(job: string, resume: string): AnalysisResult {
  const keywords = extractKeywords(job);
  const found = emptyGroups();
  const missing = emptyGroups();
  const foundList: KeywordHit[] = [];
  let total = 0;
  let got = 0;
  for (const k of keywords) {
    const def = DICTIONARY.find((d) => d.name === k.name)!;
    total += k.weight;
    if (countMatches(resume, def) > 0) {
      got += k.weight;
      found[k.category].push(k);
      foundList.push(k);
    } else {
      missing[k.category].push(k);
    }
  }
  const score = total ? Math.round((got / total) * 100) : 0;
  return {
    score,
    found,
    missing,
    foundCount: foundList.length,
    missingCount: keywords.length - foundList.length,
    adjustedResume: rewriteResume(resume, foundList),
  };
}
