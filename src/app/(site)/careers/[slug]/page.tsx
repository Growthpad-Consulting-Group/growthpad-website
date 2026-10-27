import type { Metadata } from "next";
import Script from "next/script";
import { notFound } from "next/navigation";
import { Icon } from "@iconify/react";
import Breadcrumb from "@/shared/components/Breadcrumb";
import CareerFormCard from "@/features/careers/components/CareerFormCard";
import { getKaziJob } from "@/features/careers/lib/kazi-jobs";

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function paragraphs(text: string | null) {
  if (!text) return [];
  return text
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const job = await getKaziJob(slug);

  if (!job) {
    return {
      title: "Job Opening Not Found | Growthpad",
    };
  }

  const title = `${job.title} | Careers | Growthpad Consulting Group`;
  const description = `Join Growthpad as a ${job.title}${job.location ? ` in ${job.location}` : ""}.${job.department ? ` Department: ${job.department}.` : ""}`;

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
          alt: job.title,
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
  const job = await getKaziJob(slug);

  if (!job) notFound();

  const metaFields = [
    { label: "Location", value: job.location },
    { label: "Department", value: job.department },
  ].filter((field): field is { label: string; value: string } => Boolean(field.value));

  const descriptionParagraphs = paragraphs(job.description);
  const { must_haves, nice_to_haves } = job.requirements;

  const jobPostingSchema = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: job.description ?? `${job.title} at Growthpad Consulting Group.`,
    datePosted: job.published_at ?? undefined,
    validThrough: job.closes_at ?? undefined,
    employmentType: "FULL_TIME",
    hiringOrganization: {
      "@type": "Organization",
      name: "Growthpad Consulting Group",
      sameAs: "https://growthpad.africa",
      logo: "https://growthpad.africa/assets/images/gcg_logo_primary.png",
    },
    ...(job.location && {
      jobLocation: {
        "@type": "Place",
        address: {
          "@type": "PostalAddress",
          addressLocality: job.location,
          addressCountry: "KE",
        },
      },
    }),
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
                { label: job.title },
              ]}
            />
          </div>

          <div className="flex flex-col gap-4">
            <h1 className="font-display text-4xl font-bold text-white sm:text-6xl">
              {job.title}
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
          {job.closes_at && (
            <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-white/50">
              <span>Deadline: {formatDate(job.closes_at)}</span>
            </div>
          )}

          {descriptionParagraphs.length > 0 && (
            <div className="mt-8 max-h-[60vh] overflow-y-auto pr-2 scrollbar-thin">
              {descriptionParagraphs.map((paragraph, index) => (
                <p key={index} className="mt-4 mb-4 text-base leading-8 text-white/70 first:mt-0">
                  {paragraph}
                </p>
              ))}
            </div>
          )}

          {must_haves.length > 0 && (
            <div className="mt-12 border-t border-white/10 pt-8">
              <h3 className="font-display text-xl font-bold text-white">Job Requirements</h3>
              <ul className="mt-4 mb-4 space-y-3">
                {must_haves.map((item) => (
                  <li key={item} className="flex gap-3 text-base leading-7 text-white/70">
                    <Icon icon="solar:alt-arrow-right-broken" className="text-primary mt-1 h-[18px] w-[18px] shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {nice_to_haves.length > 0 && (
            <div className="mt-12 border-t border-white/10 pt-8">
              <h3 className="font-display text-xl font-bold text-white">Nice to Have</h3>
              <ul className="mt-4 mb-4 space-y-3">
                {nice_to_haves.map((item) => (
                  <li key={item} className="flex gap-3 text-base leading-7 text-white/70">
                    <Icon icon="solar:alt-arrow-right-broken" className="text-primary mt-1 h-[18px] w-[18px] shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-12 border-t border-white/10 pt-10">
            <h3 className="font-display mb-6 text-xl font-bold text-white">Apply now</h3>
            <CareerFormCard
              jobId={job.id}
              jobTitle={job.title}
              bordered
              className="border border-white/10"
            />
          </div>
        </div>
      </div>
      </div>
    </>
  );
}
