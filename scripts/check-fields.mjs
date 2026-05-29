#!/usr/bin/env node
import { readFileSync } from "fs";
import { resolve } from "path";

function loadEnv() {
  const content = readFileSync(resolve(process.cwd(), ".env.local"), "utf-8");
  const env = {};
  for (const line of content.split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const idx = t.indexOf("=");
    if (idx === -1) continue;
    env[t.slice(0, idx).trim()] = t.slice(idx + 1).trim().replace(/^["']|["']$/g, "");
  }
  return env;
}

const { AIRTABLE_TOKEN, AIRTABLE_BASE_ID } = loadEnv();
const res = await fetch(`https://api.airtable.com/v0/meta/bases/${AIRTABLE_BASE_ID}/tables`, {
  headers: { Authorization: `Bearer ${AIRTABLE_TOKEN}` },
});
const data = await res.json();

const TARGET = ["Leads", "Ventas", "Marketing", "Operaciones", "Delivery"];

for (const table of data.tables) {
  if (!TARGET.includes(table.name)) continue;
  console.log(`\n━━━ Tabla: "${table.name}" ━━━`);
  for (const f of table.fields) {
    const choices = f.options?.choices?.map(c => `"${c.name}"`).join(", ");
    console.log(`  "${f.name}"  →  ${f.type}${choices ? `  [${choices}]` : ""}`);
  }
}
