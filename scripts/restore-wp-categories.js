/**
 * Restore original WordPress categories to Sanity blog posts.
 *
 * Fetches all WP posts with their real category assignments via the WP REST API,
 * maps them to clean category names, and patches Sanity documents.
 *
 * Usage:
 *   node scripts/restore-wp-categories.js          # live run
 *   node scripts/restore-wp-categories.js --dry-run
 */

const fs = require("fs");
const path = require("path");
const { createClient } = require("@sanity/client");

const DRY_RUN = process.argv.includes("--dry-run");

const envPath = path.join(__dirname, "../.env.local");
if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, "utf-8").split("\n").forEach((line) => {
    const t = line.trim();
    if (!t || t.startsWith("#")) return;
    const eq = t.indexOf("=");
    if (eq > 0) process.env[t.slice(0, eq).trim()] = t.slice(eq + 1).trim();
  });
}

const client = createClient({
  projectId: "ebeq7cmu",
  dataset: "production",
  token: process.env.SANITY_WRITE_TOKEN,
  apiVersion: "2024-01-01",
  useCdn: false,
});

const WP_API = "https://www.growthpad.co.ke/wp-json/wp/v2";

// Map WP category slugs → clean Sanity category name
// When a post has multiple categories, first match wins (order = priority)
const CAT_MAP = [
  { wpSlugs: ["call-center", "contact-center"],           sanity: "BPO & Call Centre" },
  { wpSlugs: ["elearning"],                               sanity: "Training & LMS" },
  { wpSlugs: ["videos", "video-marketing-strategy"],      sanity: "Video & Animation" },
  { wpSlugs: ["event-management", "exhibition-booths", "exhibition-stands"], sanity: "Events" },
  { wpSlugs: ["software-development"],                    sanity: "Web & Software" },
  { wpSlugs: ["ecommerce"],                               sanity: "Web & Software" },
  { wpSlugs: ["branding", "brand-strategy", "graphics-design", "pr-agencies-kenya"], sanity: "Branding & Design" },
  { wpSlugs: ["human-resources"],                         sanity: "HR & Operations" },
  { wpSlugs: ["influencer-marketing"],                    sanity: "Digital Marketing" },
  { wpSlugs: ["seo", "social-media-marketing", "digital-marketing", "market-research", "marketing-strategy", "communication"], sanity: "Digital Marketing" },
];

// Posts whose slugs were fixed after migration — map manually
const SLUG_OVERRIDES = {
  "social-media-marketing-campaign-kenyan-businesses": "Digital Marketing",
  "business-video-ideas-skyrocket-business-online":    "Video & Animation",
  "grow-brand-visibility-social-media-using-videos":   "Video & Animation",
  "ecommerce-social-commerce-growth-kenya":            "Web & Software",
  "best-digital-marketing-agencies-kenya":             "Digital Marketing",
  "top-influencer-marketing-companies-kenya":          "Digital Marketing",
  "best-social-media-marketing-agencies-kenya":        "Digital Marketing",
};

function mapCategory(wpCatSlugs) {
  for (const rule of CAT_MAP) {
    if (wpCatSlugs.some((s) => rule.wpSlugs.includes(s))) return rule.sanity;
  }
  return "Strategy";
}

async function fetchAllWpPosts() {
  const all = [];
  let page = 1;
  while (true) {
    const res = await fetch(`${WP_API}/posts?_embed&per_page=100&page=${page}`);
    if (!res.ok) break;
    const posts = await res.json();
    if (!posts.length) break;
    all.push(...posts);
    if (posts.length < 100) break;
    page++;
  }
  return all;
}

async function main() {
  console.log(`\n📡 Fetching posts from WordPress API...`);
  const wpPosts = await fetchAllWpPosts();
  console.log(`   Found ${wpPosts.length} WP posts.\n`);

  // Build slug → category map from WP
  const wpSlugToCategory = {};
  for (const post of wpPosts) {
    const catSlugs = (post._embedded?.["wp:term"]?.[0] || []).map((c) => c.slug);
    wpSlugToCategory[post.slug] = mapCategory(catSlugs);
  }

  console.log(`🔍 Fetching Sanity posts...`);
  const sanityPosts = await client.fetch(
    `*[_type == "blog"]{ _id, title, "slug": slug.current, category }`
  );
  console.log(`   Found ${sanityPosts.length} Sanity posts.\n`);

  const tally = {};
  let updated = 0;
  let notFound = 0;

  for (const post of sanityPosts) {
    const newCategory = SLUG_OVERRIDES[post.slug] ?? wpSlugToCategory[post.slug];

    if (!newCategory) {
      console.log(`⚠️  No WP match for slug: ${post.slug}`);
      notFound++;
      continue;
    }

    tally[newCategory] = (tally[newCategory] || 0) + 1;

    if (newCategory === post.category) continue;

    console.log(`📄 "${post.title}"`);
    console.log(`   ${post.category} → ${newCategory}`);

    if (!DRY_RUN) {
      await client.patch(post._id).set({ category: newCategory }).commit();
    }
    updated++;
  }

  console.log(`\n${"─".repeat(50)}`);
  console.log(`Posts updated  : ${updated}`);
  console.log(`No WP match    : ${notFound}`);
  console.log(`\nCategory breakdown:`);
  Object.entries(tally).sort((a, b) => b[1] - a[1]).forEach(([cat, count]) => {
    console.log(`  ${cat.padEnd(25)} ${count}`);
  });
  if (DRY_RUN) console.log(`\n⚠️  DRY RUN — no changes written to Sanity.`);
  console.log();
}

main().catch((err) => {
  console.error("Script failed:", err);
  process.exit(1);
});
