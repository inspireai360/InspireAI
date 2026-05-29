#!/usr/bin/env node
// Inspects inline database schemas in the template
import { getDatabase, createDbEntry, getNotionConfig } from "./lib/notion-client.mjs";

// From template inspection output
const DB_IDS = {
  oportunidades:  "34974667-e4dd-811a-a92c-ee7c7d9d0560",
  vulnerabilidades: "34a74667-e4dd-808f-aa04-cc210111d8ec",
  roadmap:        "34974667-e4dd-8119-860b-d9ed74a11d2b",
};

async function main() {
  getNotionConfig();
  for (const [name, id] of Object.entries(DB_IDS)) {
    console.log(`\n=== ${name} (${id}) ===`);
    try {
      const db = await getDatabase(id);
      console.log("Title:", db.title?.map((t) => t.plain_text).join("") ?? "(no title)");
      for (const [key, val] of Object.entries(db.properties ?? {})) {
        const opts = val.select?.options?.map((o) => o.name) ?? val.multi_select?.options?.map((o) => o.name) ?? val.status?.options?.map((o) => o.name) ?? [];
        console.log(`  ${key} (${val.type})${opts.length ? ": [" + opts.join(", ") + "]" : ""}`);
      }
    } catch (err) {
      console.log("  Error:", err.message);
    }
  }
}

main().catch((err) => { console.error("Fatal:", err.message); process.exit(1); });
