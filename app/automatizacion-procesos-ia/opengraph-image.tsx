export { size, contentType } from "@/lib/og-service-image";
import { generateServiceOG } from "@/lib/og-service-image";

export const alt = "Automatización de Procesos con IA | InspireAI";

export default function Image() {
  return generateServiceOG(
    "Automatización de Procesos con IA",
    "N8N, Make y Claude API. Sin cambiar tu software actual. Diagnóstico previo incluido.",
    ["N8N self-hosted", "Make", "Claude API"],
    "#E8A24F"
  );
}
