"use client";

import AccessGate from "./AccessGate";
import OnboardingForm, { type Question, type AreaKey } from "./OnboardingForm";

interface OnboardingPageProps {
  area: AreaKey;
  areaTitle: string;
  areaSubtitle: string;
  questions: Question[];
  accessKey: string | undefined;
}

export default function OnboardingPage({
  area,
  areaTitle,
  areaSubtitle,
  questions,
  accessKey,
}: OnboardingPageProps) {
  return (
    <AccessGate accessKey={accessKey}>
      {(verifiedKey) => (
        <OnboardingForm
          area={area}
          areaTitle={areaTitle}
          areaSubtitle={areaSubtitle}
          questions={questions}
          accessKey={verifiedKey}
        />
      )}
    </AccessGate>
  );
}
