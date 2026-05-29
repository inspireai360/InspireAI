import OnboardingPage from "../_components/OnboardingPage";
import type { Question } from "../_components/OnboardingForm";

export const metadata = {
  title: "Auditoría de Marketing | InspireAI",
  robots: "noindex, nofollow",
};

const questions: Question[] = [
  // ── Sección 01: Datos de la Empresa y Estructura de Marketing ────────────
  {
    id: "marketing_01_01",
    label: "Nombre de la empresa",
    type: "text",
    required: true,
  },
  {
    id: "marketing_01_02",
    label: "Área a auditar",
    type: "fixed",
    value: "Marketing",
  },
  {
    id: "marketing_01_03",
    label: "Tu rol en la empresa",
    type: "single_select",
    options: [
      "CEO / Fundador",
      "CMO / Director de Marketing",
      "Marketing Manager",
      "Growth / Performance",
      "Content Manager",
      "Social Media Manager",
      "Otro",
    ],
  },
  {
    id: "marketing_01_04",
    label: "¿Cuántas personas trabajan en marketing?",
    type: "number",
  },
  {
    id: "marketing_01_05",
    label: "¿Qué hace cada persona?",
    type: "textarea",
  },
  {
    id: "marketing_01_06",
    label: "¿Qué tareas dependen de UNA SOLA persona?",
    type: "textarea",
    helper: "Puntos críticos: si esa persona falta, ¿qué se para?",
  },

  // ── Sección 02: Gestión del Marketing ────────────────────────────────────
  {
    id: "marketing_02_01",
    label: "¿Quién ejecuta el marketing?",
    type: "textarea",
  },
  {
    id: "marketing_02_02",
    label: "¿Tenéis agencia o proveedor externo de marketing?",
    type: "single_select",
    options: ["Sí, agencia externa", "Mixto", "Todo interno"],
  },
  {
    id: "marketing_02_03",
    label: "Detalles del proveedor externo",
    type: "textarea",
    helper: "Enviaremos un formulario específico a vuestra agencia/proveedor para auditar también su trabajo. Por favor, avisadles de que les contactaremos.",
  },
  {
    id: "marketing_02_04",
    label: "Nombre de la agencia/proveedor",
    type: "text",
  },
  {
    id: "marketing_02_05",
    label: "Email de contacto de la agencia",
    type: "email",
  },
  {
    id: "marketing_02_06",
    label: "¿Qué gestiona la agencia?",
    type: "multi_select",
    options: [
      "Publicidad de pago (Google Ads, Meta Ads...)",
      "SEO / Posicionamiento",
      "Gestión de redes sociales",
      "Creación de contenido",
      "Email marketing",
      "Web / Landing pages",
      "Estrategia general",
    ],
  },
  {
    id: "marketing_02_07",
    label: "Coste mensual aproximado de la agencia",
    type: "currency",
    currency: "EUR",
  },

  // ── Sección 03: Herramientas y Software de Marketing ─────────────────────
  {
    id: "marketing_03_01",
    label: "¿Qué herramientas usáis?",
    type: "multi_select",
    helper: "Selecciona todas las que apliquen",
    options: [
      "Google Ads",
      "Meta Ads (Facebook/Instagram)",
      "LinkedIn Ads",
      "TikTok Ads",
      "Google Analytics",
      "Google Search Console",
      "SEMrush / Ahrefs / Similar",
      "Mailchimp",
      "Brevo (Sendinblue)",
      "ActiveCampaign",
      "HubSpot",
      "Hootsuite / Buffer / Metricool",
      "Canva",
      "Adobe Creative Suite",
      "WordPress",
      "CRM (Salesforce, Pipedrive, Zoho...)",
      "Excel / Google Sheets",
    ],
  },
  {
    id: "marketing_03_02",
    label: "Otras herramientas que uséis",
    type: "textarea",
  },
  {
    id: "marketing_03_03",
    label: "¿Las herramientas están conectadas entre sí?",
    type: "single_select",
    options: ["Bien integradas", "Algunas", "Son islas"],
  },

  // ── Sección 04: Creación de Contenido ────────────────────────────────────
  {
    id: "marketing_04_01",
    label: "¿Quién crea el contenido?",
    type: "multi_select",
    options: [
      "Equipo interno",
      "Agencia externa",
      "Freelancers",
      "IA (ChatGPT, Jasper...)",
      "El CEO / Fundador",
    ],
  },
  {
    id: "marketing_04_02",
    label: "¿Qué tipo de contenido creáis?",
    type: "multi_select",
    options: [
      "Posts para redes sociales",
      "Stories / Reels / TikToks",
      "Artículos de blog / SEO",
      "Emails / Newsletters",
      "Vídeos (YouTube, webinars...)",
      "Podcast",
      "Creatividades para ads",
      "Lead magnets (ebooks, guías...)",
    ],
  },
  {
    id: "marketing_04_03",
    label: "La creación de contenido es...",
    type: "single_select",
    options: ["100% Manual", "Asistida con IA", "Muy automatizada"],
  },
  {
    id: "marketing_04_04",
    label: "¿Con qué frecuencia publicáis contenido?",
    type: "text",
  },
  {
    id: "marketing_04_05",
    label: "¿Dónde se atasca la creación de contenido?",
    type: "textarea",
  },

  // ── Sección 05: Publicación y Distribución ────────────────────────────────
  {
    id: "marketing_05_01",
    label: "¿Tenéis flujos automáticos de publicación?",
    type: "single_select",
    options: ["Sí, programado", "Algo programado", "Todo manual"],
  },
  {
    id: "marketing_05_02",
    label: "¿En qué canales publicáis?",
    type: "multi_select",
    options: [
      "Instagram",
      "Facebook",
      "LinkedIn",
      "TikTok",
      "YouTube",
      "X (Twitter)",
      "Blog / Web",
      "Email / Newsletter",
      "WhatsApp / Telegram",
    ],
  },
  {
    id: "marketing_05_03",
    label: "¿Cómo es el proceso de publicación?",
    type: "textarea",
  },

  // ── Sección 06: Campañas, Segmentación y CRM ──────────────────────────────
  {
    id: "marketing_06_01",
    label: "¿Las campañas de marketing están conectadas con el CRM?",
    type: "single_select",
    options: ["Sí, conectadas", "Parcialmente", "No conectadas"],
  },
  {
    id: "marketing_06_02",
    label: "¿Cómo son las segmentaciones de audiencia?",
    type: "single_select",
    options: ["Segmentación avanzada", "Segmentación básica", "Disparo masivo"],
  },
  {
    id: "marketing_06_03",
    label: "¿Podéis medir qué campañas generan ventas reales?",
    type: "single_select",
    options: ["Sí, bien medido", "Más o menos", "No sabemos"],
  },
  {
    id: "marketing_06_04",
    label: "¿Qué problemas tenéis con la atribución?",
    type: "textarea",
  },

  // ── Sección 07: Captación y Volumen ──────────────────────────────────────
  {
    id: "marketing_07_01",
    label: "¿Cuántas peticiones/leads generáis?",
    type: "number_group",
    fields: ["Por día", "Por semana", "Por mes"],
  },
  {
    id: "marketing_07_02",
    label: "¿Hay días/horas pico de captación?",
    type: "textarea",
  },
  {
    id: "marketing_07_03",
    label: "La captación actual, ¿es escalable?",
    type: "single_select",
    options: ["Sí, podemos crecer", "Limitada", "No, tope humano"],
  },
  {
    id: "marketing_07_04",
    label: "Si tuvierais que duplicar leads, ¿qué se rompería?",
    type: "textarea",
  },

  // ── Sección 08: Uso de IA en Marketing ───────────────────────────────────
  {
    id: "marketing_08_01",
    label: "¿Usáis IA en marketing?",
    type: "single_select",
    options: ["Sí, mucho", "Algo", "No usamos"],
  },
  {
    id: "marketing_08_02",
    label: "¿Para qué usáis IA?",
    type: "multi_select",
    options: [
      "Generación de textos (copy, emails, posts...)",
      "Generación de imágenes (DALL-E, Midjourney...)",
      "Edición o generación de vídeo",
      "Optimización SEO",
      "Personalización de emails",
      "Optimización de anuncios",
      "Chatbot / Atención automatizada",
      "Análisis de datos / Reportes",
      "A/B Testing automatizado",
    ],
  },
  {
    id: "marketing_08_03",
    label: "¿Qué herramientas de IA usáis?",
    type: "textarea",
  },

  // ── Sección 09: Automatizaciones Actuales ─────────────────────────────────
  {
    id: "marketing_09_01",
    label: "¿Tenéis automatizaciones activas en marketing?",
    type: "single_select",
    options: ["Sí, tenemos", "No, todo manual"],
  },
  {
    id: "marketing_09_02",
    label: "Detalles de automatizaciones",
    type: "textarea",
  },
  {
    id: "marketing_09_03",
    label: "¿Qué tenéis automatizado?",
    type: "multi_select",
    options: [
      "Email de bienvenida",
      "Secuencias de nurturing",
      "Carrito abandonado",
      "Lead scoring",
      "Publicación en redes",
      "Reportes automáticos",
      "Sincronización con CRM",
      "Retargeting automático",
    ],
  },
  {
    id: "marketing_09_04",
    label: "¿Qué infraestructura/herramientas usáis para automatizar?",
    type: "textarea",
  },
  {
    id: "marketing_09_05",
    label: "¿Hay supervisión humana (human in the loop)?",
    type: "single_select",
    options: ["Siempre revisamos", "A veces", "100% automático"],
  },
  {
    id: "marketing_09_06",
    label: "¿Están optimizadas al 100%?",
    type: "single_select",
    options: ["Sí, optimizadas", "Mejorables", "Necesitan trabajo"],
  },
  {
    id: "marketing_09_07",
    label: "Coste operativo mensual de las automatizaciones",
    type: "currency",
    currency: "EUR",
  },
  {
    id: "marketing_09_08",
    label: "¿Por qué no habéis automatizado?",
    type: "multi_select",
    options: [
      "Falta de tiempo",
      "No sabemos cómo",
      "Limitación de presupuesto",
      "No era prioridad",
      "Las herramientas no lo permiten",
    ],
  },

  // ── Sección 10: Tareas Manuales y Repetitivas ─────────────────────────────
  {
    id: "marketing_10_01",
    label: "¿Qué tareas se hacen manualmente?",
    type: "multi_select",
    options: [
      "Crear posts para redes",
      "Programar publicaciones",
      "Responder comentarios/DMs",
      "Crear y enviar emails",
      "Gestionar campañas de ads",
      "Crear reportes/dashboards",
      "Subir leads al CRM",
      "Buscar ideas/contenido",
      "Editar imágenes/vídeos",
      "Actualizar la web",
    ],
  },
  {
    id: "marketing_10_02",
    label: "¿Hay acciones que se repiten cada semana/mes?",
    type: "textarea",
  },
  {
    id: "marketing_10_03",
    label: "¿Qué es lo que MÁS frustra al equipo?",
    type: "textarea",
  },
  {
    id: "marketing_10_04",
    label: "¿En qué se pierde más tiempo?",
    type: "textarea",
  },

  // ── Sección 11: Expectativas y Criterios de Éxito ─────────────────────────
  {
    id: "marketing_11_01",
    label: "Si pudierais \"clonar\" a alguien para hacer UNA tarea 24/7, ¿cuál?",
    type: "textarea",
  },
  {
    id: "marketing_11_02",
    label: "Si tuvierais 2 horas extra al día, ¿en qué las usaríais?",
    type: "textarea",
  },
  {
    id: "marketing_11_03",
    label: "¿Cómo definiríais el éxito de esta auditoría?",
    type: "textarea",
  },
  {
    id: "marketing_11_04",
    label: "¿Presupuesto para mejoras tecnológicas?",
    type: "single_select",
    options: [
      "<500€/mes",
      "500€-1.000€/mes",
      "1.000€-2.500€/mes",
      ">2.500€/mes",
      "Depende del ROI",
    ],
  },
  {
    id: "marketing_11_05",
    label: "¿Hay resistencia al cambio en el equipo?",
    type: "single_select",
    options: ["Muy abiertos", "Se adaptan", "Hay resistencia", "No lo sé"],
  },

  // ── Sección 12: Comentarios Adicionales ──────────────────────────────────
  {
    id: "marketing_12_01",
    label: "Principales \"dolores\" del área de marketing",
    type: "textarea",
  },
  {
    id: "marketing_12_02",
    label: "¿Algo más que debamos saber?",
    type: "textarea",
  },
];

interface PageProps {
  searchParams: Record<string, string | string[] | undefined>;
}

export default function MarketingPage({ searchParams }: PageProps) {
  const accessKey =
    typeof searchParams.access === "string" ? searchParams.access : undefined;

  return (
    <OnboardingPage
      area="marketing"
      areaTitle="Auditoría del Área de Marketing"
      areaSubtitle="Analizaremos vuestro ecosistema de marketing: herramientas, contenido, automatizaciones e IA, para identificar oportunidades de escalar la captación sin aumentar el equipo."
      questions={questions}
      accessKey={accessKey}
    />
  );
}
