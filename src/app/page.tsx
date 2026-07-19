import Hero from "@/features/home/components/Hero";
import About from "@/features/home/components/About";
import Brands from "@/features/home/components/Brands";
import Ambition from "@/features/home/components/Ambition";
import SpecialtiesTimeline from "@/features/home/components/SpecialtiesTimeline";
import PickACard from "@/features/home/components/PickACard";
import Clients from "@/features/home/components/Clients";
import OfficeGallery from "@/features/home/components/OfficeGallery";
import OurWork from "@/features/home/components/OurWork";
import Testimonials from "@/features/home/components/Testimonials";
import TeamStories from "@/features/home/components/TeamStories";
import Partners from "@/shared/components/Partners";
import Affiliations from "@/features/home/components/Affiliations";
import ContactForm from "@/shared/components/ContactForm";
import ScrollColorTransition from "@/shared/components/ScrollColorTransition";
import SectionAnimate from "@/shared/components/SectionAnimate";

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
      <SectionAnimate variant="fade-up" delay={0.05}>
        <Partners />
      </SectionAnimate>
      <SectionAnimate variant="fade-up" delay={0.1}>
        <OfficeGallery />
      </SectionAnimate>
      <SectionAnimate variant="fade-up" delay={0.15}>
        <Affiliations />
      </SectionAnimate>
      <TeamStories />
      <SectionAnimate variant="fade-up" delay={0.1}>
        <ContactForm variant="home" />
      </SectionAnimate>
    </div>
  );
}
