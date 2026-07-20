import type { PortableTextBlock } from "@portabletext/types";

export type Heading = {
  id: string;
  text: string;
  level: 2 | 3;
};

function blockText(block: PortableTextBlock) {
  return (
    (block.children as { text?: string }[] | undefined)
      ?.map((child) => child.text ?? "")
      .join("") ?? ""
  );
}

// Anchors are keyed by the block's Sanity `_key` rather than a slugified
// title: it's already unique per block, so heading ids never collide and
// no shared counter state is needed (this module is reused across
// concurrent requests on the server).
export function extractHeadings(content: PortableTextBlock[] | null): Heading[] {
  if (!content) return [];

  return content
    .filter(
      (block): block is PortableTextBlock & { style: "h2" | "h3"; _key: string } =>
        block._type === "block" && (block.style === "h2" || block.style === "h3"),
    )
    .map((block) => ({
      id: block._key,
      text: blockText(block),
      level: block.style === "h2" ? (2 as const) : (3 as const),
    }))
    .filter((heading) => heading.text.length > 0);
}
