import Image from "next/image";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { footerLinks } from "@/shared/layouts/nav";

function FlagTooltip({
  city,
  flag,
  alt,
}: {
  city: string;
  flag: string;
  alt: string;
}) {
  return (
    <span className="group relative inline-block">
      <span className="cursor-default underline decoration-white/30 decoration-dotted underline-offset-4">
        {city}
      </span>
      <span
        style={{ transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)" }}
        className="pointer-events-none absolute bottom-full left-1/2 mb-2 flex -translate-x-1/2 translate-y-2 scale-90 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:scale-100 group-hover:opacity-100"
      >
        <Image
          src={flag}
          alt={alt}
          width={32}
          height={22}
          unoptimized
          className="rounded-sm shadow-lg shadow-black/40"
        />
      </span>
    </span>
  );
}

export default function Footer() {
  return (
    <footer className="bg-secondary relative w-full py-16 lg:pt-20 lg:pb-10">
      <div
        className="absolute top-0 bottom-0 left-0 hidden w-24 bg-repeat-y sm:block"
        style={{ backgroundImage: "url(/assets/images/footer-bg.png)" }}
      />

      <div className="container-fluid relative">
        <div className="grid gap-16 lg:grid-cols-2 lg:items-start">
          <div>
            <div className="flex flex-wrap items-center gap-x-1 gap-y-2">
              {footerLinks.map((link, index) => (
                <span key={link.href + link.label} className="flex items-center">
                  {index > 0 && <span className="text-white/30 mr-1">|</span>}
                  <Link
                    href={link.href}
                    className="font-display text-lg font-bold text-white transition-colors hover:text-primary sm:text-xl"
                  >
                    {link.label}
                  </Link>
                </span>
              ))}
            </div>

            <address className="mt-8 text-lg leading-8 text-white/70 not-italic">
              7th Floor, Mitsumi Business Park,
              <br />
              Westlands – Nairobi, Kenya
              <br />
              P.O. Box 1093-00606
            </address>

            <a
              href="https://www.linkedin.com/company/growthpad-consulting"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-10 inline-flex items-center gap-3 rounded-full bg-[#0A66C2] py-3 pr-6 pl-3 text-base font-semibold text-white transition-colors hover:bg-[#0A66C2]/90"
            >
              <Icon icon="mdi:linkedin" width={24} height={24} />
              Connect with us on Linkedin
            </a>
          </div>

          <div className="hidden w-full max-w-xl -translate-y-28 justify-self-end lg:block">
            <Image
              src="/assets/images/footer-image.png"
              alt=""
              width={602}
              height={340}
              sizes="(min-width: 1024px) 35vw, 100vw"
              className="h-auto w-full"
            />
          </div>
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center lg:mt-16">
          <p className="text-sm text-white/80">
            © {new Date().getFullYear()} Growthpad Consulting Group. Made
            with ♡ in{" "}
            <FlagTooltip
              city="Nairobi"
              flag="/assets/images/kenya-flag.gif"
              alt="Kenya flag"
            />{" "}
            x{" "}
            <FlagTooltip
              city="Accra"
              flag="/assets/images/ghana-flag.gif"
              alt="Ghana flag"
            />
            {" | "}
            <Link
              href="/privacy-policy"
              className="underline hover:text-primary transition-colors"
            >
              Privacy Policy
            </Link>
          </p>

          <Image
            src="/assets/images/gcg_logo_tagline_white.svg"
            alt="Growthpad Consulting Group — Impact that Matters."
            width={257}
            height={47}
            className="h-12 w-auto"
          />
        </div>
      </div>
    </footer>
  );
}
