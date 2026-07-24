/**
 * Re-categorise all blog posts with proper keyword-rich categories.
 *
 * Usage:
 *   node scripts/recategorise-blogs.js          # live run
 *   node scripts/recategorise-blogs.js --dry-run
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

// Rules checked in order — first match wins
const RULES = [
  {
    category: "BPO & Call Centre",
    keywords: [
      "call-center", "call-centre", "bpo", "outsourc", "customer-care",
      "customer-service", "customer-support", "contact-center", "contact-centre",
      "ivr", "workforce-optim", "average-handle-time", "sip-trunk",
      "cx-measurement", "cloud-contact", "customer-satisfaction",
      "healthcare-business-process", "telecom",
    ],
  },
  {
    category: "Video & Animation",
    keywords: [
      "video", "animation", "motion-design", "live-stream", "film",
      "documentary", "explainer", "3d-animation",
    ],
  },
  {
    category: "Web & Software",
    keywords: [
      "software-development", "mobile-app", "web-design", "web-hosting",
      "website-design", "website-development", "ecommerce", "landing-page",
      "web-services", "app-development", "human-centred-design",
    ],
  },
  {
    category: "Events",
    keywords: [
      "event", "audio-visual", "exhibition", "webinar", "agm",
      "photographer", "sound-compan", "interpretation", "translation",
      "live-stream",
    ],
  },
  {
    category: "Training & LMS",
    keywords: [
      "learning-management", "lms", "moodle", "training", "mela",
      "research-compan",
    ],
  },
  {
    category: "Branding & Design",
    keywords: [
      "branding", "brand-identity", "graphic-design", "design-agenc",
      "pr-agenc", "pr-compan", "communication-agenc", "corporate-identity",
      "rebrand", "printing",
    ],
  },
  {
    category: "Digital Marketing",
    keywords: [
      "digital-marketing", "seo", "social-media", "influencer",
      "online-advertising", "online-marketing", "email-marketing",
      "facebook", "tiktok", "linkedin", "b2b-contact", "lead-generation",
      "search-engine", "a-b-testing", "social-listening", "payroll",
      "hr-management",
    ],
  },
  {
    category: "Strategy",
    keywords: [], // catch-all
  },
];

function classify(slug, title) {
  const haystack = `${slug} ${title}`.toLowerCase();
  for (const rule of RULES) {
    if (rule.keywords.length === 0) return rule.category; // catch-all
    if (rule.keywords.some((kw) => haystack.includes(kw))) return rule.category;
  }
  return "Strategy";
}

async function main() {
  console.log(`\n🔍 Fetching all blog posts...`);
  const posts = await client.fetch(
    `*[_type == "blog"]{ _id, title, "slug": slug.current, category }`
  );
  console.log(`   Found ${posts.length} posts.\n`);

  const tally = {};
  let changed = 0;

  for (const post of posts) {
    const newCategory = classify(post.slug, post.title);
    tally[newCategory] = (tally[newCategory] || 0) + 1;

    if (newCategory === post.category) continue;

    console.log(`📄 "${post.title}"`);
    console.log(`   ${post.category} → ${newCategory}`);

    if (!DRY_RUN) {
      await client.patch(post._id).set({ category: newCategory }).commit();
    }
    changed++;
  }

  console.log(`\n${"─".repeat(50)}`);
  console.log(`Posts changed : ${changed}`);
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
