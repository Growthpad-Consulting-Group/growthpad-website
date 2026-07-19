"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Icon } from "@iconify/react";
import ArrowGroup from "@/shared/components/ArrowGroup";
import CtaButton from "@/shared/components/CtaButton";
import NotchPlaceholder from "@/features/products/components/NotchPlaceholder";
import { products } from "@/features/products/data/products";

export default function ProductShowcase() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".product-row").forEach((row) => {
        gsap.fromTo(
          row,
          { y: 40, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: row,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          },
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      data-theme-section="light"
      className="theme-bg relative w-full py-20 lg:py-28"
    >
      <div className="container-fluid flex flex-col gap-20 lg:gap-28">
        {products.map((product, i) => {
          const reversed = i % 2 === 0;

          return (
            <div
              key={product.badge}
              className={`product-row grid items-center gap-12 opacity-0 lg:grid-cols-2 lg:gap-16 ${
                reversed ? "lg:[&>*:first-child]:order-2" : ""
              }`}
            >
              <div className="group relative w-full max-w-lg transition-all duration-700 ease-out hover:-translate-y-2 hover:scale-[0.98]">
                <NotchPlaceholder className="transition-all duration-700 ease-out group-hover:drop-shadow-[0_25px_45px_rgba(240,93,35,0.28)]" />
                {product.logo && (
                  <Image
                    src={product.logo}
                    alt={product.badge}
                    fill
                    sizes="(min-width: 1024px) 32rem, 100vw"
                    className="object-contain p-16 grayscale transition-all duration-700 ease-out group-hover:grayscale-0"
                  />
                )}
              </div>

              <div className="theme-fg flex flex-col gap-6">
                <span className="text-primary text-lg font-bold">
                  {product.badge}
                </span>

                <h2 className="font-display text-3xl leading-tight font-bold sm:text-4xl">
                  {product.title}
                </h2>

                <p className="max-w-xl text-base leading-8 opacity-80">
                  {product.description}
                </p>

                <ul className="flex flex-col gap-4">
                  {product.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-4">
                      <span className="bg-primary flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-white">
                        <Icon icon="ci:check" width={16} height={16} />
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>

                <p className="text-base">
                  <span className="font-bold">Benefits:</span>{" "}
                  {product.benefits}
                </p>

                <CtaButton
                  href="#contact"
                  circleClassName="bg-secondary text-white"
                  className="mt-2 self-start"
                >
                  Request a Demo
                </CtaButton>
              </div>
            </div>
          );
        })}
      </div>

      <ArrowGroup
        count={4}
        className="mt-20 ml-6 lg:mt-28 lg:ml-8"
      />
    </section>
  );
}
