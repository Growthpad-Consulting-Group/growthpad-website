import Navbar from "@/shared/layouts/Navbar";
import ConditionalFooter from "@/shared/layouts/ConditionalFooter";
import ScrollToTop from "@/shared/layouts/ScrollToTop";

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />
      {children}
      <ConditionalFooter />
      <ScrollToTop />
    </>
  );
}
