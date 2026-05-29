import { ImageResponse } from "next/og";
import { readFileSync } from "fs";
import { join } from "path";

export const alt = "InspireAI — Consultoría de IA y Automatización Empresarial en España";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OGImage() {
  const logoData = readFileSync(join(process.cwd(), "public/logo.png"));
  const logoSrc = `data:image/png;base64,${logoData.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          background: "#09090B",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          fontFamily: "sans-serif",
        }}
      >
        {/* Radial glow */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "radial-gradient(circle 700px at 50% -10%, rgba(91,98,244,0.35) 0%, transparent 70%)",
            display: "flex",
          }}
        />

        {/* Dot grid */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
            display: "flex",
          }}
        />

        {/* Logo — img oversized inside container so white anti-alias edges get clipped */}
        <div
          style={{
            width: 160,
            height: 160,
            borderRadius: 80,
            overflow: "hidden",
            marginBottom: 28,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <img src={logoSrc} width={176} height={176} />
        </div>

        {/* Wordmark */}
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            marginBottom: 20,
            gap: 0,
          }}
        >
          <span
            style={{
              fontSize: 72,
              fontWeight: 900,
              color: "white",
              letterSpacing: "-3px",
              fontFamily: "sans-serif",
            }}
          >
            INSPIRE
          </span>
          <span
            style={{
              fontSize: 72,
              fontWeight: 900,
              color: "#818CF8",
              letterSpacing: "-3px",
              fontFamily: "sans-serif",
            }}
          >
            AI
          </span>
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 28,
            color: "rgba(255,255,255,0.55)",
            textAlign: "center",
            maxWidth: 640,
            lineHeight: 1.4,
            marginBottom: 48,
            display: "flex",
          }}
        >
          Inteligencia que impulsa tu crecimiento
        </div>

        {/* Pills */}
        <div style={{ display: "flex", gap: 16 }}>
          {["Auditoria de IA", "Automatizacion empresarial", "Ciberseguridad"].map(
            (text) => (
              <div
                key={text}
                style={{
                  background: "rgba(91,98,244,0.12)",
                  border: "1px solid rgba(91,98,244,0.35)",
                  borderRadius: 999,
                  padding: "10px 22px",
                  color: "#A5B4FC",
                  fontSize: 18,
                  display: "flex",
                }}
              >
                {text}
              </div>
            )
          )}
        </div>
      </div>
    ),
    { ...size }
  );
}
