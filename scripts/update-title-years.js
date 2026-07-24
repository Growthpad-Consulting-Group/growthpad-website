const { createClient } = require("@sanity/client");
require("dotenv").config({ path: ".env.local" });

const client = createClient({
  projectId: "ebeq7cmu",
  dataset: "production",
  apiVersion: "2024-01-01",
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
});

const CURRENT_YEAR = new Date().getFullYear();

// Matches years like – 2021, | 2023, (2022), : 2024 etc.
const YEAR_REGEX = /(\s*[–\-|:]\s*)(20\d{2})/g;

async function main() {
  const posts = await client.fetch('*[_type == "blog"]{ _id, title }');

  let updated = 0;

  for (const post of posts) {
    if (!YEAR_REGEX.test(post.title)) continue;

    // Reset lastIndex after test()
    YEAR_REGEX.lastIndex = 0;

    const newTitle = post.title.replace(YEAR_REGEX, (match, sep, year) => {
      if (year === String(CURRENT_YEAR)) return match; // already current
      return `${sep}${CURRENT_YEAR}`;
    });

    if (newTitle === post.title) continue;

    await client.patch(post._id).set({ title: newTitle }).commit();
    console.log(`✓ "${post.title}"\n  → "${newTitle}"`);
    updated++;
  }

  console.log(`\nDone. ${updated} titles updated.`);
}

main().catch(console.error);
