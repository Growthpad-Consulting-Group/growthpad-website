import Hero from "@/components/Hero";
import About from "@/components/About";
import Brands from "@/components/Brands";
import ScrollColorTransition from "@/components/ScrollColorTransition";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <ScrollColorTransition />
      <Hero />
      <About />
      <Brands />
    </div>
  );
}
