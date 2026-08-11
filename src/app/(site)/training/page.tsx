import type { Metadata } from "next";
import TrainingHero from "@/features/training/components/TrainingHero";
import TrainingBenefits from "@/features/training/components/TrainingBenefits";
import TrainingWhyLearn from "@/features/training/components/TrainingWhyLearn";
import DiagonalSteps from "@/shared/components/DiagonalSteps";
import ContactForm from "@/shared/components/ContactForm";
import ScrollColorTransition from "@/shared/components/ScrollColorTransition";
import SectionAnimate from "@/shared/components/SectionAnimate";

export const metadata: Metadata = {
  title: "Training | Growthpad Consulting Group",
  description:
    "Many businesses face a skills shortfall due to today's rapid digital transformation. Through GDC Training, we enrich you and your teams with up-to-date essential digital skills.",
  keywords: [
    "digital skills training Kenya",
    "corporate training Nairobi",
    "digital marketing course Africa",
    "GDC training",
    "professional development Kenya",
    "upskilling teams Africa",
    "Growthpad training",
    "online learning Kenya",
  ],
  alternates: {
    canonical: "https://growthpad.co.ke/training",
  },
  openGraph: {
    title: "Training | Growthpad Consulting Group",
    description:
      "Many businesses face a skills shortfall due to today's rapid digital transformation. Through GDC Training, we enrich you and your teams with up-to-date essential digital skills.",
    url: "https://growthpad.co.ke/training",
    images: [
      {
        url: "/assets/images/seo/opengraph.png",
        alt: "Training",
      },
    ],
  },
  twitter: {
    title: "Training | Growthpad Consulting Group",
    description:
      "Many businesses face a skills shortfall due to today's rapid digital transformation. Through GDC Training, we enrich you and your teams with up-to-date essential digital skills.",
    images: ["/assets/images/seo/opengraph.png"],
  },
};

const trainingSteps = [
  {
    title: "Up-to-date\ncurriculum",
    body: "We stay on top of the latest industry trends and best practices, constantly updating our curriculum to equip you with the best skills to succeed in the modern business landscape.",
  },
  {
    title: "Accessible &\nTailored",
    body: "Our courses are designed to be personalized and applicable, regardless of your prior knowledge or industry background.",
  },
  {
    title: "End-to-end\nsupport",
    body: "You and your teams will learn from seasoned experts, get support and feedback, and earn a certificate of completion.",
  },
];

export default function TrainingPage() {
  return (
    <div className="flex flex-1 flex-col">
      <ScrollColorTransition />
      <TrainingHero />
      <SectionAnimate variant="fade-up">
        <TrainingBenefits />
      </SectionAnimate>
      <TrainingWhyLearn />
      <DiagonalSteps
        heading="How Does it Work?"
        steps={trainingSteps}
        theme="light"
      />
      <SectionAnimate variant="fade-up">
        <ContactForm
          theme="cream"
          variant="wide-form"
          showLogos={false}
          heading="Start Your Learning Journey"
        />
      </SectionAnimate>
    </div>
  );
}
