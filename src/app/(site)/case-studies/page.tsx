import type { Metadata } from "next";
import CaseStudiesHero from "@/features/case-studies/components/CaseStudiesHero";
import CaseStudiesGrid from "@/features/case-studies/components/CaseStudiesGrid";
import ScrollColorTransition from "@/shared/components/ScrollColorTransition";
import { getCaseStudies } from "@/sanity/queries";

export const metadata: Metadata = {
  title: "Trusted By Industry Leaders: Growthpad's Client Roster",
  description: "Join the ranks of industry leaders like IFAW, Uber, UK Aid, Asus, and more who trust Growthpad. Explore our diverse client portfolio",
  keywords: [
    "Growthpad case studies",
    "digital consulting portfolio Kenya",
    "client success stories Africa",
    "IFAW digital campaign",
    "Uber Kenya marketing",
    "NGO communication consulting",
    "brand campaign results",
    "Growthpad clients",
  ],
  alternates: {
    canonical: "https://www.growthpad.co.ke/case-studies",
  },
  openGraph: {
    title: "Trusted By Industry Leaders: Growthpad's Client Roster",
    description: "Join the ranks of industry leaders like IFAW, Uber, UK Aid, Asus, and more who trust Growthpad. Explore our diverse client portfolio",
    url: "https://www.growthpad.co.ke/case-studies",
    images: [
      {
        url: "/assets/images/case_study_template_hero.png",
        alt: "industry leaders",
      },
    ],
  },
  twitter: {
    title: "Trusted By Industry Leaders: Growthpad's Client Roster",
    description: "Join the ranks of industry leaders like IFAW, Uber, UK Aid, Asus, and more who trust Growthpad. Explore our diverse client portfolio",
    images: ["/assets/images/case_study_template_hero.png"],
  },
};

export default async function CaseStudiesPage() {
  const caseStudies = await getCaseStudies();

  return (
    <div className="flex flex-1 flex-col">
      <ScrollColorTransition />
      <CaseStudiesHero />
      <CaseStudiesGrid initialItems={caseStudies} />
    </div>
  );
}
