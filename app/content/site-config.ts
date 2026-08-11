function resolveSiteUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return process.env.NODE_ENV === "development" ? "http://localhost:3000" : "http://localhost:3000";
}

export const siteConfig = {
  name: "Spirit & Life",
  description: "Thoughtful Christian reading, reflection, and study.",
  url: resolveSiteUrl(),
  brand: {
    logo: "/images/brand/spirit-and-life-logo-transparent.png.png",
  },
  contact: {
    email: null,
  },
  newsletter: {
    provider: null,
    signupEndpoint: null,
  },
} as const;
