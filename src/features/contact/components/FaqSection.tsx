import Accordion from "@/shared/components/Accordion";
import { faq } from "@/features/contact/components/faq";

export default function FaqSection() {
  return (
    <section
      data-theme-section="light"
      className="theme-bg relative w-full py-20 lg:py-28"
    >
      <div className="container-fluid">
        <h2 className="font-display theme-fg text-4xl leading-tight font-bold sm:text-5xl">
          Frequently Asked Questions
        </h2>

        <div className="mt-16 ml-auto max-w-4xl">
          <Accordion items={faq} />
        </div>
      </div>
    </section>
  );
}
