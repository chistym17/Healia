import { V2Layout } from "@/v2/components/V2Layout";
import { HeroSection } from "@/v2/components/HeroSection";
import { HowItWorks } from "@/v2/components/HowItWorks";
import { GuidanceIncludes } from "@/v2/components/GuidanceIncludes";
import { CareBoundary } from "@/v2/components/CareBoundary";
import { FaqSection } from "@/v2/components/FaqSection";
import { CtaSection } from "@/v2/components/CtaSection";
import { MedicalDisclaimer } from "@/v2/components/MedicalDisclaimer";

export default function HomePage() {
  return (
    <V2Layout>
      <HeroSection />
      <HowItWorks />
      <GuidanceIncludes />
      <CareBoundary />
      <FaqSection />
      <CtaSection />
      <MedicalDisclaimer />
    </V2Layout>
  );
}
