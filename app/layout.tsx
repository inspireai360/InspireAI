import type { Metadata } from "next";
import { Inter, DM_Sans, Syne, Orbitron } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: '--font-inter',
  weight: ['400', '500', '600', '700']
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: '--font-dm-sans',
  weight: ['400', '500', '700']
});

const syne = Syne({
  subsets: ["latin"],
  variable: '--font-syne',
  weight: ['400', '500', '600', '700', '800']
});

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: '--font-orbitron',
  weight: ['700', '800', '900']
});

const BASE_URL = "https://inspireai.es";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: "InspireAI | Consultoría de IA y Automatización Empresarial en España",
  description: "Auditamos tus procesos con IA, detectamos ineficiencias reales y te entregamos un plan accionable en Notion. Primera consulta gratuita. Basados en España.",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
  alternates: {
    canonical: BASE_URL,
  },
  openGraph: {
    title: "InspireAI | Inteligencia que impulsa tu crecimiento",
    description: "Auditamos tus procesos, identificamos oportunidades reales de automatización y te entregamos un plan concreto para implementarlo con seguridad.",
    url: BASE_URL,
    siteName: "InspireAI",
    locale: "es_ES",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "InspireAI | Inteligencia que impulsa tu crecimiento",
    description: "Auditamos tus procesos y te entregamos un plan de IA accionable. Primera consulta gratuita.",
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: "JgloMNQa-xh2Hzp_6NqGBUxdp0RZNM7iOHuzojz4Zww",
  },
};


const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "name": "InspireAI",
  "url": "https://inspireai.es",
  "logo": "https://inspireai.es/logo.png",
  "description": "Consultora tecnológica especializada en auditorías de IA y automatización empresarial para empresas en España.",
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "ES"
  },
  "areaServed": "España",
  "serviceType": ["Auditoría de IA", "Automatización de procesos", "Consultoría de Inteligencia Artificial", "Ciberseguridad IA"],
  "sameAs": ["https://www.linkedin.com/company/inspireai"],
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "customer service",
    "availableLanguage": "Spanish"
  },
  "offers": {
    "@type": "Offer",
    "name": "Inspire Cyber 360 — Diagnóstico gratuito",
    "price": "0",
    "priceCurrency": "EUR",
    "description": "Primera llamada de diagnóstico sin coste para analizar las oportunidades de IA en tu empresa."
  }
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "¿Cuánto cuesta la auditoría Inspire Cyber 360?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "El diagnóstico inicial tiene un coste de entre 1.500€ y 4.500€ según el alcance (número de áreas: marketing, ventas, operaciones, fulfillment). Si contratas la implementación en los 30 días siguientes, el 100% del diagnóstico se bonifica."
      }
    },
    {
      "@type": "Question",
      "name": "¿Qué incluye el Inspire Cyber 360?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Incluye auditoría de 4 áreas clave (marketing, ventas, operaciones y fulfillment), detección de oportunidades de IA con impacto económico estimado, análisis de ciberseguridad validado por hackers éticos, roadmap técnico priorizado en Notion y reunión 1:1 con el CTO."
      }
    },
    {
      "@type": "Question",
      "name": "¿En cuánto tiempo se entrega el informe?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "El proceso completo dura entre 4 y 6 semanas desde el kickoff. El informe en Notion queda operativo desde el día 1 de la reunión de entrega."
      }
    },
    {
      "@type": "Question",
      "name": "¿Tenéis garantía de resultados?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Sí. Si no identificamos al menos 2 procesos con impacto real de IA en tu empresa, devolvemos el importe íntegro. Sin letras pequeñas."
      }
    },
    {
      "@type": "Question",
      "name": "¿Para qué tipo de empresas trabajáis?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Trabajamos con PYMEs de entre 5 y 50 empleados en España de cualquier sector. Nuestros servicios están especialmente orientados a empresas que quieren automatizar procesos repetitivos, mejorar su captación de clientes o implementar soluciones de IA de forma segura."
      }
    }
  ]
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "InspireAI",
  url: BASE_URL,
  description: "Consultora tecnológica especializada en auditorías de IA y automatización empresarial para pymes y empresas en España.",
  address: {
    "@type": "PostalAddress",
    addressCountry: "ES",
  },
  areaServed: "España",
  serviceType: [
    "Auditoría de IA",
    "Automatización empresarial",
    "Ciberseguridad",
    "Arquitectura de IA",
  ],
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "EUR",
    name: "Llamada de diagnóstico gratuita",
    description: "Primera consulta sin compromiso para analizar las necesidades de automatización e IA de tu empresa.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="scroll-smooth">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/favicon.ico" />
      </head>
      <body className={`${inter.variable} ${dmSans.variable} ${syne.variable} ${orbitron.variable} font-sans bg-dark text-white antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
        {children}
      </body>
    </html>
  );
}
