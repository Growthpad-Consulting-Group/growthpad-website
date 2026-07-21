import { Icon } from "@iconify/react";
import ContactFormCard from "@/shared/components/ContactFormCard";

export default function ProjectInquiry() {
  return (
    <section
      data-theme-section="cream"
      className="theme-bg relative w-full py-20 lg:py-28"
    >
      <div className="container-fluid grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-6">
            <h1 className="font-display text-secondary text-4xl leading-tight font-bold sm:text-5xl">
              Have a project in mind?
            </h1>
            <p className="text-secondary/80 max-w-md text-lg leading-8">
              Growthpad&apos;s expert team is here to guide you through the
              ever-evolving digital landscape. From Nairobi to the world,
              we&apos;re your partners in innovation.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="font-display text-secondary text-2xl font-bold">
              For Careers, email our
              hiring team.
            </h3>
            <a
              href="mailto:careers@growthpad.co.ke"
              className="text-primary flex items-center gap-3 text-lg font-medium"
            >
              <Icon icon="mdi:email-outline" width={20} height={20} />
              careers@growthpad.co.ke
            </a>
            <a
              href="tel:+254701850850"
              className="text-primary flex items-center gap-3 text-lg font-medium"
            >
              <Icon icon="mdi:phone-outline" width={20} height={20} />
              +254 701 850 850
            </a>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="font-display text-secondary text-2xl font-bold">
              For Business Specific RFP/RFQs, Proposals &amp; Quotations
            </h3>
            <a
              href="mailto:strategic@growthpad.co.ke"
              className="text-primary flex items-center gap-3 text-lg font-medium"
            >
              <Icon icon="mdi:email-outline" width={20} height={20} />
              strategic@growthpad.co.ke
            </a>
          </div>
        </div>

        <ContactFormCard
          inputShape="pill"
          serviceOptions={[
            "Communication",
            "Technology",
            "Market Intelligence",
            "Other",
          ]}
          className="rounded-3xl"
        />
      </div>
    </section>
  );
}
