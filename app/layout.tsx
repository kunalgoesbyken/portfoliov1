import type { Metadata, Viewport } from "next";
import "./globals.css";
import Footer from "@/components/footer";
import Navbar from "@/components/Navbar";
import { Instrument_Serif, Instrument_Sans } from "next/font/google";
import DeferredAnalytics from "@/components/deferred-analytics";
import { ThemeProvider } from "@/components/theme-provider";
import { LazyChatbot, LazyFractalTree } from "@/components/lazy-widgets";
import MotionProvider from "@/components/lazy-motion-provider";
import { SITE_URL } from "@/lib/site";

const instrumentSerif = Instrument_Serif({
  weight: ["400"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-serif",
});

const instrumentSans = Instrument_Sans({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Kunal",
  description:
    "Backend systems engineer building scalable systems, AI tools, and production-grade web apps.",
  openGraph: {
    title: "Kunal Roy Choudhury",
    description: "Backend systems architect. Rust and Go services at scale, and AI tools shipped to production.",
    url: SITE_URL,
    siteName: "Kunal's Portfolio",
    images: [
      {
        url: "/images/og-home.png",
        width: 1200,
        height: 630,
        alt: "Kunal Roy Choudhury's portfolio: backend systems, Rust, Go and AI tools shipped to production",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kunal Roy Choudhury",
    description: "Backend systems architect. Rust and Go services at scale, and AI tools shipped to production.",
    creator: "@kunalgoesbyken",
    images: ["/images/og-home.png"],
  },
};

export const viewport: Viewport = {
  colorScheme: "light dark",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
      </head>{/* 🛠 Important for dark mode */}
      <body
        suppressHydrationWarning
        className={`${instrumentSerif.variable} ${instrumentSans.variable} antialiased bg-neutral-50 dark:bg-neutral-950 [--pattern-fg:var(--color-neutral-200)] dark:[--pattern-fg:var(--color-neutral-700)]`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <MotionProvider>
          <DeferredAnalytics />
          <LazyFractalTree />
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <LazyChatbot />
          </MotionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
