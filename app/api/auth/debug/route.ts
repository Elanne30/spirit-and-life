import { NextResponse } from "next/server";

export async function GET() {
  const clientId = process.env.GOOGLE_CLIENT_ID ?? "";
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET ?? "";

  return NextResponse.json({
    clientIdPresent: Boolean(clientId),
    clientIdLength: clientId.length,
    clientIdLooksLikeGoogleClientId:
      clientId.endsWith(".apps.googleusercontent.com"),
    clientSecretPresent: Boolean(clientSecret),
    clientSecretLength: clientSecret.length,
  });
}
