import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import { Footer } from "@/app/components/footer";
import { Header } from "@/app/components/header";
import { ensurePublishingIntegrity } from "@/app/content/publishing-validation";
import { socialPreviewImage } from "@/app/content/seo";
import { siteConfig } from "@/app/content/site-config";
import "./globals.css";
import "./site-polish.css";

const displayFont = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const bodyFont = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  verification: {
    google: "6ctWZ9OfGvQWfPiPNwSedZE_UQqyq7jToJexeNyjz1U",
  },
  alternates: { canonical: "/" },
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    type: "website",
    siteName: siteConfig.name,
    images: [{ url: socialPreviewImage, width: 1280, height: 512, alt: "Spirit & Life social preview image" }],
  },
  twitter: { card: "summary_large_image", images: [socialPreviewImage] },
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  await ensurePublishingIntegrity();

  return (
    <html
      lang="en"
      className={`${displayFont.variable} ${bodyFont.variable}`}
      data-theme="dark"
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html:
              '(function(){try{var stored=localStorage.getItem("spirit-life-theme");var preferred=stored==="light"||stored==="dark"?stored:(window.matchMedia&&window.matchMedia("(prefers-color-scheme: light)").matches?"light":"dark");document.documentElement.setAttribute("data-theme",preferred);document.documentElement.style.colorScheme=preferred}catch(e){}})()',
          }}
        />
      </head>
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
