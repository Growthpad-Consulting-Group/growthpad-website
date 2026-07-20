import ArrowGroup from "@/shared/components/ArrowGroup";

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
            <svg
              viewBox="0 0 455 232"
              preserveAspectRatio="xMidYMid meet"
              className="h-auto w-full overflow-visible transition-all duration-700 ease-out group-hover:drop-shadow-[0_25px_45px_rgba(240,93,35,0.28)]"
            >
              <defs>
                <clipPath id="careers-culture-clip" clipPathUnits="userSpaceOnUse">
                  <path d="M357.206 20C357.206 8.95431 348.252 0 337.206 0H20C8.95431 0 0 8.95432 0 20V193.663C0 204.709 8.95432 213.663 20 213.663H242.008C247.072 213.663 251.176 217.768 251.176 222.832C251.176 227.895 255.281 232 260.345 232H435C446.046 232 455 223.046 455 212V61.457C455 50.4114 446.046 41.457 435 41.457H377.206C366.16 41.457 357.206 32.5027 357.206 21.457V20Z" />
                </clipPath>
              </defs>
              <foreignObject
                width="455"
                height="232"
                clipPath="url(#careers-culture-clip)"
              >
                <div
                  {...{ xmlns: "http://www.w3.org/1999/xhtml" }}
                  className="h-full w-full"
                >
                  <video
                    src="/assets/images/computer-career.mp4"
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="h-full w-full object-cover"
                  />
                </div>
              </foreignObject>
            </svg>
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
