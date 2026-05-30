import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, ADMIN_USER_ID } from "@/lib/supabase-server";

type AreaKey = "ventas" | "marketing" | "operaciones" | "delivery" | "administracion_documentacion";

interface RespuestaDetallada {
  id: string;
  label: string;
  type: string;
  answer: string;
  section?: string;
}

// Mapeo área → columna de status en deals
const AREA_TO_STATUS: Record<AreaKey, string> = {
  ventas:                       "ventas_status",
  marketing:                    "marketing_status",
  operaciones:                  "operaciones_status",
  delivery:                     "delivery_status",
  administracion_documentacion: "operaciones_status",
};

const AREA_ALIASES: Record<string, AreaKey> = {
  ventas: "ventas", sales: "ventas",
  marketing: "marketing",
  operaciones: "operaciones", operations: "operaciones",
  delivery: "delivery", fulfillment: "delivery",
  administracion_documentacion: "administracion_documentacion",
  administracion: "administracion_documentacion", admin: "administracion_documentacion",
};

const AREA_NAMES: Record<AreaKey, string> = {
  ventas: "Ventas", marketing: "Marketing",
  operaciones: "Operaciones", delivery: "Fulfillment / Delivery",
  administracion_documentacion: "Administración y Documentación",
};

const ALTA_KEYWORDS = [
  "urgente", "urgencia", "crítico", "critico", "inmediato", "este mes",
  "pérdida", "perdida", "perdemos", "clientes perdidos", "colapso",
  "saturado", "saturados", "no podemos", "no damos abasto",
];

function calcPriority(respuestas: RespuestaDetallada[], observaciones: string): string {
  const texto = [
    observaciones,
    ...respuestas.map(r => r.answer),
  ].join(" ").toLowerCase();

  const hasScale9Plus = respuestas.some(r => r.type === "scale" && parseInt(r.answer) >= 9);
  const hasAltaKeyword = ALTA_KEYWORDS.some(k => texto.includes(k));
  if (hasScale9Plus || hasAltaKeyword) return "Alta";

  const hasScale7Plus = respuestas.some(r => r.type === "scale" && parseInt(r.answer) >= 7);
  if (hasScale7Plus) return "Media";

  return "Baja";
}

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, error: "Cuerpo inválido" }, { status: 400 });
  }

  const {
    area: areaRaw,
    empresa, contacto, email, telefono,
    respuestas: respuestasRaw = [],
    observaciones = "",
    accessKey,
  } = body as {
    area?: string; empresa?: string; contacto?: string;
    email?: string; telefono?: string;
    respuestas?: RespuestaDetallada[];
    observaciones?: string; accessKey?: string;
  };

  // Verificar access key
  const validKey = process.env.ONBOARDING_ACCESS_KEY;
  if (validKey && accessKey !== validKey) {
    return NextResponse.json({ success: false, error: "Clave de acceso inválida" }, { status: 403 });
  }

  const area = AREA_ALIASES[areaRaw?.toLowerCase().trim() ?? ""] ?? null;
  if (!area) {
    return NextResponse.json({ success: false, error: `Área desconocida: ${areaRaw}` }, { status: 400 });
  }
  if (!email?.trim()) {
    return NextResponse.json({ success: false, error: "El email es obligatorio" }, { status: 400 });
  }

  const prioridad = calcPriority(respuestasRaw, observaciones as string);
  const statusCol = AREA_TO_STATUS[area];

  try {
    // 1. Buscar contacto existente por email
    let contactId: string | null = null;
    let dealId: string | null = null;

    const { data: existingContact } = await supabaseAdmin
      .from("contacts")
      .select("id")
      .eq("email", email.trim().toLowerCase())
      .eq("user_id", ADMIN_USER_ID)
      .maybeSingle();

    if (existingContact) {
      contactId = existingContact.id;
    } else {
      // Crear empresa si hace falta
      let companyId: string | null = null;
      if (empresa?.trim()) {
        const { data: existComp } = await supabaseAdmin
          .from("companies").select("id").eq("name", empresa.trim()).eq("user_id", ADMIN_USER_ID).maybeSingle();
        if (existComp) {
          companyId = existComp.id;
        } else {
          const { data: nc } = await supabaseAdmin.from("companies")
            .insert({ name: empresa.trim(), user_id: ADMIN_USER_ID }).select("id").single();
          companyId = nc?.id ?? null;
        }
      }
      // Crear contacto
      const { data: newContact } = await supabaseAdmin.from("contacts").insert({
        name: contacto?.trim() ?? email.trim(),
        email: email.trim().toLowerCase(),
        phone: telefono?.trim() ?? null,
        company_id: companyId,
        type: "prospect",
        owner: "AR",
        lead_source: "web",
        user_id: ADMIN_USER_ID,
      }).select("id").single();
      contactId = newContact?.id ?? null;
    }

    if (!contactId) throw new Error("No se pudo crear el contacto");

    // 2. Buscar deal existente vinculado a este contacto
    const { data: existingDeal } = await supabaseAdmin
      .from("deals").select("id, stage")
      .eq("contact_id", contactId).eq("user_id", ADMIN_USER_ID)
      .order("created_at", { ascending: false }).limit(1).maybeSingle();

    if (existingDeal) {
      dealId = existingDeal.id;
      // Avanzar a diagnostico_activo si aún estaba en lead/reunion
      if (["lead_nuevo","reunion_inicial"].includes(existingDeal.stage)) {
        await supabaseAdmin.from("deals").update({
          stage: "diagnostico_activo",
          [statusCol]: "en_progreso",
        }).eq("id", dealId);
      } else {
        await supabaseAdmin.from("deals").update({ [statusCol]: "en_progreso" }).eq("id", dealId);
      }
    } else {
      // Crear nuevo deal en diagnostico_activo
      const { data: newDeal } = await supabaseAdmin.from("deals").insert({
        title: `Diagnóstico — ${empresa?.trim() ?? contacto?.trim() ?? email.trim()}`,
        contact_id: contactId,
        stage: "diagnostico_activo",
        value: 0,
        owner: "AR",
        lead_source: "web",
        [statusCol]: "en_progreso",
        user_id: ADMIN_USER_ID,
      }).select("id").single();
      dealId = newDeal?.id ?? null;
    }

    // 3. Guardar respuestas del cuestionario
    await supabaseAdmin.from("diagnostico_respuestas").insert({
      contact_id: contactId,
      deal_id: dealId,
      area: area,
      empresa: empresa?.trim() ?? null,
      contacto: contacto?.trim() ?? null,
      email: email.trim().toLowerCase(),
      telefono: telefono?.trim() ?? null,
      respuestas: respuestasRaw,
      observaciones: observaciones as string,
      prioridad,
    });

    // 4. Actividad
    await supabaseAdmin.from("activities").insert({
      type: "note",
      text: `Cuestionario de ${AREA_NAMES[area]} completado. Prioridad: ${prioridad}. ${respuestasRaw.length} respuestas recibidas.`,
      contact_id: contactId,
      deal_id: dealId,
      owner: "AR",
      user_id: ADMIN_USER_ID,
    });

    console.log(`[/api/onboarding/submit] ✅ ${area} guardado — contact:${contactId} deal:${dealId}`);
    return NextResponse.json({ success: true, area, contactId, dealId, prioridad });

  } catch (err: unknown) {
    console.error("[/api/onboarding/submit] Error:", err);
    return NextResponse.json({ success: false, error: "Error interno del servidor" }, { status: 500 });
  }
}
