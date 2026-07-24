const { createClient } = require("@sanity/client");
require("dotenv").config({ path: ".env.local" });

const client = createClient({
  projectId: "ebeq7cmu",
  dataset: "production",
  apiVersion: "2024-01-01",
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
});

async function main() {
  const posts = await client.fetch('*[_type == "blog"]{ _id, title, content }');

  let updated = 0;

  for (const post of posts) {
    const blocks = post.content ?? [];
    let changed = false;

    const newContent = blocks
      .map((block) => {
        if (block._type !== "block") return block;

        const newChildren = (block.children ?? []).map((child) => {
          if (typeof child.text === "string" && child.text.includes("[lwptoc]")) {
            changed = true;
            return { ...child, text: child.text.replace(/\[lwptoc\]/gi, "").trim() };
          }
          return child;
        });

        // Drop the block entirely if it's now empty
        const isEmpty = newChildren.every((c) => !c.text?.trim());
        if (isEmpty) {
          changed = true;
          return null;
        }

        return { ...block, children: newChildren };
      })
      .filter(Boolean);

    if (changed) {
      await client.patch(post._id).set({ content: newContent }).commit();
      console.log(`✓ Cleaned: ${post.title}`);
      updated++;
    }
  }

  console.log(`\nDone. ${updated} posts updated.`);
}

main().catch(console.error);
