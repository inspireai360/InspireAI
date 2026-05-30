import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, ADMIN_USER_ID } from "@/lib/supabase-server";
import { sendLeadNotification } from "@/lib/mailer";

const VALID_TAMANIO = ["1-10", "11-50", "51-200", "200+"];

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try { body = await req.json(); }
  catch { return NextResponse.json({ success: false, error: "Cuerpo de la petición inválido" }, { status: 400 }); }

// Honeypot: los bots rellenan este campo oculto, los humanos no lo ven
  const { nombre, email, telefono, empresa, tamanio, mensaje, website: honeypot } = body as {
    nombre?: string; email?: string; telefono?: string;
    empresa?: string; tamanio?: string; mensaje?: string; website?: string;
  };

  // Si el campo honeypot tiene valor, es un bot — rechazar silenciosamente
  if (honeypot?.trim()) {
    return NextResponse.json({ success: true }); // Respuesta falsa para confundir al bot
  }

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

    // Notificación por email (fire & forget)
    sendLeadNotification({
      nombre: nombre!.trim(), email: email!.trim().toLowerCase(),
      empresa: empresa!.trim(), telefono: telefono?.trim(),
      tamanio: tamanioValido, mensaje: mensaje?.trim(),
    }).catch(err => console.error("[mailer] lead:", err));

    return NextResponse.json({ success: true, contactId: contact.id, dealId: deal.id });
  } catch (err) {
    console.error("[/api/contact] Error:", err);
    return NextResponse.json({ success: false, error: "Error al guardar la solicitud." }, { status: 500 });
  }
}
