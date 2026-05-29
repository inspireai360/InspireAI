/**
 * notion-client.mjs
 * Cliente Notion para scripts locales (Node.js ESM).
 * Lee credenciales desde .env.local — NUNCA expone tokens en output.
 */

import { loadEnv } from "./airtable-client.mjs";

// ─── ID extraction ────────────────────────────────────────────────────────────

function extractNotionId(raw) {
  if (!raw) return null;
  const clean = raw.trim();
  // Already a UUID
  if (/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(clean)) return clean;
  // Extract 32-char hex from URL or bare string
  const m = clean.match(/([a-f0-9]{32})(?:\?.*)?$/i);
  if (!m) return clean; // Return as-is; Notion API will report a useful error
  const h = m[1];
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`;
}

// ─── Config ────────────────────────────────────────────────────────────────

let _config = null;

export function getNotionConfig() {
  if (_config) return _config;
  const env = loadEnv();
  const token = env.NOTION_TOKEN;
  if (!token) throw new Error("NOTION_TOKEN no encontrado en .env.local");
  const rawDbId = env.NOTION_DIAGNOSTICS_DATABASE_ID ?? null;
  const diagnosticsDatabaseId = extractNotionId(rawDbId);
  _config = {
    token,
    diagnosticsDatabaseId,
    templatePageId: env.NOTION_TEMPLATE_PAGE_ID ?? null,
  };
  return _config;
}

// ─── HTTP ──────────────────────────────────────────────────────────────────

async function notionFetch(path, method = "GET", body = null) {
  const { token } = getNotionConfig();
  const res = await fetch(`https://api.notion.com/v1${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      "Notion-Version": "2022-06-28",
      "Content-Type": "application/json",
    },
    ...(body !== null ? { body: JSON.stringify(body) } : {}),
  });
  if (!res.ok) {
    let detail = {};
    try { detail = await res.json(); } catch {}
    throw new Error(`Notion HTTP ${res.status}: ${detail?.message ?? "sin detalle"} (${path})`);
  }
  return res.json();
}

// ─── Block builders ────────────────────────────────────────────────────────

function rt(text, bold = false) {
  return {
    type: "text",
    text: { content: String(text ?? "").slice(0, 2000) },
    annotations: { bold },
  };
}

export function heading1(text) {
  return { object: "block", type: "heading_1", heading_1: { rich_text: [rt(text)] } };
}

export function heading2(text) {
  return { object: "block", type: "heading_2", heading_2: { rich_text: [rt(text)] } };
}

export function heading3(text) {
  return { object: "block", type: "heading_3", heading_3: { rich_text: [rt(text)] } };
}

export function paragraph(text, bold = false) {
  return {
    object: "block",
    type: "paragraph",
    paragraph: { rich_text: text ? [rt(text, bold)] : [] },
  };
}

export function bulletItem(text, bold = false) {
  return {
    object: "block",
    type: "bulleted_list_item",
    bulleted_list_item: { rich_text: [rt(text, bold)] },
  };
}

export function numberedItem(text) {
  return {
    object: "block",
    type: "numbered_list_item",
    numbered_list_item: { rich_text: [rt(text)] },
  };
}

export function divider() {
  return { object: "block", type: "divider", divider: {} };
}

export function callout(text, emoji = "💡") {
  return {
    object: "block",
    type: "callout",
    callout: { rich_text: [rt(text)], icon: { type: "emoji", emoji } },
  };
}

export function toggle(title, children = []) {
  return {
    object: "block",
    type: "toggle",
    toggle: { rich_text: [rt(title)], children },
  };
}

export function code(text, language = "json") {
  return {
    object: "block",
    type: "code",
    code: { rich_text: [rt(text)], language },
  };
}

// ─── API ───────────────────────────────────────────────────────────────────

export async function createDatabasePage(databaseId, properties, children = []) {
  const BATCH = 100;
  const page = await notionFetch("/pages", "POST", {
    parent: { type: "database_id", database_id: databaseId },
    properties,
    children: children.slice(0, BATCH),
  });
  const rest = children.slice(BATCH);
  if (rest.length > 0) await appendBlocks(page.id, rest);
  return page;
}

// Creates an inline database under a parent page.
// `properties` must include exactly one { title: {} } entry with the desired title field name.
export async function createDatabase(parentPageId, dbDisplayTitle, properties) {
  return notionFetch("/databases", "POST", {
    parent: { type: "page_id", page_id: parentPageId },
    title: [{ type: "text", text: { content: dbDisplayTitle } }],
    properties,
  });
}

// Creates a plain page under a parent page (not a database)
export async function createSubPage(parentPageId, title, children = []) {
  const BATCH = 100;
  const page = await notionFetch("/pages", "POST", {
    parent: { type: "page_id", page_id: parentPageId },
    properties: {
      title: [{ type: "text", text: { content: title } }],
    },
    children: children.slice(0, BATCH),
  });
  const rest = children.slice(BATCH);
  if (rest.length > 0) await appendBlocks(page.id, rest);
  return page;
}

export async function appendBlocks(blockId, children) {
  const BATCH = 100;
  const allResults = [];
  for (let i = 0; i < children.length; i += BATCH) {
    const res = await notionFetch(`/blocks/${blockId}/children`, "PATCH", {
      children: children.slice(i, i + BATCH),
    });
    allResults.push(...(res.results ?? []));
  }
  return allResults;
}

export async function getPage(pageId) {
  return notionFetch(`/pages/${pageId}`);
}

export async function updatePageProperties(pageId, properties) {
  return notionFetch(`/pages/${pageId}`, "PATCH", { properties });
}

export async function getDatabase(databaseId) {
  return notionFetch(`/databases/${databaseId}`);
}

export async function patchDatabase(dbId, properties) {
  return notionFetch(`/databases/${dbId}`, "PATCH", { properties });
}

export async function createDbEntry(dbId, properties = {}) {
  return notionFetch("/pages", "POST", {
    parent: { type: "database_id", database_id: dbId },
    properties,
  });
}

export async function getAllBlocks(blockId) {
  const results = [];
  let cursor = null;
  do {
    const qs = cursor ? `?start_cursor=${encodeURIComponent(cursor)}` : "";
    const res = await notionFetch(`/blocks/${blockId}/children${qs}`);
    results.push(...(res.results ?? []));
    cursor = res.has_more ? res.next_cursor : null;
  } while (cursor);
  return results;
}

export async function searchByTitle(query) {
  const res = await notionFetch("/search", "POST", {
    query,
    filter: { value: "page", property: "object" },
    sort: { direction: "descending", timestamp: "last_edited_time" },
    page_size: 10,
  });
  return res.results ?? [];
}

export function childDatabase(title) {
  return { object: "block", type: "child_database", child_database: { title } };
}
