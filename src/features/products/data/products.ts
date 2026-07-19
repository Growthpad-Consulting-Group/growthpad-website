export type Product = {
  badge: string;
  title: string;
  description: string;
  features: string[];
  benefits: string;
  logo?: string;
};

export const products: Product[] = [
  {
    badge: "SqillSuite LMS",
    title: "Empower Your Workforce with Smarter Learning",
    description:
      "Transform your workforce with SqillSuite LMS, a customizable Learning Management System designed to enhance productivity through targeted training programs. Whether on-site or remote, provide your team with accessible, personalized learning paths. Track progress in real-time and unlock growth by equipping your employees with future-ready skills.",
    features: [
      "Personalized learning journeys",
      "Real-time performance tracking",
      "Mobile-friendly access anytime, anywhere",
    ],
    benefits:
      "Maximize team efficiency, close skills gaps, and foster continuous learning.",
    logo: "/assets/images/brands/sqillsuite.svg",
  },
  {
    badge: "Pine Market Intelligence",
    title: "Seamlessly Navigate Global Markets",
    description:
      "Expand your business with Pine Market Intelligence, a comprehensive solution that provides actionable insights and support for managing international trade. From compliance monitoring to customer acquisition, Pine enables you to grow beyond borders with ease and confidence.",
    features: [
      "Real-time market intelligence",
      "Trade compliance support",
      "Customer acquisition tools tailored to new markets",
    ],
    benefits:
      "Minimize risks, streamline operations, and accelerate your global growth strategy.",
    logo: "/assets/images/brands/pine-logo.svg",
  },
];
