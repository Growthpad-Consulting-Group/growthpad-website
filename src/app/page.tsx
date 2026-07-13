import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col bg-background">
      <Navbar />
      <Hero />
    </div>
  );
}
