import Hero from "@/components/Hero";
import About from "@/components/About";
import Brands from "@/components/Brands";
import Ambition from "@/components/Ambition";
import Specialties from "@/components/Specialties";
import SpecialtiesTimeline from "@/components/SpecialtiesTimeline";
import PickACard from "@/components/PickACard";
import Clients from "@/components/Clients";
import OurWork from "@/components/OurWork";
import ScrollColorTransition from "@/components/ScrollColorTransition";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <ScrollColorTransition />
      <Hero />
      <About />
      <Brands />
      <Ambition />
      <Specialties />
      <SpecialtiesTimeline />
      <PickACard />
      <Clients />
      <OurWork />
    </div>
  );
}
