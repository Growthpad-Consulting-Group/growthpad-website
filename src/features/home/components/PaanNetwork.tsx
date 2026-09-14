"use client";

import { useRef } from "react";
import Image from "next/image";
import CtaButton from "@/shared/components/CtaButton";
import { useCountAnimation } from "@/shared/hooks/useCountAnimation";

export default function PaanNetwork() {
  const firmsRef = useRef<HTMLParagraphElement>(null);
  const countriesRef = useRef<HTMLParagraphElement>(null);

  useCountAnimation(firmsRef, 200, 2.5);
  useCountAnimation(countriesRef, 23, 2.5);
  return (
    <section className="w-full py-20 lg:py-28" style={{ backgroundColor: "#172840", color: "#ffffff" }}>
      <div className="container-fluid">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
          {/* Left: Content */}
          <div className="flex flex-col gap-8">
            {/* Logos */}
            <div className="flex items-center gap-6">
              <Image
                src="/assets/images/paan-logo.svg"
                alt="PAAN Logo"
                width={180}
                height={0}
                className="h-auto"
              />
              <Image
                src="/assets/images/paan-badge.svg"
                alt="PAAN Member Badge"
                width={80}
                height={0}
                className="h-auto"
              />
            </div>

            {/* Description */}
            <p className="text-lg leading-8 text-white">
              Growthpad is a founding member of the Pan African Agency Network (PAAN), an alliance of over 200 firms spanning at least 23 African countries. Through PAAN, we give clients access to locally grounded expertise and coordinated delivery across multiple markets, without the complexity of sourcing and managing a separate partner in every country.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 sm:gap-8">
              <div className="flex flex-col gap-2">
                <p ref={firmsRef} className="text-2xl font-bold text-white sm:text-3xl lg:text-4xl">0</p>
                <p className="text-sm text-white/70 sm:text-base">Firms</p>
              </div>
              <div className="flex flex-col gap-2">
                <p ref={countriesRef} className="text-2xl font-bold text-white sm:text-3xl lg:text-4xl">0</p>
                <p className="text-sm text-white/70 sm:text-base">Countries</p>
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-2xl font-bold text-white sm:text-3xl lg:text-4xl">One</p>
                <p className="text-sm text-white/70 sm:text-base">delivery relationship</p>
              </div>
            </div>

            {/* CTA */}
            <CtaButton
              href="https://paan.africa/"
              circleClassName="bg-primary text-white"
            >
              Explore the PAAN network
            </CtaButton>
          </div>

          {/* Right: Map */}
          <div className="relative">
            <Image
              src="/assets/images/paan-map.svg"
              alt="PAAN Network Coverage Map"
              width={600}
              height={600}
              className="h-auto w-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
