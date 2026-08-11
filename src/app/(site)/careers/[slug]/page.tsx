import type { Metadata } from "next";
import Script from "next/script";
import { notFound } from "next/navigation";
import { Icon } from "@iconify/react";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";
import Breadcrumb from "@/shared/components/Breadcrumb";
import CareerFormCard from "@/features/careers/components/CareerFormCard";
import { getJobOpening } from "@/sanity/queries";

const portableTextComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="mt-4 mb-4 text-base leading-8 text-white/70">{children}</p>
    ),
    h5: ({ children }) => (
      <h4 className="mt-6 mb-2 text-base font-semibold text-white first:mt-0">{children}</h4>
    ),
  },
  list: {
    bullet: ({ children }) => <ul className="mt-4 mb-4 space-y-3">{children}</ul>,
  },
  listItem: {
    bullet: ({ children }) => (
      <li className="flex gap-3 text-base leading-7 text-white/70">
        <Icon
          icon="solar:alt-arrow-right-broken"
          className="text-primary mt-1 h-[18px] w-[18px] shrink-0"
        />
        <span>{children}</span>
      </li>
    ),
  },
};

function formatDeadline(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function isHeadingBlock(block: PortableTextBlock) {
  return block._type === "block" && block.style === "h4";
}

function blockText(block: PortableTextBlock) {
  return block.children.map((child) => ("text" in child ? child.text : "")).join("");
}

function subheadingBlock(text: string, key: string): PortableTextBlock {
  return {
    _type: "block",
    _key: key,
    style: "h5",
    markDefs: [],
    children: [{ _type: "span", _key: `${key}-span`, text, marks: [] }],
  };
}

// Groups the flat description blocks into sections at each heading.
function groupIntoSections(blocks: PortableTextBlock[]) {
  const sections: { title: string; blocks: PortableTextBlock[] }[] = [];

  for (const block of blocks) {
    if (isHeadingBlock(block)) {
      sections.push({ title: blockText(block), blocks: [] });
    } else if (sections.length > 0) {
      sections[sections.length - 1].blocks.push(block);
    } else {
      sections.push({ title: "Overview", blocks: [block] });
    }
  }

  return sections;
}

// Extracted JDs can carry a lot of sections (competencies, KPIs, success measures,
// application requirements, etc.) — only the three most relevant to a candidate are
// shown here, matching sections merged into a single bucket under a fixed heading.
function buildRelevantSections(blocks: PortableTextBlock[]) {
  const about: PortableTextBlock[] = [];
  const responsibilities: PortableTextBlock[] = [];
  const requirements: PortableTextBlock[] = [];

  for (const section of groupIntoSections(blocks)) {
    const title = section.title.toLowerCase();
    if (/role purpose/.test(title)) {
      about.push(...section.blocks);
    } else if (/^\d+\./.test(section.title)) {
      responsibilities.push(
        subheadingBlock(section.title, `resp-${responsibilities.length}`),
        ...section.blocks,
      );
    } else if (/qualifications|preferred experience/.test(title)) {
      requirements.push(...section.blocks);
    }
  }

  return [
    { title: "About the Role", blocks: about },
    { title: "Key Responsibilities", blocks: responsibilities },
    { title: "Job Requirements", blocks: requirements },
  ].filter((section) => section.blocks.length > 0);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const opening = await getJobOpening(slug);

  if (!opening) {
    return {
      title: "Job Opening Not Found | Growthpad",
    };
  }

  const title = `${opening.title} | Careers | Growthpad Consulting Group`;
  const description = `Join Growthpad as a ${opening.title} in ${opening.city}. Department: ${opening.department}. Employment Type: ${opening.employmentType} (${opening.workMode}).`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      images: [
        {
          url: "/assets/images/specialties-bg.png",
          alt: opening.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/assets/images/specialties-bg.png"],
    },
  };
}

export default async function JobOpeningPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const opening = await getJobOpening(slug);

  if (!opening) notFound();

  const metaFields = [
    { label: "Location", value: opening.city },
    { label: "Type", value: `${opening.employmentType} · ${opening.workMode}` },
    { label: "Experience", value: opening.experience },
  ].filter((field): field is { label: string; value: string } => Boolean(field.value));

  const sections = opening.description ? buildRelevantSections(opening.description) : [];

  // Map Sanity employmentType to Google's accepted values
  const employmentTypeMap: Record<string, string> = {
    "Full-time": "FULL_TIME",
    "Part-time": "PART_TIME",
    "Contract": "CONTRACTOR",
    "Internship": "INTERN",
  };

  const jobPostingSchema = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: opening.title,
    description: `${opening.title} at Growthpad Consulting Group. Department: ${opening.department}. ${opening.experience ?? ""}`,
    datePosted: opening._createdAt,
    validThrough: opening.deadline,
    employmentType: employmentTypeMap[opening.employmentType] ?? "FULL_TIME",
    hiringOrganization: {
      "@type": "Organization",
      name: "Growthpad Consulting Group",
      sameAs: "https://growthpad.co.ke",
      logo: "https://growthpad.co.ke/assets/images/gcg_logo_primary.png",
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: opening.city,
        addressCountry: "KE",
      },
    },
    ...(opening.workMode === "Remote" && { jobLocationType: "TELECOMMUTE" }),
    directApply: true,
  };

  return (
    <>
      <Script
        id="job-posting-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jobPostingSchema) }}
      />
      <div data-theme-section="dark" className="flex flex-1 flex-col lg:flex-row">
      <aside className="bg-primary flex flex-col lg:sticky lg:top-0 lg:h-screen lg:w-2/5">
        <div className="relative flex flex-1 flex-col items-start justify-center gap-4 px-6 py-10 lg:px-14 lg:py-14">
          <div className="absolute top-10 lg:top-14">
            <Breadcrumb
              items={[
                { label: "Careers", href: "/careers" },
                { label: opening.title },
              ]}
            />
          </div>

          <div className="flex flex-col gap-4">
            <h1 className="font-display text-4xl font-bold text-white sm:text-6xl">
              {opening.title}
            </h1>

            {metaFields.length > 0 && (
              <dl className="flex flex-col gap-5 mt-2">
                {metaFields.map((field) => (
                  <div key={field.label} className="flex flex-col gap-1">
                    <dt className="text-sm font-bold underline text-white/80">
                      {field.label}
                    </dt>
                    <dd className="text-base leading-6 text-white/90">
                      {field.value}
                    </dd>
                  </div>
                ))}
              </dl>
            )}
          </div>
        </div>
      </aside>

      <div className="bg-secondary flex-1 px-6 py-16 lg:px-16 lg:py-20">
        <div className="max-w-2xl">
          <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-white/50">
            {opening.reportsTo && <span>Reports to: {opening.reportsTo}</span>}
            <span>Deadline: {formatDeadline(opening.deadline)}</span>
          </div>

          {sections.length > 0 && (
            <div className="mt-8 max-h-[60vh] overflow-y-auto pr-2 scrollbar-thin">
              {sections.map((section) => (
                <div
                  key={section.title}
                  className="mt-12 border-t border-white/10 pt-8 first:mt-0 first:border-t-0 first:pt-0"
                >
                  <h3 className="font-display text-xl font-bold text-white">{section.title}</h3>
                  <PortableText value={section.blocks} components={portableTextComponents} />
                </div>
              ))}
            </div>
          )}

          <div className="mt-12 border-t border-white/10 pt-10">
            <h3 className="font-display mb-6 text-xl font-bold text-white">Apply now</h3>
            <CareerFormCard
              jobTitle={opening.title}
              bordered
              className="border border-white/10"
            />
            {opening.applyUrl && (
              <p className="mt-6 text-md text-white/50">
                Prefer email? Reach us directly at{" "}
                <a href={opening.applyUrl} className="text-primary hover:underline">
                  {opening.applyUrl.replace(/^mailto:/, "")}
                </a>
              </p>
            )}
          </div>
        </div>
      </div>
      </div>
    </>
  );
}
