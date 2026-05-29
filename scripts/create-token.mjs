#!/usr/bin/env node
/**
 * Genera un token único para un cliente y lo inserta en la tabla Tokens de Airtable.
 *
 * Uso:
 *   node scripts/create-token.mjs \
 *     --area=ventas \
 *     --empresa="Acme Corp" \
 *     --contacto="Juan García" \
 *     --email="juan@acme.com" \
 *     [--telefono="+34 600 000 000"] \
 *     [--expira="2025-12-31"] \
 *     [--notas="Cliente referido por Pedro"]
 *
 * Áreas válidas: ventas, marketing, operaciones, delivery
 *
 * Requiere: .env.local con AIRTABLE_TOKEN, AIRTABLE_BASE_ID, AIRTABLE_TOKENS_TABLE
 *           y BASE_URL (opcional, por defecto https://inspireai.es)
 */

import { readFileSync } from "fs";
import { randomUUID } from "crypto";
import { resolve } from "path";

// ── Leer .env.local ──────────────────────────────────────────────────────────

function loadEnv() {
  const envPath = resolve(process.cwd(), ".env.local");
  try {
    const content = readFileSync(envPath, "utf-8");
    const env = {};
    for (const line of content.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const idx = trimmed.indexOf("=");
      if (idx === -1) continue;
      const key = trimmed.slice(0, idx).trim();
      const val = trimmed.slice(idx + 1).trim().replace(/^["']|["']$/g, "");
      env[key] = val;
    }
    return env;
  } catch {
    console.error("❌  No se encontró .env.local. Crea el archivo antes de ejecutar este script.");
    process.exit(1);
  }
}

// ── Parsear argumentos --key=value ───────────────────────────────────────────

function parseArgs(argv) {
  const args = {};
  for (const arg of argv) {
    if (!arg.startsWith("--")) continue;
    const idx = arg.indexOf("=");
    if (idx === -1) {
      args[arg.slice(2)] = true;
    } else {
      const key = arg.slice(2, idx);
      const val = arg.slice(idx + 1).replace(/^["']|["']$/g, "");
      args[key] = val;
    }
  }
  return args;
}

// ── Validaciones ─────────────────────────────────────────────────────────────

const VALID_AREAS = ["ventas", "marketing", "operaciones", "delivery"];

function validateArgs(args) {
  const errors = [];
  if (!args.area) errors.push("--area es obligatorio (ventas|marketing|operaciones|delivery)");
  else if (!VALID_AREAS.includes(args.area.toLowerCase())) {
    errors.push(`--area debe ser uno de: ${VALID_AREAS.join(", ")}`);
  }
  if (!args.empresa) errors.push("--empresa es obligatorio");
  if (!args.contacto) errors.push("--contacto es obligatorio");
  if (!args.email) errors.push("--email es obligatorio");
  else if (!/\S+@\S+\.\S+/.test(args.email)) errors.push("--email no tiene formato válido");
  if (args.expira) {
    const d = new Date(args.expira);
    if (isNaN(d.getTime())) errors.push("--expira no tiene formato de fecha válido (usa YYYY-MM-DD)");
    else if (d < new Date()) errors.push("--expira es una fecha pasada");
  }
  if (errors.length > 0) {
    console.error("\n❌  Errores en los argumentos:\n");
    errors.forEach((e) => console.error(`   • ${e}`));
    console.error("\nEjemplo:\n  node scripts/create-token.mjs --area=ventas --empresa=\"Acme\" --contacto=\"Juan\" --email=\"juan@acme.com\"\n");
    process.exit(1);
  }
}

// ── Insertar en Airtable ─────────────────────────────────────────────────────

async function insertToken({ env, token, area, empresa, contacto, email, telefono, expira, notas }) {
  const { AIRTABLE_TOKEN, AIRTABLE_BASE_ID, AIRTABLE_TOKENS_TABLE } = env;

  if (!AIRTABLE_TOKEN || !AIRTABLE_BASE_ID || !AIRTABLE_TOKENS_TABLE) {
    console.error("❌  Faltan variables en .env.local: AIRTABLE_TOKEN, AIRTABLE_BASE_ID, AIRTABLE_TOKENS_TABLE");
    process.exit(1);
  }

  const fields = {
    token,
    area: area.toLowerCase(),
    empresa,
    contacto,
    email: email.toLowerCase(),
    telefono: telefono ?? "",
    estado: "Activo",
    notas: notas ?? "",
    ...(expira ? { expira: new Date(expira).toISOString().split("T")[0] } : {}),
  };

  const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_TOKENS_TABLE)}`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${AIRTABLE_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ fields }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const msg = body?.error?.message ?? `HTTP ${res.status}`;
    console.error(`\n❌  Error de Airtable: ${msg}`);
    if (res.status === 401 || res.status === 403) {
      console.error("   Verifica que AIRTABLE_TOKEN sea válido y tenga permisos de escritura.");
    }
    if (res.status === 404) {
      console.error("   Verifica AIRTABLE_BASE_ID y que AIRTABLE_TOKENS_TABLE coincida con el nombre exacto de la tabla.");
    }
    if (res.status === 422) {
      console.error("   Algún campo no existe en la tabla o el tipo de dato es incorrecto.");
      console.error("   Detalle:", JSON.stringify(body, null, 2));
    }
    process.exit(1);
  }

  const data = await res.json();
  return data.id;
}

// ── Colores para consola ─────────────────────────────────────────────────────

const C = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  green: "\x1b[32m",
  cyan: "\x1b[36m",
  yellow: "\x1b[33m",
  dim: "\x1b[2m",
  line: "━".repeat(56),
};

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const args = parseArgs(process.argv.slice(2));

  if (args.help || args.h) {
    console.log(`
${C.bold}create-token.mjs${C.reset} — Genera un enlace único de onboarding para un cliente

${C.bold}Uso:${C.reset}
  node scripts/create-token.mjs \\
    --area=<ventas|marketing|operaciones|delivery> \\
    --empresa="Nombre empresa" \\
    --contacto="Nombre contacto" \\
    --email="email@empresa.com" \\
    [--telefono="+34 600 000 000"] \\
    [--expira="YYYY-MM-DD"] \\
    [--notas="Texto interno"]

${C.bold}Ejemplo:${C.reset}
  node scripts/create-token.mjs \\
    --area=ventas \\
    --empresa="Acme Corp" \\
    --contacto="Juan García" \\
    --email="juan@acme.com" \\
    --expira="2025-12-31"
`);
    process.exit(0);
  }

  validateArgs(args);

  const env = loadEnv();
  const token = randomUUID();
  const area = args.area.toLowerCase();

  console.log(`\n${C.dim}Conectando con Airtable...${C.reset}`);

  const recordId = await insertToken({
    env,
    token,
    area,
    empresa: args.empresa,
    contacto: args.contacto,
    email: args.email,
    telefono: args.telefono,
    expira: args.expira,
    notas: args.notas,
  });

  const baseUrl = (env.BASE_URL ?? "https://inspireai.es").replace(/\/$/, "");
  const link = `${baseUrl}/onboarding/${area}?token=${token}`;

  console.log(`
${C.green}${C.bold}✅  Token creado correctamente${C.reset}
${C.dim}${C.line}${C.reset}
${C.bold}Token:${C.reset}      ${token}
${C.bold}Empresa:${C.reset}    ${args.empresa}
${C.bold}Contacto:${C.reset}   ${args.contacto}
${C.bold}Email:${C.reset}      ${args.email}
${C.bold}Área:${C.reset}       ${area}
${C.bold}Expira:${C.reset}     ${args.expira ?? "Sin expiración"}
${C.bold}Record ID:${C.reset}  ${recordId}
${C.dim}${C.line}${C.reset}

${C.cyan}${C.bold}🔗 Enlace para enviar al cliente:${C.reset}
${C.bold}${link}${C.reset}

${C.dim}Guarda este enlace — el token no se puede recuperar una vez cerrado el terminal.${C.reset}
`);
}

main().catch((err) => {
  console.error("\n❌  Error inesperado:", err.message ?? err);
  process.exit(1);
});
