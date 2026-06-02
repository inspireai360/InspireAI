// Envío de emails via Brevo HTTP API (funciona en Vercel serverless)

const NOTIF_EMAILS = ["monteslluc@gmail.com","Merikarpre@gmail.com"];
const SENDER = { name: "InspireAI CRM", email: "hola@inspireai.es" };
const PRIORIDAD_COLOR: Record<string, string> = { Alta: "#E86F6F", Media: "#E8A24F", Baja: "#3FB984" };

async function sendBrevo(subject: string, html: string): Promise<void> {
  const key = process.env.BREVO_API_KEY;
  if (!key) { console.warn("[mailer] BREVO_API_KEY no configurada"); return; }

  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: { "api-key": key, "Content-Type": "application/json" },
    body: JSON.stringify({
      sender: SENDER,
      to: NOTIF_EMAILS.map(e => ({ email: e })),
      subject,
      htmlContent: html,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Brevo error ${res.status}: ${err}`);
  }
}

const HEADER = `
  <div style="background:#08091A;border-radius:16px 16px 0 0;padding:20px 28px;display:flex;align-items:center;gap:12px">
    <img src="https://inspireai.es/logo.png" width="34" height="34" style="border-radius:50%" alt=""/>
    <span style="font-size:15px;font-weight:700;color:#fff;letter-spacing:0.05em">INSPIRE<span style="color:#818CF8">AI</span></span>
  </div>`;

export async function sendLeadNotification(data: {
  nombre: string; email: string; empresa: string;
  telefono?: string; tamanio?: string | null; mensaje?: string;
}) {
  const rows = [
    `<tr><td style="padding:7px 0;color:rgba(0,0,0,0.45);font-size:13px;width:120px">Email</td><td style="padding:7px 0;font-size:14px"><a href="mailto:${data.email}" style="color:#5B62F4">${data.email}</a></td></tr>`,
    data.telefono ? `<tr><td style="padding:7px 0;color:rgba(0,0,0,0.45);font-size:13px">Teléfono</td><td style="padding:7px 0;font-size:14px">${data.telefono}</td></tr>` : "",
    data.tamanio ? `<tr><td style="padding:7px 0;color:rgba(0,0,0,0.45);font-size:13px">Tamaño</td><td style="padding:7px 0;font-size:14px">${data.tamanio} empleados</td></tr>` : "",
    data.mensaje ? `<tr><td style="padding:7px 0;color:rgba(0,0,0,0.45);font-size:13px;vertical-align:top">Mensaje</td><td style="padding:7px 0;font-size:14px;line-height:1.5">${data.mensaje}</td></tr>` : "",
  ].filter(Boolean).join("");

  const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#f0f0f5;font-family:Inter,system-ui,sans-serif">
<div style="max-width:540px;margin:0 auto;padding:28px 16px">
  ${HEADER}
  <div style="background:linear-gradient(135deg,rgba(91,98,244,0.25),rgba(91,98,244,0.06));padding:20px 28px;border-left:4px solid #5B62F4">
    <div style="font-size:11px;color:rgba(255,255,255,0.5);text-transform:uppercase;letter-spacing:0.1em;margin-bottom:5px">🔔 Nuevo lead desde la web</div>
    <div style="font-size:21px;font-weight:700;color:#fff">${data.nombre}</div>
    <div style="font-size:14px;color:rgba(255,255,255,0.6);margin-top:3px">${data.empresa}</div>
  </div>
  <div style="background:#fff;border-radius:0 0 16px 16px;padding:20px 28px;margin-bottom:16px;box-shadow:0 4px 12px rgba(0,0,0,0.08)">
    <table style="width:100%;border-collapse:collapse">${rows}</table>
  </div>
  <a href="https://crm.inspireai.es/contacts" style="display:block;text-align:center;background:#5B62F4;color:#fff;text-decoration:none;padding:13px;border-radius:10px;font-weight:600;font-size:14px">Ver en el CRM →</a>
  <p style="text-align:center;margin-top:12px;font-size:11px;color:rgba(0,0,0,0.3)">InspireAI · Inteligencia que impulsa tu crecimiento</p>
</div></body></html>`;

  await sendBrevo(`🔔 Nuevo lead: ${data.nombre} — ${data.empresa}`, html);
}

export async function sendQuestionnaireNotification(data: {
  area: string; areaName: string; contacto: string; email: string;
  empresa?: string; numRespuestas: number; prioridad: string;
}) {
  const color = PRIORIDAD_COLOR[data.prioridad] ?? "#5B62F4";

  const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#f0f0f5;font-family:Inter,system-ui,sans-serif">
<div style="max-width:540px;margin:0 auto;padding:28px 16px">
  ${HEADER}
  <div style="background:linear-gradient(135deg,rgba(91,98,244,0.25),rgba(91,98,244,0.06));padding:20px 28px;border-left:4px solid #5B62F4">
    <div style="font-size:11px;color:rgba(255,255,255,0.5);text-transform:uppercase;letter-spacing:0.1em;margin-bottom:5px">📋 Cuestionario completado · ${data.areaName}</div>
    <div style="font-size:21px;font-weight:700;color:#fff">${data.contacto}</div>
    <div style="font-size:14px;color:rgba(255,255,255,0.6);margin-top:3px">${data.empresa ?? ""}</div>
  </div>
  <div style="background:#fff;border-radius:0 0 16px 16px;padding:20px 28px;margin-bottom:16px;box-shadow:0 4px 12px rgba(0,0,0,0.08)">
    <table style="width:100%;border-collapse:collapse">
      <tr><td style="padding:7px 0;color:rgba(0,0,0,0.45);font-size:13px;width:120px">Email</td><td style="padding:7px 0;font-size:14px"><a href="mailto:${data.email}" style="color:#5B62F4">${data.email}</a></td></tr>
      <tr><td style="padding:7px 0;color:rgba(0,0,0,0.45);font-size:13px">Respuestas</td><td style="padding:7px 0;font-size:14px">${data.numRespuestas} preguntas respondidas</td></tr>
      <tr><td style="padding:7px 0;color:rgba(0,0,0,0.45);font-size:13px">Prioridad</td><td style="padding:7px 0"><span style="background:${color}22;color:${color};padding:3px 12px;border-radius:100px;font-size:13px;font-weight:600;border:1px solid ${color}44">${data.prioridad}</span></td></tr>
    </table>
  </div>
  <a href="https://crm.inspireai.es/diagnosticos" style="display:block;text-align:center;background:#5B62F4;color:#fff;text-decoration:none;padding:13px;border-radius:10px;font-weight:600;font-size:14px">Ver diagnóstico →</a>
  <p style="text-align:center;margin-top:12px;font-size:11px;color:rgba(0,0,0,0.3)">InspireAI · Inteligencia que impulsa tu crecimiento</p>
</div></body></html>`;

  await sendBrevo(`📋 ${data.areaName}: ${data.contacto} — Prioridad ${data.prioridad}`, html);
}
