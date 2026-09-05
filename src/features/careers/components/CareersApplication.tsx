import Image from "next/image";
import ArrowGroup from "@/shared/components/ArrowGroup";
import GeneralCareersForm from "@/features/careers/components/GeneralCareersForm";

export default function CareersApplication() {
  return (
    <section
      id="careers-form"
      data-theme-section="light"
      className="theme-bg relative w-full py-20 lg:py-28"
    >
      <div className="container-fluid flex flex-col gap-10">
        <div className="flex items-center justify-between gap-6">
          <h2 className="font-display theme-fg max-w-2xl text-3xl leading-tight font-bold sm:text-4xl">
            Think you are a GREAT FIT for Growthpad for a role that&apos;s
            currently not open?
          </h2>
          <ArrowGroup count={4} className="hidden sm:flex" />
        </div>

        <div className="relative lg:ml-auto lg:w-11/12">
          <GeneralCareersForm />

          {/* Anchored from the top (not bottom) with a fixed clearance
              below the description text — a bottom anchor would climb
              back up into the (shorter) text column whenever the card's
              overall height shrinks, e.g. right at the "lg" breakpoint
              where the row layout kicks in but the fields column hasn't
              grown tall yet. */}
          <div className="absolute top-44 left-0 z-20 hidden w-3/5 max-w-lg translate-x-[-35%] sm:block">
            <Image
              src="/assets/images/unstoppables.png"
              alt="Growthpad team member celebrating"
              width={552}
              height={296}
              sizes="30vw"
              className="h-auto w-full object-cover shadow-xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
