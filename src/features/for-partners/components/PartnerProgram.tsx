import Image from "next/image";

export default function PartnerProgram() {
  return (
    <section
      data-theme-section="dark"
      className="theme-bg relative w-full py-20 lg:py-28"
    >
      <div className="container-fluid flex flex-col gap-16">
        <div className="flex max-w-3xl flex-col gap-4">
          <span className="text-primary text-lg font-bold">
            Partner Program
          </span>
          <h2 className="font-display theme-fg text-4xl leading-tight font-light sm:text-5xl">
            Let&apos;s unlock the full potential of businesses in Africa,
            together.
          </h2>
        </div>

        <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
          <div className="relative aspect-500/273 w-full overflow-hidden rounded-3xl">
            <Image
              src="/assets/images/partner-handshake.png"
              alt="Growthpad partners shaking hands"
              fill
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="object-cover"
            />
          </div>

          <div className="theme-fg flex flex-col gap-6 text-lg leading-8 opacity-80 lg:pl-8">
            <p>
              If you&apos;re a consultant, advisor, or evangelist looking to
              connect clients and prospects with a best-in-class professional
              services firm — this is the program for you.
            </p>
            <p>
              Not only will you receive all the perks listed below, but
              you&apos;ll also connect with our team of success experts to
              ensure a seamless exchange with each customer.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
