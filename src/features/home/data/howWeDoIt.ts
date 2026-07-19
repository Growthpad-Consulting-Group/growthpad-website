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
      "We dig into who you're really speaking to, so every strategy is built around real people, not assumptions.",
    image: "/assets/images/audience.png",
  },
  {
    number: "03",
    title: "Grounded in Data",
    description:
      "Every recommendation we make is backed by research and evidence, not guesswork.",
    image: "/assets/images/data-driven.png",
  },
  {
    number: "04",
    title: "Building Internal Capability",
    description:
      "We don't just deliver — we transfer skills and tools so your team can carry the work forward.",
    image: "/assets/images/internal.png",
  },
];
