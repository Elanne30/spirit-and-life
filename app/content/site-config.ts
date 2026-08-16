function resolveSiteUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

const emailProvider = process.env.RESEND_API_KEY ? "Resend" : process.env.BREVO_API_KEY ? "Brevo" : null;

export const siteConfig = {
  name: "Spirit & Life",
  description: "Thoughtful Christian reading, reflection, and study.",
  url: resolveSiteUrl(),
  brand: { logo: "/images/brand/spirit-and-life-logo-transparent.png.png" },
  contact: {
    email: process.env.CONTACT_TO_EMAIL?.trim() || null,
  },
  newsletter: {
    provider: emailProvider,
    signupEndpoint: "/api/newsletter/subscribe",
  },
} as const;
