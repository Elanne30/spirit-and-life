export const siteConfig = {
  name: "Spirit & Life",
  description: "Thoughtful Christian reading, reflection, and study.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
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
