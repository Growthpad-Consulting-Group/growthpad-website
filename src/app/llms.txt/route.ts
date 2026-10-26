import { getBlogs, getJobOpenings, getCaseStudies } from "@/sanity/queries";
import { SITE_URL } from "@/shared/lib/site";

// Follows the llms.txt proposal (https://llmstxt.org): a markdown index of the
// site for language models. Dynamic sections reuse the tagged Sanity fetches,
// so the Sanity revalidate webhook keeps this file fresh too.

const PAGES: { path: string; title: string; description: string }[] = [
  {
    path: "",
    title: "Home",
    description:
      "Overview of Growthpad, a technology, digital media and communication consulting firm based in Nairobi, Kenya.",
  },
  {
    path: "our-dna",
    title: "Our DNA",
    description: "Growthpad's story, heritage, core values, purpose and why clients choose us.",
  },
  {
    path: "services",
    title: "Services",
    description:
      "Our digital services, from Communication for Development to IT Project Management.",
  },
  {
    path: "practice-areas",
    title: "Practice Areas",
    description:
      "Specialized practice areas in communication, digital delivery, learning systems and research.",
  },
  {
    path: "products",
    title: "Products",
    description:
      "Digital products for African businesses, including data intelligence, content management and audience engagement tools.",
  },
  {
    path: "training",
    title: "Training",
    description: "GDC Training programmes that equip teams with up-to-date digital skills.",
  },
  {
    path: "case-studies",
    title: "Case Studies",
    description: "Client work for organizations such as IFAW, Uber, UK Aid and Asus.",
  },
  {
    path: "insights",
    title: "Insights",
    description:
      "Research reports, white papers and analysis on digital transformation, communication for development and business growth in Africa.",
  },
  {
    path: "blog",
    title: "Blog",
    description: "Articles on digital marketing, B2B strategy, corporate communications and technology in Africa.",
  },
  {
    path: "careers",
    title: "Careers",
    description: "Working at Growthpad: culture, benefits and open positions.",
  },
  {
    path: "tenders",
    title: "Tenders",
    description: "Active procurement opportunities and supplier registration.",
  },
  {
    path: "for-partners",
    title: "For Partners",
    description: "Growthpad's Partner Program for referring clients to our professional services.",
  },
  {
    path: "contact",
    title: "Contact",
    description: "Get in touch about a project, RFPs, proposals or quotations.",
  },
];

function url(path: string) {
  return path ? `${SITE_URL}/${path}` : SITE_URL;
}

// Keep each entry on one line so the markdown list stays valid.
function oneLine(value: string | null | undefined) {
  return (value ?? "").replace(/\s+/g, " ").trim();
}

function link(title: string, href: string, description?: string | null) {
  const notes = oneLine(description);
  return `- [${oneLine(title)}](${href})${notes ? `: ${notes}` : ""}`;
}

export async function GET() {
  const [blogs, jobs, caseStudies] = await Promise.all([
    getBlogs(),
    getJobOpenings(),
    getCaseStudies(),
  ]);

  const sections = [
    `# Growthpad Consulting Group

> Growthpad is a technology, digital media and communication consulting firm based in Nairobi, Kenya. We help businesses, development organizations and governments across Africa grow through digital strategy, communication for development, technology delivery, research and training.`,
    `## Pages

${PAGES.map((page) => link(page.title, url(page.path), page.description)).join("\n")}`,
  ];

  if (caseStudies?.length) {
    sections.push(`## Case Studies

${caseStudies
  .map((study) => link(study.brand, url(`case-studies/${study.slug}`), study.heroTitle ?? study.description))
  .join("\n")}`);
  }

  if (blogs.length) {
    sections.push(`## Blog Posts

${blogs
  .filter((post) => post.slug && post.categorySlug)
  .map((post) => link(post.title, url(`blog/${post.categorySlug}/${post.slug}`), post.excerpt))
  .join("\n")}`);
  }

  if (jobs.length) {
    sections.push(`## Open Positions

${jobs
  .map((job) =>
    link(
      job.title,
      url(`careers/${job.slug}`),
      [job.department, job.employmentType, job.workMode, job.city].filter(Boolean).join(", "),
    ),
  )
  .join("\n")}`);
  }

  sections.push(`## Optional

- [Privacy Policy](${url("privacy-policy")}): How Growthpad collects, uses and protects personal information.
- [Sitemap](${url("sitemap.xml")}): Full list of URLs on the site.
- [Blog RSS feed](${url("blog/rss.xml")}): Latest blog posts.`);

  return new Response(`${sections.join("\n\n")}\n`, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
    },
  });
}
