import Image from "next/image";

export default function ImpactSection() {
  return (
    <section
      data-theme-section="dark"
      className="theme-bg relative w-full py-20 lg:py-28"
    >
      <div className="container-fluid grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div className="flex flex-col gap-6">
          <h2 className="font-display text-primary text-3xl font-bold sm:text-4xl">
            Let&apos;s Create Impact That Matters
          </h2>

          <div className="theme-fg flex flex-col gap-4 text-lg leading-8 opacity-70">
            <p>
              Whether you&apos;re looking to, enhance your communications,
              organize memorable events, transform your digital presence, or
              develop cutting-edge technology solutions, we&apos;re here to
              help.
            </p>
            <p>
              Our team of experts is ready to understand your needs and
              craft solutions that drive real results.
            </p>
          </div>
        </div>

        <div className="relative mx-auto aspect-500/273 w-full max-w-md">
          <Image
            src="/assets/images/partner-handshake.png"
            alt="Growthpad partners shaking hands"
            fill
            sizes="(min-width: 1024px) 40vw, 100vw"
            className="object-contain"
          />
        </div>
      </div>
    </section>
  );
}
