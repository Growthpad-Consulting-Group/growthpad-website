
const row1 = [
  "Opportunities for Growth & career development",
  "Unlimited learning opportunities",
  "Hybrid work",
  "Health & wellbeing",
];

const row2 = [
  "Recognition for your success",
  "Competitive pay",
  "Shadowing, mentoring, & training opportunities",
  "Healthy working environment",
];

function BenefitCard({ text }: { text: string }) {
  return (
    <div className="flex min-w-56 flex-1 items-center justify-center rounded-2xl bg-white px-8 py-8 text-center transition-all duration-700 ease-out hover:-translate-y-2 hover:scale-[0.98] hover:shadow-[0_25px_45px_rgba(240,93,35,0.28)]">
      <p className="text-secondary text-lg leading-7">{text}</p>
    </div>
  );
}

export default function CareersBenefits() {
  return (
    <section
      data-theme-section="gray"
      className="theme-bg relative w-full py-20 lg:py-28"
    >
      <div className="container-fluid">
        <div className="flex items-center justify-between gap-6">
          <h2 className="font-display theme-fg text-4xl font-bold sm:text-5xl">
            Why work at Growthpad?
          </h2>
        </div>

        <div className="mt-12 flex flex-col gap-6 lg:mt-16">
          <div className="flex flex-wrap gap-6">
            {row1.map((text) => (
              <BenefitCard key={text} text={text} />
            ))}
          </div>

          <div className="flex flex-wrap gap-6 lg:ml-16">
            {row2.map((text) => (
              <BenefitCard key={text} text={text} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
