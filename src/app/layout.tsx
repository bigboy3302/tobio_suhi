import type { Metadata } from "next";
import { Bangers, Inter } from "next/font/google";
import { LanguageProvider } from "@/lib/i18n";
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

const SITE_URL = "https://tobio-suhi.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Tobio Sushi — Sigulda & Cēsis",
    template: "%s | Tobio Sushi",
  },
  description:
    "Svaigs suši, gatavots ar sirdi. Tobio suši bāri Siguldā un Cēsīs — suši seti, ruļļi, nigiri un sushi burgeri. Pasūti pa telefonu vai Wolt lietotnē.",
  icons: { icon: "/icon.png" },
  openGraph: {
    type: "website",
    locale: "lv_LV",
    url: SITE_URL,
    siteName: "Tobio Sushi",
    title: "Tobio Sushi — Sigulda & Cēsis",
    description:
      "Svaigs suši, gatavots ar sirdi. Tobio suši bāri Siguldā un Cēsīs — suši seti, ruļļi, nigiri un sushi burgeri.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Tobio Sushi" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tobio Sushi — Sigulda & Cēsis",
    description: "Svaigs suši, gatavots ar sirdi. Siguldā un Cēsīs.",
    images: ["/og-image.jpg"],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="lv"
      className={`${bangers.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-cream text-jungle font-body">
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
