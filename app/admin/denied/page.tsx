import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminDeniedPage() {
  return (
    <main className="page-container admin-auth-page">
      <p className="eyebrow">Private Area</p>
      <h1>Access denied</h1>
      <p>Your Google account is signed in, but it is not on the Spirit &amp; Life administrator allowlist.</p>
      <p>
        <Link className="button button-secondary" href="/api/auth/signout?callbackUrl=%2Fadmin%2Fsignin">
          Sign out
        </Link>
      </p>
      <p className="quiet-note">
        <Link href="/">Return to public website</Link>
      </p>
    </main>
  );
}
