import { NextRequest } from "next/server";
import { createClient } from "@sanity/client";

export const runtime = "edge";

const GROQ_API = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "llama-3.3-70b-versatile";

type PromptData = {
  title: string;
  keyword: string;
  excerpt: string;
  content: string;
  blogSlugs: string;
};

const PROMPTS: Record<string, (d: PromptData) => string> = {
  metaDescription: ({ title, keyword, excerpt }) =>
    `Write a compelling meta description for a blog post.
Title: "${title}"
Focus keyword: "${keyword}"
Excerpt: "${excerpt}"

Rules:
- Exactly 120–160 characters
- Include the focus keyword naturally
- Action-oriented, no clickbait
- No quotes around the output
- Output ONLY the meta description, nothing else`,

  seoTitle: ({ title, keyword }) =>
    `Suggest 3 SEO-optimised title variants for a blog post.
Original title: "${title}"
Focus keyword: "${keyword}"

Rules:
- Each title 30–60 characters
- Include the focus keyword in each
- Varied styles (question, list, how-to, etc.)
- Output ONLY the 3 titles, one per line, no numbering or bullets`,

  focusKeyword: ({ title, excerpt, content }) =>
    `Suggest the single best SEO focus keyword for this blog post.
Title: "${title}"
Excerpt: "${excerpt}"
Content snippet: "${content.slice(0, 800)}"

Rules:
- 2–4 words, specific and searchable
- Relevant to the Kenyan market where applicable
- Output ONLY the keyword phrase, nothing else`,

  internalLinks: ({ title, keyword, content, blogSlugs }) =>
    `You are an SEO specialist. Suggest 3–5 internal links from the Growthpad blog that would be relevant to link to from this post.

Current post title: "${title}"
Focus keyword: "${keyword}"
Content snippet: "${content.slice(0, 1000)}"

Available blog posts (title | slug):
${blogSlugs}

Rules:
- Only suggest posts from the list above
- Pick posts that are topically related and would add value for the reader
- Format each suggestion EXACTLY as: [Post Title](https://www.growthpad.co.ke/blog/CATEGORY_SLUG/POST_SLUG)
- You must infer the category from the slug list provided (format is category/slug)
- One suggestion per line, no extra commentary`,

  externalLinks: ({ title, keyword, content }) =>
    `You are an SEO specialist. Suggest 3–5 authoritative external sources to cite or link to from this blog post.

Post title: "${title}"
Focus keyword: "${keyword}"
Content snippet: "${content.slice(0, 1000)}"

Rules:
- Only suggest real, well-known authoritative domains (gov sites, industry bodies, major publications, research orgs)
- Relevant to the Kenyan or African market where applicable
- Format each suggestion EXACTLY as: [Anchor text describing the source](https://example.com/relevant-page)
- One suggestion per line, no extra commentary`,
};

async function fetchBlogSlugs(): Promise<string> {
  try {
    const sanity = createClient({
      projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
      dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
      apiVersion: "2024-01-01",
      useCdn: true,
    });
    const posts = await sanity.fetch<{ title: string; slug: string; categorySlug: string }[]>(
      `*[_type == "blog"]{ title, "slug": slug.current, "categorySlug": category->slug.current }`
    );
    return posts.map((p) => `${p.title} | ${p.categorySlug}/${p.slug}`).join("\n");
  } catch {
    return "";
  }
}

export async function POST(req: NextRequest) {
  const { field, title = "", keyword = "", excerpt = "", content = "" } = await req.json();

  const promptFn = PROMPTS[field];
  if (!promptFn) return new Response("Unknown field", { status: 400 });

  const blogSlugs = field === "internalLinks" ? await fetchBlogSlugs() : "";
  const prompt = promptFn({ title, keyword, excerpt, content, blogSlugs });

  const groqRes = await fetch(GROQ_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [{ role: "user", content: prompt }],
      stream: true,
      max_tokens: 400,
      temperature: 0.7,
    }),
  });

  if (!groqRes.ok) {
    const err = await groqRes.text();
    return new Response(err, { status: groqRes.status });
  }

  return new Response(groqRes.body, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
    },
  });
}
