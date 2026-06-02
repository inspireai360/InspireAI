export { size, contentType } from "@/lib/og-service-image";
import { generateServiceOG } from "@/lib/og-service-image";

export const alt = "CRM Personalizado para Empresas | InspireAI";

export default function Image() {
  return generateServiceOG(
    "CRM a medida para tu empresa",
    "Sin Salesforce ni HubSpot. Tu CRM, con tu marca, conectado a tu web.",
    ["Sin licencias", "Código tuyo", "Conectado a tu web"],
    "#3FA7A0"
  );
}
