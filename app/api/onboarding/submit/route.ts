import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, ADMIN_USER_ID } from "@/lib/supabase-server";
import { checkRateLimit, containsSensitiveData, escapeHtml, isBotSubmission, isSameSiteRequest, isValidPhone, sanitizeInput } from "@/lib/security";
import { Resend } from "resend";

type AreaKey = "ventas" | "marketing" | "operaciones" | "delivery" | "administracion_documentacion";

type RespuestaDetallada = {
  id?: string; label?: string; type?: string; answer?: string; section?: string;
};

const MAX_LENGTHS = {
  empresa: 120,
  contacto: 120,
  email: 254,
  telefono: 32,
  observaciones: 2000,
  respuesta: 500,
};

function sanitizeRespuesta(respuesta: RespuestaDetallada): RespuestaDetallada {
  return {
    id: sanitizeInput(respuesta.id, 100),
    label: sanitizeInput(respuesta.label, 200),
    type: sanitizeInput(respuesta.type, 60),
    answer: sanitizeInput(respuesta.answer, MAX_LENGTHS.respuesta),
    section: sanitizeInput(respuesta.section, 120) || undefined,
  };
}

const AREA_ALIASES: Record<string, AreaKey> = {
  ventas: "ventas", sales: "ventas", marketing: "marketing",
  operaciones: "operaciones", operations: "operaciones",
  delivery: "delivery", fulfillment: "delivery",
  administracion_documentacion: "administracion_documentacion",
  administracion: "administracion_documentacion", admin: "administracion_documentacion",
};

const AREA_NAMES: Record<AreaKey, string> = {
  ventas: "Ventas", marketing: "Marketing", operaciones: "Operaciones",
  delivery: "Fulfillment / Delivery", administracion_documentacion: "Administración y Documentación",
};

const AREA_TO_STATUS: Record<AreaKey, string> = {
  ventas: "ventas_status", marketing: "marketing_status",
  operaciones: "operaciones_status", delivery: "delivery_status",
  administracion_documentacion: "operaciones_status",
};

const ALTA_KEYWORDS = [
  "urgente","urgencia","crítico","critico","inmediato","este mes",
  "pérdida","perdida","perdemos","clientes perdidos","colapso","saturado","saturados",
];

function calcPriority(respuestas: RespuestaDetallada[], obs: string): string {
  const texto = [obs, ...respuestas.map(r => r.answer ?? "")].join(" ").toLowerCase();
  if (respuestas.some(r => r.type === "scale" && parseInt(r.answer ?? "0") >= 9) || ALTA_KEYWORDS.some(k => texto.includes(k))) return "Alta";
  if (respuestas.some(r => r.type === "scale" && parseInt(r.answer ?? "0") >= 7)) return "Media";
  return "Baja";
}

const NOTIF_EMAILS = ["monteslluc@gmail.com", "Merikarpre@gmail.com"];
const PRIORIDAD_COLOR: Record<string, string> = { Alta: "#E86F6F", Media: "#E8A24F", Baja: "#3FB984" };

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try { body = await req.json(); }
  catch { return NextResponse.json({ success: false, error: "Cuerpo inválido" }, { status: 400 }); }

  const {
    area: areaRaw, empresa, contacto, email, telefono,
    respuestas: respuestasRaw = [], observaciones = "", accessKey, acceptedTerms,
  } = body as {
    area?: string; empresa?: string; contacto?: string; email?: string; telefono?: string;
    respuestas?: RespuestaDetallada[]; observaciones?: string; accessKey?: string; acceptedTerms?: boolean | string;
  };

  const rateLimit = checkRateLimit(req);
  if (!rateLimit.allowed) {
    return NextResponse.json({ success: false, error: rateLimit.error }, { status: 429 });
  }

  const validKey = process.env.ONBOARDING_ACCESS_KEY;
  if (validKey && accessKey !== validKey)
    return NextResponse.json({ success: false, error: "Clave de acceso inválida" }, { status: 403 });

  const appOrigin = process.env.APP_ORIGIN;
  if (appOrigin && !isSameSiteRequest(req, appOrigin)) {
    return NextResponse.json({ success: false, error: "Origen de petición no permitido" }, { status: 403 });
  }

  const botField = sanitizeInput(body.botField, 100);
  if (isBotSubmission(botField)) {
    return NextResponse.json({ success: false, error: "Petición sospechosa" }, { status: 400 });
  }

  const hasAcceptedTerms = acceptedTerms === true || acceptedTerms === "true";
  if (!hasAcceptedTerms) {
    return NextResponse.json({ success: false, error: "Debes aceptar las condiciones" }, { status: 400 });
  }

  const area = AREA_ALIASES[areaRaw?.toLowerCase().trim() ?? ""] ?? null;
  if (!area) return NextResponse.json({ success: false, error: `Área desconocida: ${String(areaRaw)}` }, { status: 400 });

  const empresaRaw = sanitizeInput(empresa, MAX_LENGTHS.empresa);
  const contactoRaw = sanitizeInput(contacto, MAX_LENGTHS.contacto);
  const emailRaw = sanitizeInput(email, MAX_LENGTHS.email).toLowerCase();
  const telefonoRaw = sanitizeInput(telefono, MAX_LENGTHS.telefono);
  const observacionesRaw = sanitizeInput(observaciones, MAX_LENGTHS.observaciones);
  const respuestas = Array.isArray(respuestasRaw)
    ? respuestasRaw.map((respuesta) => sanitizeRespuesta(respuesta))
    : [];

  if (!emailRaw)
    return NextResponse.json({ success: false, error: "El email es obligatorio" }, { status: 400 });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailRaw))
    return NextResponse.json({ success: false, error: "El email no tiene un formato válido" }, { status: 400 });
  if (telefonoRaw && !isValidPhone(telefonoRaw))
    return NextResponse.json({ success: false, error: "El teléfono no tiene un formato válido" }, { status: 400 });
  if (containsSensitiveData([empresaRaw, contactoRaw, emailRaw, telefonoRaw, observacionesRaw, respuestas.map(r => r.answer ?? "").join(" ")].join(" ")))
    return NextResponse.json({ success: false, error: "No puedo aceptar datos sensibles o secretos. Por favor, redacta el contenido y vuelve a intentarlo." }, { status: 400 });

  const empresaValue = empresaRaw;
  const contactoValue = contactoRaw;
  const emailValue = emailRaw;
  const telefonoValue = telefonoRaw || null;
  const observacionesValue = observacionesRaw;
  const prioridad = calcPriority(respuestas, observacionesValue);
  const statusCol = AREA_TO_STATUS[area];

  try {
    let contactId: string | null = null;
    let dealId: string | null = null;

    const { data: existingContact } = await supabaseAdmin.from("contacts").select("id")
      .eq("email", emailValue).eq("user_id", ADMIN_USER_ID).maybeSingle();

    if (existingContact) {
      contactId = existingContact.id;
    } else {
      let companyId: string | null = null;
      if (empresaValue) {
        const { data: ec } = await supabaseAdmin.from("companies").select("id").eq("name", empresaValue).eq("user_id", ADMIN_USER_ID).maybeSingle();
        if (ec) { companyId = ec.id; }
        else {
          const { data: nc } = await supabaseAdmin.from("companies").insert({ name: empresaValue, user_id: ADMIN_USER_ID }).select("id").single();
          companyId = nc?.id ?? null;
        }
      }
      const { data: nc } = await supabaseAdmin.from("contacts").insert({
        name: contactoValue || emailValue, email: emailValue,
        phone: telefonoValue, company_id: companyId,
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
      if (["lead_nuevo","reunion_inicial"].includes(existingDeal.stage)) {
        await supabaseAdmin.from("deals").update({ stage: "diagnostico_activo", [statusCol]: "en_progreso" }).eq("id", dealId);
      } else {
        await supabaseAdmin.from("deals").update({ [statusCol]: "en_progreso" }).eq("id", dealId);
      }
    } else {
      const { data: nd } = await supabaseAdmin.from("deals").insert({
        title: `Diagnóstico — ${empresaValue || contactoValue || emailValue}`,
        contact_id: contactId, stage: "diagnostico_activo", value: 0,
        owner: "LL", lead_source: "web", [statusCol]: "en_progreso", user_id: ADMIN_USER_ID,
      }).select("id").single();
      dealId = nd?.id ?? null;
    }

    await supabaseAdmin.from("diagnostico_respuestas").insert({
      contact_id: contactId, deal_id: dealId, area, empresa: empresaValue || null,
      contacto: contactoValue || null, email: emailValue,
      telefono: telefonoValue, respuestas,
      observaciones: observacionesValue, prioridad,
    });

    await supabaseAdmin.from("activities").insert({
      type: "note",
      text: `Cuestionario de ${AREA_NAMES[area]} completado. Prioridad: ${prioridad}. ${respuestasRaw.length} respuestas recibidas.`,
      contact_id: contactId, deal_id: dealId, owner: "LL", user_id: ADMIN_USER_ID,
    });

    // Notificación email cuestionario completado
    if (process.env.RESEND_API_KEY) {
      const resend = new Resend(process.env.RESEND_API_KEY);
      const prioColor = PRIORIDAD_COLOR[prioridad] ?? "#4F6FE8";
      const safeContacto = escapeHtml(contactoValue || emailValue);
      const safeEmail = escapeHtml(emailValue);
      const safeEmpresa = escapeHtml(empresaValue || "");
      const safePrioridad = escapeHtml(prioridad);
      const safeArea = escapeHtml(AREA_NAMES[area]);

      await resend.emails.send({
        from: "InspireAI CRM <crm@inspireai.es>",
        to: NOTIF_EMAILS,
        subject: `📋 Cuestionario ${safeArea}: ${safeContacto} — Prioridad ${safePrioridad}`,
        html: `
<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#0A0A1A;font-family:Inter,system-ui,sans-serif;color:#ffffff;">
  <div style="max-width:560px;margin:0 auto;padding:40px 24px;">
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:32px;">
      <div style="width:40px;height:40px;border-radius:50%;background:#4F6FE8;display:flex;align-items:center;justify-content:center;font-size:18px;font-weight:700;color:#fff;">I</div>
      <div>
        <div style="font-size:16px;font-weight:700;">InspireAI CRM</div>
        <div style="font-size:12px;color:rgba(255,255,255,0.4);">Cuestionario de diagnóstico recibido</div>
      </div>
    </div>
    <div style="background:#111122;border-radius:16px;border:1px solid rgba(255,255,255,0.08);overflow:hidden;margin-bottom:24px;">
      <div style="background:linear-gradient(135deg,rgba(79,111,232,0.2),rgba(79,111,232,0.05));padding:24px 28px;border-bottom:1px solid rgba(255,255,255,0.08);">
        <div style="font-size:13px;color:rgba(255,255,255,0.5);text-transform:uppercase;letter-spacing:0.08em;margin-bottom:6px;">${safeArea}</div>
        <div style="font-size:22px;font-weight:700;">${safeContacto}</div>
        <div style="font-size:15px;color:rgba(255,255,255,0.6);margin-top:4px;">${safeEmpresa}</div>
      </div>
      <div style="padding:24px 28px;">
        <div style="margin-bottom:16px;">
          <div style="font-size:11.5px;color:rgba(255,255,255,0.4);text-transform:uppercase;letter-spacing:0.06em;margin-bottom:4px;">Email</div>
          <div style="font-size:14px;"><a href="mailto:${safeEmail}" style="color:#9DB1F2;">${safeEmail}</a></div>
        </div>
        <div style="margin-bottom:16px;">
          <div style="font-size:11.5px;color:rgba(255,255,255,0.4);text-transform:uppercase;letter-spacing:0.06em;margin-bottom:4px;">Respuestas</div>
          <div style="font-size:14px;color:rgba(255,255,255,0.85);">${respuestas.length} preguntas respondidas</div>
        </div>
        <div>
          <div style="font-size:11.5px;color:rgba(255,255,255,0.4);text-transform:uppercase;letter-spacing:0.06em;margin-bottom:8px;">Prioridad detectada</div>
          <span style="display:inline-block;padding:6px 16px;border-radius:100px;background:${prioColor}22;color:${prioColor};font-weight:600;font-size:14px;border:1px solid ${prioColor}44;">
            ${safePrioridad}
          </span>
        </div>
      </div>
    </div>
    <a href="https://crm-inspireai.vercel.app/diagnosticos"
       style="display:block;text-align:center;background:#4F6FE8;color:#fff;text-decoration:none;padding:14px 24px;border-radius:12px;font-weight:600;font-size:14px;">
      Ver diagnóstico completo
    </a>
    <div style="text-align:center;margin-top:20px;font-size:12px;color:rgba(255,255,255,0.3);">
      InspireAI · Inteligencia que impulsa tu crecimiento
    </div>
  </div>
</body>
</html>`,
      });
    }

    return NextResponse.json({ success: true, area, contactId, dealId, prioridad });
  } catch (err) {
    console.error("[/api/onboarding/submit] Error:", err);
    return NextResponse.json({ success: false, error: "Error interno del servidor" }, { status: 500 });
  }
}
