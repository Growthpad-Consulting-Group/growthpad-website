/**
 * Applies seoTitle/seoDescription patches to blog documents in Sanity.
 *
 * Usage:
 *   node scripts/apply-blog-seo.js path/to/seo-batch.json
 *
 * Input file shape: an array of { slug, seoTitle, seoDescription }.
 * Requires SANITY_WRITE_TOKEN (reads from .env.local if present).
 */

const fs = require("fs");
const path = require("path");
const { createClient } = require("@sanity/client");

const envLocalPath = path.join(__dirname, "../.env.local");
if (fs.existsSync(envLocalPath)) {
  const envContent = fs.readFileSync(envLocalPath, "utf-8");
  envContent.split("\n").forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#")) {
      const eqIdx = trimmed.indexOf("=");
      if (eqIdx > 0) {
        const key = trimmed.slice(0, eqIdx).trim();
        const val = trimmed.slice(eqIdx + 1).trim();
        process.env[key] = val;
      }
    }
  });
}

const SANITY_PROJECT_ID = "ebeq7cmu";
const SANITY_DATASET = "production";
const SANITY_TOKEN = process.env.SANITY_WRITE_TOKEN;

if (!SANITY_TOKEN) {
  console.error("Error: SANITY_WRITE_TOKEN is not set in process.env or .env.local.");
  process.exit(1);
}

const inputPath = process.argv[2];
if (!inputPath) {
  console.error("Usage: node scripts/apply-blog-seo.js path/to/seo-batch.json");
  process.exit(1);
}

const client = createClient({
  projectId: SANITY_PROJECT_ID,
  dataset: SANITY_DATASET,
  token: SANITY_TOKEN,
  apiVersion: "2024-01-01",
  useCdn: false,
});

async function main() {
  const batch = JSON.parse(fs.readFileSync(inputPath, "utf-8"));
  console.log(`Applying SEO fields to ${batch.length} posts...`);

  let updated = 0;
  for (const entry of batch) {
    const { slug, seoTitle, seoDescription } = entry;
    if (!slug || !seoTitle || !seoDescription) {
      console.warn(`Skipping incomplete entry: ${JSON.stringify(entry)}`);
      continue;
    }

    const doc = await client.fetch(`*[_type == "blog" && slug.current == $slug][0]{_id}`, {
      slug,
    });
    if (!doc) {
      console.warn(`No blog doc found for slug "${slug}", skipping.`);
      continue;
    }

    await client.patch(doc._id).set({ seoTitle, seoDescription }).commit();
    console.log(`Updated "${slug}"`);
    updated++;
  }

  console.log(`\nDone. Updated ${updated}/${batch.length} posts.`);
}

main().catch((err) => {
  console.error("Failed:", err);
  process.exit(1);
});
