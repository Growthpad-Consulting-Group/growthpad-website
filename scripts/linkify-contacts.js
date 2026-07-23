/**
 * Linkify phone numbers and email addresses in Sanity blog posts.
 *
 * Finds spans containing phone numbers or emails that don't already have
 * a tel:/mailto: link mark, splits the span text around the match, and
 * inserts a proper link markDef.
 *
 * Usage:
 *   node scripts/linkify-contacts.js          # live run
 *   node scripts/linkify-contacts.js --dry-run
 */

const fs = require("fs");
const path = require("path");
const { createClient } = require("@sanity/client");
const { nanoid } = require("/Users/Apple/code/clients/growthpad-website/node_modules/nanoid/index.cjs");

const DRY_RUN = process.argv.includes("--dry-run");

const envPath = path.join(__dirname, "../.env.local");
if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, "utf-8")
    .split("\n")
    .forEach((line) => {
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

// Matches phone numbers — must be at least 9 digits, allows +, spaces, dashes, parens
// Uses word boundaries to avoid matching things like "50 000 4.8"
const PHONE_RE = /(\+?(?:254|0)[0-9][\d\s\-().]{7,}\d)/g;
const EMAIL_RE = /([a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,})/g;

function digitsOnly(str) {
  return str.replace(/\D/g, "");
}

function isValidPhone(raw) {
  const digits = digitsOnly(raw);
  // Must be 9–13 digits and start with 254 or 07/01
  return digits.length >= 9 && digits.length <= 13 && /^(254|0[17])/.test(digits);
}

function normalisePhone(raw) {
  const digits = digitsOnly(raw);
  if (digits.startsWith("254")) return `+${digits}`;
  if (digits.startsWith("0")) return `+254${digits.slice(1)}`;
  return `+${digits}`;
}

/**
 * Split a span's text around a regex match and return new child spans,
 * with the matched portion wrapped in a new link mark.
 */
function splitSpanOnMatch(child, match, href, markKey) {
  const { index } = match;
  const matchedText = match[0];
  const before = child.text.slice(0, index);
  const after = child.text.slice(index + matchedText.length);
  const result = [];

  if (before) {
    result.push({ ...child, _key: nanoid(12), text: before });
  }

  result.push({
    ...child,
    _key: nanoid(12),
    text: matchedText,
    marks: [...(child.marks ?? []), markKey],
  });

  if (after) {
    result.push({ ...child, _key: nanoid(12), text: after });
  }

  return result;
}

function processBlock(block) {
  if (block._type !== "block") return { block, count: 0 };

  let count = 0;
  const markDefs = [...(block.markDefs ?? [])];
  let children = [...(block.children ?? [])];

  // Collect existing tel:/mailto: hrefs so we don't double-link
  const existingHrefs = new Set(
    markDefs.filter((d) => d._type === "link").map((d) => d.href)
  );
  const existingLinkKeys = new Set(
    markDefs.filter((d) => d._type === "link").map((d) => d._key)
  );

  const newChildren = [];

  for (const child of children) {
    if (child._type !== "span" || !child.text) {
      newChildren.push(child);
      continue;
    }

    // Skip spans that already have a link mark
    if (child.marks?.some((m) => existingLinkKeys.has(m))) {
      newChildren.push(child);
      continue;
    }

    // Try email first
    EMAIL_RE.lastIndex = 0;
    const emailMatch = EMAIL_RE.exec(child.text);
    if (emailMatch) {
      const href = `mailto:${emailMatch[1].toLowerCase()}`;
      if (!existingHrefs.has(href)) {
        const markKey = nanoid(12);
        markDefs.push({ _key: markKey, _type: "link", href });
        existingHrefs.add(href);
        existingLinkKeys.add(markKey);
        const split = splitSpanOnMatch(child, emailMatch, href, markKey);
        newChildren.push(...split);
        count++;
        continue;
      }
    }

    // Try phone
    PHONE_RE.lastIndex = 0;
    const phoneMatch = PHONE_RE.exec(child.text);
    if (phoneMatch && isValidPhone(phoneMatch[1])) {
      const href = `tel:${normalisePhone(phoneMatch[1])}`;
      if (!existingHrefs.has(href)) {
        const markKey = nanoid(12);
        markDefs.push({ _key: markKey, _type: "link", href });
        existingHrefs.add(href);
        existingLinkKeys.add(markKey);
        const split = splitSpanOnMatch(child, phoneMatch, href, markKey);
        newChildren.push(...split);
        count++;
        continue;
      }
    }

    newChildren.push(child);
  }

  return {
    block: { ...block, markDefs, children: newChildren },
    count,
  };
}

async function main() {
  console.log(`\n🔍 Fetching all blog posts...`);
  const posts = await client.fetch(
    `*[_type == "blog"]{ _id, title, "slug": slug.current, content }`
  );
  console.log(`   Found ${posts.length} posts.\n`);

  let totalLinks = 0;
  let totalPosts = 0;

  for (const post of posts) {
    let postCount = 0;
    const newContent = (post.content ?? []).map((block) => {
      const { block: newBlock, count } = processBlock(block);
      postCount += count;
      return newBlock;
    });

    if (postCount === 0) continue;

    console.log(`📄 "${post.title}" — ${postCount} contact link(s)`);

    if (!DRY_RUN) {
      await client.patch(post._id).set({ content: newContent }).commit();
      console.log(`   ✅ Saved`);
    }

    totalLinks += postCount;
    totalPosts++;
  }

  console.log(`\n${"─".repeat(50)}`);
  console.log(`Posts updated : ${totalPosts}`);
  console.log(`Links added   : ${totalLinks}`);
  if (DRY_RUN) console.log(`\n⚠️  DRY RUN — no changes written to Sanity.`);
  console.log();
}

main().catch((err) => {
  console.error("Script failed:", err);
  process.exit(1);
});
