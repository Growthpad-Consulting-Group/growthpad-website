// Placeholder preview cards — swap for real Sanity-sourced case study
// content once that's uploaded.
export type CaseStudyPreview = {
  slug: string;
  brand: string;
  description: string;
  image: string;
  /** Full-bleed detail-page hero photo. Falls back to `image` if omitted. */
  heroImage?: string;
  /** Detail-page hero headline. Falls back to `description` if omitted. */
  heroTitle?: string;
  /** Detail-page "Puzzle" section — problem question + how we solved it. */
  problemText?: string;
  solutionText?: string;
  /** Detail-page "Outcome" section — result summary + a pair of proof photos. */
  outcomeText?: string;
  outcomeImages?: [{ src: string; alt: string }, { src: string; alt: string }];
  /** Detail-page video feature — needs a thumbnail plus a youtubeId or videoSrc. */
  videoFeature?: {
    title: string;
    thumbnail: string;
    youtubeId?: string;
    videoSrc?: string;
  };
};

export const caseStudiesPreview: CaseStudyPreview[] = [
  {
    slug: "sidian-bank",
    brand: "Sidian Bank",
    description: "Helping a leading Kenyan bank connect with its audience.",
    image: "/assets/images/clients/sidian.png",
    problemText:
      "How can we help a leading Kenyan bank connect with its audience and stand out in a crowded, highly competitive banking market?",
    solutionText:
      "We built a digital media strategy spanning creative design, content, and targeted campaigns that put Sidian Bank's products in front of the right customers at the right moments.",
  },
  {
    slug: "hewlett-packard-enterprise",
    brand: "Hewlett Packard Enterprise",
    description: "Strategically positioning HPE to B2B audiences.",
    image: "/assets/images/clients/hpe.png",
    problemText:
      "How can we position HPE's enterprise-grade solutions in a way that resonates with technical B2B decision-makers across the region?",
    solutionText:
      "We developed positioning and content tailored to B2B audiences, translating complex enterprise technology into clear, compelling value for decision-makers.",
  },
  {
    slug: "asus",
    brand: "Asus",
    description:
      "Elevating a top European consumer laptop brand among high-end electronic consumers.",
    image: "/assets/images/clients/asus.png",
    problemText:
      "How can we elevate a premium consumer laptop brand among high-end electronics buyers who have no shortage of choices?",
    solutionText:
      "We crafted premium creative and media placements that positioned Asus among the top choices for high-end electronics consumers in the region.",
  },
  {
    slug: "uber",
    brand: "Uber",
    description: "A leading international ride-hailing service.",
    image: "/assets/images/clients/uber.png",
    problemText:
      "How can we grow Uber's brand presence and app downloads across the East African market amid intensifying local competition?",
    solutionText:
      "We executed strategic media planning, creative design, influencer management, and video content that grew Uber's brand presence and monthly app downloads across East Africa.",
    outcomeText:
      "Our partnership has seen Uber's (East Africa) brand presence and monthly app downloads significantly increase, reinforcing its position as a leading ride-hailing service in the region.",
    outcomeImages: [
      {
        src: "/assets/images/misc/uber-card/uber1.png",
        alt: "Introducing Uber Connect campaign",
      },
      {
        src: "/assets/images/misc/uber-card/uber2.png",
        alt: "UberBoda promotion",
      },
    ],
  },
  {
    slug: "zenka",
    brand: "Zenka",
    description: "One of Kenya's biggest mobile lenders.",
    image: "/assets/images/clients/zenka.png",
    heroImage: "/assets/images/misc/zenka-card/zenka-2.png",
    problemText:
      "How can we help one of Kenya's biggest mobile lenders stand out and keep growing its user base in a fast-moving fintech market?",
    solutionText:
      "We created digital media content and designs that showcased Zenka's financial solutions, helping it reach new markets and grow its user base.",
    outcomeText:
      "We've assisted Zenka in increasing its online presence, penetrating new markets, and attracting more users, driving revenue growth alongside its mission of financial inclusion.",
    outcomeImages: [
      {
        src: "/assets/images/misc/zenka-card/pata-na.png",
        alt: "Pata na 5 mins! Flexible loans with 61 repayment days",
      },
      {
        src: "/assets/images/misc/zenka-card/zenka-2.png",
        alt: "Don't miss out on promotions, update your app",
      },
    ],
  },
  {
    slug: "uk-aid",
    brand: "UK Aid",
    description: "Supporting UK Government development programs in Kenya.",
    image: "/assets/images/clients/ukaid.png",
    heroImage: "/assets/images/misc/ukaid-card/ukaid2.png",
    heroTitle: "Digital support for UK Aid's Kenya Innovation Week",
    problemText:
      "How can we help the UK Government and UK Aid drive visibility and engagement for the Kenya Innovation Week, while reaching diverse stakeholders across Kenya's innovation ecosystem?",
    solutionText:
      "We designed and executed end-to-end event planning, branding, web design, digital ads, and social media content that put Kenya Innovation Week in front of the right audiences at the right time.",
    outcomeText:
      "With our support, the UK Government and UK Aid left a lasting legacy through the events. Our clients were able to drive conversations and influence key stakeholders to nurture the innovation and equality ecosystems in Kenya.",
    outcomeImages: [
      {
        src: "/assets/images/misc/ukaid-card/ukaid2.png",
        alt: "Come meet innovators from UKIW and UK Government",
      },
      {
        src: "/assets/images/misc/ukaid-card/ukaid3.png",
        alt: "Come meet innovators from different sectors of the economy, Kenya Innovation Week 2022",
      },
    ],
    // Demo wiring — real testimonial video, standing in until an actual
    // UK Aid case-study video is uploaded via Sanity.
    videoFeature: {
      title: "Kenya Innovation Week 2022",
      thumbnail: "/assets/images/misc/ukaid-card/kiw.png",
      youtubeId: "XTlSYy5qpSo",
    },
  },
];
