import { NextResponse } from "next/server";
import { subscribeToNewsletter } from "@/app/lib/newsletter";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { email?: unknown };
    const email = typeof body.email === "string" ? body.email : "";
    const result = await subscribeToNewsletter(email);
    return NextResponse.json(result, { status: result.status === "success" ? 200 : 400 });
  } catch {
    return NextResponse.json(
      { status: "error", message: "Subscription is unavailable right now. Please try again." },
      { status: 500 },
    );
  }
}
