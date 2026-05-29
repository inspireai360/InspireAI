#!/usr/bin/env node
// Inspects the real Notion template to understand its structure
// Usage: node --use-system-ca scripts/inspect-notion-template.mjs

import { getPage, getDatabase, getAllBlocks, getNotionConfig } from "./lib/notion-client.mjs";

const TEMPLATE_ID = "34974667e4dd8057b5b5f5fb0acefeb1";

function extractText(richText) {
  if (!richText || !Array.isArray(richText)) return "";
  return richText.map((rt) => rt.plain_text ?? rt.text?.content ?? "").join("");
}

function describeBlock(b, indent = 0) {
  const pad = "  ".repeat(indent);
  const type = b.type;
  const data = b[type] ?? {};
  const text = extractText(data.rich_text ?? data.title ?? []).slice(0, 80);
  const childCount = data.has_children ? " [has_children]" : "";
  return `${pad}[${type}] "${text}"${childCount} id=${b.id}`;
}

async function main() {
  const config = getNotionConfig();
  console.log("Token present:", !!config.token);
  console.log("\n--- Fetching template page:", TEMPLATE_ID, "---");

  let page;
  try {
    page = await getPage(TEMPLATE_ID);
  } catch (err) {
    console.error("Error fetching page:", err.message);
    process.exit(1);
  }

  console.log("Page URL:", page.url);
  console.log("Parent type:", page.parent?.type);
  if (page.parent?.database_id) {
    console.log("Parent database_id:", page.parent.database_id);
  } else if (page.parent?.page_id) {
    console.log("Parent page_id:", page.parent.page_id);
  }

  const propNames = Object.keys(page.properties ?? {});
  console.log("\nPage properties:", propNames);
  for (const [key, val] of Object.entries(page.properties ?? {})) {
    const type = val.type;
    let valStr = "";
    try {
      if (type === "title") valStr = extractText(val.title);
      else if (type === "rich_text") valStr = extractText(val.rich_text);
      else if (type === "select") valStr = val.select?.name ?? "—";
      else if (type === "date") valStr = val.date?.start ?? "—";
      else if (type === "multi_select") valStr = (val.multi_select ?? []).map((o) => o.name).join(", ");
      else valStr = JSON.stringify(val[type]).slice(0, 60);
    } catch { valStr = "(parse error)"; }
    console.log(`  ${key} (${type}): ${valStr}`);
  }

  if (page.parent?.database_id) {
    console.log("\n--- Fetching parent database:", page.parent.database_id, "---");
    try {
      const db = await getDatabase(page.parent.database_id);
      console.log("Database title:", extractText(db.title));
      console.log("Database properties:");
      for (const [key, val] of Object.entries(db.properties ?? {})) {
        const options = val.select?.options?.map((o) => o.name).join(", ") ?? val.multi_select?.options?.map((o) => o.name).join(", ") ?? "";
        console.log(`  ${key} (${val.type})${options ? `: [${options}]` : ""}`);
      }
    } catch (err) {
      console.error("Error fetching database:", err.message);
    }
  }

  console.log("\n--- Template page blocks ---");
  let blocks;
  try {
    blocks = await getAllBlocks(TEMPLATE_ID);
  } catch (err) {
    console.error("Error fetching blocks:", err.message);
    process.exit(1);
  }

  console.log(`Total top-level blocks: ${blocks.length}`);
  for (const b of blocks) {
    console.log(describeBlock(b, 1));
    if (b.has_children && (b.type === "toggle" || b.type === "child_page")) {
      try {
        const children = await getAllBlocks(b.id);
        for (const c of children) {
          console.log(describeBlock(c, 2));
        }
      } catch (err) {
        console.log(`    (error fetching children: ${err.message})`);
      }
    }
  }
}

main().catch((err) => { console.error("Fatal:", err.message); process.exit(1); });
