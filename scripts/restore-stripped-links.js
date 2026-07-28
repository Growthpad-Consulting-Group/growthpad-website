/**
 * Restore Stripped Links in Sanity Blog Posts
 *
 * Scrapes the live Next.js site to find internal links that were previously
 * stripped, fuzzy-matches them to current Sanity blog slugs, and restores
 * them in the Sanity content.
 *
 * Usage:
 *   node scripts/restore-stripped-links.js          # live restore
 *   node scripts/restore-stripped-links.js --dry-run # preview only
 */

const fs = require("fs");
const path = require("path");
const { createClient } = require("@sanity/client");
const { nanoid } = require("/Users/Apple/code/clients/growthpad-website/node_modules/nanoid/index.cjs");

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

const SITE_ORIGIN = "https://www.growthpad.co.ke";
const TIMEOUT_MS = 10000;

// Known static page remaps
const PAGE_REMAPS = {
  "contact-us": "/contact",
  "contact": "/contact",
  "about": "/our-dna",
  "about-us": "/our-dna",
  "our-specialties-digital-services": "/services",
  "digital-verticals": "/services",
  "web-mobile-experiences-development": "/services",
  "performance-based-sales-marketing": "/services",
  "case-studies-industry-leaders": "/case-studies",
  "success-stories": "/case-studies",
  "digital-marketing": "/services",
  "digital-marketing-kenya": "/services",
  "animation-company-kenya": "/services",
  "data-and-analytics": "/services",
  "roi-calculator": "/services",
  "about-us-innovative-tech-solutions": "/our-dna",
  "social-media-marketing-companies-kenya": "/services",
  "digital-marketing-agencies-in-kenya": "/services",
  "top-digital-marketing-agencies-in-kenya": "/services",
};

function tokenise(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim().split(" ").filter((w) => w.length > 2);
}

function fuzzyMatch(urlPath, allSlugs) {
  const sourceTokens = tokenise(urlPath.replace(/\//g, "-"));
  if (sourceTokens.length === 0) return null;

  let best = null;
  let bestScore = 0;

  for (const slug of allSlugs) {
    const candidateTokens = new Set(tokenise(slug));
    const score = sourceTokens.filter((t) => candidateTokens.has(t)).length;
    if (score > bestScore) {
      bestScore = score;
      best = slug;
    }
  }

  return bestScore >= 2 ? best : null;
}

function resolveUrl(oldUrl, slugSet, allSlugs) {
  try {
    const urlObj = new URL(oldUrl, SITE_ORIGIN);
    if (urlObj.hostname !== new URL(SITE_ORIGIN).hostname) return null;

    const pathname = urlObj.pathname.replace(/\/$/, "");
    const segments = pathname.split("/").filter(Boolean);
    const lastSegment = segments[segments.length - 1];
    const firstSegment = segments[0];

    // 1. Exact slug match
    if (slugSet.has(lastSegment)) return `${SITE_ORIGIN}/blog/${lastSegment}`;

    // 2. Known static page
    if (PAGE_REMAPS[lastSegment]) return `${SITE_ORIGIN}${PAGE_REMAPS[lastSegment]}`;
    if (PAGE_REMAPS[firstSegment]) return `${SITE_ORIGIN}${PAGE_REMAPS[firstSegment]}`;

    // 3. Fuzzy match
    const fuzzy = fuzzyMatch(pathname, allSlugs);
    if (fuzzy) return `${SITE_ORIGIN}/blog/${fuzzy}`;

    return null;
  } catch {
    return null;
  }
}

async function fetchPageLinks(slug) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(`${SITE_ORIGIN}/blog/${slug}`, {
      signal: controller.signal,
      headers: { "User-Agent": "Growthpad-LinkRestorer/1.0" },
    });
    const html = await res.text();
    // Extract all href values from anchor tags
    const matches = [...html.matchAll(/href="([^"]+)"/g)].map((m) => m[1]);
    return [...new Set(matches)].filter((href) => {
      try {
        const u = new URL(href, SITE_ORIGIN);
        return u.hostname === new URL(SITE_ORIGIN).hostname;
      } catch { return false; }
    });
  } catch {
    return [];
  } finally {
    clearTimeout(timer);
  }
}

// Find text in blocks that matches anchor text and restore the link mark
function restoreLinksInBlocks(blocks, linksToRestore) {
  if (linksToRestore.length === 0) return { blocks, restored: 0 };

  let restored = 0;
  const newBlocks = blocks.map((block) => {
    if (block._type !== "block") return block;

    let newBlock = { ...block, markDefs: [...(block.markDefs ?? [])], children: [...(block.children ?? [])] };

    for (const { newHref } of linksToRestore) {
      // Check if this href is already present in markDefs
      const alreadyExists = newBlock.markDefs.some((d) => d.href === newHref);
      if (alreadyExists) continue;

      // Find children whose text content could be the anchor text for this link
      // We look for children that don't already have a link mark
      const existingLinkKeys = new Set(
        newBlock.markDefs.filter((d) => d._type === "link").map((d) => d._key)
      );

      const linkableChildren = newBlock.children.filter(
        (child) =>
          child.text?.trim().length > 3 &&
          !child.marks?.some((m) => existingLinkKeys.has(m))
      );

      if (linkableChildren.length === 0) continue;

      // Add the markDef
      const markKey = nanoid(12);
      newBlock.markDefs.push({ _key: markKey, _type: "link", href: newHref });

      // Apply to the first eligible child in this block
      const targetChild = linkableChildren[0];
      newBlock.children = newBlock.children.map((child) =>
        child._key === targetChild._key
          ? { ...child, marks: [...(child.marks ?? []), markKey] }
          : child
      );
      restored++;
    }

    return newBlock;
  });

  return { blocks: newBlocks, restored };
}

async function main() {
  console.log(`\n🔍 Fetching all blog posts from Sanity...`);

  const posts = await client.fetch(
    `*[_type == "blog"]{ _id, title, "slug": slug.current, content }`,
  );

  console.log(`   Found ${posts.length} posts.\n`);

  const slugSet = new Set(posts.map((p) => p.slug));
  const allSlugs = posts.map((p) => p.slug);
  const slugToId = Object.fromEntries(posts.map((p) => [p.slug, p._id]));

  let totalRestored = 0;
  let totalSkipped = 0;

  for (const post of posts) {
    // Scrape the live page to get all current hrefs
    const liveLinks = await fetchPageLinks(post.slug);

    // Find internal links on the live page that are NOT already in Sanity content
    const sanityLinks = new Set();
    for (const block of post.content ?? []) {
      if (block._type !== "block") continue;
      for (const def of block.markDefs ?? []) {
        if (def._type === "link") sanityLinks.add(def.href);
      }
    }

    // These are links visible on the live site but missing from Sanity — i.e. stripped ones
    const missingLinks = liveLinks.filter((href) => {
      // Skip homepage, mailto, share buttons, nav links, footer links
      if (href === `${SITE_ORIGIN}/` || href === SITE_ORIGIN) return false;
      if (href.includes("mailto:")) return false;
      if (href.includes("twitter.com") || href.includes("facebook.com") || href.includes("linkedin.com")) return false;
      if (href.includes("/blog/") && href.includes(post.slug)) return false;
      // Skip known nav/footer pages — these are site-wide links, not article body links
      const navPaths = ["/contact", "/our-dna", "/services", "/careers", "/case-studies", "/insights", "/tenders", "/products", "/training", "/for-partners", "/privacy-policy", "/blog"];
      try {
        const u = new URL(href, SITE_ORIGIN);
        if (navPaths.includes(u.pathname) || u.pathname === "/") return false;
      } catch { return false; }
      return !sanityLinks.has(href);
    });

    if (missingLinks.length === 0) continue;

    // Resolve each missing link to a valid new URL
    const linksToRestore = missingLinks
      .map((href) => {
        const newHref = resolveUrl(href, slugSet, allSlugs);
        return newHref ? { oldHref: href, newHref } : null;
      })
      .filter(Boolean);

    if (linksToRestore.length === 0) continue;

    console.log(`\n📄 "${post.title}"`);
    for (const { oldHref, newHref } of linksToRestore) {
      console.log(`   🔗 ${oldHref}`);
      console.log(`      → ${newHref}`);
    }

    if (DRY_RUN) {
      totalRestored += linksToRestore.length;
      continue;
    }

    const { blocks: patchedContent, restored } = restoreLinksInBlocks(post.content, linksToRestore);

    if (restored > 0) {
      await client.patch(post._id).set({ content: patchedContent }).commit();
      console.log(`   ✅ Restored ${restored} link(s) in Sanity.`);
      totalRestored += restored;
    } else {
      console.log(`   ⚠️  Could not find suitable anchor text to attach links.`);
      totalSkipped += linksToRestore.length;
    }
  }

  console.log(`\n${"─".repeat(50)}`);
  console.log(`Links restored : ${totalRestored}`);
  console.log(`Skipped        : ${totalSkipped}`);
  if (DRY_RUN) console.log(`\n⚠️  DRY RUN — no changes written to Sanity.`);
  console.log();
}

main().catch((err) => {
  console.error("Script failed:", err);
  process.exit(1);
});
