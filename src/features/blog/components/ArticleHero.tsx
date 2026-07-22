import Image from "next/image";
import ParallaxHeroImage from "@/features/blog/components/ParallaxHeroImage";
import ShareButtons from "@/features/blog/components/ShareButtons";
import Breadcrumb from "@/shared/components/Breadcrumb";
import { urlForImage } from "@/sanity/image";
import type { BlogDetail } from "@/sanity/queries";

function AuthorAvatar({ author }: { author: BlogDetail["author"] }) {
  if (author.image) {
    return (
      <Image
        src={urlForImage(author.image).width(88).height(88).url()}
        alt={author.name}
        width={44}
        height={44}
        className="ring-1 ring-white/30 h-11 w-11 shrink-0 rounded-full object-cover backdrop-blur-sm"
      />
    );
  }

  const initials = author.name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <span className="bg-primary/80 ring-1 ring-white/30 flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white backdrop-blur-sm">
      {initials}
    </span>
  );
}

export default function ArticleHero({
  post,
  imageUrl,
  postUrl,
}: {
  post: BlogDetail;
  imageUrl: string | null;
  postUrl: string;
}) {
  return (
    <div className="relative h-85 w-full overflow-hidden sm:h-100 lg:h-115">
      {imageUrl ? (
        <ParallaxHeroImage src={imageUrl} alt={post.title} />
      ) : (
        <div className="bg-secondary h-full w-full" />
      )}

      {/* Dark gradient so white overlay text stays readable regardless of
          the underlying image's own contrast. */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-black/30" />

      <div className="absolute top-6 left-6 z-10 sm:top-10 sm:left-10">
        <Breadcrumb
          variant="light"
          items={[
            { label: "Blog", href: "/blog" },
            { label: post.title },
          ]}
        />
      </div>

      <div className="absolute inset-x-0 bottom-0 z-10">
        <div className="container-fluid flex flex-col gap-4 pb-8 sm:pb-10">
          <div className="flex items-center gap-2 text-sm text-white/70">
            <span className="text-primary font-bold uppercase tracking-wider">
              {post.category}
            </span>
            <span>•</span>
            <span>{post.readingMinutes} min read</span>
          </div>

          <h1 className="font-display max-w-3xl text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <AuthorAvatar author={post.author} />
              <div className="flex flex-col">
                <span className="text-xs text-white/50">Author</span>
                <span className="text-sm font-semibold text-white">
                  {post.author.name}
                </span>
              </div>
              <div className="ml-4 flex flex-col">
                <span className="text-xs text-white/50">Published</span>
                <span className="text-sm font-semibold text-white">
                  {new Date(post.publishedAt).toLocaleDateString("en-US", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>

            <ShareButtons url={postUrl} title={post.title} variant="light" />
          </div>
        </div>
      </div>
    </div>
  );
}
