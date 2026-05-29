/**
 * airtable-client.mjs
 * Cliente Airtable para scripts locales (Node.js ESM).
 * Lee credenciales desde .env.local — NUNCA expone tokens en output.
 */

import { readFileSync } from "fs";
import { resolve } from "path";

// ─── Cargar .env.local ─────────────────────────────────────────────────────

export function loadEnv(root = process.cwd()) {
  const content = readFileSync(resolve(root, ".env.local"), "utf-8");
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

// ─── Config ────────────────────────────────────────────────────────────────

let _config = null;

export function getConfig() {
  if (_config) return _config;
  const env = loadEnv();
  const token = env.AIRTABLE_TOKEN;
  const baseId = env.AIRTABLE_BASE_ID;
  if (!token) throw new Error("AIRTABLE_TOKEN no encontrado en .env.local");
  if (!baseId) throw new Error("AIRTABLE_BASE_ID no encontrado en .env.local");
  _config = { token, baseId, env };
  return _config;
}

export function getTableName(area, env) {
  const map = {
    ventas: env.AIRTABLE_TABLE_VENTAS,
    marketing: env.AIRTABLE_TABLE_MARKETING,
    operaciones: env.AIRTABLE_TABLE_OPERACIONES,
    delivery: env.AIRTABLE_TABLE_DELIVERY,
    leads: env.AIRTABLE_LEADS_TABLE,
  };
  const name = map[area?.toLowerCase()];
  if (!name) throw new Error(`No hay tabla configurada para área: "${area}"`);
  return name;
}

// ─── Helpers HTTP ──────────────────────────────────────────────────────────

async function handleError(res, tableName) {
  let body = {};
  try { body = await res.json(); } catch {}
  const msg = body?.error?.message ?? "sin detalle";
  throw new Error(`Airtable HTTP ${res.status} en tabla "${tableName}": ${msg}`);
}

// ─── API ───────────────────────────────────────────────────────────────────

export async function getRecord(tableName, recordId) {
  const { token, baseId } = getConfig();
  const url = `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableName)}/${encodeURIComponent(recordId)}`;
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) await handleError(res, tableName);
  return res.json();
}

export async function listRecords(tableName, { formula, sort, maxRecords = 10, fields } = {}) {
  const { token, baseId } = getConfig();
  const url = new URL(`https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableName)}`);
  if (formula) url.searchParams.set("filterByFormula", formula);
  if (maxRecords) url.searchParams.set("maxRecords", String(maxRecords));
  if (sort) url.searchParams.set("sort[0][field]", sort.field ?? "Fecha de envio");
  if (sort) url.searchParams.set("sort[0][direction]", sort.direction ?? "desc");
  if (fields) fields.forEach((f, i) => url.searchParams.set(`fields[${i}]`, f));
  const res = await fetch(url.toString(), { headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) await handleError(res, tableName);
  const data = await res.json();
  return data.records ?? [];
}

export async function getTableSchema(tableName) {
  const { token, baseId } = getConfig();
  const url = `https://api.airtable.com/v0/meta/bases/${baseId}/tables`;
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) await handleError(res, "meta/tables");
  const data = await res.json();
  return data.tables?.find((t) => t.name === tableName) ?? null;
}

export async function getAllTableSchemas() {
  const { token, baseId } = getConfig();
  const url = `https://api.airtable.com/v0/meta/bases/${baseId}/tables`;
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) await handleError(res, "meta/tables");
  const data = await res.json();
  return data.tables ?? [];
}

export async function updateRecord(tableName, recordId, fields) {
  const { token, baseId } = getConfig();
  const url = `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableName)}/${encodeURIComponent(recordId)}`;
  const res = await fetch(url, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ fields }),
  });
  if (!res.ok) await handleError(res, tableName);
  return res.json();
}

export async function createRecord(tableName, fields) {
  const { token, baseId } = getConfig();
  const url = `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableName)}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ fields }),
  });
  if (!res.ok) await handleError(res, tableName);
  return res.json();
}
