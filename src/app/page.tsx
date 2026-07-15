import Hero from "@/components/Hero";
import About from "@/components/About";
import Brands from "@/components/Brands";
import Ambition from "@/components/Ambition";
import Specialties from "@/components/Specialties";
import HowWeDoIt from "@/components/HowWeDoIt";
import PickACard from "@/components/PickACard";
import Clients from "@/components/Clients";
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
      <HowWeDoIt />
      <PickACard />
      <Clients />
    </div>
  );
}
