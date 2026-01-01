// src/app/page.tsx

import { HeroSection } from '@/sections/home/HeroSection';
import { ProjectsSection } from '@/sections/home/ProjectsSection';
import { AIApproachSection } from '@/sections/home/AIApproachSection';
import { ProcessSection } from '@/sections/home/ProcessSection';
import { AboutMeSection } from '@/sections/home/AboutMeSection';
import { CtaSection } from '@/sections/home/CtaSection';
import { FocusSection } from '@/sections/home/FocusSection';
import { WhatToDoSection } from '@/sections/home/WhatToDo';
import { SectionDivider } from '@/components/SectionDivider';
import { IntroSection } from '@/sections/home/IntroSection';
import { HeroSectionNew } from '@/sections/home/HeroSectionNew';
import { HeroSkillsOrbit } from '@/sections/home/HeroSkillsOrbit';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#0F1115]">
      <HeroSection />
      <IntroSection />
      <SectionDivider />
      <WhatToDoSection />
      <SectionDivider />
      <AIApproachSection />
      <SectionDivider />
      <FocusSection />
      <ProjectsSection />
      <ProcessSection />
      <AboutMeSection />
      <CtaSection />
      {/* <HeroSkillsOrbit/> */}
      {/* <HeroSectionNew/> */}
    </main>
  );
}