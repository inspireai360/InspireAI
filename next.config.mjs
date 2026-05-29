/** @type {import('next').NextConfig} */
const isDev = process.env.NODE_ENV === "development";

const nextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              isDev
                ? "script-src 'self' 'unsafe-inline' 'unsafe-eval'"
                : "script-src 'self' 'unsafe-inline'",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: https: blob:",
              "font-src 'self' data: https:",
              isDev ? "connect-src 'self' ws: wss:" : "connect-src 'self'",
              "frame-ancestors 'none'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join("; "),
          },
        ],
      },
    ];
  },

  async rewrites() {
    return [
      // Public questionnaire URLs → onboarding pages (question data lives there)
      { source: "/cuestionario-delivery",  destination: "/onboarding/delivery" },
      { source: "/cuestionario-delivery/", destination: "/onboarding/delivery" },
      { source: "/cuestionario-marketing",  destination: "/onboarding/marketing" },
      { source: "/cuestionario-marketing/", destination: "/onboarding/marketing" },
      { source: "/cuestionario-ventas",  destination: "/onboarding/ventas" },
      { source: "/cuestionario-ventas/", destination: "/onboarding/ventas" },
      { source: "/cuestionarioops",  destination: "/onboarding/administracion_documentacion" },
      { source: "/cuestionarioops/", destination: "/onboarding/administracion_documentacion" },
    ];
  },
};

export default nextConfig;
