import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Everyday Tempo",
    template: "%s | Everyday Tempo",
  },
  description:
    "Explore wellness activities and the clubs that offer them, powered by Contentful and Next.js.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body>
        <header className="site-header">
          <Link href="/" className="brand" aria-label="Everyday Tempo home">
            <span className="brand-mark">ET</span>
            <span>Everyday Tempo</span>
          </Link>
          <nav aria-label="Primary navigation">
            <Link href="/#activities">Activities</Link>
            <Link href="/#clubs">Clubs</Link>
          </nav>
        </header>
        {children}
        <footer className="site-footer">
          <p>Built to learn Next.js + Contentful, one content model at a time.</p>
        </footer>
      </body>
    </html>
  );
}
