import type { Metadata } from "next";
import { siteConfig } from "@/app/content/site-config";

export const socialPreviewImage = "/images/social-image/social-image-logo.jpg";

export function pageMetadata(title: string, description: string, path: string, image = socialPreviewImage): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      type: "website",
      url: path,
      images: [{ url: image, width: 1280, height: 512, alt: title }],
    },
    twitter: { card: "summary_large_image", images: [image] },
  };
}

export function articleMetadata(title: string, description: string, path: string, image = socialPreviewImage): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      type: "article",
      url: path,
      images: [{ url: image, width: 1280, height: 512, alt: title }],
    },
    twitter: { card: "summary_large_image", images: [image] },
  };
}

export function articleStructuredData({
  title,
  description,
  path,
  image,
  date,
}: {
  title: string;
  description: string;
  path: string;
  image: string;
  date: string;
}) {
  const parsedDate = new Date(date);

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    mainEntityOfPage: new URL(path, siteConfig.url).toString(),
    image: new URL(image, siteConfig.url).toString(),
    ...(Number.isNaN(parsedDate.getTime()) ? {} : { datePublished: parsedDate.toISOString() }),
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
    },
  };
}
