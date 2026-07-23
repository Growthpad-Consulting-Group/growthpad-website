/**
 * Fix Broken Links in Sanity Blog Posts
 *
 * Scans all blog post content for hyperlinks, checks each URL,
 * and for broken ones either:
 *   - Remaps to the matching /blog/<slug> URL if the slug exists in Sanity
 *   - Strips the link mark entirely (keeps the text, removes the dead href)
 *
 * Usage:
 *   node scripts/fix-broken-links.js          # live fix
 *   node scripts/fix-broken-links.js --dry-run # preview only, no writes
 */

const fs = require("fs");
const path = require("path");
const { createClient } = require("@sanity/client");

const DRY_RUN = process.argv.includes("--dry-run");
const LIMIT = (() => {
  const i = process.argv.indexOf("--limit");
  return i !== -1 ? parseInt(process.argv[i + 1], 10) : null;
})();

// Load .env.local
const envPath = path.join(__dirname, "../.env.local");
if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, "utf-8")
    .split("\n")
    .forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) return;
      const eq = trimmed.indexOf("=");
      if (eq > 0) {
        process.env[trimmed.slice(0, eq).trim()] = trimmed.slice(eq + 1).trim();
      }
    });
}

const client = createClient({
  projectId: "ebeq7cmu",
  dataset: "production",
  token: process.env.SANITY_WRITE_TOKEN,
  apiVersion: "2024-01-01",
  useCdn: false,
});

const SITE_ORIGIN = "https://growthpad.co.ke";
const CONCURRENCY = 5;
const TIMEOUT_MS = 8000;

// Known page remaps: old WP slugs/paths → new site paths
const PAGE_REMAPS = {
  "contact-us": "/contact",
  "contact": "/contact",
  "about": "/our-dna",
  "about-us": "/our-dna",
  "our-dna": "/our-dna",
  "services": "/services",
  "our-services": "/services",
  "our-specialties-digital-services": "/services",
  "digital-verticals": "/services",
  "web-mobile-experiences-development": "/services",
  "performance-based-sales-marketing": "/services",
  "careers": "/careers",
  "jobs": "/careers",
  "case-studies": "/case-studies",
  "case-studies-industry-leaders": "/case-studies",
  "work": "/case-studies",
  "portfolio": "/case-studies",
  "success-stories": "/case-studies",
  "insights": "/insights",
  "resources": "/insights",
  "tenders": "/tenders",
  "products": "/products",
  "training": "/training",
  "for-partners": "/for-partners",
  "partners": "/for-partners",
  "privacy-policy": "/privacy-policy",
  "privacy": "/privacy-policy",
  "blog": "/blog",
  "digital-marketing": "/services",
  "digital-marketing-kenya": "/services",
  "animation-company-kenya": "/services",
  "data-and-analytics": "/services",
  "roi-calculator": "/services",
  "about-us-innovative-tech-solutions": "/our-dna",
};

// Tokenise a slug into meaningful words (strip numbers, short words)
function tokenise(slug) {
  return slug
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .split(" ")
    .filter((w) => w.length > 2);
}

// Score how well a candidate slug matches a source slug by word overlap
function fuzzyScore(sourceTokens, candidateSlug) {
  const candidateTokens = new Set(tokenise(candidateSlug));
  return sourceTokens.filter((t) => candidateTokens.has(t)).length;
}

// Find the best matching blog slug for a given URL path
function findBestSlugMatch(urlPath, allSlugs) {
  // Extract all path segments and score each slug against them
  const segments = urlPath.replace(/\/$/, "").split("/").filter(Boolean);
  // Use all segments joined as the source to capture full context
  const sourceTokens = tokenise(segments.join("-"));
  if (sourceTokens.length === 0) return null;

  let best = null;
  let bestScore = 0;

  for (const slug of allSlugs) {
    const score = fuzzyScore(sourceTokens, slug);
    if (score > bestScore) {
      bestScore = score;
      best = slug;
    }
  }

  // Require at least 2 matching words to avoid false positives
  return bestScore >= 2 ? best : null;
}

// ─── Helpers ────────────────────────────────────────────────────────────────

async function isUrlAlive(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      method: "HEAD",
      redirect: "follow",
      signal: controller.signal,
      headers: { "User-Agent": "Growthpad-LinkChecker/1.0" },
    });
    return res.ok; // 200–299
  } catch {
    return false;
  } finally {
    clearTimeout(timer);
  }
}

// Run promises in batches to avoid hammering servers
async function pLimit(tasks, limit) {
  const results = [];
  for (let i = 0; i < tasks.length; i += limit) {
    const batch = tasks.slice(i, i + limit).map((t) => t());
    results.push(...(await Promise.all(batch)));
  }
  return results;
}

// Walk every block in Portable Text and collect all internal link hrefs only
function extractLinks(blocks) {
  const links = new Set();
  for (const block of blocks ?? []) {
    if (block._type !== "block") continue;
    for (const child of block.children ?? []) {
      for (const mark of child.marks ?? []) {
        const def = (block.markDefs ?? []).find((d) => d._key === mark);
        if (def?._type === "link" && def.href) {
          try {
            const urlObj = new URL(def.href, SITE_ORIGIN);
            if (urlObj.hostname === new URL(SITE_ORIGIN).hostname) {
              links.add(def.href);
            }
          } catch {
            // skip malformed URLs
          }
        }
      }
    }
  }
  return [...links];
}

// Return new blocks with broken links either remapped or stripped
function patchBlocks(blocks, remapTable) {
  return blocks.map((block) => {
    if (block._type !== "block") return block;

    const newMarkDefs = (block.markDefs ?? []).map((def) => {
      if (def._type !== "link" || !def.href) return def;
      const action = remapTable[def.href];
      if (!action) return def; // still alive — keep as-is
      if (action.type === "remap") return { ...def, href: action.href };
      return null; // strip
    }).filter(Boolean);

    // Remove mark keys for stripped defs from children
    const strippedKeys = new Set(
      (block.markDefs ?? [])
        .filter((def) => {
          const action = remapTable[def.href];
          return action?.type === "strip";
        })
        .map((d) => d._key),
    );

    const newChildren = (block.children ?? []).map((child) => ({
      ...child,
      marks: (child.marks ?? []).filter((m) => !strippedKeys.has(m)),
    }));

    return { ...block, markDefs: newMarkDefs, children: newChildren };
  });
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  console.log(`\n🔍 Fetching all blog posts from Sanity...`);

  const posts = await client.fetch(
    `*[_type == "blog"]{ _id, title, "slug": slug.current, content }`,
  );

  console.log(`   Found ${posts.length} posts.\n`);

  const postsToScan = LIMIT ? posts.slice(0, LIMIT) : posts;
  console.log(`   Scanning ${postsToScan.length} of ${posts.length} posts.
`);

  const slugSet = new Set(posts.map((p) => p.slug));
  const allSlugs = posts.map((p) => p.slug);

  let totalBroken = 0;
  let totalFixed = 0;
  let totalStripped = 0;

  for (const post of postsToScan) {
    const links = extractLinks(post.content);
    if (links.length === 0) continue;

    // Check all links in this post concurrently (batched)
    const checks = await pLimit(
      links.map((url) => async () => ({ url, alive: await isUrlAlive(url) })),
      CONCURRENCY,
    );

    const broken = checks.filter((c) => !c.alive);
    if (broken.length === 0) continue;

    totalBroken += broken.length;
    console.log(`\n📄 "${post.title}" — ${broken.length} broken link(s):`);

    // Build remap table for this post
    const remapTable = {};

    for (const { url } of broken) {
      const urlObj = new URL(url, SITE_ORIGIN);
      const segments = urlObj.pathname.replace(/\/$/, "").split("/").filter(Boolean);
      const lastSegment = segments[segments.length - 1];
      const firstSegment = segments[0];

      if (lastSegment && slugSet.has(lastSegment)) {
        // 1. Exact slug match
        const newHref = `${SITE_ORIGIN}/blog/${lastSegment}`;
        remapTable[url] = { type: "remap", href: newHref };
        console.log(`   🔁 REMAP  ${url}`);
        console.log(`          → ${newHref}`);
        totalFixed++;
      } else if (PAGE_REMAPS[lastSegment] || PAGE_REMAPS[firstSegment]) {
        // 2. Known static page remap
        const newPath = PAGE_REMAPS[lastSegment] ?? PAGE_REMAPS[firstSegment];
        const newHref = `${SITE_ORIGIN}${newPath}`;
        remapTable[url] = { type: "remap", href: newHref };
        console.log(`   🔁 REMAP  ${url}`);
        console.log(`          → ${newHref}`);
        totalFixed++;
      } else {
        // 3. Fuzzy match against all blog slugs using word overlap
        const fuzzyMatch = findBestSlugMatch(urlObj.pathname, allSlugs);
        if (fuzzyMatch) {
          const newHref = `${SITE_ORIGIN}/blog/${fuzzyMatch}`;
          remapTable[url] = { type: "remap", href: newHref };
          console.log(`   🔁 FUZZY  ${url}`);
          console.log(`          → ${newHref}`);
          totalFixed++;
        } else {
          remapTable[url] = { type: "strip" };
          console.log(`   ✂️  STRIP  ${url}  (no match found)`);
          totalStripped++;
        }
      }
    }

    if (DRY_RUN) continue;

    const patchedContent = patchBlocks(post.content, remapTable);
    await client.patch(post._id).set({ content: patchedContent }).commit();
    console.log(`   ✅ Patched in Sanity.`);
  }

  console.log(`\n${"─".repeat(50)}`);
  console.log(`Total broken links found : ${totalBroken}`);
  console.log(`Remapped to new URLs     : ${totalFixed}`);
  console.log(`Stripped (no match)      : ${totalStripped}`);
  if (DRY_RUN) console.log(`\n⚠️  DRY RUN — no changes written to Sanity.`);
  console.log();
}

main().catch((err) => {
  console.error("Script failed:", err);
  process.exit(1);
});
