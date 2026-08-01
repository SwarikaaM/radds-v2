import AchievementsBanner from "../components/about/AchievementsBanner";
import OurStory from "../components/about/OurStory";
import FoundersSection from "../components/about/FoundersSection";
import OurJourneySection from "../components/about/OurJourneySection";
import WhatWeDoSection from "../components/about/WhatWeDoSection";
import InvestmentPhilosophySection from "../components/about/InvestmentPhilosophySection";
import ValuesSection from "../components/about/ValuesSection";
import OurVisionSection from "../components/about/OurVisionSection";
import Registrations from "../components/about/Registrations";
import AboutCTA from "../components/about/AboutCTA";

export default function About() {
  return (
    <>
      <main>
        <AchievementsBanner />
        <OurStory />
        <FoundersSection />
        <OurJourneySection />
        <WhatWeDoSection />
        <InvestmentPhilosophySection />
        <ValuesSection />
        <OurVisionSection />
        <Registrations />
        <AboutCTA />
      </main>
    </>
  );
}