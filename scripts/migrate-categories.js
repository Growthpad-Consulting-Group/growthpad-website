/**
 * Migrate blog category from string → reference to category document.
 *
 * 1. Creates a category document for each unique category string
 * 2. Patches every blog post to replace category string with a reference
 *
 * Usage:
 *   node scripts/migrate-categories.js          # live run
 *   node scripts/migrate-categories.js --dry-run
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

function toSlug(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

async function main() {
  console.log(`\n🔍 Fetching all blog posts...`);
  const posts = await client.fetch(
    `*[_type == "blog"]{ _id, title, category }`
  );
  console.log(`   Found ${posts.length} posts.\n`);

  // Collect unique category strings
  const uniqueCategories = [...new Set(posts.map((p) => p.category).filter(Boolean))].sort();
  console.log(`📂 Unique categories found: ${uniqueCategories.join(", ")}\n`);

  if (DRY_RUN) {
    console.log("Would create these category documents:");
    uniqueCategories.forEach((cat) => console.log(`  - ${cat} (slug: ${toSlug(cat)})`));
    console.log(`\nWould patch ${posts.length} posts to use references.`);
    console.log(`\n⚠️  DRY RUN — no changes written to Sanity.\n`);
    return;
  }

  // Create category documents
  const categoryIdMap = {};
  for (const title of uniqueCategories) {
    const slug = toSlug(title);
    const docId = `category-${slug}`;

    await client.createOrReplace({
      _id: docId,
      _type: "category",
      title,
      slug: { _type: "slug", current: slug },
    });

    categoryIdMap[title] = docId;
    console.log(`✅ Category created: "${title}" (${docId})`);
  }

  console.log(`\n🔗 Patching blog posts...\n`);

  // Patch each post to use a reference
  for (const post of posts) {
    const catId = categoryIdMap[post.category];
    if (!catId) {
      console.log(`⚠️  No category doc for "${post.title}" (category: ${post.category})`);
      continue;
    }

    await client.patch(post._id).set({
      category: { _type: "reference", _ref: catId },
    }).commit();
  }

  console.log(`✅ All ${posts.length} posts patched.\n`);
  console.log(`${"─".repeat(50)}`);
  console.log(`Categories created : ${uniqueCategories.length}`);
  console.log(`Posts migrated     : ${posts.length}\n`);
}

main().catch((err) => {
  console.error("Script failed:", err);
  process.exit(1);
});
