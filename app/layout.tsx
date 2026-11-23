import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Header } from "@/components/site/Header";
import { Footer, WhatsAppBar } from "@/components/site/Footer";
import { RouteCurtain } from "@/components/site/RouteCurtain";
import { SmoothScroll } from "@/components/site/SmoothScroll";
import { RevealObserver } from "@/components/ui/RevealObserver";
import { site } from "@/lib/data/site";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: { default: `${site.name} — Premium teacup puppies in Dubai`, template: `%s | ${site.name}` },
  description: site.description,
  openGraph: {
    title: `${site.name} — Premium teacup puppies in Dubai`,
    description: site.description,
    images: [site.logo],
  },
  icons: { icon: site.logo, apple: site.logo },
};

export const viewport: Viewport = { themeColor: "#fffdf8" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <RouteCurtain />
        <a href="#main" className="sr-only-focusable fixed top-4 left-4 z-[100] rounded-full bg-cocoa px-5 py-3 font-semibold text-milk">
          Skip to content
        </a>
        <Header />
        <main id="main" tabIndex={-1} className="relative pt-[var(--header-h)] outline-none">
          {children}
        </main>
        <Footer />
        <WhatsAppBar />
        <SmoothScroll />
        <RevealObserver />
      </body>
    </html>
  );
}
