import type { Metadata } from "next";

export const socialPreviewImage = "/images/social-image/social-image-logo.jpg";

export function pageMetadata(title: string, description: string, path: string): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      type: "website",
      url: path,
      images: [{ url: socialPreviewImage, width: 1280, height: 512, alt: "Spirit & Life social preview image" }],
    },
    twitter: { card: "summary_large_image", images: [socialPreviewImage] },
  };
}

export function articleMetadata(title: string, description: string, path: string): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      type: "article",
      url: path,
      images: [{ url: socialPreviewImage, width: 1280, height: 512, alt: "Spirit & Life social preview image" }],
    },
    twitter: { card: "summary_large_image", images: [socialPreviewImage] },
  };
}
