import type { Metadata } from "next";
import { Bangers, Inter } from "next/font/google";
import "./globals.css";

const bangers = Bangers({
  variable: "--font-display",
  weight: "400",
  subsets: ["latin", "latin-ext"],
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin", "latin-ext"],
});

export const metadata: Metadata = {
  title: "Tobio Sushi — Sigulda & Cēsis",
  description:
    "Svaigs suši, gatavots ar sirdi. Tobio suši bāri Siguldā un Cēsīs — svaigi roll'i, nigiri, poke bowls un piegāde.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="lv"
      className={`${bangers.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-cream text-jungle font-body">
        {children}
      </body>
    </html>
  );
}
