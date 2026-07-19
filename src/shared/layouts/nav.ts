export type NavLink = {
  label: string;
  href: string;
};

export const navLinks: NavLink[] = [
  { label: "Our DNA", href: "/our-dna" },
  { label: "Services", href: "/services" },
  { label: "Products", href: "/products" },
  { label: "For Partners", href: "#for-partners" },
  { label: "Case Studies", href: "#case-studies" },
  { label: "Careers", href: "#careers" },
  { label: "Contact us", href: "#contact" },
];

// TODO: these pages don't exist yet — swap in real routes once built.
export const footerLinks: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Trainings", href: "#" },
  { label: "Careers", href: "#" },
  { label: "Blog", href: "#" },
  { label: "Tenders", href: "#" },
];
