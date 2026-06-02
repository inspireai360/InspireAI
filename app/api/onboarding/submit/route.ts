export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, ADMIN_USER_ID } from "@/lib/supabase-server";
import { sendQuestionnaireNotification } from "@/lib/mailer";
import { updateRecord } from "@/lib/airtable";

type AreaKey = "ventas" | "marketing" | "operaciones" | "delivery" | "administracion_documentacion";
interface RespuestaDetallada { id: string; label: string; type: string; answer: string; section?: string; }

const AREA_ALIASES: Record<string, AreaKey> = {
  ventas:"ventas", sales:"ventas", marketing:"marketing",
  operaciones:"operaciones", operations:"operaciones",
  delivery:"delivery", fulfillment:"delivery",
  administracion_documentacion:"administracion_documentacion",
  administracion:"administracion_documentacion", admin:"administracion_documentacion",
};
const AREA_NAMES: Record<AreaKey, string> = {
  ventas:"Ventas", marketing:"Marketing", operaciones:"Operaciones",
  delivery:"Fulfillment / Delivery", administracion_documentacion:"Administración y Documentación",
};
const AREA_TO_STATUS: Record<AreaKey, string> = {
  ventas:"ventas_status", marketing:"marketing_status",
  operaciones:"operaciones_status", delivery:"delivery_status",
  administracion_documentacion:"operaciones_status",
};
const ALTA_KEYWORDS = ["urgente","urgencia","crítico","critico","inmediato","este mes",
  "pérdida","perdida","perdemos","clientes perdidos","colapso","saturado","saturados"];

function calcPriority(respuestas: RespuestaDetallada[], obs: string): string {
  const texto = [obs, ...respuestas.map(r => r.answer)].join(" ").toLowerCase();
  if (respuestas.some(r => r.type === "scale" && parseInt(r.answer) >= 9) || ALTA_KEYWORDS.some(k => texto.includes(k))) return "Alta";
  if (respuestas.some(r => r.type === "scale" && parseInt(r.answer) >= 7)) return "Media";
  return "Baja";
}

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try { body = await req.json(); }
  catch { return NextResponse.json({ success: false, error: "Cuerpo inválido" }, { status: 400 }); }

  const { area: areaRaw, empresa, contacto, email, telefono,
    respuestas: respuestasRaw = [], observaciones = "", accessKey, tokenRecordId } = body as {
    area?: string; empresa?: string; contacto?: string; email?: string; telefono?: string;
    respuestas?: RespuestaDetallada[]; observaciones?: string; accessKey?: string; tokenRecordId?: string;
  };

  const validKey = process.env.ONBOARDING_ACCESS_KEY;
  if (validKey && accessKey !== validKey)
    return NextResponse.json({ success: false, error: "Clave de acceso inválida" }, { status: 403 });

  const area = AREA_ALIASES[areaRaw?.toLowerCase().trim() ?? ""] ?? null;
  if (!area) return NextResponse.json({ success: false, error: `Área desconocida: ${areaRaw}` }, { status: 400 });
  if (!email?.trim()) return NextResponse.json({ success: false, error: "El email es obligatorio" }, { status: 400 });

  const prioridad = calcPriority(respuestasRaw, observaciones as string);
  const statusCol = AREA_TO_STATUS[area];

  try {
    let contactId: string | null = null, dealId: string | null = null;

    const { data: existingContact } = await supabaseAdmin.from("contacts").select("id")
      .eq("email", email.trim().toLowerCase()).eq("user_id", ADMIN_USER_ID).maybeSingle();

    if (existingContact) {
      contactId = existingContact.id;
    } else {
      let companyId: string | null = null;
      if (empresa?.trim()) {
        const { data: ec } = await supabaseAdmin.from("companies").select("id")
          .eq("name", empresa.trim()).eq("user_id", ADMIN_USER_ID).maybeSingle();
        if (ec) { companyId = ec.id; }
        else {
          const { data: nc } = await supabaseAdmin.from("companies")
            .insert({ name: empresa.trim(), user_id: ADMIN_USER_ID }).select("id").single();
          companyId = nc?.id ?? null;
        }
      }
      const { data: nc } = await supabaseAdmin.from("contacts").insert({
        name: contacto?.trim() ?? email.trim(), email: email.trim().toLowerCase(),
        phone: telefono?.trim() ?? null, company_id: companyId,
        type: "prospect", owner: "LL", lead_source: "web", user_id: ADMIN_USER_ID,
      }).select("id").single();
      contactId = nc?.id ?? null;
    }

    if (!contactId) throw new Error("No se pudo crear el contacto");

    const { data: existingDeal } = await supabaseAdmin.from("deals").select("id,stage")
      .eq("contact_id", contactId).eq("user_id", ADMIN_USER_ID)
      .order("created_at", { ascending: false }).limit(1).maybeSingle();

    if (existingDeal) {
      dealId = existingDeal.id;
      const update: Record<string, string> = { [statusCol]: "en_progreso" };
      if (["lead_nuevo","reunion_inicial"].includes(existingDeal.stage)) update.stage = "diagnostico_activo";
      await supabaseAdmin.from("deals").update(update).eq("id", dealId);
    } else {
      const { data: nd } = await supabaseAdmin.from("deals").insert({
        title: `Diagnóstico — ${empresa?.trim() ?? contacto?.trim() ?? email.trim()}`,
        contact_id: contactId, stage: "diagnostico_activo", value: 0,
        owner: "LL", lead_source: "web", [statusCol]: "en_progreso", user_id: ADMIN_USER_ID,
      }).select("id").single();
      dealId = nd?.id ?? null;
    }

    await supabaseAdmin.from("diagnostico_respuestas").insert({
      contact_id: contactId, deal_id: dealId, area,
      empresa: empresa?.trim() ?? null, contacto: contacto?.trim() ?? null,
      email: email.trim().toLowerCase(), telefono: telefono?.trim() ?? null,
      respuestas: respuestasRaw, observaciones: observaciones as string, prioridad,
    });

    await supabaseAdmin.from("activities").insert({
      type: "note",
      text: `Cuestionario de ${AREA_NAMES[area]} completado. Prioridad: ${prioridad}. ${respuestasRaw.length} respuestas.`,
      contact_id: contactId, deal_id: dealId, owner: "LL", user_id: ADMIN_USER_ID,
    });

    // Notificación por email (fire & forget)
    // Marcar token como Usado para que el enlace no pueda volver a enviarse
    if (tokenRecordId && process.env.AIRTABLE_TOKENS_TABLE) {
      updateRecord(process.env.AIRTABLE_TOKENS_TABLE, tokenRecordId, { estado: "Usado" })
        .catch(err => console.error("[submit] No se pudo invalidar el token:", err));
    }

    sendQuestionnaireNotification({
      area, areaName: AREA_NAMES[area], contacto: contacto?.trim() ?? email.trim(),
      email: email.trim().toLowerCase(), empresa: empresa?.trim(),
      numRespuestas: respuestasRaw.length, prioridad,
    }).catch(err => console.error("[mailer] questionnaire:", err));

    return NextResponse.json({ success: true, area, contactId, dealId, prioridad });
  } catch (err) {
    console.error("[/api/onboarding/submit] Error:", err);
    return NextResponse.json({ success: false, error: "Error interno del servidor" }, { status: 500 });
  }
}
