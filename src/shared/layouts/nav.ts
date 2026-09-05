export type NavLink = {
  label: string;
  href: string;
};

export const navLinks: NavLink[] = [
  { label: "Our DNA", href: "/our-dna" },
  { label: "Services", href: "/services" },
  { label: "Practice Areas", href: "/practice-areas" },
  { label: "For Partners", href: "/for-partners" },
  { label: "Case Studies", href: "/case-studies" },
  { label: "Careers", href: "/careers" },
  { label: "Contact us", href: "/contact" },
];

export const footerLinks: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Trainings", href: "/training" },
  { label: "Careers", href: "/careers" },
  { label: "Blog", href: "/blog" },
  { label: "Tenders", href: "/tenders" },
];
