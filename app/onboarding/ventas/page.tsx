import OnboardingPage from "../_components/OnboardingPage";
import type { Question } from "../_components/OnboardingForm";

export const metadata = {
  title: "Auditoría de Ventas | InspireAI",
  robots: "noindex, nofollow",
};

const questions: Question[] = [
  // ── Sección 01: Datos de la Empresa y Tipo de Negocio ────────────────────
  {
    id: "ventas_01_01",
    label: "Nombre de la empresa",
    type: "text",
    required: true,
  },
  {
    id: "ventas_01_02",
    label: "Tu rol en la empresa",
    type: "single_select",
    options: [
      "Propietario / Dueño",
      "Gerente / Director",
      "Encargado / Manager",
      "Recepción / Atención al cliente",
      "Comercial / Ventas",
      "Marketing",
      "Otro",
    ],
  },
  {
    id: "ventas_01_03",
    label: "Tamaño del equipo",
    type: "single_select",
    options: [
      "1 - 5 empleados",
      "6 - 15 empleados",
      "16 - 50 empleados",
      "51 - 100 empleados",
      "Más de 100 empleados",
    ],
  },
  {
    id: "ventas_01_04",
    label: "¿Qué ofrecéis?",
    type: "textarea",
    helper: "Describe brevemente vuestros productos o servicios principales",
  },
  {
    id: "ventas_01_05",
    label: "¿Quién es vuestro cliente típico?",
    type: "textarea",
    helper: "Perfil de cliente: edad, zona, frecuencia, poder adquisitivo...",
  },
  {
    id: "ventas_01_06",
    label: "Modelo de venta/servicio",
    type: "multi_select",
    options: [
      "Atención presencial en local",
      "Con cita previa / reserva",
      "Servicio a domicilio",
      "Delivery / Take away",
      "Venta online / E-commerce",
      "Venta telefónica",
    ],
  },
  {
    id: "ventas_01_07",
    label: "Ticket medio por cliente/visita",
    type: "currency",
    currency: "EUR",
  },
  {
    id: "ventas_01_08",
    label: "¿Quién atiende a los clientes?",
    type: "textarea",
  },
  {
    id: "ventas_01_09",
    label: "¿Qué depende de UNA SOLA persona?",
    type: "textarea",
    helper: "Puntos críticos: si esa persona falta, ¿qué se para?",
  },

  // ── Sección 02: Canales de Captación de Clientes ──────────────────────────
  {
    id: "ventas_02_01",
    label: "¿Por qué canales llegan los clientes?",
    type: "multi_select",
    options: [
      "Entran directamente al local (walk-in)",
      "Llamada telefónica",
      "WhatsApp / Telegram",
      "Web propia (reservas/formulario)",
      "Google Maps / Ficha de Google",
      "Redes sociales (Instagram, Facebook...)",
      "Apps de delivery (Glovo, UberEats, JustEat...)",
      "Apps de reservas (TheFork, Doctoralia, Treatwell...)",
      "Publicidad online (Google Ads, Meta Ads...)",
      "Recomendaciones / Boca a boca",
      "Email",
      "Otro",
    ],
  },
  {
    id: "ventas_02_02",
    label: "Volumen de clientes/consultas",
    type: "number_group",
    fields: ["Por día", "Por semana", "Por mes"],
  },
  {
    id: "ventas_02_03",
    label: "¿Cuáles son vuestras horas/días punta?",
    type: "textarea",
  },
  {
    id: "ventas_02_04",
    label: "¿Qué canal trae los MEJORES clientes?",
    type: "textarea",
  },
  {
    id: "ventas_02_05",
    label: "¿Hay estacionalidad en vuestro negocio?",
    type: "textarea",
  },

  // ── Sección 03: Primer Contacto y Respuesta ───────────────────────────────
  {
    id: "ventas_03_01",
    label: "¿Quién atiende al cliente primero?",
    type: "textarea",
  },
  {
    id: "ventas_03_02",
    label: "Tiempo de respuesta a llamadas/mensajes",
    type: "single_select",
    options: ["Inmediato <5 min", "<1 hora", "Mismo día", "Variable"],
  },
  {
    id: "ventas_03_03",
    label: "Cuando llaman/escriben fuera de horario...",
    type: "single_select",
    options: ["No se responde", "Buzón / Email", "Autorespuesta"],
  },
  {
    id: "ventas_03_04",
    label: "¿Perdéis clientes por no poder atenderles?",
    type: "single_select",
    options: ["Nunca/Raro", "A veces", "Con frecuencia"],
  },
  {
    id: "ventas_03_05",
    label: "¿Por qué se pierden clientes antes de atenderles?",
    type: "textarea",
  },

  // ── Sección 04: Reservas, Citas y Gestión de Agenda ──────────────────────
  {
    id: "ventas_04_01",
    label: "¿Trabajáis con reservas/citas previas?",
    type: "single_select",
    options: ["Siempre cita", "Mixto", "Sin cita"],
  },
  {
    id: "ventas_04_02",
    label: "Detalles de reservas",
    type: "textarea",
  },
  {
    id: "ventas_04_03",
    label: "¿Cómo se hacen las reservas?",
    type: "multi_select",
    options: [
      "Por teléfono",
      "Por WhatsApp",
      "Web propia con calendario",
      "App externa (TheFork, Doctoralia, Treatwell...)",
      "En persona / Presencial",
      "DM en redes sociales",
    ],
  },
  {
    id: "ventas_04_04",
    label: "¿Dónde apuntáis las reservas?",
    type: "multi_select",
    options: [
      "Agenda de papel / Libreta",
      "Google Calendar / Outlook",
      "Excel / Google Sheets",
      "Software específico del sector",
      "CRM con agenda",
    ],
  },
  {
    id: "ventas_04_05",
    label: "¿Confirmáis las citas antes?",
    type: "single_select",
    options: ["Automático", "Manual", "No"],
  },
  {
    id: "ventas_04_06",
    label: "% de no-shows o cancelaciones tardías",
    type: "percentage",
  },

  // ── Sección 05: Seguimiento y Fidelización ────────────────────────────────
  {
    id: "ventas_05_01",
    label: "¿Guardáis datos de vuestros clientes?",
    type: "single_select",
    options: ["Sí, completos", "Solo básicos", "No guardamos"],
  },
  {
    id: "ventas_05_02",
    label: "¿Qué hacéis para que vuelvan?",
    type: "multi_select",
    options: [
      "Nada específico",
      "Tarjeta de puntos / Fidelidad",
      "Descuentos para repetidores",
      "Recordatorios de próxima cita/visita",
      "Newsletter / Emails",
      "WhatsApp con promociones",
      "Felicitación de cumpleaños",
      "Contenido en redes sociales",
    ],
  },
  {
    id: "ventas_05_03",
    label: "¿Pedís reseñas a los clientes?",
    type: "single_select",
    options: ["Sí, siempre", "A veces", "No pedimos"],
  },
  {
    id: "ventas_05_04",
    label: "% aproximado de clientes que repiten",
    type: "percentage",
  },

  // ── Sección 06: Presupuestos y Proceso de Pago ────────────────────────────
  {
    id: "ventas_06_01",
    label: "¿Hacéis presupuestos personalizados?",
    type: "single_select",
    options: ["Sí, siempre", "A veces", "Precio fijo"],
  },
  {
    id: "ventas_06_02",
    label: "Detalles de presupuestos",
    type: "textarea",
  },
  {
    id: "ventas_06_03",
    label: "¿Cómo creáis los presupuestos?",
    type: "multi_select",
    options: [
      "De palabra",
      "Word / Google Docs",
      "Excel / Google Sheets",
      "Software de facturación",
      "Por WhatsApp",
    ],
  },
  {
    id: "ventas_06_04",
    label: "¿Cuánto tardáis en dar un presupuesto?",
    type: "text",
  },
  {
    id: "ventas_06_05",
    label: "¿Cómo cobráis?",
    type: "multi_select",
    options: [
      "Efectivo",
      "Tarjeta (TPV físico)",
      "Bizum",
      "Transferencia bancaria",
      "Pago online (Stripe, PayPal...)",
      "Financiación / Pago fraccionado",
    ],
  },
  {
    id: "ventas_06_06",
    label: "¿Pedís señal/anticipo?",
    type: "single_select",
    options: ["Sí", "No"],
  },

  // ── Sección 07: Herramientas y Sistemas ───────────────────────────────────
  {
    id: "ventas_07_01",
    label: "¿Qué herramientas usáis?",
    type: "multi_select",
    options: [
      "TPV / Caja registradora",
      "Software específico del sector",
      "CRM (HubSpot, Pipedrive, Zoho...)",
      "Excel / Google Sheets",
      "Software de facturación",
      "WhatsApp Business",
      "Google Business Profile",
      "Redes sociales (Instagram, Facebook...)",
      "Email marketing (Mailchimp, Brevo...)",
      "Papel / Agenda física",
      "La cabeza / Memoria",
    ],
  },
  {
    id: "ventas_07_02",
    label: "Si usáis software específico, ¿cuál?",
    type: "text",
  },
  {
    id: "ventas_07_03",
    label: "¿Las herramientas están conectadas entre sí?",
    type: "single_select",
    options: ["Integradas", "Algunas", "Son islas"],
  },
  {
    id: "ventas_07_04",
    label: "¿Hay datos que tenéis que meter en varios sitios?",
    type: "textarea",
  },

  // ── Sección 08: Métricas y Resultados ────────────────────────────────────
  {
    id: "ventas_08_01",
    label: "¿Qué métricas controláis?",
    type: "multi_select",
    options: [
      "Facturación total",
      "Ticket medio",
      "Clientes nuevos",
      "Clientes que repiten",
      "Ocupación / Reservas",
      "No-shows / Cancelaciones",
      "Reseñas / Valoración",
      "No controlamos métricas",
    ],
  },
  {
    id: "ventas_08_02",
    label: "Tiempo típico desde primer contacto hasta servicio/venta",
    type: "text",
  },
  {
    id: "ventas_08_03",
    label: "De cada 10 personas que preguntan, ¿cuántas compran/reservan?",
    type: "number",
  },
  {
    id: "ventas_08_04",
    label: "¿Por qué se pierden clientes?",
    type: "textarea",
  },

  // ── Sección 09: Automatizaciones e IA Actuales ────────────────────────────
  {
    id: "ventas_09_01",
    label: "¿Tenéis algo automatizado?",
    type: "single_select",
    options: ["Sí, algo", "No, todo manual"],
  },
  {
    id: "ventas_09_02",
    label: "¿Qué tenéis automatizado?",
    type: "multi_select",
    options: [
      "Confirmación automática de citas/reservas",
      "Recordatorios de citas",
      "Respuestas automáticas (WhatsApp, email...)",
      "Emails de marketing automáticos",
      "Facturación automática",
      "Otro",
    ],
  },
  {
    id: "ventas_09_03",
    label: "¿Por qué no habéis automatizado?",
    type: "multi_select",
    options: [
      "Falta de tiempo",
      "No sabemos cómo",
      "Limitación de presupuesto",
      "No era prioridad",
      "Miedo a que falle / Desconfianza",
    ],
  },
  {
    id: "ventas_09_04",
    label: "¿Usáis IA en el negocio?",
    type: "single_select",
    options: ["Sí", "No"],
  },
  {
    id: "ventas_09_05",
    label: "Si usáis IA, ¿para qué?",
    type: "textarea",
  },

  // ── Sección 10: Tareas Repetitivas y Fricciones ───────────────────────────
  {
    id: "ventas_10_01",
    label: "¿Cuáles de estas tareas se hacen manualmente?",
    type: "multi_select",
    options: [
      "Responder las mismas preguntas (horarios, precios, disponibilidad...)",
      "Gestionar reservas/citas por teléfono o WhatsApp",
      "Confirmar citas/reservas una a una",
      "Enviar recordatorios de citas",
      "Copiar datos de un sitio a otro",
      "Crear facturas/tickets",
      "Publicar en redes sociales",
      "Pedir reseñas a clientes",
      "Hacer reportes/cuadres de caja",
    ],
  },
  {
    id: "ventas_10_02",
    label: "¿Qué es lo que MÁS os frustra del día a día?",
    type: "textarea",
  },
  {
    id: "ventas_10_03",
    label: "¿Dónde se \"atasca\" más el negocio?",
    type: "textarea",
  },
  {
    id: "ventas_10_04",
    label: "Si tuvierais el DOBLE de clientes, ¿qué se rompería?",
    type: "textarea",
  },

  // ── Sección 11: Expectativas y Criterios de Éxito ─────────────────────────
  {
    id: "ventas_11_01",
    label: "Si pudierais \"clonar\" a alguien para hacer UNA tarea 24/7, ¿cuál?",
    type: "textarea",
  },
  {
    id: "ventas_11_02",
    label: "Si tuvierais 2 horas extra al día, ¿en qué las usaríais?",
    type: "textarea",
  },
  {
    id: "ventas_11_03",
    label: "¿Cómo definiríais el éxito de esta auditoría?",
    type: "textarea",
  },
  {
    id: "ventas_11_04",
    label: "¿Presupuesto para mejoras tecnológicas?",
    type: "single_select",
    options: [
      "<200€/mes",
      "200€-500€/mes",
      "500€-1.000€/mes",
      ">1.000€/mes",
      "Depende del ROI",
    ],
  },
  {
    id: "ventas_11_05",
    label: "¿Hay resistencia al cambio en el equipo?",
    type: "single_select",
    options: ["Muy abiertos", "Se adaptan", "Hay resistencia", "No lo sé"],
  },

  // ── Sección 12: Comentarios Adicionales ──────────────────────────────────
  {
    id: "ventas_12_01",
    label: "Principales \"dolores\" o problemas del negocio",
    type: "textarea",
  },
  {
    id: "ventas_12_02",
    label: "¿Algo más que debamos saber?",
    type: "textarea",
  },
];

interface PageProps {
  searchParams: Record<string, string | string[] | undefined>;
}

export default function VentasPage({ searchParams }: PageProps) {
  const accessKey =
    typeof searchParams.access === "string" ? searchParams.access : undefined;

  return (
    <OnboardingPage
      area="ventas"
      areaTitle="Auditoría del Área Comercial"
      areaSubtitle="Analizaremos cómo captáis y atendéis clientes, vuestros canales, herramientas y automatizaciones para identificar oportunidades de mejorar la conversión y reducir el trabajo manual."
      questions={questions}
      accessKey={accessKey}
    />
  );
}
