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
      "Audience insight, programme communication, digital tools, AI in health, MELA and evidence systems for public-interest initiatives.",
    icon: "health.svg",
    href: "#",
  },
  {
    name: "Technology, data and digital infrastructure",
    description:
      "Concept research, product adoption, AI, field data systems, websites, portals and locally adapted multi-market activation.",
    icon: "tech.svg",
    href: "#",
  },
  {
    name: "Learning and knowledge ecosystems",
    description:
      "Instructional design, e-learning, learning platforms and knowledge systems for organisations that need to build capability at scale. Embedded with AI capabilities.",
    icon: "learning.svg",
    href: "#",
  },
  {
    name: "Regulated and reputation-sensitive sectors",
    description:
      "Reputation planning, stakeholder communication and customer journeys for organisations where credibility, compliance and trust shape uptake.",
    icon: "regulated.svg",
    href: "#",
  },
];
