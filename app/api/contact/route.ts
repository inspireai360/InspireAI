import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, ADMIN_USER_ID } from "@/lib/supabase-server";
import { Resend } from "resend";

const VALID_TAMANIO = ["1-10", "11-50", "51-200", "200+"];
const NOTIF_EMAILS = ["monteslluc@gmail.com", "Merikarpre@gmail.com"];

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
      const { data: existing } = await supabaseAdmin.from("companies").select("id")
        .eq("name", empresa.trim()).eq("user_id", ADMIN_USER_ID).maybeSingle();
      if (existing) { companyId = existing.id; }
      else {
        const { data: nc } = await supabaseAdmin.from("companies")
          .insert({ name: empresa.trim(), user_id: ADMIN_USER_ID }).select("id").single();
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
      text: `Lead desde la web. Empresa: ${empresa!.trim()}${tamanioValido ? ` (${tamanioValido} empleados)` : ""}${mensaje?.trim() ? "\n\nMensaje: " + mensaje.trim() : ""}`,
      contact_id: contact.id, deal_id: deal.id, owner: "LL", user_id: ADMIN_USER_ID,
    });

    // Email a los socios
    if (process.env.RESEND_API_KEY) {
      const resend = new Resend(process.env.RESEND_API_KEY);
      const rows = [
        `<tr><td style="padding:8px 0;color:rgba(255,255,255,0.45);font-size:13px;width:130px">Email</td><td style="padding:8px 0;font-size:14px"><a href="mailto:${email!.trim()}" style="color:#9DB1F2">${email!.trim()}</a></td></tr>`,
        telefono?.trim() ? `<tr><td style="padding:8px 0;color:rgba(255,255,255,0.45);font-size:13px">Teléfono</td><td style="padding:8px 0;font-size:14px"><a href="tel:${telefono.trim()}" style="color:#9DB1F2">${telefono.trim()}</a></td></tr>` : "",
        tamanioValido ? `<tr><td style="padding:8px 0;color:rgba(255,255,255,0.45);font-size:13px">Tamaño empresa</td><td style="padding:8px 0;font-size:14px">${tamanioValido} empleados</td></tr>` : "",
        mensaje?.trim() ? `<tr><td style="padding:8px 0;color:rgba(255,255,255,0.45);font-size:13px;vertical-align:top">Mensaje</td><td style="padding:8px 0;font-size:14px;line-height:1.5">${mensaje.trim()}</td></tr>` : "",
      ].filter(r => r !== "").join("");

      const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#08091A;font-family:Inter,system-ui,sans-serif;color:#fff">
<div style="max-width:560px;margin:0 auto;padding:40px 24px">
  <div style="display:flex;align-items:center;gap:12px;margin-bottom:32px">
    <img src="https://inspireai.es/logo.png" width="36" height="36" style="border-radius:50%;object-fit:cover" alt="InspireAI"/>
    <span style="font-size:16px;font-weight:700;letter-spacing:0.05em">INSPIRE<span style="color:#818CF8">AI</span></span>
  </div>
  <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:20px;overflow:hidden;margin-bottom:24px">
    <div style="background:linear-gradient(135deg,rgba(91,98,244,0.2),rgba(91,98,244,0.05));padding:24px 28px;border-bottom:1px solid rgba(255,255,255,0.07)">
      <div style="font-size:12px;color:rgba(255,255,255,0.4);text-transform:uppercase;letter-spacing:0.08em;margin-bottom:6px">🔔 Nuevo lead desde la web</div>
      <div style="font-size:22px;font-weight:700">${nombre!.trim()}</div>
      <div style="font-size:15px;color:rgba(255,255,255,0.55);margin-top:4px">${empresa!.trim()}</div>
    </div>
    <div style="padding:24px 28px">
      <table style="width:100%;border-collapse:collapse">${rows}</table>
    </div>
  </div>
  <a href="https://crm-inspireai.vercel.app/contacts" style="display:block;text-align:center;background:#5B62F4;color:#fff;text-decoration:none;padding:14px;border-radius:12px;font-weight:600;font-size:14px">Ver en el CRM →</a>
  <p style="text-align:center;margin-top:20px;font-size:12px;color:rgba(255,255,255,0.25)">InspireAI · Inteligencia que impulsa tu crecimiento</p>
</div></body></html>`;

      await resend.emails.send({
        from: "InspireAI CRM <crm@inspireai.es>",
        to: NOTIF_EMAILS,
        subject: `🔔 Nuevo lead: ${nombre!.trim()} — ${empresa!.trim()}`,
        html,
      });
    }

    return NextResponse.json({ success: true, contactId: contact.id, dealId: deal.id });
  } catch (err) {
    console.error("[/api/contact] Error:", err);
    return NextResponse.json({ success: false, error: "Error al guardar la solicitud." }, { status: 500 });
  }
}
