export default function CoordinatedDelivery() {
  return (
    <section className="theme-bg theme-fg w-full pt-0 pb-20 lg:pb-28">
      <div className="container-fluid">
        <div className="border-b pb-12 lg:pb-16" style={{ borderColor: "color-mix(in srgb, var(--theme-fg) 20%, transparent)" }}>
          <div className="mb-8 lg:mb-12">
            <p className="text-primary font-semibold text-sm tracking-wide uppercase">
              Practice Areas
            </p>
          </div>

          <div className="grid gap-12 lg:grid-cols-2 lg:items-start lg:gap-16">
            <div>
              <h2 className="text-secondary text-3xl leading-tight font-semibold sm:text-4xl lg:text-5xl">
                One coordinated delivery plan, from discovery through implementation.
              </h2>
            </div>

            <div className="flex flex-col gap-8">
              <p className="text-lg leading-8 opacity-90">
                Growthpad coordinates the capabilities required to resolve a market decision, strengthen communication, deliver a usable digital service or build a learning and evidence system. Agreed workstreams operate under one delivery plan from discovery through implementation, measurement and improvement.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
