/**
 * WordPress to Sanity Blog Migration Script
 * 
 * Instructions:
 * 1. Install devDependencies for HTML parsing:
 *    npm install --save-dev jsdom @sanity/block-tools
 * 
 * 2. Set your Sanity Write Token (not needed for --dry-run):
 *    Get a token with Write permissions from https://www.sanity.io/manage
 *    Run: export SANITY_WRITE_TOKEN="your-token"
 * 
 * 3. Run a dry run to inspect the generated schema structure:
 *    node scripts/migrate-wp-to-sanity.js --dry-run
 * 
 * 4. Run the live migration:
 *    node scripts/migrate-wp-to-sanity.js
 */

const fs = require("fs");
const path = require("path");
const { createClient } = require("@sanity/client");
const { JSDOM } = require("jsdom");
const { htmlToBlocks } = require("@sanity/block-tools");
const { Schema } = require("@sanity/schema");

const defaultSchema = Schema.compile({
  name: "migrationSchema",
  types: [
    {
      name: "blog",
      type: "object",
      fields: [
        {
          name: "content",
          type: "array",
          of: [
            { type: "block" },
            {
              type: "image",
              options: { hotspot: true },
              fields: [
                {
                  name: "alt",
                  type: "string",
                  title: "Alternative Text",
                },
              ],
            },
            {
              name: "youtube",
              type: "object",
              title: "YouTube Video",
              fields: [
                {
                  name: "url",
                  type: "url",
                  title: "YouTube Video URL",
                },
              ],
            },
          ],
        },
      ],
    },
  ],
});

const contentField = defaultSchema
  .get("blog")
  .fields.find((f) => f.name === "content").type;

// Check for --dry-run flag
const DRY_RUN = process.argv.includes("--dry-run");

// Load environment variables from .env.local if present (only needed if not in dry-run)
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

// Config
const WP_API_URL = "https://growthpad.co.ke/wp-json/wp/v2";
const SANITY_PROJECT_ID = "ebeq7cmu";
const SANITY_DATASET = "production";
const SANITY_TOKEN = process.env.SANITY_WRITE_TOKEN;

if (!DRY_RUN && !SANITY_TOKEN) {
  console.error("Error: SANITY_WRITE_TOKEN is not set in process.env or .env.local.");
  console.error("Run a dry-run with: node scripts/migrate-wp-to-sanity.js --dry-run");
  process.exit(1);
}

// Initialize Sanity Client
const client = DRY_RUN 
  ? null 
  : createClient({
      projectId: SANITY_PROJECT_ID,
      dataset: SANITY_DATASET,
      token: SANITY_TOKEN,
      apiVersion: "2024-01-01",
      useCdn: false,
    });

// Decode common HTML entities left over after stripping tags (WordPress's REST API
// returns excerpt/title text pre-encoded, e.g. "&#8230;", "&amp;", "&#8217;").
function decodeHtmlEntities(text) {
  const named = {
    "&amp;": "&",
    "&hellip;": "…",
    "&nbsp;": " ",
    "&quot;": '"',
    "&#039;": "'",
    "&apos;": "'",
    "&lt;": "<",
    "&gt;": ">",
  };
  return text
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&[a-z]+;/gi, (entity) => named[entity] ?? entity);
}

// Drops blocks that are empty paragraphs — leftover from stripped <p></p>/<p><br></p>
// tags in WordPress content, which otherwise clutter the Studio editor as blank lines.
function stripEmptyBlocks(blocks) {
  return blocks.filter((block) => {
    if (block._type !== "block") return true;
    const text = (block.children || []).map((c) => c.text || "").join("").trim();
    return text.length > 0;
  });
}

// Map WordPress categories to your Sanity Blog categories
function mapCategory(wpCategories) {
  if (!wpCategories || wpCategories.length === 0) return "Strategy";
  
  const names = wpCategories.map(c => c.name.toLowerCase());
  
  if (names.some(n => n.includes("strategy") || n.includes("business"))) return "Strategy";
  if (names.some(n => n.includes("communication") || n.includes("pr") || n.includes("marketing"))) return "Communications";
  if (names.some(n => n.includes("digital") || n.includes("social"))) return "Digital";
  if (names.some(n => n.includes("tech") || n.includes("software") || n.includes("dev"))) return "Technology";
  if (names.some(n => n.includes("news") || n.includes("company") || n.includes("update"))) return "Company News";
  
  return "Strategy"; // default fallback
}

// Download image from WP and upload to Sanity
async function uploadImage(imageUrl, filename) {
  if (DRY_RUN) {
    // Return a mock reference during dry runs
    const mockId = `image-${Math.random().toString(36).substring(2, 10)}-png`;
    console.log(`[DRY RUN] Would download and upload image: ${imageUrl} -> returns ${mockId}`);
    return {
      _type: "image",
      asset: {
        _type: "reference",
        _ref: mockId,
      },
    };
  }

  try {
    console.log(`Downloading image: ${imageUrl}`);
    const response = await fetch(imageUrl);
    if (!response.ok) throw new Error(`Failed to fetch image: ${response.statusText}`);
    const buffer = Buffer.from(await response.arrayBuffer());

    console.log(`Uploading image to Sanity asset CDN...`);
    const asset = await client.assets.upload("image", buffer, {
      filename: filename || "wordpress-image.jpg",
    });
    
    return {
      _type: "image",
      asset: {
        _type: "reference",
        _ref: asset._id,
      },
    };
  } catch (error) {
    console.error(`Warning: Failed to migrate image: ${error.message}`);
    return null;
  }
}

// Convert HTML body content to Sanity Portable Text
async function parseHtmlToBlocks(htmlContent) {
  // 1. Parse HTML DOM to extract inline image links and video embeds
  const dom = new JSDOM(htmlContent);
  const doc = dom.window.document;
  const images = doc.querySelectorAll("img");
  const iframes = doc.querySelectorAll("iframe");

  // 2. Loop and upload all inline images
  for (const img of Array.from(images)) {
    const src = img.getAttribute("src");
    const alt = img.getAttribute("alt") || "";
    
    if (src) {
      const imageAsset = await uploadImage(src, path.basename(src));
      if (imageAsset) {
        // Create custom tag with the reference ref
        const figure = doc.createElement("figure");
        figure.setAttribute("data-sanity-asset-ref", imageAsset.asset._ref);
        figure.setAttribute("data-alt", alt);
        
        // Replace img in DOM
        img.parentNode.replaceChild(figure, img);
      }
    }
  }

  // 3. Loop and parse YouTube video iframe embeds
  for (const iframe of Array.from(iframes)) {
    const src = iframe.getAttribute("src") || "";
    if (src.includes("youtube.com") || src.includes("youtu.be")) {
      // Clean and standardise YouTube URL by extracting video ID
      const match = src.match(/(?:embed\/|v\/|watch\?v=|youtu\.be\/)([^"&?/\s]{11})/i);
      const videoId = match ? match[1] : null;
      if (videoId) {
        const standardUrl = `https://www.youtube.com/watch?v=${videoId}`;
        // Create custom div block with the url
        const div = doc.createElement("div");
        div.setAttribute("data-sanity-youtube-url", standardUrl);
        iframe.parentNode.replaceChild(div, iframe);
      }
    }
  }

  const updatedHtml = dom.serialize();

  // Parse HTML string to Portable Text block list using compiled contentField
  const rawBlocks = htmlToBlocks(updatedHtml, contentField, {
    parseHtml: (html) => new JSDOM(html).window.document,
    rules: [
      {
        deserialize(el, next) {
          // Handle Image figure replacement
          if (el.tagName === "FIGURE" && el.getAttribute("data-sanity-asset-ref")) {
            const ref = el.getAttribute("data-sanity-asset-ref");
            const alt = el.getAttribute("data-alt") || "";
            return {
              _type: "image",
              asset: {
                _type: "reference",
                _ref: ref,
              },
              alt: alt,
            };
          }
          // Handle YouTube video div replacement
          if (el.tagName === "DIV" && el.getAttribute("data-sanity-youtube-url")) {
            const url = el.getAttribute("data-sanity-youtube-url");
            return {
              _type: "youtube",
              url: url,
            };
          }
          return undefined; // let block-tools handle standard elements
        },
      },
    ],
  });

  // Hoist inline image/youtube objects to the top-level of the blocks array
  const hoistedBlocks = [];
  rawBlocks.forEach((block) => {
    if (block._type === "block" && block.children && block.children.length > 0) {
      // Find if there is an image or youtube child inside
      const specialChild = block.children.find(
        (child) => child._type === "image" || child._type === "youtube"
      );

      if (specialChild) {
        // Hoist it to the top-level blocks list
        hoistedBlocks.push({
          ...specialChild,
          _key: block._key, // preserve the top-level block key for editing
        });
      } else {
        hoistedBlocks.push(block);
      }
    } else {
      hoistedBlocks.push(block);
    }
  });

  return hoistedBlocks;
}

async function migratePosts() {
  console.log(`Starting WordPress to Sanity migration [DRY RUN = ${DRY_RUN}]...`);
  let page = 1;
  let totalMigrated = 0;
  let hasMore = true;

  while (hasMore) {
    const url = `${WP_API_URL}/posts?_embed&per_page=${DRY_RUN ? 1 : 20}&page=${page}`;
    console.log(`Fetching page ${page} of WordPress posts...`);
    
    const response = await fetch(url);
    if (!response.ok) {
      if (response.status === 400) {
        hasMore = false;
        break;
      }
      throw new Error(`WordPress API failed: ${response.statusText}`);
    }

    const wpPosts = await response.json();
    if (wpPosts.length === 0) {
      hasMore = false;
      break;
    }

    for (const post of wpPosts) {
      const wpId = post.id;
      const title = decodeHtmlEntities(post.title.rendered);
      const slug = post.slug;
      const publishedAt = post.date_gmt + "Z"; // Zulu ISO time format
      
      // Parse category
      const embeddedTerms = post._embedded?.["wp:term"]?.[0] || [];
      const category = mapCategory(embeddedTerms);

      // Parse author (handling REST API invalid user ID failures gracefully)
      const authorEmbed = post._embedded?.author?.[0];
      const author = authorEmbed && !authorEmbed.code ? authorEmbed.name : "Growthpad Team";

      // Parse excerpt
      const excerpt = decodeHtmlEntities(
        post.excerpt.rendered.replace(/<[^>]+>/g, ""), // strip tags
      )
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, 200);

      console.log(`\nProcessing post [WP ID: ${wpId}]: "${title}"`);

      // Parse rich content (downloads & converts inline images dynamically)
      const content = stripEmptyBlocks(await parseHtmlToBlocks(post.content.rendered));

      // Fetch featured cover image asset
      let coverImage = null;
      const featuredMedia = post._embedded?.["wp:featuredmedia"]?.[0];
      if (featuredMedia && featuredMedia.source_url) {
        coverImage = await uploadImage(featuredMedia.source_url, featuredMedia.slug);
      }

      // Construct Sanity document matching schema
      const sanityDoc = {
        _type: "blog",
        _id: `wp-post-${wpId}`,
        title,
        slug: {
          _type: "slug",
          current: slug,
        },
        category,
        author,
        excerpt,
        content,
        coverImage: coverImage || undefined,
        publishedAt,
      };

      if (DRY_RUN) {
        console.log("\n=================== DRY RUN OUTPUT ===================");
        console.log(JSON.stringify(sanityDoc, null, 2));
        console.log("======================================================");
        hasMore = false; // exit early for dry run
        break;
      } else {
        await client.createOrReplace(sanityDoc);
        console.log(`Successfully migrated post: "${title}" -> Sanity ID: wp-post-${wpId}`);
        totalMigrated++;
      }
    }

    if (DRY_RUN) break;
    page++;
  }

  console.log(`\nMigration completed! Total posts processed: ${totalMigrated}`);
}

migratePosts().catch((err) => {
  console.error("Migration failed with error:", err);
});
