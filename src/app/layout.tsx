import type { Metadata, Viewport } from "next";
import { Montserrat, Permanent_Marker } from "next/font/google";
import { BasketProvider } from "@/components/BasketProvider";
import { BasketDrawer } from "@/components/BasketDrawer";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Toasts } from "@/components/Toasts";
import { getStore } from "@/lib/catalog";
import { KEYWORDS, SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";
import "./globals.css";

// Variable font: one file per style covers every weight (much lighter than 12 static files).
const mont = Montserrat({ subsets: ["latin"], display: "swap", style: ["normal", "italic"], variable: "--font-mont" });
const marker = Permanent_Marker({ subsets: ["latin"], display: "swap", weight: "400", variable: "--font-marker" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `${SITE_NAME} | FiveM Roleplay Server`, template: `%s | ${SITE_NAME}` },
  description: SITE_DESCRIPTION,
  keywords: KEYWORDS,
  applicationName: SITE_NAME,
  alternates: { canonical: "/" },
  openGraph: { type: "website", siteName: SITE_NAME, locale: "en_GB", url: "/", title: `${SITE_NAME} | FiveM Roleplay Server`, description: SITE_DESCRIPTION },
  twitter: { card: "summary_large_image", title: `${SITE_NAME} | FiveM Roleplay Server`, description: SITE_DESCRIPTION },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = { themeColor: "#030503" };

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const art: Record<number, string | null> = {};
  try {
    const store = await getStore();
    store.categories.forEach((c) => c.packages.forEach((p) => (art[p.id] = p.art)));
  } catch {
    // Drawer falls back to Tebex images.
  }

  return (
    <html lang="en-GB" className={`${mont.variable} ${marker.variable}`}>
      <body className="min-h-dvh font-sans">
        <BasketProvider>
          <Header />
          <main>{children}</main>
          <Footer />
          <BasketDrawer artByPackage={art} />
          <Toasts />
        </BasketProvider>
      </body>
    </html>
  );
}
