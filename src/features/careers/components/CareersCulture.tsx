import ArrowGroup from "@/shared/components/ArrowGroup";
import NotchImage from "@/shared/components/NotchImage";

export default function CareersCulture() {
  return (
    <section
      data-theme-section="dark"
      className="theme-bg relative w-full py-20 lg:py-28"
    >
      <div className="container-fluid">
        <ArrowGroup count={4} className="mb-10 justify-end lg:mb-16" />

        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="group transition-all duration-700 ease-out hover:-translate-y-2 hover:scale-[0.98]">
            <NotchImage
              showBorder={false}
              className="w-full overflow-visible transition-all duration-700 ease-out group-hover:drop-shadow-[0_25px_45px_rgba(240,93,35,0.28)]"
            >
              <video
                src="/assets/images/computer-career.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="h-full w-full object-cover"
              />
            </NotchImage>
          </div>

          <p className="theme-fg text-3xl leading-tight font-light sm:text-4xl">
            Do you share our passion for building game-changing businesses
            through digital media &amp; tech?
          </p>
        </div>

        <div className="mt-16 grid gap-10 lg:grid-cols-2 lg:gap-16 lg:mt-24">
          <p className="theme-fg text-lg leading-8 opacity-80">
            At Growthpad you will meet like-minded open thinkers and
            passionate pioneers across different disciplines.
          </p>

          <p className="theme-fg text-lg leading-8 opacity-80">
            Our team culture provides ample opportunities for career
            advancement and personal fulfillment at every level of your
            development.
          </p>
        </div>
      </div>
    </section>
  );
}
