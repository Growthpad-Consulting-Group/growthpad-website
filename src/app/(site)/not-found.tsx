import Link from "next/link";
import CtaButton from "@/shared/components/CtaButton";

export const metadata = {
  title: "Page Not Found | Growthpad",
};

export default function NotFound() {
  return (
    <main className="theme-bg flex min-h-[70vh] w-full flex-col items-center justify-center px-6 py-24 text-center">
      <p className="text-primary font-display text-7xl font-bold sm:text-8xl">
        404
      </p>
      <h1 className="font-display text-secondary mt-4 text-2xl font-bold sm:text-3xl">
        We couldn&apos;t find that page
      </h1>
      <p className="text-secondary/70 mt-3 max-w-md text-base leading-7">
        The page you&apos;re looking for may have been moved or no longer
        exists.
      </p>
      <div className="mt-8 flex items-center gap-4">
        <CtaButton href="/" circleClassName="bg-primary text-white">
          Back to home
        </CtaButton>
        <Link
          href="/blog"
          className="text-secondary/70 hover:text-primary text-sm font-semibold transition-colors"
        >
          Visit the blog
        </Link>
      </div>
    </main>
  );
}
