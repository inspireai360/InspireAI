#!/usr/bin/env node
/**
 * create-notion-diagnostic-from-airtable.mjs
 * Genera diagnóstico Inspire Cyber 360 en Notion desde datos de Airtable.
 *
 * MODO 1 — Por área:
 *   node scripts/create-notion-diagnostic-from-airtable.mjs --area operaciones --record-id recXXXX
 *   node scripts/create-notion-diagnostic-from-airtable.mjs --area operaciones --latest [--dry-run]
 *
 * MODO 2 — Consolidado por cliente (usa plantilla real de Notion):
 *   node scripts/create-notion-diagnostic-from-airtable.mjs --client "Empresa" [--dry-run] [--update-airtable] [--force]
 *   node scripts/create-notion-diagnostic-from-airtable.mjs --client "Empresa" --areas operaciones,marketing,ventas,delivery
 *
 * Requiere en .env.local:
 *   AIRTABLE_TOKEN, AIRTABLE_BASE_ID, AIRTABLE_TABLE_[AREA]
 *   NOTION_TOKEN, NOTION_DIAGNOSTICS_DATABASE_ID
 *   NOTION_TEMPLATE_PAGE_ID (plantilla base: 34974667e4dd8057b5b5f5fb0acefeb1)
 *
 * SEGURIDAD: Los diagnósticos contienen información sensible de clientes.
 *   - No se logea contenido de respuestas, email, teléfono ni datos personales.
 *   - Las páginas se crean dentro del workspace privado de InspireAI.
 *   - No se activan enlaces públicos.
 */

import { getConfig, getTableName, getRecord, listRecords, updateRecord } from "./lib/airtable-client.mjs";
import {
  getNotionConfig, createDatabasePage, createSubPage, createDatabase,
  appendBlocks, getPage, patchDatabase, createDbEntry, searchByTitle,
  heading1, heading2, heading3, paragraph, bulletItem, numberedItem,
  divider, callout,
} from "./lib/notion-client.mjs";

// ─── Args ──────────────────────────────────────────────────────────────────────

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i++) {
    if (argv[i].startsWith("--")) {
      const key = argv[i].slice(2);
      const next = argv[i + 1];
      if (!next || next.startsWith("--")) { args[key] = true; }
      else { args[key] = next; i++; }
    }
  }
  return args;
}

function usage() {
  console.error("Uso:");
  console.error("  MODO 1: node scripts/create-notion-diagnostic-from-airtable.mjs --area operaciones --latest");
  console.error('  MODO 2: node scripts/create-notion-diagnostic-from-airtable.mjs --client "Empresa" [--dry-run] [--update-airtable] [--force]');
}

const args = parseArgs(process.argv.slice(2));

// ─── Constants ─────────────────────────────────────────────────────────────────

const ALL_AREAS = ["ventas", "marketing", "operaciones", "delivery"];

const AREA_NAMES = {
  ventas:      "Ventas",
  marketing:   "Marketing",
  operaciones: "Operaciones",
  delivery:    "Delivery / Fulfillment",
};

const AREA_EMOJIS = {
  ventas:      "💼",
  marketing:   "📣",
  operaciones: "⚙️",
  delivery:    "📦",
};

// Mapeo interno → nombre en la plantilla real de Notion
const AREA_TO_TEMPLATE_NAME = {
  marketing:   "Marketing",
  ventas:      "Ventas",
  delivery:    "Fulfilment",
  operaciones: "Administración",
};

// Mapeo para el campo Área en Vulnerabilidades (plantilla real)
const VULN_AREA_MAP = {
  marketing:   "Marketing",
  ventas:      "Ventas",
  operaciones: "Administración",
  delivery:    "Delivery",
};

// Mapeo para el campo Área en Oportunidades (plantilla real)
const OPP_AREA_MAP = {
  marketing:   "Marketing",
  ventas:      "Ventas",
  operaciones: "Operaciones",
  delivery:    "Fulfilment",
};

const TEMPLATE_PAGE_ID_DEFAULT = "34974667-e4dd-8057-b5b5-f5fb0acefeb1";
const PROYECTOS_DB_ID_DEFAULT  = "29674667-e4dd-804b-b53d-cc1c10f242a4";

// ─── Database Schemas (campos reales de la plantilla de Notion) ────────────────
// Fuente: inspect-notion-inline-dbs.mjs ejecutado sobre la plantilla real.
// NO modificar nombres de campos sin actualizar la plantilla en Notion.

const OPORTUNIDADES_SCHEMA = {
  "Solución Propuesta":  { title: {} },
  "Área":                { select: { options: [{ name: "Marketing" }, { name: "Ventas" }, { name: "Fulfilment" }, { name: "Operaciones" }] } },
  "Problema detectado":  { rich_text: {} },
  "Descripción":         { rich_text: {} },
  "Impacto":             { select: { options: [{ name: "Bajo" }, { name: "Media" }, { name: "Alto" }] } },
  "Urgencia":            { select: { options: [{ name: "Baja" }, { name: "Media" }, { name: "Alta" }] } },
  "Dificultad Técnica":  { select: { options: [{ name: "Baja" }, { name: "Media" }, { name: "Alta" }] } },
};

const VULNERABILIDADES_SCHEMA = {
  "Nombre":                    { title: {} },
  "Área":                      { select: { options: [{ name: "Marketing" }, { name: "Ventas" }, { name: "Administración" }, { name: "Delivery" }] } },
  "Tipo de vulnerabilidad":    { select: { options: [{ name: "Accesos" }, { name: "Datos" }, { name: "Red" }, { name: "Dispositivos" }, { name: "Automatización" }, { name: "Humano/ proceso" }, { name: "Legal/ cumplimiento" }] } },
  "Probabilidad":              { number: { format: "number" } },
  "Impacto":                   { number: { format: "number" } },
  "Descripción":               { rich_text: {} },
  "Escenario de riesgo":       { rich_text: {} },
  "Solución propuesta":        { rich_text: {} },
  "Mitigación rápida":         { checkbox: {} },
  "Esfuerzo técnico":          { select: { options: [{ name: "Bajo" }, { name: "Medio" }, { name: "Alto" }] } },
  "Coste estimado":            { select: { options: [{ name: "Bajo" }, { name: "Medio" }, { name: "Alto" }] } },
  "Activo afectado":           { select: { options: [{ name: "Gmail" }, { name: "WhatsApp" }, { name: "Stripe" }, { name: "Banco" }, { name: "Notion" }, { name: "Airtable" }, { name: "n8n/ automatizaciones" }, { name: "Google Drive" }, { name: "Otros" }] } },
  "Notas técnicas Claude/Codex": { rich_text: {} },
};

// Roadmap real solo tiene: Nombre, Estado (status), Asignar (people).
// Añadimos los campos necesarios para el diagnóstico.
const ROADMAP_SCHEMA = {
  "Nombre":       { title: {} },
  "Fase":         { select: { options: [{ name: "Fase 0 — Infraestructura" }, { name: "Fase 1 — Quick wins" }, { name: "Fase 2 — Automatización estructural" }, { name: "Fase 3 — Escalabilidad y gobierno" }] } },
  "Área":         { select: { options: [{ name: "Marketing" }, { name: "Ventas" }, { name: "Fulfilment" }, { name: "Administración" }, { name: "General" }] } },
  "Prioridad":    { select: { options: [{ name: "Alta" }, { name: "Media" }, { name: "Baja" }] } },
  "Impacto":      { select: { options: [{ name: "Alto" }, { name: "Medio" }, { name: "Bajo" }] } },
  "Esfuerzo":     { select: { options: [{ name: "Alto" }, { name: "Medio" }, { name: "Bajo" }] } },
  "Desglose":     { rich_text: {} },
  "Dependencias": { rich_text: {} },
};

// ─── Opportunity Patterns ──────────────────────────────────────────────────────
// Cada patrón define un detector (regex sobre allText) y genera una oportunidad específica.
// El campo `vulnKey` enlaza con VULN_TEMPLATES para generar vulnerabilidades vinculadas.

const OPPORTUNITY_PATTERNS = {
  ventas: [
    {
      id: "crm",
      detect: (t) => /no hay crm|sin crm|no tenemos crm|no uso crm|excel.*lead|lead.*excel|sin pipeline|no hay pipeline/.test(t),
      nombre: "CRM: Centralización del pipeline comercial",
      subarea: "Ventas - Seguimiento comercial",
      problema: "Gestión de leads sin CRM — pérdida de oportunidades comerciales y sin trazabilidad del pipeline.",
      descripcion: "Implementar CRM (HubSpot/Pipedrive) con importación de contactos actuales, definición de etapas del funnel y automatización de tareas de seguimiento.",
      impacto: "Alto", urgencia: "Alta", dificultad: "Baja",
      fase: 1, vulnKey: "crm",
    },
    {
      id: "whatsapp_leads",
      detect: (t) => /whatsapp.*lead|lead.*whatsapp|whatsapp.*ventas|ventas.*whatsapp|whatsapp/.test(t),
      nombre: "Leads: Cadencia automática de seguimiento multicanal",
      subarea: "Ventas - Seguimiento comercial",
      problema: "Seguimiento de leads por WhatsApp personal — sin trazabilidad, duplicidad de esfuerzo y pérdida de leads por falta de seguimiento.",
      descripcion: "Secuencia automática: respuesta inmediata a nuevo lead → seguimiento a las 24h → recordatorio a las 72h. Integración con CRM.",
      impacto: "Alto", urgencia: "Alta", dificultad: "Baja",
      fase: 1, vulnKey: "whatsapp",
    },
    {
      id: "metricas_ventas",
      detect: (t) => /no medimos|no mido|sin datos.*venta|tasa de convers|conversion|sin metricas/.test(t),
      nombre: "Pipeline: Dashboard de métricas comerciales en tiempo real",
      subarea: "Ventas - Seguimiento comercial",
      problema: "Conversión sin medir — imposible optimizar el proceso comercial ni identificar cuellos de botella.",
      descripcion: "Dashboard: leads por canal, tasa de conversión por etapa, tiempo medio de cierre, MRR. Alertas automáticas ante caídas.",
      impacto: "Media", urgencia: "Media", dificultad: "Media",
      fase: 2, vulnKey: "datos_internos",
    },
    {
      id: "seguimiento_automatico",
      detect: (t) => /seguimiento.*manual|manual.*seguimiento|follow.?up.*manual|perdemos.*lead|se pierden.*lead/.test(t),
      nombre: "Follow-up: Automatización de seguimiento post-contacto",
      subarea: "Ventas - Seguimiento comercial",
      problema: "Seguimiento manual de leads sin respuesta — pérdida de oportunidades por falta de persistencia estructurada.",
      descripcion: "Workflow automático de nurturing: email D+1, email D+3, tarea manual D+7. Segmentado por fuente de lead y etapa del funnel.",
      impacto: "Alto", urgencia: "Alta", dificultad: "Baja",
      fase: 1, vulnKey: "automatizacion",
    },
  ],
  marketing: [
    {
      id: "analytics",
      detect: (t) => /no medimos|sin tracking|sin analytics|no tenemos analytics|no tenemos google|sin datos.*marketing/.test(t),
      nombre: "Analytics: Tracking completo de campañas y atribución de conversión",
      subarea: "Marketing - Captación",
      problema: "Sin tracking ni métricas — inversión publicitaria sin retorno medible y sin capacidad de optimización.",
      descripcion: "Instalar GA4 + Meta Pixel, configurar eventos de conversión clave, crear informe mensual automatizado con CAC y CPL por canal.",
      impacto: "Alto", urgencia: "Alta", dificultad: "Baja",
      fase: 1, vulnKey: "analytics",
    },
    {
      id: "email_captacion",
      detect: (t) => /sin base|no hacemos email|no tenemos base|sin email.*marketing|no email/.test(t),
      nombre: "Email: Lista propia + secuencia de nurturing automatizada",
      subarea: "Marketing - Captación",
      problema: "Sin base de emails propia — dependencia total de plataformas externas, sin canal directo con clientes y leads.",
      descripcion: "Formulario de captura con lead magnet, doble opt-in, migración de contactos existentes, secuencia de bienvenida de 5 emails.",
      impacto: "Alto", urgencia: "Media", dificultad: "Baja",
      fase: 1, vulnKey: "email_gdpr",
    },
    {
      id: "contenido",
      detect: (t) => /inconsistente|irregular|cuando tengo tiempo|sin calendario|no publicamos|publicamos poco/.test(t),
      nombre: "Contenido: Calendario editorial y publicación automatizada",
      subarea: "Marketing - Captación",
      problema: "Contenido irregular y reactivo — sin estrategia editorial ni consistencia de marca.",
      descripcion: "Calendario mensual en Notion, planificación semanal, automatización de publicación con Buffer/Hootsuite, reutilización de contenido por canal.",
      impacto: "Media", urgencia: "Media", dificultad: "Baja",
      fase: 2, vulnKey: "accesos_rrss",
    },
    {
      id: "cac_cpl",
      detect: (t) => /cac|coste por lead|coste por cliente|no sabemos cuanto.*cuesta|cuanto cuesta.*cliente/.test(t),
      nombre: "Reporting: Dashboard CAC, CPL y ROI por canal de captación",
      subarea: "Marketing - Captación",
      problema: "CAC y CPL desconocidos — inversión sin visibilidad de rentabilidad por canal.",
      descripcion: "Conectar fuentes de publicidad (Meta, Google Ads), CRM y caja. Dashboard ejecutivo mensual automático con CAC, CPL y ROI.",
      impacto: "Alto", urgencia: "Media", dificultad: "Media",
      fase: 2, vulnKey: "datos_internos",
    },
  ],
  operaciones: [
    {
      id: "documentacion_ops",
      detect: (t) => /no documentado|no está escrito|sin documentar|en mi cabeza|no hay procesos|procesos.*cabeza/.test(t),
      nombre: "SOPs: Documentación y estandarización de procesos críticos",
      subarea: "Administración - Operaciones",
      problema: "Procesos no documentados — conocimiento atrapado en personas clave, riesgo de pérdida crítica ante bajas o cambios de equipo.",
      descripcion: "Documentar los 3 procesos más críticos en SOP ejecutable. Base de conocimiento en Notion con checklists y responsables por tarea.",
      impacto: "Alto", urgencia: "Alta", dificultad: "Baja",
      fase: 0, vulnKey: "documentacion",
    },
    {
      id: "herramientas_desconectadas",
      detect: (t) => /excel.*oper|papel|herramientas.*desconect|datos.*dispers|duplicid/.test(t),
      nombre: "Integración: Centralización y sincronización de herramientas operativas",
      subarea: "Administración - Operaciones",
      problema: "Herramientas desconectadas — datos dispersos, duplicidad de trabajo manual y errores por falta de fuente única de verdad.",
      descripcion: "Auditar el stack actual, definir herramienta central, migrar datos, configurar integraciones con n8n/Make para sincronización automática.",
      impacto: "Alto", urgencia: "Alta", dificultad: "Media",
      fase: 2, vulnKey: "integracion_ops",
    },
    {
      id: "automatizacion_recurrente",
      detect: (t) => /manual|manualmente|a mano|repetitiv|siempre lo mismo|cada semana.*mismo/.test(t),
      nombre: "Automatización: Tareas repetitivas, notificaciones y recordatorios",
      subarea: "Administración - Operaciones",
      problema: "Tareas manuales repetitivas — horas perdidas semanalmente y riesgo de errores humanos en procesos críticos.",
      descripcion: "Identificar las 5 tareas más repetitivas, automatizar con n8n/Make, configurar notificaciones y alertas automáticas por canal.",
      impacto: "Alto", urgencia: "Alta", dificultad: "Media",
      fase: 1, vulnKey: "automatizacion",
    },
    {
      id: "kpis_ops",
      detect: (t) => /no hay kpi|no medimos.*oper|sin indicadores|sin kpis|sin visibilidad.*oper/.test(t),
      nombre: "Dashboard: KPIs operativos y reporting ejecutivo automático",
      subarea: "Administración - Operaciones",
      problema: "Sin KPIs operativos — decisiones basadas en intuición, sin visibilidad del rendimiento del negocio en tiempo real.",
      descripcion: "Definir 5 KPIs clave por área, conectar fuentes de datos, crear dashboard ejecutivo con actualización automática semanal.",
      impacto: "Media", urgencia: "Media", dificultad: "Media",
      fase: 2, vulnKey: "datos_internos",
    },
    {
      id: "dependencia_persona",
      detect: (t) => /depende de mí|solo yo|si no estoy|sin mí|una persona.*todo|todo.*una persona/.test(t),
      nombre: "Resiliencia: Eliminación de dependencias críticas de persona",
      subarea: "Administración - Operaciones",
      problema: "Dependencia crítica de una o pocas personas — riesgo operativo severo ante baja o cambio de equipo.",
      descripcion: "Mapear todas las dependencias, documentar procesos, redistribuir responsabilidades, crear backups de accesos y conocimiento.",
      impacto: "Alto", urgencia: "Alta", dificultad: "Baja",
      fase: 0, vulnKey: "documentacion",
    },
  ],
  delivery: [
    {
      id: "onboarding_cliente",
      detect: (t) => /sin bienvenida|no hay bienvenida|manual.*bienvenida|sin secuencia|nada automatizado|todo.*manual.*delivery/.test(t),
      nombre: "Onboarding: Secuencia automática de bienvenida al cliente",
      subarea: "Fulfilment - Entrega",
      problema: "Sin secuencia de bienvenida estructurada — experiencia de cliente inconsistente e inicio de relación reactivo.",
      descripcion: "Email/WhatsApp de bienvenida automático con instrucciones de uso, FAQ de preguntas frecuentes, acceso al soporte y próximos pasos.",
      impacto: "Alto", urgencia: "Alta", dificultad: "Baja",
      fase: 1, vulnKey: "datos_cliente",
    },
    {
      id: "faq_automatico",
      detect: (t) => /preguntas frecuentes|siempre preguntan|mismas preguntas|se repiten.*preguntas|dudas repetit/.test(t),
      nombre: "FAQ: Chatbot o base de conocimiento para resolución automática de dudas",
      subarea: "Fulfilment - Atención al cliente",
      problema: "Preguntas frecuentes repetidas — tiempo del equipo consumido en responder siempre las mismas consultas.",
      descripcion: "Base de conocimiento pública con FAQ categorizado. Chatbot con respuestas automáticas a las 10 preguntas más frecuentes.",
      impacto: "Alto", urgencia: "Alta", dificultad: "Baja",
      fase: 1, vulnKey: "automatizacion",
    },
    {
      id: "satisfaccion",
      detect: (t) => /no hay encuesta|sin encuesta|no medimos satisf|solo.*reseñas|reseñas.*google|nps/.test(t),
      nombre: "NPS: Encuesta de satisfacción automática post-entrega",
      subarea: "Fulfilment - Experiencia de cliente",
      problema: "Satisfacción medida solo mediante reseñas públicas — sin detección temprana de problemas ni feedback accionable.",
      descripcion: "Encuesta automática post-entrega (email/WhatsApp), alerta inmediata para NPS bajo, dashboard de satisfacción y tendencia mensual.",
      impacto: "Media", urgencia: "Media", dificultad: "Baja",
      fase: 2, vulnKey: "datos_cliente",
    },
    {
      id: "documentacion_delivery",
      detect: (t) => /no está estandarizado|no hay estándar|cada uno.*manera|en mi cabeza.*entrega|sin documentar.*delivery/.test(t),
      nombre: "Delivery: Estandarización del proceso de entrega y manual operativo",
      subarea: "Fulfilment - Entrega",
      problema: "Proceso de entrega no documentado — calidad variable según quién ejecuta y dependencia de personas concretas.",
      descripcion: "Documentar proceso end-to-end, checklist por tipo de entrega, manual de onboarding para nuevo personal, vídeos de referencia.",
      impacto: "Alto", urgencia: "Alta", dificultad: "Baja",
      fase: 0, vulnKey: "documentacion",
    },
    {
      id: "incidencias",
      detect: (t) => /incidencia|queja|problema frecuente|falla.*entrega|entrega.*falla/.test(t),
      nombre: "Incidencias: Protocolo y gestión automatizada de resolución",
      subarea: "Fulfilment - Atención al cliente",
      problema: "Sin protocolo estructurado de incidencias — respuesta reactiva, tiempos de resolución variables y sin trazabilidad.",
      descripcion: "Formulario de incidencias, flujo de escalado automático por severidad, notificaciones por canal, seguimiento hasta resolución y cierre.",
      impacto: "Alto", urgencia: "Alta", dificultad: "Baja",
      fase: 1, vulnKey: "automatizacion",
    },
  ],
};

// ─── Vulnerability Templates (linked to opportunity patterns) ─────────────────
// Cada vulnerabilidad nace de una oportunidad/integración concreta.
// Campos reales de la plantilla Notion: Nombre, Área, Tipo, Prob, Impacto,
// Descripción, Escenario de riesgo, Solución propuesta, Mitigación rápida,
// Esfuerzo técnico, Coste estimado, Activo afectado, Notas técnicas Claude/Codex.

const VULN_TEMPLATES = {
  crm: {
    tipo: "Datos",
    activo: "Otros",
    prob: 6, impacto: 8,
    descripcion: "El CRM centraliza todo el pipeline comercial y datos de clientes. Sin política de permisos, cualquier usuario tiene acceso completo.",
    escenario: "Exportación masiva de la base de leads por parte de un empleado, acceso de ex-empleados sin revocar, fuga del pipeline a competencia.",
    solucion: "Definir roles y permisos por usuario en el CRM. Activar 2FA. Auditar accesos mensualmente. Protocolo de offboarding con revocación inmediata.",
    quick: true, esfuerzo: "Bajo", coste: "Bajo",
  },
  whatsapp: {
    tipo: "Datos",
    activo: "WhatsApp",
    prob: 8, impacto: 7,
    descripcion: "Conversaciones comerciales con clientes en WhatsApp personal/no corporativo. Sin cifrado de empresa, sin backup auditado, sin separación de datos.",
    escenario: "Pérdida del historial de clientes al cambiar de teléfono, acceso a conversaciones privadas, mezcla de datos personales y corporativos.",
    solucion: "Migrar a WhatsApp Business API. Separar número personal/corporativo. Definir política de uso. Backup periódico de conversaciones críticas.",
    quick: true, esfuerzo: "Bajo", coste: "Bajo",
  },
  analytics: {
    tipo: "Legal/ cumplimiento",
    activo: "Otros",
    prob: 7, impacto: 6,
    descripcion: "Instalación de GA4 y Meta Pixel implica tracking de comportamiento de usuarios web sin consentimiento explícito formalizado.",
    escenario: "Multa AEPD/GDPR por tracking sin consentimiento. Demanda de usuario por datos no declarados. Bloqueo de cuenta publicitaria.",
    solucion: "Implementar CMP (banner de cookies RGPD). Actualizar política de privacidad. Configurar modo Consent v2 en GA4. Revisar configuración Meta.",
    quick: false, esfuerzo: "Bajo", coste: "Bajo",
  },
  email_gdpr: {
    tipo: "Legal/ cumplimiento",
    activo: "Gmail",
    prob: 7, impacto: 6,
    descripcion: "Lista de emails de clientes y leads sin doble opt-in formalizado ni opción de baja accesible. Riesgo de incumplimiento LOPD/GDPR.",
    escenario: "Envíos masivos sin consentimiento, base de emails sin opción de baja, sanción AEPD por gestión incorrecta de datos personales.",
    solucion: "Implementar doble opt-in en formularios. Link de baja en todos los envíos. Política de retención de datos. Auditar base actual de contactos.",
    quick: false, esfuerzo: "Bajo", coste: "Bajo",
  },
  automatizacion: {
    tipo: "Automatización",
    activo: "n8n/ automatizaciones",
    prob: 6, impacto: 7,
    descripcion: "Automatizaciones que escriben en sistemas operativos (CRM, email, notificaciones) sin supervisión humana ni plan de rollback.",
    escenario: "Automatización falla y envía emails incorrectos a todos los clientes. Borrado accidental de datos. Error en flujo que bloquea operaciones.",
    solucion: "Human-in-the-loop para acciones críticas. Logs de ejecución con alertas de error. Plan de rollback documentado. Entorno de prueba antes de producción.",
    quick: false, esfuerzo: "Medio", coste: "Bajo",
  },
  documentacion: {
    tipo: "Accesos",
    activo: "Notion",
    prob: 5, impacto: 6,
    descripcion: "Documentación interna de procesos (SOPs, manuales) en Notion sin política de permisos definida ni control de versiones formal.",
    escenario: "Acceso no autorizado a procesos internos. Edición accidental de SOPs críticos. Pérdida de documentación por borrado sin backup.",
    solucion: "Estructura de permisos por página/sección en Notion. Historial de cambios activo. Backup periódico a Google Drive. Revisión trimestral de accesos.",
    quick: true, esfuerzo: "Bajo", coste: "Bajo",
  },
  datos_internos: {
    tipo: "Datos",
    activo: "Airtable",
    prob: 5, impacto: 6,
    descripcion: "Dashboard conectado a múltiples fuentes de datos internas. Riesgo de datos incorrectos o desactualizados que llevan a decisiones erróneas.",
    escenario: "Decisión estratégica basada en dato incorrecto por fallo en sincronización de fuentes. Exposición de datos sensibles en vistas compartidas.",
    solucion: "Validar fuentes antes de conectar. Alertas de fallo de sincronización. Revisión manual mensual de fiabilidad. Control de acceso por vista.",
    quick: false, esfuerzo: "Medio", coste: "Bajo",
  },
  integracion_ops: {
    tipo: "Datos",
    activo: "n8n/ automatizaciones",
    prob: 6, impacto: 7,
    descripcion: "Integración de múltiples herramientas operativas vía API. Tokens y credenciales almacenados en flujos de automatización sin gestión segura.",
    escenario: "Token API comprometido da acceso a herramientas críticas. Sincronización bidireccional borra o sobrescribe datos incorrectamente.",
    solucion: "Secret manager para almacenar tokens. Principio de mínimos privilegios en APIs. Logs de todas las sincronizaciones. Alertas de errores en tiempo real.",
    quick: false, esfuerzo: "Medio", coste: "Bajo",
  },
  accesos_rrss: {
    tipo: "Accesos",
    activo: "Otros",
    prob: 5, impacto: 5,
    descripcion: "Accesos a cuentas de redes sociales compartidos entre miembros del equipo o con la agencia sin política formal de gestión.",
    escenario: "Pérdida de acceso a cuenta de redes por salida de empleado. Publicación no autorizada. Hackeo por contraseña débil compartida.",
    solucion: "Usar Business Manager con roles individuales. Activar 2FA en todas las cuentas. Revocar accesos al cambiar de agencia/empleado. Password manager compartido.",
    quick: true, esfuerzo: "Bajo", coste: "Bajo",
  },
  datos_cliente: {
    tipo: "Datos",
    activo: "Gmail",
    prob: 6, impacto: 6,
    descripcion: "Datos personales de clientes en sistemas de comunicación (email, WhatsApp) sin política de retención ni acceso controlado.",
    escenario: "Acceso no autorizado a datos de clientes por parte de terceros. Incumplimiento GDPR por retención excesiva de datos personales.",
    solucion: "Política de retención de datos de clientes. Acceso restringido a comunicaciones. Cifrado en reposo para datos sensibles. Revisión periódica LOPD.",
    quick: false, esfuerzo: "Bajo", coste: "Bajo",
  },
};

// ─── Heuristics (questions per area) ─────────────────────────────────────────

const HEURISTICS = {
  ventas: {
    problems: [
      { kw: ["no hay crm", "no tenemos crm", "sin crm", "no uso crm"], label: "Sin CRM — gestión sin trazabilidad" },
      { kw: ["whatsapp", "whatssapp"], label: "Leads gestionados por WhatsApp — alta fricción" },
      { kw: ["manual", "manualmente", "a mano"], label: "Seguimiento completamente manual" },
      { kw: ["no medimos", "no mido", "sin datos", "no tenemos datos"], label: "Conversión no medida — imposible optimizar" },
      { kw: ["perdemos", "se pierden", "oportunidades perdidas"], label: "Pérdida de oportunidades detectada" },
      { kw: ["no hay pipeline", "sin pipeline", "excel"], label: "Sin pipeline comercial estructurado" },
    ],
    maturity: {
      low:  ["no hay crm", "whatsapp", "excel", "no medimos", "sin pipeline", "manual"],
      high: ["crm", "pipeline", "automatizado", "métricas", "tasa de conversión", "dashboard"],
    },
    questions: [
      "¿Cuántos leads nuevos recibís al mes por cada canal?",
      "¿Cuánto tiempo tarda un lead de media en convertirse en cliente?",
      "¿Tenéis definido un proceso de seguimiento para leads que no responden?",
      "¿Qué información capturáis de cada lead y dónde la guardáis?",
      "¿Quién gestiona el seguimiento en temporada alta?",
    ],
  },
  marketing: {
    problems: [
      { kw: ["no medimos", "sin tracking", "sin analytics"], label: "Sin tracking ni métricas de marketing" },
      { kw: ["cac", "coste por lead", "coste por cliente"], label: "CAC/CPL desconocido — inversión sin retorno medible" },
      { kw: ["no hacemos campañas", "sin campañas", "no invertimos"], label: "Sin inversión en captación propia" },
      { kw: ["inconsistente", "irregular", "cuando tengo tiempo"], label: "Contenido inconsistente — sin estrategia" },
      { kw: ["baja calidad", "leads malos", "leads fríos"], label: "Calidad de leads insuficiente" },
      { kw: ["no tenemos base", "sin base de datos", "no hacemos email"], label: "Sin base de datos de clientes propia" },
    ],
    maturity: {
      low:  ["no medimos", "sin tracking", "sin analytics", "sin presupuesto", "no invertimos"],
      high: ["google analytics", "pixel", "campañas", "cac", "tracking", "reporting"],
    },
    questions: [
      "¿Sabéis de dónde vienen vuestros mejores clientes (los más rentables)?",
      "¿Cuánto os cuesta captar un cliente nuevo de forma directa?",
      "¿Tenéis base de datos de clientes anteriores? ¿La aprovecháis?",
      "¿Qué tipo de contenido o canal os ha funcionado mejor orgánicamente?",
      "¿Habéis probado captación directa fuera de las plataformas?",
    ],
  },
  operaciones: {
    problems: [
      { kw: ["no hay procesos", "no documentados", "no está escrito"], label: "Procesos no documentados — conocimiento en personas" },
      { kw: ["excel", "papel", "whatsapp", "correo"], label: "Herramientas desconectadas — información dispersa" },
      { kw: ["manual", "manualmente", "a mano"], label: "Tareas repetitivas realizadas manualmente" },
      { kw: ["error", "errores", "se nos olvida", "olvidamos"], label: "Errores frecuentes en operaciones" },
      { kw: ["no hay kpi", "no medimos", "sin indicadores"], label: "Sin KPIs operativos — sin visibilidad del rendimiento" },
      { kw: ["depende de mí", "solo yo", "si no estoy"], label: "Dependencia crítica de una sola persona" },
    ],
    maturity: {
      low:  ["no documentado", "manual", "excel", "papel", "sin kpis", "depende de mí", "solo yo"],
      high: ["documentado", "automatizado", "erp", "sops", "kpis", "playbook", "sistema"],
    },
    questions: [
      "Si una persona clave no pudiera trabajar 2 semanas, ¿qué pasaría exactamente?",
      "¿Cuántas horas a la semana dedicáis a tareas administrativas repetitivas?",
      "¿Cuáles son las 3 tareas que más tiempo consumen y menos valor aportan?",
      "¿Habéis calculado el coste real de vuestro trabajo manual?",
      "¿Hay procesos que se hacen diferente dependiendo de quién los ejecuta?",
    ],
  },
  delivery: {
    problems: [
      { kw: ["no está estandarizado", "no hay estándar", "cada uno a su manera"], label: "Proceso de entrega no estandarizado" },
      { kw: ["incidencias", "quejas", "problemas frecuentes", "falla"], label: "Incidencias frecuentes en la entrega" },
      { kw: ["no hay seguimiento", "sin seguimiento", "no hacemos postventa"], label: "Sin proceso de seguimiento postventa" },
      { kw: ["no hay documentación", "sin documentación", "en mi cabeza"], label: "Proceso de delivery sin documentar" },
      { kw: ["depende de", "solo yo", "si no estoy", "sin mí"], label: "Delivery dependiente de una persona clave" },
    ],
    maturity: {
      low:  ["ninguna automatización", "todo manual", "en mi cabeza", "no hay documentación", "sin seguimiento"],
      high: ["documentado", "automatizado", "sistematizado", "estandarizado", "nps", "encuesta"],
    },
    questions: [
      "¿Cuál es la pregunta que más repiten los clientes durante el proceso?",
      "¿Qué incidencia ha sido más difícil de gestionar en el último año?",
      "¿Los clientes saben siempre qué esperar en cada momento del proceso?",
      "¿Cómo sabes si un cliente está satisfecho antes de que deje su reseña?",
      "¿Qué parte del proceso depende más de ti y no puedes delegar?",
    ],
  },
};

const RISK_BY_MATURITY = {
  Bajo: [
    "Alta dependencia de personas clave — colapso del área si alguien causa baja",
    "Sin trazabilidad de datos — decisiones basadas en intuición, no en hechos",
    "Dificultad para escalar sin contratación masiva",
    "Crecimiento limitado por capacidad operativa manual",
    "Riesgo de pérdida de información crítica no documentada",
  ],
  Medio: [
    "Procesos parcialmente documentados — riesgo de inconsistencia entre personas",
    "Integración incompleta entre herramientas — datos duplicados o perdidos",
    "Mejoras dependen de iniciativa individual, no de sistemas",
    "Crecimiento puede desestabilizar lo que actualmente funciona",
  ],
  Alto: [
    "Riesgo bajo — consolidar y mantener lo que funciona",
    "Revisar si las herramientas actuales escalan con el crecimiento proyectado",
    "Vigilar deuda técnica acumulada en herramientas y procesos",
  ],
};

// ─── Analysis ─────────────────────────────────────────────────────────────────

function detectProblems(areaKey, text) {
  return (HEURISTICS[areaKey]?.problems ?? [])
    .filter(({ kw }) => kw.some((k) => text.includes(k)))
    .map(({ label }) => label);
}

function assessMaturity(areaKey, text) {
  const signals = HEURISTICS[areaKey]?.maturity;
  if (!signals) return "Medio";
  const lowCount  = signals.low.filter((k) => text.includes(k)).length;
  if (lowCount >= 3) return "Bajo";
  const highCount = signals.high.filter((k) => text.includes(k)).length;
  if (highCount >= 3 && lowCount <= 1) return "Alto";
  return "Medio";
}

function detectOpportunities(areaKey, allText) {
  const patterns = OPPORTUNITY_PATTERNS[areaKey] ?? [];
  return patterns.filter((p) => p.detect(allText));
}

function formatAnswerForNotion(r) {
  if (!r.answer) return "—";
  if (r.type === "scale") return `${r.answer.trim()} / 10`;
  return r.answer.trim();
}

// ─── Parse Airtable record ────────────────────────────────────────────────────

function parseRecord(record, areaKey) {
  const f = record.fields;
  const empresa       = String(f.Empresa       ?? "Sin nombre").trim();
  const contacto      = String(f.Contacto      ?? "No especificado").trim();
  // email y teléfono se usan internamente pero no se logean
  const email         = String(f.Email         ?? "").trim();
  const telefono      = String(f.Telefono      ?? "").trim();
  const prioridad     = String(f.Prioridad     ?? "Media").trim();
  const observaciones = String(f.Observaciones ?? "").trim();
  const fechaEnvio    = String(f["Fecha de envio"] ?? new Date().toISOString().slice(0, 10)).trim();
  const existingNotionUrl = String(f["Notion URL"] ?? f["URL diagnóstico"] ?? "").trim();

  let respuestasDetalladas = [];
  let flatRespuestas = {};
  let formVersion = "1.0";

  const rawJson = f["Respuestas JSON"];
  if (rawJson) {
    try {
      const parsed = JSON.parse(String(rawJson));
      formVersion = parsed.metadata?.formVersion ?? "1.0";
      if (Array.isArray(parsed.respuestasDetalladas)) {
        respuestasDetalladas = parsed.respuestasDetalladas.filter(
          (r) => r && typeof r.id === "string" && r.answer?.trim()
        );
      } else if (parsed.respuestasDetalladas && typeof parsed.respuestasDetalladas === "object") {
        for (const [id, details] of Object.entries(parsed.respuestasDetalladas)) {
          if (details?.answer?.trim()) {
            respuestasDetalladas.push({
              id, label: String(details.label ?? id),
              type: String(details.type ?? "text"),
              answer: String(details.answer).trim(),
              section: details.section ?? null,
            });
          }
        }
      }
      flatRespuestas = parsed.respuestas ?? {};
    } catch {
      flatRespuestas = { observaciones_raw: observaciones };
    }
  }

  const allText = [
    ...Object.values(flatRespuestas).map(String),
    ...respuestasDetalladas.map((r) => r.answer),
    observaciones,
  ].join(" ").toLowerCase();

  return {
    recordId: record.id,
    empresa, contacto, email, telefono,
    prioridad, observaciones, fechaEnvio,
    formVersion, existingNotionUrl,
    respuestasDetalladas, flatRespuestas,
    problems: detectProblems(areaKey, allText),
    maturity:  assessMaturity(areaKey, allText),
    opportunities: detectOpportunities(areaKey, allText),
  };
}

// ─── Block helpers ────────────────────────────────────────────────────────────

function rt(text, bold = false) {
  return { type: "text", text: { content: String(text ?? "").slice(0, 2000) }, annotations: { bold } };
}

function buildAnswersBlocks(respuestasDetalladas, flatRespuestas = {}) {
  const blocks = [];
  if (respuestasDetalladas.length > 0) {
    let currentSection = null;
    for (const r of respuestasDetalladas) {
      if (!r.answer?.trim()) continue;
      const sec = String(r.section ?? "XX").padStart(2, "0");
      if (sec !== currentSection) {
        currentSection = sec;
        blocks.push(paragraph(""));
        blocks.push(heading3(`Sección ${sec}`));
      }
      const label  = (r.label ?? r.id).length > 130 ? (r.label ?? r.id).slice(0, 130) + "…" : (r.label ?? r.id);
      const answer = formatAnswerForNotion(r);
      blocks.push(bulletItem(`P: ${label}`));
      if (r.type === "multi_select" && answer.includes(",")) {
        for (const opt of answer.split(",").map((v) => v.trim()).filter(Boolean)) {
          blocks.push(bulletItem(`  › ${opt}`));
        }
      } else {
        blocks.push(bulletItem(`R: ${answer.slice(0, 1900)}`));
      }
    }
    return blocks;
  }
  const flatEntries = Object.entries(flatRespuestas).filter(([, v]) => String(v ?? "").trim());
  if (flatEntries.length === 0) {
    blocks.push(callout("No se encontraron respuestas en el registro.", "ℹ️"));
    return blocks;
  }
  for (const [key, val] of flatEntries) {
    const label  = key.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    const answer = String(val).trim().slice(0, 1900);
    blocks.push(bulletItem(`P: ${label}`));
    blocks.push(bulletItem(`R: ${answer}`));
  }
  return blocks;
}

// ─── Area audit blocks — 10 secciones (MODO 2 sub-páginas) ────────────────────

function buildAreaAuditBlocks(areaKey, areaData, areaOpportunities = []) {
  const { problems, maturity, prioridad, respuestasDetalladas, flatRespuestas, fechaEnvio, empresa } = areaData;
  const blocks    = [];
  const areaLabel = AREA_TO_TEMPLATE_NAME[areaKey] ?? AREA_NAMES[areaKey] ?? areaKey;
  const today     = new Date().toISOString().slice(0, 10);
  const questions = HEURISTICS[areaKey]?.questions ?? [];
  const risks     = RISK_BY_MATURITY[maturity] ?? [];

  // Aviso de seguridad interno
  blocks.push(callout(
    "Documento interno de InspireAI. No compartir externamente sin revisión y control de permisos.",
    "🔒"
  ));
  blocks.push(paragraph(""));

  // 1. Situación actual
  blocks.push(heading2("1. Situación actual"));
  const situacion = maturity === "Bajo"
    ? `Madurez BAJA en ${areaLabel}. La operación se apoya en procesos manuales, alta dependencia de personas concretas y baja trazabilidad. Sin intervención, esta área limita el crecimiento. Prioridad de actuación: ${prioridad}.`
    : maturity === "Alto"
    ? `Madurez ALTA en ${areaLabel}. Existen herramientas y procesos establecidos. El foco debe estar en consolidar, medir y optimizar lo que ya funciona. Prioridad: ${prioridad}.`
    : `Madurez MEDIA en ${areaLabel}. Existen herramientas básicas pero sin integración ni automatización sistemática. Hay margen de mejora significativo. Prioridad: ${prioridad}.`;
  blocks.push(paragraph(situacion));
  blocks.push(paragraph(""));
  blocks.push(callout("Completar con observaciones del equipo InspireAI tras la reunión de discovery.", "📝"));
  blocks.push(paragraph(""));

  // 2. Procesos detectados
  blocks.push(heading2("2. Procesos detectados"));
  if (areaOpportunities.length > 0) {
    for (const opp of areaOpportunities) {
      blocks.push(bulletItem(`${opp.subarea ?? areaLabel}: proceso identificado para mejora`));
    }
  } else {
    blocks.push(bulletItem("No se detectaron procesos específicos automáticamente."));
  }
  blocks.push(callout("Mapear procesos completos end-to-end en la reunión de discovery con el cliente.", "📝"));
  blocks.push(paragraph(""));

  // 3. Ineficiencias / cuellos de botella
  blocks.push(heading2("3. Ineficiencias / cuellos de botella"));
  const inefficiencies = areaOpportunities.map((o) => o.problema);
  if (inefficiencies.length > 0) {
    for (const ineff of inefficiencies) blocks.push(bulletItem(ineff));
  } else {
    blocks.push(callout("No se detectaron ineficiencias automáticamente. Revisar en discovery.", "✅"));
  }
  blocks.push(paragraph(""));

  // 4. Problemas principales detectados
  blocks.push(heading2("4. Problemas principales detectados"));
  if (problems.length > 0) {
    for (const p of problems) blocks.push(numberedItem(p));
  } else {
    blocks.push(callout("Sin problemas críticos detectados automáticamente. Revisar respuestas en sección 10.", "✅"));
  }
  blocks.push(callout("Confirmar, priorizar y completar con hallazgos de la reunión de discovery.", "📝"));
  blocks.push(paragraph(""));

  // 5. Evidencia del cuestionario
  blocks.push(heading2("5. Evidencia tomada del cuestionario"));
  const answers = respuestasDetalladas.length > 0
    ? respuestasDetalladas.slice(0, 5)
    : Object.entries(flatRespuestas).slice(0, 5).map(([id, val]) => ({
        id, label: id.replace(/-/g, " "), answer: String(val), type: "text",
      }));
  if (answers.length > 0) {
    for (const a of answers) {
      if (!String(a.answer ?? "").trim()) continue;
      const label  = String(a.label ?? a.id).replace(/-/g, " ").slice(0, 80);
      const answer = String(a.answer).trim().slice(0, 300);
      blocks.push(bulletItem(`"${answer}" (${label})`));
    }
  } else {
    blocks.push(callout("Sin respuestas detalladas disponibles en el registro.", "ℹ️"));
  }
  blocks.push(callout("Añadir capturas, citas textuales o evidencias adicionales de la reunión.", "📝"));
  blocks.push(paragraph(""));

  // 6. Impacto operativo / comercial
  blocks.push(heading2("6. Impacto operativo / comercial"));
  const impactoTexto = maturity === "Bajo"
    ? `El impacto actual en ${areaLabel} es ALTO. Los procesos manuales frenan el crecimiento, generan errores y aumentan el coste operativo.`
    : maturity === "Alto"
    ? `El impacto actual en ${areaLabel} es BAJO. Los procesos están razonablemente controlados. El riesgo principal es la deuda técnica y la falta de escalabilidad.`
    : `El impacto actual en ${areaLabel} es MEDIO. Hay riesgo operativo moderado que puede aumentar con el crecimiento.`;
  blocks.push(paragraph(impactoTexto));
  if (risks.length > 0) {
    for (const r of risks.slice(0, 3)) blocks.push(bulletItem(r));
  }
  blocks.push(paragraph(""));

  // 7. Nivel de urgencia
  const urgenciaEmoji = prioridad === "Alta" ? "🔴" : prioridad === "Baja" ? "🟢" : "🟡";
  blocks.push(heading2("7. Nivel de urgencia"));
  blocks.push(callout(
    `${urgenciaEmoji} Urgencia: ${prioridad} — Madurez estimada: ${maturity}`,
    urgenciaEmoji
  ));
  blocks.push(paragraph(""));

  // 8. Causa raíz probable
  blocks.push(heading2("8. Causa raíz probable"));
  const causaRaiz = problems.length > 0
    ? `La causa raíz más probable en ${areaLabel} es: ${problems[0]}. Esto genera un efecto cascada en el resto del área.`
    : `Causa raíz no detectada automáticamente. Revisar con el cliente durante la reunión de discovery qué proceso o decisión está limitando el área.`;
  blocks.push(paragraph(causaRaiz));
  blocks.push(callout("Validar causa raíz con el cliente. No asumir sin evidencia directa.", "📝"));
  blocks.push(paragraph(""));

  // 9. Preguntas pendientes para discovery
  blocks.push(heading2("9. Preguntas pendientes para la reunión de discovery"));
  if (questions.length > 0) {
    for (const q of questions) blocks.push(bulletItem(q));
  }
  blocks.push(bulletItem("¿Cuál es el mayor cuello de botella que percibís en esta área?"));
  blocks.push(bulletItem("¿Qué haríais diferente si tuvieseis 10 horas más a la semana?"));
  blocks.push(bulletItem("¿Qué proceso os genera más estrés o errores actualmente?"));
  blocks.push(paragraph(""));

  // 10. Respuestas completas del cuestionario (anexo)
  blocks.push(divider());
  blocks.push(heading2("10. Respuestas completas del cuestionario (anexo)"));
  blocks.push(callout(`Cuestionario: ${areaLabel} | Fecha: ${fechaEnvio} | Versión: ${areaData.formVersion ?? "1.0"}`, "📋"));
  for (const b of buildAnswersBlocks(respuestasDetalladas, flatRespuestas)) blocks.push(b);
  blocks.push(paragraph(""));
  blocks.push(divider());
  blocks.push(paragraph(`Diagnóstico generado: ${today} | Área: ${areaLabel} | Empresa: ${empresa}`));

  return blocks;
}

// ─── Blocks — MODO 1 (single area, generic page) ─────────────────────────────

function buildBlocks({ empresa, contacto, email, telefono, areaName, areaKey,
  prioridad, fechaEnvio, recordId, formVersion, respuestasDetalladas, flatRespuestas, problems, maturity }) {

  const blocks = [];
  const quickWins = (OPPORTUNITY_PATTERNS[areaKey] ?? []).map((p) => p.nombre);
  const questions = HEURISTICS[areaKey]?.questions ?? [];
  const risks     = RISK_BY_MATURITY[maturity] ?? RISK_BY_MATURITY.Medio;

  blocks.push(callout(
    "Documento interno de InspireAI. No compartir externamente sin revisión y control de permisos.",
    "🔒"
  ));
  blocks.push(callout(
    "Borrador generado automáticamente a partir del formulario de onboarding. Revisar y completar antes de enviar al cliente.",
    "⚠️"
  ));
  blocks.push(paragraph(""));

  blocks.push(heading2("1. Resumen ejecutivo"));
  const summaryIntro = maturity === "Bajo"
    ? `${empresa} presenta una madurez operativa BAJA en ${areaName}. Procesos manuales, baja trazabilidad y alta dependencia de personas concretas.`
    : maturity === "Alto"
    ? `${empresa} muestra una madurez razonable en ${areaName}. El foco debería estar en consolidar lo existente y optimizar procesos clave.`
    : `${empresa} está en fase de estructuración en ${areaName}. Herramientas básicas sin integración ni automatización sistemática.`;
  blocks.push(paragraph(summaryIntro));
  if (problems.length > 0) {
    blocks.push(paragraph(
      `Se han detectado ${problems.length} problema${problems.length > 1 ? "s" : ""} principal${problems.length > 1 ? "es" : ""}. Más críticos: ${problems.slice(0, 2).join("; ")}.`
    ));
  }
  blocks.push(paragraph(`Prioridad detectada: ${prioridad}. Este diagnóstico es preliminar.`));
  blocks.push(divider());

  blocks.push(heading2("2. Datos del cliente"));
  blocks.push(bulletItem(`Empresa: ${empresa}`));
  blocks.push(bulletItem(`Contacto: ${contacto}`));
  blocks.push(bulletItem(`Área auditada: ${areaName}`));
  blocks.push(bulletItem(`Prioridad detectada: ${prioridad}`));
  blocks.push(bulletItem(`Madurez estimada: ${maturity}`));
  blocks.push(bulletItem(`Fecha de envío del formulario: ${fechaEnvio}`));
  blocks.push(divider());

  blocks.push(heading2("3. Problemas principales detectados"));
  if (problems.length > 0) {
    for (const p of problems) blocks.push(numberedItem(p));
  } else {
    blocks.push(callout("No se detectaron problemas críticos. Revisar respuestas en sección 8.", "✅"));
  }
  blocks.push(callout("Completar con problemas adicionales detectados en discovery.", "📝"));
  blocks.push(divider());

  blocks.push(heading2("4. Oportunidades de automatización e IA"));
  if (quickWins.length > 0) {
    for (const win of quickWins) blocks.push(numberedItem(win));
  }
  blocks.push(callout("Añadir oportunidades específicas de IA detectadas en la reunión.", "🤖"));
  blocks.push(divider());

  blocks.push(heading2("5. Riesgos operativos y ciberseguridad"));
  blocks.push(paragraph(`Nivel de madurez estimado: ${maturity} → impacto en riesgo global:`));
  for (const r of risks) blocks.push(bulletItem(r));
  blocks.push(divider());

  blocks.push(heading2("6. Roadmap recomendado"));
  blocks.push(heading3("Fase 0 — Infraestructura mínima"));
  blocks.push(bulletItem("[ ] Auditar accesos y herramientas actuales"));
  blocks.push(bulletItem("[ ] Documentar proceso más crítico del área"));
  blocks.push(heading3("Fase 1 — Quick wins críticos"));
  for (const win of quickWins.slice(0, 2)) blocks.push(bulletItem(`[ ] ${win}`));
  blocks.push(heading3("Fase 2 — Automatización estructural"));
  for (const win of quickWins.slice(2)) blocks.push(bulletItem(`[ ] ${win}`));
  blocks.push(heading3("Fase 3 — Escalabilidad y gobierno"));
  blocks.push(bulletItem("[ ] Revisar KPIs y resultados"));
  blocks.push(bulletItem("[ ] Documentar todo lo implementado"));
  blocks.push(callout("Completar con tareas específicas tras discovery.", "📝"));
  blocks.push(divider());

  blocks.push(heading2("7. Preguntas pendientes"));
  for (const q of questions) blocks.push(bulletItem(q));
  blocks.push(divider());

  blocks.push(heading2("8. Respuestas completas"));
  for (const b of buildAnswersBlocks(respuestasDetalladas, flatRespuestas)) blocks.push(b);

  blocks.push(divider());
  blocks.push(heading2("9. Checklist interno antes de entregar"));
  blocks.push(callout("Completar antes de enviar al cliente.", "✅"));
  blocks.push(bulletItem("[ ] Problemas detectados basados en evidencia — no inventados"));
  blocks.push(bulletItem("[ ] Oportunidades revisadas por el equipo InspireAI"));
  blocks.push(bulletItem("[ ] Riesgos cyber revisados"));
  blocks.push(bulletItem("[ ] Roadmap validado — plazos realistas"));
  blocks.push(bulletItem("[ ] No hay promesas de implementación"));
  blocks.push(bulletItem("[ ] Permisos de Notion revisados"));
  blocks.push(bulletItem("[ ] Preparar Loom de entrega si aplica"));
  blocks.push(bulletItem("[ ] Preparar propuesta de implementación separada"));

  return blocks;
}

// ─── Generate Oportunidades (Notion DB entries) ───────────────────────────────

function generateOportunidades(areasData) {
  const entries = [];
  for (const area of areasData) {
    if (area.pending) continue;
    const opps = area.opportunities ?? [];
    const templateArea = OPP_AREA_MAP[area.areaKey] ?? area.areaName;

    for (const opp of opps) {
      entries.push({
        "Solución Propuesta": { title: [{ text: { content: opp.nombre.slice(0, 100) } }] },
        "Área":               { select: { name: templateArea } },
        "Problema detectado": { rich_text: [{ text: { content: opp.problema.slice(0, 2000) } }] },
        "Descripción":        { rich_text: [{ text: { content: opp.descripcion.slice(0, 2000) } }] },
        "Impacto":            { select: { name: opp.impacto } },
        "Urgencia":           { select: { name: opp.urgencia } },
        "Dificultad Técnica": { select: { name: opp.dificultad } },
      });
    }

    // Si no se detectaron patrones, añadir una genérica basada en problemas
    if (opps.length === 0 && area.problems.length > 0) {
      entries.push({
        "Solución Propuesta": { title: [{ text: { content: `${area.areaName}: Mejora de procesos operativos` } }] },
        "Área":               { select: { name: templateArea } },
        "Problema detectado": { rich_text: [{ text: { content: area.problems.slice(0, 2).join(". ") } }] },
        "Descripción":        { rich_text: [{ text: { content: "Pendiente de revisión en discovery. Evidencia: " + area.problems[0] } }] },
        "Impacto":            { select: { name: "Media" } },
        "Urgencia":           { select: { name: "Media" } },
        "Dificultad Técnica": { select: { name: "Media" } },
      });
    }
  }
  return entries;
}

// ─── Generate Vulnerabilidades (linked to opportunities) ─────────────────────

function generateVulnerabilidades(areasData) {
  const entries  = [];
  const seen     = new Set(); // evitar duplicados por vulnKey

  for (const area of areasData) {
    if (area.pending) continue;
    const opps     = area.opportunities ?? [];
    const vulnArea = VULN_AREA_MAP[area.areaKey] ?? area.areaName;

    for (const opp of opps) {
      const tmpl = VULN_TEMPLATES[opp.vulnKey ?? "automatizacion"];
      if (!tmpl) continue;

      // De-dup por área + vulnKey para no repetir el mismo riesgo
      const dedupeKey = `${area.areaKey}:${opp.vulnKey}`;
      if (seen.has(dedupeKey)) continue;
      seen.add(dedupeKey);

      const nombre = `${opp.nombre.split(":")[0]}: ${opp.id === "whatsapp_leads" ? "Datos en plataforma no corporativa" : opp.id === "crm" ? "Control de acceso al pipeline" : opp.id === "analytics" ? "GDPR y tracking de usuarios" : "Riesgo operativo de la automatización"}`;

      entries.push({
        "Nombre":                    { title: [{ text: { content: nombre.slice(0, 100) } }] },
        "Área":                      { select: { name: vulnArea } },
        "Tipo de vulnerabilidad":    { select: { name: tmpl.tipo } },
        "Probabilidad":              { number: tmpl.prob },
        "Impacto":                   { number: tmpl.impacto },
        "Descripción":               { rich_text: [{ text: { content: tmpl.descripcion } }] },
        "Escenario de riesgo":       { rich_text: [{ text: { content: tmpl.escenario } }] },
        "Solución propuesta":        { rich_text: [{ text: { content: tmpl.solucion } }] },
        "Mitigación rápida":         { checkbox: tmpl.quick },
        "Esfuerzo técnico":          { select: { name: tmpl.esfuerzo } },
        "Coste estimado":            { select: { name: tmpl.coste } },
        "Activo afectado":           { select: { name: tmpl.activo } },
        "Notas técnicas Claude/Codex": { rich_text: [{ text: { content: `Oportunidad vinculada: ${opp.nombre}` } }] },
      });
    }
  }
  return entries;
}

// ─── Generate Roadmap (4 fases) ───────────────────────────────────────────────

function generateRoadmap(areasData) {
  const entries = [];
  const FASE_LABELS = {
    0: "Fase 0 — Infraestructura",
    1: "Fase 1 — Quick wins",
    2: "Fase 2 — Automatización estructural",
    3: "Fase 3 — Escalabilidad y gobierno",
  };
  const ROAD_AREA_MAP = {
    marketing:   "Marketing",
    ventas:      "Ventas",
    delivery:    "Fulfilment",
    operaciones: "Administración",
  };

  // ── Fase 0: Infraestructura técnica base (siempre — prerequisito de todo lo demás) ──
  const fase0Base = [
    {
      nombre: "Inventario de herramientas y licencias activas",
      desglose: "Mapear todas las herramientas en uso, su coste mensual, responsable y estado de actividad. Identificar duplicidades, licencias sin usar y herramientas sin propietario definido. Resultado: inventario en Notion con fecha de revisión.",
      dependencias: "Ninguna — es el primer paso obligatorio antes de cualquier automatización.",
      impacto: "Alto", esfuerzo: "Bajo", prioridad: "Alta",
    },
    {
      nombre: "Auditoría de permisos y accesos compartidos",
      desglose: "Revisar quién tiene acceso a qué herramienta. Identificar cuentas compartidas, ex-empleados con acceso activo y contraseñas sin 2FA. Activar autenticación de doble factor en herramientas críticas (email corporativo, banca, CRM, Notion).",
      dependencias: "Inventario de herramientas completado.",
      impacto: "Alto", esfuerzo: "Bajo", prioridad: "Alta",
    },
    {
      nombre: "Estructura de datos: convenciones de nombrado y fuente única de verdad",
      desglose: "Definir convenciones para ficheros, carpetas y registros de base de datos. Limpiar datos duplicados e incompletos. Establecer fuente única de verdad por tipo de dato clave (clientes, leads, facturas). Base para cualquier integración futura.",
      dependencias: "Inventario de herramientas.",
      impacto: "Medio", esfuerzo: "Bajo", prioridad: "Media",
    },
    {
      nombre: "Backup y recuperación: política básica de datos críticos",
      desglose: "Identificar los 3 sistemas más críticos (CRM, contabilidad, Notion/documentación). Configurar backup automático semanal con retención mínima de 30 días. Documentar proceso de recuperación ante pérdida de datos con objetivo de <4 horas de downtime.",
      dependencias: "Inventario de herramientas. Auditoría de accesos completada.",
      impacto: "Alto", esfuerzo: "Bajo", prioridad: "Alta",
    },
    {
      nombre: "Seguridad base: 2FA, contraseñas y gestión de credenciales",
      desglose: "Implementar gestor de contraseñas compartido (Bitwarden/1Password) para el equipo. Establecer política de contraseñas mínimas (12 caracteres, alfanumérico). Activar 2FA en todas las herramientas críticas. Protocolo de offboarding: revocación inmediata de accesos al salir del equipo.",
      dependencias: "Auditoría de permisos completada.",
      impacto: "Alto", esfuerzo: "Bajo", prioridad: "Alta",
    },
  ];

  for (const item of fase0Base) {
    entries.push({
      "Nombre":       { title: [{ text: { content: item.nombre } }] },
      "Fase":         { select: { name: FASE_LABELS[0] } },
      "Área":         { select: { name: "General" } },
      "Prioridad":    { select: { name: item.prioridad } },
      "Impacto":      { select: { name: item.impacto } },
      "Esfuerzo":     { select: { name: item.esfuerzo } },
      "Desglose":     { rich_text: [{ text: { content: item.desglose } }] },
      "Dependencias": { rich_text: [{ text: { content: item.dependencias } }] },
    });
  }

  // ── Acciones por oportunidad detectada (fases 0-3, enlazadas a oportunidades reales) ──
  for (const area of areasData) {
    if (area.pending) continue;
    const roadArea = ROAD_AREA_MAP[area.areaKey] ?? area.areaName;
    const opps     = area.opportunities ?? [];

    for (const opp of opps) {
      const faseNum  = opp.fase ?? 1;
      const faseName = FASE_LABELS[faseNum] ?? FASE_LABELS[1];
      const prioridad = faseNum === 0 || faseNum === 1 ? "Alta" : faseNum === 2 ? "Media" : "Baja";
      const impacto   = opp.impacto === "Alto" ? "Alto" : opp.impacto === "Media" ? "Medio" : "Bajo";
      const esfuerzo  = opp.dificultad === "Alta" ? "Alto" : opp.dificultad === "Media" ? "Medio" : "Bajo";

      // Enriquecer desglose con trazabilidad oportunidad → riesgo
      const tmpl = VULN_TEMPLATES[opp.vulnKey ?? "automatizacion"];
      const riesgoSiNoSe = tmpl ? tmpl.escenario : opp.problema;
      const desgloseTexto = (
        opp.descripcion +
        `\n\nOportunidad relacionada: ${opp.nombre}` +
        `\nRiesgo si no se hace: ${riesgoSiNoSe}`
      ).slice(0, 2000);

      const dep = faseNum === 0
        ? "Ninguna — prerrequisito de infraestructura"
        : faseNum === 1
        ? "Auditoría de Fase 0 completada: inventario, accesos y backup activos"
        : faseNum === 2
        ? "Quick wins de Fase 1 en producción. Herramientas y datos estables."
        : "Automatizaciones de Fase 2 operativas. Datos fiables y KPIs definidos.";

      entries.push({
        "Nombre":       { title: [{ text: { content: opp.nombre.slice(0, 100) } }] },
        "Fase":         { select: { name: faseName } },
        "Área":         { select: { name: roadArea } },
        "Prioridad":    { select: { name: prioridad } },
        "Impacto":      { select: { name: impacto } },
        "Esfuerzo":     { select: { name: esfuerzo } },
        "Desglose":     { rich_text: [{ text: { content: desgloseTexto } }] },
        "Dependencias": { rich_text: [{ text: { content: dep } }] },
      });
    }
  }

  // ── Fase 3 — Escalabilidad y gobierno (siempre, al final) ──────────────────
  const fase3Items = [
    {
      nombre: "Monitorización: logs, alertas automáticas y dashboards ejecutivos",
      desglose: "Configurar logs de actividad en herramientas críticas. Dashboard ejecutivo semanal con KPIs por área. Alertas automáticas ante anomalías: caídas de servicio, errores en automatizaciones, umbrales de negocio superados.",
      dependencias: "Automatizaciones de Fase 2 operativas y estables.",
    },
    {
      nombre: "Gobierno de datos: documentación técnica y mejora continua",
      desglose: "Revisión trimestral de KPIs por área. Documentación actualizada de todo lo implementado (SOPs, flujos, integraciones). Auditoría de permisos trimestral. Revisión de costes de herramientas. Identificación de siguiente ciclo de crecimiento.",
      dependencias: "Fases 0, 1 y 2 completadas y documentadas.",
    },
  ];
  for (const item of fase3Items) {
    entries.push({
      "Nombre":       { title: [{ text: { content: item.nombre } }] },
      "Fase":         { select: { name: FASE_LABELS[3] } },
      "Área":         { select: { name: "General" } },
      "Prioridad":    { select: { name: "Baja" } },
      "Impacto":      { select: { name: "Alto" } },
      "Esfuerzo":     { select: { name: "Medio" } },
      "Desglose":     { rich_text: [{ text: { content: item.desglose } }] },
      "Dependencias": { rich_text: [{ text: { content: item.dependencias } }] },
    });
  }

  return entries;
}

// ─── Miro Map Section ─────────────────────────────────────────────────────────

function buildMiroMapSection(areasData, oportunidades) {
  const blocks = [];
  blocks.push(heading1("🗺️ Mapa visual para Miro"));
  blocks.push(paragraph(
    "Esta sección permite al equipo InspireAI montar el mapa visual del cliente en Miro. " +
    "Cada línea sigue el formato: Área → Ineficiencia → Oportunidad → Riesgo cyber → Acción Roadmap → Fase."
  ));
  blocks.push(paragraph(""));

  for (const area of areasData) {
    if (area.pending) continue;
    const opps = area.opportunities ?? [];
    if (opps.length === 0) continue;

    blocks.push(heading3(`${AREA_EMOJIS[area.areaKey] ?? "📋"} ${AREA_TO_TEMPLATE_NAME[area.areaKey] ?? area.areaName}`));
    for (const opp of opps) {
      const tmpl    = VULN_TEMPLATES[opp.vulnKey ?? "automatizacion"];
      const riesgo  = tmpl ? `${tmpl.tipo} — ${tmpl.activo}` : "Riesgo operativo";
      const fase    = opp.fase === 0 ? "Fase 0" : opp.fase === 1 ? "Fase 1" : opp.fase === 2 ? "Fase 2" : "Fase 3";
      const linea   = `${AREA_TO_TEMPLATE_NAME[area.areaKey] ?? area.areaName} → ${opp.problema.slice(0, 80)} → ${opp.nombre} → ${riesgo} → ${fase}`;
      blocks.push(bulletItem(linea));
    }
    blocks.push(paragraph(""));
  }

  blocks.push(callout(
    "Copiar estas líneas al tablero Miro para construir el diagrama visual del diagnóstico.",
    "🖇️"
  ));
  return blocks;
}

// ─── Quality Checklist ────────────────────────────────────────────────────────

function buildQualityChecklist() {
  return [
    heading2("✅ Checklist antes de entregar al cliente"),
    callout(
      "Completar este checklist ANTES de compartir el diagnóstico con el cliente. Documento de uso interno InspireAI.",
      "🔒"
    ),
    paragraph(""),
    heading3("Contenido"),
    bulletItem("[ ] Problemas detectados basados en evidencia real del cuestionario — no inventados"),
    bulletItem("[ ] Oportunidades revisadas y validadas por el equipo InspireAI"),
    bulletItem("[ ] Cada vulnerabilidad está vinculada a una oportunidad o integración concreta"),
    bulletItem("[ ] Roadmap dividido en Fase 0, 1, 2 y 3 con prioridades validadas"),
    bulletItem("[ ] No hay promesas de implementación — solo recomendaciones"),
    bulletItem("[ ] No hay datos inventados sin evidencia"),
    paragraph(""),
    heading3("Seguridad y privacidad"),
    bulletItem("[ ] La página NO es pública — solo accesible dentro del workspace InspireAI"),
    bulletItem("[ ] Los permisos de Notion han sido revisados"),
    bulletItem("[ ] No se han compartido tokens ni credenciales en el contenido"),
    bulletItem("[ ] Revisar que no aparecen datos sensibles no necesarios en el documento"),
    paragraph(""),
    heading3("Entrega"),
    bulletItem("[ ] Preparar Loom de entrega explicando el diagnóstico (si aplica)"),
    bulletItem("[ ] Preparar propuesta de implementación separada (no incluir en este doc)"),
    bulletItem("[ ] Confirmar reunión de discovery con el cliente"),
    bulletItem("[ ] Informar al cliente que el diagnóstico es preliminar y se valida en discovery"),
    paragraph(""),
    callout(
      "⚠️ El diagnóstico es un servicio de análisis — no incluye implementación. El upsell de implementación es posterior.",
      "⚠️"
    ),
  ];
}

// ─── Roadmap intro text ───────────────────────────────────────────────────────

function buildRoadmapIntroBlocks(areasData) {
  const blocks   = [];
  const withData = areasData.filter((a) => !a.pending);
  const allOpps  = withData.flatMap((a) => a.opportunities ?? []);
  const f0 = allOpps.filter((o) => o.fase === 0).map((o) => o.nombre);
  const f1 = allOpps.filter((o) => o.fase === 1).map((o) => o.nombre);
  const f2 = allOpps.filter((o) => o.fase === 2).map((o) => o.nombre);

  blocks.push(paragraph(
    "El roadmap técnico define el orden de implementación de las oportunidades detectadas, priorizando por impacto, esfuerzo y dependencias. " +
    "No es una promesa de entrega — es una recomendación estratégica que debe validarse y ajustarse en la reunión de discovery."
  ));
  blocks.push(paragraph(""));

  if (f0.length > 0) {
    blocks.push(heading3("Fase 0 — Infraestructura mínima (pre-requisito)"));
    blocks.push(paragraph("Sin esta base, cualquier automatización es frágil. Incluye auditoría de accesos, documentación de procesos críticos y seguridad base."));
    for (const n of f0) blocks.push(bulletItem(n));
    blocks.push(paragraph(""));
  }

  if (f1.length > 0) {
    blocks.push(heading3("Fase 1 — Quick wins críticos (alto impacto, bajo esfuerzo)"));
    blocks.push(paragraph("Resultados visibles en 0-30 días. Reducción inmediata de riesgo, errores y tiempo perdido."));
    for (const n of f1) blocks.push(bulletItem(n));
    blocks.push(paragraph(""));
  }

  if (f2.length > 0) {
    blocks.push(heading3("Fase 2 — Automatización estructural (30-90 días)"));
    blocks.push(paragraph("Integraciones entre herramientas, dashboards y workflows. Requiere la base de Fase 1."));
    for (const n of f2) blocks.push(bulletItem(n));
    blocks.push(paragraph(""));
  }

  blocks.push(heading3("Fase 3 — Escalabilidad y gobierno (90+ días)"));
  blocks.push(paragraph("Revisión de KPIs, documentación completa, trazabilidad y mejora continua. Base para el siguiente ciclo de crecimiento."));
  blocks.push(paragraph(""));
  blocks.push(callout("Detalles de cada acción en la base de datos de Roadmap Técnico debajo.", "👇"));
  return blocks;
}

// ─── Inline DB: add entries ────────────────────────────────────────────────────

async function addDbEntries(dbId, entries, label) {
  let added = 0;
  for (const entry of entries) {
    try {
      await createDbEntry(dbId, entry);
      added++;
    } catch (err) {
      console.warn(`   ⚠️  Error en "${label}" entrada ${added + 1}: ${err.message.slice(0, 100)}`);
    }
  }
  console.log(`   ✅ ${added}/${entries.length} entradas en "${label}"`);
  return added;
}

// ─── Find existing page by title ──────────────────────────────────────────────

async function findExistingPageByTitle(title, parentDbId) {
  try {
    const results = await searchByTitle(title);
    for (const page of results) {
      if (page.parent?.database_id !== parentDbId) continue;
      const pageTitle = page.properties?.["Nombre del proyecto"]?.title?.map((t) => t.plain_text ?? "").join("").trim() ?? "";
      if (pageTitle.toLowerCase() === title.toLowerCase()) return page;
    }
  } catch (err) {
    console.warn(`  ⚠️  Búsqueda en Notion falló: ${err.message}`);
  }
  return null;
}

// ─── Create diagnostic from template ─────────────────────────────────────────

async function createDiagnosticFromTemplate(empresa, contacto, email, telefono, areasData, isDryRun) {
  const config         = getNotionConfig();
  const today          = new Date().toISOString().slice(0, 10);
  const pageTitle      = `AI & Cyber 360™ - ${empresa}`;
  const areasWithData  = areasData.filter((a) => !a.pending);
  const globalPriority = areasWithData.some((a) => a.prioridad === "Alta") ? "Alta" : "Media";
  const allOpps        = areasWithData.flatMap((a) => a.opportunities ?? []);
  const verbose        = args.verbose === true || args.verbose === "true";

  // Quantity limits — prioritize evidence-backed, high-impact items
  const MAX_OPPS    = verbose ? Infinity : 20;
  const MAX_VULNS   = verbose ? Infinity : 20;
  const MAX_ROADMAP = verbose ? Infinity : 25;

  // Get parent DB ID from template
  const templateId = config.templatePageId ?? TEMPLATE_PAGE_ID_DEFAULT;
  let parentDbId   = PROYECTOS_DB_ID_DEFAULT;
  try {
    const tmpl = await getPage(templateId);
    if (tmpl.parent?.database_id) parentDbId = tmpl.parent.database_id;
  } catch {
    // fetch failed (SSL / network) — use default, no sensitive data to log
  }

  const oportunidades    = generateOportunidades(areasData).slice(0, MAX_OPPS);
  const vulnerabilidades = generateVulnerabilidades(areasData).slice(0, MAX_VULNS);
  const roadmap          = generateRoadmap(areasData).slice(0, MAX_ROADMAP);

  if (isDryRun) {
    console.log(`\n🔍 DRY RUN — Se crearía en "Proyectos":`);
    console.log(`   Título:     "${pageTitle}"`);
    console.log(`   DB ID:      ${parentDbId}`);
    console.log(`   Prioridad:  ${globalPriority}`);
    console.log(`   Áreas:      ${areasWithData.map((a) => AREA_TO_TEMPLATE_NAME[a.areaKey] ?? a.areaName).join(", ")}`);
    console.log(`   Modo:       ${verbose ? "verbose (sin límites)" : `límites: ${MAX_OPPS} opp / ${MAX_VULNS} vuln / ${MAX_ROADMAP} roadmap`}`);
    console.log(`\n   Oportunidades: ${oportunidades.length} entradas`);
    console.log(`   Vulnerabilidades: ${vulnerabilidades.length} entradas`);
    console.log(`   Roadmap:  ${roadmap.length} acciones`);
    for (const area of areasWithData) {
      const nb = buildAreaAuditBlocks(area.areaKey, area, area.opportunities ?? []).length;
      console.log(`   ${AREA_TO_TEMPLATE_NAME[area.areaKey] ?? area.areaName}: ~${nb} bloques`);
    }
    const opNames = oportunidades.slice(0, 3).map((e) => e["Solución Propuesta"]?.title?.[0]?.text?.content ?? "");
    if (opNames.length > 0) console.log(`\n   Ejemplo oportunidades: ${opNames.join(" | ")}`);
    const roadNames = roadmap.slice(0, 3).map((e) => e["Nombre"]?.title?.[0]?.text?.content ?? "");
    if (roadNames.length > 0) console.log(`   Ejemplo roadmap: ${roadNames.join(" | ")}`);
    console.log(`\n✅ Dry run completado. No se creó ningún registro en Notion.`);
    return null;
  }

  // Create page in "Proyectos" database
  console.log(`\n🚀 Creando página en "Proyectos"...`);
  console.log(`   Título: ${pageTitle}`);

  let page;
  try {
    page = await createDatabasePage(parentDbId, {
      "Nombre del proyecto": { title: [{ text: { content: pageTitle } }] },
      "Prioridad":           { select: { name: globalPriority } },
      "Fecha de inicio":     { date: { start: today } },
    }, []);
  } catch (err) {
    if (err.message.includes("is a page, not a database")) {
      page = await createSubPage(parentDbId, pageTitle, []);
    } else {
      console.error(`\n❌ Error al crear página: ${err.message}`);
      if (err.message.includes("not_found") || err.message.includes("Could not find")) {
        console.error("   → La integración no tiene acceso. Abre la BD Proyectos → Share → Invite → tu integración.");
      }
      process.exit(1);
    }
  }
  console.log(`   ✅ Página: ${page.url}`);

  // Header blocks — formato referencia (no child_page/child_database — must use POST /pages and POST /databases)
  const headerBlocks = [
    { object: "block", type: "callout", callout: {
      rich_text: [{ type: "text", text: { content: "Documento interno de InspireAI. No compartir externamente sin revisión y control de permisos." } }],
      icon: { type: "emoji", emoji: "🔒" },
    }},
    { object: "block", type: "paragraph", paragraph: { rich_text: [{ type: "text", text: {
      content: "Diagnóstico completo de procesos digitales para escalar con IA y blindar ciberseguridad. Este informe guía paso a paso para optimizar, integrar y ejecutar.",
    } }] }},
    { object: "block", type: "paragraph", paragraph: { rich_text: [
      { type: "text", text: { content: `👤 ${empresa}` }, annotations: { bold: true } },
      { type: "text", text: { content: `  ·  📅 ${today}  ·  ⚡️ InspireAI` } },
    ]}},
    { object: "block", type: "divider", divider: {} },
    { object: "block", type: "callout", callout: {
      rich_text: [{ type: "text", text: { content: "Borrador generado automáticamente desde Airtable. Revisar y completar ANTES de entregar al cliente." } }],
      icon: { type: "emoji", emoji: "⚠️" },
    }},
    { object: "block", type: "paragraph", paragraph: { rich_text: [] } },
    { object: "block", type: "heading_1", heading_1: { rich_text: [{ type: "text", text: { content: "1º Auditorias De Área" } }] } },
  ];

  console.log(`\n📝 Añadiendo encabezado...`);
  await appendBlocks(page.id, headerBlocks);

  // Create area sub-pages (POST /pages — child_page blocks rejected by PATCH /blocks)
  console.log(`\n📄 Creando sub-páginas de área...`);
  for (const area of areasWithData) {
    const areaLabel = AREA_TO_TEMPLATE_NAME[area.areaKey] ?? area.areaName;
    try {
      const subPage   = await createSubPage(page.id, areaLabel, []);
      console.log(`   ✅ ${areaLabel}`);
      const areaBlocks = buildAreaAuditBlocks(area.areaKey, area, area.opportunities ?? []);
      await appendBlocks(subPage.id, areaBlocks);
      console.log(`      ${areaBlocks.length} bloques`);
    } catch (err) {
      console.warn(`   ⚠️  Error en ${areaLabel}: ${err.message.slice(0, 120)}`);
    }
  }

  // Divider + Section 2
  await appendBlocks(page.id, [
    { object: "block", type: "divider", divider: {} },
    { object: "block", type: "heading_1", heading_1: { rich_text: [{ type: "text", text: { content: "2º Detección de Oportunidades - IA & Automatización" } }] } },
    { object: "block", type: "paragraph", paragraph: { rich_text: [{ type: "text", text: {
      content: "Cruzar las ineficiencias detectadas con soluciones IA/automáticas posibles. Cada oportunidad está vinculada a una evidencia del cuestionario, un problema concreto y una propuesta de solución técnica. Se priorizan por impacto, urgencia y facilidad de implementación.",
    } }] }},
  ]);

  let opDb = null;
  console.log(`\n📊 Creando BD Oportunidades...`);
  try {
    opDb = await createDatabase(page.id, "Detección de Oportunidades - IA & Automatización", OPORTUNIDADES_SCHEMA);
    console.log(`   ✅ BD creada (${opDb.id})`);
    await addDbEntries(opDb.id, oportunidades, "Oportunidades");
  } catch (err) {
    console.warn(`   ⚠️  Error BD Oportunidades: ${err.message.slice(0, 120)}`);
  }

  // Section 3
  await appendBlocks(page.id, [
    { object: "block", type: "heading_1", heading_1: { rich_text: [{ type: "text", text: { content: "3º Estudio de vulnerabilidades de ciberseguridad" } }] } },
    { object: "block", type: "paragraph", paragraph: { rich_text: [{ type: "text", text: {
      content: "Auditoría de seguridad únicamente sobre las propuestas de IA y automatización detectadas en la sección anterior. No es una auditoría de ciberseguridad completa — es el análisis de riesgos derivados de las integraciones y automatizaciones propuestas. Cada vulnerabilidad está vinculada a la oportunidad que la genera.",
    } }] }},
  ]);

  let vulnDb = null;
  console.log(`\n🔐 Creando BD Vulnerabilidades...`);
  try {
    vulnDb = await createDatabase(page.id, "Estudio de vulnerabilidades de ciberseguridad", VULNERABILIDADES_SCHEMA);
    console.log(`   ✅ BD creada (${vulnDb.id})`);
    await addDbEntries(vulnDb.id, vulnerabilidades, "Vulnerabilidades");
  } catch (err) {
    console.warn(`   ⚠️  Error BD Vulnerabilidades: ${err.message.slice(0, 120)}`);
  }

  // Section 4 — Roadmap
  await appendBlocks(page.id, [
    { object: "block", type: "divider", divider: {} },
    { object: "block", type: "heading_1", heading_1: { rich_text: [{ type: "text", text: { content: "4º Roadmap Técnico" } }] } },
    { object: "block", type: "paragraph", paragraph: { rich_text: [{ type: "text", text: {
      content: "Diseño del roadmap IA + integraciones y mejoras, priorizado por impacto y facilidad de implementación. Organizado en 4 fases: Fase 0 (infraestructura base), Fase 1 (quick wins), Fase 2 (automatización estructural) y Fase 3 (escalabilidad y gobierno de datos).",
    } }] }},
    ...buildRoadmapIntroBlocks(areasData),
  ]);

  let roadDb = null;
  console.log(`\n🗺️  Creando BD Roadmap...`);
  try {
    roadDb = await createDatabase(page.id, "Roadmap Técnico", ROADMAP_SCHEMA);
    console.log(`   ✅ BD creada (${roadDb.id})`);
    await addDbEntries(roadDb.id, roadmap, "Roadmap");
  } catch (err) {
    console.warn(`   ⚠️  Error BD Roadmap: ${err.message.slice(0, 120)}`);
  }

  // Miro map section
  console.log(`\n🖇️  Añadiendo mapa visual Miro...`);
  try {
    await appendBlocks(page.id, [
      { object: "block", type: "divider", divider: {} },
      ...buildMiroMapSection(areasData, oportunidades),
    ]);
  } catch (err) {
    console.warn(`   ⚠️  Error mapa Miro: ${err.message.slice(0, 80)}`);
  }

  // Quality checklist
  console.log(`\n✅ Añadiendo checklist de calidad...`);
  try {
    await appendBlocks(page.id, [
      { object: "block", type: "divider", divider: {} },
      ...buildQualityChecklist(),
    ]);
  } catch (err) {
    console.warn(`   ⚠️  Error checklist: ${err.message.slice(0, 80)}`);
  }

  const pageUrl = page.url ?? `https://notion.so/${(page.id ?? "").replace(/-/g, "")}`;
  console.log(`\n✅ Página creada:`);
  console.log(`   URL: ${pageUrl}`);
  console.log(`   ID:  ${page.id}`);

  return { page, pageUrl };
}

// ─── Airtable: update record ──────────────────────────────────────────────────

async function updateAirtableRecord(tableName, recordId, pageUrl, pageId) {
  const today = new Date().toISOString().slice(0, 10);
  try {
    await updateRecord(tableName, recordId, {
      "Notion URL":          pageUrl,
      "Notion Page ID":      pageId,
      "Estado diagnóstico":  "Borrador creado",
      "Fecha diagnóstico":   today,
    });
    console.log(`   ✅ ${recordId} actualizado`);
  } catch {
    try {
      await updateRecord(tableName, recordId, { "Notion URL": pageUrl });
      console.log(`   ✅ "Notion URL" actualizado en ${recordId}`);
      console.log(`   ⚠️  Crear en Airtable: "Notion Page ID" (texto), "Estado diagnóstico" (texto), "Fecha diagnóstico" (fecha)`);
    } catch (err2) {
      console.warn(`   ⚠️  No se pudo actualizar ${recordId}: ${err2.message}`);
    }
  }
}

// ─── Notion: create page (MODO 1) ────────────────────────────────────────────

async function createNotionPage(title, extraProperties, blocks, isDryRun) {
  if (isDryRun) {
    console.log(`\n🔍 DRY RUN — ${blocks.length} bloques que se crearían en Notion.`);
    console.log(`✅ Dry run completado. No se creó ningún registro.`);
    return null;
  }

  let notionConfig;
  try { notionConfig = getNotionConfig(); }
  catch (err) { console.error(`\n❌ Configuración Notion: ${err.message}`); process.exit(1); }

  if (!notionConfig.diagnosticsDatabaseId) {
    console.error("❌ NOTION_DIAGNOSTICS_DATABASE_ID no está configurado en .env.local");
    process.exit(1);
  }

  const baseProperties = { Name: { title: [{ text: { content: title } }] } };

  console.log(`\n🚀 Creando página...`);
  console.log(`   Título:  ${title}`);
  console.log(`   Bloques: ${blocks.length}`);

  let page;
  try {
    page = await createDatabasePage(notionConfig.diagnosticsDatabaseId, { ...baseProperties, ...extraProperties }, blocks);
  } catch (err) {
    if (err.message.includes("is a page, not a database")) {
      page = await createSubPage(notionConfig.diagnosticsDatabaseId, title, blocks);
    } else {
      console.error(`\n❌ Error al crear página: ${err.message}`);
      process.exit(1);
    }
  }

  const pageUrl = page.url ?? `https://notion.so/${(page.id ?? "").replace(/-/g, "")}`;
  console.log(`\n✅ URL: ${pageUrl}`);
  return { page, pageUrl };
}

// ─── MODO 1: Por área ─────────────────────────────────────────────────────────

async function runAreaMode() {
  const areaKey = (args.area ?? "").toLowerCase().trim();
  if (!areaKey) { usage(); process.exit(1); }

  let tableName;
  try { const { env } = getConfig(); tableName = getTableName(areaKey, env); }
  catch (err) { console.error(`\n❌ ${err.message}`); process.exit(1); }

  const recordIdArg = args["record-id"] ?? args.record ?? null;
  let record;
  try {
    if (recordIdArg) {
      console.log(`\n📥 Leyendo registro ${recordIdArg}...`);
      record = await getRecord(tableName, recordIdArg);
    } else if (args.latest) {
      console.log(`\n📥 Leyendo registro más reciente de "${tableName}"...`);
      const records = await listRecords(tableName, { sort: { field: "Fecha de envio", direction: "desc" }, maxRecords: 1 });
      if (records.length === 0) { console.error(`❌ No hay registros en "${tableName}"`); process.exit(1); }
      record = records[0];
    } else {
      usage(); process.exit(1);
    }
  } catch (err) { console.error(`\n❌ Error al leer Airtable: ${err.message}`); process.exit(1); }

  const data     = parseRecord(record, areaKey);
  const areaName = AREA_NAMES[areaKey] ?? areaKey;

  console.log(`\n  Empresa:    ${data.empresa}`);
  console.log(`  Área:       ${areaName}`);
  console.log(`  Prioridad:  ${data.prioridad}`);
  console.log(`  Madurez:    ${data.maturity}`);
  console.log(`  Problemas:  ${data.problems.length} detectados`);
  console.log(`  Oport.:     ${data.opportunities.length} detectadas`);

  if (data.existingNotionUrl && !args.force) {
    console.log(`\n⚠️  Ya existe página: ${data.existingNotionUrl}`);
    console.log(`   Usa --force para crear una nueva igualmente.`);
    process.exit(0);
  }

  const blocks = buildBlocks({
    empresa: data.empresa, contacto: data.contacto, email: data.email,
    telefono: data.telefono, areaName, areaKey,
    prioridad: data.prioridad, fechaEnvio: data.fechaEnvio,
    recordId: record.id, formVersion: data.formVersion,
    respuestasDetalladas: data.respuestasDetalladas,
    flatRespuestas: data.flatRespuestas,
    problems: data.problems, maturity: data.maturity,
  });

  const pageTitle = `Diagnóstico ${areaName} — ${data.empresa}`;
  const result    = await createNotionPage(pageTitle, {}, blocks, args["dry-run"]);
  if (!result) return;

  if (args["update-airtable"]) {
    console.log(`\n📝 Actualizando Airtable...`);
    await updateAirtableRecord(tableName, record.id, result.pageUrl, result.page.id);
  }

  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`  ${data.prioridad === "Alta" ? "🔴" : data.prioridad === "Baja" ? "🟢" : "🟡"} ${pageTitle}`);
  console.log(`  Madurez: ${data.maturity} | Problemas: ${data.problems.length}`);
  console.log(`  Página: ${result.pageUrl}`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
}

// ─── MODO 2: Consolidado por cliente ─────────────────────────────────────────

async function runClientMode() {
  const clientName = String(args.client ?? "").trim();
  if (!clientName) {
    console.error('❌ --client requiere un nombre de empresa.');
    usage(); process.exit(1);
  }

  const areasToSearch = args.areas
    ? String(args.areas).split(",").map((a) => a.trim().toLowerCase()).filter((a) => ALL_AREAS.includes(a))
    : ALL_AREAS;

  if (areasToSearch.length === 0) {
    console.error("❌ Áreas no válidas. Válidas: " + ALL_AREAS.join(", "));
    process.exit(1);
  }

  console.log(`\n🔍 Buscando registros en Airtable...`);
  console.log(`   Áreas: ${areasToSearch.join(", ")}`);

  const { env } = getConfig();
  const safeClient = clientName.replace(/"/g, "").trim();
  const formula    = `LOWER(TRIM({Empresa}))=LOWER(TRIM("${safeClient}"))`;

  const areaResults = {};
  for (const areaKey of areasToSearch) {
    let tableName;
    try { tableName = getTableName(areaKey, env); } catch { continue; }
    try {
      const records = await listRecords(tableName, {
        formula,
        sort: { field: "Fecha de envio", direction: "desc" },
        maxRecords: 5,
      });
      if (records.length > 0) {
        areaResults[areaKey] = records[0];
        console.log(`   ✅ ${AREA_NAMES[areaKey]}: encontrado (${records.length} registro${records.length > 1 ? "s" : ""})`);
      } else {
        areaResults[areaKey] = null;
        console.log(`   ⏳ ${AREA_NAMES[areaKey]}: sin registro`);
      }
    } catch (err) {
      areaResults[areaKey] = null;
      console.warn(`   ⚠️  ${AREA_NAMES[areaKey]}: error — ${err.message}`);
    }
  }

  const areasWithData = areasToSearch.filter((k) => areaResults[k]);
  const areasPending  = areasToSearch.filter((k) => !areaResults[k]);

  if (areasWithData.length === 0) {
    console.error(`\n❌ No se encontraron registros para "${clientName}".`);
    console.error(`   Verifica que el nombre coincide exactamente con el campo "Empresa" en Airtable.`);
    process.exit(1);
  }

  // Idempotency check
  if (!args.force) {
    for (const areaKey of areasWithData) {
      const existingUrl = String(areaResults[areaKey].fields["Notion URL"] ?? areaResults[areaKey].fields["URL diagnóstico"] ?? "").trim();
      if (existingUrl) {
        console.log(`\n⚠️  Ya existe diagnóstico para ${AREA_NAMES[areaKey]}: ${existingUrl}`);
        console.log(`   Usa --force para crear una nueva copia igualmente.`);
        process.exit(0);
      }
    }
  }

  const primaryData = parseRecord(areaResults[areasWithData[0]], areasWithData[0]);
  console.log(`\n  Empresa:   ${primaryData.empresa}`);

  const areasData = [];
  for (const areaKey of areasToSearch) {
    if (areaResults[areaKey]) {
      const data = parseRecord(areaResults[areaKey], areaKey);
      console.log(`  [${areaKey.toUpperCase().padEnd(12)}] Prioridad: ${data.prioridad} | Madurez: ${data.maturity} | Problemas: ${data.problems.length} | Oport: ${data.opportunities.length}`);
      areasData.push({
        areaKey, areaName: AREA_NAMES[areaKey], pending: false,
        empresa: data.empresa,
        recordId: areaResults[areaKey].id,
        prioridad: data.prioridad, fechaEnvio: data.fechaEnvio, formVersion: data.formVersion,
        problems: data.problems, maturity: data.maturity,
        opportunities: data.opportunities,
        respuestasDetalladas: data.respuestasDetalladas, flatRespuestas: data.flatRespuestas,
      });
    } else {
      areasData.push({ areaKey, areaName: AREA_NAMES[areaKey], pending: true });
    }
  }

  const result = await createDiagnosticFromTemplate(
    primaryData.empresa, primaryData.contacto, primaryData.email, primaryData.telefono,
    areasData, args["dry-run"]
  );
  if (!result) return;

  if (args["update-airtable"]) {
    console.log(`\n📝 Actualizando Airtable (${areasWithData.length} registro${areasWithData.length > 1 ? "s" : ""})...`);
    for (const areaKey of areasWithData) {
      let tableName;
      try { tableName = getTableName(areaKey, env); } catch { continue; }
      await updateAirtableRecord(tableName, areaResults[areaKey].id, result.pageUrl, result.page.id);
    }
  }

  const globalPriority = areasData.filter((a) => !a.pending).some((a) => a.prioridad === "Alta") ? "Alta" : "Media";
  const totalOpps      = areasData.flatMap((a) => a.opportunities ?? []).length;
  const pageTitle      = `Inspire Cyber 360 - ${primaryData.empresa}`;

  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`  ${pageTitle}`);
  console.log(`  Áreas:     ${areasWithData.map((k) => AREA_TO_TEMPLATE_NAME[k] ?? AREA_NAMES[k]).join(", ")}`);
  if (areasPending.length > 0) console.log(`  Pendientes: ${areasPending.map((k) => AREA_NAMES[k]).join(", ")}`);
  console.log(`  Prioridad: ${globalPriority}`);
  console.log(`  Oport.:    ${totalOpps} detectadas`);
  console.log(`  Notion:    ${result.pageUrl}`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
  console.log(`Próximos pasos:`);
  console.log(`  1. Abre la página en Notion y revisa cada sección`);
  console.log(`  2. Valida oportunidades, vulnerabilidades y roadmap`);
  console.log(`  3. Completa con hallazgos de la reunión de discovery`);
  console.log(`  4. Completa el checklist antes de compartir con el cliente\n`);
}

// ─── Main ──────────────────────────────────────────────────────────────────────

if (args.client) {
  await runClientMode();
} else if (args.area) {
  await runAreaMode();
} else {
  usage();
  process.exit(1);
}
