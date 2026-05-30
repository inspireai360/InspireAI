import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, ADMIN_USER_ID } from "@/lib/supabase-server";

const VALID_TAMANIO = ["1-10", "11-50", "51-200", "200+"];

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, error: "Cuerpo de la petición inválido" }, { status: 400 });
  }

  const { nombre, email, telefono, empresa, tamanio, mensaje } = body as {
    nombre?: string; email?: string; telefono?: string;
    empresa?: string; tamanio?: string; mensaje?: string;
  };

  const missingFields: string[] = [];
  if (!nombre?.trim()) missingFields.push("nombre");
  if (!email?.trim()) missingFields.push("email");
  if (!empresa?.trim()) missingFields.push("empresa");

  if (missingFields.length > 0) {
    return NextResponse.json({ success: false, error: "Faltan campos obligatorios", missingFields }, { status: 400 });
  }
  if (!/\S+@\S+\.\S+/.test(email!)) {
    return NextResponse.json({ success: false, error: "El email no tiene un formato válido" }, { status: 400 });
  }

  const tamanioValido = tamanio && VALID_TAMANIO.includes(tamanio) ? tamanio : null;

  try {
    // 1. Buscar o crear empresa
    let companyId: string | null = null;
    if (empresa?.trim()) {
      const { data: existing } = await supabaseAdmin
        .from("companies")
        .select("id")
        .eq("name", empresa.trim())
        .eq("user_id", ADMIN_USER_ID)
        .maybeSingle();

      if (existing) {
        companyId = existing.id;
      } else {
        const { data: newCompany } = await supabaseAdmin
          .from("companies")
          .insert({ name: empresa.trim(), user_id: ADMIN_USER_ID })
          .select("id")
          .single();
        companyId = newCompany?.id ?? null;
      }
    }

    // 2. Crear contacto
    const { data: contact, error: contactError } = await supabaseAdmin
      .from("contacts")
      .insert({
        name: nombre!.trim(),
        email: email!.trim().toLowerCase(),
        phone: telefono?.trim() ?? null,
        company_id: companyId,
        type: "lead",
        owner: "AR",
        lead_source: "web",
        tamanio_empresa: tamanioValido,
        mensaje: mensaje?.trim() ?? null,
        user_id: ADMIN_USER_ID,
      })
      .select("id")
      .single();

    if (contactError) throw contactError;

    // 3. Crear oportunidad en pipeline (etapa: lead_nuevo)
    const { data: deal, error: dealError } = await supabaseAdmin
      .from("deals")
      .insert({
        title: `Lead web — ${empresa!.trim()}`,
        contact_id: contact.id,
        stage: "lead_nuevo",
        value: 0,
        owner: "AR",
        lead_source: "web",
        user_id: ADMIN_USER_ID,
      })
      .select("id")
      .single();

    if (dealError) throw dealError;

    // 4. Registrar actividad
    await supabaseAdmin.from("activities").insert({
      type: "note",
      text: `Lead entrante desde la web. Empresa: ${empresa!.trim()}${tamanioValido ? ` (${tamanioValido} empleados)` : ""}${mensaje?.trim() ? `\n\nMensaje: ${mensaje.trim()}` : ""}`,
      contact_id: contact.id,
      deal_id: deal.id,
      owner: "AR",
      user_id: ADMIN_USER_ID,
    });

    console.log("[/api/contact] ✅ Lead creado en Supabase:", contact.id);
    return NextResponse.json({ success: true, contactId: contact.id, dealId: deal.id });

  } catch (err: unknown) {
    console.error("[/api/contact] Error Supabase:", err);
    return NextResponse.json({ success: false, error: "Error al guardar la solicitud. Inténtalo de nuevo." }, { status: 500 });
  }
}
