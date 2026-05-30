import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, ADMIN_USER_ID } from "@/lib/supabase-server";
import { Resend } from "resend";

const VALID_TAMANIO = ["1-10", "11-50", "51-200", "200+"];
const NOTIF_EMAILS = ["monteslluc@gmail.com", "Merikarpre@gmail.com"];

function buildLeadEmail(data: {
  nombre: string; email: string; empresa: string;
  telefono?: string; tamanio?: string | null; mensaje?: string;
}): string {
  return `
<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#0A0A1A;font-family:Inter,system-ui,sans-serif;color:#ffffff;">
  <div style="max-width:560px;margin:0 auto;padding:40px 24px;">
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:32px;">
      <div style="width:40px;height:40px;border-radius:50%;background:#4F6FE8;display:flex;align-items:center;justify-content:center;font-size:18px;font-weight:700;color:#fff;">I</div>
      <div>
        <div style="font-size:16px;font-weight:700;">InspireAI CRM</div>
        <div style="font-size:12px;color:rgba(255,255,255,0.4);">Notificación de nuevo lead</div>
      </div>
    </div>

    <div style="background:#111122;border-radius:16px;border:1px solid rgba(255,255,255,0.08);overflow:hidden;margin-bottom:24px;">
      <div style="background:linear-gradient(135deg,rgba(79,111,232,0.2),rgba(79,111,232,0.05));padding:24px 28px;border-bottom:1px solid rgba(255,255,255,0.08);">
        <div style="font-size:13px;color:rgba(255,255,255,0.5);text-transform:uppercase;letter-spacing:0.08em;margin-bottom:6px;">Nuevo lead desde la web</div>
        <div style="font-size:22px;font-weight:700;letter-spacing:-0.02em;">${data.nombre}</div>
        <div style="font-size:15px;color:rgba(255,255,255,0.6);margin-top:4px;">${data.empresa}</div>
      </div>
      <div style="padding:24px 28px;">
        ${[
          ['Email', `<a href="mailto:${data.email}" style="color:#9DB1F2;">${data.email}</a>`],
          data.telefono ? ['Teléfono', `<a href="tel:${data.telefono}" style="color:#9DB1F2;">${data.telefono}</a>`] : null,
          data.tamanio ? ['Tamaño empresa', data.tamanio + ' empleados'] : null,
          data.mensaje ? ['Mensaje', data.mensaje] : null,
        ].filter(Boolean).map(([label, value]) => `
          <div style="margin-bottom:16px;">
            <div style="font-size:11.5px;color:rgba(255,255,255,0.4);text-transform:uppercase;letter-spacing:0.06em;margin-bottom:4px;">${label}</div>
            <div style="font-size:14px;color:rgba(255,255,255,0.85);">${value}</div>
          </div>
        `).join('')}
      </div>
    </div>

    <a href="https://crm-inspireai.vercel.app/contacts"
       style="display:block;text-align:center;background:#4F6FE8;color:#fff;text-decoration:none;padding:14px 24px;border-radius:12px;font-weight:600;font-size:14px;">
      Ver en el CRM
    </a>
    <div style="text-align:center;margin-top:20px;font-size:12px;color:rgba(255,255,255,0.3);">
      InspireAI · Inteligencia que impulsa tu crecimiento
    </div>
  </div>
</body>
</html>`;
}

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try { body = await req.json(); }
  catch { return NextResponse.json({ success: false, error: "Cuerpo de la petición inválido" }, { status: 400 }); }

  const { nombre, email, telefono, empresa, tamanio, mensaje } = body as {
    nombre?: string; email?: string; telefono?: string;
    empresa?: string; tamanio?: string; mensaje?: string;
  };

  const missingFields: string[] = [];
  if (!nombre?.trim()) missingFields.push("nombre");
  if (!email?.trim()) missingFields.push("email");
  if (!empresa?.trim()) missingFields.push("empresa");
  if (missingFields.length > 0)
    return NextResponse.json({ success: false, error: "Faltan campos obligatorios", missingFields }, { status: 400 });
  if (!/\S+@\S+\.\S+/.test(email!))
    return NextResponse.json({ success: false, error: "El email no tiene un formato válido" }, { status: 400 });

  const tamanioValido = tamanio && VALID_TAMANIO.includes(tamanio) ? tamanio : null;

  try {
    let companyId: string | null = null;
    if (empresa?.trim()) {
      const { data: existing } = await supabaseAdmin.from("companies").select("id").eq("name", empresa.trim()).eq("user_id", ADMIN_USER_ID).maybeSingle();
      if (existing) { companyId = existing.id; }
      else {
        const { data: nc } = await supabaseAdmin.from("companies").insert({ name: empresa.trim(), user_id: ADMIN_USER_ID }).select("id").single();
        companyId = nc?.id ?? null;
      }
    }

    const { data: contact, error: contactError } = await supabaseAdmin.from("contacts").insert({
      name: nombre!.trim(), email: email!.trim().toLowerCase(),
      phone: telefono?.trim() ?? null, company_id: companyId,
      type: "lead", owner: "LL", lead_source: "web",
      tamanio_empresa: tamanioValido, mensaje: mensaje?.trim() ?? null,
      user_id: ADMIN_USER_ID,
    }).select("id").single();
    if (contactError) throw contactError;

    const { data: deal, error: dealError } = await supabaseAdmin.from("deals").insert({
      title: `Lead web — ${empresa!.trim()}`, contact_id: contact.id,
      stage: "lead_nuevo", value: 0, owner: "LL", lead_source: "web", user_id: ADMIN_USER_ID,
    }).select("id").single();
    if (dealError) throw dealError;

    await supabaseAdmin.from("activities").insert({
      type: "note",
      text: `Lead entrante desde la web. Empresa: ${empresa!.trim()}${tamanioValido ? ` (${tamanioValido} empleados)` : ""}${mensaje?.trim() ? `\n\nMensaje: ${mensaje.trim()}` : ""}`,
      contact_id: contact.id, deal_id: deal.id, owner: "LL", user_id: ADMIN_USER_ID,
    });

    // Notificación por email a los socios
    if (process.env.RESEND_API_KEY) {
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: "InspireAI CRM <crm@inspireai.es>",
        to: NOTIF_EMAILS,
        subject: `🔔 Nuevo lead: ${nombre!.trim()} — ${empresa!.trim()}`,
        html: buildLeadEmail({
          nombre: nombre!.trim(), email: email!.trim().toLowerCase(),
          empresa: empresa!.trim(), telefono: telefono?.trim(),
          tamanio: tamanioValido, mensaje: mensaje?.trim(),
        }),
      });
    }

    return NextResponse.json({ success: true, contactId: contact.id, dealId: deal.id });
  } catch (err) {
    console.error("[/api/contact] Error:", err);
    return NextResponse.json({ success: false, error: "Error al guardar la solicitud." }, { status: 500 });
  }
}
