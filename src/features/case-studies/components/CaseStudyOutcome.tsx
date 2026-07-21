import Image from "next/image";

export default function CaseStudyOutcome({
  heading = "Outcome",
  description,
  images,
}: {
  heading?: string;
  description: string;
  images: [{ src: string; alt: string }, { src: string; alt: string }];
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

        <div className="mt-14 grid gap-8 sm:grid-cols-2">
          <div className="relative aspect-square w-full overflow-hidden rounded-2xl">
            <Image
              src={images[0].src}
              alt={images[0].alt}
              fill
              sizes="(min-width: 640px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="relative aspect-square w-full overflow-hidden rounded-2xl sm:mt-20">
            <Image
              src={images[1].src}
              alt={images[1].alt}
              fill
              sizes="(min-width: 640px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
