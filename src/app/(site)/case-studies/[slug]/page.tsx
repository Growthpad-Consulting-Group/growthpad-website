import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CaseStudyDetailHero from "@/features/case-studies/components/CaseStudyDetailHero";
import CaseStudyPuzzle from "@/features/case-studies/components/CaseStudyPuzzle";
import CaseStudyOutcome from "@/features/case-studies/components/CaseStudyOutcome";
import CaseStudyVideoFeature from "@/features/case-studies/components/CaseStudyVideoFeature";
import Clients from "@/features/home/components/Clients";
import { caseStudiesPreview } from "@/features/case-studies/data/caseStudiesPreview";
import ScrollColorTransition from "@/shared/components/ScrollColorTransition";
import { getCaseStudy, getCaseStudies } from "@/sanity/queries";
import { urlForImage } from "@/sanity/image";
import CaseStudyNextUpCard from "@/features/case-studies/components/CaseStudyNextUpCard";

async function getCaseStudyData(slug: string) {
  // 1. Try to fetch from Sanity
  const sanityStudy = await getCaseStudy(slug);

  if (sanityStudy) {
    // Resolve Cover / Hero Images
    let heroImageUrl = undefined;
    if (sanityStudy.heroImage) {
      heroImageUrl = urlForImage(sanityStudy.heroImage).width(1600).height(900).url();
    } else if (sanityStudy.coverImage) {
      heroImageUrl = urlForImage(sanityStudy.coverImage).width(1600).height(900).url();
    }

    // Resolve outcome images
    const outcomeImages = (sanityStudy.outcomeImages || []).map((img) => ({
      src: urlForImage(img.asset).width(800).height(800).url(),
      alt: img.alt || "",
    }));

    // Resolve video feature play button thumbnail and youtube ID
    let videoFeature = null;
    if (sanityStudy.videoFeature) {
      let youtubeId = null;
      if (sanityStudy.videoFeature.youtubeUrl) {
        const match = sanityStudy.videoFeature.youtubeUrl.match(
          /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i
        );
        youtubeId = match ? match[1] : null;
      }

      let videoThumbnailUrl = "";
      if (sanityStudy.videoFeature.thumbnail) {
        videoThumbnailUrl = urlForImage(sanityStudy.videoFeature.thumbnail).width(900).height(500).url();
      } else if (youtubeId) {
        videoThumbnailUrl = `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`;
      } else {
        videoThumbnailUrl = heroImageUrl || "";
      }

      if (youtubeId) {
        videoFeature = {
          title: sanityStudy.videoFeature.title || sanityStudy.brand,
          thumbnail: videoThumbnailUrl,
          youtubeId,
        };
      }
    }

    return {
      brand: sanityStudy.brand,
      slug: sanityStudy.slug,
      description: sanityStudy.description || "",
      heroTitle: sanityStudy.heroTitle || sanityStudy.description || "",
      heroImage: heroImageUrl,
      heroVideoUrl: sanityStudy.heroVideoUrl || sanityStudy.coverVideoUrl || null,
      problemText: sanityStudy.problemText,
      solutionText: sanityStudy.solutionText,
      outcomeText: sanityStudy.outcomeText,
      outcomeImages: outcomeImages.length >= 2 ? (outcomeImages as [{ src: string; alt: string }, { src: string; alt: string }]) : null,
      videoFeature,
    };
  }

  // 2. Fall back to static mock data
  const mockStudy = caseStudiesPreview.find((item) => item.slug === slug);
  if (mockStudy) {
    return {
      brand: mockStudy.brand,
      slug: mockStudy.slug,
      description: mockStudy.description,
      heroTitle: mockStudy.heroTitle ?? mockStudy.description,
      heroImage: mockStudy.heroImage ?? mockStudy.image,
      heroVideoUrl: null,
      problemText: mockStudy.problemText ?? null,
      solutionText: mockStudy.solutionText ?? null,
      outcomeText: mockStudy.outcomeText ?? null,
      outcomeImages: mockStudy.outcomeImages ?? null,
      videoFeature: mockStudy.videoFeature
        ? {
            title: mockStudy.videoFeature.title,
            thumbnail: mockStudy.videoFeature.thumbnail,
            youtubeId: mockStudy.videoFeature.youtubeId ?? null,
          }
        : null,
    };
  }

  return null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const caseStudy = await getCaseStudyData(slug);

  if (!caseStudy) {
    return {
      title: "Case Study Not Found | Growthpad",
    };
  }

  const title = `${caseStudy.brand} Case Study | Growthpad Consulting Group`;
  const description = caseStudy.description || caseStudy.heroTitle;
  const imageUrl = caseStudy.heroImage;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      images: imageUrl
        ? [
            {
              url: imageUrl,
              alt: caseStudy.brand,
            },
          ]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: imageUrl ? [imageUrl] : [],
    },
  };
}

export default async function CaseStudyDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const caseStudy = await getCaseStudyData(slug);

  if (!caseStudy) notFound();

  // Find next case study to suggest
  const allStudies = await getCaseStudies();
  
  // Resolve listing for suggestions
  const mappedSanity = (allStudies || []).map((item) => ({
    brand: item.brand,
    slug: item.slug,
    description: item.description || item.heroTitle || "",
    image: item.coverImage,
    heroImage: item.heroImage,
    videoUrl: item.coverVideoUrl || item.heroVideoUrl || null,
  }));

  const mappedStatic = caseStudiesPreview.map((item) => ({
    brand: item.brand,
    slug: item.slug,
    description: item.description,
    image: item.image,
    heroImage: item.heroImage || null,
    videoUrl: null,
  }));

  const sanitySlugs = new Set(mappedSanity.map((item) => item.slug));
  const mergedList = [
    ...mappedSanity,
    ...mappedStatic.filter((item) => !sanitySlugs.has(item.slug)),
  ];

  const currentIndex = mergedList.findIndex((item) => item.slug === slug);
  const nextStudy = currentIndex !== -1 ? mergedList[(currentIndex + 1) % mergedList.length] : mergedList[0];

  return (
    <div className="flex flex-1 flex-col">
      <ScrollColorTransition />
      <CaseStudyDetailHero
        title={caseStudy.heroTitle}
        brand={caseStudy.brand}
        image={caseStudy.heroImage}
        imageAlt={caseStudy.brand}
        videoUrl={caseStudy.heroVideoUrl}
      />

      {caseStudy.problemText && caseStudy.solutionText && (
        <CaseStudyPuzzle
          problemText={caseStudy.problemText}
          solutionText={caseStudy.solutionText}
        />
      )}

      {caseStudy.outcomeText && caseStudy.outcomeImages && (
        <CaseStudyOutcome
          description={caseStudy.outcomeText}
          images={caseStudy.outcomeImages}
        />
      )}

      {caseStudy.videoFeature && (
        <CaseStudyVideoFeature
          title={caseStudy.videoFeature.title}
          thumbnail={caseStudy.videoFeature.thumbnail}
          youtubeId={caseStudy.videoFeature.youtubeId || undefined}
        />
      )}

      <Clients />
      <CaseStudyNextUpCard nextStudy={nextStudy} />
    </div>
  );
}
