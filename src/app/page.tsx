import Hero from "@/components/Hero";
import About from "@/components/About";
import Brands from "@/components/Brands";
import Ambition from "@/components/Ambition";
import Specialties from "@/components/Specialties";
import SpecialtiesTimeline from "@/components/SpecialtiesTimeline";
import PickACard from "@/components/PickACard";
import Clients from "@/components/Clients";
import OurWork from "@/components/OurWork";
import Testimonials from "@/components/Testimonials";
import ScrollColorTransition from "@/components/ScrollColorTransition";
import SectionAnimate from "@/components/SectionAnimate";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <ScrollColorTransition />
      <Hero />
      <SectionAnimate variant="fade-up">
        <About />
      </SectionAnimate>
      <Brands />
      <SectionAnimate variant="fade-up" delay={0.1}>
        <Ambition />
      </SectionAnimate>
      {/* <Specialties /> */}
      <SectionAnimate variant="fade-up" delay={0.15}>
        <SpecialtiesTimeline />
      </SectionAnimate>
      <SectionAnimate variant="fade-up" delay={0.2}>
        <PickACard />
      </SectionAnimate>
      <SectionAnimate variant="fade-up" delay={0.25}>
        <Clients />
      </SectionAnimate>
      <OurWork />
      <Testimonials />
    </div>
  );
}
