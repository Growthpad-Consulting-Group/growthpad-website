import Navbar from "@/shared/layouts/Navbar";
import Footer from "@/shared/layouts/Footer";
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
      <Footer />
      <ScrollToTop />
    </>
  );
}
