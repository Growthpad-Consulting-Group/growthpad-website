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
  /** Detail-page "Outcome" section — result summary + proof photos (2 or more). */
  outcomeText?: string;
  outcomeImages?: { src: string; alt: string }[];
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
];
