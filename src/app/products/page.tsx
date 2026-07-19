import ProductsHero from "@/features/products/components/ProductsHero";
import ProductShowcase from "@/features/products/components/ProductShowcase";
import ContactForm from "@/shared/components/ContactForm";
import Partners from "@/shared/components/Partners";
import ScrollColorTransition from "@/shared/components/ScrollColorTransition";
import SectionAnimate from "@/shared/components/SectionAnimate";

export default function ProductsPage() {
  return (
    <div className="flex flex-1 flex-col">
      <ScrollColorTransition />
      <ProductsHero />
      <ProductShowcase />
      <SectionAnimate variant="fade-up">
        <ContactForm theme="cream" />
      </SectionAnimate>
      <SectionAnimate variant="fade-up">
        <Partners showHeading={false} theme="light" />
      </SectionAnimate>
    </div>
  );
}
