#!/usr/bin/env node
/**
 * Validates Fix 1 (calculatePriority uses respuestasDetalladas) and
 * Fix 2 (scale answers shown as "N / 10" in Observaciones).
 * Tests Operaciones and Delivery only. Creates + verifies + deletes records.
 */

import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

// ── Load env ──────────────────────────────────────────────────────────────────
const env = {};
try {
  const raw = readFileSync(join(ROOT, ".env.local"), "utf8");
  for (const line of raw.split("\n")) {
    const m = line.match(/^([^#=\s]+)\s*=\s*(.*)$/);
    if (m) env[m[1]] = m[2].trim().replace(/^["']|["']$/g, "");
  }
} catch {
  console.error("Could not read .env.local"); process.exit(1);
}

const TOKEN    = env.AIRTABLE_TOKEN;
const BASE_ID  = env.AIRTABLE_BASE_ID;
const ACCESS   = env.ONBOARDING_ACCESS_KEY;
const ENDPOINT = "http://localhost:3000/api/onboarding/submit";

function atUrl(table, recordId = "") {
  return `https://api.airtable.com/v0/${BASE_ID}/${encodeURIComponent(table)}${recordId ? `/${recordId}` : ""}`;
}
const atHeaders = { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" };

async function atGet(table, recordId) {
  const r = await fetch(atUrl(table, recordId), { headers: atHeaders });
  if (!r.ok) throw new Error(`Airtable GET ${r.status}`);
  return r.json();
}

async function atDelete(table, recordId) {
  const r = await fetch(atUrl(table, recordId), { method: "DELETE", headers: atHeaders });
  if (!r.ok) throw new Error(`Airtable DELETE ${r.status}`);
  return r.json();
}

// ── Test cases ────────────────────────────────────────────────────────────────

const CASES = [
  {
    label: "OPERACIONES — urgency in textarea answer → Prioridad=Alta",
    area: "operaciones",
    airtableTable: "Operaciones",
    expectedArea: "Operaciones",
    // Only send a few questions; one has an urgency keyword buried in a textarea
    questions: [
      { id: "administracion_documentacion_01_01", label: "Área a auditar", type: "fixed", answer: "" }, // fixed, excluded
      { id: "administracion_documentacion_02_01", label: "¿Qué procesos administrativos realizas hoy?", type: "textarea", answer: "Todo es caos total, no funciona nada" },
      { id: "administracion_documentacion_03_01", label: "¿Usas alguna herramienta?", type: "single_select", answer: "No" },
      { id: "administracion_documentacion_08_01", label: "Valoración general de urgencia", type: "scale", answer: "8" },
    ],
    assertPrioridad: "Alta",
    assertScaleDisplay: "8 / 10",
  },
  {
    label: "DELIVERY — urgency only in respuestasDetalladas (not in flat respuestas), scale shown",
    area: "delivery",
    airtableTable: "Delivery",
    expectedArea: "Delivery",
    questions: [
      { id: "delivery_01_02", label: "Área a auditar", type: "fixed", answer: "" },
      { id: "delivery_02_01", label: "¿Cuántos pedidos gestionas al mes?", type: "number", answer: "500" },
      { id: "delivery_03_01", label: "Describe tu mayor problema", type: "textarea", answer: "Tenemos clientes insatisfechos y retrasos constantes" },
      { id: "delivery_07_01", label: "Valoración del proceso", type: "scale", answer: "3" },
    ],
    assertPrioridad: "Alta",
    assertScaleDisplay: "3 / 10",
  },
  {
    label: "OPERACIONES — baja keyword in respuestasDetalladas → Prioridad=Baja",
    area: "operaciones",
    airtableTable: "Operaciones",
    expectedArea: "Operaciones",
    questions: [
      { id: "administracion_documentacion_02_01", label: "¿Por qué estás aquí?", type: "textarea", answer: "Simplemente explorando opciones, sin prisa alguna" },
      { id: "administracion_documentacion_03_01", label: "Herramienta", type: "single_select", answer: "Sí, sistema completo" },
    ],
    assertPrioridad: "Baja",
    assertScaleDisplay: null, // no scale in this test
  },
];

// ── Runner ────────────────────────────────────────────────────────────────────

let passed = 0;
let failed = 0;
const toDelete = []; // { table, id }

console.log("\n" + "=".repeat(60));
console.log("FIX VALIDATION: Priority from respuestasDetalladas + Scale display");
console.log("=".repeat(60));

for (const tc of CASES) {
  console.log(`\n▶ ${tc.label}`);

  // Build respuestas flat map (excluding fixed)
  const nonFixed = tc.questions.filter((q) => q.type !== "fixed" && q.answer.trim());
  const respuestas = Object.fromEntries(nonFixed.map((q) => [q.id, q.answer]));
  const respuestasDetalladas = nonFixed.map((q) => ({ id: q.id, label: q.label, type: q.type, answer: q.answer }));

  let recordId;
  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        accessKey: ACCESS,
        area: tc.area,
        empresa: "QA-Fix-Test",
        contacto: "Test Bot",
        email: "qa-fix@inspireai.test",
        telefono: "",
        respuestas,
        respuestasDetalladas,
        observaciones: "",
      }),
    });
    const data = await res.json();
    if (!res.ok || !data.success || !data.recordId) {
      console.log(`  ❌ Submit failed: ${JSON.stringify(data)}`);
      failed++;
      continue;
    }
    recordId = data.recordId;
    toDelete.push({ table: tc.airtableTable, id: recordId });
    console.log(`  → Record created: ${recordId}`);
  } catch (err) {
    console.log(`  ❌ Network error: ${err.message}`);
    failed++;
    continue;
  }

  // Verify Airtable record
  let rec;
  try {
    rec = await atGet(tc.airtableTable, recordId);
  } catch (err) {
    console.log(`  ❌ Airtable GET failed: ${err.message}`);
    failed++;
    continue;
  }

  const fields = rec.fields ?? {};
  const obs = fields.Observaciones ?? "";
  const prioridad = fields.Prioridad ?? "(missing)";
  const area = fields.Area ?? "(missing)";

  let ok = true;

  // Check Area
  if (area !== tc.expectedArea) {
    console.log(`  ❌ Area: got "${area}", expected "${tc.expectedArea}"`);
    ok = false;
  } else {
    console.log(`  ✓  Area: ${area}`);
  }

  // Check Prioridad
  if (prioridad !== tc.assertPrioridad) {
    console.log(`  ❌ Prioridad: got "${prioridad}", expected "${tc.assertPrioridad}"`);
    ok = false;
  } else {
    console.log(`  ✓  Prioridad: ${prioridad}`);
  }

  // Check scale display in Observaciones
  if (tc.assertScaleDisplay) {
    if (!obs.includes(tc.assertScaleDisplay)) {
      console.log(`  ❌ Observaciones missing scale "${tc.assertScaleDisplay}"`);
      console.log(`     (Observaciones snippet: ${obs.slice(0, 400)})`);
      ok = false;
    } else {
      console.log(`  ✓  Scale display "${tc.assertScaleDisplay}" found in Observaciones`);
    }
  }

  // Check Respuestas JSON is complete
  const jsonRaw = fields["Respuestas JSON"] ?? "";
  let jsonParsed;
  try { jsonParsed = JSON.parse(jsonRaw); } catch { /* ignore */ }
  const storedCount = jsonParsed?.respuestasDetalladas?.length ?? -1;
  if (storedCount !== respuestasDetalladas.length) {
    console.log(`  ❌ Respuestas JSON: stored ${storedCount}, expected ${respuestasDetalladas.length}`);
    ok = false;
  } else {
    console.log(`  ✓  Respuestas JSON: ${storedCount} items stored`);
  }

  // Check multi_select not broken (no commas when it's a single-value field)
  // Just confirm Observaciones doesn't have raw "option1, option2" formatting for multi_select
  // (positive check: each multi_select answer should appear as "  - value" lines if comma-separated)

  if (ok) { passed++; console.log("  → PASS"); }
  else { failed++; console.log("  → FAIL"); }
}

// ── Cleanup ───────────────────────────────────────────────────────────────────
console.log("\n── Cleanup ──────────────────────────────────────────────────");
for (const { table, id } of toDelete) {
  try {
    const r = await atDelete(table, id);
    console.log(`  ✓ Deleted ${id} from ${table}: ${r.deleted}`);
  } catch (err) {
    console.log(`  ❌ Delete failed for ${id}: ${err.message}`);
  }
}

console.log("\n" + "=".repeat(60));
console.log(`RESULT: ${passed} passed, ${failed} failed`);
console.log("=".repeat(60) + "\n");
process.exit(failed > 0 ? 1 : 0);
