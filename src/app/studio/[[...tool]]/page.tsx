"use client";

import dynamic from "next/dynamic";

const Studio = dynamic(
  async () => {
    const [{ NextStudio }, { default: config }] = await Promise.all([
      import("next-sanity/studio"),
      import("../../../../sanity.config"),
    ]);
    return function StudioWrapper() {
      return <NextStudio config={config} />;
    };
  },
  { ssr: false },
);

export default function StudioPage() {
  return <Studio />;
}
