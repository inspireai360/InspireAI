export { size, contentType } from "@/lib/og-service-image";
import { generateServiceOG } from "@/lib/og-service-image";

export const alt = "Consultoría IA para Empresas | InspireAI";

export default function Image() {
  return generateServiceOG(
    "Consultoría IA para Empresas",
    "Auditamos tus procesos, detectamos oportunidades reales y entregamos un roadmap en Notion.",
    ["Inspire Cyber 360", "Garantía de devolución", "4 áreas auditadas"],
    "#818CF8"
  );
}
