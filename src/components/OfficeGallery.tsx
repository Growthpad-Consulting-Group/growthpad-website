import Image from "next/image";

type GalleryItem = {
  src: string;
  alt: string;
  caption: string;
};

const items: GalleryItem[] = [
  {
    src: "/assets/images/a-team.png",
    alt: "The Growthpad team celebrating together",
    caption: "Meet the A team.",
  },
  {
    src: "/assets/images/stunning-environment.png",
    alt: "An innovative, creative office workspace",
    caption: "A stunning environment designed to fuel creativity.",
  },
  {
    src: "/assets/images/exuding-warmth.png",
    alt: "A warm, welcoming office lounge",
    caption: "Exuding warmth and hospitality.",
  },
];

export default function OfficeGallery() {
  return (
    <section
      data-theme-section="light"
      className="theme-bg relative w-full py-20 lg:py-28"
    >
      <div className="container-fluid">
        <h2 className="font-display theme-fg text-center text-4xl font-bold sm:text-5xl">
          Where all the
          <br />
          magic happens!
        </h2>

        <div className="mt-16 grid gap-10 lg:grid-cols-3 lg:gap-8">
          {items.map((item, index) => {
            // Middle column staggers: caption first, then image — the
            // outer two lead with the image, caption below.
            const isOffset = index === 1;

            return (
              <div
                key={item.src}
                className={`flex flex-col gap-6 ${isOffset ? "lg:mt-16 lg:flex-col-reverse" : ""}`}
              >
                <div className="relative aspect-359/216 w-full overflow-hidden rounded-3xl">
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    sizes="(min-width: 1024px) 33vw, 100vw"
                    className="object-cover"
                  />
                </div>

                <p className="theme-fg text-center text-lg font-bold sm:text-xl">
                  {item.caption}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
