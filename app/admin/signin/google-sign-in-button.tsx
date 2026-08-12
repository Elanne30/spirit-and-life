"use client";

import { signIn } from "next-auth/react";

export function GoogleSignInButton() {
  return (
    <button className="button button-primary" type="button" onClick={() => signIn("google", { callbackUrl: "/admin" })}>
      Sign in with Google
    </button>
  );
}