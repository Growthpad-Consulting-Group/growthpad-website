/**
 * For every blog post, if the largest image in its content body is bigger
 * (by pixel area) than the current coverImage, repoints coverImage to that
 * asset. No re-uploading — the image is already a Sanity asset referenced
 * in the post's content, this just swaps the reference on coverImage.
 *
 * Usage:
 *   node scripts/fix-blog-cover-images.js --dry-run
 *   node scripts/fix-blog-cover-images.js
 */

const fs = require("fs");
const path = require("path");
const { createClient } = require("@sanity/client");

const DRY_RUN = process.argv.includes("--dry-run");

const envLocalPath = path.join(__dirname, "../.env.local");
if (fs.existsSync(envLocalPath)) {
  const envContent = fs.readFileSync(envLocalPath, "utf-8");
  envContent.split("\n").forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#")) {
      const eqIdx = trimmed.indexOf("=");
      if (eqIdx > 0) {
        process.env[trimmed.slice(0, eqIdx).trim()] = trimmed.slice(eqIdx + 1).trim();
      }
    }
  });
}

const SANITY_TOKEN = process.env.SANITY_WRITE_TOKEN;
if (!DRY_RUN && !SANITY_TOKEN) {
  console.error("Error: SANITY_WRITE_TOKEN is not set.");
  process.exit(1);
}

const client = createClient({
  projectId: "ebeq7cmu",
  dataset: "production",
  apiVersion: "2024-01-01",
  token: SANITY_TOKEN,
  useCdn: false,
});

function dims(ref) {
  if (!ref) return null;
  const m = ref.match(/-(\d+)x(\d+)-/);
  return m ? [Number(m[1]), Number(m[2])] : null;
}

function area([w, h]) {
  return w * h;
}

async function main() {
  const posts = await client.fetch(`
    *[_type == "blog"]{
      _id,
      "slug": slug.current,
      "coverRef": coverImage.asset._ref,
      "contentRefs": content[_type == "image"].asset._ref
    }
  `);

  console.log(`Checking ${posts.length} posts [DRY RUN = ${DRY_RUN}]...\n`);

  let changed = 0;
  for (const post of posts) {
    const coverDims = dims(post.coverRef);
    const candidates = (post.contentRefs || [])
      .map((ref) => ({ ref, d: dims(ref) }))
      .filter((c) => c.d)
      .sort((a, b) => area(b.d) - area(a.d));

    const best = candidates[0];
    if (!best) continue;

    const shouldSwap = !coverDims || area(best.d) > area(coverDims);
    if (!shouldSwap) continue;

    console.log(
      `${post.slug}: ${post.coverRef ? `${coverDims[0]}x${coverDims[1]}` : "(none)"} -> ${best.d[0]}x${best.d[1]}`,
    );

    if (!DRY_RUN) {
      await client
        .patch(post._id)
        .set({
          coverImage: {
            _type: "image",
            asset: { _type: "reference", _ref: best.ref },
          },
        })
        .commit();
    }

    changed++;
  }

  console.log(`\n${DRY_RUN ? "Would update" : "Updated"} ${changed}/${posts.length} posts.`);
}

main().catch((err) => {
  console.error("Failed:", err);
  process.exit(1);
});
