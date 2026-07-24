/**
 * Apply real Rank Math SEO data from WP CSV export to Sanity blog posts.
 *
 * Matches posts by slug (with fallback for slugs that were renamed),
 * and updates seoTitle, seoDescription, seoKeywords where WP data exists.
 *
 * Usage:
 *   node scripts/apply-rankmath-seo.js          # live run
 *   node scripts/apply-rankmath-seo.js --dry-run
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

// Slugs that were renamed after migration — old WP slug → new Sanity slug
const SLUG_REMAP = {
  "digital":                  "social-media-marketing-campaign-kenyan-businesses",
  "social":                   "best-social-media-marketing-agencies-kenya",
  "video-content-marketing":  "business-video-ideas-skyrocket-business-online",
  "video-marketing":          "grow-brand-visibility-social-media-using-videos",
  "ecommerce-in-kenya":       "ecommerce-social-commerce-growth-kenya",
  "agencies-in-kenya":        "best-digital-marketing-agencies-kenya",
  "influencer-marketing-kenya": "top-influencer-marketing-companies-kenya",
};

// Clean Rank Math title templates like "%sep%", "%title%", "%sitename%"
function cleanTitle(raw) {
  if (!raw) return null;
  return raw
    .replace(/%sep%/gi, "—")
    .replace(/%title%/gi, "")
    .replace(/%sitename%/gi, "Growthpad")
    .replace(/\s{2,}/g, " ")
    .trim()
    .replace(/\s*[—|]\s*$/, "") // trailing separator
    .trim();
}

function parseCSV(text) {
  const rows = [];
  let row = [], field = "", inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i], next = text[i + 1];
    if (inQuotes) {
      if (ch === '"' && next === '"') { field += '"'; i++; }
      else if (ch === '"') inQuotes = false;
      else field += ch;
    } else {
      if (ch === '"') inQuotes = true;
      else if (ch === ",") { row.push(field); field = ""; }
      else if (ch === "\n") { row.push(field); rows.push(row); row = []; field = ""; }
      else if (ch !== "\r") field += ch;
    }
  }
  if (field || row.length) { row.push(field); rows.push(row); }
  return rows;
}

async function main() {
  const csvPath = path.join(__dirname, "wordpress export data/Posts-Export-2026-July-24-1320.csv");
  const content = fs.readFileSync(csvPath, "utf-8");
  const rows = parseCSV(content);
  const headers = rows[0].map((h) => h.trim());

  const focusIdx = headers.indexOf("rank_math_focus_keyword");
  const descIdx  = headers.indexOf("rank_math_description");
  const titleIdx = headers.indexOf("rank_math_title");
  const slugIdx  = headers.indexOf("Slug");

  // Build map: sanity slug → { seoTitle, seoDescription, seoKeywords }
  const wpData = {};
  for (let i = 1; i < rows.length; i++) {
    const r = rows[i];
    const wpSlug   = r[slugIdx]?.trim();
    const focus    = r[focusIdx]?.trim();
    const desc     = r[descIdx]?.trim();
    const rmTitle  = cleanTitle(r[titleIdx]?.trim());

    if (!wpSlug) continue;

    const sanitySlug = SLUG_REMAP[wpSlug] ?? wpSlug;

    wpData[sanitySlug] = {
      seoTitle:       rmTitle || null,
      seoDescription: desc || null,
      seoKeywords:    focus ? focus.split(",").map((k) => k.trim()).filter(Boolean) : [],
    };
  }

  console.log(`\n🔍 Fetching Sanity posts...`);
  const posts = await client.fetch(
    `*[_type == "blog"]{ _id, title, "slug": slug.current, seoTitle, seoDescription, seoKeywords }`
  );
  console.log(`   Found ${posts.length} posts.\n`);

  let updated = 0, skipped = 0, noMatch = 0;

  for (const post of posts) {
    const wp = wpData[post.slug];

    if (!wp) {
      console.log(`⚠️  No WP data for: ${post.slug}`);
      noMatch++;
      continue;
    }

    // Only update fields where WP has real data
    const patch = {};
    if (wp.seoTitle)                    patch.seoTitle = wp.seoTitle;
    if (wp.seoDescription)              patch.seoDescription = wp.seoDescription;
    if (wp.seoKeywords?.length)         patch.seoKeywords = wp.seoKeywords;
    if (wp.seoKeywords?.length)         patch.focusKeyword = wp.seoKeywords[0];

    if (Object.keys(patch).length === 0) {
      skipped++;
      continue;
    }

    console.log(`📄 "${post.title}"`);
    if (patch.seoTitle)       console.log(`   title: ${patch.seoTitle}`);
    if (patch.seoDescription) console.log(`   desc:  ${patch.seoDescription.slice(0, 80)}...`);
    if (patch.seoKeywords)    console.log(`   kws:   ${patch.seoKeywords.join(", ")}`);

    if (!DRY_RUN) {
      await client.patch(post._id).set(patch).commit();
      console.log(`   ✅ Saved`);
    }

    updated++;
  }

  console.log(`\n${"─".repeat(50)}`);
  console.log(`Posts updated  : ${updated}`);
  console.log(`No WP data     : ${skipped}`);
  console.log(`No WP match    : ${noMatch}`);
  if (DRY_RUN) console.log(`\n⚠️  DRY RUN — no changes written to Sanity.`);
  console.log();
}

main().catch((err) => {
  console.error("Script failed:", err);
  process.exit(1);
});
