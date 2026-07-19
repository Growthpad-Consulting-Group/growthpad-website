import NotchCard from "@/components/NotchCard";

const items = [
  {
    title: "We are bold",
    description:
      "We thrive in creating solutions that can evolve your business.",
  },
  {
    title: "We are inquisitive",
    description:
      "We are constantly learning, always evolving. The world is changing quickly, but we’re not interested in keeping up—we’re interested in leading the way.",
  },
  {
    title: "We are result driven",
    description:
      "We deliver exceptional results for our clients ensuring a highly targeted approach to business growth through digital tools.",
  },
  {
    title: "We are relentless",
    description:
      "We are driven by a constant desire to create something new for our clients, something better, something astounding, something groundbreaking.",
  },
];

export default function WhyUs() {
  return (
    <section
      data-theme-section="gray"
      className="theme-bg relative w-full py-20 lg:py-28"
    >
      <div className="container-fluid">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-secondary text-4xl font-bold sm:text-5xl">
            Why us?
          </h2>

          <p className="text-secondary/70 mt-4 text-lg leading-8">
            The most important part of what we do is listen, be empathetic and
            find solutions attuned to the needs of our clients.
          </p>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-2 lg:gap-x-10 lg:gap-y-8">
          <div className="flex flex-col gap-8">
            <NotchCard
              title={items[0].title}
              description={items[0].description}
            />
            <NotchCard
              title={items[2].title}
              description={items[2].description}
            />
          </div>

          <div className="flex flex-col gap-8 lg:mt-16">
            <NotchCard
              title={items[1].title}
              description={items[1].description}
            />
            <NotchCard
              title={items[3].title}
              description={items[3].description}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
