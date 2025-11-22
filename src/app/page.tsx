// src/app/page.tsx

import { HeroSection } from '@/sections/home/HeroSection';
import { IntroSection } from '@/sections/home/IntroSection';
import { ProjectsSection } from '@/sections/home/ProjectsSection';
import { AIApproachSection } from '@/sections/home/AIApproachSection';
import { ProcessSection } from '@/sections/home/ProcessSection';
import { AboutMeSection } from '@/sections/home/AboutMeSection';
import { CtaSection } from '@/sections/home/CtaSection';
import { FooterSection } from '@/sections/home/FooterSection';
import { FocusSection } from '@/sections/home/FocusSection';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#0F1115]">
      <HeroSection />
      <IntroSection />
      <FocusSection />
      {/* <AudienceSection />
      <ServicesSection /> 
       <WorkFormatsSection />
      */}
      <ProjectsSection />
      <AIApproachSection />
      <ProcessSection />
      <AboutMeSection />
      <CtaSection />
      <FooterSection />
      {/* Здесь позже появятся остальные секции: Audience, Services и т.д. */}
    </main>
  );
}