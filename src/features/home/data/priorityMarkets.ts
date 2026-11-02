export type PriorityMarket = {
  name: string;
  description: string;
  icon: string;
  href: string;
};

export const priorityMarkets: PriorityMarket[] = [
  {
    name: "Health and public systems",
    description:
      "Audience research, public health communication, digital tools, AI for health, and monitoring, evaluation and learning (MEL) systems for public-interest programmes.",
    icon: "health.svg",
    href: "#",
  },
  {
    name: "Technology, data and digital infrastructure",
    description:
      "Concept research, product adoption, AI, field data systems, websites and portals. We also run campaigns adapted to each local market.",
    icon: "tech.svg",
    href: "#",
  },
  {
    name: "Learning and knowledge ecosystems",
    description:
      "Instructional design, e-learning, learning platforms and knowledge systems. We help organisations build skills at scale. Includes AI features.",
    icon: "learning.svg",
    href: "#",
  },
  {
    name: "Regulated and reputation-sensitive sectors",
    description:
      "Reputation planning, stakeholder communication and customer journeys for organisations where trust matters. In these sectors, compliance and credibility affect whether people use a service.",
    icon: "regulated.svg",
    href: "#",
  },
];
