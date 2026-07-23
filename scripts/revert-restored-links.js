/**
 * Revert all internal links added by restore-stripped-links.js
 *
 * Strips every markDef of type "link" whose href contains "growthpad.co.ke"
 * and removes the corresponding mark keys from all children spans.
 *
 * Usage:
 *   node scripts/revert-restored-links.js          # live revert
 *   node scripts/revert-restored-links.js --dry-run # preview only
 */

const fs = require("fs");
const path = require("path");
const { createClient } = require("@sanity/client");

const DRY_RUN = process.argv.includes("--dry-run");

// Load .env.local
const envPath = path.join(__dirname, "../.env.local");
if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, "utf-8")
    .split("\n")
    .forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) return;
      const eq = trimmed.indexOf("=");
      if (eq > 0) process.env[trimmed.slice(0, eq).trim()] = trimmed.slice(eq + 1).trim();
    });
}

const client = createClient({
  projectId: "ebeq7cmu",
  dataset: "production",
  token: process.env.SANITY_WRITE_TOKEN,
  apiVersion: "2024-01-01",
  useCdn: false,
});

function stripInternalLinks(blocks) {
  let stripped = 0;

  const newBlocks = blocks.map((block) => {
    if (block._type !== "block") return block;

    // Find all markDef keys that are internal growthpad links
    const internalKeys = new Set(
      (block.markDefs ?? [])
        .filter((d) => d._type === "link" && d.href?.includes("growthpad.co.ke"))
        .map((d) => d._key)
    );

    if (internalKeys.size === 0) return block;

    stripped += internalKeys.size;

    // Remove those markDefs
    const newMarkDefs = (block.markDefs ?? []).filter((d) => !internalKeys.has(d._key));

    // Remove those mark keys from all children
    const newChildren = (block.children ?? []).map((child) => ({
      ...child,
      marks: (child.marks ?? []).filter((m) => !internalKeys.has(m)),
    }));

    return { ...block, markDefs: newMarkDefs, children: newChildren };
  });

  return { blocks: newBlocks, stripped };
}

async function main() {
  console.log(`\n🔍 Fetching all blog posts from Sanity...`);

  const posts = await client.fetch(
    `*[_type == "blog"]{ _id, title, "slug": slug.current, content }`
  );

  console.log(`   Found ${posts.length} posts.\n`);

  let totalStripped = 0;

  for (const post of posts) {
    const { blocks: patchedContent, stripped } = stripInternalLinks(post.content ?? []);

    if (stripped === 0) continue;

    console.log(`📄 "${post.title}" — removing ${stripped} internal link(s)`);

    if (!DRY_RUN) {
      await client.patch(post._id).set({ content: patchedContent }).commit();
      console.log(`   ✅ Done`);
    }

    totalStripped += stripped;
  }

  console.log(`\n${"─".repeat(50)}`);
  console.log(`Total internal links removed: ${totalStripped}`);
  if (DRY_RUN) console.log(`\n⚠️  DRY RUN — no changes written to Sanity.`);
  console.log();
}

main().catch((err) => {
  console.error("Script failed:", err);
  process.exit(1);
});
