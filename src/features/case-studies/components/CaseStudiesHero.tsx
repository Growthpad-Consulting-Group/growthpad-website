import NotchImage from "@/shared/components/NotchImage";
import BigArrow from "@/shared/components/BigArrow";

export default function CaseStudiesHero() {
  return (
    <section
      data-theme-section="dark"
      className="theme-bg w-full pt-6 pb-16 sm:pt-10 lg:pb-20"
    >
      <div className="container-fluid">
        <NotchImage
          variant="concave"
          showBorder
          fit="slice"
          className="h-[320px] w-full sm:h-[420px] lg:h-auto lg:aspect-[1120/499]"
        >
          <div className="flex h-full w-full items-center gap-10 bg-[#050b16] px-8 py-8 sm:px-16 lg:px-20">
            <div className="relative h-2/3 w-1/4 shrink-0 self-center overflow-hidden rounded-2xl bg-black/40">
              <video
                src="/assets/images/case-study-header.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="pointer-events-none h-full w-full object-cover mix-blend-screen opacity-90 select-none"
              />
            </div>

            <div className="flex h-full flex-1 flex-col justify-between py-12 lg:py-20">
              <div className="flex flex-1 items-end">
                <p className="text-primary font-display max-w-md text-2xl leading-tight sm:text-3xl lg:text-4xl">
                  We are marked by troves of success stories.
                </p>
              </div>

              <BigArrow className="text-primary h-28 w-28 self-end sm:h-40 sm:w-40 lg:h-48 lg:w-48" />
            </div>
          </div>
        </NotchImage>
      </div>
    </section>
  );
}
