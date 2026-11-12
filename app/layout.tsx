import type { Metadata, Viewport } from "next";
import "./globals.css";
import Footer from "@/components/footer";
import Navbar from "@/components/Navbar";
import { Instrument_Serif, Instrument_Sans } from "next/font/google";
import DeferredAnalytics from "@/components/deferred-analytics";
import { ThemeProvider } from "@/components/theme-provider";
import { LazyChatbot, LazyFractalTree } from "@/components/lazy-widgets";
import { SITE_NAME, SITE_SHORT_NAME, SITE_URL } from "@/lib/site";

const instrumentSerif = Instrument_Serif({
  weight: ["400"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-serif",
});

const instrumentSans = Instrument_Sans({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: SITE_NAME, template: `%s | ${SITE_SHORT_NAME}` },
  description:
    "Backend and applied AI engineer. I build services in Rust and Go that don't fall over, AI tools that run in production, and the frontends to go with them.",
  openGraph: {
    title: SITE_NAME,
    description: "Backend and applied AI engineer building Rust and Go services that don't fall over, and AI tools that run in production.",
    url: SITE_URL,
    siteName: "Kunal's Portfolio",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: "Backend and applied AI engineer building Rust and Go services that don't fall over, and AI tools that run in production.",
    creator: "@kunalgoesbyken",
  },
};

export const viewport: Viewport = {
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafafa" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${instrumentSerif.variable} ${instrumentSans.variable} bg-surface text-fg antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <DeferredAnalytics />
          <LazyFractalTree />
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <LazyChatbot />
        </ThemeProvider>
      </body>
    </html>
  );
}
