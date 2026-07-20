import BlogHero from "@/features/blog/components/BlogHero";
import BlogSection from "@/features/blog/components/BlogSection";
import ScrollColorTransition from "@/shared/components/ScrollColorTransition";

export const metadata = {
  title: "Blog | Growthpad Consulting Group",
  description:
    "Stories, perspectives, updates, and thoughts on B2B strategy, digital marketing, corporate communications, and technology in Africa.",
  alternates: {
    types: {
      "application/rss+xml": "/blog/rss.xml",
    },
  },
};

export default function BlogPage() {
  return (
    <div className="flex flex-1 flex-col">
      <ScrollColorTransition />
      <BlogHero />
      <BlogSection />
    </div>
  );
}
