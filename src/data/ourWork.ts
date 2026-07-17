export type MediaItem = {
  type: "image";
  src: string;
  alt: string;
  fullRow?: boolean;
  rowSpan?: boolean;
  aspectClassName?: string;
};

export type CaseStudy = {
  brand: string;
  logoSrc: string;
  logoWidth: number;
  logoHeight: number;
  tagline: string;
  role: string;
  impact: string;
  className: string;
  bgImage?: string;
  logoClassName?: string;
  media: MediaItem[];
};

export const ourWork: CaseStudy[] = [
  {
    brand: "Uber",
    logoSrc: "/assets/images/misc/uber-card/uber-logo.png",
    logoWidth: 139,
    logoHeight: 90,
    tagline: "A leading international ride-hailing service.",
    role: "We execute strategic media planning, creative design, influencer management, and videos for Uber across the East African market.",
    impact:
      "Our partnership has seen Uber's (East Africa) brand presence and monthly app downloads significantly increase.",
    className: "bg-black",
    media: [
      {
        type: "image",
        src: "/assets/images/misc/uber-card/uber1.png",
        alt: "Introducing Uber Connect campaign",
      },
      {
        type: "image",
        src: "/assets/images/misc/uber-card/uber2.png",
        alt: "UberBoda promotion",
      },
      {
        type: "image",
        src: "/assets/images/misc/uber-card/uber3.png",
        alt: "Uber ride discount promotion",
      },
      {
        type: "image",
        src: "/assets/images/misc/uber-card/uber4.png",
        alt: "Uber ride discount promotion",
      },
    ],
  },
  {
    brand: "IFAW",
    logoSrc: "/assets/images/misc/iffaw-card/ifaw-white-logo.png",
    logoWidth: 147,
    logoHeight: 77,
    tagline:
      "A global non-profit organization that protects animals and their habitats from threats.",
    role: "We partner with IFAW Africa to create digital media resources. We also do social listening and make fresh digital plans for their social networks.",
    impact:
      "Our digital media campaign has helped IFAW scale its online presence, reach new audiences, and raise awareness about its work in Africa and beyond.",
    className: "bg-[#3a5f8a]",
    bgImage: "/assets/images/misc/iffaw-card/Background.png",
    media: [
      {
        type: "image",
        src: "/assets/images/misc/iffaw-card/ifaw-1.png",
        alt: "The future of the African elephant relies on you",
      },
      {
        type: "image",
        src: "/assets/images/misc/iffaw-card/ifaw-donate.png",
        alt: "Elephant population decreases by 8% every year",
      },
      {
        type: "image",
        src: "/assets/images/misc/iffaw-card/ifaw-kudus.png",
        alt: "79% increase in elephants, 212% increase in warthogs, 25% more kudus",
        fullRow: true,
      },
    ],
  },
  {
    brand: "Zenka",
    logoSrc: "/assets/images/misc/zenka-card/zenka-logo.png",
    logoWidth: 246,
    logoHeight: 78,
    tagline: "One of Kenya's biggest mobile lenders.",
    role: "We collaborate with Zenka to create digital media content and designs that showcase their financial solutions. Our campaigns include copywriting, design, video & animation, and more.",
    impact:
      "We've assisted Zenka in increasing its online presence, penetrating new markets, attracting more users, generating more revenue and profit, and ultimately maintaining its vision of providing financial inclusion to hordes of Kenyans.",
    className: "bg-[#5c1c52]",
    logoClassName: "w-56",
    media: [
      {
        type: "image",
        src: "/assets/images/misc/zenka-card/pata-na.png",
        alt: "Pata na 5 mins! Flexible loans with 61 repayment days",
        fullRow: true,
        aspectClassName: "aspect-[5/2]",
      },
      {
        type: "image",
        src: "/assets/images/misc/zenka-card/zenka-2.png",
        alt: "Don't miss out on promotions, update your app",
        fullRow: true,
      },
    ],
  },
  {
    brand: "UK Government Development Agencies",
    logoSrc: "/assets/images/clients/ukaid.png",
    logoWidth: 300,
    logoHeight: 300,
    logoClassName: "w-28 brightness-0 invert",
    tagline:
      "UK Government Development Agencies",
    role: "Growthpad has collaborated with the UK government & UK Aid in Kenya on various projects like the Kenya Innovation Week 2022 and the Gender Equality and Social Inclusion Events.\n\nWe provided end-to-end support in event planning and management, branding, web design, digital ads, social media content, and more.",
    impact:
      "With our support, the UK Government and UK Aid left a lasting legacy through the events. Our clients were able to drive conversations and influence key stakeholders to nurture the innovation and equality ecosystems in Kenya.",
    className: "bg-[#123a45]",
    media: [
      {
        type: "image",
        src: "/assets/images/misc/ukaid-card/kiw.png",
        alt: "Kenya Innovation Week 2022",
        rowSpan: true,
      },
      {
        type: "image",
        src: "/assets/images/misc/ukaid-card/ukaid2.png",
        alt: "Come meet innovators from UKIW and UK Government",
      },
      {
        type: "image",
        src: "/assets/images/misc/ukaid-card/ukaid3.png",
        alt: "Come meet innovators from different sectors of the economy, Kenya Innovation Week 2022",
      },
    ],
  },
];
