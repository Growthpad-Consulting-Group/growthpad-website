import { createImageUrlBuilder, type SanityImageSource } from "@sanity/image-url";
import { client } from "@/sanity/client";

const builder = createImageUrlBuilder(client);

export function urlForImage(source: SanityImageSource) {
  return builder.image(source);
}

// Sanity's CDN already resizes/crops images per the width()/height() params
// passed to urlForImage, so re-optimizing them again through next/image would
// just burn Vercel image transformation quota for no visual benefit.
export function isSanityUrl(src: string) {
  return src.startsWith("https://cdn.sanity.io");
}
