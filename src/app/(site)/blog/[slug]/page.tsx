import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import { Icon } from "@iconify/react";
import { urlForImage } from "@/sanity/image";
import { getBlog, getBlogs } from "@/sanity/queries";
import ScrollColorTransition from "@/shared/components/ScrollColorTransition";
import { SITE_URL } from "@/shared/lib/site";
import ArticleHero from "@/features/blog/components/ArticleHero";
import LazyYouTube from "@/features/blog/components/LazyYouTube";
import NextUpCard from "@/features/blog/components/NextUpCard";
import TableOfContents from "@/features/blog/components/TableOfContents";
import { extractHeadings } from "@/features/blog/lib/toc";

const portableTextComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="mt-4 mb-4 text-base leading-8 text-secondary/80">{children}</p>
    ),
    h1: ({ children }) => (
      <h2 className="mt-8 mb-4 text-3xl font-display font-bold text-secondary">{children}</h2>
    ),
    h2: ({ children, value }) => (
      <h3
        id={value._key}
        className="mt-8 mb-4 scroll-mt-28 text-2xl font-display font-bold text-secondary"
      >
        {children}
      </h3>
    ),
    h3: ({ children, value }) => (
      <h4
        id={value._key}
        className="mt-6 mb-3 scroll-mt-28 text-xl font-display font-bold text-secondary"
      >
        {children}
      </h4>
    ),
    h4: ({ children }) => (
      <h5 className="mt-6 mb-2 text-lg font-display font-bold text-secondary">{children}</h5>
    ),
    blockquote: ({ children }) => (
      <blockquote className="my-6 border-l-4 border-primary pl-4 italic text-secondary bg-primary/5 p-4 rounded-r-xl">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => <ul className="mt-4 mb-4 list-disc pl-6 space-y-2 text-secondary/80">{children}</ul>,
    number: ({ children }) => <ol className="mt-4 mb-4 list-decimal pl-6 space-y-2 text-secondary/80">{children}</ol>,
  },
  listItem: {
    bullet: ({ children }) => <li className="text-base leading-7">{children}</li>,
    number: ({ children }) => <li className="text-base leading-7">{children}</li>,
  },
  types: {
    image: ({ value }) => {
      if (!value?.asset?._ref) return null;
      return (
        <div className="relative my-8 aspect-video w-full max-w-full overflow-hidden rounded-2xl shadow-2xl shadow-secondary/10 transition-all duration-600 ease-out hover:shadow-2xl hover:shadow-primary/10">
          <Image
            src={urlForImage(value).width(800).url()}
            alt={value.alt || "Article image"}
            fill
            sizes="(max-width: 768px) 100vw, 800px"
            className="object-cover"
          />
        </div>
      );
    },
    youtube: ({ value }) => {
      if (!value?.url) return null;
      // Extract video ID from youtube URL
      const match = value.url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/i);
      const videoId = match ? match[1] : null;
      if (!videoId) return null;
      return <LazyYouTube videoId={videoId} />;
    },
  },
  marks: {
    link: ({ children, value }) => {
      const rel = !value.href.startsWith("/") ? "noreferrer noopener" : undefined;
      return (
        <Link
          href={value.href}
          rel={rel}
          target={rel ? "_blank" : undefined}
          className="text-primary underline hover:text-primary/80 transition-colors"
        >
          {children}
        </Link>
      );
    },
  },
};

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const post = await getBlog(slug);

  if (!post) {
    return {
      title: "Article Not Found | Growthpad",
    };
  }

  const title = post.seoTitle ? `${post.seoTitle} | Blog | Growthpad` : `${post.title} | Blog | Growthpad`;
  const description = post.seoDescription || post.excerpt;
  const imageUrl = post.coverImage 
    ? urlForImage(post.coverImage).width(1200).height(630).url() 
    : undefined;

  return {
    title,
    description,
    openGraph: {
      title: post.seoTitle || post.title,
      description,
      type: "article",
      publishedTime: post.publishedAt,
      images: imageUrl
        ? [
            {
              url: imageUrl,
              width: 1200,
              height: 630,
              alt: post.title,
            },
          ]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title: post.seoTitle || post.title,
      description,
      images: imageUrl ? [imageUrl] : [],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const [post, allPosts] = await Promise.all([getBlog(slug), getBlogs()]);

  if (!post) {
    notFound();
  }

  // allPosts is sorted newest-first, so the item before the current one in
  // the array is chronologically newer ("next") and the one after is older
  // ("previous") — reusing the already-cached list avoids two more queries.
  const index = allPosts.findIndex((item) => item.slug === post.slug);
  const nextPost = index > 0 ? allPosts[index - 1] : null;
  const prevPost = index >= 0 && index < allPosts.length - 1 ? allPosts[index + 1] : null;
  const relatedPosts = allPosts
    .filter((item) => item.slug !== post.slug && item.category === post.category)
    .slice(0, 3);

  const upNext = nextPost ?? relatedPosts[0] ?? prevPost ?? null;

  const headings = extractHeadings(post.content);
  const postUrl = `${SITE_URL}/blog/${post.slug}`;
  const coverImageUrl = post.coverImage
    ? urlForImage(post.coverImage).width(1600).height(700).url()
    : null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    image: post.coverImage ? urlForImage(post.coverImage).width(1200).height(630).url() : undefined,
    datePublished: post.publishedAt,
    author: { "@type": "Person", name: post.author },
    publisher: { "@type": "Organization", name: "Growthpad Consulting Group" },
    mainEntityOfPage: postUrl,
  };

  return (
    <div className="flex flex-1 flex-col">
      <ScrollColorTransition />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main data-theme-section="light" className="theme-bg min-h-screen">
        <ArticleHero post={post} imageUrl={coverImageUrl} postUrl={postUrl} />

        <div className="container mx-auto max-w-6xl px-6 py-16 sm:py-24 lg:grid lg:grid-cols-[minmax(0,1fr)_240px] lg:items-start lg:gap-16">
          <div className="max-w-4xl">
            <p className="text-lg leading-8 text-secondary/70 italic border-l-2 border-primary/30 pl-4 mb-10">
              {post.excerpt}
            </p>

            {/* Article Content */}
            <article className="prose prose-lg max-w-none text-secondary">
              {post.content && (
                <PortableText value={post.content} components={portableTextComponents} />
              )}
            </article>

            {upNext && <NextUpCard post={upNext} />}

            {/* Prev / Next Navigation */}
            {(prevPost || nextPost) && (
              <div className="mt-16 pt-8 border-t border-secondary/10 grid gap-4 sm:grid-cols-2">
                {prevPost ? (
                  <Link
                    href={`/blog/${prevPost.slug}`}
                    className="group flex flex-col gap-1.5 rounded-2xl border border-primary/5 bg-white/20 p-5 transition-colors hover:bg-white/50"
                  >
                    <span className="text-secondary/40 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider">
                      <Icon icon="solar:arrow-left-broken" width={14} height={14} />
                      Previous
                    </span>
                    <span className="text-secondary group-hover:text-primary font-display font-bold leading-snug line-clamp-2 transition-colors">
                      {prevPost.title}
                    </span>
                  </Link>
                ) : (
                  <div />
                )}

                {nextPost && (
                  <Link
                    href={`/blog/${nextPost.slug}`}
                    className="group flex flex-col gap-1.5 rounded-2xl border border-primary/5 bg-white/20 p-5 text-right transition-colors hover:bg-white/50 sm:items-end"
                  >
                    <span className="text-secondary/40 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider">
                      Next
                      <Icon icon="solar:arrow-right-broken" width={14} height={14} />
                    </span>
                    <span className="text-secondary group-hover:text-primary font-display font-bold leading-snug line-clamp-2 transition-colors">
                      {nextPost.title}
                    </span>
                  </Link>
                )}
              </div>
            )}

          </div>

          <TableOfContents headings={headings} />
        </div>
      </main>
    </div>
  );
}
