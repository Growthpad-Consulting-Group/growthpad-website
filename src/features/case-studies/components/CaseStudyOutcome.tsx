import Image from "next/image";

export default function CaseStudyOutcome({
  heading = "Outcome",
  description,
  images,
}: {
  heading?: string;
  description: string;
  images: { src: string; alt: string }[];
}) {
  return (
    <section data-theme-section="gray" className="theme-bg w-full py-20 lg:py-28">
      <div className="container-fluid">
        <h2 className="font-display theme-fg text-4xl font-bold sm:text-5xl">
          {heading}
        </h2>
        <p className="theme-fg mt-6 max-w-2xl text-lg leading-8 opacity-70">
          {description}
        </p>

        {/* Staggers every second column downward — holds for any image count,
            not just the original pair. */}
        <div className="mt-14 grid gap-8 sm:grid-cols-2">
          {images.map((image, index) => (
            <div
              key={image.src}
              className={`relative aspect-square w-full overflow-hidden rounded-2xl ${
                index % 2 === 1 ? "sm:mt-20" : ""
              }`}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                unoptimized
                sizes="(min-width: 640px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
