import Link from "next/link";
import ArrowGroup from "@/shared/components/ArrowGroup";
import CtaButton from "@/shared/components/CtaButton";
import { getJobOpenings, type JobOpeningItem } from "@/sanity/queries";

// Same notch silhouette as NotchCard/NotchPlaceholder, stretched taller
// (via a scale transform rather than recomputing every path point) since
// a job listing needs more vertical room than the standard 455:232 card.
const NOTCH_PATH =
  "M357.206 20C357.206 8.95431 348.252 0 337.206 0H20C8.95431 0 0 8.95432 0 20V193.663C0 204.709 8.95432 213.663 20 213.663H242.008C247.072 213.663 251.176 217.768 251.176 222.832C251.176 227.895 255.281 232 260.345 232H435C446.046 232 455 223.046 455 212V61.457C455 50.4114 446.046 41.457 435 41.457H377.206C366.16 41.457 357.206 32.5027 357.206 21.457V20Z";
const CANVAS_HEIGHT = 380;
const SCALE_Y = CANVAS_HEIGHT / 232;

function formatDeadline(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function OpeningCard({ opening }: { opening: JobOpeningItem }) {
  return (
    <Link
      href={`/careers/${opening.slug}`}
      className="group block transition-all duration-700 ease-out hover:-translate-y-2 hover:scale-[0.98]"
    >
      <svg
        viewBox={`0 0 455 ${CANVAS_HEIGHT}`}
        className="h-auto w-full overflow-visible transition-all duration-700 ease-out group-hover:drop-shadow-[0_25px_45px_rgba(240,93,35,0.28)]"
      >
        <g transform={`scale(1, ${SCALE_Y})`}>
          <path d={NOTCH_PATH} fill="#231812" />
        </g>

        <foreignObject x="32" y="32" width="391" height={CANVAS_HEIGHT - 64}>
          <div
            {...{ xmlns: "http://www.w3.org/1999/xhtml" }}
            className="flex h-full flex-col justify-between"
          >
            <div className="flex flex-col gap-3">
              <h3 className="font-display text-2xl font-bold text-white">
                {opening.title}
              </h3>

              <div className="mt-1 mb-4 flex flex-wrap gap-2">
                <span className="rounded-full bg-white/10 px-3 py-1 text-sm text-white">
                  {opening.employmentType}
                </span>
                <span className="rounded-full bg-white/10 px-3 py-1 text-sm text-white">
                  {opening.workMode}
                </span>
              </div>

              <p className="mt-1 text-lg leading-7 text-white/70">
                <span className="font-semibold text-white">Location:</span> {opening.city}
              </p>
              <p className="text-lg leading-7 text-white/70">
                <span className="font-semibold text-white">Deadline:</span>{" "}
                {formatDeadline(opening.deadline)}
              </p>
            </div>

            <div className="pointer-events-none pb-6" aria-hidden>
              <CtaButton size="md" circleClassName="bg-primary text-white">
                View role
              </CtaButton>
            </div>
          </div>
        </foreignObject>
      </svg>
    </Link>
  );
}

export default async function CareersOpenings() {
  const openings = await getJobOpenings();

  return (
    <section
      data-theme-section="light"
      className="theme-bg relative w-full py-20 lg:py-28"
    >
      <div className="container-fluid">
        <div className="flex items-center justify-between gap-6">
          <h2 className="font-display theme-fg text-4xl font-bold sm:text-5xl">
            Current Openings
          </h2>
          <ArrowGroup count={4} className="hidden sm:flex" />
        </div>

        {openings.length === 0 ? (
          <p className="theme-fg mt-12 text-lg opacity-60">
            No open roles right now - check back soon.
          </p>
        ) : (
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3">
            {openings.map((opening) => (
              <OpeningCard key={opening._id} opening={opening} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
