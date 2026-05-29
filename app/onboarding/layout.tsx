import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Onboarding | InspireAI",
  description: "Cuestionario de diagnóstico — InspireAI",
  robots: "noindex, nofollow",
};

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
