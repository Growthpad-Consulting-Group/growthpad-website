export type HowWeDoItStep = {
  number: string;
  title: string;
  description: string;
  image: string;
};

export const howWeDoIt: HowWeDoItStep[] = [
  {
    number: "01",
    title: "Leading through Innovation",
    description:
      "We're a blend of innovation enthusiasts, futuristic thinkers, problem solvers, and strategists.",
    image: "/assets/images/Innovation.png",
  },
  {
    number: "02",
    title: "Understanding Your Audience",
    description:
      "We study who you are really speaking to. Every strategy is built around real people, not assumptions.",
    image: "/assets/images/audience.png",
  },
  {
    number: "03",
    title: "Grounded in Data",
    description:
      "Every recommendation is backed by research and evidence, not guesswork.",
    image: "/assets/images/data-driven.png",
  },
  {
    number: "04",
    title: "Building Internal Capability",
    description:
      "We don't just deliver. We pass on skills and tools so your team can carry the work forward.",
    image: "/assets/images/internal.png",
  },
];
