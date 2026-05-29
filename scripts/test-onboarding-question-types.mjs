#!/usr/bin/env node
/**
 * Validates question definitions across all 4 onboarding form pages.
 * Checks: valid types, duplicate IDs, options arrays on select/radio/multi_select,
 * non-empty options, fixed questions have a value, and extractSection consistency.
 */

import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

const VALID_TYPES = new Set([
  "text", "email", "textarea", "radio", "single_select", "select",
  "multi_select", "scale", "number", "currency", "percentage",
  "number_group", "fixed",
]);

const NEEDS_OPTIONS = new Set(["radio", "single_select", "select", "multi_select"]);

const FORMS = [
  { area: "delivery",       file: "app/onboarding/delivery/page.tsx" },
  { area: "marketing",      file: "app/onboarding/marketing/page.tsx" },
  { area: "ventas",         file: "app/onboarding/ventas/page.tsx" },
  { area: "operaciones",    file: "app/onboarding/operaciones/page.tsx" },
];

// ── helpers ──────────────────────────────────────────────────────────────────

function extractSection(id) {
  const parts = id.split("_");
  if (parts.length < 3) return "01";
  return parts[parts.length - 2].toUpperCase();
}

/**
 * Very-simplified question extractor.
 * Finds all `{ id: "...", ... }` blocks inside the `questions` prop/variable.
 * Returns an array of plain objects with {id, type, hasOptions, hasValue, optionCount, raw}.
 */
function extractQuestions(src) {
  const questions = [];

  // Match each question object by finding `id: "..."` and then scanning for `type: "..."`
  // within the surrounding braces. This works because each question is a self-contained object.

  // Step 1: find every `id: "..."` position
  const idRe = /\bid:\s*["']([^"']+)["']/g;
  let idMatch;

  while ((idMatch = idRe.exec(src)) !== null) {
    const id = idMatch[1];
    const idPos = idMatch.index;

    // Step 2: find the opening `{` that contains this id (search backwards)
    let braceOpen = idPos;
    while (braceOpen > 0 && src[braceOpen] !== "{") braceOpen--;

    // Step 3: find the matching closing `}` by counting nested braces
    let depth = 0;
    let braceClose = braceOpen;
    for (let i = braceOpen; i < src.length; i++) {
      if (src[i] === "{") depth++;
      else if (src[i] === "}") {
        depth--;
        if (depth === 0) { braceClose = i; break; }
      }
    }

    const block = src.slice(braceOpen, braceClose + 1);

    // Extract type
    const typeMatch = block.match(/\btype:\s*["']([^"']+)["']/);
    const type = typeMatch ? typeMatch[1] : "(missing)";

    // Check options presence (look for `options:`)
    const hasOptions = /\boptions\s*:/.test(block);

    // placeholder — real count computed below via optionsBlockMatch

    // Check value presence (for fixed type)
    const hasValue = /\bvalue\s*:/.test(block);

    // Reconstruct options array inline count more reliably
    const optionsBlockMatch = block.match(/options\s*:\s*\[([\s\S]*?)\]/);
    let realOptionCount = 0;
    if (optionsBlockMatch) {
      realOptionCount = (optionsBlockMatch[1].match(/["']/g) || []).length / 2;
      // Each option has a label (string), so count strings
      realOptionCount = (optionsBlockMatch[1].match(/["'][^"']+["']/g) || []).length;
    }

    questions.push({ id, type, hasOptions, hasValue, optionCount: realOptionCount, raw: block });
  }

  return questions;
}

// ── main ──────────────────────────────────────────────────────────────────────

let totalErrors = 0;
let totalWarnings = 0;
const globalIds = new Map(); // id → area

console.log("\n" + "=".repeat(60));
console.log("ONBOARDING QUESTION TYPE VALIDATOR");
console.log("=".repeat(60));

for (const { area, file } of FORMS) {
  const path = join(ROOT, file);
  let src;
  try {
    src = readFileSync(path, "utf8");
  } catch {
    console.error(`\n[ERROR] Cannot read ${file}`);
    totalErrors++;
    continue;
  }

  const questions = extractQuestions(src);
  const errors = [];
  const warnings = [];

  // Track IDs within this form for duplicate detection
  const localIds = new Map();

  for (const q of questions) {
    const { id, type, hasOptions, hasValue, optionCount } = q;

    // Duplicate within form
    if (localIds.has(id)) {
      errors.push(`Duplicate ID within form: "${id}"`);
    } else {
      localIds.set(id, true);
    }

    // Duplicate across forms
    if (globalIds.has(id)) {
      errors.push(`ID "${id}" also used in ${globalIds.get(id)}`);
    } else {
      globalIds.set(id, area);
    }

    // Valid type
    if (!VALID_TYPES.has(type)) {
      errors.push(`Unknown type "${type}" on question "${id}"`);
    }

    // Options check
    if (NEEDS_OPTIONS.has(type)) {
      if (!hasOptions) {
        errors.push(`"${id}" (${type}) is missing an options array`);
      } else if (optionCount === 0) {
        warnings.push(`"${id}" (${type}) has an empty options array`);
      }
    }

    // Fixed must have a value
    if (type === "fixed" && !hasValue) {
      warnings.push(`"${id}" (fixed) has no "value" property`);
    }

    // Section format check: penultimate segment should be 2-digit number or short alpha
    const sec = extractSection(id);
    if (!/^[0-9]{2}$|^[A-Z]{1,3}$/.test(sec)) {
      warnings.push(`"${id}" produces unusual section "${sec}" — check ID naming`);
    }
  }

  const status = errors.length === 0 ? "OK" : "FAIL";
  console.log(`\n[${status}] ${area.toUpperCase()} — ${file}`);
  console.log(`     Questions found: ${questions.length}`);

  const typeBreakdown = {};
  for (const q of questions) typeBreakdown[q.type] = (typeBreakdown[q.type] ?? 0) + 1;
  console.log(`     Types: ${Object.entries(typeBreakdown).map(([t,n]) => `${t}×${n}`).join(", ")}`);

  for (const e of errors) {
    console.log(`     ❌ ERROR: ${e}`);
    totalErrors++;
  }
  for (const w of warnings) {
    console.log(`     ⚠️  WARN:  ${w}`);
    totalWarnings++;
  }
  if (errors.length === 0 && warnings.length === 0) {
    console.log("     ✓  No issues found");
  }
}

console.log("\n" + "=".repeat(60));
console.log(`TOTAL ERRORS: ${totalErrors}   WARNINGS: ${totalWarnings}`);
console.log("=".repeat(60) + "\n");

process.exit(totalErrors > 0 ? 1 : 0);
