import type { Metadata } from "next";
import "./globals.css";
import Footer from "@/components/footer";
import Navbar from "@/components/Navbar";
import { Instrument_Serif, Instrument_Sans } from "next/font/google";
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from "@vercel/speed-insights/next"
import { ThemeProvider } from "@/components/theme-provider";
import ClientOnly from "@/components/client-only";
import FractalTree from "@/components/ui/fractal-tree";
import Chatbot from "@/components/chatbot";
import MotionProvider from "@/components/lazy-motion-provider";

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
  metadataBase: new URL("https://krockxz.com"),
  title: "Kunal",
  description:
    "Backend systems engineer building scalable systems, AI tools, and production-grade web apps.",
  openGraph: {
    title: "Kunal",
    description: "Backend systems architect. Rust and Go services at scale, and AI tools shipped to production.",
    url: "https://krockxz.com",
    siteName: "Kunal's Portfolio",
    images: [
      {
        url: "/images/kunal-sm.jpg",
        width: 800,
        height: 600,
        alt: "Kunal Roy Choudhury",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kunal ",
    description: "Backend systems architect building AI tools.",
    creator: "@kunalgoesbyken",
    images: ["/images/kunal-sm.jpg"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://github-contributions-api.jogruber.de" />
      </head>{/* 🛠 Important for dark mode */}
      <body
        suppressHydrationWarning
        className={`${instrumentSerif.variable} ${instrumentSans.variable} antialiased bg-neutral-50 dark:bg-neutral-950 transition-colors duration-300 [--pattern-fg:var(--color-neutral-200)] dark:[--pattern-fg:var(--color-neutral-700)]`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <MotionProvider>
          <Analytics />
          <SpeedInsights />
          <ClientOnly delay={2500}>
            <FractalTree />
          </ClientOnly>
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <ClientOnly>
            <Chatbot />
          </ClientOnly>
          </MotionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
