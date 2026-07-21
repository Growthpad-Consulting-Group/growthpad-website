import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Growthpad Consulting Group",
    short_name: "Growthpad",
    description: "Technology, Digital Media and Communication Firm",
    start_url: "/",
    display: "standalone",
    background_color: "#231812",
    theme_color: "#f05d23",
    icons: [
      {
        src: "/favicon.png",
        sizes: "any",
        type: "image/png",
      },
    ],
  };
}
