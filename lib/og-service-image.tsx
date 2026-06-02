import { ImageResponse } from "next/og";
import { readFileSync } from "fs";
import { join } from "path";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateServiceOG(title: string, subtitle: string, pills: string[], accentColor = "#818CF8") {
  const logoData = readFileSync(join(process.cwd(), "public/logo.png"));
  const logoSrc = `data:image/png;base64,${logoData.toString("base64")}`;

  return new ImageResponse(
    (
      <div style={{
        background: "#08091A", width: "100%", height: "100%",
        display: "flex", flexDirection: "column",
        padding: "72px 80px", position: "relative", fontFamily: "sans-serif",
      }}>
        {/* Glow */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
          background: `radial-gradient(circle 800px at 50% -5%, ${accentColor}30 0%, transparent 65%)`,
          display: "flex",
        }} />
        {/* Grid */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)",
          backgroundSize: "30px 30px", display: "flex",
        }} />

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 56 }}>
          <div style={{ width: 52, height: 52, borderRadius: 26, overflow: "hidden", display: "flex" }}>
            <img src={logoSrc} width={58} height={58} />
          </div>
          <span style={{ fontSize: 22, fontWeight: 800, color: "white", letterSpacing: "-0.5px" }}>
            INSPIRE<span style={{ color: accentColor }}>AI</span>
          </span>
        </div>

        {/* Title */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div style={{
            fontSize: 62, fontWeight: 900, color: "white",
            letterSpacing: "-2px", lineHeight: 1.1, marginBottom: 20, display: "flex", flexWrap: "wrap",
          }}>{title}</div>
          <div style={{
            fontSize: 26, color: "rgba(255,255,255,0.55)", lineHeight: 1.5,
            maxWidth: 720, marginBottom: 40, display: "flex",
          }}>{subtitle}</div>

          {/* Pills */}
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {pills.map(p => (
              <div key={p} style={{
                background: `${accentColor}18`, border: `1px solid ${accentColor}50`,
                borderRadius: 999, padding: "8px 20px",
                color: accentColor, fontSize: 18, display: "flex",
              }}>{p}</div>
            ))}
            <div style={{
              background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: 999, padding: "8px 20px",
              color: "rgba(255,255,255,0.4)", fontSize: 18, display: "flex",
            }}>inspireai.es</div>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
