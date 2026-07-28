import Image from "next/image";
export default function CaseStudyPuzzle({
  problemTitle = "Puzzle",
  problemText,
  solutionTitle = "Piecing the puzzle",
  solutionText,
}: {
  problemTitle?: string;
  problemText: string;
  solutionTitle?: string;
  solutionText: string;
}) {
  return (
    <section
      data-theme-section="dark"
      className="theme-bg relative w-full overflow-hidden py-20 lg:py-28"
    >
      <div className="container-fluid relative">
        <div className="grid gap-16 lg:grid-cols-2">
          <div>
            <h2 className="font-display theme-fg text-4xl font-bold sm:text-5xl">
              {problemTitle}
            </h2>
            <p className="theme-fg mt-6 max-w-md text-lg leading-8 opacity-70">
              {problemText}
            </p>
          </div>

          {/* Right-angle accent, echoing the diagonal from problem
              (top-left) to solution (bottom-right) below. */}
          <div
            aria-hidden
            className="relative hidden h-32 lg:block"
          >
            <div className="absolute right-90 top-0 h-[182px] w-[155px]">
              <Image
                src="/assets/images/border-2.svg"
                alt=""
                fill
                unoptimized
                className="object-contain"
              />
            </div>
          </div>
        </div>

        <div className=" grid items-center gap-12 lg:grid-cols-2">
          <div className="flex justify-center lg:justify-start">
            <Image
              src="/assets/images/piece.gif"
              alt=""
              fill
              priority
              unoptimized
              className="pointer-events-none  w-full max-w-md object-contain opacity-90 select-none mt-40"
            />
            {/* <video
              src="/assets/images/Masked-Puzzle-1.gif"
              autoPlay
              loop
              muted
              playsInline
              className="pointer-events-none mix-blend-multiply w-full max-w-md object-contain opacity-90 select-none" */}
            {/* /> */}
          </div>

          <div className="lg:pl-12">
            <h3 className="font-display theme-fg text-2xl font-bold sm:text-3xl">
              {solutionTitle}
            </h3>
            <p className="theme-fg mt-6 max-w-md text-lg leading-8 opacity-70">
              {solutionText}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
